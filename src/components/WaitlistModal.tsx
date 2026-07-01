import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useState } from 'react';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setEmail('');
      }, 2000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white dark:bg-[#0D1117] border border-zinc-200 dark:border-white/10 rounded-3xl p-8 w-full max-w-md pointer-events-auto relative shadow-2xl"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-zinc-900 dark:text-zinc-500 dark:text-white/50 hover:text-zinc-900 dark:text-white transition-colors"
              >
                <X size={20} />
              </button>

              {!submitted ? (
                <>
                  <div className="mb-8">
                    <h3 className="font-mono-display font-bold text-zinc-900 dark:text-white text-2xl mb-2">Get Early Access</h3>
                    <p className="text-zinc-900 dark:text-zinc-500 dark:text-white/50 text-sm">
                      Join the waitlist to be among the first to generate production-ready Flutter apps with Study AI.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                      <label htmlFor="email" className="sr-only">Email address</label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="w-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-zinc-900 dark:text-white placeholder:text-zinc-900 dark:text-zinc-400 dark:text-white/30 focus:outline-none focus:border-[#1D9E75]/50 focus:ring-1 focus:ring-[#1D9E75]/50 transition-all"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-[#1D9E75] hover:bg-[#178a64] text-zinc-900 dark:text-white font-medium rounded-xl px-4 py-3 transition-colors flex items-center justify-center gap-2"
                    >
                      Join Waitlist
                    </button>
                  </form>
                </>
              ) : (
                <div className="py-12 flex flex-col items-center text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="w-16 h-16 rounded-full bg-[#1D9E75]/10 flex items-center justify-center mb-6"
                  >
                    <svg className="w-8 h-8 text-[#1D9E75]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                  <h3 className="font-mono-display font-bold text-zinc-900 dark:text-white text-xl mb-2">You're on the list!</h3>
                  <p className="text-zinc-900 dark:text-zinc-500 dark:text-white/50 text-sm">
                    We'll email you as soon as your spot opens up.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
