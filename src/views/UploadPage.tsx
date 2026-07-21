import { useState, useRef } from 'react';
import { ArrowLeft, FileUp, CloudUpload, FileText, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import DashboardLayout from '../components/dashboard/DashboardLayout';

export default function UploadPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const { user } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files!)]);
    }
  };

  const startAnalysis = async () => {
    if (files.length === 0 || !user) return;
    setIsUploading(true);
    
    try {
      let firstDocData = null;
      let firstUrlData = null;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // 1. Upload to Supabase Storage bucket 'pdfs'
        const filePath = `${user.id}/${Date.now()}_${i}_${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('pdfs')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // 2. Save metadata to 'documents' table
        const { data: docData, error: dbError } = await supabase
          .from('documents')
          .insert({
            user_id: user.id,
            name: file.name,
            file_path: filePath,
            file_type: file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream'),
            file_size_bytes: file.size,
            status: 'ready'
          })
          .select()
          .single();

        if (dbError) throw dbError;

        // 3. Get the public or signed URL for the PDF
        const { data: urlData } = await supabase.storage
          .from('pdfs')
          .createSignedUrl(filePath, 60 * 60 * 24); // 24 hour access

        if (i === 0) {
          firstDocData = docData;
          firstUrlData = urlData;
        }
      }

      // 4. Navigate to workspace with the Supabase URL of the first document
      if (firstDocData && firstUrlData) {
        navigate(`/workspace/${firstDocData.id}`, { 
          state: { 
            fileUrl: firstUrlData.signedUrl, 
            fileName: files[0].name 
          } 
        });
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload document(s). Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex-1 flex flex-col items-center pt-8 px-6 max-w-2xl mx-auto w-full text-center">
        <FileUp className={`size-10 mb-6 ${theme === 'dark' ? 'text-white/20' : 'text-[#0D0D0D]/20'}`} />
        
        <h1 className={`text-2xl md:text-3xl font-semibold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-[#0D0D0D]'}`}>
          Upload a document
        </h1>
        
        <p className={`text-sm mt-2 mb-10 ${theme === 'dark' ? 'text-white/40' : 'text-[#0D0D0D]/40'}`}>
          PDF, DOCX, scanned images, or handwritten notes in any language. Processed by NVIDIA Nemotron OCR.
        </p>

        <div 
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`w-full rounded-2xl border-2 border-dashed p-10 md:p-16 flex flex-col items-center cursor-pointer transition-all duration-200 ${
            isDragOver 
              ? (theme === 'dark' ? 'border-white/30 bg-white/[0.05]' : 'border-[#0D0D0D]/30 bg-[#0D0D0D]/[0.05]')
              : (theme === 'dark' ? 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]' : 'border-[#0D0D0D]/10 hover:border-[#0D0D0D]/20')
          }`}
        >
          <CloudUpload className={`size-10 mb-4 ${theme === 'dark' ? 'text-white/15' : 'text-[#0D0D0D]/15'}`} />
          <div className={`text-base font-medium ${theme === 'dark' ? 'text-white/50' : 'text-[#0D0D0D]/50'}`}>
            Drag and drop your document here
          </div>
          <div className={`text-sm mt-2 ${theme === 'dark' ? 'text-white/25' : 'text-[#0D0D0D]/25'}`}>
            PDF · DOCX · PNG · JPG · up to 50MB
          </div>
          
          <button className={`mt-6 rounded-xl px-6 py-2.5 text-sm font-medium w-full sm:w-auto transition-colors ${
            theme === 'dark' ? 'bg-white text-black hover:bg-white/90' : 'bg-[#0D0D0D] text-white hover:bg-[#0D0D0D]/90'
          }`}>
            Browse files
          </button>
          
          <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef} 
            accept=".pdf,.docx,.png,.jpg,.jpeg"
            multiple
            onChange={handleFileChange}
          />
        </div>

        {files.length > 0 && (
          <div className="w-full mt-4 flex flex-col gap-2">
            {files.map((f, i) => (
              <div key={i} className={`rounded-xl border p-4 flex items-center gap-3 text-left ${theme === 'dark' ? 'bg-white/[0.03] border-white/8' : 'bg-[#0D0D0D]/[0.03] border-[#0D0D0D]/8'}`}>
                <div className={`p-1.5 rounded-lg shrink-0 ${theme === 'dark' ? 'bg-white/8 text-white/50' : 'bg-[#0D0D0D]/8 text-[#0D0D0D]/50'}`}>
                  <FileText className="size-8" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium truncate ${theme === 'dark' ? 'text-white/80' : 'text-[#0D0D0D]/80'}`}>
                    {f.name}
                  </div>
                  <div className={`text-xs ${theme === 'dark' ? 'text-white/30' : 'text-[#0D0D0D]/30'}`}>
                    {(f.size / (1024 * 1024)).toFixed(2)} MB
                  </div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); setFiles(files.filter((_, idx) => idx !== i)); }}
                  className={`p-1 transition-colors rounded-lg ${theme === 'dark' ? 'text-white/40 hover:text-white hover:bg-white/10' : 'text-[#0D0D0D]/40 hover:text-[#0D0D0D] hover:bg-[#0D0D0D]/10'}`}
                >
                  <X className="size-4" />
                </button>
              </div>
            ))}
            
            <button 
              onClick={startAnalysis}
              disabled={isUploading}
              className={`w-full rounded-xl py-3.5 text-sm font-semibold mt-4 transition-colors flex justify-center items-center gap-2 ${
                theme === 'dark' ? 'bg-white text-black hover:bg-white/90 disabled:bg-white/50' : 'bg-[#0D0D0D] text-white hover:bg-[#0D0D0D]/90 disabled:bg-[#0D0D0D]/50'
              }`}
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Uploading {files.length > 1 ? `(${files.length})` : ''}...
                </>
              ) : (
                `Start analysis ${files.length > 1 ? `(${files.length} files)` : ''}`
              )}
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
