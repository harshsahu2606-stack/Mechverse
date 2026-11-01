"use client";

import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ArrowRight, ChevronDown } from "lucide-react";
import { CustomizationSettings, MachineId, RobotSimulationState } from "@/types/machine";
import { TOKENS } from "@/constants/designTokens";
import AeroDroneModel from "@/components/3d/AeroDroneModel";
import RoboRumbleVehicleModel from "@/components/3d/RoboRumbleVehicleModel";
import WalkingRobotModel from "@/components/3d/WalkingRobotModel";

interface HeroSceneProps {
  onLaunchStudio: (machineId?: MachineId) => void;
}

const DEFAULT_DRONE_SETTINGS = {
  paintColor: "#dc2626",
  finish: "metallic",
  wheelStyle: "sport",
  rimColor: "#e2e8f0",
  bodyParts: { spoiler: true, sideSkirts: true, frontSplitter: true, rearDiffuser: true },
  droneFrameSize: 450,
  droneArmColorFront: "#1e2430",
  droneArmColorRear: "#FF6A1A", // Orange rear arms matching screenshot
  droneMotorModel: "2212-920kv",
  dronePropeller: "1045-nylon",
  droneEsc: "simonk-30a",
  droneBattery: "3s-4200mah-35c",
  droneFlightController: "pixhawk-2.4.8",
  droneGps: "neo-m8n",
  droneCamera: "runcam-split-hd",
  droneLandingGear: "tall-arched",
  dronePropGuards: false,
} as unknown as CustomizationSettings;

const DEFAULT_ROBO_SETTINGS = {
  paintColor: "#dc2626",
  finish: "metallic",
  wheelStyle: "sport",
  rimColor: "#e2e8f0",
  bodyParts: { spoiler: true, sideSkirts: true, frontSplitter: true, rearDiffuser: true },
} as unknown as CustomizationSettings;

const DEFAULT_WALKER_SETTINGS = {} as unknown as CustomizationSettings;

const ROBOT_SIMULATION: RobotSimulationState = {
  walking: true,
  speed: "slow",
  forwardMovement: false,
  showKinematicGhost: false,
};

function CinematicStage() {
  const droneGroupRef = useRef<THREE.Group>(null);
  const combatBotGroupRef = useRef<THREE.Group>(null);
  const walkerGroupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Hovering drone physics animation
    if (droneGroupRef.current) {
      droneGroupRef.current.position.y = 0.12 + Math.sin(t * 1.6) * 0.025;
      droneGroupRef.current.rotation.y = Math.sin(t * 0.4) * 0.06;
      droneGroupRef.current.rotation.x = Math.sin(t * 1.1) * 0.015;
      droneGroupRef.current.rotation.z = Math.cos(t * 0.9) * 0.015;
    }

    // Subtle breathing on combat bot
    if (combatBotGroupRef.current) {
      combatBotGroupRef.current.rotation.y = 0.35 + Math.sin(t * 0.25) * 0.02;
    }

    // Gentle motion on walker
    if (walkerGroupRef.current) {
      walkerGroupRef.current.rotation.y = -0.38 + Math.cos(t * 0.25) * 0.02;
    }
  });

  return (
    <>
      {/* Cinematic Lighting System */}
      <ambientLight intensity={0.4} />

      {/* Main Overhead Soft Key Light */}
      <directionalLight position={[0, 8, 4]} intensity={1.5} color="#ffffff" />

      {/* Left Cool Rim Light */}
      <spotLight
        position={[-6, 4, -2]}
        intensity={2.8}
        color="#a5b4fc"
        angle={0.6}
        penumbra={0.9}
      />

      {/* Right Cool Rim Light */}
      <spotLight
        position={[6, 4, -2]}
        intensity={2.8}
        color="#a5b4fc"
        angle={0.6}
        penumbra={0.9}
      />

      {/* Center Orange Pedestal Glow */}
      <pointLight position={[0, -0.22, 0]} color="#FF6A1A" intensity={3.5} distance={4} />
      <pointLight position={[0, 0.25, 0]} color="#FF6A1A" intensity={1.2} distance={2.5} />

      {/* Background Angled Glowing Studio Light Bars (Left & Right) */}
      <group position={[-4.5, 2.2, -3.5]} rotation={[0, 0.4, -0.6]}>
        <mesh>
          <cylinderGeometry args={[0.04, 0.04, 2.8, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      <group position={[4.5, 2.2, -3.5]} rotation={[0, -0.4, 0.6]}>
        <mesh>
          <cylinderGeometry args={[0.04, 0.04, 2.8, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* ================= 1. LEFT MACHINE: RR-01 COMBAT ROBOT ================= */}
      <group ref={combatBotGroupRef} position={[-2.1, -0.38, 0.4]} scale={0.95}>
        <RoboRumbleVehicleModel
          customization={DEFAULT_ROBO_SETTINGS}
          explosionLevel={0}
          selectedComponent={null}
          isolatedComponent={null}
          hiddenComponents={[]}
          onSelect={() => {}}
          wheelRotationSpeed={0.8}
          position={[0, 0, 0]}
          scale={0.9}
        />
      </group>

      {/* ================= 2. CENTER MACHINE: AERO-450 MODULAR DRONE ON PEDESTAL ================= */}
      <group position={[0, -0.48, 0]}>
        {/* Dark Cylindrical Pedestal */}
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.72, 0.78, 0.16, 64]} />
          <meshStandardMaterial color="#0c0e12" roughness={0.3} metalness={0.7} />
        </mesh>

        {/* Emissive Orange Neon Ring around top rim of pedestal */}
        <mesh position={[0, 0.162, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.72, 0.012, 16, 64]} />
          <meshStandardMaterial
            color="#FF6A1A"
            emissive="#FF6A1A"
            emissiveIntensity={3.5}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* Hovering Drone Model */}
      <group ref={droneGroupRef} position={[0, 0.05, 0]} scale={0.88}>
        <AeroDroneModel
          customization={DEFAULT_DRONE_SETTINGS}
          explosionLevel={0}
          selectedComponent={null}
          isolatedComponent={null}
          hiddenComponents={[]}
          onSelect={() => {}}
          isArmed={true}
          throttlePct={24}
        />
      </group>

      {/* ================= 3. RIGHT MACHINE: TJ-01 WALKING MECHANISM ================= */}
      <group ref={walkerGroupRef} position={[2.1, -0.38, 0.4]} scale={0.88}>
        <WalkingRobotModel
          customization={DEFAULT_WALKER_SETTINGS}
          explosionLevel={0}
          selectedComponent={null}
          isolatedComponent={null}
          hiddenComponents={[]}
          simulation={ROBOT_SIMULATION}
          onSelect={() => {}}
        />
      </group>

      {/* Highly Reflective Industrial Wet Studio Ground */}
      <mesh position={[0, -0.485, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[24, 24]} />
        <meshStandardMaterial
          color="#060709"
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </>
  );
}

export default function HeroScene({ onLaunchStudio }: HeroSceneProps) {
  return (
    <section
      id="hero"
      className="relative w-full h-[100vh] min-h-[700px] flex flex-col justify-between overflow-hidden bg-[#07080A]"
    >
      {/* Background Soft Lighting Gradients */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: `
            radial-gradient(circle at 50% 25%, rgba(255,255,255,0.03) 0%, transparent 60%),
            radial-gradient(circle at 50% 70%, rgba(255,106,26,0.06) 0%, transparent 50%),
            linear-gradient(to bottom, rgba(7,8,10,0.85) 0%, transparent 25%, transparent 75%, rgba(7,8,10,0.95) 100%)
          `,
        }}
      />

      {/* ================= TOP TYPOGRAPHY: FOR THOSE WHO BUILD BEYOND ORDINARY ================= */}
      <div className="relative z-20 w-full pt-24 md:pt-28 text-center px-4 flex flex-col items-center pointer-events-none">
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif tracking-[0.08em] text-white uppercase font-light leading-[1.08] select-none">
          FOR THOSE WHO
          <br />
          <span className="font-serif italic font-bold text-[#FF6A1A] mr-3">BUILD</span>
          BEYOND ORDINARY.
        </h1>

        <p className="mt-3 text-xs sm:text-sm md:text-base font-mono tracking-widest text-[#9AA0A9] font-light">
          Design. Simulate. Build real machines.
        </p>
      </div>

      {/* ================= 3D VIEWPORT WITH THREE MACHINES ================= */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Canvas
          camera={{ position: [0, 0.35, 3.8], fov: 36 }}
          className="w-full h-full"
          dpr={[1, 1.5]}
        >
          <Suspense fallback={null}>
            <CinematicStage />
          </Suspense>
        </Canvas>
      </div>

      {/* ================= HUD ANNOTATIONS OVERLAY (MATCHING SCREENSHOT) ================= */}
      <div className="absolute inset-0 w-full h-full z-20 pointer-events-none max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-between py-24">
        <div className="relative w-full h-full">
          {/* Annotation 1: RR-01 Combat Robot (Left) */}
          <div
            onClick={() => onLaunchStudio("robo-rumble")}
            className="absolute left-[2%] sm:left-[6%] lg:left-[8%] top-[45%] lg:top-[42%] text-left pointer-events-auto cursor-pointer group"
          >
            <div className="text-[11px] font-mono tracking-[0.18em] text-white font-semibold uppercase group-hover:text-[#FF6A1A] transition-colors">
              RR-01 / COMBAT ROBOT
            </div>
            {/* Pointer SVG Line */}
            <svg width="120" height="32" viewBox="0 0 120 32" fill="none" className="my-1 stroke-white/40 group-hover:stroke-[#FF6A1A] transition-colors">
              <path d="M0 1H85L115 31" strokeWidth="1" />
            </svg>
            <div className="text-[9px] font-mono tracking-widest text-[#9AA0A9] space-y-0.5 uppercase">
              <div>ESP32 CONTROL</div>
              <div>IMPACT READY</div>
            </div>
          </div>

          {/* Annotation 2: AERO-450 Modular Drone (Center) */}
          <div
            onClick={() => onLaunchStudio("aero-450")}
            className="absolute left-1/2 -translate-x-1/2 top-[34%] lg:top-[32%] text-center pointer-events-auto cursor-pointer group"
          >
            <div className="text-[11px] font-mono tracking-[0.2em] text-white font-semibold uppercase group-hover:text-[#FF6A1A] transition-colors">
              AERO-450 / MODULAR DRONE
            </div>
            {/* Pointer SVG Line */}
            <svg width="220" height="24" viewBox="0 0 220 24" fill="none" className="mx-auto my-1 stroke-white/40 group-hover:stroke-[#FF6A1A] transition-colors">
              <path d="M10 23L45 1H175L210 23" strokeWidth="1" />
            </svg>
            <div className="flex items-center justify-center gap-6 text-[9px] font-mono tracking-widest text-[#9AA0A9] uppercase">
              <div>400Hz SIMULATION</div>
              <div>ESP32 CONTROL</div>
            </div>
          </div>

          {/* Annotation 3: TJ-01 Walking Mechanism (Right) */}
          <div
            onClick={() => onLaunchStudio("walking-robot")}
            className="absolute right-[2%] sm:right-[6%] lg:right-[8%] top-[40%] lg:top-[38%] text-right pointer-events-auto cursor-pointer group"
          >
            <div className="text-[11px] font-mono tracking-[0.18em] text-white font-semibold uppercase group-hover:text-[#FF6A1A] transition-colors">
              TJ-01 / WALKING MECHANISM
            </div>
            {/* Pointer SVG Line */}
            <svg width="120" height="32" viewBox="0 0 120 32" fill="none" className="my-1 stroke-white/40 group-hover:stroke-[#FF6A1A] transition-colors ml-auto">
              <path d="M120 1H35L5 31" strokeWidth="1" />
            </svg>
            <div className="text-[9px] font-mono tracking-widest text-[#9AA0A9] space-y-0.5 uppercase">
              <div>LINKAGE DRIVE</div>
              <div>LOW POWER</div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM CTA BUTTONS & SCROLL INDICATOR ================= */}
      <div className="relative z-30 w-full pb-8 flex flex-col items-center gap-5 pointer-events-auto">
        <div className="flex flex-wrap items-center justify-center gap-4">
          {/* Primary Orange Pill: EXPLORE MACHINES → */}
          <a
            href="#catalog"
            className="px-8 py-3.5 rounded-full text-xs font-mono font-semibold tracking-wider text-white flex items-center gap-2 transition-all transform active:scale-95 cursor-pointer shadow-lg hover:brightness-110"
            style={{
              backgroundColor: TOKENS.colors.accent,
              boxShadow: `0 0 25px ${TOKENS.colors.accentGlow}`,
            }}
          >
            <span>EXPLORE MACHINES</span>
            <ArrowRight size={14} />
          </a>

          {/* Secondary Dark Glass Pill: ENTER 3D STUDIO */}
          <button
            onClick={() => onLaunchStudio()}
            className="px-8 py-3.5 rounded-full text-xs font-mono font-medium tracking-wider text-white bg-[#0F1114]/80 backdrop-blur-md border border-white/20 hover:border-white/50 hover:bg-[#161A1F] transition-all transform active:scale-95 cursor-pointer uppercase"
          >
            <span>ENTER 3D STUDIO</span>
          </button>
        </div>

        {/* Minimal Mouse Scroll Icon */}
        <a
          href="#showcase"
          className="flex flex-col items-center gap-1.5 text-white/50 hover:text-white transition-colors cursor-pointer pt-1"
          aria-label="Scroll to Next Section"
        >
          <div className="w-4 h-7 rounded-full border border-white/40 flex items-start justify-center p-1">
            <div className="w-1 h-1.5 rounded-full bg-white animate-bounce mt-0.5" />
          </div>
          <ChevronDown size={14} className="text-white/40 -mt-0.5" />
        </a>
      </div>
    </section>
  );
}
