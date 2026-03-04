import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

const BASE_URL = "https://prompt.jeevanadhikari.com.np";

export const metadata: Metadata = {
  title: "Prompt Optimizer | Optimize Your LLM Prompts",
  description:
    "Free browser-based tool to compress and optimize LLM prompts while preserving context. Save up to 80% token usage. 100% client-side, no data leaves your device.",
  keywords: [
    "prompt optimizer",
    "LLM",
    "token optimization",
    "AI prompt",
    "text compression",
    "TOON encoding",
    "prompt compressor",
    "reduce token usage",
    "AI cost savings",
  ],
  authors: [{ name: "Jeevan Adhikari", url: "https://github.com/boyScavedo" }],
  creator: "Jeevan Adhikari",
  publisher: "Jeevan Adhikari",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${BASE_URL}/prompt-optimizer`,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${BASE_URL}/prompt-optimizer`,
    siteName: "Prompt Optimizer",
    title: "Prompt Optimizer | Optimize Your LLM Prompts",
    description:
      "Free browser-based tool to compress and optimize LLM prompts while preserving context. Save up to 80% token usage.",
    images: [
      {
        url: `${BASE_URL}/og-image.svg`,
        width: 1200,
        height: 630,
        alt: "Prompt Optimizer Tool Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@JeevanAdhi22387",
    creator: "@JeevanAdhi22387",
    title: "Prompt Optimizer | Optimize Your LLM Prompts",
    description:
      "Free browser-based tool to compress and optimize LLM prompts. Save up to 80% token usage.",
    images: [`${BASE_URL}/twitter-image.svg`],
  },
  other: {
    "og:region": "Worldwide",
  },
};

// Structured data for WebApplication schema
const webApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Prompt Optimizer",
  url: `${BASE_URL}/prompt-optimizer`,
  description:
    "Free browser-based tool to compress and optimize LLM prompts while preserving context. Save up to 80% token usage.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web Browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  browserRequirements: "Requires JavaScript enabled",
  softwareVersion: "1.0.0",
  author: {
    "@type": "Person",
    name: "Jeevan Adhikari",
    url: "https://github.com/boyScavedo",
  },
};

// FAQ structured data for SEO
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is a prompt optimizer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A prompt optimizer is a tool that reduces the token count of your LLM prompts while preserving the core meaning and context. This helps reduce API costs and improve response times.",
      },
    },
    {
      "@type": "Question",
      name: "Is my data secure?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! All processing happens entirely in your browser. No data is sent to any server, making it 100% private and secure.",
      },
    },
    {
      "@type": "Question",
      name: "How much can I save on tokens?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Depending on the compression strategy used, you can save between 30-80% on token usage while maintaining the prompt's effectiveness.",
      },
    },
    {
      "@type": "Question",
      name: "What compression strategies are available?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We offer multiple strategies: Gentle (minimal compression, best quality), Balanced (moderate compression), Aggressive (maximum compression), and TOON encoding (specialized algorithm).",
      },
    },
    {
      "@type": "Question",
      name: "Is this tool free to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Prompt Optimizer is completely free to use with no sign-up required.",
      },
    },
  ],
};

export default function PromptOptimizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* WebApplication Schema */}
      <Script
        id="webapp-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webApplicationSchema),
        }}
        strategy="afterInteractive"
      />
      {/* FAQ Schema */}
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
        strategy="afterInteractive"
      />
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        {/* Header */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
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
                </div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Prompt Optimizer
                </h1>
              </div>
              <nav className="flex items-center gap-4">
                <Link
                  href="/"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Home
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                © {new Date().getFullYear()} Jeevan Adhikari. All rights
                reserved.
              </p>
              <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span>100% Client-Side Processing</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
