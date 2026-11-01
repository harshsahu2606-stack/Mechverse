"use client";

import React, { useState } from "react";
import { Activity, CheckCircle2, AlertTriangle, Shield, Play, RotateCw } from "lucide-react";

export default function AeroCalibrationGuide() {
  const [activeCalib, setActiveCalib] = useState<"accel" | "compass" | "esc" | "radio" | "prearm">("accel");
  const [completedCalibs, setCompletedCalibs] = useState<Record<string, boolean>>({});

  const toggleDone = (id: string) => {
    setCompletedCalibs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6 text-gray-200">
      <div>
        <h2 className="text-2xl font-black text-white flex items-center gap-2">
          <Activity className="text-emerald-400" size={24} />
          <span>Flight Controller Sensor Calibration & Pre-Flight Testing</span>
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Perform these 5 mandatory sensor calibrations in Mission Planner / QGroundControl before arming.
        </p>
      </div>

      {/* Calibration Step Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: "accel", label: "1. 6-Point Accelerometer" },
          { id: "compass", label: "2. 3D Compass Sphere" },
          { id: "esc", label: "3. ESC Throttle Endpoints" },
          { id: "radio", label: "4. Props-Off Motor Spin Test" },
          { id: "prearm", label: "5. Pre-Arm Safety Checks" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveCalib(t.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeCalib === t.id
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 border border-emerald-400/40"
                : "bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Active Calibration Guide Card */}
      <div className="bg-[#0e131b] border border-white/10 rounded-2xl p-6 space-y-5">
        {activeCalib === "accel" && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">6-Point Accelerometer Calibration Protocol</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Calculates zero-g offsets and scaling factors for all 3 internal accelerometers. Place the drone on a flat, level surface and click "Calibrate Accel". Hold the vehicle completely still in 6 orientations when prompted:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="bg-black/30 p-3 rounded-xl border border-white/5">1. Level (Standard landing skids flat)</div>
              <div className="bg-black/30 p-3 rounded-xl border border-white/5">2. Left Side (90° tilt left)</div>
              <div className="bg-black/30 p-3 rounded-xl border border-white/5">3. Right Side (90° tilt right)</div>
              <div className="bg-black/30 p-3 rounded-xl border border-white/5">4. Nose Down (90° tilt forward)</div>
              <div className="bg-black/30 p-3 rounded-xl border border-white/5">5. Nose Up (90° tilt back)</div>
              <div className="bg-black/30 p-3 rounded-xl border border-white/5">6. Upside Down (Inverted flat)</div>
            </div>
          </div>
        )}

        {activeCalib === "compass" && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Live 3D Compass Sphere Calibration</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Compensates for hard-iron and soft-iron magnetic interference from the battery and power traces.
            </p>
            <div className="bg-black/30 p-4 rounded-xl border border-white/5 space-y-2 text-xs">
              <p>• Perform outdoors far from large steel structures, cars, or underground pipes.</p>
              <p>• Slowly rotate the drone around all 3 axes (Yaw, Pitch, Roll) continuously for 60 seconds until the green sphere is 100% full of sample points.</p>
              <p>• Offsets must be &lt; 400 for a healthy compass reading.</p>
            </div>
          </div>
        )}

        {activeCalib === "esc" && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">All-At-Once ESC Throttle Range Calibration</h3>
            <div className="p-3 bg-rose-950/20 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertTriangle size={16} className="text-rose-400 shrink-0" />
              <span>PROPELLERS MUST BE REMOVED! ESCs WILL GO TO MAXIMUM THROTTLE!</span>
            </div>
            <ol className="space-y-2 text-xs list-decimal list-inside text-gray-300 leading-relaxed font-mono">
              <li>Turn on transmitter and push throttle stick to 100% MAXIMUM.</li>
              <li>Plug in LiPo battery. The Pixhawk LED will flash red, blue, and yellow in cyclic pattern.</li>
              <li>Unplug LiPo battery and plug it in again immediately.</li>
              <li>Press and hold the Pixhawk safety switch for 2 seconds until it turns solid red.</li>
              <li>ESCs will emit a musical chime followed by 2 high beeps confirming max throttle endpoint set.</li>
              <li>Immediately pull throttle stick to 0% MINIMUM. ESCs emit 3 beeps and a long confirmation tone.</li>
            </ol>
          </div>
        )}

        {activeCalib === "radio" && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Props-Off Motor Spin Direction Verification</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Verify that each motor spins in the exact required direction before ever installing propellers:
            </p>
            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="bg-black/30 p-3 rounded-xl border border-emerald-500/20 text-emerald-300">
                • Motor 1 (Front-Right): CCW
              </div>
              <div className="bg-black/30 p-3 rounded-xl border border-emerald-500/20 text-emerald-300">
                • Motor 2 (Front-Left): CW
              </div>
              <div className="bg-black/30 p-3 rounded-xl border border-emerald-500/20 text-emerald-300">
                • Motor 3 (Rear-Left): CCW
              </div>
              <div className="bg-black/30 p-3 rounded-xl border border-emerald-500/20 text-emerald-300">
                • Motor 4 (Rear-Right): CW
              </div>
            </div>
            <p className="text-xs text-gray-400">
              Tip: Place a piece of blue painter's tape on each bare motor shaft to clearly see rotation direction at low idle.
            </p>
          </div>
        )}

        {activeCalib === "prearm" && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Automated Pre-Arm Safety Checks</h3>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 size={15} />
                <span>GPS 3D Fix: ≥ 8 Satellites & HDOP &lt; 1.5</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 size={15} />
                <span>Battery Voltage: &gt; 11.1V (3S nominal threshold)</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 size={15} />
                <span>Radio Failsafe: RTL (Return to Launch) activated on signal loss</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 size={15} />
                <span>Geofence: Maximum Altitude 120m (400ft AGL Indian DGCA ceiling)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
