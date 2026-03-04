# Prompt Optimizer

[Live Website](https://prompt.jeevanadhikari.com.np)

[![Prompt Optimizer](/public/og-image.svg)](https://prompt.jeevanadhikari.com.np)

A production-ready, 100% client-side web application for compressing and optimizing LLM prompts using TOON encoding. Reduce token usage by 30-60% while preserving your prompt's core intent - all processing happens in your browser, your data never leaves your device.

## Features

- **TOON Encoding**: Advanced compression using TOON format to reduce token usage by 30-60%
- **Multiple Strategies**: Choose from Gentle, Balanced, or Aggressive compression modes
- **Real-time Token Counting**: Live token counting before and after optimization
- **100% Private**: All processing happens in your browser - no data ever leaves your device
- **Privacy-First**: No API calls, no backend, no data collection
- **Responsive Design**: Mobile-first, works on all devices
- **Beautiful UI**: Modern dark theme with gradient accents

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
app/
├── prompt-optimizer/
│   ├── page.tsx       # Main optimizer UI
│   ├── layout.tsx     # Shared layout with nav/footer
│   └── loading.tsx    # Skeleton loader
components/
├── prompt-optimizer/
│   ├── PromptInput.tsx
│   ├── OptimizedOutput.tsx
│   ├── TokenCounter.tsx
│   ├── OptimizationControls.tsx
│   └── CopyButton.tsx
lib/
├── prompt-optimizer/
│   ├── tokenUtils.ts           # js-tiktoken wrappers
│   ├── compressionStrategies.ts # Rule-based + smart compression
│   └── types.ts                # TypeScript interfaces
utils/
├── clipboard.ts               # Safe copy-to-clipboard
└── localStorage.ts            # User preferences
```

## Usage

1. Visit the [Live Website](https://prompt-optimizer.com) or run locally
2. Paste your LLM prompt in the input area
3. Select compression strategy:
   - **Gentle**: Light compression, preserves most meaning (~20-30% reduction)
   - **Balanced**: Moderate compression, good balance (~40-50% reduction)
   - **Aggressive**: Maximum compression, significant reduction (~70-80% reduction)
   - **TOON**: Encode using TOON format for maximum efficiency
4. Click "Optimize Prompt"
5. View the token savings and copy the optimized result

## Technical Details

- **Token Counting**: Uses `js-tiktoken` with GPT-4o encoding
- **Compression**: Rule-based heuristics with smart truncation
- **Framework**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Browser Support**: Chrome, Firefox, Safari, Edge (modern versions)

## License

MIT
