import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const MOCK_TASKS = [
  {
    id: "1",
    title: "Pour water into a glass",
    category: "kitchen",
    difficulty: "easy" as const,
    payout_usd: 0.5,
    remaining_slots: 42,
    duration_min: 10,
    duration_max: 30,
  },
  {
    id: "2",
    title: "Fold a t-shirt",
    category: "organization",
    difficulty: "easy" as const,
    payout_usd: 0.5,
    remaining_slots: 88,
    duration_min: 15,
    duration_max: 45,
  },
  {
    id: "3",
    title: "Assemble a small LEGO set",
    category: "assembly",
    difficulty: "medium" as const,
    payout_usd: 1.0,
    remaining_slots: 15,
    duration_min: 60,
    duration_max: 180,
  },
  {
    id: "4",
    title: "Wipe down a kitchen counter",
    category: "cleaning",
    difficulty: "easy" as const,
    payout_usd: 0.75,
    remaining_slots: 60,
    duration_min: 15,
    duration_max: 45,
  },
];

const DIFFICULTY_COLORS = {
  easy: "#22C55E",
  medium: "#F59E0B",
  hard: "#EF4444",
};

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  kitchen: "restaurant-outline",
  cleaning: "sparkles-outline",
  organization: "grid-outline",
  assembly: "construct-outline",
  personal_care: "hand-left-outline",
  office: "briefcase-outline",
  outdoor: "leaf-outline",
};

export default function TasksScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Available Tasks</Text>
        <Text style={styles.headerSubtitle}>
          Complete tasks to earn rewards
        </Text>
      </View>
      <FlatList
        data={MOCK_TASKS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.taskCard}
            onPress={() => router.push(`/task/${item.id}`)}
            activeOpacity={0.7}
          >
            <View style={styles.taskIconContainer}>
              <Ionicons
                name={CATEGORY_ICONS[item.category] || "help-outline"}
                size={24}
                color="#3B82F6"
              />
            </View>
            <View style={styles.taskInfo}>
              <Text style={styles.taskTitle}>{item.title}</Text>
              <View style={styles.taskMeta}>
                <View
                  style={[
                    styles.difficultyBadge,
                    { backgroundColor: DIFFICULTY_COLORS[item.difficulty] + "20" },
                  ]}
                >
                  <Text
                    style={[
                      styles.difficultyText,
                      { color: DIFFICULTY_COLORS[item.difficulty] },
                    ]}
                  >
                    {item.difficulty}
                  </Text>
                </View>
                <Text style={styles.duration}>
                  {item.duration_min}-{item.duration_max}s
                </Text>
                <Text style={styles.slots}>{item.remaining_slots} left</Text>
              </View>
            </View>
            <View style={styles.payoutContainer}>
              <Text style={styles.payoutAmount}>
                ${item.payout_usd.toFixed(2)}
              </Text>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
            </View>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  taskIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 6,
  },
  taskMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  duration: {
    fontSize: 12,
    color: "#64748B",
  },
  slots: {
    fontSize: 12,
    color: "#64748B",
  },
  payoutContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginLeft: 8,
  },
  payoutAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#22C55E",
  },
  separator: {
    height: 10,
  },
});
