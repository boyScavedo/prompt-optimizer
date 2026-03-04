/**
 * Token counting utilities using js-tiktoken
 * Uses GPT-4o encoding for accurate token counting
 */

import { encodingForModel } from "js-tiktoken";

// Cache the encoder instance to avoid reloading
let encoderCache: ReturnType<typeof encodingForModel> | null = null;

/**
 * Get or create the tiktoken encoder
 * Uses GPT-4o as the default model
 */
function getEncoder(): ReturnType<typeof encodingForModel> | null {
  if (!encoderCache) {
    try {
      encoderCache = encodingForModel("gpt-4o");
    } catch {
      // Fallback - use estimation if encoding fails
      return null;
    }
  }
  return encoderCache;
}

/**
 * Count tokens in a given text string
 * @param text - The text to count tokens for
 * @param model - Optional model name (defaults to gpt-4o)
 * @returns Number of tokens in the text
 */
export function countTokens(text: string, model: string = "gpt-4o"): number {
  if (!text || text.trim().length === 0) {
    return 0;
  }

  try {
    const encoder = getEncoder();
    if (!encoder) {
      // Fallback: rough estimate (1 token ≈ 4 characters for English)
      return Math.ceil(text.length / 4);
    }
    const tokens = encoder.encode(text);
    return tokens.length;
  } catch (error) {
    console.warn(
      "Failed to count tokens with tiktoken, using estimation:",
      error,
    );
    // Fallback: rough estimate (1 token ≈ 4 characters for English)
    return Math.ceil(text.length / 4);
  }
}

/**
 * Free the encoder cache to release memory
 * Call this when done with intensive token operations
 */
export function freeEncoder(): void {
  encoderCache = null;
}

/**
 * Estimate token count based on word count
 * This is a backup method when tiktoken fails
 * @param text - The text to estimate
 * @returns Estimated token count
 */
export function estimateTokens(text: string): number {
  const words = text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
  // Average word is ~1.3 tokens for GPT models
  return Math.ceil(words * 1.3);
}

/**
 * Calculate approximate character count for target tokens
 * Useful for setting realistic target token limits
 * @param targetTokens - Target number of tokens
 * @returns Approximate character count
 */
export function tokensToCharacters(targetTokens: number): number {
  // Average token is about 4 characters
  return targetTokens * 4;
}

/**
 * Get model name for tokenization
 */
export const SUPPORTED_MODELS = ["gpt-4o", "gpt-4", "gpt-3.5-turbo"] as const;
export type SupportedModel = (typeof SUPPORTED_MODELS)[number];
