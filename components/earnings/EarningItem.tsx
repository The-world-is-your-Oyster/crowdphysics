import { View, Text, StyleSheet } from "react-native";
import type { EarningEvent } from "../../hooks/useEarnings";
import { getCategoryEmoji } from "../../hooks/useEarnings";

interface EarningItemProps {
  item: EarningEvent;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function getAmountDisplay(item: EarningEvent): {
  text: string;
  color: string;
  strikethrough: boolean;
} {
  switch (item.status) {
    case "approved":
      return {
        text: `+$${item.amount.toFixed(2)}`,
        color: "#22C55E",
        strikethrough: false,
      };
    case "pending":
      return {
        text: `+$${item.amount.toFixed(2)}`,
        color: "#F59E0B",
        strikethrough: false,
      };
    case "rejected":
      return {
        text: `$${item.amount.toFixed(2)}`,
        color: "#EF4444",
        strikethrough: true,
      };
  }
}

function getStatusLabel(
  status: EarningEvent["status"]
): { text: string; color: string } {
  switch (status) {
    case "approved":
      return { text: "Approved", color: "#22C55E" };
    case "pending":
      return { text: "Pending", color: "#F59E0B" };
    case "rejected":
      return { text: "Rejected", color: "#EF4444" };
  }
}

export default function EarningItem({ item }: EarningItemProps) {
  const emoji = getCategoryEmoji(item.category);
  const amountInfo = getAmountDisplay(item);
  const statusInfo = getStatusLabel(item.status);

  return (
    <View style={styles.container}>
      {/* Left: Category Emoji */}
      <View
        style={[
          styles.emojiContainer,
          {
            backgroundColor:
              item.status === "rejected"
                ? "#FEF2F2"
                : item.status === "pending"
                ? "#FFFBEB"
                : "#F0FDF4",
          },
        ]}
      >
        <Text style={styles.emoji}>{emoji}</Text>
      </View>

      {/* Center: Task title + date */}
      <View style={styles.centerContent}>
        <Text style={styles.taskTitle} numberOfLines={1}>
          {item.task_title}
        </Text>
        <Text style={styles.date}>{formatDate(item.created_at)}</Text>
        {item.status === "rejected" && item.rejection_reason ? (
          <Text style={styles.rejectionReason} numberOfLines={2}>
            {item.rejection_reason}
          </Text>
        ) : null}
      </View>

      {/* Right: Amount + status */}
      <View style={styles.rightContent}>
        <Text
          style={[
            styles.amount,
            { color: amountInfo.color },
            amountInfo.strikethrough && styles.strikethrough,
          ]}
        >
          {amountInfo.text}
        </Text>
        <Text style={[styles.statusLabel, { color: statusInfo.color }]}>
          {statusInfo.text}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  emojiContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  emoji: {
    fontSize: 20,
  },
  centerContent: {
    flex: 1,
    paddingRight: 8,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 3,
  },
  date: {
    fontSize: 12,
    color: "#94A3B8",
  },
  rejectionReason: {
    fontSize: 11,
    color: "#EF4444",
    marginTop: 4,
    lineHeight: 15,
  },
  rightContent: {
    alignItems: "flex-end",
    minWidth: 70,
  },
  amount: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 3,
  },
  strikethrough: {
    textDecorationLine: "line-through",
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: "600",
  },
});
