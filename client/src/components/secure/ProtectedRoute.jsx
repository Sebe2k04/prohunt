// components/ProtectedRoute.js
'use client'; // Required for App Router

import { useRouter } from 'next/navigation';
import { useEffect, useLayoutEffect } from 'react';
import Loader from '../Loader';
import { useAuth } from '@/context/AuthProvider';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useLayoutEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
    
  }, [user, loading, router]);

  if (loading) return <div><Loader/></div>;

  if (!user) return null;

  return <>{children}</>;
}
