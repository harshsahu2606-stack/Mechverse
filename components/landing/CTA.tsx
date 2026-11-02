"use client";

import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { TOKENS } from "@/constants/designTokens";
import { MachineId } from "@/types/machine";

interface CTAProps {
  onLaunchStudio: (machineId?: MachineId) => void;
}

export default function CTA({ onLaunchStudio }: CTAProps) {
  return (
    <section
      className="relative w-full py-20 sm:py-28 px-4 sm:px-6 md:px-12 border-t border-white/10 overflow-hidden text-center"
      style={{ backgroundColor: TOKENS.colors.background }}
    >
      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(255,106,26,0.08) 0%, transparent 65%)`,
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center space-y-6 sm:space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-orange-500/30 bg-[#0F1114]/90 shadow-md">
          <Sparkles size={12} className="text-[#FF6A1A] animate-pulse" />
          <span className="text-[11px] font-mono-tech tracking-widest text-[#9AA0A9] uppercase font-medium">
            Start Engineering
          </span>
        </div>

        <h2 className="text-3xl sm:text-5xl md:text-6xl font-light text-[#F4F5F7] tracking-tight max-w-2xl">
          Build Real Machines{" "}
          <span className="font-semibold text-[#FF6A1A]">
            Beyond Ordinary
          </span>
          .
        </h2>

        <p className="text-xs sm:text-base text-slate-400 max-w-xl leading-relaxed">
          Select any machine, inspect its complete internal 3D assembly, run 400Hz physics, and follow step-by-step
          build tutorials with verified Indian supplier BOMs from just ₹1,955.
        </p>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full max-w-3xl pt-2">
          {[
            { label: "8+ MACHINES", sub: "Drones & Robotics" },
            { label: "₹1,955 ENTRY", sub: "Verified Indian BOM" },
            { label: "400Hz SIM", sub: "Flight Physics Loop" },
            { label: "ZERO-APP AR", sub: "In-Browser WebAR" },
          ].map((stat, i) => (
            <div
              key={i}
              className="p-3 sm:p-4 rounded-xl border border-white/10 bg-[#0F1114]/80 backdrop-blur-md flex flex-col items-center text-center shadow-lg"
            >
              <span className="text-xs sm:text-sm font-mono font-bold text-white tracking-wider">
                {stat.label}
              </span>
              <span className="text-[10px] sm:text-[11px] font-mono text-[#9AA0A9] mt-0.5">
                {stat.sub}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => onLaunchStudio()}
            className="w-full sm:w-auto justify-center px-8 py-4 rounded-xl text-xs font-mono-tech font-semibold tracking-wider text-white flex items-center gap-2.5 transition-all transform active:scale-95 cursor-pointer uppercase shadow-2xl hover:brightness-110"
            style={{
              backgroundColor: TOKENS.colors.accent,
              boxShadow: `0 0 30px ${TOKENS.colors.accentGlow}`,
            }}
          >
            <span>Launch Mechverse Studio</span>
            <ArrowRight size={15} />
          </button>

          <a
            href="#catalog"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="w-full sm:w-auto justify-center px-6 py-4 rounded-xl text-xs font-mono-tech font-medium tracking-wider text-slate-300 hover:text-white flex items-center gap-2 transition-all cursor-pointer uppercase border border-white/10 bg-[#0F1114] hover:bg-[#161A1F] hover:border-white/30"
          >
            <span>Browse All 8 Machines</span>
          </a>
        </div>
      </div>
    </section>
  );
}
