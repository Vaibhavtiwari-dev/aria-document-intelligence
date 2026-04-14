"use client";

import { useState } from "react";

import { Plus, Folder, File, MessageSquare, ChevronRight, UploadCloud } from "lucide-react";
import Link from "next/link";

const MOCK_WORKSPACES = [
  { id: "ws_1", name: "Q1 Financial Reports", documentCount: 3 },
  { id: "ws_2", name: "Product Specs v2", documentCount: 5 },
  { id: "ws_3", name: "HR Policies 2026", documentCount: 12 },
];

export default function Dashboard() {
  const [workspaces, setWorkspaces] = useState(MOCK_WORKSPACES);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans flex flex-col">
      <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/20">
              A
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Aria Dashboard
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700"></div>
          </div>
        </div>
      </nav>

      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 flex gap-8">
        
        {/* Sidebar */}
        <div className="w-64 shrink-0 flex flex-col gap-6">
          <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-3 rounded-xl font-medium hover:opacity-90 transition-all active:scale-95 shadow-md shadow-cyan-500/10">
            <Plus className="w-5 h-5" />
            New Workspace
          </button>
          
          <div className="space-y-1 mt-4">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-3">Your Workspaces</h3>
            {workspaces.map((ws) => (
              <Link
                key={ws.id}
                href={`/dashboard/${ws.id}`}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-slate-800/50 text-slate-300 hover:text-white transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Folder className="w-4 h-4 text-cyan-500" />
                  <span className="font-medium text-sm">{ws.name}</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-slate-900/30 border border-slate-800 rounded-2xl p-8 flex flex-col">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Welcome back.</h1>
            <p className="text-slate-400">Select a workspace to start parsing documents, or create a new one.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {workspaces.map((ws) => (
              <Link 
                key={ws.id} 
                href={`/dashboard/${ws.id}`}
                className="p-6 rounded-xl border border-slate-800 bg-slate-900/50 hover:border-cyan-500/50 hover:bg-slate-800/50 transition-all group flex flex-col gap-4"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                    <Folder className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-slate-500 bg-slate-900 px-2 py-1 rounded-full border border-slate-800 group-hover:border-slate-700 transition-colors">
                    {ws.documentCount} Docs
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg group-hover:text-cyan-400 transition-colors">{ws.name}</h3>
                  <p className="text-sm text-slate-400 mt-1">Chat and explore sources</p>
                </div>
              </Link>
            ))}

            <button className="p-6 rounded-xl border border-dashed border-slate-700 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all group flex flex-col items-center justify-center gap-3 text-slate-500 hover:text-cyan-400 min-h-[160px]">
              <Plus className="w-8 h-8" />
              <span className="font-medium">Create Workspace</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
