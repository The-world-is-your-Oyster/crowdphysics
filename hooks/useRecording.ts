import { useRef, useCallback, useEffect, useState } from "react";
import { CameraView } from "expo-camera";
import * as FileSystem from "expo-file-system";
import { useRecordingStore } from "../lib/store";
import { RECORDING } from "../lib/constants";

export type CameraFacing = "front" | "back";

export interface RecordingHookResult {
  // State
  isRecording: boolean;
  currentTaskId: string | null;
  elapsedSeconds: number;
  videoUri: string | null;
  cameraFacing: CameraFacing;
  countdown: number;
  isCountingDown: boolean;
  fileSizeBytes: number | null;

  // Derived
  isOverMaxDuration: boolean;
  isUnderMinDuration: boolean;
  formattedTime: string;
  formattedFileSize: string;
  durationProgress: number;

  // Actions
  startRecording: (taskId: string) => Promise<void>;
  stopRecording: () => Promise<void>;
  switchCamera: () => void;
  setVideoUri: (uri: string | null) => void;
  reset: () => void;

  // Camera ref (pass to CameraView)
  cameraRef: React.RefObject<CameraView | null>;
}

export function useRecording(): RecordingHookResult {
  const {
    isRecording,
    currentTaskId,
    elapsedSeconds,
    videoUri,
    setRecording,
    setCurrentTaskId,
    setElapsedSeconds,
    setVideoUri,
    reset: resetStore,
  } = useRecordingStore();

  const [cameraFacing, setCameraFacing] = useState<CameraFacing>("back");
  const [countdown, setCountdown] = useState(0);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [fileSizeBytes, setFileSizeBytes] = useState<number | null>(null);

  const cameraRef = useRef<CameraView | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer management
  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => {
      const current = useRecordingStore.getState().elapsedSeconds;
      setElapsedSeconds(current + 1);
    }, 1000);
  }, [setElapsedSeconds]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTimer();
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
    };
  }, [stopTimer]);

  // Auto-stop when max duration reached
  useEffect(() => {
    if (isRecording && elapsedSeconds >= RECORDING.MAX_DURATION_SEC) {
      stopRecording();
    }
  }, [isRecording, elapsedSeconds]);

  const startRecording = useCallback(
    async (taskId: string) => {
      setCurrentTaskId(taskId);
      setElapsedSeconds(0);
      setFileSizeBytes(null);

      // Start 3-second countdown
      setIsCountingDown(true);
      setCountdown(3);

      await new Promise<void>((resolve) => {
        let count = 3;
        countdownRef.current = setInterval(() => {
          count -= 1;
          if (count <= 0) {
            if (countdownRef.current) {
              clearInterval(countdownRef.current);
              countdownRef.current = null;
            }
            setCountdown(0);
            setIsCountingDown(false);
            resolve();
          } else {
            setCountdown(count);
          }
        }, 1000);
      });

      // Set recording state and start timer BEFORE calling recordAsync
      // because recordAsync is a blocking promise that resolves when recording stops
      setRecording(true);
      startTimer();

      // Start actual camera recording (fire-and-forget; resolves when recording stops)
      if (cameraRef.current) {
        cameraRef.current
          .recordAsync({
            maxDuration: RECORDING.MAX_DURATION_SEC,
          })
          .then(async (video) => {
            if (video?.uri) {
              setVideoUri(video.uri);
              try {
                const info = await FileSystem.getInfoAsync(video.uri);
                if (info.exists && "size" in info) {
                  setFileSizeBytes(info.size);
                }
              } catch {
                // File size not critical
              }
            }
          })
          .catch(() => {
            // Recording may have been stopped externally or camera unavailable
          });
      }
    },
    [setCurrentTaskId, setElapsedSeconds, setRecording, setVideoUri, startTimer]
  );

  const stopRecording = useCallback(async () => {
    stopTimer();
    setRecording(false);

    // Stop camera recording
    if (cameraRef.current) {
      try {
        cameraRef.current.stopRecording();
      } catch {
        // Camera may not be recording
      }
    }
  }, [stopTimer, setRecording]);

  const switchCamera = useCallback(() => {
    setCameraFacing((prev) => (prev === "back" ? "front" : "back"));
  }, []);

  const reset = useCallback(() => {
    stopTimer();
    resetStore();
    setCameraFacing("back");
    setCountdown(0);
    setIsCountingDown(false);
    setFileSizeBytes(null);
  }, [stopTimer, resetStore]);

  // Derived values
  const isOverMaxDuration = elapsedSeconds >= RECORDING.MAX_DURATION_SEC;
  const isUnderMinDuration = elapsedSeconds < RECORDING.MIN_DURATION_SEC;

  const durationProgress = Math.min(
    elapsedSeconds / RECORDING.MAX_DURATION_SEC,
    1
  );

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const formatFileSize = useCallback((bytes: number | null): string => {
    if (bytes === null) return "--";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }, []);

  return {
    isRecording,
    currentTaskId,
    elapsedSeconds,
    videoUri,
    cameraFacing,
    countdown,
    isCountingDown,
    fileSizeBytes,
    isOverMaxDuration,
    isUnderMinDuration,
    formattedTime: formatTime(elapsedSeconds),
    formattedFileSize: formatFileSize(fileSizeBytes),
    durationProgress,
    startRecording,
    stopRecording,
    switchCamera,
    setVideoUri,
    reset,
    cameraRef,
  };
}
