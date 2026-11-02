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
import BuyLinkButtons from "@/components/ui/BuyLinkButtons";

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
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/5 text-[10px] font-mono text-gray-400">
                  <span>Vendor: {item.seller}</span>
                  <BuyLinkButtons
                    componentName={item.model}
                    officialUrl={item.url}
                    vendorName={item.seller}
                    compact={true}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= 4. BUILD GUIDE & TUNING ================= */}
      {activePillar === "guide" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-[#0e122b] via-[#090b1c] to-[#060812] space-y-2 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-bold uppercase tracking-wider">
                <Wrench size={16} />
                <span>Industrial Aerospace Engineering Manual</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                Drone-B Assembly & Flight Calibration Guide
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 max-w-3xl leading-relaxed">
                Step-by-step mechanical assembly, high-voltage 6S electrical integration, sensor calibration in QGroundControl, and ground tether testing.
              </p>
            </div>

            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono shrink-0">
              <span className="text-indigo-400 font-bold px-2 py-1 bg-indigo-500/10 rounded-lg">
                EST. BUILD: 6 - 8 HRS
              </span>
              <span className="text-gray-400 px-2">DIFFICULTY: ADVANCED</span>
            </div>
          </div>

          {/* Guide Section 1: Mechanical & Electrical Assembly */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 font-mono uppercase tracking-wider text-indigo-400">
              <span>Part 1: Mechanical Airframe & Power Assembly</span>
            </h3>

            <div className="grid grid-cols-1 gap-3.5">
              {[
                {
                  stage: "01",
                  title: "Fuselage Hull & Lattice Arms Orthogonal Clamping",
                  time: "45 mins",
                  torque: "M8 Bolts: 8.5 Nm Torque",
                  tools: "M6 & M8 Hex T-Handles, Blue Loctite 242, Digital Calipers",
                  desc: "Align the four triangular carbon-fiber truss arms into the 6061-T6 billet aluminum fuselage corner sockets. Insert the high-tensile M8 socket-head cap screws with split-lock washers. Apply blue thread-locker (Loctite 242) to all threads. Use digital calipers to verify exact 650.0mm diagonal center-to-center wheelbase and ensure 90.0° orthogonal alignment across opposing arms before final torquing.",
                  criticalCheck: "Arm deflection under a 5kg test weight must not exceed 0.8mm at the motor mount tips.",
                },
                {
                  stage: "02",
                  title: "Sunnysky V4014 Motors & Coaxial Arm Tip Installation",
                  time: "60 mins",
                  torque: "M3 Motor Screws: 2.1 Nm",
                  tools: "2.0mm Hex Driver, 18-inch Propeller Balancer",
                  desc: "Mount the Sunnysky V4014 400KV outrunner motors to the arm end plates using M3×8mm hex screws with medium-strength thread-locker. Route the 3-phase silicone motor lead wires (16AWG) through the carbon lattice arm interior cutouts to shield them from aerodynamic turbulence and propeller wash.",
                  criticalCheck: "Check motor screw thread penetration: Screws must enter stator base by 3-4mm without contacting the internal copper windings (which causes instant phase short).",
                },
                {
                  stage: "03",
                  title: "Matek PDB-HEX Power Bus & XT90-S Anti-Spark Soldering",
                  time: "50 mins",
                  torque: "Solder Temp: 380°C - 400°C",
                  tools: "60W Soldering Iron, 63/37 Rosin Core Solder, Multimeter",
                  desc: "Tin the heavy copper power pads on the Matek PDB-HEX power distribution board. Solder the 12AWG power leads from the 40A Opto ESCs directly to the respective ESC output pads. Solder the main XT90-S anti-spark battery pigtail (10AWG silicone wire). Ensure heavy, shiny concave solder fillets that fully encapsulate copper strands.",
                  criticalCheck: "Perform continuity check with a digital multimeter in beep/resistance mode across XT90 (+) and (-) before connecting any battery. Resistance MUST read infinite (O.L.).",
                },
                {
                  stage: "04",
                  title: "Pixhawk 6C Vibration Dampened Avionics Deck",
                  time: "40 mins",
                  torque: "Finger-tight / Grommet Compression: 25%",
                  tools: "Silicone Anti-Vibration Grommets, 3M VHB Tape",
                  desc: "Install the Pixhawk 6C flight controller on the internal fuselage carbon plate using four silicone vibration-damping bobbins. Route the DShot signal wires from the 4 ESCs to MAIN OUT ports 1 through 4. Mount the Holybro H-RTK F9P GNSS antenna on an elevated 18cm carbon mast to ensure magnetic isolation from the high-amperage (140A) PDB bus.",
                  criticalCheck: "Pixhawk orientation arrow must point precisely forward along the fuselage longitudinal roll axis.",
                },
              ].map((s) => (
                <div
                  key={s.stage}
                  className="p-5 rounded-2xl border border-white/10 bg-[#0c0f18] space-y-3 hover:border-indigo-500/40 transition"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-mono font-black text-sm shrink-0">
                        {s.stage}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider">{s.title}</h4>
                        <div className="flex items-center gap-3 text-[11px] font-mono text-gray-400 mt-0.5">
                          <span>⏱️ {s.time}</span>
                          <span>•</span>
                          <span className="text-amber-400 font-semibold">⚙️ {s.torque}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-[11px] font-mono text-gray-400 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                      Tools: {s.tools}
                    </div>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed font-sans">{s.desc}</p>

                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
                    <span className="font-bold uppercase font-mono shrink-0">Mandatory Quality Check:</span>
                    <span>{s.criticalCheck}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Guide Section 2: Sensor Calibration & Flight Testing */}
          <div className="space-y-4 pt-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2 font-mono uppercase tracking-wider text-emerald-400">
              <span>Part 2: QGroundControl Sensor Calibration & Bench Testing Suite</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-white/10 bg-[#0c0f18] space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase">
                  <span>Test 01: Bench Smoke-Stopper Current Test</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Before plugging in the full 6S 22.2V LiPo directly, connect an automotive 12V 55W bulb or solid-state Smoke Stopper in series with the battery lead. Power on the system. If the bulb glows dimly and turns off, there is zero short circuit and the PDB is safe. If the bulb glows intensely, immediately disconnect and locate the solder bridge.
                </p>
                <div className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                  Target Standby Draw: &lt; 450mA at 22.2V DC
                </div>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-[#0c0f18] space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase">
                  <span>Test 02: DShot Digital ESC Motor Direction Check</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  In QGroundControl Motor Test tab, test motors at 5% idle (PROPELLERS DETACHED). Touch the motor bell lightly with a piece of tape to confirm rotation direction:
                  Motor 1 (Front-Right): Counter-Clockwise (CCW).
                  Motor 2 (Rear-Left): Counter-Clockwise (CCW).
                  Motor 3 (Front-Left): Clockwise (CW).
                  Motor 4 (Rear-Right): Clockwise (CW).
                </p>
                <div className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                  Direction reversible in software via BLHeli_32 / DShot commands
                </div>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-[#0c0f18] space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase">
                  <span>Test 03: 6-Point Accelerometer & 3D Compass Calibration</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Place the airframe on a dead-level granite or spirit-level surface. Complete the 6-axis orientation calibration in QGroundControl. Next, perform the 3D compass sphere calibration outdoors, away from metal buildings or parked cars. Rotate the drone smoothly around all axes until all sphere dots turn green.
                </p>
                <div className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                  Compass Offsets: Must be &lt; 350 on all three axes (X, Y, Z)
                </div>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-[#0c0f18] space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase">
                  <span>Test 04: Ground Tether & Vibration Logging Test</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Mount the factory-balanced 18-inch carbon propellers. Secure the landing skids to a heavy 25kg ground test rig with nylon safety straps. Arm the drone and ramp throttle to 50% hover thrust. Download flight dataflash logs and verify IMU vibration telemetry:
                  CLIP0, CLIP1, CLIP2 must read 0.
                  Vibration levels must remain below 12 m/s² on X and Y, and below 15 m/s² on Z.
                </p>
                <div className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                  Pass Criteria: Stable hover current ~28A across 4 motors at 22.2V
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
