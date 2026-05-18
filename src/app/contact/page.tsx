import Link from "next/link";
import { ArrowLeft, Building2, Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
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
        <h1 className="text-5xl font-extrabold tracking-tight mb-4">Contact Us</h1>
        <p className="text-xl text-[#a3a3a3] mb-16">Get in touch with our enterprise support team.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#141414] border border-[#262626] rounded-2xl p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-[#10B981]/10 rounded-full flex items-center justify-center mb-6">
              <Mail className="w-8 h-8 text-[#10B981]" />
            </div>
            <h3 className="text-xl font-bold mb-2">Email Support</h3>
            <p className="text-[#a3a3a3] mb-4">For technical and account assistance.</p>
            <a href="mailto:support@faidahai.com" className="text-[#10B981] font-medium hover:underline">support@faidahai.com</a>
          </div>

          <div className="bg-[#141414] border border-[#262626] rounded-2xl p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-[#3B82F6]/10 rounded-full flex items-center justify-center mb-6">
              <MapPin className="w-8 h-8 text-[#3B82F6]" />
            </div>
            <h3 className="text-xl font-bold mb-2">Office</h3>
            <p className="text-[#a3a3a3] mb-4">Adan IT Center</p>
            <span className="text-[#3B82F6] font-medium">Lahore, Pakistan</span>
          </div>
        </div>
      </main>

      <footer className="w-full bg-[#050505] border-t border-[#1a1a1a] py-8 text-center text-[#525252] text-sm">
        <p>&copy; {new Date().getFullYear()} FaidaHai Technologies.</p>
      </footer>
    </div>
  );
}
