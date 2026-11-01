"use client";

import { FileText, Compass, Zap, GitCommit, ShieldAlert, Activity } from "lucide-react";

export default function RoboRumblePhysicsDocs() {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6 text-gray-300">
      {/* Title */}
      <div className="space-y-1.5 border-b border-white/10 pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/20 text-orange-400 font-mono text-[11px] uppercase">
          <Compass size={12} />
          <span>Vehicle Dynamics &amp; Kinematics</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Robo Rumble Engineering &amp; Physics Documentation
        </h2>
        <p className="text-xs sm:text-sm text-gray-400">
          Mathematical models of combat vehicle dynamics, wheel traction limits, wedge lifting mechanics, and low-voltage electrical schematics.
        </p>
      </div>

      {/* 1. Wheel Traction & Pushing Limit Equation */}
      <div className="rounded-2xl border border-white/10 bg-[#111318] p-5 space-y-3">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Activity size={16} className="text-orange-400" />
          <span>1. Tractive Pushing Limit (Coulomb Friction Model)</span>
        </h3>

        <p className="text-xs text-gray-300 leading-relaxed">
          Regardless of how powerful a motor is, a battle car cannot exert more pushing force against an opponent than its maximum tire tractive limit:
        </p>

        <div className="p-4 rounded-xl bg-black/60 border border-white/10 text-center font-mono text-base font-bold text-orange-400">
          F_push(max) = μ · N = μ · m · g
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
            <span className="font-bold text-white block">Friction Coeff (μ)</span>
            <p className="text-gray-400">
              Silicone spike: μ ≈ 0.95<br />
              Ribbed rubber: μ ≈ 0.90<br />
              Smooth plastic: μ ≈ 0.35
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
            <span className="font-bold text-white block">Normal Force (N)</span>
            <p className="text-gray-400">
              Heavier vehicles possess higher normal force, granting superior pushing traction on flat floors.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
            <span className="font-bold text-white block">Motor Torque Match</span>
            <p className="text-gray-400">
              Wheel torque τ must satisfy: τ ≥ (F_push · r_wheel) to prevent motor stall before tire slip.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Wedge Leverage Mechanics */}
      <div className="rounded-2xl border border-white/10 bg-[#111318] p-5 space-y-3">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <GitCommit size={16} className="text-sky-400" />
          <span>2. Wedge Lift Mechanics &amp; Traction Negation</span>
        </h3>

        <p className="text-xs text-gray-300 leading-relaxed">
          A low-slung front wedge blade (such as STRIKER&apos;s 14° incline) is an inclined plane that exploits the opponent&apos;s forward velocity:
        </p>

        <div className="p-4 rounded-xl bg-black/60 border border-white/10 text-center font-mono text-sm font-bold text-sky-400">
          N_opponent(effective) = (m_opp · g) - F_lift &rarr; μ · N_opp &rarr; 0
        </div>

        <p className="text-xs text-gray-400 leading-relaxed">
          When the leading edge gets under the opponent&apos;s chassis, the opponent&apos;s drive wheels lose contact with the arena floor. Their effective normal force drops by up to 65%, transferring their weight onto the wedge vehicle and allowing even a lightweight pusher to bulldoze a heavy opponent.
        </p>
      </div>

      {/* 3. Electrical Schematic */}
      <div className="rounded-2xl border border-white/10 bg-[#111318] p-5 space-y-3">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Zap size={16} className="text-yellow-400" />
          <span>3. Low-Voltage Electrical Circuit Schematic (L298N / Dual H-Bridge)</span>
        </h3>

        <div className="p-4 rounded-xl bg-black/80 border border-white/10 font-mono text-xs text-gray-300 overflow-x-auto">
          <pre className="leading-relaxed">
{`+---------------------[ (+) 7.4V DC BATTERY ]--------------------+
|                                                                |
+--->[ SPST SWITCH ]--->[ L298N VMS (Power In) ]                 |
                        [ L298N GND (Common) ]<--(-) Battery-----+
                                |
             +------------------+------------------+
             |                                     |
    [ OUT1 & OUT2 (Left) ]              [ OUT3 & OUT4 (Right) ]
             |                                     |
   ( M1 )====( M2 ) Left Motors         ( M3 )====( M4 ) Right Motors
   (Parallel 4WD Coupling)              (Parallel 4WD Coupling)

   [ L298N 5V Out ]--->[ ESP32 / Arduino 5V In ]
   [ L298N GND ]------>[ ESP32 / Arduino GND ]
   [ IN1 - IN4 ]<-----[ PWM Logic Pins D12, D13, D14, D27 ]`}
          </pre>
        </div>

        <p className="text-xs text-gray-400 leading-relaxed">
          <strong>Operating Guidelines:</strong> Use multi-strand 20 AWG silicone wire for high-current motor paths. Ensure motor driver heatsink is open to ventilation air inside the chassis.
        </p>
      </div>
    </div>
  );
}
