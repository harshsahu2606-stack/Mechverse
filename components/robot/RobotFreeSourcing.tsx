"use client";

import { useState, useEffect } from "react";
import { Recycle, AlertTriangle, CheckCircle2, ShieldAlert, Sparkles, Check, HelpCircle } from "lucide-react";
import { SCRAP_SOURCES_CATALOG } from "@/data/walkingRobotData";

interface SourcingChecklistRow {
  id: string;
  name: string;
  qty: string;
  status: "not_found" | "found" | "tested" | "ready";
  sourcedFrom: string;
}

const DEFAULT_SOURCING_CHECKLIST: SourcingChecklistRow[] = [
  { id: "s-motor", name: "Geared DC Motor with Dual Shafts", qty: "1 pc", status: "not_found", sourcedFrom: "Old RC Car" },
  { id: "s-batt", name: "2x AA Battery Holder & Springs", qty: "1 pc", status: "not_found", sourcedFrom: "Broken Toy Remote" },
  { id: "s-switch", name: "Mini Toggle / Slide Switch", qty: "1 pc", status: "not_found", sourcedFrom: "Old Desk Lamp" },
  { id: "s-chassis", name: "3mm Rigid Plastic / Acrylic / Plywood", qty: "1 sheet (110x60mm)", status: "not_found", sourcedFrom: "Ice Cream Box Lid" },
  { id: "s-sticks", name: "Hardwood Popsicle Sticks / Links", qty: "8-12 pcs", status: "not_found", sourcedFrom: "Kitchen / Craft" },
  { id: "s-fasteners", name: "M3 Screws, Bolts & Washers", qty: "8-10 pcs", status: "not_found", sourcedFrom: "Old PC Cabinet / Hardware" },
  { id: "s-rubber", name: "Traction Rubber Pads / Eraser Slices", qty: "4 pcs", status: "not_found", sourcedFrom: "Old Pencil Eraser" },
];

export default function RobotFreeSourcing() {
  const [checklist, setChecklist] = useState<SourcingChecklistRow[]>(DEFAULT_SOURCING_CHECKLIST);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("walking_robot_free_sourcing");
      if (saved) setChecklist(JSON.parse(saved));
    } catch (e) {
      console.warn("Could not load sourcing checklist", e);
    }
  }, []);

  const updateStatus = (id: string, status: SourcingChecklistRow["status"]) => {
    const updated = checklist.map((item) => (item.id === id ? { ...item, status } : item));
    setChecklist(updated);
    try {
      localStorage.setItem("walking_robot_free_sourcing", JSON.stringify(updated));
    } catch (e) {
      console.warn("Could not save sourcing checklist", e);
    }
  };

  const updateSource = (id: string, sourcedFrom: string) => {
    const updated = checklist.map((item) => (item.id === id ? { ...item, sourcedFrom } : item));
    setChecklist(updated);
    try {
      localStorage.setItem("walking_robot_free_sourcing", JSON.stringify(updated));
    } catch (e) {
      console.warn("Could not save sourcing checklist", e);
    }
  };

  const readyCount = checklist.filter((i) => i.status === "ready" || i.status === "tested").length;
  const progressPercent = Math.round((readyCount / checklist.length) * 100);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 space-y-8 text-gray-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-green-500/10 border border-green-500/20 text-green-400 font-mono text-[11px] uppercase">
            Zero-Waste & DIY Engineering
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Find Components for Free: Reuse & E-Waste Guide
          </h2>
          <p className="text-xs text-gray-400">
            Build this robot with near ₹0 expense by reclaiming parts from broken appliances, discarded toys, and recyclables.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-[#111318] border border-white/10 rounded-2xl p-3 min-w-[220px] space-y-1.5 self-start sm:self-auto">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-white">Parts Collected &amp; Verified</span>
            <span className="font-mono text-green-400 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-[10px] text-gray-400 block text-right">
            {readyCount} of {checklist.length} Essential Items Ready
          </span>
        </div>
      </div>

      {/* Interactive Sourcing Checklist */}
      <div className="rounded-2xl border border-white/10 bg-[#111318] p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 size={18} className="text-green-400" />
            <span>Reclaimed Component Tracker</span>
          </h3>
          <span className="text-[11px] text-gray-400">Updates saved to browser</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 uppercase text-[10px] tracking-wider font-mono">
                <th className="py-2.5 px-3">Component Required</th>
                <th className="py-2.5 px-3">Qty</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Sourced From / Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {checklist.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02]">
                  <td className="py-3 px-3 font-semibold text-white">{item.name}</td>
                  <td className="py-3 px-3 font-mono text-gray-400">{item.qty}</td>
                  <td className="py-3 px-3">
                    <select
                      value={item.status}
                      onChange={(e) => updateStatus(item.id, e.target.value as any)}
                      className={`text-xs rounded-lg px-2 py-1 font-semibold border focus:outline-none transition ${
                        item.status === "ready"
                          ? "bg-green-600/20 border-green-500/40 text-green-300"
                          : item.status === "tested"
                          ? "bg-sky-600/20 border-sky-500/40 text-sky-300"
                          : item.status === "found"
                          ? "bg-amber-600/20 border-amber-500/40 text-amber-300"
                          : "bg-gray-800 border-gray-700 text-gray-400"
                      }`}
                    >
                      <option value="not_found">Not Found</option>
                      <option value="found">Found</option>
                      <option value="tested">Tested</option>
                      <option value="ready">Ready to Use</option>
                    </select>
                  </td>
                  <td className="py-3 px-3">
                    <input
                      type="text"
                      value={item.sourcedFrom}
                      onChange={(e) => updateSource(item.id, e.target.value)}
                      placeholder="e.g. Broken toy car, kitchen drawer..."
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-green-500/50"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Free Scrap Sources Guide Cards */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Recycle size={18} className="text-green-400" />
          <span>Where to Find Parts: The Scrap Directory</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {SCRAP_SOURCES_CATALOG.map((src) => (
            <div
              key={src.id}
              className="rounded-2xl border border-white/10 bg-[#111318] p-5 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 font-bold">
                    <Recycle size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{src.title}</h4>
                    <p className="text-[11px] text-gray-400">{src.collectionTips}</p>
                  </div>
                </div>

                {/* Usable Parts List */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-gray-400">
                    Valuable Parts Inside:
                  </span>
                  <ul className="text-xs space-y-0.5 text-gray-300">
                    {src.usableParts.map((p, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-green-400">✔</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Safety & What NOT to Reuse */}
              <div className="pt-2 border-t border-white/5 space-y-2 text-[11px]">
                <div className="flex items-start gap-1.5 text-amber-300/90">
                  <ShieldAlert size={14} className="shrink-0 mt-0.5 text-amber-400" />
                  <span>{src.safetyWarnings[0]}</span>
                </div>
                <div className="flex items-start gap-1.5 text-red-300/80">
                  <AlertTriangle size={14} className="shrink-0 mt-0.5 text-red-400" />
                  <span>Do not use: {src.incompatibleParts[0]}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
