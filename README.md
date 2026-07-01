Create a professional README.md for the GitHub repository
https://github.com/umang4zq/docintel-ai

Project: DocIntel AI — AI-powered Document Intelligence Platform

Save as: /home/ubuntu/Wirekit/README.md

=== README CONTENT ===

# DocIntel AI

> Upload any document. Ask anything. Get cited answers.

DocIntel is an AI-powered document intelligence platform that
transforms PDFs, scanned images, and handwritten notes into
an interactive knowledge base you can have a conversation with.

Built entirely on NVIDIA NIM — no OpenAI, no Anthropic.

---

## What it does

Upload a document → our 6-layer NVIDIA NIM pipeline reads every
page, builds a knowledge graph, and lets you ask questions across
your entire document corpus with exact [Doc, p.N] citations.

- **Smart OCR** — Nemotron OCR extracts structured text from any
  document including handwritten notes and scanned images in
  Hindi, Gujarati, English and more
- **Knowledge graph** — Nemotron Super 120B maps entities and
  relationships across documents, detects contradictions
- **Cross-document RAG** — pgvector cosine search retrieves
  the most relevant chunks across your entire corpus
- **Multi-turn chat** — Kimi K2 orchestrates sessions with
  full conversation memory
- **Cited answers** — every response includes [Document, p.N]
  citations you can click to jump to the exact page
- **PDF workspace** — split-panel viewer with highlights,
  notes, flashcards, and quiz generation

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS |
| Animation | Framer Motion |
| Database | Supabase (PostgreSQL + pgvector) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| AI — OCR | nvidia/nemotron-ocr |
| AI — Reasoning | nvidia/nemotron-super-120b-instruct |
| AI — Chat | moonshotai/kimi-k2 |
| AI — Explain | google/gemma-4-31b-it |
| AI — Embeddings | nvidia/nv-embedqa-e5-v5 |
| AI Gateway | NVIDIA NIM (integrate.api.nvidia.com/v1) |
| Deployment | AWS EC2 + PM2 |
| Admin panel | Separate Vite app on port 4001 |

---

## Features

### Document processing
- PDF, DOCX, PNG, JPG, handwritten notes
- Multilingual OCR (English, Hindi, Gujarati, Arabic)
- Parallel batch processing per page
- Bounding box and confidence score per text block
- Auto-detect file type and language

### AI chat
- Multi-turn conversation with session memory
- Streaming responses token by token
- Inline citations on every factual claim
- Jump-to-page on cited answers
- Follow-up question suggestions
- Markdown formatted responses

### PDF workspace
- Split panel: PDF viewer (left) + AI chat (right)
- Resizable panels with presets (70/30, 50/50, 30/70)
- Text selection → highlight, explain, save as note
- 4 highlight colors with semantic meaning
- Page-by-page navigation with zoom
- In-document search
- Flashcard generation (15 cards per document)
- Quiz generation (10 MCQ questions)
- Export notes as Markdown

### Knowledge graph
- Entity extraction: people, orgs, dates, concepts
- Typed relations: mentions, supports, contradicts
- Cross-document conflict detection
- Stored in Supabase JSONB

### Admin panel (port 4001)
- View all users and their usage
- Manage credits per user
- Change subscription plans
- Usage analytics and document stats
- Credit transaction audit log

---

## Getting started

### Prerequisites
- Node.js 18+
- Supabase account
- NVIDIA NIM API key (get one at build.nvidia.com)
- AWS EC2 instance (or any Ubuntu server)

### 1. Clone the repo
git clone https://github.com/umang4zq/docintel-ai
cd docintel-ai

### 2. Install dependencies
npm install

### 3. Set up environment variables
cp .env.example .env

Fill in:
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_NIM_API_KEY=nvapi-your-key-here

### 4. Set up Supabase
Run the SQL schema in your Supabase SQL Editor:
(schema file at /supabase/schema.sql)

Enables:
- pgvector extension
- All tables with RLS
- Auto-create profile trigger
- match_chunks() function for RAG

### 5. Download demo PDF (optional)
mkdir -p public/demo
curl -L "https://www.africau.edu/images/default/sample.pdf" \
  -o public/demo/sample.pdf

### 6. Start dev server
npm run dev

Open http://localhost:3001

---

## Project structure

docintel-ai/
├── src/
│   ├── components/
│   │   └── workspace/
│   │       ├── PDFPanel.tsx
│   │       ├── ChatPanel.tsx
│   │       ├── TopBar.tsx
│   │       ├── NotesPanel.tsx
│   │       └── FlashcardModal.tsx
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── WorkspaceContext.tsx
│   ├── lib/
│   │   ├── supabase.ts
│   │   └── nimClient.ts
│   ├── pages/
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── WorkspacePage.tsx
│   │   ├── HowItWorksPage.tsx
│   │   ├── CapabilitiesPage.tsx
│   │   ├── PricingPage.tsx
│   │   └── UseCasesPage.tsx
│   └── App.tsx
├── supabase/
│   └── schema.sql
├── public/
│   └── demo/
│       └── sample.pdf
└── README.md

---

## NVIDIA NIM models used

All AI calls go to https://integrate.api.nvidia.com/v1
One API key. Five specialist models.

| Model | Role |
|---|---|
| nvidia/nemotron-ocr | Reads every page of every document |
| nvidia/nemotron-super-120b-instruct | Knowledge graph + answer synthesis |
| moonshotai/kimi-k2 | Chat orchestrator with tool calling |
| google/gemma-4-31b-it | Fast highlight explanation |
| nvidia/nv-embedqa-e5-v5 | 1536d embeddings for RAG search |

---

## Supabase schema

Tables:
- profiles — user data, plan, credits
- documents — uploaded document metadata
- document_chunks — OCR output with pgvector embeddings
- highlights — user text selections with colors and notes
- chat_sessions — conversation sessions per document
- chat_messages — messages with citations
- credit_transactions — admin audit log

---

## Deployment

Running on AWS EC2 with PM2:

Main app (port 3001):
pm2 start npm --name "docintel" -- run dev
pm2 save && pm2 startup

Admin panel (port 4001):
cd scaff-admin
pm2 start npm --name "docintel-admin" -- run dev
pm2 save

---

## Environment variables

| Variable | Description |
|---|---|
| VITE_SUPABASE_URL | Your Supabase project URL |
| VITE_SUPABASE_ANON_KEY | Supabase publishable key |
| VITE_NIM_API_KEY | NVIDIA NIM API key from build.nvidia.com |

Admin panel additionally needs:
| VITE_SUPABASE_SERVICE_KEY | Supabase service role key (bypasses RLS) |
| VITE_ADMIN_PASSWORD | Password to access admin panel |

---

## Built by

Umang — Flutter and full-stack developer
GitHub: github.com/umang4zq



---

## License

MIT
