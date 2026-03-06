"""
JSON Exporter

Normalises a raw PipelineResult dict into the canonical CrowdPhysics
JSON schema and returns the structured dict (ready for DB storage or
file serialisation).

Output schema:
{
    "version": "1.0",
    "submission_id": "...",
    "task_type": "dishwashing",
    "duration_seconds": 15.0,
    "fps": 30,
    "frames": [...],
    "hand_pose": {...},
    "objects": {...},
    "contacts": {...},
    "grasps": [...],
    "actions": [...],
    "scene": {...},
    "quality": {...}
}
"""

from __future__ import annotations

import json
from typing import Any


class JsonExporter:
    """Export pipeline results to CrowdPhysics canonical JSON schema."""

    VERSION = "1.0"

    def export(self, raw: dict) -> dict:
        """
        Normalise raw pipeline output dict into the canonical schema.

        Args:
            raw: Dict produced by pipeline/tasks.py with all processor outputs.

        Returns:
            Normalised dict matching the CrowdPhysics JSON schema.
        """
        return {
            "version": self.VERSION,
            "submission_id": raw.get("submission_id", ""),
            "task_type": raw.get("task_type", "unknown"),
            "duration_seconds": raw.get("duration_seconds", 0.0),
            "fps": raw.get("fps", 30),
            # Frame-level index (hand_pose frames serve as the primary index)
            "frames": self._build_frame_index(raw),
            "hand_pose": self._normalise_hand_pose(raw.get("hand_pose", {})),
            "objects": self._normalise_objects(raw.get("objects", {})),
            "contacts": self._normalise_contacts(raw.get("contacts", {})),
            "grasps": raw.get("grasps", []),
            "actions": raw.get("actions", []),
            "scene": raw.get("scene", {}),
            "quality": raw.get("quality", {}),
            "processing_times_ms": raw.get("processing_times_ms", {}),
        }

    # ------------------------------------------------------------------
    # Private normalisation helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _build_frame_index(raw: dict) -> list[dict]:
        """
        Build a lightweight per-frame index from hand_pose frame timestamps.
        Only includes frame_index and timestamp_sec for space efficiency.
        """
        hand_pose = raw.get("hand_pose", {})
        frames_raw = hand_pose.get("frames", [])
        return [
            {
                "frame_index": f.get("frame_index", i),
                "timestamp_sec": f.get("timestamp_sec", 0.0),
            }
            for i, f in enumerate(frames_raw)
        ]

    @staticmethod
    def _normalise_hand_pose(hp: dict) -> dict:
        """Strip model metadata, keep frames + summary."""
        return {
            "total_frames_sampled": hp.get("total_frames_sampled", 0),
            "fps": hp.get("fps", 30),
            "hands_detected": hp.get("hands_detected", {}),
            "frames": hp.get("frames", []),
        }

    @staticmethod
    def _normalise_objects(obj: dict) -> dict:
        """Strip model metadata, keep frames + unique_objects."""
        return {
            "total_frames_sampled": obj.get("total_frames_sampled", 0),
            "unique_objects": obj.get("unique_objects", []),
            "frames": obj.get("frames", []),
        }

    @staticmethod
    def _normalise_contacts(ct: dict) -> dict:
        """Strip model metadata, keep frames."""
        return {
            "total_frames_sampled": ct.get("total_frames_sampled", 0),
            "frames": ct.get("frames", []),
        }

    # ------------------------------------------------------------------
    # Serialisation helper
    # ------------------------------------------------------------------

    def to_json_string(self, raw: dict, indent: int = 2) -> str:
        """Export to a pretty-printed JSON string."""
        return json.dumps(self.export(raw), indent=indent, default=str)
