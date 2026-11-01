"use client";

import React, { useState } from "react";
import { Zap, Activity, Info, CheckCircle2, AlertTriangle, ShieldCheck, BatteryCharging, Radio, Compass, Video } from "lucide-react";
import { AppTheme } from "@/types/machine";

interface AeroElectronicViewProps {
  theme?: AppTheme;
  onClose?: () => void;
}

type ElectronicComponentId =
  | "ardupilot"
  | "battery"
  | "battery-monitor"
  | "esc-1"
  | "esc-2"
  | "esc-3"
  | "esc-4"
  | "motor-1"
  | "motor-2"
  | "motor-3"
  | "motor-4"
  | "gps"
  | "receiver"
  | "gimbal"
  | "bullet-connectors";

interface ComponentDetail {
  title: string;
  category: "Flight Computer" | "Power & Battery" | "Actuators & ESC" | "Sensors & Telemetry" | "Payload";
  voltage: string;
  protocol: string;
  description: string;
  pinout: string[];
}

const COMPONENT_DETAILS: Record<ElectronicComponentId, ComponentDetail> = {
  ardupilot: {
    title: "ArduPilot / Pixhawk Autopilot",
    category: "Flight Computer",
    voltage: "5.0V regulated via Power Module BEC",
    protocol: "PWM (ESC/Servos), UART (GPS/Telemetry), I2C (Compass), SBUS/PPM (Receiver)",
    description: "The central flight controller executing attitude estimation (EKF3), autonomous stabilization, fail-safes, and navigation logic at 400Hz.",
    pinout: [
      "MAIN OUT 1-4: PWM motor control signals to 4 ESCs",
      "RC IN: 3-pin SBUS / PPM receiver input (Signal, +5V, GND)",
      "GPS PORT: 6-pin UART (TX/RX) + I2C (SDA/SCL for internal compass)",
      "AUX OUT 1-2: PWM Gimbal Roll and Tilt servo actuation",
      "POWER PORT: 6-pin analog voltage & current sensing (0-3.3V analog)",
    ],
  },
  battery: {
    title: "3S 2200mAh - 4200mAh LiPo Battery",
    category: "Power & Battery",
    voltage: "11.1V nominal (12.6V fully charged, 10.5V cutoff)",
    protocol: "High-Current DC Power (35C continuous discharge = 77A - 147A)",
    description: "Primary chemical energy reservoir with lithium-polymer cells. Connects through low-resistance 12AWG silicone leads and an authentic XT60 connector.",
    pinout: [
      "Main Lead (+ Red): Direct to Power Distribution Board / Wiring Harness",
      "Main Lead (- Black): System common ground",
      "JST-XH Balance Lead: 4-pin connector for per-cell monitoring & balancing",
    ],
  },
  "battery-monitor": {
    title: "Optional Battery Monitor / Power Module",
    category: "Power & Battery",
    voltage: "Input: 2S-6S (7.4V - 25.2V) | Output: 5.3V / 3A BEC",
    protocol: "Analog Voltage & Current Sense ADC",
    description: "Measures real-time battery voltage and total current draw, feeding telemetry to ArduPilot for automatic low-battery Return-to-Launch (RTL).",
    pinout: [
      "V_Sense: Voltage divider to ADC (10.1:1 ratio)",
      "I_Sense: Hall-effect / shunt current sensor (17.0mV/A)",
      "5V BEC Out: Clean filtered power for Pixhawk core logic",
    ],
  },
  "esc-1": {
    title: "Electronic Speed Controller (ESC 1 - Front Right)",
    category: "Actuators & ESC",
    voltage: "Input: 11.1V DC | Output: 3-Phase AC (0 - 11.1V RMS)",
    protocol: "Standard PWM (1000µs - 2000µs at 50-490Hz) or OneShot125",
    description: "Converts DC battery power into 3-phase trapezoidal alternating current to drive brushless outrunner motor M1 (CCW rotation).",
    pinout: [
      "DC Input: Red (+11.1V) & Black (GND) from Wiring Harness",
      "Signal Input: White (PWM Signal from ArduPilot Pin 1) & Black (GND)",
      "3-Phase Output: Three 3.5mm gold bullet sockets (Phase A, B, C)",
    ],
  },
  "esc-2": {
    title: "Electronic Speed Controller (ESC 2 - Front Left)",
    category: "Actuators & ESC",
    voltage: "Input: 11.1V DC | Output: 3-Phase AC",
    protocol: "PWM (1000µs - 2000µs)",
    description: "Drives front-left motor M2 (CW rotation). Direction reversed by swapping any two bullet connector phases.",
    pinout: [
      "DC Input: Red (+11.1V) & Black (GND)",
      "Signal Input: PWM from ArduPilot Pin 2",
      "3-Phase Output: Bullet connectors to Motor 2",
    ],
  },
  "esc-3": {
    title: "Electronic Speed Controller (ESC 3 - Rear Left)",
    category: "Actuators & ESC",
    voltage: "Input: 11.1V DC | Output: 3-Phase AC",
    protocol: "PWM (1000µs - 2000µs)",
    description: "Drives rear-left motor M3 (CCW rotation).",
    pinout: [
      "DC Input: Red (+11.1V) & Black (GND)",
      "Signal Input: PWM from ArduPilot Pin 3",
      "3-Phase Output: Bullet connectors to Motor 3",
    ],
  },
  "esc-4": {
    title: "Electronic Speed Controller (ESC 4 - Rear Right)",
    category: "Actuators & ESC",
    voltage: "Input: 11.1V DC | Output: 3-Phase AC",
    protocol: "PWM (1000µs - 2000µs)",
    description: "Drives rear-right motor M4 (CW rotation).",
    pinout: [
      "DC Input: Red (+11.1V) & Black (GND)",
      "Signal Input: PWM from ArduPilot Pin 4",
      "3-Phase Output: Bullet connectors to Motor 4",
    ],
  },
  "motor-1": {
    title: "Brushless Outrunner Motor 1 (Front-Right CCW)",
    category: "Actuators & ESC",
    voltage: "3-Phase AC driven by ESC",
    protocol: "Sensorless Back-EMF commutation",
    description: "A2212 920KV/1000KV outrunner motor with 14 permanent neodymium magnets rotating outside the 12-slot stator. Spins 1045 CCW propeller.",
    pinout: ["Phase A (Lead 1)", "Phase B (Lead 2)", "Phase C (Lead 3)"],
  },
  "motor-2": {
    title: "Brushless Outrunner Motor 2 (Front-Left CW)",
    category: "Actuators & ESC",
    voltage: "3-Phase AC",
    protocol: "Sensorless Back-EMF",
    description: "A2212 motor spinning CW propeller. Counter-rotates to cancel gyroscopic torque and provide yaw authority.",
    pinout: ["Phase A (Lead 1)", "Phase B (Lead 2)", "Phase C (Lead 3)"],
  },
  "motor-3": {
    title: "Brushless Outrunner Motor 3 (Rear-Left CCW)",
    category: "Actuators & ESC",
    voltage: "3-Phase AC",
    protocol: "Sensorless Back-EMF",
    description: "Rear-left motor providing pitch and roll dynamic stabilization.",
    pinout: ["Phase A (Lead 1)", "Phase B (Lead 2)", "Phase C (Lead 3)"],
  },
  "motor-4": {
    title: "Brushless Outrunner Motor 4 (Rear-Right CW)",
    category: "Actuators & ESC",
    voltage: "3-Phase AC",
    protocol: "Sensorless Back-EMF",
    description: "Rear-right motor paired with Motor 2 for clockwise torque balance.",
    pinout: ["Phase A (Lead 1)", "Phase B (Lead 2)", "Phase C (Lead 3)"],
  },
  gps: {
    title: "U-blox NEO-M8N GPS & Digital Compass Module",
    category: "Sensors & Telemetry",
    voltage: "5.0V DC (Internal LDO regulates to 3.3V)",
    protocol: "UART (NMEA / UBX @ 38400 baud) + I2C (HMC5883L/QMC5883 compass)",
    description: "Provides multi-GNSS constellation lock (GPS, GLONASS, Galileo) for position hold, altitude hold, mission waypoints, and return-to-home.",
    pinout: [
      "VCC (+5V) & GND",
      "TX / RX: Serial communication to ArduPilot GPS port",
      "SCL / SDA: I2C digital bus for external magnetometer",
    ],
  },
  receiver: {
    title: "2.4GHz RC Receiver (FS-iA6B / FrSky)",
    category: "Sensors & Telemetry",
    voltage: "4.0V - 6.5V DC from ArduPilot RC Rail",
    protocol: "SBUS / PPM digital serial bus (2.4GHz AFHDS 2A / ACCESS)",
    description: "Receives real-time pilot throttle, yaw, pitch, roll, and flight mode switch commands from the handheld radio transmitter.",
    pinout: [
      "Signal Pin: Single-wire digital SBUS packet stream",
      "VCC (+5V) & GND",
      "Dual 2.4GHz Coaxial Dipole Whisker Antennas (90° diversity angle)",
    ],
  },
  gimbal: {
    title: "2-Axis Camera Gimbal (Roll & Tilt Servos)",
    category: "Payload",
    voltage: "5.0V - 6.0V DC (Servos)",
    protocol: "Analog / Digital PWM (50Hz, 1000µs - 2000µs pulse width)",
    description: "Stabilizes the camera platform against drone pitching and rolling during flight, ensuring level horizon observation.",
    pinout: [
      "Roll Servo: ArduPilot AUX OUT 1 (Stabilizes roll axis)",
      "Tilt Servo: ArduPilot AUX OUT 2 (Pilot pitch control + stabilization)",
      "Camera Power & Analog Video Out",
    ],
  },
  "bullet-connectors": {
    title: "3.5mm Gold-Plated Bullet Connectors",
    category: "Actuators & ESC",
    voltage: "0 - 11.1V AC 3-Phase",
    protocol: "High-Current Mechanical Quick-Disconnect",
    description: "Gold-plated low-resistance (less than 0.5mΩ) spring-contact connectors allowing easy motor disconnection and motor direction reversal.",
    pinout: ["Spring Pin (Male)", "Split Sleeve Socket (Female)"],
  },
};

export default function AeroElectronicView({
  theme = "dark",
  onClose,
}: AeroElectronicViewProps) {
  const [selectedId, setSelectedId] = useState<ElectronicComponentId>("ardupilot");
  const [simRunning, setSimRunning] = useState<boolean>(true);
  const isLight = theme === "light";

  const detail = COMPONENT_DETAILS[selectedId];

  return (
    <div
      className={`w-full h-full flex flex-col overflow-y-auto custom-scrollbar transition-colors ${
        isLight ? "bg-slate-50 text-slate-800" : "bg-[#0b0e14] text-slate-200"
      }`}
    >
      {/* Top Header & Architecture Banner */}
      <div
        className={`px-6 py-4 border-b flex flex-wrap items-center justify-between gap-4 shrink-0 ${
          isLight ? "bg-white border-slate-200 shadow-sm" : "bg-[#0e121a] border-white/10"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-500">
            <Zap size={22} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold tracking-tight">
                AERO-450 Electronics &amp; Interconnect Architecture
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-bold uppercase">
                ArduPilot / Pixhawk Standard
              </span>
            </div>
            <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>
              Full electrical topology replicating authentic quadcopter wiring harness, signal buses, and telemetry paths.
            </p>
          </div>
        </div>

        {/* Live Simulation & Test Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSimRunning((prev) => !prev)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
              simRunning
                ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-500"
                : isLight
                ? "bg-slate-100 border-slate-300 text-slate-600"
                : "bg-white/5 border-white/15 text-slate-400"
            }`}
          >
            <Activity size={14} className={simRunning ? "animate-pulse" : ""} />
            <span>{simRunning ? "Power Active (11.1V DC)" : "Simulation Paused"}</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                isLight
                  ? "bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700"
                  : "bg-white/10 hover:bg-white/15 border-white/20 text-white"
              }`}
            >
              Back to 3D
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Interactive Schematic Viewport (Left) + Detailed Technical Inspector (Right) */}
      <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: SVG Schematic Diagram faithfully matching User Attachment 2 */}
        <div
          className={`lg:col-span-8 p-5 rounded-2xl border shadow-xl flex flex-col items-center justify-center relative overflow-hidden ${
            isLight
              ? "bg-white border-slate-200 shadow-slate-200/60"
              : "bg-[#090c12] border-white/10 shadow-2xl"
          }`}
        >
          {/* Schematic Diagram Legend */}
          <div className="w-full flex flex-wrap items-center justify-between pb-3 mb-2 border-b border-slate-500/20 text-[11px] font-medium">
            <span className="font-bold text-amber-500">SCHEMATIC WIRING DIAGRAM (IMAGE 2 REPLICA)</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1 rounded bg-orange-500 inline-block" />
                <span className={isLight ? "text-slate-600" : "text-slate-400"}>11.1V Power Bus</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1 rounded bg-amber-400 inline-block" />
                <span className={isLight ? "text-slate-600" : "text-slate-400"}>PWM Servo Lines</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1 rounded bg-cyan-400 inline-block" />
                <span className={isLight ? "text-slate-600" : "text-slate-400"}>3-Phase AC Motor Lines</span>
              </span>
            </div>
          </div>

          {/* SVG Canvas containing the full interconnect schematic */}
          <svg
            viewBox="0 0 920 540"
            className="w-full h-auto max-h-[520px] select-none"
            style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.05))" }}
          >
            {/* WIRING CONNECTIONS */}
            {/* Power lines from Battery -> Wiring Harness */}
            <path
              d="M 230 400 L 230 320 L 250 320"
              stroke="#ef4444"
              strokeWidth="3.5"
              fill="none"
              strokeDasharray={simRunning ? "6 3" : undefined}
            />
            <path
              d="M 240 400 L 240 330 L 250 330"
              stroke="#1e293b"
              strokeWidth="3.5"
              fill="none"
            />

            {/* Wiring harness to 4 ESCs */}
            {/* to ESC Top (ESC 1) */}
            <path
              d="M 255 310 L 255 190 L 275 190"
              stroke="#ea580c"
              strokeWidth="2.5"
              fill="none"
            />
            {/* to ESC Left (ESC 2) */}
            <path
              d="M 245 310 L 190 310 L 190 260"
              stroke="#ea580c"
              strokeWidth="2.5"
              fill="none"
            />
            {/* to ESC Center-Right (ESC 3) */}
            <path
              d="M 265 310 L 340 310 L 340 260"
              stroke="#ea580c"
              strokeWidth="2.5"
              fill="none"
            />
            {/* to ESC Bottom (ESC 4) */}
            <path
              d="M 260 330 L 340 330 L 340 365"
              stroke="#ea580c"
              strokeWidth="2.5"
              fill="none"
            />

            {/* ArduPilot Servo Signal Connectors (4x orange buses to 4 ESCs) */}
            {/* ArduPilot to ESC 1 (Top) */}
            <path
              d="M 460 110 L 320 110 L 320 150"
              stroke="#f59e0b"
              strokeWidth="2"
              fill="none"
            />
            {/* ArduPilot to ESC 2 (Left) */}
            <path
              d="M 460 125 L 305 125 L 305 210 L 175 210 L 175 240"
              stroke="#f59e0b"
              strokeWidth="2"
              fill="none"
            />
            {/* ArduPilot to ESC 3 (Center) */}
            <path
              d="M 460 140 L 370 140 L 370 235"
              stroke="#f59e0b"
              strokeWidth="2"
              fill="none"
            />
            {/* ArduPilot to ESC 4 (Bottom) */}
            <path
              d="M 460 155 L 390 155 L 390 365"
              stroke="#f59e0b"
              strokeWidth="2"
              fill="none"
            />

            {/* ArduPilot to Gimbal (Roll & Tilt Servos) */}
            <path
              d="M 540 180 L 540 290 L 590 290"
              stroke="#fbbf24"
              strokeWidth="2.5"
              fill="none"
            />
            <path
              d="M 550 180 L 550 335 L 670 335"
              stroke="#fbbf24"
              strokeWidth="2.5"
              fill="none"
            />

            {/* ArduPilot to GPS Module (GPS signal) */}
            <path
              d="M 610 180 L 610 240 L 650 240"
              stroke="#10b981"
              strokeWidth="3"
              fill="none"
            />

            {/* ArduPilot to Receiver (Multi-wire bus) */}
            <path
              d="M 630 110 L 740 110"
              stroke="#38bdf8"
              strokeWidth="3.5"
              fill="none"
            />
            <path
              d="M 630 120 L 740 120"
              stroke="#38bdf8"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M 630 130 L 740 130"
              stroke="#38bdf8"
              strokeWidth="2"
              fill="none"
            />

            {/* Bullet Connectors to Brushless Outrunner Motors (3 phases) */}
            {/* Top Motor */}
            <path d="M 280 150 L 280 120" stroke="#06b6d4" strokeWidth="2.5" fill="none" />
            <path d="M 285 150 L 285 120" stroke="#f59e0b" strokeWidth="2.5" fill="none" />
            <path d="M 290 150 L 290 120" stroke="#ef4444" strokeWidth="2.5" fill="none" />

            {/* Left Motor */}
            <path d="M 140 250 L 105 250" stroke="#06b6d4" strokeWidth="2.5" fill="none" />
            <path d="M 140 255 L 105 255" stroke="#f59e0b" strokeWidth="2.5" fill="none" />
            <path d="M 140 260 L 105 260" stroke="#ef4444" strokeWidth="2.5" fill="none" />

            {/* Right Motor */}
            <path d="M 390 250 L 425 250" stroke="#06b6d4" strokeWidth="2.5" fill="none" />
            <path d="M 390 255 L 425 255" stroke="#f59e0b" strokeWidth="2.5" fill="none" />
            <path d="M 390 260 L 425 260" stroke="#ef4444" strokeWidth="2.5" fill="none" />

            {/* Bottom Motor */}
            <path d="M 350 415 L 350 445" stroke="#06b6d4" strokeWidth="2.5" fill="none" />
            <path d="M 355 415 L 355 445" stroke="#f59e0b" strokeWidth="2.5" fill="none" />
            <path d="M 360 415 L 360 445" stroke="#ef4444" strokeWidth="2.5" fill="none" />

            {/* ================= COMPONENTS (Matching Image 2) ================= */}
            {/* 1. LIPO BATTERY */}
            <g
              onClick={() => setSelectedId("battery")}
              className="cursor-pointer group"
            >
              <rect
                x="180"
                y="400"
                width="80"
                height="125"
                rx="6"
                fill="#0284c7"
                stroke={selectedId === "battery" ? "#38bdf8" : "#0369a1"}
                strokeWidth={selectedId === "battery" ? "3" : "1.5"}
              />
              <text x="220" y="465" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">
                Lipo Battery
              </text>
              <text x="220" y="482" textAnchor="middle" fill="#bae6fd" fontSize="9" fontFamily="monospace">
                3S 11.1V 35C
              </text>
            </g>

            {/* Battery Connector (XT60) */}
            <g
              onClick={() => setSelectedId("battery")}
              className="cursor-pointer"
            >
              <rect x="222" y="380" width="16" height="15" rx="3" fill="#f97316" stroke="#c2410c" strokeWidth="1" />
              <text x="230" y="372" textAnchor="middle" fill={isLight ? "#334155" : "#94a3b8"} fontSize="9">
                Battery Connector
              </text>
            </g>

            {/* Optional Battery Monitor */}
            <g
              onClick={() => setSelectedId("battery-monitor")}
              className="cursor-pointer group"
            >
              <rect
                x="90"
                y="350"
                width="50"
                height="50"
                rx="5"
                fill="#15803d"
                stroke={selectedId === "battery-monitor" ? "#4ade80" : "#166534"}
                strokeWidth={selectedId === "battery-monitor" ? "3" : "1"}
              />
              {/* Gold sensor pins */}
              {[1, 2, 3].map((row) =>
                [1, 2].map((col) => (
                  <circle
                    key={`${row}-${col}`}
                    cx={95 + col * 12}
                    cy={355 + row * 10}
                    r="2.5"
                    fill="#fbbf24"
                  />
                ))
              )}
              <text x="115" y="415" textAnchor="middle" fill={isLight ? "#334155" : "#94a3b8"} fontSize="9">
                Optional
              </text>
              <text x="115" y="427" textAnchor="middle" fill={isLight ? "#334155" : "#94a3b8"} fontSize="9">
                Battery Monitor
              </text>
            </g>

            {/* 2. ARDUPILOT BOARD */}
            <g
              onClick={() => setSelectedId("ardupilot")}
              className="cursor-pointer group"
            >
              <rect
                x="460"
                y="65"
                width="170"
                height="115"
                rx="6"
                fill="#64748b"
                stroke={selectedId === "ardupilot" ? "#38bdf8" : "#475569"}
                strokeWidth={selectedId === "ardupilot" ? "4" : "2"}
              />
              {/* Screw mount holes */}
              <circle cx="472" cy="77" r="3.5" fill="#1e293b" />
              <circle cx="618" cy="77" r="3.5" fill="#1e293b" />
              <circle cx="472" cy="168" r="3.5" fill="#1e293b" />
              <circle cx="618" cy="168" r="3.5" fill="#1e293b" />

              <text x="545" y="105" textAnchor="middle" fill="#ffffff" fontSize="14" fontStyle="italic" fontWeight="bold">
                ARDUPilot
              </text>
              <text x="590" y="145" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
                GPS signal
              </text>
              <text x="545" y="55" textAnchor="middle" fill={isLight ? "#1e293b" : "#e2e8f0"} fontSize="12" fontWeight="bold">
                Ardupilot Board
              </text>
            </g>

            {/* 3. FOUR ELECTRONIC SPEED CONTROLLERS (ESCS) */}
            {/* ESC Top */}
            <g onClick={() => setSelectedId("esc-1")} className="cursor-pointer">
              <rect
                x="265"
                y="150"
                width="40"
                height="50"
                rx="4"
                fill="#16a34a"
                stroke={selectedId === "esc-1" ? "#4ade80" : "#15803d"}
                strokeWidth="2"
              />
              <text x="285" y="178" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                ESC
              </text>
            </g>

            {/* ESC Left */}
            <g onClick={() => setSelectedId("esc-2")} className="cursor-pointer">
              <rect
                x="140"
                y="240"
                width="50"
                height="38"
                rx="4"
                fill="#16a34a"
                stroke={selectedId === "esc-2" ? "#4ade80" : "#15803d"}
                strokeWidth="2"
              />
              <text x="165" y="263" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                ESC
              </text>
            </g>

            {/* ESC Right */}
            <g onClick={() => setSelectedId("esc-3")} className="cursor-pointer">
              <rect
                x="340"
                y="240"
                width="50"
                height="38"
                rx="4"
                fill="#16a34a"
                stroke={selectedId === "esc-3" ? "#4ade80" : "#15803d"}
                strokeWidth="2"
              />
              <text x="365" y="263" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                ESC
              </text>
            </g>

            {/* ESC Bottom */}
            <g onClick={() => setSelectedId("esc-4")} className="cursor-pointer">
              <rect
                x="335"
                y="365"
                width="40"
                height="50"
                rx="4"
                fill="#16a34a"
                stroke={selectedId === "esc-4" ? "#4ade80" : "#15803d"}
                strokeWidth="2"
              />
              <text x="355" y="393" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                ESC
              </text>
            </g>

            {/* 4. FOUR MOTORS & PROPELLERS */}
            {/* Motor Top */}
            <g onClick={() => setSelectedId("motor-1")} className="cursor-pointer">
              <rect x="270" y="80" width="30" height="40" rx="3" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
              <text x="340" y="95" fill={isLight ? "#334155" : "#cbd5e1"} fontSize="10" fontWeight="bold">
                Brushless
              </text>
              <text x="340" y="108" fill={isLight ? "#334155" : "#cbd5e1"} fontSize="10" fontWeight="bold">
                Outrunner Motor
              </text>
              {/* Propeller Blade Top */}
              <ellipse cx="285" cy="75" rx="90" ry="6" fill="#18181b" />
              <text x="285" y="60" textAnchor="middle" fill={isLight ? "#334155" : "#94a3b8"} fontSize="11">
                Propeller
              </text>
            </g>

            {/* Motor Left */}
            <g onClick={() => setSelectedId("motor-2")} className="cursor-pointer">
              <rect x="65" y="240" width="40" height="30" rx="3" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
              {/* Propeller Blade Left */}
              <ellipse cx="60" cy="255" rx="6" ry="85" fill="#18181b" />
              <text x="40" y="160" textAnchor="middle" fill={isLight ? "#334155" : "#94a3b8"} fontSize="11">
                Propeller
              </text>
              <text x="90" y="225" textAnchor="middle" fill={isLight ? "#334155" : "#cbd5e1"} fontSize="10" fontWeight="bold">
                Brushless Outrunner Motor
              </text>
            </g>

            {/* Motor Right */}
            <g onClick={() => setSelectedId("motor-3")} className="cursor-pointer">
              <rect x="425" y="240" width="40" height="30" rx="3" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
              {/* Propeller Blade Right */}
              <ellipse cx="470" cy="255" rx="6" ry="85" fill="#18181b" />
              <text x="490" y="350" textAnchor="middle" fill={isLight ? "#334155" : "#94a3b8"} fontSize="11">
                Propeller
              </text>
            </g>

            {/* Motor Bottom */}
            <g onClick={() => setSelectedId("motor-4")} className="cursor-pointer">
              <rect x="340" y="445" width="30" height="40" rx="3" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
              {/* Propeller Blade Bottom */}
              <ellipse cx="355" cy="490" rx="90" ry="6" fill="#18181b" />
              <text x="355" y="515" textAnchor="middle" fill={isLight ? "#334155" : "#94a3b8"} fontSize="11">
                Propeller
              </text>
            </g>

            {/* 5. GPS MODULE */}
            <g onClick={() => setSelectedId("gps")} className="cursor-pointer">
              <rect
                x="650"
                y="215"
                width="70"
                height="70"
                rx="4"
                fill="#15803d"
                stroke={selectedId === "gps" ? "#a855f7" : "#166534"}
                strokeWidth="2"
              />
              <rect x="665" y="230" width="40" height="40" rx="3" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
              <rect x="675" y="240" width="20" height="20" rx="2" fill="#cbd5e1" />
              <text x="735" y="245" fill={isLight ? "#1e293b" : "#f8fafc"} fontSize="11" fontWeight="bold">
                GPS
              </text>
              <text x="735" y="260" fill={isLight ? "#1e293b" : "#f8fafc"} fontSize="11" fontWeight="bold">
                Module
              </text>
            </g>

            {/* 6. RECEIVER & 2.4GHZ ANTENNA */}
            <g onClick={() => setSelectedId("receiver")} className="cursor-pointer">
              <rect
                x="740"
                y="90"
                width="120"
                height="75"
                rx="4"
                fill="#94a3b8"
                stroke={selectedId === "receiver" ? "#38bdf8" : "#64748b"}
                strokeWidth="2"
              />
              <text x="800" y="132" textAnchor="middle" fill="#0f172a" fontSize="13" fontStyle="italic" fontWeight="bold">
                Receiver
              </text>
              <text x="800" y="185" textAnchor="middle" fill={isLight ? "#334155" : "#94a3b8"} fontSize="11">
                Receiver
              </text>

              {/* 2.4GHz Antenna Cable & Concentric Broadcast Circles */}
              <path d="M 860 127 L 880 127 L 880 200" stroke="#0f172a" strokeWidth="1.5" fill="none" />
              <circle cx="880" cy="225" r="5" fill="#f8fafc" stroke="#0f172a" strokeWidth="1.5" />
              <circle cx="880" cy="225" r="14" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="3 2" />
              <circle cx="880" cy="225" r="22" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="4 3" />
              <text x="880" y="265" textAnchor="middle" fill={isLight ? "#334155" : "#94a3b8"} fontSize="10" fontWeight="bold">
                2.4 GHz Antenna
              </text>
            </g>

            {/* 7. GIMBAL (Roll & Tilt Servos) */}
            <g onClick={() => setSelectedId("gimbal")} className="cursor-pointer">
              {/* Roll Servo */}
              <rect x="585" y="280" width="30" height="20" rx="3" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />
              <text x="600" y="275" textAnchor="middle" fill={isLight ? "#334155" : "#94a3b8"} fontSize="9">
                Roll Servo
              </text>

              {/* Tilt Servo */}
              <rect x="670" y="325" width="20" height="30" rx="3" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />
              <text x="705" y="342" fill={isLight ? "#334155" : "#94a3b8"} fontSize="9">
                Tilt Servo
              </text>

              {/* Gimbal Frame / Bracket */}
              <polygon
                points="570,305 665,305 675,370 560,370"
                fill="#94a3b8"
                stroke="#475569"
                strokeWidth="1.5"
              />
              <text x="618" y="345" textAnchor="middle" fill="#0f172a" fontSize="12" fontStyle="italic" fontWeight="bold">
                Gimbal
              </text>
            </g>
          </svg>
        </div>

        {/* Right: Technical Inspector & Electrical Diagnostics Panel */}
        <div
          className={`lg:col-span-4 p-5 rounded-2xl border shadow-xl flex flex-col gap-4 ${
            isLight
              ? "bg-white border-slate-200 shadow-slate-200/60"
              : "bg-[#090c12] border-white/10 shadow-2xl"
          }`}
        >
          {/* Header of selected component */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/30 text-sky-500 font-bold uppercase">
                {detail.category}
              </span>
              <span className="text-xs font-mono text-emerald-500 flex items-center gap-1 font-semibold">
                <CheckCircle2 size={13} /> Active Node
              </span>
            </div>
            <h3 className="text-base font-bold mt-2">{detail.title}</h3>
          </div>

          {/* Voltage & Protocol Badges */}
          <div className="grid grid-cols-1 gap-2 text-xs">
            <div className={`p-2.5 rounded-xl border ${isLight ? "bg-slate-50 border-slate-200" : "bg-white/5 border-white/10"}`}>
              <div className="text-[10px] uppercase font-mono font-bold text-amber-500">Operating Voltage</div>
              <div className="font-semibold mt-0.5">{detail.voltage}</div>
            </div>

            <div className={`p-2.5 rounded-xl border ${isLight ? "bg-slate-50 border-slate-200" : "bg-white/5 border-white/10"}`}>
              <div className="text-[10px] uppercase font-mono font-bold text-sky-500">Signal Protocol &amp; Bus</div>
              <div className="font-semibold mt-0.5">{detail.protocol}</div>
            </div>
          </div>

          {/* Description */}
          <div className={`text-xs leading-relaxed ${isLight ? "text-slate-600" : "text-slate-300"}`}>
            {detail.description}
          </div>

          {/* Pinout & Interconnect Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Pinout &amp; Terminal Configuration
            </h4>
            <div className="space-y-1.5">
              {detail.pinout.map((pin, pIdx) => (
                <div
                  key={pIdx}
                  className={`text-[11px] p-2 rounded-lg border font-mono ${
                    isLight
                      ? "bg-slate-50 border-slate-200 text-slate-700"
                      : "bg-black/30 border-white/5 text-slate-300"
                  }`}
                >
                  {pin}
                </div>
              ))}
            </div>
          </div>

          {/* Engineering Pro-Tip */}
          <div className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs ${
            isLight
              ? "bg-amber-50 border-amber-200 text-amber-900"
              : "bg-amber-500/10 border-amber-500/20 text-amber-300"
          }`}>
            <AlertTriangle size={15} className="shrink-0 text-amber-500 mt-0.5" />
            <div>
              <span className="font-bold">Safety Rule:</span> Always disconnect propeller blades before connecting USB to the flight controller or testing motor commutation signals on the bench.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
