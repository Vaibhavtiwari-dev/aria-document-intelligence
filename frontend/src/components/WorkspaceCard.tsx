"use client";

import Link from "next/link";
import { Folder, MoreVertical } from "lucide-react";
import { motion, Variants } from "framer-motion";

interface WorkspaceCardProps {
  id: string;
  name: string;
  documentCount: number;
}

const itemVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

export function WorkspaceCard({ id, name, documentCount }: WorkspaceCardProps) {
  return (
    <motion.div variants={itemVariant}>
      <Link 
        href={`/dashboard/${id}`}
        className="block p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-xl hover:bg-white/[0.04] hover:border-[#00F0FF]/30 transition-all duration-300 group relative overflow-hidden h-full"
      >
        {/* Subtle hover glow effect behind the card */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#00F0FF]/0 to-[#9D50BB]/0 group-hover:from-[#00F0FF]/5 group-hover:to-[#9D50BB]/5 transition-all duration-500 rounded-2xl" />

        <div className="relative z-10 flex flex-col h-full gap-4">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-xl bg-[#00F0FF]/10 flex items-center justify-center text-[#00F0FF] border border-[#00F0FF]/20 group-hover:scale-110 transition-transform duration-300">
              <Folder className="w-6 h-6" />
            </div>
            
            <button className="text-white/30 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors" onClick={(e) => e.preventDefault()}>
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          
          <div className="mt-auto pt-4">
            <h3 className="font-heading font-semibold text-lg text-white group-hover:text-[#00F0FF] transition-colors truncate">
              {name}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs font-medium text-white/50 bg-white/[0.05] px-2.5 py-1 rounded-full border border-white/[0.05]">
                {documentCount} {documentCount === 1 ? 'Doc' : 'Docs'}
              </span>
              <span className="text-xs text-white/40">Updated 2d ago</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
