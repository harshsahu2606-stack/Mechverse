"use client";

import React, { useState, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { ArrowRight, ChevronDown } from "lucide-react";
import { CustomizationSettings, MachineId, RobotSimulationState } from "@/types/machine";
import { TOKENS } from "@/constants/designTokens";
import DroneBModel from "@/components/3d/DroneBModel";
import RoboRumbleVehicleModel from "@/components/3d/RoboRumbleVehicleModel";
import WalkingRobotModel from "@/components/3d/WalkingRobotModel";

interface HeroSceneProps {
  onLaunchStudio: (machineId?: MachineId) => void;
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
      const targetScale = isHovered ? 1.22 : 1.16;
      droneGroupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5);

      // Delicate floating motion positioned cleanly above pedestal
      droneGroupRef.current.position.y = -0.06 + Math.sin(t * 1.6) * 0.02;
      droneGroupRef.current.rotation.y = Math.sin(t * 0.35) * 0.08;
      droneGroupRef.current.rotation.x = Math.sin(t * 1.1) * 0.015;
      droneGroupRef.current.rotation.z = Math.cos(t * 0.9) * 0.015;
    }

    // Left Combat Bot: brought closer to center so it stays 100% on-screen
    if (combatBotGroupRef.current) {
      const isHovered = hoveredMachine === "robo-rumble";
      const targetScale = isHovered ? 0.76 : 0.72;
      combatBotGroupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5);
      combatBotGroupRef.current.rotation.y = 0.42 + Math.sin(t * 0.3) * 0.015;
    }

    // Right Walker: brought closer to center so it stays 100% on-screen
    if (walkerGroupRef.current) {
      const isHovered = hoveredMachine === "walking-robot";
      const targetScale = isHovered ? 0.72 : 0.68;
      walkerGroupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5);
      walkerGroupRef.current.rotation.y = -0.42 + Math.cos(t * 0.3) * 0.015;
    }

    // Pedestal glow pulse
    if (orbitLightRef.current) {
      orbitLightRef.current.intensity = 3.5 + Math.sin(t * 2.5) * 0.5;
    }
  });

  return (
    <>
      {/* Studio Fog */}
      <fog attach="fog" args={["#07080A", 3.8, 10.5]} />

      {/* Lighting Architecture */}
      <ambientLight intensity={0.4} />

      {/* Main Overhead Soft Key Light */}
      <directionalLight position={[0, 9, 4]} intensity={1.7} color="#ffffff" />

      {/* Industrial Side Key & Rim Lights */}
      <spotLight
        position={[-7, 5, -2]}
        intensity={3.0}
        color="#e2e8f0"
        angle={0.65}
        penumbra={0.9}
      />
      <spotLight
        position={[7, 5, -2]}
        intensity={3.0}
        color="#e2e8f0"
        angle={0.65}
        penumbra={0.9}
      />

      {/* Pedestal Orange Glow Ring & Uplight */}
      <pointLight
        ref={orbitLightRef}
        position={[0, -0.38, 0]}
        color={TOKENS.colors.accent}
        intensity={3.5}
        distance={4.8}
      />
      <pointLight position={[0, 0.05, 0]} color={TOKENS.colors.accent} intensity={1.4} distance={3.0} />

      {/* Background Overhead White Industrial Light Strips (Left & Right) */}
      <group position={[-5.2, 2.6, -3.8]} rotation={[0.08, 0.4, -0.65]}>
        <mesh>
          <cylinderGeometry args={[0.04, 0.04, 3.8, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      <group position={[5.2, 2.6, -3.8]} rotation={[-0.08, -0.4, 0.65]}>
        <mesh>
          <cylinderGeometry args={[0.04, 0.04, 3.8, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* ================= 1. LEFT MACHINE: RR-01 COMBAT ROBOT (CLOSER IN & ON SCREEN) ================= */}
      <group
        ref={combatBotGroupRef}
        position={[-1.75, -0.44, 0.35]}
        scale={0.72}
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
      <group position={[0, -0.52, 0]}>
        {/* Dark Cylindrical Pedestal */}
        <mesh position={[0, 0.07, 0]}>
          <cylinderGeometry args={[0.76, 0.82, 0.14, 64]} />
          <meshStandardMaterial color="#0c0e12" roughness={0.25} metalness={0.75} />
        </mesh>

        {/* Emissive Orange Neon Ring around top rim of pedestal */}
        <mesh position={[0, 0.142, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.76, 0.012, 16, 64]} />
          <meshStandardMaterial
            color={TOKENS.colors.accent}
            emissive={TOKENS.colors.accent}
            emissiveIntensity={3.8}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* Hovering Drone B (Center Hero) */}
      <group
        ref={droneGroupRef}
        position={[0, -0.05, 0]}
        scale={1.16}
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

      {/* ================= 3. RIGHT MACHINE: TJ-01 WALKING MECHANISM (CLOSER IN & ON SCREEN) ================= */}
      <group
        ref={walkerGroupRef}
        position={[1.75, -0.44, 0.35]}
        scale={0.68}
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
      <mesh position={[0, -0.525, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[32, 32]} />
        <meshStandardMaterial
          color="#060709"
          roughness={0.15}
          metalness={0.85}
        />
      </mesh>

      {/* Subtle Engineering Grid on floor */}
      <gridHelper args={[28, 56, "#222a36", "#0e1218"]} position={[0, -0.52, 0]} />
    </>
  );
}

export default function HeroScene({ onLaunchStudio }: HeroSceneProps) {
  const [hoveredMachine, setHoveredMachine] = useState<MachineId | null>(null);

  return (
    <section
      id="hero"
      className="relative w-full h-[100svh] min-h-[660px] flex flex-col justify-between overflow-hidden bg-[#07080A] select-none"
    >
      {/* Background Studio Vignette Gradient */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: `
            radial-gradient(circle at 50% 25%, rgba(255,255,255,0.03) 0%, transparent 65%),
            radial-gradient(circle at 50% 80%, rgba(255,106,26,0.06) 0%, transparent 55%),
            linear-gradient(to bottom, rgba(7,8,10,0.85) 0%, transparent 20%, transparent 80%, rgba(7,8,10,0.98) 100%)
          `,
        }}
      />

      {/* ================= 1. CLEAN RESPONSIVE HTML HEADLINE (WELL-SPACED BELOW NAVBAR, NO OVERLAP) ================= */}
      <div className="relative z-20 w-full pt-24 sm:pt-26 md:pt-28 text-center px-4 flex flex-col items-center pointer-events-none">
        <h1 className="font-serif-headline text-2xl sm:text-4xl md:text-5xl lg:text-[3.2rem] tracking-[0.06em] text-white uppercase font-normal leading-tight select-text max-w-4xl">
          FOR THOSE WHO
          <br />
          <span className="italic font-bold text-[#FF6A1A] mr-3">BUILD</span>
          BEYOND ORDINARY.
        </h1>

        <p className="mt-2 text-[10px] sm:text-xs md:text-sm font-mono-tech tracking-[0.25em] text-[#9AA0A9] font-light uppercase select-text">
          Design. Simulate. Build real machines.
        </p>
      </div>

      {/* ================= 2. REAL 3D CANVAS SHOWCASE ================= */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Canvas
          camera={{ position: [0, 0.45, 3.9], fov: 36 }}
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
              target={[0, -0.12, 0]}
              minPolarAngle={Math.PI / 2.8}
              maxPolarAngle={Math.PI / 2.05}
              minAzimuthAngle={-Math.PI / 6}
              maxAzimuthAngle={Math.PI / 6}
              dampingFactor={0.05}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* ================= 3. ACTUAL TECHNICAL HUD LABELS & CONNECTORS (CLEANLY ALIGNED) ================= */}
      <div className="absolute inset-0 w-full h-full z-20 pointer-events-none max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-between py-16">
        <div className="relative w-full h-full">
          {/* Label 1: RR-01 Combat Robot (Left) */}
          <div
            onClick={() => onLaunchStudio("robo-rumble")}
            onMouseEnter={() => setHoveredMachine("robo-rumble")}
            onMouseLeave={() => setHoveredMachine(null)}
            className={`absolute left-[2%] sm:left-[5%] lg:left-[6%] top-[48%] text-left pointer-events-auto cursor-pointer transition-all duration-300 ${
              hoveredMachine === "robo-rumble" ? "scale-105" : "opacity-85"
            }`}
          >
            <div
              className={`text-[11px] font-mono-tech tracking-[0.2em] font-semibold uppercase transition-colors ${
                hoveredMachine === "robo-rumble" ? "text-[#FF6A1A]" : "text-white"
              }`}
            >
              RR-01 / COMBAT ROBOT
            </div>
            {/* Technical SVG Connector Line */}
            <svg
              width="120"
              height="32"
              viewBox="0 0 120 32"
              fill="none"
              className={`my-1 transition-colors ${
                hoveredMachine === "robo-rumble" ? "stroke-[#FF6A1A]" : "stroke-white/40"
              }`}
            >
              <path d="M0 1H85L115 31" strokeWidth="1" />
            </svg>
            <div className="text-[10px] font-mono-tech tracking-widest text-[#9AA0A9] space-y-0.5 uppercase">
              <div>ESP32 CONTROL</div>
              <div>IMPACT READY</div>
            </div>
          </div>

          {/* Label 2: DRONE-B / INDUSTRIAL OCTOCOPTER (Center - Situated in clear space between title & drone) */}
          <div
            onClick={() => onLaunchStudio("drone-b")}
            onMouseEnter={() => setHoveredMachine("drone-b")}
            onMouseLeave={() => setHoveredMachine(null)}
            className={`absolute left-1/2 -translate-x-1/2 top-[34%] text-center pointer-events-auto cursor-pointer transition-all duration-300 ${
              hoveredMachine === "drone-b" ? "scale-105" : "opacity-85"
            }`}
          >
            <div
              className={`text-[11px] sm:text-[12px] font-mono-tech tracking-[0.22em] font-semibold uppercase transition-colors ${
                hoveredMachine === "drone-b" ? "text-[#FF6A1A]" : "text-white"
              }`}
            >
              DRONE-B / INDUSTRIAL OCTOCOPTER
            </div>
            {/* Technical SVG Connector Line */}
            <svg
              width="220"
              height="22"
              viewBox="0 0 220 22"
              fill="none"
              className={`mx-auto my-1 transition-colors ${
                hoveredMachine === "drone-b" ? "stroke-[#FF6A1A]" : "stroke-white/40"
              }`}
            >
              <path d="M10 21L45 1H175L210 21" strokeWidth="1" />
            </svg>
            <div className="flex items-center justify-center gap-6 text-[9px] sm:text-[10px] font-mono-tech tracking-widest text-[#9AA0A9] uppercase">
              <div>400Hz SIMULATION</div>
              <div>ESP32 CONTROL</div>
            </div>
          </div>

          {/* Label 3: TJ-01 Walking Mechanism (Right) */}
          <div
            onClick={() => onLaunchStudio("walking-robot")}
            onMouseEnter={() => setHoveredMachine("walking-robot")}
            onMouseLeave={() => setHoveredMachine(null)}
            className={`absolute right-[2%] sm:right-[5%] lg:right-[6%] top-[46%] text-right pointer-events-auto cursor-pointer transition-all duration-300 ${
              hoveredMachine === "walking-robot" ? "scale-105" : "opacity-85"
            }`}
          >
            <div
              className={`text-[11px] font-mono-tech tracking-[0.2em] font-semibold uppercase transition-colors ${
                hoveredMachine === "walking-robot" ? "text-[#FF6A1A]" : "text-white"
              }`}
            >
              TJ-01 / WALKING MECHANISM
            </div>
            {/* Technical SVG Connector Line */}
            <svg
              width="120"
              height="32"
              viewBox="0 0 120 32"
              fill="none"
              className={`my-1 ml-auto transition-colors ${
                hoveredMachine === "walking-robot" ? "stroke-[#FF6A1A]" : "stroke-white/40"
              }`}
            >
              <path d="M120 1H35L5 31" strokeWidth="1" />
            </svg>
            <div className="text-[10px] font-mono-tech tracking-widest text-[#9AA0A9] space-y-0.5 uppercase">
              <div>LINKAGE DRIVE</div>
              <div>LOW POWER</div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 4. REAL FUNCTIONAL CTA BUTTONS & SCROLL INDICATOR ================= */}
      <div className="relative z-30 w-full pb-8 flex flex-col items-center gap-5 pointer-events-auto">
        <div className="flex flex-wrap items-center justify-center gap-4">
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
            className="px-8 py-3.5 rounded-full text-xs font-mono-tech font-medium tracking-wider text-white bg-[#0F1114]/85 backdrop-blur-md border border-white/20 hover:border-white/50 hover:bg-[#161A1F] transition-all transform active:scale-95 cursor-pointer uppercase shadow-lg"
          >
            <span>ENTER 3D STUDIO</span>
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
