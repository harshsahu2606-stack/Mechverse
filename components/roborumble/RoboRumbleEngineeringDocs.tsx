"use client";

import { FileText, Printer, Zap, GitCommit, ShieldAlert, Activity, Compass } from "lucide-react";

export default function RoboRumbleEngineeringDocs() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-8 text-gray-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-300 font-mono text-[11px] uppercase">
            DOCUMENTATION REF: ROBO-RUMBLE-SPEC-REV1
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Robo Rumble Engineering Docs &amp; Schematics
          </h2>
          <p className="text-xs text-gray-400">
            Comprehensive vehicle specifications, circuit diagrams, traction models, and low-voltage electrical safety guidelines.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs font-semibold transition self-start sm:self-auto"
        >
          <Printer size={14} />
          <span>Print / Export PDF</span>
        </button>
      </div>

      {/* 1. Technical Data Sheet Table */}
      <div className="rounded-2xl border border-white/10 bg-[#111318] p-5 sm:p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <FileText size={16} className="text-orange-400" />
          <span>1. Combat Vehicle Specification Matrix</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[10px] uppercase font-mono text-gray-400">Competition Category</span>
            <div className="font-bold text-white">Tabletop RC Combat Class (&lt; 800 grams)</div>
          </div>
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[10px] uppercase font-mono text-gray-400">Actuation Standard</span>
            <div className="font-bold text-white">4WD Quad Permanent Magnet DC Geared Motors</div>
          </div>
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[10px] uppercase font-mono text-gray-400">Operating Voltage</span>
            <div className="font-bold text-white">6.0V (4x AA) or 7.4V (2S Li-ion 2000 mAh)</div>
          </div>
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[10px] uppercase font-mono text-gray-400">Motor Driver Type</span>
            <div className="font-bold text-white">Dual H-Bridge MOSFET / L298N (2A peak per channel)</div>
          </div>
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[10px] uppercase font-mono text-gray-400">Maximum Push Force</span>
            <div className="font-bold text-white">14.8 N (Striker) • 24.2 N (Titan)</div>
          </div>
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[10px] uppercase font-mono text-gray-400">Wireless Control Link</span>
            <div className="font-bold text-white">2.4GHz BLE 5.0 (ESP32) or FlySky 6CH RF Receiver</div>
          </div>
        </div>
      </div>

      {/* 2. Low-Voltage Electrical Circuit Schematic */}
      <div className="rounded-2xl border border-white/10 bg-[#111318] p-5 sm:p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Zap size={16} className="text-yellow-400" />
          <span>2. Low-Voltage DC Electrical Circuit Schematic</span>
        </h3>

        <div className="p-5 rounded-xl bg-black/70 border border-white/10 font-mono text-xs text-gray-300 overflow-x-auto">
          <pre className="leading-relaxed">
{`+-------------------------[ (+) 7.4V DC BATTERY PACK ]-------------------------+
|                                                                               |
+--->[ SPST SWITCH ]--->[ L298N VMS (Power In) ]                                |
                        [ L298N GND (Common) ]<--------(-) Battery Return-------+
                                |
             +------------------+------------------+
             |                                     |
    [ OUT1 & OUT2 (Left) ]              [ OUT3 & OUT4 (Right) ]
             |                                     |
   ( M1 )====( M2 ) Left Motors         ( M3 )====( M4 ) Right Motors
   (Parallel 4WD Coupling)              (Parallel 4WD Coupling)

   [ L298N 5V Out ]------------>[ ESP32 / Arduino 5V In ]
   [ L298N GND ]---------------->[ ESP32 / Arduino GND ]
   [ IN1 - IN4 (Logic) ]<-------[ PWM Logic Pins D12, D13, D14, D27 ]`}
          </pre>
        </div>

        <p className="text-xs text-gray-400 leading-relaxed">
          <strong>Safety Note:</strong> This low-voltage circuit operates strictly at 6.0V – 7.4V DC. It does NOT produce electrical shock hazards. Never attempt to power the vehicle directly from 230V/110V AC household outlets.
        </p>
      </div>

      {/* 3. Physics Equation Reference */}
      <div className="rounded-2xl border border-white/10 bg-[#111318] p-5 sm:p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <GitCommit size={16} className="text-sky-400" />
          <span>3. Mathematical Combat Dynamics Model</span>
        </h3>

        <div className="space-y-3 text-xs text-gray-300 leading-relaxed">
          <p>
            Maximum pushing force is governed by Coulomb static friction between the tire tread and arena floor:
          </p>
          <div className="p-3 rounded-lg bg-black/40 border border-white/5 font-mono text-white text-center text-sm font-bold">
            F_push(max) = μ · m · g
          </div>
          <p className="text-gray-400">
            Where <em>μ</em> is tire friction coefficient (0.90 for ribbed rubber), <em>m</em> is vehicle mass in kilograms, and <em>g</em> is gravitational acceleration (9.81 m/s²).
          </p>
        </div>
      </div>
    </div>
  );
}
