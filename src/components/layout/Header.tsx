"use client";

import { useEffect, useState } from "react";
import { Bell, Search } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export function Header() {
  const [userEmail, setUserEmail] = useState<string>("Loading...");
  const [userInitials, setUserInitials] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.email) {
        setUserEmail(user.email);
        setUserInitials(user.email.substring(0, 2).toUpperCase());
      } else {
        setUserEmail("Guest");
        setUserInitials("G");
      }
    };
    fetchUser();
  }, []);

  return (
    <header className="h-16 flex items-center justify-between px-8 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-[#262626] sticky top-0 z-10">
      <div className="flex items-center w-96 bg-[#141414] rounded-full px-4 py-2 border border-[#262626] focus-within:border-[#3B82F6] transition-colors">
        <Search className="w-4 h-4 text-[#a3a3a3]" />
        <input
          type="text"
          placeholder="Search properties, areas, or ask AI..."
          className="bg-transparent border-none outline-none text-sm ml-2 w-full text-white placeholder:text-[#a3a3a3]"
        />
      </div>

      <div className="flex items-center space-x-6">
        <button className="relative text-[#a3a3a3] hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-[#10B981] rounded-full border border-[#0a0a0a]"></span>
        </button>
        
        <div className="flex items-center space-x-3 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#3B82F6] to-[#10B981] p-[2px]">
            <div className="w-full h-full rounded-full bg-[#141414] flex items-center justify-center">
              <span className="text-xs font-bold text-white">{userInitials}</span>
            </div>
          </div>
          <span className="text-sm font-medium">{userEmail}</span>
        </div>
      </div>
    </header>
  );
}
