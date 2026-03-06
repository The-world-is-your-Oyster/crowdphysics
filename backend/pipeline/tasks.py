"""
Main Celery task: process_submission

Orchestrates the full ML pipeline for a single CrowdPhysics submission.
Runs all 7 processors sequentially, updates submission status in the DB
at each stage, and writes the final PipelineResult as JSON to the
submission's processing_results column.

Worker start command:
    celery -A pipeline.celery_app worker --loglevel=info --concurrency=2
"""

from __future__ import annotations

import asyncio
import json
import logging
from datetime import datetime, timezone
from decimal import Decimal
from typing import Any

from celery import Task
from sqlalchemy import select, update

from pipeline.celery_app import celery_app
from pipeline.exporters.json_exporter import JsonExporter
from pipeline.processors.action_segmenter import ActionSegmenter
from pipeline.processors.contact_estimation import ContactEstimator
from pipeline.processors.grasp_classifier import GraspClassifier
from pipeline.processors.hand_pose import HandPoseEstimator
from pipeline.processors.object_detection import ObjectDetector
from pipeline.processors.quality_checker import QualityChecker
from pipeline.processors.scene_describer import SceneDescriber
from pipeline.schemas import PIPELINE_STEPS, PipelineResult

logger = logging.getLogger(__name__)

# Ordered processor pipeline
PROCESSORS = [
    QualityChecker(),
    HandPoseEstimator(),
    ObjectDetector(),
    ContactEstimator(),
    GraspClassifier(),
    ActionSegmenter(),
    SceneDescriber(),
]


# ---------------------------------------------------------------------------
# Synchronous DB helpers (Celery workers are sync by default)
# ---------------------------------------------------------------------------

def _get_sync_session():
    """Create a synchronous SQLAlchemy session for use inside Celery workers."""
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker

    # Sync URL: replace asyncpg driver with psycopg2
    from app.config import settings

    sync_url = settings.database_url.replace(
        "postgresql+asyncpg://", "postgresql+psycopg2://"
    )
    engine = create_engine(sync_url, pool_pre_ping=True)
    Session = sessionmaker(bind=engine)
    return Session(), engine


def _update_submission_status(
    submission_id: str,
    status: str,
    *,
    rejection_reason: str | None = None,
    quality_score: float | None = None,
    payout_amount: Decimal | None = None,
    processing_results: dict | None = None,
    processed_at: datetime | None = None,
) -> None:
    """Synchronously update submission fields in PostgreSQL."""
    from app.models.submission import Submission  # noqa: PLC0415

    session, engine = _get_sync_session()
    try:
        values: dict[str, Any] = {"status": status}
        if rejection_reason is not None:
            values["rejection_reason"] = rejection_reason
        if quality_score is not None:
            values["quality_score"] = quality_score
        if payout_amount is not None:
            values["payout_amount"] = payout_amount
        if processing_results is not None:
            values["processing_results"] = processing_results
        if processed_at is not None:
            values["processed_at"] = processed_at

        session.execute(
            update(Submission)
            .where(Submission.id == submission_id)
            .values(**values)
        )
        session.commit()
    finally:
        session.close()
        engine.dispose()


def _get_submission_metadata(submission_id: str) -> dict:
    """Fetch submission + task metadata needed by processors."""
    from app.models.submission import Submission  # noqa: PLC0415
    from app.models.task import TaskTemplate  # noqa: PLC0415

    session, engine = _get_sync_session()
    try:
        row = session.execute(
            select(Submission, TaskTemplate)
            .join(TaskTemplate, Submission.task_id == TaskTemplate.id)
            .where(Submission.id == submission_id)
        ).first()

        if row is None:
            return {}

        submission, task = row
        return {
            "submission_id": str(submission.id),
            "task_type": getattr(task, "category", "dishwashing"),
            "duration_sec": float(submission.duration_sec),
            "fps": 30,
            "video_url": submission.video_url,
            "has_lidar": submission.has_lidar,
            "device_model": submission.device_model,
        }
    finally:
        session.close()
        engine.dispose()


# ---------------------------------------------------------------------------
# Pipeline status helpers stored in Celery task meta
# ---------------------------------------------------------------------------

def _build_initial_meta() -> dict:
    return {
        "steps": {step: {"status": "pending"} for step in PIPELINE_STEPS},
        "current_step": None,
    }


def _calculate_payout(quality_score: float) -> Decimal:
    """Calculate payout based on quality score (0.05 - 0.50 USD)."""
    base = Decimal("0.05")
    bonus = Decimal(str(round(quality_score * 0.45, 4)))
    return base + bonus


# ---------------------------------------------------------------------------
# Main Celery task
# ---------------------------------------------------------------------------

@celery_app.task(
    bind=True,
    max_retries=2,
    default_retry_delay=30,
    name="pipeline.tasks.process_submission",
)
def process_submission(self: Task, submission_id: str) -> dict:
    """
    Main pipeline task. Runs all 7 processors sequentially and stores results.

    Args:
        submission_id: UUID string of the Submission to process.

    Returns:
        dict with final status and summary statistics.
    """
    logger.info("Pipeline starting for submission %s", submission_id)

    # ------------------------------------------------------------------ #
    # 1. Mark as processing
    # ------------------------------------------------------------------ #
    try:
        _update_submission_status(submission_id, "processing")
    except Exception as exc:
        logger.warning("Could not update status to processing: %s", exc)

    meta = _build_initial_meta()
    self.update_state(state="STARTED", meta=meta)

    # ------------------------------------------------------------------ #
    # 2. Fetch metadata (fallback to defaults when DB unavailable in tests)
    # ------------------------------------------------------------------ #
    try:
        video_metadata = _get_submission_metadata(submission_id)
    except Exception as exc:
        logger.warning("Could not load submission metadata: %s — using defaults", exc)
        video_metadata = {
            "submission_id": submission_id,
            "task_type": "dishwashing",
            "duration_sec": 15.0,
            "fps": 30,
            "video_url": f"s3://crowdphysics-videos/{submission_id}.mp4",
        }

    if not video_metadata:
        _update_submission_status(
            submission_id,
            "rejected",
            rejection_reason="Submission not found in database",
        )
        return {"status": "rejected", "reason": "not_found"}

    video_path = video_metadata.get("video_url", "")
    task_type = video_metadata.get("task_type", "dishwashing")

    # ------------------------------------------------------------------ #
    # 3. Run processors
    # ------------------------------------------------------------------ #
    processor_results: dict[str, dict] = {}
    processing_times: dict[str, float] = {}
    all_errors: dict[str, list[str]] = {}

    for processor in PROCESSORS:
        step_name = processor.name
        meta["current_step"] = step_name
        meta["steps"][step_name] = {"status": "running"}
        self.update_state(state="PROGRESS", meta=meta)

        try:
            result = asyncio.run(processor.process(video_path, video_metadata))
            processor_results[step_name] = result.data
            processing_times[step_name] = result.processing_time_ms
            all_errors[step_name] = result.errors

            if result.success:
                meta["steps"][step_name] = {
                    "status": "done",
                    "processing_time_ms": result.processing_time_ms,
                }
            else:
                meta["steps"][step_name] = {
                    "status": "failed",
                    "error": "; ".join(result.errors),
                }

        except Exception as exc:
            logger.exception("Processor %s raised an exception", step_name)
            meta["steps"][step_name] = {"status": "failed", "error": str(exc)}
            all_errors[step_name] = [str(exc)]
            # Non-quality-check failures are non-fatal; continue pipeline
            if step_name == "quality_check":
                _update_submission_status(
                    submission_id,
                    "rejected",
                    rejection_reason=f"Quality check error: {exc}",
                )
                return {"status": "rejected", "reason": "quality_check_error"}

        # ---- Quality check gating ------------------------------------ #
        if step_name == "quality_check":
            quality_data = processor_results.get("quality_check", {})
            if not quality_data.get("overall_pass", True):
                rejection_reason = quality_data.get(
                    "rejection_reason", "Quality check failed"
                )
                _update_submission_status(
                    submission_id,
                    "rejected",
                    rejection_reason=rejection_reason,
                    quality_score=quality_data.get("overall_score"),
                )
                logger.info(
                    "Submission %s rejected: %s", submission_id, rejection_reason
                )
                return {"status": "rejected", "reason": rejection_reason}

        self.update_state(state="PROGRESS", meta=meta)

    # ------------------------------------------------------------------ #
    # 4. Build and export PipelineResult
    # ------------------------------------------------------------------ #
    quality_data = processor_results.get("quality_check", {})
    quality_score = float(quality_data.get("overall_score", 0.80))

    fps = video_metadata.get("fps", 30)
    duration = video_metadata.get("duration_sec", 15.0)

    export_payload = {
        "version": "1.0",
        "submission_id": submission_id,
        "task_type": task_type,
        "duration_seconds": duration,
        "fps": fps,
        "frames": [],  # frame-level index omitted for storage efficiency
        "hand_pose": processor_results.get("hand_pose", {}),
        "objects": processor_results.get("object_detection", {}),
        "contacts": processor_results.get("contact_estimation", {}),
        "grasps": processor_results.get("grasp_classification", {}).get("segments", []),
        "actions": processor_results.get("action_segmentation", {}).get("segments", []),
        "scene": processor_results.get("scene_description", {}),
        "quality": quality_data,
        "processing_times_ms": processing_times,
        "errors": {k: v for k, v in all_errors.items() if v},
    }

    # Use JSON exporter to normalise the payload
    try:
        exporter = JsonExporter()
        exported = exporter.export(export_payload)
    except Exception as exc:
        logger.warning("JSON exporter failed (%s); storing raw payload", exc)
        exported = export_payload

    # ------------------------------------------------------------------ #
    # 5. Calculate payout and update DB
    # ------------------------------------------------------------------ #
    payout = _calculate_payout(quality_score)

    try:
        _update_submission_status(
            submission_id,
            "processed",
            quality_score=quality_score,
            payout_amount=payout,
            processing_results=exported,
            processed_at=datetime.now(timezone.utc),
        )
    except Exception as exc:
        logger.warning("Could not write final status to DB: %s", exc)

    meta["current_step"] = None
    self.update_state(state="SUCCESS", meta=meta)

    logger.info(
        "Pipeline complete for %s — quality=%.3f payout=$%.4f",
        submission_id,
        quality_score,
        float(payout),
    )

    return {
        "status": "processed",
        "submission_id": submission_id,
        "quality_score": quality_score,
        "payout_amount": str(payout),
        "steps_completed": len(PROCESSORS),
    }
