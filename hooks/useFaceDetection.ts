/**
 * useFaceDetection — STUB implementation.
 *
 * Real on-device face detection in Expo managed workflow requires either:
 *   - expo-face-detector (deprecated, removed from newer Expo SDKs)
 *   - react-native-vision-camera with the face-detection frame-processor plugin
 *     (requires bare/development build — incompatible with Expo Go)
 *
 * This stub simulates face detection with realistic latency and returns mock
 * bounding boxes so the rest of the processing pipeline has the correct interface.
 * Swap `detectFacesStub` for a real implementation once the project ejects or
 * uses a development build.
 */

// ─── Types ─────────────────────────────────────────────────────────────────────

/**
 * A face region detected in a single video frame.
 * Coordinates are in the frame's pixel space (origin top-left).
 */
export interface FaceRegion {
  /** Horizontal offset of the bounding box's left edge (px) */
  x: number;
  /** Vertical offset of the bounding box's top edge (px) */
  y: number;
  /** Width of the bounding box (px) */
  width: number;
  /** Height of the bounding box (px) */
  height: number;
  /** Zero-based index of the video frame this detection belongs to */
  frameIndex: number;
  /** Confidence score 0–1 (stub returns a fixed high confidence) */
  confidence: number;
}

export interface FaceDetectionOptions {
  /** Sample every N-th frame to reduce computation (default: 5) */
  sampleEveryNFrames?: number;
  /** Minimum face size in pixels to detect (default: 50) */
  minFaceSize?: number;
}

export interface FaceDetectionResult {
  faces: FaceRegion[];
  /** Total number of frames sampled */
  framesAnalyzed: number;
  /** How long detection took in ms */
  durationMs: number;
}

// ─── Stub helpers ──────────────────────────────────────────────────────────────

/**
 * Simulates a realistic detection delay: 200–800 ms per ~30 seconds of video.
 */
function simulatedDetectionDelay(videoUri: string): number {
  // Use URI length as a pseudo-random seed for consistent stubs
  const seed = videoUri.length % 100;
  return 300 + seed * 5; // 300–800 ms
}

/**
 * Generates a realistic-looking set of face bounding boxes for testing.
 * Returns 0 or 1 face in the center-ish area of a typical phone frame.
 */
function generateMockFaces(
  frameIndex: number,
  hasFace: boolean
): FaceRegion[] {
  if (!hasFace) return [];

  // Slightly vary position per-frame to simulate head movement
  const jitter = (frameIndex % 10) * 2;
  return [
    {
      x: 140 + jitter,
      y: 80 + jitter,
      width: 120,
      height: 140,
      frameIndex,
      confidence: 0.92,
    },
  ];
}

// ─── Public API ────────────────────────────────────────────────────────────────

/**
 * Detects faces in a recorded video file.
 *
 * STUB: Simulates detection with a delay and returns mock face regions.
 * The interface is designed to be a drop-in replacement for a real
 * expo-face-detector or vision-camera frame-processor implementation.
 *
 * @param videoUri  Local file URI of the recorded video
 * @param options   Optional tuning parameters
 * @returns         Detection results including face bounding boxes per frame
 */
export async function detectFaces(
  videoUri: string,
  options: FaceDetectionOptions = {}
): Promise<FaceDetectionResult> {
  const { sampleEveryNFrames = 5, minFaceSize = 50 } = options;

  const startTime = Date.now();

  // Simulate async work (network/native module call latency)
  const delay = simulatedDetectionDelay(videoUri);
  await new Promise<void>((resolve) => setTimeout(resolve, delay));

  // Simulate ~6 seconds of video at 30 fps = 180 frames, sampled every 5th
  const totalFrames = 180;
  const sampledFrames = Math.floor(totalFrames / sampleEveryNFrames);

  const faces: FaceRegion[] = [];

  // Simulate a face appearing in roughly 70% of sampled frames
  for (let i = 0; i < sampledFrames; i++) {
    const frameIndex = i * sampleEveryNFrames;
    // Face present in most frames; disappears briefly (simulates look-away)
    const hasFace = i % 7 !== 3; // absent in every 4th of 7 frames
    const detected = generateMockFaces(frameIndex, hasFace);
    detected.forEach((f) => {
      if (f.width >= minFaceSize && f.height >= minFaceSize) {
        faces.push(f);
      }
    });
  }

  return {
    faces,
    framesAnalyzed: sampledFrames,
    durationMs: Date.now() - startTime,
  };
}
