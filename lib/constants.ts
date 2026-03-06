import Constants from "expo-constants";

// API configuration
export const API_BASE_URL =
  Constants.expoConfig?.extra?.apiUrl ?? "http://localhost:8000/api/v1";

// Secure storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "crowdphysics_access_token",
  REFRESH_TOKEN: "crowdphysics_refresh_token",
  USER_DATA: "crowdphysics_user_data",
} as const;

// Recording constraints
export const RECORDING = {
  MAX_DURATION_SEC: 300,
  MIN_DURATION_SEC: 5,
  VIDEO_QUALITY: "high" as const,
  MAX_FILE_SIZE_MB: 500,
} as const;

// Task categories with display metadata
export const CATEGORY_LABELS: Record<string, string> = {
  kitchen: "Kitchen",
  cleaning: "Cleaning",
  organization: "Organization",
  assembly: "Assembly",
  personal_care: "Personal Care",
  office: "Office",
  outdoor: "Outdoor",
};

// App metadata
export const APP = {
  NAME: "CrowdPhysics",
  VERSION: "1.0.0",
  BUNDLE_ID: "com.oysterlabs.crowdphysics",
} as const;
