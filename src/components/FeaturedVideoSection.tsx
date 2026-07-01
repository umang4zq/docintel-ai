import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function FeaturedVideoSection() {
  const { theme } = useTheme();

  return (
    <section className={`pt-6 md:pt-10 pb-20 md:pb-32 px-6 overflow-hidden ${theme === 'dark' ? 'bg-black' : 'bg-[#F5F4F0]'}`}>
      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9 }}
          className={`relative rounded-3xl overflow-hidden card-plain ${theme === 'dark' ? 'bg-[#161B22] border border-white/8' : 'bg-white border border-[#0D0D0D]/8'} min-h-[300px] flex items-end`}
        >
          <div className="w-full p-6 md:p-10 flex flex-col md:flex-row items-end justify-between gap-6 z-10">
            <div className="card-plain bg-black/60 rounded-2xl p-6 md:p-8 max-w-md w-full md:w-auto">
              <div className={`text-xs tracking-widest uppercase mb-3 ${theme === 'dark' ? 'text-white/50' : 'text-white/60'}`}>
                The AI Pipeline
              </div>
              <p className={`text-sm md:text-base leading-relaxed ${theme === 'dark' ? 'text-white' : 'text-white/90'}`}>
                6 layers. Zero hallucination. Every answer tied to an exact page, section, and bounding box in your original document. Nemotron OCR reads it. Nemotron Super 120B graphs it. Kimi K2 answers it.
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium whitespace-nowrap"
            >
              Explore the pipeline
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
