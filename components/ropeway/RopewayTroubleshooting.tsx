"use client";

import React, { useState } from "react";
import { HelpCircle, AlertTriangle, CheckCircle2, Wrench, Search, ChevronDown, ChevronUp } from "lucide-react";
import { ROPEWAY_TROUBLESHOOTING } from "@/data/ropewayRobotData";

export default function RopewayTroubleshooting() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [expandedIndex, setExpandedIndex] = useState<number>(0);

  const filteredItems = ROPEWAY_TROUBLESHOOTING.filter(
    (item) =>
      item.problem.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.solutions.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6 text-gray-300">
      {/* Title & Search Bar */}
      <div className="space-y-4 border-b border-white/10 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 font-mono text-[11px] uppercase">
            Field Diagnostics & Repairs
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Ropeway Troubleshooting & Fixes
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Solve cable slippage, motor stalling on steep inclines, derailment risks, and reversing switch issues.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search symptoms (e.g., slipping, stall, derailing)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#111318] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-rose-500/50"
          />
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-3.5">
        {filteredItems.map((item, idx) => {
          const isExpanded = expandedIndex === idx;

          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isExpanded ? "border-rose-500/35 bg-[#120f14]" : "border-white/10 bg-[#0d0f14] hover:border-white/20"
              }`}
            >
              {/* Header */}
              <div
                onClick={() => setExpandedIndex(isExpanded ? -1 : idx)}
                className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                    <AlertTriangle size={16} />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white">{item.problem}</h3>
                </div>

                <div className="text-gray-400 p-1 shrink-0">
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </div>

              {/* Body */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-1 border-t border-white/5 space-y-4">
                  {/* Causes & Checks */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Probable Causes */}
                    <div className="space-y-1.5 bg-white/5 p-3.5 rounded-xl border border-white/5">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400 font-mono block">
                        Probable Causes
                      </span>
                      <ul className="space-y-1">
                        {item.causes.map((c, i) => (
                          <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                            <span className="text-rose-400 leading-none mt-1">•</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Diagnostic Checks */}
                    <div className="space-y-1.5 bg-white/5 p-3.5 rounded-xl border border-white/5">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 font-mono block">
                        Diagnostic Checks
                      </span>
                      <ul className="space-y-1">
                        {item.checks.map((chk, i) => (
                          <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                            <span className="text-amber-400 leading-none mt-1">•</span>
                            <span>{chk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Verified Solutions */}
                  <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-4 space-y-2">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 size={14} />
                      <span>Verified Fixes</span>
                    </span>
                    <ul className="space-y-1.5">
                      {item.solutions.map((sol, i) => (
                        <li key={i} className="text-xs text-emerald-200/90 flex items-start gap-2 leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                          <span>{sol}</span>
                        </li>
                      ))}
                    </ul>
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
