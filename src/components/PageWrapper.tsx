import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import Navbar from './Navbar';
import Footer from './Footer';

interface PageWrapperProps {
  children: ReactNode;
  eyebrow: string;
  heading: ReactNode;
  subtext: ReactNode;
}

export default function PageWrapper({ children, eyebrow, heading, subtext }: PageWrapperProps) {
  const { theme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`min-h-screen ${theme === 'dark' ? 'bg-[#0D1117]' : 'bg-[#F5F4F0]'}`}
    >
      <Navbar />
      
      <section className="pt-32 pb-20 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className={`inline-flex items-center gap-2 mb-6 border rounded-full px-4 py-2 text-xs font-medium ${
            theme === 'dark' ? 'border-white/15 text-white/50' : 'border-[#0D0D0D]/15 text-[#0D0D0D]/50'
          }`}>
            <div className="w-1.5 h-1.5 rounded-full animate-pulse bg-current" />
            {eyebrow}
          </div>
          
          <h1 className={`font-['Instrument_Serif'] text-5xl md:text-7xl tracking-tight ${theme === 'dark' ? 'text-white' : 'text-[#0D0D0D]'}`}>
            {heading}
          </h1>
          
          <p className={`text-base md:text-lg max-w-2xl mx-auto mt-6 ${theme === 'dark' ? 'text-white/50' : 'text-[#0D0D0D]/50'}`}>
            {subtext}
          </p>
        </motion.div>
      </section>

      <main className="max-w-6xl mx-auto px-6 pb-32">
        {children}
      </main>

      <Footer />
    </motion.div>
  );
}
