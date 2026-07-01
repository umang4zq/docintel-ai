import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ServicesSection() {
  const { theme } = useTheme();

  const capabilities = [
    {
      title: "Smart OCR",
      desc: "Extract information from almost any document format in any language."
    },
    {
      title: "Cross-Document Reasoning",
      desc: "Find relationships and contradictions across thousands of files."
    },
    {
      title: "Citation Tracking",
      desc: "Every answer links back to exact evidence."
    },
    {
      title: "Conflict Detection",
      desc: "Identify conflicting claims and inconsistent data."
    },
    {
      title: "Multi-Turn Memory",
      desc: "Conversations remain context-aware."
    },
    {
      title: "Enterprise Security",
      desc: "Row-level security, signed storage URLs, and isolated user data."
    }
  ];

  return (
    <section className={`py-28 md:py-40 px-6 overflow-hidden relative ${theme === 'dark' ? 'bg-black' : 'bg-[#F5F4F0]'}`}>
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, ${theme === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'} 0%, transparent 70%)`
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex justify-between items-end mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className={`text-4xl md:text-6xl tracking-tight font-['Instrument_Serif'] ${theme === 'dark' ? 'text-white' : 'text-[#0D0D0D]'}`}
          >
            Core Capabilities
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {capabilities.map((cap, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`card-plain ${theme === 'dark' ? 'bg-[#161B22] border border-white/8' : 'bg-white border border-[#0D0D0D]/8'} rounded-3xl p-8 group flex flex-col relative`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`card-plain ${theme === 'dark' ? 'bg-[#161B22] border border-white/8 text-white' : 'bg-white border border-[#0D0D0D]/8 text-[#0D0D0D]'} rounded-full p-2`}>
                  <ArrowUpRight size={16} />
                </div>
              </div>

              <h3 className={`text-xl md:text-2xl tracking-tight mb-3 font-medium ${theme === 'dark' ? 'text-white' : 'text-[#0D0D0D]'}`}>
                {cap.title}
              </h3>
              
              <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-white/50' : 'text-[#0D0D0D]/50'}`}>
                {cap.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
