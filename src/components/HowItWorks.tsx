import { Upload, Cpu, Download } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 px-6 bg-black border-t border-zinc-200 dark:border-white/8">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-6xl mx-auto"
      >
        
        {/* Eyebrow */}
        <p className="text-[#1D9E75] text-xs font-medium tracking-[0.2em] uppercase mb-4">
          How DocIntel AI works
        </p>
        
        {/* Heading */}
        <h2 className="font-mono-display font-bold text-zinc-900 dark:text-white text-4xl md:text-6xl tracking-tighter leading-[0.9] mb-6">
          <span className="block">Three steps.</span>
          <span className="block text-[#1D9E75]">Zero boilerplate.</span>
        </h2>
        
        {/* Subtext */}
        <p className="text-zinc-900 dark:text-zinc-500 dark:text-white/50 text-base max-w-lg mb-20">
          From a screenshot to a running Flutter app. Powered by DocIntel AI — Kimi K2, Nemotron OCR, and Nemotron Super 120B.
        </p>
        
        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Step 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="border border-zinc-200 dark:border-white/8 rounded-2xl p-8 bg-zinc-50 dark:bg-white/[0.02] hover:border-[#1D9E75]/30 hover:bg-zinc-100 dark:bg-white/[0.04] transition-all duration-300"
          >
            <div className="font-mono-display text-6xl font-bold text-zinc-900 dark:text-white/8 mb-4">01</div>
            <Upload size={24} className="text-[#1D9E75] mb-4" />
            <h3 className="font-mono-display font-bold text-zinc-900 dark:text-white text-xl mb-3">Upload your screens</h3>
            <p className="text-zinc-900 dark:text-zinc-500 dark:text-white/50 text-sm leading-relaxed">
              Drop up to 6 PDF documentshots or PNG exports. Name each screen — that name becomes the route path.
            </p>
          </motion.div>
          
          {/* Step 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="border border-zinc-200 dark:border-white/8 rounded-2xl p-8 bg-zinc-50 dark:bg-white/[0.02] hover:border-[#1D9E75]/30 hover:bg-zinc-100 dark:bg-white/[0.04] transition-all duration-300"
          >
            <div className="font-mono-display text-6xl font-bold text-zinc-900 dark:text-white/8 mb-4">02</div>
            <Cpu size={24} className="text-[#1D9E75] mb-4" />
            <h3 className="font-mono-display font-bold text-zinc-900 dark:text-white text-xl mb-3">AI pipeline runs</h3>
            <p className="text-zinc-900 dark:text-zinc-500 dark:text-white/50 text-sm leading-relaxed">
              Nemotron OCR reads every UI element. Gemma 4 maps them to Flutter widgets. Nemotron Super 120B infers navigation and cross-screen state.
            </p>
          </motion.div>
          
          {/* Step 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="border border-zinc-200 dark:border-white/8 rounded-2xl p-8 bg-zinc-50 dark:bg-white/[0.02] hover:border-[#1D9E75]/30 hover:bg-zinc-100 dark:bg-white/[0.04] transition-all duration-300"
          >
            <div className="font-mono-display text-6xl font-bold text-zinc-900 dark:text-white/8 mb-4">03</div>
            <Download size={24} className="text-[#1D9E75] mb-4" />
            <h3 className="font-mono-display font-bold text-zinc-900 dark:text-white text-xl mb-3">Download your project</h3>
            <p className="text-zinc-900 dark:text-zinc-500 dark:text-white/50 text-sm leading-relaxed">
              Get a ZIP with screens/, providers/, constants/, app_router.dart, pubspec.yaml — ready for flutter pub get && flutter run.
            </p>
          </motion.div>
          
        </div>
      </motion.div>
    </section>
  );
}
