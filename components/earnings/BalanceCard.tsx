import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { EarningsBalance } from "../../hooks/useEarnings";

interface BalanceCardProps {
  balance: EarningsBalance;
  onWithdraw: () => void;
}

export default function BalanceCard({ balance, onWithdraw }: BalanceCardProps) {
  const canWithdraw = balance.balance >= 10;

  return (
    <View style={styles.cardOuter}>
      <View style={styles.card}>
        {/* Main Balance */}
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balanceAmount}>
          ${balance.balance.toFixed(2)}
        </Text>

        {/* Secondary Row */}
        <View style={styles.secondaryRow}>
          <View style={styles.secondaryItem}>
            <View style={styles.dotPending} />
            <Text style={styles.secondaryLabel}>Pending</Text>
            <Text style={styles.secondaryValue}>
              ${balance.pending.toFixed(2)}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.secondaryItem}>
            <View style={styles.dotWithdrawn} />
            <Text style={styles.secondaryLabel}>Total Earned</Text>
            <Text style={styles.secondaryValue}>
              ${balance.total_earned.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Withdraw Button */}
        <TouchableOpacity
          style={[
            styles.withdrawButton,
            !canWithdraw && styles.withdrawButtonDisabled,
          ]}
          onPress={onWithdraw}
          disabled={!canWithdraw}
          activeOpacity={0.7}
        >
          <Ionicons
            name="arrow-up-circle-outline"
            size={18}
            color={canWithdraw ? "#FFFFFF" : "#64748B"}
          />
          <Text
            style={[
              styles.withdrawText,
              !canWithdraw && styles.withdrawTextDisabled,
            ]}
          >
            Withdraw
          </Text>
        </TouchableOpacity>
        {!canWithdraw && (
          <Text style={styles.withdrawHint}>Minimum $10.00 to withdraw</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardOuter: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 4,
  },
  card: {
    backgroundColor: "#0F172A",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  balanceLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#94A3B8",
    textAlign: "center",
    marginBottom: 6,
  },
  balanceAmount: {
    fontSize: 42,
    fontWeight: "800",
    color: "#22C55E",
    textAlign: "center",
    letterSpacing: -1,
    marginBottom: 20,
  },
  secondaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1E293B",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 18,
  },
  secondaryItem: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
  },
  dotPending: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#F59E0B",
    marginBottom: 2,
  },
  dotWithdrawn: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#3B82F6",
    marginBottom: 2,
  },
  secondaryLabel: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "500",
  },
  secondaryValue: {
    fontSize: 17,
    fontWeight: "700",
    color: "#F8FAFC",
  },
  divider: {
    width: 1,
    height: 36,
    backgroundColor: "#334155",
  },
  withdrawButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#22C55E",
    borderRadius: 12,
    paddingVertical: 14,
  },
  withdrawButtonDisabled: {
    backgroundColor: "#1E293B",
  },
  withdrawText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  withdrawTextDisabled: {
    color: "#64748B",
  },
  withdrawHint: {
    fontSize: 11,
    color: "#64748B",
    textAlign: "center",
    marginTop: 8,
  },
});
