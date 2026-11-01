"use client";

import { ArrowRight, Box, Check, Eye, EyeOff, Layers, Sparkles, X, Focus, Wrench, Shield, Compass } from "lucide-react";
import { MachineComponentInfo } from "@/types/machine";

interface ComponentDetailsModalProps {
  component: MachineComponentInfo | null;
  onClose: () => void;
  onEnterSubAssembly?: (subAssemblyId: string) => void;
  onToggleVisibility: (componentId: string) => void;
  onToggleIsolate: (componentId: string) => void;
  isHidden: boolean;
  isIsolated: boolean;
}

export default function ComponentDetailsModal({
  component,
  onClose,
  onEnterSubAssembly,
  onToggleVisibility,
  onToggleIsolate,
  isHidden,
  isIsolated,
}: ComponentDetailsModalProps) {
  if (!component) return null;

  return (
    <div className="absolute top-16 right-4 z-20 w-80 sm:w-96 max-w-[calc(100vw-2rem)] pointer-events-auto">
      <div className="rounded-2xl border border-white/15 bg-[#111318]/95 backdrop-blur-xl p-4 sm:p-5 shadow-2xl space-y-3.5 max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar">
        {/* Header with Title & Close button */}
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-sky-400 uppercase bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
              {component.category || "COMPONENT SPEC"}
            </span>
            <h3 className="text-lg font-bold text-white mt-1 leading-snug">
              {component.name}
            </h3>
            {component.priceINR !== undefined && (
              <span className="text-[11px] font-mono text-emerald-400 font-semibold block mt-0.5">
                Approx ₹{component.priceINR} INR (Scrap-Sourced / Hardware)
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-300 leading-relaxed">
          {component.description}
        </p>

        {/* Engineering Purpose */}
        {component.purpose && (
          <div className="rounded-xl bg-black/40 border border-white/5 p-2.5 space-y-1">
            <span className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider flex items-center gap-1.5">
              <Shield size={11} className="text-orange-400" />
              <span>Functional Purpose</span>
            </span>
            <p className="text-xs text-gray-400 leading-relaxed">
              {component.purpose}
            </p>
          </div>
        )}

        {/* Working Principle */}
        {component.workingPrinciple && (
          <div className="rounded-xl bg-black/40 border border-white/5 p-2.5 space-y-1">
            <span className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider flex items-center gap-1.5">
              <Compass size={11} className="text-sky-400" />
              <span>Working Principle &amp; Kinematics</span>
            </span>
            <p className="text-xs text-gray-300 leading-relaxed">
              {component.workingPrinciple}
            </p>
          </div>
        )}

        {/* Interconnections & Dimensions */}
        {(component.dimensions || component.interconnections) && (
          <div className="rounded-xl bg-white/[0.02] border border-white/5 p-2.5 space-y-1 text-xs">
            {component.dimensions && (
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] text-gray-400 font-mono uppercase">Dimensions:</span>
                <span className="text-white text-right font-medium">{component.dimensions}</span>
              </div>
            )}
            {component.interconnections && (
              <div className="pt-1 border-t border-white/5">
                <span className="text-[10px] text-gray-400 font-mono uppercase block">Interconnections:</span>
                <span className="text-gray-300 text-[11px] leading-tight block mt-0.5">{component.interconnections}</span>
              </div>
            )}
          </div>
        )}

        {/* Technical Specs Grid */}
        {component.specs && component.specs.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider">
              Technical Specifications
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {component.specs.map((spec, idx) => (
                <div
                  key={idx}
                  className="rounded-lg bg-white/[0.03] border border-white/5 p-2 space-y-0.5"
                >
                  <span className="text-[10px] text-gray-400 block font-mono">
                    {spec.label}
                  </span>
                  <span className="text-xs font-semibold text-white truncate block">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DIY & Scrap Sourcing Tip */}
        {(component.alternatives || component.sourcingTip) && (
          <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-2.5 space-y-1 text-xs">
            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1">
              <Wrench size={11} />
              <span>DIY / Scrap Alternative</span>
            </span>
            {component.alternatives && (
              <p className="text-[11px] text-amber-200 leading-snug">
                <strong>Subs:</strong> {component.alternatives}
              </p>
            )}
            {component.sourcingTip && (
              <p className="text-[11px] text-gray-400 leading-snug">
                <strong>Tip:</strong> {component.sourcingTip}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons: View Inside & Isolate/Hide */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          {component.hasSubAssembly && component.subAssemblyId && onEnterSubAssembly && (
            <button
              onClick={() => onEnterSubAssembly(component.subAssemblyId!)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-semibold text-xs shadow-lg shadow-red-600/30 transition hover:scale-[1.01]"
            >
              <span>View Inside Gearbox</span>
              <ArrowRight size={14} />
            </button>
          )}

          <div className="grid grid-cols-2 gap-2">
            {/* Hide Others / Isolate button */}
            <button
              onClick={() => onToggleIsolate(component.id)}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-medium transition ${
                isIsolated
                  ? "bg-sky-500/20 border-sky-500/40 text-sky-300"
                  : "bg-white/5 hover:bg-white/10 border-white/10 text-gray-300 hover:text-white"
              }`}
            >
              <Focus size={14} />
              <span>{isIsolated ? "Show All" : "Hide Others"}</span>
            </button>

            {/* Toggle Visibility */}
            <button
              onClick={() => onToggleVisibility(component.id)}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-300 hover:text-white transition"
            >
              {isHidden ? <Eye size={14} /> : <EyeOff size={14} />}
              <span>{isHidden ? "Show" : "Hide Part"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
