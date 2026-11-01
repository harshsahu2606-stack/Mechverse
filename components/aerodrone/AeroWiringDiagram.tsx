"use client";

import React, { useState } from "react";
import { Zap, Info, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function AeroWiringDiagram() {
  const [selectedPin, setSelectedPin] = useState<string | null>(null);

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6 text-gray-200">
      <div>
        <h2 className="text-2xl font-black text-white flex items-center gap-2">
          <Zap className="text-emerald-400" size={24} />
          <span>Interactive Electrical Schematic & Wiring Interconnect</span>
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Complete high-current DC power bus and low-voltage signal architecture. Click on any module to inspect pinouts and polarity.
        </p>
      </div>

      {/* Visual SVG Schematic Container */}
      <div className="bg-[#090d14] border border-white/10 rounded-2xl p-4 sm:p-6 overflow-x-auto shadow-2xl">
        <svg viewBox="0 0 900 550" className="w-full min-w-[700px] text-xs font-mono select-none">
          {/* Background Grid */}
          <defs>
            <pattern id="wiring-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#ffffff08" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="900" height="550" fill="url(#wiring-grid)" rx="16" />

          {/* Module 1: 3S LiPo Battery */}
          <g
            transform="translate(40, 220)"
            className="cursor-pointer"
            onClick={() => setSelectedPin("battery")}
          >
            <rect width="130" height="90" rx="8" fill="#1b2533" stroke="#0ea5e9" strokeWidth="2" />
            <text x="65" y="30" fill="#ffffff" fontWeight="bold" textAnchor="middle">
              3S LiPo Battery
            </text>
            <text x="65" y="50" fill="#94a3b8" fontSize="10" textAnchor="middle">
              11.1V 4200mAh 35C
            </text>
            <text x="65" y="70" fill="#38bdf8" fontSize="10" textAnchor="middle">
              XT60 Connector
            </text>
          </g>

          {/* Wire: Battery to Power Module */}
          <path d="M 170 255 L 230 255" stroke="#ef4444" strokeWidth="3" />
          <path d="M 170 275 L 230 275" stroke="#000000" strokeWidth="3" />

          {/* Module 2: Power Module (Current Sensor & BEC) */}
          <g
            transform="translate(230, 220)"
            className="cursor-pointer"
            onClick={() => setSelectedPin("power-module")}
          >
            <rect width="110" height="90" rx="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
            <text x="55" y="30" fill="#ffffff" fontWeight="bold" textAnchor="middle">
              Power Module
            </text>
            <text x="55" y="50" fill="#fbbf24" fontSize="10" textAnchor="middle">
              5.3V 2.25A BEC
            </text>
            <text x="55" y="70" fill="#94a3b8" fontSize="10" textAnchor="middle">
              V/I Sensor Rail
            </text>
          </g>

          {/* Wire: Power Module to PDB */}
          <path d="M 340 255 L 400 255" stroke="#ef4444" strokeWidth="3" />
          <path d="M 340 275 L 400 275" stroke="#000000" strokeWidth="3" />

          {/* Wire: Power Module 6-pin cable to Pixhawk POWER port */}
          <path d="M 285 220 L 285 140 L 460 140" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 2" />
          <text x="360" y="132" fill="#fbbf24" fontSize="10">
            6-pin DF13 (V, I, 5V, GND)
          </text>

          {/* Module 3: Pixhawk 2.4.8 Autopilot (Center Top) */}
          <g
            transform="translate(460, 80)"
            className="cursor-pointer"
            onClick={() => setSelectedPin("pixhawk")}
          >
            <rect width="180" height="150" rx="10" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
            <text x="90" y="25" fill="#10b981" fontWeight="bold" textAnchor="middle">
              Pixhawk 2.4.8
            </text>
            <text x="90" y="42" fill="#94a3b8" fontSize="10" textAnchor="middle">
              32-Bit Dual IMU Cortex-M4
            </text>

            {/* Ports on Pixhawk */}
            <rect x="10" y="60" width="45" height="18" rx="3" fill="#1e293b" />
            <text x="32" y="73" fill="#ffffff" fontSize="9" textAnchor="middle">
              POWER
            </text>

            <rect x="65" y="60" width="45" height="18" rx="3" fill="#1e293b" />
            <text x="87" y="73" fill="#ffffff" fontSize="9" textAnchor="middle">
              GPS
            </text>

            <rect x="120" y="60" width="50" height="18" rx="3" fill="#1e293b" />
            <text x="145" y="73" fill="#ffffff" fontSize="9" textAnchor="middle">
              RC IN
            </text>

            {/* Main Out 1..4 on bottom of Pixhawk */}
            <rect x="20" y="110" width="140" height="24" rx="4" fill="#1e293b" />
            <text x="90" y="126" fill="#10b981" fontSize="9" textAnchor="middle" fontWeight="bold">
              MAIN OUT: [M1] [M2] [M3] [M4]
            </text>
          </g>

          {/* Module 4: Integrated PDB (Center Bottom) */}
          <g
            transform="translate(400, 290)"
            className="cursor-pointer"
            onClick={() => setSelectedPin("pdb")}
          >
            <rect width="140" height="90" rx="8" fill="#141c26" stroke="#ef4444" strokeWidth="2" />
            <text x="70" y="30" fill="#ffffff" fontWeight="bold" textAnchor="middle">
              F450 PDB Plate
            </text>
            <text x="70" y="50" fill="#ef4444" fontSize="10" textAnchor="middle">
              11.1V Power Bus
            </text>
            <text x="70" y="70" fill="#94a3b8" fontSize="10" textAnchor="middle">
              4x ESC Solder Pads
            </text>
          </g>

          {/* 4 ESC Modules */}
          {/* ESC 1 (Front-Right) */}
          <g transform="translate(680, 60)" onClick={() => setSelectedPin("esc1")}>
            <rect width="90" height="45" rx="6" fill="#1e293b" stroke="#38bdf8" />
            <text x="45" y="22" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
              ESC 1 (30A)
            </text>
            <text x="45" y="36" fill="#38bdf8" fontSize="9" textAnchor="middle">
              M1 FR (CCW)
            </text>
          </g>

          {/* ESC 2 (Front-Left) */}
          <g transform="translate(680, 140)" onClick={() => setSelectedPin("esc2")}>
            <rect width="90" height="45" rx="6" fill="#1e293b" stroke="#38bdf8" />
            <text x="45" y="22" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
              ESC 2 (30A)
            </text>
            <text x="45" y="36" fill="#38bdf8" fontSize="9" textAnchor="middle">
              M2 FL (CW)
            </text>
          </g>

          {/* ESC 3 (Rear-Left) */}
          <g transform="translate(680, 220)" onClick={() => setSelectedPin("esc3")}>
            <rect width="90" height="45" rx="6" fill="#1e293b" stroke="#38bdf8" />
            <text x="45" y="22" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
              ESC 3 (30A)
            </text>
            <text x="45" y="36" fill="#38bdf8" fontSize="9" textAnchor="middle">
              M3 RL (CCW)
            </text>
          </g>

          {/* ESC 4 (Rear-Right) */}
          <g transform="translate(680, 300)" onClick={() => setSelectedPin("esc4")}>
            <rect width="90" height="45" rx="6" fill="#1e293b" stroke="#38bdf8" />
            <text x="45" y="22" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
              ESC 4 (30A)
            </text>
            <text x="45" y="36" fill="#38bdf8" fontSize="9" textAnchor="middle">
              M4 RR (CW)
            </text>
          </g>

          {/* Signal wires: Pixhawk Main Out to ESCs */}
          <path d="M 640 195 L 660 195 L 660 82 L 680 82" stroke="#10b981" strokeWidth="1.5" />
          <path d="M 640 198 L 660 198 L 660 162 L 680 162" stroke="#10b981" strokeWidth="1.5" />
          <path d="M 640 201 L 660 201 L 660 242 L 680 242" stroke="#10b981" strokeWidth="1.5" />
          <path d="M 640 204 L 660 204 L 660 322 L 680 322" stroke="#10b981" strokeWidth="1.5" />

          {/* Power wires: PDB to 4 ESCs */}
          <path d="M 540 335 L 665 335 L 665 95 L 680 95" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" />
          <path d="M 540 338 L 665 338 L 665 175 L 680 175" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" />
          <path d="M 540 341 L 665 341 L 665 255 L 680 255" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" />
          <path d="M 540 344 L 665 344 L 665 335 L 680 335" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" />

          {/* Module 5: GPS / Compass (Top Right) */}
          <g transform="translate(460, 430)" onClick={() => setSelectedPin("gps")}>
            <rect width="130" height="60" rx="8" fill="#1e293b" stroke="#8b5cf6" strokeWidth="2" />
            <text x="65" y="25" fill="#ffffff" fontWeight="bold" textAnchor="middle">
              NEO-M8N GPS
            </text>
            <text x="65" y="45" fill="#a78bfa" fontSize="10" textAnchor="middle">
              Compass (I2C) + UART
            </text>
          </g>

          {/* Wire: Pixhawk GPS to GPS Module */}
          <path d="M 545 230 L 545 430" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="4 2" />
        </svg>
      </div>

      {/* Selected Module Detail Banner */}
      <div className="bg-[#0e131b] border border-white/10 rounded-xl p-4 flex items-start gap-3">
        <Info size={18} className="text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-gray-300">
          <span className="font-bold text-white uppercase font-mono">
            {selectedPin ? `Module: ${selectedPin.toUpperCase()}` : "Wiring Verification Directive"}
          </span>
          <p className="leading-relaxed">
            {selectedPin === "battery" &&
              "Battery connector uses standard XT60 with 12 AWG silicone wire. Never short battery terminals. Always plug into Power Module, not directly to PDB without current sensor."}
            {selectedPin === "power-module" &&
              "Provides stable 5.3V clean power to Pixhawk and reads pack voltage & total amp draw using a Hall effect shunt resistor."}
            {selectedPin === "pixhawk" &&
              "Pixhawk Main Out 1..4 connects to ESC signal leads (White=Signal, Black=GND). Never connect 5V red BEC wire if using Opto ESCs."}
            {selectedPin === "pdb" &&
              "The bottom glass-fiber plate has integrated thick copper traces. Solder 4 ESC pairs with clean 60/40 rosin solder at 380°C."}
            {!selectedPin &&
              "Click on any module above to view specific electrical specifications, connector pinouts, and polarity safety precautions."}
          </p>
        </div>
      </div>
    </div>
  );
}
