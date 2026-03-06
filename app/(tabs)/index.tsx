import { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { TaskCategory, Task } from "../../lib/types";
import { getTotalAvailableEarnings } from "../../lib/mockTasks";
import { useTasks } from "../../hooks/useTasks";
import CategoryFilter from "../../components/task/CategoryFilter";
import TaskCard from "../../components/task/TaskCard";

export default function TasksScreen() {
  const [selectedCategory, setSelectedCategory] = useState<
    TaskCategory | undefined
  >(undefined);
  const { tasks, refreshing, onRefresh } = useTasks(selectedCategory);

  const totalEarnings = getTotalAvailableEarnings();

  const renderItem = useCallback(
    ({ item }: { item: Task }) => <TaskCard task={item} />,
    []
  );

  const keyExtractor = useCallback((item: Task) => item.id, []);

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>CrowdPhysics</Text>
          <View style={styles.earningsPill}>
            <Text style={styles.earningsLabel}>Available</Text>
            <Text style={styles.earningsValue}>
              ${totalEarnings.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </Text>
          </View>
        </View>
        <Text style={styles.headerSubtitle}>
          {tasks.length} task{tasks.length !== 1 ? "s" : ""} available
        </Text>
      </View>

      {/* Category filter chips */}
      <CategoryFilter
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* Task list */}
      <FlatList
        data={tasks}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={Separator}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>{"\uD83D\uDCED"}</Text>
            <Text style={styles.emptyTitle}>No tasks in this category</Text>
            <Text style={styles.emptySubtitle}>
              Try selecting a different category or pull to refresh
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 4,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0F172A",
  },
  earningsPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  earningsLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#16A34A",
  },
  earningsValue: {
    fontSize: 14,
    fontWeight: "800",
    color: "#16A34A",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  separator: {
    height: 10,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 20,
  },
});
