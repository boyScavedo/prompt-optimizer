import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import "./globals.css";

const BASE_URL = "https://prompt.jeevanadhikari.com.np";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Prompt Optimizer - Reduce Token Usage by 60%",
    template: "%s | Prompt Optimizer",
  },
  description:
    "Free client-side prompt optimizer using TOON encoding. Reduce LLM token usage by 30-60%. 100% private, no data leaves your browser. Next.js powered.",
  keywords: [
    "prompt optimizer",
    "token reducer",
    "LLM optimization",
    "TOON encoder",
    "AI prompt tool",
    "free prompt compressor",
    "client-side AI tools",
    "Next.js optimizer",
  ],
  authors: [{ name: "Jeevan Adhikari", url: "https://github.com/boyScavedo" }],
  creator: "Jeevan Adhikari",
  publisher: "Jeevan Adhikari",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      en: BASE_URL,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Prompt Optimizer",
    title: "Prompt Optimizer - Reduce Token Usage by 60%",
    description:
      "Free client-side prompt optimizer using TOON encoding. Reduce LLM token usage by 30-60%. 100% private, no data leaves your browser.",
    images: [
      {
        url: `${BASE_URL}/og-image.svg`,
        width: 1200,
        height: 630,
        alt: "Prompt Optimizer Dashboard Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@JeevanAdhi22387",
    creator: "@JeevanAdhi22387",
    title: "Prompt Optimizer - Reduce Token Usage by 60%",
    description:
      "Free client-side prompt optimizer using TOON encoding. Reduce LLM token usage by 30-60%.",
    images: [`${BASE_URL}/twitter-image.svg`],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "android-chrome-192x192",
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        rel: "android-chrome-512x512",
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
  manifest: "/manifest.json",
  category: "technology",
  classification: "AI Tools",
  other: {
    "revisit-after": "7 days",
    region: "US",
    "og:region": "Worldwide",
  },
};

// Structured data for Organization schema
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Prompt Optimizer",
  url: BASE_URL,
  logo: `${BASE_URL}/og-image.svg`,
  sameAs: ["https://github.com/boyScavedo", "https://x.com/JeevanAdhi22387"],
  contactPoint: {
    "@type": "ContactPoint",
    email: "jeevan@example.com",
    contactType: "Developer",
  },
  founder: {
    "@type": "Person",
    name: "Jeevan Adhikari",
    url: "https://github.com/boyScavedo",
  },
};

// Structured data for WebSite schema
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Prompt Optimizer",
  url: BASE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/prompt-optimizer?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
  description:
    "Free client-side prompt optimizer using TOON encoding to reduce LLM token usage by 30-60%",
};

// Structured data for SoftwareApplication schema
const softwareAppSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Prompt Optimizer",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web Browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Free client-side prompt optimizer using TOON encoding to reduce LLM token usage by 30-60%",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5",
    ratingCount: "1",
  },
  author: {
    "@type": "Person",
    name: "Jeevan Adhikari",
    url: "https://github.com/boyScavedo",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Organization Schema */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
          strategy="afterInteractive"
        />
        {/* WebSite Schema */}
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
          strategy="afterInteractive"
        />
        {/* SoftwareApplication Schema */}
        <Script
          id="software-app-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(softwareAppSchema),
          }}
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
