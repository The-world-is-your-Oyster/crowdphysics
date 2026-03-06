import uuid
from decimal import Decimal

from sqlalchemy import Boolean, Index, Integer, Numeric, String, Text
from sqlalchemy.dialects.postgresql import JSON, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class TaskTemplate(Base):
    __tablename__ = "task_templates"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    title_zh: Mapped[str] = mapped_column(String(200), nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False)
    difficulty: Mapped[str] = mapped_column(String(20), nullable=False)  # easy/medium/hard
    description: Mapped[str] = mapped_column(Text, nullable=False)
    steps: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    payout_usd: Mapped[Decimal] = mapped_column(Numeric(8, 2), nullable=False)
    duration_min: Mapped[int] = mapped_column(Integer, nullable=False)
    duration_max: Mapped[int] = mapped_column(Integer, nullable=False)
    hands_required: Mapped[str] = mapped_column(String(20), nullable=False)  # one/two
    objects_expected: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    camera_position: Mapped[str] = mapped_column(String(50), nullable=False)
    example_video_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    remaining_slots: Mapped[int] = mapped_column(Integer, default=100, nullable=False)
    total_completed: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    submissions: Mapped[list["Submission"]] = relationship(  # noqa: F821
        back_populates="task", lazy="selectin"
    )

    __table_args__ = (Index("ix_task_templates_category", "category"),)
