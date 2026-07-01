import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FileText, LayoutDashboard, Upload, FolderOpen, BookmarkCheck, StickyNote, CreditCard, Settings, Sun, Moon, LogOut, Bell, ChevronDown, ChevronRight, Menu
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import Footer from '../Footer';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [documents, setDocuments] = useState<any[]>([]);
  const [docsExpanded, setDocsExpanded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchSidebarDocs() {
      if (!user) return;
      const { data } = await supabase
        .from('documents')
        .select('id, name')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5); // Only show top 5 in sidebar
      if (data) setDocuments(data);
    }
    fetchSidebarDocs();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {}
    navigate('/');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Upload, label: 'Upload PDF', path: '/upload' },
    { icon: FolderOpen, label: 'My Documents', path: '/documents' },
    { icon: BookmarkCheck, label: 'Saved PDFs', path: '/saved' },
    { icon: StickyNote, label: 'My Notes', path: '/notes' },
    { icon: CreditCard, label: 'Credits', path: '/pricing' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const firstName = user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'User';

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  };

  return (
    <div className={`flex w-full min-h-screen ${theme === 'dark' ? 'bg-[#080B10]' : 'bg-[#EFEDE8]'}`}>
      
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/40 z-30" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`w-56 fixed left-0 top-0 h-full flex flex-col z-40 transition-transform duration-300 lg:translate-x-0 ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } ${theme === 'dark' ? 'bg-[#0D1117] border-r border-white/6' : 'bg-[#F5F4F0] border-r border-[#0D0D0D]/6'}`}>
        {/* Top */}
        <div className={`p-4 border-b ${theme === 'dark' ? 'border-white/6' : 'border-[#0D0D0D]/6'}`}>
          <div className="flex items-center gap-2">
            <FileText className={`w-5 h-5 ${theme === 'dark' ? 'text-white' : 'text-[#0D0D0D]'}`} />
            <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-[#0D0D0D]'}`}>DocIntel</span>
          </div>
        </div>

        {/* Nav Items */}
        <div className="flex-1 p-2 flex flex-col gap-0.5 mt-2 overflow-y-auto">
          {navItems.map(item => {
            if (item.label === 'My Documents') {
              return (
                <div key={item.path} className="flex flex-col">
                  <div
                    onClick={() => setDocsExpanded(!docsExpanded)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-sm transition-all duration-150 ${
                      theme === 'dark' ? 'text-white/45 hover:text-white/80 hover:bg-white/4' : 'text-[#0D0D0D]/45 hover:text-[#0D0D0D]/80 hover:bg-[#0D0D0D]/4'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="flex-1">{item.label}</span>
                    {docsExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  </div>
                  
                  {/* Collapsible Documents List */}
                  {docsExpanded && (
                    <div className={`flex flex-col ml-8 mt-1 gap-1 border-l pl-2 ${theme === 'dark' ? 'border-white/10' : 'border-[#0D0D0D]/10'}`}>
                      {documents.length === 0 ? (
                        <div className={`text-xs py-1 ${theme === 'dark' ? 'text-white/30' : 'text-[#0D0D0D]/30'}`}>No docs yet</div>
                      ) : (
                        documents.map(doc => (
                          <div 
                            key={doc.id}
                            onClick={() => navigate(`/workspace/${doc.id}`)}
                            className={`text-xs truncate cursor-pointer py-1.5 px-2 rounded-lg transition-colors ${
                              theme === 'dark' ? 'text-white/50 hover:text-white/90 hover:bg-white/5' : 'text-[#0D0D0D]/50 hover:text-[#0D0D0D]/90 hover:bg-[#0D0D0D]/5'
                            }`}
                          >
                            {doc.name}
                          </div>
                        ))
                      )}
                      <div 
                        onClick={() => navigate('/documents')}
                        className={`text-[10px] font-medium cursor-pointer py-1.5 px-2 mt-1 rounded-lg transition-colors ${
                          theme === 'dark' ? 'text-emerald-400/70 hover:text-emerald-400 hover:bg-white/5' : 'text-emerald-600/70 hover:text-emerald-600 hover:bg-[#0D0D0D]/5'
                        }`}
                      >
                        View all pages →
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-sm transition-all duration-150 ${
                  isActive 
                    ? (theme === 'dark' ? 'bg-white/8 text-white font-medium border-l-2 border-white/40' : 'bg-[#0D0D0D]/8 text-[#0D0D0D] font-medium border-l-2 border-[#0D0D0D]/40')
                    : (theme === 'dark' ? 'text-white/45 hover:text-white/80 hover:bg-white/4 border-l-2 border-transparent' : 'text-[#0D0D0D]/45 hover:text-[#0D0D0D]/80 hover:bg-[#0D0D0D]/4 border-l-2 border-transparent')
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Bottom */}
        <div className={`p-3 border-t mt-auto ${theme === 'dark' ? 'border-white/6' : 'border-[#0D0D0D]/6'}`}>
          {/* Theme Toggle */}
          <div className={`flex items-center justify-between px-3 py-2 rounded-xl mb-3 ${theme === 'dark' ? 'bg-white/4 border border-white/6' : 'bg-[#0D0D0D]/4 border border-[#0D0D0D]/6'}`}>
            <div className="flex items-center gap-2">
              {theme === 'dark' ? (
                <Moon className="w-3.5 h-3.5 text-white/40" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-[#0D0D0D]/40" />
              )}
              <span className={`text-xs ${theme === 'dark' ? 'text-white/40' : 'text-[#0D0D0D]/40'}`}>Theme</span>
            </div>
            <div 
              className={`w-8 h-4 rounded-full cursor-pointer relative ${theme === 'dark' ? 'bg-white/20' : 'bg-white/8'}`}
              onClick={toggleTheme}
            >
              <div className={`absolute w-3 h-3 rounded-full bg-white top-0.5 transition-all duration-200 ${theme === 'dark' ? 'left-4' : 'left-0.5'}`} />
            </div>
          </div>

          {/* User Card */}
          <div 
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-[#0D0D0D]/5'}`}
            onClick={handleSignOut}
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${theme === 'dark' ? 'bg-white/10 text-white/60' : 'bg-[#0D0D0D]/10 text-[#0D0D0D]/60'}`}>
              {firstName.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0">
              <span className={`text-xs font-medium truncate ${theme === 'dark' ? 'text-white/70' : 'text-[#0D0D0D]/70'}`}>{firstName}</span>
              <span className={`text-[10px] truncate ${theme === 'dark' ? 'text-white/30' : 'text-[#0D0D0D]/30'}`}>3 credits remaining</span>
            </div>
            <LogOut className={`ml-auto size-3.5 shrink-0 ${theme === 'dark' ? 'text-white/20 hover:text-white/50' : 'text-[#0D0D0D]/20 hover:text-[#0D0D0D]/50'}`} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-56 flex-1 min-h-screen flex flex-col w-full">
        {/* Top Bar */}
        <div className={`h-12 flex items-center justify-between px-6 border-b ${theme === 'dark' ? 'bg-[#080B10] border-white/6' : 'bg-[#EFEDE8] border-[#0D0D0D]/6'}`}>
          <div className="flex items-center gap-3">
            <button 
              className={`lg:hidden rounded-lg p-1 ${theme === 'dark' ? 'text-white hover:bg-white/10' : 'text-[#0D0D0D] hover:bg-[#0D0D0D]/10'}`}
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className={`text-sm font-medium ${theme === 'dark' ? 'text-white/60' : 'text-[#0D0D0D]/60'}`}>
              Good {getGreeting()}, {firstName} 👋
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className={`rounded-lg p-1.5 ${theme === 'dark' ? 'text-white/30 hover:text-white/60 hover:bg-white/5' : 'text-[#0D0D0D]/30 hover:text-[#0D0D0D]/60 hover:bg-[#0D0D0D]/5'}`}>
              <Bell className="w-4 h-4" />
            </button>
            <button 
              onClick={() => navigate('/upload')}
              className={`rounded-xl px-4 py-1.5 text-sm font-medium flex items-center ${theme === 'dark' ? 'bg-white text-black hover:bg-white/90' : 'bg-[#0D0D0D] text-white hover:bg-[#0D0D0D]/90'}`}
            >
              <Upload className="w-3.5 h-3.5 mr-1.5" />
              Upload PDF
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 flex flex-col gap-6 flex-1">
          {children}
        </div>
        
        {/* Added Footer to Dashboard */}
        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    </div>
  );
}
