"use client";

import React, { useState } from "react";
import { Wrench, CheckCircle2, AlertTriangle, Lightbulb, Clock, Check, ChevronDown, ChevronUp } from "lucide-react";
import { ROPEWAY_BUILD_STEPS } from "@/data/ropewayRobotData";

export default function RopewayBuildGuide() {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [expandedStep, setExpandedStep] = useState<number>(1);

  const toggleComplete = (stepNumber: number) => {
    setCompletedSteps((prev) =>
      prev.includes(stepNumber) ? prev.filter((s) => s !== stepNumber) : [...prev, stepNumber]
    );
  };

  const toggleExpand = (stepNumber: number) => {
    setExpandedStep((prev) => (prev === stepNumber ? 0 : stepNumber));
  };

  const progressPct = Math.round((completedSteps.length / ROPEWAY_BUILD_STEPS.length) * 100);

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6 text-gray-300">
      {/* Title & Progress Bar */}
      <div className="space-y-4 border-b border-white/10 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-[11px] uppercase">
              DIY Workshop Manual
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Step-by-Step Ropeway Climber Assembly
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Build your autonomous cable-riding robot from scratch using 3D printed parts, an N20 metal gear motor, and household hardware.
            </p>
          </div>

          <div className="bg-[#111318] p-3 rounded-2xl border border-white/10 shrink-0 text-right sm:w-48">
            <div className="flex justify-between items-center text-xs mb-1 font-mono">
              <span className="text-gray-400">Build Progress</span>
              <span className="text-amber-400 font-bold">{progressPct}%</span>
            </div>
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-300 rounded-full"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="text-[10px] text-gray-500 font-mono mt-1 block">
              {completedSteps.length} of {ROPEWAY_BUILD_STEPS.length} steps complete
            </span>
          </div>
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-3.5">
        {ROPEWAY_BUILD_STEPS.map((step) => {
          const isDone = completedSteps.includes(step.stepNumber);
          const isExpanded = expandedStep === step.stepNumber;

          return (
            <div
              key={step.stepNumber}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isDone
                  ? "border-emerald-500/30 bg-[#0d1410]"
                  : isExpanded
                  ? "border-amber-500/40 bg-[#11141c]"
                  : "border-white/10 bg-[#0d0f14] hover:border-white/20"
              }`}
            >
              {/* Step Header */}
              <div
                onClick={() => toggleExpand(step.stepNumber)}
                className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleComplete(step.stepNumber);
                    }}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center transition border ${
                      isDone
                        ? "bg-emerald-500 border-emerald-400 text-white shadow-md shadow-emerald-500/20"
                        : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {isDone ? <Check size={16} /> : <span className="text-xs font-bold">{step.stepNumber}</span>}
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3
                        className={`text-sm sm:text-base font-bold transition ${
                          isDone ? "text-emerald-400 line-through opacity-85" : "text-white"
                        }`}
                      >
                        {step.title}
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-400 border border-white/5 hidden sm:inline-block">
                        {step.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{step.summary}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 font-mono flex items-center gap-1 hidden sm:flex">
                    <Clock size={12} /> {step.duration}
                  </span>
                  <div className="text-gray-400 p-1">
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>
              </div>

              {/* Step Expanded Content */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-1 border-t border-white/5 space-y-4">
                  {/* Detailed Instructions */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block font-mono">
                      Instructions Checklist
                    </span>
                    <ul className="space-y-2">
                      {step.instructions.map((inst, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-300 leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                          <span>{inst}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pro Tip Callout */}
                  <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 flex items-start gap-3 text-xs text-amber-200">
                    <Lightbulb size={16} className="text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-300 block mb-0.5">Workshop Pro-Tip</span>
                      <span>{step.proTip}</span>
                    </div>
                  </div>

                  {/* Complete Button */}
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => toggleComplete(step.stepNumber)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        isDone
                          ? "bg-white/10 hover:bg-white/15 text-gray-300"
                          : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25"
                      }`}
                    >
                      <CheckCircle2 size={14} />
                      <span>{isDone ? "Mark as Incomplete" : "Mark Step as Completed"}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
