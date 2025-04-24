// components/ProtectedRoute.js
'use client'; // Required for App Router

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { supabase } from '@/lib/supabase';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          router.push('/auth/login');
          return;
        }

        if (!session) {
          console.log('No active session found');
          router.push('/auth/login');
          return;
        }

        setIsChecking(false);
      } catch (error) {
        console.error('Unexpected error during session check:', error);
        router.push('/auth/login');
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        router.push('/auth/login');
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [router]);

  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return children;
}
