import { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../hooks/useAuth";
import { useEarnings } from "../../hooks/useEarnings";
import type { EarningEvent } from "../../hooks/useEarnings";
import BalanceCard from "../../components/earnings/BalanceCard";
import StatsRow from "../../components/earnings/StatsRow";
import TimeFilter from "../../components/earnings/TimeFilter";
import EarningItem from "../../components/earnings/EarningItem";
import WithdrawModal from "../../components/earnings/WithdrawModal";
import { Button } from "../../components/ui/Button";

export default function EarningsScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const {
    balance,
    history,
    isLoading,
    timeFilter,
    setTimeFilter,
    refresh,
  } = useEarnings();
  const [withdrawVisible, setWithdrawVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  const renderItem = useCallback(
    ({ item }: { item: EarningEvent }) => (
      <View style={styles.itemPadding}>
        <EarningItem item={item} />
      </View>
    ),
    []
  );

  const keyExtractor = useCallback((item: EarningEvent) => item.id, []);

  // ── Not authenticated ──────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <View style={styles.unauthContainer}>
          <View style={styles.unauthIcon}>
            <Ionicons name="wallet-outline" size={48} color="#94A3B8" />
          </View>
          <Text style={styles.unauthTitle}>Track your earnings</Text>
          <Text style={styles.unauthSubtitle}>
            Sign in to see your balance, earnings history, and withdraw funds
          </Text>
          <Button
            title="Sign In"
            onPress={() => router.push("/auth/login")}
            variant="primary"
            icon="log-in-outline"
            style={styles.unauthButton}
          />
          <TouchableOpacity
            style={styles.unauthRegisterLink}
            onPress={() => router.push("/auth/register")}
          >
            <Text style={styles.unauthRegisterText}>
              Don't have an account?{" "}
              <Text style={styles.unauthRegisterBold}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Loading ────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading earnings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── Main Content ───────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <FlatList
        data={history}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={Separator}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#3B82F6"
          />
        }
        ListHeaderComponent={
          <>
            {/* Balance Card */}
            <BalanceCard
              balance={balance}
              onWithdraw={() => setWithdrawVisible(true)}
            />

            {/* Stats Row */}
            <View style={styles.statsSpacing}>
              <StatsRow />
            </View>

            {/* Time Filter */}
            <TimeFilter active={timeFilter} onChange={setTimeFilter} />

            {/* Section Header */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Earnings History</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{history.length}</Text>
              </View>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>{"\uD83D\uDCB0"}</Text>
            <Text style={styles.emptyTitle}>No earnings yet</Text>
            <Text style={styles.emptySubtitle}>
              Start recording tasks to earn money!
            </Text>
          </View>
        }
      />

      {/* Withdraw Modal */}
      <WithdrawModal
        visible={withdrawVisible}
        onClose={() => setWithdrawVisible(false)}
        balance={balance}
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
  listContent: {
    paddingBottom: 24,
  },
  statsSpacing: {
    paddingTop: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 10,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  countBadge: {
    backgroundColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  countText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
  },
  itemPadding: {
    paddingHorizontal: 20,
  },
  separator: {
    height: 8,
  },

  // Loading
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: "#94A3B8",
  },

  // Empty
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
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

  // Unauthenticated
  unauthContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  unauthIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  unauthTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "center",
    marginBottom: 8,
  },
  unauthSubtitle: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 32,
  },
  unauthButton: {
    width: "100%",
    marginBottom: 16,
  },
  unauthRegisterLink: {
    paddingVertical: 8,
  },
  unauthRegisterText: {
    fontSize: 14,
    color: "#64748B",
  },
  unauthRegisterBold: {
    color: "#3B82F6",
    fontWeight: "700",
  },
});
