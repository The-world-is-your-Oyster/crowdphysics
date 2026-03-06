"""
Step 5: Grasp Type Classification (stub)

Returns a list of grasp segments — contiguous time intervals where
a specific grasp type is detected.  The grasp taxonomy follows the
Feix et al. GRASP taxonomy (simplified to 6 types used in daily
manipulation tasks).

Grasp types:
  - power_grip    : whole-hand cylindrical or spherical grip
  - precision_grip: fingertip pinch with multiple fingers
  - pinch         : thumb + index fingertip only
  - lateral       : side pinch (thumb vs. lateral index)
  - hook           : hook grip (bent fingers around handle)
  - palm          : palm press (no individual finger manipulation)

This is a STUB implementation that returns realistic mock data.
"""

from __future__ import annotations

import asyncio
import random

from pipeline.processors.base import BaseProcessor, ProcessorResult

GRASP_TYPES = [
    "power_grip",
    "precision_grip",
    "pinch",
    "lateral",
    "hook",
    "palm",
]


class GraspClassifier(BaseProcessor):
    name = "grasp_classification"

    async def process(self, video_path: str, metadata: dict) -> ProcessorResult:
        start = self._start_timer()

        # Simulate processing time (1-2 seconds)
        await asyncio.sleep(random.uniform(1.0, 2.0))

        fps = metadata.get("fps", 30)
        duration = metadata.get("duration_sec", 10.0)
        total_frames = int(fps * duration)

        segments: list[dict] = []

        # Generate 4-8 grasp segments that cover most of the video
        num_segments = random.randint(4, 8)
        # Randomly partition the duration into segments
        boundaries = sorted(random.sample(range(1, total_frames - 1), num_segments - 1))
        boundaries = [0] + boundaries + [total_frames]

        for i in range(len(boundaries) - 1):
            s_frame = boundaries[i]
            e_frame = boundaries[i + 1] - 1
            if e_frame <= s_frame:
                continue
            grasp_type = random.choice(GRASP_TYPES)
            segments.append(
                {
                    "grasp_type": grasp_type,
                    "start_frame": s_frame,
                    "end_frame": e_frame,
                    "start_time_sec": round(s_frame / fps, 4),
                    "end_time_sec": round(e_frame / fps, 4),
                    "hand": random.choice(["right", "left"]),
                    "confidence": round(random.uniform(0.70, 0.97), 3),
                }
            )

        data = {
            "segments": segments,
            "total_segments": len(segments),
            "model": "grasp_classifier_v1_stub",
        }

        return self._make_result(
            success=True,
            data=data,
            elapsed_ms=self._elapsed_ms(start),
        )
