"use client";

import React from "react";
import { Play, Pause, RotateCcw, ArrowRight, ArrowLeft, Zap, Gauge, Cable, Activity, Flame, ShieldAlert, Compass } from "lucide-react";
import { RopewaySimulationState } from "@/types/machine";

interface RopewaySimulationControlsProps {
  simulation: RopewaySimulationState;
  onUpdateSimulation: (updater: (prev: RopewaySimulationState) => RopewaySimulationState) => void;
}

export default function RopewaySimulationControls({
  simulation,
  onUpdateSimulation,
}: RopewaySimulationControlsProps) {
  const togglePlay = () => {
    onUpdateSimulation((prev) => ({
      ...prev,
      running: !prev.running,
      direction: !prev.running ? (prev.direction === "stop" ? "forward" : prev.direction) : "stop",
    }));
  };

  const setDirection = (direction: "forward" | "reverse" | "stop") => {
    onUpdateSimulation((prev) => ({
      ...prev,
      direction,
      running: direction !== "stop",
    }));
  };

  const handleSpeedChange = (speedPct: number) => {
    onUpdateSimulation((prev) => ({
      ...prev,
      speedPct,
    }));
  };

  const handleInclineChange = (inclineAngleDeg: number) => {
    onUpdateSimulation((prev) => ({
      ...prev,
      inclineAngleDeg,
      // Greater incline slightly increases current draw and reduces speed
      isStalled: inclineAngleDeg > 42 && prev.speedPct < 20,
    }));
  };

  const resetPosition = () => {
    onUpdateSimulation((prev) => ({
      ...prev,
      positionM: 0,
      running: false,
      direction: "stop",
    }));
  };

  // Derived telemetry metrics
  const linearSpeed = simulation.running
    ? ((simulation.speedPct / 100) * 0.85 * (1 - (simulation.inclineAngleDeg / 90) * 0.35)).toFixed(2)
    : "0.00";

  const motorCurrent = simulation.running
    ? (0.12 + (simulation.speedPct / 100) * 0.45 + (simulation.inclineAngleDeg / 45) * 0.35).toFixed(2)
    : "0.05";

  const estimatedBattery = Math.max(12, Math.round(96 - Math.abs(simulation.positionM) * 3));

  const statusLabel = !simulation.running
    ? "IDLE / BRAKED"
    : simulation.isStalled
    ? "STALLED (INCLINE TOO HIGH)"
    : simulation.direction === "forward"
    ? `ASCENDING (${simulation.inclineAngleDeg}°)`
    : `DESCENDING (${simulation.inclineAngleDeg}°)`;

  return (
    <div className="absolute top-4 left-4 right-4 md:left-6 md:right-auto md:w-96 z-20 pointer-events-auto">
      <div className="rounded-2xl border border-white/10 bg-[#0a0c10]/85 backdrop-blur-md p-4 shadow-2xl space-y-3.5 text-white">
        {/* Header with Live Status Indicator */}
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-sky-500/15 text-sky-400 border border-sky-500/30">
              <Cable size={16} />
            </div>
            <div>
              <h3 className="text-xs font-bold tracking-wide uppercase">Ropeway Flight Controller</h3>
              <p className="text-[10px] text-gray-400 font-mono">AeroClimb RC-1 Telemetry</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                !simulation.running
                  ? "bg-amber-400 animate-pulse"
                  : simulation.isStalled
                  ? "bg-rose-500 animate-ping"
                  : "bg-emerald-400 animate-pulse"
              }`}
            />
            <span className="text-[10px] font-mono font-bold text-gray-300">
              {simulation.running ? "ACTIVE" : "HOLD"}
            </span>
          </div>
        </div>

        {/* Live Telemetry HUD Grid */}
        <div className="grid grid-cols-4 gap-1.5 text-center">
          <div className="bg-white/5 rounded-xl p-2 border border-white/5">
            <span className="text-[8px] uppercase tracking-wider text-gray-400 block font-mono">Position</span>
            <span className="text-xs font-bold text-sky-400 font-mono">
              {simulation.positionM > 0 ? `+${simulation.positionM.toFixed(2)}` : simulation.positionM.toFixed(2)}m
            </span>
          </div>
          <div className="bg-white/5 rounded-xl p-2 border border-white/5">
            <span className="text-[8px] uppercase tracking-wider text-gray-400 block font-mono">Velocity</span>
            <span className="text-xs font-bold text-emerald-400 font-mono">{linearSpeed} m/s</span>
          </div>
          <div className="bg-white/5 rounded-xl p-2 border border-white/5">
            <span className="text-[8px] uppercase tracking-wider text-gray-400 block font-mono">Current</span>
            <span className="text-xs font-bold text-amber-300 font-mono">{motorCurrent} A</span>
          </div>
          <div className="bg-white/5 rounded-xl p-2 border border-white/5">
            <span className="text-[8px] uppercase tracking-wider text-gray-400 block font-mono">Battery</span>
            <span className="text-xs font-bold text-teal-400 font-mono">{estimatedBattery}%</span>
          </div>
        </div>

        {/* Direction & Playback Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDirection("reverse")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition border ${
              simulation.direction === "reverse" && simulation.running
                ? "bg-amber-500 border-amber-400 text-white shadow-lg shadow-amber-500/25"
                : "bg-white/5 border-white/10 text-gray-300 hover:text-white hover:bg-white/10"
            }`}
          >
            <ArrowLeft size={14} />
            <span>Reverse</span>
          </button>

          <button
            onClick={togglePlay}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-lg ${
              simulation.running
                ? "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30"
                : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30"
            }`}
          >
            {simulation.running ? <Pause size={15} /> : <Play size={15} />}
          </button>

          <button
            onClick={() => setDirection("forward")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition border ${
              simulation.direction === "forward" && simulation.running
                ? "bg-sky-500 border-sky-400 text-white shadow-lg shadow-sky-500/25"
                : "bg-white/5 border-white/10 text-gray-300 hover:text-white hover:bg-white/10"
            }`}
          >
            <span>Forward</span>
            <ArrowRight size={14} />
          </button>

          <button
            onClick={resetPosition}
            title="Reset position to center (0m)"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition"
          >
            <RotateCcw size={14} />
          </button>
        </div>

        {/* Speed Slider */}
        <div className="space-y-1.5 bg-white/5 p-2.5 rounded-xl border border-white/5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400 font-medium flex items-center gap-1">
              <Gauge size={13} className="text-sky-400" />
              <span>Throttle / Climb Speed</span>
            </span>
            <span className="font-mono font-bold text-sky-400">{simulation.speedPct}%</span>
          </div>
          <input
            type="range"
            min={10}
            max={100}
            step={5}
            value={simulation.speedPct}
            onChange={(e) => handleSpeedChange(Number(e.target.value))}
            className="w-full accent-sky-500 h-1.5 bg-gray-700 rounded-lg cursor-pointer"
          />
        </div>

        {/* Incline Angle Slider (0° to 45°) */}
        <div className="space-y-1.5 bg-white/5 p-2.5 rounded-xl border border-white/5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400 font-medium flex items-center gap-1">
              <Compass size={13} className="text-amber-400" />
              <span>Cable Incline Grade</span>
            </span>
            <span className="font-mono font-bold text-amber-400">
              {simulation.inclineAngleDeg}° {simulation.inclineAngleDeg === 0 ? "(Flat)" : simulation.inclineAngleDeg < 25 ? "(Mild)" : "(Steep Cliff)"}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={45}
            step={5}
            value={simulation.inclineAngleDeg}
            onChange={(e) => handleInclineChange(Number(e.target.value))}
            className="w-full accent-amber-500 h-1.5 bg-gray-700 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[9px] text-gray-500 font-mono px-0.5">
            <span>0° Horizontal</span>
            <span>15° Mild</span>
            <span>30° Mountain</span>
            <span>45° Cliff</span>
          </div>
        </div>

        {/* Live Status Bar */}
        <div className="text-[10px] text-gray-400 flex items-center justify-between pt-0.5 font-mono">
          <span className="truncate">MODE: {statusLabel}</span>
          <span className="text-emerald-400 font-bold shrink-0">WORM LOCKED</span>
        </div>
      </div>
    </div>
  );
}
