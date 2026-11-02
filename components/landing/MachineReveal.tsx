"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Sparkles, ArrowDown } from "lucide-react";
import { TOKENS } from "@/constants/designTokens";

interface MachineRevealProps {
  onLaunchStudio?: () => void;
}

export default function MachineReveal({ onLaunchStudio }: MachineRevealProps) {
  const [progress, setProgress] = useState<number>(0.85);
  const [targetProgress, setTargetProgress] = useState<number>(0.85);
  const [isCoverOn, setIsCoverOn] = useState<boolean>(false);
  const sectionRef = useRef<HTMLElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // Scroll-Triggered Animation: Automatically calculates reveal progress based on page scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start revealing when the section enters the lower part of the screen
      const startY = windowHeight * 0.85;
      const endY = windowHeight * 0.25;

      const rawProgress = (startY - rect.top) / (startY - endY);
      const clamped = Math.max(0, Math.min(1, rawProgress));

      setTargetProgress(clamped);
      if (clamped < 0.3) {
        setIsCoverOn(true);
      } else {
        setIsCoverOn(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth damped physics interpolation loop
  useEffect(() => {
    const updatePhysics = () => {
      setProgress((prev) => {
        const diff = targetProgress - prev;
        if (Math.abs(diff) < 0.002) return targetProgress;
        return prev + diff * 0.12;
      });
      animFrameRef.current = requestAnimationFrame(updatePhysics);
    };

    animFrameRef.current = requestAnimationFrame(updatePhysics);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [targetProgress]);

  const handleToggleCover = () => {
    const nextState = !isCoverOn;
    setIsCoverOn(nextState);
    setTargetProgress(nextState ? 0.05 : 1.0);
  };

  return (
    <section
      ref={sectionRef}
      id="reveal"
      className="relative w-full py-16 sm:py-24 px-4 sm:px-6 md:px-12 border-t border-white/5 overflow-hidden"
      style={{ backgroundColor: "#060709" }}
    >
      {/* Background Studio Vignette Gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 50% 18%, rgba(255,106,26,0.06) 0%, transparent 60%),
            radial-gradient(circle at 50% 85%, rgba(255,255,255,0.015) 0%, transparent 50%)
          `,
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-orange-500/25 bg-[#0F1114]/90 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#FF6A1A] animate-pulse" />
            <span className="text-[11px] font-mono tracking-widest text-[#9AA0A9] uppercase font-semibold">
              INTERACTIVE 3D MACHINE REVEAL
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-light text-[#F4F5F7] tracking-tight">
            Scroll to Unveil Engineering{" "}
            <span className="font-semibold text-[#FF6A1A]">Precision</span>.
          </h2>
          <p className="text-xs sm:text-sm text-[#9AA0A9] max-w-xl mx-auto leading-relaxed">
            Reveal the engineering behind every machine.
          </p>
        </div>

        {/* CAD Studio Showcase Card */}
        <div className="relative w-full aspect-[16/9] min-h-[380px] max-h-[620px] rounded-2xl border border-white/10 bg-[#08090C] overflow-hidden shadow-[0_24px_70px_rgba(0,0,0,0.9)] flex items-center justify-center">
          {/* Top Bar: Status Badge (Left) & Cover Switch (Right) */}
          <div className="absolute top-4 left-4 sm:left-6 z-30 flex items-center gap-2 bg-[#0B0D12]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
            <span
              className="w-2 h-2 rounded-full transition-colors duration-300 shrink-0"
              style={{
                backgroundColor: isCoverOn ? "#eab308" : "#22c55e",
                boxShadow: `0 0 8px ${isCoverOn ? "#eab308" : "#22c55e"}`,
              }}
            />
            <span className="text-[10px] sm:text-xs font-mono text-[#E2E8F0] tracking-wider uppercase font-semibold">
              {isCoverOn
                ? "STATE: SILHOUETTE SHROUDED"
                : "STATE: SHROUD REVEALED • READY FOR FLIGHT"}
            </span>
          </div>

          {/* Cover Switch Toggle Button */}
          <div className="absolute top-4 right-4 sm:right-6 z-30 flex items-center gap-2.5 bg-[#0B0D12]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
            <span className="text-[11px] font-mono tracking-wider text-[#A0A6B2] uppercase font-semibold">
              COVER
            </span>
            <button
              onClick={handleToggleCover}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                !isCoverOn ? "bg-[#FF6A1A]" : "bg-neutral-700"
              }`}
              aria-label="Toggle Canopy Cover"
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  !isCoverOn ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Central High-Res Studio Render */}
          <div className="relative w-full h-full">
            <Image
              src="/images/landing/reveal-aero450.jpg"
              alt="AERO-450 Quadcopter Shroud Reveal"
              fill
              priority
              className="object-cover object-center transition-all duration-700 select-none"
              style={{
                filter: isCoverOn ? "brightness(0.35) contrast(1.15)" : "brightness(1.0)",
              }}
            />

            {/* Shroud Cover Silhouette Overlay during Cover Mode */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity duration-500 pointer-events-none flex items-center justify-center"
              style={{ opacity: isCoverOn ? 1 : 0 }}
            >
              <div className="border border-orange-500/30 bg-[#0F1114]/90 px-4 py-2 rounded-xl text-center">
                <span className="text-xs font-mono text-orange-400 font-semibold tracking-wider uppercase">
                  AERODYNAMIC CANOPY ATTACHED
                </span>
                <p className="text-[10px] text-neutral-400 mt-0.5">Toggle switch or scroll down to uncover</p>
              </div>
            </div>

            {/* Precision Callout Annotations Overlay (Visible when revealed) */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-500 hidden sm:block"
              style={{ opacity: isCoverOn ? 0 : 1 }}
            >
              {/* Tag: [ AERO-450 / MODULAR DRONE ] */}
              <div className="absolute top-[18%] left-[8%] z-20">
                <div className="px-2.5 py-1 rounded border border-white/20 bg-[#07090E]/85 backdrop-blur-md text-[10px] font-mono text-[#F4F5F7] tracking-wider font-semibold shadow-md">
                  [ AERO-450 / MODULAR DRONE ]
                </div>
                {/* SVG Pointer Line */}
                <svg className="w-20 h-10 overflow-visible opacity-70">
                  <line x1="50" y1="18" x2="110" y2="40" stroke="#FF6A1A" strokeWidth="1.2" />
                  <circle cx="110" cy="40" r="2.5" fill="#FF6A1A" />
                </svg>
              </div>

              {/* Tag: AERODYNAMIC SHROUD (REMOVABLE) */}
              <div className="absolute top-[15%] right-[12%] z-20 text-right">
                <div className="inline-block px-2.5 py-1 rounded border border-orange-500/30 bg-[#07090E]/85 backdrop-blur-md text-[10px] font-mono text-[#FF6A1A] tracking-wider font-semibold shadow-md">
                  AERODYNAMIC SHROUD (REMOVABLE)
                </div>
                <svg className="w-24 h-12 overflow-visible opacity-70 ml-auto">
                  <line x1="80" y1="12" x2="10" y2="35" stroke="#FF6A1A" strokeWidth="1.2" />
                  <circle cx="10" cy="35" r="2.5" fill="#FF6A1A" />
                </svg>
              </div>

              {/* Tag: BRUSHLESS MOTOR (2212 KV920) */}
              <div className="absolute bottom-[28%] left-[12%] z-20">
                <svg className="w-20 h-10 overflow-visible opacity-70">
                  <circle cx="10" cy="10" r="2.5" fill="#FF6A1A" />
                  <line x1="10" y1="10" x2="60" y2="28" stroke="#FF6A1A" strokeWidth="1.2" />
                </svg>
                <div className="px-2.5 py-1 rounded border border-white/15 bg-[#07090E]/85 backdrop-blur-md text-[10px] font-mono text-[#E2E8F0] tracking-wider font-medium shadow-md">
                  BRUSHLESS MOTOR (2212 KV920)
                </div>
              </div>

              {/* Tag: ESP32 FLIGHT CONTROLLER 400Hz • 6-DOF IMU */}
              <div className="absolute top-[26%] right-[18%] z-20 text-right">
                <div className="inline-block px-2.5 py-1 rounded border border-white/20 bg-[#07090E]/85 backdrop-blur-md text-[10px] font-mono text-[#E2E8F0] tracking-wider font-semibold shadow-md">
                  ESP32 FLIGHT CONTROLLER
                  <div className="text-[9px] text-[#A0A6B2] font-normal">400Hz • 6-DOF IMU</div>
                </div>
                <svg className="w-24 h-12 overflow-visible opacity-70 ml-auto">
                  <line x1="70" y1="12" x2="10" y2="40" stroke="#FF6A1A" strokeWidth="1.2" />
                  <circle cx="10" cy="40" r="2.5" fill="#FF6A1A" />
                </svg>
              </div>

              {/* Tag: CARBON FIBER AIRFRAME (240mm X) */}
              <div className="absolute bottom-[26%] right-[14%] z-20 text-right">
                <svg className="w-20 h-10 overflow-visible opacity-70 ml-auto">
                  <circle cx="20" cy="15" r="2.5" fill="#FF6A1A" />
                  <line x1="20" y1="15" x2="65" y2="28" stroke="#FF6A1A" strokeWidth="1.2" />
                </svg>
                <div className="inline-block px-2.5 py-1 rounded border border-white/15 bg-[#07090E]/85 backdrop-blur-md text-[10px] font-mono text-[#E2E8F0] tracking-wider font-medium shadow-md">
                  CARBON FIBER AIRFRAME (240mm X)
                </div>
              </div>
            </div>

            {/* Bottom Telemetry Bar */}
            <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 z-20 flex items-center justify-between text-[10px] font-mono text-neutral-400 pointer-events-none">
              <span className="hidden sm:inline bg-[#07090E]/80 backdrop-blur px-2.5 py-1 rounded border border-white/5">
                [ 12.9423° N, 77.6401° E ]
              </span>
              <div className="mx-auto px-3.5 py-1 rounded-full bg-[#FF6A1A]/10 border border-[#FF6A1A]/40 text-[#FF6A1A] font-semibold tracking-wider text-[10px] sm:text-[11px] shadow-sm">
                AERO-450 / CARBON AIRFRAME / 400Hz FLIGHT CONTROL
              </div>
              <span className="hidden sm:inline bg-[#07090E]/80 backdrop-blur px-2.5 py-1 rounded border border-white/5">
                FW v1.2.7
              </span>
            </div>
          </div>
        </div>

        {/* Scroll Progress Indicator & Dynamic Feedback */}
        <div className="w-full max-w-xl mt-6 flex flex-col items-center space-y-3">
          {/* Automatic Scroll Track Line */}
          <div className="relative w-full h-2 bg-white/10 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full transition-all duration-100 rounded-full"
              style={{
                width: `${Math.round(progress * 100)}%`,
                backgroundColor: TOKENS.colors.accent,
                boxShadow: `0 0 12px ${TOKENS.colors.accentGlow}`,
              }}
            />
          </div>

          {/* Scroll Direction Prompt & Live Percentage */}
          <div className="flex items-center justify-between w-full text-[11px] font-mono text-[#7B828F] px-1">
            <span>0% Shrouded</span>
            <div className="flex items-center gap-1.5 text-orange-400 font-semibold animate-pulse">
              <ArrowDown size={13} />
              <span>Scroll down to uncover</span>
            </div>
            <span className="text-white font-bold">{Math.round(progress * 100)}% Revealed</span>
          </div>
        </div>
      </div>
    </section>
  );
}
