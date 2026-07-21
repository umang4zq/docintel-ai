import { motion } from 'framer-motion';
import { Scale, FlaskConical, Building2, GraduationCap, Stethoscope, Code2, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { useTheme } from '../context/ThemeContext';

export default function UseCasesPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const useCases = [
    {
      icon: Scale,
      tag: "Legal",
      title: "Contract and case analysis",
      body: "Upload hundreds of contracts, NDAs, or case files. Ask questions across all of them — 'Which contracts have auto-renewal clauses?' or 'Find all indemnity terms.' Get cited answers with exact page references.",
      example: "Which of our vendor contracts contain liability caps below ₹10 lakhs?"
    },
    {
      icon: FlaskConical,
      tag: "Research",
      title: "Academic literature review",
      body: "Upload research papers, journals, and reports. DocIntel maps how papers reference each other, flags contradictions between studies, and lets you ask synthesis questions across your entire library.",
      example: "What do these 40 papers agree and disagree on regarding transformer attention mechanisms?"
    },
    {
      icon: Building2,
      tag: "Finance",
      title: "Financial report intelligence",
      body: "Upload annual reports, earnings transcripts, and filings. Ask questions across multiple quarters or compare companies — all with exact [Doc, p.N] citations pointing to the original numbers.",
      example: "How did NVIDIA's gross margin change between Q1 and Q4 2024 across these earnings reports?"
    },
    {
      icon: GraduationCap,
      tag: "Education",
      title: "Study and exam preparation",
      body: "Upload textbooks, lecture notes, and past papers. Generate flashcards, take AI quizzes, and ask the AI to explain any concept — with the exact page from your notes cited in the answer.",
      example: "Generate 20 flashcards from Chapter 5 of this networking textbook."
    },
    {
      icon: Stethoscope,
      tag: "Healthcare",
      title: "Clinical document analysis",
      body: "Process patient records, lab reports, and medical literature in any language including Hindi and Gujarati. Extract structured data and surface relevant clinical information with citations.",
      example: "Summarise all abnormal lab values across these 12 patient records."
    },
    {
      icon: Code2,
      tag: "Engineering",
      title: "Technical documentation Q&A",
      body: "Upload API docs, architecture documents, and runbooks. Ask questions across your entire technical knowledge base and get answers that cite the exact section and page of the relevant spec.",
      example: "What authentication method does our API use according to the v2 spec?"
    }
  ];

  const quotes = [
    {
      text: "We cut contract review time from 3 days to 45 minutes. The citations mean we can verify every answer instantly.",
      author: "— Legal team, mid-size law firm",
      stars: 5
    },
    {
      text: "DocIntel found contradictions between two research papers that we'd missed for months. The knowledge graph is genuinely impressive.",
      author: "— PhD researcher, IIT Ahmedabad",
      stars: 0
    },
    {
      text: "Feeding our entire financial model library and asking questions in plain English — this is what we needed. Cited answers make it trustworthy.",
      author: "— Analyst, private equity firm",
      stars: 0
    }
  ];

  return (
    <PageWrapper
      eyebrow="Who uses DocIntel"
      heading="Built for every document-heavy workflow"
      subtext="From legal firms to research teams — any team that works with large document corpora."
    >
      <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8">
        {useCases.map((uc, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className={`rounded-2xl p-8 border ${theme === 'dark' ? 'bg-[#161B22] border-white/8' : 'bg-white border-[#0D0D0D]/8'}`}
          >
            <div className="flex items-center gap-3 mb-6">
              <uc.icon className={`w-6 h-6 ${theme === 'dark' ? 'text-white/80' : 'text-[#0D0D0D]/80'}`} />
              <span className={`text-[10px] uppercase tracking-widest font-semibold ${theme === 'dark' ? 'text-white/40' : 'text-[#0D0D0D]/40'}`}>
                {uc.tag}
              </span>
            </div>
            
            <h3 className={`text-xl font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-[#0D0D0D]'}`}>
              {uc.title}
            </h3>
            
            <p className={`text-sm leading-relaxed mb-6 ${theme === 'dark' ? 'text-white/70' : 'text-[#0D0D0D]/70'}`}>
              {uc.body}
            </p>
            
            <div className={`mt-4 rounded-xl p-4 text-sm italic ${theme === 'dark' ? 'bg-white/5 text-white/50' : 'bg-[#0D0D0D]/5 text-[#0D0D0D]/50'}`}>
              "{uc.example}"
            </div>
          </motion.div>
        ))}
      </div>

      <div className={`mt-24 py-16 border-t border-b ${theme === 'dark' ? 'border-white/8' : 'border-[#0D0D0D]/8'}`}>
        <div className="flex flex-col md:flex-row flex-wrap gap-4 md:gap-6 justify-center">
          {quotes.map((quote, idx) => (
            <div key={idx} className={`max-w-sm rounded-2xl p-6 border text-sm ${
              theme === 'dark' ? 'bg-[#161B22] border-white/8' : 'bg-white border-[#0D0D0D]/8'
            }`}>
              {quote.stars > 0 && (
                <div className="flex gap-1 mb-4">
                  {[...Array(quote.stars)].map((_, i) => (
                    <Star key={i} className="text-amber-400 w-3 h-3 fill-current" />
                  ))}
                </div>
              )}
              <p className={`italic mb-4 leading-relaxed ${theme === 'dark' ? 'text-white/80' : 'text-[#0D0D0D]/80'}`}>
                "{quote.text}"
              </p>
              <p className={`font-medium ${theme === 'dark' ? 'text-white/50' : 'text-[#0D0D0D]/50'}`}>
                {quote.author}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-24 text-center">
        <h2 className={`font-['Instrument_Serif'] text-4xl md:text-6xl tracking-tight ${theme === 'dark' ? 'text-white' : 'text-[#0D0D0D]'}`}>
          Ready to try it?
        </h2>
        <p className={`mt-4 mb-10 ${theme === 'dark' ? 'text-white/50' : 'text-[#0D0D0D]/50'}`}>
          3 free credits. No card required.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => navigate('/register')}
            className={`w-full sm:w-auto rounded-full px-8 py-4 font-medium transition-transform hover:scale-105 ${
              theme === 'dark' ? 'bg-white text-black' : 'bg-[#0D0D0D] text-white'
            }`}
          >
            Start for free
          </button>
          <button 
            onClick={() => navigate('/how-it-works')}
            className={`w-full sm:w-auto border rounded-full px-8 py-4 font-medium transition-colors ${
              theme === 'dark' ? 'border-white/20 text-white/70 hover:bg-white/5' : 'border-[#0D0D0D]/20 text-[#0D0D0D]/70 hover:bg-[#0D0D0D]/5'
            }`}
          >
            See how it works
          </button>
        </div>
      </div>
    </PageWrapper>
  );
}
