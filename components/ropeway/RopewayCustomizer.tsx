"use client";

import React from "react";
import { Palette, Cpu, Check } from "lucide-react";
import { CustomizationSettings } from "@/types/machine";

interface RopewayCustomizerProps {
  customization: CustomizationSettings;
  onChange: (updater: (prev: CustomizationSettings) => CustomizationSettings) => void;
}

export default function RopewayCustomizer({
  customization,
  onChange,
}: RopewayCustomizerProps) {
  const chassisColors = [
    { name: "Cyan Wave", value: "#0284c7" },
    { name: "Safety Amber", value: "#f59e0b" },
    { name: "Crimson Red", value: "#dc2626" },
    { name: "Stealth Slate", value: "#334155" },
    { name: "Neon Emerald", value: "#10b981" },
  ];

  const pulleyColors = [
    { name: "Industrial Nitrile", value: "#0f172a" },
    { name: "High-Grip Orange", value: "#ea580c" },
    { name: "Silicone Yellow", value: "#eab308" },
  ];

  const hookColors = [
    { name: "Safety Yellow", value: "#eab308" },
    { name: "Cobalt Blue", value: "#2563eb" },
    { name: "Anodized Silver", value: "#cbd5e1" },
  ];

  const currentChassisColor = customization.ropewayChassisColor || "#0284c7";
  const currentPulleyColor = customization.ropewayPulleyColor || "#0f172a";
  const currentHookColor = customization.ropewayHookColor || "#eab308";
  const currentMotor = customization.ropewayMotorType || "n20-100rpm";
  const currentBattery = customization.ropewayBatteryType || "2s-liion";
  const currentPayload = customization.ropewayPayload || "camera-fpv";

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6 text-gray-300">
      {/* Title */}
      <div className="space-y-2 border-b border-white/10 pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-sky-500/10 border border-sky-500/20 text-sky-400 font-mono text-[11px] uppercase">
          Hardware Lab Customizer
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Configure Your Cable Climbing Robot
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
          Customize chassis materials, traction sheave compounds, powertrain gear ratios, battery capacities, and mission payload modules.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Visual Customization (Colors) */}
        <div className="rounded-2xl border border-white/10 bg-[#111318] p-5 space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <Palette size={16} className="text-sky-400" />
            <span>Materials & Finishes</span>
          </h3>

          {/* Chassis Color */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-gray-300 block">Chassis Backbone Finish</span>
            <div className="flex items-center gap-3">
              {chassisColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() =>
                    onChange((prev) => ({
                      ...prev,
                      ropewayChassisColor: color.value,
                      paintColor: color.value,
                    }))
                  }
                  title={color.name}
                  style={{ backgroundColor: color.value }}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                    currentChassisColor === color.value
                      ? "ring-2 ring-white ring-offset-2 ring-offset-black scale-110 shadow-lg"
                      : "opacity-75 hover:opacity-100 hover:scale-105"
                  }`}
                >
                  {currentChassisColor === color.value && <Check size={16} className="text-white drop-shadow" />}
                </button>
              ))}
            </div>
          </div>

          {/* Traction Sheave Rubber Compound */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-gray-300 block">Traction Sheave Rubber Grip</span>
            <div className="flex items-center gap-3">
              {pulleyColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() =>
                    onChange((prev) => ({
                      ...prev,
                      ropewayPulleyColor: color.value,
                    }))
                  }
                  title={color.name}
                  style={{ backgroundColor: color.value }}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                    currentPulleyColor === color.value
                      ? "ring-2 ring-white ring-offset-2 ring-offset-black scale-110 shadow-lg"
                      : "opacity-75 hover:opacity-100 hover:scale-105"
                  }`}
                >
                  {currentPulleyColor === color.value && <Check size={16} className="text-white drop-shadow" />}
                </button>
              ))}
            </div>
          </div>

          {/* Suspension Hook Color */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-gray-300 block">Suspension Arms Color</span>
            <div className="flex items-center gap-3">
              {hookColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() =>
                    onChange((prev) => ({
                      ...prev,
                      ropewayHookColor: color.value,
                    }))
                  }
                  title={color.name}
                  style={{ backgroundColor: color.value }}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                    currentHookColor === color.value
                      ? "ring-2 ring-white ring-offset-2 ring-offset-black scale-110 shadow-lg"
                      : "opacity-75 hover:opacity-100 hover:scale-105"
                  }`}
                >
                  {currentHookColor === color.value && <Check size={16} className="text-white drop-shadow" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Mechanical & Mission Payload Config */}
        <div className="rounded-2xl border border-white/10 bg-[#111318] p-5 space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <Cpu size={16} className="text-amber-400" />
            <span>Powertrain & Payload Specs</span>
          </h3>

          {/* Motor Type */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-gray-300 block">Gear Motor Selection</span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "n20-100rpm", label: "N20 100RPM", desc: "3.2 kg·cm / High-Torque", rec: true },
                { id: "bo-dual-60rpm", label: "Dual BO 60RPM", desc: "1.5 kg·cm / Budget DIY", rec: false },
                { id: "planetary-300rpm", label: "Planetary 300RPM", desc: "1.8 kg·cm / Rapid Sprint", rec: false },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() =>
                    onChange((prev) => ({
                      ...prev,
                      ropewayMotorType: m.id as CustomizationSettings["ropewayMotorType"],
                    }))
                  }
                  className={`p-2.5 rounded-xl text-left border transition text-xs ${
                    currentMotor === m.id
                      ? "bg-amber-500/15 border-amber-400 text-white"
                      : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <div className="font-bold">{m.label}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{m.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Battery Type */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-gray-300 block">Battery Power Pack</span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "2s-liion", label: "2S Li-ion 7.4V", desc: "2,200mAh / 4.5h Run" },
                { id: "9v-alkaline", label: "9V Alkaline", desc: "500mAh / Low Cost" },
                { id: "3s-lipo", label: "3S LiPo 11.1V", desc: "1,000mAh / Extreme Climb" },
              ].map((b) => (
                <button
                  key={b.id}
                  onClick={() =>
                    onChange((prev) => ({
                      ...prev,
                      ropewayBatteryType: b.id as CustomizationSettings["ropewayBatteryType"],
                    }))
                  }
                  className={`p-2.5 rounded-xl text-left border transition text-xs ${
                    currentBattery === b.id
                      ? "bg-emerald-500/15 border-emerald-400 text-white"
                      : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <div className="font-bold">{b.label}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{b.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Payload Module */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-gray-300 block">Mission Payload Attachment</span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "camera-fpv", label: "Micro FPV Camera", desc: "Live Overhead Video" },
                { id: "cargo-hook", label: "Cargo Carabiner", desc: "Carry up to 850g" },
                { id: "none", label: "Bare Airframe", desc: "Fast & Ultra-Light" },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() =>
                    onChange((prev) => ({
                      ...prev,
                      ropewayPayload: p.id as CustomizationSettings["ropewayPayload"],
                    }))
                  }
                  className={`p-2.5 rounded-xl text-left border transition text-xs ${
                    currentPayload === p.id
                      ? "bg-sky-500/15 border-sky-400 text-white"
                      : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <div className="font-bold">{p.label}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{p.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
