-- 1. Enable pgvector extension (for future AI semantic search)
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create the Documents Table
CREATE TABLE documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_path TEXT NOT NULL, -- Path to the file in the storage bucket
  file_type TEXT DEFAULT 'application/pdf',
  file_size_bytes INTEGER,
  page_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'processing', -- Status tracking (processing, ready, error)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 3. Create Document Chunks Table (Holds the extracted text pages for the AI)
CREATE TABLE document_chunks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  page_number INTEGER NOT NULL,
  content TEXT NOT NULL,
  embedding VECTOR(1024), -- The AI vector for semantic search
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 4. Create a Private Storage Bucket for PDFs
INSERT INTO storage.buckets (id, name, public) 
VALUES ('pdfs', 'pdfs', false)
ON CONFLICT (id) DO NOTHING;

-- 5. Enable Row Level Security (RLS) so users can only see their own data
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;

-- 6. Add Security Policies for the Database Tables
CREATE POLICY "Users can view their own documents" 
  ON documents FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own documents" 
  ON documents FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents" 
  ON documents FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view chunks for their documents" 
  ON document_chunks FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM documents 
      WHERE documents.id = document_chunks.document_id 
      AND documents.user_id = auth.uid()
    )
  );

-- 7. Add Security Policies for the Storage Bucket
CREATE POLICY "Users can upload their own PDFs"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'pdfs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own PDFs"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'pdfs' AND auth.uid()::text = (storage.foldername(name))[1]);
