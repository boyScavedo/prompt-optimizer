/**
 * TOON (Token-Oriented Object Notation) Optimizer
 *
 * A proper implementation that actually reduces token usage.
 * Uses multiple optimization strategies:
 * 1. JSON Minification - Remove quotes from keys, whitespace
 * 2. Key Abbreviation - Shorten common keys
 * 3. Whitespace Stripping - For non-JSON text
 * 4. Fallback - Return original if optimization increases tokens
 *
 * This is a replacement for the broken @toon-format/toon package
 */

import { countTokens } from "@/lib/prompt-optimizer/tokenUtils";

/**
 * Key abbreviation map for token reduction
 */
const KEY_ABBREVIATIONS: Record<string, string> = {
  instruction: "i",
  instructions: "i",
  task: "t",
  context: "c",
  constraints: "cn",
  requirements: "r",
  format: "f",
  output: "o",
  example: "e",
  examples: "e",
  input: "in",
  description: "d",
  role: "rl",
  persona: "p",
  goal: "g",
  objective: "obj",
  step: "s",
  steps: "st",
  condition: "cd",
  conditions: "cds",
  note: "n",
  notes: "nt",
  warning: "w",
  important: "imp",
  length: "l",
  style: "st",
  tone: "tn",
  audience: "aud",
  language: "lang",
  response: "resp",
  result: "res",
  data: "dt",
  information: "info",
};

/**
 * Reverse abbreviations for decoding
 */
const REVERSE_ABBREVIATIONS: Record<string, string> = Object.entries(
  KEY_ABBREVIATIONS,
).reduce(
  (acc, [key, value]) => {
    acc[value] = key;
    return acc;
  },
  {} as Record<string, string>,
);

/**
 * Result interface for optimization
 */
export interface TOONOptimizedResult {
  original: string;
  optimized: string;
  decoded: string;
  tokenSavings: number;
  characterCount: { before: number; after: number };
  tokenCount: { before: number; after: number };
  method: "json-minify" | "key-abbrev" | "whitespace" | "original";
}

/**
 * Minify JSON - remove quotes from keys, compact whitespace
 * Input: {"instruction": "summarize", "format": "bullets"}
 * Output: {instruction:"summarize",format:"bullets"}
 */
function minifyJSON(input: string): string {
  try {
    const parsed = JSON.parse(input);
    // First stringify to get clean JSON, then remove key quotes
    return JSON.stringify(parsed).replace(/"(\w+)":/g, "$1:");
  } catch {
    return input;
  }
}

/**
 * Abbreviate JSON keys
 * Input: {instruction: "summarize", format: "bullets"}
 * Output: {i:"summarize",f:"bullets"}
 */
function abbreviateKeys(input: string): string {
  try {
    const parsed = JSON.parse(input);
    const abbreviated: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(parsed)) {
      const shortKey = KEY_ABBREVIATIONS[key] || key;
      abbreviated[shortKey] = value;
    }

    return JSON.stringify(abbreviated);
  } catch {
    return input;
  }
}

/**
 * Strip whitespace from plain text
 */
function stripWhitespace(input: string): string {
  // Preserve some whitespace between sentences for readability
  return input
    .replace(/\s+/g, " ") // Collapse all whitespace
    .replace(/\s+([,.!?])/g, "$1") // Remove space before punctuation
    .trim();
}

/**
 * Detect if input is JSON
 */
function isJSON(input: string): boolean {
  const trimmed = input.trim();
  return (
    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
    (trimmed.startsWith("[") && trimmed.endsWith("]"))
  );
}

/**
 * Optimize input using the best available method
 * Always returns original if optimization increases tokens
 */
export function optimizeWithTOON(input: string): TOONOptimizedResult {
  if (!input || !input.trim()) {
    return {
      original: input,
      optimized: "",
      decoded: "",
      tokenSavings: 0,
      characterCount: { before: 0, after: 0 },
      tokenCount: { before: 0, after: 0 },
      method: "original",
    };
  }

  const original = input.trim();
  const originalTokens = countTokens(original);
  const originalChars = original.length;

  // Try different optimization methods
  let bestResult = original;
  let bestMethod: TOONOptimizedResult["method"] = "original";

  // Method 1: Full minification + abbreviation (for JSON)
  if (isJSON(original)) {
    // Try full optimization
    const minified = minifyJSON(original);
    const abbreviated = abbreviateKeys(minified);
    const abbreviatedTokens = countTokens(abbreviated);

    if (abbreviatedTokens < originalTokens) {
      bestResult = abbreviated;
      bestMethod = "key-abbrev";
    } else if (countTokens(minified) < originalTokens) {
      bestResult = minified;
      bestMethod = "json-minify";
    }
  }

  // Method 2: Just whitespace stripping (for any text)
  const stripped = stripWhitespace(original);
  const strippedTokens = countTokens(stripped);

  if (
    strippedTokens < originalTokens &&
    strippedTokens < countTokens(bestResult)
  ) {
    bestResult = stripped;
    bestMethod = "whitespace";
  }

  // If no optimization reduced tokens, return original
  const finalTokens = countTokens(bestResult);
  if (finalTokens >= originalTokens) {
    return {
      original,
      optimized: original,
      decoded: original,
      tokenSavings: 0,
      characterCount: { before: originalChars, after: originalChars },
      tokenCount: { before: originalTokens, after: originalTokens },
      method: "original",
    };
  }

  // Calculate savings
  const tokenSavings =
    originalTokens > 0
      ? Math.round(((originalTokens - finalTokens) / originalTokens) * 1000) /
        10
      : 0;

  // Create decoded version (for preview)
  let decoded = bestResult;
  try {
    // Try to parse and pretty-print for decode preview
    const parsed = JSON.parse(bestResult);
    // Expand abbreviated keys back
    const expanded: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(parsed)) {
      expanded[REVERSE_ABBREVIATIONS[key] || key] = value;
    }
    decoded = JSON.stringify(expanded, null, 2);
  } catch {
    // Not JSON, just use as-is
    decoded = bestResult;
  }

  return {
    original,
    optimized: bestResult,
    decoded,
    tokenSavings,
    characterCount: {
      before: originalChars,
      after: bestResult.length,
    },
    tokenCount: {
      before: originalTokens,
      after: finalTokens,
    },
    method: bestMethod,
  };
}

/**
 * Calculate token savings percentage
 */
export function calculateTokenSavings(
  original: string,
  optimized: string,
): number {
  if (!original || !original.trim()) {
    return 0;
  }

  const originalTokens = countTokens(original);
  const optimizedTokens = countTokens(optimized);

  if (originalTokens === 0) {
    return 0;
  }

  const savings = ((originalTokens - optimizedTokens) / originalTokens) * 100;
  return Math.round(savings * 10) / 10;
}

/**
 * Decode TOON string back to readable format
 */
export function decodeTOON(toonString: string): string {
  if (!toonString || !toonString.trim()) {
    return "";
  }

  try {
    const parsed = JSON.parse(toonString);
    const expanded: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(parsed)) {
      expanded[REVERSE_ABBREVIATIONS[key] || key] = value;
    }

    return JSON.stringify(expanded, null, 2);
  } catch {
    return toonString;
  }
}

/**
 * Get human-readable description of savings
 */
export function getSavingsDescription(savings: number): string {
  if (savings >= 30) {
    return "Excellent - Over 30% token reduction!";
  } else if (savings >= 20) {
    return "Great - Significant token savings";
  } else if (savings >= 10) {
    return "Good - Moderate token savings";
  } else if (savings > 0) {
    return "Minimal - Small token savings";
  } else if (savings === 0) {
    return "No change - input already optimized";
  } else {
    return "Input too short to optimize effectively";
  }
}

/**
 * Compression function compatible with existing system
 */
export async function compressWithTOON(prompt: string): Promise<{
  compressedText: string;
  originalTokens: number;
  compressedTokens: number;
  compressionRatio: number;
  strategyUsed: "toon";
  decoded?: string;
  method?: string;
}> {
  const result = optimizeWithTOON(prompt);

  return {
    compressedText: result.optimized,
    originalTokens: result.tokenCount.before,
    compressedTokens: result.tokenCount.after,
    compressionRatio: result.tokenSavings,
    strategyUsed: "toon",
    decoded: result.decoded,
    method: result.method,
  };
}
