"use client";

import React, { useState, useEffect } from "react";
import {
  Wifi,
  BatteryCharging,
  Power,
  RotateCcw,
  Gauge,
  Sliders,
  ChevronDown,
  ChevronUp,
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
  const [batteryVoltage, setBatteryVoltage] = useState<number>(3.88);
  const [pingMs, setPingMs] = useState<number>(8);
  const [showThrustBar, setShowThrustBar] = useState<boolean>(true);

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

  const handleResetAttitude = () => {
    onControlChange({
      throttle: isArmed ? throttle : 1000,
      pitch: 0,
      roll: 0,
      yaw: 0,
    });
  };

  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 w-auto max-w-5xl px-3 pointer-events-auto">
      <div
        className={`rounded-2xl border backdrop-blur-xl shadow-2xl transition-all duration-300 ${
          isLight
            ? "bg-white/95 border-gray-200 text-gray-900 shadow-gray-400/20"
            : "bg-[#090b10]/95 border-white/10 text-white shadow-black/80"
        }`}
      >
        {/* ================= SLEEK PROFESSIONAL TELEMETRY HUD ================= */}
        <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 sm:gap-5">
          {/* 1. SoftAP WiFi Connection Status */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold">
              <Wifi size={13} className={isArmed ? "animate-pulse" : ""} />
              <span className="hidden md:inline">AERO_ESP32_DRONE</span>
              <span>192.168.4.1</span>
              <span className="text-[10px] text-emerald-500/70 font-normal ml-0.5">{pingMs}ms</span>
            </div>
          </div>

          {/* 2. Battery Telemetry */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <BatteryCharging
              size={15}
              className={batteryVoltage < 3.55 ? "text-red-400 animate-pulse" : "text-amber-400"}
            />
            <span
              className={`font-semibold ${
                batteryVoltage < 3.55 ? "text-red-400" : "text-amber-400"
              }`}
            >
              {batteryVoltage}V (1S)
            </span>
          </div>

          <div className="hidden sm:block h-3.5 w-px bg-white/10" />

          {/* 3. Motors Dynamic RPM Readout */}
          <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-300">
            <Gauge size={14} className={isArmed ? "text-cyan-400" : "text-neutral-500"} />
            <span className={isArmed ? "text-cyan-300 font-semibold" : "text-neutral-400"}>
              {isArmed
                ? `${Math.round(20000 + throttlePercent * 300)} RPM`
                : "0 RPM (STANDBY)"}
            </span>
          </div>

          <div className="hidden sm:block h-3.5 w-px bg-white/10" />

          {/* 4. IMU 6-DOF Attitude Readout with Clean Level Reset */}
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-300">
            <Compass size={13} className="text-neutral-400 shrink-0" />
            <div className="flex items-center gap-1.5">
              <span>P: <strong className="text-sky-400 font-semibold">{pitch}°</strong></span>
              <span>R: <strong className="text-emerald-400 font-semibold">{roll}°</strong></span>
              <span>Y: <strong className="text-amber-400 font-semibold">{yaw}°</strong></span>
            </div>
            <button
              onClick={handleResetAttitude}
              title="Reset Attitude to Level Hover (0°, 0°, 0°)"
              className="p-1 rounded-md bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white transition cursor-pointer"
            >
              <RotateCcw size={12} />
            </button>
          </div>

          <div className="hidden md:block h-3.5 w-px bg-white/10" />

          {/* 5. Master Arm / Disarm Action */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleArm}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider transition-all duration-200 uppercase flex items-center gap-2 shadow-lg cursor-pointer ${
                isArmed
                  ? "bg-red-600 hover:bg-red-500 text-white shadow-red-600/40 ring-2 ring-red-500/50"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30"
              }`}
            >
              <Power size={13} />
              <span>{isArmed ? "DISARM" : "ARM MOTORS"}</span>
            </button>
          </div>
        </div>

        {/* ================= OPTIONAL HORIZONTAL LINEAR THROTTLE SLIDER (ARMED STATE) ================= */}
        {isArmed && (
          <div className="px-4 py-2.5 border-t border-white/10 bg-black/30 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-[240px]">
              <div className="flex items-center gap-1.5 text-xs font-mono text-sky-400 font-semibold shrink-0">
                <Sliders size={13} />
                <span>Throttle:</span>
              </div>

              {/* Smooth Clean Horizontal Slider */}
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
                className="flex-1 h-1.5 bg-white/15 rounded-lg appearance-none cursor-pointer accent-[#FF6A1A]"
              />

              <span className="font-mono text-xs font-bold text-white bg-white/10 px-2 py-0.5 rounded border border-white/10 shrink-0">
                {throttlePercent}% ({throttle} µs)
              </span>
            </div>

            {/* Quick Presets (Spaced, Clean, Non-overlapping) */}
            <div className="flex items-center gap-1.5 text-[11px] font-mono shrink-0">
              {[
                { label: "Idle", val: 1000 },
                { label: "Hover (45%)", val: 1450 },
                { label: "Full (100%)", val: 2000 },
              ].map((p) => (
                <button
                  key={p.label}
                  onClick={() =>
                    onControlChange({
                      throttle: p.val,
                      pitch,
                      roll,
                      yaw,
                    })
                  }
                  className={`px-2.5 py-1 rounded-md border text-[10px] font-semibold transition cursor-pointer ${
                    throttle === p.val
                      ? "bg-[#FF6A1A] text-white border-transparent shadow-sm"
                      : "bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ================= KEYBOARD FLIGHT ASSISTANT BAR ================= */}
        <div className="px-4 py-1.5 border-t border-white/5 bg-black/40 flex items-center justify-between text-[10px] font-mono text-neutral-400">
          <div className="flex items-center gap-3 flex-wrap">
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-neutral-200 font-semibold">W / S</kbd> Throttle
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-neutral-200 font-semibold">A / D</kbd> Yaw
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-neutral-200 font-semibold">↑ ↓ ← →</kbd> Pitch/Roll
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-neutral-200 font-semibold">Space</kbd> Arm/Disarm
            </span>
          </div>

          <div className="text-neutral-500 hidden lg:inline">
            Drag to Orbit 360° • Scroll to Zoom
          </div>
        </div>
      </div>
    </div>
  );
}
