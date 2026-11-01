"use client";

import {
  Box,
  Cpu,
  Wrench,
  Recycle,
  Calculator,
  HelpCircle,
  FileText,
} from "lucide-react";

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
}

export default function RoboRumbleWorkshopNav({
  activeTab,
  onChangeTab,
}: RoboRumbleWorkshopNavProps) {
  const tabs = [
    { id: "simulator", label: "3D Simulator", icon: Box },
    { id: "how-it-works", label: "How It Works", icon: Cpu },
    { id: "build-guide", label: "Build Guide", icon: Wrench },
    { id: "free-sourcing", label: "Find Free Parts", icon: Recycle },
    { id: "bom", label: "BOM & Budget", icon: Calculator },
    { id: "troubleshooting", label: "Troubleshooting", icon: HelpCircle },
    { id: "docs", label: "Engineering Docs", icon: FileText },
  ] as const;

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full custom-scrollbar">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onChangeTab(tab.id as RoboRumbleProjectTab)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
              isActive
                ? "bg-orange-500 border-orange-400 text-white shadow-md shadow-orange-500/20"
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
