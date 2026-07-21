import type { Message, Chunk, FlashCard, QuizQuestion } from '../types/workspace'

const NIM_BASE_URL = '/nim-api'; // Proxied to bypass CORS
const MAX_CHUNK_CHARS = 800
const MAX_CHUNKS = 5
const REQUEST_TIMEOUT_MS = 90000

let currentController: AbortController | null = null

function getApiKey(): string {
  // Try Vite first, then process.env (for Next.js / Node)
  const key = (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.VITE_NIM_API_KEY) 
              || (typeof process !== 'undefined' && process.env && process.env.VITE_NIM_API_KEY)
              || (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_NIM_API_KEY);
  if (!key) throw new Error('NIM_API_KEY not set in .env');
  return key;
}

function headers(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getApiKey()}`,
  }
}

export function abortCurrentStream() {
  currentController?.abort()
  currentController = null
}

// ─── Retry helper ───────────────────────────────────────────────────────────

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 2
): Promise<Response> {
  for (let i = 0; i <= retries; i++) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
    try {
      const res = await fetch(url, { ...options, signal: controller.signal })
      clearTimeout(timeout)
      if (res.status === 429 && i < retries) {
        await new Promise(r => setTimeout(r, 1000 * (i + 1)))
        continue
      }
      return res
    } catch (err) {
      clearTimeout(timeout)
      if (i === retries) throw err
      await new Promise(r => setTimeout(r, 1000 * (i + 1)))
    }
  }
  throw new Error('Max retries exceeded')
}

// ─── Streaming helper ───────────────────────────────────────────────────────

async function* streamChat(
  model: string,
  systemPrompt: string,
  userMessage: string,
  history: { role: string; content: string }[] = [],
  options: { max_tokens?: number; temperature?: number; top_p?: number; frequency_penalty?: number } = {}
): AsyncGenerator<string> {
  abortCurrentStream()
  currentController = new AbortController()
  const timeout = setTimeout(() => currentController?.abort(), REQUEST_TIMEOUT_MS)

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history,
    { role: 'user', content: userMessage },
  ]

  const res = await fetch(`${NIM_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: headers(),
    signal: currentController.signal,
    body: JSON.stringify({
      model,
      messages,
      stream: true,
      max_tokens: options.max_tokens || 2048,
      temperature: options.temperature ?? 0.7,
      ...(options.top_p !== undefined && { top_p: options.top_p }),
      ...(options.frequency_penalty !== undefined && { frequency_penalty: options.frequency_penalty }),
    }),
  })

  clearTimeout(timeout)

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`AI API ${res.status}: ${errorText}`)
  }

  const reader = res.body?.getReader()
  if (!reader) throw new Error('No response body')
  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''
      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || trimmed === 'data: [DONE]') continue
        if (!trimmed.startsWith('data: ')) continue
        try {
          const json = JSON.parse(trimmed.slice(6))
          const delta = json.choices?.[0]?.delta?.content
          if (delta) yield delta
        } catch { /* skip malformed */ }
      }
    }
  } finally {
    reader.releaseLock()
    currentController = null
  }
}

async function nonStreamChat(
  model: string,
  systemPrompt: string,
  userMessage: string,
  options: { max_tokens?: number; temperature?: number; top_p?: number; frequency_penalty?: number } = {}
): Promise<string> {
  const res = await fetchWithRetry(`${NIM_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      stream: false,
      max_tokens: options.max_tokens || 4096,
      temperature: options.temperature ?? 0.7,
      ...(options.top_p !== undefined && { top_p: options.top_p }),
      ...(options.frequency_penalty !== undefined && { frequency_penalty: options.frequency_penalty }),
    }),
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`AI API ${res.status}: ${errorText}`)
  }

  const json = await res.json()

  // Log token usage for cost tracking
  if (json.usage) {
    console.debug(`[AI] ${model} — prompt: ${json.usage.prompt_tokens}, completion: ${json.usage.completion_tokens}`)
  }

  return json.choices?.[0]?.message?.content || ''
}

function parseJSON(response: string) {
  const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, response]
  return JSON.parse(jsonMatch[1]!.trim())
}

// ─── SUMMARIZE ──────────────────────────────────────────────────────────────

export async function* summarizeDocument(chunks: string[]): AsyncGenerator<string> {
  const limited = chunks.slice(0, 20).join('\n\n').slice(0, 12000)
  
  const systemPrompt = `You are DocIntel AI — an expert document analyst.
Create an executive-quality document summary.

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:

# Document Summary: [Document Title]

## 📋 Overview
[2-3 sentence high-level description of what this document is and its purpose]

## 🎯 Key Points
[8-12 most important points as bullet list, each with page citation]
- Point 1 [p.N]
- Point 2 [p.N]

## 📊 Main Sections
[For each major section of the document:]
### [Section Name] (p.N-N)
[2-3 sentence description of what this section covers and why it matters]

## ⚠️ Critical Items
[Any warnings, deadlines, obligations, risks, or action items found]

## 💡 Key Takeaways
[3-5 most important things to remember about this document]

## 🔍 Suggested Questions
Questions you might want to ask about this document:
[[What are the main obligations in this document?]]
[[Are there any deadlines I should be aware of?]]
[[What are the key risks or concerns?]]

RULES:
- Every bullet point must include a page citation [p.N]
- Use professional, clear language
- Be thorough — this summary should replace needing to read the doc
- Minimum 400 words`

  yield* streamChat(
    'nvidia/nemotron-super-120b-instruct',
    systemPrompt,
    `Summarize this document:\n\n${limited}`,
    [],
    { max_tokens: 8192, temperature: 0.3, top_p: 0.9, frequency_penalty: 0.1 }
  )
}

// ─── CREATE NOTES ───────────────────────────────────────────────────────────

export async function createNotes(chunks: string[]) {
  const limited = chunks.slice(0, 15).join('\n\n').slice(0, 10000)
  
  const systemPrompt = `You are DocIntel AI — create comprehensive
study notes from this document.

OUTPUT VALID JSON ONLY. No markdown fences. No explanation.
Schema:
{
  "title": "document title",
  "overview": "2-3 sentence document summary",
  "sections": [
    {
      "heading": "section name",
      "pageRef": 1,
      "bullets": [
        "key point with specific detail",
        "another key point"
      ],
      "keyTerms": [
        { "term": "term name", "definition": "clear definition" }
      ]
    }
  ],
  "importantFacts": [
    { "fact": "specific fact", "pageRef": 1 }
  ],
  "glossary": [
    { "term": "term", "definition": "definition" }
  ]
}

RULES:
- Extract EVERY important concept, not just top-level headings
- Each bullet must be a complete, standalone fact
- Include specific numbers, dates, names where found
- Minimum 5 sections, 5 bullets per section
- importantFacts: minimum 10 items`

  const response = await nonStreamChat(
    'nvidia/nemotron-super-120b-instruct',
    systemPrompt,
    limited,
    { max_tokens: 8192, temperature: 0.3, top_p: 0.9, frequency_penalty: 0.1 }
  )
  try {
    return parseJSON(response)
  } catch {
    return { title: 'Document notes', sections: [{ heading: 'Notes', bullets: [response], pageRef: 1 }] }
  }
}

// ─── MAIN TOPICS ────────────────────────────────────────────────────────────

export async function* getMainTopics(chunks: string[]): AsyncGenerator<string> {
  const limited = chunks.slice(0, 10).join('\n\n').slice(0, 8000)
  yield* streamChat(
    'nvidia/nemotron-super-120b-instruct',
    `List the main topics and themes in this document.
Format as a clear numbered list with a one-sentence explanation per topic.`,
    limited,
    [],
    { max_tokens: 8192, temperature: 0.3, top_p: 0.9, frequency_penalty: 0.1 }
  )
}

// ─── CHAT Q&A ───────────────────────────────────────────────────────────────

export async function* chatWithDoc(
  message: string,
  history: Message[],
  chunks: Chunk[],
  currentPage: number,
  docName: string
): AsyncGenerator<string> {
  const sortedChunks = [...chunks].sort((a, b) => 
    Math.abs(a.pageNumber - currentPage) - Math.abs(b.pageNumber - currentPage)
  )

  const contextChunks = sortedChunks
    .slice(0, MAX_CHUNKS)
    .map(c => `[Page ${c.pageNumber}] ${c.content.slice(0, MAX_CHUNK_CHARS)}`)
    .join('\n\n')

  const chatHistory = history.slice(-10).map(m => ({
    role: m.role,
    content: m.content,
  }))

  const totalPages = chunks.length > 0 ? Math.max(...chunks.map(c => c.pageNumber)) : 1;

  const systemPrompt = `You are DocIntel AI — an expert document analyst
with deep knowledge across legal, medical, technical, financial,
and academic domains.

DOCUMENT CONTEXT:
Name: ${docName}
Current page: ${currentPage} of ${totalPages}
User's question: (provided below)

YOUR RESPONSE RULES:

1. STRUCTURE — Always use rich markdown formatting:
   - Use ## headers for major sections
   - Use bullet points (•) for lists
   - Use **bold** for key terms and important findings
   - Use > blockquotes for direct quotes from the document
   - Use tables when comparing multiple items
   - Use --- dividers between major sections

2. CITATIONS — Every factual claim must be cited:
   Format: [${docName}, p.N]
   Good citation: "The contract specifies a 30-day notice period 
     [${docName}, p.4], which conflicts with the 14-day clause 
     mentioned in the appendix [${docName}, p.18]."
   Bad citation: "See page 4."

3. DEPTH — Match the depth to the question:
   Simple factual question → 2-3 sentences + citation
   "Explain X" → Full explanation with examples, 3-5 paragraphs
   "Summarize" → Structured summary with headers
   "Compare" → Side-by-side analysis or table
   "What does this mean" → Plain-language explanation + implications

4. PROACTIVE INSIGHTS — After answering, always add:
   ## 💡 Related insights
   1-3 additional things the user might want to know based on
   their question, even if they didn't ask.

5. FOLLOW-UP SUGGESTIONS — End every response with:
   ## Ask me next
   3 specific follow-up questions the user might want to ask,
   formatted as clickable suggestions.
   Format exactly as: [[Question text here]]
   Example: [[What are the implications of the 30-day clause?]]

6. PAGE NAVIGATION — If the answer is on a specific page:
   - Always include JUMP_TO_PAGE:N at the very end
   - Mention the page in your response naturally

7. NEVER:
   - Say "I don't have access to the full document"
   - Give vague answers like "it depends"
   - Repeat the question back
   - Use filler phrases like "Great question!"
   - Give a response under 100 words unless it's a yes/no fact

8. CONFIDENCE — For uncertain information add:
   ⚠️ Note: This interpretation is based on [p.N] —
   verify with the original source.`

  yield* streamChat(
    'moonshotai/kimi-k2.6',
    systemPrompt,
    `Document context:\n${contextChunks}\n\nUser is on page ${currentPage}.\n\nQuestion: ${message}`,
    chatHistory,
    { max_tokens: 4096, temperature: 0.4, top_p: 0.85 }
  )
}

// ─── EXPLAIN HIGHLIGHT ──────────────────────────────────────────────────────

export async function explainText(
  selectedText: string,
  pageContext: string
): Promise<string> {
  const systemPrompt = `You are DocIntel AI — explain selected text
from a document clearly and insightfully.

FORMAT:
**What it means:**
[Plain English explanation in 2-3 sentences]

**Why it matters:**
[1-2 sentences on significance or implications]

**Key terms:**
[Define any technical terms found in the selection]

**In context:**
[How this connects to the broader document topic]

Keep total response under 200 words.
Be direct and specific — no filler phrases.`

  return nonStreamChat(
    'google/gemma-4-31b-it',
    systemPrompt,
    `Page context: ${pageContext.slice(0, 400)}\n\nText to explain: "${selectedText}"`,
    { max_tokens: 512, temperature: 0.3 }
  )
}

// ─── FLASHCARDS ─────────────────────────────────────────────────────────────

export async function generateFlashcards(chunks: string[]): Promise<FlashCard[]> {
  const limited = chunks.slice(0, 15).join('\n\n').slice(0, 10000)

  const systemPrompt = `You are DocIntel AI — create high-quality
Anki-style flashcards from this document.

OUTPUT VALID JSON ONLY. No markdown fences.
Schema:
{
  "cards": [
    {
      "front": "clear, specific question",
      "back": "complete answer with context",
      "difficulty": "easy|medium|hard",
      "category": "concept|fact|definition|application",
      "pageRef": 1
    }
  ]
}

CARD QUALITY RULES:
- Front: Ask about ONE specific thing. Not "What is X?" 
  but "What distinguishes X from Y according to the author?"
- Back: Give a complete answer (2-4 sentences), not just a word
- Include WHY or HOW, not just WHAT
- Mix question types:
  • Definition: "Define [term] as used in this document"
  • Application: "How would you apply [concept] to [scenario]?"
  • Comparison: "What is the difference between X and Y?"
  • Consequence: "What happens when X occurs?"
  • Critical: "What evidence does the author give for X?"

Generate exactly 15 cards minimum.
Cover ALL major topics — do not focus only on the beginning.`

  const response = await nonStreamChat(
    'nvidia/nemotron-super-120b-instruct',
    systemPrompt,
    limited,
    { max_tokens: 8192, temperature: 0.3, top_p: 0.9, frequency_penalty: 0.1 }
  )
  try {
    return parseJSON(response).cards || []
  } catch { return [] }
}

// ─── QUIZ ───────────────────────────────────────────────────────────────────

export async function generateQuiz(chunks: string[]): Promise<QuizQuestion[]> {
  const limited = chunks.slice(0, 15).join('\n\n').slice(0, 10000)

  const systemPrompt = `You are DocIntel AI — create a challenging
but fair comprehension quiz.

OUTPUT VALID JSON ONLY. No markdown fences.
Schema:
{
  "questions": [
    {
      "question": "clear, specific question",
      "options": ["option A", "option B", "option C", "option D"],
      "correctIndex": 0,
      "explanation": "why this is correct AND why others are wrong",
      "difficulty": "easy|medium|hard",
      "pageRef": 1
    }
  ]
}

QUIZ QUALITY RULES:
- Questions must require actual comprehension, not just recall
- Wrong options must be plausible (not obviously wrong)
- Explanation must explain ALL 4 options
- Mix difficulty: 3 easy, 4 medium, 3 hard
- Cover different sections of the document evenly
- Never use "All of the above" or "None of the above"
- Generate exactly 10 questions`

  const response = await nonStreamChat(
    'nvidia/nemotron-super-120b-instruct',
    systemPrompt,
    limited,
    { max_tokens: 8192, temperature: 0.3, top_p: 0.9, frequency_penalty: 0.1 }
  )
  try {
    return parseJSON(response).questions || []
  } catch { return [] }
}

// ─── EMBEDDINGS ─────────────────────────────────────────────────────────────

export async function getEmbedding(text: string): Promise<number[]> {
  const res = await fetchWithRetry(`${NIM_BASE_URL}/embeddings`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      model: 'nvidia/nv-embedqa-e5-v5',
      input: text,
      input_type: 'query',
      encoding_format: 'float',
    }),
  })
  if (!res.ok) throw new Error(`Embedding API ${res.status}`)
  const json = await res.json()
  return json.data?.[0]?.embedding || []
}

// ─── Parsers ─────────────────────────────────────────────────────────────────

export function parseJumpToPage(content: string): {
  cleanContent: string
  jumpToPage?: number
} {
  const match = content.match(/JUMP_TO_PAGE:(\d+)/)
  if (match) {
    return {
      cleanContent: content.replace(/\n?JUMP_TO_PAGE:\d+\n?/g, '').trim(),
      jumpToPage: parseInt(match[1], 10),
    }
  }
  return { cleanContent: content }
}

export function parseCitations(content: string): { docName: string; page: number }[] {
  const regex = /\[([^\]]+),\s*p\.(\d+)\]/g
  const citations: { docName: string; page: number }[] = []
  let match
  while ((match = regex.exec(content)) !== null) {
    citations.push({ docName: match[1], page: parseInt(match[2], 10) })
  }
  return citations
}
