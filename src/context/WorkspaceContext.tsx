'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { chatWithDoc } from '../lib/docIntelAI';
import type { Message, Chunk } from '../types/workspace';

export interface Note {
  id: string;
  text: string;
  pageRef: number;
}

export interface Highlight {
  id: string;
  text: string;
  color: string;
  pageRef: number;
  rects: DOMRect[];
}

interface WorkspaceContextType {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  setTotalPages: (pages: number) => void;
  highlights: Highlight[];
  setHighlights: (highlights: Highlight[]) => void;
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  chatMessages: Message[];
  setChatMessages: (msgs: Message[] | ((prev: Message[]) => Message[])) => void;
  isAILoading: boolean;
  setIsAILoading: (loading: boolean) => void;
  scrollToPage: (page: number) => void;
  sendToChat: (message: string, useContext?: boolean) => void;
  panelSizes: number[];
  setPanelSizes: (sizes: number[]) => void;
  showNotes: boolean;
  setShowNotes: (show: boolean) => void;
  showFlashcards: boolean;
  setShowFlashcards: (show: boolean) => void;
  docTitle: string;
  fileUrl?: string;
  documentChunks: Chunk[];
  setDocumentChunks: (chunks: Chunk[]) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children, docId, customFileUrl, customFileName }: { children: ReactNode; docId: string; customFileUrl?: string; customFileName?: string }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isAILoading, setIsAILoading] = useState(false);
  const [panelSizes, setPanelSizes] = useState([70, 30]);
  const [showNotes, setShowNotes] = useState(false);
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [documentChunks, setDocumentChunks] = useState<Chunk[]>([]);
  
  const docTitle = customFileName || (docId === 'demo' ? 'Demo Document' : 'Document ' + docId);
  const fileUrl = customFileUrl;

  const [chatMessages, setChatMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(`chat_${docId}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return docId === 'demo' ? [
      { id: '1', role: 'user', content: 'Summarize this document', timestamp: Date.now() },
      { id: '2', role: 'assistant', content: `This document covers Web Content Accessibility Guidelines (WCAG) 2.1 — the international standard for web accessibility. It defines how to make web content more accessible to people with disabilities. [WCAG 2.1, p.1]\n\nKey sections include:\n• Perceivable — content must be presentable in ways users can perceive [p.8]\n• Operable — UI components must be operable [p.24]\n• Understandable — information must be clear [p.38]\n• Robust — content must be interpreted by assistive technologies [p.52]`, timestamp: Date.now() }
    ] : [];
  });

  useEffect(() => {
    localStorage.setItem(`chat_${docId}`, JSON.stringify(chatMessages));
  }, [chatMessages, docId]);

  const scrollToPage = (page: number) => {
    window.dispatchEvent(new CustomEvent('scrollToPage', { detail: page }));
  };

  const sendToChat = async (message: string, useContext: boolean = true) => {
    const newMessage: Message = { id: Date.now().toString(), role: 'user', content: message, timestamp: Date.now() };
    setChatMessages(prev => [...prev, newMessage]);
    setIsAILoading(true);
    
    try {
      const chunksToUse = documentChunks.length > 0 ? documentChunks : [
        { id: 'c1', docId: 'demo', pageNumber: currentPage, sectionLabel: 'Current', content: 'This is a placeholder text for page ' + currentPage }
      ];
      
      const aiMessageId = (Date.now()+1).toString();
      setChatMessages(prev => [...prev, { id: aiMessageId, role: 'assistant', content: '', timestamp: Date.now() }]);
      
      // Use the existing chatMessages plus the new user message as history
      const history = [...chatMessages, newMessage];
      
      const stream = chatWithDoc(message, history, chunksToUse, useContext ? currentPage : undefined, docTitle);
      
      for await (const chunk of stream) {
        setChatMessages(prev => prev.map(msg => 
          msg.id === aiMessageId ? { ...msg, content: msg.content + chunk } : msg
        ));
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errMessageId = (Date.now()+2).toString();
      setChatMessages(prev => [...prev, { id: errMessageId, role: 'assistant', content: 'Sorry, I encountered an error. Check console for details.', timestamp: Date.now() }]);
    } finally {
      setIsAILoading(false);
    }
  };

  return (
    <WorkspaceContext.Provider value={{
      currentPage, setCurrentPage,
      totalPages, setTotalPages,
      highlights, setHighlights,
      notes, setNotes,
      chatMessages, setChatMessages,
      isAILoading, setIsAILoading,
      scrollToPage, sendToChat,
      panelSizes, setPanelSizes,
      showNotes, setShowNotes,
      showFlashcards, setShowFlashcards,
      docTitle, fileUrl,
      documentChunks, setDocumentChunks
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}
