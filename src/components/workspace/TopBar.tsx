import { ArrowLeft, FileText, Highlighter, StickyNote, Layers, BrainCircuit, Download, Share2, HelpCircle, FilePlus, ChevronDown, MoreHorizontal, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import * as Tooltip from '@radix-ui/react-tooltip';
import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

export default function TopBar() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { docId } = useParams();
  const { user } = useAuth();
  const [docs, setDocs] = useState<{ id: string, name: string }[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { 
    docTitle, currentPage, totalPages, fileUrl,
    setPanelSizes, setShowNotes, setShowFlashcards 
  } = useWorkspace();

  useEffect(() => {
    if (user) {
      supabase
        .from('documents')
        .select('id, name')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)
        .then(({ data }) => {
          if (data) setDocs(data);
        });
    }
  }, [user]);

  const progressWidth = totalPages > 0 ? (currentPage / totalPages) * 100 : 0;

  const getButtonStyle = () => {
    return `rounded-lg p-1.5 text-sm transition-all ${
      theme === 'dark' ? 'text-white/40 hover:text-white hover:bg-white/8' : 'text-[#0D0D0D]/40 hover:text-[#0D0D0D] hover:bg-[#0D0D0D]/8'
    }`;
  };

  const TooltipButton = ({ icon: Icon, tooltip, onClick }: any) => (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button className={getButtonStyle()} onClick={onClick}>
            <Icon className="w-4 h-4" />
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content 
            className={`text-xs rounded-lg px-2 py-1 z-50 ${theme === 'dark' ? 'bg-[#1C2128] text-white/80 border border-white/10' : 'bg-white text-[#0D0D0D]/80 border border-[#0D0D0D]/10'}`} 
            sideOffset={5}
          >
            {tooltip}
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );

  return (
    <div className={`relative h-11 flex items-center justify-between px-4 border-b shrink-0 ${theme === 'dark' ? 'bg-[#0D1117] border-white/8' : 'bg-[#F5F4F0] border-[#0D0D0D]/8'}`}>
      <div className="flex items-center gap-3">
        <button 
          onClick={() => navigate('/dashboard')}
          className={`rounded-lg p-1.5 transition-all active:scale-95 duration-100 ${theme === 'dark' ? 'text-white/50 hover:text-white hover:bg-white/5' : 'text-[#0D0D0D]/50 hover:text-[#0D0D0D] hover:bg-[#0D0D0D]/5'}`}
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        
        <div className={`w-px h-4 ${theme === 'dark' ? 'bg-white/10' : 'bg-[#0D0D0D]/10'}`} />
        
        <FileText className={`w-4 h-4 hidden sm:block ${theme === 'dark' ? 'text-white/40' : 'text-[#0D0D0D]/40'}`} />
        
        {docs.length > 0 ? (
          <div className="relative flex items-center">
            <select
              className={`appearance-none bg-transparent outline-none max-w-[140px] md:max-w-[200px] truncate text-sm font-medium cursor-pointer pr-5 ${theme === 'dark' ? 'text-white/80' : 'text-[#0D0D0D]/80'}`}
              value={docId || ''}
              onChange={(e) => {
                if (e.target.value !== docId) {
                  navigate(`/workspace/${e.target.value}`);
                }
              }}
            >
              {docs.map(d => (
                <option key={d.id} value={d.id} className={theme === 'dark' ? 'bg-[#0D1117]' : 'bg-white'}>
                  {d.name}
                </option>
              ))}
            </select>
            <ChevronDown className={`w-3 h-3 absolute right-1 pointer-events-none ${theme === 'dark' ? 'text-white/40' : 'text-[#0D0D0D]/40'}`} />
          </div>
        ) : (
          <span className={`max-w-[140px] md:max-w-[200px] truncate text-sm font-medium ${theme === 'dark' ? 'text-white/80' : 'text-[#0D0D0D]/80'}`}>
            {docTitle}
          </span>
        )}
      </div>

      <div className={`flex items-center gap-2 text-xs ${theme === 'dark' ? 'text-white/30' : 'text-[#0D0D0D]/30'}`}>
        p.{currentPage} / {totalPages || 1}
      </div>

      <div className="flex items-center gap-1">
        <div className="hidden md:flex items-center gap-1">
          <TooltipButton icon={Highlighter} tooltip="Highlights" onClick={() => window.dispatchEvent(new CustomEvent('workspace:toggleHighlights'))} />
        </div>
        <TooltipButton icon={StickyNote} tooltip="Notes" onClick={() => setShowNotes(true)} />
        <div className="hidden md:flex items-center gap-1">
          <TooltipButton icon={Layers} tooltip="Flashcards" onClick={() => setShowFlashcards(true)} />
          <TooltipButton icon={FilePlus} tooltip="Upload another document" onClick={() => navigate('/upload')} />
        </div>
        
        <div className="hidden md:flex items-center gap-1">
          <TooltipButton icon={BrainCircuit} tooltip="Quiz" onClick={() => window.dispatchEvent(new CustomEvent('workspace:quiz'))} />
          <TooltipButton icon={Download} tooltip="Download PDF" onClick={() => window.open(fileUrl || '', '_blank')} />
          <TooltipButton icon={Share2} tooltip="Share" onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Link copied to clipboard!'); }} />
          <TooltipButton icon={HelpCircle} tooltip="Keyboard Shortcuts" onClick={() => alert('Keyboard Shortcuts:\\n\\n/ : Focus Chat\\nCtrl+F : Search PDF\\nCtrl+N : Notes\\nCtrl+H : Highlights\\nArrows : Change Page\\nS : Summarize\\nF : Flashcards')} />

          <div className={`w-px h-4 mx-1 ${theme === 'dark' ? 'bg-white/10' : 'bg-[#0D0D0D]/10'}`} />

          {[[70, 30], [50, 50], [30, 70]].map((preset, i) => (
            <button
              key={i}
              onClick={() => setPanelSizes(preset)}
              className={`rounded-md px-2 py-1 text-[10px] font-mono transition-colors ${
                theme === 'dark' ? 'text-white/40 hover:bg-white/8 hover:text-white' : 'text-[#0D0D0D]/40 hover:bg-[#0D0D0D]/8 hover:text-[#0D0D0D]'
              }`}
            >
              {preset[0]}/{preset[1]}
            </button>
          ))}
        </div>

        {/* Mobile Overflow Menu Button */}
        <div className="md:hidden">
          <TooltipButton icon={MoreHorizontal} tooltip="More actions" onClick={() => setMobileMenuOpen(true)} />
        </div>
      </div>

      {/* Progress Bar */}
      <div className={`absolute bottom-0 left-0 h-[1.5px] w-full z-10 ${theme === 'dark' ? 'bg-white/20' : 'bg-[#0D0D0D]/20'}`}>
        <div 
          className={`h-full transition-all duration-300 ${theme === 'dark' ? 'bg-white/60' : 'bg-[#0D0D0D]/60'}`}
          style={{ width: `${progressWidth}%` }}
        />
      </div>

      {/* Mobile Actions Bottom Sheet */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40 z-40" onClick={() => setMobileMenuOpen(false)} />
          <div className={`relative w-full rounded-t-2xl px-5 pt-2 pb-8 z-50 flex flex-col animate-fade-up ${theme === 'dark' ? 'bg-[#161B22]' : 'bg-white'}`}>
            <div className={`w-10 h-1 rounded-full mx-auto mt-3 mb-4 ${theme === 'dark' ? 'bg-white/20' : 'bg-[#0D0D0D]/20'}`} />
            
            <div className="flex flex-col">
              <button className={`flex items-center gap-4 py-4 border-b ${theme === 'dark' ? 'border-white/6' : 'border-[#0D0D0D]/6'}`} onClick={() => { setShowFlashcards(true); setMobileMenuOpen(false); }}>
                <Layers className={`w-5 h-5 ${theme === 'dark' ? 'text-white/30' : 'text-[#0D0D0D]/30'}`} />
                <span className={`text-sm ${theme === 'dark' ? 'text-white/70' : 'text-[#0D0D0D]/70'}`}>Flashcards</span>
              </button>
              <button className={`flex items-center gap-4 py-4 border-b ${theme === 'dark' ? 'border-white/6' : 'border-[#0D0D0D]/6'}`} onClick={() => { window.dispatchEvent(new CustomEvent('workspace:quiz')); setMobileMenuOpen(false); }}>
                <BrainCircuit className={`w-5 h-5 ${theme === 'dark' ? 'text-white/30' : 'text-[#0D0D0D]/30'}`} />
                <span className={`text-sm ${theme === 'dark' ? 'text-white/70' : 'text-[#0D0D0D]/70'}`}>Quiz</span>
              </button>
              <button className={`flex items-center gap-4 py-4 border-b ${theme === 'dark' ? 'border-white/6' : 'border-[#0D0D0D]/6'}`} onClick={() => { window.open(fileUrl || '', '_blank'); setMobileMenuOpen(false); }}>
                <Download className={`w-5 h-5 ${theme === 'dark' ? 'text-white/30' : 'text-[#0D0D0D]/30'}`} />
                <span className={`text-sm ${theme === 'dark' ? 'text-white/70' : 'text-[#0D0D0D]/70'}`}>Download PDF</span>
              </button>
              <button className={`flex items-center gap-4 py-4`} onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Link copied!'); setMobileMenuOpen(false); }}>
                <Share2 className={`w-5 h-5 ${theme === 'dark' ? 'text-white/30' : 'text-[#0D0D0D]/30'}`} />
                <span className={`text-sm ${theme === 'dark' ? 'text-white/70' : 'text-[#0D0D0D]/70'}`}>Share</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}