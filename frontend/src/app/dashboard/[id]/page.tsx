"use client";

import { usePathname } from "next/navigation";

import { ArrowLeft, Send, UploadCloud, FileText, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { useWorkspaceStatus } from "@/hooks/useWorkspaceStatus";
import { useChat } from "@/hooks/useChat";

export default function WorkspacePage() {
  const pathname = usePathname();
  const workspaceId = pathname.split("/").pop(); // Simple extraction
  
  const { files, handleUpload } = useWorkspaceStatus(workspaceId);
  const { messages, input, setInput, submitChat, scrollRef, isStreaming } = useChat(workspaceId);

  // Convert "Source: filename.pdf" into badged text
  const formatText = (text: string) => {
    const parts = text.split(/(Source:\s*[^\s,\]]+)/g);
    return parts.map((part, i) => {
      if (part.startsWith("Source:")) {
        return (
          <span key={i} className="inline-flex items-center gap-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded text-xs font-medium ml-1 cursor-pointer hover:bg-cyan-500/20 transition-colors">
            <FileText className="w-3 h-3" />
            {part.replace("Source:", "").trim()}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-slate-50 font-sans overflow-hidden">
      <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-xl shrink-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <span className="text-sm font-semibold tracking-wide text-slate-300">Workspace / <span className="text-white">{workspaceId}</span></span>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700"></div>
        </div>
      </nav>

      <div className="flex-1 flex max-w-[1600px] w-full mx-auto overflow-hidden">
        
        {/* Left Pane: Chat */}
        <div className="flex-1 border-r border-slate-800 flex flex-col bg-slate-950/50 relative">
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 pb-32 scroll-smooth"
          >
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl p-5 shadow-sm ${
                  msg.role === "user" 
                    ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-cyan-500/10" 
                    : "bg-slate-900/80 border border-slate-800 text-slate-300 shadow-slate-900/50"
                }`}>
                  <p className="leading-relaxed text-sm whitespace-pre-wrap">{formatText(msg.text)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent">
            <form onSubmit={submitChat} className="flex gap-3 max-w-4xl mx-auto">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question entirely rooted in your semantic documents..."
                className="flex-1 bg-slate-900/80 border border-slate-700/50 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl px-5 py-4 text-sm text-slate-200 outline-none backdrop-blur-md shadow-lg shadow-black/20"
              />
              <button 
                type="submit"
                disabled={!input.trim() || isStreaming}
                className="w-14 shrink-0 rounded-xl bg-white text-black flex items-center justify-center hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95"
              >
                {isStreaming ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </form>
          </div>
        </div>

        {/* Right Pane: Documents */}
        <div className="w-[400px] shrink-0 bg-slate-900/30 flex flex-col p-6 overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-1">Knowledge Base</h2>
            <p className="text-sm text-slate-400">Manage semantic indexing files</p>
          </div>

          {/* Upload Dropzone */}
          <label className="border-2 border-dashed border-slate-700 hover:border-cyan-500/50 hover:bg-cyan-500/5 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all group mb-8">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform group-hover:bg-cyan-500/20 text-slate-400 group-hover:text-cyan-400">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-300">Click to upload PDF</p>
            <p className="text-xs text-slate-500 mt-1">Chunked at 512 tokens</p>
            <input type="file" className="hidden" accept=".pdf" onChange={handleUpload} />
          </label>

          {/* File RAG Status */}
          <div className="space-y-4 flex-1">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Ingestion Queue</h3>
            
            {files.length === 0 ? (
              <div className="text-center py-8 text-sm text-slate-500">No documents indexed yet.</div>
            ) : (
              files.map((file) => (
                <div key={file.documentId} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="text-sm font-medium truncate">{file.name}</span>
                    </div>
                    {file.progress === 100 ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <Loader2 className="w-4 h-4 text-cyan-500 animate-spin shrink-0" />
                    )}
                  </div>
                  
                  {file.progress < 100 && (
                    <div className="space-y-1.5">
                      <Progress value={file.progress} className="h-1.5 bg-slate-800" />
                      <div className="flex justify-between text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                        <span>{file.status}</span>
                        <span>{file.progress}%</span>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
