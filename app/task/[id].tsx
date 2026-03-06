import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTaskDetail } from "../../hooks/useTasks";
import { CATEGORY_EMOJI, CATEGORY_LABEL } from "../../lib/mockTasks";
import { useTaskStore } from "../../lib/store";
import DifficultyBadge from "../../components/task/DifficultyBadge";

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { task } = useTaskDetail(id ?? "");
  const setSelectedTask = useTaskStore((s) => s.setSelectedTask);

  if (!task) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Task not found</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.goBackLink}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero section */}
        <View style={styles.heroSection}>
          <View style={styles.heroTopRow}>
            <DifficultyBadge difficulty={task.difficulty} size="md" />
            <Text style={styles.categoryChip}>
              {CATEGORY_EMOJI[task.category]} {CATEGORY_LABEL[task.category]}
            </Text>
          </View>
          <Text style={styles.title}>{task.title}</Text>
          <Text style={styles.titleZh}>{task.title_zh}</Text>
          <Text style={styles.description}>{task.description}</Text>
        </View>

        {/* Info grid */}
        <View style={styles.infoGrid}>
          <InfoCard
            icon="cash-outline"
            label="Payout"
            value={`$${task.payout_usd.toFixed(2)}`}
            color="#16A34A"
          />
          <InfoCard
            icon="time-outline"
            label="Duration"
            value={`${task.duration_min}-${task.duration_max}s`}
            color="#3B82F6"
          />
          <InfoCard
            icon="hand-left-outline"
            label="Hands"
            value={task.hands_required === "both" ? "Both" : "One"}
            color="#8B5CF6"
          />
          <InfoCard
            icon="layers-outline"
            label="Slots Left"
            value={`${task.remaining_slots}`}
            color="#F59E0B"
          />
        </View>

        {/* What you need */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What You Need</Text>
          <View style={styles.tagRow}>
            {task.objects_expected.map((obj, i) => (
              <View key={i} style={styles.tag}>
                <Text style={styles.tagText}>{obj}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Steps */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Steps</Text>
          {task.steps.map((step, index) => (
            <View key={index} style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        {/* Camera position */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Camera Position</Text>
          <View style={styles.cameraNote}>
            <Ionicons name="camera-outline" size={20} color="#3B82F6" />
            <Text style={styles.cameraText}>{task.camera_position}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Community Stats</Text>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {task.total_completed.toLocaleString()}
              </Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{task.remaining_slots}</Text>
              <Text style={styles.statLabel}>Slots Remaining</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => {
            setSelectedTask(task);
            router.push("/(tabs)/record");
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="videocam" size={22} color="#FFFFFF" />
          <Text style={styles.startButtonText}>
            Start Recording {"\u2014"} Earn ${task.payout_usd.toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function InfoCard({
  icon,
  label,
  value,
  color,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <View style={styles.infoCard}>
      <Ionicons name={icon} size={22} color={color} />
      <Text style={styles.infoValue}>{value}</Text>
      <Text style={styles.infoLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    paddingBottom: 110,
  },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  notFoundText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  goBackLink: {
    fontSize: 15,
    color: "#3B82F6",
    fontWeight: "600",
  },
  heroSection: {
    padding: 20,
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  categoryChip: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: "hidden",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 4,
  },
  titleZh: {
    fontSize: 16,
    color: "#94A3B8",
    marginBottom: 14,
  },
  description: {
    fontSize: 15,
    color: "#475569",
    lineHeight: 22,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 8,
  },
  infoCard: {
    flex: 1,
    minWidth: "45%",
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
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  infoLabel: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "500",
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 12,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 13,
    color: "#475569",
    fontWeight: "500",
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
    gap: 10,
    backgroundColor: "#EFF6FF",
    padding: 14,
    borderRadius: 10,
  },
  cameraText: {
    fontSize: 14,
    color: "#1E40AF",
    fontWeight: "500",
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    gap: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
  },
  statLabel: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "500",
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
    backgroundColor: "#16A34A",
    paddingVertical: 16,
    borderRadius: 14,
    shadowColor: "#16A34A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
