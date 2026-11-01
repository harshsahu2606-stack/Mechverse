"use client";

import {
  Recycle,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  ExternalLink,
  CarFront,
  Box,
  Wrench,
  Zap,
  Cpu,
} from "lucide-react";
import { ROBO_RUMBLE_FREE_SCRAP_SOURCES } from "@/data/roboRumbleData";

export default function RoboRumbleFreeSourcing() {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "CarFront":
        return <CarFront size={22} className="text-orange-400" />;
      case "Box":
        return <Box size={22} className="text-sky-400" />;
      case "Wrench":
        return <Wrench size={22} className="text-amber-400" />;
      case "Zap":
        return <Zap size={22} className="text-yellow-400" />;
      case "Cpu":
        return <Cpu size={22} className="text-emerald-400" />;
      default:
        return <Recycle size={22} className="text-orange-400" />;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6 text-gray-300">
      {/* Title */}
      <div className="space-y-1.5 border-b border-white/10 pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[11px] uppercase">
          <Recycle size={12} />
          <span>Zero-Cost Scrap Sourcing Directory</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Where to Find Free &amp; Recycled Battle Car Parts
        </h2>
        <p className="text-xs sm:text-sm text-gray-400">
          Build a competitive battle car on a tiny budget by repurposing common household and electronic waste instead of buying expensive pre-made RC kits.
        </p>
      </div>

      {/* Scrap Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {ROBO_RUMBLE_FREE_SCRAP_SOURCES.map((source) => (
          <div
            key={source.id}
            className="rounded-2xl border border-white/10 bg-[#111318] p-5 space-y-4 shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start gap-3">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 shrink-0">
                  {getIcon(source.icon)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white leading-snug">
                    {source.title}
                  </h3>
                  <p className="text-[11px] text-gray-400 mt-1">
                    {source.collectionTips}
                  </p>
                </div>
              </div>

              {/* Usable Parts */}
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
                  Usable Parts to Salvage:
                </span>
                {source.usableParts.map((part, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                    <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                    <span>{part}</span>
                  </div>
                ))}
              </div>

              {/* Safety Warning */}
              {source.safetyWarnings && (
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1 text-xs">
                  <span className="text-[10px] font-mono uppercase text-amber-400 font-bold flex items-center gap-1">
                    <ShieldAlert size={12} />
                    <span>Safety Precautions:</span>
                  </span>
                  {source.safetyWarnings.map((warn, idx) => (
                    <p key={idx} className="text-[11px] text-amber-200/90 leading-tight">
                      • {warn}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* Incompatible parts note */}
            {source.incompatibleParts && (
              <div className="pt-2 border-t border-white/5 text-[11px] text-gray-500">
                <strong className="text-gray-400">Avoid:</strong> {source.incompatibleParts.join(", ")}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
