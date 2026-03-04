/**
 * Local storage utilities for user preferences
 * Stores user settings safely with JSON serialization
 */

import type {
  UserPreferences,
  CompressionStrategy,
} from "@/lib/prompt-optimizer/types";

const STORAGE_KEY = "prompt-optimizer-preferences";

/**
 * Default preferences
 */
const DEFAULT_PREFERENCES: UserPreferences = {
  defaultStrategy: "balanced",
};

/**
 * Get preferences from localStorage
 * Returns defaults if not found or invalid
 */
export function getPreferences(): UserPreferences {
  if (typeof window === "undefined") {
    return DEFAULT_PREFERENCES;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return DEFAULT_PREFERENCES;
    }

    const parsed = JSON.parse(stored) as Partial<UserPreferences>;

    // Validate and merge with defaults
    return {
      defaultStrategy:
        validateStrategy(parsed.defaultStrategy) ||
        DEFAULT_PREFERENCES.defaultStrategy,
      lastInput: parsed.lastInput,
    };
  } catch (error) {
    console.error("Failed to parse preferences:", error);
    return DEFAULT_PREFERENCES;
  }
}

/**
 * Save preferences to localStorage
 */
export function savePreferences(preferences: Partial<UserPreferences>): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const current = getPreferences();
    const updated = { ...current, ...preferences };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to save preferences:", error);
  }
}

/**
 * Save the last input text
 */
export function saveLastInput(input: string): void {
  savePreferences({ lastInput: input });
}

/**
 * Clear preferences
 */
export function clearPreferences(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear preferences:", error);
  }
}

/**
 * Validate compression strategy
 */
function validateStrategy(strategy: unknown): CompressionStrategy | null {
  if (
    strategy === "gentle" ||
    strategy === "balanced" ||
    strategy === "aggressive"
  ) {
    return strategy;
  }
  return null;
}
