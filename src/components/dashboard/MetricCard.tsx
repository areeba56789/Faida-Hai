"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import clsx from "clsx";

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    label: string;
  };
  icon: LucideIcon;
  delay?: number;
}

export function MetricCard({ title, value, trend, icon: Icon, delay = 0 }: MetricCardProps) {
  const isPositive = trend && trend.value >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-[#141414] border border-[#262626] rounded-2xl p-6 hover:border-[#3B82F6]/50 transition-colors group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-[#1f1f1f] rounded-xl group-hover:bg-[#3B82F6]/10 transition-colors">
          <Icon className="w-6 h-6 text-[#a3a3a3] group-hover:text-[#3B82F6] transition-colors" />
        </div>
        {trend && (
          <div className={clsx(
            "flex items-center px-2.5 py-1 rounded-full text-xs font-semibold",
            isPositive ? "bg-[#10B981]/10 text-[#10B981]" : "bg-red-500/10 text-red-500"
          )}>
            {isPositive ? "+" : ""}{trend.value}%
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-[#a3a3a3] font-medium text-sm mb-1">{title}</h3>
        <div className="text-3xl font-bold text-white tracking-tight">{value}</div>
        {trend && (
          <p className="text-xs text-[#a3a3a3] mt-2">{trend.label}</p>
        )}
      </div>
    </motion.div>
  );
}
