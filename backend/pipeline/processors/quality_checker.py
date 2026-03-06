"""
Step 1: Video Quality Check

Validates that the video meets minimum quality standards before
the rest of the pipeline runs. A failed quality check causes the
submission to be rejected immediately.

This is a STUB implementation that returns realistic mock data.
"""

from __future__ import annotations

import asyncio
import random

from pipeline.processors.base import BaseProcessor, ProcessorResult


class QualityChecker(BaseProcessor):
    name = "quality_check"

    # Quality thresholds
    MIN_HAND_VISIBILITY = 0.60
    MIN_STABILITY = 0.55
    MIN_BRIGHTNESS = 0.40
    MIN_OVERALL = 0.65

    async def process(self, video_path: str, metadata: dict) -> ProcessorResult:
        start = self._start_timer()

        # Simulate processing time (1-2 seconds)
        await asyncio.sleep(random.uniform(1.0, 2.0))

        # Generate realistic quality metrics
        hand_visibility = round(random.uniform(0.70, 0.95), 3)
        stability = round(random.uniform(0.65, 0.90), 3)
        brightness = round(random.uniform(0.75, 0.98), 3)
        motion_blur = round(random.uniform(0.10, 0.35), 3)  # lower = blurrier
        audio_sync_score = round(random.uniform(0.80, 0.99), 3)

        overall_score = round(
            (hand_visibility * 0.35)
            + (stability * 0.30)
            + (brightness * 0.15)
            + ((1.0 - motion_blur) * 0.10)
            + (audio_sync_score * 0.10),
            3,
        )

        # Determine pass/fail
        rejection_reason: str | None = None
        if hand_visibility < self.MIN_HAND_VISIBILITY:
            rejection_reason = "Hand visibility too low"
        elif stability < self.MIN_STABILITY:
            rejection_reason = "Video too shaky"
        elif brightness < self.MIN_BRIGHTNESS:
            rejection_reason = "Video too dark"
        elif overall_score < self.MIN_OVERALL:
            rejection_reason = "Overall quality score below threshold"

        overall_pass = rejection_reason is None

        data = {
            "hand_visibility": hand_visibility,
            "stability": stability,
            "brightness": brightness,
            "motion_blur": motion_blur,
            "audio_sync_score": audio_sync_score,
            "overall_score": overall_score,
            "overall_pass": overall_pass,
            "rejection_reason": rejection_reason,
        }

        return self._make_result(
            success=overall_pass,
            data=data,
            elapsed_ms=self._elapsed_ms(start),
            errors=[] if overall_pass else [rejection_reason],  # type: ignore[list-item]
        )
