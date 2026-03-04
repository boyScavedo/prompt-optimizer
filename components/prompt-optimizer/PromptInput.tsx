"use client";

import React, { useId } from "react";

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

/**
 * Prompt input textarea component
 * Large textarea for users to paste their LLM prompts
 */
export function PromptInput({
  value,
  onChange,
  placeholder = "Paste your prompt here...",
  disabled = false,
}: PromptInputProps) {
  const id = useId();

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        Input Prompt
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full h-64 md:h-80 p-4 text-sm font-mono bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        aria-label="Prompt input"
        aria-describedby={value ? "input-char-count" : undefined}
      />
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
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          Auto-token counting
        </span>
      </div>
    </div>
  );
}
