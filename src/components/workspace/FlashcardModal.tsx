import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useWorkspace } from '../../context/WorkspaceContext';

export default function FlashcardModal() {
  const { theme } = useTheme();
  const { setShowFlashcards } = useWorkspace();
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const flashcards = [
    { q: "What is RAG?", a: "Retrieval Augmented Generation — combining semantic search with LLM generation.", pageRef: 1 },
    { q: "What model handles OCR in DocIntel?", a: "nvidia/nemotron-ocr processes each page in parallel.", pageRef: 2 },
    { q: "What is pgvector?", a: "A PostgreSQL extension for storing and querying vector embeddings.", pageRef: 3 },
    { q: "What does Kimi K2 do?", a: "Orchestrates multi-turn chat sessions with tool calling capability.", pageRef: 4 },
    { q: "What is a knowledge graph?", a: "A network of entities and their typed relationships extracted from documents.", pageRef: 5 }
  ];

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCard(c => Math.min(flashcards.length - 1, c + 1));
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCard(c => Math.max(0, c - 1));
    }, 150);
  };

  const card = flashcards[currentCard];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowFlashcards(false)} />
      
      <div className={`w-full h-full md:h-auto md:max-w-lg mx-0 md:mx-4 relative z-10 md:rounded-2xl p-6 md:p-8 border-0 md:border flex flex-col ${
        theme === 'dark' ? 'bg-[#161B22] md:border-white/10' : 'bg-white md:border-[#0D0D0D]/10'
      }`}>
        <div className="flex items-center justify-between">
          <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-[#0D0D0D]'}`}>Flashcards</span>
          <button 
            onClick={() => setShowFlashcards(false)}
            className={`p-1 rounded-md ${theme === 'dark' ? 'hover:bg-white/10 text-white/50' : 'hover:bg-[#0D0D0D]/10 text-[#0D0D0D]/50'}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className={`text-xs text-center mt-4 ${theme === 'dark' ? 'text-white/30' : 'text-[#0D0D0D]/30'}`}>
          Card {currentCard + 1} of {flashcards.length}
        </div>

        <div 
          className="w-full flex-1 md:flex-none aspect-auto md:aspect-[3/2] cursor-pointer mt-4 relative [perspective:1000px]"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className={`w-full h-full relative transition-transform duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
            
            {/* Front */}
            <div className={`absolute inset-0 [backface-visibility:hidden] flex flex-col items-center justify-center p-6 text-center rounded-xl border ${
              theme === 'dark' ? 'bg-white/[0.03] border-white/8' : 'bg-[#0D0D0D]/[0.03] border-[#0D0D0D]/8'
            }`}>
              <div className={`text-base leading-relaxed ${theme === 'dark' ? 'text-white' : 'text-[#0D0D0D]'}`}>
                {card.q}
              </div>
              <div className={`absolute bottom-4 text-xs ${theme === 'dark' ? 'text-white/20' : 'text-[#0D0D0D]/20'}`}>
                Tap to reveal
              </div>
            </div>

            {/* Back */}
            <div className={`absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col items-center justify-center p-6 text-center gap-3 rounded-xl border ${
              theme === 'dark' ? 'bg-white/6 border-white/12' : 'bg-[#0D0D0D]/6 border-[#0D0D0D]/12'
            }`}>
              <div className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-white' : 'text-[#0D0D0D]'}`}>
                {card.a}
              </div>
              <div className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${theme === 'dark' ? 'bg-white/10 text-white/50' : 'bg-[#0D0D0D]/10 text-[#0D0D0D]/50'}`}>
                p.{card.pageRef}
              </div>
            </div>

          </div>
        </div>

        <div className="flex justify-between items-center mt-auto md:mt-6 pt-6">
          <button 
            onClick={handlePrev}
            disabled={currentCard === 0}
            className={`rounded-xl p-2 border ${
              theme === 'dark' ? 'border-white/10 text-white/50 disabled:opacity-30' : 'border-[#0D0D0D]/10 text-[#0D0D0D]/50 disabled:opacity-30'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex gap-2">
            <button 
              onClick={handleNext}
              className="text-sm text-emerald-400 border border-emerald-500/20 rounded-xl px-4 py-2 hover:bg-emerald-500/10 transition-colors"
            >
              Mark known
            </button>
            <button 
              onClick={handleNext}
              className={`text-sm rounded-xl px-4 py-2 border transition-colors ${
                theme === 'dark' ? 'text-white/40 border-white/10 hover:bg-white/5' : 'text-[#0D0D0D]/40 border-[#0D0D0D]/10 hover:bg-[#0D0D0D]/5'
              }`}
            >
              Study again
            </button>
          </div>

          <button 
            onClick={handleNext}
            disabled={currentCard === flashcards.length - 1}
            className={`rounded-xl p-2 border ${
              theme === 'dark' ? 'border-white/10 text-white/50 disabled:opacity-30' : 'border-[#0D0D0D]/10 text-[#0D0D0D]/50 disabled:opacity-30'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className={`mt-4 h-1 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-white/8' : 'bg-[#0D0D0D]/8'}`}>
          <div 
            className={`h-full rounded-full transition-all duration-300 ${theme === 'dark' ? 'bg-white/30' : 'bg-[#0D0D0D]/30'}`}
            style={{ width: `${((currentCard + 1) / flashcards.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
