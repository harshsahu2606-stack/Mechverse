"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ArrowRight, ChevronLeft, ChevronRight, CheckCircle2, ShieldCheck, Cpu } from "lucide-react";
import { MachineId, CustomizationSettings } from "@/types/machine";
import { TOKENS } from "@/constants/designTokens";
import Esp32DroneModel from "@/components/3d/Esp32DroneModel";
import RoboRumbleVehicleModel from "@/components/3d/RoboRumbleVehicleModel";
import AeroDroneModel from "@/components/3d/AeroDroneModel";
import DroneBModel from "@/components/3d/DroneBModel";
import RoboRacerModel from "@/components/3d/RoboRacerModel";

interface MachineShowcaseProps {
  onLaunchStudio: (machineId: MachineId) => void;
}

interface ShowcaseItem {
  id: MachineId;
  name: string;
  category: string;
  headline: string;
  description: string;
  price: string;
  priceStatus: "verified" | "estimated";
  supplierInfo: string;
  specs: { label: string; value: string }[];
}

const SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    id: "esp32-drone",
    name: "AERO-ESP Phone Drone",
    category: "Nano Quadcopter (<250g)",
    headline: "Zero RC Transmitter. 100% Smartphone Wi-Fi Controlled.",
    description:
      "Engineered for students to build an authentic flying quadcopter in India for under ₹2,000 INR. Features direct UDP phone hotspot communication and 400Hz IMU attitude stabilization.",
    price: "₹1,955",
    priceStatus: "verified",
    supplierInfo: "Robu.in & ElectronicsComp (Checked Oct 2026)",
    specs: [
      { label: "Flight Controller", value: "ESP32-WROOM-32D" },
      { label: "Sensors", value: "MPU-6050 6-DOF IMU" },
      { label: "Motors", value: "4× 8520 Coreless Brushed" },
      { label: "All-Up Weight", value: "38 grams AUW" },
    ],
  },
  {
    id: "robo-racer",
    name: "ROBO-RACER AI Vision & Sonar Bot",
    category: "Autonomous AI Rover (SolidWorks CAD)",
    headline: "Hikvision Optical Vision & Sub-Centimeter Sonar Reflex.",
    description:
      "Autonomous 4WD racing bot modeled from precision SolidWorks CAD assemblies. Integrates a top-mounted Hikvision DS-U02 1080p camera on an SG90 pan neck, front HC-SR04 ultrasonic rangefinder, and high-traction chevron tires.",
    price: "₹2,888",
    priceStatus: "verified",
    supplierInfo: "Robu.in & ElectronicsComp (Checked Oct 2026)",
    specs: [
      { label: "Vision Camera", value: "Hikvision DS-U02 1080p" },
      { label: "Obstacle Sonar", value: "HC-SR04 (2-400cm)" },
      { label: "Drivetrain", value: "4WD Geared Bo-Motors" },
      { label: "Chassis Feature", value: "Gullwing Dhakna Hood" },
    ],
  },
  {
    id: "robo-rumble",
    name: "Robo Rumble Battle Car",
    category: "Combat Robotics (1.5kg Beetleweight)",
    headline: "High-Torque Dual Drive with Interchangeable Kinetic Weapons.",
    description:
      "Modular combat robot architecture featuring twin N20/BO gearmotors, high-friction silicon-spike tires, and invertible ramp-wedge armor designed for competition battle arenas.",
    price: "₹2,500 – ₹13,500",
    priceStatus: "estimated",
    supplierInfo: "Calculated range from scrap/salvaged to competition kit",
    specs: [
      { label: "Drivetrain", value: "4WD Geared TT Motors" },
      { label: "Motor Driver", value: "L298N / Dual H-Bridge" },
      { label: "Chassis", value: "Laser-cut 3mm Acrylic / PETG" },
      { label: "Power Source", value: "2S 7.4V Li-ion Pack" },
    ],
  },
  {
    id: "aero-450",
    name: "AERO-450 Modular Drone",
    category: "Aerial Imaging & AI Platform",
    headline: "Autonomous Navigation with Pixhawk Autopilot & 450mm Stance.",
    description:
      "Full-scale 450mm carbon-composite quadcopter with 2212 920KV brushless motors, 30A SimonK ESCs, GPS position-hold telemetry, and vibration-damped camera mounts.",
    price: "₹12,000 – ₹13,000",
    priceStatus: "verified",
    supplierInfo: "Robu.in Quad Kit BOM (Checked Oct 2026)",
    specs: [
      { label: "Airframe", value: "FlameWheel 450mm Glass/PA66" },
      { label: "Brushless Motors", value: "4× 2212 920KV Outrunner" },
      { label: "Speed Controllers", value: "4× 30A SimonK ESCs" },
      { label: "Max Flight Time", value: "14 – 18 Minutes" },
    ],
  },
  {
    id: "drone-b",
    name: "Drone B Industrial Octocopter",
    category: "Heavy-Payload Multi-Rotor",
    headline: "8-Motor Coaxial Redundancy for Commercial Payloads.",
    description:
      "Industrial-grade octocopter designed with carbon lattice arms, fail-safe motor redundancy (can lose up to 2 motors and land safely), and dual 6S battery bus distribution.",
    price: "₹11,955 – ₹35,000",
    priceStatus: "estimated",
    supplierInfo: "Estimated industrial frame & powertrain components",
    specs: [
      { label: "Configuration", value: "Coaxial / Radial Octocopter" },
      { label: "Payload Capacity", value: "Up to 3.5 kg" },
      { label: "Telemetry", value: "915MHz Ground Station Link" },
      { label: "Structure", value: "Carbon Fiber Lattice Tube" },
    ],
  },
];

function ShowcaseScene({ activeId, transitionProgress }: { activeId: MachineId; transitionProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.DirectionalLight>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
    if (lightRef.current) {
      // Dims out during switch, ramps back up
      lightRef.current.intensity = THREE.MathUtils.lerp(0.2, 1.4, transitionProgress);
    }
  });

  return (
    <>
      <ambientLight intensity={0.25 + transitionProgress * 0.35} />
      <directionalLight ref={lightRef} position={[4, 6, 3]} intensity={1.4} />
      <spotLight
        position={[-3, 2, -3]}
        color={TOKENS.colors.accent}
        intensity={2.2 * transitionProgress}
        angle={0.6}
        penumbra={0.8}
      />

      <group ref={groupRef} position={[0, -0.05, 0]}>
        {activeId === "esp32-drone" && (
          <Esp32DroneModel
            customization={{}}
            explosionLevel={0}
            selectedComponent={null}
            isolatedComponent={null}
            hiddenComponents={[]}
            onSelect={() => {}}
            isArmed={true}
            throttlePct={30}
          />
        )}

        {activeId === "robo-racer" && (
          <RoboRacerModel
            customization={{}}
            explosionLevel={0}
            selectedComponent={null}
            isolatedComponent={null}
            hiddenComponents={[]}
            onSelect={() => {}}
            isDriving={true}
            driveSpeed={30}
            steeringAngle={0}
            cameraPanAngle={0}
            hoodOpen={false}
          />
        )}

        {activeId === "robo-rumble" && (
          <RoboRumbleVehicleModel
            customization={
              {
                paintColor: "#dc2626",
                finish: "metallic",
                wheelStyle: "sport",
                rimColor: "#e2e8f0",
                bodyParts: { spoiler: true, sideSkirts: true, frontSplitter: true, rearDiffuser: true },
              } as unknown as CustomizationSettings
            }
            explosionLevel={0}
            selectedComponent={null}
            isolatedComponent={null}
            hiddenComponents={[]}
            onSelect={() => {}}
            wheelRotationSpeed={1.5}
            position={[0, -0.05, 0]}
            scale={0.9}
          />
        )}

        {activeId === "aero-450" && (
          <AeroDroneModel
            customization={
              {
                paintColor: "#dc2626",
                finish: "metallic",
                wheelStyle: "sport",
                rimColor: "#e2e8f0",
                bodyParts: { spoiler: true, sideSkirts: true, frontSplitter: true, rearDiffuser: true },
                droneFrameSize: 450,
                droneArmColorFront: "#f8fafc",
                droneArmColorRear: "#dc2626",
                droneMotorModel: "2212-920kv",
                dronePropeller: "1045-nylon",
                droneEsc: "simonk-30a",
                droneBattery: "3s-4200mah-35c",
                droneFlightController: "pixhawk-2.4.8",
                droneGps: "neo-m8n",
                droneCamera: "runcam-split-hd",
                droneLandingGear: "tall-arched",
                dronePropGuards: false,
              } as unknown as CustomizationSettings
            }
            explosionLevel={0}
            selectedComponent={null}
            isolatedComponent={null}
            hiddenComponents={[]}
            onSelect={() => {}}
            isArmed={true}
            throttlePct={20}
          />
        )}

        {activeId === "drone-b" && (
          <DroneBModel
            explosionLevel={0}
            selectedComponent={null}
            isolatedComponent={null}
            hiddenComponents={[]}
            onSelect={() => {}}
            isArmed={true}
          />
        )}
      </group>

      <gridHelper args={[7, 28, TOKENS.colors.accent, "#15181f"]} position={[0, -0.22, 0]} />
    </>
  );
}

export default function MachineShowcase({ onLaunchStudio }: MachineShowcaseProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [transitionProgress, setTransitionProgress] = useState<number>(1);
  const isTransitioningRef = useRef<boolean>(false);

  const activeMachine = SHOWCASE_ITEMS[currentIndex];

  const handleSwitchMachine = (nextIndex: number) => {
    if (isTransitioningRef.current || nextIndex === currentIndex) return;
    isTransitioningRef.current = true;

    // Fade down
    setTransitionProgress(0.1);

    setTimeout(() => {
      setCurrentIndex(nextIndex);
      // Ramp back up
      setTimeout(() => {
        setTransitionProgress(1);
        isTransitioningRef.current = false;
      }, 50);
    }, 350);
  };

  const handlePrev = () => {
    const next = (currentIndex - 1 + SHOWCASE_ITEMS.length) % SHOWCASE_ITEMS.length;
    handleSwitchMachine(next);
  };

  const handleNext = () => {
    const next = (currentIndex + 1) % SHOWCASE_ITEMS.length;
    handleSwitchMachine(next);
  };

  return (
    <section
      id="showcase"
      className="relative w-full py-14 sm:py-20 px-4 sm:px-6 md:px-12 border-t border-white/5 overflow-hidden"
      style={{ backgroundColor: TOKENS.colors.background }}
    >
      <div className="max-w-7xl mx-auto flex flex-col space-y-8 sm:space-y-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-2 sm:space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-[#0F1114]">
              <Cpu size={12} style={{ color: TOKENS.colors.accent }} />
              <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-[#9AA0A9] uppercase">
                Machine Showcase
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-light text-[#F4F5F7] tracking-tight">
              Hardware Engineering{" "}
              <span className="font-semibold" style={{ color: TOKENS.colors.accent }}>
                Showcase
              </span>
              .
            </h2>
            <p className="text-xs sm:text-sm text-[#9AA0A9] max-w-xl leading-relaxed">
              Inspect each physical machine in continuous dark-room studio lighting. Every model is backed
              by a real Bill of Materials and manufacturing guide.
            </p>
          </div>

          {/* Stepper Controls */}
          <div className="flex items-center gap-3">
            <div className="text-xs font-mono text-[#9AA0A9] mr-2">
              <span className="text-white font-semibold">0{currentIndex + 1}</span> / 0{SHOWCASE_ITEMS.length}
            </div>
            <button
              onClick={handlePrev}
              className="p-2 sm:p-2.5 rounded-xl border border-white/10 bg-[#0F1114] text-[#F4F5F7] hover:border-white/30 hover:bg-[#161A1F] transition-all cursor-pointer"
              aria-label="Previous Machine"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleNext}
              className="p-2 sm:p-2.5 rounded-xl border border-white/10 bg-[#0F1114] text-[#F4F5F7] hover:border-white/30 hover:bg-[#161A1F] transition-all cursor-pointer"
              aria-label="Next Machine"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Main Showcase Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Left Column: 3D Stage */}
          <div className="lg:col-span-7 h-[300px] sm:h-[480px] rounded-2xl border border-white/5 bg-[#0F1114]/70 overflow-hidden relative">
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 pointer-events-none">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: TOKENS.colors.accent }}
              />
              <span className="text-[10px] font-mono tracking-widest text-[#9AA0A9] uppercase truncate max-w-[200px] sm:max-w-none">
                {activeMachine.name} · Studio Turntable
              </span>
            </div>

            <Canvas camera={{ position: [0.38, 0.28, 0.42], fov: 38 }} className="w-full h-full">
              <Suspense fallback={null}>
                <ShowcaseScene activeId={activeMachine.id} transitionProgress={transitionProgress} />
              </Suspense>
            </Canvas>
          </div>

          {/* Right Column: Specifications & Verified Sourcing */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-5 sm:space-y-6">
            <div className="space-y-1.5 sm:space-y-2">
              <div className="text-[11px] sm:text-xs font-mono text-[#9AA0A9] uppercase tracking-wider">
                {activeMachine.category}
              </div>
              <h3 className="text-xl sm:text-3xl font-light text-[#F4F5F7] tracking-tight">
                {activeMachine.name}
              </h3>
              <p className="text-xs sm:text-sm font-normal text-[#9AA0A9] leading-relaxed">
                {activeMachine.description}
              </p>
            </div>

            {/* Price Badge with Verified / Estimated Status */}
            <div className="p-3.5 sm:p-4 rounded-xl border border-white/5 bg-[#0F1114] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div>
                <div className="text-[9px] sm:text-[10px] font-mono text-[#5C626B] uppercase">Estimated Build Cost</div>
                <div className="text-lg sm:text-xl font-mono font-semibold text-white mt-0.5">
                  {activeMachine.price}
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-mono uppercase tracking-wider font-medium"
                  style={{
                    backgroundColor:
                      activeMachine.priceStatus === "verified"
                        ? TOKENS.colors.status.verifiedGlow
                        : TOKENS.colors.status.estimatedGlow,
                    color:
                      activeMachine.priceStatus === "verified"
                        ? TOKENS.colors.status.verified
                        : TOKENS.colors.status.estimated,
                    border: `1px solid ${
                      activeMachine.priceStatus === "verified"
                        ? TOKENS.colors.status.verified
                        : TOKENS.colors.status.estimated
                    }`,
                  }}
                >
                  <ShieldCheck size={12} />
                  <span>{activeMachine.priceStatus === "verified" ? "Verified Supplier" : "Estimated Sourcing"}</span>
                </span>
                <div className="text-[9px] font-mono text-[#5C626B] mt-1">
                  {activeMachine.supplierInfo}
                </div>
              </div>
            </div>

            {/* Verified Technical Specs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {activeMachine.specs.map((spec, i) => (
                <div key={i} className="p-2.5 sm:p-3 rounded-lg border border-white/5 bg-[#0F1114]/50">
                  <div className="text-[9px] sm:text-[10px] font-mono text-[#5C626B] uppercase">{spec.label}</div>
                  <div className="text-xs font-mono font-medium text-[#F4F5F7] mt-0.5">{spec.value}</div>
                </div>
              ))}
            </div>

            {/* Direct Studio Launch CTA */}
            <button
              onClick={() => onLaunchStudio(activeMachine.id)}
              className="w-full py-3 sm:py-3.5 rounded-xl text-xs font-semibold tracking-wider text-white flex items-center justify-center gap-2 transition-all transform active:scale-98 cursor-pointer uppercase font-mono"
              style={{
                backgroundColor: TOKENS.colors.accent,
                boxShadow: `0 0 20px ${TOKENS.colors.accentGlow}`,
              }}
            >
              <span>Launch in 3D Studio</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
