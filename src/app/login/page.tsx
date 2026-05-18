"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Icosahedron, MeshDistortMaterial } from "@react-three/drei";

function PremiumAbstract() {
  const meshRef = useRef<any>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.1;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <group>
      <Icosahedron ref={meshRef} args={[1, 0]} scale={2.5}>
        <MeshDistortMaterial
          color="#3B82F6"
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0.1}
          metalness={0.9}
          wireframe={true}
        />
      </Icosahedron>
      <Icosahedron args={[1, 0]} scale={2.4}>
        <MeshDistortMaterial
          color="#10B981"
          attach="material"
          distort={0.2}
          speed={1.5}
          roughness={0.2}
          metalness={0.8}
          wireframe={true}
          opacity={0.3}
          transparent
        />
      </Icosahedron>
    </group>
  );
}

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email");

  const [authMode, setAuthMode] = useState<"login" | "signup">(emailParam ? "signup" : "login");
  const [email, setEmail] = useState(emailParam || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClient();

  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
      setAuthMode("signup");
    }
  }, [emailParam]);

  const getFriendlyErrorMessage = (errMsg: string) => {
    const lowerMsg = errMsg.toLowerCase();
    if (lowerMsg.includes("invalid login credentials")) return "Incorrect email or password.";
    if (lowerMsg.includes("user already registered")) return "An account with this email already exists.";
    if (lowerMsg.includes("password should be at least")) return "Password must be at least 6 characters.";
    return errMsg;
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    if (authMode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        setError(getFriendlyErrorMessage(error.message));
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        setError(getFriendlyErrorMessage(error.message));
      } else {
        setError("Account created! Please check your email for the confirmation link.");
      }
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
    <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 relative">
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#10B981]/10 blur-[120px] rounded-full pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-[#141414]/80 backdrop-blur-xl border border-[#262626] rounded-2xl p-8 shadow-2xl relative z-10"
      >
        <div className="text-center mb-8 lg:hidden">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#10B981] to-[#3B82F6]">
            FaidaHai
          </h1>
        </div>

        <h2 className="text-2xl font-bold mb-6">
          {authMode === "login" ? "Welcome back" : "Create your account"}
        </h2>

        <div className="relative flex bg-[#0a0a0a] border border-[#262626] rounded-lg p-1 mb-8">
          <motion.div
            className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#1f1f1f] rounded-md shadow-sm pointer-events-none border border-[#333]"
            initial={false}
            animate={{ x: authMode === "login" ? "0%" : "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
          <button
            type="button"
            onClick={() => { setAuthMode("login"); setError(null); }}
            className={`relative flex-1 z-10 text-sm font-medium py-2 rounded-md transition-colors ${authMode === "login" ? "text-white" : "text-[#a3a3a3] hover:text-white"}`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode("signup"); setError(null); }}
            className={`relative flex-1 z-10 text-sm font-medium py-2 rounded-md transition-colors ${authMode === "signup" ? "text-white" : "text-[#a3a3a3] hover:text-white"}`}
          >
            Sign Up
          </button>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-[#1f1f1f] hover:bg-[#262626] border border-[#262626] text-white font-medium py-3 rounded-lg flex items-center justify-center space-x-3 transition-colors mb-6"
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
          <span className="px-3 text-[#525252] text-xs uppercase tracking-widest font-semibold">or with email</span>
          <div className="flex-grow border-t border-[#262626]"></div>
        </div>

        <form onSubmit={handleAuthSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-[#a3a3a3] uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#10B981] transition-colors"
              placeholder="you@company.com"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#a3a3a3] uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#10B981] transition-colors pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a3a3a3] hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: "auto" }} 
              className={`text-sm font-medium text-center p-3 rounded-lg ${error.includes('Account created') ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}
            >
              {error}
            </motion.p>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-bold text-base py-3.5 rounded-lg flex items-center justify-center space-x-2 transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
            >
              <span>{loading ? "Please wait..." : "Continue"}</span>
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-[#0a0a0a] text-white">
      {/* Left Side - 3D Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-black items-center justify-center border-r border-[#262626] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/10 to-[#3B82F6]/5 z-10" />
        <div className="absolute top-12 left-12 z-20">
          <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#10B981] to-[#3B82F6]">
            FaidaHai
          </span>
          <p className="mt-4 text-[#a3a3a3] max-w-md text-lg">
            The enterprise intelligence platform for Pakistan's real estate market.
          </p>
        </div>
        <div className="w-full h-full absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 5] }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <PremiumAbstract />
          </Canvas>
        </div>
      </div>

      <Suspense fallback={<div className="w-full lg:w-1/2 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#10B981]"></div></div>}>
        <AuthContent />
      </Suspense>
    </div>
  );
}
