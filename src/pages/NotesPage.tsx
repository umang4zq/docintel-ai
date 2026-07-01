import { useState } from 'react';
import { Trash2, ExternalLink, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import DashboardLayout from '../components/dashboard/DashboardLayout';

export default function NotesPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const notes = [
    {
      id: '1',
      docName: 'Q4_Financial_Report.pdf',
      docId: '1',
      page: 12,
      date: '2 hours ago',
      text: 'Revenue growth exceeded expectations by 15% due to the new SaaS product launch in EMEA region. Need to ask AI to compare this with Q3 numbers.',
      color: '#FCD34D' // yellow highlight
    },
    {
      id: '2',
      docName: 'Vendor_Agreement_2026.docx',
      docId: '2',
      page: 4,
      date: 'Yesterday',
      text: 'Section 4.2 outlines the termination clauses. 30-day notice is required. Make sure to update internal compliance tracker.',
      color: '#86EFAC' // green highlight
    },
    {
      id: '3',
      docName: 'Q4_Financial_Report.pdf',
      docId: '1',
      page: 15,
      date: '2 hours ago',
      text: 'Operating expenses increased due to AI infrastructure costs, but offset by lower customer acquisition costs (CAC).',
      color: null // plain note
    },
    {
      id: '4',
      docName: 'Employee_Handbook.pdf',
      docId: '4',
      page: 22,
      date: 'Last week',
      text: 'Remote work policy updated for 2026: Employees can work from anywhere for up to 90 days per calendar year.',
      color: '#93C5FD' // blue highlight
    },
    {
      id: '5',
      docName: 'Employee_Handbook.pdf',
      docId: '4',
      page: 23,
      date: 'Last week',
      text: 'Ensure HR knows about the tax implications for cross-border remote work over 90 days.',
      color: null
    }
  ];

  return (
    <DashboardLayout>
      <div className="flex items-center gap-3 mb-6">
        <h1 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-[#0D0D0D]'}`}>
          My Notes
        </h1>
        <div className={`text-[10px] font-medium rounded-full px-2 py-0.5 ${theme === 'dark' ? 'bg-white/10 text-white/60' : 'bg-[#0D0D0D]/10 text-[#0D0D0D]/60'}`}>
          {notes.length}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
        <select className={`rounded-xl px-4 py-2 text-sm outline-none cursor-pointer appearance-none ${
          theme === 'dark' ? 'bg-white/5 border border-white/8 text-white' : 'bg-white border border-[#0D0D0D]/8 text-[#0D0D0D]'
        }`}>
          <option>All documents</option>
          <option>Q4_Financial_Report.pdf</option>
          <option>Vendor_Agreement_2026.docx</option>
          <option>Employee_Handbook.pdf</option>
        </select>
        <input 
          type="text" 
          placeholder="Search in notes..."
          className={`rounded-xl px-4 py-2 text-sm flex-1 w-full outline-none transition-colors ${
            theme === 'dark' ? 'bg-white/5 border border-white/8 text-white focus:border-white/20' : 'bg-white border border-[#0D0D0D]/8 focus:border-[#0D0D0D]/20'
          }`}
        />
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
        {notes.map(note => (
          <div 
            key={note.id}
            className={`break-inside-avoid mb-4 rounded-xl border p-4 transition-colors ${
              theme === 'dark' ? 'bg-[#0D1117] border-white/6 hover:border-white/10' : 'bg-white border-[#0D0D0D]/6 hover:border-[#0D0D0D]/10'
            }`}
          >
            <div className="flex justify-between items-start mb-3 gap-2">
              <div className={`inline-flex items-center font-mono text-[10px] rounded-full px-2 py-0.5 max-w-[80%] ${
                theme === 'dark' ? 'bg-white/6 text-white/35' : 'bg-[#0D0D0D]/6 text-[#0D0D0D]/35'
              }`}>
                <span className="truncate">{note.docName}</span>
                <span className="mx-1 opacity-50">·</span>
                <span>p.{note.page}</span>
              </div>
              <div className={`text-[10px] shrink-0 ${theme === 'dark' ? 'text-white/20' : 'text-[#0D0D0D]/20'}`}>
                {note.date}
              </div>
            </div>

            <div className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-white/65' : 'text-[#0D0D0D]/65'}`}>
              {note.color && (
                <div 
                  className="w-2 h-2 rounded-full inline-block mr-1.5 align-middle"
                  style={{ backgroundColor: note.color }}
                />
              )}
              {note.text}
            </div>

            <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-transparent">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => navigate(`/workspace/${note.docId}`)}
                  className={`flex items-center gap-1 text-[10px] transition-colors ${theme === 'dark' ? 'text-white/25 hover:text-white/50' : 'text-[#0D0D0D]/25 hover:text-[#0D0D0D]/50'}`}
                >
                  <ExternalLink className="size-3" /> Open doc
                </button>
                <button 
                  onClick={() => navigate(`/workspace/${note.docId}`)}
                  className={`flex items-center gap-1 text-[10px] transition-colors ${theme === 'dark' ? 'text-white/25 hover:text-white/50' : 'text-[#0D0D0D]/25 hover:text-[#0D0D0D]/50'}`}
                >
                  <MessageCircle className="size-3" /> Ask AI
                </button>
              </div>
              <button className={`transition-colors ${theme === 'dark' ? 'text-white/20 hover:text-red-400/60' : 'text-[#0D0D0D]/20 hover:text-red-500/60'}`}>
                <Trash2 className="size-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
