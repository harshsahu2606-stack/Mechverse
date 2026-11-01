"use client";

import React from "react";
import {
  Compass,
  Cpu,
  Zap,
  ShoppingBag,
  Wrench,
  Hexagon,
} from "lucide-react";
import { AppTheme } from "@/types/machine";

export type DroneBNavPillar = "simulator" | "engineering" | "electronics" | "bom" | "guide";

interface DroneBWorkshopNavProps {
  activePillar: DroneBNavPillar;
  onChangePillar: (pillar: DroneBNavPillar) => void;
  theme?: AppTheme;
}

export default function DroneBWorkshopNav({
  activePillar,
  onChangePillar,
  theme = "dark",
}: DroneBWorkshopNavProps) {
  const isLight = theme === "light";

  return (
    <div
      className={`w-full border-b select-none transition-colors backdrop-blur-xl ${
        isLight ? "bg-white/95 border-gray-200 shadow-sm" : "bg-[#080b12]/95 border-indigo-500/20 shadow-2xl"
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shrink-0">
            <Hexagon size={16} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-black tracking-wider ${isLight ? "text-gray-900" : "text-white"}`}>
                DRONE-B
              </span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border border-indigo-500/30 text-indigo-400 bg-indigo-500/10">
                OCTOCOPTER
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-mono hidden sm:block">
              Industrial Heavy-Lift UAV Lab
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {[
            { id: "simulator" as const, label: "3D Simulator", icon: Compass },
            { id: "engineering" as const, label: "Engineering & Specs", icon: Cpu },
            { id: "electronics" as const, label: "Electronics & Wiring", icon: Zap },
            { id: "bom" as const, label: "Indian BOM (₹)", icon: ShoppingBag },
            { id: "guide" as const, label: "Build Guide & Tuning", icon: Wrench },
          ].map((p) => {
            const Icon = p.icon;
            const isActive = activePillar === p.id;

            return (
              <button
                key={p.id}
                onClick={() => onChangePillar(p.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/30 scale-102"
                    : isLight
                    ? "bg-gray-100 hover:bg-gray-200/80 text-gray-700 hover:text-black border border-gray-200"
                    : "bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10"
                }`}
              >
                <Icon size={13} />
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
