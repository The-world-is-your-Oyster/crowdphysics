import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";
import api from "./api";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface UploadConfig {
  videoUri: string;
  submissionId: string;
  onProgress: (progress: number) => void;
}

interface CreateSubmissionPayload {
  device_model: string;
  has_lidar: boolean;
  duration_sec: number;
  file_size_bytes: number;
}

interface CreateSubmissionResponse {
  submission_id: string;
}

interface PresignedUrlResponse {
  upload_url: string;
}

// ─── Device Info Helper ──────────────────────────────────────────────────────

function getDeviceModel(): string {
  // expo-device not in deps; use Platform as fallback
  if (Platform.OS === "ios") {
    return `iOS ${Platform.Version}`;
  }
  if (Platform.OS === "android") {
    return `Android ${Platform.Version}`;
  }
  return `${Platform.OS}`;
}

function getHasLidar(): boolean {
  // LiDAR detection requires native module; default false for MVP
  // iPhone 12 Pro+ have LiDAR but we cannot detect without expo-device constants
  return false;
}

// ─── API Calls ───────────────────────────────────────────────────────────────

/**
 * Step 1: Create a submission record on the backend.
 * Returns the submission_id used to track this upload.
 */
export async function createSubmission(
  taskId: string,
  metadata: CreateSubmissionPayload
): Promise<string> {
  const response = await api.post<CreateSubmissionResponse>(
    `/submissions/${taskId}`,
    metadata
  );
  return response.data.submission_id;
}

/**
 * Step 2: Get a presigned S3 URL for direct upload.
 */
export async function getPresignedUrl(submissionId: string): Promise<string> {
  const response = await api.get<PresignedUrlResponse>(
    `/submissions/${submissionId}/upload-url`
  );
  return response.data.upload_url;
}

/**
 * Step 3: Upload video binary to the presigned S3 URL.
 * Uses XMLHttpRequest for progress tracking (fetch does not support upload progress).
 */
export async function uploadVideo(config: UploadConfig): Promise<void> {
  const { videoUri, onProgress } = config;
  const presignedUrl = await getPresignedUrl(config.submissionId);

  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable && event.total > 0) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress(100);
        resolve();
      } else {
        reject(
          new Error(`Upload failed with status ${xhr.status}: ${xhr.statusText}`)
        );
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Network error during upload"));
    });

    xhr.addEventListener("abort", () => {
      reject(new Error("Upload cancelled"));
    });

    xhr.open("PUT", presignedUrl);
    xhr.setRequestHeader("Content-Type", "video/mp4");

    // React Native XMLHttpRequest supports sending local file URIs directly
    xhr.send({ uri: videoUri } as unknown as BodyInit);
  });
}

/**
 * Step 4: Confirm upload completion on the backend.
 */
export async function confirmUpload(submissionId: string): Promise<void> {
  await api.post(`/submissions/${submissionId}/confirm`);
}

// ─── Full Upload Flow ────────────────────────────────────────────────────────

/**
 * Orchestrates the complete upload pipeline:
 * 1. Get file info (size)
 * 2. Create submission via API
 * 3. Get presigned URL
 * 4. Upload video with progress
 * 5. Confirm upload
 *
 * Returns the submission_id.
 */
export async function submitRecording(
  taskId: string,
  videoUri: string,
  durationSec: number,
  onProgress: (progress: number) => void
): Promise<string> {
  // Step 1: Get file size
  const fileInfo = await FileSystem.getInfoAsync(videoUri);
  let fileSizeBytes = 0;
  if (fileInfo.exists && "size" in fileInfo) {
    fileSizeBytes = fileInfo.size;
  }

  // Step 2: Create submission record
  const submissionId = await createSubmission(taskId, {
    device_model: getDeviceModel(),
    has_lidar: getHasLidar(),
    duration_sec: durationSec,
    file_size_bytes: fileSizeBytes,
  });

  // Steps 3-4: Get presigned URL + upload with progress
  await uploadVideo({
    videoUri,
    submissionId,
    onProgress,
  });

  // Step 5: Confirm upload
  await confirmUpload(submissionId);

  return submissionId;
}

// ─── XHR Handle for Cancellation ─────────────────────────────────────────────

/** Active XHR reference for cancellation support. */
let activeXhr: XMLHttpRequest | null = null;

/**
 * Same as submitRecording but stores the XHR handle for cancel support.
 * Returns submission_id.
 */
export async function submitRecordingCancellable(
  taskId: string,
  videoUri: string,
  durationSec: number,
  onProgress: (progress: number) => void
): Promise<string> {
  const fileInfo = await FileSystem.getInfoAsync(videoUri);
  let fileSizeBytes = 0;
  if (fileInfo.exists && "size" in fileInfo) {
    fileSizeBytes = fileInfo.size;
  }

  const submissionId = await createSubmission(taskId, {
    device_model: getDeviceModel(),
    has_lidar: getHasLidar(),
    duration_sec: durationSec,
    file_size_bytes: fileSizeBytes,
  });

  const presignedUrl = await getPresignedUrl(submissionId);

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    activeXhr = xhr;

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable && event.total > 0) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    });

    xhr.addEventListener("load", () => {
      activeXhr = null;
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress(100);
        resolve();
      } else {
        reject(
          new Error(`Upload failed with status ${xhr.status}: ${xhr.statusText}`)
        );
      }
    });

    xhr.addEventListener("error", () => {
      activeXhr = null;
      reject(new Error("Network error during upload"));
    });

    xhr.addEventListener("abort", () => {
      activeXhr = null;
      reject(new Error("Upload cancelled"));
    });

    xhr.open("PUT", presignedUrl);
    xhr.setRequestHeader("Content-Type", "video/mp4");
    xhr.send({ uri: videoUri } as unknown as BodyInit);
  });

  await confirmUpload(submissionId);
  return submissionId;
}

/**
 * Abort the active upload XHR, if one exists.
 */
export function cancelActiveUpload(): void {
  if (activeXhr) {
    activeXhr.abort();
    activeXhr = null;
  }
}
