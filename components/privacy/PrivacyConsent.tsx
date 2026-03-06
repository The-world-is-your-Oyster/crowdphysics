/**
 * PrivacyConsent — shown once before the user's first recording attempt.
 *
 * Explains that all faces are automatically blurred, gives the user control
 * over their own face, and requires them to confirm they understand their
 * recordings will be used as AI training data.
 *
 * Persists consent to SecureStore via lib/privacy.ts so it only shows once.
 */

import { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { saveConsent } from "../../lib/privacy";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface PrivacyConsentProps {
  /** Called after the user successfully agrees and consent is saved */
  onConsent: () => void;
  /** Called if the user dismisses / cancels */
  onCancel: () => void;
}

// ─── Checkbox row helper ───────────────────────────────────────────────────────

interface CheckRowProps {
  checked: boolean;
  label: string;
  sublabel?: string;
  locked?: boolean;
  onToggle?: () => void;
}

function CheckRow({ checked, label, sublabel, locked, onToggle }: CheckRowProps) {
  return (
    <TouchableOpacity
      style={styles.checkRow}
      onPress={locked ? undefined : onToggle}
      activeOpacity={locked ? 1 : 0.7}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled: locked }}
    >
      <View
        style={[
          styles.checkbox,
          checked && styles.checkboxChecked,
          locked && styles.checkboxLocked,
        ]}
      >
        {checked && (
          <Ionicons
            name="checkmark"
            size={14}
            color={locked ? "#94A3B8" : "#FFFFFF"}
          />
        )}
      </View>
      <View style={styles.checkTextContainer}>
        <Text
          style={[styles.checkLabel, locked && styles.checkLabelLocked]}
        >
          {label}
        </Text>
        {sublabel ? (
          <Text style={styles.checkSublabel}>{sublabel}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export function PrivacyConsent({ onConsent, onCancel }: PrivacyConsentProps) {
  const [agreedToDataUse, setAgreedToDataUse] = useState(false);
  const [blurOwnFace, setBlurOwnFace] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const canAgree = agreedToDataUse;

  const handleAgree = useCallback(async () => {
    if (!canAgree || isSaving) return;

    setIsSaving(true);
    try {
      await saveConsent(blurOwnFace);
      onConsent();
    } catch {
      // Storage failure is non-fatal — proceed anyway
      onConsent();
    } finally {
      setIsSaving(false);
    }
  }, [canAgree, isSaving, blurOwnFace, onConsent]);

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.iconCircle}>
          <Ionicons name="shield-checkmark" size={40} color="#3B82F6" />
        </View>

        <Text style={styles.title}>Privacy First</Text>
        <Text style={styles.subtitle}>
          Before you start recording, here is how we protect your privacy and
          the privacy of anyone in your videos.
        </Text>

        {/* Face blur info card */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="eye-off-outline" size={22} color="#22C55E" />
            <View style={styles.infoTextBlock}>
              <Text style={styles.infoTitle}>Automatic Face Blur</Text>
              <Text style={styles.infoBody}>
                We automatically detect and blur all faces in your recordings
                before they leave your device. No faces are ever stored or
                transmitted unblurred.
              </Text>
            </View>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoRow}>
            <Ionicons name="hardware-chip-outline" size={22} color="#8B5CF6" />
            <View style={styles.infoTextBlock}>
              <Text style={styles.infoTitle}>On-Device Processing</Text>
              <Text style={styles.infoBody}>
                Face detection and blurring happen entirely on your phone.
                Your unprocessed video never leaves the device.
              </Text>
            </View>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoRow}>
            <Ionicons name="school-outline" size={22} color="#F59E0B" />
            <View style={styles.infoTextBlock}>
              <Text style={styles.infoTitle}>Used for AI Training</Text>
              <Text style={styles.infoBody}>
                Your processed recordings are sold as training data to
                robotics companies. You earn money for every accepted
                recording.
              </Text>
            </View>
          </View>
        </View>

        {/* Consent checkboxes */}
        <View style={styles.consentSection}>
          <Text style={styles.consentSectionTitle}>Your Choices</Text>

          <CheckRow
            checked={agreedToDataUse}
            onToggle={() => setAgreedToDataUse((v) => !v)}
            label="I understand my recordings will be used for AI training data"
            sublabel="Required to continue"
          />

          <CheckRow
            checked={blurOwnFace}
            onToggle={() => setBlurOwnFace((v) => !v)}
            label="Blur my own face too"
            sublabel="Optional — enabled by default"
          />

          <CheckRow
            checked
            locked
            label="Blur bystander faces"
            sublabel="Always on — cannot be changed"
          />
        </View>
      </ScrollView>

      {/* Action buttons — pinned to bottom */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onCancel}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelText}>Not Now</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.agreeButton,
            !canAgree && styles.agreeButtonDisabled,
          ]}
          onPress={handleAgree}
          activeOpacity={canAgree ? 0.7 : 1}
          disabled={!canAgree || isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color={canAgree ? "#FFFFFF" : "#64748B"}
              />
              <Text
                style={[
                  styles.agreeText,
                  !canAgree && styles.agreeTextDisabled,
                ]}
              >
                I Agree
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 16,
  },

  // Header
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1E293B",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#F8FAFC",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 28,
  },

  // Info card
  infoCard: {
    backgroundColor: "#1E293B",
    borderRadius: 16,
    paddingVertical: 8,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  infoTextBlock: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#F8FAFC",
    marginBottom: 4,
  },
  infoBody: {
    fontSize: 13,
    color: "#94A3B8",
    lineHeight: 18,
  },
  infoDivider: {
    height: 1,
    backgroundColor: "#334155",
    marginHorizontal: 18,
  },

  // Consent section
  consentSection: {
    marginBottom: 8,
  },
  consentSectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#CBD5E1",
    marginBottom: 12,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1E293B",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#475569",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
    flexShrink: 0,
  },
  checkboxChecked: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  checkboxLocked: {
    backgroundColor: "#1E293B",
    borderColor: "#334155",
  },
  checkTextContainer: {
    flex: 1,
  },
  checkLabel: {
    fontSize: 14,
    color: "#E2E8F0",
    fontWeight: "500",
    lineHeight: 20,
  },
  checkLabelLocked: {
    color: "#64748B",
  },
  checkSublabel: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },

  // Action bar
  actionBar: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "#1E293B",
    backgroundColor: "#0F172A",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#334155",
    backgroundColor: "#1E293B",
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#94A3B8",
  },
  agreeButton: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#3B82F6",
  },
  agreeButtonDisabled: {
    backgroundColor: "#1E293B",
  },
  agreeText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  agreeTextDisabled: {
    color: "#64748B",
  },
});
