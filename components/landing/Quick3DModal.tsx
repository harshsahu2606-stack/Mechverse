"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import { X, ArrowRight, Layers, Eye, Camera, Wrench } from "lucide-react";
import { MachineId, CustomizationSettings } from "@/types/machine";
import Esp32DroneModel from "@/components/3d/Esp32DroneModel";
import RoboRacerModel from "@/components/3d/RoboRacerModel";
import RoboRumbleVehicleModel from "@/components/3d/RoboRumbleVehicleModel";
import AeroDroneModel from "@/components/3d/AeroDroneModel";
import DroneBModel from "@/components/3d/DroneBModel";
import SportsCarModel from "@/components/3d/SportsCarModel";
import WalkingRobotModel from "@/components/3d/WalkingRobotModel";
import ElectricFanModel from "@/components/3d/ElectricFanModel";

interface Quick3DModalProps {
  machineId: MachineId | null;
  machineName: string;
  onClose: () => void;
  onLaunchFullStudio: (id: MachineId) => void;
  onOpenAR?: (id: MachineId) => void;
}

export default function Quick3DModal({
  machineId,
  machineName,
  onClose,
  onLaunchFullStudio,
  onOpenAR,
}: Quick3DModalProps) {
  if (!machineId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl h-[82vh] bg-[#0b0e14] border border-white/15 rounded-3xl overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.9)] flex flex-col">
        {/* Top Header */}
        <div className="px-4 sm:px-6 py-3 border-b border-white/10 bg-[#0e121a]/90 backdrop-blur-md flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_#ff6a1a]" />
            <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
              {machineName}
            </h3>
            <span className="hidden sm:inline-block text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400">
              Interactive CAD Inspection
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onLaunchFullStudio(machineId)}
              className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md shadow-orange-600/30 transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>Full Studio</span>
              <ArrowRight size={13} />
            </button>

            {onOpenAR && (
              <button
                onClick={() => onOpenAR(machineId)}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-orange-400 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                title="View in Web AR"
              >
                <Camera size={13} />
                <span className="hidden sm:inline">Web AR</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 border border-white/10 transition cursor-pointer"
              title="Close Preview (Esc)"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* 3D Canvas Viewport */}
        <div className="flex-1 w-full h-full relative bg-gradient-to-b from-[#0e121a] to-[#06070a]">
          <Canvas
            camera={{ position: [0, 1.2, 3.2], fov: 42 }}
            className="w-full h-full cursor-grab active:cursor-grabbing"
          >
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow />
            <directionalLight position={[-5, 5, -5]} intensity={0.6} />

            <Suspense fallback={null}>
              <group position={[0, -0.2, 0]}>
                {machineId === "esp32-drone" && (
                  <Esp32DroneModel
                    customization={{}}
                    explosionLevel={0}
                    selectedComponent={null}
                    isolatedComponent={null}
                    hiddenComponents={[]}
                    onSelect={() => {}}
                    isArmed={true}
                    throttlePct={35}
                  />
                )}

                {machineId === "robo-racer" && (
                  <RoboRacerModel
                    customization={{}}
                    explosionLevel={0}
                    selectedComponent={null}
                    isolatedComponent={null}
                    hiddenComponents={[]}
                    onSelect={() => {}}
                    isDriving={true}
                    driveSpeed={40}
                    steeringAngle={0}
                    cameraPanAngle={0}
                    hoodOpen={true}
                  />
                )}

                {machineId === "robo-rumble" && (
                  <RoboRumbleVehicleModel
                    customization={
                      {
                        paintColor: "#f97316",
                        battleCarId: "striker",
                      } as unknown as CustomizationSettings
                    }
                    explosionLevel={0}
                    selectedComponent={null}
                    isolatedComponent={null}
                    hiddenComponents={[]}
                    onSelect={() => {}}
                    wheelRotationSpeed={1.5}
                    position={[0, 0, 0]}
                    scale={1.2}
                  />
                )}

                {machineId === "aero-450" && (
                  <AeroDroneModel
                    customization={
                      {
                        paintColor: "#dc2626",
                        droneArmColorFront: "#f8fafc",
                        droneArmColorRear: "#dc2626",
                      } as unknown as CustomizationSettings
                    }
                    explosionLevel={0}
                    selectedComponent={null}
                    isolatedComponent={null}
                    hiddenComponents={[]}
                    onSelect={() => {}}
                  />
                )}

                {machineId === "drone-b" && (
                  <DroneBModel
                    customization={{} as unknown as CustomizationSettings}
                    explosionLevel={0}
                    selectedComponent={null}
                    isolatedComponent={null}
                    hiddenComponents={[]}
                    onSelect={() => {}}
                    isArmed={true}
                  />
                )}

                {machineId === "sports-car" && (
                  <SportsCarModel
                    customization={
                      {
                        paintColor: "#dc2626",
                        finish: "metallic",
                        bodyParts: { spoiler: true, sideSkirts: true, frontSplitter: true, rearDiffuser: true },
                      } as unknown as CustomizationSettings
                    }
                    explosionLevel={0}
                    selectedComponent={null}
                    isolatedComponent={null}
                    hiddenComponents={[]}
                    onSelect={() => {}}
                  />
                )}

                {machineId === "walking-robot" && (
                  <WalkingRobotModel
                    customization={{} as unknown as CustomizationSettings}
                    explosionLevel={0}
                    selectedComponent={null}
                    isolatedComponent={null}
                    hiddenComponents={[]}
                    simulation={{ walking: true, speed: "normal", forwardMovement: false, showKinematicGhost: false }}
                    onSelect={() => {}}
                  />
                )}

                {machineId === "electric-fan" && (
                  <ElectricFanModel
                    paintColor="#1e293b"
                    bladeColor="#0284c7"
                    baseColor="#0f172a"
                    explosionLevel={0}
                    selectedComponent={null}
                    isolatedComponent={null}
                    hiddenComponents={[]}
                    simulation={{ speed: 2, power: true, oscillating: true, tiltAngle: 0 }}
                    onSelect={() => {}}
                  />
                )}
              </group>

              <ContactShadows
                position={[0, -0.5, 0]}
                opacity={0.65}
                scale={6}
                blur={2}
                far={2}
                color="#000000"
              />
            </Suspense>

            <OrbitControls
              enablePan={true}
              enableZoom={true}
              autoRotate={true}
              autoRotateSpeed={1.2}
              minDistance={1.2}
              maxDistance={7}
            />
          </Canvas>

          {/* Quick HUD Hint at bottom */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none text-center">
            <span className="text-[10px] font-mono text-gray-400 bg-black/60 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
              🖱️ Drag to rotate 360° • Scroll to zoom in/out
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
