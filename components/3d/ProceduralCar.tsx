"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CustomizationSettings } from "@/types/machine";

interface ProceduralCarProps {
  customization: CustomizationSettings;
  explosionLevel: number; // 0 to 1
  selectedComponent: string | null;
  isolatedComponent: string | null;
  hiddenComponents: string[];
  onSelect: (componentId: string) => void;
}

export default function ProceduralCar({
  customization,
  explosionLevel,
  selectedComponent,
  isolatedComponent,
  hiddenComponents,
  onSelect,
}: ProceduralCarProps) {
  // PBR materials
  const materials = useMemo(() => {
    let roughness = 0.25;
    let metalness = 0.6;
    if (customization.finish === "matte") {
      roughness = 0.85;
      metalness = 0.1;
    } else if (customization.finish === "metallic") {
      roughness = 0.15;
      metalness = 0.95;
    }

    return {
      body: new THREE.MeshStandardMaterial({
        color: customization.paintColor,
        roughness,
        metalness,
      }),
      carbon: new THREE.MeshStandardMaterial({
        color: "#18191c",
        roughness: 0.35,
        metalness: 0.8,
      }),
      glass: new THREE.MeshPhysicalMaterial({
        color: "#1e293b",
        roughness: 0.1,
        metalness: 0.9,
        transmission: 0.7,
        thickness: 0.5,
        transparent: true,
        opacity: 0.85,
      }),
      rims: new THREE.MeshStandardMaterial({
        color: customization.rimColor,
        roughness: 0.2,
        metalness: 0.9,
      }),
      tires: new THREE.MeshStandardMaterial({
        color: "#18181b",
        roughness: 0.85,
        metalness: 0.05,
      }),
      brakes: new THREE.MeshStandardMaterial({
        color: "#dc2626", // Red Brembo caliper
        roughness: 0.3,
        metalness: 0.8,
      }),
      discs: new THREE.MeshStandardMaterial({
        color: "#94a3b8",
        roughness: 0.25,
        metalness: 0.95,
      }),
      engineMetal: new THREE.MeshStandardMaterial({
        color: "#475569",
        roughness: 0.45,
        metalness: 0.8,
      }),
      headlights: new THREE.MeshStandardMaterial({
        color: "#ffffff",
        emissive: new THREE.Color("#e0f2fe"),
        emissiveIntensity: 0.9,
        roughness: 0.1,
      }),
      taillights: new THREE.MeshStandardMaterial({
        color: "#ef4444",
        emissive: new THREE.Color("#dc2626"),
        emissiveIntensity: 0.9,
        roughness: 0.1,
      }),
      interior: new THREE.MeshStandardMaterial({
        color: "#1e293b",
        roughness: 0.7,
        metalness: 0.2,
      }),
      chassis: new THREE.MeshStandardMaterial({
        color: "#0f172a",
        roughness: 0.8,
        metalness: 0.4,
      }),
      highlight: new THREE.MeshStandardMaterial({
        color: "#38bdf8",
        emissive: new THREE.Color("#0284c7"),
        emissiveIntensity: 0.7,
        roughness: 0.2,
        metalness: 0.6,
      }),
    };
  }, [customization]);

  // Group references for exploded view animation lerping
  const bodyRef = useRef<THREE.Group>(null);
  const glassRef = useRef<THREE.Group>(null);
  const engineRef = useRef<THREE.Group>(null);
  const interiorRef = useRef<THREE.Group>(null);
  const chassisRef = useRef<THREE.Group>(null);
  const wheelFLRef = useRef<THREE.Group>(null);
  const wheelFRRef = useRef<THREE.Group>(null);
  const wheelRLRef = useRef<THREE.Group>(null);
  const wheelRRRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const t = explosionLevel;
    const lerp = 1 - Math.exp(-delta * 6);

    // Body shell [0, 2.0, 0]
    if (bodyRef.current) {
      bodyRef.current.position.y = THREE.MathUtils.lerp(bodyRef.current.position.y, t * 1.8, lerp);
    }
    // Glass [0, 2.8, 0]
    if (glassRef.current) {
      glassRef.current.position.y = THREE.MathUtils.lerp(glassRef.current.position.y, 0.45 + t * 2.5, lerp);
    }
    // Engine [0, 1.2, 0.6]
    if (engineRef.current) {
      engineRef.current.position.y = THREE.MathUtils.lerp(engineRef.current.position.y, 0.2 + t * 1.4, lerp);
      engineRef.current.position.z = THREE.MathUtils.lerp(engineRef.current.position.z, -0.4 - t * 0.5, lerp);
    }
    // Interior [0, 1.0, 0]
    if (interiorRef.current) {
      interiorRef.current.position.y = THREE.MathUtils.lerp(interiorRef.current.position.y, 0.2 + t * 1.0, lerp);
    }
    // Chassis [0, -1.0, 0]
    if (chassisRef.current) {
      chassisRef.current.position.y = THREE.MathUtils.lerp(chassisRef.current.position.y, -t * 0.8, lerp);
    }
    // Front Wheels
    if (wheelFLRef.current) {
      wheelFLRef.current.position.x = THREE.MathUtils.lerp(wheelFLRef.current.position.x, 1.05 + t * 1.4, lerp);
    }
    if (wheelFRRef.current) {
      wheelFRRef.current.position.x = THREE.MathUtils.lerp(wheelFRRef.current.position.x, -1.05 - t * 1.4, lerp);
    }
    // Rear Wheels
    if (wheelRLRef.current) {
      wheelRLRef.current.position.x = THREE.MathUtils.lerp(wheelRLRef.current.position.x, 1.08 + t * 1.4, lerp);
    }
    if (wheelRRRef.current) {
      wheelRRRef.current.position.x = THREE.MathUtils.lerp(wheelRRRef.current.position.x, -1.08 - t * 1.4, lerp);
    }
  });

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

  return (
    <group position={[0, -0.4, 0]}>
      {/* ================= 1. CHASSIS / UNDERBODY ================= */}
      {isVisible("chassis") && (
        <group
          ref={chassisRef}
          position={[0, 0, 0]}
          onClick={(e) => handlePointer("chassis", e)}
        >
          {/* Main Flat Floor Tray */}
          <mesh position={[0, 0.12, 0]} material={getMat("chassis", materials.chassis)}>
            <boxGeometry args={[1.75, 0.08, 4.2]} />
          </mesh>
          {/* Front & Rear Structural Subframes */}
          <mesh position={[0, 0.22, 1.3]} material={materials.chassis}>
            <boxGeometry args={[1.5, 0.18, 1.2]} />
          </mesh>
          <mesh position={[0, 0.22, -1.2]} material={materials.chassis}>
            <boxGeometry args={[1.5, 0.18, 1.4]} />
          </mesh>
        </group>
      )}

      {/* ================= 2. MID-MOUNTED V6 ENGINE ================= */}
      {isVisible("engine") && (
        <group
          ref={engineRef}
          position={[0, 0.2, -0.4]}
          onClick={(e) => handlePointer("engine", e)}
        >
          {/* V6 Block */}
          <mesh castShadow material={getMat("engine", materials.engineMetal)}>
            <boxGeometry args={[0.9, 0.55, 0.95]} />
          </mesh>
          {/* Twin Red Valve Covers */}
          {[-0.26, 0.26].map((x) => (
            <mesh key={x} position={[x, 0.32, 0]} material={getMat("engine", materials.brakes)}>
              <boxGeometry args={[0.3, 0.12, 0.85]} />
            </mesh>
          ))}
          {/* Dual Turbochargers & Intake plenum */}
          <mesh position={[0, 0.42, 0]} material={materials.carbon}>
            <cylinderGeometry args={[0.16, 0.16, 0.65, 16]} />
          </mesh>
          {/* Polished Dual Exhaust Tailpipes */}
          {[-0.25, 0.25].map((x) => (
            <mesh key={x} position={[x, 0.08, -1.75]} rotation={[Math.PI / 2, 0, 0]} material={materials.rims}>
              <cylinderGeometry args={[0.07, 0.07, 0.4, 20]} />
            </mesh>
          ))}
        </group>
      )}

      {/* ================= 3. COCKPIT INTERIOR ================= */}
      {isVisible("interior") && (
        <group
          ref={interiorRef}
          position={[0, 0.2, 0.35]}
          onClick={(e) => handlePointer("interior", e)}
        >
          {/* Cabin Tub */}
          <mesh material={getMat("interior", materials.interior)}>
            <boxGeometry args={[1.4, 0.45, 1.3]} />
          </mesh>
          {/* Driver & Passenger Carbon Bucket Seats */}
          {[-0.34, 0.34].map((x) => (
            <group key={x} position={[x, 0.2, -0.15]}>
              <mesh material={materials.carbon}>
                <boxGeometry args={[0.42, 0.12, 0.45]} />
              </mesh>
              <mesh position={[0, 0.3, -0.18]} rotation={[-0.2, 0, 0]} material={materials.carbon}>
                <boxGeometry args={[0.38, 0.55, 0.1]} />
              </mesh>
            </group>
          ))}
          {/* Dashboard & Steering Wheel */}
          <mesh position={[0, 0.4, 0.5]} material={materials.interior}>
            <boxGeometry args={[1.3, 0.25, 0.4]} />
          </mesh>
          <mesh position={[-0.34, 0.48, 0.32]} rotation={[0.4, 0, 0]} material={materials.carbon}>
            <torusGeometry args={[0.14, 0.02, 12, 24]} />
          </mesh>
        </group>
      )}

      {/* ================= 4. BODY SHELL MONOCOQUE ================= */}
      {isVisible("body") && (
        <group
          ref={bodyRef}
          position={[0, 0, 0]}
          onClick={(e) => handlePointer("body", e)}
        >
          {/* Lower Main Fuselage */}
          <mesh castShadow receiveShadow position={[0, 0.35, 0]} material={getMat("body", materials.body)}>
            <boxGeometry args={[1.88, 0.4, 4.15]} />
          </mesh>

          {/* Sloped Hood & Front Nosecone */}
          <mesh
            castShadow
            position={[0, 0.42, 1.45]}
            rotation={[0.12, 0, 0]}
            material={getMat("body", materials.body)}
          >
            <boxGeometry args={[1.78, 0.26, 1.45]} />
          </mesh>

          {/* Front Fenders & Wheel Arches */}
          {[-0.92, 0.92].map((x) => (
            <group key={x}>
              {/* Front arch */}
              <mesh position={[x, 0.46, 1.3]} material={getMat("body", materials.body)}>
                <boxGeometry args={[0.12, 0.45, 1.05]} />
              </mesh>
              {/* Rear muscular haunch */}
              <mesh position={[x, 0.55, -1.05]} material={getMat("body", materials.body)}>
                <boxGeometry args={[0.16, 0.55, 1.35]} />
              </mesh>
            </group>
          ))}

          {/* Rear Engine Deck & Air Scoops */}
          <mesh
            castShadow
            position={[0, 0.56, -0.95]}
            rotation={[-0.08, 0, 0]}
            material={getMat("body", materials.body)}
          >
            <boxGeometry args={[1.78, 0.28, 1.85]} />
          </mesh>

          {/* Front LED Projector Headlights */}
          {[-0.65, 0.65].map((x) => (
            <mesh key={x} position={[x, 0.42, 2.06]} rotation={[0.2, 0, 0]} material={materials.headlights}>
              <boxGeometry args={[0.35, 0.08, 0.12]} />
            </mesh>
          ))}

          {/* Rear Full-Width LED Tail Light Blade */}
          <mesh position={[0, 0.52, -2.08]} material={materials.taillights}>
            <boxGeometry args={[1.65, 0.06, 0.08]} />
          </mesh>

          {/* Front Radiator Hex Grill */}
          <mesh position={[0, 0.22, 2.07]} material={materials.carbon}>
            <boxGeometry args={[1.2, 0.18, 0.05]} />
          </mesh>
        </group>
      )}

      {/* ================= 5. CANOPY & GLASS ================= */}
      {isVisible("glass") && (
        <group
          ref={glassRef}
          position={[0, 0.45, 0]}
          onClick={(e) => handlePointer("glass", e)}
        >
          {/* Roof & Curved Greenhouse Canopy */}
          <mesh castShadow position={[0, 0.38, 0.05]} material={getMat("glass", materials.glass)}>
            <boxGeometry args={[1.42, 0.44, 1.7]} />
          </mesh>
          {/* Windshield rake angle */}
          <mesh
            position={[0, 0.34, 0.82]}
            rotation={[0.65, 0, 0]}
            material={getMat("glass", materials.glass)}
          >
            <boxGeometry args={[1.36, 0.05, 0.85]} />
          </mesh>
          {/* Rear fastback glass window */}
          <mesh
            position={[0, 0.34, -0.72]}
            rotation={[-0.55, 0, 0]}
            material={getMat("glass", materials.glass)}
          >
            <boxGeometry args={[1.32, 0.05, 0.85]} />
          </mesh>
        </group>
      )}

      {/* ================= 6. WHEELS, RIMS & BRAKES ================= */}
      {isVisible("wheels") && (
        <>
          {/* Front Left Wheel */}
          <group
            ref={wheelFLRef}
            position={[1.05, 0.32, 1.3]}
            onClick={(e) => handlePointer("wheels", e)}
          >
            {/* Rubber Tire */}
            <mesh rotation={[0, 0, Math.PI / 2]} material={materials.tires} castShadow>
              <cylinderGeometry args={[0.35, 0.35, 0.28, 32]} />
            </mesh>
            {/* Alloy Rim */}
            <mesh rotation={[0, 0, Math.PI / 2]} material={getMat("wheels", materials.rims)}>
              <cylinderGeometry args={[0.26, 0.26, 0.29, 24]} />
            </mesh>
            {/* Brake Rotor Disc & Caliper */}
            {isVisible("brakes") && (
              <group onClick={(e) => handlePointer("brakes", e)}>
                <mesh rotation={[0, 0, Math.PI / 2]} position={[-0.05, 0, 0]} material={materials.discs}>
                  <cylinderGeometry args={[0.22, 0.22, 0.03, 24]} />
                </mesh>
                <mesh position={[-0.05, 0.14, 0]} material={getMat("brakes", materials.brakes)}>
                  <boxGeometry args={[0.08, 0.12, 0.16]} />
                </mesh>
              </group>
            )}
          </group>

          {/* Front Right Wheel */}
          <group
            ref={wheelFRRef}
            position={[-1.05, 0.32, 1.3]}
            onClick={(e) => handlePointer("wheels", e)}
          >
            <mesh rotation={[0, 0, Math.PI / 2]} material={materials.tires} castShadow>
              <cylinderGeometry args={[0.35, 0.35, 0.28, 32]} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]} material={getMat("wheels", materials.rims)}>
              <cylinderGeometry args={[0.26, 0.26, 0.29, 24]} />
            </mesh>
            {isVisible("brakes") && (
              <group onClick={(e) => handlePointer("brakes", e)}>
                <mesh rotation={[0, 0, Math.PI / 2]} position={[0.05, 0, 0]} material={materials.discs}>
                  <cylinderGeometry args={[0.22, 0.22, 0.03, 24]} />
                </mesh>
                <mesh position={[0.05, 0.14, 0]} material={getMat("brakes", materials.brakes)}>
                  <boxGeometry args={[0.08, 0.12, 0.16]} />
                </mesh>
              </group>
            )}
          </group>

          {/* Rear Left Wheel */}
          <group
            ref={wheelRLRef}
            position={[1.08, 0.35, -1.25]}
            onClick={(e) => handlePointer("wheels", e)}
          >
            <mesh rotation={[0, 0, Math.PI / 2]} material={materials.tires} castShadow>
              <cylinderGeometry args={[0.37, 0.37, 0.34, 32]} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]} material={getMat("wheels", materials.rims)}>
              <cylinderGeometry args={[0.27, 0.27, 0.35, 24]} />
            </mesh>
            {isVisible("brakes") && (
              <group onClick={(e) => handlePointer("brakes", e)}>
                <mesh rotation={[0, 0, Math.PI / 2]} position={[-0.05, 0, 0]} material={materials.discs}>
                  <cylinderGeometry args={[0.22, 0.22, 0.03, 24]} />
                </mesh>
                <mesh position={[-0.05, 0.14, 0]} material={getMat("brakes", materials.brakes)}>
                  <boxGeometry args={[0.08, 0.12, 0.16]} />
                </mesh>
              </group>
            )}
          </group>

          {/* Rear Right Wheel */}
          <group
            ref={wheelRRRef}
            position={[-1.08, 0.35, -1.25]}
            onClick={(e) => handlePointer("wheels", e)}
          >
            <mesh rotation={[0, 0, Math.PI / 2]} material={materials.tires} castShadow>
              <cylinderGeometry args={[0.37, 0.37, 0.34, 32]} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]} material={getMat("wheels", materials.rims)}>
              <cylinderGeometry args={[0.27, 0.27, 0.35, 24]} />
            </mesh>
            {isVisible("brakes") && (
              <group onClick={(e) => handlePointer("brakes", e)}>
                <mesh rotation={[0, 0, Math.PI / 2]} position={[0.05, 0, 0]} material={materials.discs}>
                  <cylinderGeometry args={[0.22, 0.22, 0.03, 24]} />
                </mesh>
                <mesh position={[0.05, 0.14, 0]} material={getMat("brakes", materials.brakes)}>
                  <boxGeometry args={[0.08, 0.12, 0.16]} />
                </mesh>
              </group>
            )}
          </group>
        </>
      )}

      {/* ================= 7. BUILDER AERODYNAMIC BODY KITS ================= */}
      {/* Carbon GT Wing / Spoiler */}
      {customization.bodyParts.spoiler && (
        <group
          position={[0, 0.88 + explosionLevel * 1.8, -1.82 - explosionLevel * 0.3]}
          onClick={(e) => handlePointer("body", e)}
        >
          <mesh castShadow material={materials.carbon}>
            <boxGeometry args={[1.82, 0.04, 0.32]} />
          </mesh>
          {[-0.91, 0.91].map((x) => (
            <mesh key={x} position={[x, 0.06, 0]} material={materials.carbon}>
              <boxGeometry args={[0.02, 0.16, 0.36]} />
            </mesh>
          ))}
          {[-0.45, 0.45].map((x) => (
            <mesh key={x} position={[x, -0.16, 0.05]} material={materials.carbon}>
              <boxGeometry args={[0.035, 0.32, 0.1]} />
            </mesh>
          ))}
        </group>
      )}

      {/* Carbon Side Skirts */}
      {customization.bodyParts.sideSkirts && (
        <group position={[0, 0.12 + explosionLevel * 0.4, 0]}>
          {[-0.98, 0.98].map((x) => (
            <mesh key={x} position={[x, 0, 0]} material={materials.carbon}>
              <boxGeometry args={[0.1, 0.04, 2.4]} />
            </mesh>
          ))}
        </group>
      )}

      {/* Front Carbon Splitter */}
      {customization.bodyParts.frontSplitter && (
        <group position={[0, 0.08 + explosionLevel * 0.4, 2.12 + explosionLevel * 0.4]}>
          <mesh castShadow material={materials.carbon}>
            <boxGeometry args={[1.75, 0.03, 0.38]} />
          </mesh>
          {[-0.88, 0.88].map((x) => (
            <mesh key={x} position={[x, 0.1, -0.08]} rotation={[0, 0, x > 0 ? 0.3 : -0.3]} material={materials.carbon}>
              <boxGeometry args={[0.02, 0.08, 0.2]} />
            </mesh>
          ))}
        </group>
      )}

      {/* Rear Diffuser */}
      {customization.bodyParts.rearDiffuser && (
        <group position={[0, 0.14 + explosionLevel * 0.2, -2.12 - explosionLevel * 0.4]}>
          <mesh castShadow material={materials.carbon}>
            <boxGeometry args={[1.48, 0.12, 0.32]} />
          </mesh>
          {[-0.4, -0.15, 0.15, 0.4].map((x) => (
            <mesh key={x} position={[x, -0.04, 0]} material={materials.carbon}>
              <boxGeometry args={[0.02, 0.1, 0.35]} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}
