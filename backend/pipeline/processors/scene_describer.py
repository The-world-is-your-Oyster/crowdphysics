"""
Step 7: VLM Scene Description (stub)

Produces a natural-language description of the scene and validates that
the recorded activity matches the declared task type.

Simulates the output of a Vision-Language Model (e.g. Gemini 1.5 Pro,
GPT-4o, or LLaVA-Next).

This is a STUB implementation that returns realistic mock data.
"""

from __future__ import annotations

import asyncio
import random

from pipeline.processors.base import BaseProcessor, ProcessorResult

# Task-type → description templates
_DESCRIPTIONS: dict[str, list[str]] = {
    "dishwashing": [
        "A person is washing dishes at a kitchen sink. Both hands are visible. "
        "The subject scrubs a bowl using a yellow sponge, then rinses it under running water.",
        "The scene shows a kitchen counter with a sink. The individual is using "
        "their right hand to hold a cup under the faucet while scrubbing with the left.",
        "In a well-lit kitchen, the person methodically washes multiple dishes. "
        "Soap suds are visible in the basin.",
    ],
    "folding_clothes": [
        "A person folds a shirt on a flat surface. Both hands coordinate symmetrically "
        "to align the sleeves.",
        "The subject is folding laundry on a bed. A stack of folded clothes is "
        "accumulating to their right.",
    ],
    "pouring": [
        "The person carefully pours liquid from a pitcher into a glass, "
        "maintaining steady control to avoid spilling.",
        "A precise pouring action is captured — the hand tilts a bottle slowly "
        "while the other hand stabilises the receiving container.",
    ],
    "sorting": [
        "The subject sorts small objects into separate containers, using a pinch "
        "grip to pick items one at a time.",
    ],
}

_ENVIRONMENTS = ["kitchen", "dining_room", "living_room", "bathroom", "laundry_room"]


class SceneDescriber(BaseProcessor):
    name = "scene_description"

    async def process(self, video_path: str, metadata: dict) -> ProcessorResult:
        start = self._start_timer()

        # Simulate VLM inference time (2-4 seconds)
        await asyncio.sleep(random.uniform(2.0, 4.0))

        task_type: str = metadata.get("task_type", "dishwashing")
        templates = _DESCRIPTIONS.get(task_type, _DESCRIPTIONS["dishwashing"])
        description = random.choice(templates)

        # 90% of the time the task type matches what was declared
        task_validated = random.random() < 0.90
        detected_type = task_type if task_validated else "unknown"

        # Extract objects mentioned in the description
        candidate_objects = [
            "bowl", "cup", "plate", "sponge", "faucet", "pitcher",
            "glass", "shirt", "bottle", "container", "sink", "laundry",
        ]
        objects_mentioned = [o for o in candidate_objects if o in description.lower()]

        data = {
            "description": description,
            "task_type_detected": detected_type,
            "task_validated": task_validated,
            "confidence": round(random.uniform(0.82, 0.99), 3),
            "environment": random.choice(_ENVIRONMENTS),
            "objects_mentioned": objects_mentioned,
            "model": "vlm_scene_describer_v1_stub",
        }

        return self._make_result(
            success=True,
            data=data,
            elapsed_ms=self._elapsed_ms(start),
        )
