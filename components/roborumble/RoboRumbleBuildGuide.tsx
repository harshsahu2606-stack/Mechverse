"use client";

import { useState } from "react";
import {
  Wrench,
  ShieldAlert,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Layers,
  Zap,
  Cpu,
  Scissors,
} from "lucide-react";
import { ROBO_RUMBLE_BUILD_GUIDE } from "@/data/roboRumbleData";

export default function RoboRumbleBuildGuide() {
  const [expandedStep, setExpandedStep] = useState<number | null>(1);

  const toggleStep = (stepNum: number) => {
    setExpandedStep(expandedStep === stepNum ? null : stepNum);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6 text-gray-300">
      {/* Title */}
      <div className="space-y-1.5 border-b border-white/10 pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/20 text-orange-400 font-mono text-[11px] uppercase">
          <Wrench size={12} />
          <span>Real-Life Engineering Workshop</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          How to Build a Real RC Battle Car
        </h2>
        <p className="text-xs sm:text-sm text-gray-400">
          A 9-stage practical fabrication manual for building an authentic, low-voltage table-top RC battle car using inexpensive or scrap materials.
        </p>
      </div>

      {/* Safety Notice Card */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 flex items-start gap-3">
        <ShieldAlert size={20} className="text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-200/90 leading-relaxed space-y-1">
          <span className="font-bold text-amber-300 uppercase font-mono block">
            Low-Voltage Safety Mandate (DC Only)
          </span>
          <p>
            This battle car project operates strictly on low-voltage DC batteries (6.0V – 7.4V DC). Never connect any wire directly to household AC mains (230V/110V). Use fused power lines and always disconnect batteries before modifying wiring.
          </p>
        </div>
      </div>

      {/* 9-Stage Interactive Accordion */}
      <div className="space-y-3">
        {ROBO_RUMBLE_BUILD_GUIDE.map((stage) => {
          const isExpanded = expandedStep === stage.stepNumber;

          return (
            <div
              key={stage.stepNumber}
              className={`rounded-2xl border transition overflow-hidden ${
                isExpanded
                  ? "border-orange-500/50 bg-[#111318] shadow-xl"
                  : "border-white/10 bg-[#111318]/70 hover:border-white/20"
              }`}
            >
              {/* Accordion Header */}
              <button
                onClick={() => toggleStep(stage.stepNumber)}
                className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left transition"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 transition ${
                      isExpanded
                        ? "bg-orange-500 text-white shadow-md shadow-orange-500/30"
                        : "bg-white/5 border border-white/10 text-gray-400"
                    }`}
                  >
                    {stage.stepNumber}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-gray-500 block">
                      Stage {stage.stepNumber} of 9
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      {stage.title}
                    </h3>
                  </div>
                </div>

                {isExpanded ? (
                  <ChevronDown size={18} className="text-orange-400 shrink-0" />
                ) : (
                  <ChevronRight size={18} className="text-gray-400 shrink-0" />
                )}
              </button>

              {/* Accordion Content */}
              {isExpanded && (
                <div className="px-4 pb-5 sm:px-5 space-y-4 border-t border-white/5 pt-4 text-xs">
                  <p className="text-gray-300 leading-relaxed font-medium">
                    {stage.description}
                  </p>

                  {/* Bullet points */}
                  <div className="space-y-2 bg-black/40 border border-white/5 p-3.5 rounded-xl">
                    <span className="text-[10px] uppercase font-mono text-gray-400 font-bold block mb-1">
                      Key Execution Instructions:
                    </span>
                    {stage.details.map((detail, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-gray-300 leading-relaxed">
                        <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>

                  {/* Stage Safety Warning */}
                  {stage.safetyNote && (
                    <div className="flex items-start gap-2 p-2.5 rounded-lg bg-white/[0.02] border border-white/5 text-[11px] text-gray-400">
                      <span className="font-bold text-orange-400 font-mono uppercase shrink-0">Tip / Safety:</span>
                      <span>{stage.safetyNote}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Part 2: Combat Robotics Bench Testing & Arena Pre-Match Inspection */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
            PART 2: BENCH TESTING & ARENA VERIFICATION
          </span>
        </div>

        <h3 className="text-xl font-bold text-white">
          Combat Robotics Pre-Match Testing Protocols
        </h3>
        <p className="text-xs text-gray-400">
          Conduct these 4 mandatory mechanical and electrical tests before placing the battle car in the combat arena.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl border border-white/10 bg-[#111318] space-y-2">
            <span className="text-xs font-mono font-bold text-orange-400 uppercase block">
              Test 01: Stall Push Force & Tire Traction Test
            </span>
            <p className="text-xs text-gray-300 leading-relaxed">
              Attach a digital luggage scale or spring pull gauge to the rear tow eyelet of the battle car. Place the vehicle on the arena surface and advance to 100% forward throttle against the fixed anchor. Measure the maximum sustained pulling force before the tires break traction:
              • Striker (4WD TT Motors): Target &gt; 12.5 N (1.28 kg-f).
              • Titan (Dual Geared 37D): Target &gt; 22.0 N (2.24 kg-f).
            </p>
            <div className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
              Pass Criteria: Friction coefficient µ ≥ 0.90 with clean silicone rubber tires
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-white/10 bg-[#111318] space-y-2">
            <span className="text-xs font-mono font-bold text-orange-400 uppercase block">
              Test 02: 2.4GHz Loss-of-Signal Failsafe Cutoff
            </span>
            <p className="text-xs text-gray-300 leading-relaxed">
              Prop the robot up on a wooden bench block so all 4 wheels spin freely in the air. Turn on the 2.4GHz radio transmitter and command 50% throttle. With the wheels spinning, physically switch OFF the radio transmitter. The microcontroller's watchdog routine MUST immediately kill all PWM signals to the L298N driver within 200ms.
            </p>
            <div className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
              Mandatory Safety Rule: Zero motor spin with transmitter unpowered
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-white/10 bg-[#111318] space-y-2">
            <span className="text-xs font-mono font-bold text-orange-400 uppercase block">
              Test 03: Front Wedge Incline & Ground Clearance Gauge
            </span>
            <p className="text-xs text-gray-300 leading-relaxed">
              Slide a standard plastic credit card (0.76mm thickness) underneath the leading edge of the front wedge on a flat surface. The wedge blade must scrape smoothly across the floor without snagging on surface joints, yet remain under 1.2mm total clearance so opposing wheels cannot roll over it without getting lifted.
            </p>
            <div className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
              Ground Clearance Spec: 0.8mm – 1.2mm at 14° approach angle
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-white/10 bg-[#111318] space-y-2">
            <span className="text-xs font-mono font-bold text-orange-400 uppercase block">
              Test 04: Master Kill-Switch High-Load Disconnect
            </span>
            <p className="text-xs text-gray-300 leading-relaxed">
              While running all 4 motors at 100% full forward throttle, physically flip the red master SPST disconnect switch mounted on the external top deck. The circuit must completely de-energize instantaneously with zero contact arcing or stuck-welded switch contacts.
            </p>
            <div className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
              Switch Rating: 20A DC heavy-duty rocker or removable link key
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
