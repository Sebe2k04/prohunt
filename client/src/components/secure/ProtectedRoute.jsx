// components/ProtectedRoute.js
'use client'; // Required for App Router

import { useAuth } from '@/context/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useLayoutEffect } from 'react';
import Loader from '../Loader';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useLayoutEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login'); // Redirect to login if unauthenticated
    }
    
  }, [user, loading, router]);

  if (loading) return <div><Loader/></div>; // Show a loading state while checking auth

  if (!user) return null; // Avoid rendering content before redirect

  return <>{children}</>;
}
