"use client";

import React, { useState } from "react";
import { Cpu, Cable, ArrowRight, ShieldCheck, Zap, Activity, ShieldAlert, CheckCircle2, RotateCw } from "lucide-react";

export default function RopewayHowItWorks() {
  const [clampForceN, setClampForceN] = useState<number>(35);
  const [inclineDeg, setInclineDeg] = useState<number>(30);

  // Wedge friction calculation: F_traction = 2 * mu * F_clamp / sin(30deg)
  const mu = 0.65;
  const normalFactor = 1 / Math.sin((30 * Math.PI) / 180); // 2.0
  const totalTractionN = (2 * mu * clampForceN * normalFactor * 0.5).toFixed(1);
  const robotMassKg = 0.385;
  const gravityN = robotMassKg * 9.81;
  const downhillGravityForceN = (gravityN * Math.sin((inclineDeg * Math.PI) / 180)).toFixed(2);
  const safetyFactor = (Number(totalTractionN) / Math.max(0.01, Number(downhillGravityForceN))).toFixed(1);

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-8 text-gray-300">
      {/* Title */}
      <div className="space-y-2 border-b border-white/10 pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-sky-500/10 border border-sky-500/20 text-sky-400 font-mono text-[11px] uppercase">
          Cableways & Traction Mechanics
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          How the Rope Climbing Robot Ascends Steep Cables
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
          The AeroClimb RC-1 employs a dual-sheave wedge friction drive combined with an irreversible worm gear transmission and an underslung pendulum center of gravity to scale suspended cables up to 45° inclines with zero slip.
        </p>
      </div>

      {/* 4 Mechanical Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-white/10 bg-[#111318] p-5 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 font-bold text-sm">
            1
          </div>
          <h3 className="text-sm font-bold text-white">Wedge-Groove Friction Drive</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            The cable sits inside a 60° V-grooved sheave lined with high-friction nitrile rubber. Wedging between the angled walls multiplies effective normal force by <strong>2.0x</strong>, generating massive linear traction.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111318] p-5 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-sm">
            2
          </div>
          <h3 className="text-sm font-bold text-white">Self-Locking Worm Gearing</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            The gearbox uses an all-metal brass worm with lead angle <em>γ = 4.2°</em>. Because this is less than the friction angle, external gravity loads cannot back-drive the motor. The robot freezes in place if power cuts out.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111318] p-5 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">
            3
          </div>
          <h3 className="text-sm font-bold text-white">Pendulum Self-Righting</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            The battery and motor are hung 65mm below the cable line. Gravitational restoring torque acts like a keel on a sailboat, automatically righting the robot against crosswinds and cable vibrations.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111318] p-5 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-sm">
            4
          </div>
          <h3 className="text-sm font-bold text-white">Anti-Derailment Arms</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Vertical suspension arms rise 162 mm with deep captive throats. Even during rapid braking, cable resonance, or anchor bumper impacts, the rope cannot pop free of the drive groove.
          </p>
        </div>
      </div>

      {/* Interactive Clamping Force vs Incline Calculator */}
      <div className="rounded-2xl border border-sky-500/25 bg-gradient-to-br from-[#0c1424] to-[#0a0d14] p-5 sm:p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap size={18} className="text-sky-400" />
              <span>Interactive Cable Traction & Slip Calculator</span>
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Adjust spring preload force and cable incline angle to see the friction safety margin in real-time.
            </p>
          </div>
          <div className="px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 font-mono text-xs font-bold">
            µ = 0.65 Nitrile
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-gray-300">Pinch Roller Clamping Force (F_clamp)</span>
                <span className="text-sky-400 font-mono font-bold">{clampForceN} N</span>
              </div>
              <input
                type="range"
                min={15}
                max={60}
                step={5}
                value={clampForceN}
                onChange={(e) => setClampForceN(Number(e.target.value))}
                className="w-full accent-sky-500 h-1.5 bg-gray-700 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                <span>15 N (Loose)</span>
                <span>35 N (Recommended)</span>
                <span>60 N (Heavy Duty)</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-gray-300">Cable Incline Angle (θ)</span>
                <span className="text-amber-400 font-mono font-bold">{inclineDeg}°</span>
              </div>
              <input
                type="range"
                min={0}
                max={45}
                step={5}
                value={inclineDeg}
                onChange={(e) => setInclineDeg(Number(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-gray-700 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                <span>0° Horizontal</span>
                <span>20° Zipline</span>
                <span>45° Mountain Ascent</span>
              </div>
            </div>
          </div>

          {/* Results Card */}
          <div className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-3 flex flex-col justify-between">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                <span className="text-[9px] text-gray-400 uppercase font-mono block">Available Grip</span>
                <span className="text-sm font-bold text-sky-400 font-mono">{totalTractionN} N</span>
              </div>
              <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                <span className="text-[9px] text-gray-400 uppercase font-mono block">Downhill Drag</span>
                <span className="text-sm font-bold text-amber-300 font-mono">{downhillGravityForceN} N</span>
              </div>
              <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                <span className="text-[9px] text-gray-400 uppercase font-mono block">Safety Margin</span>
                <span className="text-sm font-bold text-emerald-400 font-mono">{safetyFactor}x</span>
              </div>
            </div>

            <div className="text-xs text-gray-300 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
                <CheckCircle2 size={14} />
                <span>Zero-Slippage Guaranteed</span>
              </div>
              <span>
                With <strong>{clampForceN} N</strong> spring clamping on a 60° V-groove, the robot achieves <strong>{totalTractionN} N</strong> friction force — over <strong>{safetyFactor} times</strong> the gravitational pullback at <strong>{inclineDeg}°</strong> slope.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Autonomous Shuttle Reversing Logic */}
      <div className="rounded-2xl border border-white/10 bg-[#111318] p-5 sm:p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <RotateCw size={18} className="text-purple-400" />
          <span>Autonomous Cable Shuttle: Automatic Polarity Reversal</span>
        </h3>
        <p className="text-xs text-gray-400 leading-relaxed">
          The robot runs continuously between two anchor posts without requiring microcontrollers or programming. Dual roller limit switches at the front and rear bumpers are wired in a cross-coupled DPDT circuit.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 space-y-1">
            <span className="text-xs font-bold text-sky-400 block font-mono">1. Forward Climb</span>
            <p className="text-[11px] text-gray-400">
              DC current flows + to - into motor terminals. Pulleys rotate clockwise; robot climbs up the ropeway.
            </p>
          </div>
          <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 space-y-1">
            <span className="text-xs font-bold text-rose-400 block font-mono">2. Bumper Impact</span>
            <p className="text-[11px] text-gray-400">
              Front roller switch strikes the anchor bumper stop, mechanically toggling the latching polarity relay.
            </p>
          </div>
          <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 space-y-1">
            <span className="text-xs font-bold text-amber-400 block font-mono">3. Reverse Descent</span>
            <p className="text-[11px] text-gray-400">
              Motor polarity flips instantly (- to +). Pulleys reverse rotation and robot traverses back to origin!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
