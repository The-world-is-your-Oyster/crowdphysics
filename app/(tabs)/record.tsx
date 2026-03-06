import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RecordScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.content}>
        <View style={styles.cameraPlaceholder}>
          <Ionicons name="videocam" size={64} color="#94A3B8" />
          <Text style={styles.placeholderText}>Camera Preview</Text>
          <Text style={styles.placeholderSubtext}>
            Select a task first, then start recording
          </Text>
        </View>

        <View style={styles.controls}>
          <View style={styles.infoRow}>
            <Ionicons name="information-circle-outline" size={20} color="#64748B" />
            <Text style={styles.infoText}>
              Navigate to a task and tap "Start Recording" to begin
            </Text>
          </View>

          <TouchableOpacity style={styles.recordButton} disabled>
            <View style={styles.recordButtonInner}>
              <View style={styles.recordDot} />
            </View>
          </TouchableOpacity>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>00:00</Text>
              <Text style={styles.statLabel}>Duration</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>--</Text>
              <Text style={styles.statLabel}>Task</Text>
            </View>
          </View>
        </View>
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
    justifyContent: "space-between",
  },
  cameraPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1E293B",
    margin: 20,
    borderRadius: 16,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#94A3B8",
    marginTop: 16,
  },
  placeholderSubtext: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 40,
  },
  controls: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: "center",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 24,
    backgroundColor: "#1E293B",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  infoText: {
    fontSize: 13,
    color: "#94A3B8",
    flex: 1,
  },
  recordButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: "#475569",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    opacity: 0.5,
  },
  recordButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#334155",
    alignItems: "center",
    justifyContent: "center",
  },
  recordDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#64748B",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#F8FAFC",
  },
  statLabel: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: "#334155",
  },
});
