"""
Pipeline API Router

Endpoints:
  POST /api/submissions/{id}/process          — trigger Celery pipeline
  GET  /api/submissions/{id}/pipeline-status  — poll processing progress
  GET  /api/submissions/{id}/results          — fetch full structured results
"""

from __future__ import annotations

from typing import Any, Optional
from uuid import UUID

from celery.result import AsyncResult
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.submission import Submission
from app.models.user import User
from app.services.auth_service import get_current_user
from pipeline.celery_app import celery_app
from pipeline.schemas import PIPELINE_STEPS, PipelineStatus, StepStatus

router = APIRouter(prefix="/api/submissions", tags=["pipeline"])


# ---------------------------------------------------------------------------
# Response models
# ---------------------------------------------------------------------------

class TriggerResponse(BaseModel):
    submission_id: str
    celery_task_id: str
    message: str


class PipelineStatusResponse(BaseModel):
    submission_id: str
    celery_task_id: Optional[str]
    overall_status: str
    current_step: Optional[str]
    steps: list[StepStatus]
    started_at: Optional[str] = None
    completed_at: Optional[str] = None


class PipelineResultsResponse(BaseModel):
    submission_id: str
    status: str
    quality_score: Optional[float]
    payout_amount: Optional[str]
    results: Optional[dict]


# ---------------------------------------------------------------------------
# Helper: fetch submission or 404
# ---------------------------------------------------------------------------

async def _get_submission_or_404(
    submission_id: UUID,
    db: AsyncSession,
) -> Submission:
    result = await db.execute(
        select(Submission).where(Submission.id == submission_id)
    )
    sub = result.scalar_one_or_none()
    if sub is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Submission not found",
        )
    return sub


# ---------------------------------------------------------------------------
# POST /api/submissions/{id}/process
# ---------------------------------------------------------------------------

@router.post(
    "/{submission_id}/process",
    response_model=TriggerResponse,
    status_code=status.HTTP_202_ACCEPTED,
    summary="Trigger ML processing pipeline for a submission",
)
async def trigger_pipeline(
    submission_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> TriggerResponse:
    """
    Enqueue the submission for ML processing via Celery.

    The submission must be in 'uploaded' or 'uploading' status.
    Returns 202 Accepted with the Celery task ID for status polling.
    """
    sub = await _get_submission_or_404(submission_id, db)

    if sub.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not your submission",
        )

    if sub.status == "processing":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Submission is already being processed",
        )

    if sub.status in ("processed", "accepted"):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Submission already has status '{sub.status}'",
        )

    # Dispatch Celery task
    task: AsyncResult = celery_app.send_task(
        "pipeline.tasks.process_submission",
        args=[str(submission_id)],
    )

    # Store celery task ID in processing_results for later polling
    sub.processing_results = {
        **(sub.processing_results or {}),
        "_celery_task_id": task.id,
    }
    sub.status = "processing"
    await db.commit()

    return TriggerResponse(
        submission_id=str(submission_id),
        celery_task_id=task.id,
        message="Pipeline enqueued. Poll /pipeline-status for progress.",
    )


# ---------------------------------------------------------------------------
# GET /api/submissions/{id}/pipeline-status
# ---------------------------------------------------------------------------

@router.get(
    "/{submission_id}/pipeline-status",
    response_model=PipelineStatusResponse,
    summary="Get step-by-step processing progress",
)
async def get_pipeline_status(
    submission_id: UUID,
    db: AsyncSession = Depends(get_db),
) -> PipelineStatusResponse:
    """
    Returns current pipeline progress including per-step status.

    The `steps` list always contains all 7 pipeline steps with their
    individual status: pending | running | done | failed.
    """
    sub = await _get_submission_or_404(submission_id, db)

    processing_results: dict[str, Any] = sub.processing_results or {}
    celery_task_id: Optional[str] = processing_results.get("_celery_task_id")

    # Build default step list
    steps = [
        StepStatus(step=s, status="pending") for s in PIPELINE_STEPS
    ]
    current_step: Optional[str] = None

    # Enrich from Celery task state if we have a task ID
    if celery_task_id:
        task_result = AsyncResult(celery_task_id, app=celery_app)
        celery_state = task_result.state  # PENDING/STARTED/PROGRESS/SUCCESS/FAILURE

        if celery_state in ("STARTED", "PROGRESS") and isinstance(task_result.info, dict):
            meta = task_result.info
            current_step = meta.get("current_step")
            steps_meta: dict[str, dict] = meta.get("steps", {})

            steps = [
                StepStatus(
                    step=s,
                    status=steps_meta.get(s, {}).get("status", "pending"),
                    processing_time_ms=steps_meta.get(s, {}).get("processing_time_ms"),
                    error=steps_meta.get(s, {}).get("error"),
                )
                for s in PIPELINE_STEPS
            ]

        elif celery_state == "SUCCESS":
            steps = [
                StepStatus(step=s, status="done") for s in PIPELINE_STEPS
            ]

        elif celery_state == "FAILURE":
            steps = [
                StepStatus(step=PIPELINE_STEPS[0], status="failed", error=str(task_result.info)),
                *[StepStatus(step=s, status="pending") for s in PIPELINE_STEPS[1:]],
            ]

    # Map DB status to overall pipeline status
    overall = sub.status if sub.status in (
        "pending", "processing", "processed", "rejected", "failed"
    ) else "pending"

    return PipelineStatusResponse(
        submission_id=str(submission_id),
        celery_task_id=celery_task_id,
        overall_status=overall,
        current_step=current_step,
        steps=steps,
        completed_at=(
            sub.processed_at.isoformat() if sub.processed_at else None
        ),
    )


# ---------------------------------------------------------------------------
# GET /api/submissions/{id}/results
# ---------------------------------------------------------------------------

@router.get(
    "/{submission_id}/results",
    response_model=PipelineResultsResponse,
    summary="Get full structured ML pipeline results",
)
async def get_pipeline_results(
    submission_id: UUID,
    db: AsyncSession = Depends(get_db),
) -> PipelineResultsResponse:
    """
    Returns the full structured pipeline output once processing is complete.

    The `results` field contains the complete CrowdPhysics JSON schema output
    including hand_pose, objects, contacts, grasps, actions, scene, and quality.
    """
    sub = await _get_submission_or_404(submission_id, db)

    if sub.status == "processing":
        raise HTTPException(
            status_code=status.HTTP_425_TOO_EARLY,
            detail="Processing is still in progress. Poll /pipeline-status for updates.",
        )

    if sub.status in ("uploading", "uploaded"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Submission has not been processed yet. Call /process first.",
        )

    # Strip internal Celery metadata from results
    results = sub.processing_results or {}
    clean_results = {k: v for k, v in results.items() if not k.startswith("_")}

    return PipelineResultsResponse(
        submission_id=str(submission_id),
        status=sub.status,
        quality_score=sub.quality_score,
        payout_amount=str(sub.payout_amount) if sub.payout_amount is not None else None,
        results=clean_results if clean_results else None,
    )
