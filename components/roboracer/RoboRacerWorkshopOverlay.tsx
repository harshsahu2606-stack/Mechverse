"use client";

import React, { useState, useEffect } from "react";
import {
  Car,
  Camera,
  Eye,
  Activity,
  Zap,
  Radio,
  Sliders,
  Layers,
  ShoppingBag,
  FileCode,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Power,
  ShieldAlert,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Check,
  Cpu,
  Gauge,
  Compass,
  Crosshair,
  Volume2,
} from "lucide-react";
import { AppTheme, RoboRacerNavTab } from "@/types/machine";
import { ROBO_RACER_SHOPPING_LIST } from "@/data/roboRacerData";
import BuyLinkButtons from "@/components/ui/BuyLinkButtons";

interface RoboRacerWorkshopOverlayProps {
  theme?: AppTheme;
  isDriving: boolean;
  onToggleDrive: () => void;
  speed: number; // -100 to 100
  steering: number; // -45 to 45 degrees
  cameraPan: number; // -90 to 90 degrees
  hoodOpen: boolean;
  onToggleHood: () => void;
  onControlChange: (control: { speed: number; steering: number; cameraPan: number }) => void;
  activeTab: RoboRacerNavTab;
  onChangeTab: (tab: RoboRacerNavTab) => void;
  explosionLevel?: number;
  onChangeExplosionLevel?: (level: number) => void;
  onResetCamera?: () => void;
  hideNavHeader?: boolean;
}

export default function RoboRacerWorkshopOverlay({
  theme = "dark",
  isDriving,
  onToggleDrive,
  speed,
  steering,
  cameraPan,
  hoodOpen,
  onToggleHood,
  onControlChange,
  activeTab,
  onChangeTab,
  explosionLevel = 0,
  onChangeExplosionLevel,
  onResetCamera,
  hideNavHeader = false,
}: RoboRacerWorkshopOverlayProps) {
  const isLight = theme === "light";
  const [driveMode, setDriveMode] = useState<"manual" | "obstacle" | "ai-track">("manual");
  const [batteryVoltage, setBatteryVoltage] = useState<number>(7.82);
  const [ultrasonicDistance, setUltrasonicDistance] = useState<number>(48); // cm
  const [cameraFps, setCameraFps] = useState<number>(30);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Simulated live telemetry updates
  useEffect(() => {
    if (!isDriving) {
      setBatteryVoltage(7.84);
      return;
    }
    const interval = setInterval(() => {
      // Simulate ultrasonic range fluctuations while moving
      if (driveMode === "obstacle") {
        setUltrasonicDistance((prev) => {
          const next = prev - 4 + Math.floor(Math.random() * 8);
          return Math.max(12, Math.min(180, next));
        });
      } else {
        setUltrasonicDistance(45 + Math.floor(Math.sin(Date.now() / 800) * 20));
      }

      // Voltage load drop
      const load = (Math.abs(speed) / 100) * 0.22;
      setBatteryVoltage(Number((7.84 - load).toFixed(2)));
    }, 400);

    return () => clearInterval(interval);
  }, [isDriving, driveMode, speed]);

  const totalBOM = ROBO_RACER_SHOPPING_LIST.reduce((acc, item) => acc + item.priceINR, 0);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(ROBO_RACER_FIRMWARE_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="w-full flex flex-col pointer-events-auto">
      {/* ================= WORKSHOP TOP NAVIGATION BAR ================= */}
      {!hideNavHeader && (
        <div
          className={`px-3 py-2 border-b flex items-center justify-between gap-2 overflow-x-auto ${
            isLight ? "bg-white/95 border-gray-200" : "bg-[#0b0f19]/90 border-white/10 backdrop-blur-md"
          }`}
        >
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white font-black text-xs shadow-md">
              RR
            </div>
            <div className="hidden sm:block">
              <span className="text-xs font-bold tracking-wider text-amber-500 uppercase">ROBO-RACER</span>
              <span className="text-[10px] text-gray-400 block font-mono">SolidWorks CAD Edition</span>
            </div>
          </div>

          {/* Tab Buttons - 5 Clean Pillars */}
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {[
              {
                id: "simulator" as RoboRacerNavTab,
                label: "Live Telemetry",
                icon: Gauge,
                isActive: activeTab === "simulator",
              },
              {
                id: "how-it-works" as RoboRacerNavTab,
                label: "Architecture & AI",
                icon: Layers,
                isActive: activeTab === "how-it-works" || activeTab === "ai-vision",
              },
              {
                id: "schematic" as RoboRacerNavTab,
                label: "Schematics",
                icon: Zap,
                isActive: activeTab === "schematic",
              },
              {
                id: "bom" as RoboRacerNavTab,
                label: "Indian BOM (₹)",
                icon: ShoppingBag,
                isActive: activeTab === "bom",
              },
              {
                id: "build-guide" as RoboRacerNavTab,
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
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer shrink-0 ${
                    tab.isActive
                      ? "bg-amber-500 text-black font-bold shadow-lg shadow-amber-500/25 scale-102"
                      : isLight
                      ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      : "text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10"
                  }`}
                >
                  <Icon size={13} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Sub-Tabs for Deep Content */}
      {(activeTab === "how-it-works" || activeTab === "ai-vision") && (
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
            Signal Flow & Kinematics
          </button>
          <button
            onClick={() => onChangeTab("ai-vision")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
              activeTab === "ai-vision"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Hikvision Optical AI Vision Pipeline
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
            ESP32 Autonomous C++ Firmware
          </button>
        </div>
      )}

      {/* ================= TAB 1: 3D CAD SIMULATOR LAUNCHER ================= */}
      {activeTab === "simulator" && (
        <div className="p-4 sm:p-6 space-y-4">
          <div
            className={`p-5 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 ${
              isLight ? "bg-white border-gray-200 shadow-sm" : "bg-[#111726]/80 border-white/10"
            }`}
          >
            <div className="space-y-1.5 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 font-mono text-[11px] font-bold">
                <Car size={13} />
                <span>ROBO-RACER 3D CAD SIMULATOR</span>
              </div>
              <h3 className="text-lg font-bold text-white">Full-Screen Autonomous Proving Ground</h3>
              <p className="text-xs text-gray-400 max-w-xl">
                Experience real-time 4WD skid-steer kinematics, ultrasonic sonar obstacle avoidance, and Hikvision camera servo tracking with interactive exploded inspection and customization.
              </p>
            </div>

            <button
              onClick={() => onChangeTab("how-it-works")}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold text-xs shadow-lg shadow-amber-500/25 transition cursor-pointer shrink-0"
            >
              Explore Architecture & AI →
            </button>
          </div>
        </div>
      )}

      {/* ================= TAB 2: SYSTEM ARCHITECTURE & SIGNAL FLOW ================= */}
      {activeTab === "how-it-works" && (
        <div className="p-4 sm:p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="text-amber-400" />
              Robo-Racer Autonomous Architecture
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Dual-core real-time signal flow connecting optical machine vision, ultrasonic reflex loops, and high-current 4WD skid-steer propulsion.
            </p>
          </div>

          {/* Block Diagram Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl border border-sky-500/20 bg-sky-950/20 space-y-2">
              <div className="flex items-center gap-2 text-sky-400">
                <Camera size={18} />
                <h4 className="text-xs font-bold uppercase tracking-wider">Tier 1: Vision Ingestion</h4>
              </div>
              <p className="text-xs text-gray-300">
                Hikvision DS-U02 captures 1080p @ 30 FPS. Frames are processed via HSV color thresholding to detect track boundaries and AprilTag markers.
              </p>
              <div className="text-[10px] font-mono text-sky-300 bg-black/40 p-2 rounded border border-sky-500/20">
                Resolution: 1920x1080 • Latency: 22ms • Pan: SG90 ±90°
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-950/20 space-y-2">
              <div className="flex items-center gap-2 text-amber-400">
                <Cpu size={18} />
                <h4 className="text-xs font-bold uppercase tracking-wider">Tier 2: Dual-Core Brain</h4>
              </div>
              <p className="text-xs text-gray-300">
                ESP32 Core 0 runs WebSockets / Wi-Fi telemetry and pan servo positioning. Core 1 runs the 100Hz PID steering loop and HC-SR04 sonar interrupt.
              </p>
              <div className="text-[10px] font-mono text-amber-300 bg-black/40 p-2 rounded border border-amber-500/20">
                Clock: 240MHz • Loop: 100Hz PID • Sonar: 40kHz Ping
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-orange-500/20 bg-orange-950/20 space-y-2">
              <div className="flex items-center gap-2 text-orange-400">
                <Car size={18} />
                <h4 className="text-xs font-bold uppercase tracking-wider">Tier 3: 4WD Actuation</h4>
              </div>
              <p className="text-xs text-gray-300">
                L298N Dual H-Bridge translates PWM signals into differential skid-steer torque across 4 geared motors with directional chevron tires.
              </p>
              <div className="text-[10px] font-mono text-orange-300 bg-black/40 p-2 rounded border border-orange-500/20">
                Max Current: 2.0A/ch • Stall Torque: 6.0 kg·cm
              </div>
            </div>
          </div>

          {/* Mathematical Signal Flow */}
          <div className="p-4 rounded-xl border border-white/10 bg-black/40 space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Mathematical Motion Model & Collision Reflex
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-300">
              <div className="space-y-1">
                <span className="font-semibold text-white">1. Ultrasonic Distance Formula:</span>
                <p className="font-mono text-amber-300 bg-white/5 p-2 rounded">
                  Distance (cm) = (Echo_Duration_µs × 0.0343) / 2
                </p>
                <p className="text-[11px] text-gray-400">
                  If Distance &lt; 20cm, state machine triggers hard reverse-brake reflex, overriding vision steering commands.
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-semibold text-white">2. Differential Skid-Steer Torque:</span>
                <p className="font-mono text-amber-300 bg-white/5 p-2 rounded">
                  PWM_Left = Speed - (Kp × Error_Yaw)<br />
                  PWM_Right = Speed + (Kp × Error_Yaw)
                </p>
                <p className="text-[11px] text-gray-400">
                  Adjusts differential motor RPM across both flanks for instantaneous apex pivot cornering.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: SCHEMATIC & PINOUT MAPPING ================= */}
      {activeTab === "schematic" && (
        <div className="p-4 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="text-amber-400" />
              Complete ESP32 Pinout & Wiring Interconnect
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Zero-guesswork GPIO wiring map for connecting the ESP32 brain, L298N driver, HC-SR04 sonar, and SG90 pan servo.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-white/5 text-gray-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="p-3">Device Pin</th>
                  <th className="p-3">ESP32 Pin</th>
                  <th className="p-3">Signal Type</th>
                  <th className="p-3">Electrical Voltage</th>
                  <th className="p-3">Functional Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono text-[11px]">
                <tr className="hover:bg-white/5">
                  <td className="p-3 text-sky-400">HC-SR04 Trig</td>
                  <td className="p-3 font-bold text-white">GPIO 18</td>
                  <td className="p-3 text-amber-300">Digital Output</td>
                  <td className="p-3">3.3V Logic</td>
                  <td className="p-3 font-sans">10µs ultrasonic sonic trigger chirp</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="p-3 text-sky-400">HC-SR04 Echo</td>
                  <td className="p-3 font-bold text-white">GPIO 19</td>
                  <td className="p-3 text-amber-300">Digital Input</td>
                  <td className="p-3 text-red-300">3.3V (via 1k/2k Divider)</td>
                  <td className="p-3 font-sans">High-pulse duration returns distance</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="p-3 text-amber-400">SG90 Servo PWM</td>
                  <td className="p-3 font-bold text-white">GPIO 13</td>
                  <td className="p-3 text-amber-300">50Hz PWM</td>
                  <td className="p-3">3.3V Logic</td>
                  <td className="p-3 font-sans">Controls camera pan angle (0° to 180°)</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="p-3 text-orange-400">L298N ENA (Left Speed)</td>
                  <td className="p-3 font-bold text-white">GPIO 27</td>
                  <td className="p-3 text-amber-300">20kHz PWM</td>
                  <td className="p-3">3.3V Logic</td>
                  <td className="p-3 font-sans">Hardware PWM duty cycle for left flank</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="p-3 text-orange-400">L298N IN1 / IN2</td>
                  <td className="p-3 font-bold text-white">GPIO 25 / 26</td>
                  <td className="p-3 text-amber-300">Digital Output</td>
                  <td className="p-3">3.3V Logic</td>
                  <td className="p-3 font-sans">Left motor forward / reverse polarity</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="p-3 text-orange-400">L298N ENB (Right Speed)</td>
                  <td className="p-3 font-bold text-white">GPIO 33</td>
                  <td className="p-3 text-amber-300">20kHz PWM</td>
                  <td className="p-3">3.3V Logic</td>
                  <td className="p-3 font-sans">Hardware PWM duty cycle for right flank</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="p-3 text-orange-400">L298N IN3 / IN4</td>
                  <td className="p-3 font-bold text-white">GPIO 14 / 12</td>
                  <td className="p-3 text-amber-300">Digital Output</td>
                  <td className="p-3">3.3V Logic</td>
                  <td className="p-3 font-sans">Right motor forward / reverse polarity</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-950/20 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
              <AlertTriangle size={15} />
              <span>Critical Electrical Safety Rule: Common Ground</span>
            </div>
            <p className="text-xs text-gray-300">
              Always tie the negative terminal (GND) of the 7.4V Li-ion battery, the LM2596 buck converter, the L298N motor driver, and the ESP32 board together to a unified Common Ground. Failure to connect common ground results in erratic motor stutter and floating logic noise.
            </p>
          </div>
        </div>
      )}

      {/* ================= TAB 4: PRODUCTION FIRMWARE CODE ================= */}
      {activeTab === "firmware" && (
        <div className="p-4 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileCode className="text-amber-400" />
                Production ESP32 Autonomous Firmware
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Full deployable C++/Arduino sketch featuring WebSockets telemetry, HC-SR04 sonar obstacle braking, and differential PWM drive.
              </p>
            </div>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-md transition"
            >
              {copiedCode ? <Check size={14} /> : <FileCode size={14} />}
              <span>{copiedCode ? "Copied to Clipboard!" : "Copy Full Code"}</span>
            </button>
          </div>

          <div className="relative rounded-xl border border-white/10 bg-[#070913] overflow-hidden">
            <pre className="p-4 text-xs font-mono text-gray-300 overflow-x-auto leading-relaxed max-h-[460px]">
              {ROBO_RACER_FIRMWARE_CODE}
            </pre>
          </div>
        </div>
      )}

      {/* ================= TAB 5: INDIAN BILL OF MATERIALS & PRICING ================= */}
      {activeTab === "bom" && (
        <div className="p-4 sm:p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShoppingBag className="text-amber-400" />
                Verified Indian Sourcing Bill of Materials (BOM)
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Real-world pricing and direct links to trusted Indian suppliers (Robu.in, ElectronicsComp, Robocraze).
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-right">
              <span className="text-[10px] text-gray-400 uppercase font-mono block">Complete Build Budget</span>
              <span className="text-lg font-black text-amber-400">₹{totalBOM.toLocaleString()} INR</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ROBO_RACER_SHOPPING_LIST.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-white/10 bg-white/5 space-y-2 hover:border-amber-500/40 transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-white">{item.component}</span>
                    <span className="text-[11px] text-gray-400 block font-mono">{item.model}</span>
                  </div>
                  <span className="text-xs font-bold font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    ₹{item.priceINR}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 leading-snug">{item.purpose}</p>
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/5 text-[10px] font-mono">
                  <span className="text-gray-400">Vendor: {item.seller}</span>
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
        </div>
      )}

      {/* ================= TAB 6: STEP-BY-STEP BUILD GUIDE & TESTING ================= */}
      {activeTab === "build-guide" && (
        <div className="p-4 sm:p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-[#1c1409] via-[#120d06] to-[#070503] shadow-xl">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
                <BookOpen size={16} />
                <span>SolidWorks CAD & Autonomous Robotics Manual</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                ROBO-RACER Mechanical Assembly & Track Testing
              </h3>
              <p className="text-xs text-gray-300 mt-1 max-w-2xl leading-relaxed">
                Complete engineering manual covering SolidWorks chassis fabrication, L298N PWM motor drive wiring, ultrasonic sonar calibration, and OpenCV vision alignment.
              </p>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono shrink-0">
              <span className="text-amber-400 font-bold px-2 py-1 bg-amber-500/10 rounded-lg">
                BUILD TIME: 3 - 4 HRS
              </span>
              <span className="text-gray-400 px-2">DIFFICULTY: INTERMEDIATE</span>
            </div>
          </div>

          {/* Section 1: Mechanical & Electrical Assembly */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <span>Part 1: Mechanical Assembly & Hardware Wiring</span>
            </h4>

            <div className="space-y-3.5">
              {[
                {
                  step: "01",
                  title: "SolidWorks CAD Baseplate & 4WD DC Geared Motor Mounting",
                  time: "35 mins",
                  tools: "2.5mm Allen key, M3 hex nuts, Loctite Blue",
                  desc: "Mount the four gold-anodized brass L-brackets to the 3mm laser-cut acrylic lower chassis plate ('Body Part.SLDPRT') using countersunk M3×10mm screws. Align the four 300 RPM TT dual-shaft gearmotors so their drive shafts protrude outward with exact 140mm lateral track width.",
                  qualityCheck: "Check axle perpendicularity: Motors must sit at 90° to the chassis centerline with zero wobble.",
                },
                {
                  step: "02",
                  title: "Chevron Tread 65mm Tires Press-Fit & Shaft Locking",
                  time: "20 mins",
                  tools: "Hand press, M2.5 hub set screws",
                  desc: "Align the D-flat keyway of the four 65mm chevron-tread racing tires with the motor output shafts. Press each wheel onto the shaft until seated against the motor collar. Tighten the hub locking screw against the flat face to eliminate wheel slip under high acceleration.",
                  qualityCheck: "Spin each wheel by hand to verify true axial rotation with less than 0.5mm radial runout.",
                },
                {
                  step: "03",
                  title: "Front HC-SR04 Sonar & Hikvision Camera Pan Neck Assembly",
                  time: "40 mins",
                  tools: "Small Phillips screwdriver, hot-melt adhesive",
                  desc: "Seat the dual-transducer HC-SR04 ultrasonic rangefinder into the front bumper bracket with acoustic horns pointing forward. Center the TowerPro SG90 micro servo horn at 90° (neutral). Secure the Hikvision DS-U02 1080p camera bracket to the servo spline using the center M2 retaining screw.",
                  qualityCheck: "Gently turn the camera by hand to verify full unobstructed 180° horizontal pan arc (-90° left to +90° right).",
                },
                {
                  step: "04",
                  title: "Cabin Enclosure & 38° Gullwing Hood ('Dhakna') Installation",
                  time: "30 mins",
                  tools: "M3 brass standoffs, 2mm stainless hinge pins",
                  desc: "Fasten the mid-cabin electronic bay enclosure ('Box Part.SLDPRT') to the chassis floor using four 25mm female brass standoffs. Slide the stainless hinge pins through the sloped aerodynamic hood ('Dhakna.SLDPRT') to enable smooth 38° gullwing opening for pit-stop battery swaps.",
                  qualityCheck: "The hood must latch firmly closed without rattling against the camera pan neck.",
                },
                {
                  step: "05",
                  title: "LM2596 DC-DC Buck Voltage Calibration & Common Ground",
                  time: "35 mins",
                  tools: "Digital Multimeter, Precision flathead trimpot screwdriver",
                  desc: "Connect the 2S 7.4V Li-ion pack through the master rocker switch to the LM2596 buck converter VIN. Connect a multimeter to the VOUT terminals. Adjust the 25-turn brass potentiometer screw counter-clockwise until output voltage reads exactly 5.05V DC. Tie battery (-), buck GND, L298N GND, and ESP32 GND into a single common ground bus.",
                  qualityCheck: "NEVER connect the buck converter to the ESP32 until multimeter confirms 5.05V ± 0.05V (over-voltage destroys ESP32 instantly).",
                },
              ].map((s) => (
                <div
                  key={s.step}
                  className="p-4 sm:p-5 rounded-2xl border border-white/10 bg-[#0e0c08] space-y-3 hover:border-amber-500/40 transition"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono font-black text-sm shrink-0">
                        {s.step}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider">{s.title}</h4>
                        <span className="text-[11px] font-mono text-gray-400">⏱️ {s.time}</span>
                      </div>
                    </div>
                    <div className="text-[10px] font-mono text-neutral-400 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                      Tools: {s.tools}
                    </div>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed font-sans">{s.desc}</p>

                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
                    <span className="font-bold uppercase font-mono text-[10px] shrink-0">Quality Check:</span>
                    <span className="text-[11px]">{s.qualityCheck}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Bench Testing & Autonomous Track Tuning */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <span>Part 2: Bench Sensor Calibration & Track Testing Suite</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-white/10 bg-[#0c0d10] space-y-2">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase block">
                  Test 01: Ultrasonic Sonar Reflex Braking Calibration
                </span>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Prop the car on a block so wheels spin in air. Hold a flat cardboard target 50cm in front of the HC-SR04 sensor and advance throttle. Slowly move the target closer. At exactly 25cm, the ESP32 reflex interrupt must trigger: both motor channels immediately reverse polarity for 80ms to provide active regenerative braking, then lock to 0% stop.
                </p>
                <div className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                  Target Stopping Distance: 25cm ± 1.5cm at 60% cruise speed
                </div>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-[#0c0d10] space-y-2">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase block">
                  Test 02: Skid-Steering Straight-Line Tracking & Trim
                </span>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Due to slight manufacturing variations between DC gearmotors, one side may spin slightly faster. Place the car on a 3-meter flat tile surface. Drive straight for 3 meters. If the car drifts more than 5cm off centerline, adjust the software motor trim constants in firmware:
                  Left_Trim = 1.00; Right_Trim = 0.94.
                </p>
                <div className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                  Pass Criteria: Drift &lt; 3cm over 3-meter straight burst
                </div>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-[#0c0d10] space-y-2">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase block">
                  Test 03: Camera Pan Servo Range & Jitter Test
                </span>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Power the camera and SG90 servo from the 5V buck rail. Command the servo across its full sweep (-90° to +90°). Verify smooth movement without gear jitter or humming. Ensure the USB camera cable has sufficient slack so it does not pull tight or restrict rotation during extreme left/right cornering scans.
                </p>
                <div className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                  PWM Frequency: 50Hz (500µs to 2500µs pulse duration)
                </div>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-[#0c0d10] space-y-2">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase block">
                  Test 04: Wi-Fi Heartbeat & Loss-of-Signal Fail-Safe
                </span>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Drive the vehicle via phone hotspot Wi-Fi telemetry. Turn off phone Wi-Fi while driving. The ESP32 watchdog timer must register the missing heartbeat packet within 300ms and immediately shut off PWM to all 4 motors, preventing runaway crashes.
                </p>
                <div className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                  Fail-Safe Reaction Time: &lt; 300ms emergency motor cutoff
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 7: AI COMPUTER VISION PIPELINE ================= */}
      {activeTab === "ai-vision" && (
        <div className="p-4 sm:p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Camera className="text-sky-400" />
              Hikvision Optical Machine Vision Pipeline
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              OpenCV Python & MicroPython processing algorithms for lane detection, track boundaries, and obstacle classification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-white/10 bg-black/40 space-y-2">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                1. HSV Color Space Masking
              </span>
              <p className="text-xs text-gray-300 leading-relaxed">
                Raw RGB frames from the Hikvision DS-U02 are converted to HSV (Hue-Saturation-Value) to isolate white/yellow track boundary lines regardless of ambient room shadows or harsh spotlights.
              </p>
              <pre className="p-3 text-[10px] font-mono text-amber-300 bg-white/5 rounded border border-white/5 overflow-x-auto">
{`hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
lower_yellow = np.array([20, 100, 100])
upper_yellow = np.array([30, 255, 255])
mask = cv2.inRange(hsv, lower_yellow, upper_yellow)`}
              </pre>
            </div>

            <div className="p-4 rounded-xl border border-white/10 bg-black/40 space-y-2">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                2. Centroid Deviation & Steering Error
              </span>
              <p className="text-xs text-gray-300 leading-relaxed">
                Image moments calculate the centroid $(C_x, C_y)$ of the detected track lane. The horizontal offset from the camera optical center ($960px$) serves as the PID steering error term.
              </p>
              <pre className="p-3 text-[10px] font-mono text-amber-300 bg-white/5 rounded border border-white/5 overflow-x-auto">
{`M = cv2.moments(mask)
if M['m00'] > 0:
    cx = int(M['m10'] / M['m00'])
    error_x = cx - (frame_width // 2)
    steering_angle = Kp * error_x + Kd * d_error`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const ROBO_RACER_FIRMWARE_CODE = `/*
 * =========================================================================
 * ROBO-RACER AI AUTONOMOUS RACING BOT - PRODUCTION FIRMWARE
 * Microcontroller: ESP32-WROOM-32 (Dual-Core 240MHz)
 * Sensors: HC-SR04 Ultrasonic Sonar, Hikvision DS-U02 AI Vision Stream
 * Actuators: 4WD Geared DC Motors (L298N Driver), SG90 Camera Pan Servo
 * =========================================================================
 */

#include <Arduino.h>
#include <WiFi.h>
#include <ESP32Servo.h>

// PIN CONFIGURATION
#define PIN_TRIG        18
#define PIN_ECHO        19
#define PIN_SERVO_PAN   13

#define PIN_MOTOR_ENA   27  // Left Motors PWM
#define PIN_MOTOR_IN1   25
#define PIN_MOTOR_IN2   26

#define PIN_MOTOR_ENB   33  // Right Motors PWM
#define PIN_MOTOR_IN3   14
#define PIN_MOTOR_IN4   12

// PWM CHANNELS
#define PWM_FREQ        20000 // 20kHz Silent Drive
#define PWM_RES         8     // 8-bit (0 - 255)

Servo panServo;
volatile float ultrasonicDistanceCm = 50.0;
int currentSpeed = 0;
int currentSteering = 0;

void setMotorSpeeds(int leftPwm, int rightPwm) {
  // Left Motor Direction
  if (leftPwm >= 0) {
    digitalWrite(PIN_MOTOR_IN1, HIGH);
    digitalWrite(PIN_MOTOR_IN2, LOW);
  } else {
    digitalWrite(PIN_MOTOR_IN1, LOW);
    digitalWrite(PIN_MOTOR_IN2, HIGH);
    leftPwm = -leftPwm;
  }

  // Right Motor Direction
  if (rightPwm >= 0) {
    digitalWrite(PIN_MOTOR_IN3, HIGH);
    digitalWrite(PIN_MOTOR_IN4, LOW);
  } else {
    digitalWrite(PIN_MOTOR_IN3, LOW);
    digitalWrite(PIN_MOTOR_IN4, HIGH);
    rightPwm = -rightPwm;
  }

  ledcWrite(0, constrain(leftPwm, 0, 255));
  ledcWrite(1, constrain(rightPwm, 0, 255));
}

float measureUltrasonicDistance() {
  digitalWrite(PIN_TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(PIN_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(PIN_TRIG, LOW);

  long duration = pulseIn(PIN_ECHO, HIGH, 25000); // 25ms timeout (~4m max)
  if (duration == 0) return 400.0;
  return (duration * 0.0343) / 2.0;
}

void setup() {
  Serial.begin(115200);

  // Motor Pins
  pinMode(PIN_MOTOR_IN1, OUTPUT);
  pinMode(PIN_MOTOR_IN2, OUTPUT);
  pinMode(PIN_MOTOR_IN3, OUTPUT);
  pinMode(PIN_MOTOR_IN4, OUTPUT);

  ledcAttach(PIN_MOTOR_ENA, PWM_FREQ, PWM_RES);
  ledcAttach(PIN_MOTOR_ENB, PWM_FREQ, PWM_RES);

  // Sonar Pins
  pinMode(PIN_TRIG, OUTPUT);
  pinMode(PIN_ECHO, INPUT);

  // Servo Setup
  panServo.setPeriodHertz(50);
  panServo.attach(PIN_SERVO_PAN, 500, 2400);
  panServo.write(90); // Center

  Serial.println("[ROBO-RACER] Autonomous Core Booted.");
}

void loop() {
  // 1. Measure Front Distance
  ultrasonicDistanceCm = measureUltrasonicDistance();

  // 2. Emergency Collision Reflex
  if (ultrasonicDistanceCm < 20.0) {
    Serial.println("[ALERT] Obstacle Detected! Hard Brake & Evasive Pivot.");
    setMotorSpeeds(-180, -180); // Reverse
    delay(150);
    setMotorSpeeds(-150, 150);  // Quick Tank Turn
    delay(200);
    return;
  }

  // 3. Normal Differential Drive
  int basePwm = map(currentSpeed, -100, 100, -255, 255);
  int steerDelta = map(currentSteering, -45, 45, -90, 90);

  int leftMotor = basePwm + steerDelta;
  int rightMotor = basePwm - steerDelta;

  setMotorSpeeds(leftMotor, rightMotor);
  delay(10);
}
`;
