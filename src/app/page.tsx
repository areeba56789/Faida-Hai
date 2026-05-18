"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Building2, TrendingUp, ShieldCheck, Map as MapIcon } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#3B82F6]/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#10B981]/20 blur-[120px] rounded-full pointer-events-none" />

      {/* Navigation */}
      <nav className="w-full h-20 flex items-center justify-between px-8 z-10 border-b border-[#262626] bg-[#0a0a0a]/80 backdrop-blur-md">
        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#3B82F6] to-[#10B981]">
          FaidaHai
        </span>
        <Link href="/login">
          <button className="px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 bg-white text-black hover:bg-gray-200">
            Login
          </button>
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            The Palantir of <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#3B82F6] via-[#60A5FA] to-[#10B981]">
              Pakistan Real Estate
            </span>
          </h1>
          <p className="text-[#a3a3a3] text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            FaidaHai aggregates live market intelligence from Zameen and DHA, empowering you with AI-driven insights, 3D spatial heatmaps, and enterprise-grade portfolio management.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login">
              <button className="flex items-center justify-center space-x-2 w-full sm:w-auto px-8 py-4 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl font-bold transition-all duration-200 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <span>Get Started Now</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <Link href="#features">
              <button className="w-full sm:w-auto px-8 py-4 bg-[#141414] hover:bg-[#1f1f1f] text-white border border-[#262626] rounded-xl font-medium transition-all duration-200">
                View Features
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <motion.div 
          id="features"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-24"
        >
          {[
            {
              icon: Building2,
              title: "Portfolio Ledger",
              desc: "Manage properties, track historical valuations, and project future ROI natively."
            },
            {
              icon: MapIcon,
              title: "3D Heatmaps",
              desc: "Visualize spatial yield distributions across DHA, Gulberg, and Bahria Town."
            },
            {
              icon: ShieldCheck,
              title: "Enterprise Grade",
              desc: "Bank-level security with strict route protection and isolated data environments."
            }
          ].map((feature, idx) => (
            <div key={idx} className="bg-[#141414]/80 backdrop-blur-md border border-[#262626] rounded-2xl p-8 text-left hover:border-[#3B82F6]/50 transition-colors duration-300">
              <div className="w-12 h-12 bg-[#3B82F6]/10 rounded-xl flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-[#3B82F6]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-[#a3a3a3] leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 text-center text-[#525252] text-sm z-10 border-t border-[#262626] mt-24">
        &copy; {new Date().getFullYear()} FaidaHai. Enterprise Real Estate AI.
      </footer>
    </div>
  );
}
