import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Logo from './Logo';

export default function Footer() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isDark = theme === 'dark';

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const linkClass = `text-sm transition-colors w-fit cursor-pointer ${isDark ? 'text-white/50 hover:text-white' : 'text-[#0D0D0D]/50 hover:text-[#0D0D0D]'}`;
  const headingClass = `text-xs uppercase tracking-[0.15em] mb-4 ${isDark ? 'text-white/30' : 'text-[#0D0D0D]/30'}`;

  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className={`border-t py-16 px-6 ${isDark ? 'bg-black border-white/8' : 'bg-[#F5F4F0] border-[#0D0D0D]/8'}`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2">
              <Logo className={`w-6 h-6 ${isDark ? 'text-white' : 'text-[#0D0D0D]'}`} />
              <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-[#0D0D0D]'}`}>DocIntel</span>
            </Link>
            <p className={`mt-4 text-sm leading-relaxed max-w-[200px] ${isDark ? 'text-white/40' : 'text-[#0D0D0D]/40'}`}>
              Document Intelligence.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 border border-[#1D9E75]/30 rounded-full px-3 py-1.5 bg-[#1D9E75]/5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#1D9E75]"></div>
              <span className={`text-[11px] ${isDark ? 'text-white/40' : 'text-[#0D0D0D]/40'}`}>100% Indian Made</span>
            </div>
          </div>
          
          {/* Product */}
          <div>
            <h4 className={headingClass}>Product</h4>
            <div className="flex flex-col gap-2.5">
              <button onClick={() => scrollToSection('pipeline')} className={linkClass}>How it works</button>
              <Link to="/about" className={linkClass}>About</Link>
              <button onClick={() => scrollToSection('pricing')} className={linkClass}>Pricing</button>
              <button onClick={() => scrollToSection('capabilities')} className={linkClass}>Capabilities</button>
              <button onClick={() => scrollToSection('use-cases')} className={linkClass}>Use Cases</button>
            </div>
          </div>
          
          {/* Stack */}
          <div>
            <h4 className={headingClass}>Stack</h4>
            <div className="flex flex-col gap-2.5">
              <span className={linkClass}>Kimi K2</span>
              <span className={linkClass}>Nemotron OCR</span>
              <span className={linkClass}>Nemotron Super 120B</span>
              <span className={linkClass}>Gemma 4 31B</span>
              <span className={linkClass}>Supabase</span>
              <span className={linkClass}>React + Vite</span>
            </div>
          </div>
          
          {/* Legal + Account */}
          <div>
            <h4 className={headingClass}>Account</h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/login" className={linkClass}>Sign in</Link>
              <Link to="/register" className={linkClass}>Create account</Link>
              <Link to="/dashboard" className={linkClass}>Dashboard</Link>
            </div>
          </div>
        </div>
        
        {/* Bottom */}
        <div className={`mt-12 pt-8 border-t flex justify-between items-center flex-wrap gap-4 ${isDark ? 'border-white/8' : 'border-[#0D0D0D]/8'}`}>
          <p className={`text-xs ${isDark ? 'text-white/25' : 'text-[#0D0D0D]/25'}`}>
            © 2026 DocIntel.
          </p>
          <p className={`text-xs ${isDark ? 'text-white/25' : 'text-[#0D0D0D]/25'}`}>
            Developed by Umang Markana.
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
