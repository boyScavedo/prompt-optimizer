"use client";

import { motion } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";

interface GradientButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled: boolean;
  children: React.ReactNode;
}

export function GradientButton({
  onClick,
  isLoading,
  disabled,
  children,
}: GradientButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative w-full sm:w-auto h-14 px-8 rounded-xl font-semibold text-lg
        overflow-hidden transition-all duration-300
        ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:shadow-lg hover:shadow-violet-500/25"
        }
      `}
      whileHover={
        !disabled
          ? {
              scale: 1.02,
              y: -2,
            }
          : {}
      }
      whileTap={!disabled ? { scale: 0.98 } : {}}
    >
      {/* Background Gradient */}
      <div
        className={`
        absolute inset-0 bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600
        ${!disabled ? "animate-gradient" : ""}
      `}
      />

      {/* Shimmer Effect */}
      {!disabled && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
      )}

      {/* Border Gradient */}
      <div className="absolute inset-0 rounded-xl p-[1px]">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 opacity-50" />
      </div>

      {/* Content */}
      <div className="relative flex items-center justify-center gap-2 h-full">
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin text-white" />
            <span className="text-white">Optimizing...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
            <span className="text-white">{children}</span>
          </>
        )}
      </div>
    </motion.button>
  );
}
