"use client";

import { Layers } from "lucide-react";
import { AppTheme } from "@/types/machine";

interface ExplodedControlsProps {
  explosionLevel: number; // 0 to 1
  onChange: (level: number) => void;
  onReset: () => void;
  theme?: AppTheme;
}

export default function ExplodedControls({
  explosionLevel,
  onChange,
  theme = "dark",
}: ExplodedControlsProps) {
  const percentage = Math.round(explosionLevel * 100);
  const isLight = theme === "light";

  return (
    <div className="absolute bottom-16 sm:bottom-14 left-1/2 -translate-x-1/2 z-20 w-[92%] sm:w-auto max-w-md pointer-events-auto">
      <div
        className={`backdrop-blur-xl rounded-2xl px-5 py-3 shadow-2xl border flex flex-col sm:flex-row items-center gap-3 sm:gap-5 transition-colors ${
          isLight
            ? "bg-white/95 border-gray-200 shadow-gray-300/60 text-gray-800"
            : "bg-[#111318]/90 border-white/15 text-gray-200"
        }`}
      >
        {/* Label & Icon */}
        <div className="flex items-center gap-2 whitespace-nowrap">
          <Layers size={16} className="text-red-500 animate-pulse" />
          <span className={`text-xs font-semibold ${isLight ? "text-gray-800" : "text-gray-200"}`}>
            Explosion Level
          </span>
          <span className="text-xs font-mono font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
            {percentage}%
          </span>
        </div>

        {/* Range Slider */}
        <div className="flex items-center gap-3 w-full sm:w-56">
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={explosionLevel}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-red-500 hover:accent-red-400 transition ${
              isLight ? "bg-gray-200" : "bg-gray-700"
            }`}
          />
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-1.5 self-end sm:self-center">
          {[0, 0.5, 1].map((val) => {
            const pct = `${val * 100}%`;
            return (
              <button
                key={val}
                onClick={() => onChange(val)}
                className={`px-2 py-1 rounded-md text-[10px] font-semibold transition border ${
                  isLight
                    ? "bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-700"
                    : "bg-white/5 hover:bg-white/15 border-white/10 text-gray-300"
                }`}
              >
                {pct}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
