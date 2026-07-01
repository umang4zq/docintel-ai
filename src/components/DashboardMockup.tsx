import { useEffect, useRef, useState } from 'react';
import { PanelLeft, ChevronLeft, ChevronRight, Monitor, RotateCw, Share, Plus, Copy, Grid, Compass, Layers, ListTodo, Sparkles } from 'lucide-react';
import Logo from './Logo';

export default function DashboardMockup() {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const containerWidth = entry.contentRect.width;
        // Fixed design width of 896px
        const newScale = Math.min(containerWidth / 896, 1);
        setScale(newScale);
        
        if (innerRef.current) {
          setHeight(innerRef.current.offsetHeight * newScale);
        }
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="animate-hero-rise relative z-0 w-[92%] sm:w-[84%] lg:w-[72%] max-w-4xl mx-auto shrink-0 -mb-10 sm:-mb-20 lg:-mb-32"
      style={{ height: height > 0 ? height : 'auto', animationDelay: '620ms' }}
    >
      <div 
        ref={innerRef}
        className="origin-top-left absolute top-0 left-0 w-[896px]"
        style={{ transform: `scale(${scale})` }}
      >
        <div className="rounded-t-2xl overflow-hidden bg-[#1a1a1c] shadow-[0_-20px_80px_rgba(0,0,0,0.35)] ring-1 ring-white/10 text-left flex flex-col h-[560px]">
          {/* Title bar */}
          <div className="bg-[#242427] border-b border-white/5 px-4 py-2.5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              </div>
              <div className="flex items-center gap-2">
                <PanelLeft className="w-3.5 h-3.5 text-white/40" />
                <ChevronLeft className="w-3.5 h-3.5 text-white/40" />
                <ChevronRight className="w-3.5 h-3.5 text-white/25" />
              </div>
            </div>

            <div className="flex items-center gap-2 bg-[#1a1a1c] rounded-md px-6 py-1 text-[10px] text-white/60 min-w-[240px] justify-center">
              <Monitor className="w-3 h-3" />
              <span>docintel.ai</span>
            </div>

            <div className="flex items-center gap-3">
              <RotateCw className="w-3.5 h-3.5 text-white/40" />
              <Share className="w-3.5 h-3.5 text-white/40" />
              <Plus className="w-3.5 h-3.5 text-white/40" />
              <Copy className="w-3.5 h-3.5 text-white/40" />
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar (22% width) */}
            <div className="w-[22%] shrink-0 border-r border-white/5 bg-[#1e1e21] px-3 py-3.5 flex flex-col">
              <div className="flex items-center justify-between mb-6 px-1">
                <Logo className="w-4 h-4 text-white/70" />
                <Grid className="w-3.5 h-3.5 text-white/30" />
              </div>

              <div className="flex items-center gap-2 px-1 mb-6">
                <div className="w-4 h-4 rounded bg-[#e8553f] flex items-center justify-center text-[8px] font-bold text-white">D</div>
                <span className="text-[10px] text-white/80 font-medium">DocIntel Workspace</span>
              </div>

              <div className="space-y-1 mb-8">
                <div className="flex items-center gap-2 px-2 py-1.5 rounded bg-white/5 text-[10px] text-white/90">
                  <Compass className="w-3 h-3" />
                  Corpus Search
                </div>
                <div className="flex items-center gap-2 px-2 py-1.5 rounded text-[10px] text-white/60 hover:bg-white/5">
                  <Layers className="w-3 h-3" />
                  Knowledge Graph
                </div>
                <div className="flex items-center gap-2 px-2 py-1.5 rounded text-[10px] text-white/60 hover:bg-white/5">
                  <ListTodo className="w-3 h-3" />
                  Processing Queue
                </div>
              </div>

              <div className="mt-auto">
                <div className="text-[9px] text-white/40 font-medium px-2 mb-2 uppercase tracking-wider">Recent Documents</div>
                <div className="space-y-0.5">
                  {[
                    "MSA_Q4_2025_Final.pdf",
                    "Supplier_Invoices_Batch.pdf",
                    "Research_Notes_Scan.png",
                    "NVIDIA_Partnership.docx"
                  ].map((doc, i) => (
                    <div key={i} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-white/5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#28c840]/70 shrink-0" />
                      <span className="text-[10px] text-white/60 truncate">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-[#1a1a1c] p-8 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#e8553f] flex items-center justify-center text-lg font-bold text-white">D</div>
                  <div>
                    <h1 className="text-sm font-medium text-white">DocIntel Workspace</h1>
                    <div className="text-[10px] text-white/45">6 layers active • 1536d embeddings</div>
                  </div>
                </div>
                <button className="flex items-center gap-1.5 bg-white text-black px-3 py-1.5 rounded-md text-[11px] font-medium hover:bg-white/90">
                  <Sparkles className="w-3 h-3" />
                  Ask Corpus
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 divide-x divide-white/5 rounded-xl bg-white/[0.03] ring-1 ring-white/5 mb-8">
                <div className="px-5 py-4">
                  <div className="text-[8px] tracking-wider text-white/35 mb-1 uppercase">Indexed</div>
                  <div className="text-xl font-medium text-white">4,281 <span className="text-xs text-white/30 font-normal">Docs</span></div>
                </div>
                <div className="px-5 py-4">
                  <div className="text-[8px] tracking-wider text-white/35 mb-1 uppercase">Entities</div>
                  <div className="text-xl font-medium text-white">18.5k <span className="text-xs text-white/30 font-normal">Nodes</span></div>
                </div>
                <div className="px-5 py-4">
                  <div className="text-[8px] tracking-wider text-white/35 mb-1 uppercase">Queued</div>
                  <div className="text-xl font-medium text-white">12 <span className="text-xs text-white/30 font-normal">Jobs</span></div>
                </div>
                <div className="px-5 py-4">
                  <div className="text-[8px] tracking-wider text-white/35 mb-1 uppercase">RAG Queries</div>
                  <div className="text-xl font-medium text-white">842 <span className="text-xs text-white/30 font-normal">This week</span></div>
                </div>
              </div>

              {/* Subject Cards */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {["Legal Contracts", "Financial Records", "Research Papers"].map((subject, i) => (
                  <div key={i} className="rounded-lg bg-white/[0.03] ring-1 ring-white/5 p-4 flex flex-col justify-between h-24 hover:bg-white/[0.05] transition-colors cursor-pointer">
                    <span className="text-[11px] text-white/80 font-medium">{subject}</span>
                    <span className="text-[9px] text-white/40 tracking-wide uppercase mt-auto">Explore Graph →</span>
                  </div>
                ))}
              </div>

              {/* Table */}
              <div className="flex-1 rounded-xl ring-1 ring-white/5 bg-[#141415] overflow-hidden flex flex-col">
                <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-white/5 text-[9px] font-medium text-white/35 uppercase tracking-wider bg-white/[0.02]">
                  <div className="col-span-6">Document</div>
                  <div className="col-span-3">Type</div>
                  <div className="col-span-3">Status</div>
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                  {[
                    { doc: "Q4_Vendor_Agreements_Signed.pdf", type: "Contract", status: "Indexed", color: "text-[#28c840]/80" },
                    { doc: "Scan_001_Handwritten_Notes.png", type: "Image OCR", status: "Processing", color: "text-[#febc2e]/80" },
                    { doc: "Medical_Records_Archive_2025.pdf", type: "Medical", status: "Indexed", color: "text-[#28c840]/80" },
                    { doc: "Tax_Liability_Report_Final.docx", type: "Financial", status: "Indexed", color: "text-[#28c840]/80" },
                    { doc: "Meeting_Transcript_Draft.txt", type: "Raw Text", status: "Processing", color: "text-[#febc2e]/80" }
                  ].map((row, i) => (
                    <div key={i} className="grid grid-cols-12 gap-4 px-3 py-2.5 rounded-lg hover:bg-white/[0.03] text-[11px] items-center">
                      <div className="col-span-6 text-white/80 truncate font-medium">{row.doc}</div>
                      <div className="col-span-3 text-white/50">{row.type}</div>
                      <div className="col-span-3 font-medium flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${row.status === 'Indexed' ? 'bg-[#28c840]' : 'bg-[#febc2e]'}`} />
                        <span className={row.color}>{row.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
