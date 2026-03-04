"use client";

import React from "react";
import type { CompressionStrategy } from "@/lib/prompt-optimizer/types";
import { STRATEGY_INFO } from "@/lib/prompt-optimizer/compressionStrategies";

interface OptimizationControlsProps {
  strategy: CompressionStrategy;
  onStrategyChange: (strategy: CompressionStrategy) => void;
  onOptimize: () => void;
  isOptimizing: boolean;
  inputEmpty: boolean;
  showWarning?: boolean;
}

/**
 * Optimization controls component
 * Contains strategy segmented control and optimize button
 */
export function OptimizationControls({
  strategy,
  onStrategyChange,
  onOptimize,
  isOptimizing,
  inputEmpty,
  showWarning = false,
}: OptimizationControlsProps) {
  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
      {/* Strategy Selection */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Compression Strategy
        </label>

        {/* Segmented Control */}
        <div
          className="flex flex-col sm:flex-row gap-2"
          role="radiogroup"
          aria-label="Compression strategy"
        >
          {STRATEGY_INFO.map((info) => (
            <button
              key={info.id}
              onClick={() => onStrategyChange(info.id)}
              disabled={isOptimizing}
              className={`flex-1 px-3 py-3 text-sm font-medium rounded-lg border transition-all text-left ${
                strategy === info.id
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              role="radio"
              aria-checked={strategy === info.id}
            >
              <div className="flex flex-col gap-1">
                <span className="font-semibold">{info.label}</span>
                <span
                  className={`text-xs ${
                    strategy === info.id
                      ? "text-indigo-100"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {info.estimatedSavings}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Description */}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {STRATEGY_INFO.find((s) => s.id === strategy)?.description}
        </p>

        {/* Warning for aggressive on short prompts */}
        {showWarning && strategy === "aggressive" && (
          <div className="flex items-center gap-2 p-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded">
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>May remove important details from short prompts</span>
          </div>
        )}
      </div>

      {/* Optimize Button */}
      <button
        onClick={onOptimize}
        disabled={isOptimizing || inputEmpty}
        className="w-full py-3 px-6 text-base font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600 transition-all flex items-center justify-center gap-2"
      >
        {isOptimizing ? (
          <>
            <svg
              className="animate-spin w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Optimizing...
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5"
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
            Optimize Prompt
          </>
        )}
      </button>
    </div>
  );
}
