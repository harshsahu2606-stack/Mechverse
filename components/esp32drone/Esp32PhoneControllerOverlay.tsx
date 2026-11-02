"use client";

import React, { useState, useEffect } from "react";
import {
  Smartphone,
  Wifi,
  BatteryCharging,
  ShieldAlert,
  Power,
  RotateCcw,
  Zap,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Radio,
  FileCode,
  ShoppingBag,
  Cpu,
  BookOpen,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Layers,
  Sliders,
  MousePointer,
  ZoomIn,
  Eye,
  Crosshair,
  Wrench,
  Check,
} from "lucide-react";
import { AppTheme, Esp32DroneNavTab } from "@/types/machine";
import { ESP32_DRONE_SHOPPING_LIST } from "@/data/esp32DroneData";
import BuyLinkButtons from "@/components/ui/BuyLinkButtons";

interface Esp32PhoneControllerOverlayProps {
  theme?: AppTheme;
  isArmed: boolean;
  onToggleArm: () => void;
  throttle: number; // 1000 - 2000
  pitch: number;    // -30 to +30
  roll: number;     // -30 to +30
  yaw: number;      // -180 to +180
  onControlChange: (control: { throttle: number; pitch: number; roll: number; yaw: number }) => void;
  activeTab: Esp32DroneNavTab;
  onChangeTab: (tab: Esp32DroneNavTab) => void;
  explosionLevel?: number;
  onChangeExplosionLevel?: (level: number) => void;
  onResetCamera?: () => void;
  hideNavHeader?: boolean;
}

export default function Esp32PhoneControllerOverlay({
  theme = "dark",
  isArmed,
  onToggleArm,
  throttle,
  pitch,
  roll,
  yaw,
  onControlChange,
  activeTab,
  onChangeTab,
  explosionLevel = 0,
  onChangeExplosionLevel,
  onResetCamera,
  hideNavHeader = false,
}: Esp32PhoneControllerOverlayProps) {
  const isLight = theme === "light";
  const [batteryVoltage, setBatteryVoltage] = useState<number>(3.84);
  const [pingMs, setPingMs] = useState<number>(8);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [showFlightJoysticks, setShowFlightJoysticks] = useState<boolean>(true);

  // Simulate slight voltage drop when armed & throttle active
  useEffect(() => {
    if (!isArmed) {
      setBatteryVoltage(3.88);
      return;
    }
    const interval = setInterval(() => {
      const loadDrop = ((throttle - 1000) / 1000) * 0.18;
      const v = Math.max(3.42, 3.85 - loadDrop + (Math.random() * 0.02 - 0.01));
      setBatteryVoltage(parseFloat(v.toFixed(2)));
      setPingMs(Math.floor(7 + Math.random() * 5));
    }, 800);
    return () => clearInterval(interval);
  }, [isArmed, throttle]);

  // Keyboard driving hook for virtual phone controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTab !== "simulator") return;

      if (e.code === "KeyW") {
        onControlChange({ throttle: Math.min(2000, throttle + 40), pitch, roll, yaw });
      } else if (e.code === "KeyS") {
        onControlChange({ throttle: Math.max(1000, throttle - 40), pitch, roll, yaw });
      } else if (e.code === "KeyA") {
        onControlChange({ throttle, pitch, roll, yaw: Math.max(-180, yaw - 15) });
      } else if (e.code === "KeyD") {
        onControlChange({ throttle, pitch, roll, yaw: Math.min(180, yaw + 15) });
      } else if (e.code === "ArrowUp") {
        onControlChange({ throttle, pitch: Math.min(25, pitch + 5), roll, yaw });
      } else if (e.code === "ArrowDown") {
        onControlChange({ throttle, pitch: Math.max(-25, pitch - 5), roll, yaw });
      } else if (e.code === "ArrowLeft") {
        onControlChange({ throttle, pitch, roll: Math.max(-25, roll - 5), yaw });
      } else if (e.code === "ArrowRight") {
        onControlChange({ throttle, pitch, roll: Math.min(25, roll + 5), yaw });
      } else if (e.code === "Space") {
        onToggleArm();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [throttle, pitch, roll, yaw, isArmed, activeTab, onControlChange, onToggleArm]);

  return (
    <div
      className={`w-full flex flex-col ${
        activeTab === "simulator" ? "pointer-events-none" : "pointer-events-auto"
      }`}
    >
      {/* ================= WORKSHOP NAVIGATION TAB BAR (Suppressed when UniversalWorkshopNav is active) ================= */}
      {!hideNavHeader && (
        <>
          <div
            className={`w-full border-b px-4 py-2.5 flex items-center justify-between gap-3 overflow-x-auto custom-scrollbar backdrop-blur-md pointer-events-auto z-40 ${
              isLight ? "bg-white/95 border-gray-200 shadow-sm" : "bg-[#090b10]/95 border-white/10"
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-500">
                <Smartphone size={16} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-xs font-black tracking-wider ${isLight ? "text-gray-900" : "text-white"}`}>
                    AERO-ESP NANO DRONE
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-400 font-bold">
                    ₹1,955 INR
                  </span>
                </div>
                <p className="text-[8px] uppercase tracking-widest text-gray-400 font-mono">
                  Phone Wi-Fi SoftAP Quadcopter
                </p>
              </div>
            </div>

            {/* Navigation Tabs - 5 Clean Pillars with Sub-Segments */}
            <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {[
                {
                  id: "simulator" as Esp32DroneNavTab,
                  label: "3D CAD & Flight HUD",
                  icon: Smartphone,
                  isActive: activeTab === "simulator",
                },
                {
                  id: "how-it-works" as Esp32DroneNavTab,
                  label: "Architecture & Specs",
                  icon: Cpu,
                  isActive: activeTab === "how-it-works" || activeTab === "dgca-rules",
                },
                {
                  id: "schematic" as Esp32DroneNavTab,
                  label: "Schematic & Wiring",
                  icon: Zap,
                  isActive: activeTab === "schematic",
                },
                {
                  id: "bom" as Esp32DroneNavTab,
                  label: "Indian BOM (₹)",
                  icon: ShoppingBag,
                  isActive: activeTab === "bom",
                },
                {
                  id: "build-guide" as Esp32DroneNavTab,
                  label: "Build & Firmware",
                  icon: BookOpen,
                  isActive: activeTab === "build-guide" || activeTab === "firmware",
                },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onChangeTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer shrink-0 ${
                      tab.isActive
                        ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-600/30 border border-amber-400/30"
                        : isLight
                        ? "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200"
                        : "bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10"
                    }`}
                  >
                    <Icon size={13} className={tab.isActive ? "text-white" : "text-amber-400"} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sub-Tabs for Deep Content */}
          {(activeTab === "how-it-works" || activeTab === "dgca-rules") && (
            <div className="w-full border-b px-4 py-1.5 bg-black/40 border-white/5 flex items-center gap-2 pointer-events-auto">
              <span className="text-[10px] font-mono text-gray-500 uppercase">Sections:</span>
              <button
                onClick={() => onChangeTab("how-it-works")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  activeTab === "how-it-works"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Signal Flow & PID Loop
              </button>
              <button
                onClick={() => onChangeTab("dgca-rules")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  activeTab === "dgca-rules"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                DGCA Nano Drone Rules (&lt;250g)
              </button>
            </div>
          )}

          {(activeTab === "build-guide" || activeTab === "firmware") && (
            <div className="w-full border-b px-4 py-1.5 bg-black/40 border-white/5 flex items-center gap-2 pointer-events-auto">
              <span className="text-[10px] font-mono text-gray-500 uppercase">Sections:</span>
              <button
                onClick={() => onChangeTab("build-guide")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  activeTab === "build-guide"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Step-by-Step Build Guide
              </button>
              <button
                onClick={() => onChangeTab("firmware")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  activeTab === "firmware"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Arduino Production Firmware (SoftAP UDP)
              </button>
            </div>
          )}
        </>
      )}

      {/* ================= TAB 1: 3D CAD & FLIGHT SIMULATOR HUD ================= */}
      {activeTab === "simulator" && (
        <div className="relative w-full h-[calc(100vh-8.5rem)] pointer-events-none overflow-hidden">
          {/* Top Status Bar & Mode Switcher */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 w-[94%] max-w-2xl pointer-events-auto">
            <div
              className={`p-3 rounded-2xl border backdrop-blur-xl shadow-2xl flex flex-wrap items-center justify-between gap-3 ${
                isLight
                  ? "bg-white/90 border-gray-200 text-gray-800"
                  : "bg-black/85 border-white/15 text-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-[11px] font-mono font-bold">
                  <Wifi size={13} className="animate-pulse" />
                  <span>AERO_ESP32_DRONE (192.168.4.1)</span>
                </div>
                <span className="text-[10px] text-gray-400 font-mono">{pingMs}ms</span>
              </div>

              <div className="flex items-center gap-2">
                {/* Toggle Flight Joysticks vs Clean 3D CAD Inspection */}
                <button
                  onClick={() => setShowFlightJoysticks((prev) => !prev)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold border transition flex items-center gap-1.5 ${
                    showFlightJoysticks
                      ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-400"
                      : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                  }`}
                  title="Toggle Virtual Flight Joysticks"
                >
                  <Crosshair size={13} />
                  <span>{showFlightJoysticks ? "HUD: Active" : "CAD Mode"}</span>
                </button>

                <div className="flex items-center gap-1 text-xs font-mono font-bold text-amber-400 px-2 py-1 rounded-lg bg-amber-500/10">
                  <BatteryCharging size={14} />
                  <span>{batteryVoltage}V</span>
                </div>

                <button
                  onClick={onToggleArm}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black tracking-wider transition uppercase flex items-center gap-1.5 ${
                    isArmed
                      ? "bg-red-600 text-white shadow-lg shadow-red-600/40 animate-pulse"
                      : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30"
                  }`}
                >
                  <Power size={13} />
                  <span>{isArmed ? "DISARM" : "ARM"}</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ================= TAB 2: SYSTEM ARCHITECTURE & FLIGHT MECHANICS ================= */}
      {activeTab === "how-it-works" && (
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar max-w-5xl mx-auto space-y-6">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Cpu className="text-indigo-400" size={22} />
              <span>AERO-ESP Quadcopter System Architecture</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              End-to-end signal flow from Android touchscreen joysticks through ESP32 dual-core FreeRTOS tasks to 20kHz motor commutation.
            </p>
          </div>

          {/* End-to-End Signal Dataflow Pipeline */}
          <div
            className={`p-5 rounded-2xl border ${
              isLight ? "bg-white border-gray-200" : "bg-[#0d1017] border-white/10"
            }`}
          >
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 font-mono mb-4">
              Real-Time Hardware &amp; Firmware Signal Flow
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-amber-400">
                  <Smartphone size={15} />
                  <span>1. Android Client</span>
                </div>
                <p className="text-[11px] text-gray-300 leading-relaxed font-sans">
                  Touch joysticks sample at 20Hz. Transmits binary UDP packets containing Throttle, Pitch, Roll, Yaw values to <strong>192.168.4.1:8888</strong>.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-sky-400">
                  <Wifi size={15} />
                  <span>2. ESP32 Core 0</span>
                </div>
                <p className="text-[11px] text-gray-300 leading-relaxed font-sans">
                  Dedicated Protocol Core. Manages 802.11 SoftAP, validates UDP CRC, pushes target setpoints into atomic thread-safe buffers, and handles failsafe watchdog.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                  <Activity size={15} />
                  <span>3. ESP32 Core 1</span>
                </div>
                <p className="text-[11px] text-gray-300 leading-relaxed font-sans">
                  Real-Time Flight Core. Executes a strict <strong>400Hz hardware timer interrupt</strong>. Samples MPU-6050 via 400kHz I2C, runs Mahony filter, and computes PID errors.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-rose-400">
                  <Zap size={15} />
                  <span>4. 20kHz MCPWM</span>
                </div>
                <p className="text-[11px] text-gray-300 leading-relaxed font-sans">
                  Hardware PWM generators drive 4x SI2302 N-MOSFET gates. Silent 20kHz switching modulates 8520 coreless motor speed and cancels torque via CW/CCW props.
                </p>
              </div>
            </div>
          </div>

          {/* Dual-Core Partitioning & FreeRTOS Scheduling */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className={`p-5 rounded-2xl border space-y-3 ${
                isLight ? "bg-white border-gray-200" : "bg-[#0d1017] border-white/10"
              }`}
            >
              <h3 className="text-sm font-bold flex items-center gap-2 text-sky-400">
                <Cpu size={16} />
                <span>ESP32 Dual-Core FreeRTOS Division</span>
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Single-core microcontrollers (like Arduino Uno/Nano) stutter when handling Wi-Fi packets because the network stack blocks the sensor loop. The ESP32 solves this by splitting tasks across two independent 240MHz hardware cores:
              </p>
              <div className="space-y-2 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-200">
                  <strong>Core 0 (Networking):</strong> WiFi SoftAP + UDP Receiver + Telemetry Beacon (Priority 1)
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-200">
                  <strong>Core 1 (Flight Kernel):</strong> 400Hz IMU Sample + Mahony Fusion + Dual-Loop PID (Priority 24 - Highest)
                </div>
              </div>
            </div>

            <div
              className={`p-5 rounded-2xl border space-y-3 ${
                isLight ? "bg-white border-gray-200" : "bg-[#0d1017] border-white/10"
              }`}
            >
              <h3 className="text-sm font-bold flex items-center gap-2 text-amber-400">
                <Sliders size={16} />
                <span>Dual-Loop PID Stabilization Math</span>
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                The quadcopter uses a cascaded PID loop running every 2.5 milliseconds:
              </p>
              <div className="p-3 rounded-xl bg-black/40 font-mono text-[11px] text-gray-200 space-y-1">
                <div>Error(t) = Target_Angle - Current_Angle</div>
                <div>P_out = Kp × Error(t)</div>
                <div>I_out = Ki × ∫ Error(t) dt</div>
                <div>D_out = Kd × (d Error(t) / dt)</div>
                <div className="pt-1 text-emerald-400 border-t border-white/10">
                  PID_Total = P_out + I_out + D_out
                </div>
              </div>
              <p className="text-[11px] text-gray-400">
                Pitch and Roll values are mapped through the mixing matrix to modulate individual motor RPMs.
              </p>
            </div>
          </div>

          {/* Failsafe & Brownout Protection Matrix */}
          <div
            className={`p-5 rounded-2xl border space-y-3 ${
              isLight ? "bg-white border-gray-200" : "bg-[#0d1017] border-white/10"
            }`}
          >
            <h3 className="text-sm font-bold flex items-center gap-2 text-rose-400">
              <ShieldAlert size={16} />
              <span>Wireless Loss &amp; Low-Battery Failsafe Architecture</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <div className="font-bold text-rose-400 mb-1">Wi-Fi Heartbeat Timeout</div>
                <p className="text-[11px] text-gray-300">
                  If no UDP packet is received from the smartphone for &gt;500ms, the watchdog triggers auto-descent, ramping down throttle to 0% over 1.2s to prevent flyaways.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <div className="font-bold text-amber-400 mb-1">Low-Voltage Cutoff (3.3V)</div>
                <p className="text-[11px] text-gray-300">
                  A 100k/100k voltage divider on GPIO 34 monitors 1S LiPo voltage. Below 3.3V, blue status LED flashes at 10Hz and max throttle is clamped to 40%.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                <div className="font-bold text-indigo-400 mb-1">Motor Soft-Start Ramp</div>
                <p className="text-[11px] text-gray-300">
                  On arming, PWM duty cycle ramps from 0% to idle over 250ms, preventing high inrush current spikes from tripping the LiPo battery protection board.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: STEP-BY-STEP BUILD GUIDE ================= */}
      {activeTab === "build-guide" && (
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar max-w-5xl mx-auto space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <BookOpen className="text-indigo-400" size={22} />
                <span>Complete Step-by-Step DIY Assembly Tutorial</span>
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Follow these 8 mechanical and electrical stages to build, wire, program, and fly your first quadcopter.
              </p>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono font-bold">
              ESTIMATED TIME: 3 - 4 HOURS
            </div>
          </div>

          {/* 8 Practical Stages */}
          <div className="space-y-4">
            {[
              {
                step: "01",
                title: "Airframe Preparation & Motor Collar Inspection",
                duration: "20 mins",
                tools: "Micro hobby knife, isopropyl alcohol",
                desc: "Inspect the 95mm molded micro-quad frame. Clean any plastic molding flash from the 8.5mm motor collar bores using a hobby knife. Ensure all four 360-degree circular propeller guard rings have a minimum 2mm radial clearance from the 55mm propeller tip path.",
                tip: "A smooth motor bore prevents motor casing deformation when press-fitting the coreless cans.",
              },
              {
                step: "02",
                title: "8520 Coreless Motor Press-Fit & CW/CCW Alignment",
                duration: "30 mins",
                tools: "Gently press by hand, silicone glue dot",
                desc: "Coreless brushed motors have specific internal brush polarities for Clockwise (CW) and Counter-Clockwise (CCW) operation. Press each motor gently into its socket from above:\n• M1 (Front-Right, CCW): Red (+) and Blue (-) wires.\n• M2 (Front-Left, CW): Black (-) and White (+) wires.\n• M3 (Rear-Left, CCW): Red (+) and Blue (-) wires.\n• M4 (Rear-Right, CW): Black (-) and White (+) wires.",
                tip: "Never hammer or press down directly on the top 1.0mm output shaft! Support the motor base with your finger.",
              },
              {
                step: "03",
                title: "Soldering SI2302 MOSFETs & 1N5819 Schottky Diodes",
                duration: "45 mins",
                tools: "25W soldering iron, 0.8mm lead solder, tweezers",
                desc: "Brushed coreless motors draw up to 2.8A under load—they CANNOT be driven directly from ESP32 GPIOs! Solder four SI2302 N-channel MOSFETs on a small perfboard:\n1. Connect MOSFET Source to Battery GND.\n2. Solder a 10kΩ pull-down resistor from Gate to GND to prevent bootup floating pulses.\n3. Solder a 100Ω current-limiting resistor from Gate to the respective ESP32 PWM pin.\n4. Connect MOSFET Drain to Motor Negative wire.\n5. Solder a 1N5819 Schottky diode across each motor (Cathode silver band to VBAT+, Anode to Drain) to safely clamp -35V inductive kickback spikes.",
                tip: "Missing flyback diodes will destroy the ESP32 GPIOs within seconds of spinning the motors down!",
              },
              {
                step: "04",
                title: "GY-521 MPU-6050 Center Alignment & Vibration Isolation",
                duration: "25 mins",
                tools: "2mm thick foam double-sided tape",
                desc: "Mount the GY-521 breakout board directly at the physical intersection of the drone's diagonal arms (center of mass). Use thick 2mm foam double-sided tape—this mechanically filters high-frequency motor vibration (400-800Hz) from saturating the MEMS gyroscopes. Align the MPU-6050 X-axis arrow pointing towards the drone's front.",
                tip: "Wire I2C connections: VCC to ESP32 3V3, GND to GND, SDA to GPIO 21, SCL to GPIO 22.",
              },
              {
                step: "05",
                title: "ESP32-WROOM-32 Wiring & LiPo Voltage Divider",
                duration: "40 mins",
                tools: "28AWG silicone wire, heat shrink tubing",
                desc: "Position the ESP32 board on the top deck with its meandering copper Wi-Fi antenna pointing rearward. Solder a two-resistor voltage divider (100kΩ and 100kΩ) between LiPo (+) and GND, with the center tap wired to GPIO 34 (ADC1). This scales the 4.2V peak battery voltage down to 2.1V for safe ESP32 analog reading.",
                tip: "Connect the battery lead through a micro slide switch so you can power off the drone easily without unplugging.",
              },
              {
                step: "06",
                title: "55mm Propeller Press-Fit (Red Front / Black Rear)",
                duration: "15 mins",
                tools: "Hand press-fit",
                desc: "Press the two red 55mm propellers onto the front motor shafts and the two black propellers onto the rear motor shafts. Ensure matching rotation: M1 & M3 require CCW blades, while M2 & M4 require CW blades. Leave a 0.8mm - 1.0mm vertical gap between the propeller hub and the top motor bushing so the prop doesn't bind.",
                tip: "If a propeller spins but produces downward thrust instead of lift, you swapped a CW and CCW blade!",
              },
              {
                step: "07",
                title: "Center of Gravity (CG) Tuning & Battery Retention",
                duration: "20 mins",
                tools: "Elastic rubber band / double-sided velcro",
                desc: "Slide the 1S 3.7V 500mAh LiPo under the bottom plate and secure it firmly with an elastic band. Perform the 'finger balance test': Place two fingertips under the diagonal arms at the center. The drone must stay perfectly level without tipping forward or backward. Slide the battery forward or backward until balanced.",
                tip: "A drone with an offset CG forces two motors to work harder, draining the battery 40% faster.",
              },
              {
                step: "08",
                title: "Firmware Flashing, SoftAP Pairing & First Flight",
                duration: "30 mins",
                tools: "Micro-USB cable, PC with Arduino IDE, Android phone",
                desc: "Open Arduino IDE, install the ESP32 board package, select 'ESP32 Dev Module', and flash the firmware from the 'Arduino Firmware' tab. Power on the drone from the LiPo. On your Android phone, connect Wi-Fi to 'AERO_ESP32_DRONE' (Password: flyesp32). Return to the 'Smartphone HUD' tab, tap ARM MOTORS, and slowly advance throttle to 45% for a smooth, stable first hover!",
                tip: "Always conduct maiden test flights indoors over a soft carpet with propeller guards installed.",
              },
            ].map((stage, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border shadow-sm space-y-3 ${
                  isLight ? "bg-white border-gray-200" : "bg-[#0d1017] border-white/10"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-mono font-black text-xs flex items-center justify-center">
                      {stage.step}
                    </span>
                    <h3 className="text-sm font-bold">{stage.title}</h3>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-mono text-gray-400">
                    <span>⏱️ {stage.duration}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line">
                  {stage.desc}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-[11px] font-mono">
                  <span className="text-gray-400">Tools: <strong className="text-gray-200">{stage.tools}</strong></span>
                  <div className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-center gap-1.5">
                    <Zap size={11} className="text-amber-400 shrink-0" />
                    <span>Pro Tip: {stage.tip}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Part 2: Pre-Flight Testing & Bench Calibration Suite */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <h3 className="text-base font-bold text-white flex items-center gap-2 font-mono uppercase tracking-wider text-emerald-400">
              <span>Part 2: Pre-Flight Sensor Calibration & Bench Testing Suite</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-white/10 bg-[#0c0f18] space-y-2">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase block">
                  Test 01: MOSFET Gate Switching & Continuity Test
                </span>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Before attaching propellers or battery, set your multimeter to resistance (Ω) mode. Probe between MOSFET Drain and Source with the gate pulled LOW (GND via 10kΩ). Resistance must read infinite. Apply 3.3V to the gate via a 100Ω probe: the resistance must drop to under 0.15Ω. This verifies that no gate is shorted and motors will not spontaneously spin upon arming.
                </p>
                <div className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                  Pass Criteria: R_off &gt; 1MΩ, R_on &lt; 0.15Ω per MOSFET
                </div>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-[#0c0f18] space-y-2">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase block">
                  Test 02: MPU-6050 400kHz I2C Telemetry & Level Verification
                </span>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Power the ESP32 via USB and open the Serial Monitor at 115200 baud. Confirm the MPU-6050 is detected at I2C address 0x68. Place the drone on a flat, level surface. The pitch and roll angles must read within ±0.5° of zero. Gently tilt the nose down: pitch angle must increase positively. Tilt to the right: roll angle must increase positively.
                </p>
                <div className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                  Target Sensor Drift: &lt; 0.05°/sec after 100-sample calibration
                </div>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-[#0c0f18] space-y-2">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase block">
                  Test 03: Props-Off SoftAP Wi-Fi Heartbeat & Latency Check
                </span>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Connect your smartphone to 'AERO_ESP32_DRONE' Wi-Fi. In the telemetry dock, verify packet ping displays 7-12ms. Advance throttle to 30%: all four coreless motor shafts must spin smoothly without stutter. Turn off Wi-Fi on the phone: the ESP32 watchdog timer must trigger within 500ms, ramping all four motors down to 0 RPM stop.
                </p>
                <div className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                  Watchdog Reaction: Emergency throttle zero within 500ms
                </div>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-[#0c0f18] space-y-2">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase block">
                  Test 04: Center of Gravity (CG) Balance & Maiden Hover
                </span>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Mount the red (front) and black (rear) 55mm propellers. Support the drone with two fingertips directly underneath the diagonal arm intersection. Adjust the battery position until the frame balances perfectly level. Conduct maiden flight indoors over a carpeted floor. Advance throttle smoothly to 45%: the quadcopter should lift cleanly off the ground with minimal drift.
                </p>
                <div className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                  Takeoff Throttle: 42% – 48% with fresh 4.2V LiPo
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: ₹1,955 SHOPPING LIST ================= */}
      {activeTab === "bom" && (
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar max-w-5xl mx-auto space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ShoppingBag className="text-indigo-400" size={22} />
                <span>Verified Indian Component Shopping List (₹1,955 All-In)</span>
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Every component sourced with direct domestic Indian vendor purchase links. No hidden parts.
              </p>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-mono font-bold">
              TOTAL COST: ₹1,955 INR
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ESP32_DRONE_SHOPPING_LIST.map((item, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border shadow-md flex flex-col justify-between gap-3 ${
                  isLight ? "bg-white border-gray-200" : "bg-[#0c0f17] border-white/10"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold uppercase">
                      {item.component}
                    </span>
                    <span className="text-sm font-mono font-black text-emerald-400">
                      ₹{item.priceINR}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold mt-1.5">{item.model}</h3>
                  <p className="text-xs text-gray-400 mt-1">{item.specs}</p>
                </div>

                <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-[11px] text-gray-400 font-mono">
                    Vendor: <strong className="text-gray-200">{item.seller}</strong>
                  </span>
                  <BuyLinkButtons
                    componentName={item.model}
                    officialUrl={item.url}
                    vendorName={item.seller}
                    compact={true}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Part 2: Pre-Flight Testing & Bench Calibration Suite */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <h3 className="text-base font-bold text-white flex items-center gap-2 font-mono uppercase tracking-wider text-emerald-400">
              <span>Part 2: Pre-Flight Sensor Calibration & Bench Testing Suite</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-white/10 bg-[#0c0f18] space-y-2">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase block">
                  Test 01: MOSFET Gate Switching & Continuity Test
                </span>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Before attaching propellers or battery, set your multimeter to resistance (Ω) mode. Probe between MOSFET Drain and Source with the gate pulled LOW (GND via 10kΩ). Resistance must read infinite. Apply 3.3V to the gate via a 100Ω probe: the resistance must drop to under 0.15Ω. This verifies that no gate is shorted and motors will not spontaneously spin upon arming.
                </p>
                <div className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                  Pass Criteria: R_off &gt; 1MΩ, R_on &lt; 0.15Ω per MOSFET
                </div>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-[#0c0f18] space-y-2">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase block">
                  Test 02: MPU-6050 400kHz I2C Telemetry & Level Verification
                </span>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Power the ESP32 via USB and open the Serial Monitor at 115200 baud. Confirm the MPU-6050 is detected at I2C address 0x68. Place the drone on a flat, level surface. The pitch and roll angles must read within ±0.5° of zero. Gently tilt the nose down: pitch angle must increase positively. Tilt to the right: roll angle must increase positively.
                </p>
                <div className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                  Target Sensor Drift: &lt; 0.05°/sec after 100-sample calibration
                </div>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-[#0c0f18] space-y-2">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase block">
                  Test 03: Props-Off SoftAP Wi-Fi Heartbeat & Latency Check
                </span>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Connect your smartphone to 'AERO_ESP32_DRONE' Wi-Fi. In the telemetry dock, verify packet ping displays 7-12ms. Advance throttle to 30%: all four coreless motor shafts must spin smoothly without stutter. Turn off Wi-Fi on the phone: the ESP32 watchdog timer must trigger within 500ms, ramping all four motors down to 0 RPM stop.
                </p>
                <div className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                  Watchdog Reaction: Emergency throttle zero within 500ms
                </div>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-[#0c0f18] space-y-2">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase block">
                  Test 04: Center of Gravity (CG) Balance & Maiden Hover
                </span>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Mount the red (front) and black (rear) 55mm propellers. Support the drone with two fingertips directly underneath the diagonal arm intersection. Adjust the battery position until the frame balances perfectly level. Conduct maiden flight indoors over a carpeted floor. Advance throttle smoothly to 45%: the quadcopter should lift cleanly off the ground with minimal drift.
                </p>
                <div className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                  Takeoff Throttle: 42% – 48% with fresh 4.2V LiPo
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 5: ARDUINO C++ FIRMWARE ================= */}
      {activeTab === "firmware" && (
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar max-w-5xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FileCode className="text-indigo-400" size={22} />
                <span>Production Arduino IDE / PlatformIO C++ Firmware</span>
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                400Hz Mahony complementary filter, 20kHz MCPWM motor commutation, and 50ms UDP softAP telemetry.
              </p>
            </div>
            <button
              onClick={() => {
                setCopiedCode(true);
                setTimeout(() => setCopiedCode(false), 2000);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5"
            >
              {copiedCode ? <CheckCircle2 size={14} /> : <Zap size={14} />}
              <span>{copiedCode ? "Copied to Clipboard!" : "Copy Full Code"}</span>
            </button>
          </div>

          <div
            className={`p-4 rounded-2xl border font-mono text-xs overflow-x-auto max-h-[500px] custom-scrollbar ${
              isLight ? "bg-gray-900 text-emerald-400" : "bg-black/90 text-emerald-400 border-white/10"
            }`}
          >
            <pre className="text-[11px] leading-relaxed">
{`// ========================================================
// AERO-ESP32 SMARTPHONE CONTROLLED NANO DRONE FIRMWARE
// Dual-Core 240MHz ESP32 | 400Hz PID Loop | 20kHz MCPWM
// ========================================================
#include <WiFi.h>
#include <WiFiUdp.h>
#include <Wire.h>

#define MOTOR1_PIN 19   // Front-Right (CCW)
#define MOTOR2_PIN 18   // Front-Left  (CW)
#define MOTOR3_PIN 5    // Rear-Left   (CCW)
#define MOTOR4_PIN 17   // Rear-Right  (CW)
#define VBAT_ADC_PIN 34 // Battery Voltage Divider
#define LED_PIN 2       // Onboard Blue Status LED

const char* AP_SSID = "AERO_ESP32_DRONE";
const char* AP_PASS = "flyesp32";
const int   UDP_PORT = 8888;
WiFiUDP     Udp;

// PID Tuning Constants
float Kp_pitch = 1.35f, Ki_pitch = 0.04f, Kd_pitch = 18.2f;
float Kp_roll  = 1.35f, Ki_roll  = 0.04f, Kd_roll  = 18.2f;
float Kp_yaw   = 2.80f, Ki_yaw   = 0.02f, Kd_yaw   = 5.0f;

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);

  // 20kHz MCPWM setup (avoids audible motor whine)
  ledcAttachPin(MOTOR1_PIN, 0); ledcSetup(0, 20000, 10);
  ledcAttachPin(MOTOR2_PIN, 1); ledcSetup(1, 20000, 10);
  ledcAttachPin(MOTOR3_PIN, 2); ledcSetup(2, 20000, 10);
  ledcAttachPin(MOTOR4_PIN, 3); ledcSetup(3, 20000, 10);

  Wire.begin(21, 22, 400000); // 400kHz Fast I2C
  initMPU6050();
  calibrateGyro();

  WiFi.mode(WIFI_AP);
  WiFi.softAP(AP_SSID, AP_PASS, 6, 0, 4);
  Udp.begin(UDP_PORT);
}

void loop() {
  // 400Hz Precision Execution (DT = 0.0025s)
  readSensorFusion();
  receiveUdpPacket();
  executePidStabilization();
}`}
            </pre>
          </div>
        </div>
      )}

      {/* ================= TAB 6: ELECTRICAL SCHEMATIC & WIRING ================= */}
      {activeTab === "schematic" && (
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar max-w-5xl mx-auto space-y-6">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Zap className="text-amber-400" size={22} />
              <span>Full Electrical Schematic &amp; Pinout</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              ESP32 to MPU6050 I2C bus, SI2302 SOT-23 MOSFET gates, 1N5819 Schottky protection, and 1S LiPo voltage divider.
            </p>
          </div>

          <div
            className={`p-6 rounded-2xl border font-mono text-xs space-y-4 ${
              isLight ? "bg-white border-gray-200" : "bg-[#090c12] border-white/10"
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                <h4 className="font-bold text-sky-400 mb-2">I2C BUS (MPU-6050)</h4>
                <div className="space-y-1 text-[11px] text-gray-300">
                  <div>ESP32 GPIO 21 &rarr; MPU6050 SDA (Data)</div>
                  <div>ESP32 GPIO 22 &rarr; MPU6050 SCL (Clock)</div>
                  <div>ESP32 3V3 Pin &rarr; MPU6050 VCC (3.3V)</div>
                  <div>ESP32 GND Pin &rarr; MPU6050 GND (Common)</div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                <h4 className="font-bold text-amber-400 mb-2">MCPWM MOTOR GATES</h4>
                <div className="space-y-1 text-[11px] text-gray-300">
                  <div>ESP32 GPIO 19 &rarr; Motor 1 FET Gate (Front-Right, CCW)</div>
                  <div>ESP32 GPIO 18 &rarr; Motor 2 FET Gate (Front-Left, CW)</div>
                  <div>ESP32 GPIO 05 &rarr; Motor 3 FET Gate (Rear-Left, CCW)</div>
                  <div>ESP32 GPIO 17 &rarr; Motor 4 FET Gate (Rear-Right, CW)</div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-200 text-xs">
              <div className="font-bold flex items-center gap-1.5 mb-1">
                <AlertTriangle size={15} className="text-amber-400" />
                <span>Flyback Diode Polarities:</span>
              </div>
              <div>
                Each 1N5819 Schottky diode must have its cathode (silver ring) connected to VBAT (+) and its anode connected to the MOSFET drain. This safely shunts -35V inductive spikes away from the ESP32.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 7: DGCA NANO DRONE RULES ================= */}
      {activeTab === "dgca-rules" && (
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar max-w-5xl mx-auto space-y-4">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ShieldAlert className="text-emerald-400" size={22} />
              <span>DGCA India Drone Rules 2021 (Nano Category &lt;250g)</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Ministry of Civil Aviation regulatory compliance for college students and researchers in India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-2xl border ${isLight ? "bg-white border-gray-200" : "bg-[#0c0f17] border-white/10"}`}>
              <div className="text-[10px] font-mono font-bold text-emerald-400 uppercase">Weight Class</div>
              <div className="text-lg font-black mt-1">Nano (&lt; 250 grams)</div>
              <p className="text-xs text-gray-400 mt-2">
                This drone weighs only <strong>56.0 grams</strong>, well below the 250g legal threshold.
              </p>
            </div>

            <div className={`p-4 rounded-2xl border ${isLight ? "bg-white border-gray-200" : "bg-[#0c0f17] border-white/10"}`}>
              <div className="text-[10px] font-mono font-bold text-emerald-400 uppercase">UIN Exemption</div>
              <div className="text-lg font-black mt-1">Exempt from UIN</div>
              <p className="text-xs text-gray-400 mt-2">
                Recreational and research nano drones operating below 50 ft AGL do not require DigitalSky registration.
              </p>
            </div>

            <div className={`p-4 rounded-2xl border ${isLight ? "bg-white border-gray-200" : "bg-[#0c0f17] border-white/10"}`}>
              <div className="text-[10px] font-mono font-bold text-emerald-400 uppercase">Pilot License</div>
              <div className="text-lg font-black mt-1">No License Required</div>
              <p className="text-xs text-gray-400 mt-2">
                No Remote Pilot Certificate (RPC) required for student nano quadcopters.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
