import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function UseCasesSection() {
  const { theme } = useTheme();

  const useCases = [
    { title: "Legal Teams", desc: "Analyze contracts and detect contradictions." },
    { title: "Finance Teams", desc: "Track clauses, obligations, and risks." },
    { title: "Research Labs", desc: "Cross-reference papers and findings." },
    { title: "Healthcare", desc: "Extract patient records and evidence." },
    { title: "Enterprises", desc: "Search knowledge buried in PDFs." },
    { title: "Education", desc: "Turn notes and books into AI tutors." }
  ];

  return (
    <section className={`py-28 md:py-40 px-6 ${theme === 'dark' ? 'bg-black' : 'bg-[#F5F4F0]'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-20 text-center">
          <div className={`text-xs tracking-widest uppercase mb-4 ${theme === 'dark' ? 'text-white/40' : 'text-[#0D0D0D]/40'}`}>
            Use Cases
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className={`text-4xl md:text-5xl lg:text-6xl tracking-tight font-['Instrument_Serif'] mb-6 ${theme === 'dark' ? 'text-white' : 'text-[#0D0D0D]'}`}
          >
            DocIntel works for teams that live inside documents.
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((uc, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`card-plain ${theme === 'dark' ? 'bg-[#161B22] border border-white/8' : 'bg-white border border-[#0D0D0D]/8'} rounded-3xl p-8`}
            >
              <h3 className={`text-xl font-medium mb-3 ${theme === 'dark' ? 'text-white' : 'text-[#0D0D0D]'}`}>
                {uc.title}
              </h3>
              <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-white/60' : 'text-[#0D0D0D]/60'}`}>
                {uc.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
