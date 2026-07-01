import fs from 'fs';
import path from 'path';

const textReplacements = {
  "Scaff": "Study AI",
  "UI to Flutter Generator": "Document Intelligence Platform",
  "Flutter project": "Knowledge Graph",
  "Flutter developer": "Researcher",
  "Figma screens": "PDF documents",
  "Flutter code": "Research insights",
  "Upload a screenshot.": "Upload a document.",
  "Get a Flutter project.": "Get a Knowledge Graph.",
  "Riverpod": "Cross-doc RAG",
  "my_scaff_app": "my_study_graph",
  "Generate your first Flutter project": "Generate your first Document Graph",
  "Upload Figma screens \\u2192 get Flutter code in ~45s": "Upload PDFs \\u2192 get Knowledge Graphs in ~45s"
};

const cssReplacements = [
  [/text-white/g, "text-zinc-900 dark:text-white"],
  [/bg-\\[#0D1117\\]/g, "bg-white dark:bg-[#0D1117]"],
  [/bg-\\[#080808\\]/g, "bg-zinc-50 dark:bg-[#080808]"],
  [/border-white\\/10/g, "border-zinc-200 dark:border-white/10"],
  [/border-white\\/8/g, "border-zinc-200 dark:border-white/8"],
  [/border-white\\/20/g, "border-zinc-300 dark:border-white/20"],
  [/border-white\\/30/g, "border-zinc-300 dark:border-white/30"],
  [/text-white\\/30/g, "text-zinc-400 dark:text-white/30"],
  [/text-white\\/50/g, "text-zinc-500 dark:text-white/50"],
  [/text-white\\/40/g, "text-zinc-400 dark:text-white/40"],
  [/text-white\\/70/g, "text-zinc-600 dark:text-white/70"],
  [/text-white\\/80/g, "text-zinc-700 dark:text-white/80"],
  [/text-white\\/20/g, "text-zinc-300 dark:text-white/20"],
  [/bg-white\\/5(?!0)/g, "bg-zinc-100 dark:bg-white/5"],
  [/bg-white\\/10/g, "bg-zinc-200 dark:bg-white/10"],
  [/bg-white\\/20/g, "bg-zinc-300 dark:bg-white/20"],
  [/bg-white\\/\\[0\\.02\\]/g, "bg-zinc-50 dark:bg-white/[0.02]"],
  [/bg-white\\/\\[0\\.03\\]/g, "bg-zinc-50 dark:bg-white/[0.03]"],
  [/bg-white\\/\\[0\\.04\\]/g, "bg-zinc-100 dark:bg-white/[0.04]"],
  [/bg-white\\/\\[0\\.07\\]/g, "bg-zinc-100 dark:bg-white/[0.07]"],
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      for (const [key, val] of Object.entries(textReplacements)) {
        content = content.replaceAll(key, val);
      }
      
      // We don't want to double-replace if it's already "dark:text-white"
      for (const [regex, replacement] of cssReplacements) {
        // Need to be careful with double replacement.
        // E.g., text-white becomes text-zinc-900 dark:text-white. 
        // Then we run it again? We only run script once.
        content = content.replace(regex, replacement);
      }
      
      // Quick fix for double replacements
      content = content.replaceAll('dark:text-zinc-900 dark:text-white', 'dark:text-white');
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory('./src');
