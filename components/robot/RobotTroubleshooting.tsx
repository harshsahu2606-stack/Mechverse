"use client";

import { useState } from "react";
import { HelpCircle, Search, AlertCircle, Wrench, CheckCircle2 } from "lucide-react";
import { ROBOT_TROUBLESHOOTING } from "@/data/walkingRobotData";

export default function RobotTroubleshooting() {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = ROBOT_TROUBLESHOOTING.filter(
    (item) =>
      item.symptom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cause.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.solution.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6 text-gray-300">
      {/* Header */}
      <div className="space-y-2 border-b border-white/10 pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 font-mono text-[11px] uppercase">
          Diagnostic &amp; Repair Matrix
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Field Troubleshooting Guide
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
          Diagnose, isolate, and rectify real-world mechanical and electrical walking issues based on laboratory failure analysis.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Search symptom (e.g. slips, backwards, hums, battery)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#111318] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50"
        />
      </div>

      {/* Diagnostic Cards */}
      <div className="space-y-4">
        {filtered.map((item, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-white/10 bg-[#111318] p-5 space-y-3.5 hover:border-orange-500/40 transition"
          >
            {/* Symptom */}
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 shrink-0 mt-0.5">
                <AlertCircle size={18} />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-gray-400">
                  Observed Problem / Symptom:
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {item.symptom}
                </h3>
              </div>
            </div>

            {/* Root Cause */}
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1 text-xs">
              <span className="text-[10px] uppercase font-bold text-orange-400 tracking-wider">
                Underlying Mechanical / Electrical Cause:
              </span>
              <p className="text-gray-300 leading-relaxed">{item.cause}</p>
            </div>

            {/* Solution */}
            <div className="p-3.5 rounded-xl bg-green-500/5 border border-green-500/20 space-y-1 text-xs">
              <span className="text-[10px] uppercase font-bold text-green-400 tracking-wider flex items-center gap-1.5">
                <Wrench size={13} /> Verified Workshop Fix:
              </span>
              <p className="text-gray-200 whitespace-pre-line leading-relaxed pt-0.5">
                {item.solution}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
