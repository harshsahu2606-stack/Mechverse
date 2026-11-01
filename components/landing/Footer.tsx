"use client";

import React from "react";
import { TOKENS } from "@/constants/designTokens";
import { MachineId } from "@/types/machine";

interface FooterProps {
  onLaunchStudio: (machineId?: MachineId) => void;
}

export default function Footer({ onLaunchStudio }: FooterProps) {
  return (
    <footer
      className="w-full border-t border-white/5 py-12 px-6 md:px-12 text-xs font-mono"
      style={{ backgroundColor: TOKENS.colors.surface, color: TOKENS.colors.secondary }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3">
          <div
            className="w-6 h-6 rounded flex items-center justify-center text-white font-black text-sm italic"
            style={{ backgroundColor: TOKENS.colors.accent }}
          >
            M
          </div>
          <span className="font-semibold text-white tracking-wider">MECHVERSE</span>
          <span className="text-[#5C626B]">·</span>
          <span className="text-[#5C626B]">3D Engineering & Hardware Simulation</span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center gap-6">
          <a href="#hero" className="hover:text-white transition-colors">
            Top
          </a>
          <a href="#showcase" className="hover:text-white transition-colors">
            Showcase
          </a>
          <a href="#reveal" className="hover:text-white transition-colors">
            Reveal
          </a>
          <a href="#exploded" className="hover:text-white transition-colors">
            CAD Exploded
          </a>
          <a href="#catalog" className="hover:text-white transition-colors">
            Catalog
          </a>
          <button
            onClick={() => onLaunchStudio()}
            className="hover:text-[#FF6A1A] transition-colors cursor-pointer text-left"
          >
            Studio
          </button>
          <a
            href="https://github.com/yashharfode/Mechverse"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://github.com/yashharfode/Mechverse/blob/main/LICENSE"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors"
          >
            License
          </a>
        </div>

        {/* Copyright */}
        <div className="text-[#5C626B]">
          © 2026 Yash. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
