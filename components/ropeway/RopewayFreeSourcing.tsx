"use client";

import React, { useState } from "react";
import { Recycle, AlertTriangle, CheckCircle2, Layers, Cpu, Wrench, Sparkles, Plus, Check } from "lucide-react";
import { ROPEWAY_SCRAP_SOURCES, ROPEWAY_COLLECTION_CHECKLIST } from "@/data/ropewayRobotData";
import { CollectionChecklistItem } from "@/types/machine";

export default function RopewayFreeSourcing() {
  const [checklist, setChecklist] = useState<CollectionChecklistItem[]>(ROPEWAY_COLLECTION_CHECKLIST);

  const cycleStatus = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus: Record<CollectionChecklistItem["status"], CollectionChecklistItem["status"]> = {
            not_found: "found",
            found: "tested",
            tested: "ready",
            ready: "not_found",
          };
          return { ...item, status: nextStatus[item.status] };
        }
        return item;
      })
    );
  };

  const statusColors: Record<CollectionChecklistItem["status"], string> = {
    not_found: "bg-gray-800 text-gray-400 border-gray-700",
    found: "bg-amber-500/10 text-amber-400 border-amber-500/25",
    tested: "bg-sky-500/10 text-sky-400 border-sky-500/25",
    ready: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-8 text-gray-300">
      {/* Title */}
      <div className="space-y-2 border-b border-white/10 pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[11px] uppercase">
          Zero-Cost Scavenging Guide
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Build for Free: Salvaging Parts from Household Scrap
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
          You don&apos;t need expensive specialized hardware to build this rope climbing robot. Discarded desktop printers, broken tape decks, and old laptop batteries contain almost all the precision gears, rollers, and power cells required.
        </p>
      </div>

      {/* 3 Major Scrap Sources */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {ROPEWAY_SCRAP_SOURCES.map((source) => (
          <div
            key={source.id}
            className="rounded-2xl border border-white/10 bg-[#111318] p-5 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Recycle size={20} />
                </div>
                <h3 className="text-sm font-bold text-white leading-snug">{source.title}</h3>
              </div>

              {/* Usable Parts */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 block font-mono">
                  Treasure Parts
                </span>
                <ul className="space-y-1">
                  {source.usableParts.map((part, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-gray-300 leading-tight">
                      <span className="text-emerald-400 text-sm leading-none">•</span>
                      <span>{part}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Safety Warnings */}
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3 space-y-1 text-xs text-rose-300">
                <div className="flex items-center gap-1.5 font-bold text-rose-400">
                  <AlertTriangle size={13} />
                  <span>Safety Precautions</span>
                </div>
                <ul className="space-y-1 text-[11px] text-rose-200/90">
                  {source.safetyWarnings.map((warn, idx) => (
                    <li key={idx}>• {warn}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Collection Tips */}
            <div className="text-[11px] text-gray-400 bg-white/5 p-3 rounded-xl border border-white/5 italic">
              💡 {source.collectionTips}
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Scrap Collection Checklist */}
      <div className="rounded-2xl border border-white/10 bg-[#111318] p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-400" />
              <span>Scrap Sourcing Tracker</span>
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Click any status badge to cycle: Not Found → Found → Tested → Ready.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            {checklist.filter((i) => i.status === "ready").length} / {checklist.length} Ready
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {checklist.map((item) => (
            <div
              key={item.id}
              className="bg-white/5 rounded-xl p-3 border border-white/5 flex items-center justify-between gap-3"
            >
              <div className="space-y-0.5 truncate">
                <h4 className="text-xs font-bold text-white truncate">{item.componentName}</h4>
                <p className="text-[10px] text-gray-400 truncate">Source: {item.sourcedFrom}</p>
              </div>

              <button
                onClick={() => cycleStatus(item.id)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition border shrink-0 ${
                  statusColors[item.status]
                }`}
              >
                {item.status.replace("_", " ")}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
