/**
 * DocIntel AI — DocIntel AI integration layer
 * 
 * All AI calls route through https://integrate.api.nvidia.com/v1
 * Model routing:
 *   Summarize/Notes/Flashcards: nvidia/nemotron-super-120b-instruct
 *   Chat Q&A + multi-turn: moonshotai/kimi-k2
 *   Highlight explanation: google/gemma-4-31b-it (fast)
 *   Semantic search embeddings: nvidia/nv-embedqa-e5-v5
 */

import type { Message, Chunk, FlashCard, QuizQuestion } from '../types/workspace';

const NIM_BASE_URL = '/nim-api'; // Proxied to bypass CORS

function getApiKey(): string {
  // Try Vite first, then process.env (for Next.js / Node)
  const key = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_NIM_API_KEY) 
              || (typeof process !== 'undefined' && process.env && process.env.VITE_NIM_API_KEY)
              || (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_NIM_API_KEY);
  if (!key) throw new Error('NIM_API_KEY not set in .env');
  return key;
}

function headers(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getApiKey()}`,
  };
}

// ─── Streaming helper ───────────────────────────────────────────────────────

async function* streamChat(
  modelOrModels: string | string[],
  systemPrompt: string,
  userMessage: string,
  history: { role: string; content: string }[] = []
): AsyncGenerator<string> {
  const models = Array.isArray(modelOrModels) ? modelOrModels : [modelOrModels];
  const messages = [
    { role: 'system', content: systemPrompt },
    ...history,
    { role: 'user', content: userMessage },
  ];

  let res: Response | null = null;
  let lastError = '';

  for (const model of models) {
    try {
      res = await fetch(`${NIM_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          model,
          messages,
          stream: true,
          max_tokens: 4096,
          temperature: 0.7,
        }),
      });

      if (res.ok) {
        break; // Successfully connected
      } else {
        lastError = await res.text();
        res = null; // reset so we try next
      }
    } catch (e: any) {
      lastError = e.message;
      res = null;
    }
  }

  if (!res) {
    throw new Error(`AI API Error: ${lastError}`);
  }

  const reader = res.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed === 'data: [DONE]') continue;
      if (!trimmed.startsWith('data: ')) continue;

      try {
        const json = JSON.parse(trimmed.slice(6));
        const delta = json.choices?.[0]?.delta?.content;
        if (delta) yield delta;
      } catch {
        // Skip malformed JSON chunks
      }
    }
  }
}

async function nonStreamChat(
  modelOrModels: string | string[],
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  const models = Array.isArray(modelOrModels) ? modelOrModels : [modelOrModels];
  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userMessage },
  ];

  let res: Response | null = null;
  let lastError = '';

  for (const model of models) {
    try {
      res = await fetch(`${NIM_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          model,
          messages,
          stream: false,
          max_tokens: 4096,
          temperature: 0.7,
        }),
      });

      if (res.ok) {
        break;
      } else {
        lastError = await res.text();
        res = null;
      }
    } catch (e: any) {
      lastError = e.message;
      res = null;
    }
  }

  if (!res) {
    throw new Error(`AI API Error: ${lastError}`);
  }

  const json = await res.json();
  return json.choices?.[0]?.message?.content || '';
}

// ─── SUMMARIZE ──────────────────────────────────────────────────────────────

export async function* summarizeDocument(chunks: string[]): AsyncGenerator<string> {
  const systemPrompt = `You are a document intelligence assistant.
Summarize the document in clear, structured markdown.
Use headers for main sections.
End with a 3-bullet key takeaways section.`;

  const userMessage = `Summarize this document:\n\n${chunks.join('\n\n')}`;

  yield* streamChat(
    'meta/llama3-70b-instruct',
    systemPrompt,
    userMessage
  );
}

// ─── CREATE NOTES ───────────────────────────────────────────────────────────

export async function createNotes(chunks: string[]): Promise<{
  title: string;
  sections: { heading: string; bullets: string[]; pageRef: number }[];
}> {
  const systemPrompt = `Extract structured notes from this document.
Output JSON only:
{
  "title": "string",
  "sections": [{
    "heading": "string",
    "bullets": ["string"],
    "pageRef": number
  }]
}`;

  const userMessage = chunks.join('\n\n');
  const response = await nonStreamChat(
    'meta/llama3-70b-instruct',
    systemPrompt,
    userMessage
  );

  try {
    // Extract JSON from potential markdown code block
    const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, response];
    return JSON.parse(jsonMatch[1]!.trim());
  } catch {
    return { title: 'Document Notes', sections: [{ heading: 'Notes', bullets: [response], pageRef: 1 }] };
  }
}

// ─── CHAT Q&A with page jump ────────────────────────────────────────────────

export async function* chatWithDoc(
  message: string,
  history: Message[],
  chunks: Chunk[],
  currentPage: number | undefined,
  docName: string
): AsyncGenerator<string> {
  const systemPrompt = `You are a document assistant. Answer based only on the provided document context.
ALWAYS cite sources as [${docName}, p.N] inline where N is the page number.
If the user greets you (e.g., "hi", "hello"), reply with a very short, friendly greeting and ask how you can help with the document. Do not summarize the document unless asked.
If the user asks about a topic, find the most relevant page and include:
JUMP_TO_PAGE:N at the end of your response (on its own line).
The UI will parse this and scroll to that page.`;

  const sortedChunks = currentPage !== undefined 
    ? [...chunks].sort((a, b) => Math.abs(a.pageNumber - currentPage) - Math.abs(b.pageNumber - currentPage))
    : [...chunks];

  const contextChunks = sortedChunks.slice(0, 5).map(c =>
    `[Page ${c.pageNumber}] ${c.content}`
  ).join('\n\n');

  const userMessage = `Context from document:\n${contextChunks}\n\n${currentPage !== undefined ? `User is currently on page ${currentPage}.\n\n` : ''}User question: ${message}`;

  const chatHistory = history.slice(-10).map(m => ({
    role: m.role,
    content: m.content,
  }));

  yield* streamChat(
    ['moonshotai/kimi-k2.6', 'meta/llama3-70b-instruct', 'mistralai/mixtral-8x22b-instruct-v0.1'],
    systemPrompt,
    userMessage,
    chatHistory
  );
}

// ─── EXPLAIN HIGHLIGHT ──────────────────────────────────────────────────────

export async function explainText(
  selectedText: string,
  pageContext: string
): Promise<string> {
  return nonStreamChat(
    'google/gemma-4-31b-it',
    'Explain this text concisely in 2-3 sentences. Be clear and direct.',
    `Context from the same page: ${pageContext}\n\nText to explain: ${selectedText}`
  );
}

// ─── FLASHCARD GENERATION ───────────────────────────────────────────────────

export async function generateFlashcards(chunks: string[]): Promise<FlashCard[]> {
  const response = await nonStreamChat(
    'meta/llama3-70b-instruct',
    `Generate exactly 12 flashcards from this document.
Output JSON only:
{ "cards": [{ "front": "question", "back": "answer", "pageRef": number }] }`,
    chunks.join('\n\n')
  );

  try {
    const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, response];
    const parsed = JSON.parse(jsonMatch[1]!.trim());
    return parsed.cards || [];
  } catch {
    return [];
  }
}

// ─── QUIZ GENERATION ────────────────────────────────────────────────────────

export async function generateQuiz(chunks: string[]): Promise<QuizQuestion[]> {
  const response = await nonStreamChat(
    'meta/llama3-70b-instruct',
    `Generate exactly 10 multiple choice questions from this document.
Each question must have exactly 4 options.
Output JSON only:
{ "questions": [{ "question": "string", "options": ["a","b","c","d"], "correctIndex": 0, "explanation": "string", "pageRef": number }] }`,
    chunks.join('\n\n')
  );

  try {
    const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, response];
    const parsed = JSON.parse(jsonMatch[1]!.trim());
    return parsed.questions || [];
  } catch {
    return [];
  }
}

// ─── SEMANTIC SEARCH ────────────────────────────────────────────────────────

export async function getEmbedding(text: string): Promise<number[]> {
  const res = await fetch(`${NIM_BASE_URL}/embeddings`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      model: 'nvidia/nv-embedqa-e5-v5',
      input: [text],
      input_type: 'query',
    }),
  });

  if (!res.ok) {
    throw new Error(`Embedding API Error ${res.status}`);
  }

  const json = await res.json();
  return json.data?.[0]?.embedding || [];
}

// ─── Parse JUMP_TO_PAGE from AI response ────────────────────────────────────

export function parseJumpToPage(content: string): { cleanContent: string; jumpToPage?: number } {
  const match = content.match(/JUMP_TO_PAGE:(\d+)/);
  if (match) {
    const jumpToPage = parseInt(match[1], 10);
    const cleanContent = content.replace(/\n?JUMP_TO_PAGE:\d+\n?/g, '').trim();
    return { cleanContent, jumpToPage };
  }
  return { cleanContent: content };
}

// ─── Parse citations from AI response ───────────────────────────────────────

export function parseCitations(content: string): { docName: string; page: number }[] {
  const regex = /\[([^\]]+),\s*p\.(\d+)\]/g;
  const citations: { docName: string; page: number }[] = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    citations.push({ docName: match[1], page: parseInt(match[2], 10) });
  }
  return citations;
}
