"use client";

import { useState } from "react";
import {
  Wrench,
  ShieldAlert,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Layers,
  Zap,
  Cpu,
  Scissors,
} from "lucide-react";
import { ROBO_RUMBLE_BUILD_GUIDE } from "@/data/roboRumbleData";

export default function RoboRumbleBuildGuide() {
  const [expandedStep, setExpandedStep] = useState<number | null>(1);

  const toggleStep = (stepNum: number) => {
    setExpandedStep(expandedStep === stepNum ? null : stepNum);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6 text-gray-300">
      {/* Title */}
      <div className="space-y-1.5 border-b border-white/10 pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/20 text-orange-400 font-mono text-[11px] uppercase">
          <Wrench size={12} />
          <span>Real-Life Engineering Workshop</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          How to Build a Real RC Battle Car
        </h2>
        <p className="text-xs sm:text-sm text-gray-400">
          A 9-stage practical fabrication manual for building an authentic, low-voltage table-top RC battle car using inexpensive or scrap materials.
        </p>
      </div>

      {/* Safety Notice Card */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 flex items-start gap-3">
        <ShieldAlert size={20} className="text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-200/90 leading-relaxed space-y-1">
          <span className="font-bold text-amber-300 uppercase font-mono block">
            Low-Voltage Safety Mandate (DC Only)
          </span>
          <p>
            This battle car project operates strictly on low-voltage DC batteries (6.0V – 7.4V DC). Never connect any wire directly to household AC mains (230V/110V). Use fused power lines and always disconnect batteries before modifying wiring.
          </p>
        </div>
      </div>

      {/* 9-Stage Interactive Accordion */}
      <div className="space-y-3">
        {ROBO_RUMBLE_BUILD_GUIDE.map((stage) => {
          const isExpanded = expandedStep === stage.stepNumber;

          return (
            <div
              key={stage.stepNumber}
              className={`rounded-2xl border transition overflow-hidden ${
                isExpanded
                  ? "border-orange-500/50 bg-[#111318] shadow-xl"
                  : "border-white/10 bg-[#111318]/70 hover:border-white/20"
              }`}
            >
              {/* Accordion Header */}
              <button
                onClick={() => toggleStep(stage.stepNumber)}
                className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left transition"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 transition ${
                      isExpanded
                        ? "bg-orange-500 text-white shadow-md shadow-orange-500/30"
                        : "bg-white/5 border border-white/10 text-gray-400"
                    }`}
                  >
                    {stage.stepNumber}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-gray-500 block">
                      Stage {stage.stepNumber} of 9
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      {stage.title}
                    </h3>
                  </div>
                </div>

                {isExpanded ? (
                  <ChevronDown size={18} className="text-orange-400 shrink-0" />
                ) : (
                  <ChevronRight size={18} className="text-gray-400 shrink-0" />
                )}
              </button>

              {/* Accordion Content */}
              {isExpanded && (
                <div className="px-4 pb-5 sm:px-5 space-y-4 border-t border-white/5 pt-4 text-xs">
                  <p className="text-gray-300 leading-relaxed font-medium">
                    {stage.description}
                  </p>

                  {/* Bullet points */}
                  <div className="space-y-2 bg-black/40 border border-white/5 p-3.5 rounded-xl">
                    <span className="text-[10px] uppercase font-mono text-gray-400 font-bold block mb-1">
                      Key Execution Instructions:
                    </span>
                    {stage.details.map((detail, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-gray-300 leading-relaxed">
                        <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>

                  {/* Stage Safety Warning */}
                  {stage.safetyNote && (
                    <div className="flex items-start gap-2 p-2.5 rounded-lg bg-white/[0.02] border border-white/5 text-[11px] text-gray-400">
                      <span className="font-bold text-orange-400 font-mono uppercase shrink-0">Tip / Safety:</span>
                      <span>{stage.safetyNote}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
