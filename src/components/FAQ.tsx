import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQ_ITEMS = [
  {
    question: "Does the generated code actually compile?",
    answer: "Yes. Every ZIP passes internal flutter analyze before download. It uses flutter_riverpod 2.4.x and go_router 6.x — the current stable versions."
  },
  {
    question: "What file formats can I upload?",
    answer: "PNG and JPG. Export your Figma frames at 2x for best results. Max 6 screens per generation. Each screen should be one full mobile frame — not a component or partial view."
  },
  {
    question: "Which Flutter packages are included?",
    answer: "flutter_riverpod, go_router, and flutter_lints. We don't add http, dio, or any networking package — those depend on your backend and are easy to add yourself."
  },
  {
    question: "Is my Figma design stored anywhere?",
    answer: "Uploaded images are processed and deleted within 60 seconds. ZIPs are available for 24 hours then permanently deleted. We store nothing long-term."
  },
  {
    question: "Can I customise the design tokens before generating?",
    answer: "Yes on Pro and Team plans. You can set primary color, font family, border radius, and spacing base before hitting generate. These flow into AppColors and AppTextStyles constants automatically."
  },
  {
    question: "What does DocIntel AI mean for my data?",
    answer: "NIM runs on NVIDIA's infrastructure, not ours. Your images are sent to the AI API, processed, and the response returned — same as any API call. No training on your data."
  }
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-32 px-6 bg-black border-t border-zinc-200 dark:border-white/8">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-3xl mx-auto"
      >
        
        {/* Eyebrow */}
        <p className="text-[#1D9E75] text-xs font-medium tracking-[0.2em] uppercase mb-4">
          Common questions
        </p>
        
        {/* Heading */}
        <h2 className="font-mono-display font-bold text-zinc-900 dark:text-white text-4xl md:text-6xl tracking-tighter leading-[0.9] mb-6">
          <span className="block">Everything you</span>
          <span className="block text-[#1D9E75]">need to know.</span>
        </h2>
        
        {/* FAQ accordion */}
        <div className="mt-16 flex flex-col divide-y divide-white/8">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = activeIndex === index;
            return (
              <div 
                key={index} 
                className="py-6 cursor-pointer"
                onClick={() => setActiveIndex(isOpen ? null : index)}
              >
                {/* Question row */}
                <div className="flex justify-between items-center">
                  <h3 className="text-zinc-900 dark:text-white font-medium text-base">{item.question}</h3>
                  <ChevronDown 
                    size={20} 
                    className={`text-zinc-900 dark:text-white transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                  />
                </div>
                
                {/* Answer */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="text-zinc-900 dark:text-zinc-500 dark:text-white/50 text-sm leading-relaxed">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
        
      </motion.div>
    </section>
  );
}
