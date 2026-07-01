import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import Footer from '../Footer';
import ThemeToggle from '../ThemeToggle';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function PageLayout({ children, showFooter = true }: {
  children: React.ReactNode;
  showFooter?: boolean;
}) {
  const { theme } = useTheme();
  
  return (
    <motion.div
      data-theme={theme}
      className={`w-full min-h-screen flex flex-col ${theme === 'dark' ? 'bg-black text-white' : 'bg-[#F5F4F0] text-[#0D0D0D]'}`}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
      {showFooter && <Footer />}
      <ThemeToggle />
    </motion.div>
  );
}
