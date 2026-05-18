"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, Building2, Map, PieChart, Settings, LogOut } from "lucide-react";
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
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", active: pathname === "/dashboard" },
    { icon: Building2, label: "Properties", href: "/properties", active: pathname === "/properties" },
    { icon: Map, label: "Market Heatmap", href: "#", active: false },
    { icon: PieChart, label: "Analytics", href: "#", active: false },
  ];

  return (
    <motion.aside
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="w-64 bg-[#0a0a0a] border-r border-[#262626] h-screen flex flex-col justify-between sticky top-0"
    >
      <div>
        <div className="h-16 flex items-center px-6 border-b border-[#262626]">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#3B82F6] to-[#10B981]">
            FaidaHai
          </span>
        </div>
        
        <div className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} passHref>
              <div
                className={clsx(
                  "flex items-center space-x-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors duration-200 group relative",
                  item.active ? "bg-[#1f1f1f] text-white" : "text-[#a3a3a3] hover:bg-[#141414] hover:text-white"
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
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-[#262626] space-y-2">
        <div className="flex items-center space-x-3 px-3 py-2.5 rounded-lg cursor-pointer text-[#a3a3a3] hover:bg-[#141414] hover:text-white transition-colors">
          <Settings className="w-5 h-5" />
          <span className="font-medium text-sm">Settings</span>
        </div>
        <div 
          onClick={handleLogout}
          className="flex items-center space-x-3 px-3 py-2.5 rounded-lg cursor-pointer text-[#a3a3a3] hover:bg-[#141414] hover:text-red-400 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Logout</span>
        </div>
      </div>
    </motion.aside>
  );
}
