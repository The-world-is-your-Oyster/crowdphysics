"""
Step 4: Hand-Object Contact Estimation (stub)

Returns per-finger contact states (True/False) per frame.
Models whether each finger is in contact with an object,
simulating output from a learned contact estimator.

This is a STUB implementation that returns realistic mock data.
"""

from __future__ import annotations

import asyncio
import math
import random

from pipeline.processors.base import BaseProcessor, ProcessorResult


def _smooth_bool(t: float, phase_offset: float = 0.0, freq: float = 3.0) -> bool:
    """Generate a temporally smooth boolean contact signal."""
    val = math.sin(t * math.pi * freq + phase_offset)
    return val > 0.0


class ContactEstimator(BaseProcessor):
    name = "contact_estimation"

    async def process(self, video_path: str, metadata: dict) -> ProcessorResult:
        start = self._start_timer()

        # Simulate processing time (1.5-2.5 seconds)
        await asyncio.sleep(random.uniform(1.5, 2.5))

        fps = metadata.get("fps", 30)
        duration = metadata.get("duration_sec", 10.0)
        total_frames = int(fps * duration)

        frames = []
        # Sample every 3 frames
        for frame_idx in range(0, total_frames, 3):
            t = frame_idx / max(total_frames - 1, 1)
            frames.append(
                {
                    "frame_index": frame_idx,
                    "timestamp_sec": round(frame_idx / fps, 4),
                    "right_hand": {
                        "thumb":  _smooth_bool(t, phase_offset=0.0,  freq=2.5),
                        "index":  _smooth_bool(t, phase_offset=0.5,  freq=3.0),
                        "middle": _smooth_bool(t, phase_offset=1.0,  freq=3.0),
                        "ring":   _smooth_bool(t, phase_offset=1.5,  freq=2.0),
                        "pinky":  _smooth_bool(t, phase_offset=2.0,  freq=1.5),
                    },
                    "left_hand": {
                        "thumb":  _smooth_bool(t, phase_offset=0.3,  freq=2.0),
                        "index":  _smooth_bool(t, phase_offset=0.8,  freq=2.5),
                        "middle": _smooth_bool(t, phase_offset=1.3,  freq=2.5),
                        "ring":   _smooth_bool(t, phase_offset=1.8,  freq=1.5),
                        "pinky":  _smooth_bool(t, phase_offset=2.3,  freq=1.0),
                    },
                }
            )

        data = {
            "total_frames_sampled": len(frames),
            "fps": fps,
            "frames": frames,
            "model": "contact_estimator_v1_stub",
        }

        return self._make_result(
            success=True,
            data=data,
            elapsed_ms=self._elapsed_ms(start),
        )
