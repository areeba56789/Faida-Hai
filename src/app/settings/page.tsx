"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { Settings, User, Bell, Lock, Shield, Database, Smartphone } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const [toast, setToast] = useState<string | null>(null);

  const handleAction = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-12 relative">
        {/* Toast Notification */}
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-[#10B981]/20 border border-[#10B981]/50 text-[#10B981] px-6 py-3 rounded-full backdrop-blur-md font-medium text-sm shadow-[0_0_20px_rgba(16,185,129,0.2)]"
          >
            {toast}
          </motion.div>
        )}

        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Account Settings</h1>
          <p className="text-[#a3a3a3] mt-2">Manage your preferences and platform configurations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          {/* Settings Nav */}
          <div className="space-y-2">
            {[
              { icon: User, label: "Profile" },
              { icon: Bell, label: "Notifications" },
              { icon: Lock, label: "Security" },
              { icon: Database, label: "Data Management" },
              { icon: Smartphone, label: "Connected Devices" }
            ].map((item, idx) => (
              <button 
                key={idx}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${idx === 0 ? "bg-[#1f1f1f] text-white border border-[#262626]" : "text-[#a3a3a3] hover:bg-[#141414] hover:text-white"}`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Settings Content area */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Profile Card */}
            <div className="bg-[#141414]/80 backdrop-blur-md border border-[#262626] rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <Shield className="w-5 h-5 text-[#3B82F6] opacity-50" />
              </div>
              <h3 className="text-lg font-bold text-white mb-6">Personal Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-[#a3a3a3] uppercase font-semibold">First Name</label>
                    <input type="text" defaultValue="Enterprise" disabled className="mt-1 w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-2 text-sm text-[#d4d4d4] opacity-70" />
                  </div>
                  <div>
                    <label className="text-xs text-[#a3a3a3] uppercase font-semibold">Last Name</label>
                    <input type="text" defaultValue="User" disabled className="mt-1 w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-2 text-sm text-[#d4d4d4] opacity-70" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-[#a3a3a3] uppercase font-semibold">Email Address</label>
                  <input type="email" defaultValue="admin@faidahai.com" disabled className="mt-1 w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-2 text-sm text-[#d4d4d4] opacity-70" />
                </div>
                <div className="pt-4 flex justify-end">
                  <button 
                    onClick={() => handleAction("Account modifications are disabled in Demo/Pitch Mode.")}
                    className="px-6 py-2 bg-gradient-to-r from-[#3B82F6] to-[#10B981] hover:opacity-90 text-white rounded-lg text-sm font-bold transition-all shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-[#141414]/80 backdrop-blur-md border border-red-500/20 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-red-500 mb-2">Danger Zone</h3>
              <p className="text-sm text-[#a3a3a3] mb-6">Irreversible actions regarding your account and data.</p>
              <div className="flex items-center justify-between p-4 bg-[#0a0a0a] rounded-lg border border-red-500/10">
                <div>
                  <p className="text-white font-medium text-sm">Delete Account</p>
                  <p className="text-xs text-[#525252]">Permanently remove your account and all data.</p>
                </div>
                <button 
                  onClick={() => handleAction("Account modifications are disabled in Demo/Pitch Mode.")}
                  className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-sm font-bold transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
