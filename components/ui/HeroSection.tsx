"use client";

import { ArrowRight, CheckCircle2, ChevronRight, Fan, CarFront, Bot, Palette, Sparkles, Layers, Cpu, Eye, Wrench, Swords, Plane, Hexagon, Smartphone, Cable, Crosshair, Camera } from "lucide-react";
import { MachineId } from "@/types/machine";

interface HeroSectionProps {
  onSelectAndLaunch: (machineId: MachineId, mode?: "explore" | "builder") => void;
}

export default function HeroSection({ onSelectAndLaunch }: HeroSectionProps) {
  return (
    <div className="w-full h-full flex flex-col justify-between p-4 sm:p-8 max-w-7xl mx-auto overflow-y-auto custom-scrollbar">
      {/* Top Banner */}
      <div className="text-center space-y-3 pt-2 sm:pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-semibold text-orange-400">
          <Sparkles size={13} className="text-orange-500 animate-pulse" />
          <span>Interactive 3D Engineering & Machine Simulator</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
          Explore Machines <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-red-500 via-orange-400 to-amber-300 bg-clip-text text-transparent">
            in Real-Time 3D
          </span>
        </h1>

        <p className="text-sm sm:text-base text-gray-400 font-medium max-w-xl mx-auto">
          Visualize. Customize. Learn. Build.
        </p>
        <p className="text-xs text-gray-500 max-w-lg mx-auto leading-relaxed">
          Select a machine below to launch into the full 3D interactive simulator with 360° inspection, multi-axis exploded view, and practical real-life workshop build guides.
        </p>
      </div>

      {/* Machine Selection Cards (ESP32 Drone, Drone B, Drone AERO-450, Robo Rumble, Robot, Car, Fan) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 gap-4 my-6">
        {/* ================= MODEL 0C: AERO-ESP SMARTPHONE WI-FI NANO DRONE (₹1,955) ================= */}
        <div className="group relative rounded-2xl border border-amber-500/50 bg-gradient-to-b from-[#25170a] to-[#0d0905] p-5 hover:border-amber-400 transition-all duration-300 shadow-2xl flex flex-col justify-between overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/35 transition" />

          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/25">
                BUDGET DIY / ₹1,955
              </span>
              <span className="text-xs text-amber-400 flex items-center gap-1 font-semibold">
                <Smartphone size={13} /> Phone Wi-Fi
              </span>
            </div>

            <div className="flex items-start gap-2.5 pt-1">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 group-hover:scale-110 transition">
                <Smartphone size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition leading-snug">
                  ESP32 Nano Drone
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                  Real flying quadcopter controlled via Android phone. ESP32 SoftAP, MPU6050 400Hz PID, 8520 coreless motors, and 1S LiPo.
                </p>
              </div>
            </div>

            {/* Feature Pills */}
            <div className="grid grid-cols-3 gap-1 pt-1 text-center">
              <div className="bg-white/5 rounded-lg p-1.5 border border-white/5">
                <span className="text-[8px] uppercase font-mono text-gray-400 block">Cost</span>
                <span className="text-xs font-bold text-emerald-400">₹1,955</span>
              </div>
              <div className="bg-white/5 rounded-lg p-1.5 border border-white/5">
                <span className="text-[8px] uppercase font-mono text-gray-400 block">AUW</span>
                <span className="text-xs font-bold text-white">56g</span>
              </div>
              <div className="bg-white/5 rounded-lg p-1.5 border border-white/5">
                <span className="text-[8px] uppercase font-mono text-gray-400 block">Radio</span>
                <span className="text-xs font-bold text-amber-300">No TX (Phone)</span>
              </div>
            </div>
          </div>

          {/* Launch Buttons */}
          <div className="flex items-center gap-2 pt-4 relative z-10">
            <button
              onClick={() => onSelectAndLaunch("esp32-drone", "explore")}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-xl shadow-amber-600/30 transition hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Launch Phone HUD</span>
              <ArrowRight size={13} />
            </button>
            <button
              onClick={() => onSelectAndLaunch("esp32-drone", "builder")}
              title="Customize Drone"
              className="px-2.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white transition"
            >
              <Palette size={14} />
            </button>
          </div>
        </div>

        {/* ================= MODEL 0D: ROBO-RACER AI AUTONOMOUS BOT (SOLIDWORKS CAD) ================= */}
        <div className="group relative rounded-2xl border border-orange-500/50 bg-gradient-to-b from-[#2a1306] to-[#0c0602] p-5 hover:border-orange-400 transition-all duration-300 shadow-2xl flex flex-col justify-between overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-orange-500/35 transition" />

          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold tracking-widest text-orange-400 uppercase bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/25">
                AI VISION / ₹2,888
              </span>
              <span className="text-xs text-orange-400 flex items-center gap-1 font-semibold">
                <Crosshair size={13} /> SolidWorks CAD
              </span>
            </div>

            <div className="flex items-start gap-2.5 pt-1">
              <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/25 text-orange-400 group-hover:scale-110 transition">
                <CarFront size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-orange-400 transition leading-snug">
                  Robo-Racer AI Bot
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                  Autonomous 4WD racing rover with Hikvision 1080p AI vision camera, HC-SR04 sonar reflex, and gullwing hood ('Dhakna').
                </p>
              </div>
            </div>

            {/* Feature Pills */}
            <div className="grid grid-cols-3 gap-1 pt-1 text-center">
              <div className="bg-white/5 rounded-lg p-1.5 border border-white/5">
                <span className="text-[8px] uppercase font-mono text-gray-400 block">Cost</span>
                <span className="text-xs font-bold text-emerald-400">₹2,888</span>
              </div>
              <div className="bg-white/5 rounded-lg p-1.5 border border-white/5">
                <span className="text-[8px] uppercase font-mono text-gray-400 block">Camera</span>
                <span className="text-xs font-bold text-sky-300">1080p Pan</span>
              </div>
              <div className="bg-white/5 rounded-lg p-1.5 border border-white/5">
                <span className="text-[8px] uppercase font-mono text-gray-400 block">Drive</span>
                <span className="text-xs font-bold text-orange-400">4WD Skid</span>
              </div>
            </div>
          </div>

          {/* Launch Buttons */}
          <div className="flex items-center gap-2 pt-4 relative z-10">
            <button
              onClick={() => onSelectAndLaunch("robo-racer", "explore")}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-black font-bold text-xs shadow-xl shadow-orange-600/30 transition hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Launch Studio</span>
              <ArrowRight size={13} />
            </button>
            <button
              onClick={() => onSelectAndLaunch("robo-racer", "builder")}
              title="Customize Robo-Racer"
              className="px-2.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white transition"
            >
              <Palette size={14} />
            </button>
          </div>
        </div>

        {/* ================= MODEL 0E: ROPEWAY ROBO — CABLE CLIMBING ROBOT ================= */}
        <div className="group relative rounded-2xl border border-sky-500/50 bg-gradient-to-b from-[#0c182c] to-[#060a14] p-5 hover:border-sky-400 transition-all duration-300 shadow-2xl flex flex-col justify-between overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-sky-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-sky-500/35 transition" />

          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold tracking-widest text-sky-400 uppercase bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/25">
                CABLE TRAVERSER / ₹840
              </span>
              <span className="text-xs text-sky-400 flex items-center gap-1 font-semibold">
                <Cable size={13} /> Horizontal Rope
              </span>
            </div>

            <div className="flex items-start gap-2.5 pt-1">
              <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/25 text-sky-400 group-hover:scale-110 transition">
                <Cable size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-sky-400 transition leading-snug">
                  AeroClimb Horizon-X1
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                  Autonomous horizontal cableway robot with dual reciprocating gripping arms, human-like hand-over-hand climbing, and 4K inspection gimbal.
                </p>
              </div>
            </div>

            {/* Feature Pills */}
            <div className="grid grid-cols-3 gap-1 pt-1 text-center">
              <div className="bg-white/5 rounded-lg p-1.5 border border-white/5">
                <span className="text-[8px] uppercase font-mono text-gray-400 block">Max Incline</span>
                <span className="text-xs font-bold text-amber-400">45° Slope</span>
              </div>
              <div className="bg-white/5 rounded-lg p-1.5 border border-white/5">
                <span className="text-[8px] uppercase font-mono text-gray-400 block">Drive</span>
                <span className="text-xs font-bold text-sky-300">Worm Gear</span>
              </div>
              <div className="bg-white/5 rounded-lg p-1.5 border border-white/5">
                <span className="text-[8px] uppercase font-mono text-gray-400 block">Cable</span>
                <span className="text-xs font-bold text-emerald-400">2–6mm</span>
              </div>
            </div>
          </div>

          {/* Launch Buttons */}
          <div className="flex items-center gap-2 pt-4 relative z-10">
            <button
              onClick={() => onSelectAndLaunch("ropeway-robot", "explore")}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-xs shadow-xl shadow-sky-600/30 transition hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Launch 3D Climber</span>
              <ArrowRight size={13} />
            </button>
            <button
              onClick={() => onSelectAndLaunch("ropeway-robot", "builder")}
              title="Customize Ropeway Climber"
              className="px-2.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white transition"
            >
              <Palette size={14} />
            </button>
          </div>
        </div>

        {/* ================= MODEL 0B: DRONE B — INDUSTRIAL OCTAGONAL CAD MODEL (ASSET DRONE B) ================= */}
        <div className="group relative rounded-2xl border border-indigo-500/50 bg-gradient-to-b from-[#11162b] to-[#070913] p-5 hover:border-indigo-400 transition-all duration-300 shadow-2xl flex flex-col justify-between overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/35 transition" />

          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold tracking-widest text-indigo-400 uppercase bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/25">
                CAD ASSET / 006
              </span>
              <span className="text-xs text-indigo-400 flex items-center gap-1 font-semibold">
                <Hexagon size={13} /> Octa Quad
              </span>
            </div>

            <div className="flex items-start gap-2.5 pt-1">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 group-hover:scale-110 transition">
                <Hexagon size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition leading-snug">
                  Drone B (Octa UAV)
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                  SolidWorks industrial quadcopter with 300mm octagonal body, custom truss arms (▲▼▲▼▲), and 460mm props.
                </p>
              </div>
            </div>

            {/* Feature Pills */}
            <div className="grid grid-cols-3 gap-1 pt-1 text-center">
              <div className="bg-white/5 rounded-lg p-1.5 border border-white/5">
                <span className="text-[8px] uppercase font-mono text-gray-400 block">Hull</span>
                <span className="text-xs font-bold text-indigo-400">300mm</span>
              </div>
              <div className="bg-white/5 rounded-lg p-1.5 border border-white/5">
                <span className="text-[8px] uppercase font-mono text-gray-400 block">Truss</span>
                <span className="text-xs font-bold text-white">325mm</span>
              </div>
              <div className="bg-white/5 rounded-lg p-1.5 border border-white/5">
                <span className="text-[8px] uppercase font-mono text-gray-400 block">Props</span>
                <span className="text-xs font-bold text-sky-300">460mm</span>
              </div>
            </div>
          </div>

          {/* Launch Buttons */}
          <div className="flex items-center gap-2 pt-4 relative z-10">
            <button
              onClick={() => onSelectAndLaunch("drone-b", "explore")}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-bold text-xs shadow-xl shadow-indigo-600/30 transition hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Explore CAD</span>
              <ArrowRight size={13} />
            </button>
            <button
              onClick={() => onSelectAndLaunch("drone-b", "builder")}
              title="Customize Drone B"
              className="px-2.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white transition"
            >
              <Palette size={14} />
            </button>
          </div>
        </div>

        {/* ================= MODEL 0: AERO-450 QUADCOPTER DRONE (NEW FLAGSHIP) ================= */}
        <div className="group relative rounded-2xl border border-emerald-500/50 bg-gradient-to-b from-[#0f241a] to-[#070e0b] p-5 hover:border-emerald-400 transition-all duration-300 shadow-2xl flex flex-col justify-between overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/35 transition" />

          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/25">
                NEW • AVIONICS / 005
              </span>
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                <Plane size={13} /> F450 UAV
              </span>
            </div>

            <div className="flex items-start gap-2.5 pt-1">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 group-hover:scale-110 transition">
                <Plane size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition leading-snug">
                  AERO-450 Drone
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                  Modular F450 quadcopter with 2212 motors, Pixhawk autopilot, live 3D exploded view, and DGCA Indian UAV guide.
                </p>
              </div>
            </div>

            {/* Feature Pills */}
            <div className="grid grid-cols-3 gap-1 pt-1 text-center">
              <div className="bg-white/5 rounded-lg p-1.5 border border-white/5">
                <span className="text-[8px] uppercase font-mono text-gray-400 block">Class</span>
                <span className="text-xs font-bold text-emerald-400">450mm</span>
              </div>
              <div className="bg-white/5 rounded-lg p-1.5 border border-white/5">
                <span className="text-[8px] uppercase font-mono text-gray-400 block">TWR</span>
                <span className="text-xs font-bold text-white">2.8:1</span>
              </div>
              <div className="bg-white/5 rounded-lg p-1.5 border border-white/5">
                <span className="text-[8px] uppercase font-mono text-gray-400 block">Flight</span>
                <span className="text-xs font-bold text-teal-300">~15m</span>
              </div>
            </div>
          </div>

          {/* Launch Buttons */}
          <div className="flex items-center gap-2 pt-4 relative z-10">
            <button
              onClick={() => onSelectAndLaunch("aero-450", "explore")}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-xl shadow-emerald-600/30 transition hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Launch UAV</span>
              <ArrowRight size={13} />
            </button>
            <button
              onClick={() => onSelectAndLaunch("aero-450", "builder")}
              title="Customize Drone"
              className="px-2.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white transition"
            >
              <Palette size={14} />
            </button>
          </div>
        </div>

        {/* ================= MODEL 1: ROBO RUMBLE (FEATURED) ================= */}
        <div className="group relative rounded-2xl border border-rose-500/40 bg-gradient-to-b from-[#1f1215] to-[#0a0a0c] p-5 hover:border-rose-500 transition-all duration-300 shadow-2xl flex flex-col justify-between overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-rose-600/20 rounded-full blur-3xl pointer-events-none group-hover:bg-rose-600/35 transition" />

          <div className="space-y-3.5 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold tracking-widest text-rose-400 uppercase bg-rose-500/10 px-2.5 py-1 rounded border border-rose-500/25">
                NEW • COMBAT / 004
              </span>
              <span className="text-xs text-rose-400 flex items-center gap-1 font-semibold">
                <Swords size={13} /> 3D Arena
              </span>
            </div>

            <div className="flex items-start gap-3 pt-1">
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 group-hover:scale-110 transition">
                <Swords size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-rose-400 transition leading-snug">
                  Robo Rumble
                </h3>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  3D combat battle cars (Striker, Titan, Viper) with live physics arena, AI opponents, and RC build guide.
                </p>
              </div>
            </div>

            {/* Feature Pills */}
            <div className="grid grid-cols-3 gap-1 pt-1 text-center">
              <div className="bg-white/5 rounded-xl p-1.5 border border-white/5">
                <span className="text-[9px] uppercase font-mono text-gray-400 block">Arena</span>
                <span className="text-xs font-bold text-white">Live AI</span>
              </div>
              <div className="bg-white/5 rounded-xl p-1.5 border border-white/5">
                <span className="text-[9px] uppercase font-mono text-gray-400 block">Cars</span>
                <span className="text-xs font-bold text-white">3 Types</span>
              </div>
              <div className="bg-white/5 rounded-xl p-1.5 border border-white/5">
                <span className="text-[9px] uppercase font-mono text-gray-400 block">Physics</span>
                <span className="text-xs font-bold text-white">Impulse</span>
              </div>
            </div>
          </div>

          {/* Launch Buttons */}
          <div className="flex items-center gap-2 pt-5 relative z-10">
            <button
              onClick={() => onSelectAndLaunch("robo-rumble", "explore")}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white font-bold text-xs shadow-xl shadow-rose-600/30 transition hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Battle Arena</span>
              <ArrowRight size={14} />
            </button>
            <button
              onClick={() => onSelectAndLaunch("robo-rumble", "builder")}
              title="Customize Battle Car"
              className="px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white transition"
            >
              <Palette size={14} />
            </button>
          </div>
        </div>
        {/* ================= MODEL 1: WALKING ROBOT (FEATURED) ================= */}
        <div className="group relative rounded-2xl border border-orange-500/40 bg-gradient-to-b from-[#1c1917] to-[#0a0a0c] p-6 hover:border-orange-500 transition-all duration-300 shadow-2xl flex flex-col justify-between overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-orange-600/20 rounded-full blur-3xl pointer-events-none group-hover:bg-orange-600/35 transition" />

          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold tracking-widest text-orange-400 uppercase bg-orange-500/10 px-2.5 py-1 rounded border border-orange-500/25">
                NEW • WORKSHOP / 003
              </span>
              <span className="text-xs text-orange-400 flex items-center gap-1 font-semibold">
                <Wrench size={13} /> Real-Life Build
              </span>
            </div>

            <div className="flex items-start gap-3 pt-1">
              <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 group-hover:scale-110 transition">
                <Bot size={26} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition">
                  Strider-X1 Walking Robot
                </h3>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  Wheel-less mechanical walker powered by a BO gear motor and four-bar leg linkages. Includes step-by-step build guide and free scrap sourcing.
                </p>
              </div>
            </div>

            {/* Feature Pills */}
            <div className="grid grid-cols-3 gap-1.5 pt-1 text-center">
              <div className="bg-white/5 rounded-xl p-2 border border-white/5">
                <span className="text-[9px] uppercase font-mono text-gray-400 block">Linkage</span>
                <span className="text-xs font-bold text-white">4-Bar Rocker</span>
              </div>
              <div className="bg-white/5 rounded-xl p-2 border border-white/5">
                <span className="text-[9px] uppercase font-mono text-gray-400 block">Build Guide</span>
                <span className="text-xs font-bold text-white">10 Stages</span>
              </div>
              <div className="bg-white/5 rounded-xl p-2 border border-white/5">
                <span className="text-[9px] uppercase font-mono text-gray-400 block">Budget BOM</span>
                <span className="text-xs font-bold text-white">&lt; ₹200 Total</span>
              </div>
            </div>
          </div>

          {/* Launch Buttons */}
          <div className="flex items-center gap-2 pt-6 relative z-10">
            <button
              onClick={() => onSelectAndLaunch("walking-robot", "explore")}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs shadow-xl shadow-orange-600/30 transition hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Launch Robot</span>
              <ArrowRight size={14} />
            </button>
            <button
              onClick={() => onSelectAndLaunch("walking-robot", "builder")}
              title="Configure Robot Hardware"
              className="px-3.5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white transition"
            >
              <Palette size={15} />
            </button>
          </div>
        </div>

        {/* ================= MODEL 2: SPORTS CAR ================= */}
        <div className="group relative rounded-2xl border border-white/10 bg-gradient-to-b from-[#141722] to-[#0a0c12] p-6 hover:border-red-500/60 transition-all duration-300 shadow-2xl flex flex-col justify-between overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-red-600/15 rounded-full blur-3xl pointer-events-none group-hover:bg-red-600/30 transition" />

          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold tracking-widest text-red-400 uppercase bg-red-500/10 px-2.5 py-1 rounded border border-red-500/20">
                AUTOMOTIVE / 001
              </span>
              <span className="text-xs text-green-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 size={13} /> Interactive GLB
              </span>
            </div>

            <div className="flex items-start gap-3 pt-1">
              <div className="p-3 rounded-xl bg-red-600/10 border border-red-500/20 text-red-400 group-hover:scale-110 transition">
                <CarFront size={26} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition">
                  Apex GT-V6 Supercar
                </h3>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  High-performance sports car with V6 internal engine teardown (pistons, valves, camshafts), custom paint studio, and carbon GT wings.
                </p>
              </div>
            </div>

            {/* Feature Pills */}
            <div className="grid grid-cols-3 gap-1.5 pt-1 text-center">
              <div className="bg-white/5 rounded-xl p-2 border border-white/5">
                <span className="text-[9px] uppercase font-mono text-gray-400 block">Powertrain</span>
                <span className="text-xs font-bold text-white">V6 Twin-Turbo</span>
              </div>
              <div className="bg-white/5 rounded-xl p-2 border border-white/5">
                <span className="text-[9px] uppercase font-mono text-gray-400 block">Exploded</span>
                <span className="text-xs font-bold text-white">Multi-Axis</span>
              </div>
              <div className="bg-white/5 rounded-xl p-2 border border-white/5">
                <span className="text-[9px] uppercase font-mono text-gray-400 block">Studio</span>
                <span className="text-xs font-bold text-white">Custom Aero</span>
              </div>
            </div>
          </div>

          {/* Launch Buttons */}
          <div className="flex items-center gap-2 pt-6 relative z-10">
            <button
              onClick={() => onSelectAndLaunch("sports-car", "explore")}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold text-xs shadow-xl shadow-red-600/30 transition hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Launch Car</span>
              <ArrowRight size={14} />
            </button>
            <button
              onClick={() => onSelectAndLaunch("sports-car", "builder")}
              title="Customize Body and Finish"
              className="px-3.5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white transition"
            >
              <Palette size={15} />
            </button>
          </div>
        </div>

        {/* ================= MODEL 3: ELECTRIC TABLE FAN ================= */}
        <div className="group relative rounded-2xl border border-white/10 bg-gradient-to-b from-[#141722] to-[#0a0c12] p-6 hover:border-sky-500/60 transition-all duration-300 shadow-2xl flex flex-col justify-between overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-sky-600/15 rounded-full blur-3xl pointer-events-none group-hover:bg-sky-600/30 transition" />

          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold tracking-widest text-sky-400 uppercase bg-sky-500/10 px-2.5 py-1 rounded border border-sky-500/20">
                ELECTROMECHANICAL / 002
              </span>
              <span className="text-xs text-sky-400 flex items-center gap-1 font-semibold">
                <Fan size={13} className="animate-spin" /> Live Physics
              </span>
            </div>

            <div className="flex items-start gap-3 pt-1">
              <div className="p-3 rounded-xl bg-sky-600/10 border border-sky-500/20 text-sky-400 group-hover:scale-110 transition">
                <Fan size={26} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-sky-400 transition">
                  AeroFlow Table Fan
                </h3>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  Interactive induction motor with 3 speed settings (850 to 1450 RPM), active aerodynamic blade rotation, 85° oscillation sweep, and 10-part exploded view.
                </p>
              </div>
            </div>

            {/* Feature Pills */}
            <div className="grid grid-cols-3 gap-1.5 pt-1 text-center">
              <div className="bg-white/5 rounded-xl p-2 border border-white/5">
                <span className="text-[9px] uppercase font-mono text-gray-400 block">Speeds</span>
                <span className="text-xs font-bold text-white">0, 1, 2, 3</span>
              </div>
              <div className="bg-white/5 rounded-xl p-2 border border-white/5">
                <span className="text-[9px] uppercase font-mono text-gray-400 block">Oscillation</span>
                <span className="text-xs font-bold text-white">85° Sweep</span>
              </div>
              <div className="bg-white/5 rounded-xl p-2 border border-white/5">
                <span className="text-[9px] uppercase font-mono text-gray-400 block">Parts</span>
                <span className="text-xs font-bold text-white">10 Parts</span>
              </div>
            </div>
          </div>

          {/* Launch Buttons */}
          <div className="flex items-center gap-2 pt-6 relative z-10">
            <button
              onClick={() => onSelectAndLaunch("electric-fan", "explore")}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-xs shadow-xl shadow-sky-600/30 transition hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Launch Fan</span>
              <ArrowRight size={14} />
            </button>
            <button
              onClick={() => onSelectAndLaunch("electric-fan", "builder")}
              title="Customize Fan Tint and Base"
              className="px-3.5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white transition"
            >
              <Palette size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Feature Highlights Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-white/5">
        <div className="flex items-center gap-2 text-gray-300">
          <Eye size={15} className="text-red-400 shrink-0" />
          <span className="text-xs font-medium">360° Free Orbit &amp; Zoom</span>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <Layers size={15} className="text-orange-400 shrink-0" />
          <span className="text-xs font-medium">Exploded View Slider</span>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <Cpu size={15} className="text-sky-400 shrink-0" />
          <span className="text-xs font-medium">Internal Teardowns</span>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <Wrench size={15} className="text-green-400 shrink-0" />
          <span className="text-xs font-medium">Real-Life Workshop Guides</span>
        </div>
      </div>
    </div>
  );
}
