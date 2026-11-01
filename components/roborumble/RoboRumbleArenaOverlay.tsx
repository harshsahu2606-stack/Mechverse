"use client";

import {
  Shield,
  Zap,
  Gauge,
  Swords,
  Trophy,
  RotateCcw,
  Camera,
  Play,
  Square,
  Flame,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { BattleCarId, BattleMatchState } from "@/types/machine";
import { CameraViewMode } from "../3d/BattleArenaScene";

interface RoboRumbleArenaOverlayProps {
  playerCarId: BattleCarId;
  aiCarId: BattleCarId;
  matchState: BattleMatchState;
  telemetry: {
    playerSpeed: number;
    playerHealth: number;
    playerBattery: number;
    playerMotorTemp: number;
    aiHealth: number;
    collisions: number;
    distance: number;
    duration: number;
    pinProgress?: number;
    pinningSide?: "player" | "ai" | null;
  };
  cameraView: CameraViewMode;
  onChangeCameraView: (mode: CameraViewMode) => void;
  onStartMatch: () => void;
  onPauseMatch: () => void;
  onRestartMatch: () => void;
  onExitArena: () => void;
  // Mobile virtual driving touch triggers
  onVirtualInput: (input: { throttle: number; steer: number; brake: boolean; boost: boolean }) => void;
}

export default function RoboRumbleArenaOverlay({
  playerCarId,
  aiCarId,
  matchState,
  telemetry,
  cameraView,
  onChangeCameraView,
  onStartMatch,
  onPauseMatch,
  onRestartMatch,
  onExitArena,
  onVirtualInput,
}: RoboRumbleArenaOverlayProps) {
  const isRunning = matchState.status === "running";
  const isFinished = matchState.status === "finished";

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-20 flex flex-col justify-between p-4 sm:p-6 overflow-hidden">
      {/* ================= TOP HUD: HEALTH BARS & COMBAT CLOCK ================= */}
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between gap-4 pointer-events-auto">
        {/* Player Health Bar */}
        <div className="flex-1 rounded-2xl bg-black/70 border border-white/10 p-2.5 sm:p-3 backdrop-blur-md shadow-xl">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <span className="text-sky-400 uppercase font-mono flex items-center gap-1.5">
              <Shield size={13} />
              <span>{playerCarId} (YOU)</span>
            </span>
            <span className="font-mono text-white">{telemetry.playerHealth}%</span>
          </div>
          <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-150 rounded-full ${
                telemetry.playerHealth > 50
                  ? "bg-sky-500"
                  : telemetry.playerHealth > 25
                  ? "bg-amber-500"
                  : "bg-rose-500 animate-pulse"
              }`}
              style={{ width: `${telemetry.playerHealth}%` }}
            />
          </div>
        </div>

        {/* Center Combat Clock & Collision Counter */}
        <div className="shrink-0 flex flex-col items-center justify-center rounded-2xl bg-black/80 border border-white/15 px-3 sm:px-4 py-2 backdrop-blur-md shadow-2xl">
          <span className="text-[10px] uppercase font-mono text-gray-400">Battle Clock</span>
          <span className="text-base sm:text-lg font-mono font-extrabold text-white">
            {Math.floor(telemetry.duration / 60)}:
            {(telemetry.duration % 60).toString().padStart(2, "0")}
          </span>
          <div className="flex items-center gap-1 text-[10px] font-mono text-orange-400 mt-0.5">
            <Swords size={11} />
            <span>{telemetry.collisions} Hits</span>
          </div>
        </div>

        {/* AI Health Bar */}
        <div className="flex-1 rounded-2xl bg-black/70 border border-white/10 p-2.5 sm:p-3 backdrop-blur-md shadow-xl">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <span className="text-rose-400 uppercase font-mono flex items-center gap-1.5">
              <Shield size={13} />
              <span>{aiCarId} (AI)</span>
            </span>
            <span className="font-mono text-white">{telemetry.aiHealth}%</span>
          </div>
          <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-150 rounded-full ${
                telemetry.aiHealth > 50
                  ? "bg-rose-500"
                  : telemetry.aiHealth > 25
                  ? "bg-amber-500"
                  : "bg-rose-600 animate-pulse"
              }`}
              style={{ width: `${telemetry.aiHealth}%` }}
            />
          </div>
        </div>
      </div>

      {/* ================= PIN-OUT COUNTDOWN HAZARD BANNER ================= */}
      {isRunning && telemetry.pinProgress && telemetry.pinProgress > 0 && (
        <div className="self-center my-auto pointer-events-none transition-all duration-150 animate-bounce">
          {telemetry.pinningSide === "player" ? (
            <div className="px-5 py-3 rounded-2xl bg-amber-500/90 border border-amber-300 text-black shadow-2xl backdrop-blur-md text-center">
              <div className="text-[11px] font-mono uppercase font-black tracking-wider flex items-center justify-center gap-1.5">
                <Flame size={15} />
                <span>HAZARD PIN COUNTDOWN</span>
              </div>
              <div className="text-2xl font-black font-mono mt-0.5">
                {(3.0 - telemetry.pinProgress * 3.0).toFixed(1)}s
              </div>
              <p className="text-[10px] font-medium opacity-90">Keep pushing against the barrier to Win!</p>
            </div>
          ) : (
            <div className="px-5 py-3 rounded-2xl bg-rose-600/95 border border-rose-400 text-white shadow-2xl backdrop-blur-md text-center animate-pulse">
              <div className="text-[11px] font-mono uppercase font-black tracking-wider flex items-center justify-center gap-1.5">
                <Shield size={15} />
                <span>YOU ARE PINNED AGAINST HAZARD!</span>
              </div>
              <div className="text-2xl font-black font-mono mt-0.5">
                {(3.0 - telemetry.pinProgress * 3.0).toFixed(1)}s
              </div>
              <p className="text-[10px] font-medium opacity-90">REVERSE OR STEER AWAY TO BREAK FREE!</p>
            </div>
          )}
        </div>
      )}

      {/* ================= CENTER MATCH BANNER / PAUSE ================= */}
      {matchState.status === "idle" && (
        <div className="self-center my-auto rounded-3xl bg-[#111318]/95 border border-white/15 p-6 sm:p-8 backdrop-blur-xl shadow-2xl text-center max-w-md pointer-events-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-orange-500 flex items-center justify-center text-white mx-auto shadow-lg shadow-rose-600/30">
            <Swords size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white">Robo Rumble Arena</h3>
            <p className="text-xs text-gray-400 mt-1">
              Engage in multi-hit RC combat! Win by TKO (0% Health), 3-second hazard pin, or timer decision.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs text-gray-300 text-left space-y-1 font-mono">
            <div>• Keyboard: W/A/S/D or Arrow Keys</div>
            <div>• Space: 4-Wheel Emergency Brake</div>
            <div>• Shift: Turbo Boost (50% Speed &amp; Push)</div>
            <div>• Rules: 6-12 clashes to TKO or hold a 3s wall pin!</div>
          </div>

          <button
            onClick={onStartMatch}
            className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-500 hover:to-orange-400 text-white font-extrabold text-sm shadow-xl shadow-rose-600/30 transition hover:scale-[1.02]"
          >
            START MATCH
          </button>
        </div>
      )}

      {/* ================= BOTTOM BAR: TELEMETRY & CONTROLS ================= */}
      <div className="w-full flex items-end justify-between gap-4 pointer-events-auto">
        {/* Left: Speedometer & Powertrain Telemetry */}
        <div className="rounded-2xl bg-black/75 border border-white/15 p-3 backdrop-blur-md shadow-2xl space-y-2">
          <div className="flex items-center gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase text-gray-400 block">Velocity</span>
              <div className="text-xl sm:text-2xl font-black font-mono text-white leading-none">
                {telemetry.playerSpeed.toFixed(1)}{" "}
                <span className="text-[10px] text-gray-400 font-normal">km/h</span>
              </div>
            </div>

            <div className="w-px h-8 bg-white/10" />

            <div>
              <span className="text-[10px] font-mono uppercase text-gray-400 block">Battery</span>
              <div className="text-base font-bold font-mono text-emerald-400 leading-none">
                {telemetry.playerBattery}%
              </div>
            </div>

            <div className="w-px h-8 bg-white/10" />

            <div>
              <span className="text-[10px] font-mono uppercase text-gray-400 block">Motor Temp</span>
              <div className="text-base font-bold font-mono text-amber-400 leading-none">
                {telemetry.playerMotorTemp}°C
              </div>
            </div>
          </div>
        </div>

        {/* Center: Mobile Touch Driving Controls (Rendered on smaller screens) */}
        <div className="sm:hidden flex flex-col items-center gap-2">
          <div className="grid grid-cols-3 gap-1.5 bg-black/60 p-2 rounded-2xl border border-white/15">
            <div />
            <button
              onTouchStart={() => onVirtualInput({ throttle: 1, steer: 0, brake: false, boost: false })}
              onTouchEnd={() => onVirtualInput({ throttle: 0, steer: 0, brake: false, boost: false })}
              className="p-3 rounded-xl bg-white/10 active:bg-white/30 text-white"
            >
              <ArrowUp size={18} />
            </button>
            <div />
            <button
              onTouchStart={() => onVirtualInput({ throttle: 0, steer: -1, brake: false, boost: false })}
              onTouchEnd={() => onVirtualInput({ throttle: 0, steer: 0, brake: false, boost: false })}
              className="p-3 rounded-xl bg-white/10 active:bg-white/30 text-white"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              onTouchStart={() => onVirtualInput({ throttle: -1, steer: 0, brake: false, boost: false })}
              onTouchEnd={() => onVirtualInput({ throttle: 0, steer: 0, brake: false, boost: false })}
              className="p-3 rounded-xl bg-white/10 active:bg-white/30 text-white"
            >
              <ArrowDown size={18} />
            </button>
            <button
              onTouchStart={() => onVirtualInput({ throttle: 0, steer: 1, brake: false, boost: false })}
              onTouchEnd={() => onVirtualInput({ throttle: 0, steer: 0, brake: false, boost: false })}
              className="p-3 rounded-xl bg-white/10 active:bg-white/30 text-white"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Right: Camera Perspectives & Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Camera View Switcher */}
          <div className="flex items-center gap-1 bg-black/70 border border-white/15 p-1 rounded-2xl backdrop-blur-md shadow-xl">
            {[
              { id: "follow", label: "Chase" },
              { id: "top", label: "Top" },
              { id: "orbit", label: "Free" },
            ].map((cam) => (
              <button
                key={cam.id}
                onClick={() => onChangeCameraView(cam.id as CameraViewMode)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  cameraView === cam.id
                    ? "bg-white/20 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {cam.label}
              </button>
            ))}
          </div>

          {/* Pause / Resume */}
          {isRunning ? (
            <button
              onClick={onPauseMatch}
              className="p-2.5 rounded-2xl bg-black/70 border border-white/15 text-gray-300 hover:text-white transition"
              title="Pause Simulation"
            >
              <Square size={16} />
            </button>
          ) : (
            <button
              onClick={onStartMatch}
              className="p-2.5 rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 transition"
              title="Resume Simulation"
            >
              <Play size={16} fill="currentColor" />
            </button>
          )}

          {/* Restart */}
          <button
            onClick={onRestartMatch}
            className="p-2.5 rounded-2xl bg-black/70 border border-white/15 text-gray-300 hover:text-white transition"
            title="Restart Match"
          >
            <RotateCcw size={16} />
          </button>

          {/* Return to Workshop */}
          <button
            onClick={onExitArena}
            className="px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-bold transition"
          >
            Workshop
          </button>
        </div>
      </div>

      {/* ================= MATCH RESULTS MODAL ================= */}
      {isFinished && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 pointer-events-auto">
          <div className="w-full max-w-md rounded-3xl bg-[#111318] border border-white/15 p-6 shadow-2xl space-y-5 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white mx-auto shadow-xl shadow-amber-500/30">
              <Trophy size={32} />
            </div>

            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-orange-400">
                Battle Concluded
              </span>
              <h3 className="text-3xl font-black text-white mt-1">
                {matchState.winner === "player"
                  ? matchState.winReason === "pin_out"
                    ? "VICTORY BY PIN-OUT!"
                    : matchState.winReason === "knockout"
                    ? "VICTORY BY TKO!"
                    : "VICTORY!"
                  : matchState.winner === "ai"
                  ? matchState.winReason === "pin_out"
                    ? "DEFEAT BY PIN-OUT!"
                    : matchState.winReason === "knockout"
                    ? "DEFEAT BY TKO!"
                    : "DEFEAT!"
                  : "DRAW MATCH"}
              </h3>
              <p className="text-xs text-gray-300 mt-1">
                {matchState.winner === "player"
                  ? matchState.winReason === "pin_out"
                    ? "You trapped the opponent against the hazard perimeter for 3 sustained seconds!"
                    : matchState.winReason === "knockout"
                    ? "Opponent chassis suffered complete structural breakdown after heavy impacts."
                    : "Match expired on battle clock. You scored higher remaining integrity!"
                  : matchState.winner === "ai"
                  ? matchState.winReason === "pin_out"
                    ? "Opponent pinned your vehicle against the perimeter hazard."
                    : "Your vehicle sustained critical kinetic damage."
                  : "Both vehicles survived with identical structural integrity."}
              </p>
            </div>

            {/* Results Analytics Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs text-left">
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
                <span className="text-[10px] uppercase font-mono text-gray-400">Duration</span>
                <div className="font-bold text-white font-mono">
                  {Math.floor(telemetry.duration / 60)}m {telemetry.duration % 60}s
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
                <span className="text-[10px] uppercase font-mono text-gray-400">Total Collisions</span>
                <div className="font-bold text-orange-400 font-mono">
                  {telemetry.collisions} Impacts
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
                <span className="text-[10px] uppercase font-mono text-gray-400">Distance Traveled</span>
                <div className="font-bold text-white font-mono">
                  {telemetry.distance} meters
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
                <span className="text-[10px] uppercase font-mono text-gray-400">Battery Used</span>
                <div className="font-bold text-emerald-400 font-mono">
                  {100 - telemetry.playerBattery}%
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={onRestartMatch}
                className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <RotateCcw size={14} />
                <span>Rematch</span>
              </button>

              <button
                onClick={onExitArena}
                className="py-2.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-400 text-white text-xs font-bold transition shadow-lg shadow-orange-500/30 flex items-center justify-center gap-1.5"
              >
                <span>Tweak in Workshop</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
