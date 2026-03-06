/**
 * PrivacySettings — inline settings panel for the Profile screen.
 *
 * Shows toggles for face blur preferences and saves changes to both
 * the Zustand store and SecureStore via lib/privacy.ts.
 */

import { useCallback } from "react";
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { usePrivacyStore } from "../../lib/store";
import type { BlurQuality } from "../../lib/privacy";

// ─── Component ─────────────────────────────────────────────────────────────────

export function PrivacySettings() {
  const { blurOwnFace, blurQuality, setBlurOwnFace, setBlurQuality } =
    usePrivacyStore();

  const handleBlurOwnFaceToggle = useCallback(
    (value: boolean) => {
      setBlurOwnFace(value);
    },
    [setBlurOwnFace]
  );

  const handleQualityToggle = useCallback(
    (quality: BlurQuality) => {
      setBlurQuality(quality);
    },
    [setBlurQuality]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Privacy & Face Blur</Text>

      {/* Info blurb */}
      <View style={styles.infoRow}>
        <Ionicons name="information-circle-outline" size={18} color="#3B82F6" />
        <Text style={styles.infoText}>
          Faces are detected and blurred on-device before upload. Bystander
          blur is always active and cannot be disabled.
        </Text>
      </View>

      {/* Settings card */}
      <View style={styles.card}>
        {/* Blur own face toggle */}
        <View style={styles.settingRow}>
          <Ionicons name="person-outline" size={20} color="#64748B" />
          <View style={styles.settingTextBlock}>
            <Text style={styles.settingLabel}>Blur my face</Text>
            <Text style={styles.settingDescription}>
              Applies blur to your own face in recordings
            </Text>
          </View>
          <Switch
            value={blurOwnFace}
            onValueChange={handleBlurOwnFaceToggle}
            trackColor={{ false: "#E2E8F0", true: "#93C5FD" }}
            thumbColor={blurOwnFace ? "#3B82F6" : "#CBD5E1"}
          />
        </View>

        <View style={styles.divider} />

        {/* Bystander blur (locked) */}
        <View style={[styles.settingRow, styles.settingRowDisabled]}>
          <Ionicons name="people-outline" size={20} color="#475569" />
          <View style={styles.settingTextBlock}>
            <Text style={[styles.settingLabel, styles.settingLabelDisabled]}>
              Blur bystander faces
            </Text>
            <Text style={styles.settingDescription}>
              Always enabled — required by policy
            </Text>
          </View>
          <Switch
            value
            disabled
            trackColor={{ false: "#E2E8F0", true: "#93C5FD" }}
            thumbColor="#94A3B8"
          />
        </View>

        <View style={styles.divider} />

        {/* Blur quality selector */}
        <View style={styles.qualityRow}>
          <Ionicons name="options-outline" size={20} color="#64748B" />
          <View style={styles.settingTextBlock}>
            <Text style={styles.settingLabel}>Blur quality</Text>
            <Text style={styles.settingDescription}>
              Higher quality takes longer to process
            </Text>
          </View>
          <View style={styles.qualityToggle}>
            <TouchableOpacity
              style={[
                styles.qualityOption,
                blurQuality === "standard" && styles.qualityOptionActive,
              ]}
              onPress={() => handleQualityToggle("standard")}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.qualityText,
                  blurQuality === "standard" && styles.qualityTextActive,
                ]}
              >
                Standard
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.qualityOption,
                blurQuality === "high" && styles.qualityOptionActive,
              ]}
              onPress={() => handleQualityToggle("high")}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.qualityText,
                  blurQuality === "high" && styles.qualityTextActive,
                ]}
              >
                High
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
  },

  // Info blurb
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: "#64748B",
    lineHeight: 18,
  },

  // Card
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginLeft: 48,
  },

  // Setting row
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  settingRowDisabled: {
    opacity: 0.5,
  },
  settingTextBlock: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 15,
    color: "#0F172A",
    fontWeight: "500",
  },
  settingLabelDisabled: {
    color: "#64748B",
  },
  settingDescription: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 2,
  },

  // Quality row
  qualityRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  qualityToggle: {
    flexDirection: "row",
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    overflow: "hidden",
  },
  qualityOption: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  qualityOptionActive: {
    backgroundColor: "#3B82F6",
    borderRadius: 6,
  },
  qualityText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },
  qualityTextActive: {
    color: "#FFFFFF",
  },
});
