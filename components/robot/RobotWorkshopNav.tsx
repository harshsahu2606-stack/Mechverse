"use client";

import { Box, BookOpen, Calculator, Cpu, HelpCircle, Layers, Recycle, Wrench, FileText } from "lucide-react";

export type RobotProjectTab =
  | "simulator"
  | "how-it-works"
  | "build-guide"
  | "free-sourcing"
  | "bom"
  | "troubleshooting"
  | "docs";

interface RobotWorkshopNavProps {
  activeTab: RobotProjectTab;
  onChangeTab: (tab: RobotProjectTab) => void;
}

export default function RobotWorkshopNav({
  activeTab,
  onChangeTab,
}: RobotWorkshopNavProps) {
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
    <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full custom-scrollbar">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChangeTab(tab.id as RobotProjectTab)}
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
