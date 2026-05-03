"use client";

import { useParams } from "next/navigation";
import { ArrowLeft, Send, UploadCloud, FileText, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { useWorkspaceStatus } from "@/hooks/useWorkspaceStatus";
import { useChat } from "@/hooks/useChat";
import { DashboardTopbar } from "@/components/DashboardNav";

export default function WorkspacePage() {
  const params = useParams();
  const workspaceId = params.id as string;
  
  const { files, handleUpload } = useWorkspaceStatus(workspaceId);
  const { messages, input, setInput, submitChat, scrollRef, isStreaming } = useChat(workspaceId);

  // Convert "Source: filename.pdf" into badged text
  const formatText = (text: string) => {
    const parts = text.split(/(Source:\s*[^\s,\]]+)/g);
    return parts.map((part, i) => {
      if (part.startsWith("Source:")) {
        return (
          <span key={i} className="inline-flex items-center gap-1 bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/20 px-2 py-0.5 rounded text-xs font-medium ml-1 cursor-pointer hover:bg-[#00F0FF]/20 transition-colors">
            <FileText className="w-3 h-3" />
            {part.replace("Source:", "").trim()}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="h-screen flex flex-col bg-[#050505] text-white font-sans overflow-hidden relative">
      {/* Ethereal Aurora Gradients */}
      <div className="fixed top-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-[#00F0FF]/5 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-[#9D50BB]/5 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
      
      <DashboardTopbar />

      <div className="flex-1 flex max-w-[1600px] w-full mx-auto overflow-hidden relative z-10">
        
        {/* Left Pane: Chat */}
        <div className="flex-1 flex flex-col relative">
          <div className="px-8 pt-6 pb-2 flex items-center justify-between">
             <div className="flex items-center gap-3">
                <Link href="/dashboard" className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all">
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                <div>
                  <h2 className="text-sm font-heading font-semibold text-white/90 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#00F0FF]" />
                    Workspace
                  </h2>
                  <p className="text-xs text-white/40 font-medium">{workspaceId}</p>
                </div>
             </div>
          </div>

          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-8 space-y-6 pb-36 scroll-smooth"
          >
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[80%] rounded-2xl px-6 py-4 shadow-2xl relative group ${
                    msg.role === "user" 
                      ? "bg-gradient-to-br from-[#00F0FF] to-[#0057FF] text-[#002022] font-medium" 
                      : "bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl text-white/90"
                  }`}>
                    {msg.role === "user" && (
                      <div className="absolute inset-0 bg-[#00F0FF] blur-xl opacity-20 group-hover:opacity-30 transition-opacity rounded-2xl -z-10" />
                    )}
                    <p className="leading-relaxed text-sm whitespace-pre-wrap">{formatText(msg.text)}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Floating Input Area */}
          <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent">
            <motion.form 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              onSubmit={submitChat} 
              className="flex gap-3 max-w-4xl mx-auto group"
            >
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question rooted in your documents..."
                  className="w-full bg-white/[0.03] border border-white/[0.1] focus:border-[#00F0FF]/50 rounded-2xl px-6 py-4 text-sm text-white outline-none backdrop-blur-2xl shadow-2xl transition-all placeholder:text-white/30"
                />
                <div className="absolute inset-0 rounded-2xl bg-[#00F0FF]/5 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity blur-xl" />
              </div>
              <button 
                type="submit"
                disabled={!input.trim() || isStreaming}
                className="w-14 h-14 shrink-0 rounded-2xl bg-white text-black flex items-center justify-center hover:bg-[#00F0FF] hover:text-[#002022] transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(0,240,255,0.2)] active:scale-95"
              >
                {isStreaming ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </motion.form>
          </div>
        </div>

        {/* Right Pane: Documents */}
        <div className="w-[380px] shrink-0 border-l border-white/[0.05] bg-white/[0.01] backdrop-blur-3xl flex flex-col p-8 overflow-y-auto">
          <div className="mb-10">
            <h2 className="text-xl font-heading font-bold text-white mb-1">Knowledge Base</h2>
            <p className="text-xs font-medium text-white/40 uppercase tracking-widest">Semantic Indexing</p>
          </div>

          {/* Upload Dropzone */}
          <label className="border-2 border-dashed border-white/10 hover:border-[#00F0FF]/40 hover:bg-[#00F0FF]/5 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all group mb-10 relative overflow-hidden">
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform group-hover:text-[#00F0FF] group-hover:border-[#00F0FF]/30 text-white/50">
                <UploadCloud className="w-7 h-7" />
              </div>
              <p className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors">Upload PDF</p>
              <p className="text-[10px] text-white/30 mt-1 uppercase font-bold tracking-tighter">Chunked at 512 tokens</p>
            </div>
            <input type="file" className="hidden" accept=".pdf" onChange={handleUpload} />
          </label>

          {/* File RAG Status */}
          <div className="space-y-4 flex-1">
            <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4">Ingestion Queue</h3>
            
            {files.length === 0 ? (
              <div className="text-center py-12 rounded-2xl border border-white/[0.03] bg-white/[0.01]">
                <FileText className="w-8 h-8 text-white/10 mx-auto mb-3" />
                <p className="text-xs text-white/30 font-medium">No documents indexed</p>
              </div>
            ) : (
              files.map((file) => (
                <motion.div 
                  key={file.documentId} 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white/[0.03] border border-white/[0.05] rounded-2xl p-5 flex flex-col gap-4 group hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-white/40 group-hover:text-[#00F0FF] transition-colors" />
                      </div>
                      <span className="text-sm font-semibold truncate text-white/80">{file.name}</span>
                    </div>
                    {file.progress === 100 ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Loader2 className="w-4 h-4 text-[#00F0FF] animate-spin shrink-0" />
                    )}
                  </div>
                  
                  {file.progress < 100 && (
                    <div className="space-y-2">
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-[#00F0FF] to-[#0057FF]" 
                          initial={{ width: 0 }}
                          animate={{ width: `${file.progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[9px] uppercase tracking-widest font-black text-white/20">
                        <span>{file.status}</span>
                        <span className="text-white/40">{file.progress}%</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
