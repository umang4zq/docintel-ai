import { useEffect, useState } from 'react';
import { FileText, MoreHorizontal, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import DashboardLayout from '../components/dashboard/DashboardLayout';

export default function DocumentsPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDocuments() {
      if (!user) return;
      try {
        const { data: docs } = await supabase
          .from('documents')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (docs) {
          const formattedDocs = docs.map(d => {
            const date = new Date(d.created_at);
            const today = new Date();
            const isToday = date.toDateString() === today.toDateString();
            const dateStr = isToday ? 'Today' : date.toLocaleDateString();
            
            let type = 'PDF';
            if (d.file_type?.includes('word')) type = 'DOCX';
            if (d.file_type?.includes('image')) type = 'IMAGE';

            return {
              id: d.id,
              name: d.name,
              type,
              pages: d.page_count || 0,
              date: dateStr,
              size: d.file_size_bytes ? (d.file_size_bytes / (1024 * 1024)).toFixed(1) : 0,
              status: d.status
            };
          });
          setDocuments(formattedDocs);
        }
      } catch (e) {
        console.error("Error fetching documents", e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDocuments();
  }, [user]);

  const filteredDocs = documents.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'All' || 
      (filter === 'Images' && (d.type === 'PNG' || d.type === 'JPG' || d.type === 'IMAGE')) || 
      d.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout>
      <h1 className={`text-xl font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-[#0D0D0D]'}`}>
        My Documents
      </h1>

      <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 mb-6">
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search documents..."
          className={`rounded-xl px-4 py-2 text-sm flex-1 w-full outline-none transition-colors ${
            theme === 'dark' ? 'bg-white/5 border border-white/8 text-white focus:border-white/20' : 'bg-white border border-[#0D0D0D]/8 focus:border-[#0D0D0D]/20'
          }`}
        />
        <div className="flex gap-1 self-start md:self-auto overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-hide flex-nowrap">
          {['All', 'PDF', 'DOCX', 'Images'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                filter === f
                  ? (theme === 'dark' ? 'bg-white text-black' : 'bg-[#0D0D0D] text-white')
                  : (theme === 'dark' ? 'text-white/60 hover:bg-white/10' : 'text-[#0D0D0D]/60 hover:bg-[#0D0D0D]/10')
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className={`size-8 animate-spin ${theme === 'dark' ? 'text-white/20' : 'text-[#0D0D0D]/20'}`} />
        </div>
      ) : documents.length === 0 ? (
        <div className={`rounded-2xl border py-16 flex flex-col items-center justify-center border-dashed ${theme === 'dark' ? 'border-white/6 text-white/40' : 'border-[#0D0D0D]/6 text-[#0D0D0D]/40'}`}>
          <FileText className="size-8 mb-3 opacity-50" />
          <p className="text-sm">No documents found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map(doc => (
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
              {doc.status === 'ready' ? (
                <div className={`text-[10px] rounded-full px-2 py-0.5 ${theme === 'dark' ? 'bg-white/8 text-white/40' : 'bg-[#0D0D0D]/8 text-[#0D0D0D]/40'}`}>Ready</div>
              ) : (
                <div className="text-[10px] rounded-full px-2 py-0.5 text-amber-400 bg-amber-500/10">Processing</div>
              )}
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
