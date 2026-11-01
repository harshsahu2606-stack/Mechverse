"use client";

import { FileText, Printer, Download, ShieldCheck, Zap, GitCommit, CheckCircle2 } from "lucide-react";

export default function RobotEngineeringDocs() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-8 text-gray-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-300 font-mono text-[11px] uppercase">
            DOCUMENTATION REF: STRIDER-X1-SPEC-REV2
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Engineering Documentation &amp; Schematics
          </h2>
          <p className="text-xs text-gray-400">
            Comprehensive technical specifications, kinematic equations, and circuit schematics.
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
          <span>1. Technical Specification Sheet</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[10px] uppercase font-mono text-gray-400">Locomotion Category</span>
            <div className="font-bold text-white">Wheel-less Bio-Inspired Mechanical Linkage</div>
          </div>
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[10px] uppercase font-mono text-gray-400">Actuator Mechanism</span>
            <div className="font-bold text-white">Permanent Magnet DC Motor + 1:48 Spur Reduction</div>
          </div>
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[10px] uppercase font-mono text-gray-400">Power Supply Specification</span>
            <div className="font-bold text-white">3.0V DC (2x 1.5V Alkaline AA in series) • 450mA typical</div>
          </div>
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[10px] uppercase font-mono text-gray-400">Stride Geometry</span>
            <div className="font-bold text-white">R_crank = 15mm • L_rod = 45mm • Lift = 12mm</div>
          </div>
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[10px] uppercase font-mono text-gray-400">Cadence &amp; Velocity</span>
            <div className="font-bold text-white">60 RPM crank speed → 2.8 cm/second linear progression (28mm stride)</div>
          </div>
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[10px] uppercase font-mono text-gray-400">Total All-Up Weight</span>
            <div className="font-bold text-white">165 grams (including dual AA battery payload)</div>
          </div>
        </div>
      </div>

      {/* 2. Electrical Circuit Schematic */}
      <div className="rounded-2xl border border-white/10 bg-[#111318] p-5 sm:p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Zap size={16} className="text-yellow-400" />
          <span>2. Electrical Circuit Schematic (Low Voltage DC)</span>
        </h3>

        <div className="p-5 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-gray-300 overflow-x-auto">
          <pre className="leading-relaxed">
{`+-------------------------[ (+) Red Wire ]---------------------------+
|                                                                    |
|    +----------------+                                              |
+--->| SPST SWITCH    |--->[ Terminal A ]--> ( M ) DC MOTOR          |
     | (ON / OFF)     |                      ( 3V - 6V )             |
     +----------------+                      [ Terminal B ]          |
                                                   |                 |
+-------------------------[ (-) Black Wire ]-------+                 |
|                                                                    |
+----[- 1.5V AA Cell +]----[- 1.5V AA Cell +]------------------------+
                ( 3.0V DC BATTERY PACK )`}
          </pre>
        </div>

        <p className="text-xs text-gray-400 leading-relaxed">
          <strong>Safety Note:</strong> This low-voltage circuit operates strictly at 3.0V DC. It does NOT produce electrical shock hazards. Never attempt to power the motor directly from 230V/110V AC wall outlets without a certified, galvanically isolated DC adapter.
        </p>
      </div>

      {/* 3. Kinematic Four-Bar Equation Reference */}
      <div className="rounded-2xl border border-white/10 bg-[#111318] p-5 sm:p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <GitCommit size={16} className="text-sky-400" />
          <span>3. Mathematical Kinematic Model (Grashof Criterion)</span>
        </h3>

        <div className="space-y-2 text-xs text-gray-300 leading-relaxed">
          <p>
            For a four-bar mechanism to have continuous 360° input rotation (Crank-Rocker behavior), it must satisfy the <strong>Grashof inequality</strong>:
          </p>
          <div className="p-3 rounded-lg bg-black/40 border border-white/5 font-mono text-white text-center text-sm font-bold">
            s + l &le; p + q
          </div>
          <p className="text-gray-400">
            Where <em>s</em> is the shortest link (Crank: 15 mm), <em>l</em> is the longest link (Connecting Rod: 45 mm), and <em>p, q</em> are the intermediate links (Chassis Ground Pitch: 42 mm, Hip-to-Knee Rocker: 32 mm).
          </p>
          <p className="font-mono text-green-400 text-[11px]">
            Check: 15 + 45 = 60 mm &le; 42 + 32 = 74 mm &rarr; Fully Grashof compliant (Non-binding 360&deg; crank rotation)!
          </p>
        </div>
      </div>
    </div>
  );
}
