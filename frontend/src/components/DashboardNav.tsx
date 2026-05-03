"use client";

import Link from "next/link";
import { Folder, Search, Bell, Settings, LayoutDashboard, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export function DashboardTopbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/[0.05] bg-[#050505]/60 backdrop-blur-xl">
      <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00F0FF] to-[#00F0FF]/40 p-[1px] group-hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all duration-300">
            <div className="w-full h-full bg-[#050505] rounded-xl flex items-center justify-center font-bold text-white font-heading text-lg">
              A
            </div>
          </div>
          <span className="text-xl font-heading font-bold tracking-tight text-white">
            Aria
          </span>
        </Link>

        {/* Search */}
        <div className="hidden md:flex items-center relative w-96">
          <Search className="w-4 h-4 text-white/40 absolute left-4" />
          <input 
            type="text" 
            placeholder="Search documents, workspaces..." 
            className="w-full bg-white/[0.03] border border-white/[0.05] rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#00F0FF]/50 focus:bg-white/[0.05] transition-all"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-5">
          <button className="text-white/60 hover:text-white transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[#00F0FF]"></span>
          </button>
          <button className="text-white/60 hover:text-white transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#9D50BB] to-purple-600 border border-white/10 overflow-hidden cursor-pointer">
            {/* Avatar placeholder */}
          </div>
        </div>
      </div>
    </nav>
  );
}

export function DashboardSidebar({ workspaces }: { workspaces: Array<{ id: string; name: string }> }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 flex flex-col gap-8">
      {/* Main Nav */}
      <div className="space-y-2">
        <Link 
          href="/dashboard"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
            pathname === "/dashboard" 
              ? "bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/20" 
              : "text-white/60 hover:text-white hover:bg-white/[0.03]"
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="font-medium">Overview</span>
        </Link>
      </div>

      {/* Workspaces List */}
      <div>
        <div className="flex items-center justify-between px-4 mb-4">
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider font-heading">
            Workspaces
          </h3>
          <button className="text-white/40 hover:text-[#00F0FF] transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        <div className="space-y-1">
          {workspaces.map((ws) => {
            const isActive = pathname === `/dashboard/${ws.id}`;
            return (
              <Link
                key={ws.id}
                href={`/dashboard/${ws.id}`}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-white/[0.05] text-white border border-white/10"
                    : "text-white/50 hover:text-white hover:bg-white/[0.03]"
                }`}
              >
                <Folder className={`w-4 h-4 ${isActive ? "text-[#9D50BB]" : "group-hover:text-white/80"}`} />
                <span className="font-medium text-sm truncate">{ws.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
