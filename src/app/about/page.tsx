"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, User, Building2, Terminal, Database } from "lucide-react";

export default function AboutPage() {
  const team = [
    { 
      name: "Safoora", 
      role: "AI & Spatial Data Lead", 
      icon: <Terminal className="w-8 h-8 text-[#10B981]" />,
      desc: "Specializes in vector databases, RAG systems, and embedding optimization. Architect of the core FaidaHai intelligence engine.",
      color: "#10B981"
    },
    { 
      name: "Eman", 
      role: "Platform Architect", 
      icon: <Database className="w-8 h-8 text-[#3B82F6]" />,
      desc: "Expert in scalable cloud infrastructure, PostgreSQL, and security protocols. Ensures zero-downtime and data integrity.",
      color: "#3B82F6"
    },
    { 
      name: "Areeba", 
      role: "Frontend & 3D Engineering", 
      icon: <User className="w-8 h-8 text-[#8B5CF6]" />,
      desc: "Crafts high-performance WebGL interfaces and premium glassmorphic UX. Bridges the gap between complex data and user experience.",
      color: "#8B5CF6"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <nav className="w-full h-20 flex items-center justify-between px-8 border-b border-[#262626] bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#10B981]/20 rounded-lg flex items-center justify-center border border-[#10B981]/30">
            <Building2 className="w-5 h-5 text-[#10B981]" />
          </div>
          <span className="text-2xl font-bold tracking-tight">FaidaHai</span>
        </Link>
        <Link href="/">
          <button className="flex items-center space-x-2 text-sm font-medium text-[#a3a3a3] hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> <span>Back</span>
          </button>
        </Link>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto px-8 py-24 w-full">
        <div className="text-center mb-24">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6"
          >
            The Neural Architects
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-[#a3a3a3] max-w-2xl mx-auto leading-relaxed"
          >
            Incubated at the <span className="text-[#10B981] font-semibold">Adan IT Center</span>, our engineering team fuses spatial data science with enterprise software architecture to bring institutional intelligence to Pakistan's real estate market.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, idx) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + idx * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-[#141414] border border-[#262626] rounded-3xl p-8 relative overflow-hidden group"
            >
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-2xl"
                style={{ backgroundColor: member.color }}
              />
              <div className="w-20 h-20 rounded-full bg-[#1f1f1f] border border-[#262626] flex items-center justify-center mb-8 mx-auto group-hover:scale-110 transition-transform duration-500">
                {member.icon}
              </div>
              <h2 className="text-2xl font-bold text-center mb-2">{member.name}</h2>
              <p className="text-center font-mono text-sm tracking-widest uppercase mb-6" style={{ color: member.color }}>
                {member.role}
              </p>
              <p className="text-[#a3a3a3] text-center leading-relaxed">
                {member.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </main>

      <footer className="w-full bg-[#050505] border-t border-[#1a1a1a] py-8 text-center text-[#525252] text-sm">
        <p>&copy; {new Date().getFullYear()} FaidaHai Technologies.</p>
      </footer>
    </div>
  );
}
