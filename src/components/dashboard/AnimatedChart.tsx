"use client";

import { motion } from "framer-motion";
import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function AnimatedChart({ delay = 0, portfolioValue = 0, averageROI = 0 }: { delay?: number, portfolioValue?: number, averageROI?: number }) {
  // Generate pseudo-historical data based on current value and ROI
  // Assuming the current portfolioValue is the latest, and it grew by averageROI per year.
  // We'll mock a 6 month trend where the latest month reaches the current value.
  const data = React.useMemo(() => {
    if (portfolioValue === 0) return [];
    
    // Monthly growth rate approximation
    const monthlyRate = (averageROI / 100) / 12;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
    
    let currentVal = portfolioValue / Math.pow(1 + monthlyRate, 6); // start value 6 months ago
    
    return months.map(month => {
      const investment = currentVal * 0.8; // mock original investment as 80% of value
      const profit = currentVal - investment;
      const point = { name: month, profit: Math.round(profit), investment: Math.round(investment) };
      currentVal *= (1 + monthlyRate); // compound for next month
      return point;
    });
  }, [portfolioValue, averageROI]);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay }}
      className="bg-[#141414] border border-[#262626] rounded-2xl p-6 h-full min-h-[350px] flex flex-col"
    >
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white">Profit vs Investment</h3>
        <p className="text-sm text-[#a3a3a3]">Monthly performance metrics</p>
      </div>
      
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorInvestment" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
            <XAxis dataKey="name" stroke="#a3a3a3" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#a3a3a3" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
            <Tooltip
              contentStyle={{ backgroundColor: "#141414", borderColor: "#262626", borderRadius: "8px", color: "#fff" }}
              itemStyle={{ color: "#fff" }}
            />
            <Area type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
            <Area type="monotone" dataKey="investment" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorInvestment)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
