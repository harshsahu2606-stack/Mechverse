"use client";

import {
  Cpu,
  Activity,
  GitCommit,
  Shield,
  Zap,
  ArrowRight,
  Gauge,
  CheckCircle2,
} from "lucide-react";

export default function RoboRumbleHowItWorks() {
  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-8 text-gray-300">
      {/* Title */}
      <div className="space-y-2 border-b border-white/10 pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/20 text-orange-400 font-mono text-[11px] uppercase">
          Combat Robotics Dynamics
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          How Combat Battle Cars Work &amp; Win in the Arena
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
          Combat battle cars are compact, high-torque machines engineered to master Newtonian momentum transfer, normal force manipulation, and tire tractive limits to dominate pushing arenas.
        </p>
      </div>

      {/* 3 Core Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="rounded-2xl border border-white/10 bg-[#111318] p-5 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 font-bold">
            1
          </div>
          <h3 className="text-base font-bold text-white">The Coulomb Traction Limit</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            A motor cannot push harder than the static friction of its tires: <strong>F_push = μ · N</strong>. Winning requires maximizing tire friction (μ ≈ 0.95 with silicone rubber) and concentrating mass directly over the driving axles.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111318] p-5 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 font-bold">
            2
          </div>
          <h3 className="text-base font-bold text-white">The Wedge Leverage Effect</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            A 14° inclined ground wedge transforms an opponent&apos;s forward collision velocity into vertical lift. This lifts their drive wheels off the arena floor, dropping their effective normal force and letting you push them effortlessly out of bounds.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111318] p-5 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-bold">
            3
          </div>
          <h3 className="text-base font-bold text-white">Differential Skid-Steering</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            By spinning left and right wheels at independent speeds (or in opposite directions), battle cars achieve zero-radius pivot turns, letting agile cars like <strong>VIPER</strong> outflank heavy wedges and ram their exposed side panels.
          </p>
        </div>
      </div>

      {/* Combat Strategies Breakdown */}
      <div className="rounded-2xl border border-white/10 bg-[#111318] p-6 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Activity size={18} className="text-orange-400" />
          <span>Vehicle Archetypes &amp; Battle Tactics</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
            <span className="font-bold text-orange-400 uppercase text-[11px] block">
              STRIKER (Wedge Pusher)
            </span>
            <p className="text-gray-300 leading-relaxed">
              Maintains ultra-low ground clearance (&lt; 1.5mm) with a hardened steel front blade. Engages opponents head-on to slip under their bumper, lift their front wheels, and bulldozer them across the warning line.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
            <span className="font-bold text-slate-300 uppercase text-[11px] block">
              TITAN (Heavy Ram Tank)
            </span>
            <p className="text-gray-300 leading-relaxed">
              Maximizes chassis mass (760g) and deep-tread wheel width (30mm). Absorbs high-speed collisions with a dual-tier steel bumper and wins through brute torque and unyielding pushing grip.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
            <span className="font-bold text-sky-400 uppercase text-[11px] block">
              VIPER (Agile Speedster)
            </span>
            <p className="text-gray-300 leading-relaxed">
              Utilizes high-RPM 300 RPM motors and soft foam slicks. Never engages wedges head-on; instead, dances around opponents at 12.4 km/h to strike vulnerable rear axles and push them into the hazard perimeter.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
