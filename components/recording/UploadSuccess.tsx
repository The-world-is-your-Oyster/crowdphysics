import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

interface UploadSuccessProps {
  payoutAmount: number; // USD
  onRecordAnother: () => void;
  onViewSubmissions: () => void;
}

export function UploadSuccess({
  payoutAmount,
  onRecordAnother,
  onViewSubmissions,
}: UploadSuccessProps) {
  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.content}>
        {/* Success icon */}
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark-circle" size={72} color="#22C55E" />
        </View>

        {/* Title */}
        <Text style={styles.title}>Recording Submitted!</Text>

        {/* Description */}
        <Text style={styles.description}>
          Your recording is being reviewed. You'll be notified when it's
          approved.
        </Text>

        {/* Estimated payout */}
        <View style={styles.payoutCard}>
          <Text style={styles.payoutLabel}>Estimated Payout</Text>
          <Text style={styles.payoutAmount}>
            ${payoutAmount.toFixed(2)}
          </Text>
          <Text style={styles.payoutNote}>Paid after approval</Text>
        </View>

        {/* Action buttons */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={onRecordAnother}
            activeOpacity={0.7}
          >
            <Ionicons name="videocam-outline" size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Record Another</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={onViewSubmissions}
            activeOpacity={0.7}
          >
            <Ionicons name="receipt-outline" size={20} color="#CBD5E1" />
            <Text style={styles.secondaryButtonText}>View My Submissions</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },

  // Icon
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(34, 197, 94, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },

  // Text
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#F8FAFC",
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    fontSize: 15,
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
    paddingHorizontal: 8,
  },

  // Payout card
  payoutCard: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "#1E293B",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 24,
    marginBottom: 36,
    borderWidth: 1,
    borderColor: "#334155",
  },
  payoutLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  payoutAmount: {
    fontSize: 36,
    fontWeight: "800",
    color: "#22C55E",
    marginBottom: 4,
  },
  payoutNote: {
    fontSize: 12,
    color: "#64748B",
  },

  // Buttons
  buttonGroup: {
    width: "100%",
    gap: 12,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#3B82F6",
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#334155",
    backgroundColor: "#1E293B",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#CBD5E1",
  },
});
