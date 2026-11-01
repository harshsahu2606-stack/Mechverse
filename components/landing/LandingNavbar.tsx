"use client";

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { AppTheme, MachineId } from "@/types/machine";
import { TOKENS } from "@/constants/designTokens";

interface LandingNavbarProps {
  theme?: AppTheme;
  onToggleTheme?: () => void;
  onLaunchStudio: (machineId?: MachineId) => void;
}

export default function LandingNavbar({
  onLaunchStudio,
}: LandingNavbarProps) {
  const [showSignInModal, setShowSignInModal] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 w-full px-6 md:px-12 py-4 flex items-center justify-between bg-[#07080A]/60 backdrop-blur-md border-b border-white/[0.08] pointer-events-auto">
        {/* Brand Logo matching the reference design */}
        <div className="flex items-center gap-4">
          <a href="#hero" className="flex items-center gap-2.5 group cursor-pointer">
            {/* Geometric Orange M Logo */}
            <div className="flex items-center">
              <svg width="24" height="20" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M0 24L7.5 0H12.5L14 7L15.5 0H20.5L28 24H21.5L17.5 9L15 20H13L10.5 9L6.5 24H0Z"
                  fill="#FF6A1A"
                />
              </svg>
            </div>
            <span className="font-extrabold tracking-[0.2em] text-sm md:text-base text-white uppercase">
              MECHVERSE
            </span>
          </a>

          {/* Thin vertical separator */}
          <div className="hidden sm:block h-4 w-[1px] bg-white/20 ml-1" />
        </div>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-10 text-[11px] font-mono-tech tracking-[0.22em] text-[#9AA0A9] uppercase">
          <a href="#catalog" className="hover:text-white transition-colors duration-200">
            MACHINES
          </a>
          <button
            onClick={() => onLaunchStudio()}
            className="hover:text-white transition-colors duration-200 uppercase cursor-pointer"
          >
            SIMULATOR
          </button>
          <a href="#exploded" className="hover:text-white transition-colors duration-200">
            BUILD LAB
          </a>
          <a href="#workflow" className="hover:text-white transition-colors duration-200">
            LEARN
          </a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-6 text-[11px] font-mono-tech tracking-widest uppercase">
          <button
            onClick={() => setShowSignInModal(true)}
            className="hidden sm:block text-[#9AA0A9] hover:text-white transition-colors cursor-pointer"
          >
            SIGN IN
          </button>

          <button
            onClick={() => onLaunchStudio()}
            className="px-6 py-2.5 rounded-full text-xs font-mono-tech font-semibold tracking-wider text-white flex items-center gap-2 transition-all transform active:scale-95 cursor-pointer shadow-lg hover:brightness-110"
            style={{
              backgroundColor: TOKENS.colors.accent,
              boxShadow: `0 0 25px ${TOKENS.colors.accentGlow}`,
            }}
          >
            <span>LAUNCH STUDIO</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </header>

      {/* Sign-In Simple Modal */}
      {showSignInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-sm p-6 rounded-2xl border border-white/10 bg-[#0F1114] text-white space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-mono-tech tracking-wider uppercase text-white">Engineering Access</h4>
              <button
                onClick={() => setShowSignInModal(false)}
                className="text-gray-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-[#9AA0A9] leading-relaxed">
              Sign in to save custom motor configurations, sync BOMs, and export CAD schematics.
            </p>
            <button
              onClick={() => {
                setShowSignInModal(false);
                onLaunchStudio();
              }}
              className="w-full py-2.5 rounded-xl text-xs font-mono-tech font-semibold text-white tracking-wider uppercase bg-[#FF6A1A] hover:brightness-110 transition-all"
            >
              Enter Studio Guest Session
            </button>
          </div>
        </div>
      )}
    </>
  );
}
