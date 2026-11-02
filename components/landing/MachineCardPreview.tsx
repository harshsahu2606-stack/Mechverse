"use client";

import React, { useState } from "react";
import { Eye, Layers, Cpu, Sparkles } from "lucide-react";
import { MachineId } from "@/types/machine";

interface MachineCardPreviewProps {
  machineId: MachineId;
  name: string;
  badgeType: string;
  imageSrc?: string;
  internalParts?: string[];
  cadSubPartsCount?: number;
  onOpenQuick3D: (id: MachineId) => void;
}

export default function MachineCardPreview({
  machineId,
  name,
  badgeType,
  imageSrc,
  internalParts = [],
  cadSubPartsCount = 8,
  onOpenQuick3D,
}: MachineCardPreviewProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative w-full h-44 sm:h-48 rounded-xl overflow-hidden bg-gradient-to-b from-[#161a24] to-[#0a0d13] border border-white/10 group-hover:border-orange-500/50 transition-all duration-300 shadow-inner">
      {/* Background CAD Technical Blueprint Grid */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Rendered CAD Studio Image */}
      {imageSrc && !imageError ? (
        <img
          src={imageSrc}
          alt={`${name} CAD 3D Preview`}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
      ) : (
        /* Sleek Procedural CAD Blueprint Fallback */
        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 mb-2 shadow-lg">
            <Cpu size={24} />
          </div>
          <span className="text-xs font-mono font-bold text-white tracking-wider uppercase">
            {name}
          </span>
          <span className="text-[10px] font-mono text-gray-400 mt-0.5">
            Verified SolidWorks CAD Model
          </span>
        </div>
      )}

      {/* Top Gradient Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-transparent to-black/60 pointer-events-none" />

      {/* Top Badges: Category & Quick 3D Peek Action */}
      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-auto">
        <span className="text-[9px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-orange-400 shadow-md">
          {badgeType}
        </span>

        {/* 👁️ Quick 3D Peek Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenQuick3D(machineId);
          }}
          className="px-2.5 py-1 rounded-full bg-black/75 hover:bg-orange-600 border border-white/20 hover:border-orange-500 text-white font-mono text-[10px] font-bold backdrop-blur-md transition-all flex items-center gap-1.5 shadow-lg transform active:scale-95 cursor-pointer"
          title="Inspect 3D CAD model interactively without leaving page"
        >
          <Eye size={11} className="text-orange-400 group-hover:text-white" />
          <span>3D Peek</span>
        </button>
      </div>

      {/* Bottom Internal Components Chip Overlay (What is inside this model) */}
      <div className="absolute bottom-2 left-2 right-2 pointer-events-none">
        <div className="bg-[#0b0f19]/90 border border-white/10 backdrop-blur-md px-2.5 py-1.5 rounded-xl shadow-lg flex items-center justify-between gap-1.5 overflow-hidden">
          <div className="flex items-center gap-1.5 shrink-0">
            <Layers size={11} className="text-orange-400 shrink-0" />
            <span className="text-[9px] font-mono uppercase font-bold text-gray-400">
              Inside:
            </span>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.2">
            {internalParts.slice(0, 3).map((part, i) => (
              <span
                key={i}
                className="text-[9px] font-mono text-gray-200 bg-white/5 border border-white/5 px-1.5 py-0.2 rounded whitespace-nowrap"
              >
                {part}
              </span>
            ))}
            {internalParts.length > 3 && (
              <span className="text-[9px] font-mono text-orange-400 bg-orange-500/10 px-1 py-0.2 rounded font-bold">
                +{internalParts.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
