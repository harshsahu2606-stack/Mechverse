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
      className="relative w-full py-20 px-6 md:px-12 border-t border-white/5 overflow-hidden"
      style={{ backgroundColor: TOKENS.colors.background }}
    >
      <div className="max-w-7xl mx-auto flex flex-col space-y-12">
        <div className="space-y-3">
          <div className="text-[11px] font-mono tracking-widest text-[#9AA0A9] uppercase">
            Build Workflow
          </div>
          <h2 className="text-3xl sm:text-4xl font-light text-[#F4F5F7] tracking-tight">
            From Digital CAD to{" "}
            <span className="font-semibold" style={{ color: TOKENS.colors.accent }}>
              Working Hardware
            </span>
            .
          </h2>
          <p className="text-sm text-[#9AA0A9] max-w-xl">
            A structured, beginner-friendly pipeline designed for student engineers and makers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-white/5 bg-[#0F1114] flex flex-col justify-between space-y-6"
                style={{ borderRadius: TOKENS.radii.card }}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold text-[#FF6A1A]">{s.step}</span>
                    <Icon size={18} className="text-[#9AA0A9]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-light text-white">{s.title}</h3>
                    <div className="text-[11px] font-mono text-[#5C626B] mt-0.5">{s.subtitle}</div>
                    <p className="text-xs text-[#9AA0A9] mt-3 leading-relaxed">{s.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
