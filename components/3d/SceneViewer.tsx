"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { CustomizationSettings, FanSimulationState, MachineId, RobotSimulationState, RopewaySimulationState, ViewMode, AppTheme } from "@/types/machine";
import SportsCarModel from "./SportsCarModel";
import ElectricFanModel from "./ElectricFanModel";
import EngineSubAssembly from "./EngineSubAssembly";
import WalkingRobotModel from "./WalkingRobotModel";
import RoboRumbleVehicleModel from "./RoboRumbleVehicleModel";
import AeroDroneModel from "./AeroDroneModel";
import DroneBModel from "./DroneBModel";
import Esp32DroneModel from "./Esp32DroneModel";
import RopewayRobotModel from "./RopewayRobotModel";
import RoboRacerModel from "./RoboRacerModel";

export type CameraPreset = "default" | "front" | "side" | "top";

interface SceneViewerProps {
  machineId: MachineId;
  viewMode: ViewMode;
  explosionLevel: number;
  customization: CustomizationSettings;
  simulation: FanSimulationState;
  robotSimulation: RobotSimulationState;
  ropewaySimulation?: RopewaySimulationState;
  selectedComponent: string | null;
  isolatedComponent: string | null;
  hiddenComponents: string[];
  cameraPreset: CameraPreset;
  cameraResetCount: number;
  onSelectComponent: (id: string) => void;
  theme?: AppTheme;
  esp32Armed?: boolean;
  esp32Throttle?: number;
  roboRacerDriving?: boolean;
  roboRacerSpeed?: number;
  roboRacerSteering?: number;
  roboRacerCameraPan?: number;
  roboRacerHoodOpen?: boolean;
}

// Controller component to smoothly reposition camera on preset changes
function CameraController({
  preset,
  resetCount,
  machineId,
  isSubAssembly,
}: {
  preset: CameraPreset;
  resetCount: number;
  machineId: MachineId;
  isSubAssembly: boolean;
}) {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  useEffect(() => {
    if (!controlsRef.current) return;
    const controls = controlsRef.current;
    const camera = controls.object as THREE.PerspectiveCamera;

    let targetPos = new THREE.Vector3(3.4, 1.4, 3.8);
    let lookTarget = new THREE.Vector3(0, 0.35, 0);

    if (machineId === "esp32-drone") {
      lookTarget.set(0, 0, 0);
      switch (preset) {
        case "front":
          targetPos.set(0, 0.05, 0.22);
          break;
        case "side":
          targetPos.set(0.22, 0.05, 0);
          break;
        case "top":
          targetPos.set(0, 0.26, 0.005);
          break;
        default:
          targetPos.set(0.16, 0.11, 0.18);
          break;
      }
    } else if (machineId === "robo-racer") {
      lookTarget.set(0, 0, 0);
      switch (preset) {
        case "front":
          targetPos.set(0, 0.08, 0.35);
          break;
        case "side":
          targetPos.set(0.35, 0.08, 0);
          break;
        case "top":
          targetPos.set(0, 0.45, 0.01);
          break;
        default:
          targetPos.set(0.28, 0.18, 0.32);
          break;
      }
    } else if (machineId === "aero-450" || machineId === "drone-b") {
      lookTarget.set(0, 0.08, 0);
      switch (preset) {
        case "front":
          targetPos.set(0, 0.45, 2.2);
          break;
        case "side":
          targetPos.set(2.2, 0.45, 0);
          break;
        case "top":
          targetPos.set(0, 2.6, 0.05);
          break;
        default:
          targetPos.set(1.6, 1.1, 1.8);
          break;
      }
    } else if (machineId === "robo-rumble") {
      lookTarget.set(0, 0.25, 0);
      switch (preset) {
        case "front":
          targetPos.set(0, 0.6, 3.2);
          break;
        case "side":
          targetPos.set(3.2, 0.6, 0);
          break;
        case "top":
          targetPos.set(0, 4.0, 0.1);
          break;
        default:
          targetPos.set(2.6, 1.6, 3.0);
          break;
      }
    } else if (machineId === "ropeway-robot") {
      lookTarget.set(0, 1.35, 0);
      switch (preset) {
        case "front":
          targetPos.set(0, 1.45, 3.8);
          break;
        case "side":
          // Profile inspection along the suspended cableway line
          targetPos.set(4.6, 1.45, 0);
          break;
        case "top":
          targetPos.set(0, 4.8, 0.1);
          break;
        default:
          targetPos.set(3.0, 2.2, 3.6);
          break;
      }
    } else if (machineId === "walking-robot") {
      lookTarget.set(0, 0.2, 0);
      switch (preset) {
        case "front":
          targetPos.set(0, 0.4, 3.2);
          break;
        case "side":
          // Side view mechanism inspection (Section 4 requirement)
          targetPos.set(3.2, 0.35, 0);
          break;
        case "top":
          targetPos.set(0, 3.6, 0.1);
          break;
        default:
          targetPos.set(2.4, 1.4, 2.8);
          break;
      }
    } else if (machineId === "electric-fan") {
      lookTarget.set(0, 0.45, 0);
      switch (preset) {
        case "front":
          targetPos.set(0, 0.6, 2.8);
          break;
        case "side":
          targetPos.set(2.8, 0.6, 0);
          break;
        case "top":
          targetPos.set(0, 3.2, 0.1);
          break;
        default:
          targetPos.set(1.8, 1.2, 2.4);
          break;
      }
    } else if (isSubAssembly) {
      lookTarget.set(0, 0.1, 0);
      switch (preset) {
        case "front":
          targetPos.set(0, 0.3, 3.0);
          break;
        case "side":
          targetPos.set(3.0, 0.3, 0);
          break;
        case "top":
          targetPos.set(0, 3.4, 0.1);
          break;
        default:
          targetPos.set(2.4, 1.3, 2.4);
          break;
      }
    } else {
      // Sports Car - Beautiful close, dramatic hero framing with ample clearance for full explosion
      lookTarget.set(0, 0.45, 0);
      switch (preset) {
        case "front":
          targetPos.set(0, 1.1, 4.6);
          break;
        case "side":
          targetPos.set(4.8, 1.1, 0);
          break;
        case "top":
          targetPos.set(0, 6.0, 0.05);
          break;
        default:
          targetPos.set(3.6, 1.9, 4.0);
          break;
      }
    }

    camera.position.copy(targetPos);
    controls.target.copy(lookTarget);
    controls.update();
  }, [preset, resetCount, machineId, isSubAssembly]);

  const minDist = (machineId === "esp32-drone" || machineId === "robo-racer") ? 0.03 : isSubAssembly ? 0.15 : 0.25;
  const maxDist = (machineId === "esp32-drone" || machineId === "robo-racer") ? 4.0 : 16;

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.06}
      minDistance={minDist}
      maxDistance={maxDist}
      zoomSpeed={1.2}
      maxPolarAngle={Math.PI / 2 + 0.05}
    />
  );
}

// Studio Lighting Rig for Dark and Light Engineering Studio modes
function StudioLighting({ theme }: { theme: AppTheme }) {
  const isLight = theme === "light";

  return (
    <>
      <ambientLight intensity={isLight ? 1.25 : 0.8} color="#ffffff" />
      <directionalLight
        position={[6, 10, 6]}
        intensity={isLight ? 2.8 : 2.4}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />
      <directionalLight position={[-6, 6, -4]} intensity={isLight ? 1.6 : 1.3} color={isLight ? "#e0f2fe" : "#93c5fd"} />
      <directionalLight position={[0, 8, -6]} intensity={isLight ? 2.4 : 2.2} color={isLight ? "#fef3c7" : "#fed7aa"} />
      <directionalLight position={[0, 4, 7]} intensity={isLight ? 1.4 : 1.1} color="#ffffff" />
      <directionalLight position={[0, -5, 0]} intensity={isLight ? 0.6 : 0.4} color={isLight ? "#f1f5f9" : "#38bdf8"} />
    </>
  );
}

// Studio Ground with Dynamic Light/Dark Floor
function StudioGround({ theme }: { theme: AppTheme }) {
  const isLight = theme === "light";

  return (
    <group position={[0, -0.85, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.01, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial
          color={isLight ? "#f1f5f9" : "#0c0e14"}
          roughness={isLight ? 0.95 : 0.85}
          metalness={isLight ? 0.05 : 0.2}
        />
      </mesh>
      <gridHelper
        args={[28, 36, isLight ? "#94a3b8" : "#232733", isLight ? "#cbd5e1" : "#12151e"]}
        position={[0, 0.001, 0]}
      />
    </group>
  );
}

export default function SceneViewer({
  machineId,
  viewMode,
  explosionLevel,
  customization,
  simulation,
  robotSimulation,
  ropewaySimulation,
  selectedComponent,
  isolatedComponent,
  hiddenComponents,
  cameraPreset,
  cameraResetCount,
  onSelectComponent,
  theme = "dark",
  esp32Armed = false,
  esp32Throttle = 1000,
  roboRacerDriving = false,
  roboRacerSpeed = 0,
  roboRacerSteering = 0,
  roboRacerCameraPan = 0,
  roboRacerHoodOpen = false,
}: SceneViewerProps) {
  const isSubAssembly = viewMode === "subassembly";
  const isLight = theme === "light";

  return (
    <div
      className={`absolute inset-0 w-full h-full select-none transition-colors duration-300 ${
        isLight ? "bg-[#f8fafc]" : "bg-[#0a0c10]"
      }`}
    >
      <Canvas
        shadows
        camera={{ position: [2.8, 1.6, 3.2], fov: 42 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
        className="w-full h-full"
      >
        <color attach="background" args={[isLight ? "#f8fafc" : "#0a0c10"]} />
        <fog attach="fog" args={[isLight ? "#f8fafc" : "#0a0c10", isLight ? 9 : 7, isLight ? 24 : 20]} />

        <StudioLighting theme={theme} />

        <Suspense
          fallback={
            <mesh position={[0, 0.5, 0]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#334155" wireframe />
            </mesh>
          }
        >
          {/* Sports Car */}
          {machineId === "sports-car" && (
            <>
              {isSubAssembly ? (
                <EngineSubAssembly
                  explosionLevel={explosionLevel}
                  selectedPart={selectedComponent}
                  onSelectPart={onSelectComponent}
                />
              ) : (
                <SportsCarModel
                  customization={customization}
                  explosionLevel={explosionLevel}
                  selectedComponent={selectedComponent}
                  isolatedComponent={isolatedComponent}
                  hiddenComponents={hiddenComponents}
                  onSelect={onSelectComponent}
                />
              )}
            </>
          )}

          {/* Electric Fan */}
          {machineId === "electric-fan" && (
            <ElectricFanModel
              paintColor={customization.paintColor}
              bladeColor={customization.fanBladeColor}
              baseColor={customization.fanBaseColor}
              explosionLevel={explosionLevel}
              selectedComponent={selectedComponent}
              isolatedComponent={isolatedComponent}
              hiddenComponents={hiddenComponents}
              simulation={simulation}
              onSelect={onSelectComponent}
            />
          )}

          {/* Walking Robot */}
          {machineId === "walking-robot" && (
            <WalkingRobotModel
              customization={customization}
              explosionLevel={explosionLevel}
              selectedComponent={selectedComponent}
              isolatedComponent={isolatedComponent}
              hiddenComponents={hiddenComponents}
              simulation={robotSimulation}
              onSelect={onSelectComponent}
            />
          )}

          {/* Robo Rumble Battle Car */}
          {machineId === "robo-rumble" && (
            <RoboRumbleVehicleModel
              customization={customization}
              explosionLevel={explosionLevel}
              selectedComponent={selectedComponent}
              isolatedComponent={isolatedComponent}
              hiddenComponents={hiddenComponents}
              onSelect={onSelectComponent}
            />
          )}

          {/* AERO-450 Quadcopter Drone */}
          {machineId === "aero-450" && (
            <AeroDroneModel
              customization={customization}
              explosionLevel={explosionLevel}
              selectedComponent={selectedComponent}
              isolatedComponent={isolatedComponent}
              hiddenComponents={hiddenComponents}
              onSelect={onSelectComponent}
              isArmed={true}
              throttlePct={45}
              viewMode={viewMode}
            />
          )}

          {/* Drone B — Industrial Octagonal UAV */}
          {machineId === "drone-b" && (
            <DroneBModel
              customization={customization}
              explosionLevel={explosionLevel}
              selectedComponent={selectedComponent}
              isolatedComponent={isolatedComponent}
              hiddenComponents={hiddenComponents}
              onSelect={onSelectComponent}
              isArmed={true}
            />
          )}

          {/* AERO-ESP Phone-Controlled Micro Drone */}
          {machineId === "esp32-drone" && (
            <Esp32DroneModel
              customization={customization}
              explosionLevel={explosionLevel}
              selectedComponent={selectedComponent}
              isolatedComponent={isolatedComponent}
              hiddenComponents={hiddenComponents}
              onSelect={onSelectComponent}
              isArmed={esp32Armed}
              throttlePct={
                esp32Armed
                  ? Math.max(15, Math.min(100, Math.round(((esp32Throttle - 1000) / 1000) * 100)))
                  : 0
              }
            />
          )}

          {/* ROBO-RACER AI Autonomous Vision Bot */}
          {machineId === "robo-racer" && (
            <RoboRacerModel
              customization={customization}
              explosionLevel={explosionLevel}
              selectedComponent={selectedComponent}
              isolatedComponent={isolatedComponent}
              hiddenComponents={hiddenComponents}
              onSelect={onSelectComponent}
              isDriving={roboRacerDriving}
              driveSpeed={roboRacerDriving ? (roboRacerSpeed !== 0 ? roboRacerSpeed : 50) : roboRacerSpeed}
              steeringAngle={roboRacerSteering}
              cameraPanAngle={roboRacerCameraPan}
              hoodOpen={roboRacerHoodOpen}
            />
          )}

          {/* AeroClimb RC-1 Ropeway Climbing Robot */}
          {machineId === "ropeway-robot" && (
            <RopewayRobotModel
              customization={customization}
              explosionLevel={explosionLevel}
              selectedComponent={selectedComponent}
              isolatedComponent={isolatedComponent}
              hiddenComponents={hiddenComponents}
              onSelect={onSelectComponent}
              simulation={ropewaySimulation}
              showCable={true}
            />
          )}

          {/* Soft Ground Contact Shadow */}
          <ContactShadows
            position={[0, -0.84, 0]}
            opacity={isLight ? 0.75 : 0.65}
            scale={12}
            blur={2.4}
            far={4}
            color={isLight ? "#334155" : "#000000"}
          />
        </Suspense>

        <StudioGround theme={theme} />

        <CameraController
          preset={cameraPreset}
          resetCount={cameraResetCount}
          machineId={machineId}
          isSubAssembly={isSubAssembly}
        />
      </Canvas>
    </div>
  );
}
