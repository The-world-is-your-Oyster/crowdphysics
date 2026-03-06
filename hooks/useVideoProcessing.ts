/**
 * useVideoProcessing — STUB implementation.
 *
 * Real on-device Gaussian blur over video frames requires a native module
 * (e.g., react-native-ffmpeg / expo bare workflow with custom native code).
 * These are incompatible with Expo managed workflow / Expo Go.
 *
 * This stub:
 *   1. Accepts a video URI + processing options
 *   2. Runs face detection via useFaceDetection
 *   3. Simulates a blur processing pass with progress reporting
 *   4. Returns the original URI (as if it were the processed output)
 *
 * When the project moves to a bare/development build, replace
 * `applyBlurStub` with a real FFmpeg-based or CoreImage implementation
 * while keeping the same interface.
 */

import { useCallback, useRef, useState } from "react";
import { detectFaces, FaceRegion } from "./useFaceDetection";
import type { BlurQuality } from "../lib/privacy";

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface VideoProcessingOptions {
  /** Whether to blur the primary user's face */
  blurOwnFace: boolean;
  /** Always true — bystander faces are always blurred */
  blurBystanders: true;
  /** Blur strength selection */
  blurQuality: BlurQuality;
}

export interface VideoProcessingResult {
  /** URI of the processed video (stub: same as input URI) */
  processedUri: string;
  /** Number of unique face regions detected across all sampled frames */
  facesDetected: number;
  /** Total processing time in milliseconds */
  processingTimeMs: number;
}

export type ProcessingStatus =
  | "idle"
  | "detecting"
  | "blurring"
  | "done"
  | "error";

export interface VideoProcessingHookResult {
  status: ProcessingStatus;
  /** 0–100 progress value for UI display */
  progress: number;
  error: string | null;
  /** Trigger processing; resolves when complete */
  processVideo: (
    videoUri: string,
    options: VideoProcessingOptions
  ) => Promise<VideoProcessingResult>;
  reset: () => void;
}

// ─── Stub blur simulation ──────────────────────────────────────────────────────

/**
 * Simulates applying Gaussian blur to detected face regions.
 * In production this would call FFmpeg or a CoreImage pipeline.
 *
 * @param faces           Face regions from detection step
 * @param blurQuality     "standard" or "high" (affects simulated duration)
 * @param onProgress      Called with 50–100 as blurring completes
 */
async function applyBlurStub(
  faces: FaceRegion[],
  blurQuality: BlurQuality,
  onProgress: (pct: number) => void
): Promise<void> {
  // High quality blurring takes ~40% longer
  const baseMs = blurQuality === "high" ? 1400 : 1000;
  const steps = 10;
  const stepMs = baseMs / steps;

  for (let i = 0; i < steps; i++) {
    await new Promise<void>((resolve) => setTimeout(resolve, stepMs));
    // Progress goes from 50 → 100 during blur phase
    onProgress(50 + Math.round(((i + 1) / steps) * 50));
  }

  // Suppress unused-variable warning — faces would be passed to native module
  void faces;
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

export function useVideoProcessing(): VideoProcessingHookResult {
  const [status, setStatus] = useState<ProcessingStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const abortedRef = useRef(false);

  const reset = useCallback(() => {
    setStatus("idle");
    setProgress(0);
    setError(null);
    abortedRef.current = false;
  }, []);

  const processVideo = useCallback(
    async (
      videoUri: string,
      options: VideoProcessingOptions
    ): Promise<VideoProcessingResult> => {
      abortedRef.current = false;
      setError(null);
      setProgress(0);

      const startTime = Date.now();

      try {
        // ── Phase 1: Face detection (0 → 50%) ─────────────────────────────
        setStatus("detecting");
        setProgress(5);

        const detectionResult = await detectFaces(videoUri, {
          sampleEveryNFrames: 5,
          minFaceSize: 50,
        });

        if (abortedRef.current) {
          throw new Error("Processing cancelled");
        }

        setProgress(50);

        // ── Phase 2: Blur application (50 → 100%) ─────────────────────────
        setStatus("blurring");

        // Filter faces depending on user preferences
        const facesToBlur = options.blurOwnFace
          ? detectionResult.faces
          : detectionResult.faces.slice(1); // keep first face (self) unblurred

        await applyBlurStub(facesToBlur, options.blurQuality, (pct) => {
          if (!abortedRef.current) setProgress(pct);
        });

        if (abortedRef.current) {
          throw new Error("Processing cancelled");
        }

        setProgress(100);
        setStatus("done");

        return {
          // Stub: return original URI as if it were the processed file
          processedUri: videoUri,
          facesDetected: detectionResult.faces.length,
          processingTimeMs: Date.now() - startTime,
        };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Processing failed";
        setError(message);
        setStatus("error");
        throw err;
      }
    },
    []
  );

  return { status, progress, error, processVideo, reset };
}
