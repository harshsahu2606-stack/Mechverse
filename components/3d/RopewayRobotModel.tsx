"use client";

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { CustomizationSettings, RopewaySimulationState } from "@/types/machine";

interface RopewayRobotModelProps {
  customization?: Partial<CustomizationSettings>;
  explosionLevel: number; // 0 (assembled) to 1 (fully exploded)
  selectedComponent: string | null;
  isolatedComponent: string | null;
  hiddenComponents: string[];
  onSelect: (componentId: string) => void;
  simulation?: RopewaySimulationState;
  showCable?: boolean;
}

// Exact CAD part metadata and explosion vectors for the 12 extracted sub-assemblies
const PART_DEFS = [
  {
    nodeName: "chassis",
    id: "chassis",
    name: "Main Monocoque Chassis Frame",
    basePos: [-0.1322, -1.1257, -0.0236] as [number, number, number],
    explodeVec: [0, 0, 0] as [number, number, number],
    defaultColor: "#0284c7",
    metalness: 0.55,
    roughness: 0.35,
  },
  {
    nodeName: "motor",
    id: "motor",
    name: "High-Torque DC Gear Motor & Pinion",
    basePos: [0.2714, -0.9428, 0.0361] as [number, number, number],
    explodeVec: [0.75, 0, 0] as [number, number, number],
    defaultColor: "#475569",
    metalness: 0.85,
    roughness: 0.2,
  },
  {
    nodeName: "battery",
    id: "battery",
    name: "Lithium-Ion Power Pack & Mount",
    basePos: [-0.3432, -1.1076, 0.0358] as [number, number, number],
    explodeVec: [-0.75, 0, 0] as [number, number, number],
    defaultColor: "#1e293b",
    metalness: 0.3,
    roughness: 0.7,
  },
  {
    nodeName: "gearbox_cover",
    id: "gearbox-cover",
    name: "Precision Transmission Gear Cover",
    basePos: [0.0713, -1.4905, 0.044] as [number, number, number],
    explodeVec: [0.4, -0.6, 0] as [number, number, number],
    defaultColor: "#0369a1",
    metalness: 0.6,
    roughness: 0.3,
  },
  {
    nodeName: "left_arm",
    id: "left-arm",
    name: "Left Climbing Arm & Gripper Hook",
    basePos: [0.1886, -0.9748, -0.2765] as [number, number, number],
    explodeVec: [0.2, 0.5, -0.75] as [number, number, number],
    defaultColor: "#eab308",
    metalness: 0.65,
    roughness: 0.25,
  },
  {
    nodeName: "right_arm",
    id: "right-arm",
    name: "Right Climbing Arm & Gripper Hook",
    basePos: [-0.0476, -0.9775, 0.3539] as [number, number, number],
    explodeVec: [-0.2, 0.5, 0.75] as [number, number, number],
    defaultColor: "#eab308",
    metalness: 0.65,
    roughness: 0.25,
  },
  {
    nodeName: "left_crank",
    id: "left-crank",
    name: "Left Kinematic Drive Crank",
    basePos: [0.0283, -0.6691, -0.2819] as [number, number, number],
    explodeVec: [0.1, 0.2, -0.9] as [number, number, number],
    defaultColor: "#ea580c",
    metalness: 0.7,
    roughness: 0.25,
  },
  {
    nodeName: "right_crank",
    id: "right-crank",
    name: "Right Kinematic Drive Crank",
    basePos: [0.0088, -0.6596, 0.3572] as [number, number, number],
    explodeVec: [-0.1, 0.2, 0.9] as [number, number, number],
    defaultColor: "#ea580c",
    metalness: 0.7,
    roughness: 0.25,
  },
  {
    nodeName: "left_gear",
    id: "left-gear",
    name: "Left Reduction Spur Gear",
    basePos: [0.1532, -0.9744, -0.246] as [number, number, number],
    explodeVec: [0.15, 0, -0.65] as [number, number, number],
    defaultColor: "#d97706",
    metalness: 0.85,
    roughness: 0.2,
  },
  {
    nodeName: "right_gear",
    id: "right-gear",
    name: "Right Reduction Spur Gear",
    basePos: [-0.0119, -0.9744, 0.3244] as [number, number, number],
    explodeVec: [-0.15, 0, 0.65] as [number, number, number],
    defaultColor: "#d97706",
    metalness: 0.85,
    roughness: 0.2,
  },
  {
    nodeName: "left_foot",
    id: "left-foot",
    name: "Left Lower Stabilizer Foot",
    basePos: [0.2015, -1.7029, -0.1807] as [number, number, number],
    explodeVec: [0.25, -0.7, -0.5] as [number, number, number],
    defaultColor: "#334155",
    metalness: 0.5,
    roughness: 0.45,
  },
  {
    nodeName: "right_foot",
    id: "right-foot",
    name: "Right Lower Stabilizer Foot",
    basePos: [0.2015, -1.7029, 0.2551] as [number, number, number],
    explodeVec: [0.25, -0.7, 0.5] as [number, number, number],
    defaultColor: "#334155",
    metalness: 0.5,
    roughness: 0.45,
  },
];

// Preload the authentic CAD model
useGLTF.preload("/models/ropeway/rope-climbing-robot.glb");

export default function RopewayRobotModel({
  customization,
  explosionLevel = 0,
  selectedComponent,
  isolatedComponent,
  hiddenComponents = [],
  onSelect,
  simulation,
  showCable = true,
}: RopewayRobotModelProps) {
  // Load authentic GLTF model generated directly from user's CAD STL
  const { nodes } = useGLTF("/models/ropeway/rope-climbing-robot.glb") as unknown as {
    nodes: Record<string, THREE.Mesh>;
  };

  // Group references for physics & kinematics
  const robotTravelGroupRef = useRef<THREE.Group>(null);
  const leftArmGroupRef = useRef<THREE.Group>(null);
  const rightArmGroupRef = useRef<THREE.Group>(null);

  // Live state refs
  const crankAngleRef = useRef(0);
  const travelXRef = useRef(0);
  const travelDirectionRef = useRef(1); // 1 = forward (+X), -1 = reverse (-X)

  // Calibrated Height and Alignment:
  // Rope is placed high above the floor so the robot hangs with generous clearance!
  // Floor is at Y = -0.85. ROPE_Y = 2.20.
  // Feet bottom is at 2.18 - 1.70 = +0.48 (gap = 1.33 units above floor!).
  const ROPE_Y = 2.20;
  // Hook apex Z is centered at Z = 0.039, so the cable runs directly inside the hook curvature!
  const ROPE_Z = 0.039;
  const ROPE_SPAN = 9.0;
  const GROUND_Y = -0.85;

  const t = Math.max(0, Math.min(1, explosionLevel));

  // Customization styling tokens
  const chassisColor = customization?.ropewayChassisColor || "#0284c7";
  const armColor = customization?.ropewayArmColor || customization?.ropewayHookColor || "#eab308";
  const crankColor = customization?.ropewayCrankColor || customization?.ropewayPulleyColor || "#ea580c";
  const gearColor = "#d97706";
  const motorColor = "#475569";
  const batteryColor = "#1e293b";
  const footColor = "#334155";

  // Dynamic materials dictionary
  const materials = useMemo(() => {
    const isSelected = (id: string) => selectedComponent === id;
    const isGhost = (id: string) => isolatedComponent !== null && isolatedComponent !== id;

    const makeMat = (id: string, baseColor: string, metalness = 0.5, roughness = 0.4) => {
      if (isSelected(id)) {
        return new THREE.MeshStandardMaterial({
          color: "#38bdf8",
          emissive: "#0284c7",
          emissiveIntensity: 0.9,
          metalness: 0.8,
          roughness: 0.2,
        });
      }
      if (isGhost(id)) {
        return new THREE.MeshStandardMaterial({
          color: "#334155",
          transparent: true,
          opacity: 0.18,
          wireframe: true,
        });
      }
      return new THREE.MeshStandardMaterial({
        color: baseColor,
        metalness,
        roughness,
      });
    };

    return {
      chassis: makeMat("chassis", chassisColor, 0.55, 0.35),
      motor: makeMat("motor", motorColor, 0.85, 0.2),
      battery: makeMat("battery", batteryColor, 0.2, 0.7),
      "gearbox-cover": makeMat("gearbox-cover", "#0369a1", 0.6, 0.3),
      "left-arm": makeMat("left-arm", armColor, 0.65, 0.25),
      "right-arm": makeMat("right-arm", armColor, 0.65, 0.25),
      "left-crank": makeMat("left-crank", crankColor, 0.7, 0.25),
      "right-crank": makeMat("right-crank", crankColor, 0.7, 0.25),
      "left-gear": makeMat("left-gear", gearColor, 0.85, 0.2),
      "right-gear": makeMat("right-gear", gearColor, 0.85, 0.2),
      "left-foot": makeMat("left-foot", footColor, 0.5, 0.45),
      "right-foot": makeMat("right-foot", footColor, 0.5, 0.45),
    };
  }, [
    selectedComponent,
    isolatedComponent,
    chassisColor,
    armColor,
    crankColor,
    gearColor,
    motorColor,
    batteryColor,
    footColor,
  ]);

  // Clean kinematic climbing loop
  // Human-like alternating climbing walk gait:
  // Step 1: Hand 1 is planted ON the rope (gripping, pulling forward).
  // Step 2: Hand 2 is lifted UP IN THE AIR, swinging forward through the air.
  // Step 3: Hand 2 plants ON the rope, and Hand 1 lifts UP IN THE AIR and swings forward.
  // Screws, chassis, motor, battery, and gearbox remain solidly assembled!
  useFrame((_, delta) => {
    const isRunning = simulation?.running ?? true;
    const speedPct = simulation?.speedPct ?? 65;
    const targetDir = simulation?.direction === "reverse" ? -1 : 1;

    // Sped-up kinematic cadence & brisk horizontal traversal
    const radPerSec = (speedPct / 100) * 14.0; // Sped up from 6.0 to 14.0
    const linearSpeed = (speedPct / 100) * 0.85; // Sped up from 0.35 to 0.85 m/s

    if (isRunning && t < 0.05) {
      crankAngleRef.current += delta * radPerSec * targetDir;
      const cycle = crankAngleRef.current;

      // Calculate 180° out-of-phase gait cycles for both arms
      // phase in [0, 2*PI): [0, PI] = STANCE (on rope), (PI, 2*PI) = SWING (in air)
      const phaseL = ((cycle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      const phaseR = (((cycle + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

      const SWING_AMPLITUDE = 0.16; // Forward/backward arm stride (~9 degrees)
      const LIFT_HEIGHT = 0.065; // Height lifted above rope into the air

      // -------------------------------------------------------------
      // 1. LEFT ARM GAIT SOLVER
      // -------------------------------------------------------------
      if (leftArmGroupRef.current) {
        if (phaseL <= Math.PI) {
          // Stance Phase: Hand is planted firmly ON THE ROPE
          // Pulls chassis forward by swinging from +SWING down to -SWING
          const stride = Math.cos(phaseL) * SWING_AMPLITUDE;
          leftArmGroupRef.current.rotation.z = stride;
          leftArmGroupRef.current.rotation.x = 0;
          leftArmGroupRef.current.position.set(
            PART_DEFS[4].basePos[0],
            PART_DEFS[4].basePos[1], // Exact rope height, 0 air lift
            PART_DEFS[4].basePos[2]
          );
        } else {
          // Swing Phase: Hand releases and lifts UP IN THE AIR!
          // Swings forward through the air, then descends to plant on the rope
          const alpha = phaseL - Math.PI; // [0, PI]
          const yLift = Math.sin(alpha) * LIFT_HEIGHT; // Parabolic lift into air
          const stride = -Math.cos(alpha) * SWING_AMPLITUDE; // Reaching forward
          const flareOut = -Math.sin(alpha) * 0.045; // Clears the cable cleanly

          leftArmGroupRef.current.rotation.z = stride;
          leftArmGroupRef.current.rotation.x = flareOut;
          leftArmGroupRef.current.position.set(
            PART_DEFS[4].basePos[0],
            PART_DEFS[4].basePos[1] + yLift, // Visibly up in the air!
            PART_DEFS[4].basePos[2]
          );
        }
      }

      // -------------------------------------------------------------
      // 2. RIGHT ARM GAIT SOLVER (180° OPPOSING OFFSET)
      // -------------------------------------------------------------
      if (rightArmGroupRef.current) {
        if (phaseR <= Math.PI) {
          // Stance Phase: Hand is planted firmly ON THE ROPE
          const stride = Math.cos(phaseR) * SWING_AMPLITUDE;
          rightArmGroupRef.current.rotation.z = stride;
          rightArmGroupRef.current.rotation.x = 0;
          rightArmGroupRef.current.position.set(
            PART_DEFS[5].basePos[0],
            PART_DEFS[5].basePos[1], // Exact rope height, 0 air lift
            PART_DEFS[5].basePos[2]
          );
        } else {
          // Swing Phase: Hand releases and lifts UP IN THE AIR!
          const alpha = phaseR - Math.PI;
          const yLift = Math.sin(alpha) * LIFT_HEIGHT;
          const stride = -Math.cos(alpha) * SWING_AMPLITUDE;
          const flareOut = Math.sin(alpha) * 0.045;

          rightArmGroupRef.current.rotation.z = stride;
          rightArmGroupRef.current.rotation.x = flareOut;
          rightArmGroupRef.current.position.set(
            PART_DEFS[5].basePos[0],
            PART_DEFS[5].basePos[1] + yLift, // Visibly up in the air!
            PART_DEFS[5].basePos[2]
          );
        }
      }

      // -------------------------------------------------------------
      // 3. HORIZONTAL TRAVERSAL ALONG THE SUSPENDED ROPE
      // -------------------------------------------------------------
      travelXRef.current += targetDir * linearSpeed * delta;

      // End bumper stops between -4.5m and +4.5m
      const MAX_X = 4.5;
      if (travelXRef.current > MAX_X) {
        travelXRef.current = MAX_X;
        travelDirectionRef.current = -1;
      } else if (travelXRef.current < -MAX_X) {
        travelXRef.current = -MAX_X;
        travelDirectionRef.current = 1;
      }

      // -------------------------------------------------------------
      // 4. BALANCED LEVEL CARRIAGE UNDER THE ROPE
      // -------------------------------------------------------------
      if (robotTravelGroupRef.current) {
        robotTravelGroupRef.current.position.x = travelXRef.current;
        robotTravelGroupRef.current.rotation.set(0, 0, 0); // No disbalance or tipping
      }
    } else if (t >= 0.05) {
      // In exploded view, reset dynamic rotations so all parts explode cleanly
      if (leftArmGroupRef.current) {
        leftArmGroupRef.current.rotation.set(0, 0, 0);
        leftArmGroupRef.current.position.set(
          PART_DEFS[4].basePos[0] + PART_DEFS[4].explodeVec[0] * t * 1.4,
          PART_DEFS[4].basePos[1] + PART_DEFS[4].explodeVec[1] * t * 1.4,
          PART_DEFS[4].basePos[2] + PART_DEFS[4].explodeVec[2] * t * 1.4
        );
      }
      if (rightArmGroupRef.current) {
        rightArmGroupRef.current.rotation.set(0, 0, 0);
        rightArmGroupRef.current.position.set(
          PART_DEFS[5].basePos[0] + PART_DEFS[5].explodeVec[0] * t * 1.4,
          PART_DEFS[5].basePos[1] + PART_DEFS[5].explodeVec[1] * t * 1.4,
          PART_DEFS[5].basePos[2] + PART_DEFS[5].explodeVec[2] * t * 1.4
        );
      }
      if (robotTravelGroupRef.current) {
        robotTravelGroupRef.current.rotation.set(0, 0, 0);
      }
    }
  });

  // Calculate pylon tower dimensions from ground (Y = -0.85) up to cable (Y = 2.20)
  const pylonHeight = (ROPE_Y + 0.25) - GROUND_Y;
  const pylonCenterY = GROUND_Y + pylonHeight / 2;

  return (
    <group name="AeroClimbRobotScene">
      {/* ================================================================= */}
      {/* 1. SUSPENDED HORIZONTAL STEEL ROPE & HIGH-CLEARANCE PYLONS        */}
      {/* ================================================================= */}
      {showCable && (
        <group name="OverheadCableway">
          {/* Main Horizontal Tensioned Braided Steel Cable */}
          {/* Positioned at ROPE_Y = 2.20, ROPE_Z = 0.039 to pass precisely through hook grooves */}
          <mesh position={[0, ROPE_Y, ROPE_Z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.014, 0.014, ROPE_SPAN * 2, 32]} />
            <meshStandardMaterial
              color="#94a3b8"
              metalness={0.92}
              roughness={0.2}
            />
          </mesh>

          {/* West Pylon Anchor Station (Left End-Stop) */}
          <group position={[-ROPE_SPAN, 0, ROPE_Z]}>
            {/* Structural High Tower Column from ground */}
            <mesh position={[0, pylonCenterY, 0]}>
              <cylinderGeometry args={[0.07, 0.11, pylonHeight, 16]} />
              <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* Heavy Base Flange on floor */}
            <mesh position={[0, GROUND_Y + 0.06, 0]}>
              <cylinderGeometry args={[0.28, 0.32, 0.12, 16]} />
              <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.4} />
            </mesh>
            {/* Cable Tensioner Turnbuckle */}
            <mesh position={[0.22, ROPE_Y, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.035, 0.035, 0.4, 12]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.85} roughness={0.25} />
            </mesh>
            {/* Industrial Safety End-Stop Bumper */}
            <mesh position={[0.48, ROPE_Y, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.065, 0.065, 0.12, 16]} />
              <meshStandardMaterial color="#ef4444" roughness={0.9} />
            </mesh>
          </group>

          {/* East Pylon Anchor Station (Right End-Stop) */}
          <group position={[ROPE_SPAN, 0, ROPE_Z]}>
            {/* Structural High Tower Column from ground */}
            <mesh position={[0, pylonCenterY, 0]}>
              <cylinderGeometry args={[0.07, 0.11, pylonHeight, 16]} />
              <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* Heavy Base Flange on floor */}
            <mesh position={[0, GROUND_Y + 0.06, 0]}>
              <cylinderGeometry args={[0.28, 0.32, 0.12, 16]} />
              <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.4} />
            </mesh>
            {/* Cable Tensioner Turnbuckle */}
            <mesh position={[-0.22, ROPE_Y, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.035, 0.035, 0.4, 12]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.85} roughness={0.25} />
            </mesh>
            {/* Industrial Safety End-Stop Bumper */}
            <mesh position={[-0.48, ROPE_Y, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.065, 0.065, 0.12, 16]} />
              <meshStandardMaterial color="#ef4444" roughness={0.9} />
            </mesh>
          </group>
        </group>
      )}

      {/* ================================================================= */}
      {/* 2. THE ASSEMBLED / EXPLODING ROPE CLIMBING ROBOT                   */}
      {/* ================================================================= */}
      {/* Robot carriage is positioned at ROPE_Y - 0.02 so the hook sits snugly over the rope */}
      <group
        ref={robotTravelGroupRef}
        position={[0, ROPE_Y - 0.02, 0]}
        name="RobotCarriage"
      >
        {PART_DEFS.map((part) => {
          if (hiddenComponents.includes(part.id)) return null;

          // Compute interpolated exploded position
          const explodeFactor = t * 1.4;
          const px = part.basePos[0] + part.explodeVec[0] * explodeFactor;
          const py = part.basePos[1] + part.explodeVec[1] * explodeFactor;
          const pz = part.basePos[2] + part.explodeVec[2] * explodeFactor;

          // Get node geometry from user's CAD model
          const meshNode = nodes[part.nodeName];
          if (!meshNode) return null;

          // Assign kinematic refs for the articulating arms only
          let specificRef: React.RefObject<THREE.Group | null> | null = null;
          if (part.nodeName === "left_arm") specificRef = leftArmGroupRef;
          else if (part.nodeName === "right_arm") specificRef = rightArmGroupRef;

          const partMat = materials[part.id as keyof typeof materials];

          return (
            <group
              key={part.id}
              ref={specificRef}
              position={[px, py, pz]}
              name={`Part_${part.id}`}
            >
              {/* Actual Authentic CAD Mesh */}
              <mesh
                geometry={meshNode.geometry}
                material={partMat}
                castShadow
                receiveShadow
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(part.id);
                }}
                onPointerOver={(e) => {
                  e.stopPropagation();
                  document.body.style.cursor = "pointer";
                }}
                onPointerOut={(e) => {
                  e.stopPropagation();
                  document.body.style.cursor = "auto";
                }}
              />

              {/* Exploded View Connecting Guide Lines */}
              {t > 0.08 && (part.explodeVec[0] !== 0 || part.explodeVec[1] !== 0 || part.explodeVec[2] !== 0) && (
                <line>
                  <bufferGeometry
                    attach="geometry"
                    onUpdate={(self) => {
                      const points = [
                        new THREE.Vector3(0, 0, 0),
                        new THREE.Vector3(
                          -part.explodeVec[0] * explodeFactor,
                          -part.explodeVec[1] * explodeFactor,
                          -part.explodeVec[2] * explodeFactor
                        ),
                      ];
                      self.setFromPoints(points);
                    }}
                  />
                  <lineDashedMaterial
                    attach="material"
                    color="#38bdf8"
                    dashSize={0.06}
                    gapSize={0.03}
                    transparent
                    opacity={0.65}
                  />
                </line>
              )}
            </group>
          );
        })}
      </group>
    </group>
  );
}
