"use client";

import React, { useState } from "react";
import { HelpCircle, Search, Wrench } from "lucide-react";
import { AERO_TROUBLESHOOTING } from "@/data/aeroDroneData";

export default function AeroTroubleshooting() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const filteredIssues = AERO_TROUBLESHOOTING.filter(
    (item) =>
      item.symptom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.rootCause.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subsystem.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeIssue = filteredIssues[selectedIndex] || AERO_TROUBLESHOOTING[0];

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 space-y-6 text-gray-200">
      <div>
        <h2 className="text-2xl font-black text-white flex items-center gap-2">
          <HelpCircle className="text-emerald-400" size={24} />
          <span>UAV Diagnostic Troubleshooting Matrix</span>
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Solve real-world quadcopter build issues, pre-arm warnings, flip-on-takeoff, and telemetry faults.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-2.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search symptoms (e.g. 'flip on takeoff', 'twitch', 'toilet bowl', 'prearm')..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setSelectedIndex(0);
          }}
          className="w-full bg-[#0e131b] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Symptom Selector List */}
        <div className="space-y-2 max-h-[550px] overflow-y-auto custom-scrollbar pr-1">
          {filteredIssues.map((item, idx) => {
            const isSelected = item.symptom === activeIssue.symptom;
            return (
              <div
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                className={`p-3.5 rounded-xl border cursor-pointer transition select-none ${
                  isSelected
                    ? "bg-emerald-600/20 border-emerald-500 text-white shadow-lg"
                    : "bg-[#0e131b] border-white/10 hover:border-white/20 text-gray-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase font-bold text-emerald-400">
                    {item.subsystem}
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded uppercase bg-rose-500/20 text-rose-300">
                    {item.probability}
                  </span>
                </div>
                <h4 className="text-xs font-bold mt-1 text-white leading-snug">{item.symptom}</h4>
              </div>
            );
          })}
        </div>

        {/* Right Column: Detailed Diagnostic Card */}
        <div className="md:col-span-2 bg-[#0e131b] border border-white/10 rounded-2xl p-6 space-y-5">
          <div className="border-b border-white/10 pb-4 space-y-1">
            <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">
              DIAGNOSTIC PROTOCOL • SUBSYSTEM: {activeIssue.subsystem.toUpperCase()}
            </span>
            <h3 className="text-lg font-bold text-white">{activeIssue.symptom}</h3>
          </div>

          <div className="space-y-4 text-xs">
            {/* Root Cause */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-[10px] font-mono text-gray-400 uppercase block font-bold">
                Physical Root Cause:
              </span>
              <p className="text-gray-300 leading-relaxed">{activeIssue.rootCause}</p>
            </div>

            {/* Test Steps */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-emerald-400 uppercase block font-bold">
                Verification & Test Steps:
              </span>
              <ul className="space-y-1.5 list-disc list-inside text-gray-300 leading-relaxed">
                {activeIssue.diagnosticSteps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
            </div>

            {/* Solution / Remedy */}
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-200 space-y-1">
              <div className="flex items-center gap-2 font-bold text-emerald-300 uppercase font-mono text-[11px]">
                <Wrench size={14} />
                <span>Permanent Corrective Remedy:</span>
              </div>
              <p className="text-emerald-100/90 leading-relaxed">{activeIssue.remedy}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
