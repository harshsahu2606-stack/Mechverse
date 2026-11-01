"use client";

import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { ArrowRight, ChevronDown } from "lucide-react";
import { MachineId } from "@/types/machine";
import { TOKENS } from "@/constants/designTokens";
import Esp32DroneModel from "@/components/3d/Esp32DroneModel";

interface HeroSceneProps {
  onLaunchStudio: (machineId?: MachineId) => void;
}

function StudioEnvironment() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15; // Slow, cinematic turntable rotation
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 2]} intensity={1.2} />
      {/* Orange rim lighting */}
      <spotLight
        position={[-3, 2, -3]}
        color={TOKENS.colors.accent}
        intensity={2.8}
        angle={0.6}
        penumbra={0.8}
      />
      <pointLight position={[0, -0.2, 0]} color={TOKENS.colors.accent} intensity={1.5} distance={2} />

      {/* Hero Machine on Slow Turntable */}
      <group ref={groupRef} position={[0, -0.02, 0]}>
        <Esp32DroneModel
          customization={{}}
          explosionLevel={0}
          selectedComponent={null}
          isolatedComponent={null}
          hiddenComponents={[]}
          onSelect={() => {}}
          isArmed={true}
          throttlePct={25}
        />
      </group>

      {/* Engineering Studio Floor Grid */}
      <gridHelper args={[6, 24, TOKENS.colors.accent, "#1f242d"]} position={[0, -0.15, 0]} />
    </>
  );
}

export default function HeroScene({ onLaunchStudio }: HeroSceneProps) {
  return (
    <section
      id="hero"
      className="relative w-full min-h-[92vh] flex flex-col justify-between overflow-hidden"
      style={{ backgroundColor: TOKENS.colors.background }}
    >
      {/* Background Subtle Gradient & Radial Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 65% 45%, rgba(255,106,26,0.08) 0%, transparent 60%)`,
        }}
      />

      {/* Main Grid: Content on Left, 3D Canvas on Right / Background */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pt-16 md:pt-24 pb-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center flex-1">
        {/* Left Column: Minimalist Typography & CTAs */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
          {/* Engineering Category Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-[#0F1114] w-fit">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: TOKENS.colors.accent }}
            />
            <span className="text-[11px] font-mono tracking-widest text-[#9AA0A9] uppercase">
              Interactive 3D Engineering Platform
            </span>
          </div>

          {/* Headline: One idea, one highlight word */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-[#F4F5F7] leading-[1.1]">
            Design, Simulate & Physically Build Real{" "}
            <span className="font-semibold" style={{ color: TOKENS.colors.accent }}>
              Machines
            </span>
            .
          </h1>

          {/* One clear sentence */}
          <p className="text-base sm:text-lg text-[#9AA0A9] font-normal leading-relaxed max-w-xl">
            From ESP32 micro-drones to combat robots — inspect CAD geometry, test kinematics in 3D,
            and assemble using verified Indian hardware components.
          </p>

          {/* Actions: Primary & Secondary */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => onLaunchStudio("esp32-drone")}
              className="px-6 py-3.5 rounded-xl text-sm font-semibold tracking-wide text-white flex items-center gap-2.5 transition-all transform active:scale-95 cursor-pointer"
              style={{
                backgroundColor: TOKENS.colors.accent,
                boxShadow: `0 0 25px ${TOKENS.colors.accentGlow}`,
              }}
            >
              <span>Launch 3D Studio</span>
              <ArrowRight size={16} />
            </button>

            <a
              href="#catalog"
              className="px-6 py-3.5 rounded-xl text-sm font-medium tracking-wide text-[#F4F5F7] bg-[#0F1114] border border-white/10 hover:border-white/20 hover:bg-[#161A1F] transition-all"
            >
              Explore Machines
            </a>
          </div>

          {/* Static Engineering Specifications (Real machine data, 0 fake numbers) */}
          <div className="pt-6 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <div className="text-[10px] font-mono text-[#5C626B] uppercase">Processor</div>
              <div className="text-xs font-mono font-medium text-[#F4F5F7] mt-0.5">ESP32 240MHz</div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-[#5C626B] uppercase">Propulsion</div>
              <div className="text-xs font-mono font-medium text-[#F4F5F7] mt-0.5">4× 8520 Coreless</div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-[#5C626B] uppercase">Diagonal Frame</div>
              <div className="text-xs font-mono font-medium text-[#F4F5F7] mt-0.5">95 mm Polycarb</div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-[#5C626B] uppercase">All-Up Weight</div>
              <div className="text-xs font-mono font-medium text-[#F4F5F7] mt-0.5">38 g AUW</div>
            </div>
          </div>
        </div>

        {/* Right Column: Cinematic 3D Turntable */}
        <div className="lg:col-span-6 h-[380px] sm:h-[460px] lg:h-[520px] w-full relative rounded-2xl border border-white/5 bg-[#0F1114]/60 overflow-hidden">
          {/* Subtle Studio Label */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2 pointer-events-none">
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: TOKENS.colors.accent }}
            />
            <span className="text-[10px] font-mono tracking-widest text-[#9AA0A9] uppercase">
              AERO-ESP Phone Drone · 3D Viewport
            </span>
          </div>

          <div className="absolute bottom-4 right-4 z-20 text-[10px] font-mono text-[#5C626B] pointer-events-none">
            Drag to Orbit · Scroll to Zoom
          </div>

          <Canvas
            camera={{ position: [0.35, 0.25, 0.38], fov: 38 }}
            className="w-full h-full cursor-grab active:cursor-grabbing"
          >
            <Suspense fallback={null}>
              <StudioEnvironment />
              <OrbitControls
                enableZoom={true}
                enablePan={false}
                minDistance={0.15}
                maxDistance={0.8}
                maxPolarAngle={Math.PI / 2.05}
              />
            </Suspense>
          </Canvas>
        </div>
      </div>

      {/* Down Indicator */}
      <div className="relative z-10 w-full flex justify-center pb-4 text-[#5C626B]">
        <a href="#reveal" className="flex flex-col items-center gap-1 hover:text-white transition-colors" aria-label="Scroll to Reveal Section">
          <span className="text-[10px] font-mono uppercase tracking-widest">Signature Reveal</span>
          <ChevronDown size={14} className="animate-bounce" />
        </a>
      </div>
    </section>
  );
}
