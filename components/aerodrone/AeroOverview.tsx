"use client";

import React from "react";
import { Plane, Cpu, ShieldCheck, Zap, ArrowRight, Gauge, Scale, Timer, Crosshair } from "lucide-react";
import { CustomizationSettings } from "@/types/machine";
import { calculateAeroEngineering } from "@/data/aeroDroneData";

interface AeroOverviewProps {
  customization: CustomizationSettings;
  onNavigateTab: (tab: any) => void;
}

export default function AeroOverview({ customization, onNavigateTab }: AeroOverviewProps) {
  const calc = calculateAeroEngineering(customization);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 space-y-6 text-gray-200">
      {/* Hero Header */}
      <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-[#0c1f17] via-[#091510] to-[#070b09] p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-xs font-mono font-semibold text-emerald-400">
            <Plane size={14} />
            <span>MODULAR UAV ENGINEERING PLATFORM • F450 CLASS</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              AERO-450 Quadcopter
            </h1>
            <p className="text-emerald-400 font-mono text-sm tracking-widest font-semibold uppercase">
              Design. Understand. Build. Fly Responsibly.
            </p>
          </div>

          <p className="text-sm text-gray-300 max-w-3xl leading-relaxed">
            The AERO-450 is a precision-engineered educational drone designed for mechanical
            engineering students, roboticists, and makers. Built around a genuine 450mm glass-fiber
            reinforced frame, 2212 920KV brushless outrunners, a 32-bit Pixhawk autopilot with IMU
            damping, and dual-axis GNSS positioning.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => onNavigateTab("explorer")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition hover:scale-105"
            >
              <Plane size={15} />
              <span>Launch 3D Simulator & Exploded View</span>
              <ArrowRight size={14} />
            </button>
            <button
              onClick={() => onNavigateTab("engineering-lab")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold transition"
            >
              <Gauge size={15} className="text-emerald-400" />
              <span>Engineering Math Lab</span>
            </button>
            <button
              onClick={() => onNavigateTab("assembly-guide")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold transition"
            >
              <Cpu size={15} className="text-teal-400" />
              <span>12-Phase Build Guide</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Specs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#0e131b] border border-white/10 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">All-Up Weight</span>
            <Scale size={16} className="text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">{calc.totalMassGrams} g</div>
          <div className="text-[10px] text-gray-400">Frame + Battery + Avionics</div>
        </div>

        <div className="bg-[#0e131b] border border-white/10 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">Thrust-to-Weight</span>
            <Gauge size={16} className="text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{calc.thrustToWeightRatio}:1</div>
          <div className="text-[10px] text-gray-400">Hover at {calc.hoverThrottlePct}% Throttle</div>
        </div>

        <div className="bg-[#0e131b] border border-white/10 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">Flight Time</span>
            <Timer size={16} className="text-teal-400" />
          </div>
          <div className="text-2xl font-black text-white">{calc.estimatedFlightTimeMin} mins</div>
          <div className="text-[10px] text-gray-400">80% DoD Safe Margin</div>
        </div>

        <div className="bg-[#0e131b] border border-white/10 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">DGCA Category</span>
            <ShieldCheck size={16} className="text-blue-400" />
          </div>
          <div className="text-2xl font-black text-blue-400">Micro</div>
          <div className="text-[10px] text-gray-400">India DigitalSky Compliant</div>
        </div>
      </div>

      {/* Safety Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3 text-amber-200">
        <ShieldCheck size={20} className="text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <span className="font-bold uppercase tracking-wider text-amber-300 block">
            MANDATORY PROPS-OFF BENCH TESTING PROTOCOL
          </span>
          <p className="leading-relaxed text-amber-200/90">
            Always remove all 4 propellers during initial assembly, receiver binding, ESC
            calibration, and motor direction verification. 10-inch rotating nylon blades carry
            significant kinetic energy and can cause severe injury if an accidental spin occurs.
          </p>
        </div>
      </div>
    </div>
  );
}
