"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CustomizationSettings } from "@/types/machine";

interface DroneBModelProps {
  customization?: CustomizationSettings;
  explosionLevel: number; // 0 (assembled) to 1 (fully exploded)
  selectedComponent: string | null;
  isolatedComponent: string | null;
  hiddenComponents: string[];
  onSelect: (componentId: string) => void;
  isArmed?: boolean;
}

export default function DroneBModel({
  customization,
  explosionLevel,
  selectedComponent,
  isolatedComponent,
  hiddenComponents,
  onSelect,
  isArmed = true,
}: DroneBModelProps) {
  // Propeller rotation refs
  const prop1Ref = useRef<THREE.Group>(null); // Front-Right
  const prop2Ref = useRef<THREE.Group>(null); // Front-Left
  const prop3Ref = useRef<THREE.Group>(null); // Rear-Left
  const prop4Ref = useRef<THREE.Group>(null); // Rear-Right

  const t = explosionLevel; // 0 to 1

  // Color & material customization
  const chassisColor = customization?.droneBChassisColor || customization?.paintColor || "#475569";
  const armColor = customization?.droneBArmColor || "#334155";
  const motorColor = customization?.droneBMotorColor || "#1e293b";
  const propColor = customization?.droneBPropellerColor || "#0f172a";

  const finish = customization?.finish || "metallic";
  const frameRoughness = finish === "matte" ? 0.85 : finish === "metallic" ? 0.2 : 0.45;
  const frameMetalness = finish === "metallic" ? 0.85 : finish === "matte" ? 0.1 : 0.5;

  const materials = useMemo(() => {
    return {
      frame: new THREE.MeshStandardMaterial({
        color: chassisColor,
        roughness: frameRoughness,
        metalness: frameMetalness,
      }),
      coverPlate: new THREE.MeshStandardMaterial({
        color: chassisColor,
        roughness: frameRoughness,
        metalness: frameMetalness,
      }),
      sideCover: new THREE.MeshStandardMaterial({
        color: "#64748b",
        roughness: 0.35,
        metalness: 0.6,
      }),
      arm: new THREE.MeshStandardMaterial({
        color: armColor,
        roughness: 0.4,
        metalness: 0.45,
      }),
      controller: new THREE.MeshStandardMaterial({
        color: "#1e293b",
        roughness: 0.6,
        metalness: 0.3,
      }),
      motorStator: new THREE.MeshStandardMaterial({
        color: motorColor,
        roughness: 0.3,
        metalness: 0.8,
      }),
      motorShaft: new THREE.MeshStandardMaterial({
        color: "#e2e8f0",
        roughness: 0.2,
        metalness: 0.9,
      }),
      propeller: new THREE.MeshStandardMaterial({
        color: propColor,
        roughness: 0.3,
        metalness: 0.2,
      }),
      stand: new THREE.MeshStandardMaterial({
        color: "#334155",
        roughness: 0.5,
        metalness: 0.4,
      }),
      bolt: new THREE.MeshStandardMaterial({
        color: "#cbd5e1",
        roughness: 0.2,
        metalness: 0.9,
      }),
      nut: new THREE.MeshStandardMaterial({
        color: "#94a3b8",
        roughness: 0.25,
        metalness: 0.85,
      }),
      selectedHighlight: new THREE.MeshStandardMaterial({
        color: "#38bdf8",
        emissive: "#0284c7",
        emissiveIntensity: 0.6,
        roughness: 0.2,
        metalness: 0.5,
      }),
    };
  }, [chassisColor, armColor, motorColor, propColor, frameRoughness, frameMetalness]);

  // Propeller dynamic spin loop
  useFrame((_, delta) => {
    if (!isArmed) return;
    const speed = 18 * delta;
    if (prop1Ref.current) prop1Ref.current.rotation.y -= speed; // CCW
    if (prop2Ref.current) prop2Ref.current.rotation.y += speed; // CW
    if (prop3Ref.current) prop3Ref.current.rotation.y -= speed; // CCW
    if (prop4Ref.current) prop4Ref.current.rotation.y += speed; // CW
  });

  // Helper for visibility and selection
  const getVisual = (id: string) => {
    const isHidden = hiddenComponents.includes(id);
    const isIsolated = isolatedComponent ? isolatedComponent === id : true;
    const isSelected = selectedComponent === id;
    return {
      visible: !isHidden && isIsolated,
      mat: (defaultMat: THREE.Material) => (isSelected ? materials.selectedHighlight : defaultMat),
    };
  };

  // Dimensions matching SolidWorks Drone+Drgs.pdf
  // Fuselage: 300mm x 300mm x 70mm octagonal base (radius ~ 0.15m)
  // Arms: 325mm length, motor at 300mm (0.3m from center => offset X,Z = 0.212m)
  const armOffset = 0.212; // 0.3m * sin(45°)

  return (
    <group position={[0, -0.05, 0]}>
      {/* ================= 1. OCTAGONAL MAIN FRAME ================= */}
      {(() => {
        const { visible, mat } = getVisual("main-frame");
        return (
          <group
            visible={visible}
            onClick={(e) => {
              e.stopPropagation();
              onSelect("main-frame");
            }}
          >
            {/* Main Octagonal Hull Floor */}
            <mesh position={[0, -0.03, 0]} receiveShadow castShadow>
              <cylinderGeometry args={[0.15, 0.15, 0.012, 8]} />
              <primitive object={mat(materials.frame)} attach="material" />
            </mesh>

            {/* Octagonal Vertical Perimeter Wall Shell (70mm total height) */}
            <mesh position={[0, 0.005, 0]} receiveShadow castShadow>
              <cylinderGeometry args={[0.15, 0.15, 0.07, 8, 1, true]} />
              <primitive object={mat(materials.frame)} attach="material" />
            </mesh>

            {/* Internal Floor Standoff Bosses for Controller Unit */}
            {[-0.088, 0.088].map((x) =>
              [-0.015, 0.015].map((z) => (
                <mesh key={`boss-${x}-${z}`} position={[x, -0.018, z]}>
                  <cylinderGeometry args={[0.006, 0.006, 0.014, 12]} />
                  <primitive object={mat(materials.frame)} attach="material" />
                </mesh>
              ))
            )}

            {/* 4 Diagonal Arm Sockets (at 45°, 135°, 225°, 315°) */}
            {[Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4].map(
              (angle, idx) => (
                <group
                  key={`socket-${idx}`}
                  position={[Math.cos(angle) * 0.145, 0.005, Math.sin(angle) * 0.145]}
                  rotation={[0, -angle + Math.PI / 2, 0]}
                >
                  <mesh castShadow receiveShadow>
                    <boxGeometry args={[0.045, 0.065, 0.02]} />
                    <primitive object={mat(materials.frame)} attach="material" />
                  </mesh>
                </group>
              )
            )}
          </group>
        );
      })()}

      {/* ================= 2. TOP OCTAGONAL COVER PLATE (300x300x10mm) ================= */}
      {(() => {
        const { visible, mat } = getVisual("cover-plate");
        const coverY = 0.045 + t * 0.35; // Lifts upwards in exploded view
        return (
          <group
            position={[0, coverY, 0]}
            visible={visible}
            onClick={(e) => {
              e.stopPropagation();
              onSelect("cover-plate");
            }}
          >
            {/* Top Octagonal Lid */}
            <mesh receiveShadow castShadow>
              <cylinderGeometry args={[0.15, 0.15, 0.01, 8]} />
              <primitive object={mat(materials.coverPlate)} attach="material" />
            </mesh>

            {/* 8 Perimeter M8 Socket Head Bolts (Page 9 Drawing) */}
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
              const angle = (i * Math.PI) / 4;
              const boltY = 0.012 + t * 0.18;
              return (
                <group
                  key={`c-bolt-${i}`}
                  position={[Math.cos(angle) * 0.138, boltY, Math.sin(angle) * 0.138]}
                >
                  {/* Bolt Head */}
                  <mesh castShadow>
                    <cylinderGeometry args={[0.006, 0.006, 0.008, 12]} />
                    <primitive object={materials.bolt} attach="material" />
                  </mesh>
                  {/* Hex Socket */}
                  <mesh position={[0, 0.004, 0]}>
                    <cylinderGeometry args={[0.0035, 0.0035, 0.002, 6]} />
                    <meshBasicMaterial color="#1e293b" />
                  </mesh>
                  {/* Threaded Shank */}
                  <mesh position={[0, -0.015, 0]}>
                    <cylinderGeometry args={[0.004, 0.004, 0.022, 10]} />
                    <primitive object={materials.bolt} attach="material" />
                  </mesh>
                </group>
              );
            })}
          </group>
        );
      })()}

      {/* ================= 3. CENTRAL CONTROLLER UNIT (200x60x53mm) ================= */}
      {(() => {
        const { visible, mat } = getVisual("controller-unit");
        const ctrlY = 0.005 + t * 0.22;
        return (
          <group
            position={[0, ctrlY, 0]}
            visible={visible}
            onClick={(e) => {
              e.stopPropagation();
              onSelect("controller-unit");
            }}
          >
            {/* Main Controller Box Enclosure */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.13, 0.048, 0.06]} />
              <primitive object={mat(materials.controller)} attach="material" />
            </mesh>

            {/* 2 Stepped Mounting Flange Ears (176mm center-to-center) */}
            <mesh position={[-0.088, -0.014, 0]} castShadow>
              <boxGeometry args={[0.046, 0.02, 0.06]} />
              <primitive object={mat(materials.controller)} attach="material" />
            </mesh>
            <mesh position={[0.088, -0.014, 0]} castShadow>
              <boxGeometry args={[0.046, 0.02, 0.06]} />
              <primitive object={mat(materials.controller)} attach="material" />
            </mesh>

            {/* 4x Controller M8 Mounting Bolts (Page 8 Drawing) */}
            {[-0.088, 0.088].map((bx) =>
              [-0.015, 0.015].map((bz) => (
                <group key={`ctrl-bolt-${bx}-${bz}`} position={[bx, 0.01 + t * 0.12, bz]}>
                  <mesh castShadow>
                    <cylinderGeometry args={[0.006, 0.006, 0.008, 12]} />
                    <primitive object={materials.bolt} attach="material" />
                  </mesh>
                  <mesh position={[0, 0.004, 0]}>
                    <cylinderGeometry args={[0.0035, 0.0035, 0.002, 6]} />
                    <meshBasicMaterial color="#0f172a" />
                  </mesh>
                  <mesh position={[0, -0.016, 0]}>
                    <cylinderGeometry args={[0.004, 0.004, 0.024, 8]} />
                    <primitive object={materials.bolt} attach="material" />
                  </mesh>
                </group>
              ))
            )}

            {/* Status LED / Identification Badge */}
            <mesh position={[0, 0.025, 0]}>
              <boxGeometry args={[0.03, 0.002, 0.02]} />
              <meshBasicMaterial color="#38bdf8" />
            </mesh>
          </group>
        );
      })()}

      {/* ================= 4. FOUR STRUCTURAL SIDE COVERS (180x90x5mm) ================= */}
      {(() => {
        const { visible, mat } = getVisual("side-covers");
        // 4 orthogonal sides: Front (Z-), Rear (Z+), Right (X+), Left (X-)
        const sideConfigs = [
          { pos: [0, 0.005, -0.15], rot: [0, 0, 0], norm: [0, 0, -1] },
          { pos: [0, 0.005, 0.15], rot: [0, Math.PI, 0], norm: [0, 0, 1] },
          { pos: [0.15, 0.005, 0], rot: [0, -Math.PI / 2, 0], norm: [1, 0, 0] },
          { pos: [-0.15, 0.005, 0], rot: [0, Math.PI / 2, 0], norm: [-1, 0, 0] },
        ];

        return (
          <group
            visible={visible}
            onClick={(e) => {
              e.stopPropagation();
              onSelect("side-covers");
            }}
          >
            {sideConfigs.map((cfg, idx) => {
              const exX = cfg.pos[0] + cfg.norm[0] * t * 0.25;
              const exZ = cfg.pos[2] + cfg.norm[2] * t * 0.25;

              return (
                <group
                  key={`side-${idx}`}
                  position={[exX, cfg.pos[1], exZ]}
                  rotation={cfg.rot as any}
                >
                  {/* Rectangular Cover Plate (180x90x5mm) */}
                  <mesh receiveShadow castShadow>
                    <boxGeometry args={[0.18, 0.07, 0.005]} />
                    <primitive object={mat(materials.sideCover)} attach="material" />
                  </mesh>

                  {/* 6x M8 Bolts for Side Cover (Page 10 Drawing) */}
                  {[-0.075, 0, 0.075].map((bx) =>
                    [-0.022, 0.022].map((by) => (
                      <group key={`s-bolt-${bx}-${by}`} position={[bx, by, -0.005 - t * 0.1]}>
                        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
                          <cylinderGeometry args={[0.004, 0.004, 0.006, 10]} />
                          <primitive object={materials.bolt} attach="material" />
                        </mesh>
                        <mesh position={[0, 0, -0.003]} rotation={[Math.PI / 2, 0, 0]}>
                          <cylinderGeometry args={[0.0025, 0.0025, 0.002, 6]} />
                          <meshBasicMaterial color="#0f172a" />
                        </mesh>
                      </group>
                    ))
                  )}
                </group>
              );
            })}
          </group>
        );
      })()}

      {/* ================= 5. FOUR CUSTOM LATTICE TRUSS ARMS (Arm.SLDPRT) ================= */}
      {(() => {
        const { visible, mat } = getVisual("arms");
        // 4 diagonal arm angles: Front-Right (-45°), Front-Left (-135°), Rear-Left (135°), Rear-Right (45°)
        const armAngles = [
          { angle: -Math.PI / 4, id: 0, propRef: prop1Ref, isCW: false },
          { angle: (-3 * Math.PI) / 4, id: 1, propRef: prop2Ref, isCW: true },
          { angle: (3 * Math.PI) / 4, id: 2, propRef: prop3Ref, isCW: false },
          { angle: Math.PI / 4, id: 3, propRef: prop4Ref, isCW: true },
        ];

        return (
          <group
            visible={visible}
            onClick={(e) => {
              e.stopPropagation();
              onSelect("arms");
            }}
          >
            {armAngles.map((cfg) => {
              const cosA = Math.cos(cfg.angle);
              const sinA = Math.sin(cfg.angle);

              // Explode outwards along the diagonal arm axis
              const rootExplode = t * 0.22;
              const armX = cosA * (0.13 + rootExplode);
              const armZ = sinA * (0.13 + rootExplode);

              return (
                <group
                  key={`arm-${cfg.id}`}
                  position={[armX, 0.005, armZ]}
                  rotation={[0, -cfg.angle + Math.PI / 2, 0]}
                >
                  {/* Arm Root Mounting Block with vertical collar */}
                  <mesh position={[0, 0.005, 0.03]} castShadow receiveShadow>
                    <boxGeometry args={[0.044, 0.06, 0.045]} />
                    <primitive object={mat(materials.arm)} attach="material" />
                  </mesh>

                  {/* Integrated Aerodynamic Vertical Stabilizer Fin at Root */}
                  <mesh position={[0, 0.045, 0.03]} castShadow>
                    <boxGeometry args={[0.012, 0.035, 0.04]} />
                    <primitive object={mat(materials.arm)} attach="material" />
                  </mesh>

                  {/* 2x M10 Horizontal Through-Bolts & Nuts clamping Arm to Frame */}
                  {[-0.015, 0.015].map((bz, bIdx) => (
                    <group key={`arm-bolt-${bIdx}`} position={[0, 0, 0.03 + bz]}>
                      {/* Bolt head on left */}
                      <mesh position={[-0.026 - t * 0.08, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                        <cylinderGeometry args={[0.006, 0.006, 0.008, 12]} />
                        <primitive object={materials.bolt} attach="material" />
                      </mesh>
                      {/* Hex nut on right */}
                      <mesh position={[0.026 + t * 0.08, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                        <cylinderGeometry args={[0.006, 0.006, 0.008, 6]} />
                        <primitive object={materials.nut} attach="material" />
                      </mesh>
                    </group>
                  ))}

                  {/* Tapered Cantilever Boom Arm */}
                  <mesh position={[0, -0.005, 0.13]} castShadow receiveShadow>
                    <boxGeometry args={[0.03, 0.022, 0.18]} />
                    <primitive object={mat(materials.arm)} attach="material" />
                  </mesh>

                  {/* 4x Alternating Triangular Truss Cutouts (▲▼▲▼▲ pattern from PDF Page 6) */}
                  {[-0.045, -0.015, 0.015, 0.045].map((zPos, cIdx) => (
                    <mesh
                      key={`truss-${cIdx}`}
                      position={[0, -0.005, 0.13 + zPos]}
                      rotation={[0, 0, cIdx % 2 === 0 ? 0 : Math.PI]}
                    >
                      <coneGeometry args={[0.012, 0.025, 3]} />
                      <meshBasicMaterial color="#0b0f19" />
                    </mesh>
                  ))}

                  {/* Cylindrical Motor Mount Head at Arm Tip (60mm diameter / 15mm thick) */}
                  <mesh position={[0, -0.005, 0.22]} castShadow receiveShadow>
                    <cylinderGeometry args={[0.024, 0.024, 0.016, 24]} />
                    <primitive object={mat(materials.arm)} attach="material" />
                  </mesh>

                  {/* ================= 6. 50MM BRUSHLESS OUTRUNNER MOTOR ================= */}
                  {(() => {
                    const motorY = 0.015 + t * 0.25;
                    return (
                      <group
                        position={[0, motorY, 0.22]}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect("motors");
                        }}
                      >
                        {/* Motor Stator/Rotor Bell (Φ50 mm x 40 mm) */}
                        <mesh castShadow receiveShadow>
                          <cylinderGeometry args={[0.025, 0.025, 0.04, 28]} />
                          <primitive object={mat(materials.motorStator)} attach="material" />
                        </mesh>

                        {/* Top Motor Vent Ring */}
                        <mesh position={[0, 0.0205, 0]}>
                          <ringGeometry args={[0.012, 0.023, 16]} />
                          <meshBasicMaterial color="#eab308" />
                        </mesh>

                        {/* Hardened Steel Drive Shaft (Φ10 mm x 115 mm) */}
                        <mesh position={[0, 0.04, 0]} castShadow>
                          <cylinderGeometry args={[0.005, 0.005, 0.115, 16]} />
                          <primitive object={materials.motorShaft} attach="material" />
                        </mesh>

                        {/* Lower Bearing Retaining Nut & Cap */}
                        <mesh position={[0, -0.026 - t * 0.15, 0]}>
                          <cylinderGeometry args={[0.007, 0.007, 0.01, 6]} />
                          <primitive object={materials.nut} attach="material" />
                        </mesh>

                        {/* ================= 7. 460MM INDUSTRIAL PROPELLER ================= */}
                        {(() => {
                          const propY = 0.065 + t * 0.45;
                          return (
                            <group
                              ref={cfg.propRef}
                              position={[0, propY, 0]}
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelect("propellers");
                              }}
                            >
                              {/* Central Propeller Hub (Φ30 mm) */}
                              <mesh castShadow>
                                <cylinderGeometry args={[0.015, 0.015, 0.012, 20]} />
                                <primitive object={mat(materials.propeller)} attach="material" />
                              </mesh>

                              {/* 2 Aerodynamic Propeller Blades (460mm tip-to-tip = 0.46m) */}
                              <mesh castShadow position={[0.115, 0, 0]} rotation={[0, 0, 0.08]}>
                                <boxGeometry args={[0.2, 0.003, 0.028]} />
                                <primitive object={mat(materials.propeller)} attach="material" />
                              </mesh>
                              <mesh castShadow position={[-0.115, 0, 0]} rotation={[0, 0, -0.08]}>
                                <boxGeometry args={[0.2, 0.003, 0.028]} />
                                <primitive object={mat(materials.propeller)} attach="material" />
                              </mesh>

                              {/* Top M10 Propeller Dome Retaining Nut (Page 17 Drawing) */}
                              <mesh position={[0, 0.012 + t * 0.2, 0]} castShadow>
                                <cylinderGeometry args={[0.007, 0.007, 0.01, 6]} />
                                <primitive object={materials.nut} attach="material" />
                              </mesh>
                            </group>
                          );
                        })()}
                      </group>
                    );
                  })()}
                </group>
              );
            })}
          </group>
        );
      })()}

      {/* ================= 8. TWO ARCHED LANDING STANDS (100x80mm) ================= */}
      {(() => {
        const { visible, mat } = getVisual("stands");
        const standY = -0.07 - t * 0.25;
        // 2 stands mounted under the fuselage along the X-axis
        return (
          <group
            position={[0, standY, 0]}
            visible={visible}
            onClick={(e) => {
              e.stopPropagation();
              onSelect("stands");
            }}
          >
            {[-0.065, 0.065].map((sx, idx) => (
              <group key={`stand-${idx}`} position={[sx, 0, 0]}>
                {/* Horizontal Mounting Bracket Flange */}
                <mesh position={[0, 0.025, 0]} castShadow>
                  <boxGeometry args={[0.025, 0.008, 0.1]} />
                  <primitive object={mat(materials.stand)} attach="material" />
                </mesh>

                {/* 2x M8 Stand Mounting Bolts */}
                {[-0.025, 0.025].map((bz, bIdx) => (
                  <group key={`st-bolt-${bIdx}`} position={[0, 0.035 + t * 0.12, bz]}>
                    <mesh castShadow>
                      <cylinderGeometry args={[0.005, 0.005, 0.008, 12]} />
                      <primitive object={materials.bolt} attach="material" />
                    </mesh>
                  </group>
                ))}

                {/* U-Shaped Skid Legs with 20° rear rake angle */}
                <mesh position={[0, -0.015, -0.045]} rotation={[-0.35, 0, 0]} castShadow>
                  <boxGeometry args={[0.014, 0.075, 0.012]} />
                  <primitive object={mat(materials.stand)} attach="material" />
                </mesh>
                <mesh position={[0, -0.015, 0.045]} rotation={[0.35, 0, 0]} castShadow>
                  <boxGeometry args={[0.014, 0.075, 0.012]} />
                  <primitive object={mat(materials.stand)} attach="material" />
                </mesh>

                {/* Bottom Landing Runner Foot */}
                <mesh position={[0, -0.045, 0]} castShadow>
                  <boxGeometry args={[0.016, 0.01, 0.11]} />
                  <primitive object={mat(materials.stand)} attach="material" />
                </mesh>
              </group>
            ))}
          </group>
        );
      })()}
    </group>
  );
}
