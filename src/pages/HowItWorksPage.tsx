import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Eye, Network, Database, Search, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import { useTheme } from '../context/ThemeContext';

export default function HowItWorksPage() {
  const { theme } = useTheme();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const steps = [
    {
      icon: Upload,
      title: "Upload your documents",
      body: "Drag and drop PDFs, DOCX files, scanned images, or handwritten notes. DocIntel accepts any format in any language — English, Hindi, Gujarati, Arabic, mixed.",
      tag: "Supported: PDF · DOCX · PNG · JPG · handwritten"
    },
    {
      icon: Eye,
      title: "Nemotron OCR extracts every word",
      body: "nvidia/nemotron-ocr processes each page in parallel. It returns structured text with page number, section type (heading, body, table, figure), bounding box coordinates, and a confidence score per block.",
      tag: "Model: nvidia/nemotron-ocr"
    },
    {
      icon: Network,
      title: "Knowledge graph is built",
      body: "nvidia/nemotron-super-120b reads all extracted text and identifies every entity — people, organisations, dates, concepts. It maps typed relationships between them and flags contradictions across documents.",
      tag: "Model: nvidia/nemotron-super-120b"
    },
    {
      icon: Database,
      title: "Everything stored in Supabase",
      body: "Raw text, embeddings, graph nodes, graph edges, and metadata all stored with row-level security. Every text chunk is embedded to a 1536-dimensional pgvector for fast semantic retrieval.",
      tag: "Stack: Supabase + pgvector"
    },
    {
      icon: Search,
      title: "Your question triggers retrieval",
      body: "Your query is embedded and matched against all chunks via cosine similarity. The knowledge graph expands context further. The top results are tagged with exact source: document name, page, section, and confidence.",
      tag: "Model: nvidia/nv-embedqa-e5-v5"
    },
    {
      icon: MessageCircle,
      title: "Cited answer delivered",
      body: "moonshotai/kimi-k2 orchestrates the session. nvidia/nemotron-super-120b synthesises the final answer. Every claim is cited as [Document, p.N]. Follow-up questions loop back through the same pipeline.",
      tag: "Models: kimi-k2 · nemotron-super-120b"
    }
  ];

  const faqs = [
    {
      q: "How long does ingestion take?",
      a: "Most documents under 50 pages process in under 60 seconds. Larger corpora run as background jobs — you get notified when ready."
    },
    {
      q: "Which languages are supported?",
      a: "Any language Nemotron OCR can read — English, Hindi, Gujarati, Arabic, Chinese, and more. Mixed-language documents are handled automatically."
    },
    {
      q: "Is my data stored permanently?",
      a: "Raw uploaded files are deleted after processing. Extracted chunks and embeddings are stored in your private Supabase instance with RLS policies."
    },
    {
      q: "Can I query multiple documents at once?",
      a: "Yes. Cross-document RAG is the core feature — you can ask a question across your entire corpus and get a single cited answer."
    }
  ];

  return (
    <PageWrapper
      eyebrow="Step by step"
      heading="How DocIntel works"
      subtext="From raw document to cited AI answer in six automated layers. Every step runs on DocIntel AI."
    >
      <div className="mt-20 relative">
        <div className={`hidden md:block absolute left-1/2 top-0 -translate-x-1/2 w-px h-full ${theme === 'dark' ? 'bg-white/8' : 'bg-[#0D0D0D]/8'}`} />

        <div className="space-y-12">
          {steps.map((step, index) => {
            const isLeft = index % 2 === 0;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={`relative flex flex-col md:flex-row gap-4 md:gap-8 items-start md:items-center ${isLeft ? 'md:flex-row-reverse' : ''}`}
              >
                <div className={`hidden md:block w-1/2 ${isLeft ? 'pl-12' : 'pr-12 text-right'}`} />
                
                <div className="hidden md:flex absolute left-1/2 top-0 -translate-x-1/2 z-10 flex-col items-center mt-0 md:-mt-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-mono text-sm font-bold ${
                    theme === 'dark' ? 'bg-white text-black' : 'bg-[#0D0D0D] text-white'
                  }`}>
                    0{index + 1}
                  </div>
                </div>

                <div className={`w-full md:w-1/2 md:mx-0 max-w-lg ${isLeft ? 'md:pr-12 text-left md:text-right' : 'md:pl-12 text-left'}`}>
                  <div className="md:hidden flex items-center gap-3 mb-4">
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-sm font-bold ${theme === 'dark' ? 'bg-white text-black' : 'bg-[#0D0D0D] text-white'}`}>0{index + 1}</div>
                     <step.icon className={`w-6 h-6 ${theme === 'dark' ? 'text-white/50' : 'text-[#0D0D0D]/50'}`} />
                  </div>
                  <step.icon className={`hidden md:block w-6 h-6 mb-4 ${isLeft ? 'md:ml-auto' : ''} ${theme === 'dark' ? 'text-white/50' : 'text-[#0D0D0D]/50'}`} />
                  <h3 className={`text-xl font-semibold tracking-tight mb-3 ${theme === 'dark' ? 'text-white' : 'text-[#0D0D0D]'}`}>
                    {step.title}
                  </h3>
                  <p className={`text-sm leading-relaxed mb-4 ${theme === 'dark' ? 'text-white/60' : 'text-[#0D0D0D]/60'}`}>
                    {step.body}
                  </p>
                  <div className={`inline-flex items-center text-[10px] uppercase tracking-wider font-mono px-3 py-1 rounded-full border ${
                    theme === 'dark' ? 'border-white/10 text-white/40 bg-white/5' : 'border-[#0D0D0D]/10 text-[#0D0D0D]/40 bg-[#0D0D0D]/5'
                  }`}>
                    {step.tag}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="mt-32 max-w-2xl mx-auto">
        <h2 className={`text-3xl font-['Instrument_Serif'] mb-8 text-center ${theme === 'dark' ? 'text-white' : 'text-[#0D0D0D]'}`}>
          Quick answers
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className={`border rounded-xl overflow-hidden ${theme === 'dark' ? 'border-white/10' : 'border-[#0D0D0D]/10'}`}>
              <button
                className={`w-full flex items-center justify-between p-6 text-left ${theme === 'dark' ? 'text-white' : 'text-[#0D0D0D]'}`}
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
              >
                <span className="font-medium">{faq.q}</span>
                {activeFaq === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {activeFaq === i && (
                <div className={`px-6 pb-6 text-sm leading-relaxed ${theme === 'dark' ? 'text-white/60' : 'text-[#0D0D0D]/60'}`}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
