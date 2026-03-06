import { View, Text, StyleSheet, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const MOCK_EARNINGS = [
  {
    id: "1",
    task: "Pour water into a glass",
    amount: 0.5,
    status: "accepted" as const,
    date: "2026-03-05",
  },
  {
    id: "2",
    task: "Fold a t-shirt",
    amount: 0.5,
    status: "processing" as const,
    date: "2026-03-05",
  },
  {
    id: "3",
    task: "Wipe down a counter",
    amount: 0.75,
    status: "accepted" as const,
    date: "2026-03-04",
  },
];

const STATUS_CONFIG = {
  accepted: { color: "#22C55E", icon: "checkmark-circle" as const, label: "Paid" },
  processing: { color: "#F59E0B", icon: "time" as const, label: "Processing" },
  rejected: { color: "#EF4444", icon: "close-circle" as const, label: "Rejected" },
};

export default function EarningsScreen() {
  const totalEarnings = MOCK_EARNINGS.filter((e) => e.status === "accepted").reduce(
    (sum, e) => sum + e.amount,
    0
  );
  const pendingEarnings = MOCK_EARNINGS.filter((e) => e.status === "processing").reduce(
    (sum, e) => sum + e.amount,
    0
  );

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.summaryCard}>
        <View style={styles.summaryMain}>
          <Text style={styles.summaryLabel}>Total Earned</Text>
          <Text style={styles.summaryAmount}>${totalEarnings.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summarySecondary}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryItemLabel}>Pending</Text>
            <Text style={styles.summaryItemValue}>
              ${pendingEarnings.toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryItemLabel}>Tasks Done</Text>
            <Text style={styles.summaryItemValue}>{MOCK_EARNINGS.length}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Recent Activity</Text>

      <FlatList
        data={MOCK_EARNINGS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const statusConfig =
            STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG] ||
            STATUS_CONFIG.processing;
          return (
            <View style={styles.earningItem}>
              <View
                style={[
                  styles.statusIcon,
                  { backgroundColor: statusConfig.color + "20" },
                ]}
              >
                <Ionicons
                  name={statusConfig.icon}
                  size={20}
                  color={statusConfig.color}
                />
              </View>
              <View style={styles.earningInfo}>
                <Text style={styles.earningTask}>{item.task}</Text>
                <Text style={styles.earningDate}>{item.date}</Text>
              </View>
              <View style={styles.earningRight}>
                <Text style={styles.earningAmount}>
                  ${item.amount.toFixed(2)}
                </Text>
                <Text
                  style={[styles.earningStatus, { color: statusConfig.color }]}
                >
                  {statusConfig.label}
                </Text>
              </View>
            </View>
          );
        }}
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
  summaryCard: {
    backgroundColor: "#0F172A",
    margin: 20,
    borderRadius: 16,
    padding: 24,
  },
  summaryMain: {
    alignItems: "center",
    marginBottom: 16,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#94A3B8",
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 36,
    fontWeight: "800",
    color: "#22C55E",
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "#1E293B",
    marginBottom: 16,
  },
  summarySecondary: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  summaryItem: {
    alignItems: "center",
  },
  summaryItemLabel: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 4,
  },
  summaryItemValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#F8FAFC",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  earningItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
  },
  statusIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  earningInfo: {
    flex: 1,
  },
  earningTask: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 4,
  },
  earningDate: {
    fontSize: 12,
    color: "#64748B",
  },
  earningRight: {
    alignItems: "flex-end",
  },
  earningAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 2,
  },
  earningStatus: {
    fontSize: 11,
    fontWeight: "600",
  },
  separator: {
    height: 8,
  },
});
