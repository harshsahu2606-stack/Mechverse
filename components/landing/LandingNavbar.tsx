"use client";

import React from "react";
import { Search, Sun, Moon, ArrowRight } from "lucide-react";
import { AppTheme, MachineId } from "@/types/machine";
import { TOKENS } from "@/constants/designTokens";

interface LandingNavbarProps {
  theme?: AppTheme;
  onToggleTheme?: () => void;
  onLaunchStudio: (machineId?: MachineId) => void;
}

export default function LandingNavbar({
  theme = "dark",
  onToggleTheme,
  onLaunchStudio,
}: LandingNavbarProps) {
  const isLight = theme === "light";

  return (
    <header
      className={`sticky top-0 z-50 w-full px-6 md:px-12 py-4 border-b backdrop-blur-xl flex items-center justify-between transition-colors duration-300 ${
        isLight ? "bg-white/90 border-slate-200" : "bg-[#07080A]/90 border-white/10"
      }`}
    >
      {/* Brand Logo */}
      <a href="#hero" className="flex items-center gap-3 group">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white transition-transform group-hover:scale-105"
          style={{
            backgroundColor: TOKENS.colors.accent,
            boxShadow: `0 0 20px ${TOKENS.colors.accentGlow}`,
          }}
        >
          <span className="font-black text-lg italic tracking-tighter">M</span>
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold tracking-widest text-sm leading-none text-white">
            MECHVERSE
          </span>
          <span className="text-[9px] font-mono tracking-widest uppercase mt-0.5" style={{ color: TOKENS.colors.secondary }}>
            Engineering Studio
          </span>
        </div>
      </a>

      {/* Center Nav Links */}
      <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-wider uppercase" style={{ color: TOKENS.colors.secondary }}>
        <a href="#showcase" className="hover:text-white transition-colors">
          Showcase
        </a>
        <a href="#reveal" className="hover:text-white transition-colors">
          Reveal
        </a>
        <a href="#exploded" className="hover:text-white transition-colors">
          CAD Disassembly
        </a>
        <a href="#catalog" className="hover:text-white transition-colors">
          Machines
        </a>
        <a href="#workflow" className="hover:text-white transition-colors">
          Workflow
        </a>
      </nav>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg text-[#9AA0A9] hover:text-white hover:bg-white/5 transition-colors border border-white/5"
            title="Toggle Theme"
            aria-label="Toggle Theme"
          >
            {isLight ? <Moon size={15} /> : <Sun size={15} />}
          </button>
        )}

        <button
          onClick={() => onLaunchStudio()}
          className="px-4 py-2 rounded-lg text-xs font-semibold tracking-wide text-white flex items-center gap-2 transition-all transform active:scale-95"
          style={{
            backgroundColor: TOKENS.colors.accent,
            boxShadow: `0 0 20px ${TOKENS.colors.accentGlow}`,
          }}
        >
          <span>Launch Studio</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </header>
  );
}
