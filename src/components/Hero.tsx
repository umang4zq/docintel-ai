import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import DashboardMockup from './DashboardMockup';
import { ArrowUp, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Hero() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <section 
      className="relative min-h-[100svh] overflow-hidden bg-cover bg-center flex flex-col pt-20"
      style={{ backgroundImage: 'url(https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260611_133301_d5f2a94a-b22e-4e4a-a6b6-eacdddf1f5b0.png&w=1280&q=85)' }}
    >
      <Navbar />
      
      {/* Spacer between nav and hero content */}
      <div className="flex-1 min-h-8 sm:min-h-12 lg:min-h-16 shrink-0" />
      
      {/* Hero Content */}
      <div className="relative z-20 flex flex-col items-center text-center px-5 sm:px-8 max-w-4xl mx-auto w-full">
        <h1 className="text-gray-900 font-normal leading-[1.05] tracking-tight text-[40px] min-[400px]:text-[44px] sm:text-6xl lg:text-7xl xl:text-[80px]">
          <div className="animate-fade-up">Understand every document.</div>
          <div className="animate-fade-up [animation-delay:100ms]">Instantly.</div>
        </h1>

        <form 
          className="animate-fade-up [animation-delay:220ms] mt-5 sm:mt-6 w-full max-w-xl flex items-center gap-3 rounded-full bg-white/60 backdrop-blur-md ring-1 ring-gray-200 pl-5 pr-1.5 py-1.5"
          onSubmit={(e) => e.preventDefault()}
        >
          <input 
            type="text"
            placeholder="Drop a PDF or paste a doc URL"
            className="flex-1 bg-transparent text-sm sm:text-base text-gray-900 placeholder-gray-500 outline-none py-2"
          />
          <button 
            type="button"
            onClick={() => navigate(user ? '/dashboard' : '/register')}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-900 text-white hover:scale-105 active:scale-95 transition-transform shrink-0 flex items-center justify-center"
          >
            <ArrowUp className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
          </button>
        </form>

        <p className="animate-fade-up [animation-delay:340ms] mt-4 sm:mt-5 text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-md">
          Turn PDFs, scanned files, handwritten notes, and mixed-language documents into a searchable intelligence layer.
        </p>

        <div className="animate-fade-up [animation-delay:460ms] mt-4 sm:mt-5 flex flex-wrap items-center justify-center gap-3">
          <button onClick={() => navigate(user ? '/dashboard' : '/register')} className="bg-gray-900 text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-gray-800 hover:shadow-lg transition-all">
            {user ? 'Go to Dashboard' : 'Try Free'}
          </button>
          <button onClick={() => { const el = document.getElementById('pipeline'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} className="text-gray-700 text-sm font-medium px-6 py-2.5 rounded-full ring-1 ring-gray-300 hover:bg-gray-100 transition-colors">
            See Pipeline
          </button>
        </div>
      </div>

      {/* Spacer between hero content and dashboard */}
      <div className="flex-1 min-h-10 sm:min-h-12 lg:min-h-16 shrink-0" />

      {/* Dashboard Mockup */}
      <DashboardMockup />

      {/* Grass Overlay */}
      <img 
        src="https://res.cloudinary.com/dy5er7kv5/image/upload/q_auto/f_auto/v1781191264/grass_eam204.png" 
        alt=""
        className="pointer-events-none absolute bottom-0 left-0 z-10 w-full select-none"
      />
    </section>
  );
}
