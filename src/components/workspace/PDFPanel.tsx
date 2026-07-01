import { useState, useRef, useEffect, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { 
  ChevronLeft, ChevronRight, ZoomOut, ZoomIn, AlignJustify, 
  Search, Maximize2, RotateCw, X, ChevronUp, ChevronDown,
  Sparkles, BookmarkPlus, Copy
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useWorkspace } from '../../context/WorkspaceContext';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PDFPanel() {
  const { theme } = useTheme();
  const { 
    currentPage, setCurrentPage, 
    totalPages, setTotalPages,
    sendToChat, docTitle,
    notes, setNotes,
    fileUrl,
    setDocumentChunks
  } = useWorkspace();
  const navigate = useNavigate();
  
  const [scale, setScale] = useState(1.2);
  const [rotation, setRotation] = useState(0);
  const [pageInput, setPageInput] = useState(currentPage.toString());
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectionToolbarPos, setSelectionToolbarPos] = useState<{x: number, y: number} | null>(null);
  const [selectedText, setSelectedText] = useState('');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const isPdf = fileUrl && (fileUrl.toLowerCase().includes('.pdf') || fileUrl.startsWith('blob:'));
  const pdfUrl = isPdf ? fileUrl : (docId === 'demo' ? '/demo/sample.pdf' : '/sample.pdf');

  useEffect(() => {
    setPageInput(currentPage.toString());
  }, [currentPage]);

  useEffect(() => {
    const handleScrollEvent = (e: CustomEvent) => {
      const page = e.detail;
      const el = pageRefs.current[page - 1];
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    const handleToggleSearch = () => setSearchOpen(prev => !prev);

    window.addEventListener('scrollToPage', handleScrollEvent as EventListener);
    window.addEventListener('workspace:toggleSearch', handleToggleSearch);
    
    return () => {
      window.removeEventListener('scrollToPage', handleScrollEvent as EventListener);
      window.removeEventListener('workspace:toggleSearch', handleToggleSearch);
    };
  }, []);

  useEffect(() => {
    // Intersection Observer to track current page
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const pageIndex = Number(entry.target.getAttribute('data-page-number'));
          if (pageIndex && pageIndex !== currentPage) {
            setCurrentPage(pageIndex);
          }
        }
      });
    }, {
      root: containerRef.current,
      threshold: 0.5
    });

    pageRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [totalPages, scale, setCurrentPage]); // Re-bind observer if total pages or scale changes

  const onDocumentLoadSuccess = async (pdf: any) => {
    setTotalPages(pdf.numPages);
    
    try {
      const chunks: any[] = [];
      for (let i = 1; i <= Math.min(pdf.numPages, 30); i++) { // limit to 30 pages for performance in demo
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const text = textContent.items.map((item: any) => item.str).join(' ');
        chunks.push({
          id: `p${i}`,
          docId: docTitle,
          pageNumber: i,
          sectionLabel: `Page ${i}`,
          content: text
        });
      }
      setDocumentChunks(chunks);
    } catch (e) {
      console.error("Failed to extract PDF text", e);
    }
  };

  const handleDocumentLoadError = (error: Error) => {
    console.error("PDF load error:", error);
    if (docId === 'demo') {
      alert("Demo PDF not found. Run this on your EC2:\n\ncurl -L \"https://www.africau.edu/images/default/sample.pdf\" -o /home/ubuntu/Wirekit/public/demo/sample.pdf");
    } else if (pdfUrl && pdfUrl.startsWith('blob:')) {
      alert("Session expired after page refresh. Please upload your document again.");
      navigate('/upload');
    }
  };

  const handleZoomIn = () => setScale(s => Math.min(3.0, s + 0.1));
  const handleZoomOut = () => setScale(s => Math.max(0.5, s - 0.1));
  const handleRotate = () => setRotation(r => (r + 90) % 360);

  const handlePageInputSubmit = (e: React.KeyboardEvent | React.FocusEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    const pageNum = parseInt(pageInput, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      window.dispatchEvent(new CustomEvent('scrollToPage', { detail: pageNum }));
    } else {
      setPageInput(currentPage.toString());
    }
  };

  // Text selection logic
  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (selection && !selection.isCollapsed && selection.toString().trim().length > 0) {
        // ensure selection is within our container
        if (containerRef.current?.contains(selection.anchorNode)) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          
          if (containerRef.current) {
            const containerRect = containerRef.current.getBoundingClientRect();
            // Position above selection
            setSelectionToolbarPos({
              x: rect.left - containerRect.left + (rect.width / 2),
              y: rect.top - containerRect.top - 40 // 40px above
            });
            setSelectedText(selection.toString());
          }
        }
      } else {
        setSelectionToolbarPos(null);
      }
    };

    document.addEventListener('mouseup', handleSelection);
    return () => document.removeEventListener('mouseup', handleSelection);
  }, []);

  const handleSaveNote = () => {
    setNotes([...notes, { id: Date.now().toString(), text: selectedText, pageRef: currentPage }]);
    window.getSelection()?.removeAllRanges();
    setSelectionToolbarPos(null);
  };

  const handleExplain = () => {
    sendToChat("Explain this: " + selectedText);
    window.getSelection()?.removeAllRanges();
    setSelectionToolbarPos(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedText);
    window.getSelection()?.removeAllRanges();
    setSelectionToolbarPos(null);
  };

  return (
    <div className={`h-full flex flex-col overflow-hidden relative ${theme === 'dark' ? 'bg-[#0D1117]' : 'bg-[#F4F3EF]'}`}>
      
      {/* PDF Toolbar */}
      <div className={`h-10 shrink-0 flex items-center justify-between px-3 border-b ${theme === 'dark' ? 'bg-[#0D1117] border-white/6' : 'bg-[#F4F3EF] border-[#0D0D0D]/6'}`}>
        
        <div className="flex items-center gap-1">
          <button 
            disabled={currentPage <= 1}
            onClick={() => window.dispatchEvent(new CustomEvent('scrollToPage', { detail: currentPage - 1 }))}
            className={`flex items-center justify-center min-w-[36px] min-h-[36px] rounded-md transition-colors disabled:opacity-30 ${theme === 'dark' ? 'text-white/70 hover:bg-white/10' : 'text-[#0D0D0D]/70 hover:bg-[#0D0D0D]/10'}`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="hidden sm:block">
            <input 
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              onBlur={handlePageInputSubmit}
              onKeyDown={handlePageInputSubmit}
              className={`w-10 text-center text-xs rounded-md border px-1 py-0.5 outline-none ${
                theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-white/30' : 'bg-[#0D0D0D]/5 border-[#0D0D0D]/10 text-[#0D0D0D] focus:border-[#0D0D0D]/30'
              }`}
            />
          </div>
          <span className={`sm:hidden text-xs font-mono px-1 ${theme === 'dark' ? 'text-white/40' : 'text-[#0D0D0D]/40'}`}>
            {currentPage} / {totalPages || 1}
          </span>
          <span className={`hidden sm:inline text-xs mx-1 ${theme === 'dark' ? 'text-white/20' : 'text-[#0D0D0D]/20'}`}>/</span>
          <span className={`hidden sm:inline text-xs ${theme === 'dark' ? 'text-white/30' : 'text-[#0D0D0D]/30'}`}>{totalPages || 1}</span>
          
          <button 
            disabled={currentPage >= totalPages}
            onClick={() => window.dispatchEvent(new CustomEvent('scrollToPage', { detail: currentPage + 1 }))}
            className={`flex items-center justify-center min-w-[36px] min-h-[36px] rounded-md transition-colors disabled:opacity-30 ${theme === 'dark' ? 'text-white/70 hover:bg-white/10' : 'text-[#0D0D0D]/70 hover:bg-[#0D0D0D]/10'}`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className={`w-px h-4 mx-1 sm:mx-2 ${theme === 'dark' ? 'bg-white/10' : 'bg-[#0D0D0D]/10'}`} />

        <div className="flex items-center gap-1">
          <button onClick={handleZoomOut} className={`flex items-center justify-center min-w-[36px] min-h-[36px] rounded-md transition-colors ${theme === 'dark' ? 'text-white/70 hover:bg-white/10' : 'text-[#0D0D0D]/70 hover:bg-[#0D0D0D]/10'}`}>
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className={`hidden sm:inline-block text-xs font-mono w-12 text-center ${theme === 'dark' ? 'text-white/40' : 'text-[#0D0D0D]/40'}`}>
            {Math.round(scale * 100)}%
          </span>
          <button onClick={handleZoomIn} className={`flex items-center justify-center min-w-[36px] min-h-[36px] rounded-md transition-colors ${theme === 'dark' ? 'text-white/70 hover:bg-white/10' : 'text-[#0D0D0D]/70 hover:bg-[#0D0D0D]/10'}`}>
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          
          <div className={`sm:hidden w-px h-4 mx-1 ${theme === 'dark' ? 'bg-white/10' : 'bg-[#0D0D0D]/10'}`} />

          <button className={`hidden md:inline-flex flex items-center justify-center min-w-[36px] min-h-[36px] rounded-md transition-colors ml-1 ${theme === 'dark' ? 'text-white/70 hover:bg-white/10' : 'text-[#0D0D0D]/70 hover:bg-[#0D0D0D]/10'}`}>
            <AlignJustify className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setSearchOpen(!searchOpen)} className={`md:hidden flex items-center justify-center min-w-[36px] min-h-[36px] rounded-md transition-colors ${theme === 'dark' ? 'text-white/70 hover:bg-white/10' : 'text-[#0D0D0D]/70 hover:bg-[#0D0D0D]/10'}`}>
            <Search className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className={`hidden md:block w-px h-4 mx-2 ${theme === 'dark' ? 'bg-white/10' : 'bg-[#0D0D0D]/10'}`} />

        <div className="hidden md:flex items-center gap-1">
          <button onClick={() => setSearchOpen(!searchOpen)} className={`p-1.5 rounded-md transition-colors ${theme === 'dark' ? 'text-white/70 hover:bg-white/10' : 'text-[#0D0D0D]/70 hover:bg-[#0D0D0D]/10'}`}>
            <Search className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => {
              if (document.fullscreenElement) {
                document.exitFullscreen();
              } else {
                containerRef.current?.requestFullscreen();
              }
            }} 
            className={`p-1.5 rounded-md transition-colors ${theme === 'dark' ? 'text-white/70 hover:bg-white/10' : 'text-[#0D0D0D]/70 hover:bg-[#0D0D0D]/10'}`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={handleRotate} className={`p-1.5 rounded-md transition-colors ${theme === 'dark' ? 'text-white/70 hover:bg-white/10' : 'text-[#0D0D0D]/70 hover:bg-[#0D0D0D]/10'}`}>
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Search Bar */}
      {searchOpen && (
        <div className={`h-10 shrink-0 flex items-center gap-2 px-3 border-b ${theme === 'dark' ? 'bg-[#161B22] border-white/6' : 'bg-white border-[#0D0D0D]/6'}`}>
          <Search className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-white/30' : 'text-[#0D0D0D]/30'}`} />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search in document..."
            className={`flex-1 bg-transparent text-sm outline-none ${theme === 'dark' ? 'text-white placeholder:text-white/25' : 'text-[#0D0D0D] placeholder:text-[#0D0D0D]/25'}`}
          />
          <span className={`text-xs ${theme === 'dark' ? 'text-white/30' : 'text-[#0D0D0D]/30'}`}>0 of 0</span>
          <div className="flex items-center gap-1">
            <button className={`p-1 rounded-md transition-colors ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-[#0D0D0D]/10'}`}><ChevronUp className="w-3.5 h-3.5" /></button>
            <button className={`p-1 rounded-md transition-colors ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-[#0D0D0D]/10'}`}><ChevronDown className="w-3.5 h-3.5" /></button>
            <button onClick={() => setSearchOpen(false)} className={`p-1 rounded-md transition-colors ml-2 ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-[#0D0D0D]/10'}`}><X className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      )}

      {/* Canvas Area */}
      <div 
        ref={containerRef}
        className={`flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide px-2 sm:px-6 py-6 ${theme === 'dark' ? 'bg-[#1C2128]' : 'bg-[#E8E6E0]'}`}
      >
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={handleDocumentLoadError}
          className="flex flex-col items-center w-full"
          loading={
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          {Array.from(new Array(totalPages), (el, index) => (
            <div 
              key={`page_${index + 1}`} 
              className="mb-8 relative"
              ref={el => pageRefs.current[index] = el}
              data-page-number={index + 1}
            >
              <div className={`transition-shadow duration-300 ${theme === 'dark' ? 'shadow-[0_2px_12px_rgba(0,0,0,0.4)]' : 'shadow-[0_2px_12px_rgba(0,0,0,0.15)]'}`}>
                <Page 
                  pageNumber={index + 1} 
                  scale={scale} 
                  rotate={rotation}
                  renderAnnotationLayer={true}
                  renderTextLayer={true}
                  className="bg-white"
                  loading={
                    <div className="flex items-center justify-center bg-white/5 w-full h-[600px]">
                      Loading page...
                    </div>
                  }
                />
              </div>
              <div className={`text-center text-xs mt-2 ${theme === 'dark' ? 'text-white/20' : 'text-[#0D0D0D]/20'}`}>
                Page {index + 1}
              </div>
            </div>
          ))}
        </Document>

        {/* Floating Text Selection Toolbar */}
        {selectionToolbarPos && (
          <div 
            className={`absolute z-50 rounded-xl shadow-xl px-3 py-2 sm:px-2 sm:py-1.5 flex items-center gap-1 border overflow-x-auto max-w-[90vw] scrollbar-hide ${
              theme === 'dark' ? 'bg-[#1C2128] border-white/10' : 'bg-white border-[#0D0D0D]/10'
            }`}
            style={{ 
              top: selectionToolbarPos.y, 
              left: selectionToolbarPos.x,
              transform: 'translateX(-50%)'
            }}
          >
            <div className="flex items-center gap-1.5 px-1 border-r border-white/10 pr-2 mr-1">
              {['#FCD34D', '#86EFAC', '#93C5FD', '#F9A8D4'].map(color => (
                <div 
                  key={color}
                  className="w-4 h-4 rounded-full cursor-pointer hover:scale-125 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    const selection = window.getSelection();
                    if (selection && !selection.isCollapsed) {
                      try {
                        const range = selection.getRangeAt(0);
                        if ('highlights' in CSS) {
                          const highlightName = `hl-${Date.now()}`;
                          // @ts-ignore
                          const highlight = new Highlight(range);
                          // @ts-ignore
                          CSS.highlights.set(highlightName, highlight);
                          
                          let styleEl = document.getElementById('custom-highlights');
                          if (!styleEl) {
                            styleEl = document.createElement('style');
                            styleEl.id = 'custom-highlights';
                            document.head.appendChild(styleEl);
                          }
                          styleEl.innerHTML += `\n::highlight(${highlightName}) { background-color: ${color}; color: black; }`;
                        } else {
                          const span = document.createElement('span');
                          span.style.backgroundColor = color;
                          range.surroundContents(span);
                        }
                      } catch (e) {
                        console.error('Highlight error:', e);
                      }
                    }
                    window.getSelection()?.removeAllRanges();
                    setSelectionToolbarPos(null);
                  }}
                />
              ))}
            </div>
            
            <button onClick={handleExplain} className={`p-2 sm:p-1.5 rounded-lg transition-colors ${theme === 'dark' ? 'text-white/70 hover:bg-white/10 hover:text-white' : 'text-[#0D0D0D]/70 hover:bg-[#0D0D0D]/10 hover:text-[#0D0D0D]'}`}>
              <Sparkles className="w-5 h-5 sm:w-4 sm:h-4" />
            </button>
            <button onClick={handleSaveNote} className={`p-2 sm:p-1.5 rounded-lg transition-colors ${theme === 'dark' ? 'text-white/70 hover:bg-white/10 hover:text-white' : 'text-[#0D0D0D]/70 hover:bg-[#0D0D0D]/10 hover:text-[#0D0D0D]'}`}>
              <BookmarkPlus className="w-5 h-5 sm:w-4 sm:h-4" />
            </button>
            <button onClick={handleCopy} className={`p-2 sm:p-1.5 rounded-lg transition-colors ${theme === 'dark' ? 'text-white/70 hover:bg-white/10 hover:text-white' : 'text-[#0D0D0D]/70 hover:bg-[#0D0D0D]/10 hover:text-[#0D0D0D]'}`}>
              <Copy className="w-5 h-5 sm:w-4 sm:h-4" />
            </button>
            <button onClick={() => setSelectionToolbarPos(null)} className={`p-2 sm:p-1.5 rounded-lg transition-colors ml-1 ${theme === 'dark' ? 'text-white/70 hover:bg-white/10 hover:text-white' : 'text-[#0D0D0D]/70 hover:bg-[#0D0D0D]/10 hover:text-[#0D0D0D]'}`}>
              <X className="w-5 h-5 sm:w-4 sm:h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
