from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.task import TaskTemplate
from app.schemas.task import TaskListResponse, TaskResponse

router = APIRouter(prefix="/api/tasks", tags=["tasks"])


@router.get("/", response_model=TaskListResponse)
async def list_tasks(
    category: str | None = Query(None, description="Filter by category"),
    difficulty: str | None = Query(None, description="Filter by difficulty"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    db: AsyncSession = Depends(get_db),
):
    query = select(TaskTemplate).where(TaskTemplate.is_active == True)  # noqa: E712

    if category:
        query = query.where(TaskTemplate.category == category)
    if difficulty:
        query = query.where(TaskTemplate.difficulty == difficulty)

    # Count total
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar_one()

    # Paginate
    offset = (page - 1) * limit
    query = query.offset(offset).limit(limit).order_by(TaskTemplate.category, TaskTemplate.title)

    result = await db.execute(query)
    tasks = result.scalars().all()

    return TaskListResponse(
        tasks=[TaskResponse.model_validate(t) for t in tasks],
        total=total,
        page=page,
        limit=limit,
    )


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(task_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(TaskTemplate).where(TaskTemplate.id == task_id)
    )
    task = result.scalar_one_or_none()
    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )
    return TaskResponse.model_validate(task)
