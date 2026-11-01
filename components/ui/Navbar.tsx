"use client";

import { Box, CarFront, Fan, Bot, RotateCcw, Bookmark, Sparkles, Swords, Plane, Hexagon, Smartphone, Sun, Moon } from "lucide-react";
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
}

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
}: NavbarProps) {
  const isLight = theme === "light";

  return (
    <header
      className={`h-16 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-50 transition-colors duration-300 backdrop-blur-md ${
        isLight
          ? "bg-white/90 border-b border-gray-200 shadow-sm"
          : "bg-[#0a0c10]/90 border-b border-white/10"
      }`}
    >
      {/* Brand Logo & Tagline */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCurrentTab("landing")}
          className="flex items-center gap-3 text-left group"
        >
          <div className="bg-gradient-to-br from-red-600 to-orange-600 rounded-lg p-2 text-white shadow-lg shadow-red-600/20 group-hover:scale-105 transition">
            <CarFront size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`font-extrabold tracking-widest text-sm sm:text-base transition ${
                  isLight ? "text-gray-900" : "text-white"
                }`}
              >
                MECHVERSE
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-red-500/10 text-red-500 border border-red-500/20 hidden md:inline-block">
                3D SIMULATOR
              </span>
            </div>
            <p
              className={`text-[9px] tracking-[2px] font-medium uppercase ${
                isLight ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Interactive Machine Explorer
            </p>
          </div>
        </button>
      </div>

      {/* Center Navigation Links */}
      <nav className="flex items-center gap-1 sm:gap-2">
        <button
          onClick={() => setCurrentTab("landing")}
          className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition ${
            currentTab === "landing"
              ? isLight
                ? "bg-gray-100 text-gray-900 font-bold"
                : "bg-white/15 text-white"
              : isLight
              ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          Landing
        </button>
        <button
          onClick={() => setCurrentTab("home")}
          className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition ${
            currentTab === "home"
              ? isLight
                ? "bg-gray-100 text-gray-900 font-bold"
                : "bg-white/15 text-white"
              : isLight
              ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          Catalog
        </button>
        <button
          onClick={() => setCurrentTab("explore")}
          className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition ${
            currentTab === "explore"
              ? isLight
                ? "bg-gray-100 text-gray-900 font-bold"
                : "bg-white/15 text-white"
              : isLight
              ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          3D Simulator
        </button>
        <button
          onClick={() => setCurrentTab("builder")}
          className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition ${
            currentTab === "builder"
              ? isLight
                ? "bg-gray-100 text-gray-900 font-bold"
                : "bg-white/15 text-white"
              : isLight
              ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          Builder
        </button>
      </nav>

      {/* Right Controls: Machine Switcher, Theme Toggle, Saved Designs, Reset */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Machine Selector Dropdown / Pill */}
        <div
          className={`flex items-center rounded-xl p-1 border transition ${
            isLight
              ? "bg-gray-100 border-gray-300"
              : "bg-black/40 border-white/10"
          }`}
        >
          <button
            onClick={() => onSelectMachine("sports-car")}
            title="Switch to Sports Car"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              selectedMachineId === "sports-car"
                ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                : isLight
                ? "text-gray-600 hover:text-gray-900"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <CarFront size={14} />
            <span className="hidden sm:inline">Car</span>
          </button>
          <button
            onClick={() => onSelectMachine("electric-fan")}
            title="Switch to Electric Table Fan"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              selectedMachineId === "electric-fan"
                ? "bg-sky-500 text-white shadow-md shadow-sky-500/30"
                : isLight
                ? "text-gray-600 hover:text-gray-900"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Fan size={14} />
            <span className="hidden sm:inline">Fan</span>
          </button>
          <button
            onClick={() => onSelectMachine("walking-robot")}
            title="Switch to Walking Robot Workshop"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              selectedMachineId === "walking-robot"
                ? "bg-orange-500 text-white shadow-md shadow-orange-500/30"
                : isLight
                ? "text-gray-600 hover:text-gray-900"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Bot size={14} />
            <span className="hidden sm:inline">Robot</span>
          </button>
          <button
            onClick={() => onSelectMachine("robo-rumble")}
            title="Switch to Robo Rumble Combat Arena"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              selectedMachineId === "robo-rumble"
                ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                : isLight
                ? "text-gray-600 hover:text-gray-900"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Swords size={14} />
            <span className="hidden sm:inline">Rumble</span>
          </button>
          <button
            onClick={() => onSelectMachine("aero-450")}
            title="Switch to AERO-450 Quadcopter Drone Workshop"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              selectedMachineId === "aero-450"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                : isLight
                ? "text-gray-600 hover:text-gray-900"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Plane size={14} />
            <span className="hidden sm:inline">AERO-450</span>
          </button>
          <button
            onClick={() => onSelectMachine("drone-b")}
            title="Switch to Drone B (Industrial Octagonal CAD Model)"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              selectedMachineId === "drone-b"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : isLight
                ? "text-gray-600 hover:text-gray-900"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Hexagon size={14} />
            <span className="hidden sm:inline">Drone B</span>
          </button>
          <button
            onClick={() => onSelectMachine("esp32-drone")}
            title="Switch to AERO-ESP Smartphone Wi-Fi Controlled Nano Drone (₹1,955)"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              selectedMachineId === "esp32-drone"
                ? "bg-amber-600 text-white shadow-md shadow-amber-600/30"
                : isLight
                ? "text-gray-600 hover:text-gray-900"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Smartphone size={14} />
            <span className="hidden sm:inline">ESP32 Drone</span>
          </button>
        </div>

        {/* Global Light / Dark Theme Toggle Button */}
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            title={isLight ? "Switch to Dark Studio" : "Switch to Light Studio"}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
              isLight
                ? "border-amber-400/50 bg-amber-50 text-amber-800 hover:bg-amber-100 shadow-sm"
                : "border-white/10 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10"
            }`}
          >
            {isLight ? (
              <>
                <Moon size={14} className="text-indigo-600" />
                <span className="hidden md:inline font-bold">Dark</span>
              </>
            ) : (
              <>
                <Sun size={14} className="text-amber-400 animate-spin-slow" />
                <span className="hidden md:inline font-bold">Light</span>
              </>
            )}
          </button>
        )}

        {/* My Saved Designs */}
        <button
          onClick={onOpenSavedDesigns}
          title="Saved Configurations"
          className={`relative flex items-center gap-1.5 rounded-lg border px-2.5 sm:px-3 py-1.5 text-xs font-medium transition ${
            isLight
              ? "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
              : "border-white/10 text-gray-300 hover:text-white hover:bg-white/10"
          }`}
        >
          <Bookmark size={14} className="text-amber-500" />
          <span className="hidden md:inline">My Designs</span>
          {savedCount > 0 && (
            <span className="bg-amber-500 text-black font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
              {savedCount}
            </span>
          )}
        </button>

        {/* Reset button */}
        <button
          onClick={onReset}
          title="Reset Camera & View"
          className={`flex items-center gap-1.5 rounded-lg border px-2.5 sm:px-3 py-1.5 text-xs font-medium transition ${
            isLight
              ? "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
              : "border-white/10 text-gray-300 hover:text-white hover:bg-white/10"
          }`}
        >
          <RotateCcw size={14} />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>
    </header>
  );
}
