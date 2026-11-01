"use client";

import React, { useState, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
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

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // Center Drone B: Hero prominence, smooth hovering dynamics
    if (droneGroupRef.current) {
      const isHovered = hoveredMachine === "drone-b";
      const targetScale = isHovered ? 1.16 : 1.10;
      droneGroupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5);

      // Delicate floating motion lowered cleanly below labels
      droneGroupRef.current.position.y = -0.12 + Math.sin(t * 1.6) * 0.016;
      droneGroupRef.current.rotation.y = Math.sin(t * 0.35) * 0.08;
      droneGroupRef.current.rotation.x = Math.sin(t * 1.1) * 0.015;
      droneGroupRef.current.rotation.z = Math.cos(t * 0.9) * 0.015;
    }

    // Left Combat Bot: brought close to center drone, well inside screen
    if (combatBotGroupRef.current) {
      const isHovered = hoveredMachine === "robo-rumble";
      const targetScale = isHovered ? 0.54 : 0.50;
      combatBotGroupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5);
      combatBotGroupRef.current.rotation.y = 0.42 + Math.sin(t * 0.3) * 0.015;
    }

    // Right Walker: brought close to center drone, well inside screen
    if (walkerGroupRef.current) {
      const isHovered = hoveredMachine === "walking-robot";
      const targetScale = isHovered ? 0.50 : 0.46;
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
        position={[0, -0.42, 0]}
        color={TOKENS.colors.accent}
        intensity={3.2}
        distance={4.5}
      />
      <pointLight position={[0, -0.02, 0]} color={TOKENS.colors.accent} intensity={1.2} distance={2.5} />

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
        position={[-1.15, -0.46, 0.35]}
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
      <group position={[0, -0.56, 0]}>
        {/* Dark Cylindrical Pedestal */}
        <mesh position={[0, 0.07, 0]}>
          <cylinderGeometry args={[0.62, 0.68, 0.14, 64]} />
          <meshStandardMaterial color="#0c0e12" roughness={0.25} metalness={0.75} />
        </mesh>

        {/* Emissive Orange Neon Ring around top rim of pedestal */}
        <mesh position={[0, 0.142, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.62, 0.011, 16, 64]} />
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
        position={[0, -0.12, 0]}
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
        position={[1.15, -0.46, 0.35]}
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
      <mesh position={[0, -0.565, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[28, 28]} />
        <meshStandardMaterial
          color="#060709"
          roughness={0.15}
          metalness={0.85}
        />
      </mesh>

      {/* Subtle Engineering Grid on floor */}
      <gridHelper args={[24, 48, "#222a36", "#0e1218"]} position={[0, -0.56, 0]} />
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
      <div className="relative z-20 w-full pt-16 sm:pt-20 md:pt-22 text-center px-4 flex flex-col items-center pointer-events-none">
        <h1 className="font-serif-headline text-3xl sm:text-4xl md:text-5xl lg:text-[2.75rem] tracking-[0.04em] text-white uppercase font-normal leading-[1.15] select-text max-w-3xl">
          FOR THOSE WHO
          <br />
          <span className="italic font-bold text-[#FF6A1A] mr-3">BUILD</span>
          BEYOND ORDINARY.
        </h1>

        {/* Clean Editorial Subtitle - Distinct typography and human-readable styling */}
        <p className="mt-3 text-sm sm:text-base font-sans tracking-wide text-[#94A3B8] font-normal select-text">
          Design. Simulate. Build real machines.
        </p>
      </div>

      {/* ================= 2. REAL 3D CANVAS SHOWCASE ================= */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Canvas
          camera={{ position: [0, 0.45, 4.3], fov: 38 }}
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
              target={[0, -0.15, 0]}
              minPolarAngle={Math.PI / 2.8}
              maxPolarAngle={Math.PI / 2.05}
              minAzimuthAngle={-Math.PI / 6}
              maxAzimuthAngle={Math.PI / 6}
              dampingFactor={0.05}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* ================= 3. AUTHENTIC ENGINEERING CAD HUD LABELS & LEADER LINES ================= */}
      <div className="absolute inset-0 w-full h-full z-20 pointer-events-none max-w-7xl mx-auto px-4 sm:px-8 md:px-12">
        <div className="relative w-full h-full">

          {/* ----- LABEL 1: RR-01 COMBAT ROBOT (LEFT) ----- */}
          <div
            onClick={() => onLaunchStudio("robo-rumble")}
            onMouseEnter={() => setHoveredMachine("robo-rumble")}
            onMouseLeave={() => setHoveredMachine(null)}
            className={`absolute left-[3%] sm:left-[5%] lg:left-[7%] top-[45%] md:top-[44%] text-left pointer-events-auto cursor-pointer transition-all duration-300 ${
              hoveredMachine === "robo-rumble" ? "scale-105" : "opacity-90 hover:opacity-100"
            }`}
          >
            {/* Title & Technical Underline with Pointer */}
            <div className="relative pb-1">
              <span className="text-[11px] sm:text-xs font-mono-tech tracking-[0.16em] text-white font-medium uppercase drop-shadow-sm">
                RR-01 / COMBAT ROBOT
              </span>
              {/* Leader Line extending right and down toward combat bot */}
              <svg
                width="130"
                height="42"
                viewBox="0 0 130 42"
                fill="none"
                className={`transition-colors duration-200 mt-0.5 ${
                  hoveredMachine === "robo-rumble" ? "stroke-[#FF6A1A]" : "stroke-white/40"
                }`}
              >
                <path d="M0 1H85L120 40" strokeWidth="1" strokeDasharray="3 2" />
              </svg>
            </div>

            {/* Technical Sub-Specs */}
            <div className="space-y-0.5 text-[9px] sm:text-[10px] font-mono-tech tracking-wider text-[#94A3B8] uppercase">
              <div className="hover:text-white transition-colors">ESP32 CONTROL</div>
              <div className="hover:text-white transition-colors">IMPACT READY</div>
            </div>
          </div>

          {/* ----- LABEL 2: DRONE-B / INDUSTRIAL OCTOCOPTER (CENTER - UPPER LEFT OF DRONE) ----- */}
          <div
            onClick={() => onLaunchStudio("drone-b")}
            onMouseEnter={() => setHoveredMachine("drone-b")}
            onMouseLeave={() => setHoveredMachine(null)}
            className={`absolute left-[24%] sm:left-[30%] lg:left-[34%] top-[39%] md:top-[38%] text-left pointer-events-auto cursor-pointer transition-all duration-300 ${
              hoveredMachine === "drone-b" ? "scale-105" : "opacity-90 hover:opacity-100"
            }`}
          >
            {/* Title & Leader Line pointing down-right to Drone's left motor/arm */}
            <div className="relative pb-0.5">
              <span className="text-[11px] sm:text-xs font-mono-tech tracking-[0.18em] text-white font-medium uppercase drop-shadow-sm">
                DRONE-B / INDUSTRIAL OCTOCOPTER
              </span>
              <svg
                width="140"
                height="38"
                viewBox="0 0 140 38"
                fill="none"
                className={`transition-colors duration-200 mt-0.5 ${
                  hoveredMachine === "drone-b" ? "stroke-[#FF6A1A]" : "stroke-white/40"
                }`}
              >
                <path d="M0 1H95L132 36" strokeWidth="1" strokeDasharray="3 2" />
              </svg>
            </div>
          </div>

          {/* ----- LABEL 2B: DRONE-B SPECS (CENTER - UPPER RIGHT OF DRONE) ----- */}
          <div
            onClick={() => onLaunchStudio("drone-b")}
            onMouseEnter={() => setHoveredMachine("drone-b")}
            onMouseLeave={() => setHoveredMachine(null)}
            className={`absolute left-[56%] sm:left-[58%] lg:left-[60%] top-[39%] md:top-[38%] text-left pointer-events-auto cursor-pointer transition-all duration-300 hidden sm:block ${
              hoveredMachine === "drone-b" ? "scale-105" : "opacity-90 hover:opacity-100"
            }`}
          >
            <div className="space-y-0.5 text-[9px] sm:text-[10px] font-mono-tech tracking-wider text-[#94A3B8] uppercase">
              <div className="hover:text-white transition-colors">400Hz SIMULATION</div>
              <div className="hover:text-white transition-colors">ESP32 CONTROL</div>
            </div>
          </div>

          {/* ----- LABEL 3: TJ-01 WALKING MECHANISM (RIGHT) ----- */}
          <div
            onClick={() => onLaunchStudio("walking-robot")}
            onMouseEnter={() => setHoveredMachine("walking-robot")}
            onMouseLeave={() => setHoveredMachine(null)}
            className={`absolute right-[3%] sm:right-[5%] lg:right-[7%] top-[43%] md:top-[42%] text-right pointer-events-auto cursor-pointer transition-all duration-300 ${
              hoveredMachine === "walking-robot" ? "scale-105" : "opacity-90 hover:opacity-100"
            }`}
          >
            {/* Title & Leader Line extending left and down toward walker linkage */}
            <div className="relative pb-1">
              <span className="text-[11px] sm:text-xs font-mono-tech tracking-[0.16em] text-white font-medium uppercase drop-shadow-sm">
                TJ-01 / WALKING MECHANISM
              </span>
              <svg
                width="130"
                height="42"
                viewBox="0 0 130 42"
                fill="none"
                className={`ml-auto transition-colors duration-200 mt-0.5 ${
                  hoveredMachine === "walking-robot" ? "stroke-[#FF6A1A]" : "stroke-white/40"
                }`}
              >
                <path d="M130 1H45L10 40" strokeWidth="1" strokeDasharray="3 2" />
              </svg>
            </div>

            {/* Technical Sub-Specs */}
            <div className="space-y-0.5 text-[9px] sm:text-[10px] font-mono-tech tracking-wider text-[#94A3B8] uppercase">
              <div className="hover:text-white transition-colors">LINKAGE DRIVE</div>
              <div className="hover:text-white transition-colors">LOW POWER</div>
            </div>
          </div>

        </div>
      </div>

      {/* ================= 4. REAL FUNCTIONAL CTA BUTTONS & SCROLL INDICATOR ================= */}
      <div className="relative z-30 w-full pb-8 flex flex-col items-center gap-5 pointer-events-auto">
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {/* Primary Orange Button: EXPLORE MACHINES → */}
          <a
            href="#catalog"
            className="px-8 py-3.5 rounded-full text-xs font-mono-tech font-semibold tracking-wider text-white flex items-center gap-2 transition-all transform active:scale-95 cursor-pointer shadow-lg hover:brightness-110"
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
            className="px-7 py-3.5 rounded-full text-xs font-mono-tech font-medium tracking-wider text-white bg-[#0F1114]/85 backdrop-blur-md border border-white/20 hover:border-white/50 hover:bg-[#161A1F] transition-all transform active:scale-95 cursor-pointer uppercase shadow-lg"
          >
            <span>ENTER 3D STUDIO</span>
          </button>

          {/* Web AR Interactive Experience Button */}
          <button
            onClick={() => (onOpenAR ? onOpenAR("drone-b") : onLaunchStudio("drone-b"))}
            className="px-6 py-3.5 rounded-full text-xs font-mono-tech font-semibold tracking-wider text-[#FF6A1A] bg-[#0F1114]/90 backdrop-blur-md border border-[#FF6A1A]/40 hover:border-[#FF6A1A] hover:bg-[#FF6A1A]/10 transition-all transform active:scale-95 cursor-pointer uppercase shadow-lg flex items-center gap-2"
          >
            <Camera size={14} />
            <span>VIEW IN AR</span>
          </button>
        </div>

        {/* Minimal Animated Mouse Scroll Indicator */}
        <a
          href="#showcase"
          className="flex flex-col items-center gap-1.5 text-white/50 hover:text-white transition-colors cursor-pointer pt-1"
          aria-label="Scroll Down to Showcase"
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
