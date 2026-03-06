import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="flask" size={48} color="#3B82F6" />
        </View>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to your CrowdPhysics account</Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#94A3B8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#94A3B8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerLink}
            onPress={() => router.replace("/auth/register")}
          >
            <Text style={styles.registerLinkText}>
              Don't have an account? <Text style={styles.registerLinkBold}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 24,
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
    marginBottom: 32,
  },
  form: {
    gap: 14,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 14,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: "#0F172A",
  },
  loginButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  registerLink: {
    alignItems: "center",
    paddingVertical: 12,
  },
  registerLinkText: {
    fontSize: 14,
    color: "#64748B",
  },
  registerLinkBold: {
    color: "#3B82F6",
    fontWeight: "700",
  },
});
