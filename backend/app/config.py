from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql+asyncpg://cp:dev123@localhost:5433/crowdphysics"
    jwt_secret: str = "crowdphysics-dev-secret-change-in-prod"
    jwt_algorithm: str = "HS256"
    jwt_expire_days: int = 7

    s3_endpoint: str = "http://localhost:9000"
    s3_access_key: str = "minioadmin"
    s3_secret_key: str = "minioadmin"
    s3_bucket: str = "crowdphysics-videos"
    s3_region: str = "us-east-1"

    redis_url: str = "redis://localhost:6380/0"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
