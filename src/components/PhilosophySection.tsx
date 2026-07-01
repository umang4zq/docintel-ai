import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function PhilosophySection() {
  const { theme } = useTheme();

  return (
    <section className={`py-28 md:py-40 px-6 overflow-hidden ${theme === 'dark' ? 'bg-black' : 'bg-[#F5F4F0]'}`}>
      <div className="max-w-6xl mx-auto relative">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className={`text-5xl md:text-7xl lg:text-8xl tracking-tight mb-16 md:mb-24 font-['Instrument_Serif'] ${theme === 'dark' ? 'text-white' : 'text-[#0D0D0D]'}`}
        >
          Ingest <em className="italic opacity-40">×</em> Understand.
        </motion.h2>

        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col"
          >
            <div>
              <div className={`text-xs tracking-widest uppercase mb-4 ${theme === 'dark' ? 'text-white/40' : 'text-[#0D0D0D]/40'}`}>
                Layer 1–3 — Ingestion + OCR + Graph
              </div>
              <p className={`text-base md:text-lg leading-relaxed ${theme === 'dark' ? 'text-white/70' : 'text-[#0D0D0D]/70'}`}>
                PDFs become image pages. Scanned docs and handwritten notes in any language run through Nemotron OCR — structured text out with page, section, table, bbox, and confidence score. Nemotron Super 120B then extracts every entity and relation, building a live knowledge graph of nodes and typed edges stored in Supabase JSONB.
              </p>
            </div>

            <div className={`w-full h-px my-8 ${theme === 'dark' ? 'bg-white/10' : 'bg-[#0D0D0D]/10'}`} />

            <div>
              <div className={`text-xs tracking-widest uppercase mb-4 ${theme === 'dark' ? 'text-white/40' : 'text-[#0D0D0D]/40'}`}>
                Layer 4–6 — Storage + RAG + Chat
              </div>
              <p className={`text-base md:text-lg leading-relaxed ${theme === 'dark' ? 'text-white/70' : 'text-[#0D0D0D]/70'}`}>
                Every chunk is embedded to a 1536d pgvector in Supabase. At query time, cosine similarity retrieves the top-K chunks across your entire corpus. The knowledge graph expands context further. Kimi K2 orchestrates the session. Nemotron Super 120B synthesises a grounded answer with inline [Doc, p.N] citations — follow-up queries loop back through the same pipeline.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
