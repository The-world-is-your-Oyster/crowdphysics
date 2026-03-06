"""
Abstract base class for all CrowdPhysics ML pipeline processors.

Every processor receives a video path (or stub path) and metadata dict,
and returns a ProcessorResult containing typed output data.
"""

from __future__ import annotations

import time
from abc import ABC, abstractmethod

from pydantic import BaseModel


class ProcessorResult(BaseModel):
    """Standardised return value from any processor."""

    processor_name: str
    success: bool
    processing_time_ms: float
    data: dict
    errors: list[str] = []


class BaseProcessor(ABC):
    """Abstract base for all pipeline processors."""

    name: str = "base"

    @abstractmethod
    async def process(self, video_path: str, metadata: dict) -> ProcessorResult:
        """
        Process a video and return structured results.

        Args:
            video_path: Local filesystem path to the video file (may be a stub
                        path when running simulated pipelines).
            metadata: Submission metadata (task_type, duration_sec, fps, etc.)

        Returns:
            ProcessorResult with typed data payload.
        """

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    def _make_result(
        self,
        *,
        success: bool,
        data: dict,
        elapsed_ms: float,
        errors: list[str] | None = None,
    ) -> ProcessorResult:
        return ProcessorResult(
            processor_name=self.name,
            success=success,
            processing_time_ms=elapsed_ms,
            data=data,
            errors=errors or [],
        )

    @staticmethod
    def _start_timer() -> float:
        return time.perf_counter()

    @staticmethod
    def _elapsed_ms(start: float) -> float:
        return (time.perf_counter() - start) * 1000.0
