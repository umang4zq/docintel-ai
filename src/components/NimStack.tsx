import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

export default function NimStack() {
  return (
    <section id="nim" className="py-32 px-6 bg-zinc-50 dark:bg-[#080808] border-t border-zinc-200 dark:border-white/8">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-6xl mx-auto"
      >
        
        {/* Eyebrow */}
        <p className="text-[#1D9E75] text-xs font-medium tracking-[0.2em] uppercase mb-4">
          Powered by DocIntel AI
        </p>
        
        {/* Heading */}
        <h2 className="font-mono-display font-bold text-zinc-900 dark:text-white text-4xl md:text-6xl tracking-tighter leading-[0.9] mb-6">
          <span className="block">No OpenAI.</span>
          <span className="block">No Anthropic.</span>
          <span className="block text-[#1D9E75]">Just DocIntel AI.</span>
        </h2>
        
        {/* Subtext */}
        <p className="text-zinc-900 dark:text-zinc-500 dark:text-white/50 text-base max-w-lg mb-20">
          Every AI call in Study AI goes to https://integrate.api.nvidia.com/v1 — four specialized models, each assigned one job.
        </p>
        
        {/* Models grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-16"
        >
          
          {/* Card 1 */}
          <motion.div variants={cardVariants} className="border border-zinc-200 dark:border-white/8 rounded-2xl p-6 bg-zinc-50 dark:bg-white/[0.02] hover:border-[#1D9E75]/30 transition-all">
            <span className="inline-block bg-[#1D9E75]/10 text-[#1D9E75] text-xs font-mono-display px-3 py-1 rounded-full mb-4">
              nvidia/nemotron-ocr
            </span>
            <h3 className="text-zinc-900 dark:text-white font-medium mb-2">Screen reader</h3>
            <p className="text-zinc-900 dark:text-zinc-500 dark:text-white/50 text-sm leading-relaxed">
              Reads every pixel of your PDF documentshot. Detects UI elements, layout structure, text labels, and interactive components.
            </p>
          </motion.div>
          
          {/* Card 2 */}
          <motion.div variants={cardVariants} className="border border-zinc-200 dark:border-white/8 rounded-2xl p-6 bg-zinc-50 dark:bg-white/[0.02] hover:border-[#1D9E75]/30 transition-all">
            <span className="inline-block bg-[#1D9E75]/10 text-[#1D9E75] text-xs font-mono-display px-3 py-1 rounded-full mb-4">
              google/gemma-4-31b-it
            </span>
            <h3 className="text-zinc-900 dark:text-white font-medium mb-2">Widget mapper</h3>
            <p className="text-zinc-900 dark:text-zinc-500 dark:text-white/50 text-sm leading-relaxed">
              Maps every detected element to its Flutter widget equivalent. Determines widget hierarchy, props, and which elements need state.
            </p>
          </motion.div>
          
          {/* Card 3 */}
          <motion.div variants={cardVariants} className="border border-zinc-200 dark:border-white/8 rounded-2xl p-6 bg-zinc-50 dark:bg-white/[0.02] hover:border-[#1D9E75]/30 transition-all">
            <span className="inline-block bg-[#1D9E75]/10 text-[#1D9E75] text-xs font-mono-display px-3 py-1 rounded-full mb-4">
              moonshotai/kimi-k2
            </span>
            <h3 className="text-zinc-900 dark:text-white font-medium mb-2">Code generator</h3>
            <p className="text-zinc-900 dark:text-zinc-500 dark:text-white/50 text-sm leading-relaxed">
              Writes the actual Dart code. ConsumerWidgets, providers, go_router routes, and app_router.dart — all production-quality.
            </p>
          </motion.div>
          
          {/* Card 4 */}
          <motion.div variants={cardVariants} className="border border-zinc-200 dark:border-white/8 rounded-2xl p-6 bg-zinc-50 dark:bg-white/[0.02] hover:border-[#1D9E75]/30 transition-all">
            <span className="inline-block bg-[#1D9E75]/10 text-[#1D9E75] text-xs font-mono-display px-3 py-1 rounded-full mb-4">
              nvidia/nemotron-super-120b
            </span>
            <h3 className="text-zinc-900 dark:text-white font-medium mb-2">Architecture reasoner</h3>
            <p className="text-zinc-900 dark:text-zinc-500 dark:text-white/50 text-sm leading-relaxed">
              Cross-screen analysis. Infers navigation flow, shared state, and folder structure across all uploaded screens simultaneously.
            </p>
          </motion.div>
          
        </motion.div>
        
        {/* Pipeline flow */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 flex items-center justify-center flex-wrap gap-3"
        >
          <div className="bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-full px-4 py-2 text-zinc-900 dark:text-white/60 text-sm font-mono-display">OCR</div>
          <div className="text-zinc-900 dark:text-zinc-300 dark:text-white/20 text-lg">→</div>
          <div className="bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-full px-4 py-2 text-zinc-900 dark:text-white/60 text-sm font-mono-display">Widget map</div>
          <div className="text-zinc-900 dark:text-zinc-300 dark:text-white/20 text-lg">→</div>
          <div className="bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-full px-4 py-2 text-zinc-900 dark:text-white/60 text-sm font-mono-display">Code gen</div>
          <div className="text-zinc-900 dark:text-zinc-300 dark:text-white/20 text-lg">→</div>
          <div className="bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-full px-4 py-2 text-zinc-900 dark:text-white/60 text-sm font-mono-display">ZIP</div>
        </motion.div>
        
      </motion.div>
    </section>
  );
}
