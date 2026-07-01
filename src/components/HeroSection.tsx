import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, ArrowRight, GitBranch, Globe } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function HeroSection() {
  const { theme } = useTheme();

  return (
    <section className="min-h-screen overflow-hidden relative flex flex-col pt-24 pb-12">
      <video
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_171521_25968ba2-b594-4b32-aab7-f6b69398a6fa.mp4"
        className="absolute inset-0 w-full h-full object-cover object-bottom"
        muted
        playsInline
        preload="auto"
        autoPlay
        loop
      />
      
      {theme === 'light' && (
        <div className="absolute inset-0 z-[1] bg-[#F5F4F0]/40 pointer-events-none" />
      )}

      {/* NAVBAR */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-6 pointer-events-auto"
      >
        <div className="liquid-glass rounded-full max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <div className={`flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-[#0D0D0D]'}`}>
              <FileText size={24} />
              <span className="font-semibold text-lg">DocIntel</span>
            </div>
            
            <div className={`hidden md:flex gap-8 ml-8 text-sm font-medium ${theme === 'dark' ? 'text-white/80' : 'text-[#0D0D0D]/80'}`}>
              <a href="#" className={`transition-colors ${theme === 'dark' ? 'hover:text-white' : 'hover:text-[#0D0D0D]'}`}>Pipeline</a>
              <a href="#" className={`transition-colors ${theme === 'dark' ? 'hover:text-white' : 'hover:text-[#0D0D0D]'}`}>Capabilities</a>
              <a href="#" className={`transition-colors ${theme === 'dark' ? 'hover:text-white' : 'hover:text-[#0D0D0D]'}`}>Pricing</a>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className={`liquid-glass rounded-full px-6 py-2 text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-[#0D0D0D]'}`}>
              Try free
            </button>
          </div>
        </div>
      </motion.nav>

      {/* HERO CONTENT */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center md:-translate-y-[10%]">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className={`font-['Instrument_Serif'] text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight ${theme === 'dark' ? 'text-white' : 'text-[#0D0D0D]'}`}
        >
          Understand every document. <br className="hidden md:block"/> <em className="italic">Instantly.</em>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className={`mt-6 text-base md:text-lg leading-relaxed px-4 max-w-2xl ${theme === 'dark' ? 'text-white/70' : 'text-[#0D0D0D]/70'}`}
        >
          Turn PDFs, scanned files, handwritten notes, and mixed-language documents into a searchable intelligence layer.
          <br /><br />
          DocIntel uses DocIntel AI models to extract, structure, connect, and reason across your entire document corpus, so you can ask questions in plain English and get grounded answers with exact citations.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={`mt-8 liquid-glass rounded-full px-4 py-2 flex flex-col sm:flex-row items-center gap-2 text-[10px] sm:text-xs font-medium w-full max-w-none sm:w-auto ${theme === 'dark' ? 'text-white/70' : 'text-[#0D0D0D]/70'}`}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <strong className={`${theme === 'dark' ? 'text-white' : 'text-[#0D0D0D]'}`}>Powered by DocIntel AI</strong>
          </div>
          <span className="hidden sm:inline">•</span>
          <span>Nemotron OCR • Nemotron Super 120B • Kimi K2</span>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto"
        >
          <button className={`w-full sm:w-auto rounded-full px-8 py-3 text-sm font-medium transition-transform hover:scale-105 active:scale-95 ${theme === 'dark' ? 'bg-white text-black' : 'bg-[#0D0D0D] text-white'}`}>
            Try Free
          </button>
          <button className={`w-full sm:w-auto liquid-glass rounded-full px-8 py-3 text-sm font-medium transition-colors ${theme === 'dark' ? 'text-white hover:bg-white/5' : 'text-[#0D0D0D] hover:bg-black/5'}`}>
            See Pipeline
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className={`mt-12 text-sm max-w-xl mx-auto p-4 card-plain ${theme === 'dark' ? 'bg-[#161B22] border border-white/8 text-white/60' : 'bg-white border border-[#0D0D0D]/8 text-[#0D0D0D]/60'} rounded-2xl`}
        >
          <div className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-[#0D0D0D]'}`}>Upload anything</div>
          <p>PDF • DOCX • Scanned images • Handwritten notes • Mixed-language files</p>
          <div className="w-full h-px my-3 bg-white/10 dark:bg-[#0D0D0D]/10" />
          <p><strong>Every answer includes exact citations:</strong> <code className="bg-black/20 dark:bg-white/10 px-2 py-1 rounded">{"[Document Name, Page X]"}</code></p>
        </motion.div>

      </div>
    </section>
  );
}
