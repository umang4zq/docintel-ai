import { motion } from 'framer-motion';
import { FileSearch, GitMerge, Layers, MessageSquare, Highlighter, BrainCircuit, CheckCircle } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import { useTheme } from '../context/ThemeContext';

export default function CapabilitiesPage() {
  const { theme } = useTheme();

  const capabilities = [
    {
      icon: FileSearch,
      model: "nemotron-ocr",
      title: "Smart OCR — any document",
      body: "Extract structured text from PDFs, scans, handwritten notes, and mixed-language files. Returns page, section, table, bbox, confidence.",
      features: [
        "Parallel batch processing per page",
        "Handwritten note recognition",
        "Table and figure detection",
        "Hindi, Gujarati, Arabic support"
      ]
    },
    {
      icon: GitMerge,
      model: "nemotron-super-120b",
      title: "Knowledge graph construction",
      body: "Automatically extract entities and map their relationships across every document in your corpus. Flags contradictions between sources.",
      features: [
        "Entity extraction: people, orgs, dates, concepts",
        "Typed edges: mentions, supports, contradicts",
        "Cross-document conflict detection",
        "Confidence scoring per claim"
      ]
    },
    {
      icon: Layers,
      model: "nv-embedqa-e5-v5",
      title: "Cross-document RAG",
      body: "Ask one question and retrieve the most relevant context from every document simultaneously using pgvector cosine similarity search.",
      features: [
        "1536-dimensional embeddings",
        "Top-K retrieval across entire corpus",
        "Graph expansion for richer context",
        "Sub-second retrieval at scale"
      ]
    },
    {
      icon: MessageSquare,
      model: "kimi-k2 + nemotron-super-120b",
      title: "Multi-turn cited chat",
      body: "Ask follow-up questions and get grounded answers with exact inline citations. The session remembers context across your entire conversation.",
      features: [
        "Inline [Doc, p.N] citations on every answer",
        "Follow-up questions maintain context",
        "Jump to cited page in PDF viewer",
        "Session history stored in Supabase"
      ]
    },
    {
      icon: Highlighter,
      model: "gemma-4-31b",
      title: "Highlight and annotate",
      body: "Select any text in the PDF viewer to highlight, explain, save as a note, or send to AI for instant clarification — all in one click.",
      features: [
        "4 highlight colors with semantic meaning",
        "Instant AI explanation of selected text",
        "Save highlights as structured notes",
        "Export highlights as CSV or Markdown"
      ]
    },
    {
      icon: BrainCircuit,
      model: "nemotron-super-120b",
      title: "Flashcards and quizzes",
      body: "Generate study flashcards or a 10-question multiple-choice quiz from any document — powered by structured JSON output from Nemotron Super 120B.",
      features: [
        "10-15 flashcards per document",
        "Multiple choice quizzes with explanations",
        "Flip animation on cards",
        "Export to Anki deck format"
      ]
    }
  ];

  return (
    <PageWrapper
      eyebrow="What DocIntel can do"
      heading="Core capabilities"
      subtext="Six production-grade AI capabilities, each powered by a specialist DocIntel AI model."
    >
      <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-6">
        {capabilities.map((cap, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className={`p-5 md:p-8 rounded-2xl border hover:scale-[1.01] transition-all duration-300 ${
              theme === 'dark' ? 'bg-[#161B22] border-white/8' : 'bg-white border-[#0D0D0D]/8'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <cap.icon className={`w-[28px] h-[28px] ${theme === 'dark' ? 'text-white' : 'text-[#0D0D0D]'}`} />
              <div className={`text-[10px] font-mono uppercase tracking-wider rounded-full px-3 py-1 border ${
                theme === 'dark' ? 'bg-white/5 text-white/30 border-white/8' : 'bg-[#0D0D0D]/5 text-[#0D0D0D]/30 border-[#0D0D0D]/8'
              }`}>
                {cap.model}
              </div>
            </div>
            
            <h3 className={`text-xl font-semibold mt-4 mb-2 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-[#0D0D0D]'}`}>
              {cap.title}
            </h3>
            
            <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-white/60' : 'text-[#0D0D0D]/60'}`}>
              {cap.body}
            </p>
            
            <div className="mt-4 flex flex-col gap-2">
              {cap.features.map((feature, i) => (
                <div key={i} className={`flex items-center gap-2 text-xs md:text-sm ${theme === 'dark' ? 'text-white/60' : 'text-[#0D0D0D]/60'}`}>
                  <CheckCircle className={`w-4 h-4 shrink-0 ${theme === 'dark' ? 'text-white/40' : 'text-[#0D0D0D]/40'}`} />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className={`mt-24 py-12 border-t border-b ${theme === 'dark' ? 'border-white/8' : 'border-[#0D0D0D]/8'}`}>
        <h4 className={`text-sm tracking-widest uppercase text-center mb-10 ${theme === 'dark' ? 'text-white/30' : 'text-[#0D0D0D]/30'}`}>
          Every capability runs on DocIntel AI
        </h4>
        <div className="flex flex-col sm:flex-row justify-center flex-wrap gap-2 sm:gap-3">
          {["nvidia/nemotron-ocr", "nvidia/nemotron-super-120b", "moonshotai/kimi-k2", "google/gemma-4-31b-it"].map((model, i) => (
            <div key={i} className={`w-full sm:w-auto text-center rounded-full border px-5 py-2.5 font-mono text-sm ${
              theme === 'dark' ? 'border-white/10 text-white/50 bg-white/[0.02]' : 'border-[#0D0D0D]/10 text-[#0D0D0D]/50 bg-[#0D0D0D]/[0.02]'
            }`}>
              {model}
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
