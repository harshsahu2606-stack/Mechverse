"use client";

import { ArrowLeft, Box, Eye, Layers, Palette, Zap, Camera } from "lucide-react";
import { ViewMode, AppTheme } from "@/types/machine";

interface ControlsHeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isSubAssembly: boolean;
  onExitSubAssembly: () => void;
  machineTitle: string;
  theme?: AppTheme;
  onOpenAR?: () => void;
}

export default function ControlsHeader({
  viewMode,
  setViewMode,
  isSubAssembly,
  onExitSubAssembly,
  machineTitle,
  theme = "dark",
  onOpenAR,
}: ControlsHeaderProps) {
  const isLight = theme === "light";

  return (
    <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pointer-events-none">
      {/* Left: Back Button (if in Sub-assembly or inspector) & Viewport Badge */}
      <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto">
        {isSubAssembly ? (
          <button
            onClick={onExitSubAssembly}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold backdrop-blur-md shadow-lg transition hover:scale-105 ${
              isLight
                ? "bg-white/90 hover:bg-white border-gray-300 text-gray-900 shadow-gray-200"
                : "bg-black/70 hover:bg-black/90 border-white/20 text-white"
            }`}
          >
            <ArrowLeft size={14} />
            <span>Back to Machine</span>
          </button>
        ) : (
          <div
            className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:py-1.5 rounded-full border text-[10px] sm:text-[11px] font-medium backdrop-blur-md shadow-md max-w-[200px] sm:max-w-none truncate ${
              isLight
                ? "bg-white/90 border-gray-200 text-gray-700 shadow-sm"
                : "bg-black/60 border-white/10 text-gray-300"
            }`}
          >
            <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="tracking-wide uppercase font-mono font-semibold truncate">{machineTitle}</span>
          </div>
        )}
      </div>

      {/* Right: View Mode Pill (View, Exploded, Electronic, Components, Customize, Web AR) */}
      <div
        className={`flex items-center p-0.5 sm:p-1 rounded-2xl backdrop-blur-md shadow-xl border pointer-events-auto overflow-x-auto no-scrollbar max-w-full ${
          isLight
            ? "bg-white/90 border-gray-200 shadow-gray-200/60"
            : "bg-black/70 border-white/15"
        }`}
      >
        <button
          onClick={() => setViewMode("view")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            viewMode === "view"
              ? isLight
                ? "bg-gray-900 text-white shadow-sm"
                : "bg-white/20 text-white shadow-sm"
              : isLight
              ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              : "text-gray-400 hover:text-white"
          }`}
          title="Standard Assembled 3D View"
        >
          <Eye size={13} />
          <span>View</span>
        </button>

        <button
          onClick={() => setViewMode("exploded")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            viewMode === "exploded"
              ? "bg-red-600 text-white shadow-md shadow-red-600/30"
              : isLight
              ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              : "text-gray-400 hover:text-white"
          }`}
          title="Interactive Exploded Assembly"
        >
          <Layers size={13} />
          <span>Exploded</span>
        </button>

        <button
          onClick={() => setViewMode("electronic")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            viewMode === "electronic"
              ? "bg-amber-500 text-white shadow-md shadow-amber-500/30 animate-pulse"
              : isLight
              ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              : "text-gray-400 hover:text-white"
          }`}
          title="Electronic Wiring & Signal Trace Mode"
        >
          <Zap size={13} />
          <span>Electronic</span>
        </button>

        <button
          onClick={() => setViewMode("components")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            viewMode === "components"
              ? "bg-sky-500 text-white shadow-md shadow-sky-500/30"
              : isLight
              ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              : "text-gray-400 hover:text-white"
          }`}
          title="CAD Component Hierarchy Tree"
        >
          <Box size={13} />
          <span>Components</span>
        </button>

        <button
          onClick={() => setViewMode("customize")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            viewMode === "customize"
              ? "bg-orange-600 text-white shadow-md shadow-orange-600/30"
              : isLight
              ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              : "text-gray-400 hover:text-white"
          }`}
          title="Customize Materials & Engineering Parameters"
        >
          <Palette size={13} />
          <span>Customize</span>
        </button>

        {onOpenAR && (
          <button
            onClick={onOpenAR}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              isLight
                ? "text-orange-600 hover:bg-orange-50 border border-orange-200"
                : "text-[#FF6A1A] hover:bg-[#FF6A1A]/10 border border-[#FF6A1A]/30"
            }`}
            title="Inspect in Web AR (Augmented Reality Camera)"
          >
            <Camera size={13} />
            <span>Web AR</span>
          </button>
        )}
      </div>
    </div>
  );
}
