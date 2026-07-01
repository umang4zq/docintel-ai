import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Files, MessageCircle, Upload, ArrowUpRight, BookOpen, FileQuestion, ArrowRight, Brain, Sparkles, Layers, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import DashboardLayout from '../components/dashboard/DashboardLayout';

export default function DashboardPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [documents, setDocuments] = useState<any[]>([]);
  const [credits, setCredits] = useState<number | string>('-');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user) return;
      try {
        // Fetch credits
        const { data: profile } = await supabase
          .from('profiles')
          .select('credits')
          .eq('id', user.id)
          .single();
        
        if (profile) setCredits(profile.credits);

        // Fetch recent documents
        const { data: docs } = await supabase
          .from('documents')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (docs) {
          const formattedDocs = docs.map(d => {
            const date = new Date(d.created_at);
            const today = new Date();
            const isToday = date.toDateString() === today.toDateString();
            const dateStr = isToday ? 'Today' : date.toLocaleDateString();

            return {
              id: d.id,
              name: d.name,
              pages: d.page_count || 0,
              date: dateStr,
              status: d.status
            };
          });
          setDocuments(formattedDocs);
        }
      } catch (e) {
        console.error("Error fetching dashboard data", e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDashboardData();
  }, [user]);

  const targetWorkspaceUrl = documents.length > 0 ? `/workspace/${documents[0].id}` : '/upload';

  return (
    <DashboardLayout>
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        {[
          { icon: FileText, value: credits.toString(), label: 'Credits remaining' },
          { icon: Files, value: documents.length.toString(), label: 'Documents processed' },
          { icon: MessageCircle, value: '0', label: 'AI conversations' }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-2xl p-5 border ${theme === 'dark' ? 'bg-[#0D1117] border-white/6' : 'bg-white border-[#0D0D0D]/6'}`}
          >
            <stat.icon className={`size-4 mb-3 ${theme === 'dark' ? 'text-white/30' : 'text-[#0D0D0D]/30'}`} />
            <div className={`text-3xl font-semibold font-mono ${theme === 'dark' ? 'text-white' : 'text-[#0D0D0D]'}`}>
              {stat.value}
            </div>
            <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-white/30' : 'text-[#0D0D0D]/30'}`}>
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          onClick={() => navigate('/upload')}
          className={`rounded-2xl p-6 border cursor-pointer transition-all duration-200 flex items-start justify-between ${
            theme === 'dark' ? 'bg-[#0D1117] border-white/8 hover:border-white/16 hover:bg-[#161B22]' : 'bg-white border-[#0D0D0D]/8 hover:border-[#0D0D0D]/16'
          }`}
        >
          <div>
            <Upload className={`size-5 mb-4 ${theme === 'dark' ? 'text-white/50' : 'text-[#0D0D0D]/50'}`} />
            <div className={`text-base font-medium ${theme === 'dark' ? 'text-white' : 'text-[#0D0D0D]'}`}>Upload a document</div>
            <div className={`text-sm mt-1 ${theme === 'dark' ? 'text-white/40' : 'text-[#0D0D0D]/40'}`}>
              PDF, DOCX, scanned image, or handwritten note
            </div>
          </div>
          <ArrowUpRight className={`size-4 ${theme === 'dark' ? 'text-white/20' : 'text-[#0D0D0D]/20'}`} />
        </div>

        <div 
          onClick={() => navigate(targetWorkspaceUrl)}
          className={`rounded-2xl p-6 border cursor-pointer transition-all duration-200 flex items-start justify-between ${
            theme === 'dark' ? 'bg-[#0D1117] border-white/8 hover:border-white/16 hover:bg-[#161B22]' : 'bg-white border-[#0D0D0D]/8 hover:border-[#0D0D0D]/16'
          }`}
        >
          <div>
            <BookOpen className={`size-5 mb-4 ${theme === 'dark' ? 'text-white/50' : 'text-[#0D0D0D]/50'}`} />
            <div className={`text-base font-medium ${theme === 'dark' ? 'text-white' : 'text-[#0D0D0D]'}`}>Continue reading</div>
            <div className={`text-sm mt-1 ${theme === 'dark' ? 'text-white/40' : 'text-[#0D0D0D]/40'}`}>
              Resume where you left off
            </div>
          </div>
          <ArrowUpRight className={`size-4 ${theme === 'dark' ? 'text-white/20' : 'text-[#0D0D0D]/20'}`} />
        </div>
      </div>

      {/* Recent Documents */}
      <div className="mt-2">
        <div className="flex items-center justify-between mb-4">
          <div className={`text-sm font-medium ${theme === 'dark' ? 'text-white/60' : 'text-[#0D0D0D]/60'}`}>
            Recent documents
          </div>
          <div 
            onClick={() => navigate('/documents')}
            className={`text-xs cursor-pointer ${theme === 'dark' ? 'text-white/30 hover:text-white/60' : 'text-[#0D0D0D]/30 hover:text-[#0D0D0D]/60'}`}
          >
            View all →
          </div>
        </div>

        {documents.length === 0 ? (
          <div className={`rounded-2xl border py-12 flex flex-col items-center border-dashed ${theme === 'dark' ? 'border-white/6' : 'border-[#0D0D0D]/6'}`}>
            <FileQuestion className={`size-8 mb-3 ${theme === 'dark' ? 'text-white/10' : 'text-[#0D0D0D]/10'}`} />
            <div className={`text-sm ${theme === 'dark' ? 'text-white/25' : 'text-[#0D0D0D]/25'}`}>No documents yet</div>
            <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-white/15' : 'text-[#0D0D0D]/15'}`}>Upload your first document to get started</div>
            <button 
              onClick={() => navigate('/upload')}
              className={`mt-4 rounded-xl px-4 py-2 text-sm border transition-colors ${theme === 'dark' ? 'border-white/10 text-white/40 hover:bg-white/5' : 'border-[#0D0D0D]/10 text-[#0D0D0D]/60 hover:bg-[#0D0D0D]/5'}`}
            >
              Upload PDF
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {documents.map(doc => (
              <div 
                key={doc.id}
                onClick={() => navigate(`/workspace/${doc.id}`)}
                className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-150 ${
                  theme === 'dark' ? 'bg-[#0D1117] border-white/6 hover:border-white/12' : 'bg-white border-[#0D0D0D]/6 hover:border-[#0D0D0D]/12'
                }`}
              >
                <div className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-white/5 text-white/40' : 'bg-[#0D0D0D]/5 text-[#0D0D0D]/40'}`}>
                  <FileText className="size-8" />
                </div>
                <div className="flex flex-col gap-0.5 flex-1">
                  <div className={`text-sm font-medium ${theme === 'dark' ? 'text-white/80' : 'text-[#0D0D0D]/80'}`}>
                    {doc.name}
                  </div>
                  <div className={`text-xs flex items-center gap-2 ${theme === 'dark' ? 'text-white/30' : 'text-[#0D0D0D]/30'}`}>
                    {doc.pages} pages · {doc.date}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {doc.status === 'ready' ? (
                    <div className={`text-[10px] rounded-full px-2 py-0.5 ${theme === 'dark' ? 'bg-white/8 text-white/40' : 'bg-[#0D0D0D]/8 text-[#0D0D0D]/40'}`}>Ready</div>
                  ) : (
                    <div className="text-[10px] rounded-full px-2 py-0.5 text-amber-400 bg-amber-500/10">Processing</div>
                  )}
                  <ArrowRight className={`size-3.5 ${theme === 'dark' ? 'text-white/20' : 'text-[#0D0D0D]/20'}`} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Learn with AI Section */}
      <div className={`mt-2 rounded-2xl border p-6 ${theme === 'dark' ? 'bg-[#0D1117] border-white/6' : 'bg-white border-[#0D0D0D]/6'}`}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Brain className={`size-4 ${theme === 'dark' ? 'text-white/40' : 'text-[#0D0D0D]/40'}`} />
            <div className={`text-sm font-medium ${theme === 'dark' ? 'text-white/70' : 'text-[#0D0D0D]/70'}`}>Learn with AI</div>
          </div>
          <div 
            onClick={() => navigate(targetWorkspaceUrl)}
            className="text-xs cursor-pointer text-emerald-500 hover:text-emerald-400"
          >
            Open workspace →
          </div>
        </div>

        <div className="flex row flex-wrap gap-2">
          {[
            { icon: MessageCircle, label: "Chat with document", action: "chat" },
            { icon: Sparkles, label: "Auto summarize", action: "summarize" },
            { icon: Layers, label: "Generate flashcards", action: "flashcards" },
            { icon: HelpCircle, label: "Create quiz", action: "quiz" }
          ].map((pill, i) => (
            <div 
              key={i}
              onClick={() => navigate(targetWorkspaceUrl, { state: { initialAction: pill.action } })}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-2 border text-xs cursor-pointer transition-all ${
                theme === 'dark' ? 'bg-white/[0.02] border-white/6 text-white/45 hover:bg-white/5 hover:text-white/70' : 'bg-[#0D0D0D]/[0.02] border-[#0D0D0D]/6 text-[#0D0D0D]/45 hover:bg-[#0D0D0D]/5 hover:text-[#0D0D0D]/70'
              }`}
            >
              <pill.icon className="size-3.5" />
              {pill.label}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
