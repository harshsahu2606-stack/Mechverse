"use client";

import React, { useState, useEffect } from "react";
import {
  Wifi,
  BatteryCharging,
  Power,
  RotateCcw,
  Zap,
  Activity,
  Sliders,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Gauge,
  Compass,
} from "lucide-react";
import { AppTheme } from "@/types/machine";

interface Esp32FlightDockProps {
  theme?: AppTheme;
  isArmed: boolean;
  onToggleArm: () => void;
  throttle: number; // 1000 - 2000
  pitch: number;    // -25 to +25
  roll: number;     // -25 to +25
  yaw: number;      // -180 to +180
  onControlChange: (control: { throttle: number; pitch: number; roll: number; yaw: number }) => void;
}

export default function Esp32FlightDock({
  theme = "dark",
  isArmed,
  onToggleArm,
  throttle,
  pitch,
  roll,
  yaw,
  onControlChange,
}: Esp32FlightDockProps) {
  const isLight = theme === "light";
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [batteryVoltage, setBatteryVoltage] = useState<number>(3.84);
  const [pingMs, setPingMs] = useState<number>(8);

  const throttlePercent = Math.max(0, Math.min(100, Math.round(((throttle - 1000) / 1000) * 100)));

  // Dynamic telemetry simulation based on armed state & throttle
  useEffect(() => {
    if (!isArmed) {
      setBatteryVoltage(3.88);
      return;
    }

    const interval = setInterval(() => {
      const loadDrop = (throttlePercent / 100) * 0.22;
      const v = Math.max(3.42, 3.86 - loadDrop + (Math.random() * 0.02 - 0.01));
      setBatteryVoltage(parseFloat(v.toFixed(2)));
      setPingMs(Math.floor(7 + Math.random() * 4));
    }, 600);

    return () => clearInterval(interval);
  }, [isArmed, throttlePercent]);

  // Keyboard flight hook
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.code === "KeyW") {
        e.preventDefault();
        onControlChange({
          throttle: Math.min(2000, throttle + 50),
          pitch,
          roll,
          yaw,
        });
      } else if (e.code === "KeyS") {
        e.preventDefault();
        onControlChange({
          throttle: Math.max(1000, throttle - 50),
          pitch,
          roll,
          yaw,
        });
      } else if (e.code === "KeyA") {
        e.preventDefault();
        onControlChange({
          throttle,
          pitch,
          roll,
          yaw: Math.max(-180, yaw - 15),
        });
      } else if (e.code === "KeyD") {
        e.preventDefault();
        onControlChange({
          throttle,
          pitch,
          roll,
          yaw: Math.min(180, yaw + 15),
        });
      } else if (e.code === "ArrowUp") {
        e.preventDefault();
        onControlChange({
          throttle,
          pitch: Math.min(25, pitch + 5),
          roll,
          yaw,
        });
      } else if (e.code === "ArrowDown") {
        e.preventDefault();
        onControlChange({
          throttle,
          pitch: Math.max(-25, pitch - 5),
          roll,
          yaw,
        });
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        onControlChange({
          throttle,
          pitch,
          roll: Math.max(-25, roll - 5),
          yaw,
        });
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        onControlChange({
          throttle,
          pitch,
          roll: Math.min(25, roll + 5),
          yaw,
        });
      } else if (e.code === "Space") {
        e.preventDefault();
        onToggleArm();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [throttle, pitch, roll, yaw, onControlChange, onToggleArm]);

  return (
    <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 w-[96%] max-w-4xl pointer-events-auto transition-all duration-300">
      <div
        className={`rounded-2xl border backdrop-blur-xl shadow-2xl overflow-hidden transition-all duration-300 ${
          isLight
            ? "bg-white/95 border-gray-200 text-gray-900 shadow-gray-400/30"
            : "bg-[#090b10]/92 border-white/15 text-white shadow-black/80"
        }`}
      >
        {/* ================= PRIMARY TELEMETRY & MASTER HEADER BAR ================= */}
        <div className="px-4 py-2.5 flex items-center justify-between gap-3 border-b border-white/10 bg-black/20">
          {/* Left: SoftAP WiFi Telemetry */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
              <Wifi size={13} className={isArmed ? "animate-pulse" : ""} />
              <span className="hidden sm:inline">AERO_ESP32_DRONE</span>
              <span>192.168.4.1</span>
            </div>
            <span className="text-[11px] text-gray-400 font-mono hidden md:inline">
              {pingMs}ms
            </span>
          </div>

          {/* Center: Flight Dynamics Telemetry */}
          <div className="hidden sm:flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-gray-400">
              <BatteryCharging
                size={14}
                className={batteryVoltage < 3.55 ? "text-red-400" : "text-amber-400"}
              />
              <span
                className={`font-bold ${
                  batteryVoltage < 3.55 ? "text-red-400" : "text-amber-400"
                }`}
              >
                {batteryVoltage}V (1S)
              </span>
            </div>

            <div className="h-3.5 w-px bg-white/10" />

            <div className="flex items-center gap-1.5 text-gray-400">
              <Gauge size={14} className={isArmed ? "text-cyan-400" : "text-gray-500"} />
              <span className={isArmed ? "text-cyan-300 font-bold" : "text-gray-400"}>
                {isArmed
                  ? `${Math.round(20000 + throttlePercent * 300)} RPM`
                  : "0 RPM (STANDBY)"}
              </span>
            </div>

            <div className="h-3.5 w-px bg-white/10" />

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-gray-400">
                P: <strong className="text-sky-400">{pitch}°</strong> R:{" "}
                <strong className="text-emerald-400">{roll}°</strong> Y:{" "}
                <strong className="text-amber-400">{yaw}°</strong>
              </span>
              <button
                onClick={() =>
                  onControlChange({
                    throttle: isArmed ? throttle : 1000,
                    pitch: 0,
                    roll: 0,
                    yaw: 0,
                  })
                }
                title="Level Off / Zero Attitude"
                className="p-1 rounded-md bg-white/5 hover:bg-white/15 text-gray-300 transition"
              >
                <RotateCcw size={12} />
              </button>
            </div>
          </div>

          {/* Right: Master Arm & Dock Collapse Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleArm}
              className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-black tracking-wider transition-all uppercase flex items-center gap-1.5 shadow-md cursor-pointer ${
                isArmed
                  ? "bg-red-600 hover:bg-red-500 text-white shadow-red-600/40 animate-pulse ring-2 ring-red-500/50"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30"
              }`}
            >
              <Power size={13} />
              <span>{isArmed ? "DISARM MOTORS" : "ARM MOTORS"}</span>
            </button>

            <button
              onClick={() => setIsExpanded((prev) => !prev)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition"
              title={isExpanded ? "Collapse Controls Dock" : "Expand Controls Dock"}
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </button>
          </div>
        </div>

        {/* ================= EXPANDABLE CONTROLLER INTERACTION DOCK ================= */}
        {isExpanded && (
          <div className="p-3 sm:p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">
              {/* --- 1. THROTTLE DYNAMICS (5 Columns) --- */}
              <div
                className={`md:col-span-6 p-3 rounded-xl border flex flex-col gap-2 ${
                  isLight ? "bg-gray-50 border-gray-200" : "bg-white/[0.03] border-white/10"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-1.5 font-bold text-sky-400">
                    <Sliders size={13} />
                    <span>Vertical Throttle</span>
                  </div>
                  <span className="font-bold text-white bg-sky-500/20 px-2 py-0.5 rounded text-[11px] border border-sky-500/30">
                    {throttlePercent}% ({throttle} µs)
                  </span>
                </div>

                {/* Throttle Slider */}
                <input
                  type="range"
                  min="1000"
                  max="2000"
                  step="10"
                  value={throttle}
                  onChange={(e) =>
                    onControlChange({
                      throttle: parseInt(e.target.value, 10),
                      pitch,
                      roll,
                      yaw,
                    })
                  }
                  className="w-full accent-sky-400 h-2 bg-white/20 rounded-lg cursor-pointer"
                />

                {/* Throttle Presets */}
                <div className="grid grid-cols-4 gap-1.5 text-[10px] font-mono">
                  {[
                    { label: "0% Idle", val: 1000 },
                    { label: "45% Hover", val: 1450 },
                    { label: "75% Climb", val: 1750 },
                    { label: "100% Full", val: 2000 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() =>
                        onControlChange({
                          throttle: preset.val,
                          pitch,
                          roll,
                          yaw,
                        })
                      }
                      className={`py-1 rounded-lg border font-bold transition text-center ${
                        throttle === preset.val
                          ? "bg-sky-600 text-white border-sky-400"
                          : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* --- 2. ATTITUDE TRIM & STEERING D-PAD (6 Columns) --- */}
              <div
                className={`md:col-span-6 p-3 rounded-xl border flex items-center justify-between gap-3 ${
                  isLight ? "bg-gray-50 border-gray-200" : "bg-white/[0.03] border-white/10"
                }`}
              >
                {/* D-Pad Buttons for Pitch & Roll */}
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <span className="text-[10px] font-mono uppercase text-gray-400 font-bold mb-0.5">
                    Attitude Trim
                  </span>
                  <button
                    onClick={() =>
                      onControlChange({
                        throttle,
                        pitch: Math.min(25, pitch + 5),
                        roll,
                        yaw,
                      })
                    }
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white transition"
                    title="Pitch Forward (Arrow Up)"
                  >
                    <ArrowUp size={15} />
                  </button>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        onControlChange({
                          throttle,
                          pitch,
                          roll: Math.max(-25, roll - 5),
                          yaw,
                        })
                      }
                      className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white transition"
                      title="Roll Left (Arrow Left)"
                    >
                      <ArrowLeft size={15} />
                    </button>
                    <button
                      onClick={() =>
                        onControlChange({
                          throttle,
                          pitch: 0,
                          roll: 0,
                          yaw,
                        })
                      }
                      className="w-8 h-8 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-400 flex items-center justify-center text-[10px] font-bold font-mono transition"
                      title="Center Trim"
                    >
                      CTR
                    </button>
                    <button
                      onClick={() =>
                        onControlChange({
                          throttle,
                          pitch,
                          roll: Math.min(25, roll + 5),
                          yaw,
                        })
                      }
                      className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white transition"
                      title="Roll Right (Arrow Right)"
                    >
                      <ArrowRight size={15} />
                    </button>
                  </div>
                  <button
                    onClick={() =>
                      onControlChange({
                        throttle,
                        pitch: Math.max(-25, pitch - 5),
                        roll,
                        yaw,
                      })
                    }
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white transition"
                    title="Pitch Backward (Arrow Down)"
                  >
                    <ArrowDown size={15} />
                  </button>
                </div>

                {/* Yaw Steering Buttons */}
                <div className="flex-1 flex flex-col justify-between h-full gap-2 pl-2 border-l border-white/10">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-gray-400">Yaw Heading:</span>
                    <span className="font-bold text-amber-400">{yaw}°</span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() =>
                        onControlChange({
                          throttle,
                          pitch,
                          roll,
                          yaw: Math.max(-180, yaw - 30),
                        })
                      }
                      className="py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center gap-1 text-[11px] font-mono text-gray-300 hover:text-white transition"
                    >
                      <RotateCcw size={12} />
                      <span>-30° CCW</span>
                    </button>
                    <button
                      onClick={() =>
                        onControlChange({
                          throttle,
                          pitch,
                          roll,
                          yaw: Math.min(180, yaw + 30),
                        })
                      }
                      className="py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center gap-1 text-[11px] font-mono text-gray-300 hover:text-white transition"
                    >
                      <RotateCw size={12} />
                      <span>+30° CW</span>
                    </button>
                  </div>

                  {/* Level Off Button */}
                  <button
                    onClick={() =>
                      onControlChange({
                        throttle,
                        pitch: 0,
                        roll: 0,
                        yaw: 0,
                      })
                    }
                    className="w-full py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold flex items-center justify-center gap-1 transition"
                  >
                    <Compass size={11} />
                    <span>Reset to Level Hover</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Keyboard Shortcuts Hint Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/5 text-[10px] font-mono text-gray-400">
              <div className="flex items-center gap-3">
                <span>
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-bold">W / S</kbd> Throttle
                </span>
                <span>
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-bold">A / D</kbd> Yaw
                </span>
                <span>
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-bold">↑ ↓ ← →</kbd> Pitch/Roll
                </span>
                <span>
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-bold">Space</kbd> Arm/Disarm
                </span>
              </div>
              <div className="text-gray-500 italic hidden lg:inline">
                Drag on canvas to orbit 360° • Scroll to zoom
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
