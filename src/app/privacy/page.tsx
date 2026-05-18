import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";

export default function PrivacyPage() {
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
        <h1 className="text-5xl font-extrabold tracking-tight mb-4">Privacy Policy</h1>
        <p className="text-xl text-[#a3a3a3] mb-16">Effective Date: May 19, 2026</p>

        <div className="space-y-8 text-[#a3a3a3] leading-relaxed">
          <p>
            FaidaHai Technologies ("we," "our," or "us") is committed to protecting your privacy and ensuring the security of your institutional data.
          </p>
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Data Collection</h2>
          <p>
            We collect personal information such as your email address when you sign up. When utilizing the Portfolio Ledger, we store encrypted records of your property investments for your private use only.
          </p>
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Data Security</h2>
          <p>
            Our infrastructure uses Supabase with strict Row Level Security (RLS) policies. This ensures that your portfolio data is cryptographically isolated and cannot be accessed by other users or unauthorized third parties.
          </p>
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">AI Processing</h2>
          <p>
            Search queries processed by our AI Engine (Gemini) are ephemeral and are not used to train public language models.
          </p>
        </div>
      </main>

      <footer className="w-full bg-[#050505] border-t border-[#1a1a1a] py-8 text-center text-[#525252] text-sm">
        <p>&copy; {new Date().getFullYear()} FaidaHai Technologies.</p>
      </footer>
    </div>
  );
}
