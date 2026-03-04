"use client";

import React, { useId } from "react";

interface OptimizedOutputProps {
  value: string;
  isEmpty?: boolean;
  disabled?: boolean;
}

/**
 * Optimized output display component
 * Read-only textarea showing the compressed prompt
 */
export function OptimizedOutput({
  value,
  isEmpty = true,
  disabled = false,
}: OptimizedOutputProps) {
  const id = useId();

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        Optimized Prompt
      </label>
      <div className="relative">
        <textarea
          id={id}
          value={value}
          readOnly
          disabled={disabled}
          placeholder={
            isEmpty ? "Optimized output will appear here..." : undefined
          }
          className="w-full h-64 md:h-80 p-4 text-sm font-mono bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 transition-all"
          aria-label="Optimized prompt output"
        />
        {isEmpty && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center text-gray-400 dark:text-gray-500">
              <svg
                className="w-12 h-12 mx-auto mb-2 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-sm">Enter a prompt and click Optimize</p>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
        <span>Characters: {value.length}</span>
        <span className="flex items-center gap-1">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          Ready to copy
        </span>
      </div>
    </div>
  );
}
