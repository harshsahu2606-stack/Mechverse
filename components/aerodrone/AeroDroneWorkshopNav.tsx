"use client";

import React from "react";
import {
  Box,
  Compass,
  Cpu,
  Calculator,
  Sliders,
  ShoppingBag,
  Wrench,
  Zap,
  Activity,
  HelpCircle,
  FileSpreadsheet,
  FileText,
  Plane,
} from "lucide-react";
import { AeroNavTab, AppTheme } from "@/types/machine";

interface AeroDroneWorkshopNavProps {
  activeTab: AeroNavTab;
  onChangeTab: (tab: AeroNavTab) => void;
  theme?: AppTheme;
}

export const AERO_NAV_ITEMS: {
  id: AeroNavTab;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string;
}[] = [
  { id: "explorer", label: "3D Simulator", icon: Box },
  { id: "overview", label: "Overview", icon: Compass },
  { id: "how-it-works", label: "How It Works", icon: Cpu },
  { id: "engineering-lab", label: "Engineering Lab", icon: Calculator, badge: "MATH" },
  { id: "customizer", label: "Customize Drone", icon: Sliders },
  { id: "shopping", label: "Shopping List", icon: ShoppingBag, badge: "INR" },
  { id: "assembly-guide", label: "Assembly Guide", icon: Wrench, badge: "12-STEP" },
  { id: "wiring", label: "Electronics & Wiring", icon: Zap, badge: "CIRCUIT" },
  { id: "calibration", label: "Testing & Calibration", icon: Activity },
  { id: "troubleshooting", label: "Troubleshooting", icon: HelpCircle },
  { id: "bom", label: "BOM & Budget", icon: FileSpreadsheet },
  { id: "docs", label: "DGCA & Specs", icon: FileText, badge: "INDIA" },
];

export default function AeroDroneWorkshopNav({
  activeTab,
  onChangeTab,
  theme = "dark",
}: AeroDroneWorkshopNavProps) {
  const isLight = theme === "light";

  return (
    <div
      className={`w-full backdrop-blur-md border-b px-3 py-2 select-none sticky top-16 z-40 transition-colors ${
        isLight
          ? "bg-white/95 border-emerald-500/20 shadow-sm text-slate-800"
          : "bg-[#0a0c10]/95 border-emerald-500/20 text-white"
      }`}
    >
      <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 max-w-7xl mx-auto">
        <div
          className={`flex items-center gap-2 pl-1 pr-3 border-r shrink-0 ${
            isLight ? "border-slate-200" : "border-white/10"
          }`}
        >
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-500">
            <Plane size={15} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-black tracking-wider ${isLight ? "text-slate-900" : "text-white"}`}>
                AERO-450
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-600 font-bold">
                X-QUAD
              </span>
            </div>
            <p className={`text-[8px] uppercase tracking-widest font-mono ${isLight ? "text-slate-500" : "text-gray-400"}`}>
              F450 UAV Workshop
            </p>
          </div>
        </div>

        {AERO_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition shrink-0 ${
                isActive
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30 border border-emerald-400/40"
                  : isLight
                  ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                  : "bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5"
              }`}
            >
              <Icon size={14} className={isActive ? "text-white" : isLight ? "text-emerald-600" : "text-emerald-400"} />
              <span>{item.label}</span>
              {item.badge && (
                <span
                  className={`text-[8px] font-mono font-bold px-1 rounded uppercase ${
                    isActive
                      ? "bg-white/25 text-white"
                      : isLight
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-emerald-500/15 text-emerald-300"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
