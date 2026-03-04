"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Zap,
  Shield,
  Sparkles,
  MessageSquare,
  TrendingDown,
  ArrowRight,
} from "lucide-react";
import { BackgroundEffects } from "@/components/prompt-optimizer/BackgroundEffects";

/**
 * Custom gradient button for onboarding page (without onClick required)
 */
function OnboardingButton({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  return (
    <Link href={href} className="inline-block">
      <motion.div
        className="relative h-14 px-8 rounded-xl font-semibold text-lg overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-violet-500/25"
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-linear-to-r from-violet-600 via-blue-600 to-cyan-600 animate-gradient" />

        {/* Shimmer Effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-linear-to-r from-transparent via-white/20 to-transparent" />
        </div>

        {/* Border Gradient */}
        <div className="absolute inset-0 rounded-xl p-px">
          <div className="absolute inset-0 rounded-xl bg-linear-to-r from-violet-400 via-blue-400 to-cyan-400 opacity-50" />
        </div>

        {/* Content */}
        <div className="relative flex items-center justify-center gap-2 h-full">
          <Sparkles className="w-5 h-5 text-white animate-pulse" />
          <span className="text-white">{children}</span>
        </div>
      </motion.div>
    </Link>
  );
}

/**
 * Onboarding Home Page - Landing page with stunning UI matching /prompt-optimizer
 */
export default function HomePage() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const features = [
    {
      icon: <TrendingDown className="w-6 h-6 text-violet-400" />,
      title: "Save Up to 80% Tokens",
      description:
        "Reduce token usage while preserving your prompt's core intent and context.",
    },
    {
      icon: <Shield className="w-6 h-6 text-emerald-400" />,
      title: "100% Private & Secure",
      description:
        "All processing happens locally in your browser. No data ever leaves your device.",
    },
    {
      icon: <Zap className="w-6 h-6 text-cyan-400" />,
      title: "Lightning Fast",
      description:
        "Optimize your prompts instantly with our client-side compression engine.",
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-blue-400" />,
      title: "Multiple Strategies",
      description:
        "Choose from Gentle, Balanced, or Aggressive compression modes.",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <BackgroundEffects />

      {/* Main Content */}
      <div className="relative z-10 container-custom py-8 md:py-12">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-white/10 text-sm text-slate-400 m-6">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span>AI Prompt Optimization Tool</span>
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
            className="text-lg text-slate-400 max-w-2xl mx-auto mb-8"
          >
            Transform verbose prompts into concise, token-efficient versions.
            Save up to 80% on API costs while maintaining context.
          </motion.p>

          <motion.div variants={itemVariants}>
            <OnboardingButton href="/prompt-optimizer">
              <span className="flex items-center gap-2">
                Start Optimizing
                <ArrowRight className="w-5 h-5" />
              </span>
            </OnboardingButton>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-sm text-slate-500 mt-4"
          >
            No sign-up required • Free to use • Runs locally
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="glass-card rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900/50 border border-white/10 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-100 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-400">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* How It Works Section */}
        <motion.div
          className="mb-16"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl font-bold text-center mb-12"
          >
            <span className="gradient-text">How It Works</span>
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Paste Your Prompt",
                description:
                  "Enter any LLM prompt you want to optimize in the input field.",
              },
              {
                step: "02",
                title: "Choose Strategy",
                description:
                  "Select from Gentle, Balanced, or Aggressive compression modes.",
              },
              {
                step: "03",
                title: "Get Optimized Result",
                description:
                  "Receive a token-efficient version ready to use with any LLM.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative"
              >
                <div className="glass-card rounded-2xl p-6">
                  <span className="text-5xl font-bold text-violet-500/30 mb-4 block">
                    {item.step}
                  </span>
                  <h3 className="text-xl font-semibold text-slate-100 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-400">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-slate-600" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div
            variants={itemVariants}
            className="glass-card rounded-2xl p-8 md:p-12 max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-slate-100 mb-4">
              Ready to Optimize Your Prompts?
            </h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              Join other developers and AI enthusiasts who are already saving
              tokens and reducing costs with our optimizer.
            </p>
            <OnboardingButton href="/prompt-optimizer">
              <span className="flex items-center gap-2">
                Get Started Now
                <ArrowRight className="w-5 h-5" />
              </span>
            </OnboardingButton>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="border-t border-white/5 pt-8  mb-2!"
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
              <Link
                target="_blank"
                href="https://github.com/boyScavedo"
                className="p-2 rounded-lg bg-slate-900/50 hover:bg-slate-800/50 border border-white/10 hover:border-white/20 transition-all hover:scale-110"
              >
                <svg
                  className="w-5 h-5 text-slate-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </Link>
              <Link
                target="_blank"
                href="https://x.com/JeevanAdhi22387"
                className="p-2 rounded-lg bg-slate-900/50 hover:bg-slate-800/50 border border-white/10 hover:border-white/20 transition-all hover:scale-110"
              >
                <svg
                  className="w-5 h-5 text-slate-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
            </div>

            <p className="text-xs text-slate-600">Built by Jeevan Adhikari</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
