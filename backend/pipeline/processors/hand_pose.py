"""
Step 2: Hand Pose Estimation (MediaPipe stub)

Returns 21 keypoints per hand per frame, simulating MediaPipe Hands output.
Keypoints follow MediaPipe's 21-point hand landmark model:
  0: WRIST
  1-4: THUMB (CMC, MCP, IP, TIP)
  5-8: INDEX (MCP, PIP, DIP, TIP)
  9-12: MIDDLE (MCP, PIP, DIP, TIP)
  13-16: RING (MCP, PIP, DIP, TIP)
  17-20: PINKY (MCP, PIP, DIP, TIP)

This is a STUB implementation that returns realistic mock data.
"""

from __future__ import annotations

import asyncio
import math
import random

from pipeline.processors.base import BaseProcessor, ProcessorResult


def _generate_hand_keypoints(
    base_x: float,
    base_y: float,
    scale: float = 0.1,
    jitter: float = 0.005,
) -> list[dict]:
    """
    Generate 21 keypoints for one hand in a plausible configuration.

    Coordinates are normalised [0, 1] relative to frame dimensions.
    Z is depth relative to wrist (negative = closer to camera).
    """
    # Offsets from wrist for each of the 21 landmarks (approximate anatomy)
    offsets = [
        (0.0, 0.0, 0.0),      # 0 WRIST
        # THUMB
        (0.05, -0.05, 0.01),  # 1 CMC
        (0.08, -0.10, 0.01),  # 2 MCP
        (0.10, -0.14, 0.00),  # 3 IP
        (0.11, -0.17, -0.01), # 4 TIP
        # INDEX
        (0.04, -0.16, 0.01),  # 5 MCP
        (0.04, -0.22, 0.00),  # 6 PIP
        (0.04, -0.26, 0.00),  # 7 DIP
        (0.04, -0.30, -0.01), # 8 TIP
        # MIDDLE
        (0.00, -0.17, 0.01),  # 9 MCP
        (0.00, -0.23, 0.00),  # 10 PIP
        (0.00, -0.27, 0.00),  # 11 DIP
        (0.00, -0.31, -0.01), # 12 TIP
        # RING
        (-0.04, -0.16, 0.01), # 13 MCP
        (-0.04, -0.22, 0.00), # 14 PIP
        (-0.04, -0.26, 0.00), # 15 DIP
        (-0.04, -0.29, -0.01),# 16 TIP
        # PINKY
        (-0.08, -0.14, 0.01), # 17 MCP
        (-0.08, -0.19, 0.00), # 18 PIP
        (-0.08, -0.22, 0.00), # 19 DIP
        (-0.08, -0.25, -0.01),# 20 TIP
    ]

    keypoints = []
    for ox, oy, oz in offsets:
        keypoints.append(
            {
                "x": round(base_x + ox * scale + random.gauss(0, jitter), 4),
                "y": round(base_y + oy * scale + random.gauss(0, jitter), 4),
                "z": round(oz + random.gauss(0, jitter * 0.5), 4),
            }
        )
    return keypoints


class HandPoseEstimator(BaseProcessor):
    name = "hand_pose"

    async def process(self, video_path: str, metadata: dict) -> ProcessorResult:
        start = self._start_timer()

        # Simulate processing time (2-4 seconds)
        await asyncio.sleep(random.uniform(2.0, 4.0))

        fps = metadata.get("fps", 30)
        duration = metadata.get("duration_sec", 10.0)
        total_frames = int(fps * duration)
        # Sample every 3rd frame to keep payload size reasonable
        sampled_indices = list(range(0, total_frames, 3))

        # Simulate smooth hand motion using a sine wave trajectory
        frames = []
        for frame_idx in sampled_indices:
            t = frame_idx / max(total_frames - 1, 1)
            # Right hand moves in a washing arc
            rx = 0.55 + 0.15 * math.sin(t * math.pi * 4)
            ry = 0.45 + 0.10 * math.cos(t * math.pi * 3)
            # Left hand stays more stable
            lx = 0.45 - 0.10 * math.sin(t * math.pi * 2)
            ly = 0.50 + 0.05 * math.cos(t * math.pi * 2)

            frames.append(
                {
                    "frame_index": frame_idx,
                    "timestamp_sec": round(frame_idx / fps, 4),
                    "right_hand": _generate_hand_keypoints(rx, ry),
                    "left_hand": _generate_hand_keypoints(lx, ly)
                    if random.random() > 0.15  # left hand occasionally not visible
                    else None,
                }
            )

        data = {
            "total_frames_sampled": len(frames),
            "fps": fps,
            "frames": frames,
            "hands_detected": {"right": True, "left": True},
            "model": "mediapipe_hands_v2_stub",
        }

        return self._make_result(
            success=True,
            data=data,
            elapsed_ms=self._elapsed_ms(start),
        )
