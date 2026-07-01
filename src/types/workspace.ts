// Workspace shared types

export interface Highlight {
  id: string;
  docId: string;
  pageNumber: number;
  selectedText: string;
  color: 'yellow' | 'green' | 'blue' | 'pink';
  bbox: { x: number; y: number; w: number; h: number };
  note: string;
  createdAt: string;
}

export interface DocNote {
  id: string;
  docId: string;
  content: string;
  pageRef: number;
  highlightId?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  jumpToPage?: number;
  timestamp: number;
}

export interface Citation {
  docName: string;
  page: number;
}

export interface Chunk {
  id: string;
  docId: string;
  pageNumber: number;
  sectionLabel: string;
  content: string;
  bbox?: { x: number; y: number; w: number; h: number };
}

export interface FlashCard {
  front: string;
  back: string;
  pageRef: number;
}

export interface FlashcardSet {
  id: string;
  docId: string;
  cards: FlashCard[];
  createdAt: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  pageRef: number;
}

export interface DocumentMeta {
  id: string;
  name: string;
  fileType: string;
  pageCount: number;
  status: string;
  rawUrl: string;
  language: string;
  createdAt: string;
}
