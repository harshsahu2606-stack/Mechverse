"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Sparkles, ArrowDown, Eye, EyeOff, ShieldCheck, Cpu } from "lucide-react";
import { TOKENS } from "@/constants/designTokens";
import AeroDroneModel from "@/components/3d/AeroDroneModel";
import { CustomizationSettings } from "@/types/machine";

interface MachineRevealProps {
  onLaunchStudio?: () => void;
}

const DEFAULT_DRONE_SETTINGS = {
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
} as unknown as CustomizationSettings;

function RevealScene({ progress }: { progress: number }) {
  const modelGroupRef = useRef<THREE.Group>(null);
  const shroudRef = useRef<THREE.Group>(null);
  const studioLightRef = useRef<THREE.DirectionalLight>(null);
  const rimLightRef = useRef<THREE.SpotLight>(null);
  const flareRef = useRef<THREE.PointLight>(null);

  useFrame((state, delta) => {
    // Subtle breathing floating motion
    if (modelGroupRef.current) {
      modelGroupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.015;
      modelGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        modelGroupRef.current.rotation.y,
        progress * 0.45 - 0.22,
        delta * 3
      );
    }

    // Shroud lifts vertically and glides away as scroll progress increases
    if (shroudRef.current) {
      shroudRef.current.position.y = progress * 1.8;
      shroudRef.current.position.z = -progress * 0.8;
      shroudRef.current.rotation.x = -progress * 0.5;
    }

    // Studio lights brighten as reveal advances
    if (studioLightRef.current) {
      studioLightRef.current.intensity = 0.15 + progress * 1.85;
    }
    if (rimLightRef.current) {
      rimLightRef.current.intensity = 1.0 + progress * 2.5;
    }
    if (flareRef.current) {
      flareRef.current.intensity = progress >= 0.95 ? (progress - 0.95) * 40 : 0;
    }
  });

  return (
    <>
      <ambientLight intensity={0.1 + progress * 0.4} />
      <directionalLight
        ref={studioLightRef}
        position={[4, 6, 4]}
        intensity={0.2}
        color="#ffffff"
      />
      <spotLight
        ref={rimLightRef}
        position={[-4, 2, -3]}
        color={TOKENS.colors.accent}
        intensity={1.2}
        angle={0.7}
        penumbra={0.9}
      />
      <pointLight
        ref={flareRef}
        position={[0, 0.4, 0.3]}
        color={TOKENS.colors.accent}
        intensity={0}
        distance={2}
      />

      {/* Target Machine */}
      <group ref={modelGroupRef} position={[0, -0.05, 0]}>
        <AeroDroneModel
          customization={DEFAULT_DRONE_SETTINGS}
          explosionLevel={0}
          selectedComponent={null}
          isolatedComponent={null}
          hiddenComponents={[]}
          onSelect={() => {}}
          isArmed={progress > 0.6}
          throttlePct={progress * 20}
        />

        {/* Aerodynamic Carbon Protective Shroud / Cover */}
        <group ref={shroudRef} position={[0, 0.05, 0]}>
          <mesh visible={progress < 0.98}>
            <coneGeometry args={[0.38, 0.28, 32, 1, true]} />
            <meshStandardMaterial
              color="#0c0d11"
              roughness={0.7}
              metalness={0.4}
              side={THREE.DoubleSide}
              transparent={true}
              opacity={Math.max(0, 1 - progress * 1.05)}
            />
          </mesh>
          {/* Shroud rim ring */}
          <mesh position={[0, -0.14, 0]} rotation={[Math.PI / 2, 0, 0]} visible={progress < 0.98}>
            <torusGeometry args={[0.38, 0.006, 16, 48]} />
            <meshStandardMaterial
              color={TOKENS.colors.accent}
              emissive={TOKENS.colors.accent}
              emissiveIntensity={1.2}
              transparent={true}
              opacity={Math.max(0, 1 - progress * 1.1)}
            />
          </mesh>
        </group>
      </group>

      {/* Studio Floor Grid */}
      <gridHelper args={[8, 32, TOKENS.colors.accent, "#15181f"]} position={[0, -0.32, 0]} />
    </>
  );
}

export default function MachineReveal({ onLaunchStudio }: MachineRevealProps) {
  const [progress, setProgress] = useState<number>(0);
  const [targetProgress, setTargetProgress] = useState<number>(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const [manualOverride, setManualOverride] = useState<boolean | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // Check for reduced motion preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      const media = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(media.matches);
    }
  }, []);

  // Scroll-Triggered Animation: Automatically calculates reveal progress based on page scroll
  useEffect(() => {
    const handleScroll = () => {
      // If user clicked manual toggle, don't immediately overwrite until scroll changes significantly
      if (manualOverride !== null) return;
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start revealing when the section enters the lower part of the screen
      // Reach 100% reveal when centered in the viewport
      const startY = windowHeight * 0.85;
      const endY = windowHeight * 0.25;

      const rawProgress = (startY - rect.top) / (startY - endY);
      const clamped = Math.max(0, Math.min(1, rawProgress));

      setTargetProgress(clamped);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial position check

    return () => window.removeEventListener("scroll", handleScroll);
  }, [manualOverride]);

  // Smooth damped physics interpolation loop
  useEffect(() => {
    const updatePhysics = () => {
      setProgress((prev) => {
        const diff = targetProgress - prev;
        if (Math.abs(diff) < 0.001) return targetProgress;
        return prev + diff * 0.12; // Damping factor for silky smooth motion
      });
      animFrameRef.current = requestAnimationFrame(updatePhysics);
    };

    animFrameRef.current = requestAnimationFrame(updatePhysics);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [targetProgress]);

  const toggleManualReveal = () => {
    const nextVal = targetProgress > 0.5 ? 0 : 1;
    setManualOverride(nextVal === 1);
    setTargetProgress(nextVal);
  };

  return (
    <section
      ref={sectionRef}
      id="reveal"
      className="relative w-full py-16 sm:py-24 px-4 sm:px-6 md:px-12 border-t border-white/5 overflow-hidden"
      style={{ backgroundColor: TOKENS.colors.background }}
    >
      {/* Background Studio Vignette Gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 50% 15%, rgba(255,106,26,0.04) 0%, transparent 60%),
            radial-gradient(circle at 50% 80%, rgba(255,255,255,0.02) 0%, transparent 50%)
          `,
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-orange-500/20 bg-[#0F1114]/90 shadow-sm">
            <Sparkles size={12} className="text-[#FF6A1A] animate-pulse" />
            <span className="text-[11px] font-mono-tech tracking-widest text-[#9AA0A9] uppercase font-medium">
              Autonomous Shroud Reveal
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-light text-[#F4F5F7] tracking-tight">
            Scroll to Unveil Engineering{" "}
            <span className="font-semibold text-[#FF6A1A]">
              Precision
            </span>
            .
          </h2>
          <p className="text-xs sm:text-sm text-[#9AA0A9] max-w-xl mx-auto leading-relaxed">
            As you scroll down the page, the aerodynamic protective shroud automatically glides away to
            uncover the internal carbon airframe, BLDC power systems, and APM flight avionics.
          </p>
        </div>

        {/* 3D Viewport with Shroud & Model */}
        <div className="relative w-full h-[400px] sm:h-[520px] rounded-2xl border border-white/10 bg-[#0A0D14]/90 overflow-hidden flex items-center justify-center shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
          {/* CAD Technical Corner Crosshairs */}
          <div className="absolute top-3 left-3 z-20 font-mono text-[10px] text-white/30 pointer-events-none">
            + [SEC-02]
          </div>
          <div className="absolute top-3 right-3 z-20 font-mono text-[10px] text-white/30 pointer-events-none">
            [F450-UAV] +
          </div>
          <div className="absolute bottom-3 left-3 z-20 font-mono text-[10px] text-white/30 pointer-events-none">
            + [Z-AXIS TRANSLATION]
          </div>
          <div className="absolute bottom-3 right-3 z-20 font-mono text-[10px] text-white/30 pointer-events-none">
            [DATUM-0] +
          </div>

          {/* Status Overlay */}
          <div className="absolute top-4 left-4 sm:left-6 z-20 flex items-center gap-2.5 sm:gap-3 pointer-events-none bg-[#07080A]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            <span
              className="w-2 h-2 rounded-full transition-colors duration-300 shrink-0"
              style={{
                backgroundColor: progress > 0.85 ? TOKENS.colors.status.verified : TOKENS.colors.accent,
                boxShadow: `0 0 10px ${progress > 0.85 ? TOKENS.colors.status.verified : TOKENS.colors.accent}`,
              }}
            />
            <span className="text-[10px] sm:text-xs font-mono text-[#E2E8F0] tracking-wider uppercase font-semibold">
              {progress < 0.15
                ? "State: Shrouded Silhouette"
                : progress > 0.85
                ? "State: Fully Revealed · Ready for Flight"
                : `Scroll Unveiling: ${Math.round(progress * 100)}%`}
            </span>
          </div>

          {/* Quick Manual Toggle Button */}
          <button
            onClick={toggleManualReveal}
            className="absolute top-4 right-4 sm:right-6 z-20 px-3 py-1.5 rounded-full border border-white/10 bg-[#161A1F]/90 backdrop-blur-md text-[11px] font-mono text-[#F4F5F7] hover:text-white hover:border-orange-500/50 flex items-center gap-2 transition-all cursor-pointer shadow-md"
            aria-label={progress > 0.5 ? "Cover Machine" : "Instant Reveal"}
          >
            {progress > 0.5 ? <EyeOff size={13} className="text-orange-400" /> : <Eye size={13} className="text-orange-400" />}
            <span>{progress > 0.5 ? "Cover" : "Reveal"}</span>
          </button>

          {/* Telemetry pill floating at bottom of canvas */}
          <div className="absolute bottom-4 z-20 hidden md:flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#07080A]/85 backdrop-blur-md border border-white/10 text-[10px] font-mono text-slate-300 pointer-events-none">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>AIRFRAME: 450mm CARBON</span>
            </span>
            <span className="text-slate-600">•</span>
            <span>AUTOPILOT: PIXHAWK APM</span>
            <span className="text-slate-600">•</span>
            <span>MOTORS: 4× 2212 920KV</span>
          </div>

          {/* 3D Canvas */}
          <Canvas camera={{ position: [0, 0.45, 0.75], fov: 40 }} className="w-full h-full">
            <Suspense fallback={null}>
              <RevealScene progress={prefersReducedMotion ? targetProgress : progress} />
            </Suspense>
          </Canvas>
        </div>

        {/* Scroll Progress Indicator & Dynamic Feedback */}
        <div className="w-full max-w-xl mt-6 flex flex-col items-center space-y-3">
          {/* Automatic Scroll Track Line */}
          <div className="relative w-full h-2 bg-white/10 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full transition-all duration-75 rounded-full"
              style={{
                width: `${Math.round(progress * 100)}%`,
                backgroundColor: TOKENS.colors.accent,
                boxShadow: `0 0 12px ${TOKENS.colors.accentGlow}`,
              }}
            />
          </div>

          {/* Scroll Direction Prompt & Live Percentage */}
          <div className="flex items-center justify-between w-full text-[11px] font-mono text-[#5C626B] px-1">
            <span>0% Shrouded</span>
            <div className="flex items-center gap-1.5 text-orange-400 font-semibold animate-pulse">
              <ArrowDown size={13} />
              <span>Scroll down to uncover</span>
            </div>
            <span className="text-white font-bold">{Math.round(progress * 100)}% Revealed</span>
          </div>
        </div>
      </div>
    </section>
  );
}
