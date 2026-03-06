from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel


class TaskResponse(BaseModel):
    id: UUID
    title: str
    title_zh: str
    category: str
    difficulty: str
    description: str
    steps: list[str]
    payout_usd: Decimal
    duration_min: int
    duration_max: int
    hands_required: str
    objects_expected: list[str]
    camera_position: str
    example_video_url: str | None
    remaining_slots: int
    total_completed: int
    is_active: bool

    model_config = {"from_attributes": True}


class TaskListResponse(BaseModel):
    tasks: list[TaskResponse]
    total: int
    page: int
    limit: int
