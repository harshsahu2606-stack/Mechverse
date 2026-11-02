"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  CarFront,
  Fan,
  Bot,
  RotateCcw,
  Bookmark,
  Sparkles,
  Swords,
  Plane,
  Hexagon,
  Smartphone,
  Cable,
  Sun,
  Moon,
  Camera,
  Crosshair,
  ChevronDown,
  Layers,
  Check,
  Compass,
  Wrench,
  Grid,
} from "lucide-react";
import { MachineId, AppTheme } from "@/types/machine";

interface NavbarProps {
  currentTab: "landing" | "home" | "explore" | "builder";
  setCurrentTab: (tab: "landing" | "home" | "explore" | "builder") => void;
  selectedMachineId: MachineId;
  onSelectMachine: (id: MachineId) => void;
  onReset: () => void;
  onOpenSavedDesigns: () => void;
  savedCount: number;
  theme?: AppTheme;
  onToggleTheme?: () => void;
  onOpenAR?: () => void;
}

interface ProjectLibraryItem {
  id: MachineId;
  name: string;
  category: string;
  badge: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  accentColor: string;
}

const PROJECT_LIBRARY: ProjectLibraryItem[] = [
  {
    id: "robo-racer",
    name: "Robo-Racer Bot",
    category: "AI Autonomous Rover (SolidWorks CAD)",
    badge: "₹2,888",
    icon: Crosshair,
    accentColor: "from-orange-500 to-amber-500",
  },
  {
    id: "ropeway-robot",
    name: "Ropeway Robot",
    category: "Cable Inspection Climber (Hand-over-Hand)",
    badge: "₹1,450",
    icon: Cable,
    accentColor: "from-sky-500 to-indigo-600",
  },
  {
    id: "esp32-drone",
    name: "AERO-ESP Drone",
    category: "Smartphone Wi-Fi Quadcopter",
    badge: "₹1,955",
    icon: Smartphone,
    accentColor: "from-amber-500 to-orange-500",
  },
  {
    id: "drone-b",
    name: "Drone-B Octocopter",
    category: "Industrial Heavy Multi-Rotor",
    badge: "CAD ASSET",
    icon: Hexagon,
    accentColor: "from-indigo-500 to-purple-500",
  },
  {
    id: "aero-450",
    name: "AERO-450 Drone",
    category: "Modular Pixhawk Quadcopter",
    badge: "APM 2.8",
    icon: Plane,
    accentColor: "from-emerald-500 to-teal-500",
  },
  {
    id: "robo-rumble",
    name: "Robo Rumble",
    category: "Combat Battle Robot Arena",
    badge: "4WD ARENA",
    icon: Swords,
    accentColor: "from-rose-500 to-red-600",
  },
  {
    id: "sports-car",
    name: "Apex GT Supercar",
    category: "Twin-Turbo V6 Engine CAD",
    badge: "AUTOMOTIVE",
    icon: CarFront,
    accentColor: "from-red-600 to-orange-600",
  },
  {
    id: "walking-robot",
    name: "Walking Robot",
    category: "Mechanical Leg Linkage",
    badge: "BIOMIMETIC",
    icon: Bot,
    accentColor: "from-yellow-500 to-amber-600",
  },
  {
    id: "electric-fan",
    name: "Electric Fan",
    category: "Aerodynamic Table Fan & Fluid",
    badge: "FLUID DYNAMICS",
    icon: Fan,
    accentColor: "from-sky-500 to-blue-600",
  },
];

export default function Navbar({
  currentTab,
  setCurrentTab,
  selectedMachineId,
  onSelectMachine,
  onReset,
  onOpenSavedDesigns,
  savedCount,
  theme = "dark",
  onToggleTheme,
  onOpenAR,
}: NavbarProps) {
  const isLight = theme === "light";
  const [isProjectsOpen, setIsProjectsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Active Project Data
  const activeProject =
    PROJECT_LIBRARY.find((p) => p.id === selectedMachineId) || PROJECT_LIBRARY[0];
  const ActiveIcon = activeProject.icon;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProjectsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`h-14 sm:h-16 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-50 transition-colors duration-300 backdrop-blur-md ${
        isLight
          ? "bg-white/95 border-b border-gray-200 shadow-sm"
          : "bg-[#0a0c10]/95 border-b border-white/10"
      }`}
    >
      {/* ================= LEFT: BRAND LOGO ================= */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <button
          onClick={() => setCurrentTab("landing")}
          className="flex items-center gap-2 sm:gap-3 text-left group cursor-pointer"
        >
          <div className="bg-gradient-to-br from-red-600 to-orange-600 rounded-xl p-1.5 sm:p-2 text-white shadow-lg shadow-red-600/20 group-hover:scale-105 transition shrink-0">
            <CarFront size={18} className="sm:w-5 sm:h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span
                className={`font-black tracking-wider text-sm sm:text-base transition ${
                  isLight ? "text-gray-900" : "text-white"
                }`}
              >
                MECHVERSE
              </span>
              <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 hidden md:inline-block">
                STUDIO
              </span>
            </div>
            <p
              className={`text-[8px] sm:text-[9px] tracking-wider uppercase hidden sm:block ${
                isLight ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Interactive 3D Engineering
            </p>
          </div>
        </button>

        {/* ================= PROJECTS / LIBRARY DROPDOWN TRIGGER ================= */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setIsProjectsOpen((prev) => !prev)}
            aria-expanded={isProjectsOpen}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border transition shadow-sm cursor-pointer ${
              isProjectsOpen
                ? "border-orange-500 bg-orange-500/10 text-orange-400"
                : isLight
                ? "bg-gray-100 hover:bg-gray-200/80 border-gray-300 text-gray-800"
                : "bg-white/5 hover:bg-white/10 border-white/15 text-white"
            }`}
          >
            <div className="w-5 h-5 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
              <ActiveIcon size={12} />
            </div>

            <div className="text-left flex items-center gap-1.5">
              <span className="text-xs font-bold whitespace-nowrap max-w-[90px] sm:max-w-[130px] truncate">
                {activeProject.name}
              </span>
              <span className="hidden lg:inline-block text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/30 border border-white/10 text-gray-400">
                {activeProject.badge}
              </span>
            </div>

            <ChevronDown
              size={14}
              className={`text-gray-400 transition-transform duration-200 shrink-0 ${
                isProjectsOpen ? "rotate-180 text-orange-400" : ""
              }`}
            />
          </button>

          {/* ================= CONSOLIDATED PROJECTS DROPDOWN MENU (100% OPAQUE SOLID HIGH-CONTRAST) ================= */}
          {isProjectsOpen && (
            <div
              className={`absolute left-0 mt-2 w-80 sm:w-96 rounded-2xl border p-2.5 z-[9999] animate-in fade-in slide-in-from-top-2 duration-150 ${
                isLight
                  ? "bg-white border-slate-300 shadow-[0_25px_60px_rgba(0,0,0,0.2)] text-slate-900"
                  : "bg-[#0d111a] border-slate-700 shadow-[0_30px_70px_rgba(0,0,0,0.95)] text-white"
              }`}
            >
              {/* Dropdown Header */}
              <div
                className={`px-3 py-2 rounded-xl border mb-2 flex items-center justify-between ${
                  isLight ? "bg-slate-100 border-slate-200" : "bg-[#070911] border-white/10"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-gray-400">
                    Project Library (8 Machines)
                  </span>
                </div>
                <span className="text-[10px] font-mono text-orange-400 font-bold bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                  Select Model
                </span>
              </div>

              {/* Machine Items List */}
              <div className="max-h-[380px] overflow-y-auto custom-scrollbar space-y-1.5 py-1 pr-0.5">
                {PROJECT_LIBRARY.map((item) => {
                  const ItemIcon = item.icon;
                  const isSelected = selectedMachineId === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectMachine(item.id);
                        setIsProjectsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl transition text-left cursor-pointer group border ${
                        isSelected
                          ? isLight
                            ? "bg-orange-50 border-orange-500 text-slate-950 shadow-sm"
                            : "bg-[#251b14] border-orange-500 text-white shadow-lg shadow-orange-500/10"
                          : isLight
                          ? "bg-slate-50 hover:bg-slate-100/90 border-slate-200 text-slate-800"
                          : "bg-[#151926] hover:bg-[#1e2538] border-slate-800 hover:border-orange-500/40 text-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition ${
                            isSelected
                              ? "bg-orange-500 text-black shadow-md shadow-orange-500/30"
                              : isLight
                              ? "bg-white text-slate-700 border border-slate-200"
                              : "bg-[#0b0e17] text-slate-200 border border-slate-700 group-hover:border-orange-500/40"
                          }`}
                        >
                          <ItemIcon size={16} />
                        </div>
                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold truncate block text-white group-hover:text-orange-400 transition">
                              {item.name}
                            </span>
                            <span
                              className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border shrink-0 ${
                                isLight
                                  ? "bg-amber-100 text-amber-800 border-amber-300"
                                  : "bg-black/70 text-amber-300 border-amber-500/30"
                              }`}
                            >
                              {item.badge}
                            </span>
                          </div>
                          <span
                            className={`text-[10px] block truncate font-medium ${
                              isLight ? "text-slate-600" : "text-slate-300"
                            }`}
                          >
                            {item.category}
                          </span>
                        </div>
                      </div>

                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-orange-500/20 border border-orange-500 flex items-center justify-center shrink-0 ml-1.5">
                          <Check size={12} className="text-orange-400 stroke-[3]" />
                        </div>
                      ) : (
                        <ChevronDown
                          size={13}
                          className="text-gray-500 opacity-0 group-hover:opacity-100 -rotate-90 transition shrink-0 ml-1.5"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Secondary Navigation Footer within Library Dropdown */}
              <div
                className={`pt-2.5 mt-2 border-t grid grid-cols-2 gap-2 ${
                  isLight ? "border-slate-200" : "border-white/10"
                }`}
              >
                <button
                  onClick={() => {
                    setCurrentTab("home");
                    setIsProjectsOpen(false);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer border ${
                    isLight
                      ? "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200"
                      : "bg-[#151926] hover:bg-[#1e2538] text-slate-200 hover:text-white border-slate-800"
                  }`}
                >
                  <Grid size={13} className="text-orange-400" />
                  <span>Full Catalog</span>
                </button>

                <button
                  onClick={() => {
                    onOpenSavedDesigns();
                    setIsProjectsOpen(false);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer border ${
                    isLight
                      ? "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200"
                      : "bg-[#151926] hover:bg-[#1e2538] text-slate-200 hover:text-white border-slate-800"
                  }`}
                >
                  <Bookmark size={13} className="text-orange-400" />
                  <span>Saved ({savedCount})</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= CENTER: ESSENTIAL CONTROLS (SIMULATOR & BUILDER) ================= */}
      <nav className="flex items-center gap-1 sm:gap-1.5 bg-black/20 p-1 rounded-xl border border-white/10">
        <button
          onClick={() => setCurrentTab("explore")}
          className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            currentTab === "explore"
              ? "bg-gradient-to-r from-orange-500 to-amber-500 text-black shadow-md shadow-orange-500/20"
              : isLight
              ? "text-gray-600 hover:text-black hover:bg-gray-200/60"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Compass size={14} />
          <span>Simulator</span>
        </button>

        <button
          onClick={() => setCurrentTab("builder")}
          className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            currentTab === "builder"
              ? "bg-gradient-to-r from-orange-500 to-amber-500 text-black shadow-md shadow-orange-500/20"
              : isLight
              ? "text-gray-600 hover:text-black hover:bg-gray-200/60"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Wrench size={14} />
          <span>Builder</span>
        </button>
      </nav>

      {/* ================= RIGHT: WEB AR, VIEW RESET & THEME ================= */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Web AR Direct Launch Button */}
        {onOpenAR && (
          <button
            onClick={onOpenAR}
            title="Launch Interactive Web AR (Floor Anchored)"
            className="flex items-center gap-1.5 rounded-xl border border-orange-500/40 bg-orange-500/10 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-orange-400 hover:bg-orange-500 hover:text-black transition shadow-sm cursor-pointer"
          >
            <Camera size={14} className="shrink-0 animate-pulse" />
            <span className="hidden xs:inline">Web AR</span>
          </button>
        )}

        {/* Reset Camera / Explosion */}
        <button
          onClick={onReset}
          title="Reset Camera & Assembly"
          aria-label="Reset View"
          className={`p-2 rounded-xl border transition cursor-pointer ${
            isLight
              ? "bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-700"
              : "bg-white/5 hover:bg-white/10 border-white/10 text-gray-300 hover:text-white"
          }`}
        >
          <RotateCcw size={14} />
        </button>

        {/* Theme Toggle (Dark / Light) */}
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            title={`Switch to ${isLight ? "Dark" : "Light"} Mode`}
            aria-label="Toggle Theme"
            className={`p-2 rounded-xl border transition cursor-pointer ${
              isLight
                ? "bg-gray-100 hover:bg-gray-200 border-gray-300 text-amber-600"
                : "bg-white/5 hover:bg-white/10 border-white/10 text-amber-400 hover:text-amber-300"
            }`}
          >
            {isLight ? <Moon size={14} /> : <Sun size={14} />}
          </button>
        )}
      </div>
    </header>
  );
}
