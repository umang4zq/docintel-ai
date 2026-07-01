import { motion } from 'framer-motion';
import { Upload, Eye, Network, Database, Search, MessageCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function PipelineDetailSection() {
  const { theme } = useTheme();

  const cards = [
    {
      number: "01",
      icon: Upload,
      title: "Document ingestion",
      subtitle: "Every format. Every language.",
      desc: "PDFs, DOCX, scanned images, and handwritten notes in any language. File type auto-detected, PDFs rendered to page images, queued for parallel processing.",
      tag: "Input layer"
    },
    {
      number: "02",
      icon: Eye,
      title: "Nemotron OCR",
      subtitle: "Structured text from every page.",
      desc: "One AI call per page extracts text with page number, section label, bounding box, and confidence score. Batch jobs run in parallel.",
      tag: "nvidia/nemotron-ocr"
    },
    {
      number: "03",
      icon: Network,
      title: "Knowledge graph",
      subtitle: "Connect facts across documents.",
      desc: "Nemotron Super 120B extracts entities and typed relations — mentions, contradicts, supports. Nodes and edges stored in Supabase with conflict detection.",
      tag: "nvidia/nemotron-super-120b"
    },
    {
      number: "04",
      icon: Database,
      title: "Supabase storage",
      subtitle: "Fast, secure, scalable.",
      desc: "Documents, chunks, graph nodes, and chat history stored with row-level security. Every chunk embedded to 1536d pgvector for semantic retrieval.",
      tag: "Supabase + pgvector"
    },
    {
      number: "05",
      icon: Search,
      title: "Cross-document RAG",
      subtitle: "Search across your entire corpus.",
      desc: "Cosine similarity retrieves the most relevant chunks. Knowledge graph expands context. Every chunk tagged with doc name, page, section, and confidence.",
      tag: "Retrieval layer"
    },
    {
      number: "06",
      icon: MessageCircle,
      title: "Multi-turn AI chat",
      subtitle: "Talk to your documents.",
      desc: "Kimi K2 orchestrates the session. Nemotron Super 120B synthesises grounded answers with inline citations. Follow-up queries loop back through retrieval.",
      tag: "moonshotai/kimi-k2"
    }
  ];

  return (
    <section id="pipeline" className={`py-28 md:py-40 px-6 ${theme === 'dark' ? 'bg-black' : 'bg-[#F5F4F0]'}`}>
      <div className="max-w-6xl mx-auto">
        <div>
          <div className={`text-xs tracking-[0.2em] uppercase mb-4 ${theme === 'dark' ? 'text-white/30' : 'text-[#0D0D0D]/30'}`}>
            Under the hood
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className={`font-['Instrument_Serif'] text-5xl md:text-6xl tracking-tight mb-4 ${theme === 'dark' ? 'text-white' : 'text-[#0D0D0D]'}`}
          >
            6 layers.<br />
            <em className="italic opacity-40">Zero guessing.</em>
          </motion.h2>
          <p className={`text-base max-w-lg mb-16 ${theme === 'dark' ? 'text-white/50' : 'text-[#0D0D0D]/50'}`}>
            Every AI call routes to the right model.
            <br className="hidden md:block" />
            Every answer cites its exact source.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`card-plain rounded-2xl p-6 md:p-8 flex flex-col min-h-[280px] transition-all duration-300 ${
                theme === 'dark' 
                  ? 'bg-[#161B22] border border-white/8 hover:border-white/16 hover:bg-[#1C2128]' 
                  : 'bg-white border border-[#0D0D0D]/8 hover:border-[#0D0D0D]/16 hover:bg-[#FAFAFA]'
              }`}
            >
              <div className={`font-['Instrument_Serif'] italic text-[80px] leading-none font-semibold mb-3 ${theme === 'dark' ? 'text-white/[0.05]' : 'text-[#0D0D0D]/[0.05]'}`}>
                {card.number}
              </div>
              
              <card.icon 
                className={`w-8 h-8 mb-4 ${theme === 'dark' ? 'text-white/40' : 'text-[#0D0D0D]/40'}`} 
              />
              
              <h3 className={`text-lg font-semibold tracking-tight mb-1 ${theme === 'dark' ? 'text-white' : 'text-[#0D0D0D]'}`}>
                {card.title}
              </h3>
              
              <div className={`text-sm mb-4 ${theme === 'dark' ? 'text-white/40' : 'text-[#0D0D0D]/40'}`}>
                {card.subtitle}
              </div>
              
              <div className={`text-sm leading-relaxed flex-1 ${theme === 'dark' ? 'text-white/60' : 'text-[#0D0D0D]/60'}`}>
                {card.desc}
              </div>
              
              <div className={`w-full h-px mt-6 mb-4 ${theme === 'dark' ? 'bg-white/8' : 'bg-[#0D0D0D]/8'}`} />
              
              <div className={`inline-flex items-center gap-1.5 text-[10px] tracking-[0.12em] uppercase font-medium ${theme === 'dark' ? 'text-white/25' : 'text-[#0D0D0D]/25'}`}>
                <div className={`w-1 h-1 rounded-full ${theme === 'dark' ? 'bg-white/25' : 'bg-[#0D0D0D]/25'}`} />
                {card.tag}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
