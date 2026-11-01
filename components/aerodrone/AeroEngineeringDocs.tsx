"use client";

import React, { useState } from "react";
import { FileText, ShieldCheck, Download, AlertTriangle, CheckSquare, Printer } from "lucide-react";
import { DGCA_INDIA_DRONE_REGULATIONS } from "@/data/aeroDroneData";

export default function AeroEngineeringDocs() {
  const [activeTab, setActiveTab] = useState<"dgca" | "datasheet" | "checklist">("dgca");

  const dgca = DGCA_INDIA_DRONE_REGULATIONS;

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6 text-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <FileText className="text-emerald-400" size={24} />
            <span>DGCA India UAV Regulations & Engineering Documentation</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Compliant with Government of India Drone Rules 2021 & 2023 Amendment.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold transition shrink-0"
        >
          <Printer size={14} className="text-emerald-400" />
          <span>Print / Save PDF</span>
        </button>
      </div>

      {/* Navigation Pills */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("dgca")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === "dgca"
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
              : "bg-white/5 hover:bg-white/10 text-gray-300"
          }`}
        >
          1. DGCA India Drone Rules 2021/2023
        </button>
        <button
          onClick={() => setActiveTab("datasheet")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === "datasheet"
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
              : "bg-white/5 hover:bg-white/10 text-gray-300"
          }`}
        >
          2. AERO-450 Engineering Datasheet
        </button>
        <button
          onClick={() => setActiveTab("checklist")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === "checklist"
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
              : "bg-white/5 hover:bg-white/10 text-gray-300"
          }`}
        >
          3. Pre-Flight Safety Checklist
        </button>
      </div>

      {/* DGCA Indian Regulations View */}
      {activeTab === "dgca" && (
        <div className="bg-[#0e131b] border border-white/10 rounded-2xl p-6 space-y-6">
          <div className="border-b border-white/10 pb-4 space-y-1">
            <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">
              OFFICIAL REGULATORY FRAMEWORK • MINISTRY OF CIVIL AVIATION (MOCA)
            </span>
            <h3 className="text-lg font-bold text-white">
              Classification: {dgca.categoryClassification.weightCategory}
            </h3>
            <p className="text-xs text-gray-400">
              {dgca.categoryClassification.aero450WeightNote}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            {dgca.mandatoryLegalRequirements.map((req, idx) => (
              <div key={idx} className="bg-black/30 p-4 rounded-xl border border-white/5 space-y-1">
                <span className="text-emerald-400 font-bold block uppercase">{req.title}:</span>
                <span className="text-[10px] text-teal-400 font-mono block">Status: {req.requirement}</span>
                <p className="text-gray-300 font-sans leading-relaxed">{req.description}</p>
              </div>
            ))}
          </div>

          {/* Airspace Zones Summary */}
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold text-white uppercase block">
              DigitalSky Airspace Color Zoning System:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-1 text-emerald-200">
                <span className="font-bold font-mono text-emerald-400 block uppercase">Green Zone</span>
                <p className="text-[11px] leading-relaxed">
                  No prior permission required up to 400ft AGL. Simply check DigitalSky airspace map before flight.
                </p>
              </div>

              <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-xl space-y-1 text-amber-200">
                <span className="font-bold font-mono text-amber-400 block uppercase">Yellow Zone</span>
                <p className="text-[11px] leading-relaxed">
                  Controlled airspace (near airports or border belts). Prior ATC and DGCA authorization required.
                </p>
              </div>

              <div className="p-3 bg-rose-950/20 border border-rose-500/30 rounded-xl space-y-1 text-rose-200">
                <span className="font-bold font-mono text-rose-400 block uppercase">Red Zone</span>
                <p className="text-[11px] leading-relaxed">
                  Strict No-Fly Zone (military installations, nuclear plants, central secretariat). Flights strictly prohibited.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Engineering Datasheet */}
      {activeTab === "datasheet" && (
        <div className="bg-[#0e131b] border border-white/10 rounded-2xl p-6 space-y-5 text-xs font-mono">
          <div className="border-b border-white/10 pb-3 flex justify-between items-center">
            <h3 className="text-sm font-bold text-white uppercase">AERO-450 Standard Technical Datasheet</h3>
            <span className="text-emerald-400 font-bold">REV 2.1</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-gray-400 uppercase font-bold block">Airframe & Kinematics:</span>
              <div className="bg-black/30 p-3 rounded-xl border border-white/5 space-y-1 text-gray-300">
                <div>• Configuration: Quadcopter X-4</div>
                <div>• Diagonal Wheelbase: 450 mm (17.7 inches)</div>
                <div>• Arm Material: Ultra-strength PA66 Nylon-Glass composite</div>
                <div>• Frame Mass (Bare): 282 g</div>
                <div>• Ground Clearance: 155 mm (Tall arched landing gear)</div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-gray-400 uppercase font-bold block">Propulsion System:</span>
              <div className="bg-black/30 p-3 rounded-xl border border-white/5 space-y-1 text-gray-300">
                <div>• Motors: 4x 2212 920KV Brushless Outrunner</div>
                <div>• Stator Size: 22mm diameter × 12mm height</div>
                <div>• Propellers: 4x 1045 Nylon (2x CW, 2x CCW)</div>
                <div>• ESC Rating: 30A Continuous / 40A Burst (SimonK)</div>
                <div>• Maximum Peak Thrust: 3,440 g (860g × 4)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pre-Flight Checklist */}
      {activeTab === "checklist" && (
        <div className="bg-[#0e131b] border border-white/10 rounded-2xl p-6 space-y-4 text-xs font-mono">
          <h3 className="text-sm font-bold text-white uppercase border-b border-white/10 pb-3">
            Field Inspection Checklist (Execute Before Every Takeoff)
          </h3>

          <div className="space-y-2.5">
            {[
              "Check DigitalSky app: Confirm flight location is inside a GREEN zone below 400ft AGL.",
              "Inspect all 16 motor and arm screws: Ensure Loctite threadlock holds firm with zero play.",
              "Propeller inspection: Check leading edges for nicks, cracks, or chips. Tighten nylon locknuts.",
              "Battery check: Ensure 3S pack rests between 12.4V and 12.6V with &lt; 0.03V cell delta.",
              "Radio Transmitter: Power ON transmitter first with throttle stick at zero.",
              "GPS Satellite Lock: Wait for Pixhawk flashing GREEN LED indicating 3D fix (≥ 8 satellites).",
              "Takeoff: Step back 5 meters, arm vehicle, and apply smooth throttle to reach 2m hover.",
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-gray-300">
                <CheckSquare size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
