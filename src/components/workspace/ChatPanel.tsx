import { useState, useRef, useEffect } from 'react';
import { 
  Brain, Trash2, Download, Sparkles, List, HelpCircle, Lightbulb, 
  ArrowRight, Copy, BookmarkPlus, ThumbsUp, ThumbsDown,
  BookOpen, Mic, ArrowUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTheme } from '../../context/ThemeContext';
import { useWorkspace } from '../../context/WorkspaceContext';

function parseFollowUps(content: string): {
  cleanContent: string
  followUps: string[]
} {
  const followUpRegex = /\[\[([^\]]+)\]\]/g
  const followUps: string[] = []
  let match
  while ((match = followUpRegex.exec(content)) !== null) {
    followUps.push(match[1])
  }
  const cleanContent = content
    .replace(/\[\[([^\]]+)\]\]/g, '')
    .replace(/## Ask me next\n?/g, '')
    .trim()
  return { cleanContent, followUps }
}

function getReadingTime(text: string): string {
  const words = text.split(' ').length
  const minutes = Math.ceil(words / 200)
  return minutes <= 1 ? '< 1 min read' : `${minutes} min read`
}

export default function ChatPanel() {
  const { theme } = useTheme();
  const { chatMessages, setChatMessages, isAILoading, setIsAILoading, sendToChat, currentPage, scrollToPage } = useWorkspace();
  const [input, setInput] = useState('');
  const [useContext, setUseContext] = useState(true);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const hasMessages = chatMessages.length > 0;

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAILoading]);

  useEffect(() => {
    if (!isAILoading) return;
    const timeout = setTimeout(() => {
      setIsAILoading(false);
    }, 30000);
    return () => clearTimeout(timeout);
  }, [isAILoading, setIsAILoading]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = '36px';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = Math.min(scrollHeight, 120) + 'px';
    }
  };

  const handleSend = () => {
    if (!input.trim() || isAILoading) return;
    sendToChat(input.trim(), useContext);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = '36px';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    if (confirm('Clear all messages?')) {
      setChatMessages([]);
    }
  };

  const bubbles = [
    { icon: Sparkles, text: "Summarize this entire document", sendText: "Please give me a comprehensive executive summary of this document. Include key points, main sections, critical items, and your top takeaways. Use structured formatting with headers." },
    { icon: List, text: "Create structured notes", sendText: "Create detailed study notes from this document. Organize by section with bullet points for key concepts, important facts, and any definitions or terminology. Include page references throughout." },
    { icon: HelpCircle, text: "What are the main topics?", sendText: "Analyze this document and identify all major topics and themes. For each topic explain: what it covers, why it matters, and which pages cover it. Use a structured format." },
    { icon: Lightbulb, text: "Generate flashcards", sendText: "Generate 15 comprehensive study flashcards from this document. Make them challenging — include definitions, applications, comparisons, and critical thinking questions. Cover all major sections of the document." }
  ];

  const renderMessageContent = (content: string) => {
    const parts = content.split(/(\[.*?p\.\d+\])/g);
    return parts.map((part, i) => {
      const match = part.match(/\[.*?p\.(\d+)\]/);
      if (match) {
        const pageNum = parseInt(match[1], 10);
        return (
          <span 
            key={i} 
            onClick={() => scrollToPage(pageNum)}
            className={`inline-flex items-center gap-1 text-[10px] font-mono rounded-full px-2 py-0.5 cursor-pointer mx-1 ${
              theme === 'dark' ? 'bg-white/8 text-white/40 hover:text-white/70' : 'bg-[#0D0D0D]/8 text-[#0D0D0D]/40 hover:text-[#0D0D0D]/70'
            }`}
          >
            {part}
          </span>
        );
      }
      // Extremely basic markdown bold and bullet list renderer just for the demo string
      if (part.includes('•')) {
        return (
          <div key={i}>
            {part.split('\n').map((line, l_idx) => {
              if (line.startsWith('•')) {
                return <li key={l_idx} className="ml-3">{line.replace('• ', '')}</li>;
              }
              return <div key={l_idx}>{line}</div>;
            })}
          </div>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className={`h-full flex flex-col ${theme === 'dark' ? 'bg-[#0D1117] border-l border-white/8' : 'bg-[#FAFAF8] border-l border-[#0D0D0D]/8'}`}>
      
      {/* Header */}
      <div className={`h-10 shrink-0 flex items-center justify-between px-3 border-b ${theme === 'dark' ? 'border-white/6' : 'border-[#0D0D0D]/6'}`}>
        <div className={`flex items-center gap-1.5 text-xs font-medium ${theme === 'dark' ? 'text-white/60' : 'text-[#0D0D0D]/60'}`}>
          <Brain className="w-3.5 h-3.5" />
          DocIntel AI
        </div>
        <div className="flex gap-1">
          <button onClick={clearChat} className={`rounded-lg p-2 transition-colors active:scale-95 duration-100 ${theme === 'dark' ? 'text-white/30 hover:text-white/70' : 'text-[#0D0D0D]/30 hover:text-[#0D0D0D]/70'}`}>
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => {
              const text = chatMessages.map(m => `${m.role.toUpperCase()}:\n${m.content}`).join('\n\n');
              const blob = new Blob([text], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `chat_export.txt`;
              a.click();
            }}
            className={`rounded-lg p-1 transition-colors ${theme === 'dark' ? 'text-white/30 hover:text-white/70' : 'text-[#0D0D0D]/30 hover:text-[#0D0D0D]/70'}`}
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-3 py-3 flex flex-col gap-3 relative">
        <AnimatePresence>
          {!hasMessages && (
            <motion.div 
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -8, transition: { duration: 0.3 } }}
              className="px-3 pt-4 pb-2"
            >
              <div className={`text-xs text-center mb-4 ${theme === 'dark' ? 'text-white/25' : 'text-[#0D0D0D]/25'}`}>
                Ask anything about this document
              </div>
              <div className="grid grid-cols-2 gap-2">
                {bubbles.map((b, i) => (
                  <div 
                    key={i}
                    onClick={() => sendToChat(b.sendText || b.text)}
                    className={`rounded-xl px-2.5 py-2.5 cursor-pointer text-left transition-all active:scale-95 duration-100 border ${
                      theme === 'dark' 
                        ? 'bg-white/[0.03] border-white/8 hover:bg-white/[0.06] text-white/55' 
                        : 'bg-[#0D0D0D]/[0.03] border-[#0D0D0D]/8 hover:bg-[#0D0D0D]/[0.06] text-[#0D0D0D]/55'
                    }`}
                  >
                    <b.icon className={`w-3 h-3 mb-1.5 block ${theme === 'dark' ? 'text-white/25' : 'text-[#0D0D0D]/25'}`} />
                    <div className="text-[11px] leading-relaxed">{b.text}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {chatMessages.map(msg => {
          const { cleanContent, followUps } = msg.role === 'assistant' ? parseFollowUps(msg.content) : { cleanContent: msg.content, followUps: [] };
          return (
          <div key={msg.id} className={`flex flex-col group ${msg.role === 'user' ? 'self-end max-w-[85%]' : 'self-start max-w-[90%]'}`}>
            <div className={`px-3 py-2.5 text-xs leading-relaxed whitespace-pre-wrap ${
              msg.role === 'user'
                ? (theme === 'dark' ? 'bg-white/8 text-white rounded-2xl rounded-br-sm' : 'bg-[#0D0D0D]/8 text-[#0D0D0D] rounded-2xl rounded-br-sm')
                : (theme === 'dark' ? 'bg-white/[0.04] border border-white/6 text-white/80 rounded-2xl rounded-bl-sm' : 'bg-white border border-[#0D0D0D]/8 text-[#0D0D0D]/80 rounded-2xl rounded-bl-sm')
            }`}>
              {msg.role === 'assistant' ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h2: ({node, ...props}) => (
                      <h2 className="text-xs font-semibold text-white/80 mt-3 mb-1" {...props} />
                    ),
                    h3: ({node, ...props}) => (
                      <h3 className="text-xs font-medium text-white/70 mt-2 mb-1" {...props} />
                    ),
                    p: ({node, ...props}) => (
                      <p className="text-xs text-white/70 leading-relaxed mb-1.5" {...props} />
                    ),
                    ul: ({node, ...props}) => (
                      <ul className="list-disc list-inside space-y-1 mb-1.5 text-xs text-white/70" {...props} />
                    ),
                    li: ({node, ...props}) => (
                      <li className="text-xs text-white/65 leading-relaxed" {...props} />
                    ),
                    strong: ({node, ...props}) => (
                      <strong className="font-semibold text-white/90" {...props} />
                    ),
                    blockquote: ({node, ...props}) => (
                      <blockquote className="border-l-2 border-white/20 pl-3 my-2 text-white/50 italic text-xs" {...props} />
                    ),
                    code: ({node, inline, ...props}: any) => inline ? (
                      <code className="font-mono text-xs bg-white/8 px-1.5 py-0.5 rounded text-white/70" {...props} />
                    ) : (
                      <code className="block font-mono text-xs bg-white/5 border border-white/8 rounded-xl p-3 my-2 text-white/60 overflow-x-auto" {...props} />
                    ),
                    table: ({node, ...props}) => (
                      <div className="overflow-x-auto my-3">
                        <table className="w-full text-xs border-collapse" {...props} />
                      </div>
                    ),
                    th: ({node, ...props}) => (
                      <th className="text-left px-3 py-2 text-white/50 font-medium border-b border-white/10" {...props} />
                    ),
                    td: ({node, ...props}) => (
                      <td className="px-3 py-2 text-white/60 border-b border-white/6" {...props} />
                    ),
                    hr: ({node, ...props}) => (
                      <hr className="border-white/10 my-4" {...props} />
                    ),
                  }}
                >
                  {cleanContent}
                </ReactMarkdown>
              ) : (
                msg.content
              )}
            </div>
            {msg.role === 'assistant' && (
              <div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] text-white/20">
                    {getReadingTime(msg.content)}
                  </span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => navigator.clipboard.writeText(cleanContent)} className={`p-1 transition-colors ${theme === 'dark' ? 'text-white/20 hover:text-white/50' : 'text-[#0D0D0D]/20 hover:text-[#0D0D0D]/50'}`}>
                      <Copy className="w-3 h-3" />
                    </button>
                    <button className={`p-1 transition-colors ${theme === 'dark' ? 'text-white/20 hover:text-white/50' : 'text-[#0D0D0D]/20 hover:text-[#0D0D0D]/50'}`}>
                      <ThumbsUp className="w-3 h-3" />
                    </button>
                    <button className={`p-1 transition-colors ${theme === 'dark' ? 'text-white/20 hover:text-white/50' : 'text-[#0D0D0D]/20 hover:text-[#0D0D0D]/50'}`}>
                      <ThumbsDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                {followUps.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {followUps.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => sendToChat(q)}
                        className="liquid-glass rounded-full px-3 py-1.5 text-xs text-white/50 hover:text-white/80 hover:scale-105 transition-all duration-150 text-left bg-white/[0.04] border border-white/10"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )})}
        
        {isAILoading && (() => {
          const lastMsg = chatMessages[chatMessages.length - 1];
          const hasStreamingContent = lastMsg?.role === 'assistant' && lastMsg.content.length > 0;
          
          if (!hasStreamingContent && chatMessages[chatMessages.length - 1]?.content === '') {
            return (
              <div className="flex items-center gap-1.5 px-3 py-2 text-[11px] text-white/35 italic mt-1">
                <div className="flex gap-1">
                  {[0,1,2].map(i => (
                    <div key={i}
                      className="w-1 h-1 rounded-full bg-white/35 animate-bounce"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </div>
                <span>Analyzing document...</span>
              </div>
            );
          }
          
          return (
            <div className="text-[10px] text-white/20 mt-1 px-3">
              <span className="animate-pulse">●</span> Generating response...
            </div>
          );
        })()}
        <div ref={endOfMessagesRef} />
      </div>

      {/* Chat Input */}
      <div className="shrink-0 px-3 pb-[env(safe-area-inset-bottom,12px)] pt-2">
        {useContext && (
          <div 
            onClick={() => setUseContext(false)}
            className={`inline-flex items-center gap-1.5 text-[10px] rounded-full px-2.5 py-1 mb-1.5 cursor-pointer border transition-colors ${
              theme === 'dark' ? 'bg-white/5 text-white/40 border-white/8 hover:bg-white/10' : 'bg-[#0D0D0D]/5 text-[#0D0D0D]/40 border-[#0D0D0D]/8 hover:bg-[#0D0D0D]/10'
            }`}
          >
            <BookOpen className="w-3 h-3" />
            p.{currentPage} context · tap to off
          </div>
        )}

        <div className={`rounded-2xl p-2 transition-all duration-200 border ${
          theme === 'dark' 
            ? 'bg-white/[0.04] border-white/10 focus-within:border-white/20' 
            : 'bg-white border-[#0D0D0D]/10 focus-within:border-[#0D0D0D]/20'
        }`}>
          <textarea
            id="chat-textarea"
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (window.innerWidth < 768) {
                document.documentElement.style.setProperty('--keyboard-height', '0px');
                setTimeout(() => endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' }), 300);
              }
            }}
            placeholder="Ask about this document..."
            className={`w-full bg-transparent resize-none outline-none text-sm py-2 min-h-[36px] max-h-[80px] sm:max-h-[120px] ${
              theme === 'dark' ? 'text-white placeholder:text-white/20' : 'text-[#0D0D0D] placeholder:text-[#0D0D0D]/20'
            }`}
          />
          <div className="flex items-center justify-between mt-1.5">
            <div className="flex gap-1">
              <button className={`p-1.5 rounded-lg transition-colors active:scale-95 duration-100 ${theme === 'dark' ? 'text-white/20 hover:bg-white/5 hover:text-white/60' : 'text-[#0D0D0D]/20 hover:bg-[#0D0D0D]/5 hover:text-[#0D0D0D]/60'}`}>
                <Mic className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setUseContext(!useContext)}
                className={`hidden sm:block p-1.5 rounded-lg transition-colors active:scale-95 duration-100 ${useContext ? 'text-emerald-400' : (theme === 'dark' ? 'text-white/20' : 'text-[#0D0D0D]/20')} ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-[#0D0D0D]/5'}`}
              >
                <BookOpen className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              {input.length > 150 && (
                <span className={`text-[10px] ${theme === 'dark' ? 'text-white/20' : 'text-[#0D0D0D]/20'}`}>
                  {input.length}/500
                </span>
              )}
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isAILoading}
                className={`flex items-center justify-center w-9 h-9 sm:w-auto sm:h-auto rounded-xl p-2 sm:p-1.5 transition-opacity active:scale-95 duration-100 ${
                  theme === 'dark' ? 'bg-white text-black' : 'bg-[#0D0D0D] text-white'
                } disabled:opacity-30 disabled:cursor-not-allowed`}
              >
                <ArrowUp className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
              </button>
            </div>
          </div>
        </div>
        
        <div className={`hidden sm:block text-[10px] text-center mt-1.5 ${theme === 'dark' ? 'text-white/15' : 'text-[#0D0D0D]/15'}`}>
          Press / to focus · Enter to send · Shift+Enter for new line
        </div>
      </div>
    </div>
  );
}
