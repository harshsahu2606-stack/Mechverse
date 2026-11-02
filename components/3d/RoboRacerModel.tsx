"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CustomizationSettings } from "@/types/machine";

interface RoboRacerModelProps {
  customization?: Partial<CustomizationSettings>;
  explosionLevel: number; // 0 to 1
  selectedComponent: string | null;
  isolatedComponent: string | null;
  hiddenComponents: string[];
  onSelect: (componentId: string) => void;
  isDriving?: boolean;
  driveSpeed?: number; // -100 to 100
  steeringAngle?: number; // -45 to 45 degrees
  cameraPanAngle?: number; // -90 to 90 degrees
  hoodOpen?: boolean;
}

export default function RoboRacerModel({
  customization,
  explosionLevel,
  selectedComponent,
  isolatedComponent,
  hiddenComponents,
  onSelect,
  isDriving = false,
  driveSpeed = 0,
  steeringAngle = 0,
  cameraPanAngle = 0,
  hoodOpen = false,
}: RoboRacerModelProps) {
  const t = explosionLevel; // 0 (assembled) to 1 (fully exploded)

  // Wheel rotation refs
  const wheelFLRef = useRef<THREE.Group>(null);
  const wheelFRRef = useRef<THREE.Group>(null);
  const wheelRLRef = useRef<THREE.Group>(null);
  const wheelRRRef = useRef<THREE.Group>(null);

  // Front wheel steering refs
  const steerFLRef = useRef<THREE.Group>(null);
  const steerFRRef = useRef<THREE.Group>(null);

  // Camera swivel ref
  const cameraSwivelRef = useRef<THREE.Group>(null);
  // Gullwing hood ref
  const hoodRef = useRef<THREE.Group>(null);

  // Materials & Colors
  const bodyColor = customization?.roboRacerChassisColor || customization?.paintColor || "#17171c";
  const accentColor = customization?.roboRacerAccentColor || "#ca8a04"; // Amber / Golden brackets

  const finish = customization?.finish || "metallic";
  const finishRoughness = finish === "matte" ? 0.85 : finish === "metallic" ? 0.2 : 0.45;
  const finishMetalness = finish === "metallic" ? 0.85 : finish === "matte" ? 0.1 : 0.4;

  const materials = useMemo(() => {
    return {
      chassisBody: new THREE.MeshStandardMaterial({
        color: bodyColor,
        roughness: finishRoughness,
        metalness: finishMetalness,
      }),
      chassisMatte: new THREE.MeshStandardMaterial({
        color: "#18181b",
        roughness: 0.7,
        metalness: 0.2,
      }),
      grilleDark: new THREE.MeshStandardMaterial({
        color: "#09090b",
        roughness: 0.8,
        metalness: 0.1,
      }),
      bracketGold: new THREE.MeshStandardMaterial({
        color: accentColor, // Golden / Brass anodized metal
        roughness: 0.25,
        metalness: 0.85,
      }),
      motorCan: new THREE.MeshStandardMaterial({
        color: "#e2e8f0", // Silver chrome DC motor
        roughness: 0.2,
        metalness: 0.9,
      }),
      motorGearbox: new THREE.MeshStandardMaterial({
        color: "#eab308", // Yellow BO gearbox
        roughness: 0.5,
        metalness: 0.1,
      }),
      tireRubber: new THREE.MeshStandardMaterial({
        color: "#121214",
        roughness: 0.9,
        metalness: 0.05,
      }),
      wheelRim: new THREE.MeshStandardMaterial({
        color: "#27272a",
        roughness: 0.35,
        metalness: 0.5,
      }),
      wheelNut: new THREE.MeshStandardMaterial({
        color: "#a1a1aa",
        roughness: 0.2,
        metalness: 0.9,
      }),
      cameraBody: new THREE.MeshStandardMaterial({
        color: "#f8fafc", // White Hikvision housing
        roughness: 0.35,
        metalness: 0.15,
      }),
      cameraBezel: new THREE.MeshStandardMaterial({
        color: "#0f172a", // Dark front glass faceplate
        roughness: 0.15,
        metalness: 0.8,
      }),
      cameraLens: new THREE.MeshStandardMaterial({
        color: "#0284c7",
        roughness: 0.1,
        metalness: 0.9,
      }),
      cameraLed: new THREE.MeshBasicMaterial({
        color: "#22c55e", // Green camera active indicator
      }),
      servoBlue: new THREE.MeshStandardMaterial({
        color: "#0284c7", // SG90 translucent blue casing
        roughness: 0.3,
        metalness: 0.2,
        transparent: true,
        opacity: 0.85,
      }),
      servoBrass: new THREE.MeshStandardMaterial({
        color: "#fbbf24", // Brass gear horn
        roughness: 0.2,
        metalness: 0.85,
      }),
      ultrasonicPcb: new THREE.MeshStandardMaterial({
        color: "#0284c7", // Classic Blue HC-SR04 PCB
        roughness: 0.5,
        metalness: 0.2,
      }),
      transducerSilver: new THREE.MeshStandardMaterial({
        color: "#cbd5e1", // Silver acoustic cylinders
        roughness: 0.15,
        metalness: 0.9,
      }),
      transducerMesh: new THREE.MeshStandardMaterial({
        color: "#334155",
        roughness: 0.8,
        metalness: 0.3,
      }),
      esp32Pcb: new THREE.MeshStandardMaterial({
        color: "#052e16", // Green / Black ESP32 PCB
        roughness: 0.5,
        metalness: 0.2,
      }),
      rfShield: new THREE.MeshStandardMaterial({
        color: "#cbd5e1",
        roughness: 0.2,
        metalness: 0.9,
      }),
      l298nHeatsink: new THREE.MeshStandardMaterial({
        color: "#000000", // Black finned aluminum heatsink
        roughness: 0.4,
        metalness: 0.8,
      }),
      l298nPcb: new THREE.MeshStandardMaterial({
        color: "#991b1b", // Red L298N module PCB
        roughness: 0.5,
        metalness: 0.2,
      }),
      batteryPack: new THREE.MeshStandardMaterial({
        color: "#1e3a8a", // Blue 18650 heat-shrink pack
        roughness: 0.6,
        metalness: 0.1,
      }),
      hoodAcrylic: new THREE.MeshStandardMaterial({
        color: bodyColor,
        roughness: finishRoughness,
        metalness: finishMetalness,
        transparent: true,
        opacity: 0.95,
      }),
      selectedOutline: new THREE.MeshBasicMaterial({
        color: "#38bdf8",
        wireframe: true,
      }),
    };
  }, [bodyColor, accentColor, finishRoughness, finishMetalness]);

  // Dynamic animation loop: wheel rotation, steering pivot, and camera pan
  useFrame((_, delta) => {
    // Determine active wheel drive speed
    const effectiveSpeed = isDriving ? (driveSpeed !== 0 ? driveSpeed : 50) : driveSpeed;

    // Wheel spin when driving or speed slider active
    if (Math.abs(effectiveSpeed) > 1) {
      const speedFactor = (effectiveSpeed / 100) * 28 * delta;
      if (wheelFLRef.current) wheelFLRef.current.rotation.x += speedFactor;
      if (wheelFRRef.current) wheelFRRef.current.rotation.x += speedFactor;
      if (wheelRLRef.current) wheelRLRef.current.rotation.x += speedFactor;
      if (wheelRRRef.current) wheelRRRef.current.rotation.x += speedFactor;
    }

    // Front Wheel Steering Pivot (Yaw)
    const targetSteerRad = THREE.MathUtils.degToRad(-steeringAngle);
    if (steerFLRef.current) {
      steerFLRef.current.rotation.y = THREE.MathUtils.lerp(
        steerFLRef.current.rotation.y,
        targetSteerRad,
        delta * 8
      );
    }
    if (steerFRRef.current) {
      steerFRRef.current.rotation.y = THREE.MathUtils.lerp(
        steerFRRef.current.rotation.y,
        targetSteerRad,
        delta * 8
      );
    }

    // Dynamic Camera Pan Swivel
    if (cameraSwivelRef.current) {
      const targetPanRad = THREE.MathUtils.degToRad(-cameraPanAngle);
      cameraSwivelRef.current.rotation.y = THREE.MathUtils.lerp(
        cameraSwivelRef.current.rotation.y,
        targetPanRad,
        delta * 6
      );
    }

    // Gullwing Hood Angle: opens upwards 38 degrees
    if (hoodRef.current) {
      const targetHoodAngle = hoodOpen ? -0.65 : 0; // ~37.5 degrees
      hoodRef.current.rotation.x = THREE.MathUtils.lerp(
        hoodRef.current.rotation.x,
        targetHoodAngle,
        delta * 5
      );
    }
  });

  const isVisible = (id: string) => {
    if (hiddenComponents.includes(id)) return false;
    if (isolatedComponent && isolatedComponent !== id) return false;
    return true;
  };

  const isSelected = (id: string) => selectedComponent === id;

  // Geometry dimensions matching SolidWorks 'Final Car.SLDASM'
  const chassisWidth = 0.15;
  const chassisLength = 0.22;
  const chassisHeight = 0.045;

  return (
    <group dispose={null} position={[0, -0.02, 0]}>
      {/* ================= 1. CHASSIS BASEPLATE & DIFFUSER (Body Part.SLDPRT) ================= */}
      {isVisible("chassis-base") && (
        <group
          position={[0, -0.025 - t * 0.08, 0]}
          onClick={(e) => {
            e.stopPropagation();
            onSelect("chassis-base");
          }}
        >
          {/* Main Structural Floor Plate */}
          <mesh
            castShadow
            receiveShadow
            material={isSelected("chassis-base") ? materials.selectedOutline : materials.chassisBody}
          >
            <boxGeometry args={[chassisWidth, 0.008, chassisLength]} />
          </mesh>

          {/* Front Bumper & Slotted Air Intakes */}
          <group position={[0, 0.015, chassisLength * 0.5 - 0.01]}>
            <mesh castShadow material={materials.chassisMatte}>
              <boxGeometry args={[chassisWidth * 0.95, 0.035, 0.018]} />
            </mesh>
            {/* Front horizontal aerodynamic slats */}
            {[-0.008, 0, 0.008].map((yOffset, i) => (
              <mesh key={i} position={[0, yOffset, 0.01]} material={materials.grilleDark}>
                <boxGeometry args={[chassisWidth * 0.75, 0.003, 0.004]} />
              </mesh>
            ))}
          </group>

          {/* Rear Bumper & Diffuser with Triple Exhaust Ports (as in Robo Car 101.18.png) */}
          <group position={[0, 0.012, -chassisLength * 0.5 + 0.008]}>
            <mesh castShadow material={materials.chassisMatte}>
              <boxGeometry args={[chassisWidth * 0.92, 0.03, 0.016]} />
            </mesh>
            {/* Triple cylindrical exhaust / connector ports */}
            {[-0.025, 0, 0.025].map((xOff, i) => (
              <mesh
                key={i}
                position={[xOff, -0.002, -0.01]}
                rotation={[Math.PI / 2, 0, 0]}
                material={materials.transducerSilver}
              >
                <cylinderGeometry args={[0.005, 0.005, 0.008, 16]} />
              </mesh>
            ))}
          </group>
        </group>
      )}

      {/* ================= 2. MID ELECTRONICS CABIN (Box Part.SLDPRT) ================= */}
      {isVisible("electronics-box") && (
        <group
          position={[0, 0.025 + t * 0.08, -0.01]}
          onClick={(e) => {
            e.stopPropagation();
            onSelect("electronics-box");
          }}
        >
          {/* Main Cabin Enclosure Walls */}
          <mesh
            castShadow
            receiveShadow
            material={isSelected("electronics-box") ? materials.selectedOutline : materials.chassisMatte}
          >
            <boxGeometry args={[chassisWidth * 0.88, chassisHeight, chassisLength * 0.65]} />
          </mesh>

          {/* Cabin Side Aero Vents */}
          {[-1, 1].map((side) => (
            <mesh
              key={side}
              position={[side * (chassisWidth * 0.44 + 0.001), 0, 0]}
              material={materials.grilleDark}
            >
              <boxGeometry args={[0.002, 0.018, 0.07]} />
            </mesh>
          ))}
        </group>
      )}

      {/* ================= 3. GULLWING SERVICE HOOD (Dhakna.SLDPRT) ================= */}
      {isVisible("dhakna-hood") && (
        <group
          position={[0, 0.048 + t * 0.18, -0.01 - t * 0.05]}
          onClick={(e) => {
            e.stopPropagation();
            onSelect("dhakna-hood");
          }}
        >
          {/* Pivot Hinge Group at Rear of Box */}
          <group ref={hoodRef} position={[0, 0, -chassisLength * 0.3]}>
            {/* The Sloped Gullwing Hood Plate */}
            <group position={[0, 0.004, chassisLength * 0.3]}>
              <mesh
                castShadow
                receiveShadow
                material={isSelected("dhakna-hood") ? materials.selectedOutline : materials.hoodAcrylic}
              >
                <boxGeometry args={[chassisWidth * 0.9, 0.004, chassisLength * 0.64]} />
              </mesh>

              {/* Carbon edge trim */}
              <mesh position={[0, 0.003, 0]} material={materials.chassisBody}>
                <boxGeometry args={[chassisWidth * 0.92, 0.002, chassisLength * 0.65]} />
              </mesh>
            </group>
          </group>
        </group>
      )}

      {/* ================= 4. INTERNAL ELECTRONICS (Inside Box) ================= */}
      {/* 4A. ESP32 Brain MCU */}
      {isVisible("esp32-mcu") && (
        <group
          position={[0, 0.018 + t * 0.12, 0.02 + t * 0.02]}
          onClick={(e) => {
            e.stopPropagation();
            onSelect("esp32-mcu");
          }}
        >
          {/* PCB */}
          <mesh
            castShadow
            material={isSelected("esp32-mcu") ? materials.selectedOutline : materials.esp32Pcb}
          >
            <boxGeometry args={[0.028, 0.002, 0.052]} />
          </mesh>
          {/* Metal RF Can */}
          <mesh position={[0, 0.002, -0.006]} material={materials.rfShield}>
            <boxGeometry args={[0.018, 0.003, 0.022]} />
          </mesh>
        </group>
      )}

      {/* 4B. L298N Dual H-Bridge Motor Driver Module */}
      {isVisible("motor-driver") && (
        <group
          position={[-0.025, 0.018 + t * 0.09, -0.04 - t * 0.06]}
          onClick={(e) => {
            e.stopPropagation();
            onSelect("motor-driver");
          }}
        >
          {/* Red PCB */}
          <mesh
            castShadow
            material={isSelected("motor-driver") ? materials.selectedOutline : materials.l298nPcb}
          >
            <boxGeometry args={[0.042, 0.002, 0.042]} />
          </mesh>
          {/* Black Finned Aluminum Heatsink */}
          <mesh position={[0, 0.01, 0]} material={materials.l298nHeatsink}>
            <boxGeometry args={[0.024, 0.018, 0.015]} />
          </mesh>
        </group>
      )}

      {/* 4C. 2S 7.4V Li-ion Battery Pack & Buck Converter */}
      {isVisible("power-system") && (
        <group
          position={[0.028, 0.018 + t * 0.04, -0.03 - t * 0.12]}
          onClick={(e) => {
            e.stopPropagation();
            onSelect("power-system");
          }}
        >
          {/* Dual 18650 Pack */}
          <mesh
            castShadow
            material={isSelected("power-system") ? materials.selectedOutline : materials.batteryPack}
          >
            <boxGeometry args={[0.038, 0.018, 0.065]} />
          </mesh>
        </group>
      )}

      {/* ================= 5. TOWERPRO SG90 CAMERA PAN SERVO & MOUNT ================= */}
      {isVisible("pan-servo") && (
        <group
          position={[0, 0.048 + t * 0.1, 0.065 + t * 0.05]}
          onClick={(e) => {
            e.stopPropagation();
            onSelect("pan-servo");
          }}
        >
          {/* Servo Housing Mount Bracket (down_holder.step.SLDPRT) */}
          <mesh castShadow material={materials.chassisMatte}>
            <boxGeometry args={[0.036, 0.018, 0.028]} />
          </mesh>
          {/* Blue Translucent SG90 Body */}
          <mesh position={[0, 0.006, 0]} material={materials.servoBlue}>
            <boxGeometry args={[0.023, 0.012, 0.022]} />
          </mesh>
          {/* Brass Gear Horn */}
          <mesh position={[0, 0.015, 0]} material={materials.servoBrass}>
            <cylinderGeometry args={[0.004, 0.004, 0.006, 16]} />
          </mesh>
        </group>
      )}

      {/* ================= 6. HIKVISION DS-U02 1080P AI VISION CAMERA ================= */}
      {isVisible("hikvision-camera") && (
        <group
          position={[0, 0.068 + t * 0.16, 0.065 + t * 0.08]}
          onClick={(e) => {
            e.stopPropagation();
            onSelect("hikvision-camera");
          }}
        >
          {/* Dynamic Swivel Group connected to SG90 servo */}
          <group ref={cameraSwivelRef}>
            {/* Neck Swivel Collar (holder.step.SLDPRT) */}
            <mesh position={[0, -0.006, 0]} material={materials.chassisMatte}>
              <cylinderGeometry args={[0.006, 0.006, 0.008, 16]} />
            </mesh>

            {/* Camera Main Rounded Horizontal Body (Hikvision DS-U02) */}
            <mesh
              castShadow
              material={isSelected("hikvision-camera") ? materials.selectedOutline : materials.cameraBody}
            >
              <boxGeometry args={[0.082, 0.024, 0.026]} />
            </mesh>

            {/* Front Black Bezel / Optical Faceplate */}
            <mesh position={[0, 0, 0.0135]} material={materials.cameraBezel}>
              <boxGeometry args={[0.076, 0.02, 0.002]} />
            </mesh>

            {/* Central Optical Lens Ring */}
            <mesh
              position={[0, 0, 0.0145]}
              rotation={[Math.PI / 2, 0, 0]}
              material={materials.transducerSilver}
            >
              <cylinderGeometry args={[0.0075, 0.0075, 0.003, 24]} />
            </mesh>

            {/* Inner Lens Glass Element */}
            <mesh
              position={[0, 0, 0.016]}
              rotation={[Math.PI / 2, 0, 0]}
              material={materials.cameraLens}
            >
              <cylinderGeometry args={[0.005, 0.005, 0.001, 24]} />
            </mesh>

            {/* Active Indicator LED */}
            <mesh position={[0.024, 0, 0.015]} material={materials.cameraLed}>
              <sphereGeometry args={[0.0015, 12, 12]} />
            </mesh>
          </group>
        </group>
      )}

      {/* ================= 7. HC-SR04 ULTRASONIC SENSOR ================= */}
      {isVisible("ultrasonic-sensor") && (
        <group
          position={[0, -0.012 - t * 0.04, chassisLength * 0.5 + 0.012 + t * 0.16]}
          onClick={(e) => {
            e.stopPropagation();
            onSelect("ultrasonic-sensor");
          }}
        >
          {/* Blue Sensor PCB */}
          <mesh
            castShadow
            material={isSelected("ultrasonic-sensor") ? materials.selectedOutline : materials.ultrasonicPcb}
          >
            <boxGeometry args={[0.045, 0.02, 0.002]} />
          </mesh>

          {/* Left Transducer Cylinder (Transmitter 'T') */}
          <group position={[-0.013, 0, 0.007]}>
            <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.transducerSilver}>
              <cylinderGeometry args={[0.0078, 0.0078, 0.012, 24]} />
            </mesh>
            <mesh position={[0, 0, 0.0062]} rotation={[Math.PI / 2, 0, 0]} material={materials.transducerMesh}>
              <circleGeometry args={[0.0068, 24]} />
            </mesh>
          </group>

          {/* Right Transducer Cylinder (Receiver 'R') */}
          <group position={[0.013, 0, 0.007]}>
            <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.transducerSilver}>
              <cylinderGeometry args={[0.0078, 0.0078, 0.012, 24]} />
            </mesh>
            <mesh position={[0, 0, 0.0062]} rotation={[Math.PI / 2, 0, 0]} material={materials.transducerMesh}>
              <circleGeometry args={[0.0068, 24]} />
            </mesh>
          </group>

          {/* Quartz Crystal Resonator */}
          <mesh position={[0, -0.004, 0.002]} material={materials.transducerSilver}>
            <boxGeometry args={[0.006, 0.003, 0.002]} />
          </mesh>
        </group>
      )}

      {/* ================= 8. 4WD DC GEARMOTORS & GOLDEN BRACKETS ================= */}
      {isVisible("dc-gearmotors") && (
        <group
          onClick={(e) => {
            e.stopPropagation();
            onSelect("dc-gearmotors");
          }}
        >
          {[
            { id: "FL", x: -chassisWidth * 0.44, z: 0.065, expX: -1, expZ: 1 },
            { id: "FR", x: chassisWidth * 0.44, z: 0.065, expX: 1, expZ: 1 },
            { id: "RL", x: -chassisWidth * 0.44, z: -0.065, expX: -1, expZ: -1 },
            { id: "RR", x: chassisWidth * 0.44, z: -0.065, expX: 1, expZ: -1 },
          ].map((m) => (
            <group
              key={m.id}
              position={[
                m.x + m.expX * t * 0.18,
                -0.02 - t * 0.04,
                m.z + m.expZ * t * 0.06,
              ]}
            >
              {/* Golden Angled Bracket Holder */}
              <mesh
                castShadow
                rotation={[0, 0, m.expX * 0.35]}
                material={isSelected("dc-gearmotors") ? materials.selectedOutline : materials.bracketGold}
              >
                <boxGeometry args={[0.018, 0.028, 0.022]} />
              </mesh>

              {/* Cylindrical Silver DC Motor Can */}
              <mesh
                castShadow
                position={[m.expX * 0.016, 0.008, 0]}
                rotation={[0, 0, Math.PI / 2]}
                material={materials.motorCan}
              >
                <cylinderGeometry args={[0.01, 0.01, 0.024, 18]} />
              </mesh>

              {/* Yellow BO Gearbox Body */}
              <mesh position={[m.expX * 0.004, -0.008, 0]} material={materials.motorGearbox}>
                <boxGeometry args={[0.016, 0.018, 0.026]} />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {/* ================= 9. 4X HIGH-TRACTION RACING CHEVRON WHEELS ================= */}
      {isVisible("racing-wheels") && (
        <group
          onClick={(e) => {
            e.stopPropagation();
            onSelect("racing-wheels");
          }}
        >
          {/* Wheel Front-Left (with Steering Pivot) */}
          <group
            position={[
              -chassisWidth * 0.58 - t * 0.24,
              -0.02,
              0.065 + t * 0.08,
            ]}
          >
            <group ref={steerFLRef}>
              <group ref={wheelFLRef}>
                <WheelMesh materials={materials} isSelected={isSelected("racing-wheels")} isLeft={true} />
              </group>
            </group>
          </group>

          {/* Wheel Front-Right (with Steering Pivot) */}
          <group
            position={[
              chassisWidth * 0.58 + t * 0.24,
              -0.02,
              0.065 + t * 0.08,
            ]}
          >
            <group ref={steerFRRef}>
              <group ref={wheelFRRef}>
                <WheelMesh materials={materials} isSelected={isSelected("racing-wheels")} isLeft={false} />
              </group>
            </group>
          </group>

          {/* Wheel Rear-Left */}
          <group
            position={[
              -chassisWidth * 0.58 - t * 0.24,
              -0.02,
              -0.065 - t * 0.08,
            ]}
          >
            <group ref={wheelRLRef}>
              <WheelMesh materials={materials} isSelected={isSelected("racing-wheels")} isLeft={true} />
            </group>
          </group>

          {/* Wheel Rear-Right */}
          <group
            position={[
              chassisWidth * 0.58 + t * 0.24,
              -0.02,
              -0.065 - t * 0.08,
            ]}
          >
            <group ref={wheelRRRef}>
              <WheelMesh materials={materials} isSelected={isSelected("racing-wheels")} isLeft={false} />
            </group>
          </group>
        </group>
      )}
    </group>
  );
}

/**
 * Reusable Wheel Component with 5-Spoke Rim and Chevron Directional Tread
 */
interface WheelMeshProps {
  materials: Record<string, THREE.Material>;
  isSelected: boolean;
  isLeft: boolean;
}

function WheelMesh({ materials, isSelected, isLeft }: WheelMeshProps) {
  const wheelRadius = 0.0325; // 65mm diameter
  const wheelWidth = 0.026;  // 26mm width

  return (
    <group rotation={[0, 0, isLeft ? Math.PI / 2 : -Math.PI / 2]}>
      {/* Outer Rubber Tire */}
      <mesh
        castShadow
        receiveShadow
        material={isSelected ? materials.selectedOutline : materials.tireRubber}
      >
        <cylinderGeometry args={[wheelRadius, wheelRadius, wheelWidth, 28]} />
      </mesh>

      {/* Directional Chevron Tread Blocks (Ribs around perimeter) */}
      {[...Array(14)].map((_, i) => {
        const angle = (i / 14) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * (wheelRadius + 0.0008),
              0,
              Math.sin(angle) * (wheelRadius + 0.0008),
            ]}
            rotation={[0, -angle, 0.25]}
            material={materials.tireRubber}
          >
            <boxGeometry args={[0.002, wheelWidth * 0.85, 0.003]} />
          </mesh>
        );
      })}

      {/* Inner Rim */}
      <mesh material={materials.wheelRim}>
        <cylinderGeometry args={[wheelRadius * 0.68, wheelRadius * 0.68, wheelWidth * 1.02, 24]} />
      </mesh>

      {/* 5-Spoke Wheel Face */}
      {[...Array(5)].map((_, i) => {
        const angle = (i / 5) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[
              (Math.cos(angle) * wheelRadius * 0.35),
              wheelWidth * 0.52,
              (Math.sin(angle) * wheelRadius * 0.35),
            ]}
            rotation={[0, -angle, 0]}
            material={materials.wheelRim}
          >
            <boxGeometry args={[0.004, 0.002, wheelRadius * 0.65]} />
          </mesh>
        );
      })}

      {/* Center Wheel Hub Nut */}
      <mesh position={[0, wheelWidth * 0.55, 0]} material={materials.wheelNut}>
        <cylinderGeometry args={[0.005, 0.005, 0.004, 6]} />
      </mesh>
    </group>
  );
}
