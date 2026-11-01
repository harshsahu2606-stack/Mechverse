"use client";

import {
  Play,
  Square,
  RotateCcw,
  Gauge,
  Zap,
  ArrowRight,
  MoveHorizontal,
  Compass,
  Footprints,
  Activity,
} from "lucide-react";
import { RobotSimulationState } from "@/types/machine";
import { CameraPreset } from "../3d/SceneViewer";

interface RobotWalkingControlsProps {
  simulation: RobotSimulationState;
  onChangeSimulation: (simulation: RobotSimulationState) => void;
  onSelectCameraPreset: (preset: CameraPreset) => void;
  onReset: () => void;
}

export default function RobotWalkingControls({
  simulation,
  onChangeSimulation,
  onSelectCameraPreset,
  onReset,
}: RobotWalkingControlsProps) {
  const toggleWalking = () => {
    onChangeSimulation({
      ...simulation,
      walking: !simulation.walking,
    });
  };

  const setSpeed = (speed: "slow" | "normal" | "fast") => {
    onChangeSimulation({
      ...simulation,
      speed,
    });
  };

  const toggleForward = () => {
    onChangeSimulation({
      ...simulation,
      forwardMovement: !simulation.forwardMovement,
    });
  };

  // Kinematic parameters derived strictly from 1:48 gear ratio and 28mm stride
  const crankRpm = !simulation.walking
    ? 0
    : simulation.speed === "slow"
    ? 30
    : simulation.speed === "fast"
    ? 120
    : 60;

  const motorArmatureRpm = crankRpm * 48;
  const linearVelocityCmS = !simulation.walking
    ? 0
    : simulation.speed === "slow"
    ? 1.4
    : simulation.speed === "fast"
    ? 5.6
    : 2.8;

  const voltage =
    simulation.speed === "fast"
      ? "6.0V DC"
      : simulation.speed === "slow"
      ? "2.2V (PWM)"
      : "3.0V (2x AA)";

  return (
    <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 w-[95%] max-w-2xl pointer-events-auto">
      <div className="rounded-2xl border border-white/15 bg-[#101216]/95 backdrop-blur-xl p-3 sm:p-4 shadow-2xl space-y-3">
        {/* Top Header: Kinematic Status & Live Engineering Telemetry */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                simulation.walking ? "bg-emerald-400 animate-pulse" : "bg-zinc-500"
              }`}
            />
            <span className="text-xs font-bold text-white tracking-wide uppercase flex items-center gap-1.5">
              <Activity size={13} className="text-orange-400" />
              <span>Strider-X1 Kinematic Drive</span>
            </span>
          </div>

          {/* Telemetry Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded-lg border border-white/10">
              <Gauge size={11} className="text-orange-400" />
              <span className="text-[11px] font-mono font-bold text-orange-400">
                {crankRpm} RPM Crank
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded-lg border border-white/10">
              <Zap size={11} className="text-sky-400" />
              <span className="text-[11px] font-mono text-gray-300">
                {motorArmatureRpm.toLocaleString()} Armature (1:48)
              </span>
            </div>

            <div className="hidden md:flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded-lg border border-white/10">
              <span className="text-[10px] font-mono text-zinc-400">{voltage}</span>
            </div>

            {simulation.forwardMovement && (
              <div className="flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/30">
                <Footprints size={11} className="text-emerald-400" />
                <span className="text-[11px] font-mono font-semibold text-emerald-400">
                  {linearVelocityCmS.toFixed(1)} cm/s
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Main Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
          {/* 1. Walk / Stop Action (sm: 4 cols) */}
          <div className="sm:col-span-4 flex items-center gap-2">
            <button
              onClick={toggleWalking}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition border ${
                simulation.walking
                  ? "bg-rose-600 hover:bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-600/30"
                  : "bg-emerald-600 hover:bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-600/30"
              }`}
            >
              {simulation.walking ? <Square size={13} /> : <Play size={13} fill="currentColor" />}
              <span>{simulation.walking ? "Pause Gait" : "Start Walking"}</span>
            </button>

            <button
              onClick={onReset}
              title="Reset Kinematics to 0°"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition"
            >
              <RotateCcw size={14} />
            </button>
          </div>

          {/* 2. Speed Cadence Selector (sm: 4 cols) */}
          <div className="sm:col-span-4 grid grid-cols-3 gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
            {[
              { id: "slow", label: "Slow", rpm: "30" },
              { id: "normal", label: "Norm", rpm: "60" },
              { id: "fast", label: "Fast", rpm: "120" },
            ].map((spd) => {
              const isActive = simulation.speed === spd.id;
              return (
                <button
                  key={spd.id}
                  onClick={() => setSpeed(spd.id as any)}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold transition text-center ${
                    isActive
                      ? "bg-orange-500 text-white shadow"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="leading-tight">{spd.label}</div>
                  <div className="text-[9px] opacity-75 font-mono">{spd.rpm}</div>
                </button>
              );
            })}
          </div>

          {/* 3. Mode Toggle: In-Place Analysis vs Forward Locomotion (sm: 4 cols) */}
          <div className="sm:col-span-4">
            <button
              onClick={toggleForward}
              className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-between transition border ${
                simulation.forwardMovement
                  ? "bg-sky-500/15 border-sky-500/40 text-sky-300"
                  : "bg-white/5 hover:bg-white/10 border-white/10 text-gray-300"
              }`}
              title={
                simulation.forwardMovement
                  ? "Robot walks forward across floor grid"
                  : "Mechanism inspect mode: robot remains centered for easy joint inspection"
              }
            >
              <div className="flex items-center gap-1.5">
                <MoveHorizontal size={13} className={simulation.forwardMovement ? "text-sky-400" : "text-gray-400"} />
                <span className="truncate">
                  {simulation.forwardMovement ? "Forward Walk" : "In-Place Inspect"}
                </span>
              </div>
              <span className="text-[10px] font-mono uppercase opacity-75">
                {simulation.forwardMovement ? "Active" : "Bench"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
