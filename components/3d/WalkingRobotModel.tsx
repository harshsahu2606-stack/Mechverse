"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CustomizationSettings, RobotSimulationState } from "@/types/machine";

interface WalkingRobotModelProps {
  customization: CustomizationSettings;
  explosionLevel: number; // 0 to 1
  selectedComponent: string | null;
  isolatedComponent: string | null;
  hiddenComponents: string[];
  simulation: RobotSimulationState;
  onSelect: (componentId: string) => void;
}

// ============================================================================
// EXACT ANALYTICAL FOUR-BAR CRANK-ROCKER KINEMATIC SOLVER
// Circle-Circle Intersection between Hip-Rocker Circle and Con-Rod Circle
// ============================================================================
const Y_MOTOR = 0.22;
const Z_MOTOR = 0.08;
const Y_HIP = 0.58;
const Z_HIP = -0.02;

const R_CRANK = 0.16;   // 15mm crank radius in model units
const L_ROD = 0.38;     // 45mm connecting rod hole-to-hole pitch
const L_KNEE = 0.26;    // 32mm hip-to-knee rocker link
const L_LEG = 0.72;     // 85mm hip-to-foot total length

function solveKinematicLinkage(theta: number) {
  // 1. Orbital position of Crank Pin in Y-Z plane
  const yCp = Y_MOTOR + R_CRANK * Math.sin(theta);
  const zCp = Z_MOTOR + R_CRANK * Math.cos(theta);

  // 2. Vector from Hip pivot to Crank Pin
  const dy = yCp - Y_HIP;
  const dz = zCp - Z_HIP;
  const d = Math.sqrt(dy * dy + dz * dz);

  // Normalized unit vector from Hip to Crank Pin
  const uy = dy / d;
  const uz = dz / d;

  // Circle-circle intersection chord distance from Hip
  const a = (L_KNEE * L_KNEE - L_ROD * L_ROD + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, L_KNEE * L_KNEE - a * a));

  // Normal vector perpendicular to Hip->Crank vector (-uz, uy)
  const ny = -uz;
  const nz = uy;

  // Chord midpoint
  const y0 = Y_HIP + a * uy;
  const z0 = Z_HIP + a * uz;

  // Knee Joint Pin coordinate (+h branch gives the forward/lower rocker branch)
  const yKnee = y0 + h * ny;
  const zKnee = z0 + h * nz;

  // Rocker arm rotation angle about Hip axle in Y-Z plane
  // When hanging vertically straight down, deltaY = -L_KNEE, deltaZ = 0.
  const legAngle = Math.atan2(zKnee - Z_HIP, -(yKnee - Y_HIP));

  // Connecting rod center and orientation
  const rodMidY = (yCp + yKnee) / 2;
  const rodMidZ = (zCp + zKnee) / 2;
  const rodAngle = Math.atan2(zKnee - zCp, -(yKnee - yCp));

  // Foot tip coordinate along rigid leg rocker extension
  const kLeg = L_LEG / L_KNEE;
  const yFoot = Y_HIP + kLeg * (yKnee - Y_HIP);
  const zFoot = Z_HIP + kLeg * (zKnee - Z_HIP);

  return {
    yCp,
    zCp,
    yKnee,
    zKnee,
    rodMidY,
    rodMidZ,
    legAngle,
    rodAngle,
    yFoot,
    zFoot,
  };
}

export default function WalkingRobotModel({
  customization,
  explosionLevel,
  selectedComponent,
  isolatedComponent,
  hiddenComponents,
  simulation,
  onSelect,
}: WalkingRobotModelProps) {
  // References for kinematic motion
  const rootGroupRef = useRef<THREE.Group>(null);
  const leftCrankRef = useRef<THREE.Group>(null);
  const rightCrankRef = useRef<THREE.Group>(null);
  const leftConRodRef = useRef<THREE.Group>(null);
  const rightConRodRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);

  // References for exploded view lerping
  const chassisRef = useRef<THREE.Group>(null);
  const stanchionsRef = useRef<THREE.Group>(null);
  const motorRef = useRef<THREE.Group>(null);
  const batteryRef = useRef<THREE.Group>(null);
  const switchRef = useRef<THREE.Group>(null);
  const hardwareRef = useRef<THREE.Group>(null);

  // Simulation accumulator
  const crankAngleRef = useRef(0);
  const forwardZRef = useRef(0);

  // High-fidelity materials
  const materials = useMemo(() => {
    // Chassis material selection
    let chassisColor = "#1e293b";
    let chassisRoughness = 0.25;
    let chassisMetalness = 0.15;
    if (customization.robotChassisMaterial === "cardboard") {
      chassisColor = "#b45309";
      chassisRoughness = 0.85;
      chassisMetalness = 0.05;
    } else if (customization.robotChassisMaterial === "plywood") {
      chassisColor = "#d97706";
      chassisRoughness = 0.65;
      chassisMetalness = 0.08;
    } else if (customization.robotChassisMaterial === "3dprint") {
      chassisColor = "#dc2626";
      chassisRoughness = 0.4;
      chassisMetalness = 0.2;
    } else if (customization.paintColor) {
      chassisColor = customization.paintColor;
    }

    // Leg material selection
    let legColor = "#d97706"; // Birch / Popsicle stick
    let legRoughness = 0.7;
    let legMetalness = 0.05;
    if (customization.robotLegMaterial === "acrylic") {
      legColor = "#0284c7";
      legRoughness = 0.2;
      legMetalness = 0.25;
    } else if (customization.robotLegMaterial === "aluminum") {
      legColor = "#cbd5e1";
      legRoughness = 0.25;
      legMetalness = 0.92;
    }

    // Foot grip material
    const gripColor = customization.robotFootGrip === "glue" ? "#e2e8f0" : "#18181b";

    return {
      chassis: new THREE.MeshStandardMaterial({
        color: chassisColor,
        roughness: chassisRoughness,
        metalness: chassisMetalness,
      }),
      stanchion: new THREE.MeshStandardMaterial({
        color: chassisColor,
        roughness: chassisRoughness,
        metalness: chassisMetalness,
      }),
      boMotorYellow: new THREE.MeshStandardMaterial({
        color: "#eab308", // Industrial BO Motor Yellow
        roughness: 0.35,
        metalness: 0.15,
      }),
      motorCanSteel: new THREE.MeshStandardMaterial({
        color: "#94a3b8",
        roughness: 0.22,
        metalness: 0.95,
      }),
      shaftWhite: new THREE.MeshStandardMaterial({
        color: "#f8fafc",
        roughness: 0.3,
        metalness: 0.15,
      }),
      crankPlastic: new THREE.MeshStandardMaterial({
        color: "#f97316", // High-visibility orange crank arms
        roughness: 0.35,
        metalness: 0.2,
      }),
      linkages: new THREE.MeshStandardMaterial({
        color: legColor,
        roughness: legRoughness,
        metalness: legMetalness,
      }),
      conRods: new THREE.MeshStandardMaterial({
        color: "#38bdf8", // Sky blue coupler links
        roughness: 0.3,
        metalness: 0.45,
      }),
      batteryBox: new THREE.MeshStandardMaterial({
        color: "#18181b",
        roughness: 0.6,
        metalness: 0.1,
      }),
      cellAA: new THREE.MeshStandardMaterial({
        color: "#0284c7",
        roughness: 0.25,
        metalness: 0.8,
      }),
      cellTerminal: new THREE.MeshStandardMaterial({
        color: "#e2e8f0",
        roughness: 0.15,
        metalness: 0.98,
      }),
      switchBody: new THREE.MeshStandardMaterial({
        color: "#09090b",
        roughness: 0.5,
        metalness: 0.1,
      }),
      switchRocker: new THREE.MeshStandardMaterial({
        color: "#ef4444",
        roughness: 0.3,
        metalness: 0.2,
      }),
      hardware: new THREE.MeshStandardMaterial({
        color: "#e2e8f0",
        roughness: 0.2,
        metalness: 0.95,
      }),
      nylonWasher: new THREE.MeshStandardMaterial({
        color: "#f1f5f9",
        roughness: 0.4,
        metalness: 0.05,
      }),
      rubberGrip: new THREE.MeshStandardMaterial({
        color: gripColor,
        roughness: 0.92,
        metalness: 0.05,
      }),
      wireRed: new THREE.MeshStandardMaterial({
        color: "#ef4444",
        roughness: 0.5,
        metalness: 0.1,
      }),
      wireBlack: new THREE.MeshStandardMaterial({
        color: "#18181b",
        roughness: 0.5,
        metalness: 0.1,
      }),
      highlight: new THREE.MeshStandardMaterial({
        color: "#38bdf8",
        emissive: new THREE.Color("#0284c7"),
        emissiveIntensity: 0.8,
        roughness: 0.2,
        metalness: 0.6,
      }),
    };
  }, [customization]);

  const isVisible = (id: string) => {
    if (hiddenComponents.includes(id)) return false;
    if (isolatedComponent && isolatedComponent !== id) return false;
    return true;
  };

  const getMat = (id: string, defaultMat: THREE.Material) => {
    return selectedComponent === id ? materials.highlight : defaultMat;
  };

  const handlePointer = (id: string, e: any) => {
    e.stopPropagation?.();
    onSelect(id);
  };

  // ==========================================================================
  // SIMULATION TICK LOOP: ANALYTICAL KINEMATICS & GROUND-CONTACT SOLVER
  // ==========================================================================
  useFrame((_, delta) => {
    // 1. Calculate Crank Angular Velocity (rad/s)
    let speedRadS = 0;
    if (simulation.walking) {
      if (simulation.speed === "slow") {
        speedRadS = Math.PI; // 30 RPM = 3.14 rad/s
      } else if (simulation.speed === "fast") {
        speedRadS = 4 * Math.PI; // 120 RPM = 12.57 rad/s
      } else {
        speedRadS = 2 * Math.PI; // 60 RPM = 6.28 rad/s (Normal)
      }
    }

    crankAngleRef.current += speedRadS * delta;
    const thetaL = crankAngleRef.current;
    const thetaR = crankAngleRef.current + Math.PI; // Exact 180° anti-phase offset

    // 2. Solve closed 4-bar geometry for Left & Right legs
    const kLeft = solveKinematicLinkage(thetaL);
    const kRight = solveKinematicLinkage(thetaR);

    // 3. Update Left Kinematics
    if (leftCrankRef.current) {
      leftCrankRef.current.rotation.x = thetaL;
    }
    if (leftConRodRef.current) {
      leftConRodRef.current.position.set(0.52, kLeft.rodMidY, kLeft.rodMidZ);
      leftConRodRef.current.rotation.x = kLeft.rodAngle;
    }
    if (leftLegRef.current) {
      leftLegRef.current.rotation.x = kLeft.legAngle;
    }

    // 4. Update Right Kinematics
    if (rightCrankRef.current) {
      rightCrankRef.current.rotation.x = thetaR;
    }
    if (rightConRodRef.current) {
      rightConRodRef.current.position.set(-0.52, kRight.rodMidY, kRight.rodMidZ);
      rightConRodRef.current.rotation.x = kRight.rodAngle;
    }
    if (rightLegRef.current) {
      rightLegRef.current.rotation.x = kRight.legAngle;
    }

    // 5. Forward Locomotion Advancement
    if (simulation.walking && simulation.forwardMovement) {
      // Linear velocity = Stride Length (28mm) * (Crank RPM / 60)
      const strideAdvancePerSec = (speedRadS / (2 * Math.PI)) * 0.28;
      forwardZRef.current += strideAdvancePerSec * delta;
      // Loop over walking track (-3.0m to +3.0m)
      if (forwardZRef.current > 3.0) {
        forwardZRef.current = -3.0;
      }
    } else if (!simulation.forwardMovement) {
      forwardZRef.current = THREE.MathUtils.lerp(forwardZRef.current, 0, 1 - Math.exp(-delta * 5));
    }

    // 6. Rhythmic Walking Sway & Stance Stabilization
    if (rootGroupRef.current) {
      rootGroupRef.current.position.z = forwardZRef.current;
      if (simulation.walking) {
        // Subtle vertical bobbing (2mm) and roll sway (±1.5°) as stance shifts
        const bob = Math.abs(Math.sin(crankAngleRef.current)) * 0.015;
        const roll = Math.sin(crankAngleRef.current) * 0.02;
        rootGroupRef.current.position.y = -0.15 + bob;
        rootGroupRef.current.rotation.z = roll;
      } else {
        rootGroupRef.current.position.y = -0.15;
        rootGroupRef.current.rotation.z = 0;
      }
    }

    // 7. Exploded View Lerping along Physical Vectors
    const t = explosionLevel;
    const lerpRate = 1 - Math.exp(-delta * 6);

    if (motorRef.current) {
      motorRef.current.position.y = THREE.MathUtils.lerp(motorRef.current.position.y, 0.22 + t * 0.6, lerpRate);
    }
    if (stanchionsRef.current) {
      stanchionsRef.current.position.y = THREE.MathUtils.lerp(stanchionsRef.current.position.y, t * 0.35, lerpRate);
    }
    if (batteryRef.current) {
      batteryRef.current.position.y = THREE.MathUtils.lerp(batteryRef.current.position.y, 0.24 + t * 0.65, lerpRate);
      batteryRef.current.position.z = THREE.MathUtils.lerp(batteryRef.current.position.z, -0.42 - t * 0.75, lerpRate);
    }
    if (switchRef.current) {
      switchRef.current.position.y = THREE.MathUtils.lerp(switchRef.current.position.y, 0.38 + t * 0.85, lerpRate);
    }
    if (leftCrankRef.current) {
      leftCrankRef.current.position.x = THREE.MathUtils.lerp(leftCrankRef.current.position.x, 0.44 + t * 0.8, lerpRate);
    }
    if (rightCrankRef.current) {
      rightCrankRef.current.position.x = THREE.MathUtils.lerp(rightCrankRef.current.position.x, -0.44 - t * 0.8, lerpRate);
    }
    if (leftLegRef.current) {
      leftLegRef.current.position.x = THREE.MathUtils.lerp(leftLegRef.current.position.x, 0.64 + t * 1.3, lerpRate);
    }
    if (rightLegRef.current) {
      rightLegRef.current.position.x = THREE.MathUtils.lerp(rightLegRef.current.position.x, -0.64 - t * 1.3, lerpRate);
    }
  });

  return (
    <group ref={rootGroupRef} position={[0, -0.15, 0]} scale={1.35}>
      {/* ================= 1. CHASSIS BASEPLATE ================= */}
      {isVisible("chassis-plate") && (
        <group
          ref={chassisRef}
          position={[0, 0.18, 0]}
          onClick={(e) => handlePointer("chassis-plate", e)}
        >
          {/* Main Horizontal Flat Chassis Plate (110mm x 60mm x 3mm) */}
          <mesh castShadow receiveShadow material={getMat("chassis-plate", materials.chassis)}>
            <boxGeometry args={[0.72, 0.035, 1.25]} />
          </mesh>

          {/* Motor Mounting Cutout / Recess in Center */}
          <mesh position={[0, 0.02, 0.08]} material={materials.chassis}>
            <boxGeometry args={[0.42, 0.015, 0.48]} />
          </mesh>

          {/* Rear Battery Cradle Mounting Screws */}
          {[-0.18, 0.18].map((x) => (
            <mesh key={x} position={[x, -0.02, -0.42]} material={getMat("hardware-fasteners", materials.hardware)}>
              <cylinderGeometry args={[0.015, 0.015, 0.05, 12]} />
            </mesh>
          ))}
        </group>
      )}

      {/* ================= 2. HIP PIVOT STANCHION BRACKETS ================= */}
      {isVisible("chassis-stanchions") && (
        <group
          ref={stanchionsRef}
          position={[0, 0, 0]}
          onClick={(e) => handlePointer("chassis-stanchions", e)}
        >
          {/* Left Vertical Upright Stanchion Post (Slim & Open) */}
          <group position={[0.36, 0.38, -0.02]}>
            <mesh castShadow material={getMat("chassis-stanchions", materials.stanchion)}>
              <boxGeometry args={[0.04, 0.42, 0.14]} />
            </mesh>
            {/* Lower Gusset Stiffener at 45° */}
            <mesh position={[-0.04, -0.12, 0]} rotation={[0, 0, 0.4]} material={materials.stanchion}>
              <boxGeometry args={[0.03, 0.18, 0.12]} />
            </mesh>
          </group>

          {/* Right Vertical Upright Stanchion Post */}
          <group position={[-0.36, 0.38, -0.02]}>
            <mesh castShadow material={getMat("chassis-stanchions", materials.stanchion)}>
              <boxGeometry args={[0.04, 0.42, 0.14]} />
            </mesh>
            <mesh position={[0.04, -0.12, 0]} rotation={[0, 0, -0.4]} material={materials.stanchion}>
              <boxGeometry args={[0.03, 0.18, 0.12]} />
            </mesh>
          </group>

          {/* Hip Crossbar Axle (Smooth Silver Steel Shaft) */}
          <mesh
            position={[0, Y_HIP, Z_HIP]}
            rotation={[0, 0, Math.PI / 2]}
            material={getMat("hardware-fasteners", materials.hardware)}
            onClick={(e) => handlePointer("hardware-fasteners", e)}
          >
            <cylinderGeometry args={[0.022, 0.022, 1.36, 16]} />
          </mesh>

          {/* Retaining Circlips / End Nuts on Hip Axle */}
          {[-0.67, 0.67].map((x) => (
            <mesh key={x} position={[x, Y_HIP, Z_HIP]} rotation={[0, 0, Math.PI / 2]} material={materials.hardware}>
              <cylinderGeometry args={[0.035, 0.035, 0.03, 16]} />
            </mesh>
          ))}
        </group>
      )}

      {/* ================= 3. BO GEARED DC MOTOR ================= */}
      {isVisible("bo-motor") && (
        <group
          ref={motorRef}
          position={[0, Y_MOTOR, Z_MOTOR]}
          onClick={(e) => handlePointer("bo-motor", e)}
        >
          {/* Yellow Spur Reduction Gearbox Housing */}
          <mesh castShadow material={getMat("bo-motor", materials.boMotorYellow)}>
            <boxGeometry args={[0.44, 0.28, 0.42]} />
          </mesh>

          {/* Cylindrical DC Motor Can at Rear */}
          <mesh
            position={[0, 0, -0.32]}
            rotation={[Math.PI / 2, 0, 0]}
            material={materials.motorCanSteel}
          >
            <cylinderGeometry args={[0.11, 0.11, 0.28, 24]} />
          </mesh>

          {/* Dual Output Shafts (White Nylon D-Shafts) */}
          <mesh rotation={[0, 0, Math.PI / 2]} material={materials.shaftWhite}>
            <cylinderGeometry args={[0.035, 0.035, 0.86, 16]} />
          </mesh>

          {/* Motor Mounting Screws (M3 x 30mm Through-Bolts) */}
          {[-0.14, 0.14].map((x) => (
            <group key={x} position={[x, -0.06, 0]}>
              <mesh material={getMat("hardware-fasteners", materials.hardware)}>
                <cylinderGeometry args={[0.015, 0.015, 0.28, 12]} />
              </mesh>
              {/* Top hex head */}
              <mesh position={[0, 0.15, 0]} material={materials.hardware}>
                <cylinderGeometry args={[0.028, 0.028, 0.02, 6]} />
              </mesh>
            </group>
          ))}

          {/* Brass Motor Solder Terminals */}
          {[-0.06, 0.06].map((x) => (
            <mesh key={x} position={[x, 0.08, -0.46]} material={materials.hardware}>
              <boxGeometry args={[0.02, 0.04, 0.06]} />
            </mesh>
          ))}
        </group>
      )}

      {/* ================= 4. DUAL DRIVE CRANKS (180° OFFSET) ================= */}
      {isVisible("crank-mechanism") && (
        <>
          {/* Left Drive Crank (0° Phase) */}
          <group
            ref={leftCrankRef}
            position={[0.44, Y_MOTOR, Z_MOTOR]}
            onClick={(e) => handlePointer("crank-mechanism", e)}
          >
            {/* Crank Disc / Arm keyed to shaft */}
            <mesh
              position={[0, 0.08, 0]}
              material={getMat("crank-mechanism", materials.crankPlastic)}
            >
              <boxGeometry args={[0.035, 0.24, 0.075]} />
            </mesh>
            {/* Center Shaft Collar */}
            <mesh rotation={[0, 0, Math.PI / 2]} material={materials.crankPlastic}>
              <cylinderGeometry args={[0.065, 0.065, 0.04, 16]} />
            </mesh>
            {/* Crank Pin at R = 0.16 (15mm radius) */}
            <mesh
              position={[0.035, R_CRANK, 0]}
              rotation={[0, 0, Math.PI / 2]}
              material={getMat("hardware-fasteners", materials.hardware)}
            >
              <cylinderGeometry args={[0.018, 0.018, 0.07, 12]} />
            </mesh>
            {/* Nylon Spacer Washer */}
            <mesh
              position={[0.02, R_CRANK, 0]}
              rotation={[0, 0, Math.PI / 2]}
              material={materials.nylonWasher}
            >
              <cylinderGeometry args={[0.032, 0.032, 0.015, 12]} />
            </mesh>
          </group>

          {/* Right Drive Crank (180° Anti-Phase) */}
          <group
            ref={rightCrankRef}
            position={[-0.44, Y_MOTOR, Z_MOTOR]}
            onClick={(e) => handlePointer("crank-mechanism", e)}
          >
            <mesh
              position={[0, 0.08, 0]}
              material={getMat("crank-mechanism", materials.crankPlastic)}
            >
              <boxGeometry args={[0.035, 0.24, 0.075]} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]} material={materials.crankPlastic}>
              <cylinderGeometry args={[0.065, 0.065, 0.04, 16]} />
            </mesh>
            {/* Crank Pin at R = 0.16 */}
            <mesh
              position={[-0.035, R_CRANK, 0]}
              rotation={[0, 0, Math.PI / 2]}
              material={getMat("hardware-fasteners", materials.hardware)}
            >
              <cylinderGeometry args={[0.018, 0.018, 0.07, 12]} />
            </mesh>
            <mesh
              position={[-0.02, R_CRANK, 0]}
              rotation={[0, 0, Math.PI / 2]}
              material={materials.nylonWasher}
            >
              <cylinderGeometry args={[0.032, 0.032, 0.015, 12]} />
            </mesh>
          </group>
        </>
      )}

      {/* ================= 5. CONNECTING RODS (COUPLER LINKS) ================= */}
      {isVisible("connecting-rods") && (
        <>
          {/* Left Connecting Rod (Spans from Left Crank Pin to Left Knee) */}
          <group
            ref={leftConRodRef}
            position={[0.52, Y_MOTOR, Z_MOTOR]}
            onClick={(e) => handlePointer("connecting-rods", e)}
          >
            {/* Central Link Bar (Length = 0.38) */}
            <mesh material={getMat("connecting-rods", materials.conRods)}>
              <boxGeometry args={[0.028, L_ROD, 0.055]} />
            </mesh>
            {/* Lower Eyelet (Crank Pin Bushing) */}
            <mesh
              position={[0, -L_ROD / 2, 0]}
              rotation={[0, 0, Math.PI / 2]}
              material={materials.conRods}
            >
              <cylinderGeometry args={[0.032, 0.032, 0.035, 16]} />
            </mesh>
            {/* Upper Eyelet (Knee Pin Bushing) */}
            <mesh
              position={[0, L_ROD / 2, 0]}
              rotation={[0, 0, Math.PI / 2]}
              material={materials.conRods}
            >
              <cylinderGeometry args={[0.032, 0.032, 0.035, 16]} />
            </mesh>
          </group>

          {/* Right Connecting Rod (Spans from Right Crank Pin to Right Knee) */}
          <group
            ref={rightConRodRef}
            position={[-0.52, Y_MOTOR, Z_MOTOR]}
            onClick={(e) => handlePointer("connecting-rods", e)}
          >
            <mesh material={getMat("connecting-rods", materials.conRods)}>
              <boxGeometry args={[0.028, L_ROD, 0.055]} />
            </mesh>
            <mesh
              position={[0, -L_ROD / 2, 0]}
              rotation={[0, 0, Math.PI / 2]}
              material={materials.conRods}
            >
              <cylinderGeometry args={[0.032, 0.032, 0.035, 16]} />
            </mesh>
            <mesh
              position={[0, L_ROD / 2, 0]}
              rotation={[0, 0, Math.PI / 2]}
              material={materials.conRods}
            >
              <cylinderGeometry args={[0.032, 0.032, 0.035, 16]} />
            </mesh>
          </group>
        </>
      )}

      {/* ================= 6. LEFT WALKING LEG ASSEMBLY ================= */}
      {isVisible("left-legs") && (
        <group
          ref={leftLegRef}
          position={[0.64, Y_HIP, Z_HIP]}
          onClick={(e) => handlePointer("left-legs", e)}
        >
          {/* Upper Hip Axle Bushing */}
          <mesh rotation={[0, 0, Math.PI / 2]} material={materials.hardware}>
            <cylinderGeometry args={[0.032, 0.032, 0.045, 16]} />
          </mesh>

          {/* Fore Leg Rocker Strut */}
          <group position={[0, -L_LEG / 2, 0.28]}>
            <mesh castShadow material={getMat("left-legs", materials.linkages)}>
              <boxGeometry args={[0.03, L_LEG, 0.075]} />
            </mesh>

            {/* Fore Rubber Footpad */}
            {isVisible("rubber-feet") && (
              <mesh
                position={[0, -L_LEG / 2 - 0.02, 0]}
                material={getMat("rubber-feet", materials.rubberGrip)}
                onClick={(e) => handlePointer("rubber-feet", e)}
              >
                <boxGeometry args={[0.065, 0.04, 0.16]} />
              </mesh>
            )}
          </group>

          {/* Rear Leg Rocker Strut */}
          <group position={[0, -L_LEG / 2, -0.28]}>
            <mesh castShadow material={getMat("left-legs", materials.linkages)}>
              <boxGeometry args={[0.03, L_LEG, 0.075]} />
            </mesh>

            {/* Rear Rubber Footpad */}
            {isVisible("rubber-feet") && (
              <mesh
                position={[0, -L_LEG / 2 - 0.02, 0]}
                material={getMat("rubber-feet", materials.rubberGrip)}
                onClick={(e) => handlePointer("rubber-feet", e)}
              >
                <boxGeometry args={[0.065, 0.04, 0.16]} />
              </mesh>
            )}
          </group>

          {/* Knee Pin connecting Con-Rod to Fore Leg at L_KNEE = 0.26 */}
          <mesh
            position={[-0.04, -L_KNEE, 0.08]}
            rotation={[0, 0, Math.PI / 2]}
            material={getMat("hardware-fasteners", materials.hardware)}
          >
            <cylinderGeometry args={[0.016, 0.016, 0.08, 12]} />
          </mesh>

          {/* Longitudinal Synchronization Bar coupling Fore and Rear Struts */}
          <mesh position={[0, -0.32, 0]} material={materials.linkages}>
            <boxGeometry args={[0.03, 0.05, 0.62]} />
          </mesh>

          {/* Triangular Stiffening Truss Web */}
          <mesh position={[0, -0.16, 0]} rotation={[0.4, 0, 0]} material={materials.linkages}>
            <boxGeometry args={[0.028, 0.04, 0.44]} />
          </mesh>
        </group>
      )}

      {/* ================= 7. RIGHT WALKING LEG ASSEMBLY ================= */}
      {isVisible("right-legs") && (
        <group
          ref={rightLegRef}
          position={[-0.64, Y_HIP, Z_HIP]}
          onClick={(e) => handlePointer("right-legs", e)}
        >
          {/* Upper Hip Axle Bushing */}
          <mesh rotation={[0, 0, Math.PI / 2]} material={materials.hardware}>
            <cylinderGeometry args={[0.032, 0.032, 0.045, 16]} />
          </mesh>

          {/* Fore Leg Rocker Strut */}
          <group position={[0, -L_LEG / 2, 0.28]}>
            <mesh castShadow material={getMat("right-legs", materials.linkages)}>
              <boxGeometry args={[0.03, L_LEG, 0.075]} />
            </mesh>

            {/* Fore Rubber Footpad */}
            {isVisible("rubber-feet") && (
              <mesh
                position={[0, -L_LEG / 2 - 0.02, 0]}
                material={getMat("rubber-feet", materials.rubberGrip)}
                onClick={(e) => handlePointer("rubber-feet", e)}
              >
                <boxGeometry args={[0.065, 0.04, 0.16]} />
              </mesh>
            )}
          </group>

          {/* Rear Leg Rocker Strut */}
          <group position={[0, -L_LEG / 2, -0.28]}>
            <mesh castShadow material={getMat("right-legs", materials.linkages)}>
              <boxGeometry args={[0.03, L_LEG, 0.075]} />
            </mesh>

            {/* Rear Rubber Footpad */}
            {isVisible("rubber-feet") && (
              <mesh
                position={[0, -L_LEG / 2 - 0.02, 0]}
                material={getMat("rubber-feet", materials.rubberGrip)}
                onClick={(e) => handlePointer("rubber-feet", e)}
              >
                <boxGeometry args={[0.065, 0.04, 0.16]} />
              </mesh>
            )}
          </group>

          {/* Knee Pin connecting Con-Rod to Fore Leg at L_KNEE = 0.26 */}
          <mesh
            position={[0.04, -L_KNEE, 0.08]}
            rotation={[0, 0, Math.PI / 2]}
            material={getMat("hardware-fasteners", materials.hardware)}
          >
            <cylinderGeometry args={[0.016, 0.016, 0.08, 12]} />
          </mesh>

          {/* Longitudinal Synchronization Bar */}
          <mesh position={[0, -0.32, 0]} material={materials.linkages}>
            <boxGeometry args={[0.03, 0.05, 0.62]} />
          </mesh>

          {/* Triangular Stiffening Truss Web */}
          <mesh position={[0, -0.16, 0]} rotation={[0.4, 0, 0]} material={materials.linkages}>
            <boxGeometry args={[0.028, 0.04, 0.44]} />
          </mesh>
        </group>
      )}

      {/* ================= 8. BATTERY HOLDER (2x AA / 3.0V PACK) ================= */}
      {isVisible("battery-holder") && (
        <group
          ref={batteryRef}
          position={[0, 0.24, -0.42]}
          onClick={(e) => handlePointer("battery-holder", e)}
        >
          {/* Molded Battery Cradle Tray */}
          <mesh castShadow material={getMat("battery-holder", materials.batteryBox)}>
            <boxGeometry args={[0.54, 0.16, 0.52]} />
          </mesh>

          {/* 2x Cylindrical AA Battery Cells in Series */}
          {[-0.12, 0.12].map((x) => (
            <group key={x} position={[x, 0.06, 0]}>
              {/* Battery body cylinder */}
              <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.cellAA}>
                <cylinderGeometry args={[0.085, 0.085, 0.42, 20]} />
              </mesh>
              {/* Raised Positive Terminal Pip */}
              <mesh position={[0, 0, 0.22]} rotation={[Math.PI / 2, 0, 0]} material={materials.cellTerminal}>
                <cylinderGeometry args={[0.03, 0.03, 0.035, 16]} />
              </mesh>
              {/* Negative Coil Spring Terminal */}
              <mesh position={[0, 0, -0.22]} rotation={[Math.PI / 2, 0, 0]} material={materials.cellTerminal}>
                <cylinderGeometry args={[0.045, 0.045, 0.02, 12]} />
              </mesh>
            </group>
          ))}

          {/* Hookup Wires */}
          {/* Positive Red Wire from Battery (+) to Switch */}
          <mesh position={[0.18, 0.08, 0.22]} rotation={[0.25, 0, -0.15]} material={materials.wireRed}>
            <cylinderGeometry args={[0.01, 0.01, 0.45, 8]} />
          </mesh>
          {/* Negative Black Wire from Battery (-) to Motor */}
          <mesh position={[-0.18, 0.06, 0.18]} rotation={[0.35, 0, 0.12]} material={materials.wireBlack}>
            <cylinderGeometry args={[0.01, 0.01, 0.48, 8]} />
          </mesh>
        </group>
      )}

      {/* ================= 9. ROCKER SWITCH ================= */}
      {isVisible("rocker-switch") && (
        <group
          ref={switchRef}
          position={[0, 0.38, 0.45]}
          onClick={(e) => handlePointer("rocker-switch", e)}
        >
          {/* Mounting Bezel */}
          <mesh material={getMat("rocker-switch", materials.switchBody)}>
            <boxGeometry args={[0.18, 0.14, 0.12]} />
          </mesh>
          {/* Rocker Actuator Toggle (Tilts forward when power is active) */}
          <mesh
            position={[0, 0.05, 0]}
            rotation={[simulation.walking ? 0.22 : -0.22, 0, 0]}
            material={materials.switchRocker}
          >
            <boxGeometry args={[0.13, 0.06, 0.09]} />
          </mesh>
        </group>
      )}

      {/* ================= 10. HARDWARE FASTENERS COLLECTION ================= */}
      {isVisible("hardware-fasteners") && (
        <group
          ref={hardwareRef}
          onClick={(e) => handlePointer("hardware-fasteners", e)}
        >
          {/* Baseplate Mounting Hardware Pins */}
          {[-0.28, 0.28].map((x) =>
            [-0.35, 0.35].map((z) => (
              <mesh
                key={`${x}-${z}`}
                position={[x, 0.2, z]}
                material={getMat("hardware-fasteners", materials.hardware)}
              >
                <cylinderGeometry args={[0.014, 0.014, 0.04, 10]} />
              </mesh>
            ))
          )}
        </group>
      )}
    </group>
  );
}
