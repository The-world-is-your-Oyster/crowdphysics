import { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type PasswordStrength = "weak" | "medium" | "strong";

function getPasswordStrength(password: string): PasswordStrength | null {
  if (!password) return null;
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);

  if (password.length >= 10 && hasSpecial && hasUpper && hasNumber) {
    return "strong";
  }
  if (password.length >= 8 && (hasSpecial || hasUpper || hasNumber)) {
    return "medium";
  }
  return "weak";
}

const STRENGTH_CONFIG: Record<
  PasswordStrength,
  { color: string; label: string; bars: number }
> = {
  weak: { color: "#EF4444", label: "Weak", bars: 1 },
  medium: { color: "#F59E0B", label: "Medium", bars: 2 },
  strong: { color: "#22C55E", label: "Strong", bars: 3 },
};

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [apiError, setApiError] = useState("");

  const passwordStrength = useMemo(
    () => getPasswordStrength(password),
    [password]
  );

  function validate(): boolean {
    const newErrors: Record<string, string | undefined> = {};

    if (!displayName.trim()) {
      newErrors.displayName = "Display name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!EMAIL_REGEX.test(email.trim())) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!agreedToTerms) {
      newErrors.terms = "You must agree to the Terms of Service";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const isFormValid =
    displayName.trim().length > 0 &&
    EMAIL_REGEX.test(email.trim()) &&
    password.length >= 6 &&
    password === confirmPassword &&
    agreedToTerms;

  async function handleRegister() {
    setApiError("");
    if (!validate()) return;

    try {
      await register(email.trim(), password, displayName.trim());
      router.replace("/(tabs)");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      const message =
        error?.response?.data?.detail ||
        "Unable to create account. Please try again.";
      setApiError(message);
    }
  }

  function clearError(field: string) {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.iconContainer}>
            <Ionicons name="person-add" size={48} color="#3B82F6" />
          </View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Join CrowdPhysics and start earning
          </Text>

          {/* Error Banner */}
          {apiError ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={18} color="#EF4444" />
              <Text style={styles.errorBannerText}>{apiError}</Text>
            </View>
          ) : null}

          {/* Form */}
          <View style={styles.form}>
            <Input
              label="Display Name"
              leftIcon="person-outline"
              placeholder="Your name"
              value={displayName}
              onChangeText={(text) => {
                setDisplayName(text);
                clearError("displayName");
              }}
              error={errors.displayName}
              autoCapitalize="words"
              autoComplete="name"
              returnKeyType="next"
            />

            <Input
              label="Email"
              leftIcon="mail-outline"
              placeholder="your@email.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                clearError("email");
              }}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              returnKeyType="next"
            />

            <View>
              <Input
                label="Password"
                leftIcon="lock-closed-outline"
                placeholder="Create a password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  clearError("password");
                }}
                error={errors.password}
                isPassword
                autoComplete="new-password"
                returnKeyType="next"
              />
              {/* Password Strength Indicator */}
              {passwordStrength ? (
                <View style={styles.strengthContainer}>
                  <View style={styles.strengthBars}>
                    {[1, 2, 3].map((bar) => (
                      <View
                        key={bar}
                        style={[
                          styles.strengthBar,
                          {
                            backgroundColor:
                              bar <= STRENGTH_CONFIG[passwordStrength].bars
                                ? STRENGTH_CONFIG[passwordStrength].color
                                : "#E2E8F0",
                          },
                        ]}
                      />
                    ))}
                  </View>
                  <Text
                    style={[
                      styles.strengthLabel,
                      { color: STRENGTH_CONFIG[passwordStrength].color },
                    ]}
                  >
                    {STRENGTH_CONFIG[passwordStrength].label}
                  </Text>
                </View>
              ) : null}
            </View>

            <Input
              label="Confirm Password"
              leftIcon="lock-closed-outline"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                clearError("confirmPassword");
              }}
              error={errors.confirmPassword}
              isPassword
              autoComplete="new-password"
              returnKeyType="done"
              onSubmitEditing={handleRegister}
            />

            {/* Terms Checkbox */}
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => {
                setAgreedToTerms((prev) => !prev);
                clearError("terms");
              }}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.checkbox,
                  agreedToTerms ? styles.checkboxChecked : null,
                ]}
              >
                {agreedToTerms ? (
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                ) : null}
              </View>
              <Text style={styles.checkboxLabel}>
                I agree to the{" "}
                <Text style={styles.checkboxLink}>Terms of Service</Text> and{" "}
                <Text style={styles.checkboxLink}>Privacy Policy</Text>
              </Text>
            </TouchableOpacity>
            {errors.terms ? (
              <Text style={styles.termsError}>{errors.terms}</Text>
            ) : null}

            <Button
              title="Create Account"
              onPress={handleRegister}
              variant="primary"
              loading={isLoading}
              disabled={!isFormValid}
              style={styles.registerButton}
            />
          </View>

          {/* Sign In Link */}
          <TouchableOpacity
            style={styles.switchLink}
            onPress={() => router.replace("/auth/login")}
          >
            <Text style={styles.switchLinkText}>
              Already have an account?{" "}
              <Text style={styles.switchLinkBold}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingVertical: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#64748B",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 28,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  errorBannerText: {
    flex: 1,
    fontSize: 13,
    color: "#EF4444",
    fontWeight: "500",
  },
  form: {
    gap: 16,
  },
  strengthContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 8,
  },
  strengthBars: {
    flexDirection: "row",
    gap: 4,
    flex: 1,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: 12,
    fontWeight: "600",
    minWidth: 52,
    textAlign: "right",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  checkboxChecked: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 13,
    color: "#64748B",
    lineHeight: 20,
  },
  checkboxLink: {
    color: "#3B82F6",
    fontWeight: "600",
  },
  termsError: {
    fontSize: 12,
    color: "#EF4444",
    marginTop: -8,
    marginLeft: 32,
  },
  registerButton: {
    marginTop: 4,
  },
  switchLink: {
    alignItems: "center",
    paddingVertical: 20,
  },
  switchLinkText: {
    fontSize: 14,
    color: "#64748B",
  },
  switchLinkBold: {
    color: "#3B82F6",
    fontWeight: "700",
  },
});
