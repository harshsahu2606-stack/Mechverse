"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CustomizationSettings } from "@/types/machine";

interface Esp32DroneModelProps {
  customization?: Partial<CustomizationSettings>;
  explosionLevel: number; // 0 to 1
  selectedComponent: string | null;
  isolatedComponent: string | null;
  hiddenComponents: string[];
  onSelect: (componentId: string) => void;
  isArmed?: boolean;
  throttlePct?: number;
}

export default function Esp32DroneModel({
  customization,
  explosionLevel,
  selectedComponent,
  isolatedComponent,
  hiddenComponents,
  onSelect,
  isArmed = true,
  throttlePct = 35,
}: Esp32DroneModelProps) {
  // Propeller rotation refs
  const prop1Ref = useRef<THREE.Group>(null); // M1: Front-Right (CCW)
  const prop2Ref = useRef<THREE.Group>(null); // M2: Front-Left (CW)
  const prop3Ref = useRef<THREE.Group>(null); // M3: Rear-Left (CCW)
  const prop4Ref = useRef<THREE.Group>(null); // M4: Rear-Right (CW)
  const statusLedRef = useRef<THREE.PointLight>(null);
  const droneGroupRef = useRef<THREE.Group>(null);

  const t = explosionLevel; // 0 (assembled) to 1 (fully exploded)

  // 95mm diagonal wheelbase (0.095m) => Arm radius = 0.0475m => X,Z = +/- 0.0336m
  const armOffset = 0.0336;

  // Materials & Colors
  const frameColor = customization?.esp32DroneFrameColor || "#1e293b"; // Dark Polycarbonate
  const frontPropColor = customization?.esp32DronePropsColor || "#ef4444"; // Red Front Props
  const rearPropColor = "#0f172a"; // Black Rear Props

  const materials = useMemo(() => {
    return {
      frame: new THREE.MeshStandardMaterial({
        color: frameColor,
        roughness: 0.5,
        metalness: 0.2,
      }),
      propGuard: new THREE.MeshStandardMaterial({
        color: frameColor,
        roughness: 0.4,
        metalness: 0.1,
        transparent: true,
        opacity: 0.85,
      }),
      esp32Pcb: new THREE.MeshStandardMaterial({
        color: "#0a0a0c", // Black PCB
        roughness: 0.6,
        metalness: 0.3,
      }),
      esp32RfCan: new THREE.MeshStandardMaterial({
        color: "#cbd5e1", // Silver metal shielding can
        roughness: 0.2,
        metalness: 0.9,
      }),
      wifiAntenna: new THREE.MeshStandardMaterial({
        color: "#d97706", // Copper trace antenna
        roughness: 0.3,
        metalness: 0.85,
      }),
      pinHeaders: new THREE.MeshStandardMaterial({
        color: "#fbbf24", // Gold header pins
        roughness: 0.2,
        metalness: 0.9,
      }),
      mpu6050Pcb: new THREE.MeshStandardMaterial({
        color: "#0284c7", // Classic Blue GY-521 board
        roughness: 0.5,
        metalness: 0.3,
      }),
      qfnChip: new THREE.MeshStandardMaterial({
        color: "#18181b",
        roughness: 0.4,
        metalness: 0.6,
      }),
      motorCan: new THREE.MeshStandardMaterial({
        color: "#e2e8f0", // Silver metal brushed motor can
        roughness: 0.25,
        metalness: 0.85,
      }),
      motorCap: new THREE.MeshStandardMaterial({
        color: "#1e293b", // Black bottom end cap
        roughness: 0.7,
      }),
      shaft: new THREE.MeshStandardMaterial({
        color: "#f1f5f9",
        roughness: 0.1,
        metalness: 0.95,
      }),
      propFront: new THREE.MeshStandardMaterial({
        color: frontPropColor,
        roughness: 0.35,
        metalness: 0.1,
      }),
      propRear: new THREE.MeshStandardMaterial({
        color: rearPropColor,
        roughness: 0.35,
        metalness: 0.1,
      }),
      batteryPack: new THREE.MeshStandardMaterial({
        color: "#3b82f6", // Blue 1S LiPo wrap
        roughness: 0.5,
        metalness: 0.15,
      }),
      mosfetBoard: new THREE.MeshStandardMaterial({
        color: "#15803d", // Green breakout PCB
        roughness: 0.6,
        metalness: 0.2,
      }),
      selectedHighlight: new THREE.MeshStandardMaterial({
        color: "#38bdf8",
        emissive: "#0284c7",
        emissiveIntensity: 0.7,
        roughness: 0.2,
        metalness: 0.5,
      }),
    };
  }, [frameColor, frontPropColor, rearPropColor]);

  // Propeller dynamic spin loop (50,000 RPM coreless scaled) + Active Hover
  useFrame((_, delta) => {
    if (!isArmed) {
      if (statusLedRef.current) {
        statusLedRef.current.intensity = 0.2;
      }
      if (droneGroupRef.current) {
        droneGroupRef.current.position.y = -0.015;
        droneGroupRef.current.rotation.x = 0;
        droneGroupRef.current.rotation.z = 0;
      }
      return;
    }

    // High speed dynamic spin proportional to throttle
    const baseSpeed = 28 + (throttlePct / 100) * 55;
    const spin = baseSpeed * delta;
    if (prop1Ref.current) prop1Ref.current.rotation.y -= spin; // M1: CCW
    if (prop2Ref.current) prop2Ref.current.rotation.y += spin; // M2: CW
    if (prop3Ref.current) prop3Ref.current.rotation.y -= spin; // M3: CCW
    if (prop4Ref.current) prop4Ref.current.rotation.y += spin; // M4: CW

    // Flashing blue heartbeat LED
    if (statusLedRef.current) {
      const time = Date.now() * 0.01;
      statusLedRef.current.intensity = Math.sin(time) > 0 ? 2.5 : 0.3;
    }

    // Realistic hovering lift and micro-bobbing when armed
    if (droneGroupRef.current && explosionLevel === 0) {
      const time = Date.now() * 0.004;
      const hoverLift = (throttlePct / 100) * 0.025; // Up to 2.5cm lift
      const bob = Math.sin(time * 3) * 0.002;
      droneGroupRef.current.position.y = -0.015 + hoverLift + bob;
      droneGroupRef.current.rotation.z = Math.sin(time * 2) * 0.012;
      droneGroupRef.current.rotation.x = Math.cos(time * 2.5) * 0.012;
    }
  });

  // Helper for visibility and selection highlighting
  const getVisual = (id: string) => {
    const isHidden = hiddenComponents.includes(id);
    const isIsolated = isolatedComponent ? isolatedComponent === id : true;
    const isSelected = selectedComponent === id;
    return {
      visible: !isHidden && isIsolated,
      mat: (defaultMat: THREE.Material) => (isSelected ? materials.selectedHighlight : defaultMat),
    };
  };

  return (
    <group ref={droneGroupRef} position={[0, -0.015, 0]}>
      {/* ================= 1. 95MM X-QUAD MICRO-FRAME WITH PROP GUARDS ================= */}
      {(() => {
        const { visible, mat } = getVisual("micro-frame");
        return (
          <group
            visible={visible}
            onClick={(e) => {
              e.stopPropagation();
              onSelect("micro-frame");
            }}
          >
            {/* Center Base Plate */}
            <mesh position={[0, 0, 0]} receiveShadow castShadow>
              <cylinderGeometry args={[0.018, 0.018, 0.002, 16]} />
              <primitive object={mat(materials.frame)} attach="material" />
            </mesh>

            {/* 4 Diagonal Arms extending to 8.5mm Motor Sockets */}
            {[
              { x: armOffset, z: -armOffset, angle: -Math.PI / 4 },
              { x: -armOffset, z: -armOffset, angle: (-3 * Math.PI) / 4 },
              { x: -armOffset, z: armOffset, angle: (3 * Math.PI) / 4 },
              { x: armOffset, z: armOffset, angle: Math.PI / 4 },
            ].map((arm, idx) => (
              <group key={`arm-${idx}`}>
                {/* Arm Beam */}
                <mesh
                  position={[arm.x * 0.5, 0, arm.z * 0.5]}
                  rotation={[0, -arm.angle + Math.PI / 2, 0]}
                  receiveShadow
                  castShadow
                >
                  <boxGeometry args={[0.005, 0.003, 0.042]} />
                  <primitive object={mat(materials.frame)} attach="material" />
                </mesh>

                {/* Vertical 8.5mm Motor Socket Collar */}
                <mesh position={[arm.x, 0, arm.z]} receiveShadow castShadow>
                  <cylinderGeometry args={[0.0052, 0.0052, 0.02, 16, 1, true]} />
                  <primitive object={mat(materials.frame)} attach="material" />
                </mesh>

                {/* 360° Circular Propeller Guard Ring (60mm diameter around 55mm prop) */}
                <mesh position={[arm.x, 0.008, arm.z]} rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[0.029, 0.031, 32]} />
                  <primitive object={mat(materials.propGuard)} attach="material" />
                </mesh>

                {/* Guard Struts connecting ring to motor socket */}
                {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((sAng, sIdx) => (
                  <mesh
                    key={`strut-${idx}-${sIdx}`}
                    position={[
                      arm.x + Math.cos(sAng) * 0.015,
                      0.008,
                      arm.z + Math.sin(sAng) * 0.015,
                    ]}
                    rotation={[0, sAng, 0]}
                  >
                    <boxGeometry args={[0.028, 0.0015, 0.002]} />
                    <primitive object={mat(materials.propGuard)} attach="material" />
                  </mesh>
                ))}
              </group>
            ))}
          </group>
        );
      })()}

      {/* ================= 2. ESP32-WROOM-32 DEVELOPMENT BOARD ================= */}
      {(() => {
        const { visible, mat } = getVisual("esp32-board");
        const espY = 0.007 + t * 0.12;
        return (
          <group
            position={[0, espY, 0]}
            visible={visible}
            onClick={(e) => {
              e.stopPropagation();
              onSelect("esp32-board");
            }}
          >
            {/* ESP32 Matte Black PCB (28mm x 48mm) */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.028, 0.0016, 0.048]} />
              <primitive object={mat(materials.esp32Pcb)} attach="material" />
            </mesh>

            {/* Silver Metal RF Shielding Can (ESP-WROOM-32) */}
            <mesh position={[0, 0.002, -0.004]} castShadow>
              <boxGeometry args={[0.018, 0.0025, 0.018]} />
              <primitive object={mat(materials.esp32RfCan)} attach="material" />
            </mesh>

            {/* Copper Meandering Inverted-F Wi-Fi Antenna (MIFA) on rear edge */}
            <mesh position={[0, 0.0012, 0.018]}>
              <boxGeometry args={[0.016, 0.0005, 0.008]} />
              <primitive object={materials.wifiAntenna} attach="material" />
            </mesh>

            {/* Micro-USB Programming Port at Front */}
            <mesh position={[0, 0.002, -0.023]} castShadow>
              <boxGeometry args={[0.0075, 0.003, 0.005]} />
              <primitive object={materials.esp32RfCan} attach="material" />
            </mesh>

            {/* Gold Pin Headers (15 pins per side) */}
            {[-0.0125, 0.0125].map((sideX) => (
              <mesh key={`hdr-${sideX}`} position={[sideX, -0.004, 0]}>
                <boxGeometry args={[0.0025, 0.008, 0.042]} />
                <primitive object={materials.pinHeaders} attach="material" />
              </mesh>
            ))}

            {/* Onboard Status LED (GPIO 2 - Blue) */}
            <mesh position={[0.008, 0.002, -0.01]}>
              <boxGeometry args={[0.002, 0.001, 0.002]} />
              <meshBasicMaterial color="#38bdf8" />
            </mesh>
            <pointLight
              ref={statusLedRef}
              position={[0.008, 0.006, -0.01]}
              color="#38bdf8"
              intensity={1.2}
              distance={0.12}
            />
          </group>
        );
      })()}

      {/* ================= 3. GY-521 MPU-6050 6-DOF IMU SENSOR ================= */}
      {(() => {
        const { visible, mat } = getVisual("mpu6050-imu");
        const imuY = 0.015 + t * 0.18;
        return (
          <group
            position={[0, imuY, 0]}
            visible={visible}
            onClick={(e) => {
              e.stopPropagation();
              onSelect("mpu6050-imu");
            }}
          >
            {/* Blue GY-521 Breakout PCB (15mm x 20mm) */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.015, 0.0014, 0.02]} />
              <primitive object={mat(materials.mpu6050Pcb)} attach="material" />
            </mesh>

            {/* MPU-6050 QFN-24 Sensor IC in Center */}
            <mesh position={[0, 0.0015, 0]} castShadow>
              <boxGeometry args={[0.004, 0.001, 0.004]} />
              <primitive object={materials.qfnChip} attach="material" />
            </mesh>

            {/* Gold Orientation Alignment Dot */}
            <mesh position={[-0.0012, 0.0021, -0.0012]}>
              <sphereGeometry args={[0.0003, 6, 6]} />
              <meshBasicMaterial color="#fbbf24" />
            </mesh>

            {/* 8-Pin I2C Gold Header Pins */}
            <mesh position={[-0.006, -0.003, 0]}>
              <boxGeometry args={[0.002, 0.006, 0.016]} />
              <primitive object={materials.pinHeaders} attach="material" />
            </mesh>
          </group>
        );
      })()}

      {/* ================= 4. FOUR 8520 CORELESS BRUSHED MOTORS ================= */}
      {(() => {
        const { visible, mat } = getVisual("coreless-motors");
        const motorConfigs = [
          { x: armOffset, z: -armOffset, isCW: false, name: "M1 (CCW)", wire1: "#ef4444", wire2: "#2563eb" }, // Red/Blue
          { x: -armOffset, z: -armOffset, isCW: true, name: "M2 (CW)", wire1: "#18181b", wire2: "#f8fafc" },   // Black/White
          { x: -armOffset, z: armOffset, isCW: false, name: "M3 (CCW)", wire1: "#ef4444", wire2: "#2563eb" }, // Red/Blue
          { x: armOffset, z: armOffset, isCW: true, name: "M4 (CW)", wire1: "#18181b", wire2: "#f8fafc" },   // Black/White
        ];

        return (
          <group visible={visible}>
            {motorConfigs.map((cfg, idx) => {
              const explodeX = cfg.x + Math.sign(cfg.x) * t * 0.05;
              const explodeZ = cfg.z + Math.sign(cfg.z) * t * 0.05;
              const explodeY = -t * 0.06;

              return (
                <group
                  key={`mot-${idx}`}
                  position={[explodeX, explodeY, explodeZ]}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect("coreless-motors");
                  }}
                >
                  {/* 8520 Silver Cylindrical Metal Can (8.5mm dia x 20mm len) */}
                  <mesh position={[0, 0, 0]} castShadow receiveShadow>
                    <cylinderGeometry args={[0.00425, 0.00425, 0.02, 20]} />
                    <primitive object={mat(materials.motorCan)} attach="material" />
                  </mesh>

                  {/* Black Plastic Bottom End Cap */}
                  <mesh position={[0, -0.01, 0]}>
                    <cylinderGeometry args={[0.0042, 0.0042, 0.002, 16]} />
                    <primitive object={materials.motorCap} attach="material" />
                  </mesh>

                  {/* 1.0mm Hardened Steel Drive Shaft */}
                  <mesh position={[0, 0.013, 0]} castShadow>
                    <cylinderGeometry args={[0.0005, 0.0005, 0.008, 8]} />
                    <primitive object={materials.shaft} attach="material" />
                  </mesh>

                  {/* Dual Silicone Motor Lead Wires exiting bottom */}
                  <mesh position={[-0.0015, -0.014, 0]}>
                    <cylinderGeometry args={[0.0004, 0.0004, 0.008, 6]} />
                    <meshBasicMaterial color={cfg.wire1} />
                  </mesh>
                  <mesh position={[0.0015, -0.014, 0]}>
                    <cylinderGeometry args={[0.0004, 0.0004, 0.008, 6]} />
                    <meshBasicMaterial color={cfg.wire2} />
                  </mesh>
                </group>
              );
            })}
          </group>
        );
      })()}

      {/* ================= 5. FOUR 55MM MICRO HIGH-LIFT PROPELLERS ================= */}
      {(() => {
        const { visible, mat } = getVisual("propellers");
        const propY = 0.018 + t * 0.22;

        return (
          <group visible={visible}>
            {/* Propeller 1: Front-Right (CCW, Red) */}
            <group
              ref={prop1Ref}
              position={[armOffset + t * 0.05, propY, -armOffset - t * 0.05]}
              onClick={(e) => {
                e.stopPropagation();
                onSelect("propellers");
              }}
            >
              <mesh position={[0, 0, 0]} castShadow>
                <cylinderGeometry args={[0.0016, 0.0016, 0.004, 12]} />
                <primitive object={mat(materials.propFront)} attach="material" />
              </mesh>
              <mesh position={[0, 0, 0]} castShadow rotation={[0, 0, 0.08]}>
                <boxGeometry args={[0.055, 0.001, 0.006]} />
                <primitive object={mat(materials.propFront)} attach="material" />
              </mesh>
              {/* High-speed motion blur disc when armed */}
              {isArmed && (
                <mesh position={[0, 0.0005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[0.003, 0.0275, 32]} />
                  <meshBasicMaterial
                    color={frontPropColor}
                    transparent
                    opacity={0.35 + (throttlePct / 100) * 0.25}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              )}
            </group>

            {/* Propeller 2: Front-Left (CW, Red) */}
            <group
              ref={prop2Ref}
              position={[-armOffset - t * 0.05, propY, -armOffset - t * 0.05]}
              onClick={(e) => {
                e.stopPropagation();
                onSelect("propellers");
              }}
            >
              <mesh position={[0, 0, 0]} castShadow>
                <cylinderGeometry args={[0.0016, 0.0016, 0.004, 12]} />
                <primitive object={mat(materials.propFront)} attach="material" />
              </mesh>
              <mesh position={[0, 0, 0]} castShadow rotation={[0, 0, -0.08]}>
                <boxGeometry args={[0.055, 0.001, 0.006]} />
                <primitive object={mat(materials.propFront)} attach="material" />
              </mesh>
              {/* High-speed motion blur disc when armed */}
              {isArmed && (
                <mesh position={[0, 0.0005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[0.003, 0.0275, 32]} />
                  <meshBasicMaterial
                    color={frontPropColor}
                    transparent
                    opacity={0.35 + (throttlePct / 100) * 0.25}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              )}
            </group>

            {/* Propeller 3: Rear-Left (CCW, Black) */}
            <group
              ref={prop3Ref}
              position={[-armOffset - t * 0.05, propY, armOffset + t * 0.05]}
              onClick={(e) => {
                e.stopPropagation();
                onSelect("propellers");
              }}
            >
              <mesh position={[0, 0, 0]} castShadow>
                <cylinderGeometry args={[0.0016, 0.0016, 0.004, 12]} />
                <primitive object={mat(materials.propRear)} attach="material" />
              </mesh>
              <mesh position={[0, 0, 0]} castShadow rotation={[0, 0, 0.08]}>
                <boxGeometry args={[0.055, 0.001, 0.006]} />
                <primitive object={mat(materials.propRear)} attach="material" />
              </mesh>
              {/* High-speed motion blur disc when armed */}
              {isArmed && (
                <mesh position={[0, 0.0005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[0.003, 0.0275, 32]} />
                  <meshBasicMaterial
                    color={rearPropColor}
                    transparent
                    opacity={0.35 + (throttlePct / 100) * 0.25}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              )}
            </group>

            {/* Propeller 4: Rear-Right (CW, Black) */}
            <group
              ref={prop4Ref}
              position={[armOffset + t * 0.05, propY, armOffset + t * 0.05]}
              onClick={(e) => {
                e.stopPropagation();
                onSelect("propellers");
              }}
            >
              <mesh position={[0, 0, 0]} castShadow>
                <cylinderGeometry args={[0.0016, 0.0016, 0.004, 12]} />
                <primitive object={mat(materials.propRear)} attach="material" />
              </mesh>
              <mesh position={[0, 0, 0]} castShadow rotation={[0, 0, -0.08]}>
                <boxGeometry args={[0.055, 0.001, 0.006]} />
                <primitive object={mat(materials.propRear)} attach="material" />
              </mesh>
              {/* High-speed motion blur disc when armed */}
              {isArmed && (
                <mesh position={[0, 0.0005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[0.003, 0.0275, 32]} />
                  <meshBasicMaterial
                    color={rearPropColor}
                    transparent
                    opacity={0.35 + (throttlePct / 100) * 0.25}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              )}
            </group>
          </group>
        );
      })()}

      {/* ================= 6. 4X SI2302 MOSFET DRIVERS & SCHOTTKY DIODES ================= */}
      {(() => {
        const { visible, mat } = getVisual("mosfet-drivers");
        const fetY = -0.005 - t * 0.05;
        return (
          <group
            position={[0, fetY, 0]}
            visible={visible}
            onClick={(e) => {
              e.stopPropagation();
              onSelect("mosfet-drivers");
            }}
          >
            {/* Green Driver Sub-PCB */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.024, 0.001, 0.024]} />
              <primitive object={mat(materials.mosfetBoard)} attach="material" />
            </mesh>

            {/* 4x SOT-23 Tiny MOSFETs (SI2302) */}
            {[-0.007, 0.007].map((fx) =>
              [-0.007, 0.007].map((fz) => (
                <mesh key={`fet-${fx}-${fz}`} position={[fx, 0.001, fz]}>
                  <boxGeometry args={[0.0028, 0.0012, 0.0028]} />
                  <primitive object={materials.qfnChip} attach="material" />
                </mesh>
              ))
            )}

            {/* 4x Cylindrical 1N5819 Schottky Flyback Diodes */}
            {[-0.007, 0.007].map((dx) => (
              <mesh key={`dio-${dx}`} position={[dx, -0.002, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.001, 0.001, 0.006, 8]} />
                <meshStandardMaterial color="#18181b" roughness={0.3} />
              </mesh>
            ))}
          </group>
        );
      })()}

      {/* ================= 7. 1S 3.7V 500MAH LIPO BATTERY PACK ================= */}
      {(() => {
        const { visible, mat } = getVisual("lipo-battery");
        const batY = -0.016 - t * 0.16;
        return (
          <group
            position={[0, batY, 0]}
            visible={visible}
            onClick={(e) => {
              e.stopPropagation();
              onSelect("lipo-battery");
            }}
          >
            {/* Blue PVC Shrink Pack (45mm x 20mm x 8mm) */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.02, 0.008, 0.045]} />
              <primitive object={mat(materials.batteryPack)} attach="material" />
            </mesh>

            {/* Elastic Retaining Rubber Band */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.021, 0.0085, 0.006]} />
              <meshStandardMaterial color="#09090b" roughness={0.9} />
            </mesh>

            {/* Red & Black 26AWG Silicone Power Leads */}
            <mesh position={[0.003, 0.004, -0.026]} rotation={[Math.PI / 3, 0, 0]}>
              <cylinderGeometry args={[0.0006, 0.0006, 0.008, 6]} />
              <meshBasicMaterial color="#ef4444" />
            </mesh>
            <mesh position={[-0.003, 0.004, -0.026]} rotation={[Math.PI / 3, 0, 0]}>
              <cylinderGeometry args={[0.0006, 0.0006, 0.008, 6]} />
              <meshBasicMaterial color="#18181b" />
            </mesh>

            {/* White Walkera / Losi 2-Pin Micro Power Connector */}
            <mesh position={[0, 0.006, -0.03]} castShadow>
              <boxGeometry args={[0.006, 0.004, 0.006]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.4} />
            </mesh>
          </group>
        );
      })()}
    </group>
  );
}
