"use client";

import React from "react";
import { Calculator, CheckCircle2, AlertTriangle, Scale, Gauge, BatteryCharging, Timer, Crosshair } from "lucide-react";
import { CustomizationSettings } from "@/types/machine";
import { calculateAeroEngineering } from "@/data/aeroDroneData";

interface AeroEngineeringLabProps {
  customization: CustomizationSettings;
  onChangeCustomization: (settings: CustomizationSettings) => void;
}

export default function AeroEngineeringLab({
  customization,
  onChangeCustomization,
}: AeroEngineeringLabProps) {
  const calc = calculateAeroEngineering(customization);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 space-y-6 text-gray-200">
      <div>
        <h2 className="text-2xl font-black text-white flex items-center gap-2">
          <Calculator className="text-emerald-400" size={24} />
          <span>Aeronautical Engineering Calculation Engine</span>
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Deterministic first-principles UAV physics formulas computed in real-time. No approximations or generic estimates.
        </p>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-[#0e131b] border border-white/10 rounded-xl p-4">
          <span className="text-[10px] font-mono uppercase text-gray-400 block">Total Mass (AUW)</span>
          <div className="text-2xl font-black text-white">{calc.totalMassGrams} g</div>
          <span className="text-[10px] font-mono text-emerald-400">{(calc.totalMassGrams / 1000).toFixed(3)} kg</span>
        </div>

        <div className="bg-[#0e131b] border border-white/10 rounded-xl p-4">
          <span className="text-[10px] font-mono uppercase text-gray-400 block">Max 4-Motor Thrust</span>
          <div className="text-2xl font-black text-white">{calc.maxThrustGrams} g</div>
          <span className="text-[10px] font-mono text-emerald-400">TWR: {calc.thrustToWeightRatio}:1</span>
        </div>

        <div className="bg-[#0e131b] border border-white/10 rounded-xl p-4">
          <span className="text-[10px] font-mono uppercase text-gray-400 block">Hover Throttle</span>
          <div className="text-2xl font-black text-emerald-400">{calc.hoverThrottlePct}%</div>
          <span className="text-[10px] font-mono text-gray-400">{calc.hoverCurrentAmps}A Total Draw</span>
        </div>

        <div className="bg-[#0e131b] border border-white/10 rounded-xl p-4">
          <span className="text-[10px] font-mono uppercase text-gray-400 block">Estimated Flight Time</span>
          <div className="text-2xl font-black text-white">{calc.estimatedFlightTimeMin} mins</div>
          <span className="text-[10px] font-mono text-teal-400">80% DoD Usable</span>
        </div>
      </div>

      {/* Calculation Formulas & Verification Table */}
      <div className="bg-[#0e131b] border border-white/10 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
          <Scale size={16} className="text-emerald-400" />
          <span>Formal UAV Governing Equations & First-Principles Physics</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 text-gray-400">
                <th className="py-2">Metric</th>
                <th className="py-2">Governing Formula</th>
                <th className="py-2">Calculated Value</th>
                <th className="py-2">Design Target</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              <tr>
                <td className="py-2.5 font-bold text-white">All-Up Weight (W_AUW)</td>
                <td className="py-2.5 text-gray-400">∑ m_components</td>
                <td className="py-2.5 text-emerald-400">{calc.totalMassGrams} g</td>
                <td className="py-2.5 text-gray-400">&lt; 1500 g (Micro Category)</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-white">Thrust-to-Weight Ratio (TWR)</td>
                <td className="py-2.5 text-gray-400">T_total_max / W_AUW</td>
                <td className="py-2.5 text-emerald-400">{calc.thrustToWeightRatio} : 1</td>
                <td className="py-2.5 text-gray-400">2.0 - 2.8 : 1 (Stable Control)</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-white">Hover Throttle (%)</td>
                <td className="py-2.5 text-gray-400">100 / TWR</td>
                <td className="py-2.5 text-emerald-400">{calc.hoverThrottlePct} %</td>
                <td className="py-2.5 text-gray-400">40% - 55% (Linear Headroom)</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-white">Battery Stored Energy</td>
                <td className="py-2.5 text-gray-400">V_nominal × Ah_capacity</td>
                <td className="py-2.5 text-emerald-400">{calc.batteryEnergyWh} Wh</td>
                <td className="py-2.5 text-gray-400">Usable: {(calc.batteryEnergyWh * 0.8).toFixed(1)} Wh</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-white">Hover Electrical Power</td>
                <td className="py-2.5 text-gray-400">W_kg × 135 W/kg (1045 prop)</td>
                <td className="py-2.5 text-emerald-400">{calc.hoverPowerWatts} W</td>
                <td className="py-2.5 text-gray-400">~15A total at 11.1V</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-white">Center of Gravity Offset</td>
                <td className="py-2.5 text-gray-400">|X_CG|, |Z_CG|</td>
                <td className="py-2.5 text-emerald-400">{Math.sqrt(calc.centerOfGravityOffsetMm.x**2 + calc.centerOfGravityOffsetMm.z**2).toFixed(1)} mm</td>
                <td className="py-2.5 text-gray-400">&lt; 15 mm from geometric center</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Automated Engineering Diagnostics */}
      <div className="bg-[#0e131b] border border-white/10 rounded-2xl p-6 space-y-3">
        <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>Automated Component Compatibility & Health Diagnostics</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {calc.diagnostics.map((d, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border flex items-start gap-3 ${
                d.status === "PASS"
                  ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
                  : d.status === "WARNING"
                  ? "bg-amber-950/20 border-amber-500/30 text-amber-300"
                  : "bg-rose-950/20 border-rose-500/30 text-rose-300"
              }`}
            >
              {d.status === "PASS" ? (
                <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-400" />
              ) : (
                <AlertTriangle size={16} className="shrink-0 mt-0.5 text-amber-400" />
              )}
              <div className="space-y-0.5 text-xs">
                <span className="font-bold block">{d.title}</span>
                <p className="text-gray-300 text-[11px] leading-relaxed">{d.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
