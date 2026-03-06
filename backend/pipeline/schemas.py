"""
Pydantic models for CrowdPhysics ML pipeline input/output.

Designed to align with LeRobot v3 / RLDS schema conventions for
physical intelligence data collection.
"""

from __future__ import annotations

from typing import Optional
from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Hand pose
# ---------------------------------------------------------------------------

class Keypoint3D(BaseModel):
    x: float
    y: float
    z: float


class HandPoseFrame(BaseModel):
    """21 MediaPipe keypoints for each hand, per frame."""

    frame_index: int
    timestamp_sec: float
    left_hand: Optional[list[Keypoint3D]] = Field(
        default=None,
        description="21 keypoints for left hand (None if not visible)",
    )
    right_hand: Optional[list[Keypoint3D]] = Field(
        default=None,
        description="21 keypoints for right hand (None if not visible)",
    )


# ---------------------------------------------------------------------------
# Object detection
# ---------------------------------------------------------------------------

class BoundingBox(BaseModel):
    x1: float
    y1: float
    x2: float
    y2: float


class DetectedObject(BaseModel):
    class_label: str
    confidence: float
    bbox: BoundingBox
    track_id: Optional[int] = None


class ObjectDetectionFrame(BaseModel):
    frame_index: int
    timestamp_sec: float
    detections: list[DetectedObject]


# ---------------------------------------------------------------------------
# Contact estimation
# ---------------------------------------------------------------------------

class FingerContactState(BaseModel):
    thumb: bool
    index: bool
    middle: bool
    ring: bool
    pinky: bool


class ContactFrame(BaseModel):
    frame_index: int
    timestamp_sec: float
    left_hand: Optional[FingerContactState] = None
    right_hand: Optional[FingerContactState] = None


# ---------------------------------------------------------------------------
# Grasp classification
# ---------------------------------------------------------------------------

class GraspSegment(BaseModel):
    grasp_type: str = Field(
        description="One of: power_grip, precision_grip, pinch, lateral, hook, palm, none"
    )
    start_frame: int
    end_frame: int
    start_time_sec: float
    end_time_sec: float
    hand: str = Field(description="left or right")
    confidence: float


# ---------------------------------------------------------------------------
# Action segmentation
# ---------------------------------------------------------------------------

class ActionPhase(BaseModel):
    phase: str = Field(
        description="One of: idle, approach, contact, manipulate, release"
    )
    start_time_sec: float
    end_time_sec: float
    start_frame: int
    end_frame: int
    confidence: float


# ---------------------------------------------------------------------------
# Quality report
# ---------------------------------------------------------------------------

class QualityReport(BaseModel):
    hand_visibility: float = Field(ge=0.0, le=1.0)
    stability: float = Field(ge=0.0, le=1.0)
    brightness: float = Field(ge=0.0, le=1.0)
    motion_blur: float = Field(ge=0.0, le=1.0)
    audio_sync_score: float = Field(ge=0.0, le=1.0)
    overall_score: float = Field(ge=0.0, le=1.0)
    overall_pass: bool
    rejection_reason: Optional[str] = None


# ---------------------------------------------------------------------------
# Scene description
# ---------------------------------------------------------------------------

class SceneDescription(BaseModel):
    description: str
    task_type_detected: str
    task_validated: bool
    confidence: float
    environment: str = Field(description="e.g. kitchen, living_room, bathroom")
    objects_mentioned: list[str]


# ---------------------------------------------------------------------------
# Combined pipeline result
# ---------------------------------------------------------------------------

class PipelineResult(BaseModel):
    """Full output from running all pipeline processors on a submission."""

    version: str = "1.0"
    submission_id: str
    task_type: str
    duration_seconds: float
    fps: int
    total_frames: int

    quality: QualityReport
    hand_pose_frames: list[HandPoseFrame]
    object_frames: list[ObjectDetectionFrame]
    contact_frames: list[ContactFrame]
    grasp_segments: list[GraspSegment]
    action_phases: list[ActionPhase]
    scene: SceneDescription

    # Per-processor timing info
    processing_times_ms: dict[str, float] = Field(default_factory=dict)
    errors: dict[str, list[str]] = Field(default_factory=dict)


# ---------------------------------------------------------------------------
# Pipeline status (for API progress polling)
# ---------------------------------------------------------------------------

PIPELINE_STEPS = [
    "quality_check",
    "hand_pose",
    "object_detection",
    "contact_estimation",
    "grasp_classification",
    "action_segmentation",
    "scene_description",
]


class StepStatus(BaseModel):
    step: str
    status: str = Field(description="pending | running | done | failed")
    processing_time_ms: Optional[float] = None
    error: Optional[str] = None


class PipelineStatus(BaseModel):
    submission_id: str
    celery_task_id: Optional[str]
    overall_status: str = Field(
        description="pending | processing | processed | rejected | failed"
    )
    steps: list[StepStatus]
    started_at: Optional[str] = None
    completed_at: Optional[str] = None
    current_step: Optional[str] = None
