"use client";

import { useState } from "react";
import { Check, Disc, Palette, Shield, Sparkles, CheckSquare, Square, BookmarkPlus } from "lucide-react";
import { CustomizationSettings, MachineId } from "@/types/machine";

interface CustomizerPanelProps {
  machineId: MachineId;
  customization: CustomizationSettings;
  onChangeCustomization: (settings: CustomizationSettings) => void;
  onSaveDesign: (name: string) => void;
}

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
    machineId === "sports-car" ? "Apex Speciale Edition" : "AeroFlow Custom Lab"
  );
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleColorChange = (paintColor: string) => {
    onChangeCustomization({ ...customization, paintColor });
  };

  const handleFinishChange = (finish: "glossy" | "matte" | "metallic") => {
    onChangeCustomization({ ...customization, finish });
  };

  const handleWheelStyleChange = (wheelStyle: "sport" | "star" | "aero") => {
    onChangeCustomization({ ...customization, wheelStyle });
  };

  const handleRimColorChange = (rimColor: string) => {
    onChangeCustomization({ ...customization, rimColor });
  };

  const handleBodyPartToggle = (key: keyof CustomizationSettings["bodyParts"]) => {
    onChangeCustomization({
      ...customization,
      bodyParts: {
        ...customization.bodyParts,
        [key]: !customization.bodyParts[key],
      },
    });
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
          <h3 className="text-xl font-bold text-white mt-1.5">Customize</h3>
          <p className="text-xs text-gray-400 mt-1">
            Configure exterior finishes, aerodynamics, and structural styling.
          </p>
        </div>

        {/* 1. Body Color Swatches matching Screenshot 6 */}
        <section className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-300">
              {machineId === "sports-car" ? "Body Color" : "Fan Housing Color"}
            </span>
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
                  onClick={() => handleColorChange(col.value)}
                  style={{ backgroundColor: col.value }}
                  className={`h-9 rounded-xl border-2 transition relative flex items-center justify-center ${
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

        {/* 2. Paint Finish (Glossy, Matte, Metallic) */}
        <section className="space-y-2">
          <span className="text-xs font-semibold text-gray-300">Finish Coating</span>
          <div className="grid grid-cols-3 gap-1.5">
            {(["glossy", "metallic", "matte"] as const).map((finish) => (
              <button
                key={finish}
                onClick={() => handleFinishChange(finish)}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium capitalize transition border ${
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

        {/* Machine Specific Customization */}
        {machineId === "sports-car" ? (
          <>
            {/* 3. Wheels / Rims matching Screenshot 6 */}
            <section className="space-y-2.5 pt-1">
              <span className="text-xs font-semibold text-gray-300">Wheels & Rims</span>
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
                      onClick={() => handleWheelStyleChange(wheel.id as any)}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl border transition ${
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
                      onClick={() => handleRimColorChange(col.value)}
                      style={{ backgroundColor: col.value }}
                      className={`w-5 h-5 rounded-full border ${
                        customization.rimColor === col.value
                          ? "border-white scale-110"
                          : "border-white/20"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* 4. Body Parts Checkboxes matching Screenshot 6 */}
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
                      onClick={() => handleBodyPartToggle(item.key as keyof CustomizationSettings["bodyParts"])}
                      className="w-full flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-left transition"
                    >
                      <span className={isActive ? "text-white font-medium" : "text-gray-400"}>
                        {item.label}
                      </span>
                      {isActive ? (
                        <CheckSquare size={16} className="text-red-500" />
                      ) : (
                        <Square size={16} className="text-gray-600" />
                      )}
                    </button>
                  );
                })}
              </div>
            </section>
          </>
        ) : (
          /* Fan Specific Customization */
          <>
            <section className="space-y-2.5 pt-1">
              <span className="text-xs font-semibold text-gray-300">Translucent Blade Tint</span>
              <div className="grid grid-cols-5 gap-1.5">
                {FAN_BLADE_COLORS.map((col) => (
                  <button
                    key={col.value}
                    title={col.name}
                    onClick={() => onChangeCustomization({ ...customization, fanBladeColor: col.value })}
                    style={{ backgroundColor: col.value }}
                    className={`h-7 rounded-lg border transition ${
                      customization.fanBladeColor === col.value
                        ? "border-white scale-110 shadow-sm"
                        : "border-white/20"
                    }`}
                  />
                ))}
              </div>
            </section>

            <section className="space-y-2 pt-1 border-t border-white/10">
              <span className="text-xs font-semibold text-gray-300">Base Pedestal Tint</span>
              <div className="grid grid-cols-4 gap-2">
                {CAR_COLORS.slice(0, 4).map((col) => (
                  <button
                    key={col.value}
                    title={col.name}
                    onClick={() => onChangeCustomization({ ...customization, fanBaseColor: col.value })}
                    style={{ backgroundColor: col.value }}
                    className={`h-7 rounded-lg border transition ${
                      customization.fanBaseColor === col.value
                        ? "border-white scale-110"
                        : "border-white/20"
                    }`}
                  />
                ))}
              </div>
            </section>
          </>
        )}

        {/* 5. Save Design matching Screenshot 6 */}
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
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs shadow-xl transition hover:scale-[1.01] ${
              saveSuccess
                ? "bg-green-600 text-white"
                : "bg-white text-black hover:bg-gray-200"
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
                <span>Save Design</span>
              </>
            )}
          </button>
        </section>
      </div>
    </aside>
  );
}
