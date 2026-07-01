import { motion } from 'framer-motion';

export default function Pricing() {
  return (
    <section id="pricing" className="py-32 px-6 bg-black border-t border-zinc-200 dark:border-white/8">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl mx-auto text-center"
      >
        
        {/* Eyebrow */}
        <p className="text-[#1D9E75] text-xs font-medium tracking-[0.2em] uppercase mb-4">
          Simple pricing
        </p>
        
        {/* Heading */}
        <h2 className="font-mono-display font-bold text-zinc-900 dark:text-white text-4xl md:text-6xl tracking-tighter leading-[0.9] mb-6">
          <span className="block">Pay for what</span>
          <span className="block text-[#1D9E75]">you generate.</span>
        </h2>
        
        {/* Subtext */}
        <p className="text-zinc-900 dark:text-zinc-500 dark:text-white/50 text-base max-w-lg mx-auto">
          No subscriptions. Credits don't expire. Buy once, generate whenever.
        </p>
        
        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-left">
          
          {/* PLAN 1 — Starter */}
          <motion.div 
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="border border-zinc-200 dark:border-white/10 rounded-2xl p-8 bg-zinc-50 dark:bg-white/[0.02]"
          >
            <div className="text-zinc-900 dark:text-white font-mono-display font-bold text-4xl">Free</div>
            <div className="text-zinc-900 dark:text-zinc-400 dark:text-white/40 text-sm mt-1">3 credits on signup</div>
            <div className="border-t border-zinc-200 dark:border-white/8 my-6"></div>
            <div className="flex flex-col gap-3 text-sm text-zinc-900 dark:text-white/60">
              <div>✓ 3 project generations</div>
              <div>✓ Up to 4 screens per project</div>
              <div>✓ Full ZIP download</div>
              <div>✓ Cross-doc RAG + go_router</div>
              <div className="text-zinc-900 dark:text-zinc-300 dark:text-white/20">✗ Priority AI queue</div>
              <div className="text-zinc-900 dark:text-zinc-300 dark:text-white/20">✗ Custom design tokens</div>
            </div>
            <button className="border border-zinc-300 dark:border-white/20 text-zinc-900 dark:text-white rounded-full px-6 py-3 text-sm hover:bg-zinc-200 dark:bg-white/10 w-full text-center mt-8 transition-colors">
              Start free
            </button>
          </motion.div>
          
          {/* PLAN 2 — Pro (featured) */}
          <motion.div 
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="border-2 border-[#1D9E75] rounded-2xl p-8 bg-[#1D9E75]/[0.04] relative overflow-hidden"
          >
            <div className="absolute top-6 right-6 bg-[#1D9E75] text-zinc-900 dark:text-white text-xs font-medium px-3 py-1 rounded-full">
              Most popular
            </div>
            <div className="text-zinc-900 dark:text-white font-mono-display font-bold text-4xl">₹999</div>
            <div className="text-zinc-900 dark:text-zinc-400 dark:text-white/40 text-sm mt-1">50 credits · one-time</div>
            <div className="border-t border-[#1D9E75]/20 my-6"></div>
            <div className="flex flex-col gap-3 text-sm text-zinc-900 dark:text-white/60">
              <div>✓ 50 project generations</div>
              <div>✓ Up to 6 screens per project</div>
              <div>✓ Full ZIP download</div>
              <div>✓ Cross-doc RAG + go_router</div>
              <div>✓ Priority AI queue</div>
              <div>✓ Custom design tokens UI</div>
            </div>
            <button className="bg-[#1D9E75] text-zinc-900 dark:text-white rounded-full px-6 py-3 text-sm hover:bg-[#178a64] w-full text-center mt-8 transition-colors">
              Get 50 credits
            </button>
          </motion.div>
          
          {/* PLAN 3 — Team */}
          <motion.div 
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="border border-zinc-200 dark:border-white/10 rounded-2xl p-8 bg-zinc-50 dark:bg-white/[0.02]"
          >
            <div className="text-zinc-900 dark:text-white font-mono-display font-bold text-4xl">₹3,499</div>
            <div className="text-zinc-900 dark:text-zinc-400 dark:text-white/40 text-sm mt-1">Unlimited · one-time</div>
            <div className="border-t border-zinc-200 dark:border-white/8 my-6"></div>
            <div className="flex flex-col gap-3 text-sm text-zinc-900 dark:text-white/60">
              <div>✓ Unlimited generations</div>
              <div>✓ Up to 6 screens per project</div>
              <div>✓ Full ZIP download</div>
              <div>✓ Cross-doc RAG + go_router</div>
              <div>✓ Priority AI queue</div>
              <div>✓ Custom design tokens UI</div>
              <div>✓ Team workspace (coming soon)</div>
              <div>✓ API access (coming soon)</div>
            </div>
            <button className="border border-zinc-300 dark:border-white/20 text-zinc-900 dark:text-white rounded-full px-6 py-3 text-sm hover:bg-zinc-200 dark:bg-white/10 w-full text-center mt-8 transition-colors">
              Get unlimited
            </button>
          </motion.div>
          
        </div>
        
        {/* Bottom note */}
        <p className="text-zinc-900 dark:text-zinc-400 dark:text-white/30 text-xs text-center mt-8">
          All plans include Cross-doc RAG 2.x, go_router 6.x, Flutter 3.x output. Credits never expire.
        </p>
        
      </motion.div>
    </section>
  );
}
