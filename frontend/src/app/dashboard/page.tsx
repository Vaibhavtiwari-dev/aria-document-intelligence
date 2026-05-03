"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { DashboardTopbar, DashboardSidebar } from "@/components/DashboardNav";
import { WorkspaceCard } from "@/components/WorkspaceCard";

const MOCK_WORKSPACES = [
  { id: "ws_1", name: "Q1 Financial Reports", documentCount: 3 },
  { id: "ws_2", name: "Product Specs v2", documentCount: 5 },
  { id: "ws_3", name: "HR Policies 2026", documentCount: 12 },
];

const containerVariant: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

export default function Dashboard() {
  const [workspaces, setWorkspaces] = useState(MOCK_WORKSPACES);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col relative overflow-hidden">
      {/* Ethereal Aurora Gradients */}
      <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-[#00F0FF]/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-[#9D50BB]/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
      
      <DashboardTopbar />

      <div className="flex-1 max-w-[1400px] w-full mx-auto px-6 py-8 flex gap-8 relative z-10">
        
        {/* Sidebar Navigation */}
        <DashboardSidebar workspaces={workspaces} />

        {/* Main Workspace Area */}
        <main className="flex-1">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-10"
          >
            <h1 className="text-3xl font-heading font-bold text-white tracking-tight">Welcome back.</h1>
            <p className="text-white/50 mt-2 text-sm">Select a workspace to start parsing documents, or create a new one.</p>
          </motion.div>

          <motion.div 
            variants={containerVariant}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {workspaces.map((ws) => (
              <WorkspaceCard 
                key={ws.id}
                id={ws.id}
                name={ws.name}
                documentCount={ws.documentCount}
              />
            ))}

            {/* Create New Workspace Card */}
            <motion.div variants={itemVariant}>
              <button className="w-full h-full min-h-[160px] p-6 rounded-2xl border border-dashed border-white/20 bg-white/[0.01] hover:bg-white/[0.03] hover:border-[#00F0FF]/50 transition-all duration-300 group flex flex-col items-center justify-center gap-3 text-white/50 hover:text-[#00F0FF] backdrop-blur-xl">
                <div className="w-12 h-12 rounded-full bg-white/[0.03] group-hover:bg-[#00F0FF]/10 flex items-center justify-center transition-colors">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="font-medium font-heading">Create Workspace</span>
              </button>
            </motion.div>
          </motion.div>
        </main>

      </div>
    </div>
  );
}
