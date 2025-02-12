// lib/AuthContext.js
"use client"; // Required for App Router

import { supabase } from "@/lib/supabase";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const path = usePathname();
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        console.log(session.user);

        // Fetch user's role from Supabase
        if (path.startsWith("/admin")) {
          const { data, error } = await supabase
            .from("admin") // Replace with your table name
            .select("*")
            .eq("admin_id", session.user.id)
            .single();

          if (data) setIsAdmin(true);
          if (error) console.log("Error fetching role:", error.message);
        }
      } else {
        setUser(null);
        console.log("no user");
      }
      setLoading(false);
    };

    // Listen for auth state changes
    const { data: subscription } = supabase.auth.onAuthStateChange(() => {
      checkSession();
    });

    checkSession();

    return () => subscription?.unsubscribe();

  }, []);

  return (
    <AuthContext.Provider value={{ user, loading,isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
