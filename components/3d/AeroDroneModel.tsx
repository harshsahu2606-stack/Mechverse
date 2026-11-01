"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CustomizationSettings, ViewMode } from "@/types/machine";

interface AeroDroneModelProps {
  customization: CustomizationSettings;
  explosionLevel: number; // 0 (assembled) to 1 (fully exploded)
  selectedComponent: string | null;
  isolatedComponent: string | null;
  hiddenComponents: string[];
  onSelect: (componentId: string) => void;
  isArmed?: boolean;
  throttlePct?: number;
  viewMode?: ViewMode;
}

export default function AeroDroneModel({
  customization,
  explosionLevel,
  selectedComponent,
  isolatedComponent,
  hiddenComponents,
  onSelect,
  isArmed = false,
  throttlePct = 0,
  viewMode = "view",
}: AeroDroneModelProps) {
  const isElectronicMode = viewMode === "electronic";

  // Propeller rotation refs
  const prop1Ref = useRef<THREE.Group>(null); // M1: Front-Right (CCW)
  const prop2Ref = useRef<THREE.Group>(null); // M2: Front-Left (CW)
  const prop3Ref = useRef<THREE.Group>(null); // M3: Rear-Left (CCW)
  const prop4Ref = useRef<THREE.Group>(null); // M4: Rear-Right (CW)
  const fcLedRef = useRef<THREE.PointLight>(null);
  const pulseRef = useRef<number>(0);

  // Arm geometry calculations (F450 diagonal wheelbase = 450mm = 0.45m)
  const armDiagonalDist = (customization.droneFrameSize || 450) / 1000;
  const armOffset = (armDiagonalDist / 2) * Math.SQRT1_2; // ~0.159m along X and Z

  // Colors based on authentic F450 architecture (Image 1: Front arms white, Rear arms red)
  const frontArmColor = customization.droneArmColorFront || "#f8fafc"; // White PA66
  const rearArmColor = customization.droneArmColorRear || "#dc2626"; // Red PA66

  // Materials system: adapts automatically between standard CAD and Electronic Glass mode
  const materials = useMemo(() => {
    if (isElectronicMode) {
      // Semi-transparent holographic CAD silhouette for structural parts
      const holoGlass = new THREE.MeshPhysicalMaterial({
        color: "#94a3b8",
        roughness: 0.1,
        metalness: 0.1,
        transmission: 0.85,
        opacity: 0.22,
        transparent: true,
        wireframe: false,
        depthWrite: false,
      });

      return {
        topPlate: holoGlass,
        bottomPdb: holoGlass,
        copperPads: new THREE.MeshBasicMaterial({ color: "#fbbf24" }),
        frontArm: holoGlass,
        rearArm: holoGlass,
        motorBell: new THREE.MeshStandardMaterial({
          color: "#ef4444",
          roughness: 0.2,
          metalness: 0.9,
          emissive: "#7f1d1d",
          emissiveIntensity: 0.4,
        }),
        motorWindings: new THREE.MeshStandardMaterial({
          color: "#f59e0b",
          emissive: "#b45309",
          emissiveIntensity: 0.6,
        }),
        escShrink: new THREE.MeshStandardMaterial({
          color: "#10b981",
          roughness: 0.2,
          emissive: "#047857",
          emissiveIntensity: 0.5,
        }),
        propellerCW: holoGlass,
        propellerCCW: holoGlass,
        pixhawkCase: new THREE.MeshStandardMaterial({
          color: "#0284c7",
          roughness: 0.3,
          emissive: "#0369a1",
          emissiveIntensity: 0.5,
        }),
        gpsMast: holoGlass,
        gpsPuck: new THREE.MeshStandardMaterial({
          color: "#a855f7",
          emissive: "#7e22ce",
          emissiveIntensity: 0.5,
        }),
        batteryPack: new THREE.MeshStandardMaterial({
          color: "#2563eb",
          roughness: 0.3,
          emissive: "#1d4ed8",
          emissiveIntensity: 0.6,
        }),
        landingSkids: holoGlass,
        cameraBody: new THREE.MeshStandardMaterial({
          color: "#f97316",
          emissive: "#c2410c",
          emissiveIntensity: 0.4,
        }),
        lensGlass: holoGlass,
        screws: holoGlass,
      };
    }

    // Realistic CAD materials matching Image 1
    return {
      topPlate: new THREE.MeshStandardMaterial({
        color: "#18181b",
        roughness: 0.45,
        metalness: 0.35,
      }),
      bottomPdb: new THREE.MeshStandardMaterial({
        color: "#111827",
        roughness: 0.5,
        metalness: 0.4,
      }),
      copperPads: new THREE.MeshStandardMaterial({
        color: "#d97706",
        roughness: 0.2,
        metalness: 0.9,
      }),
      frontArm: new THREE.MeshStandardMaterial({
        color: frontArmColor,
        roughness: 0.35,
        metalness: 0.08,
      }),
      rearArm: new THREE.MeshStandardMaterial({
        color: rearArmColor,
        roughness: 0.35,
        metalness: 0.08,
      }),
      motorBell: new THREE.MeshStandardMaterial({
        color: "#dc2626", // Anodized Red 2212 Outrunner Bell
        roughness: 0.25,
        metalness: 0.85,
      }),
      motorWindings: new THREE.MeshStandardMaterial({
        color: "#b45309", // Copper Wire Coils
        roughness: 0.4,
        metalness: 0.8,
      }),
      escShrink: new THREE.MeshStandardMaterial({
        color: "#eab308", // Yellow shrink-wrap
        roughness: 0.6,
        metalness: 0.1,
      }),
      propellerCW: new THREE.MeshStandardMaterial({
        color: "#18181b", // Black Nylon 1045
        roughness: 0.3,
        metalness: 0.15,
      }),
      propellerCCW: new THREE.MeshStandardMaterial({
        color: "#18181b", // Black Nylon 1045
        roughness: 0.3,
        metalness: 0.15,
      }),
      pixhawkCase: new THREE.MeshStandardMaterial({
        color: "#18181b",
        roughness: 0.4,
        metalness: 0.5,
      }),
      gpsMast: new THREE.MeshStandardMaterial({
        color: "#e2e8f0",
        roughness: 0.3,
        metalness: 0.6,
      }),
      gpsPuck: new THREE.MeshStandardMaterial({
        color: "#cbd5e1",
        roughness: 0.35,
        metalness: 0.4,
      }),
      batteryPack: new THREE.MeshStandardMaterial({
        color: "#2563eb", // Vibrant Blue 3S LiPo PVC wrap
        roughness: 0.45,
        metalness: 0.1,
      }),
      landingSkids: new THREE.MeshStandardMaterial({
        color: "#f1f5f9", // Crisp White/Silver Arched Skids
        roughness: 0.35,
        metalness: 0.15,
      }),
      cameraBody: new THREE.MeshStandardMaterial({
        color: "#ea580c", // RunCam Orange
        roughness: 0.4,
        metalness: 0.4,
      }),
      lensGlass: new THREE.MeshStandardMaterial({
        color: "#0f172a",
        roughness: 0.1,
        metalness: 0.95,
      }),
      screws: new THREE.MeshStandardMaterial({
        color: "#d4d4d8",
        roughness: 0.2,
        metalness: 0.9,
      }),
    };
  }, [isElectronicMode, frontArmColor, rearArmColor]);

  // Frame animation loop: spinning propellers and blinking status LED
  useFrame((_, delta) => {
    const spinBaseSpeed = isArmed ? 18 + (throttlePct / 100) * 35 : 0;
    const spinSpeed = spinBaseSpeed * delta;

    if (spinSpeed > 0) {
      if (prop1Ref.current) prop1Ref.current.rotation.y -= spinSpeed; // CCW
      if (prop2Ref.current) prop2Ref.current.rotation.y += spinSpeed; // CW
      if (prop3Ref.current) prop3Ref.current.rotation.y -= spinSpeed; // CCW
      if (prop4Ref.current) prop4Ref.current.rotation.y += spinSpeed; // CW
    }

    pulseRef.current += delta * 3;
    if (fcLedRef.current) {
      const time = Date.now() * 0.003;
      fcLedRef.current.intensity = Math.sin(time) > 0 ? 2.5 : 0.2;
    }
  });

  // Helper to determine component visibility and highlight
  const getComponentVisuals = (id: string) => {
    const isHidden = hiddenComponents.includes(id);
    const isIsolated = isolatedComponent ? isolatedComponent === id : true;
    const isSelected = selectedComponent === id;

    return {
      visible: !isHidden && isIsolated,
      isSelected,
    };
  };

  const t = explosionLevel; // 0 to 1

  return (
    <group position={[0, -0.015, 0]}>
      {/* ================= 1. BOTTOM CENTER PLATE & INTEGRATED PDB ================= */}
      {(() => {
        const { visible, isSelected } = getComponentVisuals("frame-plates");
        return (
          <group
            position={[0, -t * 0.09, 0]}
            visible={visible}
            onClick={(e) => {
              e.stopPropagation();
              onSelect("frame-plates");
            }}
          >
            {/* Bottom Glass-Fiber PCB Plate */}
            <mesh receiveShadow castShadow>
              <cylinderGeometry args={[0.076, 0.076, 0.0022, 8]} />
              <primitive object={materials.bottomPdb} attach="material" />
            </mesh>

            {/* Integrated Copper PDB Ring for ESC Power Bus */}
            <mesh position={[0, 0.0013, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.046, 0.07, 8]} />
              <primitive object={materials.copperPads} attach="material" />
            </mesh>

            {/* M3 Socket Head Screws clamping bottom arms */}
            {[-1, 1].map((sx) =>
              [-1, 1].map((sz) => (
                <group key={`screw-b-${sx}-${sz}`} position={[sx * 0.045, -0.002, sz * 0.045]}>
                  <mesh>
                    <cylinderGeometry args={[0.0025, 0.0025, 0.002, 8]} />
                    <primitive object={materials.screws} attach="material" />
                  </mesh>
                </group>
              ))
            )}
          </group>
        );
      })()}

      {/* ================= 2. TOP CENTER STRUCTURAL PLATE ================= */}
      {(() => {
        const { visible, isSelected } = getComponentVisuals("frame-plates");
        return (
          <group
            position={[0, 0.038 + t * 0.24, 0]}
            visible={visible}
            onClick={(e) => {
              e.stopPropagation();
              onSelect("frame-plates");
            }}
          >
            {/* Top Plate with battery strap cutouts */}
            <mesh receiveShadow castShadow>
              <cylinderGeometry args={[0.074, 0.074, 0.0022, 8]} />
              <primitive object={materials.topPlate} attach="material" />
            </mesh>

            {/* Top Gold Standoff Hex Pillars (4x) */}
            {[-0.038, 0.038].map((x) =>
              [-0.038, 0.038].map((z) => (
                <mesh key={`post-${x}-${z}`} position={[x, -0.019, z]}>
                  <cylinderGeometry args={[0.003, 0.003, 0.036, 6]} />
                  <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.2} />
                </mesh>
              ))
            )}
          </group>
        );
      })()}

      {/* ================= 3. FOUR F450 LATTICE TRUSS ARMS ================= */}
      {/* Front-Right (M1) White Arm */}
      {(() => {
        const { visible, isSelected } = getComponentVisuals("arms-fl-fr");
        return (
          <group
            position={[armOffset * 0.5 + t * 0.12, 0.019, -armOffset * 0.5 - t * 0.12]}
            rotation={[0, Math.PI / 4, 0]}
            visible={visible}
            onClick={(e) => {
              e.stopPropagation();
              onSelect("arms-fl-fr");
            }}
          >
            {/* Main Arm Beam */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.032, 0.024, 0.185]} />
              <primitive object={materials.frontArm} attach="material" />
            </mesh>

            {/* Authentic F450 Triangular Truss Lattice Cutouts */}
            {[-0.045, -0.015, 0.015, 0.045].map((zPos, idx) => (
              <mesh key={idx} position={[0, 0, zPos]}>
                <boxGeometry args={[0.018, 0.028, 0.016]} />
                <meshBasicMaterial color="#0b0f19" wireframe={false} />
              </mesh>
            ))}

            {/* Circular Motor Mount Ring at Arm Tip */}
            <mesh position={[0, 0.008, -0.092]}>
              <cylinderGeometry args={[0.019, 0.019, 0.014, 16]} />
              <primitive object={materials.frontArm} attach="material" />
            </mesh>

            {/* 3 Blue Silicone Motor Lead Wires along Arm */}
            {[-0.006, 0, 0.006].map((offset, i) => (
              <mesh key={i} position={[offset, 0.013, -0.04]}>
                <cylinderGeometry args={[0.0012, 0.0012, 0.11, 8]} />
                <meshStandardMaterial color="#2563eb" roughness={0.4} />
              </mesh>
            ))}

            {/* 3x 3.5mm Gold Bullet Connectors at ESC junction */}
            {[-0.006, 0, 0.006].map((offset, i) => (
              <mesh key={`b-${i}`} position={[offset, 0.013, 0.02]}>
                <cylinderGeometry args={[0.002, 0.002, 0.01, 8]} />
                <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
              </mesh>
            ))}
          </group>
        );
      })()}

      {/* Front-Left (M2) White Arm */}
      {(() => {
        const { visible, isSelected } = getComponentVisuals("arms-fl-fr");
        return (
          <group
            position={[-armOffset * 0.5 - t * 0.12, 0.019, -armOffset * 0.5 - t * 0.12]}
            rotation={[0, -Math.PI / 4, 0]}
            visible={visible}
            onClick={(e) => {
              e.stopPropagation();
              onSelect("arms-fl-fr");
            }}
          >
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.032, 0.024, 0.185]} />
              <primitive object={materials.frontArm} attach="material" />
            </mesh>
            {[-0.045, -0.015, 0.015, 0.045].map((zPos, idx) => (
              <mesh key={idx} position={[0, 0, zPos]}>
                <boxGeometry args={[0.018, 0.028, 0.016]} />
                <meshBasicMaterial color="#0b0f19" />
              </mesh>
            ))}
            <mesh position={[0, 0.008, -0.092]}>
              <cylinderGeometry args={[0.019, 0.019, 0.014, 16]} />
              <primitive object={materials.frontArm} attach="material" />
            </mesh>
            {[-0.006, 0, 0.006].map((offset, i) => (
              <mesh key={i} position={[offset, 0.013, -0.04]}>
                <cylinderGeometry args={[0.0012, 0.0012, 0.11, 8]} />
                <meshStandardMaterial color="#2563eb" roughness={0.4} />
              </mesh>
            ))}
            {[-0.006, 0, 0.006].map((offset, i) => (
              <mesh key={`b-${i}`} position={[offset, 0.013, 0.02]}>
                <cylinderGeometry args={[0.002, 0.002, 0.01, 8]} />
                <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
              </mesh>
            ))}
          </group>
        );
      })()}

      {/* Rear-Left (M3) Red Arm */}
      {(() => {
        const { visible, isSelected } = getComponentVisuals("arms-rl-rr");
        return (
          <group
            position={[-armOffset * 0.5 - t * 0.12, 0.019, armOffset * 0.5 + t * 0.12]}
            rotation={[0, -3 * Math.PI / 4, 0]}
            visible={visible}
            onClick={(e) => {
              e.stopPropagation();
              onSelect("arms-rl-rr");
            }}
          >
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.032, 0.024, 0.185]} />
              <primitive object={materials.rearArm} attach="material" />
            </mesh>
            {[-0.045, -0.015, 0.015, 0.045].map((zPos, idx) => (
              <mesh key={idx} position={[0, 0, zPos]}>
                <boxGeometry args={[0.018, 0.028, 0.016]} />
                <meshBasicMaterial color="#0b0f19" />
              </mesh>
            ))}
            <mesh position={[0, 0.008, -0.092]}>
              <cylinderGeometry args={[0.019, 0.019, 0.014, 16]} />
              <primitive object={materials.rearArm} attach="material" />
            </mesh>
            {[-0.006, 0, 0.006].map((offset, i) => (
              <mesh key={i} position={[offset, 0.013, -0.04]}>
                <cylinderGeometry args={[0.0012, 0.0012, 0.11, 8]} />
                <meshStandardMaterial color="#2563eb" roughness={0.4} />
              </mesh>
            ))}
            {[-0.006, 0, 0.006].map((offset, i) => (
              <mesh key={`b-${i}`} position={[offset, 0.013, 0.02]}>
                <cylinderGeometry args={[0.002, 0.002, 0.01, 8]} />
                <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
              </mesh>
            ))}
          </group>
        );
      })()}

      {/* Rear-Right (M4) Red Arm */}
      {(() => {
        const { visible, isSelected } = getComponentVisuals("arms-rl-rr");
        return (
          <group
            position={[armOffset * 0.5 + t * 0.12, 0.019, armOffset * 0.5 + t * 0.12]}
            rotation={[0, 3 * Math.PI / 4, 0]}
            visible={visible}
            onClick={(e) => {
              e.stopPropagation();
              onSelect("arms-rl-rr");
            }}
          >
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.032, 0.024, 0.185]} />
              <primitive object={materials.rearArm} attach="material" />
            </mesh>
            {[-0.045, -0.015, 0.015, 0.045].map((zPos, idx) => (
              <mesh key={idx} position={[0, 0, zPos]}>
                <boxGeometry args={[0.018, 0.028, 0.016]} />
                <meshBasicMaterial color="#0b0f19" />
              </mesh>
            ))}
            <mesh position={[0, 0.008, -0.092]}>
              <cylinderGeometry args={[0.019, 0.019, 0.014, 16]} />
              <primitive object={materials.rearArm} attach="material" />
            </mesh>
            {[-0.006, 0, 0.006].map((offset, i) => (
              <mesh key={i} position={[offset, 0.013, -0.04]}>
                <cylinderGeometry args={[0.0012, 0.0012, 0.11, 8]} />
                <meshStandardMaterial color="#2563eb" roughness={0.4} />
              </mesh>
            ))}
            {[-0.006, 0, 0.006].map((offset, i) => (
              <mesh key={`b-${i}`} position={[offset, 0.013, 0.02]}>
                <cylinderGeometry args={[0.002, 0.002, 0.01, 8]} />
                <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
              </mesh>
            ))}
          </group>
        );
      })()}

      {/* ================= 4. FOUR 2212 RED ANODIZED OUTRUNNER MOTORS ================= */}
      {(() => {
        const { visible, isSelected } = getComponentVisuals("brushless-motors");
        const motorPositions: [number, number, string][] = [
          [armOffset, -armOffset, "M1: Front-Right (CCW)"],
          [-armOffset, -armOffset, "M2: Front-Left (CW)"],
          [-armOffset, armOffset, "M3: Rear-Left (CCW)"],
          [armOffset, armOffset, "M4: Rear-Right (CW)"],
        ];

        return (
          <group visible={visible}>
            {motorPositions.map(([mx, mz, label], idx) => {
              const explodeX = mx + Math.sign(mx) * t * 0.15;
              const explodeZ = mz + Math.sign(mz) * t * 0.15;
              const explodeY = 0.038 + t * 0.35;

              return (
                <group
                  key={idx}
                  position={[explodeX, explodeY, explodeZ]}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect("brushless-motors");
                  }}
                >
                  {/* Black Stator Base with 4 Mounting screw holes */}
                  <mesh position={[0, -0.004, 0]}>
                    <cylinderGeometry args={[0.014, 0.014, 0.008, 16]} />
                    <meshStandardMaterial color="#18181b" roughness={0.4} metalness={0.7} />
                  </mesh>

                  {/* Copper Windings visible through side gaps */}
                  <mesh position={[0, 0.004, 0]}>
                    <cylinderGeometry args={[0.0125, 0.0125, 0.01, 16]} />
                    <primitive object={materials.motorWindings} attach="material" />
                  </mesh>

                  {/* Metallic Anodized Red Rotor Bell with 4 Cooling Slots */}
                  <mesh position={[0, 0.013, 0]} castShadow>
                    <cylinderGeometry args={[0.014, 0.014, 0.016, 20]} />
                    <primitive object={materials.motorBell} attach="material" />
                  </mesh>

                  {/* Top Vent Cutout Facets */}
                  {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, vIdx) => (
                    <mesh
                      key={vIdx}
                      position={[
                        Math.cos(angle) * 0.008,
                        0.0215,
                        Math.sin(angle) * 0.008,
                      ]}
                    >
                      <boxGeometry args={[0.004, 0.002, 0.004]} />
                      <meshBasicMaterial color="#09090b" />
                    </mesh>
                  ))}

                  {/* Propeller Adapter Shaft (M5 Silver / Black) */}
                  <mesh position={[0, 0.026, 0]}>
                    <cylinderGeometry args={[0.0025, 0.0025, 0.012, 10]} />
                    <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.15} />
                  </mesh>

                  {/* Conical Prop Bullet Dome Nut (Silver for CW, Black for CCW) */}
                  <mesh position={[0, 0.035, 0]}>
                    <coneGeometry args={[0.006, 0.011, 14]} />
                    <meshStandardMaterial
                      color={idx === 1 || idx === 3 ? "#0f172a" : "#cbd5e1"}
                      metalness={0.8}
                      roughness={0.2}
                    />
                  </mesh>
                </group>
              );
            })}
          </group>
        );
      })()}

      {/* ================= 5. FOUR 30A ESCS MOUNTED ON ARMS ================= */}
      {(() => {
        const { visible, isSelected } = getComponentVisuals("esc-system");
        const escConfigs = [
          { x: armOffset * 0.55, z: -armOffset * 0.55, rot: Math.PI / 4 },
          { x: -armOffset * 0.55, z: -armOffset * 0.55, rot: -Math.PI / 4 },
          { x: -armOffset * 0.55, z: armOffset * 0.55, rot: -3 * Math.PI / 4 },
          { x: armOffset * 0.55, z: armOffset * 0.55, rot: 3 * Math.PI / 4 },
        ];

        return (
          <group visible={visible}>
            {escConfigs.map((cfg, idx) => {
              const exX = cfg.x + Math.sign(cfg.x) * t * 0.18;
              const exZ = cfg.z + Math.sign(cfg.z) * t * 0.18;
              const exY = 0.002 - t * 0.22;

              return (
                <group
                  key={idx}
                  position={[exX, exY, exZ]}
                  rotation={[0, cfg.rot, 0]}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect("esc-system");
                  }}
                >
                  {/* ESC Shrinkwrap Enclosure */}
                  <mesh castShadow receiveShadow>
                    <boxGeometry args={[0.022, 0.008, 0.048]} />
                    <primitive object={materials.escShrink} attach="material" />
                  </mesh>

                  {/* Aluminum Heat Sink Plate on Top */}
                  <mesh position={[0, 0.0045, 0]}>
                    <boxGeometry args={[0.019, 0.001, 0.035]} />
                    <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
                  </mesh>

                  {/* Low-ESR Electrolytic Filter Capacitor */}
                  <mesh position={[0, 0.006, -0.022]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.0045, 0.0045, 0.013, 12]} />
                    <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.7} />
                  </mesh>

                  {/* 3-pin PWM Servo Signal Wire back to Pixhawk */}
                  <mesh position={[0.005, 0, 0.026]}>
                    <boxGeometry args={[0.004, 0.002, 0.012]} />
                    <meshBasicMaterial color="#10b981" />
                  </mesh>
                </group>
              );
            })}
          </group>
        );
      })()}

      {/* ================= 6. FOUR 1045 AERODYNAMIC PROPELLERS ================= */}
      {(() => {
        const { visible, isSelected } = getComponentVisuals("propulsion-system");
        const propHeight = 0.073 + t * 0.65;

        return (
          <group visible={visible}>
            {/* Propeller 1: Front-Right (CCW) */}
            <group
              ref={prop1Ref}
              position={[armOffset + t * 0.15, propHeight, -armOffset - t * 0.15]}
              onClick={(e) => {
                e.stopPropagation();
                onSelect("propulsion-system");
              }}
            >
              <mesh castShadow>
                <boxGeometry args={[0.254, 0.0025, 0.022]} />
                <primitive object={materials.propellerCCW} attach="material" />
              </mesh>
              <mesh position={[0, 0.003, 0]}>
                <cylinderGeometry args={[0.007, 0.007, 0.006, 14]} />
                <meshStandardMaterial color="#0284c7" metalness={0.7} roughness={0.3} />
              </mesh>
            </group>

            {/* Propeller 2: Front-Left (CW) */}
            <group
              ref={prop2Ref}
              position={[-armOffset - t * 0.15, propHeight, -armOffset - t * 0.15]}
              onClick={(e) => {
                e.stopPropagation();
                onSelect("propulsion-system");
              }}
            >
              <mesh castShadow>
                <boxGeometry args={[0.254, 0.0025, 0.022]} />
                <primitive object={materials.propellerCW} attach="material" />
              </mesh>
              <mesh position={[0, 0.003, 0]}>
                <cylinderGeometry args={[0.007, 0.007, 0.006, 14]} />
                <meshStandardMaterial color="#ea580c" metalness={0.7} roughness={0.3} />
              </mesh>
            </group>

            {/* Propeller 3: Rear-Left (CCW) */}
            <group
              ref={prop3Ref}
              position={[-armOffset - t * 0.15, propHeight, armOffset + t * 0.15]}
              onClick={(e) => {
                e.stopPropagation();
                onSelect("propulsion-system");
              }}
            >
              <mesh castShadow>
                <boxGeometry args={[0.254, 0.0025, 0.022]} />
                <primitive object={materials.propellerCCW} attach="material" />
              </mesh>
              <mesh position={[0, 0.003, 0]}>
                <cylinderGeometry args={[0.007, 0.007, 0.006, 14]} />
                <meshStandardMaterial color="#0284c7" metalness={0.7} roughness={0.3} />
              </mesh>
            </group>

            {/* Propeller 4: Rear-Right (CW) */}
            <group
              ref={prop4Ref}
              position={[armOffset + t * 0.15, propHeight, armOffset + t * 0.15]}
              onClick={(e) => {
                e.stopPropagation();
                onSelect("propulsion-system");
              }}
            >
              <mesh castShadow>
                <boxGeometry args={[0.254, 0.0025, 0.022]} />
                <primitive object={materials.propellerCW} attach="material" />
              </mesh>
              <mesh position={[0, 0.003, 0]}>
                <cylinderGeometry args={[0.007, 0.007, 0.006, 14]} />
                <meshStandardMaterial color="#ea580c" metalness={0.7} roughness={0.3} />
              </mesh>
            </group>
          </group>
        );
      })()}

      {/* ================= 7. PIXHAWK / ARDUPILOT FLIGHT CONTROLLER ================= */}
      {(() => {
        const { visible, isSelected } = getComponentVisuals("flight-controller");
        return (
          <group
            position={[0, 0.048 + t * 0.42, 0]}
            visible={visible}
            onClick={(e) => {
              e.stopPropagation();
              onSelect("flight-controller");
            }}
          >
            {/* 4x Silicone Vibration Damping Balls */}
            {[-0.02, 0.02].map((x) =>
              [-0.02, 0.02].map((z) => (
                <mesh key={`${x}-${z}`} position={[x, -0.005, z]}>
                  <sphereGeometry args={[0.004, 10, 10]} />
                  <meshStandardMaterial color="#38bdf8" roughness={0.8} />
                </mesh>
              ))
            )}

            {/* Pixhawk Main Molded Enclosure */}
            <mesh castShadow position={[0, 0.006, 0]}>
              <boxGeometry args={[0.05, 0.014, 0.082]} />
              <primitive object={materials.pixhawkCase} attach="material" />
            </mesh>

            {/* Forward Flight Orientation Arrow */}
            <mesh position={[0, 0.0135, -0.015]} rotation={[-Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.005, 0.012, 3]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>

            {/* Servo Pin Header Row (8 Channels) */}
            <mesh position={[0, 0.01, 0.038]}>
              <boxGeometry args={[0.042, 0.008, 0.004]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
            </mesh>

            {/* High-Brightness RGB Status LED */}
            <mesh position={[0, 0.014, 0.008]}>
              <cylinderGeometry args={[0.0035, 0.0035, 0.002, 14]} />
              <meshBasicMaterial color="#22c55e" />
            </mesh>
            <pointLight
              ref={fcLedRef}
              position={[0, 0.02, 0.008]}
              color="#22c55e"
              intensity={1.8}
              distance={0.35}
            />
          </group>
        );
      })()}

      {/* ================= 8. NEO-M8N GPS DISC SAUCER (On Rear Arm Deck) ================= */}
      {(() => {
        const { visible, isSelected } = getComponentVisuals("gps-compass");
        // In Image 1, the GPS saucer is mounted cleanly on one of the rear red arms!
        return (
          <group
            position={[armOffset * 0.45 + t * 0.25, 0.038 + t * 0.45, armOffset * 0.45 + t * 0.25]}
            visible={visible}
            onClick={(e) => {
              e.stopPropagation();
              onSelect("gps-compass");
            }}
          >
            {/* GPS Saucer Puck */}
            <mesh castShadow position={[0, 0.008, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 0.012, 24]} />
              <primitive object={materials.gpsPuck} attach="material" />
            </mesh>

            {/* GPS Compass Orientation Marking */}
            <mesh position={[0, 0.0145, -0.007]} rotation={[-Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.004, 0.008, 3]} />
              <meshBasicMaterial color="#ef4444" />
            </mesh>

            {/* GPS Shielded Signal Cable */}
            <mesh position={[-0.012, 0.004, -0.015]} rotation={[0, -Math.PI / 4, 0]}>
              <cylinderGeometry args={[0.0015, 0.0015, 0.04, 8]} />
              <meshStandardMaterial color="#2563eb" roughness={0.5} />
            </mesh>
          </group>
        );
      })()}

      {/* ================= 9. 3S LIPO BATTERY PACK WITH ORANGE XT60 (Image 1 top mount) ================= */}
      {(() => {
        const { visible, isSelected } = getComponentVisuals("power-battery");
        return (
          <group
            position={[0, 0.065 + t * 0.48, 0]}
            visible={visible}
            onClick={(e) => {
              e.stopPropagation();
              onSelect("power-battery");
            }}
          >
            {/* Blue PVC Shrink-wrapped 3S Battery */}
            <mesh castShadow>
              <boxGeometry args={[0.034, 0.026, 0.108]} />
              <primitive object={materials.batteryPack} attach="material" />
            </mesh>

            {/* Black Nylon Velcro Fastening Strap with Buckle */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.036, 0.028, 0.024]} />
              <meshStandardMaterial color="#09090b" roughness={0.9} />
            </mesh>

            {/* Heavy-Gauge 12AWG Red & Black Silicone Power Leads */}
            <mesh position={[0.006, 0.008, -0.06]} rotation={[Math.PI / 4, 0, 0]}>
              <cylinderGeometry args={[0.002, 0.002, 0.02, 8]} />
              <meshStandardMaterial color="#dc2626" roughness={0.3} />
            </mesh>
            <mesh position={[-0.006, 0.008, -0.06]} rotation={[Math.PI / 4, 0, 0]}>
              <cylinderGeometry args={[0.002, 0.002, 0.02, 8]} />
              <meshStandardMaterial color="#171717" roughness={0.3} />
            </mesh>

            {/* Authentic Orange XT60 High-Current Connector Plug */}
            <mesh position={[0, 0.012, -0.072]}>
              <boxGeometry args={[0.016, 0.009, 0.015]} />
              <meshStandardMaterial color="#f97316" roughness={0.35} metalness={0.4} />
            </mesh>

            {/* Gold Bullet Sockets inside XT60 */}
            {[-0.004, 0.004].map((pinX, pIdx) => (
              <mesh key={pIdx} position={[pinX, 0.012, -0.078]}>
                <cylinderGeometry args={[0.0018, 0.0018, 0.006, 8]} />
                <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.15} />
              </mesh>
            ))}
          </group>
        );
      })()}

      {/* ================= 10. ARCHED LANDING LEGS (Authentic Image 1 Geometry) ================= */}
      {(() => {
        const { visible, isSelected } = getComponentVisuals("landing-gear");
        // In Image 1, 4 arched legs sweep downwards and outward with 3 weight-relief holes
        const legOffsets: [number, number, number][] = [
          [0.09, -0.09, -Math.PI / 4],
          [-0.09, -0.09, Math.PI / 4],
          [-0.09, 0.09, (3 * Math.PI) / 4],
          [0.09, 0.09, (-3 * Math.PI) / 4],
        ];

        return (
          <group
            position={[0, -t * 0.4, 0]}
            visible={visible}
            onClick={(e) => {
              e.stopPropagation();
              onSelect("landing-gear");
            }}
          >
            {legOffsets.map(([lx, lz, angle], idx) => (
              <group key={idx} position={[lx, -0.038, lz]} rotation={[0, angle, 0]}>
                {/* Upper Leg Section angled down */}
                <mesh position={[0.018, -0.035, 0]} rotation={[0, 0, -0.38]} castShadow>
                  <boxGeometry args={[0.012, 0.09, 0.014]} />
                  <primitive object={materials.landingSkids} attach="material" />
                </mesh>

                {/* 3x Oval Weight-Relief Cutout Pockets */}
                {[-0.015, -0.035, -0.055].map((yCut, cIdx) => (
                  <mesh
                    key={cIdx}
                    position={[0.018 + cIdx * 0.008, yCut, 0]}
                    rotation={[0, 0, -0.38]}
                  >
                    <boxGeometry args={[0.007, 0.012, 0.016]} />
                    <meshBasicMaterial color="#0b0f19" />
                  </mesh>
                ))}

                {/* Lower Arched Foot Landing Pad */}
                <mesh position={[0.036, -0.076, 0]} rotation={[0, 0, 0.15]}>
                  <boxGeometry args={[0.014, 0.012, 0.024]} />
                  <primitive object={materials.landingSkids} attach="material" />
                </mesh>
              </group>
            ))}
          </group>
        );
      })()}

      {/* ================= 11. UNDERSLUNG GIMBAL & CAMERA (Image 1 & 2) ================= */}
      {(() => {
        const { visible, isSelected } = getComponentVisuals("camera-system");
        return (
          <group
            position={[0, -0.042 - t * 0.5, -0.055]}
            visible={visible}
            onClick={(e) => {
              e.stopPropagation();
              onSelect("camera-system");
            }}
          >
            {/* Gimbal Roll Servo */}
            <mesh position={[0, 0.018, 0]}>
              <boxGeometry args={[0.018, 0.012, 0.014]} />
              <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.6} />
            </mesh>

            {/* Gimbal Tilt Bracket */}
            <mesh position={[0, 0.006, 0]}>
              <boxGeometry args={[0.034, 0.003, 0.032]} />
              <meshStandardMaterial color="#09090b" roughness={0.6} />
            </mesh>

            {/* Camera Housing */}
            <mesh position={[0, -0.008, 0]} castShadow>
              <boxGeometry args={[0.022, 0.02, 0.022]} />
              <primitive object={materials.cameraBody} attach="material" />
            </mesh>

            {/* Optical Glass Lens */}
            <mesh position={[0, -0.008, -0.014]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.007, 0.008, 0.008, 16]} />
              <primitive object={materials.lensGlass} attach="material" />
            </mesh>
          </group>
        );
      })()}

      {/* ================= 12. RC RECEIVER & DUAL ANTENNAS (Image 1 rear deck) ================= */}
      {(() => {
        const { visible, isSelected } = getComponentVisuals("rc-receiver");
        return (
          <group
            position={[-armOffset * 0.45 - t * 0.25, 0.038 + t * 0.45, armOffset * 0.45 + t * 0.25]}
            visible={visible}
            onClick={(e) => {
              e.stopPropagation();
              onSelect("rc-receiver");
            }}
          >
            {/* 2.4GHz Receiver Case */}
            <mesh castShadow>
              <boxGeometry args={[0.024, 0.01, 0.042]} />
              <meshStandardMaterial color="#18181b" roughness={0.4} metalness={0.5} />
            </mesh>

            {/* 2.4GHz Whisker Antennas angled at 90 degrees */}
            <mesh position={[-0.01, 0.012, 0.02]} rotation={[0, 0, Math.PI / 4]}>
              <cylinderGeometry args={[0.0008, 0.0008, 0.05, 6]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0.01, 0.012, 0.02]} rotation={[0, 0, -Math.PI / 4]}>
              <cylinderGeometry args={[0.0008, 0.0008, 0.05, 6]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
        );
      })()}

      {/* ================= 13. ELECTRONIC VIEW MODE: GLOWING SIGNAL & POWER PATHWAYS ================= */}
      {isElectronicMode && (
        <group>
          {/* Main 11.1V Power Bus (Battery -> XT60 -> PDB -> 4 ESCs) in glowing Neon Orange/Red */}
          {[
            [armOffset * 0.55, -armOffset * 0.55],
            [-armOffset * 0.55, -armOffset * 0.55],
            [-armOffset * 0.55, armOffset * 0.55],
            [armOffset * 0.55, armOffset * 0.55],
          ].map(([escX, escZ], i) => (
            <group key={`pwr-${i}`}>
              <mesh position={[escX * 0.5, 0.01, escZ * 0.5]} rotation={[0, Math.atan2(escZ, escX), 0]}>
                <cylinderGeometry args={[0.002, 0.002, Math.hypot(escX, escZ) * 0.9, 8]} />
                <meshBasicMaterial color="#f97316" />
              </mesh>
            </group>
          ))}

          {/* 3-Phase AC Motor Leads (4 ESCs -> 4 Brushless Motors) in Glowing Cyan/Amber */}
          {[
            [armOffset * 0.75, -armOffset * 0.75],
            [-armOffset * 0.75, -armOffset * 0.75],
            [-armOffset * 0.75, armOffset * 0.75],
            [armOffset * 0.75, armOffset * 0.75],
          ].map(([mx, mz], i) => (
            <mesh key={`phase-${i}`} position={[mx, 0.025, mz]}>
              <cylinderGeometry args={[0.0025, 0.0025, 0.06, 8]} />
              <meshBasicMaterial color="#06b6d4" />
            </mesh>
          ))}

          {/* PWM Signal Wires from Pixhawk Main Out -> 4 ESCs in Neon Green */}
          {[
            [armOffset * 0.35, -armOffset * 0.35],
            [-armOffset * 0.35, -armOffset * 0.35],
            [-armOffset * 0.35, armOffset * 0.35],
            [armOffset * 0.35, armOffset * 0.35],
          ].map(([px, pz], i) => (
            <mesh key={`pwm-${i}`} position={[px, 0.035, pz]}>
              <cylinderGeometry args={[0.0012, 0.0012, 0.055, 6]} />
              <meshBasicMaterial color="#10b981" />
            </mesh>
          ))}

          {/* GPS Bus: Pixhawk -> GPS Saucer in Glowing Purple */}
          <mesh
            position={[armOffset * 0.22, 0.045, armOffset * 0.22]}
            rotation={[0, -Math.PI / 4, 0]}
          >
            <cylinderGeometry args={[0.0015, 0.0015, 0.09, 8]} />
            <meshBasicMaterial color="#a855f7" />
          </mesh>

          {/* RC Signal Bus: Receiver -> Pixhawk in Glowing Cyan */}
          <mesh
            position={[-armOffset * 0.22, 0.045, armOffset * 0.22]}
            rotation={[0, Math.PI / 4, 0]}
          >
            <cylinderGeometry args={[0.0015, 0.0015, 0.09, 8]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>

          {/* Gimbal Servo Signal Bus in Glowing Yellow */}
          <mesh position={[0, 0.015, -0.03]}>
            <cylinderGeometry args={[0.0015, 0.0015, 0.045, 8]} />
            <meshBasicMaterial color="#eab308" />
          </mesh>
        </group>
      )}
    </group>
  );
}
