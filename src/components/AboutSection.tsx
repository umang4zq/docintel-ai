import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function AboutSection() {
  const { theme } = useTheme();

  return (
    <section className={`pt-20 pb-20 px-6 overflow-hidden relative ${theme === 'dark' ? 'bg-black' : 'bg-[#F5F4F0]'}`}>
      <div 
        className={`absolute inset-0 ${theme === 'dark' 
          ? 'bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.03)_0%,_transparent_70%)]' 
          : 'bg-[radial-gradient(ellipse_at_top,_rgba(0,0,0,0.03)_0%,_transparent_70%)]'}`}
      />
      
      <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className={`text-sm tracking-widest uppercase mb-6 ${theme === 'dark' ? 'text-white/40' : 'text-[#0D0D0D]/40'}`}
        >
          What is DocIntel?
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className={`text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight font-['Instrument_Serif'] ${theme === 'dark' ? 'text-white' : 'text-[#0D0D0D]'}`}
        >
          Documents become knowledge you can talk to.
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className={`mt-10 text-base md:text-lg leading-relaxed text-left max-w-3xl space-y-6 ${theme === 'dark' ? 'text-white/70' : 'text-[#0D0D0D]/70'}`}
        >
          <p className={`text-xl md:text-2xl font-medium text-center ${theme === 'dark' ? 'text-white/90' : 'text-[#0D0D0D]/90'}`}>
            Most AI tools only read text. DocIntel understands relationships.
          </p>
          <p>
            Upload a contract, research paper, invoice batch, legal archive, medical records, or handwritten notes. DocIntel converts raw documents into structured knowledge and builds a live knowledge graph connecting people, organizations, dates, claims, concepts, and evidence.
          </p>
          <p>Instead of searching manually, simply ask:</p>
          <ul className="list-disc pl-8 space-y-2">
            <li>“What payment terms changed between contracts?”</li>
            <li>“Which documents contradict each other?”</li>
            <li>“Summarize all mentions of NVIDIA partnerships.”</li>
            <li>“Find every reference to tax liability.”</li>
          </ul>
          <p className={`font-medium italic text-center pt-4 ${theme === 'dark' ? 'text-white' : 'text-[#0D0D0D]'}`}>
            DocIntel gives answers backed by citations, not guesses.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
