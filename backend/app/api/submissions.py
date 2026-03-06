from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.submission import Submission
from app.models.task import TaskTemplate
from app.schemas.submission import SubmissionCreate, SubmissionListResponse, SubmissionResponse
from app.models.user import User
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/api/submissions", tags=["submissions"])


@router.post("/", response_model=SubmissionResponse, status_code=status.HTTP_201_CREATED)
async def create_submission(
    body: SubmissionCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Verify task exists and has slots
    result = await db.execute(
        select(TaskTemplate).where(TaskTemplate.id == body.task_id)
    )
    task = result.scalar_one_or_none()
    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )
    if not task.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Task is no longer active",
        )
    if task.remaining_slots <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No remaining slots for this task",
        )

    submission = Submission(
        user_id=current_user.id,
        task_id=body.task_id,
        device_model=body.device_model,
        has_lidar=body.has_lidar,
        duration_sec=body.duration_sec,
        file_size_bytes=body.file_size_bytes,
        status="uploading",
    )
    db.add(submission)
    await db.flush()
    await db.refresh(submission)

    return SubmissionResponse.model_validate(submission)


@router.get("/mine", response_model=SubmissionListResponse)
async def list_my_submissions(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    base_query = select(Submission).where(Submission.user_id == current_user.id)

    count_result = await db.execute(
        select(func.count()).select_from(base_query.subquery())
    )
    total = count_result.scalar_one()

    offset = (page - 1) * limit
    result = await db.execute(
        base_query.order_by(Submission.created_at.desc()).offset(offset).limit(limit)
    )
    submissions = result.scalars().all()

    return SubmissionListResponse(
        submissions=[SubmissionResponse.model_validate(s) for s in submissions],
        total=total,
        page=page,
        limit=limit,
    )


@router.get("/{submission_id}", response_model=SubmissionResponse)
async def get_submission(
    submission_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Submission).where(Submission.id == submission_id)
    )
    submission = result.scalar_one_or_none()
    if submission is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Submission not found",
        )
    return SubmissionResponse.model_validate(submission)


@router.delete("/{submission_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_submission(
    submission_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Submission).where(Submission.id == submission_id)
    )
    submission = result.scalar_one_or_none()
    if submission is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Submission not found",
        )
    if submission.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not your submission",
        )
    if submission.status == "accepted":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete an accepted submission",
        )

    await db.delete(submission)
