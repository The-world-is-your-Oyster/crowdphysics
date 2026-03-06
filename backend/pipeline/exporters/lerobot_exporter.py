"""
LeRobot v3 Exporter — STUB

Produces a LeRobot-compatible dict structure from a CrowdPhysics
PipelineResult.  LeRobot is Hugging Face's standard for robot
learning datasets (https://github.com/huggingface/lerobot).

LeRobot v3 schema uses Parquet files with HF datasets conventions:
  - Each row is a timestep
  - Columns: observation.*, action.*, task_index, frame_index, etc.

This stub generates the correct schema structure as a Python dict.
"""

from __future__ import annotations


class LeRobotExporter:
    """
    STUB: Export pipeline results to LeRobot v3 episode format.

    Real implementation would write Parquet/HF dataset files;
    this stub returns a Python dict matching the LeRobot v3 schema.
    """

    LEROBOT_VERSION = "v3"

    def export(self, pipeline_result: dict) -> dict:
        """
        Convert a CrowdPhysics pipeline result to LeRobot v3 format.

        Args:
            pipeline_result: Normalised dict from JsonExporter.export()

        Returns:
            LeRobot v3-compatible dict with episode rows and metadata.
        """
        frames = pipeline_result.get("frames", [])
        hand_pose_frames = pipeline_result.get("hand_pose", {}).get("frames", [])
        action_phases = pipeline_result.get("actions", [])
        grasp_segments = pipeline_result.get("grasps", [])
        fps = pipeline_result.get("fps", 30)

        rows = []
        for i, frame in enumerate(frames):
            frame_idx = frame.get("frame_index", i)
            timestamp = frame.get("timestamp_sec", 0.0)

            # Find corresponding hand_pose
            hp = next(
                (f for f in hand_pose_frames if f.get("frame_index") == frame_idx),
                {},
            )

            # Current action phase
            current_phase = "unknown"
            for phase in action_phases:
                if phase.get("start_time_sec", 0) <= timestamp <= phase.get("end_time_sec", 0):
                    current_phase = phase.get("phase", "unknown")
                    break

            # Current grasp type (right hand)
            current_grasp = "none"
            for seg in grasp_segments:
                if (
                    seg.get("start_time_sec", 0) <= timestamp <= seg.get("end_time_sec", 0)
                    and seg.get("hand") == "right"
                ):
                    current_grasp = seg.get("grasp_type", "none")
                    break

            # Flatten right-hand keypoints into a flat list [x0,y0,z0, x1,y1,z1, ...]
            rh_kps = hp.get("right_hand") or []
            rh_flat = []
            for kp in rh_kps:
                rh_flat.extend([kp.get("x", 0.0), kp.get("y", 0.0), kp.get("z", 0.0)])

            row = {
                # LeRobot standard columns
                "frame_index": frame_idx,
                "timestamp": timestamp,
                "episode_index": 0,  # single episode per submission
                "task_index": 0,
                "index": i,
                # Observations
                "observation.hand_keypoints_right": rh_flat,
                "observation.action_phase": current_phase,
                "observation.grasp_type": current_grasp,
                # Action (what the robot should do — same as observed for BC)
                "action.action_phase": current_phase,
                "action.grasp_type": current_grasp,
                # Episode boundaries
                "next.done": i == len(frames) - 1,
            }
            rows.append(row)

        return {
            "lerobot_version": self.LEROBOT_VERSION,
            "dataset_info": {
                "submission_id": pipeline_result.get("submission_id", ""),
                "task_type": pipeline_result.get("task_type", "unknown"),
                "fps": fps,
                "num_frames": len(rows),
                "num_episodes": 1,
                "features": [
                    "frame_index",
                    "timestamp",
                    "observation.hand_keypoints_right",
                    "observation.action_phase",
                    "observation.grasp_type",
                    "action.action_phase",
                    "action.grasp_type",
                    "next.done",
                ],
            },
            "episodes": [
                {
                    "episode_index": 0,
                    "task": pipeline_result.get("task_type", "unknown"),
                    "length": len(rows),
                }
            ],
            "data": rows,
        }
