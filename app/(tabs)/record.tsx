import { useState, useCallback, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTaskStore } from "../../lib/store";
import { useRecording } from "../../hooks/useRecording";
import { RecordingGuide } from "../../components/recording/RecordingGuide";
import { RecordingScreen } from "../../components/recording/RecordingScreen";
import { RecordingPreview } from "../../components/recording/RecordingPreview";

type RecordingPhase = "guide" | "recording" | "preview";

export default function RecordTab() {
  const selectedTask = useTaskStore((s) => s.selectedTask);
  const {
    isRecording,
    isCountingDown,
    countdown,
    elapsedSeconds,
    videoUri,
    cameraFacing,
    formattedTime,
    formattedFileSize,
    durationProgress,
    isUnderMinDuration,
    startRecording,
    stopRecording,
    switchCamera,
    reset,
    cameraRef,
  } = useRecording();

  const [phase, setPhase] = useState<RecordingPhase>("guide");

  // Transition to preview when videoUri appears (recordAsync resolved)
  useEffect(() => {
    if (phase === "recording" && videoUri && !isRecording) {
      setPhase("preview");
    }
  }, [phase, videoUri, isRecording]);

  const handleStartRecording = useCallback(async () => {
    if (!selectedTask) return;
    setPhase("recording");
    // startRecording runs countdown then fires recordAsync (non-blocking)
    await startRecording(selectedTask.id);
  }, [selectedTask, startRecording]);

  const handleStopRecording = useCallback(async () => {
    await stopRecording();
    // When stopRecording triggers, recordAsync promise will resolve and set videoUri
    // The useEffect above will detect videoUri + !isRecording and transition to preview
  }, [stopRecording]);

  const handleReRecord = useCallback(() => {
    reset();
    setPhase("guide");
  }, [reset]);

  const handleSubmit = useCallback(() => {
    Alert.alert(
      "Video Saved",
      "Your recording has been saved locally. Upload functionality will be available in a future update.",
      [
        {
          text: "OK",
          onPress: () => {
            reset();
            setPhase("guide");
          },
        },
      ]
    );
  }, [reset]);

  // No task selected - show empty state
  if (!selectedTask) {
    return (
      <SafeAreaView style={styles.emptyContainer} edges={["bottom"]}>
        <View style={styles.emptyContent}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="videocam" size={48} color="#94A3B8" />
          </View>
          <Text style={styles.emptyTitle}>No Task Selected</Text>
          <Text style={styles.emptySubtitle}>
            Browse available tasks and tap "Start Recording" to begin capturing
            video.
          </Text>
          <TouchableOpacity style={styles.browseButton} disabled>
            <Ionicons name="list-outline" size={18} color="#64748B" />
            <Text style={styles.browseButtonText}>
              Go to Tasks tab to get started
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Phase: Guide (pre-recording instructions)
  if (phase === "guide") {
    return (
      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
        <RecordingGuide
          taskTitle={selectedTask.title}
          steps={selectedTask.steps}
          cameraPosition={selectedTask.camera_position}
          durationMin={selectedTask.duration_min}
          durationMax={selectedTask.duration_max}
          handsRequired={selectedTask.hands_required}
          onStartRecording={handleStartRecording}
        />
      </SafeAreaView>
    );
  }

  // Phase: Recording (camera view)
  if (phase === "recording") {
    return (
      <RecordingScreen
        taskTitle={selectedTask.title}
        isRecording={isRecording}
        isCountingDown={isCountingDown}
        countdown={countdown}
        elapsedSeconds={elapsedSeconds}
        formattedTime={formattedTime}
        durationProgress={durationProgress}
        isUnderMinDuration={isUnderMinDuration}
        cameraFacing={cameraFacing}
        cameraRef={cameraRef}
        onStartRecording={handleStartRecording}
        onStopRecording={handleStopRecording}
        onSwitchCamera={switchCamera}
      />
    );
  }

  // Phase: Preview (review recorded video)
  if (phase === "preview" && videoUri) {
    return (
      <RecordingPreview
        videoUri={videoUri}
        durationSeconds={elapsedSeconds}
        formattedDuration={formattedTime}
        formattedFileSize={formattedFileSize}
        onReRecord={handleReRecord}
        onSubmit={handleSubmit}
      />
    );
  }

  // Fallback: video not ready yet, could happen if recording fails
  return (
    <SafeAreaView style={styles.emptyContainer} edges={["bottom"]}>
      <View style={styles.emptyContent}>
        <Ionicons name="alert-circle-outline" size={48} color="#F59E0B" />
        <Text style={styles.emptyTitle}>Recording Issue</Text>
        <Text style={styles.emptySubtitle}>
          Something went wrong with the recording. Please try again.
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleReRecord}>
          <Ionicons name="refresh" size={18} color="#FFFFFF" />
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  emptyContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1E293B",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#F8FAFC",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  browseButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#1E293B",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  browseButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#94A3B8",
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#3B82F6",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
