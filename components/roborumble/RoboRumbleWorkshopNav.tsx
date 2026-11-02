"use client";

import React from "react";
import {
  Compass,
  Cpu,
  Zap,
  ShoppingBag,
  Wrench,
  Swords,
} from "lucide-react";
import { AppTheme } from "@/types/machine";

export type RoboRumbleProjectTab =
  | "simulator"
  | "how-it-works"
  | "build-guide"
  | "free-sourcing"
  | "bom"
  | "troubleshooting"
  | "docs";

interface RoboRumbleWorkshopNavProps {
  activeTab: RoboRumbleProjectTab;
  onChangeTab: (tab: RoboRumbleProjectTab) => void;
  theme?: AppTheme;
}

export default function RoboRumbleWorkshopNav({
  activeTab,
  onChangeTab,
  theme = "dark",
}: RoboRumbleWorkshopNavProps) {
  const isLight = theme === "light";

  const getActivePillar = (): "simulator" | "engineering" | "electronics" | "bom" | "guide" => {
    if (activeTab === "simulator") return "simulator";
    if (activeTab === "how-it-works" || activeTab === "docs") return "engineering";
    if (activeTab === "bom" || activeTab === "free-sourcing") return "bom";
    if (activeTab === "build-guide" || activeTab === "troubleshooting") return "guide";
    return "simulator";
  };

  const activePillar = getActivePillar();

  const handleSelectPillar = (pillar: "simulator" | "engineering" | "electronics" | "bom" | "guide") => {
    switch (pillar) {
      case "simulator":
        onChangeTab("simulator");
        break;
      case "engineering":
        onChangeTab("how-it-works");
        break;
      case "electronics":
        onChangeTab("docs");
        break;
      case "bom":
        onChangeTab("bom");
        break;
      case "guide":
        onChangeTab("build-guide");
        break;
    }
  };

  const getSubTabs = () => {
    switch (activePillar) {
      case "engineering":
        return [
          { id: "how-it-works" as RoboRumbleProjectTab, label: "Kinetic Weapons & Armor Physics" },
          { id: "docs" as RoboRumbleProjectTab, label: "Combat Engineering Specs" },
        ];
      case "bom":
        return [
          { id: "bom" as RoboRumbleProjectTab, label: "BOM & Budget Breakdown" },
          { id: "free-sourcing" as RoboRumbleProjectTab, label: "Find Free Scrap Parts", badge: "SCRAP" },
        ];
      case "guide":
        return [
          { id: "build-guide" as RoboRumbleProjectTab, label: "Combat Assembly Guide" },
          { id: "troubleshooting" as RoboRumbleProjectTab, label: "Pit-Stop Troubleshooting" },
        ];
      default:
        return null;
    }
  };

  const subTabs = getSubTabs();

  return (
    <div
      className={`w-full border-b select-none transition-colors backdrop-blur-xl ${
        isLight ? "bg-white/95 border-gray-200 shadow-sm" : "bg-[#080b12]/95 border-rose-500/20 shadow-2xl"
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-600 to-red-600 flex items-center justify-center text-white shadow-md shrink-0">
            <Swords size={16} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-black tracking-wider ${isLight ? "text-gray-900" : "text-white"}`}>
                ROBO-RUMBLE
              </span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border border-rose-500/30 text-rose-400 bg-rose-500/10">
                1.5KG COMBAT
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-mono hidden sm:block">
              Beetleweight Battle Car Workshop
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {[
            { id: "simulator" as const, label: "3D CAD Explorer", icon: Compass },
            { id: "engineering" as const, label: "Engineering & Weapons", icon: Cpu },
            { id: "electronics" as const, label: "Electronics & Radio", icon: Zap },
            { id: "bom" as const, label: "Indian BOM (₹)", icon: ShoppingBag },
            { id: "guide" as const, label: "Build Guide & Tuning", icon: Wrench },
          ].map((p) => {
            const Icon = p.icon;
            const isActive = activePillar === p.id;

            return (
              <button
                key={p.id}
                onClick={() => handleSelectPillar(p.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg shadow-rose-600/30 border border-rose-400/30 scale-102"
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

      {subTabs && subTabs.length > 0 && (
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
              const isSubActive = activeTab === st.id;
              return (
                <button
                  key={st.id}
                  onClick={() => onChangeTab(st.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition whitespace-nowrap cursor-pointer shrink-0 ${
                    isSubActive
                      ? isLight
                        ? "bg-white text-gray-900 shadow-sm border border-gray-300 font-bold"
                        : "bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold"
                      : isLight
                      ? "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>{st.label}</span>
                  {st.badge && (
                    <span className="text-[8px] font-mono px-1 rounded bg-black/40 text-rose-300 border border-white/10">
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
