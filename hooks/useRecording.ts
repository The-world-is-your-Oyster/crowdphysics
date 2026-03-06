import { useRef, useCallback, useEffect } from "react";
import { useRecordingStore } from "../lib/store";
import { RECORDING } from "../lib/constants";

export function useRecording() {
  const {
    isRecording,
    currentTaskId,
    elapsedSeconds,
    videoUri,
    setRecording,
    setCurrentTaskId,
    setElapsedSeconds,
    setVideoUri,
    reset,
  } = useRecordingStore();

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => {
      setElapsedSeconds(useRecordingStore.getState().elapsedSeconds + 1);
    }, 1000);
  }, [setElapsedSeconds]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  const startRecording = useCallback(
    async (taskId: string) => {
      setCurrentTaskId(taskId);
      setElapsedSeconds(0);
      setRecording(true);
      startTimer();
      // Camera recording will be started by the RecordScreen component
    },
    [setCurrentTaskId, setElapsedSeconds, setRecording, startTimer]
  );

  const stopRecording = useCallback(async () => {
    stopTimer();
    setRecording(false);
    // Camera recording will be stopped by the RecordScreen component
  }, [stopTimer, setRecording]);

  const isOverMaxDuration = elapsedSeconds >= RECORDING.MAX_DURATION_SEC;
  const isUnderMinDuration = elapsedSeconds < RECORDING.MIN_DURATION_SEC;

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, []);

  return {
    isRecording,
    currentTaskId,
    elapsedSeconds,
    videoUri,
    isOverMaxDuration,
    isUnderMinDuration,
    formattedTime: formatTime(elapsedSeconds),
    startRecording,
    stopRecording,
    setVideoUri,
    reset,
  };
}
