import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useWorkspace } from '../../context/WorkspaceContext';

export default function NotesPanel() {
  const { theme } = useTheme();
  const { notes, setNotes, setShowNotes, sendToChat, scrollToPage } = useWorkspace();

  return (
    <>
      <div 
        className="fixed inset-0 z-30 bg-black/20"
        onClick={() => setShowNotes(false)}
      />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed inset-x-0 bottom-0 md:inset-auto md:right-0 md:top-0 h-[75vh] md:h-full w-full md:w-80 z-40 flex flex-col rounded-t-3xl md:rounded-none ${
          theme === 'dark' ? 'bg-[#161B22] border-t md:border-l border-white/10' : 'bg-white border-t md:border-l border-[#0D0D0D]/10'
        }`}
      >
        <div className={`md:hidden w-10 h-1 rounded-full mx-auto mt-3 shrink-0 ${theme === 'dark' ? 'bg-white/20' : 'bg-[#0D0D0D]/20'}`} />
        <div className={`h-12 flex flex-shrink-0 items-center justify-between px-4 border-b ${theme === 'dark' ? 'border-white/10' : 'border-[#0D0D0D]/10'}`}>
          <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-[#0D0D0D]'}`}>My Notes</span>
          <button 
            onClick={() => setShowNotes(false)}
            className={`p-1 rounded-md ${theme === 'dark' ? 'hover:bg-white/10 text-white/50' : 'hover:bg-[#0D0D0D]/10 text-[#0D0D0D]/50'}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
          {notes.length === 0 ? (
            <div className={`text-center mt-10 text-sm ${theme === 'dark' ? 'text-white/20' : 'text-[#0D0D0D]/20'}`}>
              No notes yet
            </div>
          ) : (
            notes.map((note) => (
              <div 
                key={note.id}
                className={`rounded-xl p-3 border ${theme === 'dark' ? 'bg-white/[0.03] border-white/6' : 'bg-[#0D0D0D]/[0.03] border-[#0D0D0D]/6'}`}
              >
                <div className="flex justify-between items-start">
                  <div className={`text-[10px] font-mono rounded-full px-2 py-0.5 ${theme === 'dark' ? 'bg-white/8 text-white/40' : 'bg-[#0D0D0D]/8 text-[#0D0D0D]/40'}`}>
                    p.{note.pageRef}
                  </div>
                  <button 
                    onClick={() => setNotes(notes.filter(n => n.id !== note.id))}
                    className={`hover:text-red-400 ${theme === 'dark' ? 'text-white/20' : 'text-[#0D0D0D]/20'}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                
                <div 
                  contentEditable
                  suppressContentEditableWarning
                  className={`text-xs leading-relaxed mt-2 outline-none ${theme === 'dark' ? 'text-white/70' : 'text-[#0D0D0D]/70'}`}
                  onBlur={(e) => {
                    const newText = e.currentTarget.textContent || '';
                    if (newText !== note.text) {
                      setNotes(notes.map(n => n.id === note.id ? { ...n, text: newText } : n));
                    }
                  }}
                >
                  {note.text}
                </div>

                <div className="flex gap-2 mt-2">
                  <button 
                    onClick={() => { setShowNotes(false); sendToChat("Tell me more about: " + note.text); }}
                    className={`text-[10px] transition-colors ${theme === 'dark' ? 'text-white/30 hover:text-white/60' : 'text-[#0D0D0D]/30 hover:text-[#0D0D0D]/60'}`}
                  >
                    Ask AI
                  </button>
                  <button 
                    onClick={() => scrollToPage(note.pageRef)}
                    className={`text-[10px] transition-colors ${theme === 'dark' ? 'text-white/30 hover:text-white/60' : 'text-[#0D0D0D]/30 hover:text-[#0D0D0D]/60'}`}
                  >
                    Jump to page
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className={`shrink-0 p-3 border-t ${theme === 'dark' ? 'border-white/10' : 'border-[#0D0D0D]/10'}`}>
          <button className={`w-full text-sm rounded-xl py-2 border transition-colors ${
            theme === 'dark' ? 'border-white/10 text-white/50 hover:bg-white/5' : 'border-[#0D0D0D]/10 text-[#0D0D0D]/50 hover:bg-[#0D0D0D]/5'
          }`}>
            Export notes
          </button>
        </div>
      </motion.div>
    </>
  );
}
