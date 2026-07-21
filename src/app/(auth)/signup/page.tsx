'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { BrowserRouter } from 'react-router-dom';

const RegisterPage = dynamic(() => import('@/views/RegisterPage'), { ssr: false });

export default function Page() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <BrowserRouter>
      <RegisterPage />
    </BrowserRouter>
  );
}
