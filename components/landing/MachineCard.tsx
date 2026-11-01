"use client";

import React from "react";
import { ArrowRight, ShieldCheck, Clock } from "lucide-react";
import { MachineId } from "@/types/machine";
import { TOKENS } from "@/constants/designTokens";

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
}

interface MachineCardProps {
  item: CatalogMachineItem;
  onLaunch: (id: MachineId) => void;
}

export default function MachineCard({ item, onLaunch }: MachineCardProps) {
  const isVerified = item.priceStatus === "verified";

  return (
    <div
      className="group relative rounded-2xl border border-white/5 bg-[#0F1114] hover:border-white/20 hover:bg-[#161A1F] transition-all duration-300 p-6 flex flex-col justify-between space-y-6"
      style={{ borderRadius: TOKENS.radii.card }}
    >
      {/* Top Meta Row */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono tracking-widest text-[#9AA0A9] uppercase">
            {item.badgeType}
          </span>

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
        </div>

        {/* Machine Title & Description */}
        <div>
          <h3 className="text-xl font-light text-[#F4F5F7] tracking-tight group-hover:text-white transition-colors">
            {item.name}
          </h3>
          <p className="text-xs text-[#9AA0A9] mt-1.5 leading-relaxed line-clamp-2">
            {item.description}
          </p>
        </div>

        {/* Price & Supplier */}
        <div className="pt-2 border-t border-white/5">
          <div className="text-[10px] font-mono text-[#5C626B] uppercase">BOM Hardware Cost</div>
          <div className="text-lg font-mono font-semibold text-white mt-0.5">
            {item.price}
          </div>
          <div className="text-[9px] font-mono text-[#5C626B] mt-0.5">
            {item.supplierInfo}
          </div>
        </div>

        {/* Technical Specs List */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          {item.specs.map((spec, idx) => (
            <div key={idx} className="bg-[#07080A]/60 p-2 rounded-lg border border-white/5">
              <div className="text-[9px] font-mono text-[#5C626B] uppercase">{spec.label}</div>
              <div className="text-[11px] font-mono text-[#F4F5F7] truncate">{spec.value}</div>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
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

      {/* Direct Functional Launch Action */}
      <button
        onClick={() => onLaunch(item.id)}
        className="w-full py-2.5 rounded-xl text-xs font-mono font-medium text-white flex items-center justify-center gap-2 border border-white/10 bg-[#07080A] hover:bg-[#FF6A1A] hover:border-[#FF6A1A] transition-all transform active:scale-98 cursor-pointer"
      >
        <span>Launch in 3D Studio</span>
        <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
}
