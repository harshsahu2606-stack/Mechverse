"use client";

import { SubAssemblyPart } from "@/types/machine";
import { Check, ChevronRight, Layers, Sparkles } from "lucide-react";

interface SubAssemblyPanelProps {
  title: string;
  description: string;
  parts: SubAssemblyPart[];
  selectedPartId: string | null;
  onSelectPart: (partId: string) => void;
}

export default function SubAssemblyPanel({
  title,
  description,
  parts,
  selectedPartId,
  onSelectPart,
}: SubAssemblyPanelProps) {
  const selectedPart = parts.find((p) => p.id === selectedPartId) || parts[0];

  return (
    <aside className="absolute top-20 right-4 z-20 w-80 sm:w-88 max-w-[calc(100vw-2rem)] pointer-events-auto">
      <div className="rounded-2xl border border-white/15 bg-[#111318]/95 backdrop-blur-xl p-5 shadow-2xl space-y-4 max-h-[82vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div>
          <span className="text-[10px] font-mono tracking-widest text-red-400 uppercase bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
            INTERNAL TEARDOWN
          </span>
          <h3 className="text-xl font-bold text-white mt-1.5">{title}</h3>
          <p className="text-xs text-gray-400 mt-1">{description}</p>
        </div>

        {/* Parts List matching Screenshot 5 */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider">
            Select Part to Inspect
          </span>
          <div className="space-y-1">
            {parts.map((part) => {
              const isSelected = selectedPartId === part.id;
              return (
                <button
                  key={part.id}
                  onClick={() => onSelectPart(part.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition text-left ${
                    isSelected
                      ? "bg-white text-black font-semibold shadow-md shadow-white/20"
                      : "bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white"
                  }`}
                >
                  <span>{part.name}</span>
                  {isSelected ? (
                    <Check size={14} className="text-black font-bold" />
                  ) : (
                    <ChevronRight size={14} className="text-gray-500" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Part Detail Card */}
        {selectedPart && (
          <div className="rounded-xl bg-black/40 border border-white/10 p-3.5 space-y-2.5 pt-3">
            <div>
              <span className="text-[10px] uppercase font-mono text-red-400">
                ACTIVE PART
              </span>
              <h4 className="text-sm font-bold text-white mt-0.5">
                {selectedPart.name}
              </h4>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              {selectedPart.description}
            </p>

            {selectedPart.specs && (
              <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-white/5">
                {selectedPart.specs.map((spec, i) => (
                  <div key={i} className="text-[10px]">
                    <span className="text-gray-400 block">{spec.label}</span>
                    <span className="text-gray-200 font-semibold">{spec.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
