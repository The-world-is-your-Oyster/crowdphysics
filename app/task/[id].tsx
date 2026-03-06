import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const MOCK_TASKS: Record<string, {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  description: string;
  steps: string[];
  payout_usd: number;
  duration_min: number;
  duration_max: number;
  hands_required: string;
  objects_expected: string[];
  camera_position: string;
  remaining_slots: number;
}> = {
  "1": {
    id: "1",
    title: "Pour water into a glass",
    category: "kitchen",
    difficulty: "easy",
    description:
      "Record yourself pouring water from a bottle or pitcher into a glass. The camera should clearly capture your hands, the container, and the glass throughout the pouring motion.",
    steps: [
      "Place a glass on a flat surface",
      "Hold the water container in one hand",
      "Begin recording",
      "Slowly pour water into the glass until 3/4 full",
      "Set the container down",
      "Stop recording",
    ],
    payout_usd: 0.5,
    duration_min: 10,
    duration_max: 30,
    hands_required: "both",
    objects_expected: ["glass", "water bottle or pitcher"],
    camera_position: "Front-facing, table level",
    remaining_slots: 42,
  },
  "2": {
    id: "2",
    title: "Fold a t-shirt",
    category: "organization",
    difficulty: "easy",
    description:
      "Record yourself folding a t-shirt using any folding method. The entire shirt and your hands must be visible throughout.",
    steps: [
      "Lay t-shirt flat on a surface",
      "Begin recording",
      "Fold the t-shirt neatly",
      "Place the folded shirt down",
      "Stop recording",
    ],
    payout_usd: 0.5,
    duration_min: 15,
    duration_max: 45,
    hands_required: "both",
    objects_expected: ["t-shirt"],
    camera_position: "Top-down or slight angle",
    remaining_slots: 88,
  },
};

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "#22C55E",
  medium: "#F59E0B",
  hard: "#EF4444",
};

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const task = MOCK_TASKS[id ?? ""] ?? MOCK_TASKS["1"];

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroSection}>
          <View
            style={[
              styles.difficultyBadge,
              { backgroundColor: (DIFFICULTY_COLORS[task.difficulty] || "#94A3B8") + "20" },
            ]}
          >
            <Text
              style={[
                styles.difficultyText,
                { color: DIFFICULTY_COLORS[task.difficulty] || "#94A3B8" },
              ]}
            >
              {task.difficulty}
            </Text>
          </View>
          <Text style={styles.title}>{task.title}</Text>
          <Text style={styles.description}>{task.description}</Text>
        </View>

        <View style={styles.infoGrid}>
          <InfoCard
            icon="cash-outline"
            label="Payout"
            value={`$${task.payout_usd.toFixed(2)}`}
            color="#22C55E"
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Required Objects</Text>
          <View style={styles.tagRow}>
            {task.objects_expected.map((obj, i) => (
              <View key={i} style={styles.tag}>
                <Text style={styles.tagText}>{obj}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Camera Position</Text>
          <View style={styles.cameraNote}>
            <Ionicons name="camera-outline" size={20} color="#3B82F6" />
            <Text style={styles.cameraText}>{task.camera_position}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => router.push("/(tabs)/record")}
        >
          <Ionicons name="videocam" size={22} color="#FFFFFF" />
          <Text style={styles.startButtonText}>Start Recording</Text>
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
    paddingBottom: 100,
  },
  heroSection: {
    padding: 20,
  },
  difficultyBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 12,
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
    backgroundColor: "#3B82F6",
    paddingVertical: 16,
    borderRadius: 12,
  },
  startButtonText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
