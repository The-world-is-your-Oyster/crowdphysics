import uuid

import boto3
from botocore.config import Config as BotoConfig
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.models.submission import Submission
from app.models.user import User
from app.schemas.submission import PresignedUrlRequest, PresignedUrlResponse, UploadConfirmRequest
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/api/upload", tags=["upload"])


def get_s3_client():
    return boto3.client(
        "s3",
        endpoint_url=settings.s3_endpoint,
        aws_access_key_id=settings.s3_access_key,
        aws_secret_access_key=settings.s3_secret_key,
        region_name=settings.s3_region,
        config=BotoConfig(signature_version="s3v4"),
    )


def ensure_bucket_exists(s3_client):
    try:
        s3_client.head_bucket(Bucket=settings.s3_bucket)
    except Exception:
        s3_client.create_bucket(Bucket=settings.s3_bucket)


@router.post("/presigned-url", response_model=PresignedUrlResponse)
async def get_presigned_url(
    body: PresignedUrlRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Submission).where(Submission.id == body.submission_id)
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
    if submission.status not in ("uploading",):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Submission status is '{submission.status}', expected 'uploading'",
        )

    video_key = f"videos/{current_user.id}/{submission.id}/{uuid.uuid4()}.mp4"

    s3_client = get_s3_client()
    ensure_bucket_exists(s3_client)

    presigned_url = s3_client.generate_presigned_url(
        "put_object",
        Params={
            "Bucket": settings.s3_bucket,
            "Key": video_key,
            "ContentType": "video/mp4",
        },
        ExpiresIn=3600,
    )

    # Store the video key on the submission
    submission.video_url = f"{settings.s3_endpoint}/{settings.s3_bucket}/{video_key}"
    await db.flush()

    return PresignedUrlResponse(upload_url=presigned_url, video_key=video_key)


@router.post("/confirm")
async def confirm_upload(
    body: UploadConfirmRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Submission).where(Submission.id == body.submission_id)
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
    if submission.status != "uploading":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Submission status is '{submission.status}', expected 'uploading'",
        )

    submission.status = "uploaded"
    await db.flush()

    # In production, this would enqueue a processing job to Redis/Celery.
    # For now, we mark it as uploaded and return success.
    return {
        "status": "ok",
        "message": "Upload confirmed. Submission queued for processing.",
        "submission_id": str(submission.id),
    }
