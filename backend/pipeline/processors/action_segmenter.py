"""
Step 6: Action Temporal Segmentation (stub)

Segments the video into a sequence of action phases, modelling the
typical structure of a manipulation task:

  idle → approach → contact → manipulate → release → idle

Multiple contact/manipulate/release cycles may occur within one recording.

This is a STUB implementation that returns realistic mock data.
"""

from __future__ import annotations

import asyncio
import random

from pipeline.processors.base import BaseProcessor, ProcessorResult

# Canonical phase sequence for a single manipulation cycle
SINGLE_CYCLE = [
    "idle",
    "approach",
    "contact",
    "manipulate",
    "release",
    "idle",
]


class ActionSegmenter(BaseProcessor):
    name = "action_segmentation"

    async def process(self, video_path: str, metadata: dict) -> ProcessorResult:
        start = self._start_timer()

        # Simulate processing time (2-3 seconds)
        await asyncio.sleep(random.uniform(2.0, 3.0))

        fps = metadata.get("fps", 30)
        duration = metadata.get("duration_sec", 10.0)
        total_frames = int(fps * duration)

        # Build 1-3 manipulation cycles
        num_cycles = random.randint(1, 3)
        # Relative duration weights per phase
        phase_weights = {
            "idle":       (0.03, 0.10),
            "approach":   (0.05, 0.12),
            "contact":    (0.03, 0.08),
            "manipulate": (0.15, 0.35),
            "release":    (0.03, 0.08),
        }

        phases_sequence = ["idle"]
        for _ in range(num_cycles):
            phases_sequence += ["approach", "contact", "manipulate", "release", "idle"]

        # Assign durations proportionally
        raw_durations = []
        for phase in phases_sequence:
            lo, hi = phase_weights.get(phase, (0.03, 0.08))
            raw_durations.append(random.uniform(lo, hi))

        total_raw = sum(raw_durations)
        phase_durations_sec = [d / total_raw * duration for d in raw_durations]

        segments: list[dict] = []
        current_time = 0.0
        current_frame = 0
        for phase, phase_dur in zip(phases_sequence, phase_durations_sec):
            end_time = min(current_time + phase_dur, duration)
            end_frame = min(int(end_time * fps), total_frames - 1)
            segments.append(
                {
                    "phase": phase,
                    "start_time_sec": round(current_time, 4),
                    "end_time_sec": round(end_time, 4),
                    "start_frame": current_frame,
                    "end_frame": end_frame,
                    "confidence": round(random.uniform(0.75, 0.97), 3),
                }
            )
            current_time = end_time
            current_frame = end_frame + 1

        data = {
            "segments": segments,
            "total_segments": len(segments),
            "num_cycles": num_cycles,
            "model": "action_segmenter_v1_stub",
        }

        return self._make_result(
            success=True,
            data=data,
            elapsed_ms=self._elapsed_ms(start),
        )
