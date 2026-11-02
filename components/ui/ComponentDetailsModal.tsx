"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  Box,
  Eye,
  EyeOff,
  X,
  Focus,
  Wrench,
  Shield,
  Compass,
  BookOpen,
  Minimize2,
  ChevronRight,
  ChevronLeft,
  Tag,
  Cpu,
  Layers,
} from "lucide-react";
import { AppTheme, MachineComponentInfo } from "@/types/machine";

interface ComponentDetailsModalProps {
  component: MachineComponentInfo | null;
  onClose: () => void;
  onEnterSubAssembly?: (subAssemblyId: string) => void;
  onToggleVisibility: (componentId: string) => void;
  onToggleIsolate: (componentId: string) => void;
  isHidden: boolean;
  isIsolated: boolean;
  theme?: AppTheme;
}

export default function ComponentDetailsModal({
  component,
  onClose,
  onEnterSubAssembly,
  onToggleVisibility,
  onToggleIsolate,
  isHidden,
  isIsolated,
  theme = "dark",
}: ComponentDetailsModalProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const isLight = theme === "light";

  // When a different component is selected in 3D, always reset to the compact quick-peek card
  useEffect(() => {
    setIsExpanded(false);
  }, [component?.id]);

  if (!component) return null;

  // ================= 1. COMPACT QUICK PREVIEW CARD (Initial Touch) =================
  if (!isExpanded) {
    return (
      <div className="absolute top-16 right-4 sm:right-6 z-30 w-80 sm:w-88 max-w-[calc(100vw-2rem)] pointer-events-auto animate-in fade-in slide-in-from-right-3 duration-200">
        <div
          className={`rounded-2xl border backdrop-blur-xl shadow-2xl p-4 space-y-3 transition-all ${
            isLight
              ? "bg-white/95 border-gray-200 text-gray-900 shadow-gray-400/25"
              : "bg-[#0d1017]/95 border-white/15 text-white shadow-black/80"
          }`}
        >
          {/* Header: Category Badge + Title + Close Button */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[9px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-sky-500/15 text-sky-400 border border-sky-500/25">
                  {component.category || "COMPONENT"}
                </span>
                {component.priceINR !== undefined && (
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                    ₹{component.priceINR}
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-white mt-1 leading-snug line-clamp-2">
                {component.name}
              </h3>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition shrink-0 cursor-pointer"
              title="Close Preview (Deselect Component)"
            >
              <X size={15} />
            </button>
          </div>

          {/* Short 2-3 Line Definition / Summary */}
          <p className="text-xs text-gray-300 leading-relaxed line-clamp-3">
            {component.description}
          </p>

          {/* Quick Key Specs Pills (if available) */}
          {(component.material || component.dimensions) && (
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              {component.material && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-300">
                  {component.material}
                </span>
              )}
              {component.dimensions && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-400">
                  {component.dimensions}
                </span>
              )}
            </div>
          )}

          {/* Primary Action: Read More (Opens Full Non-Cutoff Details) */}
          <button
            onClick={() => setIsExpanded(true)}
            className="w-full flex items-center justify-between py-2 px-3.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-sky-600/30 transition-all hover:scale-[1.01] cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <BookOpen size={13} />
              <span>Read More &amp; Full Specs</span>
            </span>
            <ChevronRight size={14} />
          </button>

          {/* Quick Action Buttons (Isolate / Hide) */}
          <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-white/10 text-[11px]">
            <button
              onClick={() => onToggleIsolate(component.id)}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg border font-medium transition cursor-pointer ${
                isIsolated
                  ? "bg-sky-500/20 border-sky-500/40 text-sky-300"
                  : "bg-white/5 hover:bg-white/10 border-white/10 text-gray-300 hover:text-white"
              }`}
            >
              <Focus size={13} />
              <span>{isIsolated ? "Show All" : "Isolate"}</span>
            </button>

            <button
              onClick={() => onToggleVisibility(component.id)}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 font-medium text-gray-300 hover:text-white transition cursor-pointer"
            >
              {isHidden ? <Eye size={13} /> : <EyeOff size={13} />}
              <span>{isHidden ? "Unhide" : "Hide"}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ================= 2. EXPANDED FULL DETAILS MODAL (Zero Cut-Off Guaranteed) =================
  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsExpanded(false);
      }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 pointer-events-auto animate-in fade-in duration-200"
    >
      <div
        className={`w-full max-w-xl max-h-[88vh] rounded-2xl border flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 ${
          isLight
            ? "bg-white border-gray-200 text-gray-900 shadow-gray-400/30"
            : "bg-[#0e121a] border-white/15 text-white shadow-black/90"
        }`}
      >
        {/* ================= FIXED STICKY MODAL HEADER ================= */}
        <div className="px-5 py-4 border-b border-white/10 bg-black/20 flex items-start justify-between gap-3 shrink-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase bg-sky-500/15 text-sky-400 px-2.5 py-0.5 rounded border border-sky-500/30">
                {component.category || "COMPONENT SPEC"}
              </span>
              {component.priceINR !== undefined && (
                <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Approx ₹{component.priceINR} INR (Hardware / BOM)
                </span>
              )}
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mt-1.5 leading-snug">
              {component.name}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Collapse to Preview Button */}
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              title="Minimize to Quick Peek"
            >
              <Minimize2 size={16} />
            </button>

            {/* Close Entirely Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              title="Close (Deselect Component)"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ================= SCROLLABLE MODAL BODY (Never gets cut off) ================= */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4">
          {/* Full Engineering Description */}
          <div>
            <h4 className="text-[11px] uppercase font-bold text-gray-400 tracking-wider font-mono mb-1">
              Component Overview
            </h4>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-sans">
              {component.description}
            </p>
          </div>

          {/* Functional Purpose Box */}
          {component.purpose && (
            <div className="rounded-xl bg-orange-500/5 border border-orange-500/20 p-3.5 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-orange-400 tracking-wider flex items-center gap-1.5 font-mono">
                <Shield size={13} className="text-orange-400" />
                <span>Functional Purpose &amp; Load Distribution</span>
              </span>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                {component.purpose}
              </p>
            </div>
          )}

          {/* Working Principle & Kinematics */}
          {component.workingPrinciple && (
            <div className="rounded-xl bg-sky-500/5 border border-sky-500/20 p-3.5 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider flex items-center gap-1.5 font-mono">
                <Compass size={13} className="text-sky-400" />
                <span>Working Principle &amp; Kinematics</span>
              </span>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                {component.workingPrinciple}
              </p>
            </div>
          )}

          {/* Physical Dimensions & Interconnections */}
          {(component.dimensions || component.interconnections || component.material) && (
            <div className="rounded-xl bg-white/[0.02] border border-white/5 p-3.5 space-y-2 text-xs">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider font-mono block">
                Physical Specifications &amp; Interfaces
              </span>

              {component.material && (
                <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-1.5">
                  <span className="text-[11px] text-gray-400 font-mono">Material:</span>
                  <span className="text-white font-semibold">{component.material}</span>
                </div>
              )}

              {component.dimensions && (
                <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-1.5">
                  <span className="text-[11px] text-gray-400 font-mono">Dimensions:</span>
                  <span className="text-white font-semibold font-mono">{component.dimensions}</span>
                </div>
              )}

              {component.interconnections && (
                <div className="pt-0.5">
                  <span className="text-[11px] text-gray-400 font-mono block mb-0.5">
                    Mounting &amp; Interconnections:
                  </span>
                  <span className="text-gray-300 text-xs leading-relaxed block">
                    {component.interconnections}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Technical Specifications Grid */}
          {component.specs && component.specs.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider font-mono block">
                Technical Specifications
              </span>
              <div className="grid grid-cols-2 gap-2">
                {component.specs.map((spec, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl bg-white/[0.03] border border-white/5 p-2.5 space-y-0.5"
                  >
                    <span className="text-[10px] text-gray-400 block font-mono">
                      {spec.label}
                    </span>
                    <span className="text-xs font-bold text-white truncate block">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DIY / Scrap Sourcing Tip */}
          {(component.alternatives || component.sourcingTip) && (
            <div className="rounded-xl bg-amber-500/10 border border-amber-500/25 p-3.5 space-y-1.5 text-xs">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1.5 font-mono">
                <Wrench size={13} />
                <span>Indian DIY &amp; Scrap Sourcing Alternatives</span>
              </span>
              {component.alternatives && (
                <p className="text-xs text-amber-200 leading-snug">
                  <strong>Substitute:</strong> {component.alternatives}
                </p>
              )}
              {component.sourcingTip && (
                <p className="text-xs text-gray-300 leading-snug">
                  <strong>Pro Tip:</strong> {component.sourcingTip}
                </p>
              )}
            </div>
          )}
        </div>

        {/* ================= FIXED STICKY MODAL FOOTER ================= */}
        <div className="p-4 border-t border-white/10 bg-black/40 flex flex-wrap items-center justify-between gap-2 shrink-0">
          {component.hasSubAssembly && component.subAssemblyId && onEnterSubAssembly ? (
            <button
              onClick={() => {
                setIsExpanded(false);
                onEnterSubAssembly(component.subAssemblyId!);
              }}
              className="flex items-center gap-2 py-2 px-4 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition hover:scale-[1.01] cursor-pointer"
            >
              <span>View Inside Gearbox</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleIsolate(component.id)}
                className={`flex items-center gap-1.5 py-2 px-3.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                  isIsolated
                    ? "bg-sky-500/20 border-sky-500/40 text-sky-300"
                    : "bg-white/5 hover:bg-white/10 border-white/10 text-gray-300 hover:text-white"
                }`}
              >
                <Focus size={14} />
                <span>{isIsolated ? "Show All Parts" : "Hide Others (Isolate)"}</span>
              </button>

              <button
                onClick={() => onToggleVisibility(component.id)}
                className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white transition cursor-pointer"
              >
                {isHidden ? <Eye size={14} /> : <EyeOff size={14} />}
                <span>{isHidden ? "Show Part" : "Hide Part"}</span>
              </button>
            </div>
          )}

          <button
            onClick={() => setIsExpanded(false)}
            className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white transition cursor-pointer ml-auto"
          >
            <ChevronLeft size={14} />
            <span>Minimize to Preview</span>
          </button>
        </div>
      </div>
    </div>
  );
}
