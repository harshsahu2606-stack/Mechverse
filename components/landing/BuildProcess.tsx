"use client";

import React from "react";
import { Layers, Activity, Cpu, Rocket } from "lucide-react";
import { TOKENS } from "@/constants/designTokens";

const STEPS = [
  {
    step: "01",
    title: "Design in 3D",
    subtitle: "CAD Assembly & Kinematics",
    description: "Inspect every internal structural part, measure dimensions, and verify collision clearances.",
    icon: Layers,
  },
  {
    step: "02",
    title: "Simulate & Test",
    subtitle: "Physics & PID Attitude Loop",
    description: "Run real numerical physics loops to evaluate thrust-to-weight, motor temperatures, and stability.",
    icon: Activity,
  },
  {
    step: "03",
    title: "Build & Wire",
    subtitle: "Verified Indian BOM & Schematics",
    description: "Order components directly from Indian suppliers with exact wiring diagrams and pinouts.",
    icon: Cpu,
  },
  {
    step: "04",
    title: "Test in Real World",
    subtitle: "Maiden Flight & Field Validation",
    description: "Flash open firmware, calibrate sensors via smartphone Wi-Fi hotspot, and take flight safely.",
    icon: Rocket,
  },
];

export default function BuildProcess() {
  return (
    <section
      id="workflow"
      className="relative w-full py-16 sm:py-24 px-4 sm:px-6 md:px-12 border-t border-white/5 overflow-hidden"
      style={{ backgroundColor: TOKENS.colors.background }}
    >
      {/* Background Studio Vignette Gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(255,106,26,0.03) 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col space-y-8 sm:space-y-12">
        <div className="space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-[#0F1114] text-[10px] sm:text-[11px] font-mono-tech tracking-widest text-[#9AA0A9] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A1A]" />
            <span>Build Workflow</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-light text-[#F4F5F7] tracking-tight">
            From Digital CAD to{" "}
            <span className="font-semibold text-[#FF6A1A]">
              Working Hardware
            </span>
            .
          </h2>
          <p className="text-xs sm:text-sm text-[#9AA0A9] max-w-xl leading-relaxed">
            A structured, beginner-friendly 4-stage pipeline engineered for students, makers, and aerospace hobbyists.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="relative p-6 rounded-2xl border border-white/10 bg-[#0c1017]/90 hover:bg-[#121722] hover:border-orange-500/50 hover:-translate-y-1 flex flex-col justify-between space-y-6 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] group overflow-hidden"
              >
                {/* Glowing Top Accent Line */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#FF6A1A] bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-md">
                      {s.step}
                    </span>
                    <div className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:border-orange-500/30 group-hover:bg-orange-500/10 transition-colors">
                      <Icon size={18} className="text-[#9AA0A9] group-hover:text-orange-400 transition-colors" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white tracking-tight group-hover:text-orange-100 transition-colors">
                      {s.title}
                    </h3>
                    <div className="text-[11px] font-mono text-[#FF6A1A]/80 mt-0.5 font-medium">
                      {s.subtitle}
                    </div>
                    <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                      {s.description}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500 group-hover:text-slate-400">
                  <span>Phase {s.step} / 04</span>
                  <span className="text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity">Ready →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
