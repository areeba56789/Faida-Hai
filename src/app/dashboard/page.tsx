"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { AnimatedChart } from "@/components/dashboard/AnimatedChart";
import { ThreeDVisualizer } from "@/components/3d/ThreeDVisualizer";
import { AIChatInterface } from "@/components/ai/AIChatInterface";
import { DollarSign, Percent, TrendingUp, Building, Search } from "lucide-react";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";

export default function Home() {
  const [recentSearches, setRecentSearches] = useState<any[]>([]);
  const [marketAverage, setMarketAverage] = useState<string>("Calculating...");
  const [totalValuation, setTotalValuation] = useState<string>("Rs 0");
  const [propertiesOwned, setPropertiesOwned] = useState<string>("0");
  const [averageROI, setAverageROI] = useState<string>("0.0%");
  const supabase = createClient();

  useEffect(() => {
    const fetchDashboardData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: analyses } = await supabase
          .from("property_analysis")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5);
        if (analyses) setRecentSearches(analyses);

        // Fetch user portfolios
        const { data: portfolios } = await supabase
          .from("user_portfolios")
          .select("estimated_value, projected_roi")
          .eq("user_id", user.id);
          
        if (portfolios && portfolios.length > 0) {
          const sumValuation = portfolios.reduce((acc, curr) => acc + (Number(curr.estimated_value) || 0), 0);
          const sumROI = portfolios.reduce((acc, curr) => acc + (Number(curr.projected_roi) || 0), 0);
          
          setPropertiesOwned(portfolios.length.toString());
          setAverageROI((sumROI / portfolios.length).toFixed(1) + "%");
          
          let formattedVal = "Rs 0";
          if (sumValuation >= 10000000) {
            formattedVal = `Rs ${(sumValuation / 10000000).toFixed(2)} Crore`;
          } else if (sumValuation >= 100000) {
            formattedVal = `Rs ${(sumValuation / 100000).toFixed(2)} Lac`;
          } else {
            formattedVal = `Rs ${sumValuation.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
          }
          setTotalValuation(formattedVal);
        }
      }

      // Fetch market data for average price
      const { data: marketData } = await supabase
        .from("market_data")
        .select("price");
        
      if (marketData && marketData.length > 0) {
        const sum = marketData.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
        const avg = sum / marketData.length;
        
        // Format in PKR Crores/Lacs
        let formattedAvg = "Rs 0";
        if (avg >= 10000000) {
          formattedAvg = `Rs ${(avg / 10000000).toFixed(2)} Crore`;
        } else if (avg >= 100000) {
          formattedAvg = `Rs ${(avg / 100000).toFixed(2)} Lac`;
        } else {
          formattedAvg = `Rs ${avg.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
        }
        setMarketAverage(formattedAvg);
      } else {
        setMarketAverage("Rs 0");
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        <div className="flex items-center justify-between">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-white tracking-tight"
          >
            Portfolio Overview
          </motion.h1>
        </div>

        {/* Top Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Valuation"
            value={totalValuation}
            trend={{ value: 0, label: "Live Portfolio Data" }}
            icon={DollarSign}
            delay={0.1}
          />
          <MetricCard
            title="Average ROI"
            value={averageROI}
            trend={{ value: 0, label: "Live Portfolio Data" }}
            icon={Percent}
            delay={0.2}
          />
          <MetricCard
            title="Properties"
            value={propertiesOwned}
            trend={{ value: 0, label: "Live Portfolio Data" }}
            icon={Building}
            delay={0.3}
          />
          <MetricCard
            title="Market Average"
            value={marketAverage}
            trend={{ value: 0, label: "Lahore Live Average" }}
            icon={TrendingUp}
            delay={0.4}
          />
        </div>

        {/* Main Content: 3D Visualizer & AI Chat */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="xl:col-span-2 h-[500px]"
          >
            <ThreeDVisualizer />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="h-[500px]"
          >
            <AIChatInterface />
          </motion.div>
        </div>

        {/* Recent Searches & Bottom Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="bg-[#141414] border border-[#262626] rounded-2xl p-6 shadow-xl"
          >
            <h2 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
              <Search className="w-5 h-5 text-[#3B82F6]" />
              <span>Recent Searches</span>
            </h2>
            {recentSearches.length > 0 ? (
              <div className="space-y-4">
                {recentSearches.map((search) => (
                  <div key={search.id} className="p-3 bg-[#1f1f1f] rounded-lg border border-[#262626]">
                    <p className="text-sm font-semibold text-white truncate">{search.city}</p>
                    <p className="text-xs text-[#a3a3a3] mt-1">{search.area} sqft, {search.floors} floors</p>
                    <p className="text-xs text-[#10B981] font-medium mt-1">Est: {search.estimated_value}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#a3a3a3] italic">No recent searches yet. Start analyzing above!</p>
            )}
          </motion.div>
          
          <div className="lg:col-span-2 h-[400px]">
            <AnimatedChart delay={0.7} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
