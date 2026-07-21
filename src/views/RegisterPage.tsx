import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';
import Footer from '../components/Footer';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strength = getPasswordStrength(password);
  const strengthLabels = ['Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-red-500', 'bg-yellow-500', 'bg-violet-400', 'bg-[#7C3AED]'];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!terms) return;
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } }
    });
    
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
          <h2 className="font-mono text-zinc-900 dark:text-white text-3xl font-bold mb-8">Join 1,200+ Researchers</h2>
          
          <div className="flex flex-col gap-4">
            {[
              "3 free credits on signup — no card needed",
              "Full Knowledge Graph ZIP on first generation",
              "Cross-doc RAG 2.x + go_router 6.x out of the box",
              "DocIntel AI — not OpenAI, not Anthropic"
            ].map((feat, i) => (
              <div key={i} className="flex items-start gap-3 text-zinc-900 dark:text-zinc-600 dark:text-white/70 text-sm">
                <CheckCircle className="text-[#A78BFA] shrink-0" size={18} />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </motion.div>
        
        <div></div> {/* Spacer */}
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 py-12 lg:p-8 relative">
        <Link to="/" className="lg:hidden absolute top-8 left-8 text-zinc-900 dark:text-zinc-500 dark:text-white/50 text-sm">← Back to home</Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <h2 className="font-mono font-bold text-zinc-900 dark:text-white text-2xl lg:text-3xl">Create your account</h2>
          <p className="text-zinc-900 dark:text-zinc-500 dark:text-white/50 text-sm mt-2 mb-8">Start with 3 free credits. No card required.</p>

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div>
              <label className="block text-zinc-900 dark:text-white/60 text-sm mb-2">Full name</label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                className="w-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-zinc-900 dark:text-white placeholder-white/20 text-sm focus:border-[#7C3AED]/50 focus:outline-none focus:bg-zinc-100 dark:bg-white/[0.07] transition-all"
                placeholder="Your full name"
                required
              />
            </div>

            <div>
              <label className="block text-zinc-900 dark:text-white/60 text-sm mb-2">Email</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  className="w-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-zinc-900 dark:text-white placeholder-white/20 text-sm focus:border-[#7C3AED]/50 focus:outline-none focus:bg-zinc-100 dark:bg-white/[0.07] transition-all"
                  placeholder="you@example.com"
                  required
                />
                {/^\S+@\S+\.\S+$/.test(email) && <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A78BFA]" size={16} />}
              </div>
            </div>

            <div>
              <label className="block text-zinc-900 dark:text-white/60 text-sm mb-2">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  className="w-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-zinc-900 dark:text-white placeholder-white/20 text-sm focus:border-[#7C3AED]/50 focus:outline-none focus:bg-zinc-100 dark:bg-white/[0.07] transition-all"
                  placeholder="Create a password"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-900 dark:text-zinc-400 dark:text-white/40 hover:text-zinc-900 dark:text-white">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 h-1">
                    {[1, 2, 3, 4].map(level => (
                      <div key={level} className={`flex-1 rounded-full transition-colors ${strength >= level ? strengthColors[strength] : 'bg-zinc-200 dark:bg-white/10'}`} />
                    ))}
                  </div>
                  <div className="text-xs text-zinc-900 dark:text-zinc-400 dark:text-white/40 mt-1">{strengthLabels[strength]}</div>
                </div>
              )}
            </div>

            <div className="flex items-start gap-3 mt-2 cursor-pointer" onClick={() => setTerms(!terms)}>
              <div className={`w-5 h-5 mt-0.5 rounded border flex items-center justify-center shrink-0 transition-colors ${terms ? 'bg-[#7C3AED] border-[#7C3AED]' : 'border-zinc-300 dark:border-white/20 bg-transparent'}`}>
                {terms && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
              </div>
              <span className="text-zinc-900 dark:text-zinc-500 dark:text-white/50 text-sm select-none">I agree to the Terms of Service and Privacy Policy</span>
            </div>

            {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 mt-2">{error}</div>}

            <button disabled={loading || !terms} type="submit" className="mt-4 w-full bg-[#7C3AED] text-zinc-900 dark:text-white font-semibold py-3.5 rounded-xl hover:bg-[#6D28D9] transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:hover:scale-100 flex justify-center items-center h-12">
              {loading ? <div className="w-5 h-5 border-2 border-zinc-300 dark:border-white/30 border-t-white rounded-full animate-spin" /> : "Create free account"}
            </button>
          </form>

          <p className="text-zinc-900 dark:text-zinc-400 dark:text-white/40 text-sm text-center mt-6">
            Already have an account? <Link to="/login" className="text-[#A78BFA] hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </motion.div>
    <Footer />
    </div>
  );
}
