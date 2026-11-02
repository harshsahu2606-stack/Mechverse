"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowRight, Cpu, Radio, Zap, Scale, CheckCircle2 } from "lucide-react";
import { MachineId } from "@/types/machine";
import { TOKENS } from "@/constants/designTokens";

interface MachineShowcaseProps {
  onLaunchStudio: (machineId: MachineId) => void;
}

interface ShowcaseItem {
  id: MachineId;
  name: string;
  category: string;
  image: string;
  description: string;
  price: string;
  priceStatus: "verified" | "estimated";
  supplierInfo: string;
  specs: {
    flightController: string;
    sensors: string;
    motors: string;
    weight: string;
  };
}

const SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    id: "esp32-drone",
    name: "AERO-ESP Phone Drone",
    category: "NANO QUADCOPTER (ESP32)",
    image: "/images/landing/showcase-esp32.jpg",
    description:
      "A beginner-friendly ESP32 quadcopter you can build and control using your smartphone. Perfect for learning flight control, sensors and real-time telemetry.",
    price: "₹1,955",
    priceStatus: "verified",
    supplierInfo: "Based on 4 Indian suppliers • Updated: Oct 2026",
    specs: {
      flightController: "ESP32-WROOM-32",
      sensors: "MPU-6050 (6-DOF IMU)",
      motors: "4× 8520 Coreless (8.5×20mm)",
      weight: "~ 68 grams",
    },
  },
  {
    id: "aero-450",
    name: "AERO-450 Modular Drone",
    category: "MODULAR DRONE (PIXHAWK)",
    image: "/images/landing/reveal-aero450.jpg",
    description:
      "Full-scale 450mm carbon quadcopter with Pixhawk autopilot, 2212 920KV BLDC motors, and GPS position-hold telemetry.",
    price: "₹12,000 – ₹13,000",
    priceStatus: "verified",
    supplierInfo: "Robu.in F450 Quad Kit BOM • Updated: Oct 2026",
    specs: {
      flightController: "Pixhawk 2.4.8 / APM 2.8",
      sensors: "NEO-M8N GPS + Compass",
      motors: "4× 2212 920KV BLDC",
      weight: "~ 850 grams",
    },
  },
  {
    id: "robo-racer",
    name: "ROBO-RACER AI Vision Bot",
    category: "AUTONOMOUS AI ROVER",
    image: "/images/models/robo-racer.jpg",
    description:
      "Autonomous 4WD obstacle-racing rover with Hikvision 1080p camera on SG90 pan neck, HC-SR04 ultrasonic reflex, and high-traction tires.",
    price: "₹2,888",
    priceStatus: "verified",
    supplierInfo: "SolidWorks CAD BOM (Robu & ElectronicsComp)",
    specs: {
      flightController: "ESP32 Dual-Core DevKit",
      sensors: "HC-SR04 (2cm-400cm Sonar)",
      motors: "4× 300 RPM Bo-Motors",
      weight: "~ 520 grams",
    },
  },
  {
    id: "robo-rumble",
    name: "Robo Rumble Battle Car",
    category: "COMBAT BOT (1.5KG)",
    image: "/images/models/robo-rumble.jpg",
    description:
      "High-torque 4WD combat robot with interchangeable kinetic armor, dual H-bridge driver, and battle telemetry.",
    price: "₹2,500 – ₹13,500",
    priceStatus: "estimated",
    supplierInfo: "Recycled scrap sourcing to full competition kit",
    specs: {
      flightController: "L298N Dual H-Bridge + ESP32",
      sensors: "Current Shunt & Hall Sensors",
      motors: "4× High-Torque TT Geared",
      weight: "~ 485 grams",
    },
  },
  {
    id: "drone-b",
    name: "Drone B Industrial Octocopter",
    category: "OCTOCOPTER (HEAVY LIFT)",
    image: "/images/models/drone-b.jpg",
    description:
      "8-motor heavy payload industrial multi-rotor with dual battery redundancy and fail-safe recovery.",
    price: "₹11,955 – ₹35,000",
    priceStatus: "estimated",
    supplierInfo: "Commercial frame & coaxial powertrain estimate",
    specs: {
      flightController: "Cube Orange+ Triple IMU",
      sensors: "Dual RTK GPS & Telemetry",
      motors: "8× Coaxial BLDC Outrunners",
      weight: "~ 3.5 kg",
    },
  },
  {
    id: "sports-car",
    name: "Apex GT-V6 Supercar",
    category: "AUTOMOTIVE CAD (MID-ENGINE)",
    image: "/images/models/sports-car.jpg",
    description:
      "Mid-engine track supercar featuring 3.0L twin-turbocharged V6 internal combustion engine sub-assembly with full CAD explosion.",
    price: "₹8,500 – ₹14,000",
    priceStatus: "estimated",
    supplierInfo: "RC track telemetry & complete CAD disassembly model",
    specs: {
      flightController: "Telemetry ECU & Dyno Module",
      sensors: "Crank Position & Knock Sensors",
      motors: "Twin-Turbo 3.0L V6 Powertrain",
      weight: "~ 1,320 kg (Scaled)",
    },
  },
  {
    id: "walking-robot",
    name: "Strandbeest Kinetic Walker",
    category: "LINKAGE ROBOTICS (8-BAR)",
    image: "/images/models/walking-robot.jpg",
    description:
      "Chebyshev and Theo Jansen eight-bar mechanical linkage converting continuous motor rotation into smooth biological walking gait.",
    price: "₹250 – ₹1,200",
    priceStatus: "verified",
    supplierInfo: "Direct BO motor & laser-cut craft materials",
    specs: {
      flightController: "Low-Power DC Motor Controller",
      sensors: "Rotary Encoder Linkage Tachometer",
      motors: "Dual-Shaft 60 RPM Geared BO Motor",
      weight: "~ 210 grams",
    },
  },
];

export default function MachineShowcase({ onLaunchStudio }: MachineShowcaseProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const activeItem = SHOWCASE_ITEMS[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % SHOWCASE_ITEMS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + SHOWCASE_ITEMS.length) % SHOWCASE_ITEMS.length);
  };

  const currentNumStr = String(currentIndex + 1).padStart(2, "0");
  const totalNumStr = String(SHOWCASE_ITEMS.length).padStart(2, "0");

  return (
    <section
      id="showcase"
      className="relative w-full py-16 sm:py-24 px-4 sm:px-6 md:px-12 border-t border-white/5 overflow-hidden"
      style={{ backgroundColor: "#060709" }}
    >
      <div className="max-w-7xl mx-auto flex flex-col space-y-8 sm:space-y-10">
        {/* Section Header with Badge & Pagination */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/25 bg-[#0F1114]">
              <span className="w-2 h-2 rounded-full bg-[#FF6A1A]" />
              <span className="text-[11px] font-mono tracking-widest text-[#9AA0A9] uppercase font-semibold">
                MACHINE SHOWCASE
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-light text-[#F4F5F7] tracking-tight">
              Hardware Engineering{" "}
              <span className="font-semibold text-[#FF6A1A]">Showcase</span>.
            </h2>
            <p className="text-xs sm:text-sm text-[#9AA0A9] max-w-xl leading-relaxed">
              Inspect real, physical machines with component details, live 3D models, real BOMs and step-by-step build guides.
            </p>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-mono text-neutral-400 font-semibold tracking-wider">
              {currentNumStr} / {totalNumStr}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrev}
                className="w-8 h-8 rounded-full border border-white/10 bg-[#0F1114] hover:bg-[#161A1F] hover:border-white/30 flex items-center justify-center text-neutral-300 transition-all cursor-pointer"
                aria-label="Previous Machine"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={handleNext}
                className="w-8 h-8 rounded-full border border-white/10 bg-[#0F1114] hover:bg-[#161A1F] hover:border-white/30 flex items-center justify-center text-neutral-300 transition-all cursor-pointer"
                aria-label="Next Machine"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Two-Column Studio Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Left Column: Studio Turntable Render */}
          <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-[#08090C] overflow-hidden relative min-h-[380px] sm:min-h-[460px] flex flex-col shadow-2xl">
            {/* Top Left Badge */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-[#0B0D12]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              <span className="text-[10px] sm:text-xs font-mono text-[#E2E8F0] tracking-wider uppercase font-semibold">
                {activeItem.name} • STUDIO TURNTABLE
              </span>
            </div>

            {/* Turntable Image */}
            <div className="relative w-full h-full min-h-[380px] sm:min-h-[460px]">
              <Image
                src={activeItem.image}
                alt={activeItem.name}
                fill
                priority
                className="object-cover object-center transition-all duration-500 select-none"
              />
            </div>
          </div>

          {/* Right Column: Hardware Specs, BOM & Launch CTA */}
          <div className="lg:col-span-5 rounded-2xl border border-white/10 bg-[#0A0D12] p-6 sm:p-8 flex flex-col justify-between shadow-xl space-y-6">
            <div className="space-y-4">
              <div className="text-[11px] font-mono tracking-widest text-[#FF6A1A] font-semibold uppercase">
                {activeItem.category}
              </div>

              <h3 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                {activeItem.name}
              </h3>

              <p className="text-xs sm:text-sm text-[#9AA0A9] leading-relaxed">
                {activeItem.description}
              </p>

              {/* Price / BOM Card */}
              <div className="p-4 rounded-xl border border-white/10 bg-[#07080B] flex items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] font-mono text-[#7B828F] tracking-wider uppercase">
                    ESTIMATED BUILD COST
                  </div>
                  <div className="text-2xl font-mono font-bold text-white mt-0.5">
                    {activeItem.price}
                  </div>
                </div>

                <div className="text-right">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 font-semibold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    VERIFIED SUPPLIERS
                  </div>
                  <div className="text-[9px] text-[#7B828F] mt-1 font-mono max-w-[180px]">
                    {activeItem.supplierInfo}
                  </div>
                </div>
              </div>

              {/* 2x2 Specs Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl border border-white/5 bg-[#0D1016]">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#7B828F] uppercase">
                    <Cpu size={12} className="text-[#FF6A1A]" />
                    <span>Flight Controller</span>
                  </div>
                  <div className="text-xs font-mono font-semibold text-[#E2E8F0] mt-1 truncate">
                    {activeItem.specs.flightController}
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-white/5 bg-[#0D1016]">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#7B828F] uppercase">
                    <Radio size={12} className="text-[#FF6A1A]" />
                    <span>Sensors</span>
                  </div>
                  <div className="text-xs font-mono font-semibold text-[#E2E8F0] mt-1 truncate">
                    {activeItem.specs.sensors}
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-white/5 bg-[#0D1016]">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#7B828F] uppercase">
                    <Zap size={12} className="text-[#FF6A1A]" />
                    <span>Motors</span>
                  </div>
                  <div className="text-xs font-mono font-semibold text-[#E2E8F0] mt-1 truncate">
                    {activeItem.specs.motors}
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-white/5 bg-[#0D1016]">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#7B828F] uppercase">
                    <Scale size={12} className="text-[#FF6A1A]" />
                    <span>Weight (AUW)</span>
                  </div>
                  <div className="text-xs font-mono font-semibold text-[#E2E8F0] mt-1 truncate">
                    {activeItem.specs.weight}
                  </div>
                </div>
              </div>
            </div>

            {/* Solid Orange CTA */}
            <button
              onClick={() => onLaunchStudio(activeItem.id)}
              className="w-full py-3.5 px-6 rounded-xl bg-[#FF6A1A] hover:bg-[#ff7b33] text-white font-mono font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_6px_25px_rgba(255,106,26,0.35)] cursor-pointer"
            >
              <span>LAUNCH IN 3D STUDIO</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
