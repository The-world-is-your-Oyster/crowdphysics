import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

interface UploadErrorProps {
  errorMessage: string;
  onRetry: () => void;
  onCancel: () => void;
  onSaveForLater: () => void;
}

export function UploadError({
  errorMessage,
  onRetry,
  onCancel,
  onSaveForLater,
}: UploadErrorProps) {
  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.content}>
        {/* Error icon */}
        <View style={styles.iconCircle}>
          <Ionicons name="close-circle" size={72} color="#EF4444" />
        </View>

        {/* Title */}
        <Text style={styles.title}>Upload Failed</Text>

        {/* Error message */}
        <View style={styles.errorCard}>
          <Ionicons
            name="alert-circle-outline"
            size={18}
            color="#EF4444"
          />
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>

        {/* Action buttons */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={onRetry}
            activeOpacity={0.7}
          >
            <Ionicons name="refresh" size={20} color="#FFFFFF" />
            <Text style={styles.retryButtonText}>Retry Upload</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={onSaveForLater}
            activeOpacity={0.7}
          >
            <Ionicons name="download-outline" size={20} color="#3B82F6" />
            <Text style={styles.saveButtonText}>Save for Later</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onCancel}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
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
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },

  // Text
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#F8FAFC",
    marginBottom: 16,
    textAlign: "center",
  },

  // Error card
  errorCard: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.2)",
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: "#FCA5A5",
    lineHeight: 20,
  },

  // Buttons
  buttonGroup: {
    width: "100%",
    gap: 12,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#EF4444",
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  saveButton: {
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
  saveButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#3B82F6",
  },
  cancelButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#64748B",
  },
});
