"use client";

import { Box, BookOpen, Calculator, Cpu, HelpCircle, Layers, Recycle, Wrench, FileText, SlidersHorizontal, Cable } from "lucide-react";
import { RopewayNavTab, AppTheme } from "@/types/machine";

interface RopewayWorkshopNavProps {
  activeTab: RopewayNavTab;
  onChangeTab: (tab: RopewayNavTab) => void;
  theme?: AppTheme;
}

export default function RopewayWorkshopNav({
  activeTab,
  onChangeTab,
  theme = "dark",
}: RopewayWorkshopNavProps) {
  const tabs = [
    { id: "simulator", label: "3D Cable Simulator", icon: Box },
    { id: "how-it-works", label: "Cable Mechanics", icon: Cpu },
    { id: "build-guide", label: "Build Guide", icon: Wrench },
    { id: "free-sourcing", label: "Scrap & Free Parts", icon: Recycle },
    { id: "bom", label: "BOM & Budget (₹)", icon: Calculator },
    { id: "troubleshooting", label: "Troubleshooting", icon: HelpCircle },
    { id: "engineering-docs", label: "Physics & Formulas", icon: FileText },
    { id: "customizer", label: "Customizer", icon: SlidersHorizontal },
  ] as const;

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full custom-scrollbar">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChangeTab(tab.id as RopewayNavTab)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
              isActive
                ? "bg-sky-500 border-sky-400 text-white shadow-md shadow-sky-500/25"
                : "bg-black/40 border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Icon size={13} className={isActive ? "text-white" : "text-gray-400"} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
