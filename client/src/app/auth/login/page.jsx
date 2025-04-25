"use client";
import { useAuth } from "@/context/AuthProvider";
import { googleLogin, login } from "@/supabase/auth";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();
  
  useEffect(() => {
    if (user) {
      router.push("/secure/dashboard");
    }
  }, [user, router]);

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      switch (error) {
        case "auth_callback_failed":
          toast.error("Authentication failed. Please try again.");
          break;
        case "no_session":
          toast.error("No active session found. Please login again.");
          break;
        case "user_check_failed":
          toast.error("Error checking user account. Please try again.");
          break;
        case "user_creation_failed":
          toast.error("Error creating user account. Please try again.");
          break;
        case "unexpected_error":
          toast.error("An unexpected error occurred. Please try again.");
          break;
        default:
          toast.error("An error occurred. Please try again.");
      }
    }
  }, [searchParams]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data, error } = await login(email, password);
      if (error) throw error;

      if (data?.user) {
        console.log("Login successful, redirecting...");
        router.push("/secure/dashboard");
        router.refresh();
      } else {
        throw new Error("No user data returned");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || "Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data, error } = await googleLogin();
      if (error) throw error;

      if (data?.url) {
        console.log("Google login URL:", data.url);
        window.location.href = data.url;
      } else {
        throw new Error("No redirect URL returned");
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Failed to login with Google. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100vh]">
      <div className="pt-10 flex justify-center">
        <h1 className="lg:text-5xl crimson font-bold text-center md:text-2xl bg-clip-text text-transparent bg-gradient-to-b dark:to-white from-black  dark:via-white/70 dark:from-black to-zinc-200">
          Login to your <br />{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-br from-green-400 to-green-800">
            Prohunt
          </span>{" "}
          Account
        </h1>
      </div>
      <h1 className="text-center bg-clip-text text-transparent bg-gradient-to-br dark:to-white from-black  dark:via-white/70 dark:from-black to-zinc-200 font-semibold">
        Unwrap your skills and ideas and Showcase who you are ?
      </h1>
      <div className="flex justify-center pt-5">
        <div className="grid lg:grid-cols-2 divide-dashed gap-5 lg:gap-0 lg:divide-x-2 pt-5 place-content-center max-w-[800px] lg:min-w-[600px]">
          <div className="flex justify-center">
            <form onSubmit={handleLogin} className="grid gap-5">
              <div className="">
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus:outline-none bg-inherit border rounded-full dark:border-white border-black px-5 py-2"
                  placeholder="Email Address"
                  disabled={isLoading}
                />
              </div>
              <div className="">
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:outline-none bg-inherit border rounded-full dark:border-white border-black px-5 py-2"
                  placeholder="Password"
                  disabled={isLoading}
                />
              </div>
              <div className="">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="focus:outline-none w-full text-white bg-inherit border font-bold tracking-wide rounded-full border-green-400 hover:tracking-widest hover:from-green-500 hover:to-green-800 duration-200 bg-gradient-to-br from-green-900 via-green-600 to-green-800 px-5 py-2 disabled:opacity-50"
                >
                  {isLoading ? "Logging in..." : "Login"}
                </button>
              </div>
            </form>
          </div>
          <div className="text-center flex items-center justify-center">
            <div className="">
              <h1 className="font-semibold text-2xl selection: bg-clip-text text-transparent bg-gradient-to-b dark:to-white from-black  dark:via-white/70 dark:from-black to-zinc-200">
                New to Prohunt ?
              </h1>

              <div className="">
                <div className="">
                  <Link
                    href={"/auth/signup"}
                    className="hover:tracking-wider duration-200 hover:underline underline-offset-4"
                  >
                    Create{" "}
                    <span className="bg-clip-text text-transparent bg-gradient-to-br from-green-400 to-green-800 font-semibold">
                      New
                    </span>{" "}
                    Account
                  </Link>
                </div>
                <button
                  onClick={handleGoogle}
                  disabled={isLoading}
                  className="py-5 cursor-pointer disabled:opacity-50"
                >
                  <h1 className="hover:underline underline-offset-2 duration-200 text-green-400">
                    {isLoading ? "Connecting..." : "Login with Google"}
                  </h1>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
