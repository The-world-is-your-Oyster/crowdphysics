"""
RLDS (Reinforcement Learning Datasets) Exporter — STUB

Produces an RLDS-compatible dict structure from a CrowdPhysics
PipelineResult.  RLDS is Google's standard for offline RL datasets
used in robotics (https://github.com/google-research/rlds).

Key RLDS concepts:
  - Each dataset is a collection of "episodes"
  - Each episode is a sequence of "steps"
  - Each step has: observation, action, reward, is_first, is_last, is_terminal

This stub generates the correct schema structure with placeholder values.
"""

from __future__ import annotations


class RLDSExporter:
    """
    STUB: Export pipeline results to RLDS episode format.

    Real implementation would write TFRecord files; this stub returns
    a Python dict matching the RLDS schema for validation purposes.
    """

    RLDS_VERSION = "1.0.0"

    def export(self, pipeline_result: dict) -> dict:
        """
        Convert a CrowdPhysics pipeline result to RLDS episode format.

        Args:
            pipeline_result: Normalised dict from JsonExporter.export()

        Returns:
            RLDS-compatible dict (single episode).
        """
        frames = pipeline_result.get("frames", [])
        hand_pose_frames = pipeline_result.get("hand_pose", {}).get("frames", [])
        action_phases = pipeline_result.get("actions", [])

        steps = []
        for i, frame in enumerate(frames):
            frame_idx = frame.get("frame_index", i)
            timestamp = frame.get("timestamp_sec", 0.0)

            # Find corresponding hand_pose (by frame_index)
            hp = next(
                (f for f in hand_pose_frames if f.get("frame_index") == frame_idx),
                {},
            )

            # Determine action phase at this timestamp
            current_phase = "unknown"
            for phase in action_phases:
                if phase.get("start_time_sec", 0) <= timestamp <= phase.get("end_time_sec", 0):
                    current_phase = phase.get("phase", "unknown")
                    break

            step = {
                "is_first": i == 0,
                "is_last": i == len(frames) - 1,
                "is_terminal": i == len(frames) - 1,
                "observation": {
                    "timestamp_sec": timestamp,
                    "right_hand_keypoints": hp.get("right_hand"),
                    "left_hand_keypoints": hp.get("left_hand"),
                    "action_phase": current_phase,
                },
                "action": {
                    "phase": current_phase,
                    "hand": "right",  # dominant hand
                },
                "reward": self._phase_to_reward(current_phase),
                "discount": 1.0,
            }
            steps.append(step)

        return {
            "rlds_version": self.RLDS_VERSION,
            "episode_metadata": {
                "submission_id": pipeline_result.get("submission_id", ""),
                "task_type": pipeline_result.get("task_type", "unknown"),
                "duration_seconds": pipeline_result.get("duration_seconds", 0.0),
                "fps": pipeline_result.get("fps", 30),
                "quality_score": pipeline_result.get("quality", {}).get(
                    "overall_score", 0.0
                ),
            },
            "steps": steps,
        }

    @staticmethod
    def _phase_to_reward(phase: str) -> float:
        """Map action phase to a sparse reward signal."""
        rewards = {
            "manipulate": 1.0,
            "contact": 0.5,
            "approach": 0.2,
            "release": 0.3,
            "idle": 0.0,
        }
        return rewards.get(phase, 0.0)
