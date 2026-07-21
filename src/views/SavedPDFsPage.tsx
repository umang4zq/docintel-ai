import { BookmarkX, FileText, MoreHorizontal, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import DashboardLayout from '../components/dashboard/DashboardLayout';

export default function SavedPDFsPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Mock data - no saved documents for demo
  const documents: any[] = [];

  return (
    <DashboardLayout>
      <h1 className={`text-xl font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-[#0D0D0D]'}`}>
        Saved PDFs
      </h1>

      {documents.length === 0 ? (
        <div className={`rounded-2xl border py-16 flex flex-col items-center justify-center border-dashed mt-4 ${theme === 'dark' ? 'border-white/6 bg-white/[0.01]' : 'border-[#0D0D0D]/6 bg-[#0D0D0D]/[0.01]'}`}>
          <BookmarkX className={`size-10 mb-4 ${theme === 'dark' ? 'text-white/10' : 'text-[#0D0D0D]/10'}`} />
          <div className={`text-base font-medium ${theme === 'dark' ? 'text-white/40' : 'text-[#0D0D0D]/40'}`}>No saved PDFs</div>
          <div className={`text-sm mt-1 max-w-sm text-center ${theme === 'dark' ? 'text-white/25' : 'text-[#0D0D0D]/25'}`}>
            Bookmark documents from the workspace to see them here for quick access later.
          </div>
          <button 
            onClick={() => navigate('/documents')}
            className={`mt-6 rounded-xl px-5 py-2.5 text-sm font-medium border transition-colors ${theme === 'dark' ? 'border-white/10 text-white/60 hover:bg-white/5 hover:text-white' : 'border-[#0D0D0D]/10 text-[#0D0D0D]/60 hover:bg-[#0D0D0D]/5 hover:text-[#0D0D0D]'}`}
          >
            Browse documents
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map(doc => (
            <div 
              key={doc.id}
              onClick={() => navigate(`/workspace/${doc.id}`)}
              className={`rounded-2xl border p-5 cursor-pointer flex flex-col transition-all duration-150 ${
                theme === 'dark' ? 'bg-[#0D1117] border-white/6 hover:border-white/14' : 'bg-white border-[#0D0D0D]/6 hover:border-[#0D0D0D]/14'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className={`text-[10px] uppercase font-mono rounded px-2 py-0.5 ${theme === 'dark' ? 'bg-white/8 text-white/40' : 'bg-[#0D0D0D]/8 text-[#0D0D0D]/40'}`}>
                  {doc.type}
                </span>
                <button 
                  onClick={(e) => e.stopPropagation()}
                  className={`p-1 rounded transition-colors ${theme === 'dark' ? 'text-white/40 hover:text-white/80 hover:bg-white/10' : 'text-[#0D0D0D]/40 hover:text-[#0D0D0D]/80 hover:bg-[#0D0D0D]/10'}`}
                >
                  <MoreHorizontal className="size-4" />
                </button>
              </div>
              
              <FileText className={`size-8 mt-4 mb-3 ${theme === 'dark' ? 'text-white/20' : 'text-[#0D0D0D]/20'}`} />
              
              <h3 className={`text-sm font-medium mb-1 truncate ${theme === 'dark' ? 'text-white/80' : 'text-[#0D0D0D]/80'}`}>
                {doc.name}
              </h3>
              
              <div className={`text-xs ${theme === 'dark' ? 'text-white/25' : 'text-[#0D0D0D]/25'}`}>
                {doc.pages} pages · {doc.date} · {doc.size}MB
              </div>
              
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-transparent">
                <div className={`text-[10px] rounded-full px-2 py-0.5 ${theme === 'dark' ? 'bg-white/8 text-white/40' : 'bg-[#0D0D0D]/8 text-[#0D0D0D]/40'}`}>Ready</div>
                <div className={`text-xs flex items-center gap-1 transition-colors ${theme === 'dark' ? 'text-white/30 hover:text-white/60' : 'text-[#0D0D0D]/30 hover:text-[#0D0D0D]/60'}`}>
                  Open <ArrowRight className="size-3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
