# Prompt Optimizer

A production-ready, frontend-only web app for compressing and optimizing LLM prompts. All processing happens in the browser - your data never leaves your device.

## Features

- **Fast Mode**: Rule-based compression using whitespace collapse, filler phrase removal, and redundant word pruning
- **Smart Mode**: Advanced compression with context-aware truncation
- **Real-time Token Counting**: Using js-tiktoken for accurate GPT token counting
- **Target Token Slider**: Adjustable target from 50-1000 tokens
- **Copy to Clipboard**: One-click copy with visual feedback
- **Responsive Design**: Mobile-first, works on all devices
- **Privacy-First**: 100% client-side processing

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

1. Paste your LLM prompt in the input area
2. Select optimization mode:
   - **Fast (Rule-based)**: Quick compression, preserves most meaning
   - **Smart (Advanced)**: More aggressive, context-aware compression
3. Adjust target token count using the slider
4. Click "Optimize Prompt"
5. Copy the optimized result

## Technical Details

- **Token Counting**: Uses `js-tiktoken` with GPT-4o encoding
- **Compression**: Rule-based heuristics with smart truncation
- **Framework**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Browser Support**: Chrome, Firefox, Safari, Edge (modern versions)

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Deploy

### Subdomain Configuration

For deployment to `prompt.jeevanadhikari.com.np`:

1. Add domain in Vercel project settings
2. Configure DNS records:
   - CNAME: prompt → your-project.vercel.app

## License

MIT
