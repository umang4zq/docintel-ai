import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './views/LandingPage';
import LoginPage from './views/LoginPage';
import RegisterPage from './views/RegisterPage';
import DashboardPage from './views/DashboardPage';
import UploadPage from './views/UploadPage';
import DocumentsPage from './views/DocumentsPage';
import SavedPDFsPage from './views/SavedPDFsPage';
import NotesPage from './views/NotesPage';
import HowItWorksPage from './views/HowItWorksPage';
import PricingPage from './views/PricingPage';
import CapabilitiesPage from './views/CapabilitiesPage';
import UseCasesPage from './views/UseCasesPage';
import WorkspacePage from './views/WorkspacePage';
import AboutPage from './views/AboutPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0D1117]">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/capabilities" element={<CapabilitiesPage />} />
        <Route path="/use-cases" element={<UseCasesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute><DashboardPage /></ProtectedRoute>
        } />
        <Route path="/upload" element={
          <ProtectedRoute><UploadPage /></ProtectedRoute>
        } />
        <Route path="/documents" element={
          <ProtectedRoute><DocumentsPage /></ProtectedRoute>
        } />
        <Route path="/saved" element={
          <ProtectedRoute><SavedPDFsPage /></ProtectedRoute>
        } />
        <Route path="/notes" element={
          <ProtectedRoute><NotesPage /></ProtectedRoute>
        } />
        <Route path="/workspace/demo" element={<WorkspacePage />} />
        <Route path="/workspace/:docId" element={
          <ProtectedRoute><WorkspacePage /></ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const isAllowedUrl = typeof window !== 'undefined' && (
    window.location.origin === 'http://13.235.245.132:3001' ||
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  );

  if (!isAllowedUrl) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#0D1117',
        color: '#FFFFFF',
        fontFamily: 'sans-serif',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '24px', marginBottom: '16px', color: '#FF453A' }}>Access Denied</h1>
        <p style={{ fontSize: '16px', color: '#8B949E' }}>
          This application is restricted and can only run on the authorized URL:
        </p>
        <code style={{
          marginTop: '12px',
          padding: '8px 16px',
          backgroundColor: '#161B22',
          borderRadius: '6px',
          border: '1px solid #30363D',
          color: '#58A6FF'
        }}>
          http://13.235.245.132:3001/
        </code>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AnimatedRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
