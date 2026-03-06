import uuid
from datetime import datetime, timezone
from decimal import Decimal

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.dialects.postgresql import JSON, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Submission(Base):
    __tablename__ = "submissions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    task_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("task_templates.id", ondelete="CASCADE"),
        nullable=False,
    )
    video_url: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    thumbnail_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    duration_sec: Mapped[float] = mapped_column(Float, nullable=False)
    file_size_bytes: Mapped[int] = mapped_column(Integer, nullable=False)
    device_model: Mapped[str] = mapped_column(String(100), nullable=False)
    has_lidar: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    status: Mapped[str] = mapped_column(
        String(20), default="uploading", nullable=False
    )  # uploading/uploaded/processing/accepted/rejected
    rejection_reason: Mapped[str | None] = mapped_column(Text, nullable=True)
    quality_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    payout_amount: Mapped[Decimal | None] = mapped_column(Numeric(8, 4), nullable=True)
    processing_results: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    processed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    user: Mapped["User"] = relationship(back_populates="submissions")  # noqa: F821
    task: Mapped["TaskTemplate"] = relationship(back_populates="submissions")  # noqa: F821
