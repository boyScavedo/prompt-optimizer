/**
 * Compression strategies for prompt optimization
 * Includes gentle (structure-safe), balanced, and aggressive compression modes
 *
 * Target compression ratios:
 * - Gentle: ~20-30% reduction
 * - Balanced: ~40-50% reduction
 * - Aggressive: ~70-80% reduction
 */

import { countTokens } from "./tokenUtils";
import type {
  CompressionResult,
  CompressionStrategy,
  CompressionConfig,
} from "./types";
import { compressWithTOON } from "@/utils/toonOptimizer";

// Target compression ratios (percentage of tokens to keep)
// Adjusted to be achievable for well-written prompts
const TARGET_RATIOS: Record<
  CompressionStrategy,
  { minKeep: number; maxKeep: number }
> = {
  gentle: { minKeep: 0.7, maxKeep: 0.8 }, // Keep 70-80% = 20-30% reduction
  balanced: { minKeep: 0.5, maxKeep: 0.6 }, // Keep 50-60% = 40-50% reduction
  aggressive: { minKeep: 0.2, maxKeep: 0.3 }, // Keep 20-30% = 70-80% reduction
  toon: { minKeep: 0.4, maxKeep: 0.7 }, // Keep 40-70% = 30-60% reduction (TOON)
};

/**
 * Strategy information for UI display
 */
export const STRATEGY_INFO = [
  {
    id: "gentle" as CompressionStrategy,
    label: "Gentle",
    description:
      "Structure Safe - Removes filler words/whitespace. Preserves markdown.",
    estimatedSavings: "~20-30%",
  },
  {
    id: "balanced" as CompressionStrategy,
    label: "Balanced",
    description: "Smart - Removes examples/context, keeps core requirements.",
    estimatedSavings: "~40-50%",
  },
  {
    id: "aggressive" as CompressionStrategy,
    label: "Aggressive",
    description:
      "Max Compression - Extracts core intent only. Minimal details.",
    estimatedSavings: "~70-80%",
  },
  {
    id: "toon" as CompressionStrategy,
    label: "TOON Encode",
    description:
      "Maximum Token Efficiency - Uses Token-Oriented Object Notation for LLM-to-LLM communication.",
    estimatedSavings: "~30-60%",
  },
];

/**
 * Check if a line is a markdown structural element that should be preserved
 */
function isMarkdownLine(line: string): boolean {
  const trimmed = line.trim();
  if (/^#{1,6}\s+/.test(trimmed)) return true;
  if (/^[-*+]\s+/.test(trimmed)) return true;
  if (/^\d+[.)]\s+/.test(trimmed)) return true;
  if (/^```/.test(trimmed)) return true;
  if (/^>\s+/.test(trimmed)) return true;
  if (/^[-*_]{3,}$/.test(trimmed)) return true;
  if (/^[-*+]\s+\[[ x]\]/i.test(trimmed)) return true;
  return false;
}

/**
 * Check if we're inside a code block
 */
function isInsideCodeBlock(lines: string[], currentIndex: number): boolean {
  let inCodeBlock = false;
  for (let i = 0; i <= currentIndex; i++) {
    if (lines[i].trim().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
    }
  }
  return inCodeBlock;
}

/**
 * Check if a line is a separator or delimiter
 */
function isSeparatorLine(line: string): boolean {
  const trimmed = line.trim();
  return /^[-*_=]{3,}$/.test(trimmed) || trimmed === "***" || trimmed === "---";
}

/**
 * Priority-ordered word removal for iterative compression
 */
const REMOVABLE_PATTERNS = [
  // Priority 1: Complete filler phrases
  {
    pattern:
      /\b(please|kindly|would you|could you|can you|will you|should you)\b/gi,
    priority: 1,
  },
  {
    pattern:
      /\b(I would like to|I want you to|I need you to|I'm looking to|I am looking to)\b/gi,
    priority: 1,
  },
  {
    pattern:
      /\b(thank you|thanks|I appreciate|if possible|when you have time|at your earliest convenience)\b/gi,
    priority: 1,
  },
  {
    pattern:
      /\b(for the purpose of|in order to|so that|with the goal of|with the purpose of)\b/gi,
    priority: 1,
  },

  // Priority 2: Redundant/adverb words
  {
    pattern:
      /\b(basically|actually|really|very|quite|just|simply|essentially|absolutely|certainly|definitely|extremely)\b/gi,
    priority: 2,
  },
  {
    pattern:
      /\b(notably|particularly|in particular|especially|specifically)\b/gi,
    priority: 2,
  },

  // Priority 3: Conversation fillers
  {
    pattern:
      /\b(I think|I believe|in my opinion|as far as I know|to summarize|to make a long story short|in short)\b/gi,
    priority: 3,
  },
  {
    pattern:
      /\b(please note that|it is important to note that|keep in mind that|bear in mind that|as mentioned above)\b/gi,
    priority: 3,
  },

  // Priority 4: Transition words
  {
    pattern:
      /\b(furthermore|moreover|additionally|nevertheless|consequently|therefore|thus|hence)\b/gi,
    priority: 4,
  },
  {
    pattern:
      /\b(on the other hand|that being said|in conclusion|to conclude|to sum up|in summary)\b/gi,
    priority: 4,
  },

  // Priority 5: Long phrases to shorten
  { pattern: /\bdue to the fact that\b/gi, priority: 5 },
  { pattern: /\bin the event that\b/gi, priority: 5 },
  { pattern: /\bat this point in time\b/gi, priority: 5 },
  { pattern: /\bfor the reason that\b/gi, priority: 5 },
  { pattern: /\bin spite of the fact that\b/gi, priority: 5 },

  // Priority 6: Articles (aggressive mode)
  { pattern: /\b(a |an |the )\b/gi, priority: 6 },
];

/**
 * Check if text is JSON (object or array)
 */
function isJSON(text: string): boolean {
  const trimmed = text.trim();
  return (
    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
    (trimmed.startsWith("[") && trimmed.endsWith("]"))
  );
}

/**
 * Gentle compression - removes filler and optimizes whitespace
 * PRESERVES JSON and markdown structure
 */
function gentleCompress(text: string): string {
  let processed = text;

  // Check if it's JSON - if so, only minify (remove unnecessary whitespace inside strings)
  if (isJSON(processed)) {
    // Simple JSON minification - remove whitespace outside of string values
    // This preserves the JSON structure while reducing size
    processed = processed.replace(/:\s+/g, ":");
    processed = processed.replace(/,\s+/g, ",");
    processed = processed.replace(/\s+/g, " ");
    processed = processed.trim();
    return processed;
  }

  // Check if text contains markdown code blocks - preserve them
  const hasCodeBlocks = /```[\s\S]*?```/.test(processed);
  const codeBlockPositions: { start: number; end: number }[] = [];
  if (hasCodeBlocks) {
    const codeBlockRegex = /```[\s\S]*?```/g;
    let match;
    while ((match = codeBlockRegex.exec(processed)) !== null) {
      codeBlockPositions.push({
        start: match.index,
        end: match.index + match[0].length,
      });
    }
  }

  // For markdown, we need to be more careful - only remove extra spaces between words, not structural whitespace
  const lines = processed.split("\n");
  const processedLines: string[] = [];

  for (const line of lines) {
    let lineResult = line;

    // Check if this line is a markdown structural element
    if (isMarkdownLine(line)) {
      // Preserve markdown structure - only remove filler words, not whitespace
      for (const { pattern } of REMOVABLE_PATTERNS.slice(0, 4)) {
        lineResult = lineResult.replace(pattern, "");
      }
      processedLines.push(lineResult.trim());
      continue;
    }

    // Check if we're inside a code block (by checking position)
    const lineStart = processed.indexOf(line);
    const lineEnd = lineStart + line.length;
    const inCodeBlock = codeBlockPositions.some(
      (pos) => lineStart >= pos.start && lineEnd <= pos.end,
    );

    if (inCodeBlock) {
      // Preserve code block content as-is
      processedLines.push(line);
      continue;
    }

    // For regular text lines, apply compression
    for (const { pattern } of REMOVABLE_PATTERNS.slice(0, 4)) {
      lineResult = lineResult.replace(pattern, "");
    }

    // Only collapse multiple spaces to single space for regular text, preserve line breaks
    lineResult = lineResult.replace(/[ \t]+/g, " ");
    lineResult = lineResult.replace(/([!?.])\1+/g, "$1");
    lineResult = lineResult.replace(/\s+([!?.])/g, "$1");
    processedLines.push(lineResult.trim());
  }

  // Join lines and clean up
  let result = processedLines.join("\n");
  result = result.replace(/\n{3,}/g, "\n\n"); // Max 2 consecutive newlines
  result = result.trim();

  return result;
}

/**
 * Balanced compression - removes examples/context, keeps key info
 */
function balancedCompress(text: string): string {
  let result = gentleCompress(text);

  // Remove example sentences
  result = result
    .replace(
      /\b(For example|For instance|Such as|Like when|As an illustration)\b[^.]*\.?/gi,
      "",
    )
    .replace(/\b(including|e.g.|i.e.)\b[^,]*,?/gi, "")
    .replace(/\([^)]*\)/g, "")
    .replace(/\s+/g, " ");

  // Remove introductory/context sentences
  const introPatterns = [
    /\bI'm working on\b[^.]*\.?/gi,
    /\bI am working on\b[^.]*\.?/gi,
    /\bMy goal is\b[^.]*\.?/gi,
    /\bI need to create\b[^.]*\.?/gi,
    /\bI am trying to\b[^.]*\.?/gi,
    /\bI am creating\b[^.]*\.?/gi,
    /\bCurrently\b[^.]*\.?/gi,
    /\bRight now\b[^.]*\.?/gi,
    /\bAt the moment\b[^.]*\.?/gi,
  ];

  for (const pattern of introPatterns) {
    result = result.replace(pattern, "");
  }

  // Collapse lists
  result = result.replace(/([^,]+,[^,]+,[^,]+),(?=[^,]+,[^,]+)/g, "$1, etc.");
  result = result.replace(/\s+/g, " ").trim();

  return result;
}

/**
 * Aggressive compression - extracts core intent only
 */
function aggressiveCompress(text: string): string {
  let result = balancedCompress(text);

  // Remove articles
  result = result.replace(/\b(a |an |the )\b/gi, "");

  // Remove adjectives
  const adjectivesToRemove =
    /\b(new|old|big|small|large|tiny|huge|enormous|beautiful|nice|great|good|bad|interesting|important|current|existing|modern|simple|complex|basic|advanced|popular|useful|helpful|powerful|fast|quick|slow|easy|difficult|hard|soft|strong|weak)\b/gi;
  result = result.replace(adjectivesToRemove, "");

  // Remove adverbs
  result = result.replace(
    /\b(slowly|quickly|easily|hard|well|badly|carefully|suddenly|finally|recently|currently)\b/gi,
    "",
  );

  // Remove conjunctions
  result = result.replace(/\b(and|but|or|so|yet)\s+/gi, "");

  // Truncate to first 5 sentences
  const lines = result.split(/[.!?]/).filter((line) => line.trim().length > 0);
  const truncatedLines = lines.slice(0, 5);
  result = truncatedLines.join(". ");

  // Final cleanup
  result = result
    .replace(/\s+/g, " ")
    .replace(/\b,\s*,/g, ",")
    .replace(/\s+([,.])\s*/g, "$1")
    .trim();

  // If still too long, truncate at word boundary
  if (result.length > 500) {
    const words = result.split(/\s+/);
    result = words.slice(0, Math.floor(words.length * 0.6)).join(" ") + ".";
  }

  return result;
}

/**
 * Iterative compression to hit target token count
 */
function iterativeCompress(
  text: string,
  strategy: CompressionStrategy,
  originalTokens: number,
): string {
  const target = TARGET_RATIOS[strategy];
  const targetMaxTokens = Math.floor(originalTokens * target.maxKeep);
  let currentText = text;
  let iterations = 0;
  const maxIterations = 20;

  while (
    countTokens(currentText) > targetMaxTokens &&
    iterations < maxIterations
  ) {
    const previousText = currentText;

    // Apply next priority level
    const startPriority = Math.floor(iterations / 3) + 1;
    const endPriority = Math.min(startPriority + 2, 6);

    for (let p = startPriority; p <= endPriority && p <= 6; p++) {
      const patterns = REMOVABLE_PATTERNS.filter((r) => r.priority === p);
      for (const { pattern } of patterns) {
        currentText = currentText.replace(pattern, "");
      }
    }

    // Force remove if no change - progressively more aggressive
    if (previousText === currentText) {
      // Increase threshold from 3 to 4 characters after more iterations
      const threshold = iterations > 10 ? 5 : iterations > 5 ? 4 : 3;
      currentText = currentText.replace(
        new RegExp(`\\b\\w{1,${threshold}}\\b`, "g"),
        "",
      );
      currentText = currentText.replace(/\s+/g, " ");
    }

    currentText = currentText.trim();
    iterations++;

    if (currentText.length < 20) break;
  }

  return currentText;
}

/**
 * Validate compression results
 */
function validateCompression(
  originalTokens: number,
  compressedTokens: number,
  strategy: CompressionStrategy,
): {
  achieved: number;
  target: number;
  meetsTarget: boolean;
  warning?: string;
} {
  const target = TARGET_RATIOS[strategy];
  const minTokens = Math.floor(originalTokens * target.minKeep);
  const maxTokens = Math.floor(originalTokens * target.maxKeep);
  const achievedRatio =
    ((originalTokens - compressedTokens) / originalTokens) * 100;
  const targetReduction = (1 - target.maxKeep) * 100;
  const meetsTarget =
    compressedTokens >= minTokens && compressedTokens <= maxTokens;

  let warning: string | undefined;
  if (!meetsTarget) {
    if (compressedTokens > maxTokens) {
      warning = `${strategy}: Got ${compressedTokens} tokens, target was ${maxTokens} or less. Consider more aggressive compression.`;
    } else if (compressedTokens < minTokens) {
      warning = `${strategy}: Got ${compressedTokens} tokens, minimum was ${minTokens}. This may be too aggressive.`;
    }
  }

  return {
    achieved: achievedRatio,
    target: targetReduction,
    meetsTarget,
    warning,
  };
}

/**
 * Main compression function
 */
export async function compressPrompt(
  prompt: string,
  strategy: CompressionStrategy,
  config?: CompressionConfig,
): Promise<CompressionResult> {
  const originalTokens = countTokens(prompt);

  if (!prompt.trim()) {
    return {
      compressedText: "",
      originalTokens: 0,
      compressedTokens: 0,
      compressionRatio: 0,
      strategyUsed: strategy,
      warning: undefined,
    };
  }

  let compressedText: string;

  // Handle TOON encoding separately
  if (strategy === "toon") {
    const toonResult = await compressWithTOON(prompt);
    return {
      compressedText: toonResult.compressedText,
      originalTokens: toonResult.originalTokens,
      compressedTokens: toonResult.compressedTokens,
      compressionRatio: toonResult.compressionRatio,
      strategyUsed: toonResult.strategyUsed,
      warning: "Best for reducing JSON prompt tokens",
    };
  }

  switch (strategy) {
    case "gentle":
      compressedText = gentleCompress(prompt);
      break;
    case "balanced":
      compressedText = balancedCompress(prompt);
      break;
    case "aggressive":
      compressedText = aggressiveCompress(prompt);
      break;
    default:
      compressedText = gentleCompress(prompt);
  }

  // Apply iterative compression
  compressedText = iterativeCompress(compressedText, strategy, originalTokens);

  // Ensure we have output
  if (!compressedText.trim()) {
    compressedText = prompt;
  }

  const compressedTokens = countTokens(compressedText);
  const validation = validateCompression(
    originalTokens,
    compressedTokens,
    strategy,
  );
  const compressionRatio =
    originalTokens > 0
      ? ((originalTokens - compressedTokens) / originalTokens) * 100
      : 0;

  return {
    compressedText,
    originalTokens,
    compressedTokens,
    compressionRatio,
    strategyUsed: strategy,
    warning: config?.verbose ? validation.warning : undefined,
  };
}

/**
 * Check if a prompt is too short for aggressive compression
 */
export function shouldWarnAboutAggressive(originalTokens: number): boolean {
  return originalTokens > 0 && originalTokens < 200;
}

/**
 * Get compression target info for display
 */
export function getCompressionTargets(strategy: CompressionStrategy) {
  return TARGET_RATIOS[strategy];
}
