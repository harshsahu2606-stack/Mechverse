"use client";

import React, { useState } from "react";
import {
  Zap,
  BatteryCharging,
  Cpu,
  Layers,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Activity,
  CheckCircle2,
  Table,
  Filter,
  Eye,
  X,
} from "lucide-react";
import { MachineId, AppTheme } from "@/types/machine";
import { ELECTRONICS_DATA_MAP, MachineElectronicsData } from "@/data/electronicsData";

interface UniversalElectronicWorkbenchProps {
  machineId: MachineId;
  theme?: AppTheme;
  onClose: () => void;
}

export default function UniversalElectronicWorkbench({
  machineId,
  theme = "dark",
  onClose,
}: UniversalElectronicWorkbenchProps) {
  const isLight = theme === "light";
  const [activeTab, setActiveTab] = useState<"schematic" | "pinout" | "safety">("schematic");
  const [wireFilter, setWireFilter] = useState<string>("all");
  const [hoveredNet, setHoveredNet] = useState<string | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  // Fallback to aero-450 if ID not directly found
  const data: MachineElectronicsData =
    ELECTRONICS_DATA_MAP[machineId] || ELECTRONICS_DATA_MAP["aero-450"];

  const filteredWires =
    wireFilter === "all"
      ? data.wires
      : data.wires.filter((w) => w.type === wireFilter);

  return (
    <div className="absolute inset-0 z-30 flex flex-col bg-[#07090e]/95 backdrop-blur-xl text-white pointer-events-auto overflow-hidden animate-in fade-in duration-200">
      {/* ================= TOP WORKBENCH CONTROL BAR ================= */}
      <div className="px-4 sm:px-6 py-3 border-b border-white/10 bg-[#0a0d14]/90 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Zap size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-wider uppercase text-amber-400 font-bold">
                ELECTRONIC ARCHITECTURE & SCHEMATICS
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
              {data.name}
            </h2>
          </div>
        </div>

        {/* Center: View Switcher Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-black/50 border border-white/10 text-xs font-mono">
          <button
            onClick={() => setActiveTab("schematic")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === "schematic"
                ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Activity size={13} />
            <span>Interactive Schematic</span>
          </button>

          <button
            onClick={() => setActiveTab("pinout")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === "pinout"
                ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Table size={13} />
            <span>Pinout Mapping</span>
          </button>

          <button
            onClick={() => setActiveTab("safety")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === "safety"
                ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <ShieldCheck size={13} />
            <span>Power & Safety</span>
          </button>
        </div>

        {/* Right: Exit Electronic Mode Button */}
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/15 text-xs font-mono text-neutral-300 hover:text-white transition cursor-pointer"
        >
          <X size={14} />
          <span>Exit Electronic Mode</span>
        </button>
      </div>

      {/* ================= MAIN CONTENT VIEWPORT ================= */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* ================= TAB 1: INTERACTIVE SVG SCHEMATIC ================= */}
        {activeTab === "schematic" && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Filter Pills & Voltage Rails Header */}
            <div className="px-4 py-2 bg-black/40 border-b border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono shrink-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-neutral-400 text-[11px] mr-1 flex items-center gap-1">
                  <Filter size={12} /> Trace:
                </span>
                {[
                  { id: "all", label: "All Circuits" },
                  { id: "power", label: "Power & Battery" },
                  { id: "pwm", label: "Motor PWM" },
                  { id: "data", label: "Sensors & Data" },
                  { id: "ground", label: "Common Ground" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setWireFilter(f.id)}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition cursor-pointer ${
                      wireFilter === f.id
                        ? "bg-white/20 text-white border border-white/30"
                        : "bg-white/5 text-neutral-400 hover:text-white border border-transparent"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Live Active Net Display */}
              <div className="text-[11px] text-neutral-400 flex items-center gap-2">
                <span>Active Net:</span>
                <span className="text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {hoveredNet || "Hover wire or component to trace"}
                </span>
              </div>
            </div>

            {/* Interactive Schematic Visual Canvas */}
            <div className="flex-1 relative overflow-auto bg-[#05070c] p-4 flex items-center justify-center">
              {/* Technical CAD Grid Background */}
              <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  backgroundImage: `
                    radial-gradient(circle, #38bdf8 1px, transparent 1px),
                    linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
                  `,
                  backgroundSize: "40px 40px, 20px 20px, 20px 20px",
                }}
              />

              {/* Schematic Diagram Container */}
              <div className="relative w-full max-w-[1100px] h-[480px] shrink-0 border border-white/10 rounded-2xl bg-[#080b12]/90 shadow-2xl p-4 overflow-hidden select-none">
                {/* SVG Interconnect Signal Wires */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                  <defs>
                    <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity="0.8" />
                    </linearGradient>
                  </defs>

                  {filteredWires.map((wire) => {
                    const isHovered = hoveredNet === wire.netName;
                    return (
                      <g key={wire.id}>
                        {/* Glow halo on hover */}
                        {isHovered && (
                          <path
                            d={wire.path}
                            fill="none"
                            stroke={wire.color}
                            strokeWidth="6"
                            strokeOpacity="0.4"
                            strokeLinecap="round"
                          />
                        )}
                        {/* Main Signal Trace */}
                        <path
                          d={wire.path}
                          fill="none"
                          stroke={wire.color}
                          strokeWidth={isHovered ? "2.5" : "1.8"}
                          strokeDasharray={wire.type === "data" ? "4 3" : "none"}
                          strokeLinecap="round"
                          className="transition-all duration-200"
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* Schematic IC & Component Blocks */}
                {data.blocks.map((block) => {
                  const isSelected = selectedBlockId === block.id;

                  return (
                    <div
                      key={block.id}
                      onClick={() => setSelectedBlockId(isSelected ? null : block.id)}
                      onMouseEnter={() => setHoveredNet(`${block.title} (${block.subtitle})`)}
                      onMouseLeave={() => setHoveredNet(null)}
                      style={{
                        position: "absolute",
                        left: `${block.x}px`,
                        top: `${block.y}px`,
                        width: `${block.width}px`,
                        minHeight: `${block.height}px`,
                      }}
                      className={`rounded-xl border backdrop-blur-md p-2.5 transition-all duration-200 cursor-pointer shadow-lg flex flex-col justify-between ${
                        isSelected
                          ? "bg-[#141b2d] border-amber-400 ring-2 ring-amber-400/40 z-20 scale-102"
                          : "bg-[#0b0f19] border-white/15 hover:border-white/30 z-10"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span
                            className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded"
                            style={{
                              backgroundColor: `${block.color}20`,
                              color: block.color,
                            }}
                          >
                            {block.category}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-white leading-tight">
                          {block.title}
                        </div>
                        <div className="text-[10px] text-neutral-400 leading-tight mt-0.5 font-mono">
                          {block.subtitle}
                        </div>
                      </div>

                      {/* Component Pins Readout */}
                      <div className="mt-2 pt-1.5 border-t border-white/10 flex flex-wrap gap-1">
                        {block.pins.map((pin) => (
                          <span
                            key={pin.id}
                            className="text-[8px] font-mono text-neutral-300 bg-white/5 px-1 py-0.5 rounded border border-white/5"
                          >
                            {pin.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: PINOUT INTERCONNECT TABLE ================= */}
        {activeTab === "pinout" && (
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Table className="text-amber-400" size={18} />
                  <span>Hardware Pinout & Signal Mapping</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Direct pin assignments linking the microcontroller to speed controllers, sensors, and peripherals.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 overflow-hidden bg-[#0a0d14]">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-white/5 text-neutral-400 uppercase text-[10px] border-b border-white/10">
                  <tr>
                    <th className="p-3">MCU Pin / Port</th>
                    <th className="p-3">Target Component</th>
                    <th className="p-3">Target Pin</th>
                    <th className="p-3">Signal Type</th>
                    <th className="p-3">Voltage Domain</th>
                    <th className="p-3">Function & Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-neutral-300">
                  {data.pinouts.map((pin, i) => (
                    <tr key={i} className="hover:bg-white/[0.03] transition">
                      <td className="p-3 font-bold text-sky-400">{pin.mcuPin}</td>
                      <td className="p-3 text-white font-medium">{pin.component}</td>
                      <td className="p-3 text-amber-300">{pin.componentPin}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px]">
                          {pin.signalType}
                        </span>
                      </td>
                      <td className="p-3 text-emerald-400">{pin.voltage}</td>
                      <td className="p-3 text-neutral-400 font-sans text-xs">{pin.functionDesc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 3: POWER & SAFETY DIRECTIVES ================= */}
        {activeTab === "safety" && (
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
            {/* Battery Power System Overview */}
            <div className="p-4 sm:p-5 rounded-2xl border border-white/10 bg-[#0a0d14] space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase font-mono tracking-wider text-amber-400">
                <BatteryCharging size={16} />
                <span>Electrical Power Bus Specifications</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-[10px] text-neutral-400 uppercase">Power Source</div>
                  <div className="text-sm font-bold text-white mt-1">{data.powerSystem.battery}</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-[10px] text-neutral-400 uppercase">Nominal Operating Voltage</div>
                  <div className="text-sm font-bold text-amber-400 mt-1">{data.powerSystem.nominalVoltage}</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-[10px] text-neutral-400 uppercase">Peak Current Capability</div>
                  <div className="text-sm font-bold text-emerald-400 mt-1">{data.powerSystem.maxDischarge}</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-[10px] text-neutral-400 uppercase">Voltage Regulation</div>
                  <div className="text-sm font-bold text-sky-400 mt-1">{data.powerSystem.regulation}</div>
                </div>
              </div>
            </div>

            {/* Voltage Domain Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase text-neutral-400 font-bold tracking-wider">
                Regulated Power Rails & Safety Domains
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {data.voltageRails.map((rail, i) => (
                  <div key={i} className="p-3 rounded-xl border border-white/10 bg-[#0a0d14] space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: rail.color }} />
                      <span className="text-xs font-mono font-bold text-white">{rail.rail}</span>
                    </div>
                    <div className="text-xs font-mono text-amber-300 font-semibold">{rail.voltage}</div>
                    <div className="text-[11px] text-neutral-400 leading-tight">{rail.role}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Critical Safety Rules */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase text-red-400 font-bold tracking-wider flex items-center gap-1.5">
                <AlertTriangle size={14} />
                <span>Critical Hardware Safety Directives</span>
              </h4>

              <div className="space-y-2.5">
                {data.safetyDirectives.map((rule, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-red-500/20 bg-red-950/15 flex items-start gap-3"
                  >
                    <span className="w-5 h-5 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-neutral-200 leading-relaxed">{rule}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= RIGHT DETAIL SIDEBAR ================= */}
        <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 bg-[#0a0d14]/80 p-4 flex flex-col justify-between shrink-0 space-y-4">
          <div className="space-y-4">
            <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-semibold">
              Power & Regulation
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1.5 text-xs font-mono">
              <div className="text-[10px] text-neutral-400 uppercase">Main Battery Bus</div>
              <div className="text-white font-bold">{data.powerSystem.battery}</div>
              <div className="text-amber-400 text-[11px]">{data.powerSystem.nominalVoltage}</div>
            </div>

            <div className="space-y-2">
              <div className="text-[11px] font-mono text-neutral-400 uppercase">Voltage Rails</div>
              {data.voltageRails.map((rail, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between text-xs font-mono"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: rail.color }} />
                    <span className="text-neutral-300 font-semibold">{rail.rail}</span>
                  </div>
                  <span className="text-neutral-400 text-[11px]">{rail.voltage}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-mono text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Return to 3D CAD Studio</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
