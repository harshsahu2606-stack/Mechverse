"use client";

import React from "react";
import { FileText, Cpu, Compass, Activity, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { ROPEWAY_ENGINEERING_DOCS, ROPEWAY_SPEC } from "@/data/ropewayRobotData";

export default function RopewayEngineeringDocs() {
  const docs = [
    ROPEWAY_ENGINEERING_DOCS.tractionTheory,
    ROPEWAY_ENGINEERING_DOCS.inclineClimbing,
    ROPEWAY_ENGINEERING_DOCS.wormSelfLocking,
    ROPEWAY_ENGINEERING_DOCS.catenarySag,
  ];

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-8 text-gray-300">
      {/* Title */}
      <div className="space-y-2 border-b border-white/10 pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono text-[11px] uppercase">
          Mathematical Formulations & Kinematics
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          AeroClimb RC-1 Engineering Specifications
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
          Analytical derivations of wedge-groove friction mechanics, self-locking worm lead angle criteria, gravity slope equilibrium, and catenary cable sag dynamics.
        </p>
      </div>

      {/* Specifications Master Table */}
      <div className="rounded-2xl border border-white/10 bg-[#0d0f14] p-5 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
          <Cpu size={16} className="text-indigo-400" />
          <span>Master Engineering Specification Sheet</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
            <span className="text-[10px] text-gray-400 uppercase font-mono block">Gear Motor</span>
            <span className="font-bold text-white">{ROPEWAY_SPEC.motor.type}</span>
            <p className="text-[11px] text-indigo-300">{ROPEWAY_SPEC.motor.stallTorque} Stall</p>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
            <span className="text-[10px] text-gray-400 uppercase font-mono block">Traction Sheaves</span>
            <span className="font-bold text-white">{ROPEWAY_SPEC.cableMechanics.driveSheaveDiameter}</span>
            <p className="text-[11px] text-emerald-300">{ROPEWAY_SPEC.cableMechanics.sheaveMaterial}</p>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
            <span className="text-[10px] text-gray-400 uppercase font-mono block">Max Incline</span>
            <span className="font-bold text-amber-400">{ROPEWAY_SPEC.cableMechanics.maxClimbingAngle}</span>
            <p className="text-[11px] text-gray-400">Zero Gravity Back-Slip</p>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
            <span className="text-[10px] text-gray-400 uppercase font-mono block">Battery Run Time</span>
            <span className="font-bold text-teal-400">{ROPEWAY_SPEC.powerSystem.continuousRunTime}</span>
            <p className="text-[11px] text-gray-400">{ROPEWAY_SPEC.powerSystem.maxTravelDistance} per charge</p>
          </div>
        </div>
      </div>

      {/* 4 Formula Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {docs.map((doc, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-white/10 bg-[#111318] p-5 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <h3 className="text-base font-bold text-white">{doc.title}</h3>

              {/* Formula Badge */}
              <div className="bg-black/60 rounded-xl p-3 border border-indigo-500/30 text-center font-mono font-bold text-sm text-indigo-300">
                {doc.equation}
              </div>

              <p className="text-xs text-gray-400 leading-relaxed">{doc.explanation}</p>
            </div>

            {/* Parameters List */}
            <div className="space-y-1.5 pt-2 border-t border-white/5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 font-mono block">
                Derived Parameters
              </span>
              <div className="space-y-1 text-xs">
                {doc.parameters.map((p, i) => (
                  <div key={i} className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">{p.name}</span>
                    <span className="font-mono font-bold text-gray-200">{p.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
