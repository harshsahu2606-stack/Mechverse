"use client";

import React from "react";
import { Sliders, Check, Palette, Battery, Cpu, Camera, Crosshair, Shield } from "lucide-react";
import { CustomizationSettings } from "@/types/machine";
import { calculateAeroEngineering } from "@/data/aeroDroneData";

interface AeroCustomizerProps {
  customization: CustomizationSettings;
  onChangeCustomization: (settings: CustomizationSettings) => void;
  onSaveDesign?: () => void;
}

export default function AeroCustomizer({
  customization,
  onChangeCustomization,
  onSaveDesign,
}: AeroCustomizerProps) {
  const calc = calculateAeroEngineering(customization);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 space-y-6 text-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Sliders className="text-emerald-400" size={24} />
            <span>AERO-450 Customization Studio</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Configure propulsion, power storage, avionics, and payload. All engineering metrics recalculate dynamically.
          </p>
        </div>
        {onSaveDesign && (
          <button
            onClick={onSaveDesign}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition shrink-0"
          >
            Save Design
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Controls */}
        <div className="lg:col-span-2 space-y-5">
          {/* Frame & Arm Colors */}
          <div className="bg-[#0e131b] border border-white/10 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Palette size={14} className="text-emerald-400" />
              <span>1. Airframe Wheelbase & Arm Orientation Colors</span>
            </h3>

            <div>
              <label className="text-xs text-gray-400 block mb-2 font-mono">Frame Diagonal Wheelbase:</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { size: 450, label: "F450 (450mm)", desc: "Standard 10-inch props" },
                  { size: 380, label: "F380 (380mm)", desc: "Compact agile 8-9 inch" },
                  { size: 500, label: "F500 (500mm)", desc: "Extended heavy lift" },
                ].map((f) => (
                  <button
                    key={f.size}
                    onClick={() => onChangeCustomization({ ...customization, droneFrameSize: f.size as any })}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      customization.droneFrameSize === f.size
                        ? "bg-emerald-600/20 border-emerald-500 text-white"
                        : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    <span className="text-xs font-bold block">{f.label}</span>
                    <span className="text-[10px] text-gray-400 block">{f.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-1">
              <div>
                <label className="text-xs text-gray-400 block mb-1 font-mono">Front Arms Color (Orientation):</label>
                <div className="flex gap-2">
                  {[
                    { color: "#dc2626", label: "Red" },
                    { color: "#2563eb", label: "Blue" },
                    { color: "#16a34a", label: "Green" },
                    { color: "#000000", label: "Black" },
                  ].map((c) => (
                    <button
                      key={c.color}
                      onClick={() => onChangeCustomization({ ...customization, droneArmColorFront: c.color })}
                      style={{ backgroundColor: c.color }}
                      className={`w-8 h-8 rounded-full border-2 transition ${
                        customization.droneArmColorFront === c.color ? "border-white scale-110" : "border-transparent"
                      }`}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1 font-mono">Rear Arms Color:</label>
                <div className="flex gap-2">
                  {[
                    { color: "#f8fafc", label: "White" },
                    { color: "#000000", label: "Black" },
                    { color: "#d97706", label: "Amber" },
                  ].map((c) => (
                    <button
                      key={c.color}
                      onClick={() => onChangeCustomization({ ...customization, droneArmColorRear: c.color })}
                      style={{ backgroundColor: c.color }}
                      className={`w-8 h-8 rounded-full border-2 transition ${
                        customization.droneArmColorRear === c.color ? "border-emerald-400 scale-110" : "border-transparent"
                      }`}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Propulsion (Motor & Propeller) */}
          <div className="bg-[#0e131b] border border-white/10 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Cpu size={14} className="text-emerald-400" />
              <span>2. Propulsion Drivetrain (Brushless Motors & Propellers)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 block mb-1 font-mono">Motor Model & KV Rating:</label>
                <select
                  value={customization.droneMotorModel}
                  onChange={(e) => onChangeCustomization({ ...customization, droneMotorModel: e.target.value as any })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="2212-920kv">DJI 2212 920KV (Standard 3S-4S / 880g Thrust)</option>
                  <option value="2212-1000kv">A2212 1000KV (Budget Workhorse / 850g Thrust)</option>
                  <option value="2216-880kv">Sunnysky 2216 880KV (High-Torque Heavy / 980g Thrust)</option>
                  <option value="2212-1400kv">A2212 1400KV (High-Speed / 8-inch prop only)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1 font-mono">Propeller Spec & Material:</label>
                <select
                  value={customization.dronePropeller}
                  onChange={(e) => onChangeCustomization({ ...customization, dronePropeller: e.target.value as any })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="1045-nylon">1045 Nylon Reinforced (Standard 10x4.5 inch)</option>
                  <option value="1045-carbon">1045 Carbon Fiber (High-Stiffness Racing)</option>
                  <option value="9045-nylon">9045 Nylon (9x4.5 inch / High Wind Resistance)</option>
                  <option value="8045-nylon">8045 Nylon (8x4.5 inch / Agile)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Battery & Power */}
          <div className="bg-[#0e131b] border border-white/10 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Battery size={14} className="text-emerald-400" />
              <span>3. Battery Chemistry, Cells & Flight Controller</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 block mb-1 font-mono">LiPo Battery Pack:</label>
                <select
                  value={customization.droneBattery}
                  onChange={(e) => onChangeCustomization({ ...customization, droneBattery: e.target.value as any })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="3s-4200mah-35c">3S 11.1V 4200mAh 35C (Balanced Endurance ~14.8 mins)</option>
                  <option value="3s-2200mah-25c">3S 11.1V 2200mAh 25C (Lightweight Budget ~8.5 mins)</option>
                  <option value="3s-5200mah-25c">3S 11.1V 5200mAh 25C (Maximum Endurance ~17.5 mins)</option>
                  <option value="4s-3300mah-45c">4S 14.8V 3300mAh 45C (High Thrust Dynamic ~12.2 mins)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1 font-mono">Flight Controller (Autopilot):</label>
                <select
                  value={customization.droneFlightController}
                  onChange={(e) => onChangeCustomization({ ...customization, droneFlightController: e.target.value as any })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="pixhawk-2.4.8">Pixhawk 2.4.8 32-Bit (ArduPilot / Dual IMU / Best)</option>
                  <option value="apm-2.8">APM 2.8 8-Bit (Legacy Budget Educational)</option>
                  <option value="f4-v3s-plus">Omnibus F4 V3S Plus (Betaflight / Compact)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Camera Payload & Accessories */}
          <div className="bg-[#0e131b] border border-white/10 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Camera size={14} className="text-emerald-400" />
              <span>4. Inspection Camera Payload & Landing Gear</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 block mb-1 font-mono">Camera Module:</label>
                <select
                  value={customization.droneCamera}
                  onChange={(e) => onChangeCustomization({ ...customization, droneCamera: e.target.value as any })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="runcam-split-hd">RunCam Split HD (1080p 60fps / 21g / Ideal)</option>
                  <option value="gopro-lite">Naked GoPro Hero 8 (4K 60fps / 32g / Cinematic)</option>
                  <option value="fpv-analog-1200tvl">Foxeer Razer Mini 1200TVL (FPV analog / 12g)</option>
                  <option value="none">None (Pure Training Configuration)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1 font-mono">Landing Gear Style:</label>
                <select
                  value={customization.droneLandingGear}
                  onChange={(e) => onChangeCustomization({ ...customization, droneLandingGear: e.target.value as any })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="tall-arched">Tall Arched Skids (150mm ground clearance for camera)</option>
                  <option value="stubby-skids">Stubby Integrated Leg Pegs (Lightweight)</option>
                  <option value="carbon-tube">Carbon Fiber T-Tube Retract Skids (Heavy)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Live Telemetry Preview Card */}
        <div className="space-y-4">
          <div className="bg-[#0c141d] border border-emerald-500/30 rounded-2xl p-5 space-y-4 sticky top-32">
            <h3 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest border-b border-white/10 pb-2">
              Live Configuration Telemetry
            </h3>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">All-Up Weight:</span>
                <span className="text-white font-bold">{calc.totalMassGrams} g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Max Thrust:</span>
                <span className="text-white font-bold">{calc.maxThrustGrams} g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Thrust-to-Weight:</span>
                <span className="text-emerald-400 font-bold">{calc.thrustToWeightRatio} : 1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Hover Throttle:</span>
                <span className="text-emerald-400 font-bold">{calc.hoverThrottlePct} %</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Flight Time:</span>
                <span className="text-white font-bold">{calc.estimatedFlightTimeMin} mins</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Payload Margin:</span>
                <span className="text-teal-400 font-bold">{calc.availablePayloadGrams} g</span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10">
              <div className="text-[10px] text-gray-400 uppercase font-mono mb-1">Stability Rating</div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, Math.max(20, (calc.thrustToWeightRatio / 3.0) * 100))}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
