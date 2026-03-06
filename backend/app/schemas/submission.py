from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel


class SubmissionCreate(BaseModel):
    task_id: UUID
    device_model: str
    has_lidar: bool = False
    duration_sec: float
    file_size_bytes: int


class SubmissionResponse(BaseModel):
    id: UUID
    user_id: UUID
    task_id: UUID
    video_url: str
    thumbnail_url: str | None
    duration_sec: float
    file_size_bytes: int
    device_model: str
    has_lidar: bool
    status: str
    rejection_reason: str | None
    quality_score: float | None
    payout_amount: Decimal | None
    processing_results: dict | None
    created_at: datetime
    processed_at: datetime | None

    model_config = {"from_attributes": True}


class SubmissionListResponse(BaseModel):
    submissions: list[SubmissionResponse]
    total: int
    page: int
    limit: int


class PresignedUrlRequest(BaseModel):
    submission_id: UUID


class PresignedUrlResponse(BaseModel):
    upload_url: str
    video_key: str


class UploadConfirmRequest(BaseModel):
    submission_id: UUID


class EarningsBalanceResponse(BaseModel):
    balance: Decimal
    pending: Decimal
    total_earned: Decimal


class EarningEvent(BaseModel):
    submission_id: UUID
    task_title: str
    payout_amount: Decimal
    processed_at: datetime


class EarningsHistoryResponse(BaseModel):
    events: list[EarningEvent]
    total: int
    page: int
    limit: int
