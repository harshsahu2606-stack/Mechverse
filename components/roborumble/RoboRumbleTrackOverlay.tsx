"use client";

import React, { useState } from "react";
import {
  Flag,
  Timer,
  Zap,
  Gauge,
  Flame,
  Camera,
  RotateCcw,
  Play,
  Square,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ShieldAlert,
  SlidersHorizontal,
} from "lucide-react";
import { BattleCarId, CustomizationSettings, TrackTelemetryData, TrackRunState } from "@/types/machine";
import { TrackCameraView } from "../3d/RoboRumbleObstacleTrackScene";
import { TRACK_SECTORS, CAR_TRACK_EVALUATIONS } from "@/data/roboTrackRecommendations";

interface RoboRumbleTrackOverlayProps {
  playerCarId: BattleCarId;
  customization: CustomizationSettings;
  runState: TrackRunState;
  telemetry: TrackTelemetryData;
  cameraView: TrackCameraView;
  onChangeCameraView: (cam: TrackCameraView) => void;
  onStartRun: () => void;
  onPauseRun: () => void;
  onRestartRun: () => void;
  onExitTrack: () => void;
  onApplyRecommendedSetup: () => void;
  onVirtualInput: (input: { throttle: number; steer: number; brake: boolean; boost: boolean }) => void;
}

export default function RoboRumbleTrackOverlay({
  playerCarId,
  customization,
  runState,
  telemetry,
  cameraView,
  onChangeCameraView,
  onStartRun,
  onPauseRun,
  onRestartRun,
  onExitTrack,
  onApplyRecommendedSetup,
  onVirtualInput,
}: RoboRumbleTrackOverlayProps) {
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [selectedGuideCar, setSelectedGuideCar] = useState<BattleCarId>("titan");

  const isRunning = runState.status === "running";
  const isCompleted = runState.status === "completed";

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-20 flex flex-col justify-between p-3 sm:p-5 overflow-hidden">
      {/* ================= TOP HUD: LAP TIMER, SECTOR & PENALTIES ================= */}
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between gap-3 pointer-events-auto">
        {/* Left: Lap Timer & Penalties */}
        <div className="flex items-center gap-3 rounded-2xl bg-black/80 border border-white/15 px-3.5 py-2.5 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-2 text-rose-500">
            <Timer size={18} className="animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Lap Time</span>
              <span className="text-xl sm:text-2xl font-black font-mono text-white tracking-tight">
                {telemetry.elapsedSec.toFixed(1)}s
              </span>
            </div>
          </div>

          {telemetry.penaltiesSec > 0 && (
            <div className="px-2 py-1 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-400 text-xs font-mono font-bold animate-pulse">
              +{telemetry.penaltiesSec.toFixed(1)}s Penalty
            </div>
          )}
        </div>

        {/* Center: Current Obstacle Sector Banner */}
        <div className="hidden sm:flex flex-col items-center justify-center rounded-2xl bg-black/80 border border-white/15 px-4 py-2 backdrop-blur-xl shadow-2xl text-center">
          <span className="text-[10px] font-mono uppercase text-orange-400 tracking-widest flex items-center gap-1.5 font-bold">
            <Flag size={12} />
            <span>Checkpoint {telemetry.checkpointsPassed} / {telemetry.totalCheckpoints}</span>
          </span>
          <span className="text-xs sm:text-sm font-extrabold text-white mt-0.5 truncate max-w-[280px]">
            {telemetry.currentSector}
          </span>
        </div>

        {/* Right: Quick Engineering Recommendation Button */}
        <button
          onClick={() => setShowGuideModal(true)}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-orange-600/90 to-amber-600/90 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-bold shadow-xl shadow-orange-600/25 border border-white/20 transition hover:scale-105"
        >
          <Sparkles size={14} />
          <span className="hidden sm:inline">Track Setup Guide</span>
          <span className="sm:hidden">Setup</span>
        </button>
      </div>

      {/* ================= REALTIME DANGER / HAZARD WARNING CALLOUTS ================= */}
      {isRunning && (
        <div className="self-center my-auto pointer-events-none space-y-2 text-center">
          {telemetry.isStalled && (
            <div className="px-4 py-2.5 rounded-2xl bg-rose-600/90 border border-rose-300 text-white shadow-2xl backdrop-blur-md animate-bounce">
              <div className="text-xs font-mono font-black uppercase flex items-center justify-center gap-1.5">
                <AlertTriangle size={16} />
                <span>INCLINE STALL HAZARD!</span>
              </div>
              <p className="text-[11px] opacity-90 mt-0.5">Hold SHIFT for Turbo Boost or upgrade to High-Torque Motor!</p>
            </div>
          )}

          {telemetry.wheelSlipPct > 40 && (
            <div className="px-4 py-2 rounded-2xl bg-amber-500/90 border border-amber-300 text-black shadow-2xl backdrop-blur-md animate-pulse">
              <div className="text-xs font-mono font-black uppercase flex items-center justify-center gap-1.5">
                <Flame size={15} />
                <span>{telemetry.wheelSlipPct}% MUD WHEEL SLIP!</span>
              </div>
              <p className="text-[10px] font-bold">Equip Silicone-Spike tires to stop tire burnout.</p>
            </div>
          )}

          {telemetry.clearanceBounce > 8 && (
            <div className="px-3 py-1.5 rounded-xl bg-sky-500/80 border border-sky-300 text-black shadow-lg backdrop-blur-md">
              <span className="text-[11px] font-mono font-bold">Chassis Bounce! 68mm Wheels roll over logs easier.</span>
            </div>
          )}
        </div>
      )}

      {/* ================= PRE-RACE START BANNER ================= */}
      {runState.status === "idle" && (
        <div className="self-center my-auto rounded-3xl bg-[#111318]/95 border border-white/15 p-6 sm:p-8 backdrop-blur-xl shadow-2xl text-center max-w-lg pointer-events-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white mx-auto shadow-xl shadow-rose-600/30">
            <Flag size={26} />
          </div>

          <div>
            <span className="text-xs uppercase font-mono tracking-widest text-orange-400 font-bold">
              Obstacle Proving Ground
            </span>
            <h3 className="text-2xl font-black text-white mt-1">Robo Race &amp; Hurdle Trial</h3>
            <p className="text-xs text-gray-400 mt-1.5">
              Navigate 6 harsh engineering sectors: 18° Incline Ramp, Log Crawl, Mud Pit, Slalom Cones, and Narrow Ridge.
            </p>
          </div>

          {/* Track Quick Specs */}
          <div className="grid grid-cols-3 gap-2 text-left font-mono text-[11px]">
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
              <div className="text-gray-400 text-[9px] uppercase">Track Length</div>
              <div className="font-bold text-white">68 Meters</div>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
              <div className="text-gray-400 text-[9px] uppercase">Hurdles</div>
              <div className="font-bold text-orange-400">6 Sectors</div>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
              <div className="text-gray-400 text-[9px] uppercase">Cone Penalty</div>
              <div className="font-bold text-rose-400">+2.0s Each</div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onStartRun}
              className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-500 hover:to-orange-400 text-white font-extrabold text-sm shadow-xl shadow-rose-600/30 transition hover:scale-[1.02]"
            >
              LAUNCH TIME TRIAL
            </button>

            <button
              onClick={() => setShowGuideModal(true)}
              className="py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-xs transition"
              title="View Car Recommendations"
            >
              <HelpCircle size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ================= BOTTOM BAR: SPEEDOMETER & CAMERA CONTROLS ================= */}
      <div className="w-full flex items-end justify-between gap-3 pointer-events-auto pb-1">
        {/* Left: Speedometer & Powertrain Stats (offset from bottom-left corner to avoid Next.js dev badge) */}
        <div className="ml-14 sm:ml-16 rounded-2xl bg-black/85 border border-white/20 p-3 sm:px-4 sm:py-3 backdrop-blur-xl shadow-2xl flex items-center gap-4">
          <div className="flex flex-col min-w-[76px]">
            <span className="text-[9px] font-mono uppercase text-gray-400 tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Velocity
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight leading-none">
                {telemetry.speedKmH}
              </span>
              <span className="text-[10px] font-mono text-cyan-400 font-semibold">km/h</span>
            </div>
            {/* Speed capacity bar */}
            <div className="w-full h-1 bg-white/10 rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-rose-500 transition-all duration-150"
                style={{ width: `${Math.min(100, (telemetry.speedKmH / 30) * 100)}%` }}
              />
            </div>
          </div>

          <div className="h-9 w-px bg-white/15" />

          <div className="flex flex-col text-[11px] font-mono text-gray-300 space-y-1">
            <div className="flex items-center gap-1.5">
              <Zap size={12} className="text-amber-400 shrink-0" />
              <span className="text-gray-300">Throttle: <b className="text-white">{telemetry.throttlePct}%</b></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Flame size={12} className={telemetry.motorTempC > 65 ? "text-rose-400 shrink-0" : "text-emerald-400 shrink-0"} />
              <span className="text-gray-300">Temp: <b className="text-white">{telemetry.motorTempC}°C</b></span>
            </div>
          </div>
        </div>

        {/* Center: Mobile Virtual Controls */}
        <div className="flex md:hidden items-center gap-2">
          <div className="grid grid-cols-3 gap-1">
            <div />
            <button
              onPointerDown={() => onVirtualInput({ throttle: 1, steer: 0, brake: false, boost: false })}
              onPointerUp={() => onVirtualInput({ throttle: 0, steer: 0, brake: false, boost: false })}
              className="w-11 h-11 rounded-xl bg-white/15 border border-white/20 active:bg-orange-500 text-white flex items-center justify-center font-bold"
            >
              <ArrowUp size={20} />
            </button>
            <div />
            <button
              onPointerDown={() => onVirtualInput({ throttle: 0.8, steer: -1, brake: false, boost: false })}
              onPointerUp={() => onVirtualInput({ throttle: 0, steer: 0, brake: false, boost: false })}
              className="w-11 h-11 rounded-xl bg-white/15 border border-white/20 active:bg-orange-500 text-white flex items-center justify-center font-bold"
            >
              <ArrowLeft size={20} />
            </button>
            <button
              onPointerDown={() => onVirtualInput({ throttle: -0.8, steer: 0, brake: false, boost: false })}
              onPointerUp={() => onVirtualInput({ throttle: 0, steer: 0, brake: false, boost: false })}
              className="w-11 h-11 rounded-xl bg-white/15 border border-white/20 active:bg-orange-500 text-white flex items-center justify-center font-bold"
            >
              <ArrowDown size={20} />
            </button>
            <button
              onPointerDown={() => onVirtualInput({ throttle: 0.8, steer: 1, brake: false, boost: false })}
              onPointerUp={() => onVirtualInput({ throttle: 0, steer: 0, brake: false, boost: false })}
              className="w-11 h-11 rounded-xl bg-white/15 border border-white/20 active:bg-orange-500 text-white flex items-center justify-center font-bold"
            >
              <ArrowRight size={20} />
            </button>
          </div>

          <button
            onPointerDown={() => onVirtualInput({ throttle: 1, steer: 0, brake: false, boost: true })}
            onPointerUp={() => onVirtualInput({ throttle: 0, steer: 0, brake: false, boost: false })}
            className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 text-white font-mono font-black text-xs shadow-lg active:scale-95"
          >
            BOOST
          </button>
        </div>

        {/* Right: Camera Switcher & Match Run Control */}
        <div className="flex items-center gap-2">
          {/* Camera View Switcher */}
          <div className="flex items-center gap-1 rounded-2xl bg-black/80 border border-white/15 p-1 backdrop-blur-xl">
            {(["follow", "bumper", "side", "top"] as TrackCameraView[]).map((cam) => (
              <button
                key={cam}
                onClick={() => onChangeCameraView(cam)}
                className={`px-2.5 py-1.5 rounded-xl text-[10px] font-mono font-bold uppercase transition ${
                  cameraView === cam
                    ? "bg-rose-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {cam}
              </button>
            ))}
          </div>

          {/* Pause / Resume */}
          {isRunning ? (
            <button
              onClick={onPauseRun}
              className="p-2.5 rounded-2xl bg-black/80 border border-white/15 text-gray-300 hover:text-white transition"
              title="Pause Run"
            >
              <Square size={16} />
            </button>
          ) : (
            <button
              onClick={onStartRun}
              className="p-2.5 rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 transition"
              title="Start Run"
            >
              <Play size={16} fill="currentColor" />
            </button>
          )}

          {/* Restart */}
          <button
            onClick={onRestartRun}
            className="p-2.5 rounded-2xl bg-black/80 border border-white/15 text-gray-300 hover:text-white transition"
            title="Restart Run from Start Grid"
          >
            <RotateCcw size={16} />
          </button>

          {/* Exit to Explorer */}
          <button
            onClick={onExitTrack}
            className="px-3 py-2 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-bold transition"
          >
            Exit
          </button>
        </div>
      </div>

      {/* ================= ENGINEERING TRACK RECOMMENDATION MODAL ================= */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 pointer-events-auto overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl bg-[#111318] border border-white/20 p-6 sm:p-7 shadow-2xl space-y-6 my-auto max-h-[90vh] overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs uppercase font-mono tracking-widest text-orange-400 font-bold flex items-center gap-1.5">
                  <SlidersHorizontal size={14} />
                  <span>Engineering Physics Recommendation</span>
                </span>
                <h3 className="text-2xl font-black text-white mt-1">
                  Which Car &amp; Setup Dominates This Track?
                </h3>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center text-sm font-bold transition"
              >
                ✕
              </button>
            </div>

            {/* Quick Car Selector & Suitability Score */}
            <div className="grid grid-cols-3 gap-2.5">
              {(["titan", "striker", "viper"] as BattleCarId[]).map((cId) => {
                const evalData = CAR_TRACK_EVALUATIONS[cId];
                const isSelected = selectedGuideCar === cId;
                return (
                  <button
                    key={cId}
                    onClick={() => setSelectedGuideCar(cId)}
                    className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                      isSelected
                        ? "bg-orange-500/15 border-orange-500 shadow-lg shadow-orange-500/10"
                        : "bg-black/40 border-white/10 hover:border-white/25"
                    }`}
                  >
                    <div>
                      <div className="text-[10px] font-mono uppercase text-gray-400">
                        {cId === "titan" ? "Heavy Monster" : cId === "striker" ? "Balanced" : "Agile Racer"}
                      </div>
                      <div className="text-sm font-black text-white uppercase">{cId}</div>
                    </div>
                    <div className="mt-2 text-xs font-mono font-bold text-orange-400">
                      Score: {evalData.suitabilityScore}/100
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Car In-depth Analysis */}
            {(() => {
              const carData = CAR_TRACK_EVALUATIONS[selectedGuideCar];
              return (
                <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">{carData.name}</h4>
                    <span className="text-xs font-mono text-orange-400 font-bold">
                      Best On: {carData.bestTracks}
                    </span>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed">
                    {carData.recommendationNote}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                    <div>
                      <div className="text-[10px] font-mono text-emerald-400 uppercase font-bold mb-1">
                        Mechanical Strengths:
                      </div>
                      <ul className="space-y-1 text-gray-300">
                        {carData.strengths.map((s, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <CheckCircle2 size={12} className="text-emerald-400 shrink-0 mt-0.5" />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="text-[10px] font-mono text-amber-400 uppercase font-bold mb-1">
                        Track Vulnerabilities:
                      </div>
                      <ul className="space-y-1 text-gray-300">
                        {carData.weaknesses.map((w, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <AlertTriangle size={12} className="text-amber-400 shrink-0 mt-0.5" />
                            <span>{w}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Sector-by-Sector Physics Engineering Table */}
            <div className="space-y-2">
              <div className="text-xs font-mono uppercase text-gray-400 font-bold">
                Obstacle Physics Formulas &amp; Tuning Breakdown:
              </div>
              <div className="space-y-2 text-xs">
                {TRACK_SECTORS.map((sec) => (
                  <div key={sec.id} className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-white">{sec.name}</span>
                      <span className="font-mono text-orange-400 text-[11px]">
                        Recommended: {sec.recommendedCar.toUpperCase()} ({sec.recommendedSetup.wheels}mm + {sec.recommendedSetup.tires})
                      </span>
                    </div>
                    <div className="text-gray-400 text-[11px]">{sec.physicsReasoning}</div>
                    <div className="font-mono text-[10px] text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded inline-block mt-0.5">
                      Formula: {sec.engineeringFormula}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  onApplyRecommendedSetup();
                  setShowGuideModal(false);
                }}
                className="flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-extrabold text-xs shadow-xl shadow-orange-600/25 transition hover:scale-[1.01] flex items-center justify-center gap-2"
              >
                <Sparkles size={16} />
                <span>Auto-Equip Optimal Offroad Setup (TITAN 68mm + Spikes + 4WD)</span>
              </button>

              <button
                onClick={() => setShowGuideModal(false)}
                className="py-3 px-5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= COMPLETED TIME TRIAL SCORECARD MODAL ================= */}
      {isCompleted && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 pointer-events-auto">
          <div className="w-full max-w-md rounded-3xl bg-[#111318] border border-white/20 p-6 sm:p-7 shadow-2xl space-y-5 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center text-white mx-auto shadow-xl shadow-emerald-500/30">
              <Flag size={32} />
            </div>

            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-emerald-400 font-bold">
                Checkered Flag
              </span>
              <h3 className="text-3xl font-black text-white mt-1">Trial Completed!</h3>
              <p className="text-xs text-gray-400 mt-1">
                You successfully crossed all 6 obstacles and reached the finish line.
              </p>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs text-left">
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
                <span className="text-[10px] uppercase font-mono text-gray-400">Gross Run Time</span>
                <div className="font-bold text-white font-mono text-base">
                  {(runState.lapTimeSec - runState.penaltiesSec).toFixed(1)}s
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
                <span className="text-[10px] uppercase font-mono text-gray-400">Cone Penalties</span>
                <div className="font-bold text-rose-400 font-mono text-base">
                  +{runState.penaltiesSec.toFixed(1)}s ({runState.conesHit} hit)
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-0.5 col-span-2">
                <span className="text-[10px] uppercase font-mono text-emerald-400 font-bold">Final Official Lap Time</span>
                <div className="font-black text-white font-mono text-2xl">
                  {runState.lapTimeSec.toFixed(1)}s
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={onRestartRun}
                className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <RotateCcw size={14} />
                <span>Retry Run</span>
              </button>

              <button
                onClick={onExitTrack}
                className="py-2.5 px-4 rounded-xl bg-orange-500 hover:from-orange-400 text-white text-xs font-bold transition shadow-lg shadow-orange-500/30 flex items-center justify-center gap-1.5"
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
