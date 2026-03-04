"use client";

import { motion } from "framer-motion";
import {
  Leaf,
  Scale,
  Flame,
  Sparkles,
  AlertTriangle,
  Star,
  Code2,
} from "lucide-react";
import type { CompressionStrategy } from "@/lib/prompt-optimizer/types";

interface StrategyCardProps {
  strategy: CompressionStrategy;
  isSelected: boolean;
  onSelect: (strategy: CompressionStrategy) => void;
}

interface StrategyConfig {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  savings: string;
  color: string;
  bgGradient: string;
  borderColor: string;
  helperText: string;
  recommended?: boolean;
  warning?: string;
}

const strategyConfig: Record<CompressionStrategy, StrategyConfig> = {
  gentle: {
    icon: Leaf,
    title: "Gentle",
    description: "Structure-safe compression",
    savings: "~25-35%",
    color: "text-emerald-400",
    bgGradient: "from-emerald-500/20",
    borderColor: "border-emerald-500/30",
    helperText: "Preserves markdown, code blocks, and structure",
  },
  balanced: {
    icon: Scale,
    title: "Balanced",
    description: "Best for most prompts",
    savings: "~50-60%",
    color: "text-blue-400",
    bgGradient: "from-blue-500/20",
    borderColor: "border-blue-500/30",
    helperText: "Summarizes verbose sections while keeping requirements",
    recommended: true,
  },
  aggressive: {
    icon: Flame,
    title: "Aggressive",
    description: "Maximum compression",
    savings: "~70-80%",
    color: "text-violet-400",
    bgGradient: "from-violet-500/20",
    borderColor: "border-violet-500/30",
    helperText: "Extracts only core intent - use with caution",
    warning: "May lose details",
  },
  toon: {
    icon: Code2,
    title: "TOON Encode",
    description: "Token-Oriented Object Notation",
    savings: "~30-60%",
    color: "text-cyan-400",
    bgGradient: "from-cyan-500/20",
    borderColor: "border-cyan-500/30",
    helperText: "Maximum token efficiency for LLM-to-LLM communication",
  },
};

export function StrategyCard({
  strategy,
  isSelected,
  onSelect,
}: StrategyCardProps) {
  const config = strategyConfig[strategy];
  const Icon = config.icon;

  return (
    <motion.button
      onClick={() => onSelect(strategy)}
      className={`
        strategy-card relative w-full p-4 rounded-2xl text-left
        glass-card border-2 transition-all duration-300
        ${
          isSelected
            ? `selected border-violet-500/50 bg-violet-500/10`
            : "border-white/5 hover:border-white/20"
        }
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Recommended Badge */}
      {config.recommended && (
        <div className="absolute -top-3 right-4">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-linear-to-r from-amber-500/20 to-yellow-500/20 text-amber-400 border border-amber-500/30">
            <Star className="w-3 h-3 fill-current" />
            Recommended
          </span>
        </div>
      )}

      {/* Icon & Title */}
      <div className="flex items-start gap-3">
        <div
          className={`
          p-2 rounded-xl bg-linear-to-br ${config.bgGradient} border ${config.borderColor}
        `}
        >
          <Icon className={`w-5 h-5 ${config.color}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-100">{config.title}</h3>
            {isSelected && (
              <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
            )}
          </div>
          <p className="text-sm text-slate-400 mt-0.5">{config.description}</p>
        </div>
      </div>

      {/* Savings Badge */}
      <div className="mt-3 flex items-center justify-between">
        <span
          className={`
          inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium
          bg-linear-to-r ${config.bgGradient} ${config.color} border ${config.borderColor}
        `}
        >
          {config.savings} saved
        </span>

        {config.warning && (
          <span className="flex items-center gap-1 text-xs text-amber-400">
            <AlertTriangle className="w-3 h-3" />
            {config.warning}
          </span>
        )}
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <motion.div
          layoutId="selection-glow"
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            boxShadow:
              "0 0 30px rgba(139, 92, 246, 0.3), inset 0 0 30px rgba(139, 92, 246, 0.1)",
          }}
        />
      )}
    </motion.button>
  );
}

export function getStrategyHelperText(strategy: CompressionStrategy): string {
  return strategyConfig[strategy].helperText;
}
