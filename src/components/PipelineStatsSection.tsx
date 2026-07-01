import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function PipelineStatsSection() {
  const { theme } = useTheme();

  const stats = [
    { value: "~45s", label: "Average corpus ingestion time" },
    { value: "1536D", label: "Vector embeddings" },
    { value: "6", label: "Pipeline layers" },
    { value: "100%", label: "Citation-backed answers" },
    { value: "Cross-Doc", label: "Reasoning across all files" },
    { value: "Zero Hallucination", label: "Evidence-first AI" }
  ];

  return (
    <section className={`py-24 px-6 border-t border-b ${theme === 'dark' ? 'bg-black border-white/8' : 'bg-[#F5F4F0] border-[#0D0D0D]/8'}`}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 mb-16">
        <div className={`text-xs tracking-widest uppercase ${theme === 'dark' ? 'text-white/40' : 'text-[#0D0D0D]/40'}`}>
          By The Numbers
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto flex flex-row flex-wrap justify-between gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
            className={`card-plain ${theme === 'dark' ? 'bg-[#161B22] border border-white/8' : 'bg-white border border-[#0D0D0D]/8'} rounded-2xl px-6 py-6 text-center flex-1 min-w-[200px]`}
          >
            <div className={`font-['Instrument_Serif'] text-3xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-[#0D0D0D]'}`}>
              {stat.value}
            </div>
            <div className={`text-xs tracking-wide ${theme === 'dark' ? 'text-white/50' : 'text-[#0D0D0D]/50'}`}>
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
