"use client";

import { motion } from "framer-motion";
import {
  Code2,
  Sparkles,
  Copy,
  Check,
  Eye,
  EyeOff,
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import type { CompressionStrategy } from "@/lib/prompt-optimizer/types";
import { optimizeWithTOON } from "@/utils/toonOptimizer";

interface TOONStrategyCardProps {
  isSelected: boolean;
  onSelect: (strategy: CompressionStrategy) => void;
}

interface TOONResult {
  optimized: string;
  decoded: string;
  tokenSavings: number;
  characterCount: { before: number; after: number };
  tokenCount: { before: number; after: number };
  method: string;
}

export function TOONStrategyCard({
  isSelected,
  onSelect,
}: TOONStrategyCardProps) {
  const [showDecode, setShowDecode] = useState(false);
  const [isEncoding, setIsEncoding] = useState(false);
  const [result, setResult] = useState<TOONResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [inputText, setInputText] = useState("");

  const handleSelect = useCallback(async () => {
    onSelect("toon");

    // If we have input and result isn't generated yet, generate it
    if (inputText && !result) {
      await handleEncode();
    }
  }, [onSelect, inputText, result]);

  const handleEncode = useCallback(async () => {
    if (!inputText.trim()) return;

    setIsEncoding(true);
    try {
      // Small delay for UX
      await new Promise((resolve) => setTimeout(resolve, 100));
      const toonResult = optimizeWithTOON(inputText);
      setResult({
        optimized: toonResult.optimized,
        decoded: toonResult.decoded,
        tokenSavings: toonResult.tokenSavings,
        characterCount: toonResult.characterCount,
        tokenCount: toonResult.tokenCount,
        method: toonResult.method,
      });
    } catch (error) {
      console.error("TOON encoding failed:", error);
    } finally {
      setIsEncoding(false);
    }
  }, [inputText]);

  // const handleCopy = useCallback(async () => {
  //   if (!result?.optimized) return;

  //   try {
  //     await navigator.clipboard.writeText(result.optimized);
  //     setCopied(true);
  //     setTimeout(() => setCopied(false), 2000);
  //   } catch (err) {
  //     console.error("Failed to copy:", err);
  //   }
  // }, [result]);

  return (
    <motion.button
      onClick={handleSelect}
      className={`
        relative w-full p-4 rounded-2xl text-left
        glass-card border-2 transition-all duration-300
        ${
          isSelected
            ? "selected border-cyan-500/50 bg-cyan-500/10"
            : "border-white/5 hover:border-white/20"
        }
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Advanced Badge */}
      <div className="absolute -top-3 right-4">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-linear-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30">
          <Sparkles className="w-3 h-3" />
          Advanced
        </span>
      </div>

      {/* Icon & Title */}
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-linear-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
          <Code2 className="w-5 h-5 text-cyan-400" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-100">TOON Encode</h3>
            {isSelected && (
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            )}
          </div>
          <p className="text-sm text-slate-400 mt-0.5">
            Maximum token efficiency using Token-Oriented Object Notation
          </p>
        </div>
      </div>

      {/* Savings Badge */}
      <div className="mt-3 flex items-center justify-between">
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-linear-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30">
          ~30-60% saved
        </span>
      </div>

      {/* Warning Note */}
      <div className="mt-3 flex items-start gap-2 text-xs text-amber-400">
        <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
        <span>
          Ideal for nested JSON prompts. Great for structured prompts. Not
          recommended for paragraphs of text.
        </span>
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <motion.div
          layoutId="selection-glow-toon"
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            boxShadow:
              "0 0 30px rgba(6, 182, 212, 0.3), inset 0 0 30px rgba(6, 182, 212, 0.1)",
          }}
        />
      )}
    </motion.button>
  );
}

/**
 * TOON Output Panel - Shows when TOON is selected
 */
interface TOONOutputPanelProps {
  inputText: string;
}

export function TOONOutputPanel({ inputText }: TOONOutputPanelProps) {
  const [showDecode, setShowDecode] = useState(false);
  const [isEncoding, setIsEncoding] = useState(false);
  const [result, setResult] = useState<TOONResult | null>(null);
  const [copied, setCopied] = useState(false);

  // Encode when input changes
  const handleEncode = useCallback(async () => {
    if (!inputText.trim()) return;

    setIsEncoding(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const toonResult = optimizeWithTOON(inputText);
      setResult({
        optimized: toonResult.optimized,
        decoded: toonResult.decoded,
        tokenSavings: toonResult.tokenSavings,
        characterCount: toonResult.characterCount,
        tokenCount: toonResult.tokenCount,
        method: toonResult.method,
      });
    } catch (error) {
      console.error("TOON encoding failed:", error);
    } finally {
      setIsEncoding(false);
    }
  }, [inputText]);

  // Auto-encode when input changes
  useEffect(() => {
    if (inputText.trim()) {
      handleEncode();
    }
  }, [inputText, handleEncode]);

  const handleCopy = useCallback(async () => {
    if (!result?.optimized) return;

    try {
      await navigator.clipboard.writeText(result.optimized);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [result]);

  // Calculate reduction percentage for progress bar
  const reductionPercent = result
    ? Math.min(
        100,
        Math.max(
          0,
          ((result.characterCount.before - result.characterCount.after) /
            result.characterCount.before) *
            100,
        ),
      )
    : 0;

  return (
    <div className="glass-card rounded-2xl p-6 border-cyan-500/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-500/30">
            <Code2 className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-100">
              TOON Encoded Output
            </h3>
            <p className="text-xs text-slate-400">
              Token-Oriented Object Notation
            </p>
          </div>
        </div>

        {result && (
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-white/10 transition-all"
            title="Copy to clipboard"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4 text-slate-400" />
            )}
          </button>
        )}
      </div>

      {/* Loading State */}
      {isEncoding && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
          <span className="ml-2 text-sm text-slate-400">Encoding...</span>
        </div>
      )}

      {/* Result */}
      {result && !isEncoding && (
        <>
          {/* Comparison Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Original */}
            <div className="p-3 rounded-lg bg-slate-900/50 border border-white/5">
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <ArrowDown className="w-3 h-3" />
                Original
              </div>
              <div className="text-lg font-semibold text-slate-200">
                {result.characterCount.before} chars
              </div>
              <div className="text-xs text-slate-500">
                {result.tokenCount.before} tokens
              </div>
            </div>

            {/* Encoded */}
            <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/20">
              <div className="flex items-center gap-2 text-xs text-cyan-400 mb-1">
                <ArrowRight className="w-3 h-3" />
                TOON Encoded
              </div>
              <div className="text-lg font-semibold text-cyan-400">
                {result.characterCount.after} chars
              </div>
              <div className="text-xs text-cyan-400/70">
                {result.tokenCount.after} tokens
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Token Reduction</span>
              <span
                className={
                  result.tokenSavings > 0
                    ? "text-emerald-400"
                    : "text-slate-500"
                }
              >
                {result.tokenSavings > 0
                  ? `-${result.tokenSavings.toFixed(1)}%`
                  : "+0%"}
              </span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-linear-to-r from-cyan-500 to-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${reductionPercent}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* TOON Output */}
          <div className="mb-4">
            <label className="text-xs text-slate-400 mb-2 block">
              Encoded Output
            </label>
            <textarea
              readOnly
              value={result.optimized}
              className="w-full h-32 p-3 text-sm bg-cyan-950/30 border border-cyan-500/20 rounded-xl resize-none focus:outline-none text-cyan-100 font-mono"
            />
          </div>

          {/* Decode Toggle */}
          <button
            onClick={() => setShowDecode(!showDecode)}
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-cyan-400 transition-colors mb-4"
          >
            {showDecode ? (
              <>
                <EyeOff className="w-3 h-3" />
                Hide Decoded Preview
              </>
            ) : (
              <>
                <Eye className="w-3 h-3" />
                Show Decoded Preview
              </>
            )}
          </button>

          {/* Decoded Preview */}
          {showDecode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4"
            >
              <label className="text-xs text-slate-400 mb-2 block">
                Decoded Preview
              </label>
              <textarea
                readOnly
                value={result.decoded}
                className="w-full h-32 p-3 text-sm bg-slate-900/50 border border-white/10 rounded-xl resize-none focus:outline-none text-slate-300 font-mono"
              />
            </motion.div>
          )}

          {/* Warning */}
          <div className="flex items-start gap-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>
              This output uses TOON format. The receiving LLM or system needs a
              TOON decoder to parse this correctly.
            </span>
          </div>
        </>
      )}

      {/* Empty State */}
      {!result && !isEncoding && (
        <div className="flex flex-col items-center justify-center py-8 text-slate-500">
          <Code2 className="w-12 h-12 mb-4 opacity-30" />
          <p className="text-sm">
            Enter a prompt and click Optimize to see TOON output
          </p>
        </div>
      )}
    </div>
  );
}

export function getTOONHelperText(): string {
  return "Uses Token-Oriented Object Notation for maximum token efficiency in LLM-to-LLM communication";
}
