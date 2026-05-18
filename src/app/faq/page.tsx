import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";

export default function FAQPage() {
  const faqs = [
    {
      q: "What is FaidaHai?",
      a: "FaidaHai is an enterprise intelligence platform for Pakistan's real estate market. We use AI and spatial embeddings to analyze property data and project hyper-local yields."
    },
    {
      q: "Where does the data come from?",
      a: "We aggregate data from multiple verified public registries, agency networks, and historical scraping systems, utilizing localized RAG (Retrieval-Augmented Generation) databases to ensure accuracy."
    },
    {
      q: "Which cities are currently supported?",
      a: "Our highest fidelity datasets currently focus on Lahore (DHA) and Gujrat (Chenab Orchard, Citi Housing). However, our macroeconomic AI fallback can provide generalized projections for the entire country."
    },
    {
      q: "How secure is the platform?",
      a: "We utilize bank-level encryption and strict Row Level Security (RLS) via Supabase to ensure your portfolio and search history are completely isolated and private."
    }
  ];

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
        <h1 className="text-5xl font-extrabold tracking-tight mb-4">Frequently Asked Questions</h1>
        <p className="text-xl text-[#a3a3a3] mb-16">Everything you need to know about the platform and our data.</p>

        <div className="space-y-8">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-[#141414] border border-[#262626] rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-4">{faq.q}</h3>
              <p className="text-[#a3a3a3] leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="w-full bg-[#050505] border-t border-[#1a1a1a] py-8 text-center text-[#525252] text-sm">
        <p>&copy; {new Date().getFullYear()} FaidaHai Technologies.</p>
      </footer>
    </div>
  );
}
