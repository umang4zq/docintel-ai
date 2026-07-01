[DocIntel AI](https://github.com/umang4zq/docintel-ai)
<p align="center">Document Intelligence platform with advanced OCR, structured Knowledge Graph generation, and Cross-Doc RAG capabilities.</p>

DocIntel AI is a state-of-the-art document intelligence engine designed to save professionals hours of manual research. Built entirely natively and 100% Indian Made, it combines advanced OCR, Kimi K2 and Nemotron models to turn raw scanned PDFs into structured data and synthesize answers with precise citations.

✨ Features

- **Document Pipeline**: Automatic text extraction and OCR processing for scanned PDFs.
- **Knowledge Graph Generation**: Structures raw data into linked entities and relational diagrams automatically.
- **Cross-Doc RAG Chat**: Chat with your entire document corpus and get verified citations.
- **Interactive Workspace**: Side-by-side PDF and Chat interface powered by Resizable Panels.
- **Mobile Responsive**: Carefully tailored UI for mobile interactions.

🔧 Tech Stack

- **Frontend**: React 19, Vite 8, React Router DOM v7
- **Styling**: Tailwind CSS (v4), Framer Motion, GSAP, Radix UI
- **Database & Auth**: Supabase
- **State Management**: Zustand
- **PDF Rendering**: react-pdf & pdfjs-dist
- **Icons**: Lucide React

🚀 Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your `.env.local` file (do NOT commit this file):
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   npm run start
   ```

📁 Project Structure

```
├── .env.local             # Secrets (Git-ignored)
├── .gitignore             # Ignored paths (node_modules, dist, .env, etc)
├── package.json           # Scripts and dependencies
├── src/
│   ├── app/               # Next.js specific layout / meta
│   ├── components/        # Reusable UI elements (Navbar, Footer, Hero)
│   ├── config/            # Application config
│   ├── context/           # React Context (Auth, Theme, Workspace)
│   ├── hooks/             # Custom React Hooks
│   ├── lib/               # Integrations (Supabase, AI clients)
│   ├── pages/             # Route pages (Dashboard, Workspace, Login, etc)
│   ├── styles/            # Global styles and tailwind classes
│   ├── types/             # TypeScript definitions
│   ├── App.tsx            # Application entry routing
│   ├── index.css          # Core CSS
│   └── main.tsx           # React mounting point
```

📄 License

Copyright (c) 2026 Umang Markana. All rights reserved.
