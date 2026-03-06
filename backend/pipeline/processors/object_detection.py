"""
Step 3: Object Detection (YOLO stub)

Returns bounding boxes with class labels and confidence scores per frame,
simulating YOLOv8 output.

This is a STUB implementation that returns realistic mock data.
"""

from __future__ import annotations

import asyncio
import math
import random

from pipeline.processors.base import BaseProcessor, ProcessorResult

# Typical kitchen objects encountered during dishwashing tasks
KITCHEN_OBJECTS = [
    "bowl",
    "cup",
    "plate",
    "sponge",
    "fork",
    "knife",
    "spoon",
    "faucet",
    "sink",
    "dish_rack",
    "bottle",
    "pan",
]


def _generate_bbox() -> dict:
    x1 = round(random.uniform(0.1, 0.6), 3)
    y1 = round(random.uniform(0.1, 0.6), 3)
    x2 = round(x1 + random.uniform(0.05, 0.25), 3)
    y2 = round(y1 + random.uniform(0.05, 0.20), 3)
    return {"x1": x1, "y1": y1, "x2": min(x2, 0.99), "y2": min(y2, 0.99)}


class ObjectDetector(BaseProcessor):
    name = "object_detection"

    async def process(self, video_path: str, metadata: dict) -> ProcessorResult:
        start = self._start_timer()

        # Simulate processing time (2-3 seconds)
        await asyncio.sleep(random.uniform(2.0, 3.0))

        fps = metadata.get("fps", 30)
        duration = metadata.get("duration_sec", 10.0)
        total_frames = int(fps * duration)

        # Pick 3-5 persistent objects for this video
        scene_objects = random.sample(KITCHEN_OBJECTS, k=random.randint(3, 5))
        # Assign stable track IDs
        track_ids = {obj: idx for idx, obj in enumerate(scene_objects, start=1)}

        frames = []
        # Sample every 5 frames
        for frame_idx in range(0, total_frames, 5):
            t = frame_idx / max(total_frames - 1, 1)
            frame_detections = []
            for obj in scene_objects:
                # Some objects might not be detected in every frame
                if random.random() < 0.85:
                    # Simulate smooth position change
                    base_x = 0.3 + 0.2 * math.sin(t * math.pi * 2 + track_ids[obj])
                    base_y = 0.4 + 0.1 * math.cos(t * math.pi * 1.5 + track_ids[obj])
                    w = random.uniform(0.08, 0.18)
                    h = random.uniform(0.06, 0.14)
                    frame_detections.append(
                        {
                            "class_label": obj,
                            "confidence": round(random.uniform(0.72, 0.98), 3),
                            "bbox": {
                                "x1": round(max(0.0, base_x - w / 2), 3),
                                "y1": round(max(0.0, base_y - h / 2), 3),
                                "x2": round(min(1.0, base_x + w / 2), 3),
                                "y2": round(min(1.0, base_y + h / 2), 3),
                            },
                            "track_id": track_ids[obj],
                        }
                    )

            frames.append(
                {
                    "frame_index": frame_idx,
                    "timestamp_sec": round(frame_idx / fps, 4),
                    "detections": frame_detections,
                }
            )

        data = {
            "total_frames_sampled": len(frames),
            "fps": fps,
            "frames": frames,
            "unique_objects": scene_objects,
            "model": "yolov8n_stub",
        }

        return self._make_result(
            success=True,
            data=data,
            elapsed_ms=self._elapsed_ms(start),
        )
