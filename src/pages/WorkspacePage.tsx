import { useEffect, useState, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';
import { useTheme } from '../context/ThemeContext';
import { WorkspaceProvider, useWorkspace } from '../context/WorkspaceContext';
import { supabase } from '../lib/supabase';
import TopBar from '../components/workspace/TopBar';
import PDFPanel from '../components/workspace/PDFPanel';
import ChatPanel from '../components/workspace/ChatPanel';
import NotesPanel from '../components/workspace/NotesPanel';
import FlashcardModal from '../components/workspace/FlashcardModal';
import Footer from '../components/Footer';

function WorkspaceLayout({ initialAction }: { initialAction?: string }) {
  const { theme } = useTheme();
  const { 
    panelSizes, setPanelSizes, 
    showNotes, setShowNotes,
    showFlashcards, setShowFlashcards,
    sendToChat
  } = useWorkspace();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mobilePdfHeight, setMobilePdfHeight] = useState(52);
  const dragRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    if (!isMobile) return;
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;
      const touchY = e.touches[0].clientY;
      const vh = window.innerHeight;
      let newHeight = (touchY / vh) * 100;
      if (newHeight < 30) newHeight = 30;
      if (newHeight > 75) newHeight = 75;
      setMobilePdfHeight(newHeight);
    };
    
    const handleTouchEnd = () => {
      isDragging.current = false;
    };
    
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement as HTMLElement;
      const inInput = activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable;
      
      if (e.key === '/') {
        if (!inInput) {
          e.preventDefault();
          const chatInput = document.getElementById('chat-textarea');
          if (chatInput) chatInput.focus();
        }
      } else if (e.key === 'Escape') {
        setShowNotes(false);
        setShowFlashcards(false);
        window.getSelection()?.removeAllRanges();
      } else if (e.key === 'ArrowLeft' && !inInput) {
        window.dispatchEvent(new CustomEvent('workspace:prevPage'));
      } else if (e.key === 'ArrowRight' && !inInput) {
        window.dispatchEvent(new CustomEvent('workspace:nextPage'));
      } else if (e.key === 'f' && e.ctrlKey) {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('workspace:toggleSearch'));
      } else if (e.key === 'h' && e.ctrlKey) {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('workspace:toggleHighlights'));
      } else if (e.key === 'n' && e.ctrlKey) {
        e.preventDefault();
        setShowNotes(true);
      } else if (e.key === 'n' && !inInput && !e.ctrlKey && !e.metaKey) {
        // Quick note
      } else if (e.key === 's' && !inInput && !e.ctrlKey && !e.metaKey) {
        sendToChat("Summarize this page");
      } else if (e.key === 'f' && !inInput && !e.ctrlKey && !e.metaKey) {
        setShowFlashcards(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setShowNotes, setShowFlashcards, sendToChat]);

  useEffect(() => {
    const handleQuiz = () => sendToChat("Create a quiz for this document");
    window.addEventListener('workspace:quiz', handleQuiz);
    return () => window.removeEventListener('workspace:quiz', handleQuiz);
  }, [sendToChat]);

  const actionExecuted = useRef(false);

  useEffect(() => {
    if (initialAction && !actionExecuted.current) {
      actionExecuted.current = true;
      setTimeout(() => {
        if (initialAction === 'summarize') sendToChat("Summarize this document");
        else if (initialAction === 'quiz') sendToChat("Create a quiz for this document");
        else if (initialAction === 'flashcards') setShowFlashcards(true);
        else if (initialAction === 'chat') {
           const chatInput = document.getElementById('chat-textarea');
           if (chatInput) chatInput.focus();
        }
      }, 500);
    }
  }, [initialAction, sendToChat, setShowFlashcards]);

  return (
    <>
    <div className={`flex flex-col h-[100dvh] overflow-hidden ${theme === 'dark' ? 'bg-[#0D1117] text-white' : 'bg-[#F5F4F0] text-[#0D0D0D]'}`}>
      <TopBar />
      
      <div className="flex-1 overflow-hidden relative">
        {isMobile ? (
          <div className="flex flex-col h-full w-full overflow-hidden">
            <div style={{ height: `${mobilePdfHeight}vh` }} className="shrink-0 flex flex-col min-h-[30vh] max-h-[75vh]">
              <PDFPanel />
            </div>
            
            <div 
              ref={dragRef}
              onTouchStart={() => isDragging.current = true}
              onDoubleClick={(e) => { e.preventDefault(); setMobilePdfHeight(h => h === 52 ? 50 : 52); }}
              className={`h-8 flex items-center justify-center shrink-0 cursor-ns-resize touch-none ${theme === 'dark' ? 'bg-[#0D1117]' : 'bg-[#F4F3EF]'}`}
            >
              <div className={`w-12 h-1 rounded-full ${theme === 'dark' ? 'bg-white/15' : 'bg-[#0D0D0D]/15'}`} />
            </div>

            <div className="flex-1 overflow-hidden flex flex-col min-h-0">
              <ChatPanel />
            </div>
          </div>
        ) : (
          <PanelGroup direction="horizontal" onLayout={setPanelSizes}>
            <Panel defaultSize={panelSizes[0]} minSize={20}>
              <PDFPanel />
            </Panel>
            <PanelResizeHandle className={`w-1 h-full cursor-col-resize transition-colors ${theme === 'dark' ? 'bg-white/10 hover:bg-white/20' : 'bg-[#0D0D0D]/10 hover:bg-[#0D0D0D]/20'}`} />
            <Panel defaultSize={panelSizes[1]} minSize={20}>
              <ChatPanel />
            </Panel>
          </PanelGroup>
        )}

        {showNotes && <NotesPanel />}
        {showFlashcards && <FlashcardModal />}
      </div>
    </div>
    <Footer />
    </>
  );
}

export default function WorkspacePage() {
  const { docId } = useParams();
  const location = useLocation();
  const state = location.state as { fileUrl?: string, fileName?: string, initialAction?: string } | null;
  const [fileUrl, setFileUrl] = useState<string | undefined>(state?.fileUrl);
  const [fileName, setFileName] = useState<string | undefined>(state?.fileName);
  const [isLoading, setIsLoading] = useState(!state?.fileUrl && docId !== 'demo');

  useEffect(() => {
    async function loadDoc() {
      if (docId && docId !== 'demo' && !state?.fileUrl) {
        try {
          const { data: doc } = await supabase
            .from('documents')
            .select('*')
            .eq('id', docId)
            .single();

          if (doc) {
            setFileName(doc.name);
            const { data: urlData } = await supabase.storage
              .from('pdfs')
              .createSignedUrl(doc.file_path, 60 * 60 * 24);
            
            if (urlData?.signedUrl) {
              setFileUrl(urlData.signedUrl);
            }
          }
        } catch (e) {
          console.error("Failed to load document", e);
        } finally {
          setIsLoading(false);
        }
      }
    }
    loadDoc();
  }, [docId, state]);
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#0D1117] text-white">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin mb-4" />
        <p>Loading document...</p>
      </div>
    );
  }

  return (
    <WorkspaceProvider docId={docId || 'unknown'} customFileUrl={fileUrl} customFileName={fileName}>
      <WorkspaceLayout initialAction={state?.initialAction} />
    </WorkspaceProvider>
  );
}
