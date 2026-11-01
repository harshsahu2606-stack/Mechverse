"use client";

import React, { useState } from "react";
import { FileSpreadsheet, IndianRupee, Layers, CheckCircle2, Sliders } from "lucide-react";
import { AERO_BOM_PRESETS } from "@/data/aeroDroneData";

export default function AeroBOM() {
  const [selectedPresetKey, setSelectedPresetKey] = useState<"budget" | "balanced" | "performance">("balanced");

  const presetsList = [
    {
      key: "budget" as const,
      name: "Starter / Student Budget Build",
      targetAudience: "School / engineering lab basic quadcopter",
      items: AERO_BOM_PRESETS.budget,
    },
    {
      key: "balanced" as const,
      name: "Standard Balanced Build (Pixhawk)",
      targetAudience: "Field inspection & robotics research platform",
      items: AERO_BOM_PRESETS.balanced,
    },
    {
      key: "performance" as const,
      name: "High-End Carbon Fiber Build",
      targetAudience: "Professional aerial inspection with HD camera & Sunnysky motors",
      items: AERO_BOM_PRESETS.performance,
    },
  ];

  const activePreset = presetsList.find((p) => p.key === selectedPresetKey) || presetsList[1];

  const activeTotalCost = activePreset.items.reduce(
    (sum, item) => sum + item.estimatedPriceINR * item.qty,
    0
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 space-y-6 text-gray-200">
      <div>
        <h2 className="text-2xl font-black text-white flex items-center gap-2">
          <FileSpreadsheet className="text-emerald-400" size={24} />
          <span>Bill of Materials (BOM) & Budget Presets</span>
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Explore realistic procurement tiers for student learning, field inspection, or high-thrust carbon builds.
        </p>
      </div>

      {/* Preset Tier Switcher Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {presetsList.map((p) => {
          const isSelected = p.key === activePreset.key;
          const totalCost = p.items.reduce((sum, item) => sum + item.estimatedPriceINR * item.qty, 0);

          return (
            <div
              key={p.key}
              onClick={() => setSelectedPresetKey(p.key)}
              className={`p-5 rounded-2xl border cursor-pointer transition select-none flex flex-col justify-between ${
                isSelected
                  ? "bg-gradient-to-b from-[#11241a] to-[#0a140f] border-emerald-500 shadow-xl shadow-emerald-600/20"
                  : "bg-[#0e131b] border-white/10 hover:border-white/20"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase text-emerald-400">
                    {p.name}
                  </span>
                  {isSelected && <CheckCircle2 size={16} className="text-emerald-400" />}
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  ₹{totalCost.toLocaleString("en-IN")}
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">{p.targetAudience}</p>
              </div>

              <div className="pt-4 border-t border-white/5 mt-4 text-[11px] font-mono text-gray-400">
                {p.items.length} Essential Items Included
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Parts List Table */}
      <div className="bg-[#0e131b] border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
            {activePreset.name} Breakdown ({activePreset.items.length} Line Items)
          </h3>
          <span className="text-xs font-mono text-emerald-400 font-bold">
            Total: ₹{activeTotalCost.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 text-gray-400">
                <th className="py-2.5">Category</th>
                <th className="py-2.5">Item Description & Model</th>
                <th className="py-2.5 text-center">Qty</th>
                <th className="py-2.5 text-right">Unit Price</th>
                <th className="py-2.5 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              {activePreset.items.map((item, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02]">
                  <td className="py-2.5 text-emerald-400 font-bold uppercase">{item.category}</td>
                  <td className="py-2.5 text-white">{item.name}</td>
                  <td className="py-2.5 text-center">{item.qty}</td>
                  <td className="py-2.5 text-right text-gray-400">
                    ₹{item.estimatedPriceINR.toLocaleString("en-IN")}
                  </td>
                  <td className="py-2.5 text-right font-bold text-white">
                    ₹{(item.estimatedPriceINR * item.qty).toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
