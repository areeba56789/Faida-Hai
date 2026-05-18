import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <nav className="w-full h-20 flex items-center justify-between px-8 border-b border-[#262626]">
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

      <main className="flex-1 max-w-4xl mx-auto px-8 py-24 w-full">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4">Terms of Service</h1>
        <p className="text-xl text-[#a3a3a3] mb-16">Effective Date: May 19, 2026</p>

        <div className="space-y-8 text-[#a3a3a3] leading-relaxed">
          <p>
            Welcome to FaidaHai. By accessing or using our platform, you agree to be bound by these Terms of Service.
          </p>
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Enterprise Data Usage</h2>
          <p>
            The intelligence and projections provided by the FaidaHai platform are for informational and analytical purposes only. We do not guarantee specific financial returns or market outcomes. Real estate investments carry inherent risks.
          </p>
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Account Security</h2>
          <p>
            You are responsible for safeguarding your login credentials. FaidaHai employs Row Level Security (RLS) to protect your portfolio data, but any compromise of your account credentials is at your own risk.
          </p>
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Intellectual Property</h2>
          <p>
            All algorithms, 3D heatmaps, UI/UX designs, and proprietary RAG embeddings are the exclusive property of FaidaHai Technologies and the Adan IT Center.
          </p>
        </div>
      </main>

      <footer className="w-full bg-[#050505] border-t border-[#1a1a1a] py-8 text-center text-[#525252] text-sm">
        <p>&copy; {new Date().getFullYear()} FaidaHai Technologies.</p>
      </footer>
    </div>
  );
}
