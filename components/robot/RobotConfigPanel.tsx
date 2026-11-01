"use client";

import { useState } from "react";
import { Sliders, AlertTriangle, CheckCircle2, BookmarkPlus, Check, BatteryCharging, Cpu, Shield } from "lucide-react";
import { CustomizationSettings } from "@/types/machine";

interface RobotConfigPanelProps {
  customization: CustomizationSettings;
  onChangeCustomization: (settings: CustomizationSettings) => void;
  onSaveDesign: (name: string) => void;
}

export default function RobotConfigPanel({
  customization,
  onChangeCustomization,
  onSaveDesign,
}: RobotConfigPanelProps) {
  const [configName, setConfigName] = useState("Custom Strider Build");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Check electrical & mechanical compatibility
  const isHighVoltage =
    customization.robotBatteryType === "9v" &&
    customization.robotMotorType === "bo-single";

  const isLowTraction = customization.robotFootGrip === "bare";

  const handleSave = () => {
    onSaveDesign(configName);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2400);
  };

  return (
    <aside className="absolute top-16 right-4 z-20 w-80 sm:w-88 max-w-[calc(100vw-2rem)] pointer-events-auto">
      <div className="rounded-2xl border border-white/15 bg-[#111318]/95 backdrop-blur-xl p-5 shadow-2xl space-y-5 max-h-[82vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div>
          <span className="text-[10px] font-mono tracking-widest text-orange-400 uppercase bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
            ENGINEERING SPEC STUDIO
          </span>
          <h3 className="text-xl font-bold text-white mt-1.5">Robot Configuration</h3>
          <p className="text-xs text-gray-400 mt-1">
            Configure chassis materials, power plant, and leg linkages. Updates 3D model in real time.
          </p>
        </div>

        {/* Compatibility Warnings */}
        {isHighVoltage && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2">
            <AlertTriangle size={15} className="shrink-0 mt-0.5 text-amber-400" />
            <div>
              <span className="font-bold">Overvoltage Warning:</span> 9V directly connected to a 3V BO motor can overheat coils and melt nylon gears. Add a 100Ω power resistor or step-down buck converter.
            </div>
          </div>
        )}

        {isLowTraction && (
          <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs flex items-start gap-2">
            <Shield size={15} className="shrink-0 mt-0.5 text-sky-400" />
            <div>
              <span className="font-bold">Low Traction Warning:</span> Bare wood or plastic feet slip easily on smooth floor tiles. Rubber or hot glue pads are recommended.
            </div>
          </div>
        )}

        {/* 1. Chassis Material */}
        <section className="space-y-2">
          <span className="text-xs font-semibold text-gray-300">Chassis Material</span>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: "acrylic", label: "3mm Cast Acrylic" },
              { id: "plywood", label: "3mm Plywood" },
              { id: "cardboard", label: "Hard Cardboard" },
              { id: "3dprint", label: "3D Printed PLA" },
            ].map((mat) => {
              const isSelected = customization.robotChassisMaterial === mat.id;
              return (
                <button
                  key={mat.id}
                  onClick={() =>
                    onChangeCustomization({
                      ...customization,
                      robotChassisMaterial: mat.id as any,
                    })
                  }
                  className={`p-2 rounded-xl text-xs font-medium text-left border transition ${
                    isSelected
                      ? "bg-white text-black font-semibold border-white"
                      : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                  }`}
                >
                  {mat.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* 2. Leg Linkage Material */}
        <section className="space-y-2">
          <span className="text-xs font-semibold text-gray-300">Leg Linkage Material</span>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: "popsicle", label: "Wood Sticks" },
              { id: "acrylic", label: "Acrylic" },
              { id: "aluminum", label: "Aluminum" },
            ].map((leg) => {
              const isSelected = customization.robotLegMaterial === leg.id;
              return (
                <button
                  key={leg.id}
                  onClick={() =>
                    onChangeCustomization({
                      ...customization,
                      robotLegMaterial: leg.id as any,
                    })
                  }
                  className={`py-2 px-1 rounded-xl text-xs font-medium text-center border transition ${
                    isSelected
                      ? "bg-orange-500 text-white font-semibold border-orange-400"
                      : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                  }`}
                >
                  {leg.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* 3. Battery System */}
        <section className="space-y-2">
          <span className="text-xs font-semibold text-gray-300">Power Supply</span>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: "2x-aa", label: "2x AA (3.0V) — Safe" },
              { id: "4x-aa", label: "4x AA (6.0V) — Fast" },
              { id: "18650", label: "18650 Li-ion (3.7V)" },
              { id: "9v", label: "9V Alkaline Block" },
            ].map((batt) => {
              const isSelected = customization.robotBatteryType === batt.id;
              return (
                <button
                  key={batt.id}
                  onClick={() =>
                    onChangeCustomization({
                      ...customization,
                      robotBatteryType: batt.id as any,
                    })
                  }
                  className={`p-2 rounded-xl text-xs font-medium text-left border transition ${
                    isSelected
                      ? "bg-sky-500 text-white font-semibold border-sky-400"
                      : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                  }`}
                >
                  {batt.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* 4. Foot Traction Pad */}
        <section className="space-y-2">
          <span className="text-xs font-semibold text-gray-300">Foot Traction</span>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: "rubber", label: "Rubber / Silicone" },
              { id: "glue", label: "Hot Glue Bead" },
              { id: "bare", label: "Bare Tip" },
            ].map((grip) => {
              const isSelected = customization.robotFootGrip === grip.id;
              return (
                <button
                  key={grip.id}
                  onClick={() =>
                    onChangeCustomization({
                      ...customization,
                      robotFootGrip: grip.id as any,
                    })
                  }
                  className={`py-2 px-1 rounded-xl text-xs font-medium text-center border transition ${
                    isSelected
                      ? "bg-white text-black font-semibold border-white"
                      : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                  }`}
                >
                  {grip.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Save Configuration */}
        <section className="pt-2 border-t border-white/10 space-y-2">
          <input
            type="text"
            value={configName}
            onChange={(e) => setConfigName(e.target.value)}
            placeholder="Configuration Name"
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500/50"
          />

          <button
            onClick={handleSave}
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs shadow-xl transition hover:scale-[1.01] ${
              saveSuccess
                ? "bg-green-600 text-white"
                : "bg-orange-500 hover:bg-orange-400 text-white"
            }`}
          >
            {saveSuccess ? (
              <>
                <Check size={16} />
                <span>Configuration Saved!</span>
              </>
            ) : (
              <>
                <BookmarkPlus size={16} />
                <span>Save Custom Build</span>
              </>
            )}
          </button>
        </section>
      </div>
    </aside>
  );
}
