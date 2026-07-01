import { GitBranch, Route, Palette, Layers, Zap, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  { icon: GitBranch, title: "Cross-doc RAG 2.x state", desc: "ConsumerWidget per screen. FutureProvider for async. StateNotifier for forms. All wired correctly." },
  { icon: Route, title: "go_router navigation", desc: "Routes inferred from your screen names. GoRouter.of(context).push() in every button tap." },
  { icon: Palette, title: "Design tokens extracted", desc: "Your colors become AppColors constants. Fonts become AppTextStyles. Zero hardcoded hex." },
  { icon: Layers, title: "Clean folder structure", desc: "screens/, providers/, constants/ — the structure senior Flutter devs actually use." },
  { icon: Zap, title: "Compilable on download", desc: "flutter pub get then flutter run. No manual wiring needed." },
  { icon: Shield, title: "DocIntel AI only", desc: "Kimi K2, Nemotron OCR, Nemotron Super 120B. No OpenAI. No Anthropic. No vendor lock-in." }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function WhatYouGet() {
  return (
    <section id="output" className="py-32 px-6 bg-zinc-50 dark:bg-[#080808] border-t border-zinc-200 dark:border-white/8">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-6xl mx-auto"
      >
        
        {/* Eyebrow */}
        <p className="text-[#1D9E75] text-xs font-medium tracking-[0.2em] uppercase mb-4">
          What's in the ZIP
        </p>
        
        {/* Heading */}
        <h2 className="font-mono-display font-bold text-zinc-900 dark:text-white text-4xl md:text-6xl tracking-tighter leading-[0.9] mb-6">
          <span className="block">Production code.</span>
          <span className="block text-[#1D9E75]">Not starter code.</span>
        </h2>
        
        {/* Subtext */}
        <p className="text-zinc-900 dark:text-zinc-500 dark:text-white/50 text-base max-w-lg">
          Every file follows production Flutter conventions — no TODO comments, no placeholder widgets, no hardcoded colors.
        </p>
        
        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-20">
          
          {/* LEFT — File tree card */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-white dark:bg-[#0D1117] border border-zinc-200 dark:border-white/10 rounded-2xl p-6 font-mono-display text-sm h-fit"
          >
            {/* Header bar */}
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-zinc-200 dark:border-white/8">
              <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
              <span className="text-zinc-900 dark:text-zinc-400 dark:text-white/30 text-xs ml-2">my_app/</span>
            </div>
            
            {/* File tree content */}
            <div className="flex flex-col gap-1.5">
              <div className="text-zinc-900 dark:text-zinc-400 dark:text-white/40">my_app/</div>
              <div className="text-[#1D9E75] ml-4">pubspec.yaml</div>
              <div className="text-zinc-900 dark:text-zinc-400 dark:text-white/40 ml-4">lib/</div>
              <div className="text-[#1D9E75] ml-8">main.dart</div>
              <div className="text-[#1D9E75] ml-8">app_router.dart</div>
              <div className="text-zinc-900 dark:text-zinc-400 dark:text-white/40 ml-8">constants/</div>
              <div className="text-zinc-900 dark:text-zinc-600 dark:text-white/70 ml-12">app_colors.dart</div>
              <div className="text-zinc-900 dark:text-zinc-600 dark:text-white/70 ml-12">app_text_styles.dart</div>
              <div className="text-zinc-900 dark:text-zinc-400 dark:text-white/40 ml-8">providers/</div>
              <div className="text-zinc-900 dark:text-zinc-600 dark:text-white/70 ml-12">providers.dart</div>
              <div className="text-zinc-900 dark:text-zinc-600 dark:text-white/70 ml-12">auth_provider.dart</div>
              <div className="text-zinc-900 dark:text-zinc-400 dark:text-white/40 ml-8">screens/</div>
              <div className="text-zinc-900 dark:text-zinc-400 dark:text-white/40 ml-12">home/</div>
              <div className="text-zinc-900 dark:text-zinc-600 dark:text-white/70 ml-16">home_screen.dart</div>
              <div className="text-zinc-900 dark:text-zinc-400 dark:text-white/40 ml-12">profile/</div>
              <div className="text-zinc-900 dark:text-zinc-600 dark:text-white/70 ml-16">profile_screen.dart</div>
            </div>
          </motion.div>
          
          {/* RIGHT — Feature list */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div key={i} variants={itemVariants} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#1D9E75]/10 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-[#1D9E75]" />
                  </div>
                  <div>
                    <h3 className="text-zinc-900 dark:text-white font-medium text-sm mb-1">{feature.title}</h3>
                    <p className="text-zinc-900 dark:text-zinc-500 dark:text-white/50 text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
