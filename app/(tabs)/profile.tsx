import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../../components/ui/Button";
import { APP } from "../../lib/constants";
import { usePrivacyStore } from "../../lib/store";
import { PrivacySettings } from "../../components/privacy/PrivacySettings";

type LanguageOption = "en" | "zh";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  const [wifiOnly, setWifiOnly] = useState(true);
  const [language, setLanguage] = useState<LanguageOption>("en");
  const [pushNotifications, setPushNotifications] = useState(true);

  const { loadFromStorage } = usePrivacyStore();

  // Load persisted privacy settings into Zustand store on mount
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  // Not authenticated view
  if (!isAuthenticated || !user) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <View style={styles.unauthContainer}>
          <View style={styles.unauthIcon}>
            <Ionicons name="person-outline" size={48} color="#94A3B8" />
          </View>
          <Text style={styles.unauthTitle}>
            Sign in to track your earnings
          </Text>
          <Text style={styles.unauthSubtitle}>
            Create an account or sign in to start recording tasks and earning
            money
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

  // Generate initials from display_name
  const initials = user.display_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitials}>{initials}</Text>
          </View>
          <Text style={styles.displayName}>{user.display_name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        {/* Quality Score */}
        <View style={styles.qualitySection}>
          <View style={styles.qualityCircle}>
            <Text style={styles.qualityValue}>{user.quality_score}</Text>
            <Text style={styles.qualityUnit}>/ 100</Text>
          </View>
          <Text style={styles.qualityLabel}>Quality Score</Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="videocam-outline" size={20} color="#3B82F6" />
            <Text style={styles.statValue}>--</Text>
            <Text style={styles.statLabel}>Recordings</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#22C55E" />
            <Text style={styles.statValue}>--</Text>
            <Text style={styles.statLabel}>Accepted</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="wallet-outline" size={20} color="#F59E0B" />
            <Text style={styles.statValue}>
              ${user.total_earnings.toFixed(2)}
            </Text>
            <Text style={styles.statLabel}>Earned</Text>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <View style={styles.settingsCard}>
            <SettingRow
              icon="wifi-outline"
              label="Upload on WiFi only"
              rightElement={
                <Switch
                  value={wifiOnly}
                  onValueChange={setWifiOnly}
                  trackColor={{ false: "#E2E8F0", true: "#93C5FD" }}
                  thumbColor={wifiOnly ? "#3B82F6" : "#CBD5E1"}
                />
              }
            />
            <View style={styles.settingDivider} />
            <SettingRow
              icon="language-outline"
              label="Language"
              rightElement={
                <View style={styles.languageToggle}>
                  <TouchableOpacity
                    style={[
                      styles.langOption,
                      language === "en" ? styles.langOptionActive : null,
                    ]}
                    onPress={() => setLanguage("en")}
                  >
                    <Text
                      style={[
                        styles.langText,
                        language === "en" ? styles.langTextActive : null,
                      ]}
                    >
                      EN
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.langOption,
                      language === "zh" ? styles.langOptionActive : null,
                    ]}
                    onPress={() => setLanguage("zh")}
                  >
                    <Text
                      style={[
                        styles.langText,
                        language === "zh" ? styles.langTextActive : null,
                      ]}
                    >
                      ZH
                    </Text>
                  </TouchableOpacity>
                </View>
              }
            />
            <View style={styles.settingDivider} />
            <SettingRow
              icon="notifications-outline"
              label="Push notifications"
              rightElement={
                <Switch
                  value={pushNotifications}
                  onValueChange={setPushNotifications}
                  trackColor={{ false: "#E2E8F0", true: "#93C5FD" }}
                  thumbColor={pushNotifications ? "#3B82F6" : "#CBD5E1"}
                />
              }
            />
          </View>
        </View>

        {/* Privacy & Face Blur Settings */}
        <PrivacySettings />

        {/* Support */}
        <View style={styles.supportSection}>
          <TouchableOpacity style={styles.supportRow} activeOpacity={0.7}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={22}
              color="#64748B"
            />
            <Text style={styles.supportLabel}>Contact Support</Text>
            <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
          </TouchableOpacity>
        </View>

        {/* Sign Out */}
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={logout}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* Version */}
        <Text style={styles.version}>
          {APP.NAME} v{APP.VERSION}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingRow({
  icon,
  label,
  rightElement,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  rightElement: React.ReactNode;
}) {
  return (
    <View style={styles.settingRow}>
      <Ionicons name={icon} size={20} color="#64748B" />
      <Text style={styles.settingLabel}>{label}</Text>
      {rightElement}
    </View>
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

  // Avatar
  avatarSection: {
    alignItems: "center",
    paddingVertical: 28,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#3B82F6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarInitials: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
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

  // Quality Score
  qualitySection: {
    alignItems: "center",
    marginBottom: 20,
  },
  qualityCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 4,
    borderColor: "#22C55E",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  qualityValue: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
  },
  qualityUnit: {
    fontSize: 11,
    color: "#64748B",
    marginTop: -2,
  },
  qualityLabel: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
  },

  // Stats
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
    padding: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    gap: 6,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  statLabel: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "500",
  },

  // Settings
  settingsSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 10,
  },
  settingsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  settingLabel: {
    flex: 1,
    fontSize: 15,
    color: "#0F172A",
    marginLeft: 12,
  },
  settingDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginLeft: 48,
  },

  // Language Toggle
  languageToggle: {
    flexDirection: "row",
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    overflow: "hidden",
  },
  langOption: {
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  langOptionActive: {
    backgroundColor: "#3B82F6",
    borderRadius: 6,
  },
  langText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
  langTextActive: {
    color: "#FFFFFF",
  },

  // Support
  supportSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  supportRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  supportLabel: {
    flex: 1,
    fontSize: 15,
    color: "#0F172A",
    marginLeft: 12,
  },

  // Sign Out
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 20,
    paddingVertical: 14,
    marginBottom: 20,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#EF4444",
  },

  // Version
  version: {
    textAlign: "center",
    fontSize: 12,
    color: "#94A3B8",
  },
});
