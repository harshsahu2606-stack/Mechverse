"use client";

import React from "react";
import { AppTheme, MachineId } from "@/types/machine";
import { TOKENS } from "@/constants/designTokens";

import LandingNavbar from "./LandingNavbar";
import HeroScene from "./HeroScene";
import MachineReveal from "./MachineReveal";
import MachineShowcase from "./MachineShowcase";
import ExplodedView from "./ExplodedView";
import CatalogGrid from "./CatalogGrid";
import BuildProcess from "./BuildProcess";
import CTA from "./CTA";
import Footer from "./Footer";

interface LandingPageProps {
  theme?: AppTheme;
  onToggleTheme?: () => void;
  onLaunchStudio: (machineId?: MachineId) => void;
  onOpenAR?: (machineId?: MachineId) => void;
}

export default function LandingPage({
  theme = "dark",
  onToggleTheme,
  onLaunchStudio,
  onOpenAR,
}: LandingPageProps) {
  const isLight = theme === "light";


  return (
    <div
      className={`min-h-screen w-full flex flex-col font-sans selection:bg-[#FF6A1A] selection:text-white transition-colors duration-300 ${
        isLight ? "bg-[#f8fafc] text-slate-900" : "bg-[#07080A] text-[#F4F5F7]"
      }`}
      style={{ backgroundColor: isLight ? "#f8fafc" : TOKENS.colors.background }}
    >
      {/* 1. Real Fixed Minimalist Engineering Navbar */}
      <LandingNavbar
        theme={theme}
        onToggleTheme={onToggleTheme}
        onLaunchStudio={onLaunchStudio}
        onOpenAR={onOpenAR}
      />

      <main className="flex-1 w-full flex flex-col">
        {/* 2. Real Interactive 3D Hero Scene with actual WebGL machines */}
        <HeroScene onLaunchStudio={onLaunchStudio} onOpenAR={onOpenAR} />

        {/* 3. Signature Machine Reveal (Drag-to-reveal orbital arc slider) */}
        <MachineReveal onLaunchStudio={onLaunchStudio} />

        {/* 4. Machine Showcase (Scroll/tab sequence with cinematic crossfading) */}
        <MachineShowcase onLaunchStudio={onLaunchStudio} />

        {/* 5. Exploded View (CAD layer-by-layer disassembly slider) */}
        <ExplodedView onLaunchStudio={onLaunchStudio} />

        {/* 6. Machine Catalog Grid (Verified Indian BOMs and component specs) */}
        <CatalogGrid onLaunchStudio={onLaunchStudio} onOpenAR={onOpenAR} />

        {/* 7. Structured 4-Stage Build Workflow */}
        <BuildProcess />

        {/* 8. Call to Action */}
        <CTA onLaunchStudio={onLaunchStudio} />
      </main>

      {/* 9. Minimalist Engineering Footer */}
      <Footer onLaunchStudio={onLaunchStudio} />
    </div>
  );
}
