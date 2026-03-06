from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import auth, earnings, pipeline, submissions, tasks, upload
from app.database import engine, Base


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup (dev convenience; use alembic in production)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()


app = FastAPI(
    title="CrowdPhysics API",
    description="Crowdsourced physical intelligence data collection platform",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(tasks.router)
app.include_router(submissions.router)
app.include_router(upload.router)
app.include_router(earnings.router)
app.include_router(pipeline.router)


@app.get("/")
async def root():
    return {
        "name": "CrowdPhysics API",
        "version": "0.1.0",
        "docs": "/docs",
    }


@app.get("/health")
async def health():
    return {"status": "ok"}
