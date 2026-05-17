"use client";

import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan", profit: 4000, investment: 2400 },
  { name: "Feb", profit: 3000, investment: 1398 },
  { name: "Mar", profit: 2000, investment: 9800 },
  { name: "Apr", profit: 2780, investment: 3908 },
  { name: "May", profit: 1890, investment: 4800 },
  { name: "Jun", profit: 2390, investment: 3800 },
  { name: "Jul", profit: 3490, investment: 4300 },
];

export function AnimatedChart({ delay = 0 }: { delay?: number }) {
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
