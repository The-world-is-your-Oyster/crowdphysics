import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { API_BASE_URL, STORAGE_KEYS } from "./constants";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: attach auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // SecureStore not available (e.g. web), skip token
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle common errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear stored tokens on 401
      try {
        await SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
        await SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
      } catch {
        // Ignore SecureStore errors
      }
    }
    return Promise.reject(error);
  }
);

export default api;
