"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, Building2, Map, PieChart, Settings, LogOut, User } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/login");
  };

  const navItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard", active: pathname === "/dashboard" },
    { icon: Building2, label: "Properties", href: "/properties", active: pathname === "/properties" },
    { icon: Map, label: "Market Heatmap", href: "/dashboard/heatmap", active: pathname === "/dashboard/heatmap" },
    { icon: PieChart, label: "Analytics", href: "/dashboard/analytics", active: pathname === "/dashboard/analytics" },
  ];

  const bottomItems = [
    { icon: User, label: "Profile", href: "/dashboard/settings", active: pathname === "/dashboard/settings" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings", active: pathname === "/dashboard/settings" },
  ];

  return (
    <motion.aside
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="w-64 bg-[#0a0a0a] border-r border-[#262626] h-screen flex flex-col justify-between sticky top-0"
    >
      <div>
        <div className="h-16 flex items-center px-6 border-b border-[#262626]">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-[#10B981]/20 rounded-lg flex items-center justify-center border border-[#10B981]/30">
              <Building2 className="w-4 h-4 text-[#10B981]" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#3B82F6] to-[#10B981]">
              FaidaHai
            </span>
          </Link>
        </div>
        
        <div className="p-4 space-y-1">
          <p className="text-xs text-[#525252] uppercase tracking-widest font-semibold px-3 mb-3">Main</p>
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} passHref>
              <div
                className={clsx(
                  "flex items-center space-x-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 group relative",
                  item.active ? "bg-[#10B981]/10 text-white" : "text-[#a3a3a3] hover:bg-[#141414] hover:text-white"
                )}
              >
                {item.active && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 w-1 h-full bg-[#10B981] rounded-r-md"
                  />
                )}
                <item.icon className={clsx("w-5 h-5", item.active ? "text-[#10B981]" : "text-[#a3a3a3] group-hover:text-white")} />
                <span className="font-medium text-sm">{item.label}</span>
                {item.active && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-[#262626] space-y-1">
        <p className="text-xs text-[#525252] uppercase tracking-widest font-semibold px-3 mb-3">Account</p>
        <Link href="/dashboard/settings" passHref>
          <div className={clsx("flex items-center space-x-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors", pathname === "/dashboard/settings" ? "bg-[#10B981]/10 text-white" : "text-[#a3a3a3] hover:bg-[#141414] hover:text-white")}>
            <Settings className="w-5 h-5" />
            <span className="font-medium text-sm">Settings</span>
          </div>
        </Link>
        <div 
          onClick={handleLogout}
          className="flex items-center space-x-3 px-3 py-2.5 rounded-lg cursor-pointer text-[#a3a3a3] hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Logout</span>
        </div>
      </div>
    </motion.aside>
  );
}
