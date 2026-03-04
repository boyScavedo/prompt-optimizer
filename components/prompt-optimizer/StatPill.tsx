"use client";

import { motion } from "framer-motion";
import { ArrowUp, Minus } from "lucide-react";

interface StatPillProps {
  label: string;
  value: number;
  suffix?: string;
  variant?: "default" | "success" | "warning" | "danger";
  icon?: React.ReactNode;
}

type StyleVariant = "default" | "success" | "warning" | "danger";

const variantStyles: Record<StyleVariant, string> = {
  default: "border-white/10 bg-slate-900/50 text-slate-300",
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  warning: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  danger: "border-rose-500/30 bg-rose-500/10 text-rose-400",
};

const glowStyles: Record<StyleVariant, string> = {
  default: "",
  success: "shadow-[0_0_20px_rgba(52,211,153,0.2)]",
  warning: "shadow-[0_0_20px_rgba(251,191,36,0.2)]",
  danger: "shadow-[0_0_20px_rgba(244,63,94,0.2)]",
};

export function StatPill({
  label,
  value,
  suffix = "",
  variant = "default",
  icon,
}: StatPillProps) {
  return (
    <motion.div
      className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-full
        border ${variantStyles[variant]} ${glowStyles[variant]}
        transition-all duration-300
      `}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {icon && <span className="text-base">{icon}</span>}
      <span className="text-sm font-medium text-slate-400">{label}:</span>
      <motion.span
        className="text-sm font-semibold"
        key={value}
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
      >
        {value.toLocaleString()}
        {suffix}
      </motion.span>
    </motion.div>
  );
}

interface SavingsDisplayProps {
  inputTokens: number;
  outputTokens: number;
  compressionRatio: number;
  isOptimized: boolean;
}

export function SavingsDisplay({
  inputTokens,
  outputTokens,
  compressionRatio,
  isOptimized,
}: SavingsDisplayProps) {
  const tokensSaved = inputTokens - outputTokens;

  // Only show savings when optimized, otherwise show "—"
  const showSavings = isOptimized && tokensSaved > 0;

  let variant: StyleVariant = "default";
  let icon = <Minus className="w-4 h-4" />;

  if (showSavings) {
    if (compressionRatio >= 30) {
      variant = "success";
      icon = <ArrowUp className="w-4 h-4" />;
    } else if (compressionRatio >= 10) {
      variant = "warning";
      icon = <ArrowUp className="w-4 h-4" />;
    } else {
      variant = "danger";
      icon = <Minus className="w-4 h-4" />;
    }
  }

  const textColorClass =
    variant === "success"
      ? "text-emerald-400"
      : variant === "warning"
        ? "text-amber-400"
        : variant === "danger"
          ? "text-rose-400"
          : "text-slate-300";

  return (
    <motion.div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${variantStyles[variant]} ${glowStyles[variant]}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {icon}
      <span className="text-sm font-medium text-slate-400">Saved:</span>
      <span className={`text-sm font-semibold ${textColorClass}`}>
        {showSavings
          ? `${tokensSaved.toLocaleString()} (${compressionRatio.toFixed(0)}%)`
          : "—"}
      </span>
    </motion.div>
  );
}
