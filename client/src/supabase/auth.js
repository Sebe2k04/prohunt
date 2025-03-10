import { supabase } from "@/lib/supabase";

export const login = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const googleLogin  = async() => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google"

  })
  if (error) throw error;
  return data;
  
}

export const sendOtp = async (email) => {
  const { data, error } = await supabase.auth.signInWithOtp({ email });
  if (error) {
    throw error;
  } else {
    return data;
  }
};

export const signup = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw error;
    console.log(error);
  }

  const { data: userData, error: dataError } = await supabase
    .from("users")
    .insert([{ id: data.user.id, email }]);

  if (dataError) throw error;
  // return data;

  return { user: userData, message: "User signed up successfully" };

  // const { data, error } = await supabase.auth.verifyOtp({
  //   email,
  //   token: otp,
  //   type: "email",
  // });

  // if (error) {
  //   throw error;
  // }

  // // Update user's password
  // const { data: userData, error: updateError } = await supabase.auth.updateUser(
  //   {
  //     password,
  //   }
  // );

  // if (updateError) {
  //   throw error;
  // } else {
  //   return userData;
  // }
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
