"use client";

import { motion, Variants } from "framer-motion";
import { ArrowRight, FileText, Sparkles } from "lucide-react";
import Image from "next/image";

export default function Hero3D() {
  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut" } 
    },
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#050505] text-[#e5e2e1] flex items-center justify-center font-sans">
      {/* Subtle Aurora Mesh Gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            opacity: [0.1, 0.2, 0.1], 
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#00F0FF] blur-[120px] opacity-15" 
        />
        <motion.div 
          animate={{ 
            opacity: [0.15, 0.25, 0.15],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[10%] -right-[10%] w-[40%] h-[60%] rounded-full bg-[#9D50BB] blur-[140px] opacity-15" 
        />
      </div>

      <div className="container relative z-10 mx-auto px-6 max-w-[1440px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Text Content */}
          <motion.div 
            variants={container}
            initial="hidden"
            animate="visible"
            className="flex flex-col space-y-8"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md w-fit">
              <Sparkles className="w-4 h-4 text-[#00F0FF]" />
              <span className="text-sm font-medium tracking-wide">Aria AI Intelligence</span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] font-heading">
              Ask questions across <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-[#9D50BB]">any document.</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg lg:text-xl text-[#b9cacb] max-w-lg leading-relaxed">
              Upload your PDFs, reports, and spreadsheets. Ask anything in plain English. Aria retrieves the exact answer with source citations in under 3 seconds.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-4">
              <button className="group relative px-8 py-4 bg-[#00F0FF] text-[#002022] font-semibold rounded-xl overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]">
                <span className="relative z-10 flex items-center gap-2">
                  Start Analyzing
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              </button>

              <button className="px-8 py-4 text-[#e5e2e1] font-semibold rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                View Demo
              </button>
            </motion.div>
          </motion.div>

          {/* Right 3D Visual Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            className="relative h-[400px] sm:h-[500px] lg:h-[600px] w-full perspective-1000 mt-12 lg:mt-0"
          >
            {/* The 3D generated image floating */}
            <motion.div
              animate={{ y: [-15, 15, -15], rotateY: [-2, 2, -2] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full z-10 flex items-center justify-center"
            >
              <Image 
                src="/hero-3d.png" 
                alt="3D Ethereal Dashboard Concept" 
                fill
                className="object-contain drop-shadow-[0_0_60px_rgba(0,240,255,0.2)]"
                priority
              />
            </motion.div>

            {/* Floating Glassmorphic Cards (Orbiting) */}
            <motion.div 
              animate={{ y: [-10, 10, -10], rotateZ: [0, 1, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-[20%] lg:top-[15%] left-[0%] lg:-left-[5%] z-20 w-48 p-4 rounded-2xl border border-white/10 bg-[#131313]/60 backdrop-blur-xl shadow-2xl hidden md:block"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-[#9D50BB]/20 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-[#9D50BB]" />
                </div>
                <div className="text-xs text-[#b9cacb] font-medium">Source Found</div>
              </div>
              <div className="text-sm font-semibold text-white">Q3_Risk_Report.pdf</div>
              <div className="text-xs text-[#00F0FF] mt-1">Confidence: 98%</div>
            </motion.div>

            <motion.div 
              animate={{ y: [10, -10, 10], rotateZ: [0, -1, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute bottom-[10%] lg:bottom-[20%] right-[0%] lg:-right-[5%] z-20 w-56 p-4 rounded-2xl border border-[#00F0FF]/20 bg-[#131313]/60 backdrop-blur-xl shadow-[0_0_30px_rgba(0,240,255,0.1)] hidden md:block"
            >
               <div className="flex justify-between items-center mb-2">
                  <div className="text-xs font-semibold text-[#00F0FF]">AI Pulse</div>
                  <div className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse" />
               </div>
               <div className="text-sm text-white">Processing 1.2M tokens...</div>
               <div className="w-full h-1 bg-white/10 rounded-full mt-3 overflow-hidden">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="h-full bg-gradient-to-r from-[#00F0FF] to-[#9D50BB]" 
                  />
               </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
