"use client";
import { signup } from "@/supabase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const passwordChecks = {
    minLength: password.length >= 6,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const calculateStrength = () => {
    let strength = 0;
    if (passwordChecks.minLength) strength += 20;
    if (passwordChecks.hasUpperCase) strength += 20;
    if (passwordChecks.hasLowerCase) strength += 20;
    if (passwordChecks.hasNumber) strength += 20;
    if (passwordChecks.hasSpecialChar) strength += 20;
    return strength;
  };

  useEffect(() => {
    setPasswordStrength(calculateStrength());
  }, [password]);

  const getStrengthColor = () => {
    if (passwordStrength <= 20) return "bg-red-500";
    if (passwordStrength <= 40) return "bg-orange-500";
    if (passwordStrength <= 60) return "bg-yellow-500";
    if (passwordStrength <= 80) return "bg-blue-500";
    return "bg-green-500";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (passwordStrength < 60) {
      toast.error("Please use a stronger password");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await toast.promise(signup(email, password), {
        pending: "Creating your account...",
        success: "Account created successfully! Please verify your email.",
        error: "Failed to create account. Please try again.",
      });
      console.log(res);
      router.push(`/auth/signup/verify?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error("Signup error:", error);
      if (error.message.includes("already registered")) {
        toast.error("Email already registered. Redirecting to login...");
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      } else {
        toast.error(error.message || "Failed to create account. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[100vh] lg:px-20 px-8">
      <div className="pt-10 flex justify-center">
        <h1 className="lg:text-5xl text-4xl crimson font-bold text-center md:text-2xl bg-clip-text text-transparent bg-gradient-to-b dark:to-white from-black  dark:via-white/70 dark:from-black to-zinc-200">
          Create your
          <br />{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-br from-green-400 to-green-800">
            Prohunt
          </span>{" "}
          Account
        </h1>
      </div>
      <div className="flex justify-center">
        <h1 className="text-center md:max-w-[500px] max-w-[250px] bg-clip-text text-transparent bg-gradient-to-bl md:bg-gradient-to-b dark:to-white from-black  dark:via-white/70 dark:from-black to-zinc-200 font-semibold">
          Unwrap your skills and ideas and Showcase who you are ?
        </h1>
      </div>
      <div className="flex justify-center pt-5">
        <form onSubmit={handleSubmit} className="grid gap-5 w-full max-w-md">
          <div className="space-y-2">
            <input
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="focus:outline-none bg-inherit border w-full rounded-xl dark:border-white border-black px-5 py-2 transition-all duration-200 focus:border-green-500"
              placeholder="Enter your Email"
            />
          </div>
          <div className="space-y-2">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                className="focus:outline-none bg-inherit border w-full rounded-xl dark:border-white border-black px-5 py-2 pr-10 transition-all duration-200 focus:border-green-500"
                placeholder="Enter your Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            
            {/* Password Strength Indicator */}
            <div className="space-y-2">
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                  style={{ width: `${passwordStrength}%` }}
                />
              </div>
              <div className="text-sm text-gray-500">
                Password Strength: {passwordStrength}%
              </div>
            </div>

            {/* Password Requirements */}
            <div className="space-y-2 mt-4">
              <div className="flex items-center space-x-2">
                <span className={passwordChecks.minLength ? "text-green-500" : "text-red-500"}>
                  {passwordChecks.minLength ? <FaCheck /> : <FaTimes />}
                </span>
                <span className="text-sm">At least 6 characters</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={passwordChecks.hasUpperCase ? "text-green-500" : "text-red-500"}>
                  {passwordChecks.hasUpperCase ? <FaCheck /> : <FaTimes />}
                </span>
                <span className="text-sm">One uppercase letter</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={passwordChecks.hasLowerCase ? "text-green-500" : "text-red-500"}>
                  {passwordChecks.hasLowerCase ? <FaCheck /> : <FaTimes />}
                </span>
                <span className="text-sm">One lowercase letter</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={passwordChecks.hasNumber ? "text-green-500" : "text-red-500"}>
                  {passwordChecks.hasNumber ? <FaCheck /> : <FaTimes />}
                </span>
                <span className="text-sm">One number</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={passwordChecks.hasSpecialChar ? "text-green-500" : "text-red-500"}>
                  {passwordChecks.hasSpecialChar ? <FaCheck /> : <FaTimes />}
                </span>
                <span className="text-sm">One special character</span>
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || passwordStrength < 60}
              className={`w-full text-white font-bold tracking-wide rounded-xl border-green-400 hover:tracking-widest duration-200 bg-gradient-to-br from-green-900 via-green-600 to-green-800 px-5 py-2 transition-all duration-200 ${
                isSubmitting || passwordStrength < 60
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:from-green-500 hover:to-green-800"
              }`}
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>
          </div>
        </form>
      </div>

      <div className="flex justify-center pt-5">
        <Link
          href={"/auth/login"}
          className="font-bold hover:tracking-wider duration-200 bg-clip-text text-transparent bg-gradient-to-br from-green-400 to-green-800"
        >
          Already Have Account ?
        </Link>
      </div>
    </div>
  );
}
