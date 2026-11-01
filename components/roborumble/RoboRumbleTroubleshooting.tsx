"use client";

import { useState } from "react";
import {
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  Wrench,
  Search,
  ChevronDown,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { ROBO_RUMBLE_TROUBLESHOOTING } from "@/data/roboRumbleData";

export default function RoboRumbleTroubleshooting() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const filteredItems = ROBO_RUMBLE_TROUBLESHOOTING.filter(
    (item) =>
      item.symptom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.cause.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.solution.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6 text-gray-300">
      {/* Title */}
      <div className="space-y-1.5 border-b border-white/10 pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-[11px] uppercase">
          <HelpCircle size={12} />
          <span>Battle-Tested Diagnostic Guide</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Robo Rumble Field Troubleshooting
        </h2>
        <p className="text-xs sm:text-sm text-gray-400">
          Diagnose and solve common RC combat failures: driver thermal shutdowns, traction slip, brownout resets, and stripped spur gear teeth.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search
          size={14}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
        />
        <input
          type="text"
          placeholder="Search symptoms (e.g. motor stall, pulls to side, wheels slip, reset on impact)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#111318] border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 shadow-inner"
        />
      </div>

      {/* Troubleshooting Matrix Accordion */}
      <div className="space-y-3">
        {filteredItems.map((item, idx) => {
          const isExpanded = expandedIndex === idx;

          return (
            <div
              key={idx}
              className={`rounded-2xl border transition overflow-hidden ${
                isExpanded
                  ? "border-orange-500/40 bg-[#111318] shadow-xl"
                  : "border-white/10 bg-[#111318]/70 hover:border-white/20"
              }`}
            >
              {/* Header */}
              <button
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left transition"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-xl shrink-0 mt-0.5 transition ${
                      isExpanded
                        ? "bg-orange-500 text-white"
                        : "bg-white/5 border border-white/10 text-orange-400"
                    }`}
                  >
                    <AlertTriangle size={15} />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      {item.symptom}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      <strong>Likely Cause:</strong> {item.cause}
                    </p>
                  </div>
                </div>

                {isExpanded ? (
                  <ChevronDown size={18} className="text-orange-400 shrink-0" />
                ) : (
                  <ChevronRight size={18} className="text-gray-400 shrink-0" />
                )}
              </button>

              {/* Solution Body */}
              {isExpanded && (
                <div className="px-4 pb-5 sm:px-5 space-y-3 border-t border-white/5 pt-4 text-xs">
                  <div className="p-4 rounded-xl bg-black/50 border border-white/5 space-y-2">
                    <span className="text-[10px] uppercase font-mono text-emerald-400 font-bold block flex items-center gap-1.5">
                      <Wrench size={12} />
                      <span>Step-by-Step Field Solution:</span>
                    </span>
                    <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                      {item.solution}
                    </p>
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
