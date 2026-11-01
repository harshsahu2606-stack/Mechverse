"use client";

import React, { useState } from "react";
import { Wrench, ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, ShieldCheck } from "lucide-react";
import { AERO_BUILD_STEPS } from "@/data/aeroDroneData";

export default function AeroAssemblyGuide() {
  const [openStep, setOpenStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  const toggleStep = (num: number) => {
    setOpenStep((prev) => (prev === num ? 0 : num));
  };

  const toggleCompleted = (num: number) => {
    setCompletedSteps((prev) => ({ ...prev, [num]: !prev[num] }));
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6 text-gray-200">
      <div>
        <h2 className="text-2xl font-black text-white flex items-center gap-2">
          <Wrench className="text-emerald-400" size={24} />
          <span>12-Phase Physical Build & Assembly Guide</span>
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Follow these structured mechanical and electrical phases to assemble an actual F450 quadcopter safely in real life.
        </p>
      </div>

      {/* Mandatory Safety Notice */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex items-start gap-3">
        <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <span className="font-bold uppercase tracking-wider text-amber-300 block">
            CRITICAL SAFETY DIRECTIVE: PROPELLERS REMAIN OFF
          </span>
          <p className="text-amber-200/90 leading-relaxed">
            Never attach propellers until Step 12 (Pre-Flight Field Readiness). All bench soldering, wiring, motor spin direction testing, and receiver binding MUST be performed with propellers detached.
          </p>
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {AERO_BUILD_STEPS.map((step) => {
          const isOpen = openStep === step.step;
          const isDone = !!completedSteps[step.step];

          return (
            <div
              key={step.step}
              className={`rounded-2xl border transition overflow-hidden ${
                isOpen
                  ? "bg-[#0e141c] border-emerald-500/40 shadow-xl"
                  : "bg-[#0a0e14] border-white/10 hover:border-white/20"
              }`}
            >
              {/* Header */}
              <div
                onClick={() => toggleStep(step.step)}
                className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-3.5">
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono text-xs font-bold ${
                      isDone
                        ? "bg-emerald-600 text-white"
                        : "bg-white/10 text-gray-300"
                    }`}
                  >
                    {isDone ? <CheckCircle2 size={16} /> : step.step}
                  </span>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 block">
                      Phase {step.step} • {step.category} • Est. {step.estimatedMinutes} mins
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white">{step.title}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCompleted(step.step);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold font-mono border transition ${
                      isDone
                        ? "bg-emerald-600/20 border-emerald-500/40 text-emerald-300"
                        : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    {isDone ? "Completed ✓" : "Mark Done"}
                  </button>
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </div>

              {/* Body */}
              {isOpen && (
                <div className="px-5 pb-5 pt-1 space-y-4 border-t border-white/5 text-xs text-gray-300">
                  <p className="leading-relaxed text-gray-300">{step.description}</p>

                  {/* Tools Required */}
                  <div className="p-3 bg-black/30 rounded-xl border border-white/5 space-y-1">
                    <span className="text-[10px] font-mono text-gray-400 uppercase block font-bold">
                      Tools & Equipment Required:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {step.toolsRequired.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-300 font-mono text-[11px]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Step instructions */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase block font-bold">
                      Step-by-Step Procedure:
                    </span>
                    <ol className="space-y-1.5 list-decimal list-inside text-gray-300">
                      {step.instructions.map((ins, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {ins}
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Safety Warning */}
                  {step.warning && (
                    <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200 flex items-start gap-2">
                      <AlertTriangle size={15} className="text-amber-400 shrink-0 mt-0.5" />
                      <p className="text-[11px] leading-relaxed">{step.warning}</p>
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
