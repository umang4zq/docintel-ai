import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CheckCircle, ArrowRight, Brain, FileText, Database, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-[#0D1117] text-white' : 'bg-[#F5F4F0] text-[#0D0D0D]'}`}>
      <Navbar />
      
      <main className="flex-1 pt-32 pb-24 px-6 max-w-5xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-20">
            <h1 className="font-['Instrument_Serif'] text-5xl md:text-7xl mb-6 tracking-tight">Built for Researchers, by engineers who've seen the pain.</h1>
            <p className={`text-xl md:text-2xl max-w-3xl leading-relaxed ${theme === 'dark' ? 'text-white/70' : 'text-[#0D0D0D]/70'}`}>
              Professionals spend hours on a single document corpus — reading scanned PDFs, mapping data points, extracting tables, and building RAG pipelines from scratch. DocIntel AI turns that into minutes, with a complete Knowledge Graph and a human still firmly in the driver's seat.
            </p>
          </div>

          {/* Mission */}
          <div className="mb-24">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#1D9E75] mb-4">Mission</h2>
            <h3 className="text-3xl md:text-4xl font-semibold mb-6">Give every professional an AI document engine that respects their data.</h3>
            <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-white/60' : 'text-[#0D0D0D]/60'}`}>
              We combine advanced OCR, frontier reasoning from Kimi K2 and Nemotron Super 120B, and a custom-built processing pipeline to generate comprehensive, structured Knowledge Graphs that cite exact pages and sections. You review, refine, and query — we just remove the grind.
            </p>
          </div>

          {/* Before / With */}
          <div className="mb-24">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#1D9E75] mb-4">Before / With</h2>
            <h3 className="text-3xl md:text-4xl font-semibold mb-10">The difference on a Thursday afternoon.</h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className={`p-8 rounded-2xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-black/5 border-[#0D0D0D]/10'}`}>
                <h4 className="text-2xl font-bold mb-2">Before</h4>
                <p className={`mb-6 font-medium ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>Hours per document corpus</p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3"><div className="mt-1 w-1.5 h-1.5 rounded-full bg-current opacity-50 shrink-0" /><span>Manual reading of scanned PDFs</span></li>
                  <li className="flex items-start gap-3"><div className="mt-1 w-1.5 h-1.5 rounded-full bg-current opacity-50 shrink-0" /><span>Hunting for specific data points across 100+ pages</span></li>
                  <li className="flex items-start gap-3"><div className="mt-1 w-1.5 h-1.5 rounded-full bg-current opacity-50 shrink-0" /><span>Manually building RAG pipelines from scratch</span></li>
                  <li className="flex items-start gap-3"><div className="mt-1 w-1.5 h-1.5 rounded-full bg-current opacity-50 shrink-0" /><span>Dealing with AI hallucinations under pressure</span></li>
                </ul>
              </div>
              
              <div className={`p-8 rounded-2xl border relative overflow-hidden ${theme === 'dark' ? 'bg-[#1D9E75]/10 border-[#1D9E75]/30' : 'bg-[#1D9E75]/5 border-[#1D9E75]/30'}`}>
                <h4 className="text-2xl font-bold mb-2">With DocIntel AI</h4>
                <p className="mb-6 font-medium text-[#1D9E75]">Under 5 minutes</p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-[#1D9E75] shrink-0" /><span>OCR automatically extracts text, tables, and sections</span></li>
                  <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-[#1D9E75] shrink-0" /><span>AI structures your data into a Knowledge Graph</span></li>
                  <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-[#1D9E75] shrink-0" /><span>Cross-doc RAG state generated instantly</span></li>
                  <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-[#1D9E75] shrink-0" /><span>Every citation verified against the source document</span></li>
                </ul>
              </div>
            </div>
          </div>

          {/* What we do */}
          <div className="mb-24">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#1D9E75] mb-4">What we do</h2>
            <h3 className="text-3xl md:text-4xl font-semibold mb-4">Four steps, one clean handoff.</h3>
            <p className={`text-lg mb-10 ${theme === 'dark' ? 'text-white/60' : 'text-[#0D0D0D]/60'}`}>OCR extracts. AI structures. The pipeline assembles. Validation checks the citations. Your professional judgment does the rest.</p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <FileText className="w-8 h-8 text-[#1D9E75] mb-4" />
                <h4 className="text-xl font-bold mb-3">OCR & Extraction</h4>
                <p className={`${theme === 'dark' ? 'text-white/60' : 'text-[#0D0D0D]/60'}`}>Upload any document PDF — digital or scanned. Our OCR engine accurately extracts text, complex tables, bounding boxes, and section hierarchies.</p>
              </div>
              <div>
                <Database className="w-8 h-8 text-[#1D9E75] mb-4" />
                <h4 className="text-xl font-bold mb-3">Knowledge Graph</h4>
                <p className={`${theme === 'dark' ? 'text-white/60' : 'text-[#0D0D0D]/60'}`}>Kimi K2 processes your data into a structured Knowledge Graph, linking concepts, entities, and relationships across your entire corpus.</p>
              </div>
              <div>
                <Brain className="w-8 h-8 text-[#1D9E75] mb-4" />
                <h4 className="text-xl font-bold mb-3">Cross-Doc RAG</h4>
                <p className={`${theme === 'dark' ? 'text-white/60' : 'text-[#0D0D0D]/60'}`}>Nemotron Super 120B powers an advanced RAG engine, allowing you to ask complex questions in plain English and retrieve synthesized answers.</p>
              </div>
              <div>
                <Shield className="w-8 h-8 text-[#1D9E75] mb-4" />
                <h4 className="text-xl font-bold mb-3">Citation Validation</h4>
                <p className={`${theme === 'dark' ? 'text-white/60' : 'text-[#0D0D0D]/60'}`}>Our custom cite-validator grounds every argument directly to the source page and paragraph. No hallucinations sneak into the final output.</p>
              </div>
            </div>
          </div>

          {/* By the numbers */}
          <div className="mb-24">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#1D9E75] mb-4">By the numbers</h2>
            <h3 className="text-3xl md:text-4xl font-semibold mb-10">A pipeline built for scale.</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">100%</div>
                <div className="font-medium text-lg">Indian Made</div>
                <div className={`text-sm mt-1 ${theme === 'dark' ? 'text-white/50' : 'text-[#0D0D0D]/50'}`}>Developed natively</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">4+</div>
                <div className="font-medium text-lg">Frontier Models</div>
                <div className={`text-sm mt-1 ${theme === 'dark' ? 'text-white/50' : 'text-[#0D0D0D]/50'}`}>Kimi, Nemotron, Gemma</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">0</div>
                <div className="font-medium text-lg">Hallucinations</div>
                <div className={`text-sm mt-1 ${theme === 'dark' ? 'text-white/50' : 'text-[#0D0D0D]/50'}`}>Strict citation policy</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">1</div>
                <div className="font-medium text-lg">Clean Export</div>
                <div className={`text-sm mt-1 ${theme === 'dark' ? 'text-white/50' : 'text-[#0D0D0D]/50'}`}>ZIP file delivery</div>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="mb-24">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#1D9E75] mb-4">Built for Professionals</h2>
            <h3 className="text-3xl md:text-4xl font-semibold mb-6">Security, privacy, and Indian defaults.</h3>
            <p className={`text-lg mb-8 max-w-3xl ${theme === 'dark' ? 'text-white/60' : 'text-[#0D0D0D]/60'}`}>
              We process your complex documents out of the box, with automatic section mapping and extraction so you're never caught off guard.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
              <div className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-[#1D9E75]" /> DPDP Act 2023 compliant</div>
              <div className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-[#1D9E75]" /> AES-256 encryption at rest</div>
              <div className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-[#1D9E75]" /> Your documents never train our models</div>
              <div className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-[#1D9E75]" /> Razorpay secure payments</div>
            </div>
          </div>

          {/* CTA */}
          <div className={`p-10 md:p-16 rounded-3xl text-center border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-black/5 border-[#0D0D0D]/10'}`}>
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Ready to transform your workflow?</h3>
            <p className={`text-lg mb-8 ${theme === 'dark' ? 'text-white/60' : 'text-[#0D0D0D]/60'}`}>Start with 3 free credits. No credit card required.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-[#1D9E75] hover:bg-[#158260] text-white rounded-full font-medium transition-colors flex items-center justify-center gap-2">
                Start free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/pricing" className={`w-full sm:w-auto px-8 py-4 rounded-full font-medium transition-colors ${theme === 'dark' ? 'bg-white/10 hover:bg-white/20' : 'bg-black/10 hover:bg-black/20'}`}>
                See pricing
              </Link>
            </div>
          </div>
          
          <div className={`mt-16 text-center text-sm ${theme === 'dark' ? 'text-white/40' : 'text-[#0D0D0D]/40'}`}>
            <p>AI-generated drafts are for professional review only. DocIntel AI does not provide legal or tax advice.</p>
            <p className="mt-2">Developed by Umang Markana.</p>
          </div>

        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
}
