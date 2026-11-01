"use client";

import React, { useState } from "react";
import { ArrowRight, Camera, Menu, X } from "lucide-react";
import { AppTheme, MachineId } from "@/types/machine";
import { TOKENS } from "@/constants/designTokens";

interface LandingNavbarProps {
  theme?: AppTheme;
  onToggleTheme?: () => void;
  onLaunchStudio: (machineId?: MachineId) => void;
  onOpenAR?: (machineId?: MachineId) => void;
}

export default function LandingNavbar({
  onLaunchStudio,
  onOpenAR,
}: LandingNavbarProps) {
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 w-full px-4 sm:px-6 md:px-12 py-3 sm:py-4 flex items-center justify-between bg-[#07080A]/75 backdrop-blur-md border-b border-white/[0.08] pointer-events-auto">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <a href="#hero" className="flex items-center gap-2 group cursor-pointer" onClick={closeMenu}>
            {/* Geometric Orange M Logo */}
            <div className="flex items-center shrink-0">
              <svg width="22" height="18" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M0 24L7.5 0H12.5L14 7L15.5 0H20.5L28 24H21.5L17.5 9L15 20H13L10.5 9L6.5 24H0Z"
                  fill="#FF6A1A"
                />
              </svg>
            </div>
            <span className="font-extrabold tracking-[0.18em] text-xs sm:text-sm md:text-base text-white uppercase">
              MECHVERSE
            </span>
          </a>

          {/* Thin vertical separator */}
          <div className="hidden sm:block h-4 w-[1px] bg-white/20 ml-1" />
        </div>

        {/* Center Nav Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-8 xl:gap-10 text-[11px] font-mono-tech tracking-[0.22em] text-[#9AA0A9] uppercase">
          <a href="#catalog" className="hover:text-white transition-colors duration-200">
            MACHINES
          </a>
          <button
            onClick={() => onLaunchStudio()}
            className="hover:text-white transition-colors duration-200 uppercase cursor-pointer"
          >
            SIMULATOR
          </button>
          <button
            onClick={() => onOpenAR && onOpenAR("drone-b")}
            className="text-[#FF6A1A] hover:text-white transition-colors duration-200 uppercase cursor-pointer flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A1A] animate-pulse" />
            <span>WEB AR</span>
          </button>
          <a href="#exploded" className="hover:text-white transition-colors duration-200">
            BUILD LAB
          </a>
          <a href="#workflow" className="hover:text-white transition-colors duration-200">
            LEARN
          </a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 sm:gap-4 md:gap-6 text-[11px] font-mono-tech tracking-widest uppercase">
          {/* AR Preview Shortcut */}
          <button
            onClick={() => onOpenAR && onOpenAR("drone-b")}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#FF6A1A]/30 bg-[#FF6A1A]/10 text-[#FF6A1A] hover:bg-[#FF6A1A] hover:text-white transition-all cursor-pointer"
          >
            <Camera size={12} />
            <span>AR PREVIEW</span>
          </button>

          <button
            onClick={() => setShowSignInModal(true)}
            className="hidden md:block text-[#9AA0A9] hover:text-white transition-colors cursor-pointer"
          >
            SIGN IN
          </button>

          {/* Launch Studio CTA */}
          <button
            onClick={() => onLaunchStudio()}
            className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-mono-tech font-semibold tracking-wider text-white flex items-center gap-1.5 sm:gap-2 transition-all transform active:scale-95 cursor-pointer shadow-lg hover:brightness-110 shrink-0"
            style={{
              backgroundColor: TOKENS.colors.accent,
              boxShadow: `0 0 20px ${TOKENS.colors.accentGlow}`,
            }}
          >
            <span>STUDIO</span>
            <ArrowRight size={12} />
          </button>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            className="lg:hidden p-2 rounded-xl text-white/80 hover:text-white bg-white/5 border border-white/10 transition-colors"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer / Overlay Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden bg-black/90 backdrop-blur-2xl pt-20 px-6 pb-8 flex flex-col justify-between animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-5 text-sm font-mono tracking-widest text-[#9AA0A9] uppercase pt-4">
            <a
              href="#catalog"
              onClick={closeMenu}
              className="py-2.5 border-b border-white/10 hover:text-white transition-colors flex items-center justify-between"
            >
              <span>MACHINES</span>
              <span className="text-[10px] text-white/40">01</span>
            </a>
            <button
              onClick={() => {
                closeMenu();
                onLaunchStudio();
              }}
              className="py-2.5 text-left border-b border-white/10 hover:text-white transition-colors flex items-center justify-between"
            >
              <span>SIMULATOR</span>
              <span className="text-[10px] text-white/40">02</span>
            </button>
            <button
              onClick={() => {
                closeMenu();
                if (onOpenAR) onOpenAR("drone-b");
              }}
              className="py-2.5 text-left border-b border-[#FF6A1A]/30 text-[#FF6A1A] hover:text-white transition-colors flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Camera size={14} />
                <span>INTERACTIVE WEB AR</span>
              </span>
              <span className="text-[10px] bg-[#FF6A1A]/20 px-1.5 py-0.5 rounded text-[#FF6A1A] font-bold">
                LIVE
              </span>
            </button>
            <a
              href="#exploded"
              onClick={closeMenu}
              className="py-2.5 border-b border-white/10 hover:text-white transition-colors flex items-center justify-between"
            >
              <span>BUILD LAB</span>
              <span className="text-[10px] text-white/40">03</span>
            </a>
            <a
              href="#workflow"
              onClick={closeMenu}
              className="py-2.5 border-b border-white/10 hover:text-white transition-colors flex items-center justify-between"
            >
              <span>LEARN</span>
              <span className="text-[10px] text-white/40">04</span>
            </a>
            <button
              onClick={() => {
                closeMenu();
                setShowSignInModal(true);
              }}
              className="py-2.5 text-left border-b border-white/10 hover:text-white transition-colors flex items-center justify-between"
            >
              <span>SIGN IN</span>
              <span className="text-[10px] text-white/40">AUTH</span>
            </button>
          </nav>

          <div className="space-y-3 pt-6 border-t border-white/10">
            <button
              onClick={() => {
                closeMenu();
                onLaunchStudio();
              }}
              className="w-full py-3.5 rounded-2xl bg-[#FF6A1A] text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#FF6A1A]/30"
            >
              <span>Launch 3D Studio</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

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
