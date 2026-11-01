"use client";

import { Cpu, ArrowRight, CheckCircle2, RotateCw, Activity, Compass, ShieldAlert, Sparkles } from "lucide-react";

export default function RobotHowItWorks() {
  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-8 text-gray-300">
      {/* Title */}
      <div className="space-y-2 border-b border-white/10 pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/20 text-orange-400 font-mono text-[11px] uppercase">
          Kinematics & Bionics
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          How the Walking Robot Moves Without Wheels
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
          The Strider-X1 uses a synchronized four-bar crank-rocker mechanism on each side to convert the continuous 360° circular rotation of a single DC motor into an alternating, ground-clearing mechanical walking stride.
        </p>
      </div>

      {/* 3 Core Mechanical Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="rounded-2xl border border-white/10 bg-[#111318] p-5 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 font-bold">
            1
          </div>
          <h3 className="text-base font-bold text-white">Rotary to Rocking Motion</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            The DC motor continuously spins its output shaft. Attached to each shaft is a <strong>crank arm</strong>. An offset pin placed at radius <em>R = 15mm</em> orbits in a circle, pushing and pulling the <strong>connecting rod</strong> back and forth in planar reciprocating motion.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111318] p-5 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 font-bold">
            2
          </div>
          <h3 className="text-base font-bold text-white">The Inverted 4-Bar Linkage</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            The leg strut is pivoted at the top hip crossbar. As the connecting rod pulls and pushes the leg body, the bottom foot traces an asymmetrical, closed <strong>D-shaped trajectory</strong>: flat along the floor during backward thrust, and bowed upward during forward return.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111318] p-5 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 font-bold">
            3
          </div>
          <h3 className="text-base font-bold text-white">180° Anti-Phase Balance</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            The left crank and right crank are pinned at <strong>exactly 180 degrees apart</strong>. When the left leg is planted on the floor supporting the robot&apos;s weight, the right leg is elevated in the air swinging forward. They swap roles smoothly, creating non-stop forward locomotion.
          </p>
        </div>
      </div>

      {/* Gait Cycle Breakdown */}
      <div className="rounded-2xl border border-white/10 bg-[#111318] p-6 space-y-5">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Activity size={18} className="text-orange-400" />
          <span>The Two Halves of Every Walking Step</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white uppercase text-[11px] text-green-400">
                1. Stance (Support) Phase — 54% of Cycle
              </span>
              <span className="font-mono text-gray-500">Angle: 0° → 190°</span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              The foot is pressed firmly against the ground. As the crank sweeps downward and rearward, the leg pushes the chassis forward. High static friction between the rubber footpad and floor is critical here so the foot grips rather than slips.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white uppercase text-[11px] text-sky-400">
                2. Swing (Recovery) Phase — 46% of Cycle
              </span>
              <span className="font-mono text-gray-500">Angle: 190° → 360°</span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              The crank sweeps upward through top-dead-center, lifting the leg 12mm off the ground and swinging it forward to prepare for the next step. The opposite leg is now in the stance phase supporting 100% of the robot&apos;s mass.
            </p>
          </div>
        </div>
      </div>

      {/* Engineering Physics Notes */}
      <div className="rounded-2xl border border-white/10 bg-[#111318] p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Compass size={18} className="text-sky-400" />
          <span>Center of Gravity (CoG) & Dynamic Stability</span>
        </h3>
        <p className="text-xs text-gray-300 leading-relaxed">
          Because this robot has dual legs on each flank (fore and rear), each side acts like a ski or dual-contact pod. This expands the ground contact baseline to 65mm along the length of the robot, preventing it from pitching forward onto its nose or backward onto its tail during stride transitions.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-[11px]">
          <div className="p-3 rounded-lg bg-black/40 border border-white/5">
            <span className="text-gray-400 block">Total Mass (approx)</span>
            <span className="text-white font-bold text-xs">165 grams</span>
          </div>
          <div className="p-3 rounded-lg bg-black/40 border border-white/5">
            <span className="text-gray-400 block">Average Walking Speed</span>
            <span className="text-white font-bold text-xs">3.8 cm / second (~60 RPM)</span>
          </div>
          <div className="p-3 rounded-lg bg-black/40 border border-white/5">
            <span className="text-gray-400 block">Mechanical Efficiency</span>
            <span className="text-white font-bold text-xs">&gt; 65% with nylon washers</span>
          </div>
        </div>
      </div>
    </div>
  );
}
