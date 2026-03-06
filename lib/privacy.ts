/**
 * Privacy consent storage helpers.
 *
 * Uses expo-secure-store to persist consent state across app launches.
 * All keys are namespaced under "crowdphysics_privacy_".
 */

import * as SecureStore from "expo-secure-store";

// ─── Storage Keys ──────────────────────────────────────────────────────────────

const KEYS = {
  CONSENT_GIVEN: "crowdphysics_privacy_consent_given",
  BLUR_OWN_FACE: "crowdphysics_privacy_blur_own_face",
  BLUR_QUALITY: "crowdphysics_privacy_blur_quality",
} as const;

// ─── Types ─────────────────────────────────────────────────────────────────────

export type BlurQuality = "standard" | "high";

export interface PrivacyConsent {
  /** User has agreed to the privacy/data-use terms */
  consentGiven: boolean;
  /** User wants their own face blurred (optional, defaults true) */
  blurOwnFace: boolean;
  /** Bystander face blur is always ON and non-negotiable */
  blurBystanders: true;
}

export interface PrivacySettings {
  blurOwnFace: boolean;
  blurQuality: BlurQuality;
}

// ─── Consent Helpers ───────────────────────────────────────────────────────────

/**
 * Returns true if the user has already given privacy consent.
 */
export async function hasGivenConsent(): Promise<boolean> {
  try {
    const value = await SecureStore.getItemAsync(KEYS.CONSENT_GIVEN);
    return value === "true";
  } catch {
    return false;
  }
}

/**
 * Persists the user's privacy consent choices.
 */
export async function saveConsent(
  blurOwnFace: boolean
): Promise<void> {
  await SecureStore.setItemAsync(KEYS.CONSENT_GIVEN, "true");
  await SecureStore.setItemAsync(
    KEYS.BLUR_OWN_FACE,
    blurOwnFace ? "true" : "false"
  );
}

/**
 * Loads the full consent object from storage.
 * Returns null if consent has not been given yet.
 */
export async function loadConsent(): Promise<PrivacyConsent | null> {
  const given = await hasGivenConsent();
  if (!given) return null;

  const blurOwnFaceRaw = await SecureStore.getItemAsync(KEYS.BLUR_OWN_FACE);

  return {
    consentGiven: true,
    blurOwnFace: blurOwnFaceRaw !== "false", // default true
    blurBystanders: true, // always true, non-editable
  };
}

/**
 * Clears all consent data (e.g. for testing or account reset).
 */
export async function clearConsent(): Promise<void> {
  await SecureStore.deleteItemAsync(KEYS.CONSENT_GIVEN);
  await SecureStore.deleteItemAsync(KEYS.BLUR_OWN_FACE);
}

// ─── Privacy Settings Helpers ──────────────────────────────────────────────────

/**
 * Loads persisted privacy settings.
 * Returns defaults if nothing is stored.
 */
export async function loadPrivacySettings(): Promise<PrivacySettings> {
  try {
    const blurOwnFaceRaw = await SecureStore.getItemAsync(KEYS.BLUR_OWN_FACE);
    const blurQualityRaw = await SecureStore.getItemAsync(KEYS.BLUR_QUALITY);

    return {
      blurOwnFace: blurOwnFaceRaw !== "false",
      blurQuality:
        blurQualityRaw === "high" || blurQualityRaw === "standard"
          ? blurQualityRaw
          : "standard",
    };
  } catch {
    return { blurOwnFace: true, blurQuality: "standard" };
  }
}

/**
 * Persists the privacy settings.
 */
export async function savePrivacySettings(
  settings: PrivacySettings
): Promise<void> {
  await SecureStore.setItemAsync(
    KEYS.BLUR_OWN_FACE,
    settings.blurOwnFace ? "true" : "false"
  );
  await SecureStore.setItemAsync(KEYS.BLUR_QUALITY, settings.blurQuality);
}
