"use client";

import React, { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Eye, EyeOff, Sparkles, Sliders } from "lucide-react";
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
    // Subtle breathing / floating motion
    if (modelGroupRef.current) {
      modelGroupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.015;
      modelGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        modelGroupRef.current.rotation.y,
        progress * 0.45 - 0.22,
        delta * 3
      );
    }

    // Shroud lifts vertically and glides away as progress increases
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
  const [isInteracting, setIsInteracting] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  const arcContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);
  const animFrameRef = useRef<number | null>(null);

  // Check for reduced motion preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      const media = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(media.matches);
    }
  }, []);

  // Smooth damped physics interpolation loop
  useEffect(() => {
    const updatePhysics = () => {
      setProgress((prev) => {
        const diff = targetProgress - prev;
        if (Math.abs(diff) < 0.001) return targetProgress;
        return prev + diff * 0.12; // Damping factor
      });
      animFrameRef.current = requestAnimationFrame(updatePhysics);
    };

    animFrameRef.current = requestAnimationFrame(updatePhysics);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [targetProgress]);

  // Pointer drag calculation along horizontal arc
  const handlePointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    isDraggingRef.current = true;
    setIsInteracting(true);
    setHasInteracted(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !arcContainerRef.current) return;
    const rect = arcContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, x / rect.width));
    setTargetProgress(ratio);
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsInteracting(false);

    // Magnetic snap to extremes
    setTargetProgress((curr) => {
      if (curr < 0.2) return 0;
      if (curr > 0.8) return 1;
      return curr;
    });
  };

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    setHasInteracted(true);
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      setTargetProgress((p) => Math.min(1, p + 0.1));
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      setTargetProgress((p) => Math.max(0, p - 0.1));
    } else if (e.key === "Home") {
      e.preventDefault();
      setTargetProgress(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setTargetProgress(1);
    }
  };

  const toggleReveal = () => {
    setHasInteracted(true);
    setTargetProgress((p) => (p > 0.5 ? 0 : 1));
  };

  return (
    <section
      id="reveal"
      className="relative w-full py-20 px-6 md:px-12 border-t border-white/5 overflow-hidden"
      style={{ backgroundColor: TOKENS.colors.background }}
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-[#0F1114]">
            <Sparkles size={12} style={{ color: TOKENS.colors.accent }} />
            <span className="text-[11px] font-mono tracking-widest text-[#9AA0A9] uppercase">
              Signature Reveal
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-light text-[#F4F5F7] tracking-tight">
            Drag to Unveil Engineering{" "}
            <span className="font-semibold" style={{ color: TOKENS.colors.accent }}>
              Precision
            </span>
            .
          </h2>
          <p className="text-sm text-[#9AA0A9] max-w-lg mx-auto">
            Scrub the orbital arc to strip away the protective shroud and reveal internal carbon
            airframe, BLDC power systems, and APM flight avionics.
          </p>
        </div>

        {/* 3D Viewport with Shroud & Model */}
        <div className="relative w-full h-[420px] sm:h-[500px] rounded-2xl border border-white/5 bg-[#0F1114]/80 overflow-hidden flex items-center justify-center">
          {/* Status Overlay */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-3 pointer-events-none">
            <span
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: progress > 0.85 ? TOKENS.colors.status.verified : TOKENS.colors.accent,
              }}
            />
            <span className="text-xs font-mono text-[#9AA0A9] tracking-wider uppercase">
              {progress < 0.15
                ? "State: Shrouded Silhouette"
                : progress > 0.85
                ? "State: Fully Revealed · Ready for Flight"
                : `Revealing: ${Math.round(progress * 100)}%`}
            </span>
          </div>

          {/* Fallback One-Click Button for Accessibility */}
          <button
            onClick={toggleReveal}
            className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-lg border border-white/10 bg-[#161A1F] text-xs font-mono text-[#F4F5F7] hover:text-white hover:border-white/30 flex items-center gap-2 transition-all cursor-pointer"
            aria-label={progress > 0.5 ? "Cover Machine" : "Reveal Machine"}
          >
            {progress > 0.5 ? <EyeOff size={14} /> : <Eye size={14} />}
            <span>{progress > 0.5 ? "Cover Machine" : "Instant Reveal"}</span>
          </button>

          {/* 3D Canvas */}
          <Canvas camera={{ position: [0, 0.45, 0.75], fov: 40 }} className="w-full h-full">
            <Suspense fallback={null}>
              <RevealScene progress={prefersReducedMotion ? targetProgress : progress} />
            </Suspense>
          </Canvas>
        </div>

        {/* Drag-to-Reveal Orbital Arc Slider Controller */}
        <div className="w-full max-w-xl mt-8 flex flex-col items-center space-y-3">
          {/* Accessibility slider container */}
          <div
            ref={arcContainerRef}
            role="slider"
            aria-label="Machine Reveal Slider"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="relative w-full h-12 flex items-center cursor-ew-resize select-none touch-none px-4 rounded-xl border border-white/10 bg-[#0F1114] hover:border-white/20 transition-colors"
          >
            {/* Track Line */}
            <div className="absolute left-4 right-4 h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full transition-all"
                style={{
                  width: `${progress * 100}%`,
                  backgroundColor: TOKENS.colors.accent,
                  boxShadow: `0 0 10px ${TOKENS.colors.accentGlow}`,
                }}
              />
            </div>

            {/* Draggable Handle */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-white bg-[#07080A] flex items-center justify-center transition-transform hover:scale-110 active:scale-95 shadow-lg"
              style={{
                left: `calc(${progress * 100}% * (1 - 32px / 100%) + 8px)`,
                borderColor: TOKENS.colors.accent,
                boxShadow: `0 0 15px ${TOKENS.colors.accentGlow}`,
              }}
            >
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: TOKENS.colors.accent }}
              />
            </div>
          </div>

          {/* Interactive Hint */}
          <div className="flex items-center justify-between w-full text-[11px] font-mono text-[#5C626B] px-1">
            <span>0% Shrouded</span>
            <span className={`transition-opacity duration-500 ${hasInteracted ? "opacity-40" : "opacity-100 text-[#9AA0A9]"}`}>
              ← Drag arc handle or use arrow keys →
            </span>
            <span>100% CAD Revealed</span>
          </div>
        </div>
      </div>
    </section>
  );
}
