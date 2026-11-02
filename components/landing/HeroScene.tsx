"use client";

import React, { useState, useRef, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { ArrowRight, ChevronDown, Camera } from "lucide-react";
import { CustomizationSettings, MachineId, RobotSimulationState } from "@/types/machine";
import { TOKENS } from "@/constants/designTokens";
import DroneBModel from "@/components/3d/DroneBModel";
import RoboRumbleVehicleModel from "@/components/3d/RoboRumbleVehicleModel";
import WalkingRobotModel from "@/components/3d/WalkingRobotModel";

interface HeroSceneProps {
  onLaunchStudio: (machineId?: MachineId) => void;
  onOpenAR?: (machineId?: MachineId) => void;
}

// Customizations matching the reference composition
const DRONE_B_SETTINGS = {
  paintColor: "#0f172a",
  droneBChassisColor: "#0f172a", // Deep dark carbon fuselage
  droneBArmColor: "#FF6A1A",     // Signal orange structural arms
  droneBMotorColor: "#1e293b",
  droneBPropellerColor: "#020617",
} as unknown as CustomizationSettings;

const COMBAT_BOT_SETTINGS = {
  paintColor: "#FF6A1A",
  finish: "metallic",
  wheelStyle: "sport",
  rimColor: "#1e293b",
  bodyParts: { spoiler: true, sideSkirts: true, frontSplitter: true, rearDiffuser: true },
} as unknown as CustomizationSettings;

const WALKER_SETTINGS = {} as unknown as CustomizationSettings;

const WALKER_SIMULATION: RobotSimulationState = {
  walking: true,
  speed: "slow",
  forwardMovement: false,
  showKinematicGhost: false,
};

function IndustrialStudioStage({
  hoveredMachine,
  onHoverMachine,
  onSelectMachine,
}: {
  hoveredMachine: MachineId | null;
  onHoverMachine: (id: MachineId | null) => void;
  onSelectMachine: (id: MachineId) => void;
}) {
  const droneGroupRef = useRef<THREE.Group>(null);
  const combatBotGroupRef = useRef<THREE.Group>(null);
  const walkerGroupRef = useRef<THREE.Group>(null);
  const orbitLightRef = useRef<THREE.PointLight>(null);

  const { width } = useThree((state) => state.viewport);
  const isMobile = width < 3.4;

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // Center Drone B: Hero prominence, smooth hovering dynamics
    if (droneGroupRef.current) {
      const isHovered = hoveredMachine === "drone-b";
      const targetScale = isMobile
        ? (isHovered ? 0.92 : 0.86)
        : (isHovered ? 1.16 : 1.10);
      droneGroupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5);

      // Delicate floating motion lowered cleanly below labels
      droneGroupRef.current.position.y = -0.16 + Math.sin(t * 1.6) * 0.016;
      droneGroupRef.current.rotation.y = Math.sin(t * 0.35) * 0.08;
      droneGroupRef.current.rotation.x = Math.sin(t * 1.1) * 0.015;
      droneGroupRef.current.rotation.z = Math.cos(t * 0.9) * 0.015;
    }

    // Left Combat Bot: brought close to center drone, well inside screen
    if (combatBotGroupRef.current) {
      const isHovered = hoveredMachine === "robo-rumble";
      const targetScale = isMobile
        ? (isHovered ? 0.40 : 0.36)
        : (isHovered ? 0.54 : 0.50);
      combatBotGroupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5);
      combatBotGroupRef.current.rotation.y = 0.42 + Math.sin(t * 0.3) * 0.015;
    }

    // Right Walker: brought close to center drone, well inside screen
    if (walkerGroupRef.current) {
      const isHovered = hoveredMachine === "walking-robot";
      const targetScale = isMobile
        ? (isHovered ? 0.38 : 0.34)
        : (isHovered ? 0.50 : 0.46);
      walkerGroupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5);
      walkerGroupRef.current.rotation.y = -0.42 + Math.cos(t * 0.3) * 0.015;
    }

    // Pedestal glow pulse
    if (orbitLightRef.current) {
      orbitLightRef.current.intensity = 3.2 + Math.sin(t * 2.5) * 0.4;
    }
  });

  return (
    <>
      {/* Studio Fog */}
      <fog attach="fog" args={["#07080A", 4.0, 11.0]} />

      {/* Lighting Architecture */}
      <ambientLight intensity={0.4} />

      {/* Main Overhead Soft Key Light */}
      <directionalLight position={[0, 9, 4]} intensity={1.7} color="#ffffff" />

      {/* Industrial Side Key & Rim Lights */}
      <spotLight
        position={[-6, 4.5, -2]}
        intensity={2.8}
        color="#e2e8f0"
        angle={0.65}
        penumbra={0.9}
      />
      <spotLight
        position={[6, 4.5, -2]}
        intensity={2.8}
        color="#e2e8f0"
        angle={0.65}
        penumbra={0.9}
      />

      {/* Pedestal Orange Glow Ring & Uplight */}
      <pointLight
        ref={orbitLightRef}
        position={[0, -0.46, 0]}
        color={TOKENS.colors.accent}
        intensity={3.2}
        distance={4.5}
      />
      <pointLight position={[0, -0.06, 0]} color={TOKENS.colors.accent} intensity={1.2} distance={2.5} />

      {/* Background Overhead White Industrial Light Strips (Left & Right) */}
      <group position={[-4.5, 2.4, -3.5]} rotation={[0.08, 0.4, -0.65]}>
        <mesh>
          <cylinderGeometry args={[0.035, 0.035, 3.5, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      <group position={[4.5, 2.4, -3.5]} rotation={[-0.08, -0.4, 0.65]}>
        <mesh>
          <cylinderGeometry args={[0.035, 0.035, 3.5, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* ================= 1. LEFT MACHINE: RR-01 COMBAT ROBOT ================= */}
      <group
        ref={combatBotGroupRef}
        position={[isMobile ? -0.82 : -1.15, -0.50, 0.35]}
        scale={0.50}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHoverMachine("robo-rumble");
        }}
        onPointerOut={() => onHoverMachine(null)}
        onClick={(e) => {
          e.stopPropagation();
          onSelectMachine("robo-rumble");
        }}
      >
        <RoboRumbleVehicleModel
          customization={COMBAT_BOT_SETTINGS}
          explosionLevel={0}
          selectedComponent={null}
          isolatedComponent={null}
          hiddenComponents={[]}
          onSelect={() => onSelectMachine("robo-rumble")}
          wheelRotationSpeed={0.8}
          position={[0, 0, 0]}
          scale={0.92}
        />
      </group>

      {/* ================= 2. CENTER MACHINE: DRONE B ON GLOWING PEDESTAL ================= */}
      <group position={[0, -0.60, 0]}>
        {/* Dark Cylindrical Pedestal */}
        <mesh position={[0, 0.07, 0]}>
          <cylinderGeometry args={[isMobile ? 0.48 : 0.62, isMobile ? 0.54 : 0.68, 0.14, 64]} />
          <meshStandardMaterial color="#0c0e12" roughness={0.25} metalness={0.75} />
        </mesh>

        {/* Emissive Orange Neon Ring around top rim of pedestal */}
        <mesh position={[0, 0.142, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[isMobile ? 0.48 : 0.62, 0.011, 16, 64]} />
          <meshStandardMaterial
            color={TOKENS.colors.accent}
            emissive={TOKENS.colors.accent}
            emissiveIntensity={3.6}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* Hovering Drone B (Center Hero) */}
      <group
        ref={droneGroupRef}
        position={[0, -0.16, 0]}
        scale={1.10}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHoverMachine("drone-b");
        }}
        onPointerOut={() => onHoverMachine(null)}
        onClick={(e) => {
          e.stopPropagation();
          onSelectMachine("drone-b");
        }}
      >
        <DroneBModel
          customization={DRONE_B_SETTINGS}
          explosionLevel={0}
          selectedComponent={null}
          isolatedComponent={null}
          hiddenComponents={[]}
          onSelect={() => onSelectMachine("drone-b")}
          isArmed={true}
        />
      </group>

      {/* ================= 3. RIGHT MACHINE: TJ-01 WALKING MECHANISM ================= */}
      <group
        ref={walkerGroupRef}
        position={[isMobile ? 0.82 : 1.15, -0.50, 0.35]}
        scale={0.46}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHoverMachine("walking-robot");
        }}
        onPointerOut={() => onHoverMachine(null)}
        onClick={(e) => {
          e.stopPropagation();
          onSelectMachine("walking-robot");
        }}
      >
        <WalkingRobotModel
          customization={WALKER_SETTINGS}
          explosionLevel={0}
          selectedComponent={null}
          isolatedComponent={null}
          hiddenComponents={[]}
          simulation={WALKER_SIMULATION}
          onSelect={() => onSelectMachine("walking-robot")}
        />
      </group>

      {/* Highly Reflective Industrial Wet Studio Ground */}
      <mesh position={[0, -0.605, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[28, 28]} />
        <meshStandardMaterial
          color="#060709"
          roughness={0.15}
          metalness={0.85}
        />
      </mesh>

      {/* Subtle Engineering Grid on floor */}
      <gridHelper args={[24, 48, "#222a36", "#0e1218"]} position={[0, -0.60, 0]} />
    </>
  );
}

export default function HeroScene({ onLaunchStudio, onOpenAR }: HeroSceneProps) {
  const [hoveredMachine, setHoveredMachine] = useState<MachineId | null>(null);

  return (
    <section
      id="hero"
      className="relative w-full h-[100svh] min-h-[640px] flex flex-col justify-between overflow-hidden bg-[#07080A] select-none"
    >
      {/* Background Studio Vignette Gradient */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: `
            radial-gradient(circle at 50% 20%, rgba(255,255,255,0.03) 0%, transparent 60%),
            radial-gradient(circle at 50% 75%, rgba(255,106,26,0.06) 0%, transparent 50%),
            linear-gradient(to bottom, rgba(7,8,10,0.85) 0%, transparent 18%, transparent 80%, rgba(7,8,10,0.98) 100%)
          `,
        }}
      />

      {/* ================= 1. EDITORIAL HEADLINE & SANS SUBTITLE (CLEAN HIERARCHY) ================= */}
      <div className="relative z-20 w-full pt-10 sm:pt-14 md:pt-16 text-center px-4 flex flex-col items-center pointer-events-none">
        <h1 className="font-serif-headline text-2xl sm:text-4xl md:text-5xl lg:text-[2.65rem] tracking-[0.04em] text-white uppercase font-normal leading-snug sm:leading-[1.12] select-text max-w-3xl">
          FOR THOSE WHO
          <br />
          <span className="italic font-bold text-[#FF6A1A] mr-2 sm:mr-3">BUILD</span>
          BEYOND ORDINARY.
        </h1>

        {/* Clean Editorial Subtitle - Guaranteed clearance from 3D models */}
        <p className="mt-2 text-xs sm:text-sm font-sans tracking-[0.22em] text-[#94A3B8] font-medium uppercase select-text">
          Design. Simulate. Build real machines.
        </p>
      </div>

      {/* ================= 2. REAL 3D CANVAS SHOWCASE ================= */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Canvas
          camera={{ position: [0, 0.40, 4.4], fov: 38 }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          dpr={[1, 1.5]}
        >
          <Suspense fallback={null}>
            <IndustrialStudioStage
              hoveredMachine={hoveredMachine}
              onHoverMachine={setHoveredMachine}
              onSelectMachine={(id) => onLaunchStudio(id)}
            />
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              target={[0, -0.20, 0]}
              minPolarAngle={Math.PI / 2.8}
              maxPolarAngle={Math.PI / 2.05}
              minAzimuthAngle={-Math.PI / 6}
              maxAzimuthAngle={Math.PI / 6}
              dampingFactor={0.05}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* ================= 3. PROFESSIONAL REFINED MACHINE SHOWCASE CARDS (ZERO OVERLAP) ================= */}
      <div className="absolute inset-0 w-full h-full z-20 pointer-events-none max-w-7xl mx-auto px-4 sm:px-8 md:px-12">
        <div className="relative w-full h-full">

          {/* ----- CARD 1: ROBO-RUMBLE COMBAT CAR (LEFT - FLOATING CLEARLY ABOVE VEHICLE) ----- */}
          <div
            onClick={() => onLaunchStudio("robo-rumble")}
            onMouseEnter={() => setHoveredMachine("robo-rumble")}
            onMouseLeave={() => setHoveredMachine(null)}
            className={`absolute left-[2%] sm:left-[5%] lg:left-[7%] top-[37%] sm:top-[38%] text-left pointer-events-auto cursor-pointer transition-all duration-300 group ${
              hoveredMachine === "robo-rumble" ? "scale-105" : "opacity-90 hover:opacity-100"
            }`}
          >
            <div className="bg-[#0b0e16]/85 hover:bg-[#111624]/95 border border-white/10 hover:border-orange-500/60 shadow-[0_15px_40px_rgba(0,0,0,0.75)] backdrop-blur-xl px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl transition-all duration-300 flex flex-col gap-1 max-w-[210px] sm:max-w-[240px]">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_#ff6a1a]" />
                <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-orange-400">
                  Combat Robotics
                </span>
              </div>
              <h3 className="text-xs sm:text-sm font-sans font-bold text-white tracking-normal group-hover:text-orange-300 transition-colors whitespace-nowrap">
                Robo-Rumble Bot
              </h3>
              <p className="text-[10px] sm:text-[11px] font-sans text-slate-400 leading-snug">
                1.5kg Beetleweight • 4WD Ramp
              </p>
            </div>
            {/* Elegant minimalist locator stem pointing towards machine */}
            <div className="w-[1px] h-4 sm:h-6 bg-gradient-to-b from-orange-500/60 to-transparent ml-5 mt-1" />
          </div>

          {/* ----- CARD 2: DRONE-B OCTOCOPTER (CENTER - POSITIONED CLEARLY ABOVE DRONE) ----- */}
          <div
            onClick={() => onLaunchStudio("drone-b")}
            onMouseEnter={() => setHoveredMachine("drone-b")}
            onMouseLeave={() => setHoveredMachine(null)}
            className={`absolute left-1/2 -translate-x-1/2 top-[27%] sm:top-[28%] text-center pointer-events-auto cursor-pointer transition-all duration-300 flex flex-col items-center group ${
              hoveredMachine === "drone-b" ? "scale-105" : "opacity-95 hover:opacity-100"
            }`}
          >
            <div className="bg-[#0b0e16]/85 hover:bg-[#111624]/95 border border-white/10 hover:border-orange-500/60 shadow-[0_15px_40px_rgba(0,0,0,0.75)] backdrop-blur-xl px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl transition-all duration-300 flex flex-col items-center gap-1">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_#ff6a1a]" />
                <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-orange-400">
                  Autonomous UAV
                </span>
              </div>
              <h3 className="text-xs sm:text-sm font-sans font-bold text-white tracking-normal group-hover:text-orange-300 transition-colors whitespace-nowrap">
                Drone-B Heavy Octocopter
              </h3>
              <p className="text-[10px] sm:text-[11px] font-sans text-slate-400 leading-snug whitespace-nowrap">
                Coaxial Carbon Hull • 400Hz Flight Avionics
              </p>
            </div>
            {/* Elegant vertical locator stem dropping down towards drone */}
            <div className="w-[1px] h-5 sm:h-7 bg-gradient-to-b from-orange-500/60 to-transparent mt-1" />
          </div>

          {/* ----- CARD 3: WALKER-TJ MECHANISM (RIGHT - FLOATING CLEARLY ABOVE LINKAGE) ----- */}
          <div
            onClick={() => onLaunchStudio("walking-robot")}
            onMouseEnter={() => setHoveredMachine("walking-robot")}
            onMouseLeave={() => setHoveredMachine(null)}
            className={`absolute right-[2%] sm:right-[5%] lg:right-[7%] top-[37%] sm:top-[38%] text-right pointer-events-auto cursor-pointer transition-all duration-300 flex flex-col items-end group ${
              hoveredMachine === "walking-robot" ? "scale-105" : "opacity-90 hover:opacity-100"
            }`}
          >
            <div className="bg-[#0b0e16]/85 hover:bg-[#111624]/95 border border-white/10 hover:border-cyan-500/60 shadow-[0_15px_40px_rgba(0,0,0,0.75)] backdrop-blur-xl px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl transition-all duration-300 flex flex-col items-end gap-1 max-w-[210px] sm:max-w-[240px]">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-cyan-400">
                  Kinematic Linkage
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
              </div>
              <h3 className="text-xs sm:text-sm font-sans font-bold text-white tracking-normal group-hover:text-cyan-300 transition-colors whitespace-nowrap">
                Walker-TJ Strandbeest
              </h3>
              <p className="text-[10px] sm:text-[11px] font-sans text-slate-400 leading-snug">
                8-Leg Jansen Mechanism • Geared DC
              </p>
            </div>
            {/* Elegant minimalist locator stem pointing towards machine */}
            <div className="w-[1px] h-4 sm:h-6 bg-gradient-to-b from-cyan-500/60 to-transparent mr-5 mt-1" />
          </div>

        </div>
      </div>

      {/* ================= 4. REAL FUNCTIONAL CTA BUTTONS & SCROLL INDICATOR ================= */}
      <div className="relative z-30 w-full pb-6 sm:pb-8 flex flex-col items-center gap-3 sm:gap-5 pointer-events-auto">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4 w-full max-w-xs sm:max-w-none px-4">
          {/* Primary Orange Button: EXPLORE MACHINES → */}
          <a
            href="#catalog"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="w-full sm:w-auto text-center justify-center px-6 sm:px-8 py-3 sm:py-3.5 rounded-full text-xs font-mono-tech font-semibold tracking-wider text-white flex items-center gap-2 transition-all transform active:scale-95 cursor-pointer shadow-lg hover:brightness-110"
            style={{
              backgroundColor: TOKENS.colors.accent,
              boxShadow: `0 0 25px ${TOKENS.colors.accentGlow}`,
            }}
          >
            <span>EXPLORE MACHINES</span>
            <ArrowRight size={14} />
          </a>

          {/* Secondary Dark Glass Button: ENTER 3D STUDIO */}
          <button
            onClick={() => onLaunchStudio()}
            className="w-full sm:w-auto text-center justify-center px-6 sm:px-7 py-3 sm:py-3.5 rounded-full text-xs font-mono-tech font-medium tracking-wider text-white bg-[#0F1114]/85 backdrop-blur-md border border-white/20 hover:border-white/50 hover:bg-[#161A1F] transition-all transform active:scale-95 cursor-pointer uppercase shadow-lg"
          >
            <span>ENTER 3D STUDIO</span>
          </button>

          {/* Web AR Interactive Experience Button */}
          <button
            onClick={() => (onOpenAR ? onOpenAR("drone-b") : onLaunchStudio("drone-b"))}
            className="w-full sm:w-auto text-center justify-center px-5 sm:px-6 py-3 sm:py-3.5 rounded-full text-xs font-mono-tech font-semibold tracking-wider text-[#FF6A1A] bg-[#0F1114]/90 backdrop-blur-md border border-[#FF6A1A]/40 hover:border-[#FF6A1A] hover:bg-[#FF6A1A]/10 transition-all transform active:scale-95 cursor-pointer uppercase shadow-lg flex items-center gap-2"
          >
            <Camera size={14} />
            <span>VIEW IN AR</span>
          </button>
        </div>

        {/* Minimal Animated Mouse Scroll Indicator with Smooth Scroll */}
        <button
          onClick={(e) => {
            e.preventDefault();
            const target = document.getElementById("reveal") || document.getElementById("showcase");
            if (target) {
              target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }}
          className="flex flex-col items-center gap-1.5 text-slate-400 hover:text-white transition-all duration-300 cursor-pointer pt-1 group"
          aria-label="Scroll Down to Reveal Section"
        >
          <span className="text-[10px] font-mono-tech tracking-widest uppercase opacity-75 group-hover:opacity-100 group-hover:text-orange-400 transition-all">
            Scroll to Explore
          </span>
          <div className="w-4 h-7 rounded-full border border-white/30 group-hover:border-orange-500/80 flex items-start justify-center p-1 transition-colors">
            <div className="w-1 h-1.5 rounded-full bg-orange-400 animate-bounce mt-0.5 shadow-[0_0_6px_#ff6a1a]" />
          </div>
          <ChevronDown size={14} className="text-white/40 group-hover:text-orange-400 -mt-0.5 transition-colors" />
        </button>
      </div>
    </section>
  );
}
