"use client";

import React from "react";
import {
  Compass,
  Cpu,
  Zap,
  ShoppingBag,
  Wrench,
  Plane,
} from "lucide-react";
import { AeroNavTab, AppTheme } from "@/types/machine";

interface AeroDroneWorkshopNavProps {
  activeTab: AeroNavTab;
  onChangeTab: (tab: AeroNavTab) => void;
  theme?: AppTheme;
}

export default function AeroDroneWorkshopNav({
  activeTab,
  onChangeTab,
  theme = "dark",
}: AeroDroneWorkshopNavProps) {
  const isLight = theme === "light";

  // Map the 12 specific sub-tabs into 5 intuitive primary pillars
  const getActivePillar = (): "simulator" | "engineering" | "electronics" | "bom" | "guide" => {
    if (activeTab === "explorer") return "simulator";
    if (activeTab === "overview" || activeTab === "how-it-works" || activeTab === "engineering-lab" || activeTab === "docs")
      return "engineering";
    if (activeTab === "wiring") return "electronics";
    if (activeTab === "shopping" || activeTab === "bom") return "bom";
    if (activeTab === "assembly-guide" || activeTab === "calibration" || activeTab === "troubleshooting" || activeTab === "customizer")
      return "guide";
    return "simulator";
  };

  const activePillar = getActivePillar();

  const handleSelectPillar = (pillar: "simulator" | "engineering" | "electronics" | "bom" | "guide") => {
    switch (pillar) {
      case "simulator":
        onChangeTab("explorer");
        break;
      case "engineering":
        onChangeTab("overview");
        break;
      case "electronics":
        onChangeTab("wiring");
        break;
      case "bom":
        onChangeTab("shopping");
        break;
      case "guide":
        onChangeTab("assembly-guide");
        break;
    }
  };

  // Sub-navigation options based on active pillar
  const getSubTabs = () => {
    switch (activePillar) {
      case "engineering":
        return [
          { id: "overview" as AeroNavTab, label: "Overview" },
          { id: "how-it-works" as AeroNavTab, label: "How It Works" },
          { id: "engineering-lab" as AeroNavTab, label: "Engineering Lab", badge: "MATH" },
          { id: "docs" as AeroNavTab, label: "DGCA & Specs", badge: "INDIA" },
        ];
      case "electronics":
        return [
          { id: "wiring" as AeroNavTab, label: "Interactive Circuit & Schematic", badge: "CIRCUIT" },
        ];
      case "bom":
        return [
          { id: "shopping" as AeroNavTab, label: "Shopping Sourcing List", badge: "INR" },
          { id: "bom" as AeroNavTab, label: "BOM & Budget Breakdown" },
        ];
      case "guide":
        return [
          { id: "assembly-guide" as AeroNavTab, label: "12-Step Assembly Guide", badge: "12-STEP" },
          { id: "calibration" as AeroNavTab, label: "Testing & Calibration" },
          { id: "troubleshooting" as AeroNavTab, label: "Troubleshooting Guide" },
          { id: "customizer" as AeroNavTab, label: "Airframe Customizer" },
        ];
      default:
        return null;
    }
  };

  const subTabs = getSubTabs();

  return (
    <div
      className={`w-full border-b select-none transition-colors backdrop-blur-xl ${
        isLight ? "bg-white/95 border-gray-200 shadow-sm" : "bg-[#080b12]/95 border-emerald-500/20 shadow-2xl"
      }`}
    >
      {/* ================= PRIMARY BAR: 5 CLEAN CATEGORIES ================= */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
        {/* Machine Header Pill */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-md shrink-0">
            <Plane size={16} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-black tracking-wider ${isLight ? "text-gray-900" : "text-white"}`}>
                AERO-450
              </span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                X-QUAD
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-mono hidden sm:block">
              F450 UAV Engineering Workshop
            </p>
          </div>
        </div>

        {/* 5 Core Universal Pillars */}
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
                onClick={() => handleSelectPillar(p.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30 border border-emerald-400/30 scale-102"
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

      {/* ================= SECONDARY SUB-SEGMENTED BAR ================= */}
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
                        : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold"
                      : isLight
                      ? "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>{st.label}</span>
                  {st.badge && (
                    <span className="text-[8px] font-mono px-1 rounded bg-black/40 text-emerald-300 border border-white/10">
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
