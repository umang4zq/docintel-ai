'use client';

import React, { useEffect, useState } from 'react';

interface URLGuardProps {
  children: React.ReactNode;
}

export default function URLGuard({ children }: URLGuardProps) {
  const [isClient, setIsClient] = useState(false);
  const [isAllowed, setIsAllowed] = useState(true);

  useEffect(() => {
    setIsClient(true);
    const origin = window.location.origin;
    const hostname = window.location.hostname;
    
    const allowed = (
      origin === 'http://13.235.245.132:3001' ||
      hostname === 'localhost' ||
      hostname === '127.0.0.1'
    );
    
    setIsAllowed(allowed);
  }, []);

  if (!isClient) {
    // Avoid layout flashes during server-side rendering/hydration
    return (
      <div style={{ backgroundColor: '#0D1117', minHeight: '100vh' }} />
    );
  }

  if (!isAllowed) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
        backgroundColor: '#0D1117',
        color: '#FFFFFF',
        fontFamily: 'sans-serif',
        padding: '20px',
        textAlign: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 99999
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

  return <>{children}</>;
}
