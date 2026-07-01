import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function PricingSection() {
  const { theme } = useTheme();

  return (
    <section className={`py-28 md:py-40 px-6 border-t ${theme === 'dark' ? 'bg-black border-white/8' : 'bg-[#F5F4F0] border-[#0D0D0D]/8'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-20 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className={`text-5xl md:text-7xl tracking-tight font-['Instrument_Serif'] mb-6 ${theme === 'dark' ? 'text-white' : 'text-[#0D0D0D]'}`}
          >
            Start free. Scale infinitely.
          </motion.h2>
          <p className={`text-lg max-w-2xl mx-auto ${theme === 'dark' ? 'text-white/60' : 'text-[#0D0D0D]/60'}`}>
            Whether you're analyzing 10 files or 10 million pages, DocIntel scales with you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className={`card-plain ${theme === 'dark' ? 'bg-[#161B22] border border-white/8' : 'bg-white border border-[#0D0D0D]/8'} rounded-3xl p-10 flex flex-col items-center text-center`}
          >
            <h3 className={`text-2xl font-medium mb-4 ${theme === 'dark' ? 'text-white' : 'text-[#0D0D0D]'}`}>Starter</h3>
            <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-white/60' : 'text-[#0D0D0D]/60'}`}>
              Perfect for individuals and small teams.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`card-plain ${theme === 'dark' ? 'bg-[#161B22] border border-[#7C3AED]/30 shadow-[0_0_20px_rgba(124,58,237,0.1)]' : 'bg-white border border-[#7C3AED]/30 shadow-[0_0_20px_rgba(124,58,237,0.1)]'} rounded-3xl p-10 flex flex-col items-center text-center relative`}
          >
            <div className="absolute -top-4 bg-[#7C3AED] text-white text-xs font-semibold px-4 py-1 rounded-full uppercase tracking-wider">Most Popular</div>
            <h3 className={`text-2xl font-medium mb-4 ${theme === 'dark' ? 'text-white' : 'text-[#0D0D0D]'}`}>Pro</h3>
            <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-white/60' : 'text-[#0D0D0D]/60'}`}>
              For growing businesses with larger document workloads.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`card-plain ${theme === 'dark' ? 'bg-[#161B22] border border-white/8' : 'bg-white border border-[#0D0D0D]/8'} rounded-3xl p-10 flex flex-col items-center text-center`}
          >
            <h3 className={`text-2xl font-medium mb-4 ${theme === 'dark' ? 'text-white' : 'text-[#0D0D0D]'}`}>Enterprise</h3>
            <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-white/60' : 'text-[#0D0D0D]/60'}`}>
              Custom deployment, private infrastructure, advanced compliance.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
