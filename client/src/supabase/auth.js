import { supabase } from "@/lib/supabase";

export const login = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Login error:', error);
      throw error;
    }
    
    if (!data?.user) {
      throw new Error('No user data returned');
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Login process error:', error);
    return { data: null, error };
  }
};

export const googleLogin = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    
    if (error) {
      console.error('Google login error:', error);
      throw error;
    }
    
    if (!data?.url) {
      throw new Error('No redirect URL returned');
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Google login process error:', error);
    return { data: null, error };
  }
};

export const sendOtp = async (email) => {
  const { data, error } = await supabase.auth.signInWithOtp({ email });
  if (error) {
    throw error;
  } else {
    return data;
  }
};

export const checkEmailExists = async (email) => {
  const { data, error } = await supabase
    .from("users")
    .select("email")
    .eq("email", email)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is the error code for no rows returned
    throw error;
  }

  return !!data;
};

export const signup = async (email, password) => {
  try {
    // First check if email exists
    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      throw new Error("Email already registered. Please login instead.");
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Signup error:", error);
      throw error;
    }

    if (data?.user) {
      const { data: userData, error: dataError } = await supabase
        .from("users")
        .insert([{ 
          id: data.user.id, 
          email,
          created_at: new Date().toISOString()
        }]);

      if (dataError) {
        console.error("User data insertion error:", dataError);
        throw dataError;
      }

      return { user: userData, message: "User signed up successfully" };
    }

    throw new Error("No user data returned from signup");
  } catch (error) {
    console.error("Signup process error:", error);
    throw error;
  }
};

export const resendSignUpOtp = async (email) => {
  const { error } = await supabase.auth.resend({
    type: "signup",
    email: email,
    options: {
      emailRedirectTo: "https://example.com/welcome",
    },
  });
  if (error) {
    throw error
  }
};

// export const forgotPassword = async () => {
//   const { error } = await supabase.auth.resetPasswordForEmail(email, {
//     redirectTo: window.location.origin + "/reset-password",
//   });
//   if (error) {
//     throw error;
//   }
//   return { message: "Reset password email sent successfully" };
// };

export const verifyOtp = async (email, otp) => {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: otp,
    type: "email",
  });

  if (error) {
    throw error;
  }

  return data;
};

export const resetPassword = async (otp, email, password) => {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: otp,
    type: "email",
    password: password,
  });
  console.log(email);

  if (error) {
    throw error;
    console.log(error);
  }

  return data;
};

export const adminSessionValidation = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const { error: fetchError } = await supabase
    .from("admin")
    .select("*")
    .eq("email", session.email)
    .single();
  if (fetchError) {
    console.log("Error fetching AdminUser:", fetchError);
    return null;
  }
  return session;
};

export const adminLogin = async (email, password) => {
  const { error: fetchError } = await supabase
    .from("admin")
    .select("*")
    .eq("email", email)
    .single();
  if (fetchError) {
    // console.error("Error fetching AdminUser:", error.message);
    throw fetchError;
  } else {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    return authData;
  }
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
  return { message: "Logged out successfully!" };
};
