"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Sparkles,
  Copy,
  Trash2,
  Shield,
  Github,
  Twitter,
  Zap,
  ArrowDownToLine,
  ArrowUpFromLine,
} from "lucide-react";
import {
  compressPrompt,
  shouldWarnAboutAggressive,
} from "@/lib/prompt-optimizer/compressionStrategies";
import { countTokens } from "@/lib/prompt-optimizer/tokenUtils";
import { getPreferences, savePreferences } from "@/utils/localStorage";
import type { CompressionStrategy } from "@/lib/prompt-optimizer/types";
import { BackgroundEffects } from "@/components/prompt-optimizer/BackgroundEffects";
import {
  StrategyCard,
  getStrategyHelperText,
} from "@/components/prompt-optimizer/StrategyCard";
import { GradientButton } from "@/components/prompt-optimizer/GradientButton";
import {
  StatPill,
  SavingsDisplay,
} from "@/components/prompt-optimizer/StatPill";
import {
  TOONStrategyCard,
  TOONOutputPanel,
  getTOONHelperText,
} from "@/components/prompt-optimizer/TOONStrategyCard";

/**
 * Main Prompt Optimizer Page - Redesigned with stunning UI
 */
export default function PromptOptimizerPage() {
  // State
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [strategy, setStrategy] = useState<CompressionStrategy>("balanced");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [compressionRatio, setCompressionRatio] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load preferences on mount
  useEffect(() => {
    const prefs = getPreferences();
    if (prefs.defaultStrategy) {
      setStrategy(prefs.defaultStrategy);
    }
    if (prefs.lastInput) {
      setInput(prefs.lastInput);
    }
  }, []);

  // Save preferences when strategy changes
  useEffect(() => {
    savePreferences({ defaultStrategy: strategy });
  }, [strategy]);

  // Token counting for input
  const inputTokens = useMemo(() => {
    if (!input) return 0;
    return countTokens(input);
  }, [input]);

  // Token counting for output
  const outputTokens = useMemo(() => {
    if (!output) return 0;
    return countTokens(output);
  }, [output]);

  // Check if we should show warning for aggressive compression
  useEffect(() => {
    if (strategy === "aggressive" && inputTokens > 0) {
      setShowWarning(shouldWarnAboutAggressive(inputTokens));
    } else {
      setShowWarning(false);
    }
  }, [strategy, inputTokens]);

  // Handle optimization
  const handleOptimize = useCallback(async () => {
    if (!input.trim() || isOptimizing) return;

    setIsOptimizing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 100));

      const result = await compressPrompt(input, strategy);
      setOutput(result.compressedText);
      setCompressionRatio(result.compressionRatio);
    } catch (error) {
      console.error("Optimization failed:", error);
      const result = await compressPrompt(input, "gentle");
      setOutput(result.compressedText);
      setCompressionRatio(result.compressionRatio);
    } finally {
      setIsOptimizing(false);
    }
  }, [input, strategy, isOptimizing]);

  // Handle clear
  const handleClear = useCallback(() => {
    setInput("");
    setOutput("");
    setCompressionRatio(0);
  }, []);

  // Handle copy
  const handleCopy = useCallback(async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [output]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <BackgroundEffects />

      {/* Main Content */}
      <div className="relative z-10 container-custom py-8 md:py-12">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-white/10 text-sm text-slate-400 mb-6">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>100% Client-Side Processing</span>
              <span className="text-slate-600">•</span>
              <span>No Data Leaves Your Browser</span>
            </div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4"
          >
            <span className="gradient-text">Optimize Your LLM Prompts</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg text-slate-400 max-w-2xl mx-auto"
          >
            Paste any LLM prompt and get a token-efficient, context-preserving
            version. Save up to 80% on token usage while maintaining context.
          </motion.p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <StatPill
              label="Input"
              value={inputTokens}
              suffix=" tokens"
              icon={<ArrowDownToLine className="w-4 h-4 text-blue-400" />}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatPill
              label="Output"
              value={outputTokens}
              suffix=" tokens"
              icon={<ArrowUpFromLine className="w-4 h-4 text-emerald-400" />}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <SavingsDisplay
              inputTokens={inputTokens}
              outputTokens={outputTokens}
              compressionRatio={compressionRatio}
            />
          </motion.div>
        </motion.div>

        {/* Main Workspace */}
        <motion.div
          className="grid lg:grid-cols-2 gap-6 mb-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Input Panel */}
          <motion.div
            variants={itemVariants}
            className="glass-card rounded-2xl p-6 md:p-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-500/20 border border-blue-500/30">
                  <FileText className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="font-semibold text-slate-100">Input Prompt</h3>
              </div>
              <span className="text-xs text-slate-500">
                {input.length} chars
              </span>
            </div>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your prompt here..."
              disabled={isOptimizing}
              className="w-full h-80 p-4 text-sm bg-slate-950/50 border border-white/5 rounded-xl resize-none focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all placeholder:text-slate-600 placeholder:italic"
            />

            <div className="flex items-center justify-between mt-4">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Auto-token counting
              </span>
              {input && (
                <button
                  onClick={handleClear}
                  disabled={isOptimizing}
                  className="text-xs text-slate-500 hover:text-rose-400 transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear
                </button>
              )}
            </div>
          </motion.div>

          {/* Output Panel */}
          <motion.div
            variants={itemVariants}
            className="glass-card rounded-2xl p-6 md:p-8 relative group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-violet-500/20 border border-violet-500/30">
                  <Sparkles className="w-5 h-5 text-violet-400" />
                </div>
                <h3 className="font-semibold text-slate-100">
                  Optimized Prompt
                </h3>
              </div>
              {output && (
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-white/10 transition-all opacity-0 group-hover:opacity-100"
                >
                  {copied ? (
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-slate-400" />
                  )}
                </button>
              )}
            </div>

            <div className="relative">
              {output ? (
                <textarea
                  readOnly
                  value={output}
                  className="w-full h-80 p-4 text-sm bg-emerald-950/10 border border-emerald-500/20 rounded-xl resize-none focus:outline-none text-slate-200"
                />
              ) : (
                <div className="w-full h-80 flex flex-col items-center justify-center text-slate-600 border border-dashed border-white/10 rounded-xl">
                  <FileText className="w-12 h-12 mb-4 opacity-30" />
                  <p className="text-sm">Enter a prompt and click Optimize</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Strategy Selection */}
        <motion.div
          className="mb-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-2">
              Compression Strategy
            </h3>
            <p className="text-sm text-slate-400">
              {strategy === "toon"
                ? getTOONHelperText()
                : getStrategyHelperText(strategy)}
            </p>
          </motion.div>

          {/* Standard Compression Strategies */}
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            {(
              ["gentle", "balanced", "aggressive"] as CompressionStrategy[]
            ).map((s) => (
              <StrategyCard
                key={s}
                strategy={s}
                isSelected={strategy === s}
                onSelect={setStrategy}
              />
            ))}
          </div>

          {/* TOON Encode Strategy */}
          <TOONStrategyCard
            isSelected={strategy === "toon"}
            onSelect={setStrategy}
          />
        </motion.div>

        {/* Optimize Button */}
        <motion.div
          className="flex flex-col items-center justify-center max-w-md mx-auto mb-12"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <GradientButton
            onClick={handleOptimize}
            isLoading={isOptimizing}
            disabled={!input.trim()}
          >
            Optimize Prompt
          </GradientButton>

          {showWarning && (
            <motion.p
              className="text-center text-sm text-amber-400 mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              ⚠️ Aggressive mode may lose important details for short prompts
            </motion.p>
          )}
        </motion.div>

        {/* Footer */}
        <motion.div
          className="border-t border-white/5 pt-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center gap-4"
          >
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>
                All processing happens in your browser. No data leaves your
                device.
              </span>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="#"
                className="p-2 rounded-lg bg-slate-900/50 hover:bg-slate-800/50 border border-white/10 hover:border-white/20 transition-all hover:scale-110"
              >
                <Github className="w-5 h-5 text-slate-400" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-slate-900/50 hover:bg-slate-800/50 border border-white/10 hover:border-white/20 transition-all hover:scale-110"
              >
                <Twitter className="w-5 h-5 text-slate-400" />
              </a>
            </div>

            <p className="text-xs text-slate-600">Built by Jeevan Adhikari</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
