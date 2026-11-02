"use client";

import React from "react";
import { Shield, Zap, Wind, Swords, Flag, RotateCcw } from "lucide-react";
import { BattleCarId } from "@/types/machine";
import { BATTLE_CARS_SPEC } from "@/data/roboRumbleData";

interface RoboRumbleExplorerControlsProps {
  selectedCarId: BattleCarId;
  onSelectCar: (carId: BattleCarId) => void;
  onEnterArena: () => void;
  onEnterTrack?: () => void;
  onReset: () => void;
}

export default function RoboRumbleExplorerControls({
  selectedCarId,
  onSelectCar,
  onEnterArena,
  onEnterTrack,
  onReset,
}: RoboRumbleExplorerControlsProps) {
  const currentSpec = BATTLE_CARS_SPEC[selectedCarId] || BATTLE_CARS_SPEC.striker;

  const cars = [
    {
      id: "striker",
      name: "STRIKER",
      role: "Wedge Pusher",
      icon: Shield,
      accent: "text-orange-400",
    },
    {
      id: "titan",
      name: "TITAN",
      role: "Heavy Tank",
      icon: Zap,
      accent: "text-slate-300",
    },
    {
      id: "viper",
      name: "VIPER",
      role: "Agile Speed",
      icon: Wind,
      accent: "text-sky-400",
    },
  ] as const;

  return (
    <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 w-[95%] max-w-3xl pointer-events-auto">
      <div className="rounded-2xl border border-white/15 bg-[#0e1118]/95 backdrop-blur-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 shadow-[0_20px_50px_rgba(0,0,0,0.85)] space-y-2">
        {/* Top Header: Car Selection Pills & Action Buttons */}
        <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
          {/* Combat Class Selector */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] font-mono uppercase text-gray-400 tracking-wider hidden sm:inline">
              Combat Class:
            </span>
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
              {cars.map((car) => {
                const Icon = car.icon;
                const isSelected = selectedCarId === car.id;
                return (
                  <button
                    key={car.id}
                    onClick={() => onSelectCar(car.id as BattleCarId)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition border cursor-pointer ${
                      isSelected
                        ? "bg-white text-black shadow-md border-white"
                        : "bg-transparent border-transparent text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon size={12} className={isSelected ? "text-orange-600" : car.accent} />
                    <span>{car.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Launch Buttons: Arena & Track */}
          <div className="flex items-center gap-1.5 shrink-0 ml-auto">
            {onEnterTrack && (
              <button
                onClick={onEnterTrack}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-md shadow-orange-600/30 transition hover:scale-[1.02] cursor-pointer"
                title="Enter Obstacle Proving Ground Track"
              >
                <Flag size={13} />
                <span>Obstacle Track</span>
              </button>
            )}

            <button
              onClick={onEnterArena}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs shadow-md shadow-rose-600/30 transition hover:scale-[1.02] cursor-pointer"
              title="Launch Battle Arena Match"
            >
              <Swords size={13} />
              <span>Launch Arena</span>
            </button>
          </div>
        </div>

        {/* Live Spec Badges in a Sleek Single Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="px-2.5 py-1.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono text-gray-400">Top Speed</span>
            <span className="font-bold text-white text-xs">
              {currentSpec.performanceMetrics.topSpeedKmH} <span className="text-[9px] text-gray-400">km/h</span>
            </span>
          </div>

          <div className="px-2.5 py-1.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono text-gray-400">Push Force</span>
            <span className="font-bold text-orange-400 text-xs">
              {currentSpec.performanceMetrics.maxPushForceN} <span className="text-[9px] text-gray-400">N</span>
            </span>
          </div>

          <div className="px-2.5 py-1.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono text-gray-400">Weight</span>
            <span className="font-bold text-white text-xs">
              {currentSpec.chassis.totalWeightGrams} <span className="text-[9px] text-gray-400">g</span>
            </span>
          </div>

          <div className="px-2.5 py-1.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono text-gray-400">Drivetrain</span>
            <span className="font-bold text-sky-400 text-xs truncate">
              {currentSpec.drivetrain.type.split(" ")[0]} 4WD
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
