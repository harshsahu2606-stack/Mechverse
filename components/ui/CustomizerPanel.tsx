"use client";

import { useState } from "react";
import {
  Check,
  Disc,
  Palette,
  Shield,
  Sparkles,
  CheckSquare,
  Square,
  BookmarkPlus,
  Sliders,
  Plane,
  Hexagon,
  Smartphone,
  Car,
  Fan,
  Bot,
  Swords,
  Layers,
} from "lucide-react";
import { CustomizationSettings, MachineId, BattleCarId } from "@/types/machine";

interface CustomizerPanelProps {
  machineId: MachineId;
  customization: CustomizationSettings;
  onChangeCustomization: (settings: CustomizationSettings) => void;
  onSaveDesign: (name: string) => void;
}

// Universal Palettes
const CAR_COLORS = [
  { name: "Apex Racing Red", value: "#d71920" },
  { name: "Electric Blue", value: "#1769d2" },
  { name: "Matte Obsidian", value: "#1e2126" },
  { name: "Pearl White", value: "#f1f3f5" },
  { name: "Lime Neon", value: "#84cc16" },
  { name: "Sunset Orange", value: "#f97316" },
  { name: "Billet Titanium", value: "#94a3b8" },
  { name: "Speed Yellow", value: "#eab308" },
];

const DRONE_B_CHASSIS_COLORS = [
  { name: "Industrial Slate", value: "#475569" },
  { name: "Stealth Black", value: "#1e293b" },
  { name: "Safety Yellow", value: "#eab308" },
  { name: "Hazard Red", value: "#dc2626" },
  { name: "Signal White", value: "#f8fafc" },
  { name: "Cyber Cyan", value: "#0284c7" },
  { name: "Acid Lime", value: "#84cc16" },
  { name: "Sunset Orange", value: "#f97316" },
];

const DRONE_B_ARM_COLORS = [
  { name: "Carbon Fiber Dark", value: "#1e2126" },
  { name: "Slate Grey", value: "#334155" },
  { name: "Anodized Silver", value: "#cbd5e1" },
  { name: "Safety Orange", value: "#ea580c" },
  { name: "Signal Red", value: "#dc2626" },
];

const DRONE_B_PROP_COLORS = [
  { name: "Carbon Black", value: "#0f172a" },
  { name: "Aero Sky Blue", value: "#0284c7" },
  { name: "Safety Orange", value: "#f97316" },
  { name: "Ghost White", value: "#f8fafc" },
  { name: "Racing Red", value: "#ef4444" },
];

const ESP32_FRAME_COLORS = [
  { name: "Dark Polycarbonate", value: "#1e293b" },
  { name: "Crystal White", value: "#f1f5f9" },
  { name: "Racing Red", value: "#ef4444" },
  { name: "Electric Blue", value: "#3b82f6" },
  { name: "Acid Lime", value: "#84cc16" },
  { name: "Sunset Orange", value: "#f97316" },
  { name: "Royal Purple", value: "#8b5cf6" },
  { name: "Matte Black", value: "#09090b" },
];

const ESP32_PROP_COLORS = [
  { name: "Bright Red", value: "#ef4444" },
  { name: "High-Vis Orange", value: "#f97316" },
  { name: "Pure White", value: "#f8fafc" },
  { name: "Cyan Teal", value: "#06b6d4" },
  { name: "Neon Lime", value: "#84cc16" },
  { name: "Stealth Black", value: "#0f172a" },
];

const ROBO_RACER_CHASSIS_COLORS = [
  { name: "Matte Black", value: "#17171c" },
  { name: "Cyberpunk Yellow", value: "#eab308" },
  { name: "Racing Red", value: "#dc2626" },
  { name: "Electric Blue", value: "#2563eb" },
  { name: "Arctic White", value: "#f8fafc" },
  { name: "Hunter Green", value: "#16a34a" },
  { name: "Sunset Orange", value: "#f97316" },
  { name: "Titanium Grey", value: "#64748b" },
];

const ROBO_RACER_ACCENT_COLORS = [
  { name: "Anodized Gold", value: "#ca8a04" },
  { name: "Crimson Red", value: "#ef4444" },
  { name: "Royal Blue", value: "#3b82f6" },
  { name: "Silver Metal", value: "#94a3b8" },
  { name: "Stealth Black", value: "#18181b" },
];

const FAN_BLADE_COLORS = [
  { name: "Cyan Ice", value: "#0ea5e9" },
  { name: "Smoked Dark", value: "#334155" },
  { name: "Neon Lime", value: "#84cc16" },
  { name: "Ruby Clear", value: "#e11d48" },
  { name: "Frosted Clear", value: "#e2e8f0" },
];

const RIM_COLORS = [
  { name: "Silver Machined", value: "#e2e8f0" },
  { name: "Satin Dark", value: "#334155" },
  { name: "Gloss Black", value: "#18181b" },
  { name: "Race Gold", value: "#ca8a04" },
];

export default function CustomizerPanel({
  machineId,
  customization,
  onChangeCustomization,
  onSaveDesign,
}: CustomizerPanelProps) {
  const [designName, setDesignName] = useState(
    machineId === "sports-car"
      ? "Apex Speciale Edition"
      : machineId === "drone-b"
      ? "Octo-Heavy Industrial"
      : machineId === "esp32-drone"
      ? "AERO-ESP Pocket Custom"
      : machineId === "robo-racer"
      ? "Robo-Racer Vision Spec"
      : machineId === "aero-450"
      ? "AERO-450 Custom UAV"
      : "Custom Machine Build"
  );
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleFinishChange = (finish: "glossy" | "matte" | "metallic") => {
    onChangeCustomization({ ...customization, finish });
  };

  const handleSave = () => {
    onSaveDesign(designName.trim() || "My Custom Machine");
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2400);
  };

  return (
    <aside className="absolute top-20 right-4 z-20 w-80 sm:w-88 max-w-[calc(100vw-2rem)] pointer-events-auto">
      <div className="rounded-2xl border border-white/15 bg-[#111318]/95 backdrop-blur-xl p-5 shadow-2xl space-y-5 max-h-[82vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div>
          <span className="text-[10px] font-mono tracking-widest text-orange-400 uppercase bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
            SPECIFICATION STUDIO
          </span>
          <h3 className="text-xl font-bold text-white mt-1.5">Customize Machine</h3>
          <p className="text-xs text-gray-400 mt-1">
            Configure exterior finishes, materials, and mechanical colors in real-time.
          </p>
        </div>

        {/* =========================================================================
            1. SPORTS CAR CUSTOMIZATION
           ========================================================================= */}
        {machineId === "sports-car" && (
          <>
            {/* Body Paint */}
            <section className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-300">Body Paint Color</span>
                <span className="text-[10px] text-gray-400">
                  {CAR_COLORS.find((c) => c.value === customization.paintColor)?.name || "Custom"}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {CAR_COLORS.map((col) => {
                  const isSelected = customization.paintColor.toLowerCase() === col.value.toLowerCase();
                  return (
                    <button
                      key={col.value}
                      title={col.name}
                      onClick={() => onChangeCustomization({ ...customization, paintColor: col.value })}
                      style={{ backgroundColor: col.value }}
                      className={`h-9 rounded-xl border-2 transition relative flex items-center justify-center cursor-pointer ${
                        isSelected
                          ? "border-white scale-105 shadow-md shadow-white/20"
                          : "border-white/20 hover:border-white/50"
                      }`}
                    >
                      {isSelected && (
                        <Check
                          size={16}
                          className={
                            col.value === "#f1f3f5" || col.value === "#84cc16" || col.value === "#eab308"
                              ? "text-black"
                              : "text-white"
                          }
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Finish Coating */}
            <section className="space-y-2">
              <span className="text-xs font-semibold text-gray-300">Finish Coating</span>
              <div className="grid grid-cols-3 gap-1.5">
                {(["glossy", "metallic", "matte"] as const).map((finish) => (
                  <button
                    key={finish}
                    onClick={() => handleFinishChange(finish)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium capitalize transition border cursor-pointer ${
                      customization.finish === finish
                        ? "bg-white text-black font-semibold border-white"
                        : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    {finish}
                  </button>
                ))}
              </div>
            </section>

            {/* Wheels & Rims */}
            <section className="space-y-2.5 pt-1 border-t border-white/10">
              <span className="text-xs font-semibold text-gray-300">Wheels &amp; Rims</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "sport", label: "Sport Forge" },
                  { id: "star", label: "Star Aero" },
                  { id: "aero", label: "Carbon Spec" },
                ].map((wheel) => {
                  const isSelected = customization.wheelStyle === wheel.id;
                  return (
                    <button
                      key={wheel.id}
                      onClick={() => onChangeCustomization({ ...customization, wheelStyle: wheel.id as any })}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl border transition cursor-pointer ${
                        isSelected
                          ? "bg-white/15 border-white text-white"
                          : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                      }`}
                    >
                      <Disc size={20} className={isSelected ? "text-red-400" : "text-gray-500"} />
                      <span className="text-[10px] font-medium mt-1">{wheel.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Rim Color */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[10px] text-gray-400">Rim Tone:</span>
                <div className="flex items-center gap-1.5">
                  {RIM_COLORS.map((col) => (
                    <button
                      key={col.value}
                      title={col.name}
                      onClick={() => onChangeCustomization({ ...customization, rimColor: col.value })}
                      style={{ backgroundColor: col.value }}
                      className={`w-5 h-5 rounded-full border cursor-pointer transition ${
                        customization.rimColor === col.value ? "border-white scale-110 shadow-sm" : "border-white/20"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Body Aerodynamics Checkboxes */}
            <section className="space-y-2 pt-2 border-t border-white/10">
              <span className="text-xs font-semibold text-gray-300">Body Aerodynamics</span>
              <div className="space-y-1.5">
                {[
                  { key: "spoiler", label: "Rear Carbon GT Wing / Spoiler" },
                  { key: "sideSkirts", label: "Aero Side Skirts" },
                  { key: "frontSplitter", label: "Front Carbon Splitter" },
                  { key: "rearDiffuser", label: "Rear Diffuser Strakes" },
                ].map((item) => {
                  const isActive = customization.bodyParts[item.key as keyof CustomizationSettings["bodyParts"]];
                  return (
                    <button
                      key={item.key}
                      onClick={() =>
                        onChangeCustomization({
                          ...customization,
                          bodyParts: {
                            ...customization.bodyParts,
                            [item.key]: !customization.bodyParts[item.key as keyof CustomizationSettings["bodyParts"]],
                          },
                        })
                      }
                      className="w-full flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-left transition cursor-pointer"
                    >
                      <span className={isActive ? "text-white font-medium" : "text-gray-400"}>{item.label}</span>
                      {isActive ? <CheckSquare size={16} className="text-red-500" /> : <Square size={16} className="text-gray-600" />}
                    </button>
                  );
                })}
              </div>
            </section>
          </>
        )}

        {/* =========================================================================
            2. DRONE-B INDUSTRIAL OCTOCOPTER CUSTOMIZATION
           ========================================================================= */}
        {machineId === "drone-b" && (
          <>
            {/* Octagonal Hull / Fuselage Color */}
            <section className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-300">Fuselage Core Hull</span>
                <span className="text-[10px] text-gray-400">
                  {DRONE_B_CHASSIS_COLORS.find(
                    (c) => c.value === (customization.droneBChassisColor || customization.paintColor)
                  )?.name || "Custom"}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {DRONE_B_CHASSIS_COLORS.map((col) => {
                  const currentVal = customization.droneBChassisColor || customization.paintColor || "#475569";
                  const isSelected = currentVal.toLowerCase() === col.value.toLowerCase();
                  return (
                    <button
                      key={col.value}
                      title={col.name}
                      onClick={() =>
                        onChangeCustomization({
                          ...customization,
                          droneBChassisColor: col.value,
                          paintColor: col.value,
                        })
                      }
                      style={{ backgroundColor: col.value }}
                      className={`h-9 rounded-xl border-2 transition relative flex items-center justify-center cursor-pointer ${
                        isSelected
                          ? "border-white scale-105 shadow-md shadow-white/20"
                          : "border-white/20 hover:border-white/50"
                      }`}
                    >
                      {isSelected && (
                        <Check
                          size={16}
                          className={col.value === "#f8fafc" || col.value === "#eab308" || col.value === "#84cc16" ? "text-black" : "text-white"}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* 8 Boom Arms Color */}
            <section className="space-y-2 pt-1 border-t border-white/10">
              <span className="text-xs font-semibold text-gray-300">8x Boom Arms Finish</span>
              <div className="grid grid-cols-5 gap-1.5">
                {DRONE_B_ARM_COLORS.map((col) => {
                  const isSelected = (customization.droneBArmColor || "#334155").toLowerCase() === col.value.toLowerCase();
                  return (
                    <button
                      key={col.value}
                      title={col.name}
                      onClick={() => onChangeCustomization({ ...customization, droneBArmColor: col.value })}
                      style={{ backgroundColor: col.value }}
                      className={`h-7 rounded-lg border transition cursor-pointer ${
                        isSelected ? "border-white scale-110 shadow-sm" : "border-white/20"
                      }`}
                    />
                  );
                })}
              </div>
            </section>

            {/* 8 Propellers Color */}
            <section className="space-y-2 pt-1 border-t border-white/10">
              <span className="text-xs font-semibold text-gray-300">8x High-Lift Propellers</span>
              <div className="grid grid-cols-5 gap-1.5">
                {DRONE_B_PROP_COLORS.map((col) => {
                  const isSelected = (customization.droneBPropellerColor || "#0f172a").toLowerCase() === col.value.toLowerCase();
                  return (
                    <button
                      key={col.value}
                      title={col.name}
                      onClick={() => onChangeCustomization({ ...customization, droneBPropellerColor: col.value })}
                      style={{ backgroundColor: col.value }}
                      className={`h-7 rounded-lg border transition cursor-pointer ${
                        isSelected ? "border-white scale-110 shadow-sm" : "border-white/20"
                      }`}
                    />
                  );
                })}
              </div>
            </section>

            {/* Industrial Finish Coating */}
            <section className="space-y-2 pt-1 border-t border-white/10">
              <span className="text-xs font-semibold text-gray-300">Fuselage Surface Finish</span>
              <div className="grid grid-cols-3 gap-1.5">
                {(["metallic", "matte", "glossy"] as const).map((finish) => (
                  <button
                    key={finish}
                    onClick={() => handleFinishChange(finish)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium capitalize transition border cursor-pointer ${
                      customization.finish === finish
                        ? "bg-white text-black font-semibold border-white"
                        : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    {finish}
                  </button>
                ))}
              </div>
            </section>
          </>
        )}

        {/* =========================================================================
            3. AERO-ESP NANO DRONE CUSTOMIZATION
           ========================================================================= */}
        {machineId === "esp32-drone" && (
          <>
            {/* 95mm Micro-Frame & Guards */}
            <section className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-300">Micro-Frame &amp; Guards</span>
                <span className="text-[10px] text-gray-400">
                  {ESP32_FRAME_COLORS.find(
                    (c) => c.value === (customization.esp32DroneFrameColor || customization.paintColor)
                  )?.name || "Custom"}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {ESP32_FRAME_COLORS.map((col) => {
                  const currentVal = customization.esp32DroneFrameColor || customization.paintColor || "#1e293b";
                  const isSelected = currentVal.toLowerCase() === col.value.toLowerCase();
                  return (
                    <button
                      key={col.value}
                      title={col.name}
                      onClick={() =>
                        onChangeCustomization({
                          ...customization,
                          esp32DroneFrameColor: col.value,
                          paintColor: col.value,
                        })
                      }
                      style={{ backgroundColor: col.value }}
                      className={`h-9 rounded-xl border-2 transition relative flex items-center justify-center cursor-pointer ${
                        isSelected
                          ? "border-white scale-105 shadow-md shadow-white/20"
                          : "border-white/20 hover:border-white/50"
                      }`}
                    >
                      {isSelected && (
                        <Check
                          size={16}
                          className={col.value === "#f1f5f9" || col.value === "#84cc16" ? "text-black" : "text-white"}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Front Propellers Color */}
            <section className="space-y-2 pt-1 border-t border-white/10">
              <span className="text-xs font-semibold text-gray-300">Front Orientation Props (M1/M2)</span>
              <div className="grid grid-cols-6 gap-1.5">
                {ESP32_PROP_COLORS.map((col) => {
                  const isSelected = (customization.esp32DronePropsColor || "#ef4444").toLowerCase() === col.value.toLowerCase();
                  return (
                    <button
                      key={col.value}
                      title={col.name}
                      onClick={() => onChangeCustomization({ ...customization, esp32DronePropsColor: col.value })}
                      style={{ backgroundColor: col.value }}
                      className={`h-7 rounded-lg border transition cursor-pointer ${
                        isSelected ? "border-white scale-110 shadow-sm" : "border-white/20"
                      }`}
                    />
                  );
                })}
              </div>
            </section>

            {/* Rear Propellers Color */}
            <section className="space-y-2 pt-1 border-t border-white/10">
              <span className="text-xs font-semibold text-gray-300">Rear Props (M3/M4)</span>
              <div className="grid grid-cols-6 gap-1.5">
                {ESP32_PROP_COLORS.map((col) => {
                  const isSelected = (customization.esp32DroneRearPropsColor || "#0f172a").toLowerCase() === col.value.toLowerCase();
                  return (
                    <button
                      key={col.value}
                      title={col.name}
                      onClick={() => onChangeCustomization({ ...customization, esp32DroneRearPropsColor: col.value })}
                      style={{ backgroundColor: col.value }}
                      className={`h-7 rounded-lg border transition cursor-pointer ${
                        isSelected ? "border-white scale-110 shadow-sm" : "border-white/20"
                      }`}
                    />
                  );
                })}
              </div>
            </section>
          </>
        )}

        {/* =========================================================================
            4. ROBO-RACER ROVER BOT CUSTOMIZATION
           ========================================================================= */}
        {machineId === "robo-racer" && (
          <>
            {/* Chassis Body & Gullwing Hood */}
            <section className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-300">Chassis Body &amp; Hood</span>
                <span className="text-[10px] text-gray-400">
                  {ROBO_RACER_CHASSIS_COLORS.find(
                    (c) => c.value === (customization.roboRacerChassisColor || customization.paintColor)
                  )?.name || "Custom"}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {ROBO_RACER_CHASSIS_COLORS.map((col) => {
                  const currentVal = customization.roboRacerChassisColor || customization.paintColor || "#17171c";
                  const isSelected = currentVal.toLowerCase() === col.value.toLowerCase();
                  return (
                    <button
                      key={col.value}
                      title={col.name}
                      onClick={() =>
                        onChangeCustomization({
                          ...customization,
                          roboRacerChassisColor: col.value,
                          paintColor: col.value,
                        })
                      }
                      style={{ backgroundColor: col.value }}
                      className={`h-9 rounded-xl border-2 transition relative flex items-center justify-center cursor-pointer ${
                        isSelected
                          ? "border-white scale-105 shadow-md shadow-white/20"
                          : "border-white/20 hover:border-white/50"
                      }`}
                    >
                      {isSelected && (
                        <Check
                          size={16}
                          className={col.value === "#f8fafc" || col.value === "#eab308" ? "text-black" : "text-white"}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Anodized Bracket & Motor Mount Accent */}
            <section className="space-y-2 pt-1 border-t border-white/10">
              <span className="text-xs font-semibold text-gray-300">Anodized Motor Brackets</span>
              <div className="grid grid-cols-5 gap-1.5">
                {ROBO_RACER_ACCENT_COLORS.map((col) => {
                  const isSelected = (customization.roboRacerAccentColor || "#ca8a04").toLowerCase() === col.value.toLowerCase();
                  return (
                    <button
                      key={col.value}
                      title={col.name}
                      onClick={() => onChangeCustomization({ ...customization, roboRacerAccentColor: col.value })}
                      style={{ backgroundColor: col.value }}
                      className={`h-7 rounded-lg border transition cursor-pointer ${
                        isSelected ? "border-white scale-110 shadow-sm" : "border-white/20"
                      }`}
                    />
                  );
                })}
              </div>
            </section>

            {/* Surface Coating */}
            <section className="space-y-2 pt-1 border-t border-white/10">
              <span className="text-xs font-semibold text-gray-300">Surface Coating</span>
              <div className="grid grid-cols-3 gap-1.5">
                {(["metallic", "matte", "glossy"] as const).map((finish) => (
                  <button
                    key={finish}
                    onClick={() => handleFinishChange(finish)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium capitalize transition border cursor-pointer ${
                      customization.finish === finish
                        ? "bg-white text-black font-semibold border-white"
                        : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    {finish}
                  </button>
                ))}
              </div>
            </section>
          </>
        )}

        {/* =========================================================================
            5. AERO-450 QUADCOPTER CUSTOMIZATION
           ========================================================================= */}
        {machineId === "aero-450" && (
          <>
            {/* Wheelbase Size */}
            <section className="space-y-2">
              <span className="text-xs font-semibold text-gray-300">Diagonal Wheelbase</span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { size: 380, label: "F380 (38cm)" },
                  { size: 450, label: "F450 (45cm)" },
                  { size: 500, label: "F500 (50cm)" },
                ].map((f) => (
                  <button
                    key={f.size}
                    onClick={() => onChangeCustomization({ ...customization, droneFrameSize: f.size as any })}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium transition border cursor-pointer ${
                      (customization.droneFrameSize || 450) === f.size
                        ? "bg-emerald-600 text-white font-semibold border-emerald-500 shadow"
                        : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </section>

            {/* Front Arms Color */}
            <section className="space-y-2 pt-1 border-t border-white/10">
              <span className="text-xs font-semibold text-gray-300">Front Orientation Arms</span>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { name: "Pure White", val: "#f8fafc" },
                  { name: "Racing Red", val: "#dc2626" },
                  { name: "Safety Orange", val: "#f97316" },
                  { name: "Electric Blue", val: "#2563eb" },
                ].map((col) => (
                  <button
                    key={col.val}
                    title={col.name}
                    onClick={() =>
                      onChangeCustomization({
                        ...customization,
                        droneArmColorFront: col.val,
                        paintColor: col.val,
                      })
                    }
                    style={{ backgroundColor: col.val }}
                    className={`h-7 rounded-lg border transition cursor-pointer flex items-center justify-center ${
                      (customization.droneArmColorFront || "#f8fafc") === col.val ? "border-white scale-110 shadow-sm" : "border-white/20"
                    }`}
                  >
                    {(customization.droneArmColorFront || "#f8fafc") === col.val && (
                      <Check size={13} className={col.val === "#f8fafc" ? "text-black" : "text-white"} />
                    )}
                  </button>
                ))}
              </div>
            </section>

            {/* Rear Arms Color */}
            <section className="space-y-2 pt-1 border-t border-white/10">
              <span className="text-xs font-semibold text-gray-300">Rear Orientation Arms</span>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { name: "Racing Red", val: "#dc2626" },
                  { name: "Pure White", val: "#f8fafc" },
                  { name: "Stealth Black", val: "#18181b" },
                  { name: "Speed Yellow", val: "#eab308" },
                ].map((col) => (
                  <button
                    key={col.val}
                    title={col.name}
                    onClick={() => onChangeCustomization({ ...customization, droneArmColorRear: col.val })}
                    style={{ backgroundColor: col.val }}
                    className={`h-7 rounded-lg border transition cursor-pointer flex items-center justify-center ${
                      (customization.droneArmColorRear || "#dc2626") === col.val ? "border-white scale-110 shadow-sm" : "border-white/20"
                    }`}
                  >
                    {(customization.droneArmColorRear || "#dc2626") === col.val && (
                      <Check size={13} className={col.val === "#f8fafc" || col.val === "#eab308" ? "text-black" : "text-white"} />
                    )}
                  </button>
                ))}
              </div>
            </section>

            {/* Landing Gear Style */}
            <section className="space-y-2 pt-1 border-t border-white/10">
              <span className="text-xs font-semibold text-gray-300">Landing Gear Style</span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: "tall-arched", label: "Tall Arched" },
                  { id: "stubby-skids", label: "Stubby Skids" },
                  { id: "carbon-tube", label: "Carbon Tubes" },
                ].map((lg) => (
                  <button
                    key={lg.id}
                    onClick={() => onChangeCustomization({ ...customization, droneLandingGear: lg.id as any })}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium transition border cursor-pointer ${
                      customization.droneLandingGear === lg.id
                        ? "bg-white text-black font-semibold border-white"
                        : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    {lg.label}
                  </button>
                ))}
              </div>
            </section>
          </>
        )}

        {/* =========================================================================
            6. ELECTRIC FAN CUSTOMIZATION
           ========================================================================= */}
        {machineId === "electric-fan" && (
          <>
            {/* Housing & Grille Color */}
            <section className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-300">Housing &amp; Grille Color</span>
                <span className="text-[10px] text-gray-400">
                  {CAR_COLORS.find((c) => c.value === customization.paintColor)?.name || "Custom"}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {CAR_COLORS.map((col) => {
                  const isSelected = customization.paintColor.toLowerCase() === col.value.toLowerCase();
                  return (
                    <button
                      key={col.value}
                      title={col.name}
                      onClick={() => onChangeCustomization({ ...customization, paintColor: col.value })}
                      style={{ backgroundColor: col.value }}
                      className={`h-9 rounded-xl border-2 transition relative flex items-center justify-center cursor-pointer ${
                        isSelected
                          ? "border-white scale-105 shadow-md shadow-white/20"
                          : "border-white/20 hover:border-white/50"
                      }`}
                    >
                      {isSelected && (
                        <Check
                          size={16}
                          className={col.value === "#f1f3f5" || col.value === "#84cc16" || col.value === "#eab308" ? "text-black" : "text-white"}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Translucent Fan Blade Tint */}
            <section className="space-y-2.5 pt-1 border-t border-white/10">
              <span className="text-xs font-semibold text-gray-300">Translucent Blade Tint</span>
              <div className="grid grid-cols-5 gap-1.5">
                {FAN_BLADE_COLORS.map((col) => (
                  <button
                    key={col.value}
                    title={col.name}
                    onClick={() => onChangeCustomization({ ...customization, fanBladeColor: col.value })}
                    style={{ backgroundColor: col.value }}
                    className={`h-7 rounded-lg border transition cursor-pointer ${
                      customization.fanBladeColor === col.value ? "border-white scale-110 shadow-sm" : "border-white/20"
                    }`}
                  />
                ))}
              </div>
            </section>

            {/* Base Pedestal Tint */}
            <section className="space-y-2 pt-1 border-t border-white/10">
              <span className="text-xs font-semibold text-gray-300">Base Pedestal Tint</span>
              <div className="grid grid-cols-4 gap-2">
                {CAR_COLORS.slice(0, 4).map((col) => (
                  <button
                    key={col.value}
                    title={col.name}
                    onClick={() => onChangeCustomization({ ...customization, fanBaseColor: col.value })}
                    style={{ backgroundColor: col.value }}
                    className={`h-7 rounded-lg border transition cursor-pointer ${
                      customization.fanBaseColor === col.value ? "border-white scale-110" : "border-white/20"
                    }`}
                  />
                ))}
              </div>
            </section>
          </>
        )}

        {/* =========================================================================
            6B. ROPEWAY ROBO CABLE CLIMBER CUSTOMIZATION
           ========================================================================= */}
        {machineId === "ropeway-robot" && (
          <>
            <section className="space-y-2 pt-1 border-t border-white/10">
              <span className="text-xs font-semibold text-gray-300">Kinematic Drive Cranks</span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { name: "High-Grip Orange", value: "#ea580c" },
                  { name: "Cyan Anodized", value: "#0284c7" },
                  { name: "Stealth Slate", value: "#334155" },
                ].map((col) => (
                  <button
                    key={col.value}
                    onClick={() =>
                      onChangeCustomization({
                        ...customization,
                        ropewayCrankColor: col.value,
                        ropewayPulleyColor: col.value,
                      })
                    }
                    className={`p-2 rounded-xl border text-center text-[10px] font-bold transition flex items-center justify-center gap-1.5 ${
                      (customization.ropewayCrankColor || customization.ropewayPulleyColor || "#ea580c") === col.value
                        ? "border-orange-400 bg-orange-500/20 text-white"
                        : "border-white/10 bg-white/5 text-gray-400 hover:text-white"
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.value }} />
                    <span>{col.name.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-2 pt-1 border-t border-white/10">
              <span className="text-xs font-semibold text-gray-300">Climbing Arms & Hook Hands</span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { name: "Safety Amber", value: "#eab308" },
                  { name: "Cobalt Blue", value: "#2563eb" },
                  { name: "Silver Metal", value: "#cbd5e1" },
                ].map((col) => (
                  <button
                    key={col.value}
                    onClick={() =>
                      onChangeCustomization({
                        ...customization,
                        ropewayArmColor: col.value,
                        ropewayHookColor: col.value,
                      })
                    }
                    className={`p-2 rounded-xl border text-center text-[10px] font-bold transition flex items-center justify-center gap-1.5 ${
                      (customization.ropewayArmColor || customization.ropewayHookColor || "#eab308") === col.value
                        ? "border-amber-400 bg-amber-500/20 text-white"
                        : "border-white/10 bg-white/5 text-gray-400 hover:text-white"
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.value }} />
                    <span>{col.name.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-2 pt-1 border-t border-white/10">
              <span className="text-xs font-semibold text-gray-300">Mission Payload</span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: "camera-fpv", label: "FPV Camera" },
                  { id: "cargo-hook", label: "Cargo Hook" },
                  { id: "none", label: "Bare Airframe" },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() =>
                      onChangeCustomization({
                        ...customization,
                        ropewayPayload: p.id as any,
                      })
                    }
                    className={`py-1.5 px-2 rounded-lg text-[10px] font-medium transition border text-center ${
                      (customization.ropewayPayload || "camera-fpv") === p.id
                        ? "bg-sky-500 text-white font-bold border-sky-400"
                        : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </section>
          </>
        )}

        {/* =========================================================================
            7. WALKING ROBOT (FALLBACK VIEW)
           ========================================================================= */}
        {machineId === "walking-robot" && (
          <>
            <section className="space-y-2">
              <span className="text-xs font-semibold text-gray-300">Chassis Material</span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: "acrylic", label: "Cast Acrylic" },
                  { id: "plywood", label: "3mm Plywood" },
                  { id: "cardboard", label: "Hard Cardboard" },
                  { id: "3dprint", label: "3D Printed PLA" },
                ].map((mat) => (
                  <button
                    key={mat.id}
                    onClick={() => onChangeCustomization({ ...customization, robotChassisMaterial: mat.id as any })}
                    className={`p-2 rounded-xl text-xs font-medium text-left border transition cursor-pointer ${
                      customization.robotChassisMaterial === mat.id
                        ? "bg-white text-black font-semibold border-white"
                        : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    {mat.label}
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-2 pt-1 border-t border-white/10">
              <span className="text-xs font-semibold text-gray-300">Leg Linkage Material</span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: "popsicle", label: "Wood" },
                  { id: "acrylic", label: "Acrylic" },
                  { id: "aluminum", label: "Aluminum" },
                ].map((leg) => (
                  <button
                    key={leg.id}
                    onClick={() => onChangeCustomization({ ...customization, robotLegMaterial: leg.id as any })}
                    className={`p-2 rounded-xl text-xs font-medium text-center border transition cursor-pointer ${
                      customization.robotLegMaterial === leg.id
                        ? "bg-white text-black font-semibold border-white"
                        : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    {leg.label}
                  </button>
                ))}
              </div>
            </section>
          </>
        )}

        {/* =========================================================================
            8. ROBO-RUMBLE BATTLE CAR CUSTOMIZATION
           ========================================================================= */}
        {machineId === "robo-rumble" && (
          <>
            {/* Combat Class Selector */}
            <section className="space-y-2">
              <span className="text-xs font-semibold text-gray-300">Combat Class Base</span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: "striker", label: "Striker", icon: "🛡️" },
                  { id: "titan", label: "Titan", icon: "⚡" },
                  { id: "viper", label: "Viper", icon: "💨" },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() =>
                      onChangeCustomization({
                        ...customization,
                        battleCarId: c.id as any,
                      })
                    }
                    className={`py-2 px-1 rounded-xl text-xs font-bold text-center border transition cursor-pointer flex flex-col items-center gap-0.5 ${
                      (customization.battleCarId || "striker") === c.id
                        ? "bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/30"
                        : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    <span>{c.icon}</span>
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Body Armor Color */}
            <section className="space-y-2.5 pt-1 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-300">Armor Hull Color</span>
                <span className="text-[10px] text-gray-400 font-mono">
                  {CAR_COLORS.find((c) => c.value === customization.paintColor)?.name || "Custom"}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {CAR_COLORS.map((col) => {
                  const isSelected = customization.paintColor.toLowerCase() === col.value.toLowerCase();
                  return (
                    <button
                      key={col.value}
                      title={col.name}
                      onClick={() => onChangeCustomization({ ...customization, paintColor: col.value })}
                      style={{ backgroundColor: col.value }}
                      className={`h-9 rounded-xl border-2 transition relative flex items-center justify-center cursor-pointer ${
                        isSelected
                          ? "border-white scale-105 shadow-md shadow-white/20"
                          : "border-white/20 hover:border-white/50"
                      }`}
                    >
                      {isSelected && (
                        <Check
                          size={16}
                          className={col.value === "#f1f3f5" || col.value === "#84cc16" || col.value === "#eab308" ? "text-black" : "text-white"}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Chassis Material */}
            <section className="space-y-2 pt-1 border-t border-white/10">
              <span className="text-xs font-semibold text-gray-300">Chassis Material</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "acrylic", label: "Polycarbonate" },
                  { id: "aluminum", label: "6061-T6 Aluminum" },
                  { id: "plywood", label: "Aero Birch Plywood" },
                  { id: "3dprint-petg", label: "PETG 3D-Printed" },
                ].map((mat) => (
                  <button
                    key={mat.id}
                    onClick={() =>
                      onChangeCustomization({
                        ...customization,
                        battleChassisMaterial: mat.id as any,
                      })
                    }
                    className={`p-2 rounded-xl text-xs font-medium text-center border transition cursor-pointer ${
                      (customization.battleChassisMaterial || "acrylic") === mat.id
                        ? "bg-white text-black font-semibold border-white"
                        : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    {mat.label}
                  </button>
                ))}
              </div>
            </section>

            {/* Combat Front Attachment */}
            <section className="space-y-2 pt-1 border-t border-white/10">
              <span className="text-xs font-semibold text-gray-300">Front Combat Attachment</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "wedge", label: "Wedge Blade (Under-Flip)" },
                  { id: "ram-bumper", label: "Ram Bumper (High Impact)" },
                ].map((att) => (
                  <button
                    key={att.id}
                    onClick={() =>
                      onChangeCustomization({
                        ...customization,
                        battleAttachment: att.id as any,
                      })
                    }
                    className={`p-2 rounded-xl text-xs font-medium text-center border transition cursor-pointer ${
                      (customization.battleAttachment || "wedge") === att.id
                        ? "bg-orange-600 text-white font-semibold border-orange-500 shadow-sm"
                        : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    {att.label}
                  </button>
                ))}
              </div>
            </section>

            {/* Tire Grip Chemistry */}
            <section className="space-y-2 pt-1 border-t border-white/10">
              <span className="text-xs font-semibold text-gray-300">Wheel Grip Chemistry</span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: "rubber-tread", label: "Rubber" },
                  { id: "foam-slick", label: "Foam" },
                  { id: "silicone-spike", label: "Silicone" },
                ].map((grip) => (
                  <button
                    key={grip.id}
                    onClick={() =>
                      onChangeCustomization({
                        ...customization,
                        battleTireGrip: grip.id as any,
                      })
                    }
                    className={`py-1.5 px-2 rounded-xl text-xs font-medium text-center border transition cursor-pointer ${
                      (customization.battleTireGrip || "rubber-tread") === grip.id
                        ? "bg-sky-600 text-white font-semibold border-sky-500 shadow-sm"
                        : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    {grip.label}
                  </button>
                ))}
              </div>
            </section>
          </>
        )}

        {/* =========================================================================
            SAVE DESIGN FOOTER SECTION
           ========================================================================= */}
        <section className="pt-2 border-t border-white/10 space-y-2">
          <input
            type="text"
            value={designName}
            onChange={(e) => setDesignName(e.target.value)}
            placeholder="Configuration Name"
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500/50"
          />

          <button
            onClick={handleSave}
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs shadow-xl transition hover:scale-[1.01] cursor-pointer ${
              saveSuccess ? "bg-green-600 text-white" : "bg-white text-black hover:bg-gray-200"
            }`}
          >
            {saveSuccess ? (
              <>
                <Check size={16} />
                <span>Design Saved to Garage!</span>
              </>
            ) : (
              <>
                <BookmarkPlus size={16} />
                <span>Save Custom Design</span>
              </>
            )}
          </button>
        </section>
      </div>
    </aside>
  );
}
