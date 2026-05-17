"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { AnimatedChart } from "@/components/dashboard/AnimatedChart";
import { ThreeDVisualizer } from "@/components/3d/ThreeDVisualizer";
import { AIChatInterface } from "@/components/ai/AIChatInterface";
import { DollarSign, Percent, TrendingUp, Building } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
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
            value="$42.5M"
            trend={{ value: 12.5, label: "vs last month" }}
            icon={DollarSign}
            delay={0.1}
          />
          <MetricCard
            title="Average ROI"
            value="14.2%"
            trend={{ value: 2.1, label: "vs last year" }}
            icon={Percent}
            delay={0.2}
          />
          <MetricCard
            title="Properties"
            value="128"
            trend={{ value: 5, label: "new this quarter" }}
            icon={Building}
            delay={0.3}
          />
          <MetricCard
            title="Market Growth"
            value="+8.4%"
            trend={{ value: -1.2, label: "vs last month" }}
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

        {/* Bottom Chart */}
        <div className="h-[400px]">
          <AnimatedChart delay={0.7} />
        </div>
      </div>
    </DashboardLayout>
  );
}
