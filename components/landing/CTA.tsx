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
      className="relative w-full py-16 sm:py-24 px-4 sm:px-6 md:px-12 border-t border-white/5 overflow-hidden text-center"
      style={{ backgroundColor: TOKENS.colors.background }}
    >
      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(255,106,26,0.06) 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center space-y-4 sm:space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-[#0F1114]">
          <Sparkles size={12} style={{ color: TOKENS.colors.accent }} />
          <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-[#9AA0A9] uppercase">
            Start Building
          </span>
        </div>

        <h2 className="text-2xl sm:text-4xl md:text-5xl font-light text-[#F4F5F7] tracking-tight">
          Start Your First Hardware Project{" "}
          <span className="font-semibold" style={{ color: TOKENS.colors.accent }}>
            Today
          </span>
          .
        </h2>

        <p className="text-xs sm:text-base text-[#9AA0A9] max-w-xl leading-relaxed">
          Select any machine, inspect its complete internal 3D assembly, and follow step-by-step
          build tutorials with real Indian supplier BOMs from just ₹1,955.
        </p>

        <div className="pt-2 w-full sm:w-auto">
          <button
            onClick={() => onLaunchStudio()}
            className="w-full sm:w-auto justify-center px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl text-xs font-mono font-semibold tracking-wider text-white flex items-center gap-2.5 transition-all transform active:scale-95 cursor-pointer uppercase"
            style={{
              backgroundColor: TOKENS.colors.accent,
              boxShadow: `0 0 25px ${TOKENS.colors.accentGlow}`,
            }}
          >
            <span>Launch Mechverse Studio</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </section>
  );
}
