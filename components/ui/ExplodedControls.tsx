"use client";

import React, { useState } from "react";
import { Layers, Volume2, VolumeX } from "lucide-react";
import { AppTheme } from "@/types/machine";
import { explosionAudio } from "@/lib/audio/explosionSoundEngine";

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
  const [isMuted, setIsMuted] = useState<boolean>(explosionAudio.getMuted());

  const handleSliderChange = (newLevel: number) => {
    explosionAudio.onSliderChange(newLevel);
    onChange(newLevel);
  };

  const handlePreset = (val: number) => {
    if (val === 0) {
      explosionAudio.playMechanicalLatch();
    } else {
      explosionAudio.playCinematicExplode(val);
    }
    onChange(val);
  };

  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    explosionAudio.setMuted(nextMuted);
    if (!nextMuted) {
      explosionAudio.playCinematicExplode(0.5);
    }
  };

  return (
    <div className="absolute bottom-16 sm:bottom-14 left-1/2 -translate-x-1/2 z-20 w-[92%] sm:w-auto max-w-xl pointer-events-auto animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div
        className={`backdrop-blur-xl rounded-2xl px-4 sm:px-5 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.85)] border flex flex-col sm:flex-row items-center gap-3 sm:gap-4 transition-colors ${
          isLight
            ? "bg-white/95 border-gray-200 shadow-gray-300/60 text-gray-800"
            : "bg-[#0e1118]/95 border-white/15 text-gray-200"
        }`}
      >
        {/* Label & Explosion Percentage */}
        <div className="flex items-center gap-2 whitespace-nowrap">
          <Layers size={16} className="text-red-500 animate-pulse" />
          <span className={`text-xs font-semibold ${isLight ? "text-gray-800" : "text-gray-200"}`}>
            Explosion Level
          </span>
          <span className="text-xs font-mono font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
            {percentage}%
          </span>
        </div>

        {/* Dynamic Range Slider with Audio Modulation */}
        <div className="flex items-center gap-3 w-full sm:w-56">
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={explosionLevel}
            onChange={(e) => handleSliderChange(parseFloat(e.target.value))}
            className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-red-500 hover:accent-red-400 transition ${
              isLight ? "bg-gray-200" : "bg-gray-700"
            }`}
            title="Drag slider to expand mechanical parts with live cinematic audio"
          />
        </div>

        {/* Quick action buttons & Audio Mute Toggle */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <div className="flex items-center gap-1">
            {[0, 0.5, 1].map((val) => {
              const pct = `${val * 100}%`;
              const isSelected = Math.abs(explosionLevel - val) < 0.04;
              return (
                <button
                  key={val}
                  onClick={() => handlePreset(val)}
                  className={`px-2 py-1 rounded-md text-[10px] font-semibold transition border cursor-pointer ${
                    isSelected
                      ? "bg-red-600 text-white border-red-500 font-bold shadow-sm"
                      : isLight
                      ? "bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-700"
                      : "bg-white/5 hover:bg-white/15 border-white/10 text-gray-300"
                  }`}
                >
                  {pct}
                </button>
              );
            })}
          </div>

          {/* Cinematic Audio FX Toggle */}
          <button
            onClick={toggleSound}
            className={`p-1.5 rounded-lg border transition cursor-pointer flex items-center justify-center ${
              !isMuted
                ? "bg-red-500/15 border-red-500/30 text-red-400 shadow-sm"
                : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
            }`}
            title={!isMuted ? "Cinematic Audio FX: Active" : "Cinematic Audio FX: Muted"}
          >
            {!isMuted ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
}
