import { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Video, ResizeMode, AVPlaybackStatus } from "expo-av";
import { Ionicons } from "@expo/vector-icons";

interface RecordingPreviewProps {
  videoUri: string;
  durationSeconds: number;
  formattedDuration: string;
  formattedFileSize: string;
  onReRecord: () => void;
  onSubmit: () => void;
}

export function RecordingPreview({
  videoUri,
  durationSeconds,
  formattedDuration,
  formattedFileSize,
  onReRecord,
  onSubmit,
}: RecordingPreviewProps) {
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [checklist, setChecklist] = useState({
    handsVisible: false,
    taskCompleted: false,
  });

  const toggleCheck = useCallback((key: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const allChecked = checklist.handsVisible && checklist.taskCompleted;

  const handlePlaybackStatusUpdate = useCallback(
    (status: AVPlaybackStatus) => {
      if (status.isLoaded) {
        setIsPlaying(status.isPlaying);
      }
    },
    []
  );

  const togglePlayback = useCallback(async () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      const status = await videoRef.current.getStatusAsync();
      if (status.isLoaded && status.positionMillis >= (status.durationMillis ?? 0)) {
        await videoRef.current.replayAsync();
      } else {
        await videoRef.current.playAsync();
      }
    }
  }, [isPlaying]);

  const handleSubmit = useCallback(() => {
    if (!allChecked) {
      Alert.alert(
        "Quality Check",
        "Please confirm both checklist items before submitting.",
        [{ text: "OK" }]
      );
      return;
    }
    onSubmit();
  }, [allChecked, onSubmit]);

  return (
    <View style={styles.container}>
      {/* Video Player */}
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          source={{ uri: videoUri }}
          style={styles.video}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay={false}
          isLooping={false}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        />

        {/* Play/Pause overlay */}
        <TouchableOpacity
          style={styles.playOverlay}
          onPress={togglePlayback}
          activeOpacity={0.8}
        >
          {!isPlaying && (
            <View style={styles.playButton}>
              <Ionicons name="play" size={32} color="#FFFFFF" />
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Recording Info */}
      <View style={styles.infoBar}>
        <View style={styles.infoItem}>
          <Ionicons name="time-outline" size={18} color="#3B82F6" />
          <Text style={styles.infoText}>{formattedDuration}</Text>
        </View>
        <View style={styles.infoDivider} />
        <View style={styles.infoItem}>
          <Ionicons name="document-outline" size={18} color="#3B82F6" />
          <Text style={styles.infoText}>{formattedFileSize}</Text>
        </View>
      </View>

      {/* Quality Checklist */}
      <View style={styles.checklistContainer}>
        <Text style={styles.checklistTitle}>Quality Checklist</Text>

        <TouchableOpacity
          style={styles.checkItem}
          onPress={() => toggleCheck("handsVisible")}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.checkbox,
              checklist.handsVisible && styles.checkboxChecked,
            ]}
          >
            {checklist.handsVisible && (
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
            )}
          </View>
          <Text style={styles.checkText}>Are both hands visible?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checkItem}
          onPress={() => toggleCheck("taskCompleted")}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.checkbox,
              checklist.taskCompleted && styles.checkboxChecked,
            ]}
          >
            {checklist.taskCompleted && (
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
            )}
          </View>
          <Text style={styles.checkText}>Did you complete the task?</Text>
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.reRecordButton}
          onPress={onReRecord}
          activeOpacity={0.7}
        >
          <Ionicons name="refresh" size={20} color="#475569" />
          <Text style={styles.reRecordText}>Re-record</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.submitButton,
            !allChecked && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          activeOpacity={0.7}
        >
          <Ionicons
            name="cloud-upload-outline"
            size={20}
            color={allChecked ? "#FFFFFF" : "#94A3B8"}
          />
          <Text
            style={[
              styles.submitText,
              !allChecked && styles.submitTextDisabled,
            ]}
          >
            Submit
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },

  // Video
  videoContainer: {
    flex: 1,
    backgroundColor: "#000000",
  },
  video: {
    flex: 1,
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 4,
  },

  // Info bar
  infoBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    paddingVertical: 12,
    backgroundColor: "#1E293B",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#F8FAFC",
  },
  infoDivider: {
    width: 1,
    height: 18,
    backgroundColor: "#334155",
  },

  // Checklist
  checklistContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  checklistTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#F8FAFC",
    marginBottom: 12,
  },
  checkItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#475569",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#22C55E",
    borderColor: "#22C55E",
  },
  checkText: {
    fontSize: 15,
    color: "#CBD5E1",
    fontWeight: "500",
  },

  // Actions
  actionBar: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  reRecordButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#334155",
    backgroundColor: "#1E293B",
  },
  reRecordText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#CBD5E1",
  },
  submitButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#22C55E",
  },
  submitButtonDisabled: {
    backgroundColor: "#334155",
  },
  submitText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  submitTextDisabled: {
    color: "#94A3B8",
  },
});
