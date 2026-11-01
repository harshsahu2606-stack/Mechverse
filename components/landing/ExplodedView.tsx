"use client";

import React, { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Layers, ArrowRight, CheckCircle2 } from "lucide-react";
import { TOKENS } from "@/constants/designTokens";
import Esp32DroneModel from "@/components/3d/Esp32DroneModel";
import { MachineId } from "@/types/machine";

interface ExplodedViewProps {
  onLaunchStudio: (machineId: MachineId) => void;
}

const EXPLODED_PARTS = [
  { name: "55mm Micro Propellers", role: "Propulsion Lift", level: "Top Level (+85mm)" },
  { name: "ESP32-WROOM Controller", role: "Avionics & SoftAP", level: "Center Stack (+35mm)" },
  { name: "MPU-6050 6-DOF IMU", role: "Attitude Sensing", level: "Center Stack (+20mm)" },
  { name: "4× 8520 Coreless Motors", role: "Torque Generation", level: "Perimeter Mounts" },
  { name: "Polycarbonate Airframe", role: "Structural Chassis", level: "Base Datum (0mm)" },
  { name: "1S 500mAh 25C LiPo", role: "Electrochemical Power", level: "Under-belly Tray (-45mm)" },
];

export default function ExplodedView({ onLaunchStudio }: ExplodedViewProps) {
  const [explosionLevel, setExplosionLevel] = useState<number>(0.65);

  const presets = [
    { label: "Assembled", value: 0 },
    { label: "Airframe", value: 0.35 },
    { label: "Avionics", value: 0.65 },
    { label: "Full Explosion", value: 1.0 },
  ];

  return (
    <section
      id="exploded"
      className="relative w-full py-20 px-6 md:px-12 border-t border-white/5 overflow-hidden"
      style={{ backgroundColor: TOKENS.colors.background }}
    >
      <div className="max-w-7xl mx-auto flex flex-col space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-[#0F1114]">
              <Layers size={12} style={{ color: TOKENS.colors.accent }} />
              <span className="text-[11px] font-mono tracking-widest text-[#9AA0A9] uppercase">
                CAD Disassembly
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-light text-[#F4F5F7] tracking-tight">
              Interactive CAD{" "}
              <span className="font-semibold" style={{ color: TOKENS.colors.accent }}>
                Explosion
              </span>
              .
            </h2>
            <p className="text-sm text-[#9AA0A9] max-w-xl">
              Inspect every individual mechanical layer and electronic surface. The 3D model separates
              along calibrated Cartesian vectors mirroring real physical assembly steps.
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {presets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => setExplosionLevel(preset.value)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  Math.abs(explosionLevel - preset.value) < 0.05
                    ? "bg-[#161A1F] text-white border border-white/30"
                    : "bg-[#0F1114] text-[#9AA0A9] border border-white/5 hover:text-white"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3D Explosion Canvas & Part Callouts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* 3D Stage */}
          <div className="lg:col-span-8 h-[400px] sm:h-[520px] rounded-2xl border border-white/5 bg-[#0F1114]/70 overflow-hidden relative">
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 pointer-events-none">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: TOKENS.colors.accent }}
              />
              <span className="text-[10px] font-mono tracking-widest text-[#9AA0A9] uppercase">
                CAD Explosion Separation: {Math.round(explosionLevel * 100)}%
              </span>
            </div>

            <Canvas camera={{ position: [0.38, 0.32, 0.45], fov: 40 }} className="w-full h-full cursor-grab active:cursor-grabbing">
              <Suspense fallback={null}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[4, 6, 3]} intensity={1.2} />
                <spotLight
                  position={[-3, 3, -3]}
                  color={TOKENS.colors.accent}
                  intensity={2.0}
                  angle={0.6}
                  penumbra={0.8}
                />

                <group position={[0, -0.05, 0]}>
                  <Esp32DroneModel
                    customization={{}}
                    explosionLevel={explosionLevel}
                    selectedComponent={null}
                    isolatedComponent={null}
                    hiddenComponents={[]}
                    onSelect={() => {}}
                    isArmed={true}
                    throttlePct={20}
                  />
                </group>

                <gridHelper args={[6, 24, TOKENS.colors.accent, "#15181f"]} position={[0, -0.22, 0]} />
                <OrbitControls enableZoom={true} enablePan={false} minDistance={0.15} maxDistance={0.9} />
              </Suspense>
            </Canvas>

            {/* In-Canvas Slider Controller */}
            <div className="absolute bottom-6 left-6 right-6 z-20 flex items-center gap-4 bg-[#07080A]/85 backdrop-blur-md px-5 py-3 rounded-xl border border-white/10">
              <span className="text-[11px] font-mono text-[#9AA0A9] whitespace-nowrap uppercase">
                Disassembly Vector
              </span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={explosionLevel}
                onChange={(e) => setExplosionLevel(parseFloat(e.target.value))}
                aria-label="Exploded View Slider"
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#FF6A1A]"
              />
              <span className="text-xs font-mono font-semibold text-white whitespace-nowrap min-w-[3rem] text-right">
                {Math.round(explosionLevel * 100)}%
              </span>
            </div>
          </div>

          {/* Right Column: Physical Assembly Layers Callout */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
            <div className="text-xs font-mono text-[#5C626B] uppercase tracking-wider">
              Disassembled Sub-Assemblies
            </div>

            <div className="space-y-2.5">
              {EXPLODED_PARTS.map((part, index) => (
                <div
                  key={index}
                  className="p-3 rounded-xl border border-white/5 bg-[#0F1114] flex items-center justify-between transition-colors hover:border-white/15"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-medium text-[#F4F5F7]">{part.name}</div>
                    <div className="text-[10px] font-mono text-[#5C626B]">{part.role}</div>
                  </div>
                  <div className="text-[10px] font-mono text-[#9AA0A9] bg-[#161A1F] px-2 py-1 rounded">
                    {part.level}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onLaunchStudio("esp32-drone")}
              className="w-full py-3 rounded-xl text-xs font-mono font-semibold tracking-wider text-white flex items-center justify-center gap-2 transition-all transform active:scale-98 cursor-pointer uppercase border border-white/10 bg-[#0F1114] hover:border-white/30 hover:bg-[#161A1F]"
            >
              <span>Inspect Full CAD Hierarchy in Studio</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
