import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface StatsRowProps {
  totalRecordings?: number;
  acceptanceRate?: number;
  avgPerTask?: number;
}

export default function StatsRow({
  totalRecordings = 42,
  acceptanceRate = 87,
  avgPerTask = 0.82,
}: StatsRowProps) {
  return (
    <View style={styles.container}>
      <View style={styles.statCard}>
        <Ionicons name="videocam-outline" size={18} color="#3B82F6" />
        <Text style={styles.statValue}>{totalRecordings}</Text>
        <Text style={styles.statLabel}>Recordings</Text>
      </View>
      <View style={styles.statCard}>
        <Ionicons name="checkmark-done-outline" size={18} color="#22C55E" />
        <Text style={styles.statValue}>{acceptanceRate}%</Text>
        <Text style={styles.statLabel}>Accepted</Text>
      </View>
      <View style={styles.statCard}>
        <Ionicons name="trending-up-outline" size={18} color="#F59E0B" />
        <Text style={styles.statValue}>${avgPerTask.toFixed(2)}</Text>
        <Text style={styles.statLabel}>Avg/Task</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: "center",
    gap: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: "#94A3B8",
  },
});
