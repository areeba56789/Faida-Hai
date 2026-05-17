"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Github, Mail } from "lucide-react"; // Using generic icons if specific Google one is missing

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const supabase = createClient();

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      setError(error.message);
    } else {
      router.push("/");
      router.refresh();
    }
    setLoading(false);
  };

  const handleSignUp = async () => {
    setLoading(true);
    setError(null);
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      setError(error.message);
    } else {
      setError("Check your email for the confirmation link.");
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[#141414] border border-[#262626] rounded-2xl p-8 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#3B82F6] to-[#10B981]">
            FaidaHai
          </h1>
          <p className="text-[#a3a3a3] mt-2 text-sm">Sign in to your premium dashboard</p>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-[#1f1f1f] hover:bg-[#262626] border border-[#262626] text-white font-medium py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors mb-6"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="flex items-center mb-6">
          <div className="flex-grow border-t border-[#262626]"></div>
          <span className="px-3 text-[#a3a3a3] text-sm">or</span>
          <div className="flex-grow border-t border-[#262626]"></div>
        </div>

        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#a3a3a3] uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#3B82F6] transition-colors"
              placeholder="you@company.com"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#a3a3a3] uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#3B82F6] transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

          <div className="pt-2 space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#3B82F6] to-[#10B981] hover:opacity-90 text-white font-medium py-3 rounded-lg flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              <span>{loading ? "Signing In..." : "Sign In"}</span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={handleSignUp}
              disabled={loading}
              className="w-full bg-transparent border border-[#3B82F6]/50 text-[#3B82F6] hover:bg-[#3B82F6]/10 font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              Create Account
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
