import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Eye, EyeOff } from 'lucide-react';
import Footer from '../components/Footer';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex text-zinc-900 dark:text-white bg-white dark:bg-[#0D1117]">
      
      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-1/2 bg-zinc-50 dark:bg-[#080808] border-r border-zinc-200 dark:border-white/8 flex-col justify-between p-16">
        <div className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 12L12 22L22 12L12 2Z" fill="white" className="text-zinc-900 dark:text-white"/>
          </svg>
          <span className="font-mono font-bold text-xl">Study AI</span>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="max-w-md">
          <p className="font-mono text-zinc-900 dark:text-zinc-700 dark:text-white/80 text-3xl leading-[1.2] tracking-tight">
            Upload a document.<br/>
            Get a Knowledge Graph.<br/>
            That's actually it.
          </p>
          <div className="flex gap-3 mt-6 flex-wrap">
            <span className="bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-full px-4 py-2 text-sm">3 free credits</span>
            <span className="bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-full px-4 py-2 text-sm">~45s per gen</span>
            <span className="bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-full px-4 py-2 text-sm">Flutter 3.x</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/8 rounded-2xl p-5 max-w-md">
          <p className="text-zinc-900 dark:text-zinc-600 dark:text-white/70 text-sm leading-relaxed mb-4">"Study AI cut my boilerplate time from 2 hours to 45 seconds. The Cross-doc RAG setup alone is worth it."</p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">PK</div>
            <div className="text-sm font-medium">— Priya K., Researcher</div>
          </div>
        </motion.div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 py-12 lg:p-8 relative">
        {/* Mobile back link */}
        <Link to="/" className="lg:hidden absolute top-8 left-8 text-zinc-900 dark:text-zinc-500 dark:text-white/50 text-sm">← Back to home</Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <h2 className="font-mono font-bold text-zinc-900 dark:text-white text-2xl lg:text-3xl">Welcome back</h2>
          <p className="text-zinc-900 dark:text-zinc-500 dark:text-white/50 text-sm mt-2 mb-8">Sign in to your Study AI account</p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-zinc-900 dark:text-white/60 text-sm mb-2">Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="w-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-zinc-900 dark:text-white placeholder-white/20 text-sm focus:border-[#7C3AED]/50 focus:outline-none focus:bg-zinc-100 dark:bg-white/[0.07] transition-all"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-zinc-900 dark:text-white/60 text-sm mb-2">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  className="w-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-zinc-900 dark:text-white placeholder-white/20 text-sm focus:border-[#7C3AED]/50 focus:outline-none focus:bg-zinc-100 dark:bg-white/[0.07] transition-all"
                  placeholder="••••••••"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-900 dark:text-zinc-400 dark:text-white/40 hover:text-zinc-900 dark:text-white">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="text-right mt-2"><a href="#" className="text-[#A78BFA] text-xs hover:underline">Forgot password?</a></div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 mt-2">{error}</div>
            )}

            <button disabled={loading} type="submit" className="mt-4 w-full bg-[#7C3AED] text-zinc-900 dark:text-white font-semibold py-3.5 rounded-xl hover:bg-[#6D28D9] transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:hover:scale-100 flex justify-center items-center h-12">
              {loading ? <div className="w-5 h-5 border-2 border-zinc-300 dark:border-white/30 border-t-white rounded-full animate-spin" /> : "Sign in to Study AI"}
            </button>
          </form>

          <p className="text-zinc-900 dark:text-zinc-400 dark:text-white/40 text-sm text-center mt-6">
            Don't have an account? <Link to="/register" className="text-[#A78BFA] hover:underline">Create one free</Link>
          </p>
        </motion.div>
      </div>

    </motion.div>
    <Footer />
    </div>
  );
}
