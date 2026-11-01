"use client";

import { useState } from "react";
import {
  Sliders,
  Shield,
  Zap,
  Gauge,
  Scale,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  BookmarkPlus,
  RefreshCw,
  Coins,
} from "lucide-react";
import { BattleCarId, CustomizationSettings } from "@/types/machine";
import { BATTLE_CARS_SPEC } from "@/data/roboRumbleData";

interface RoboRumbleCustomizerProps {
  customization: CustomizationSettings;
  onChangeCustomization: (settings: CustomizationSettings) => void;
  onSaveDesign: (name: string) => void;
}

export default function RoboRumbleCustomizer({
  customization,
  onChangeCustomization,
  onSaveDesign,
}: RoboRumbleCustomizerProps) {
  const [designName, setDesignName] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const carId: BattleCarId = customization.battleCarId || "striker";
  const baseSpec = BATTLE_CARS_SPEC[carId] || BATTLE_CARS_SPEC.striker;

  // Active customization values
  const chassisMaterial = customization.battleChassisMaterial || "acrylic";
  const motorType = customization.battleMotorType || "quad-tt-200";
  const motorCount = customization.battleMotorCount || 4;
  const wheelDiameter = customization.battleWheelDiameter || 55;
  const tireGrip = customization.battleTireGrip || "rubber-tread";
  const batteryType = customization.battleBatteryType || "2s-liion";
  const attachment = customization.battleAttachment || "wedge";

  // Dynamic calculated performance metrics
  let calculatedWeight = baseSpec.chassis.totalWeightGrams;
  if (chassisMaterial === "aluminum") calculatedWeight += 85;
  if (chassisMaterial === "plywood") calculatedWeight -= 45;
  if (batteryType === "3s-lipo") calculatedWeight += 95;
  if (batteryType === "2x-aa") calculatedWeight -= 35;
  if (attachment === "ram-bumper") calculatedWeight += 110;

  let calculatedTopSpeed = baseSpec.performanceMetrics.topSpeedKmH;
  if (motorType === "quad-n20-300") calculatedTopSpeed *= 1.35;
  if (batteryType === "3s-lipo") calculatedTopSpeed *= 1.25;
  if (batteryType === "2x-aa") calculatedTopSpeed *= 0.65;
  if (wheelDiameter === 68) calculatedTopSpeed *= 1.18;
  if (wheelDiameter === 42) calculatedTopSpeed *= 0.85;

  let calculatedPushForce = baseSpec.performanceMetrics.maxPushForceN;
  if (motorType === "high-torque-500") calculatedPushForce *= 1.4;
  if (batteryType === "3s-lipo") calculatedPushForce *= 1.25;
  if (tireGrip === "silicone-spike") calculatedPushForce *= 1.15;
  if (batteryType === "2x-aa") calculatedPushForce *= 0.6;

  let calculatedCostINR = baseSpec.performanceMetrics.estimatedCostINR;
  if (chassisMaterial === "aluminum") calculatedCostINR += 350;
  if (motorType === "quad-n20-300") calculatedCostINR += 400;
  if (batteryType === "3s-lipo") calculatedCostINR += 550;
  if (attachment === "ram-bumper") calculatedCostINR += 200;

  // Engineering Compatibility Validation Engine
  const compatibilityWarnings: string[] = [];
  if (batteryType === "3s-lipo" && motorType === "dual-bo-100") {
    compatibilityWarnings.push(
      "Warning: 11.1V 3S LiPo voltage exceeds 6V rating of standard BO gear motors. Risk of brush burnout under heavy stall."
    );
  }
  if (calculatedWeight > 700 && batteryType === "2x-aa") {
    compatibilityWarnings.push(
      "Warning: 3.0V supply produces insufficient stall torque to push a heavy >700g chassis. Recommend 6.0V (4x AA) or 7.4V (2S Li-ion)."
    );
  }
  if (tireGrip === "foam-slick" && attachment === "ram-bumper") {
    compatibilityWarnings.push(
      "Notice: Soft foam slicks provide lower pushing traction against high-inertia opponents than ribbed rubber or silicone spike treads."
    );
  }

  const handleUpdate = (updates: Partial<CustomizationSettings>) => {
    onChangeCustomization({
      ...customization,
      ...updates,
    });
  };

  const handleSave = () => {
    if (!designName.trim()) return;
    onSaveDesign(designName.trim());
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
    setDesignName("");
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6 text-gray-300">
      {/* Title */}
      <div className="space-y-1.5 border-b border-white/10 pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/20 text-orange-400 font-mono text-[11px] uppercase">
          <Sliders size={12} />
          <span>Vehicle Customization Workshop</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Robo Rumble Engineering Configurator
        </h2>
        <p className="text-xs sm:text-sm text-gray-400">
          Modify chassis materials, motor torque, wheel grip, battery chemistry, and combat attachments with live engineering telemetry and compatibility checks.
        </p>
      </div>

      {/* Real-Time Telemetry Dashboard Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3 rounded-2xl bg-[#111318] border border-white/10 space-y-1">
          <span className="text-[10px] font-mono uppercase text-gray-400">Top Speed</span>
          <div className="text-xl font-bold text-white">
            {calculatedTopSpeed.toFixed(1)} <span className="text-xs text-gray-400">km/h</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-[#111318] border border-white/10 space-y-1">
          <span className="text-[10px] font-mono uppercase text-gray-400">Pushing Force</span>
          <div className="text-xl font-bold text-orange-400">
            {calculatedPushForce.toFixed(1)} <span className="text-xs text-gray-400">N</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-[#111318] border border-white/10 space-y-1">
          <span className="text-[10px] font-mono uppercase text-gray-400">Total Mass</span>
          <div className="text-xl font-bold text-sky-400">
            {calculatedWeight} <span className="text-xs text-gray-400">g</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-[#111318] border border-white/10 space-y-1">
          <span className="text-[10px] font-mono uppercase text-gray-400">Runtime</span>
          <div className="text-xl font-bold text-emerald-400">
            ~{batteryType === "3s-lipo" ? 22 : batteryType === "2s-liion" ? 28 : 18} <span className="text-xs text-gray-400">min</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-[#111318] border border-white/10 space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[10px] font-mono uppercase text-gray-400">Est. Build Cost</span>
          <div className="text-xl font-bold text-amber-400 flex items-center gap-1">
            <span>₹{calculatedCostINR}</span>
          </div>
        </div>
      </div>

      {/* Compatibility Validation Alerts */}
      {compatibilityWarnings.length > 0 && (
        <div className="space-y-2">
          {compatibilityWarnings.map((warn, i) => (
            <div
              key={i}
              className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs"
            >
              <AlertTriangle size={15} className="shrink-0 mt-0.5 text-amber-400" />
              <span>{warn}</span>
            </div>
          ))}
        </div>
      )}

      {/* Configuration Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. Base Vehicle Model */}
        <div className="rounded-2xl border border-white/10 bg-[#111318] p-5 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Shield size={16} className="text-orange-400" />
            <span>1. Battle Vehicle Base Model</span>
          </h3>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "striker", label: "STRIKER", desc: "Low Wedge Pusher" },
              { id: "titan", label: "TITAN", desc: "Heavy Ram Tank" },
              { id: "viper", label: "VIPER", desc: "Agile Speedster" },
            ].map((v) => (
              <button
                key={v.id}
                onClick={() => handleUpdate({ battleCarId: v.id as BattleCarId })}
                className={`p-3 rounded-xl text-left border transition ${
                  carId === v.id
                    ? "bg-white text-black font-bold border-white shadow-lg"
                    : "bg-black/40 border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="text-xs font-bold">{v.label}</div>
                <div className="text-[10px] opacity-75">{v.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Chassis Material */}
        <div className="rounded-2xl border border-white/10 bg-[#111318] p-5 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Scale size={16} className="text-sky-400" />
            <span>2. Chassis Structural Material</span>
          </h3>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { id: "acrylic", label: "3mm Cast Acrylic", note: "Light & Stiff" },
              { id: "aluminum", label: "6061-T6 Aluminum", note: "Maximum Impact" },
              { id: "plywood", label: "3mm Birch Plywood", note: "Cheap & Workable" },
              { id: "3dprint-petg", label: "3D Printed PETG", note: "Modular Geometry" },
            ].map((mat) => (
              <button
                key={mat.id}
                onClick={() => handleUpdate({ battleChassisMaterial: mat.id as any })}
                className={`p-2.5 rounded-xl text-left border transition ${
                  chassisMaterial === mat.id
                    ? "bg-sky-500/20 border-sky-400 text-sky-200 font-semibold"
                    : "bg-black/40 border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="font-semibold text-white">{mat.label}</div>
                <div className="text-[10px] text-gray-500">{mat.note}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Motor & Gearbox Drivetrain */}
        <div className="rounded-2xl border border-white/10 bg-[#111318] p-5 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Zap size={16} className="text-yellow-400" />
            <span>3. Motor &amp; Gearbox Configuration</span>
          </h3>

          <div className="space-y-2 text-xs">
            {[
              { id: "quad-tt-200", label: "Quad TT Geared Motors (200 RPM / 1:48)", desc: "Balanced torque and speed for 4WD pushing" },
              { id: "quad-n20-300", label: "Quad N20 Metal Gear (300 RPM / 1:30)", desc: "High acceleration and agile maneuverability" },
              { id: "high-torque-500", label: "High-Torque Planetary (150 RPM / 1:75)", desc: "Maximum brute-force pushing power" },
              { id: "dual-bo-100", label: "Dual BO Economy Motors (100 RPM / 1:48)", desc: "Low-cost 2WD build with rear castors" },
            ].map((mot) => (
              <button
                key={mot.id}
                onClick={() => handleUpdate({ battleMotorType: mot.id as any })}
                className={`w-full p-2.5 rounded-xl text-left border transition ${
                  motorType === mot.id
                    ? "bg-yellow-500/15 border-yellow-400/50 text-yellow-200 font-semibold"
                    : "bg-black/40 border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="font-semibold text-white">{mot.label}</div>
                <div className="text-[10px] text-gray-400">{mot.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 4. Wheels & Tire Grip Compound */}
        <div className="rounded-2xl border border-white/10 bg-[#111318] p-5 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Gauge size={16} className="text-emerald-400" />
            <span>4. Wheels &amp; Tire Traction</span>
          </h3>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { id: "rubber-tread", label: "Ribbed Rubber Tread", grip: "μ ≈ 0.90" },
              { id: "silicone-spike", label: "Silicone Spike Grip", grip: "μ ≈ 0.95 (High Traction)" },
              { id: "foam-slick", label: "Soft Foam Slicks", grip: "μ ≈ 0.82 (Fast Turn)" },
              { id: "mecanum", label: "Omni Mecanum Rollers", grip: "Omni-directional" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => handleUpdate({ battleTireGrip: t.id as any })}
                className={`p-2.5 rounded-xl text-left border transition ${
                  tireGrip === t.id
                    ? "bg-emerald-500/15 border-emerald-400/50 text-emerald-200 font-semibold"
                    : "bg-black/40 border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="font-semibold text-white">{t.label}</div>
                <div className="text-[10px] text-emerald-400 font-mono">{t.grip}</div>
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-white/5">
            <span className="text-[11px] text-gray-400 block mb-1">Wheel Diameter:</span>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[42, 55, 68].map((dia) => (
                <button
                  key={dia}
                  onClick={() => handleUpdate({ battleWheelDiameter: dia as any })}
                  className={`py-1.5 px-2 rounded-lg border text-center transition ${
                    wheelDiameter === dia
                      ? "bg-white/20 border-white text-white font-bold"
                      : "bg-black/40 border-white/10 text-gray-400 hover:text-white"
                  }`}
                >
                  {dia} mm
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Battery Power Chemistry */}
        <div className="rounded-2xl border border-white/10 bg-[#111318] p-5 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Zap size={16} className="text-sky-400" />
            <span>5. Battery Voltage &amp; Chemistry</span>
          </h3>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { id: "2s-liion", label: "2S Li-ion 7.4V (18650)", note: "Best Balance / 2000mAh" },
              { id: "3s-lipo", label: "3S LiPo 11.1V High-C", note: "Maximum Burst Power" },
              { id: "4x-aa", label: "4x AA 6.0V Alkaline", note: "Safe & Readily Available" },
              { id: "2x-aa", label: "2x AA 3.0V Pack", note: "Ultra-Lightweight / Budget" },
            ].map((bat) => (
              <button
                key={bat.id}
                onClick={() => handleUpdate({ battleBatteryType: bat.id as any })}
                className={`p-2.5 rounded-xl text-left border transition ${
                  batteryType === bat.id
                    ? "bg-sky-500/15 border-sky-400/50 text-sky-200 font-semibold"
                    : "bg-black/40 border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="font-semibold text-white">{bat.label}</div>
                <div className="text-[10px] text-gray-400">{bat.note}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 6. Combat Attachments */}
        <div className="rounded-2xl border border-white/10 bg-[#111318] p-5 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Wrench size={16} className="text-orange-400" />
            <span>6. Combat Weapons &amp; Armor Attachment</span>
          </h3>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { id: "wedge", label: "Ground Wedge (14° Incline)", desc: "Lifts opponent wheels" },
              { id: "ram-bumper", label: "Heavy Steel Ram Bumper", desc: "Absorbs crash energy" },
              { id: "side-deflectors", label: "Side Deflector Skirts", desc: "Protects wheel wells" },
              { id: "lifter", label: "Mechanical Flipper Arm", desc: "Disrupts opponent CoG" },
            ].map((att) => (
              <button
                key={att.id}
                onClick={() => handleUpdate({ battleAttachment: att.id as any })}
                className={`p-2.5 rounded-xl text-left border transition ${
                  attachment === att.id
                    ? "bg-orange-500/15 border-orange-400/50 text-orange-200 font-semibold"
                    : "bg-black/40 border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="font-semibold text-white">{att.label}</div>
                <div className="text-[10px] text-gray-400">{att.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Save Custom Battle Build */}
      <div className="rounded-2xl border border-white/10 bg-[#111318] p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-white">Save Custom Battle Spec</h4>
          <p className="text-xs text-gray-400">Save this exact configuration to your local garage.</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="e.g. Striker MK-II Overdrive"
            value={designName}
            onChange={(e) => setDesignName(e.target.value)}
            className="flex-1 sm:w-64 bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
          />
          <button
            onClick={handleSave}
            disabled={!designName.trim()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 disabled:opacity-40 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition whitespace-nowrap"
          >
            {saveSuccess ? <CheckCircle2 size={14} /> : <BookmarkPlus size={14} />}
            <span>{saveSuccess ? "Saved!" : "Save"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
