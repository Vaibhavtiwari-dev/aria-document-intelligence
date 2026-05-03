from celery import Celery
from src.core.config import settings

celery_app = Celery(
    "aria",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
    include=["src.services.tasks"]
)

celery_app.conf.update(
    task_track_started=True,
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    # SQLite compatibility: ensure workers don't keep too many connections open
    # if using SQLite for result backend (though we are using Redis here)
    worker_prefetch_multiplier=1,
)

if __name__ == "__main__":
    celery_app.start()
