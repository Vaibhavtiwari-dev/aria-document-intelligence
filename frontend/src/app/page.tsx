import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Hero3D from "@/components/Hero3D";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e2e1] font-sans selection:bg-[#00F0FF]/30">
      <nav className="absolute top-0 left-0 w-full z-50 border-b border-white/5 bg-[#131313]/30 backdrop-blur-xl">
        <div className="max-w-[1440px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00F0FF] to-[#9D50BB] flex items-center justify-center font-bold text-white shadow-[0_0_20px_rgba(0,240,255,0.2)]">
              A
            </div>
            <span className="text-2xl font-bold tracking-tight text-white font-heading">
              Aria
            </span>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[#b9cacb]">
              <Link href="#features" className="hover:text-white transition-colors">Features</Link>
              <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
              <Link href="#docs" className="hover:text-white transition-colors">Docs</Link>
            </div>
            <Link
              href="/dashboard"
              className="text-sm font-semibold bg-white/5 border border-white/10 text-white px-5 py-2.5 rounded-full hover:bg-white/10 transition-all flex items-center gap-2 active:scale-95"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative">
        <Hero3D />
      </main>
    </div>
  );
}
