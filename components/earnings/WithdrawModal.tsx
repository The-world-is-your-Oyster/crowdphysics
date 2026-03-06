import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { EarningsBalance } from "../../hooks/useEarnings";

interface WithdrawModalProps {
  visible: boolean;
  onClose: () => void;
  balance: EarningsBalance;
}

type WithdrawMethod = "paypal" | "bank";
type ModalStep = "form" | "success";

export default function WithdrawModal({
  visible,
  onClose,
  balance,
}: WithdrawModalProps) {
  const [step, setStep] = useState<ModalStep>("form");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<WithdrawMethod>("paypal");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [error, setError] = useState("");

  const resetAndClose = () => {
    setStep("form");
    setAmount("");
    setPaypalEmail("");
    setError("");
    onClose();
  };

  const handleMaxFill = () => {
    setAmount(balance.balance.toFixed(2));
    setError("");
  };

  const handleWithdraw = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 10) {
      setError("Minimum withdrawal is $10.00");
      return;
    }
    if (numAmount > balance.balance) {
      setError("Amount exceeds available balance");
      return;
    }
    if (method === "paypal" && !paypalEmail.includes("@")) {
      setError("Please enter a valid PayPal email");
      return;
    }
    setError("");
    setStep("success");
  };

  if (step === "success") {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={resetAndClose}
      >
        <Pressable style={styles.overlay} onPress={resetAndClose}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.successContainer}>
              <View style={styles.successIcon}>
                <Ionicons
                  name="checkmark-circle"
                  size={56}
                  color="#22C55E"
                />
              </View>
              <Text style={styles.successTitle}>Withdrawal Requested!</Text>
              <Text style={styles.successSubtitle}>
                ${parseFloat(amount).toFixed(2)} will be sent to your{" "}
                {method === "paypal" ? "PayPal" : "bank account"}.
              </Text>
              <Text style={styles.successTimeline}>
                Processing in 1-3 business days
              </Text>
              <TouchableOpacity
                style={styles.doneButton}
                onPress={resetAndClose}
                activeOpacity={0.7}
              >
                <Text style={styles.doneText}>Done</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={resetAndClose}
    >
      <Pressable style={styles.overlay} onPress={resetAndClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboardView}
        >
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            {/* Handle */}
            <View style={styles.handleBar} />

            {/* Title */}
            <Text style={styles.title}>Withdraw Funds</Text>

            {/* Available Balance */}
            <View style={styles.availableRow}>
              <Text style={styles.availableLabel}>Available</Text>
              <Text style={styles.availableValue}>
                ${balance.balance.toFixed(2)}
              </Text>
            </View>

            {/* Amount Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Amount</Text>
              <View style={styles.amountInputRow}>
                <Text style={styles.dollarSign}>$</Text>
                <TextInput
                  style={styles.amountInput}
                  value={amount}
                  onChangeText={(text) => {
                    setAmount(text);
                    setError("");
                  }}
                  placeholder="0.00"
                  placeholderTextColor="#94A3B8"
                  keyboardType="decimal-pad"
                />
                <TouchableOpacity
                  style={styles.maxButton}
                  onPress={handleMaxFill}
                  activeOpacity={0.7}
                >
                  <Text style={styles.maxText}>Max</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Method Selector */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Withdrawal Method</Text>
              <View style={styles.methodRow}>
                <TouchableOpacity
                  style={[
                    styles.methodOption,
                    method === "paypal" && styles.methodOptionActive,
                  ]}
                  onPress={() => setMethod("paypal")}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="logo-paypal"
                    size={18}
                    color={method === "paypal" ? "#3B82F6" : "#64748B"}
                  />
                  <Text
                    style={[
                      styles.methodText,
                      method === "paypal" && styles.methodTextActive,
                    ]}
                  >
                    PayPal
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.methodOption,
                    method === "bank" && styles.methodOptionActive,
                  ]}
                  onPress={() => setMethod("bank")}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="business-outline"
                    size={18}
                    color={method === "bank" ? "#3B82F6" : "#64748B"}
                  />
                  <Text
                    style={[
                      styles.methodText,
                      method === "bank" && styles.methodTextActive,
                    ]}
                  >
                    Bank Transfer
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* PayPal Email */}
            {method === "paypal" && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>PayPal Email</Text>
                <TextInput
                  style={styles.emailInput}
                  value={paypalEmail}
                  onChangeText={(text) => {
                    setPaypalEmail(text);
                    setError("");
                  }}
                  placeholder="your@email.com"
                  placeholderTextColor="#94A3B8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            )}

            {/* Bank stub */}
            {method === "bank" && (
              <View style={styles.bankStub}>
                <Ionicons
                  name="information-circle-outline"
                  size={16}
                  color="#64748B"
                />
                <Text style={styles.bankStubText}>
                  Bank transfer setup coming soon. Use PayPal for now.
                </Text>
              </View>
            )}

            {/* Error */}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* Withdraw Button */}
            <TouchableOpacity
              style={[
                styles.withdrawButton,
                method === "bank" && styles.withdrawButtonDisabled,
              ]}
              onPress={handleWithdraw}
              disabled={method === "bank"}
              activeOpacity={0.7}
            >
              <Text style={styles.withdrawButtonText}>Withdraw</Text>
            </TouchableOpacity>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  keyboardView: {
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
    paddingTop: 12,
  },
  handleBar: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E2E8F0",
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 16,
  },
  availableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  availableLabel: {
    fontSize: 14,
    color: "#16A34A",
    fontWeight: "500",
  },
  availableValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#16A34A",
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 8,
  },
  amountInputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    paddingHorizontal: 14,
  },
  dollarSign: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginRight: 4,
  },
  amountInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#0F172A",
    paddingVertical: 14,
  },
  maxButton: {
    backgroundColor: "#EFF6FF",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  maxText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#3B82F6",
  },
  methodRow: {
    flexDirection: "row",
    gap: 10,
  },
  methodOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
  },
  methodOptionActive: {
    borderColor: "#3B82F6",
    backgroundColor: "#EFF6FF",
  },
  methodText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
  },
  methodTextActive: {
    color: "#3B82F6",
  },
  emailInput: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: "#0F172A",
  },
  bankStub: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  bankStubText: {
    fontSize: 13,
    color: "#64748B",
    flex: 1,
  },
  errorText: {
    fontSize: 13,
    color: "#EF4444",
    fontWeight: "500",
    marginBottom: 12,
  },
  withdrawButton: {
    backgroundColor: "#22C55E",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 4,
  },
  withdrawButtonDisabled: {
    backgroundColor: "#E2E8F0",
  },
  withdrawButtonText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  successContainer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  successIcon: {
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 15,
    color: "#475569",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 4,
  },
  successTimeline: {
    fontSize: 13,
    color: "#94A3B8",
    marginBottom: 24,
  },
  doneButton: {
    backgroundColor: "#0F172A",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 60,
  },
  doneText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
