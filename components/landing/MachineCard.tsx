"use client";

import React from "react";
import { ArrowRight, ShieldCheck, Camera, Eye } from "lucide-react";
import { MachineId } from "@/types/machine";
import { TOKENS } from "@/constants/designTokens";
import MachineCardPreview from "./MachineCardPreview";

export interface CatalogMachineItem {
  id: MachineId;
  name: string;
  category: "drones" | "robotics" | "vehicles" | "aerial" | "industrial" | "diy";
  badgeType: string;
  price: string;
  priceStatus: "verified" | "estimated";
  supplierInfo: string;
  description: string;
  specs: { label: string; value: string }[];
  tags: string[];
  imageSrc?: string;
  internalParts?: string[];
}

interface MachineCardProps {
  item: CatalogMachineItem;
  onLaunch: (id: MachineId) => void;
  onOpenAR?: (id: MachineId) => void;
  onOpenQuick3D?: (id: MachineId) => void;
}

export default function MachineCard({ item, onLaunch, onOpenAR, onOpenQuick3D }: MachineCardProps) {
  const isVerified = item.priceStatus === "verified";

  return (
    <div
      className="group relative rounded-2xl border border-white/5 bg-[#0F1114] hover:border-white/20 hover:bg-[#15181f] transition-all duration-300 p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-xl"
      style={{ borderRadius: TOKENS.radii.card }}
    >
      <div className="space-y-3.5">
        {/* ================= 1. VISUAL CAD PREVIEW WITH INTERNAL PARTS PEEK ================= */}
        <MachineCardPreview
          machineId={item.id}
          name={item.name}
          badgeType={item.badgeType}
          imageSrc={item.imageSrc}
          internalParts={item.internalParts}
          onOpenQuick3D={onOpenQuick3D || onLaunch}
        />

        {/* ================= 2. VERIFIED STATUS & BOM METRIC ================= */}
        <div className="flex items-center justify-between pt-1">
          {/* Verified / Estimated Status Badge */}
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono tracking-wider font-medium"
            style={{
              backgroundColor: isVerified
                ? TOKENS.colors.status.verifiedGlow
                : TOKENS.colors.status.estimatedGlow,
              color: isVerified ? TOKENS.colors.status.verified : TOKENS.colors.status.estimated,
              border: `1px solid ${
                isVerified ? TOKENS.colors.status.verified : TOKENS.colors.status.estimated
              }`,
            }}
          >
            <ShieldCheck size={10} />
            <span>{isVerified ? "Verified Price" : "Estimated"}</span>
          </span>

          <span className="text-[10px] font-mono text-[#5C626B]">
            {item.supplierInfo.split("(")[0]}
          </span>
        </div>

        {/* ================= 3. MACHINE TITLE & DESCRIPTION ================= */}
        <div>
          <h3 className="text-lg sm:text-xl font-medium text-[#F4F5F7] tracking-tight group-hover:text-white transition-colors">
            {item.name}
          </h3>
          <p className="text-xs text-[#9AA0A9] mt-1 leading-relaxed line-clamp-2">
            {item.description}
          </p>
        </div>

        {/* ================= 4. BOM HARDWARE COST ================= */}
        <div className="py-2 px-3 rounded-xl bg-black/40 border border-white/5 flex items-baseline justify-between">
          <span className="text-[10px] font-mono text-[#8b929d] uppercase">BOM Hardware Cost</span>
          <span className="text-base sm:text-lg font-mono font-bold text-white">
            {item.price}
          </span>
        </div>

        {/* ================= 5. TECHNICAL SPECS GRID ================= */}
        <div className="grid grid-cols-2 gap-2">
          {item.specs.map((spec, idx) => (
            <div key={idx} className="bg-[#07080A]/60 p-2 rounded-lg border border-white/5">
              <div className="text-[9px] font-mono text-[#5C626B] uppercase">{spec.label}</div>
              <div className="text-[11px] font-mono text-[#F4F5F7] truncate">{spec.value}</div>
            </div>
          ))}
        </div>

        {/* ================= 6. TAGS ================= */}
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {item.tags.map((tag, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded text-[10px] font-mono text-[#9AA0A9] bg-white/5 border border-white/5"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ================= 7. ACTIONS (3D STUDIO & WEB AR) ================= */}
      <div className="flex items-center gap-2 pt-2 border-t border-white/5">
        <button
          onClick={() => onLaunch(item.id)}
          className="flex-1 py-2.5 rounded-xl text-xs font-mono font-bold text-white flex items-center justify-center gap-2 border border-white/10 bg-[#07080A] hover:bg-[#FF6A1A] hover:border-[#FF6A1A] transition-all transform active:scale-98 cursor-pointer shadow-md"
        >
          <span>Open 3D Studio</span>
          <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
        </button>

        {onOpenQuick3D && (
          <button
            onClick={() => onOpenQuick3D(item.id)}
            title="Interactive 3D Preview (Quick View)"
            className="p-2.5 rounded-xl text-xs font-mono font-medium text-gray-300 border border-white/10 bg-white/5 hover:bg-white/15 hover:text-white transition-all transform active:scale-95 flex items-center justify-center cursor-pointer"
          >
            <Eye size={14} />
          </button>
        )}

        <button
          onClick={() => (onOpenAR ? onOpenAR(item.id) : onLaunch(item.id))}
          title="Inspect in Web AR (Augmented Reality)"
          className="px-3 py-2.5 rounded-xl text-xs font-mono font-semibold text-[#FF6A1A] border border-[#FF6A1A]/30 bg-[#FF6A1A]/10 hover:bg-[#FF6A1A] hover:text-white transition-all transform active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0"
        >
          <Camera size={13} />
          <span>AR</span>
        </button>
      </div>
    </div>
  );
}
