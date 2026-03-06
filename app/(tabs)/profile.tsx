import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const MOCK_USER = {
  display_name: "Guest User",
  email: "guest@crowdphysics.app",
  quality_score: 92,
  total_earnings: 1.25,
  tasks_completed: 3,
};

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color="#3B82F6" />
          </View>
          <Text style={styles.displayName}>{MOCK_USER.display_name}</Text>
          <Text style={styles.email}>{MOCK_USER.email}</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{MOCK_USER.quality_score}%</Text>
            <Text style={styles.statLabel}>Quality Score</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>${MOCK_USER.total_earnings.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Earned</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{MOCK_USER.tasks_completed}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        <View style={styles.menuSection}>
          <MenuItem icon="settings-outline" label="Settings" />
          <MenuItem icon="help-circle-outline" label="Help & FAQ" />
          <MenuItem icon="document-text-outline" label="Terms of Service" />
          <MenuItem icon="shield-checkmark-outline" label="Privacy Policy" />
        </View>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push("/auth/login")}
        >
          <Ionicons name="log-in-outline" size={20} color="#FFFFFF" />
          <Text style={styles.loginButtonText}>Sign In</Text>
        </TouchableOpacity>

        <Text style={styles.version}>CrowdPhysics v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuItem({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return (
    <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
      <Ionicons name={icon} size={22} color="#64748B" />
      <Text style={styles.menuLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: "center",
    paddingVertical: 28,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  displayName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
  },
  email: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 4,
  },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "500",
  },
  menuSection: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    color: "#0F172A",
    marginLeft: 12,
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#3B82F6",
    marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 20,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  version: {
    textAlign: "center",
    fontSize: 12,
    color: "#94A3B8",
  },
});
