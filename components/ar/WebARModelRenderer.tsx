"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { CustomizationSettings, MachineId, RobotSimulationState, FanSimulationState } from "@/types/machine";
import DroneBModel from "@/components/3d/DroneBModel";
import AeroDroneModel from "@/components/3d/AeroDroneModel";
import RoboRumbleVehicleModel from "@/components/3d/RoboRumbleVehicleModel";
import WalkingRobotModel from "@/components/3d/WalkingRobotModel";
import SportsCarModel from "@/components/3d/SportsCarModel";
import ElectricFanModel from "@/components/3d/ElectricFanModel";
import Esp32DroneModel from "@/components/3d/Esp32DroneModel";

interface WebARModelRendererProps {
  machineId: MachineId;
  customization: CustomizationSettings;
  explosionLevel: number;
  scale: number;
  rotationY: number;
  elevation: number;
  isHovering: boolean;
  torchEnabled: boolean;
  showReticle: boolean;
  selectedComponent: string | null;
  onSelectComponent: (id: string) => void;
}

const DEFAULT_WALKER_SIM: RobotSimulationState = {
  walking: true,
  speed: "normal",
  forwardMovement: false,
  showKinematicGhost: false,
};

const DEFAULT_FAN_SIM: FanSimulationState = {
  power: true,
  speed: 2,
  oscillating: true,
  tiltAngle: 6,
};

export default function WebARModelRenderer({
  machineId,
  customization,
  explosionLevel,
  scale,
  rotationY,
  elevation,
  isHovering,
  torchEnabled,
  showReticle,
  selectedComponent,
  onSelectComponent,
}: WebARModelRendererProps) {
  const modelGroupRef = useRef<THREE.Group>(null);
  const reticleRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    if (modelGroupRef.current) {
      // Manual rotation around Y axis
      modelGroupRef.current.rotation.y = rotationY;

      // Base elevation + gentle hover for drones
      const hoverOffset =
        isHovering && (machineId === "drone-b" || machineId === "aero-450" || machineId === "esp32-drone")
          ? Math.sin(t * 1.8) * 0.025
          : 0;

      modelGroupRef.current.position.y = elevation + hoverOffset;
    }

    if (reticleRef.current) {
      reticleRef.current.rotation.z = t * 0.4;
    }
  });

  // Base normalization scale multiplier so each model has a comfortable default AR presence
  const getBaseScaleMultiplier = () => {
    switch (machineId) {
      case "drone-b":
        return 0.85;
      case "aero-450":
        return 0.85;
      case "robo-rumble":
        return 0.55;
      case "walking-robot":
        return 0.65;
      case "sports-car":
        return 0.32;
      case "electric-fan":
        return 0.75;
      case "esp32-drone":
        return 2.4;
      default:
        return 1.0;
    }
  };

  const finalScale = scale * getBaseScaleMultiplier();

  return (
    <>
      {/* Lighting Architecture for Real World AR Passthrough */}
      <ambientLight intensity={torchEnabled ? 0.8 : 0.6} />
      <directionalLight position={[4, 8, 4]} intensity={1.4} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-4, 5, -3]} intensity={0.5} />

      {/* AR Torch/Spotlight simulation */}
      {torchEnabled && (
        <spotLight
          position={[0, 3, 3]}
          angle={0.6}
          penumbra={0.5}
          intensity={2.8}
          color="#ffffff"
          castShadow
        />
      )}

      {/* Surface Contact Shadows: Realistically anchors the 3D model to the table/floor */}
      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.65}
        scale={8}
        blur={2.0}
        far={3.0}
        resolution={512}
        color="#000000"
      />

      {/* Holographic CAD Surface Placement Reticle */}
      {showReticle && (
        <group position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <group ref={reticleRef}>
            {/* Outer dotted tracking circle */}
            <mesh>
              <ringGeometry args={[0.7, 0.73, 64]} />
              <meshBasicMaterial color="#FF6A1A" opacity={0.7} transparent side={THREE.DoubleSide} />
            </mesh>
            {/* Inner target circle */}
            <mesh>
              <ringGeometry args={[0.35, 0.37, 32]} />
              <meshBasicMaterial color="#ffffff" opacity={0.5} transparent side={THREE.DoubleSide} />
            </mesh>
          </group>

          {/* Crosshair markers */}
          <mesh position={[0.75, 0, 0]}>
            <planeGeometry args={[0.12, 0.015]} />
            <meshBasicMaterial color="#FF6A1A" />
          </mesh>
          <mesh position={[-0.75, 0, 0]}>
            <planeGeometry args={[0.12, 0.015]} />
            <meshBasicMaterial color="#FF6A1A" />
          </mesh>
          <mesh position={[0, 0.75, 0]}>
            <planeGeometry args={[0.015, 0.12]} />
            <meshBasicMaterial color="#FF6A1A" />
          </mesh>
          <mesh position={[0, -0.75, 0]}>
            <planeGeometry args={[0.015, 0.12]} />
            <meshBasicMaterial color="#FF6A1A" />
          </mesh>
        </group>
      )}

      {/* Interactive Model Transform Node */}
      <group ref={modelGroupRef} scale={finalScale}>
        {machineId === "drone-b" && (
          <DroneBModel
            customization={customization}
            explosionLevel={explosionLevel}
            selectedComponent={selectedComponent}
            isolatedComponent={null}
            hiddenComponents={[]}
            onSelect={onSelectComponent}
            isArmed={true}
          />
        )}

        {machineId === "aero-450" && (
          <AeroDroneModel
            customization={customization}
            explosionLevel={explosionLevel}
            selectedComponent={selectedComponent}
            isolatedComponent={null}
            hiddenComponents={[]}
            onSelect={onSelectComponent}
            isArmed={true}
            throttlePct={30}
          />
        )}

        {machineId === "robo-rumble" && (
          <RoboRumbleVehicleModel
            customization={customization}
            explosionLevel={explosionLevel}
            selectedComponent={selectedComponent}
            isolatedComponent={null}
            hiddenComponents={[]}
            onSelect={onSelectComponent}
            wheelRotationSpeed={0.5}
            position={[0, 0, 0]}
            scale={1.0}
          />
        )}

        {machineId === "walking-robot" && (
          <WalkingRobotModel
            customization={customization}
            explosionLevel={explosionLevel}
            selectedComponent={selectedComponent}
            isolatedComponent={null}
            hiddenComponents={[]}
            simulation={DEFAULT_WALKER_SIM}
            onSelect={onSelectComponent}
          />
        )}

        {machineId === "sports-car" && (
          <SportsCarModel
            customization={customization}
            explosionLevel={explosionLevel}
            selectedComponent={selectedComponent}
            isolatedComponent={null}
            hiddenComponents={[]}
            onSelect={onSelectComponent}
          />
        )}

        {machineId === "electric-fan" && (
          <ElectricFanModel
            paintColor={customization.paintColor}
            bladeColor={customization.fanBladeColor || "#0ea5e9"}
            baseColor={customization.fanBaseColor || "#1e2126"}
            explosionLevel={explosionLevel}
            selectedComponent={selectedComponent}
            isolatedComponent={null}
            hiddenComponents={[]}
            simulation={DEFAULT_FAN_SIM}
            onSelect={onSelectComponent}
          />
        )}

        {machineId === "esp32-drone" && (
          <Esp32DroneModel
            customization={customization}
            explosionLevel={explosionLevel}
            selectedComponent={selectedComponent}
            isolatedComponent={null}
            hiddenComponents={[]}
            onSelect={onSelectComponent}
            isArmed={true}
            throttlePct={35}
          />
        )}
      </group>
    </>
  );
}
