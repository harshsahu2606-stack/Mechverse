"use client";

import { Fan, Play, Square, Repeat, Compass, Gauge, Zap } from "lucide-react";
import { FanSimulationState } from "@/types/machine";

interface FanSimulationControlsProps {
  simulation: FanSimulationState;
  onChangeSimulation: (simulation: FanSimulationState) => void;
}

export default function FanSimulationControls({
  simulation,
  onChangeSimulation,
}: FanSimulationControlsProps) {
  const handleTogglePower = () => {
    if (simulation.power) {
      onChangeSimulation({ ...simulation, power: false, speed: 0 });
    } else {
      onChangeSimulation({ ...simulation, power: true, speed: 2 });
    }
  };

  const handleSetSpeed = (speed: 0 | 1 | 2 | 3) => {
    onChangeSimulation({
      ...simulation,
      power: speed > 0,
      speed,
    });
  };

  const handleToggleOscillation = () => {
    onChangeSimulation({
      ...simulation,
      oscillating: !simulation.oscillating,
    });
  };

  const handleTiltChange = (tiltAngle: number) => {
    onChangeSimulation({
      ...simulation,
      tiltAngle,
    });
  };

  const rpmValue =
    !simulation.power || simulation.speed === 0
      ? 0
      : simulation.speed === 1
      ? 850
      : simulation.speed === 2
      ? 1150
      : 1450;

  return (
    <div className="absolute bottom-20 left-4 z-20 w-72 sm:w-80 pointer-events-auto">
      <div className="rounded-2xl border border-white/15 bg-[#111318]/95 backdrop-blur-xl p-4 shadow-2xl space-y-3.5">
        {/* Header with Live Telemetry */}
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <div className="flex items-center gap-2">
            <Fan
              size={18}
              className={`text-sky-400 ${
                simulation.power && simulation.speed > 0 ? "animate-spin" : ""
              }`}
            />
            <span className="text-xs font-bold text-white tracking-wide uppercase">
              Fan Aerodynamics
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-black/40 px-2 py-0.5 rounded-lg border border-white/5">
            <Gauge size={12} className="text-gray-400" />
            <span className="text-[11px] font-mono font-bold text-sky-400">
              {rpmValue} RPM
            </span>
          </div>
        </div>

        {/* 1. Speed selector (0: Off, 1: Low, 2: Med, 3: High) */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] text-gray-400">
            <span>Airflow Velocity</span>
            <span className="text-white font-medium">
              {simulation.speed === 0
                ? "OFF"
                : simulation.speed === 1
                ? "SPEED 1 (LOW)"
                : simulation.speed === 2
                ? "SPEED 2 (MED)"
                : "SPEED 3 (TURBO)"}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {[
              { val: 0, label: "0" },
              { val: 1, label: "1" },
              { val: 2, label: "2" },
              { val: 3, label: "3" },
            ].map((btn) => {
              const isActive = simulation.speed === btn.val;
              return (
                <button
                  key={btn.val}
                  onClick={() => handleSetSpeed(btn.val as any)}
                  className={`py-2 rounded-xl text-xs font-bold transition border ${
                    isActive
                      ? btn.val === 0
                        ? "bg-white/20 border-white text-white"
                        : "bg-sky-500 border-sky-400 text-white shadow-lg shadow-sky-500/30 scale-105"
                      : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {btn.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Oscillation toggle */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            <Repeat size={14} className="text-orange-400" />
            <span className="text-xs text-gray-300 font-medium">Oscillation</span>
          </div>

          <button
            onClick={handleToggleOscillation}
            className={`px-3 py-1 rounded-xl text-xs font-semibold border transition ${
              simulation.oscillating
                ? "bg-orange-500 border-orange-400 text-white shadow-md shadow-orange-500/20"
                : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
            }`}
          >
            {simulation.oscillating ? "SWEEPING ON" : "LOCKED"}
          </button>
        </div>

        {/* 3. Tilt joint articulation */}
        <div className="space-y-1 pt-1">
          <div className="flex justify-between text-[11px] text-gray-400">
            <span className="flex items-center gap-1">
              <Compass size={12} /> Head Tilt Angle
            </span>
            <span className="text-white font-mono">{simulation.tiltAngle}°</span>
          </div>
          <input
            type="range"
            min={-10}
            max={25}
            step={1}
            value={simulation.tiltAngle}
            onChange={(e) => handleTiltChange(parseInt(e.target.value))}
            className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-sky-400"
          />
        </div>
      </div>
    </div>
  );
}
