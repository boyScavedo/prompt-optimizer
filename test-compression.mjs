/**
 * Test with new target ratios and progressive force remove
 */

function countTokens(text) {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}

// NEW target ratios
const TARGET_RATIOS = {
  gentle: { minKeep: 0.7, maxKeep: 0.8 }, // Keep 70-80% = 20-30% reduction
  balanced: { minKeep: 0.5, maxKeep: 0.6 }, // Keep 50-60% = 40-50% reduction
  aggressive: { minKeep: 0.2, maxKeep: 0.3 }, // Keep 20-30% = 70-80% reduction
};

const REMOVABLE_PATTERNS = [
  {
    pattern:
      /\b(please|kindly|would you|could you|can you|will you|should you)\b/gi,
    priority: 1,
  },
  {
    pattern:
      /\b(I would like to|I want you to|I need you to|I'm looking to|I am looking to)\b/gi,
    priority: 1,
  },
  {
    pattern:
      /\b(thank you|thanks|I appreciate|if possible|when you have time|at your earliest convenience)\b/gi,
    priority: 1,
  },
  {
    pattern:
      /\b(for the purpose of|in order to|so that|with the goal of|with the purpose of)\b/gi,
    priority: 1,
  },
  {
    pattern:
      /\b(basically|actually|really|very|quite|just|simply|essentially|absolutely|certainly|definitely|extremely)\b/gi,
    priority: 2,
  },
  {
    pattern:
      /\b(notably|particularly|in particular|especially|specifically)\b/gi,
    priority: 2,
  },
  {
    pattern:
      /\b(I think|I believe|in my opinion|as far as I know|to summarize|to make a long story short|in short)\b/gi,
    priority: 3,
  },
  {
    pattern:
      /\b(please note that|it is important to note that|keep in mind that|bear in mind that|as mentioned above)\b/gi,
    priority: 3,
  },
  {
    pattern:
      /\b(furthermore|moreover|additionally|nevertheless|consequently|therefore|thus|hence)\b/gi,
    priority: 4,
  },
  {
    pattern:
      /\b(on the other hand|that being said|in conclusion|to conclude|to sum up|in summary)\b/gi,
    priority: 4,
  },
  { pattern: /\bdue to the fact that\b/gi, priority: 5 },
  { pattern: /\bin the event that\b/gi, priority: 5 },
  { pattern: /\bat this point in time\b/gi, priority: 5 },
  { pattern: /\bfor the reason that\b/gi, priority: 5 },
  { pattern: /\bin spite of the fact that\b/gi, priority: 5 },
  { pattern: /\b(a |an |the )\b/gi, priority: 6 },
];

function gentleCompress(text) {
  let processed = text;
  for (const { pattern } of REMOVABLE_PATTERNS.slice(0, 4)) {
    processed = processed.replace(pattern, "");
  }
  processed = processed.replace(/\s+/g, " ");
  processed = processed.replace(/([!?.])\1+/g, "$1");
  processed = processed.replace(/\s+([!?.])/g, "$1");
  return processed.trim();
}

function balancedCompress(text) {
  let result = gentleCompress(text);
  result = result
    .replace(
      /\b(For example|For instance|Such as|Like when|As an illustration)\b[^.]*\.?/gi,
      "",
    )
    .replace(/\b(including|e.g.|i.e.)\b[^,]*,?/gi, "")
    .replace(/\([^)]*\)/g, "")
    .replace(/\s+/g, " ");
  const introPatterns = [
    /\bI'm working on\b[^.]*\.?/gi,
    /\bI am working on\b[^.]*\.?/gi,
    /\bMy goal is\b[^.]*\.?/gi,
    /\bI need to create\b[^.]*\.?/gi,
    /\bI am trying to\b[^.]*\.?/gi,
    /\bI am creating\b[^.]*\.?/gi,
    /\bCurrently\b[^.]*\.?/gi,
    /\bRight now\b[^.]*\.?/gi,
    /\bAt the moment\b[^.]*\.?/gi,
  ];
  for (const pattern of introPatterns) {
    result = result.replace(pattern, "");
  }
  result = result.replace(/([^,]+,[^,]+,[^,]+),(?=[^,]+,[^,]+)/g, "$1, etc.");
  return result.replace(/\s+/g, " ").trim();
}

function aggressiveCompress(text) {
  let result = balancedCompress(text);
  result = result.replace(/\b(a |an |the )\b/gi, "");
  result = result.replace(
    /\b(new|old|big|small|large|tiny|huge|enormous|beautiful|nice|great|good|bad|interesting|important|current|existing|modern|simple|complex|basic|advanced|popular|useful|helpful|powerful|fast|quick|slow|easy|difficult|hard|soft|strong|weak)\b/gi,
    "",
  );
  result = result.replace(
    /\b(slowly|quickly|easily|hard|well|badly|carefully|suddenly|finally|recently|currently)\b/gi,
    "",
  );
  result = result.replace(/\b(and|but|or|so|yet)\s+/gi, "");
  const lines = result.split(/[.!?]/).filter((line) => line.trim().length > 0);
  const truncatedLines = lines.slice(0, 5);
  result = truncatedLines.join(". ");
  result = result
    .replace(/\s+/g, " ")
    .replace(/\b,\s*,/g, ",")
    .replace(/\s+([,.])\s*/g, "$1")
    .trim();
  if (result.length > 500) {
    const words = result.split(/\s+/);
    result = words.slice(0, Math.floor(words.length * 0.6)).join(" ") + ".";
  }
  return result;
}

// Updated iterative compression with progressive force remove
function iterativeCompress(text, strategy, originalTokens) {
  const target = TARGET_RATIOS[strategy];
  const targetMaxTokens = Math.floor(originalTokens * target.maxKeep);
  let currentText = text;
  let iterations = 0;
  const maxIterations = 20;

  while (
    countTokens(currentText) > targetMaxTokens &&
    iterations < maxIterations
  ) {
    const previousText = currentText;
    const startPriority = Math.floor(iterations / 3) + 1;
    const endPriority = Math.min(startPriority + 2, 6);

    for (let p = startPriority; p <= endPriority && p <= 6; p++) {
      const patterns = REMOVABLE_PATTERNS.filter((r) => r.priority === p);
      for (const { pattern } of patterns) {
        currentText = currentText.replace(pattern, "");
      }
    }

    // Force remove if no change - progressively more aggressive
    if (previousText === currentText) {
      const threshold = iterations > 10 ? 5 : iterations > 5 ? 4 : 3;
      currentText = currentText.replace(
        new RegExp(`\\b\\w{1,${threshold}}\\b`, "g"),
        "",
      );
      currentText = currentText.replace(/\s+/g, " ");
    }

    currentText = currentText.trim();
    iterations++;
    if (currentText.length < 20) break;
  }

  return currentText;
}

async function compressPrompt(prompt, strategy) {
  const originalTokens = countTokens(prompt);
  if (!prompt.trim()) {
    return {
      compressedText: "",
      originalTokens: 0,
      compressedTokens: 0,
      compressionRatio: 0,
      strategyUsed: strategy,
    };
  }

  let compressedText;
  switch (strategy) {
    case "gentle":
      compressedText = gentleCompress(prompt);
      break;
    case "balanced":
      compressedText = balancedCompress(prompt);
      break;
    case "aggressive":
      compressedText = aggressiveCompress(prompt);
      break;
    default:
      compressedText = gentleCompress(prompt);
  }

  compressedText = iterativeCompress(compressedText, strategy, originalTokens);
  const compressedTokens = countTokens(compressedText);
  const compressionRatio =
    originalTokens > 0
      ? ((originalTokens - compressedTokens) / originalTokens) * 100
      : 0;

  return {
    compressedText,
    originalTokens,
    compressedTokens,
    compressionRatio,
    strategyUsed: strategy,
  };
}

const testPrompt = `Export all of my stored memories and any context you've learned about me from past conversations. Preserve my words verbatim where possible, especially for instructions and preferences.

## Categories (output in this order):

1. **Instructions**: Rules I've explicitly asked you to follow going forward — tone, format, style, "always do X", "never do Y", and corrections to your behavior. Only include rules from stored memories, not from conversations.

2. **Identity**: Name, age, location, education, family, relationships, languages, and personal interests.

3. **Career**: Current and past roles, companies, and general skill areas.

4. **Projects**: Projects I meaningfully built or committed to. Ideally ONE entry per project. Include what it does, current status, and any key decisions. Use the project name or a short descriptor as the first words of the entry.

5. **Preferences**: Opinions, tastes, and working-style preferences that apply broadly.

## Format:

Use section headers for each category. Within each category, list one entry per line, sorted by oldest date first. Format each line as:

[YYYY-MM-DD] - Entry content here.

If no date is known, use [unknown] instead.

## Output:
- Wrap the entire export in a single code block for easy copying.
- After the code block, state whether this is the complete set or if more remain.`;

async function testCompression() {
  console.log("=== Testing WITH Progressive Force Remove ===\n");

  const strategies = ["gentle", "balanced", "aggressive"];

  for (const strategy of strategies) {
    const result = await compressPrompt(testPrompt, strategy);
    const target = TARGET_RATIOS[strategy];
    const minReduction = (1 - target.maxKeep) * 100;
    const maxReduction = (1 - target.minKeep) * 100;

    const meetsTarget =
      result.compressionRatio >= minReduction &&
      result.compressionRatio <= maxReduction;

    console.log(`${strategy.toUpperCase()}:`);
    console.log(`  Original: ${result.originalTokens} tokens`);
    console.log(`  Compressed: ${result.compressedTokens} tokens`);
    console.log(`  Reduction: ${result.compressionRatio.toFixed(2)}%`);
    console.log(
      `  Target: ${minReduction.toFixed(0)}-${maxReduction.toFixed(0)}% reduction (keep ${(target.minKeep * 100).toFixed(0)}-${(target.maxKeep * 100).toFixed(0)}%)`,
    );
    console.log(`  Status: ${meetsTarget ? "✓ PASS" : "✗ FAIL"}`);
    console.log();
  }
}

testCompression().catch(console.error);
