import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import type { Task } from "../../lib/types";
import { CATEGORY_EMOJI } from "../../lib/mockTasks";
import DifficultyBadge from "./DifficultyBadge";

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/task/${task.id}`)}
      activeOpacity={0.7}
    >
      {/* Left: Category emoji */}
      <View style={styles.iconContainer}>
        <Text style={styles.iconEmoji}>
          {CATEGORY_EMOJI[task.category] ?? "\u2753"}
        </Text>
      </View>

      {/* Center: Title + Chinese title */}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {task.title}
        </Text>
        <Text style={styles.titleZh} numberOfLines={1}>
          {task.title_zh}
        </Text>
        <View style={styles.metaRow}>
          <DifficultyBadge difficulty={task.difficulty} size="sm" />
          <Text style={styles.duration}>
            {task.duration_min}-{task.duration_max}s
          </Text>
        </View>
      </View>

      {/* Right: Payout + chevron */}
      <View style={styles.payoutCol}>
        <Text style={styles.payout}>${task.payout_usd.toFixed(2)}</Text>
        <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  iconEmoji: {
    fontSize: 22,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  titleZh: {
    fontSize: 12,
    color: "#94A3B8",
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  duration: {
    fontSize: 11,
    color: "#64748B",
  },
  payoutCol: {
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 4,
    marginLeft: 8,
  },
  payout: {
    fontSize: 17,
    fontWeight: "800",
    color: "#16A34A",
  },
});
