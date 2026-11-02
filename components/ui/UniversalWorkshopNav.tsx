"use client";

import React from "react";
import {
  Compass,
  Cpu,
  Zap,
  ShoppingBag,
  Wrench,
  Layers,
  Activity,
  Plane,
  Hexagon,
  Smartphone,
  Crosshair,
  Swords,
  Bot,
  Calculator,
  HelpCircle,
  FileText,
  Radio,
} from "lucide-react";
import { AppTheme, MachineId } from "@/types/machine";

export type UniversalPillar = "simulator" | "engineering" | "electronics" | "bom" | "guide";

interface UniversalWorkshopNavProps {
  machineId: MachineId;
  activePillar: UniversalPillar;
  onChangePillar: (pillar: UniversalPillar) => void;
  // Sub-tab support for deep views
  subTab?: string;
  onChangeSubTab?: (subTab: string) => void;
  subTabs?: { id: string; label: string; badge?: string }[];
  theme?: AppTheme;
}

interface MachineHeaderConfig {
  name: string;
  badge: string;
  subtitle: string;
  accentGradient: string;
  accentBorder: string;
  accentText: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const MACHINE_CONFIGS: Record<string, MachineHeaderConfig> = {
  "aero-450": {
    name: "AERO-450",
    badge: "F450 CLASS",
    subtitle: "Modular UAV Engineering Lab",
    accentGradient: "from-emerald-600 to-teal-600",
    accentBorder: "border-emerald-500/30",
    accentText: "text-emerald-400",
    icon: Plane,
  },
  "drone-b": {
    name: "DRONE-B",
    badge: "HEAVY OCTO",
    subtitle: "Industrial Coaxial UAV Workshop",
    accentGradient: "from-indigo-600 to-purple-600",
    accentBorder: "border-indigo-500/30",
    accentText: "text-indigo-400",
    icon: Hexagon,
  },
  "esp32-drone": {
    name: "AERO-ESP",
    badge: "NANO / ₹1,955",
    subtitle: "Smartphone Wi-Fi Drone Lab",
    accentGradient: "from-amber-600 to-orange-600",
    accentBorder: "border-amber-500/30",
    accentText: "text-amber-400",
    icon: Smartphone,
  },
  "robo-racer": {
    name: "ROBO-RACER",
    badge: "AI VISION / ₹2,888",
    subtitle: "Autonomous Obstacle Rover Lab",
    accentGradient: "from-orange-600 to-amber-600",
    accentBorder: "border-orange-500/30",
    accentText: "text-orange-400",
    icon: Crosshair,
  },
  "robo-rumble": {
    name: "ROBO-RUMBLE",
    badge: "1.5KG ARENA",
    subtitle: "Combat Beetleweight Workshop",
    accentGradient: "from-rose-600 to-red-600",
    accentBorder: "border-rose-500/30",
    accentText: "text-rose-400",
    icon: Swords,
  },
  "walking-robot": {
    name: "WALKER-TJ",
    badge: "STRANDBEEST",
    subtitle: "Kinematic Linkage Mechanism",
    accentGradient: "from-yellow-600 to-amber-600",
    accentBorder: "border-yellow-500/30",
    accentText: "text-yellow-400",
    icon: Bot,
  },
};

export default function UniversalWorkshopNav({
  machineId,
  activePillar,
  onChangePillar,
  subTab,
  onChangeSubTab,
  subTabs,
  theme = "dark",
}: UniversalWorkshopNavProps) {
  const isLight = theme === "light";
  const cfg = MACHINE_CONFIGS[machineId] || MACHINE_CONFIGS["aero-450"];
  const MachineIcon = cfg.icon;

  const PILLARS: { id: UniversalPillar; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
    { id: "simulator", label: "3D Simulator", icon: Compass },
    { id: "engineering", label: "Engineering & Specs", icon: Cpu },
    { id: "electronics", label: "Electronics & Wiring", icon: Zap },
    { id: "bom", label: "Indian BOM (₹)", icon: ShoppingBag },
    { id: "guide", label: "Build Guide & Tuning", icon: Wrench },
  ];

  return (
    <div
      className={`w-full border-b select-none transition-colors backdrop-blur-xl ${
        isLight
          ? "bg-white/95 border-gray-200 shadow-sm"
          : "bg-[#080b12]/95 border-white/10 shadow-2xl"
      }`}
    >
      {/* ================= PRIMARY BAR: 5 CLEAN PILLARS ================= */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
        {/* Machine Identity Pill */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div
            className={`w-8 h-8 rounded-xl bg-gradient-to-br ${cfg.accentGradient} flex items-center justify-center text-white shadow-md shrink-0`}
          >
            <MachineIcon size={16} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-black tracking-wider ${isLight ? "text-gray-900" : "text-white"}`}>
                {cfg.name}
              </span>
              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${cfg.accentBorder} ${cfg.accentText} bg-white/5`}>
                {cfg.badge}
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-mono hidden sm:block">
              {cfg.subtitle}
            </p>
          </div>
        </div>

        {/* 5 Core Universal Pillars */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {PILLARS.map((p) => {
            const Icon = p.icon;
            const isActive = activePillar === p.id;

            return (
              <button
                key={p.id}
                onClick={() => onChangePillar(p.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap cursor-pointer shrink-0 ${
                  isActive
                    ? `bg-gradient-to-r ${cfg.accentGradient} text-white shadow-lg shadow-black/40 scale-102`
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

      {/* ================= SECONDARY SUB-SEGMENTED BAR (Only when subTabs exist) ================= */}
      {subTabs && subTabs.length > 0 && onChangeSubTab && (
        <div
          className={`border-t px-3 sm:px-6 py-1.5 transition-colors overflow-x-auto no-scrollbar ${
            isLight ? "bg-gray-50/80 border-gray-200" : "bg-black/30 border-white/5"
          }`}
        >
          <div className="max-w-7xl mx-auto flex items-center gap-1.5">
            <span className="text-[10px] uppercase font-mono text-gray-500 mr-1 shrink-0 hidden sm:inline">
              Sections:
            </span>
            {subTabs.map((st) => {
              const isSubActive = subTab === st.id;
              return (
                <button
                  key={st.id}
                  onClick={() => onChangeSubTab(st.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition whitespace-nowrap cursor-pointer shrink-0 ${
                    isSubActive
                      ? isLight
                        ? "bg-white text-gray-900 shadow-sm border border-gray-300 font-bold"
                        : "bg-white/15 text-white border border-white/20 font-bold"
                      : isLight
                      ? "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>{st.label}</span>
                  {st.badge && (
                    <span className="text-[8px] font-mono px-1 rounded bg-black/40 text-amber-300 border border-white/10">
                      {st.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
