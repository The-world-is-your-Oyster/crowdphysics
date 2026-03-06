import { useCallback } from "react";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { useAuthStore } from "../lib/store";
import { STORAGE_KEYS } from "../lib/constants";
import api from "../lib/api";
import type { User, AuthTokens } from "../lib/types";

export function useAuth() {
  const { user, token, isAuthenticated, isLoading, setUser, setToken, setLoading, clearAuth } =
    useAuthStore();
  const router = useRouter();

  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      setLoading(true);
      try {
        const response = await api.post<{ user: User; tokens: AuthTokens }>(
          "/auth/login",
          { email, password }
        );
        const { user: userData, tokens } = response.data;
        await SecureStore.setItemAsync(
          STORAGE_KEYS.ACCESS_TOKEN,
          tokens.access_token
        );
        await SecureStore.setItemAsync(
          STORAGE_KEYS.REFRESH_TOKEN,
          tokens.refresh_token
        );
        setToken(tokens.access_token);
        setUser(userData);
      } finally {
        setLoading(false);
      }
    },
    [setUser, setToken, setLoading]
  );

  const register = useCallback(
    async (
      email: string,
      password: string,
      displayName: string
    ): Promise<void> => {
      setLoading(true);
      try {
        const response = await api.post<{ user: User; tokens: AuthTokens }>(
          "/auth/register",
          { email, password, display_name: displayName }
        );
        const { user: userData, tokens } = response.data;
        await SecureStore.setItemAsync(
          STORAGE_KEYS.ACCESS_TOKEN,
          tokens.access_token
        );
        await SecureStore.setItemAsync(
          STORAGE_KEYS.REFRESH_TOKEN,
          tokens.refresh_token
        );
        setToken(tokens.access_token);
        setUser(userData);
      } finally {
        setLoading(false);
      }
    },
    [setUser, setToken, setLoading]
  );

  const logout = useCallback(async () => {
    try {
      await SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
    } catch {
      // Ignore SecureStore errors on web/unsupported platforms
    }
    clearAuth();
    router.replace("/auth/login");
  }, [clearAuth, router]);

  const loadUser = useCallback(async () => {
    setLoading(true);
    try {
      const storedToken = await SecureStore.getItemAsync(
        STORAGE_KEYS.ACCESS_TOKEN
      );
      if (!storedToken) {
        return;
      }
      setToken(storedToken);
      const response = await api.get<User>("/auth/me");
      setUser(response.data);
    } catch {
      // Token invalid or network error - clear auth state
      try {
        await SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
        await SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
      } catch {
        // Ignore SecureStore errors
      }
      clearAuth();
    } finally {
      setLoading(false);
    }
  }, [setUser, setToken, setLoading, clearAuth]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    loadUser,
  };
}
