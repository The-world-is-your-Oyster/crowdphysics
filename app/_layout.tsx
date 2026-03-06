import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
    },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
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
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
