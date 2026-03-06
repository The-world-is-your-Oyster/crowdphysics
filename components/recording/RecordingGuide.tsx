import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface RecordingGuideProps {
  taskTitle: string;
  steps: string[];
  cameraPosition: string;
  durationMin: number;
  durationMax: number;
  handsRequired: string;
  onStartRecording: () => void;
}

export function RecordingGuide({
  taskTitle,
  steps,
  cameraPosition,
  durationMin,
  durationMax,
  handsRequired,
  onStartRecording,
}: RecordingGuideProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Task Header */}
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Ionicons name="videocam" size={28} color="#3B82F6" />
          </View>
          <Text style={styles.title}>{taskTitle}</Text>
          <Text style={styles.subtitle}>
            Follow the steps below, then tap Start Recording
          </Text>
        </View>

        {/* Task Steps */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          {steps.map((step, index) => (
            <View key={index} style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        {/* Camera Position */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Camera Setup</Text>
          <View style={styles.cameraNote}>
            <Ionicons name="camera-outline" size={22} color="#3B82F6" />
            <View style={styles.cameraTextContainer}>
              <Text style={styles.cameraLabel}>Suggested Position</Text>
              <Text style={styles.cameraText}>{cameraPosition}</Text>
            </View>
          </View>
        </View>

        {/* Recording Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recording Details</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoCard}>
              <Ionicons name="time-outline" size={20} color="#8B5CF6" />
              <Text style={styles.infoValue}>
                {durationMin}-{durationMax}s
              </Text>
              <Text style={styles.infoLabel}>Duration</Text>
            </View>
            <View style={styles.infoCard}>
              <Ionicons name="hand-left-outline" size={20} color="#F59E0B" />
              <Text style={styles.infoValue}>
                {handsRequired === "both" ? "Both" : "One"}
              </Text>
              <Text style={styles.infoLabel}>Hands</Text>
            </View>
            <View style={styles.infoCard}>
              <Ionicons name="videocam-outline" size={20} color="#22C55E" />
              <Text style={styles.infoValue}>720p</Text>
              <Text style={styles.infoLabel}>Quality</Text>
            </View>
          </View>
        </View>

        {/* Tips */}
        <View style={styles.tipsContainer}>
          <Ionicons name="bulb-outline" size={18} color="#F59E0B" />
          <Text style={styles.tipsText}>
            Ensure good lighting and a stable camera position. Keep both hands
            visible if required.
          </Text>
        </View>
      </ScrollView>

      {/* Start Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={onStartRecording}
          activeOpacity={0.8}
        >
          <Ionicons name="play" size={22} color="#FFFFFF" />
          <Text style={styles.startButtonText}>Start Recording</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    alignItems: "center",
    paddingTop: 24,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 12,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#3B82F6",
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
    paddingTop: 4,
  },
  cameraNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#EFF6FF",
    padding: 14,
    borderRadius: 12,
  },
  cameraTextContainer: {
    flex: 1,
  },
  cameraLabel: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "500",
    marginBottom: 2,
  },
  cameraText: {
    fontSize: 14,
    color: "#1E40AF",
    fontWeight: "600",
  },
  infoGrid: {
    flexDirection: "row",
    gap: 10,
  },
  infoCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  infoLabel: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "500",
  },
  tipsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginHorizontal: 20,
    marginTop: 24,
    backgroundColor: "#FEF9C3",
    padding: 14,
    borderRadius: 12,
  },
  tipsText: {
    flex: 1,
    fontSize: 13,
    color: "#854D0E",
    lineHeight: 18,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#EF4444",
    paddingVertical: 16,
    borderRadius: 12,
  },
  startButtonText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
