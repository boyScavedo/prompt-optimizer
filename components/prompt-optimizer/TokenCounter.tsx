"use client";

import React from "react";

interface TokenCounterProps {
  inputTokens: number;
  outputTokens: number;
  compressionRatio?: number;
}

/**
 * Token counter display component
 * Shows input/output token counts with compression ratio
 */
export function TokenCounter({
  inputTokens,
  outputTokens,
  compressionRatio = 0,
}: TokenCounterProps) {
  const isLive = inputTokens > 0;

  return (
    <div
      className="flex flex-wrap items-center gap-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg"
      role="status"
      aria-live="polite"
      aria-label="Token count information"
    >
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-blue-500" aria-hidden="true" />
        <span className="text-sm text-gray-600 dark:text-gray-400">Input:</span>
        <span
          className="text-sm font-semibold text-gray-900 dark:text-gray-100 tabular-nums"
          aria-label={`${inputTokens} tokens`}
        >
          {inputTokens.toLocaleString()}
        </span>
      </div>

      <div
        className="w-px h-4 bg-gray-300 dark:bg-gray-600"
        aria-hidden="true"
      />

      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500" aria-hidden="true" />
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Output:
        </span>
        <span
          className="text-sm font-semibold text-gray-900 dark:text-gray-100 tabular-nums"
          aria-label={`${outputTokens} tokens`}
        >
          {outputTokens.toLocaleString()}
        </span>
      </div>

      <div
        className="w-px h-4 bg-gray-300 dark:bg-gray-600"
        aria-hidden="true"
      />

      <div className="flex items-center gap-2">
        <div
          className="w-2 h-2 rounded-full bg-indigo-500"
          aria-hidden="true"
        />
        <span className="text-sm text-gray-600 dark:text-gray-400">Saved:</span>
        <span
          className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 tabular-nums"
          aria-label={`${compressionRatio.toFixed(1)}% compression`}
        >
          {compressionRatio.toFixed(1)}%
        </span>
      </div>

      {!isLive && (
        <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto">
          Enter text to count tokens
        </span>
      )}
    </div>
  );
}
