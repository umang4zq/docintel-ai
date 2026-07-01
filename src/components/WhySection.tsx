import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function WhySection() {
  const { theme } = useTheme();

  return (
    <section className={`pt-10 pb-20 px-6 overflow-hidden ${theme === 'dark' ? 'bg-black' : 'bg-[#F5F4F0]'}`}>
      <div className={`max-w-4xl mx-auto relative card-plain ${theme === 'dark' ? 'bg-[#161B22] border border-white/8' : 'bg-white border border-[#0D0D0D]/8'} rounded-3xl p-8 md:p-12`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9 }}
          className="flex flex-col items-center text-center"
        >
          <div className={`text-xs tracking-widest uppercase mb-4 ${theme === 'dark' ? 'text-white/50' : 'text-[#0D0D0D]/50'}`}>
            Why DocIntel?
          </div>
          
          <h2 className={`text-3xl md:text-5xl font-['Instrument_Serif'] mb-6 ${theme === 'dark' ? 'text-white' : 'text-[#0D0D0D]'}`}>
            Built for trust, not hallucination.
          </h2>

          <div className={`text-base md:text-lg leading-relaxed max-w-2xl space-y-6 ${theme === 'dark' ? 'text-white/80' : 'text-[#0D0D0D]/80'}`}>
            <p>
              AI is useful only when you can verify it.
            </p>
            <p>
              That’s why every answer from DocIntel is traceable to:
            </p>
            <ul className="list-none space-y-2 inline-block text-left bg-black/20 dark:bg-white/5 p-6 rounded-2xl">
              <li>• Original document</li>
              <li>• Exact page number</li>
              <li>• Section reference</li>
              <li>• Bounding box location</li>
              <li>• Confidence score</li>
            </ul>
            <p className="font-semibold text-lg pt-4">
              No black-box answers.<br/>
              No fabricated claims.<br/>
              Only verifiable intelligence.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
