import Link from "next/link";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { ArrowRight, FileText, Zap, Shield } from "lucide-react";

export default async function Home() {
  const { userId } = await auth();
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-cyan-500/30">
      <nav className="border-b border-slate-800/60 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/20">
              A
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Aria
            </span>
          </div>
          <div className="flex items-center gap-4">
            {!userId && (
              <>
                <SignInButton mode="modal">
                  <button className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                    Log in
                  </button>
                </SignInButton>
                <SignInButton mode="modal">
                  <button className="text-sm font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-slate-200 transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                    Get Started
                  </button>
                </SignInButton>
              </>
            )}
            {userId && (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-slate-200 transition-all flex items-center gap-2 active:scale-95"
                >
                  Go to Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
                <UserButton />
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="relative">
        {/* Background Gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[40%] -left-[20%] w-[70%] h-[70%] rounded-full bg-cyan-500/10 blur-[120px]" />
          <div className="absolute top-[20%] -right-[20%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-32 pb-24 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-800 bg-slate-900/50 mb-8">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="text-sm font-medium text-slate-300">Phase 2 Alpha is Live</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
              Talk to your documents with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                instant clarity.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl leading-relaxed">
              Aria is an AI-powered Document Intelligence Platform. Upload your PDFs and get instant answers with deterministic citations powered by Gemini 2.0 Flash.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              {!userId && (
                <SignInButton mode="modal">
                  <button className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-full font-medium hover:opacity-90 transition-opacity shadow-lg shadow-cyan-500/25 active:scale-95">
                    Start Exploring <ArrowRight className="w-5 h-5" />
                  </button>
                </SignInButton>
              )}
              {userId && (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-full font-medium hover:opacity-90 transition-opacity shadow-lg shadow-cyan-500/25 active:scale-95"
                >
                  Enter Workspace <ArrowRight className="w-5 h-5" />
                </Link>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-32 max-w-5xl mx-auto relative z-10">
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm hover:border-slate-700 transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-6 text-cyan-400 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Ultra-Fast RAG</h3>
              <p className="text-slate-400 leading-relaxed">Sub-3 second latency enabled by Gemini 2.0 streaming and ChromaDB semantic retrieval.</p>
            </div>
            
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm hover:border-slate-700 transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Source Validation</h3>
              <p className="text-slate-400 leading-relaxed">Every answer is backed by direct citations rendered inline next to the original document snippet.</p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm hover:border-slate-700 transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Isolated Workspaces</h3>
              <p className="text-slate-400 leading-relaxed">Multi-tenant vector namespace isolation ensures your document embeddings are strictly private.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
