"use client";

import { Shield, Zap, Wind, RotateCcw, Swords, Play, Layers } from "lucide-react";
import { BattleCarId } from "@/types/machine";
import { BATTLE_CARS_SPEC } from "@/data/roboRumbleData";

interface RoboRumbleExplorerControlsProps {
  selectedCarId: BattleCarId;
  onSelectCar: (carId: BattleCarId) => void;
  onEnterArena: () => void;
  onEnterTrack?: () => void;
  onReset: () => void;
  explosionLevel?: number;
  onChangeExplosionLevel?: (level: number) => void;
}

export default function RoboRumbleExplorerControls({
  selectedCarId,
  onSelectCar,
  onEnterArena,
  onEnterTrack,
  onReset,
  explosionLevel = 0,
  onChangeExplosionLevel,
}: RoboRumbleExplorerControlsProps) {
  const currentSpec = BATTLE_CARS_SPEC[selectedCarId] || BATTLE_CARS_SPEC.striker;

  const cars = [
    {
      id: "striker",
      name: "STRIKER",
      role: "Wedge Pusher",
      icon: Shield,
      color: "from-orange-500/20 to-amber-500/20 border-orange-500/40 text-orange-400",
    },
    {
      id: "titan",
      name: "TITAN",
      role: "Heavy Tank",
      icon: Zap,
      color: "from-slate-500/20 to-zinc-500/20 border-slate-500/40 text-slate-300",
    },
    {
      id: "viper",
      name: "VIPER",
      role: "Agile Speed",
      icon: Wind,
      color: "from-sky-500/20 to-cyan-500/20 border-sky-500/40 text-sky-400",
    },
  ] as const;

  return (
    <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 w-[95%] max-w-2xl pointer-events-auto">
      <div className="rounded-2xl border border-white/15 bg-[#101216]/95 backdrop-blur-xl p-3 sm:p-4 shadow-2xl space-y-3">
        {/* Top Header: Car Selection Pills */}
        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono uppercase text-gray-400 tracking-wider">
              Combat Class:
            </span>
            <div className="flex items-center gap-1">
              {cars.map((car) => {
                const Icon = car.icon;
                const isSelected = selectedCarId === car.id;
                return (
                  <button
                    key={car.id}
                    onClick={() => onSelectCar(car.id as BattleCarId)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition border ${
                      isSelected
                        ? "bg-white text-black shadow-md border-white"
                        : "bg-white/5 border-white/10 text-gray-300 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Icon size={12} className={isSelected ? "text-orange-600" : "text-gray-400"} />
                    <span>{car.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {onEnterTrack && (
              <button
                onClick={onEnterTrack}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-md shadow-orange-600/30 transition hover:scale-[1.02]"
              >
                <span>🏁</span>
                <span>Race Track</span>
              </button>
            )}

            <button
              onClick={onEnterArena}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white font-bold text-xs shadow-md shadow-rose-600/30 transition hover:scale-[1.02]"
            >
              <Swords size={13} />
              <span>Battle</span>
            </button>
          </div>
        </div>

        {/* Live Spec Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
            <span className="text-[10px] uppercase font-mono text-gray-400">Top Speed</span>
            <div className="font-bold text-white text-sm">
              {currentSpec.performanceMetrics.topSpeedKmH} <span className="text-[10px] text-gray-400">km/h</span>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
            <span className="text-[10px] uppercase font-mono text-gray-400">Push Force</span>
            <div className="font-bold text-orange-400 text-sm">
              {currentSpec.performanceMetrics.maxPushForceN} <span className="text-[10px] text-gray-400">N</span>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
            <span className="text-[10px] uppercase font-mono text-gray-400">Weight</span>
            <div className="font-bold text-white text-sm">
              {currentSpec.chassis.totalWeightGrams} <span className="text-[10px] text-gray-400">grams</span>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
            <span className="text-[10px] uppercase font-mono text-gray-400">Drive Type</span>
            <div className="font-bold text-sky-400 text-xs truncate">
              {currentSpec.drivetrain.type.split(" ")[0]} 4WD
            </div>
          </div>
        </div>

        {/* Assemble & Explode View Slider */}
        {onChangeExplosionLevel && (
          <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onChangeExplosionLevel(explosionLevel > 0 ? 0 : 0.65)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition border ${
                  explosionLevel > 0
                    ? "bg-rose-500/20 border-rose-500/40 text-rose-300"
                    : "bg-white/5 border-white/10 text-gray-300 hover:text-white"
                }`}
              >
                <Layers size={13} className={explosionLevel > 0 ? "text-rose-400" : "text-gray-400"} />
                <span>{explosionLevel > 0 ? "Exploded" : "Assembled"}</span>
              </button>
              <span className="text-[11px] font-mono font-bold text-white">
                {Math.round(explosionLevel * 100)}%
              </span>
            </div>

            <div className="flex-1 min-w-[140px] max-w-xs flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={explosionLevel}
                onChange={(e) => onChangeExplosionLevel(parseFloat(e.target.value))}
                className="w-full accent-rose-500 h-1.5 bg-white/15 rounded-lg cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => onChangeExplosionLevel(0)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono transition ${
                  explosionLevel === 0
                    ? "bg-white text-black font-bold"
                    : "bg-white/5 text-gray-400 hover:text-white"
                }`}
              >
                0%
              </button>
              <button
                onClick={() => onChangeExplosionLevel(0.5)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono transition ${
                  Math.abs(explosionLevel - 0.5) < 0.05
                    ? "bg-white text-black font-bold"
                    : "bg-white/5 text-gray-400 hover:text-white"
                }`}
              >
                50%
              </button>
              <button
                onClick={() => onChangeExplosionLevel(1.0)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono transition ${
                  explosionLevel === 1.0
                    ? "bg-white text-black font-bold"
                    : "bg-white/5 text-gray-400 hover:text-white"
                }`}
              >
                100%
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
