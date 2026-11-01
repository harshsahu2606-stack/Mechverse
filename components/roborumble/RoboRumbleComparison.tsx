"use client";

import { useState } from "react";
import { Scale, Shield, Zap, Wind, ArrowRight, CheckCircle2 } from "lucide-react";
import { BattleCarId } from "@/types/machine";
import { BATTLE_CARS_SPEC } from "@/data/roboRumbleData";

export default function RoboRumbleComparison() {
  const [carA, setCarA] = useState<BattleCarId>("striker");
  const [carB, setCarB] = useState<BattleCarId>("titan");

  const specA = BATTLE_CARS_SPEC[carA];
  const specB = BATTLE_CARS_SPEC[carB];

  const cars = [
    { id: "striker", label: "STRIKER (Wedge Pusher)", icon: Shield },
    { id: "titan", label: "TITAN (Heavy Tank)", icon: Zap },
    { id: "viper", label: "VIPER (Agile Speedster)", icon: Wind },
  ] as const;

  const comparisonRows = [
    {
      label: "Vehicle Role",
      valA: specA.role,
      valB: specB.role,
    },
    {
      label: "Chassis Dimensions",
      valA: `${specA.chassis.length} x ${specA.chassis.width} x ${specA.chassis.height}`,
      valB: `${specB.chassis.length} x ${specB.chassis.width} x ${specB.chassis.height}`,
    },
    {
      label: "Total Weight",
      valA: `${specA.chassis.totalWeightGrams} grams`,
      valB: `${specB.chassis.totalWeightGrams} grams`,
      highlightA: specA.chassis.totalWeightGrams < specB.chassis.totalWeightGrams,
      highlightB: specB.chassis.totalWeightGrams < specA.chassis.totalWeightGrams,
    },
    {
      label: "Top Speed",
      valA: `${specA.performanceMetrics.topSpeedKmH} km/h`,
      valB: `${specB.performanceMetrics.topSpeedKmH} km/h`,
      highlightA: specA.performanceMetrics.topSpeedKmH > specB.performanceMetrics.topSpeedKmH,
      highlightB: specB.performanceMetrics.topSpeedKmH > specA.performanceMetrics.topSpeedKmH,
    },
    {
      label: "Max Pushing Force",
      valA: `${specA.performanceMetrics.maxPushForceN} N`,
      valB: `${specB.performanceMetrics.maxPushForceN} N`,
      highlightA: specA.performanceMetrics.maxPushForceN > specB.performanceMetrics.maxPushForceN,
      highlightB: specB.performanceMetrics.maxPushForceN > specA.performanceMetrics.maxPushForceN,
    },
    {
      label: "Tire Traction Coeff (μ)",
      valA: `μ ≈ ${specA.drivetrain.frictionCoeff}`,
      valB: `μ ≈ ${specB.drivetrain.frictionCoeff}`,
      highlightA: specA.drivetrain.frictionCoeff > specB.drivetrain.frictionCoeff,
      highlightB: specB.drivetrain.frictionCoeff > specA.drivetrain.frictionCoeff,
    },
    {
      label: "Drivetrain & Motors",
      valA: specA.drivetrain.type,
      valB: specB.drivetrain.type,
    },
    {
      label: "Battery Specification",
      valA: specA.powerAndControl.battery,
      valB: specB.powerAndControl.battery,
    },
    {
      label: "Primary Attachment",
      valA: specA.weaponAttachment.name,
      valB: specB.weaponAttachment.name,
    },
    {
      label: "Estimated Build Cost",
      valA: `₹${specA.performanceMetrics.estimatedCostINR} INR`,
      valB: `₹${specB.performanceMetrics.estimatedCostINR} INR`,
      highlightA: specA.performanceMetrics.estimatedCostINR < specB.performanceMetrics.estimatedCostINR,
      highlightB: specB.performanceMetrics.estimatedCostINR < specA.performanceMetrics.estimatedCostINR,
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6 text-gray-300">
      {/* Header */}
      <div className="space-y-1.5 border-b border-white/10 pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/20 text-orange-400 font-mono text-[11px] uppercase">
          <Scale size={12} />
          <span>Vehicle Benchmark Matrix</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Robo Rumble Vehicle Comparison
        </h2>
        <p className="text-xs sm:text-sm text-gray-400">
          Compare kinematics, weight distribution, pushing leverage, and electrical power between STRIKER, TITAN, and VIPER.
        </p>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Vehicle A Selector */}
        <div className="p-4 rounded-2xl bg-[#111318] border border-white/10 space-y-2">
          <span className="text-[10px] uppercase font-mono text-gray-400">Vehicle A</span>
          <div className="grid grid-cols-3 gap-1.5">
            {cars.map((c) => (
              <button
                key={c.id}
                onClick={() => setCarA(c.id as BattleCarId)}
                className={`p-2 rounded-xl text-xs font-bold transition border ${
                  carA === c.id
                    ? "bg-orange-500 border-orange-400 text-white shadow-md shadow-orange-500/20"
                    : "bg-black/40 border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                {c.label.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Vehicle B Selector */}
        <div className="p-4 rounded-2xl bg-[#111318] border border-white/10 space-y-2">
          <span className="text-[10px] uppercase font-mono text-gray-400">Vehicle B</span>
          <div className="grid grid-cols-3 gap-1.5">
            {cars.map((c) => (
              <button
                key={c.id}
                onClick={() => setCarB(c.id as BattleCarId)}
                className={`p-2 rounded-xl text-xs font-bold transition border ${
                  carB === c.id
                    ? "bg-sky-500 border-sky-400 text-white shadow-md shadow-sky-500/20"
                    : "bg-black/40 border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                {c.label.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="rounded-2xl border border-white/10 bg-[#111318] overflow-hidden shadow-xl">
        <div className="grid grid-cols-12 bg-black/60 p-4 border-b border-white/10 font-bold text-xs text-white">
          <div className="col-span-4 uppercase text-gray-400 font-mono text-[11px]">Engineering Metric</div>
          <div className="col-span-4 text-orange-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-400" />
            <span>{specA.name}</span>
          </div>
          <div className="col-span-4 text-sky-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            <span>{specB.name}</span>
          </div>
        </div>

        <div className="divide-y divide-white/5 text-xs">
          {comparisonRows.map((row, idx) => (
            <div
              key={idx}
              className="grid grid-cols-12 p-3.5 hover:bg-white/[0.02] transition items-center"
            >
              <div className="col-span-4 font-medium text-gray-400">{row.label}</div>
              <div
                className={`col-span-4 pr-3 ${
                  row.highlightA ? "font-bold text-emerald-400" : "text-gray-200"
                }`}
              >
                {row.valA}
              </div>
              <div
                className={`col-span-4 ${
                  row.highlightB ? "font-bold text-emerald-400" : "text-gray-200"
                }`}
              >
                {row.valB}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
