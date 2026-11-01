"use client";

import React, { useState } from "react";
import {
  Hexagon,
  Scale,
  Timer,
  Zap,
  Cpu,
  ShieldCheck,
  ShoppingBag,
  Wrench,
  CheckCircle2,
  ChevronRight,
  AlertTriangle,
  FileCode,
  Gauge,
  Compass,
} from "lucide-react";
import { DRONE_B_SHOPPING_LIST, DRONE_B_ENGINEERING_SPECS } from "@/data/droneBSourcingData";

interface DroneBWorkshopViewProps {
  activePillar: "engineering" | "electronics" | "bom" | "guide";
  subTab?: string;
  theme?: "dark" | "light";
}

export default function DroneBWorkshopView({
  activePillar,
  subTab = "overview",
  theme = "dark",
}: DroneBWorkshopViewProps) {
  const isLight = theme === "light";
  const totalBOM = DRONE_B_SHOPPING_LIST.reduce((acc, item) => acc + item.priceINR, 0);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* ================= 1. ENGINEERING & SPECS ================= */}
      {activePillar === "engineering" && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="p-6 rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-[#0e122b] via-[#090b1c] to-[#060812] space-y-3 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Hexagon size={16} />
              <span>Heavy-Lift Industrial UAV Physics</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Drone-B Aerodynamic & Mechanical Architecture
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-3xl leading-relaxed">
              Engineered in SolidWorks for industrial inspection, precision aerial surveying, and heavy payload transport.
              Features a 650mm wheelbase, high-efficiency 400KV brushless outrunners, 18-inch carbon fiber blades, and an enclosed 300x300mm octagonal avionics bay.
            </p>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-1">
              <span className="text-[10px] font-mono uppercase text-gray-400 block">All-Up Weight</span>
              <span className="text-2xl font-black text-white">{DRONE_B_ENGINEERING_SPECS.allUpWeightGrams} g</span>
              <span className="text-[10px] text-gray-500 block">Airframe + 6S 10Ah Battery</span>
            </div>

            <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-1">
              <span className="text-[10px] font-mono uppercase text-gray-400 block">Payload Capacity</span>
              <span className="text-2xl font-black text-indigo-400">+{DRONE_B_ENGINEERING_SPECS.maxPayloadCapacityGrams} g</span>
              <span className="text-[10px] text-gray-500 block">LiDAR / 4K Optical Gimbal</span>
            </div>

            <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-1">
              <span className="text-[10px] font-mono uppercase text-gray-400 block">Thrust / Weight</span>
              <span className="text-2xl font-black text-emerald-400">{DRONE_B_ENGINEERING_SPECS.thrustToWeightRatio}</span>
              <span className="text-[10px] text-gray-500 block">12.8 kg Peak Thrust</span>
            </div>

            <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-1">
              <span className="text-[10px] font-mono uppercase text-gray-400 block">Hover Endurance</span>
              <span className="text-2xl font-black text-amber-400">24 – 28 Min</span>
              <span className="text-[10px] text-gray-500 block">6S 10,000mAh Battery</span>
            </div>
          </div>

          {/* Technical Deep Dive Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl border border-white/10 bg-white/5 space-y-3">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
                <Gauge size={16} />
                <span>1. Triangular Lattice Truss Booms (Arm.SLDPRT)</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                The four 325mm arms feature custom 45° alternating triangular cutouts (▲▼▲▼▲).
                This geometry resists intense aerodynamic downwash flutter while shaving 42% of the cantilever mass compared to solid carbon tubes.
              </p>
              <div className="p-3 rounded-lg bg-black/40 border border-white/5 font-mono text-[11px] text-gray-300 space-y-1">
                <div>• Arm Length: 325 mm (300 mm Motor Center)</div>
                <div>• Material: 3K Twill Carbon / 6061-T6 Aluminum</div>
                <div>• Root Bending Moment Limit: 48.5 N·m</div>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-white/10 bg-white/5 space-y-3">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
                <ShieldCheck size={16} />
                <span>2. Indian DGCA Drone Rules 2021 Compliance</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                Operating under the Small Category (2kg to 25kg) in India. Equipped with NPNT (No Permission No Takeoff) hardware hooks, dual-redundant geo-caging failsafes, and 500mW MAVLink telemetry.
              </p>
              <div className="p-3 rounded-lg bg-black/40 border border-white/5 font-mono text-[11px] text-gray-300 space-y-1">
                <div>• Category: Small UAV (Max Takeoff: 6.2 kg)</div>
                <div>• DigitalSky Compliance: Green Zone Compatible</div>
                <div>• Return-to-Launch (RTL): Failsafe &lt; 20% Battery</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= 2. ELECTRONICS & WIRING ================= */}
      {activePillar === "electronics" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-[#0e122b] via-[#090b1c] to-[#060812] space-y-2 shadow-2xl">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Zap size={16} />
              <span>Pixhawk 6C Avionics & High-Voltage Power Bus</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Industrial Wiring Schematics & Pinout Mapping
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-3xl leading-relaxed">
              Complete electrical interconnects linking the 6S 22.2V LiPo battery, Matek PDB-HEX power board, four 40A Opto-isolated ESCs, and the STM32H7 Pixhawk 6C autopilot.
            </p>
          </div>

          {/* Pinout Table */}
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-white/5 text-gray-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="p-3">Component Pin</th>
                  <th className="p-3">Pixhawk 6C Port</th>
                  <th className="p-3">Signal Standard</th>
                  <th className="p-3">Operating Rail</th>
                  <th className="p-3">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono text-[11px]">
                <tr className="hover:bg-white/5">
                  <td className="p-3 text-indigo-400">ESC 1 (Front-Right)</td>
                  <td className="p-3 font-bold text-white">MAIN OUT 1</td>
                  <td className="p-3 text-emerald-400">DShot600 / PWM</td>
                  <td className="p-3">3.3V Logic / Opto</td>
                  <td className="p-3 font-sans">Controls Motor 1 (CCW) rotation</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="p-3 text-indigo-400">ESC 2 (Front-Left)</td>
                  <td className="p-3 font-bold text-white">MAIN OUT 2</td>
                  <td className="p-3 text-emerald-400">DShot600 / PWM</td>
                  <td className="p-3">3.3V Logic / Opto</td>
                  <td className="p-3 font-sans">Controls Motor 2 (CW) rotation</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="p-3 text-indigo-400">ESC 3 (Rear-Left)</td>
                  <td className="p-3 font-bold text-white">MAIN OUT 3</td>
                  <td className="p-3 text-emerald-400">DShot600 / PWM</td>
                  <td className="p-3">3.3V Logic / Opto</td>
                  <td className="p-3 font-sans">Controls Motor 3 (CCW) rotation</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="p-3 text-indigo-400">ESC 4 (Rear-Right)</td>
                  <td className="p-3 font-bold text-white">MAIN OUT 4</td>
                  <td className="p-3 text-emerald-400">DShot600 / PWM</td>
                  <td className="p-3">3.3V Logic / Opto</td>
                  <td className="p-3 font-sans">Controls Motor 4 (CW) rotation</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="p-3 text-sky-400">M9N GNSS Mast</td>
                  <td className="p-3 font-bold text-white">GPS 1 / I2C 1</td>
                  <td className="p-3 text-amber-300">UART 115200 + I2C</td>
                  <td className="p-3">5.0V Regulated</td>
                  <td className="p-3 font-sans">Multi-constellation GPS & external compass</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="p-3 text-amber-400">915MHz Radio</td>
                  <td className="p-3 font-bold text-white">TELEM 1</td>
                  <td className="p-3 text-amber-300">MAVLink 57600</td>
                  <td className="p-3">5.0V Regulated</td>
                  <td className="p-3 font-sans">Long-range ground station telemetry</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="p-3 text-rose-400">Matek PDB Shunt</td>
                  <td className="p-3 font-bold text-white">POWER 1</td>
                  <td className="p-3 text-purple-400">Analog V / I Sensor</td>
                  <td className="p-3">5.3V Dual BEC</td>
                  <td className="p-3 font-sans">Main pack voltage & current telemetry</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 flex items-start gap-3">
            <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-gray-300 space-y-1">
              <span className="font-bold text-white block">High Voltage Caution (6S 22.2V LiPo)</span>
              <p>
                Always install an XT90-S (Anti-Spark) connector. Direct connection without spark suppression can weld contact pins and cause voltage transients that damage the flight controller.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= 3. INDIAN BOM & PRICING ================= */}
      {activePillar === "bom" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-6 rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-[#0e122b] via-[#090b1c] to-[#060812] shadow-2xl">
            <div>
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-bold uppercase tracking-wider">
                <ShoppingBag size={16} />
                <span>Verified Sourcing Bill of Materials</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                Drone-B Component Cost Breakdown
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Current Indian market prices from verified suppliers (Robu.in, ElectronicsComp, Robocraze).
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-right shrink-0">
              <span className="text-[10px] text-gray-400 uppercase font-mono block">Complete Build Cost</span>
              <span className="text-xl font-black text-indigo-400">₹{totalBOM.toLocaleString()} INR</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {DRONE_B_SHOPPING_LIST.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-2 hover:border-indigo-500/40 transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-white">{item.component}</span>
                    <span className="text-[11px] text-gray-400 block font-mono">{item.model}</span>
                  </div>
                  <span className="text-xs font-bold font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 shrink-0">
                    ₹{item.priceINR}
                  </span>
                </div>
                <p className="text-[11px] text-gray-300 leading-snug">{item.purpose}</p>
                <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px] font-mono text-gray-400">
                  <span>Vendor: {item.seller}</span>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
                  >
                    Source Link <ChevronRight size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= 4. BUILD GUIDE & TUNING ================= */}
      {activePillar === "guide" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-[#0e122b] via-[#090b1c] to-[#060812] space-y-2 shadow-2xl">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Wrench size={16} />
              <span>Assembly & Tuning Walkthrough</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              6-Stage Drone-B Production Build Guide
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-3xl leading-relaxed">
              Follow these professional aerospace assembly stages to construct, balance, and flight-test your Drone-B industrial UAV.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                stage: "01",
                title: "Fuselage Hull & Lattice Arms Clamping",
                desc: "Bolt the four triangular truss arms into the octagonal corner sockets using high-tensile M8 bolts. Verify strict 90-degree arm orthogonality across diagonal centerlines (650mm).",
              },
              {
                stage: "02",
                title: "400KV Brushless Motors & Outrunner Mounting",
                desc: "Secure the four Sunnysky V4014 motors to the arm tips with M3 blue thread-locker. Route motor phase wires through the arm lattice cutouts to the internal electronics bay.",
              },
              {
                stage: "03",
                title: "Power Distribution Board & Opto ESC Soldering",
                desc: "Solder the 40A Opto ESC battery leads to the Matek PDB-HEX. Connect the main XT90-S pigtail and test all solder joints with a multimeter for zero short circuits before connecting power.",
              },
              {
                stage: "04",
                title: "Pixhawk 6C Vibration Isolation & GPS Mast",
                desc: "Mount the Pixhawk 6C on the center fuselage floor using silicone anti-vibration damping grommets. Install the M9N GPS mast at least 15cm above the frame to isolate the compass from motor EMI.",
              },
              {
                stage: "05",
                title: "Firmware Flashing & Motor Direction Verification",
                desc: "Connect via USB to QGroundControl. Select PX4 or ArduPilot Quad X airframe. Calibrate the accelerometer, compass, and ESC endpoints. Confirm CW and CCW motor spin directions.",
              },
              {
                stage: "06",
                title: "Ground Thrust Balance & First Hover Test",
                desc: "Mount the balanced 18-inch carbon fiber propellers. Perform a ground tether test to evaluate vibration telemetry (target &lt; 15 m/s²). Conduct initial maiden hover in Stabilize / Alt-Hold mode.",
              },
            ].map((s) => (
              <div
                key={s.stage}
                className="p-4 rounded-xl border border-white/10 bg-white/5 flex items-start gap-4 hover:border-indigo-500/40 transition"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-mono font-black text-sm shrink-0">
                  {s.stage}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">{s.title}</h4>
                  <p className="text-xs text-gray-300 mt-1 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
