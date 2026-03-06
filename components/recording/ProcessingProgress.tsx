/**
 * ProcessingProgress — shown during the face blur processing phase.
 *
 * Matches the visual style of UploadProgress but uses different labels
 * to communicate that face detection / blur is running on-device.
 */

import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import type { ProcessingStatus } from "../../hooks/useVideoProcessing";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface ProcessingProgressProps {
  /** 0–100 overall progress */
  progress: number;
  /** Current phase from the processing hook */
  status: ProcessingStatus;
  /** Called if the user cancels (before upload starts) */
  onCancel: () => void;
}

// ─── Status label helper ───────────────────────────────────────────────────────

function statusLabel(status: ProcessingStatus, progress: number): string {
  if (status === "detecting") return "Detecting faces...";
  if (status === "blurring") return "Applying face blur...";
  if (progress >= 100) return "Processing complete";
  return "Processing video...";
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function ProcessingProgress({
  progress,
  status,
  onCancel,
}: ProcessingProgressProps) {
  const clampedProgress = Math.max(0, Math.min(100, Math.round(progress)));
  const isDone = clampedProgress >= 100;

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.content}>
        {/* Icon */}
        <View style={styles.iconCircle}>
          <Ionicons
            name={isDone ? "checkmark-circle" : "eye-off-outline"}
            size={36}
            color={isDone ? "#22C55E" : "#3B82F6"}
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>Privacy Processing</Text>
        <Text style={styles.subtitle}>
          {statusLabel(status, clampedProgress)}
        </Text>

        {/* Percentage */}
        <Text style={styles.percentage}>{clampedProgress}%</Text>

        {/* Linear progress bar */}
        <View style={styles.barContainer}>
          <View style={styles.barTrack}>
            <View
              style={[
                styles.barFill,
                {
                  width: `${clampedProgress}%`,
                  backgroundColor: isDone ? "#22C55E" : "#3B82F6",
                },
              ]}
            />
          </View>
        </View>

        {/* Phase indicators */}
        <View style={styles.phaseRow}>
          <PhaseIndicator
            icon="search-outline"
            label="Detect"
            active={status === "detecting"}
            done={
              status === "blurring" || status === "done" || clampedProgress >= 50
            }
          />
          <View style={styles.phaseConnector} />
          <PhaseIndicator
            icon="eye-off-outline"
            label="Blur"
            active={status === "blurring"}
            done={status === "done" || clampedProgress >= 100}
          />
          <View style={styles.phaseConnector} />
          <PhaseIndicator
            icon="checkmark-circle-outline"
            label="Done"
            active={false}
            done={clampedProgress >= 100}
          />
        </View>

        <Text style={styles.hint}>
          All faces are blurred on-device before upload.
        </Text>

        {/* Cancel (only visible while processing, not when done) */}
        {!isDone && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onCancel}
            activeOpacity={0.7}
          >
            <Ionicons name="close-circle-outline" size={20} color="#EF4444" />
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

// ─── Phase indicator helper ────────────────────────────────────────────────────

interface PhaseIndicatorProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active: boolean;
  done: boolean;
}

function PhaseIndicator({ icon, label, active, done }: PhaseIndicatorProps) {
  const color = done ? "#22C55E" : active ? "#3B82F6" : "#334155";
  return (
    <View style={styles.phaseItem}>
      <Ionicons name={icon} size={20} color={color} />
      <Text style={[styles.phaseLabel, { color }]}>{label}</Text>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

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

  // Icon
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1E293B",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  // Text
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#F8FAFC",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#94A3B8",
    marginBottom: 24,
  },
  percentage: {
    fontSize: 48,
    fontWeight: "800",
    color: "#F8FAFC",
    marginBottom: 16,
  },

  // Progress bar
  barContainer: {
    width: "100%",
    marginBottom: 28,
  },
  barTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#1E293B",
    overflow: "hidden",
  },
  barFill: {
    height: 8,
    borderRadius: 4,
  },

  // Phase row
  phaseRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  phaseItem: {
    alignItems: "center",
    gap: 4,
  },
  phaseLabel: {
    fontSize: 11,
    fontWeight: "600",
  },
  phaseConnector: {
    width: 28,
    height: 1,
    backgroundColor: "#334155",
    marginHorizontal: 8,
  },

  // Hint
  hint: {
    fontSize: 13,
    color: "#475569",
    textAlign: "center",
    marginBottom: 32,
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
