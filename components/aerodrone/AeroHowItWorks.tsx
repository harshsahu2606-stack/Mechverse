"use client";

import React, { useState } from "react";
import { Cpu, RotateCcw, ArrowUp, ArrowDown, Activity, Wind, Gauge, Layers } from "lucide-react";

export default function AeroHowItWorks() {
  const [activeTopic, setActiveTopic] = useState<"kinematics" | "reaction-torque" | "esc" | "pid" | "avionics">("kinematics");

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 space-y-6 text-gray-200">
      <div>
        <h2 className="text-2xl font-black text-white flex items-center gap-2">
          <Cpu className="text-emerald-400" size={24} />
          <span>How It Works: UAV Aerodynamics & Flight Physics</span>
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Explore the exact mathematical and aerodynamic principles governing a quadcopter in 3D flight.
        </p>
      </div>

      {/* Topic Switcher Pills */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: "kinematics", label: "1. Quadcopter Kinematics & 6-DoF" },
          { id: "reaction-torque", label: "2. Motor Counter-Torque & Yaw" },
          { id: "esc", label: "3. Brushless ESC & 3-Phase Inversion" },
          { id: "pid", label: "4. PID Closed-Loop Flight Stabilization" },
          { id: "avionics", label: "5. IMU Sensors & Extended Kalman Filter" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTopic(t.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTopic === t.id
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 border border-emerald-400/40"
                : "bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Dynamic Topic Card */}
      {activeTopic === "kinematics" && (
        <div className="bg-[#0e131b] border border-white/10 rounded-2xl p-6 space-y-5">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Wind className="text-emerald-400" size={18} />
            <span>Vertical Lift, Pitch, Roll & Altitude Control</span>
          </h3>
          <p className="text-xs text-gray-300 leading-relaxed">
            A quadcopter controls all 6 degrees of freedom (3 translational axes $X, Y, Z$ and 3 rotational axes $\phi, \theta, \psi$) solely by varying the relative speeds of its 4 independent fixed-pitch propellers.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="bg-black/30 border border-white/5 rounded-xl p-4 space-y-2">
              <span className="text-xs font-mono font-bold text-emerald-400 block uppercase">
                Hover & Vertical Lift (Z)
              </span>
              <p className="text-xs text-gray-400 leading-relaxed">
                When all 4 motors spin at equal RPM producing total thrust equal to the drone weight (T_total = m · g), the quadcopter hovers stationary in 3D space.
              </p>
            </div>

            <div className="bg-black/30 border border-white/5 rounded-xl p-4 space-y-2">
              <span className="text-xs font-mono font-bold text-sky-400 block uppercase">
                Pitch Angle (θ - Forward/Aft)
              </span>
              <p className="text-xs text-gray-400 leading-relaxed">
                Increasing rear motors (M3, M4) RPM while decreasing front motors (M1, M2) tilts the drone forward, directing thrust vector backward to propel the quadcopter forward.
              </p>
            </div>

            <div className="bg-black/30 border border-white/5 rounded-xl p-4 space-y-2">
              <span className="text-xs font-mono font-bold text-amber-400 block uppercase">
                Roll Angle (ϕ - Left/Right)
              </span>
              <p className="text-xs text-gray-400 leading-relaxed">
                Increasing left motors (M2, M3) while decreasing right motors (M1, M4) tilts the drone rightward, banking the vehicle laterally without changing heading.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTopic === "reaction-torque" && (
        <div className="bg-[#0e131b] border border-white/10 rounded-2xl p-6 space-y-5">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <RotateCcw className="text-emerald-400" size={18} />
            <span>Newton's Third Law & Aerodynamic Yaw Mechanism</span>
          </h3>
          <p className="text-xs text-gray-300 leading-relaxed">
            By Newton's third law of motion, when a motor spins a propeller clockwise (CW), the air resistance exerts an equal and opposite counter-torque on the quadcopter frame in the counter-clockwise (CCW) direction.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-mono font-bold text-emerald-400">ArduPilot / PX4 Motor Standard</h4>
              <ul className="text-xs text-gray-300 space-y-1 font-mono">
                <li>• M1 (Front-Right): CCW &rarr; Reaction: CW torque</li>
                <li>• M2 (Front-Left): CW &rarr; Reaction: CCW torque</li>
                <li>• M3 (Rear-Left): CCW &rarr; Reaction: CW torque</li>
                <li>• M4 (Rear-Right): CW &rarr; Reaction: CCW torque</li>
              </ul>
            </div>
            <div className="bg-black/30 border border-white/5 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-mono font-bold text-emerald-400">How Heading (Yaw) Rotates</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                To rotate heading clockwise (Yaw Right), the flight controller speeds up the CCW spinning motors (M1, M3) and slows down CW motors (M2, M4). Total lift remains constant, but unbalanced counter-torque spins the drone in place.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTopic === "esc" && (
        <div className="bg-[#0e131b] border border-white/10 rounded-2xl p-6 space-y-5">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Gauge className="text-emerald-400" size={18} />
            <span>Electronic Speed Controller (ESC) & 3-Phase Commutation</span>
          </h3>
          <p className="text-xs text-gray-300 leading-relaxed">
            Brushless outrunner motors (BLDC) cannot run on DC power directly. The 30A ESC converts DC voltage from the 3S LiPo battery into 3-phase AC sinusoidal/trapezoidal waveforms to rotate the permanent magnet bell.
          </p>
          <div className="bg-black/40 border border-white/10 rounded-xl p-4 space-y-2 text-xs font-mono text-gray-300">
            <div>• Control Signal: Standard 1000µs - 2000µs PWM (or DShot digital protocol)</div>
            <div>• Inverter Bridge: 6x high-efficiency N-channel MOSFETs switching at 24kHz</div>
            <div>• Reversing Direction: Swapping ANY two of the three bullet wires reverses phase sequence and motor direction.</div>
          </div>
        </div>
      )}

      {activeTopic === "pid" && (
        <div className="bg-[#0e131b] border border-white/10 rounded-2xl p-6 space-y-5">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity className="text-emerald-400" size={18} />
            <span>PID Closed-Loop Flight Stabilization (400Hz Loop)</span>
          </h3>
          <p className="text-xs text-gray-300 leading-relaxed">
            Because a quadcopter is inherently aerodynamically unstable, the flight controller runs a 400Hz Proportional-Integral-Derivative (PID) algorithm to correct attitude error in under 2.5 milliseconds:
          </p>
          <div className="bg-black/50 p-4 rounded-xl border border-white/10 font-mono text-xs text-emerald-400 text-center">
            u(t) = K_p · e(t) + K_i · ∫ e(τ)dτ + K_d · (de(t) / dt)
          </div>
        </div>
      )}

      {activeTopic === "avionics" && (
        <div className="bg-[#0e131b] border border-white/10 rounded-2xl p-6 space-y-5">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="text-emerald-400" size={18} />
            <span>Inertial Measurement Unit (IMU) & EKF Sensor Fusion</span>
          </h3>
          <p className="text-xs text-gray-300 leading-relaxed">
            The Pixhawk contains redundant triple-axis gyroscopes, accelerometers, a digital barometer (MS5611), and an external magnetometer (compass). The 24-state Extended Kalman Filter (EKF) fuses high-frequency gyro data with GPS positions to maintain sub-centimeter position hold in LOITER mode.
          </p>
        </div>
      )}
    </div>
  );
}
