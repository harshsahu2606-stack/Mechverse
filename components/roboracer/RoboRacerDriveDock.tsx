"use client";

import React, { useState, useEffect } from "react";
import {
  Car,
  Camera,
  Radio,
  Zap,
  Power,
  Layers,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Gauge,
  Compass,
  Sliders,
  ShieldAlert,
} from "lucide-react";
import { AppTheme } from "@/types/machine";

interface RoboRacerDriveDockProps {
  theme?: AppTheme;
  isDriving: boolean;
  onToggleDrive: () => void;
  speed: number;
  steering: number;
  cameraPan: number;
  hoodOpen: boolean;
  onToggleHood: () => void;
  onControlChange: (control: { speed: number; steering: number; cameraPan: number }) => void;
}

export default function RoboRacerDriveDock({
  theme = "dark",
  isDriving,
  onToggleDrive,
  speed,
  steering,
  cameraPan,
  hoodOpen,
  onToggleHood,
  onControlChange,
}: RoboRacerDriveDockProps) {
  const isLight = theme === "light";
  const [driveMode, setDriveMode] = useState<"manual" | "obstacle" | "ai-track">("manual");
  const [batteryVoltage, setBatteryVoltage] = useState<number>(7.84);
  const [ultrasonicDistance, setUltrasonicDistance] = useState<number>(48);
  const [cameraFps, setCameraFps] = useState<number>(30);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // Autonomous Mode Simulation (Sonar reflex & AI Camera Sweeping)
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const deltaSec = (time - lastTime) / 1000;
      lastTime = time;

      if (isDriving) {
        // Battery voltage load simulation
        const load = (Math.abs(speed !== 0 ? speed : 50) / 100) * 0.22;
        setBatteryVoltage(Number((7.84 - load).toFixed(2)));

        if (driveMode === "obstacle") {
          // Sonar Reflex: Simulated distance pinging with obstacle reflex
          const simulatedDist = Math.round(45 + Math.sin(time / 600) * 32);
          setUltrasonicDistance(simulatedDist);

          if (simulatedDist < 25) {
            // Auto steer away from obstacle
            onControlChange({
              speed: 25,
              steering: simulatedDist % 2 === 0 ? 30 : -30,
              cameraPan,
            });
          }
        } else if (driveMode === "ai-track") {
          // AI Lane Track: Autonomous camera sweeping arc
          const autoPan = Math.round(Math.sin(time / 900) * 45);
          onControlChange({
            speed: speed !== 0 ? speed : 40,
            steering: Math.round(autoPan * 0.4),
            cameraPan: autoPan,
          });
        } else {
          setUltrasonicDistance(Math.round(48 + Math.sin(time / 1500) * 10));
        }
      } else {
        setBatteryVoltage(7.84);
        setUltrasonicDistance(48);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isDriving, driveMode, speed, cameraPan, onControlChange]);

  const handleResetControls = () => {
    onControlChange({ speed: 0, steering: 0, cameraPan: 0 });
  };

  return (
    <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 w-full max-w-4xl px-3 sm:px-4 pointer-events-auto">
      <div
        className={`rounded-2xl border backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] transition-all duration-300 overflow-hidden ${
          isLight
            ? "bg-white/95 border-slate-300 shadow-slate-400/20"
            : "bg-[#0b0e17]/95 border-white/15"
        }`}
      >
        {/* ================= COMPACT TELEMETRY & MASTER ACTION BAR ================= */}
        <div
          className={`px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2 border-b flex-wrap sm:flex-nowrap ${
            isLight ? "bg-slate-100/90 border-slate-200" : "bg-black/40 border-white/10"
          }`}
        >
          {/* Live Telemetry Chips */}
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar py-0.5 text-[10px] sm:text-xs font-mono font-semibold">
            {/* Battery */}
            <div className="flex items-center gap-1.5 text-amber-400 shrink-0">
              <Zap size={14} className="shrink-0" />
              <span>{batteryVoltage}V (2S)</span>
            </div>

            <span className="text-white/20 hidden sm:inline">•</span>

            {/* Ultrasonic Sensor */}
            <div
              className={`flex items-center gap-1.5 shrink-0 ${
                ultrasonicDistance < 25 ? "text-red-400 font-bold animate-pulse" : "text-emerald-400"
              }`}
            >
              <Radio size={14} className="shrink-0" />
              <span>
                {ultrasonicDistance}cm {ultrasonicDistance < 25 && "(!)"}
              </span>
            </div>

            <span className="text-white/20 hidden sm:inline">•</span>

            {/* Optical Vision */}
            <div className="flex items-center gap-1.5 text-sky-400 shrink-0">
              <Camera size={14} className="shrink-0" />
              <span>1080p @ {cameraFps}FPS</span>
            </div>

            <span className="text-white/20 hidden sm:inline">•</span>

            {/* Drivetrain Status */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span
                className={`w-2 h-2 rounded-full ${
                  isDriving ? "bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" : "bg-slate-500"
                }`}
              />
              <span className={isDriving ? "text-emerald-300 font-bold" : "text-slate-400"}>
                {isDriving ? "4WD ARMED" : "STANDBY"}
              </span>
            </div>
          </div>

          {/* Quick Actions & Master Drive Button */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-auto">
            {/* Hood (Dhakna) Toggle */}
            <button
              onClick={onToggleHood}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl border text-[11px] font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
                hoodOpen
                  ? "bg-amber-500/20 border-amber-500/60 text-amber-300 shadow-sm"
                  : isLight
                  ? "bg-slate-200 border-slate-300 text-slate-700"
                  : "bg-white/5 border-white/10 text-slate-300 hover:text-white hover:border-white/25"
              }`}
              title="Toggle Gullwing Hood (Dhakna) open or closed in 3D"
            >
              <Layers size={13} />
              <span>{hoodOpen ? "Close Dhakna" : "Open Dhakna"}</span>
            </button>

            {/* Master ENGAGE 4WD Button */}
            <button
              onClick={onToggleDrive}
              className={`px-3.5 sm:px-4 py-1.5 rounded-xl font-mono font-bold text-xs shadow-lg transition flex items-center gap-1.5 cursor-pointer ${
                isDriving
                  ? "bg-red-600 hover:bg-red-500 text-white shadow-red-600/30 animate-pulse"
                  : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black shadow-amber-500/30"
              }`}
            >
              <Power size={13} />
              <span>{isDriving ? "DISARM 4WD" : "ENGAGE 4WD"}</span>
            </button>

            {/* Minimize / Expand Toggle */}
            <button
              onClick={() => setIsExpanded((prev) => !prev)}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition cursor-pointer"
              aria-label={isExpanded ? "Collapse Drive Deck" : "Expand Drive Deck"}
            >
              {isExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </button>
          </div>
        </div>

        {/* ================= EXPANDABLE SLIDERS & MODE DOCK ================= */}
        {isExpanded && (
          <div className="p-3 sm:p-4 space-y-3">
            {/* Mode Selector & Quick Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 text-xs font-mono">
                <span className="text-[10px] text-slate-400 px-2 uppercase font-semibold">Mode:</span>
                {(
                  [
                    { id: "manual", label: "Manual 4WD" },
                    { id: "obstacle", label: "Sonar Reflex (Auto Avoid)" },
                    { id: "ai-track", label: "AI Lane Track (Auto Scan)" },
                  ] as const
                ).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setDriveMode(m.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      driveMode === m.id
                        ? "bg-amber-500 text-black shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Reset Controls Button */}
              <button
                onClick={handleResetControls}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-slate-400 hover:text-white flex items-center gap-1.5 transition cursor-pointer"
                title="Center throttle, steering, and camera pan"
              >
                <RotateCcw size={12} />
                <span>Zero Trim</span>
              </button>
            </div>

            {/* Responsive 3-Slider Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3">
              {/* 1. Throttle & Reverse */}
              <div
                className={`p-2.5 rounded-xl border space-y-1.5 ${
                  isLight ? "bg-slate-50 border-slate-200" : "bg-[#111726]/70 border-white/10"
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5 font-mono">
                    <Gauge size={13} className="text-amber-400" />
                    Throttle & Reverse
                  </span>
                  <span className="font-mono font-bold text-amber-400">{speed}%</span>
                </div>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  step="5"
                  value={speed}
                  onChange={(e) =>
                    onControlChange({
                      speed: parseInt(e.target.value),
                      steering,
                      cameraPan,
                    })
                  }
                  className="w-full accent-amber-500 cursor-pointer h-1.5 bg-white/10 rounded-lg"
                />
                <div className="flex justify-between text-[9px] font-mono text-slate-500">
                  <span>-100% (Rev)</span>
                  <span>0 (Stop)</span>
                  <span>+100% (Fwd)</span>
                </div>
              </div>

              {/* 2. Skid-Steering Yaw */}
              <div
                className={`p-2.5 rounded-xl border space-y-1.5 ${
                  isLight ? "bg-slate-50 border-slate-200" : "bg-[#111726]/70 border-white/10"
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5 font-mono">
                    <Compass size={13} className="text-orange-400" />
                    Skid-Steer Steering
                  </span>
                  <span className="font-mono font-bold text-orange-400">{steering}°</span>
                </div>
                <input
                  type="range"
                  min="-45"
                  max="45"
                  step="5"
                  value={steering}
                  onChange={(e) =>
                    onControlChange({
                      speed,
                      steering: parseInt(e.target.value),
                      cameraPan,
                    })
                  }
                  className="w-full accent-orange-500 cursor-pointer h-1.5 bg-white/10 rounded-lg"
                />
                <div className="flex justify-between text-[9px] font-mono text-slate-500">
                  <span>Left (-45°)</span>
                  <span>Neutral (0°)</span>
                  <span>Right (+45°)</span>
                </div>
              </div>

              {/* 3. Hikvision Camera Pan */}
              <div
                className={`p-2.5 rounded-xl border space-y-1.5 ${
                  isLight ? "bg-slate-50 border-slate-200" : "bg-[#111726]/70 border-white/10"
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5 font-mono">
                    <Camera size={13} className="text-sky-400" />
                    Hikvision Pan Servo
                  </span>
                  <span className="font-mono font-bold text-sky-400">{cameraPan}°</span>
                </div>
                <input
                  type="range"
                  min="-90"
                  max="90"
                  step="5"
                  value={cameraPan}
                  onChange={(e) =>
                    onControlChange({
                      speed,
                      steering,
                      cameraPan: parseInt(e.target.value),
                    })
                  }
                  className="w-full accent-sky-500 cursor-pointer h-1.5 bg-white/10 rounded-lg"
                />
                <div className="flex justify-between text-[9px] font-mono text-slate-500">
                  <span>Left (-90°)</span>
                  <span>Center (0°)</span>
                  <span>Right (+90°)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
