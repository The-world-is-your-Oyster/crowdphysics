"""
Celery application configuration for the CrowdPhysics ML pipeline.

Broker:  Redis db=0 (matching existing docker-compose port 6380)
Backend: Redis db=1

Start worker:
    celery -A pipeline.celery_app worker --loglevel=info --concurrency=2
"""

from celery import Celery

celery_app = Celery(
    "crowdphysics_pipeline",
    broker="redis://localhost:6380/0",
    backend="redis://localhost:6380/1",
    include=["pipeline.tasks"],
)

celery_app.conf.update(
    # Serialization
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    # Timezone
    timezone="UTC",
    enable_utc=True,
    # Tracking
    task_track_started=True,
    # Worker
    worker_concurrency=2,
    worker_prefetch_multiplier=1,
    # Results expire after 24 hours
    result_expires=86_400,
    # Retry settings for transient errors
    task_acks_late=True,
    task_reject_on_worker_lost=True,
    # Logging
    worker_redirect_stdouts=False,
)
