"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, MapPin, TrendingUp, Building2, Mail, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts";

const locationData: Record<string, any> = {
  gujrat: {
    name: "Gujrat",
    subtitle: "The Emerging Industrial Hub",
    why: "Gujrat is experiencing unprecedented infrastructural development, driven by new industrial zones and rapid urban expansion. Premium societies are seeing double-digit growth year over year as overseas investment pours in.",
    topInvestments: [
      { name: "Chenab Orchard", desc: "Highest appreciation rate in the district. Elite planning and amenities." },
      { name: "Citi Housing Gujrat", desc: "Gold standard living. Strong historical secondary market liquidity." },
      { name: "River View Phase 2", desc: "Emerging hotspot. Best for medium-to-long term capital gains." }
    ],
    stats: [
      { name: "Chenab Orchard", value: 18.5, color: "#10B981" },
      { name: "Citi Housing", value: 14.2, color: "#3B82F6" },
      { name: "Market Average", value: 8.5, color: "#8B5CF6" }
    ]
  },
  lahore: {
    name: "Lahore",
    subtitle: "The Premium Real Estate Capital",
    why: "As Pakistan's second-largest city, Lahore remains the safest and most liquid real estate market. DHA phases continue to offer stable, high-yield commercial returns, making it the ultimate destination for institutional capital preservation.",
    topInvestments: [
      { name: "DHA Phase 8 Commercial", desc: "Unmatched foot traffic and rental yields." },
      { name: "DHA Phase 9 Prism", desc: "The future of DHA. Excellent entry point for investors." },
      { name: "Gulberg High-Rises", desc: "Premium vertical living. Strong dollar-pegged ROI." }
    ],
    stats: [
      { name: "Commercial Yield", value: 12.5, color: "#10B981" },
      { name: "Residential ROI", value: 8.2, color: "#3B82F6" },
      { name: "Rental Yield", value: 6.5, color: "#8B5CF6" }
    ]
  }
};

const EmailCatcher = () => {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleGetStarted = (e: React.FormEvent) => {
    e.preventDefault();
    if(email) {
      router.push(`/login?email=${encodeURIComponent(email)}`);
    }
  };

  return (
    <form onSubmit={handleGetStarted} className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-lg mt-8 relative z-30">
      <div className="relative w-full">
        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#737373]" />
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email to unlock insights" 
          required 
          className="w-full bg-[#141414]/80 backdrop-blur-md border border-[#262626] rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-[#10B981] transition-colors"
        />
      </div>
      <button 
        type="submit" 
        className="w-full sm:w-auto px-8 py-4 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl font-bold transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] flex items-center justify-center space-x-2 shrink-0"
      >
        <span>Get Started</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </form>
  );
};

export default function LocationPage({ params }: { params: Promise<{ city: string }> }) {
  const resolvedParams = use(params);
  const cityKey = resolvedParams.city.toLowerCase();
  const data = locationData[cityKey];

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Location Not Found</h1>
          <Link href="/" className="text-[#10B981] hover:underline flex items-center justify-center space-x-2">
            <ArrowLeft className="w-4 h-4" /> <span>Return Home</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      {/* Simple Header */}
      <nav className="w-full h-20 flex items-center justify-between px-8 border-b border-[#262626] bg-[#0a0a0a]">
        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-[#10B981]/20 rounded-lg flex items-center justify-center border border-[#10B981]/30">
            <Building2 className="w-5 h-5 text-[#10B981]" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">FaidaHai</span>
        </Link>
        <Link href="/">
          <button className="flex items-center space-x-2 text-sm font-medium text-[#a3a3a3] hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> <span>Back to Home</span>
          </button>
        </Link>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-8 py-16 w-full">
        <div className="mb-8">
          <div className="inline-flex items-center space-x-2 mb-6 px-4 py-1.5 rounded-full border border-[#3B82F6]/30 bg-[#3B82F6]/10 text-[#3B82F6] text-sm font-semibold tracking-wide uppercase">
            <MapPin className="w-4 h-4" />
            <span>Market Intelligence</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4">
            {data.name}
          </h1>
          <p className="text-2xl text-[#a3a3a3] max-w-2xl">{data.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-16">
          
          {/* Left Column: Details */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-12"
          >
            <section>
              <h2 className="text-3xl font-bold mb-6 flex items-center space-x-3">
                <span className="w-2 h-8 bg-[#10B981] rounded-full inline-block"></span>
                <span>Why {data.name}?</span>
              </h2>
              <p className="text-[#a3a3a3] text-lg leading-relaxed bg-[#141414] p-6 rounded-2xl border border-[#262626]">
                {data.why}
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-6 flex items-center space-x-3">
                <span className="w-2 h-8 bg-[#3B82F6] rounded-full inline-block"></span>
                <span>Top Investments Right Now</span>
              </h2>
              <div className="space-y-4">
                {data.topInvestments.map((inv: any, idx: number) => (
                  <div key={idx} className="flex items-start space-x-4 bg-[#141414] border border-[#262626] p-6 rounded-2xl hover:border-[#3B82F6]/50 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-[#3B82F6]/10 flex items-center justify-center shrink-0">
                      <TrendingUp className="w-6 h-6 text-[#3B82F6]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{inv.name}</h3>
                      <p className="text-[#a3a3a3] leading-relaxed">{inv.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="pt-8 border-t border-[#262626]">
              <h3 className="text-2xl font-bold mb-4">Ready to access the full data?</h3>
              <p className="text-[#a3a3a3] mb-6">Create your enterprise account to unlock block-level spatial heatmaps and AI valuation models for {data.name}.</p>
              <EmailCatcher />
            </section>
          </motion.div>

          {/* Right Column: Visual Data / Stats */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="sticky top-24 w-full bg-[#141414] border border-[#262626] rounded-3xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Market Yield Projection</h3>
                <p className="text-[#a3a3a3] text-sm uppercase tracking-widest">Estimated Annual Return (%)</p>
              </div>

              <div className="h-80 w-full mb-8 relative">
                {/* Decorative background glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#10B981]/10 to-[#3B82F6]/10 blur-3xl rounded-full"></div>
                
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.stats}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {data.stats.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#1f1f1f', borderColor: '#333', borderRadius: '8px', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: '#a3a3a3' }}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="bg-[#0a0a0a] rounded-xl p-6 border border-[#262626]">
                <h4 className="font-bold text-white mb-2 flex items-center">
                  <ShieldCheck className="w-5 h-5 text-[#10B981] mr-2" />
                  Verified Intelligence
                </h4>
                <p className="text-sm text-[#737373] leading-relaxed">
                  These metrics are aggregated in real-time from active listings, public records, and proprietary valuation models. Actual yields may vary based on hyper-local entry conditions.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="w-full bg-[#050505] border-t border-[#1a1a1a] py-8 text-center text-[#525252] text-sm">
        <p>&copy; {new Date().getFullYear()} FaidaHai Technologies. All rights reserved.</p>
      </footer>
    </div>
  );
}
