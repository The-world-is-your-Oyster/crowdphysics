import { File, Paths } from "expo-file-system";
import { submitRecording } from "./upload";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface QueuedUpload {
  id: string;
  taskId: string;
  videoUri: string;
  durationSec: number;
  createdAt: string;
  status: "pending" | "uploading" | "failed";
  retryCount: number;
  lastError?: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const QUEUE_FILENAME = "upload_queue.json";
const MAX_RETRIES = 3;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getQueueFile(): File {
  return new File(Paths.document, QUEUE_FILENAME);
}

function generateId(): string {
  return `upload_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

async function loadQueue(): Promise<QueuedUpload[]> {
  try {
    const file = getQueueFile();
    if (!file.exists) return [];
    const raw = await file.text();
    if (!raw) return [];
    return JSON.parse(raw) as QueuedUpload[];
  } catch {
    return [];
  }
}

async function saveQueue(queue: QueuedUpload[]): Promise<void> {
  const file = getQueueFile();
  file.write(JSON.stringify(queue));
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Add a recording to the offline upload queue.
 */
export async function addToQueue(
  taskId: string,
  videoUri: string,
  durationSec: number
): Promise<void> {
  const queue = await loadQueue();
  const entry: QueuedUpload = {
    id: generateId(),
    taskId,
    videoUri,
    durationSec,
    createdAt: new Date().toISOString(),
    status: "pending",
    retryCount: 0,
  };
  queue.push(entry);
  await saveQueue(queue);
}

/**
 * Get the current upload queue.
 */
export async function getQueue(): Promise<QueuedUpload[]> {
  return loadQueue();
}

/**
 * Remove a specific item from the queue.
 */
export async function removeFromQueue(id: string): Promise<void> {
  const queue = await loadQueue();
  const filtered = queue.filter((item) => item.id !== id);
  await saveQueue(filtered);
}

/**
 * Update a queue item's status.
 */
async function updateQueueItem(
  id: string,
  updates: Partial<QueuedUpload>
): Promise<void> {
  const queue = await loadQueue();
  const idx = queue.findIndex((item) => item.id === id);
  if (idx !== -1) {
    queue[idx] = { ...queue[idx], ...updates };
    await saveQueue(queue);
  }
}

/**
 * Process all pending/failed items in the queue.
 * Attempts upload for each item up to MAX_RETRIES.
 */
export async function processQueue(
  onItemProgress?: (id: string, progress: number) => void
): Promise<{ succeeded: number; failed: number }> {
  const queue = await loadQueue();
  const eligible = queue.filter(
    (item) =>
      (item.status === "pending" || item.status === "failed") &&
      item.retryCount < MAX_RETRIES
  );

  let succeeded = 0;
  let failed = 0;

  for (const item of eligible) {
    try {
      await updateQueueItem(item.id, { status: "uploading" });

      await submitRecording(
        item.taskId,
        item.videoUri,
        item.durationSec,
        (progress) => onItemProgress?.(item.id, progress)
      );

      // Upload succeeded - remove from queue
      await removeFromQueue(item.id);
      succeeded += 1;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error";
      await updateQueueItem(item.id, {
        status: "failed",
        retryCount: item.retryCount + 1,
        lastError: errorMessage,
      });
      failed += 1;
    }
  }

  return { succeeded, failed };
}

/**
 * Get the count of pending uploads in the queue.
 */
export async function getQueueCount(): Promise<number> {
  const queue = await loadQueue();
  return queue.length;
}

/**
 * Clear all items from the queue.
 */
export async function clearQueue(): Promise<void> {
  try {
    const file = getQueueFile();
    if (file.exists) {
      file.delete();
    }
  } catch {
    // Ignore cleanup errors
  }
}
