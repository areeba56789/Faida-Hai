"use client";
import { useEffect, useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area } from "recharts";
import { TrendingUp, Building, DollarSign, Target, Activity } from "lucide-react";

const COLORS = ["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444", "#EC4899"];

export default function AnalyticsPage() {
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const [pRes, aRes] = await Promise.all([
        supabase.from("user_portfolios").select("*").eq("user_id", user.id),
        supabase.from("property_analysis").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20),
      ]);
      if (pRes.data) setPortfolios(pRes.data);
      if (aRes.data) setAnalyses(aRes.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const cityDist = useMemo(() => {
    const m: Record<string, number> = {};
    portfolios.forEach(p => { const c = p.city || "Unknown"; m[c] = (m[c] || 0) + 1; });
    return Object.entries(m).map(([name, value]) => ({ name, value }));
  }, [portfolios]);

  const roiComp = useMemo(() => portfolios.map((p, i) => ({
    name: p.property_name || p.city || `#${i + 1}`, roi: Number(p.projected_roi) || 0,
  })), [portfolios]);

  const searchTrend = useMemo(() => {
    const m: Record<string, number> = {};
    analyses.forEach(a => { const k = new Date(a.created_at).toLocaleString("default", { month: "short" }); m[k] = (m[k] || 0) + 1; });
    return Object.entries(m).map(([name, searches]) => ({ name, searches }));
  }, [analyses]);

  const totalVal = portfolios.reduce((a, c) => a + (Number(c.estimated_value) || 0), 0);
  const avgROI = portfolios.length ? portfolios.reduce((a, c) => a + (Number(c.projected_roi) || 0), 0) / portfolios.length : 0;
  const fmt = (v: number) => v >= 1e7 ? `₨${(v / 1e7).toFixed(1)}Cr` : v >= 1e5 ? `₨${(v / 1e5).toFixed(1)}L` : `₨${v.toLocaleString()}`;
  const ts = { backgroundColor: "#1f1f1f", borderColor: "#333", borderRadius: "8px", color: "#fff" };
  const empty = portfolios.length === 0 && analyses.length === 0;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Portfolio Analytics</h1>
          <p className="text-[#a3a3a3] mt-1">Deep intelligence into your real estate positions.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { l: "Total Portfolio", v: fmt(totalVal), icon: DollarSign, c: "#10B981" },
            { l: "Avg ROI", v: `${avgROI.toFixed(1)}%`, icon: Target, c: "#3B82F6" },
            { l: "Assets", v: portfolios.length.toString(), icon: Building, c: "#8B5CF6" },
            { l: "AI Queries", v: analyses.length.toString(), icon: Activity, c: "#F59E0B" },
          ].map((k, i) => (
            <motion.div key={k.l} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
              className="bg-[#141414] border border-[#262626] rounded-2xl p-6 flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${k.c}15` }}>
                <k.icon className="w-6 h-6" style={{ color: k.c }} />
              </div>
              <div><p className="text-xs text-[#737373] uppercase tracking-wider font-semibold">{k.l}</p><p className="text-2xl font-bold text-white">{k.v}</p></div>
            </motion.div>
          ))}
        </div>

        {empty ? (
          <div className="bg-[#141414] border border-[#262626] rounded-2xl p-16 text-center">
            <Building className="w-16 h-16 text-[#262626] mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">No Data Yet</h2>
            <p className="text-[#a3a3a3]">Add properties or run AI analyses to populate analytics.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-[#141414] border border-[#262626] rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-1">City Distribution</h3>
                <p className="text-sm text-[#737373] mb-6">Asset allocation by location</p>
                <div className="h-72"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={cityDist} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value" stroke="none">{cityDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip contentStyle={ts} /><Legend wrapperStyle={{ color: "#a3a3a3" }} /></PieChart></ResponsiveContainer></div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-[#141414] border border-[#262626] rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-1">ROI Comparison</h3>
                <p className="text-sm text-[#737373] mb-6">Projected return per asset</p>
                <div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={roiComp} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}><CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} /><XAxis dataKey="name" stroke="#a3a3a3" fontSize={11} tickLine={false} axisLine={false} /><YAxis stroke="#a3a3a3" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} /><Tooltip contentStyle={ts} /><Bar dataKey="roi" fill="#3B82F6" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div>
              </motion.div>
            </div>
            {searchTrend.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-[#141414] border border-[#262626] rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-1">AI Search Activity</h3>
                <p className="text-sm text-[#737373] mb-6">Your queries over time</p>
                <div className="h-72"><ResponsiveContainer width="100%" height="100%"><AreaChart data={searchTrend} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}><defs><linearGradient id="cS" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10B981" stopOpacity={0.4} /><stop offset="95%" stopColor="#10B981" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} /><XAxis dataKey="name" stroke="#a3a3a3" fontSize={12} tickLine={false} axisLine={false} /><YAxis stroke="#a3a3a3" fontSize={12} tickLine={false} axisLine={false} /><Tooltip contentStyle={ts} /><Area type="monotone" dataKey="searches" stroke="#10B981" strokeWidth={3} fill="url(#cS)" /></AreaChart></ResponsiveContainer></div>
              </motion.div>
            )}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-[#141414] border border-[#262626] rounded-2xl p-6 overflow-x-auto">
              <h3 className="text-lg font-bold text-white mb-1">Portfolio Ledger</h3>
              <p className="text-sm text-[#737373] mb-6">Full asset breakdown</p>
              <table className="w-full text-left text-sm"><thead><tr className="border-b border-[#262626]"><th className="pb-3 text-[#737373] font-semibold uppercase tracking-wider text-xs">Property</th><th className="pb-3 text-[#737373] font-semibold uppercase tracking-wider text-xs">City</th><th className="pb-3 text-[#737373] font-semibold uppercase tracking-wider text-xs text-right">Value</th><th className="pb-3 text-[#737373] font-semibold uppercase tracking-wider text-xs text-right">ROI</th></tr></thead>
              <tbody>{portfolios.map((p, i) => (<tr key={i} className="border-b border-[#1a1a1a] hover:bg-[#1a1a1a]"><td className="py-4 text-white font-medium">{p.property_name || `Asset #${i + 1}`}</td><td className="py-4 text-[#a3a3a3]">{p.city || "—"}</td><td className="py-4 text-white text-right font-mono">{fmt(Number(p.estimated_value) || 0)}</td><td className="py-4 text-right"><span className={`font-bold ${(Number(p.projected_roi) || 0) >= 0 ? "text-[#10B981]" : "text-[#EF4444]"}`}>{(Number(p.projected_roi) || 0).toFixed(1)}%</span></td></tr>))}</tbody></table>
            </motion.div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
