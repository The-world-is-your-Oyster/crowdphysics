import "../global.css";
import { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAuthStore } from "../lib/store";
import { useAuth } from "../hooks/useAuth";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
    },
  },
});

function AuthGate({ children }: { children: React.ReactNode }) {
  const { loadUser } = useAuth();
  const { isAuthenticated, isLoading } = useAuthStore();
  const segments = useSegments() as string[];
  const router = useRouter();

  // Load user on app mount
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Protect routes that require auth
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "auth";
    const inProtectedRoute =
      segments[0] === "(tabs)" &&
      (segments[1] === "record" || segments[1] === "earnings");

    if (!isAuthenticated && inProtectedRoute) {
      router.replace("/auth/login");
    }

    // If user is authenticated and on auth pages, redirect to tabs
    if (isAuthenticated && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, isLoading, segments, router]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <AuthGate>
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: "#0F172A" },
              headerTintColor: "#F8FAFC",
              headerTitleStyle: { fontWeight: "700" },
              contentStyle: { backgroundColor: "#F8FAFC" },
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="auth/login"
              options={{ title: "Sign In", presentation: "modal" }}
            />
            <Stack.Screen
              name="auth/register"
              options={{ title: "Create Account", presentation: "modal" }}
            />
            <Stack.Screen
              name="task/[id]"
              options={{ title: "Task Details" }}
            />
          </Stack>
        </AuthGate>
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
