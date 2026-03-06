import { useCallback } from "react";
import * as SecureStore from "expo-secure-store";
import { useAuthStore } from "../lib/store";
import { STORAGE_KEYS } from "../lib/constants";
import api from "../lib/api";
import type { User, AuthTokens } from "../lib/types";

export function useAuth() {
  const { user, isAuthenticated, isLoading, setUser, setLoading, logout: clearAuth } = useAuthStore();

  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      setLoading(true);
      try {
        const response = await api.post<{ user: User; tokens: AuthTokens }>(
          "/auth/login",
          { email, password }
        );
        const { user: userData, tokens } = response.data;
        await SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, tokens.access_token);
        await SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, tokens.refresh_token);
        setUser(userData);
      } finally {
        setLoading(false);
      }
    },
    [setUser, setLoading]
  );

  const register = useCallback(
    async (email: string, password: string, displayName: string): Promise<void> => {
      setLoading(true);
      try {
        const response = await api.post<{ user: User; tokens: AuthTokens }>(
          "/auth/register",
          { email, password, display_name: displayName }
        );
        const { user: userData, tokens } = response.data;
        await SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, tokens.access_token);
        await SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, tokens.refresh_token);
        setUser(userData);
      } finally {
        setLoading(false);
      }
    },
    [setUser, setLoading]
  );

  const logout = useCallback(async () => {
    try {
      await SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
    } catch {
      // Ignore SecureStore errors
    }
    clearAuth();
  }, [clearAuth]);

  const loadUser = useCallback(async () => {
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
      if (!token) return;
      const response = await api.get<User>("/auth/me");
      setUser(response.data);
    } catch {
      clearAuth();
    } finally {
      setLoading(false);
    }
  }, [setUser, setLoading, clearAuth]);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    loadUser,
  };
}
