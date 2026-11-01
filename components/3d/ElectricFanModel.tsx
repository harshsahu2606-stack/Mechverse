"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { FanSimulationState } from "@/types/machine";

interface ElectricFanModelProps {
  paintColor: string;
  bladeColor: string;
  baseColor: string;
  explosionLevel: number; // 0 to 1
  selectedComponent: string | null;
  isolatedComponent: string | null;
  hiddenComponents: string[];
  simulation: FanSimulationState;
  onSelect: (componentId: string) => void;
}

export default function ElectricFanModel({
  paintColor,
  bladeColor,
  baseColor,
  explosionLevel,
  selectedComponent,
  isolatedComponent,
  hiddenComponents,
  simulation,
  onSelect,
}: ElectricFanModelProps) {
  // References for animated parts
  const bladeGroupRef = useRef<THREE.Group>(null);
  const headOscillationGroupRef = useRef<THREE.Group>(null);
  const headTiltGroupRef = useRef<THREE.Group>(null);

  // Smooth rotation velocity state
  const currentSpeedRef = useRef(0);
  const oscillationTimeRef = useRef(0);

  // Mesh group refs for exploded view lerping
  const frontGrillRef = useRef<THREE.Group>(null);
  const bladeCapRef = useRef<THREE.Group>(null);
  const bladesContainerRef = useRef<THREE.Group>(null);
  const rearGrillRef = useRef<THREE.Group>(null);
  const motorHousingRef = useRef<THREE.Group>(null);
  const oscPinRef = useRef<THREE.Group>(null);
  const neckRef = useRef<THREE.Group>(null);
  const standRef = useRef<THREE.Group>(null);
  const baseRef = useRef<THREE.Group>(null);
  const buttonsRef = useRef<THREE.Group>(null);

  // Base materials with PBR properties
  const materials = useMemo(() => {
    return {
      body: new THREE.MeshStandardMaterial({
        color: paintColor,
        roughness: 0.35,
        metalness: 0.2,
      }),
      bodySecondary: new THREE.MeshStandardMaterial({
        color: "#2a2d34",
        roughness: 0.5,
        metalness: 0.1,
      }),
      blades: new THREE.MeshPhysicalMaterial({
        color: bladeColor,
        roughness: 0.2,
        metalness: 0.05,
        transmission: 0.65,
        thickness: 0.8,
        transparent: true,
        opacity: 0.9,
      }),
      chrome: new THREE.MeshStandardMaterial({
        color: "#f0f2f5",
        roughness: 0.15,
        metalness: 0.95,
      }),
      darkChrome: new THREE.MeshStandardMaterial({
        color: "#3f444e",
        roughness: 0.3,
        metalness: 0.85,
      }),
      base: new THREE.MeshStandardMaterial({
        color: baseColor,
        roughness: 0.4,
        metalness: 0.2,
      }),
      rubber: new THREE.MeshStandardMaterial({
        color: "#18181b",
        roughness: 0.9,
        metalness: 0.0,
      }),
      buttonActive: new THREE.MeshStandardMaterial({
        color: "#ef4444",
        roughness: 0.3,
        metalness: 0.3,
        emissive: new THREE.Color("#ef4444"),
        emissiveIntensity: 0.4,
      }),
      buttonInactive: new THREE.MeshStandardMaterial({
        color: "#d4d4d8",
        roughness: 0.4,
        metalness: 0.2,
      }),
      accentOrange: new THREE.MeshStandardMaterial({
        color: "#f97316",
        roughness: 0.3,
        metalness: 0.2,
      }),
      highlight: new THREE.MeshStandardMaterial({
        color: "#38bdf8",
        roughness: 0.2,
        metalness: 0.5,
        emissive: new THREE.Color("#0284c7"),
        emissiveIntensity: 0.6,
      }),
    };
  }, [paintColor, bladeColor, baseColor]);

  // Frame loop for blade spin, oscillation, tilt & explosion lerping
  useFrame((_, delta) => {
    // 1. Blade rotational speed with inertia
    let targetSpeed = 0;
    if (simulation.power) {
      if (simulation.speed === 1) targetSpeed = 14;
      else if (simulation.speed === 2) targetSpeed = 28;
      else if (simulation.speed === 3) targetSpeed = 48;
    }
    currentSpeedRef.current = THREE.MathUtils.lerp(
      currentSpeedRef.current,
      targetSpeed,
      1 - Math.exp(-delta * 3.5)
    );

    if (bladeGroupRef.current) {
      bladeGroupRef.current.rotation.z -= currentSpeedRef.current * delta;
    }

    // 2. Oscillation sweep
    if (headOscillationGroupRef.current) {
      if (simulation.oscillating && simulation.power && simulation.speed > 0) {
        oscillationTimeRef.current += delta * (0.8 + simulation.speed * 0.25);
        const oscAngle = Math.sin(oscillationTimeRef.current) * (Math.PI / 4.2);
        headOscillationGroupRef.current.rotation.y = THREE.MathUtils.lerp(
          headOscillationGroupRef.current.rotation.y,
          oscAngle,
          1 - Math.exp(-delta * 4)
        );
      } else {
        headOscillationGroupRef.current.rotation.y = THREE.MathUtils.lerp(
          headOscillationGroupRef.current.rotation.y,
          0,
          1 - Math.exp(-delta * 3)
        );
      }
    }

    // 3. Head tilt angle
    if (headTiltGroupRef.current) {
      const targetTilt = THREE.MathUtils.degToRad(simulation.tiltAngle);
      headTiltGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        headTiltGroupRef.current.rotation.x,
        targetTilt,
        1 - Math.exp(-delta * 5)
      );
    }

    // 4. Exploded view animation lerping
    const t = explosionLevel;
    const lerpFactor = 1 - Math.exp(-delta * 6);

    // Front Grill [0, 0, 2.2]
    if (frontGrillRef.current) {
      const targetZ = 0.35 + t * 1.5;
      frontGrillRef.current.position.z = THREE.MathUtils.lerp(frontGrillRef.current.position.z, targetZ, lerpFactor);
    }
    // Spinner Cap [0, 0, 3.0]
    if (bladeCapRef.current) {
      const targetZ = 0.42 + t * 2.2;
      bladeCapRef.current.position.z = THREE.MathUtils.lerp(bladeCapRef.current.position.z, targetZ, lerpFactor);
    }
    // Blades [0, 0, 1.6]
    if (bladesContainerRef.current) {
      const targetZ = 0.22 + t * 1.0;
      bladesContainerRef.current.position.z = THREE.MathUtils.lerp(bladesContainerRef.current.position.z, targetZ, lerpFactor);
    }
    // Rear Grill [0, 0, 0.7]
    if (rearGrillRef.current) {
      const targetZ = 0.08 + t * 0.4;
      rearGrillRef.current.position.z = THREE.MathUtils.lerp(rearGrillRef.current.position.z, targetZ, lerpFactor);
    }
    // Motor Housing [0, 0, -1.2]
    if (motorHousingRef.current) {
      const targetZ = -0.15 - t * 0.8;
      motorHousingRef.current.position.z = THREE.MathUtils.lerp(motorHousingRef.current.position.z, targetZ, lerpFactor);
    }
    // Oscillation Pin [0, 1.4, -1.2]
    if (oscPinRef.current) {
      const targetY = 0.38 + t * 0.5;
      const targetZ = -0.25 - t * 0.8;
      oscPinRef.current.position.y = THREE.MathUtils.lerp(oscPinRef.current.position.y, targetY, lerpFactor);
      oscPinRef.current.position.z = THREE.MathUtils.lerp(oscPinRef.current.position.z, targetZ, lerpFactor);
    }
    // Neck [0, 0.4, 0]
    if (neckRef.current) {
      const targetY = 0.85 + t * 0.35;
      neckRef.current.position.y = THREE.MathUtils.lerp(neckRef.current.position.y, targetY, lerpFactor);
    }
    // Stand [0, -0.6, 0]
    if (standRef.current) {
      const targetY = 0.45;
      standRef.current.position.y = THREE.MathUtils.lerp(standRef.current.position.y, targetY, lerpFactor);
    }
    // Base [0, -1.6, 0]
    if (baseRef.current) {
      const targetY = 0.05 - t * 0.6;
      baseRef.current.position.y = THREE.MathUtils.lerp(baseRef.current.position.y, targetY, lerpFactor);
    }
    // Buttons [0, -1.4, 0.8]
    if (buttonsRef.current) {
      const targetY = 0.12 - t * 0.6 + t * 0.3;
      const targetZ = 0.35 + t * 0.5;
      buttonsRef.current.position.y = THREE.MathUtils.lerp(buttonsRef.current.position.y, targetY, lerpFactor);
      buttonsRef.current.position.z = THREE.MathUtils.lerp(buttonsRef.current.position.z, targetZ, lerpFactor);
    }
  });

  const handlePointer = (id: string, e: any) => {
    e.stopPropagation?.();
    onSelect(id);
  };

  const isVisible = (id: string) => {
    if (hiddenComponents.includes(id)) return false;
    if (isolatedComponent && isolatedComponent !== id) return false;
    return true;
  };

  const getMat = (id: string, defaultMat: THREE.Material) => {
    if (selectedComponent === id) return materials.highlight;
    return defaultMat;
  };

  return (
    <group position={[0, -0.85, 0]}>
      {/* ================= BASE ================= */}
      {isVisible("base") && (
        <group
          ref={baseRef}
          position={[0, 0.05, 0]}
          onClick={(e) => handlePointer("base", e)}
        >
          {/* Main weighted dome base */}
          <mesh castShadow receiveShadow material={getMat("base", materials.base)}>
            <cylinderGeometry args={[0.9, 0.98, 0.12, 48]} />
          </mesh>
          {/* Upper tapered bevel */}
          <mesh position={[0, 0.08, 0]} material={getMat("base", materials.base)}>
            <cylinderGeometry args={[0.78, 0.9, 0.06, 48]} />
          </mesh>
          {/* Central collar for stand insertion */}
          <mesh position={[0, 0.14, 0]} material={getMat("base", materials.darkChrome)}>
            <cylinderGeometry args={[0.16, 0.18, 0.08, 32]} />
          </mesh>
          {/* 4 Rubber anti-vibration feet */}
          {[-0.65, 0.65].map((x) =>
            [-0.65, 0.65].map((z) => (
              <mesh key={`${x}-${z}`} position={[x, -0.065, z]} material={materials.rubber}>
                <cylinderGeometry args={[0.07, 0.07, 0.02, 16]} />
              </mesh>
            ))
          )}
          {/* Rear cord grommet */}
          <mesh position={[0, 0.03, -0.92]} rotation={[Math.PI / 2, 0, 0]} material={materials.rubber}>
            <cylinderGeometry args={[0.03, 0.03, 0.08, 16]} />
          </mesh>
        </group>
      )}

      {/* ================= CONTROL BUTTONS ================= */}
      {isVisible("control-buttons") && (
        <group
          ref={buttonsRef}
          position={[0, 0.12, 0.35]}
          onClick={(e) => handlePointer("control-buttons", e)}
        >
          {/* Switch bank recessed bezel */}
          <mesh material={materials.bodySecondary}>
            <boxGeometry args={[0.55, 0.04, 0.16]} />
          </mesh>

          {/* 4 Push Buttons: 0(OFF), 1(LOW), 2(MED), 3(HIGH) */}
          {[0, 1, 2, 3].map((btnIndex) => {
            const posX = (btnIndex - 1.5) * 0.12;
            const isPressed = simulation.speed === btnIndex;
            return (
              <group key={btnIndex} position={[posX, isPressed ? -0.008 : 0.015, 0]}>
                <mesh
                  material={
                    btnIndex === 0
                      ? materials.buttonInactive
                      : isPressed
                      ? materials.buttonActive
                      : materials.darkChrome
                  }
                >
                  <boxGeometry args={[0.08, 0.035, 0.1]} />
                </mesh>
              </group>
            );
          })}
        </group>
      )}

      {/* ================= STAND / COLUMN ================= */}
      {isVisible("stand") && (
        <group
          ref={standRef}
          position={[0, 0.45, 0]}
          onClick={(e) => handlePointer("stand", e)}
        >
          {/* Main polished chrome column */}
          <mesh castShadow material={getMat("stand", materials.chrome)}>
            <cylinderGeometry args={[0.065, 0.065, 0.72, 32]} />
          </mesh>
          {/* Height adjustment clamping ring collar */}
          <mesh position={[0, 0.28, 0]} material={materials.darkChrome}>
            <cylinderGeometry args={[0.085, 0.085, 0.06, 32]} />
          </mesh>
        </group>
      )}

      {/* ================= NECK & TILT JOINT ================= */}
      {isVisible("neck-joint") && (
        <group
          ref={neckRef}
          position={[0, 0.85, 0]}
          onClick={(e) => handlePointer("neck-joint", e)}
        >
          {/* Neck bracket base */}
          <mesh material={getMat("neck-joint", materials.bodySecondary)}>
            <cylinderGeometry args={[0.08, 0.08, 0.16, 24]} />
          </mesh>
          {/* Dual-prong fork hinge */}
          <mesh position={[0, 0.12, 0]} material={getMat("neck-joint", materials.darkChrome)}>
            <boxGeometry args={[0.14, 0.14, 0.14]} />
          </mesh>
          {/* Side tilt locking thumbscrew */}
          <group position={[0.1, 0.12, 0]} rotation={[0, 0, Math.PI / 2]}>
            <mesh material={materials.chrome}>
              <cylinderGeometry args={[0.04, 0.04, 0.08, 16]} />
            </mesh>
            <mesh position={[0, 0.045, 0]} material={materials.darkChrome}>
              <boxGeometry args={[0.12, 0.02, 0.04]} />
            </mesh>
          </group>
        </group>
      )}

      {/* ================= OSCILLATING & TILTING HEAD ASSEMBLY ================= */}
      <group position={[0, 0.98, 0]} ref={headOscillationGroupRef}>
        <group ref={headTiltGroupRef}>
          {/* ================= MOTOR HOUSING ================= */}
          {isVisible("motor-housing") && (
            <group
              ref={motorHousingRef}
              position={[0, 0.35, -0.15]}
              onClick={(e) => handlePointer("motor-housing", e)}
            >
              {/* Cylindrical Motor Body */}
              <mesh
                castShadow
                rotation={[Math.PI / 2, 0, 0]}
                material={getMat("motor-housing", materials.body)}
              >
                <cylinderGeometry args={[0.3, 0.28, 0.42, 36]} />
              </mesh>
              {/* Rear dome cap with ventilation slots */}
              <mesh
                position={[0, 0, -0.22]}
                rotation={[Math.PI / 2, 0, 0]}
                material={getMat("motor-housing", materials.bodySecondary)}
              >
                <sphereGeometry args={[0.26, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
              </mesh>
              {/* Drive Shaft extension forward */}
              <mesh
                position={[0, 0, 0.28]}
                rotation={[Math.PI / 2, 0, 0]}
                material={materials.chrome}
              >
                <cylinderGeometry args={[0.03, 0.03, 0.22, 20]} />
              </mesh>
            </group>
          )}

          {/* ================= OSCILLATION PIN ================= */}
          {isVisible("oscillation-pin") && (
            <group
              ref={oscPinRef}
              position={[0, 0.68, -0.25]}
              onClick={(e) => handlePointer("oscillation-pin", e)}
            >
              {/* Push-pull clutch knob atop the motor casing */}
              <mesh
                material={getMat("oscillation-pin", simulation.oscillating ? materials.accentOrange : materials.darkChrome)}
              >
                <cylinderGeometry args={[0.038, 0.042, 0.12, 20]} />
              </mesh>
              <mesh position={[0, 0.065, 0]} material={materials.accentOrange}>
                <sphereGeometry args={[0.046, 16, 16]} />
              </mesh>
            </group>
          )}

          {/* ================= REAR SAFETY GRILL ================= */}
          {isVisible("rear-grill") && (
            <group
              ref={rearGrillRef}
              position={[0, 0.35, 0.08]}
              onClick={(e) => handlePointer("rear-grill", e)}
            >
              {/* Outer rim bezel */}
              <mesh material={getMat("rear-grill", materials.chrome)}>
                <torusGeometry args={[1.05, 0.02, 16, 64]} />
              </mesh>
              {/* Inner concentric support rings */}
              {[0.4, 0.7, 0.95].map((r) => (
                <mesh key={r} material={getMat("rear-grill", materials.chrome)}>
                  <torusGeometry args={[r, 0.012, 12, 48]} />
                </mesh>
              ))}
              {/* Radial cage spoke wires (36 spokes) */}
              {Array.from({ length: 36 }).map((_, i) => {
                const angle = (i / 36) * Math.PI * 2;
                return (
                  <mesh
                    key={i}
                    rotation={[0, 0, angle]}
                    position={[0, 0, -0.04]}
                    material={getMat("rear-grill", materials.chrome)}
                  >
                    <cylinderGeometry args={[0.005, 0.005, 2.05, 6]} />
                  </mesh>
                );
              })}
              {/* Top carrying handle loop */}
              <mesh position={[0, 1.08, -0.06]} material={materials.darkChrome}>
                <boxGeometry args={[0.26, 0.04, 0.08]} />
              </mesh>
            </group>
          )}

          {/* ================= ROTATING FAN BLADES ================= */}
          {isVisible("fan-blades") && (
            <group ref={bladesContainerRef} position={[0, 0.35, 0.22]}>
              <group
                ref={bladeGroupRef}
                onClick={(e) => handlePointer("fan-blades", e)}
              >
                {/* Central hub core holding the 3 blades */}
                <mesh rotation={[Math.PI / 2, 0, 0]} material={getMat("fan-blades", materials.darkChrome)}>
                  <cylinderGeometry args={[0.16, 0.16, 0.12, 32]} />
                </mesh>

                {/* 3 Aerodynamic Twisted Impeller Blades */}
                {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, idx) => (
                  <group key={idx} rotation={[0, 0, angle]}>
                    <group position={[0, 0.52, 0]} rotation={[0.35, 0.1, 0]}>
                      {/* Sculpted aerodynamic curved blade body */}
                      <mesh
                        castShadow
                        material={getMat("fan-blades", materials.blades)}
                      >
                        <boxGeometry args={[0.34, 0.76, 0.018]} />
                      </mesh>
                      {/* Curvature accent */}
                      <mesh
                        position={[0.1, 0.05, -0.02]}
                        rotation={[0, -0.2, 0]}
                        material={getMat("fan-blades", materials.blades)}
                      >
                        <boxGeometry args={[0.16, 0.68, 0.016]} />
                      </mesh>
                    </group>
                  </group>
                ))}
              </group>
            </group>
          )}

          {/* ================= CENTRAL BLADE CAP ================= */}
          {isVisible("blade-cap") && (
            <group
              ref={bladeCapRef}
              position={[0, 0.35, 0.42]}
              onClick={(e) => handlePointer("blade-cap", e)}
            >
              {/* Spinner bullet cap */}
              <mesh
                rotation={[Math.PI / 2, 0, 0]}
                material={getMat("blade-cap", materials.accentOrange)}
              >
                <coneGeometry args={[0.1, 0.18, 32]} />
              </mesh>
            </group>
          )}

          {/* ================= FRONT SAFETY GRILL ================= */}
          {isVisible("front-grill") && (
            <group
              ref={frontGrillRef}
              position={[0, 0.35, 0.35]}
              onClick={(e) => handlePointer("front-grill", e)}
            >
              {/* Outer protective rim */}
              <mesh material={getMat("front-grill", materials.chrome)}>
                <torusGeometry args={[1.08, 0.024, 16, 64]} />
              </mesh>
              {/* Concentric reinforcement wire hoops */}
              {[0.3, 0.55, 0.8, 1.0].map((radius) => (
                <mesh key={radius} material={getMat("front-grill", materials.chrome)}>
                  <torusGeometry args={[radius, 0.014, 12, 48]} />
                </mesh>
              ))}
              {/* Dense front radial spokes (48 wires) */}
              {Array.from({ length: 48 }).map((_, i) => {
                const angle = (i / 48) * Math.PI * 2;
                return (
                  <mesh
                    key={i}
                    rotation={[0, 0, angle]}
                    material={getMat("front-grill", materials.chrome)}
                  >
                    <cylinderGeometry args={[0.005, 0.005, 2.12, 6]} />
                  </mesh>
                );
              })}
              {/* Central branded emblem badge */}
              <mesh position={[0, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]} material={materials.bodySecondary}>
                <cylinderGeometry args={[0.22, 0.22, 0.03, 32]} />
              </mesh>
              <mesh position={[0, 0, 0.066]} rotation={[Math.PI / 2, 0, 0]} material={materials.accentOrange}>
                <cylinderGeometry args={[0.16, 0.16, 0.01, 32]} />
              </mesh>
            </group>
          )}
        </group>
      </group>
    </group>
  );
}
