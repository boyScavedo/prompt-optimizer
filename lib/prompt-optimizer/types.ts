/**
 * TypeScript interfaces for the Prompt Optimizer app
 */

/**
 * Compression strategy selection
 */
export type CompressionStrategy = "gentle" | "balanced" | "aggressive" | "toon";

/**
 * Compression result from any strategy
 */
export interface CompressionResult {
  compressedText: string;
  originalTokens: number;
  compressedTokens: number;
  compressionRatio: number;
  strategyUsed: CompressionStrategy;
  warning?: string;
}

/**
 * Configuration options for compression
 */
export interface CompressionConfig {
  verbose?: boolean;
  forceTarget?: number;
}

/**
 * Strategy info with estimated savings
 */
export interface StrategyInfo {
  id: CompressionStrategy;
  label: string;
  description: string;
  estimatedSavings: string;
}

/**
 * Model loading progress state
 */
export interface ModelProgress {
  status: "idle" | "loading" | "ready" | "error";
  progress?: number;
  message?: string;
}

/**
 * User preferences stored in localStorage
 */
export interface UserPreferences {
  defaultStrategy: CompressionStrategy;
  lastInput?: string;
}

/**
 * Toast notification state
 */
export interface ToastState {
  show: boolean;
  message: string;
  type: "success" | "error" | "info";
}
