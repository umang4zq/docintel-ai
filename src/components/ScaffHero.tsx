"use client";
import { useState, useRef, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';

export default function StudyAIHero() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(console.error);
    }
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-black font-['Inter',sans-serif]">
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260210_031346_d87182fb-b0af-4273-84d1-c6fd17d6bf0f.mp4"
      />

      {/* Navbar */}
      <nav className="relative z-20 w-full bg-transparent px-6 py-[16px] xl:px-[120px] flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <svg viewBox="0 0 256 256" width="26" height="26" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
            <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
          </svg>
          <span className="font-['JetBrains_Mono',monospace] font-bold text-zinc-900 dark:text-white text-xl">Study AI</span>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6 xl:gap-8 absolute left-1/2 -translate-x-1/2">
          <a href="#" className="font-medium text-sm text-zinc-900 dark:text-white hover:opacity-80 transition-opacity">Home</a>
          <a href="#" className="font-medium text-sm text-zinc-900 dark:text-white hover:opacity-80 transition-opacity flex items-center gap-1">
            How it works <ChevronDown size={16} />
          </a>
          <a href="#" className="font-medium text-sm text-zinc-900 dark:text-white hover:opacity-80 transition-opacity">Pricing</a>
          <a href="#" className="font-medium text-sm text-zinc-900 dark:text-white hover:opacity-80 transition-opacity">Docs</a>
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <button className="bg-white border border-[#d4d4d4] rounded-lg text-[#171717] font-medium text-sm px-4 py-2 hover:bg-gray-50 transition-colors">
            Sign in
          </button>
          <button className="bg-[#1D9E75] rounded-lg text-zinc-900 dark:text-white font-semibold text-sm px-4 py-2 shadow-sm shadow-[#1D9E75]/30 hover:bg-[#178a64] transition-colors">
            Get early access
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(true)} className="text-zinc-900 dark:text-white">
            <Menu size={22} />
          </button>
        </div>
      </nav>

      {/* Mobile Overlay Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col p-8 gap-6">
          <div className="flex justify-end">
            <button onClick={() => setIsMobileMenuOpen(false)} className="text-zinc-900 dark:text-white">
              <X size={22} />
            </button>
          </div>
          <div className="flex flex-col gap-6 mt-8">
            <a href="#" className="text-zinc-900 dark:text-white text-xl font-medium">Home</a>
            <a href="#" className="text-zinc-900 dark:text-white text-xl font-medium">How it works</a>
            <a href="#" className="text-zinc-900 dark:text-white text-xl font-medium">Pricing</a>
            <a href="#" className="text-zinc-900 dark:text-white text-xl font-medium">Docs</a>
            <a href="#" className="text-zinc-900 dark:text-white text-xl font-medium">Sign in</a>
            <a href="#" className="text-zinc-900 dark:text-white text-xl font-medium text-[#1D9E75]">Get early access</a>
          </div>
        </div>
      )}

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center text-center mt-32 px-6">
        {/* Tagline Pill */}
        <div className="bg-[rgba(29,158,117,0.15)] backdrop-blur-md border border-[rgba(29,158,117,0.4)] rounded-[10px] h-[38px] px-3 inline-flex items-center gap-2">
          <span className="bg-[#1D9E75] rounded-[6px] px-2 py-0.5 text-zinc-900 dark:text-white text-xs font-medium">AI</span>
          <span className="font-medium text-sm text-zinc-900 dark:text-white">Powered by DocIntel AI — Kimi K2 · Nemotron OCR</span>
        </div>

        {/* Headline */}
        <h1 className="font-['JetBrains_Mono',monospace] text-zinc-900 dark:text-white text-5xl md:text-[96px] leading-[1.1] tracking-tighter mt-6">
          <span className="block">Screenshot to Flutter,</span>
          <em className="italic font-medium">instantly.</em>
        </h1>

        {/* Subtext */}
        <p className="font-normal text-[18px] text-zinc-900 dark:text-zinc-600 dark:text-white/70 max-w-[662px] mt-6 leading-relaxed">
          Upload your PDF documents, set your design tokens, and download a complete Knowledge Graph — Cross-doc RAG state, go_router navigation, and a production folder structure. Powered entirely by DocIntel AI.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-row gap-3 mt-8 flex-wrap justify-center w-full">
          <button className="bg-[#1D9E75] hover:bg-[#178a64] rounded-[10px] px-6 py-3 font-medium text-base text-zinc-900 dark:text-white transition-colors duration-200">
            Generate your first project
          </button>
          <button className="bg-white dark:bg-[#0D1117] hover:bg-[#161B22] rounded-[10px] px-6 py-3 font-medium text-base text-[#f6f7f9] border border-zinc-200 dark:border-white/10 transition-colors duration-200">
            See how it works
          </button>
        </div>
      </div>
    </div>
  );
}
