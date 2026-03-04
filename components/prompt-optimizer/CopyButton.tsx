"use client";

import React, { useState, useCallback } from "react";
import { copyToClipboard, isClipboardSupported } from "@/utils/clipboard";

interface CopyButtonProps {
  textToCopy: string;
  label?: string;
}

/**
 * Copy button component with toast feedback
 * Copies text to clipboard and shows a temporary success state
 */
export function CopyButton({ textToCopy, label = "Copy" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const [copySupported] = useState(isClipboardSupported);

  const handleCopy = useCallback(async () => {
    if (!textToCopy) return;

    const success = await copyToClipboard(textToCopy);

    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [textToCopy]);

  const isDisabled = !textToCopy || !copySupported;

  return (
    <button
      onClick={handleCopy}
      disabled={isDisabled}
      className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all flex items-center gap-2 ${
        copied
          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700"
          : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-gray-50 dark:hover:bg-gray-600"
      } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-gray-700`}
      aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
    >
      {copied ? (
        <>
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
          Copied!
        </>
      ) : (
        <>
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
              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
            />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}
