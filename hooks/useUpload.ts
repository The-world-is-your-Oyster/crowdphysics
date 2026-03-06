import { useState, useCallback, useRef } from "react";
import {
  submitRecordingCancellable,
  cancelActiveUpload,
} from "../lib/upload";
import { addToQueue } from "../lib/uploadQueue";

export interface UseUploadResult {
  isUploading: boolean;
  progress: number;
  error: string | null;
  submissionId: string | null;

  upload: (taskId: string, videoUri: string, durationSec: number) => Promise<void>;
  retry: () => Promise<void>;
  cancel: () => void;
  saveForLater: () => Promise<void>;
  reset: () => void;
}

export function useUpload(): UseUploadResult {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  // Store last upload params for retry
  const lastParamsRef = useRef<{
    taskId: string;
    videoUri: string;
    durationSec: number;
  } | null>(null);

  const upload = useCallback(
    async (taskId: string, videoUri: string, durationSec: number) => {
      lastParamsRef.current = { taskId, videoUri, durationSec };
      setIsUploading(true);
      setProgress(0);
      setError(null);
      setSubmissionId(null);

      try {
        const id = await submitRecordingCancellable(
          taskId,
          videoUri,
          durationSec,
          setProgress
        );
        setSubmissionId(id);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Upload failed. Please try again.";
        setError(message);
      } finally {
        setIsUploading(false);
      }
    },
    []
  );

  const retry = useCallback(async () => {
    if (!lastParamsRef.current) return;
    const { taskId, videoUri, durationSec } = lastParamsRef.current;
    await upload(taskId, videoUri, durationSec);
  }, [upload]);

  const cancel = useCallback(() => {
    cancelActiveUpload();
    setIsUploading(false);
    setProgress(0);
    setError(null);
  }, []);

  const saveForLater = useCallback(async () => {
    if (!lastParamsRef.current) return;
    const { taskId, videoUri, durationSec } = lastParamsRef.current;
    await addToQueue(taskId, videoUri, durationSec);
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setIsUploading(false);
    setProgress(0);
    setError(null);
    setSubmissionId(null);
    lastParamsRef.current = null;
  }, []);

  return {
    isUploading,
    progress,
    error,
    submissionId,
    upload,
    retry,
    cancel,
    saveForLater,
    reset,
  };
}
