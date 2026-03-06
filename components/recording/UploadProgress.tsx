import { useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

interface UploadProgressProps {
  progress: number; // 0-100
  onCancel: () => void;
}

/**
 * Circular progress indicator rendered as a ring using a simple border approach.
 * Displays upload percentage in the center.
 */
export function UploadProgress({ progress, onCancel }: UploadProgressProps) {
  const clampedProgress = Math.max(0, Math.min(100, Math.round(progress)));

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.content}>
        {/* Circular progress display */}
        <View style={styles.progressCircleOuter}>
          <View style={styles.progressCircleInner}>
            <Text style={styles.progressPercentage}>{clampedProgress}%</Text>
          </View>
          {/* SVG-free progress ring: use a colored border trick */}
          <View
            style={[
              styles.progressFill,
              {
                // Use opacity to indicate progress visually
                borderColor:
                  clampedProgress >= 100 ? "#22C55E" : "#3B82F6",
              },
            ]}
          />
        </View>

        {/* Progress bar (linear fallback for clear visual) */}
        <View style={styles.linearBarContainer}>
          <View style={styles.linearBarTrack}>
            <View
              style={[
                styles.linearBarFill,
                {
                  width: `${clampedProgress}%`,
                  backgroundColor:
                    clampedProgress >= 100 ? "#22C55E" : "#3B82F6",
                },
              ]}
            />
          </View>
        </View>

        {/* Status text */}
        <View style={styles.statusContainer}>
          <Ionicons name="cloud-upload-outline" size={20} color="#94A3B8" />
          <Text style={styles.statusText}>
            {clampedProgress >= 100
              ? "Finalizing..."
              : "Uploading your recording..."}
          </Text>
        </View>

        <Text style={styles.hint}>
          Please keep the app open until the upload completes.
        </Text>

        {/* Cancel button */}
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onCancel}
          activeOpacity={0.7}
        >
          <Ionicons name="close-circle-outline" size={20} color="#EF4444" />
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },

  // Circular progress
  progressCircleOuter: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 8,
    borderColor: "#1E293B",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
    position: "relative",
  },
  progressCircleInner: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: "#0F172A",
    alignItems: "center",
    justifyContent: "center",
  },
  progressPercentage: {
    fontSize: 40,
    fontWeight: "800",
    color: "#F8FAFC",
  },
  progressFill: {
    position: "absolute",
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    borderRadius: 80,
    borderWidth: 8,
    borderColor: "#3B82F6",
    // The border-based ring is a simplified approach;
    // for a true partial ring, use react-native-svg in a future iteration
  },

  // Linear progress bar
  linearBarContainer: {
    width: "100%",
    marginBottom: 24,
  },
  linearBarTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#1E293B",
    overflow: "hidden",
  },
  linearBarFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#3B82F6",
  },

  // Status
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#CBD5E1",
  },
  hint: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 40,
  },

  // Cancel
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#334155",
    backgroundColor: "#1E293B",
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#EF4444",
  },
});
