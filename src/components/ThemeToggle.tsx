import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 liquid-glass rounded-full p-3 text-white data-[theme=light]:text-[#0D0D0D]"
    >
      {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} className="text-[#0D0D0D]" />}
    </motion.button>
  );
}
