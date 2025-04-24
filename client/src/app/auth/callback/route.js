import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value;
          },
          set(name, value, options) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name, options) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );
    
    try {
      const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('Auth callback error:', error);
        return NextResponse.redirect(new URL('/auth/login?error=auth_callback_failed', requestUrl.origin));
      }

      if (!session?.user) {
        return NextResponse.redirect(new URL('/auth/login?error=no_session', requestUrl.origin));
      }

      // Check if user exists in users table
      const { data: existingUser, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('id', session.user.id)
        .single();

      if (userError && userError.code !== 'PGRST116') {
        console.error('User check error:', userError);
        return NextResponse.redirect(new URL('/auth/login?error=user_check_failed', requestUrl.origin));
      }

      // If user doesn't exist, create them
      if (!existingUser) {
        const { error: createError } = await supabase
          .from('users')
          .insert([{ 
            id: session.user.id, 
            email: session.user.email,
            created_at: new Date().toISOString()
          }]);

        if (createError) {
          console.error('User creation error:', createError);
          return NextResponse.redirect(new URL('/auth/login?error=user_creation_failed', requestUrl.origin));
        }
      }

      // Successful authentication, redirect to dashboard
      return NextResponse.redirect(new URL('/secure/dashboard', requestUrl.origin));
    } catch (error) {
      console.error('Unexpected error:', error);
      return NextResponse.redirect(new URL('/auth/login?error=unexpected_error', requestUrl.origin));
    }
  }

  // If no code is present, redirect to login
  return NextResponse.redirect(new URL('/auth/login', requestUrl.origin));
} 