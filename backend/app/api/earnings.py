from fastapi import APIRouter, Depends, Query
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.submission import Submission
from app.models.task import TaskTemplate
from app.models.user import User
from app.schemas.submission import (
    EarningEvent,
    EarningsBalanceResponse,
    EarningsHistoryResponse,
)
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/api/earnings", tags=["earnings"])


@router.get("/balance", response_model=EarningsBalanceResponse)
async def get_balance(
    current_user: User = Depends(get_current_user),
):
    return EarningsBalanceResponse(
        balance=current_user.total_earnings - current_user.pending_earnings,
        pending=current_user.pending_earnings,
        total_earned=current_user.total_earnings,
    )


@router.get("/history", response_model=EarningsHistoryResponse)
async def get_earnings_history(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    base_query = (
        select(Submission, TaskTemplate.title)
        .join(TaskTemplate, Submission.task_id == TaskTemplate.id)
        .where(
            Submission.user_id == current_user.id,
            Submission.status == "accepted",
            Submission.payout_amount.isnot(None),
        )
    )

    count_query = select(func.count()).select_from(base_query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar_one()

    offset = (page - 1) * limit
    result = await db.execute(
        base_query.order_by(Submission.processed_at.desc())
        .offset(offset)
        .limit(limit)
    )
    rows = result.all()

    events = []
    for submission, task_title in rows:
        events.append(
            EarningEvent(
                submission_id=submission.id,
                task_title=task_title,
                payout_amount=submission.payout_amount,
                processed_at=submission.processed_at,
            )
        )

    return EarningsHistoryResponse(
        events=events,
        total=total,
        page=page,
        limit=limit,
    )
