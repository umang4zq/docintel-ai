import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { theme } = useTheme();
  const { user } = useAuth();

  const links = [
    { label: 'How it works', path: '/how-it-works' },
    { label: 'About', path: '/about' },
    { label: 'Capabilities', path: '/capabilities' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'Use Cases', path: '/use-cases' }
  ];

  const getLinkStyle = (path: string) => {
    const isActive = location.pathname === path;
    if (theme === 'dark') {
      return isActive ? 'text-white font-medium' : 'text-white/60 hover:text-white transition-colors';
    } else {
      return isActive ? 'text-[#0D0D0D] font-medium' : 'text-[#0D0D0D]/60 hover:text-[#0D0D0D] transition-colors';
    }
  };

  return (
    <>
      <div className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl z-40 pointer-events-none">
        <nav className={`pointer-events-auto animate-fade-down w-full flex flex-row items-center justify-between px-5 sm:px-8 py-3 sm:py-4 liquid-glass rounded-full border transition-colors ${
          theme === 'dark' ? 'border-white/10' : 'border-[#0D0D0D]/10'
        }`}>
        <Link to="/" className={`flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-[#0D0D0D]'}`}>
          <Logo className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="font-semibold tracking-tight">DocIntel</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-[13px]">
          {links.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={getLinkStyle(link.path)}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <Link to="/dashboard" className={`hidden md:inline-flex text-[13px] font-medium px-4 sm:px-5 py-2 rounded-full transition-colors ${theme === 'dark' ? 'bg-white text-black hover:bg-white/90' : 'bg-[#0D0D0D] text-white hover:bg-[#0D0D0D]/90'}`}>
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className={`hidden md:inline-flex text-[13px] transition-colors ${theme === 'dark' ? 'text-white/80 hover:text-white' : 'text-[#0D0D0D]/80 hover:text-[#0D0D0D]'}`}>
                Sign in
              </Link>
              <Link to="/register" className={`hidden md:inline-flex text-[13px] font-medium px-4 sm:px-5 py-2 rounded-full transition-colors ${theme === 'dark' ? 'bg-white text-black hover:bg-white/90' : 'bg-[#0D0D0D] text-white hover:bg-[#0D0D0D]/90'}`}>
                Try Free
              </Link>
            </>
          )}
          <button 
            className={`md:hidden flex items-center justify-center w-9 h-9 rounded-full transition-colors ${theme === 'dark' ? 'text-white hover:bg-white/10' : 'text-[#0D0D0D] hover:bg-[#0D0D0D]/10'}`}
            onClick={() => setIsOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
        </nav>
      </div>

      {isOpen && (
        <div className={`md:hidden fixed inset-0 z-50 flex flex-col gap-6 p-8 pt-20 animate-fade-down ${theme === 'dark' ? 'bg-[#0D1117]/98 text-white' : 'bg-[#F5F4F0]/98 text-[#0D0D0D]'} backdrop-blur-md`}>
          <button 
            className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/10"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex flex-col gap-6 mt-8">
            {links.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                className="text-2xl font-medium"
                onClick={() => {
                  setIsOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-auto flex flex-col gap-4">
            {user ? (
              <Link to="/dashboard" className={`w-full text-center py-4 rounded-full font-medium ${theme === 'dark' ? 'bg-white text-black' : 'bg-[#0D0D0D] text-white'}`} onClick={() => setIsOpen(false)}>Go to Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="w-full text-center py-4 font-medium" onClick={() => setIsOpen(false)}>Sign in</Link>
                <Link to="/register" className={`w-full text-center py-4 rounded-full font-medium ${theme === 'dark' ? 'bg-white text-black' : 'bg-[#0D0D0D] text-white'}`} onClick={() => setIsOpen(false)}>Try Free</Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
