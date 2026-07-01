import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function CTASection() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  return (
    <section className={`py-32 px-6 overflow-hidden ${theme === 'dark' ? 'bg-black' : 'bg-[#F5F4F0]'}`}>
      <div className={`max-w-4xl mx-auto card-plain ${theme === 'dark' ? 'bg-[#161B22] border border-white/8' : 'bg-white border border-[#0D0D0D]/8'} rounded-3xl p-10 md:p-16 text-center relative overflow-hidden`}>
        
        <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/10 to-transparent pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="relative z-10"
        >
          <h2 className={`text-4xl md:text-6xl font-['Instrument_Serif'] tracking-tight mb-6 ${theme === 'dark' ? 'text-white' : 'text-[#0D0D0D]'}`}>
            Stop reading documents manually.
            <br />
            <em className="italic opacity-80">Start talking to them.</em>
          </h2>

          <p className={`text-base md:text-lg mb-10 max-w-2xl mx-auto ${theme === 'dark' ? 'text-white/70' : 'text-[#0D0D0D]/70'}`}>
            Upload your first document and experience citation-backed intelligence in seconds.
          </p>

          <button onClick={() => navigate('/register')} className={`inline-flex items-center gap-3 rounded-full px-8 py-4 font-semibold text-sm transition-transform hover:scale-105 active:scale-95 ${theme === 'dark' ? 'bg-white text-black' : 'bg-[#0D0D0D] text-white'}`}>
            Try DocIntel Free <ArrowRight size={18} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
