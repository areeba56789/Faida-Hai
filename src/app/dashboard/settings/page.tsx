"use client";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { User, Mail, Shield, Trash2, AlertTriangle, Check } from "lucide-react";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setDisplayName(user.user_metadata?.display_name || user.email?.split("@")[0] || "");
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    await supabase.auth.updateUser({ data: { display_name: displayName } });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "DELETE") return;
    setDeleting(true);
    try {
      const res = await fetch("/api/user/delete", { method: "DELETE" });
      if (res.ok) {
        await supabase.auth.signOut();
        router.push("/");
      } else {
        alert("Failed to delete account. Please contact support.");
      }
    } catch {
      alert("Network error. Please try again.");
    }
    setDeleting(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8 pb-12">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Settings</h1>
          <p className="text-[#a3a3a3] mt-1">Manage your profile and account preferences.</p>
        </motion.div>

        {/* Profile Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-[#141414] border border-[#262626] rounded-2xl p-8">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 flex items-center justify-center">
              <User className="w-5 h-5 text-[#10B981]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Profile</h2>
              <p className="text-sm text-[#737373]">Your public identity on the platform</p>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <label className="text-sm font-semibold text-[#a3a3a3] uppercase tracking-wider block mb-2">Display Name</label>
              <input
                type="text" value={displayName} onChange={e => setDisplayName(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#262626] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#10B981] transition-colors"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-[#a3a3a3] uppercase tracking-wider block mb-2">Email</label>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-[#737373]" />
                <span className="text-white">{user?.email || "Loading..."}</span>
              </div>
            </div>
            <button onClick={handleSave} disabled={saving}
              className="px-6 py-3 bg-[#10B981] hover:bg-[#059669] text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center space-x-2">
              {saved ? <><Check className="w-5 h-5" /><span>Saved!</span></> : <span>{saving ? "Saving..." : "Save Changes"}</span>}
            </button>
          </div>
        </motion.div>

        {/* Security Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-[#141414] border border-[#262626] rounded-2xl p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#3B82F6]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Security</h2>
              <p className="text-sm text-[#737373]">Authentication managed by Supabase Auth</p>
            </div>
          </div>
          <div className="bg-[#0a0a0a] border border-[#262626] rounded-xl p-4">
            <p className="text-sm text-[#a3a3a3]">Your session is secured with Row Level Security (RLS). Password resets are handled through your email provider&apos;s OAuth flow.</p>
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-[#141414] border border-red-500/20 rounded-2xl p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-red-400">Danger Zone</h2>
              <p className="text-sm text-[#737373]">Irreversible actions</p>
            </div>
          </div>
          <p className="text-sm text-[#a3a3a3] mb-6">Permanently delete your account, portfolio data, and all analysis history. This action cannot be undone.</p>
          <button onClick={() => setShowDeleteModal(true)}
            className="px-6 py-3 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 font-bold rounded-xl transition-all">
            Delete My Account
          </button>
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-[#141414] border border-[#262626] rounded-2xl p-8 max-w-md w-full">
            <div className="flex items-center space-x-3 mb-6">
              <AlertTriangle className="w-8 h-8 text-red-400" />
              <h2 className="text-xl font-bold text-white">Confirm Deletion</h2>
            </div>
            <p className="text-[#a3a3a3] mb-6">This will permanently purge your authentication record and all associated data. Type <strong className="text-white">DELETE</strong> to confirm.</p>
            <input type="text" value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)} placeholder="Type DELETE"
              className="w-full bg-[#0a0a0a] border border-[#262626] rounded-xl px-4 py-3 text-white mb-6 focus:outline-none focus:border-red-500" />
            <div className="flex space-x-4">
              <button onClick={() => { setShowDeleteModal(false); setDeleteConfirm(""); }}
                className="flex-1 px-4 py-3 bg-[#262626] text-white rounded-xl font-medium hover:bg-[#333] transition-colors">Cancel</button>
              <button onClick={handleDeleteAccount} disabled={deleteConfirm !== "DELETE" || deleting}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-bold disabled:opacity-30 hover:bg-red-600 transition-colors">
                {deleting ? "Deleting..." : "Permanently Delete"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
}
