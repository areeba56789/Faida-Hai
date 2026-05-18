"use client";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { Map, Building, TrendingUp, Activity } from "lucide-react";

export default function HeatmapPage() {
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("user_portfolios").select("*").eq("user_id", user.id);
      if (data) setPortfolios(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Aggregate by city for the heatmap legend
  const cityStats = portfolios.reduce((acc: Record<string, { count: number; totalValue: number }>, p) => {
    const city = p.city || p.location || "Unknown";
    if (!acc[city]) acc[city] = { count: 0, totalValue: 0 };
    acc[city].count++;
    acc[city].totalValue += Number(p.estimated_value) || 0;
    return acc;
  }, {});

  const fmt = (v: number) => v >= 1e7 ? `₨${(v / 1e7).toFixed(1)}Cr` : v >= 1e5 ? `₨${(v / 1e5).toFixed(1)}L` : `₨${v.toLocaleString()}`;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Market Heatmap</h1>
          <p className="text-[#a3a3a3] mt-1">Spatial visualization of portfolio density and market activity.</p>
        </motion.div>

        {/* Map Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#141414] border border-[#262626] rounded-2xl overflow-hidden relative"
          style={{ height: "60vh", minHeight: 450 }}
        >
          {/* Mapbox placeholder — requires NEXT_PUBLIC_MAPBOX_TOKEN */}
          <div className="w-full h-full flex items-center justify-center relative">
            {/* Gradient overlay for premium feel */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/5 via-transparent to-[#3B82F6]/5 z-10 pointer-events-none" />
            
            {/* Embedded Mapbox dark terrain view of Pakistan */}
            {process.env.NEXT_PUBLIC_MAPBOX_TOKEN ? (
              <iframe
                src={`https://api.mapbox.com/styles/v1/mapbox/dark-v11.html?title=false&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}#5.5/30.5/69.5`}
                className="w-full h-full border-0"
                style={{ filter: "saturate(1.2) contrast(1.1)" }}
                loading="lazy"
                title="Pakistan Market Heatmap"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-[#0a0a0a]">
                <Map className="w-16 h-16 text-[#262626] mb-4" />
                <p className="text-[#737373] text-sm font-medium">Set <code className="text-[#10B981]">NEXT_PUBLIC_MAPBOX_TOKEN</code> to enable live map</p>
              </div>
            )}

            {/* Floating stats overlay */}
            <div className="absolute top-4 left-4 z-20 space-y-3">
              <div className="bg-[#0a0a0a]/90 backdrop-blur-md border border-[#262626] rounded-xl px-4 py-3">
                <div className="flex items-center space-x-2 mb-1">
                  <Map className="w-4 h-4 text-[#10B981]" />
                  <span className="text-sm font-bold text-white">Live Coverage</span>
                </div>
                <p className="text-xs text-[#a3a3a3]">{Object.keys(cityStats).length} cities &middot; {portfolios.length} assets tracked</p>
              </div>
            </div>

            {/* Activity badge */}
            <div className="absolute top-4 right-4 z-20">
              <div className="bg-[#10B981]/10 border border-[#10B981]/30 rounded-full px-4 py-2 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span className="text-xs font-semibold text-[#10B981]">Data Streaming</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* City Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(cityStats).length > 0 ? (
            Object.entries(cityStats).map(([city, stats], i) => (
              <motion.div
                key={city}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="bg-[#141414] border border-[#262626] rounded-2xl p-6 hover:border-[#10B981]/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">{city}</h3>
                  <div className="w-10 h-10 rounded-lg bg-[#10B981]/10 flex items-center justify-center">
                    <Building className="w-5 h-5 text-[#10B981]" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#737373]">Properties</span>
                    <span className="text-white font-bold">{stats.count}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#737373]">Total Value</span>
                    <span className="text-[#10B981] font-bold">{fmt(stats.totalValue)}</span>
                  </div>
                  <div className="w-full bg-[#262626] rounded-full h-2 mt-2">
                    <div className="bg-gradient-to-r from-[#10B981] to-[#3B82F6] h-2 rounded-full" style={{ width: `${Math.min((stats.count / portfolios.length) * 100, 100)}%` }} />
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full bg-[#141414] border border-[#262626] rounded-2xl p-12 text-center">
              <Map className="w-12 h-12 text-[#262626] mx-auto mb-4" />
              <h2 className="text-lg font-bold text-white mb-2">No Portfolio Data</h2>
              <p className="text-[#a3a3a3] text-sm">Add properties to see spatial breakdown here.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
