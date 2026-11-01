"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface EngineSubAssemblyProps {
  explosionLevel: number; // 0 to 1
  selectedPart: string | null;
  onSelectPart: (partId: string) => void;
}

export default function EngineSubAssembly({
  explosionLevel,
  selectedPart,
  onSelectPart,
}: EngineSubAssemblyProps) {
  // PBR materials for precision mechanical engine parts
  const materials = useMemo(() => {
    return {
      block: new THREE.MeshStandardMaterial({
        color: "#3b3f46",
        roughness: 0.55,
        metalness: 0.8,
      }),
      cylinderHead: new THREE.MeshStandardMaterial({
        color: "#c026d3", // Red-anodized racing valve covers (as in screenshot)
        roughness: 0.35,
        metalness: 0.85,
      }),
      headMetal: new THREE.MeshStandardMaterial({
        color: "#6b7280",
        roughness: 0.45,
        metalness: 0.75,
      }),
      pistons: new THREE.MeshStandardMaterial({
        color: "#d1d5db",
        roughness: 0.2,
        metalness: 0.95,
      }),
      crankshaft: new THREE.MeshStandardMaterial({
        color: "#475569",
        roughness: 0.3,
        metalness: 0.9,
      }),
      camshaft: new THREE.MeshStandardMaterial({
        color: "#94a3b8",
        roughness: 0.25,
        metalness: 0.9,
      }),
      valves: new THREE.MeshStandardMaterial({
        color: "#e2e8f0",
        roughness: 0.15,
        metalness: 0.95,
      }),
      oilPan: new THREE.MeshStandardMaterial({
        color: "#1e293b",
        roughness: 0.5,
        metalness: 0.7,
      }),
      timingBelt: new THREE.MeshStandardMaterial({
        color: "#0f172a",
        roughness: 0.85,
        metalness: 0.1,
      }),
      sparkPlug: new THREE.MeshStandardMaterial({
        color: "#f8fafc",
        roughness: 0.2,
        metalness: 0.85,
      }),
      ceramic: new THREE.MeshStandardMaterial({
        color: "#ffffff",
        roughness: 0.2,
        metalness: 0.05,
      }),
      goldAccent: new THREE.MeshStandardMaterial({
        color: "#eab308",
        roughness: 0.25,
        metalness: 0.9,
      }),
      highlight: new THREE.MeshStandardMaterial({
        color: "#38bdf8",
        roughness: 0.2,
        metalness: 0.6,
        emissive: new THREE.Color("#0284c7"),
        emissiveIntensity: 0.7,
      }),
    };
  }, []);

  const getPartMaterial = (id: string, defaultMat: THREE.Material) => {
    return selectedPart === id ? materials.highlight : defaultMat;
  };

  const handlePointer = (id: string, e: any) => {
    e.stopPropagation?.();
    onSelectPart(id);
  };

  // Group refs for exploded positioning
  const cylinderHeadLeftRef = useRef<THREE.Group>(null);
  const cylinderHeadRightRef = useRef<THREE.Group>(null);
  const engineBlockRef = useRef<THREE.Group>(null);
  const pistonsGroupRef = useRef<THREE.Group>(null);
  const crankshaftRef = useRef<THREE.Group>(null);
  const camshaftsRef = useRef<THREE.Group>(null);
  const valvesRef = useRef<THREE.Group>(null);
  const oilPanRef = useRef<THREE.Group>(null);
  const timingBeltRef = useRef<THREE.Group>(null);
  const sparkPlugsRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const t = explosionLevel;
    const lerp = 1 - Math.exp(-delta * 6);

    // Cylinder Heads [0, 2.2, 0]
    if (cylinderHeadLeftRef.current) {
      const targetPos = new THREE.Vector3(-0.6 - t * 0.9, 0.9 + t * 1.5, 0);
      cylinderHeadLeftRef.current.position.lerp(targetPos, lerp);
    }
    if (cylinderHeadRightRef.current) {
      const targetPos = new THREE.Vector3(0.6 + t * 0.9, 0.9 + t * 1.5, 0);
      cylinderHeadRightRef.current.position.lerp(targetPos, lerp);
    }
    // Camshafts [-1.4, 1.6, 0.4]
    if (camshaftsRef.current) {
      const targetPos = new THREE.Vector3(0, 1.2 + t * 2.2, 0);
      camshaftsRef.current.position.lerp(targetPos, lerp);
    }
    // Valves [0.8, 2.0, -0.6]
    if (valvesRef.current) {
      const targetPos = new THREE.Vector3(0, 0.75 + t * 1.8, 0);
      valvesRef.current.position.lerp(targetPos, lerp);
    }
    // Spark Plugs [1.4, 2.4, 0.8]
    if (sparkPlugsRef.current) {
      const targetPos = new THREE.Vector3(0, 1.4 + t * 2.6, 0);
      sparkPlugsRef.current.position.lerp(targetPos, lerp);
    }
    // Pistons [1.2, 1.4, 0]
    if (pistonsGroupRef.current) {
      const targetPos = new THREE.Vector3(0, 0.35 + t * 1.1, 0);
      pistonsGroupRef.current.position.lerp(targetPos, lerp);
    }
    // Crankshaft [0, -1.4, 0]
    if (crankshaftRef.current) {
      const targetPos = new THREE.Vector3(0, -0.4 - t * 0.9, 0);
      crankshaftRef.current.position.lerp(targetPos, lerp);
    }
    // Oil Pan [0, -2.2, 0]
    if (oilPanRef.current) {
      const targetPos = new THREE.Vector3(0, -0.9 - t * 1.6, 0);
      oilPanRef.current.position.lerp(targetPos, lerp);
    }
    // Timing Belt [0, 0, 1.8]
    if (timingBeltRef.current) {
      const targetPos = new THREE.Vector3(0, 0.1, 1.1 + t * 1.8);
      timingBeltRef.current.position.lerp(targetPos, lerp);
    }
  });

  return (
    <group position={[0, -0.2, 0]} scale={1.15}>
      {/* ================= 1. ENGINE BLOCK ================= */}
      <group
        ref={engineBlockRef}
        position={[0, 0, 0]}
        onClick={(e) => handlePointer("engine-block", e)}
      >
        {/* Main 60-degree V6 Cast Block */}
        <mesh castShadow receiveShadow material={getPartMaterial("engine-block", materials.block)}>
          <boxGeometry args={[1.5, 0.9, 1.8]} />
        </mesh>
        {/* Left & Right V-bank cylinder bores (3 each) */}
        {[-0.5, 0, 0.5].map((z, idx) => (
          <group key={`bores-${idx}`}>
            {/* Left Bank bore */}
            <mesh
              position={[-0.42, 0.46, z]}
              rotation={[0, 0, -Math.PI / 6]}
              material={materials.pistons}
            >
              <cylinderGeometry args={[0.22, 0.22, 0.45, 24]} />
            </mesh>
            {/* Right Bank bore */}
            <mesh
              position={[0.42, 0.46, z]}
              rotation={[0, 0, Math.PI / 6]}
              material={materials.pistons}
            >
              <cylinderGeometry args={[0.22, 0.22, 0.45, 24]} />
            </mesh>
          </group>
        ))}
        {/* Bellhousing flange at rear */}
        <mesh position={[0, -0.1, -0.95]} rotation={[Math.PI / 2, 0, 0]} material={materials.block}>
          <cylinderGeometry args={[0.75, 0.75, 0.1, 32]} />
        </mesh>
        {/* Water pump and alternator bracket on front */}
        <mesh position={[0, 0.15, 0.95]} material={materials.headMetal}>
          <boxGeometry args={[0.6, 0.5, 0.15]} />
        </mesh>
      </group>

      {/* ================= 2. CYLINDER HEADS & VALVE COVERS ================= */}
      {/* Left Bank Cylinder Head */}
      <group
        ref={cylinderHeadLeftRef}
        position={[-0.6, 0.9, 0]}
        rotation={[0, 0, -Math.PI / 6]}
        onClick={(e) => handlePointer("cylinder-head", e)}
      >
        {/* Lower aluminum head casing */}
        <mesh castShadow material={getPartMaterial("cylinder-head", materials.headMetal)}>
          <boxGeometry args={[0.65, 0.35, 1.7]} />
        </mesh>
        {/* Racing Valve Cover (Anodized Red) */}
        <mesh
          position={[0, 0.24, 0]}
          castShadow
          material={getPartMaterial("cylinder-head", materials.cylinderHead)}
        >
          <boxGeometry args={[0.62, 0.16, 1.68]} />
        </mesh>
        {/* Billet oil filler cap */}
        <mesh position={[0.1, 0.36, 0.5]} material={materials.goldAccent}>
          <cylinderGeometry args={[0.07, 0.07, 0.06, 20]} />
        </mesh>
      </group>

      {/* Right Bank Cylinder Head */}
      <group
        ref={cylinderHeadRightRef}
        position={[0.6, 0.9, 0]}
        rotation={[0, 0, Math.PI / 6]}
        onClick={(e) => handlePointer("cylinder-head", e)}
      >
        {/* Lower aluminum head casing */}
        <mesh castShadow material={getPartMaterial("cylinder-head", materials.headMetal)}>
          <boxGeometry args={[0.65, 0.35, 1.7]} />
        </mesh>
        {/* Racing Valve Cover (Anodized Red) */}
        <mesh
          position={[0, 0.24, 0]}
          castShadow
          material={getPartMaterial("cylinder-head", materials.cylinderHead)}
        >
          <boxGeometry args={[0.62, 0.16, 1.68]} />
        </mesh>
      </group>

      {/* ================= 3. CAMSHAFTS ================= */}
      <group
        ref={camshaftsRef}
        position={[0, 1.2, 0]}
        onClick={(e) => handlePointer("camshaft", e)}
      >
        {/* Dual Camshafts for both banks (4 shafts total) */}
        {[-0.65, -0.45, 0.45, 0.65].map((x, i) => (
          <group key={`cam-${i}`} position={[x, 0, 0]}>
            {/* Long Camshaft core */}
            <mesh rotation={[Math.PI / 2, 0, 0]} material={getPartMaterial("camshaft", materials.camshaft)}>
              <cylinderGeometry args={[0.032, 0.032, 1.75, 24]} />
            </mesh>
            {/* Cam Lobes along shaft */}
            {[-0.6, -0.3, 0, 0.3, 0.6].map((z, lIdx) => (
              <group key={lIdx} position={[0, 0.02, z]} rotation={[lIdx * 1.2, 0, 0]}>
                <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.valves}>
                  <cylinderGeometry args={[0.055, 0.055, 0.06, 16]} />
                </mesh>
              </group>
            ))}
            {/* Front timing cam gear */}
            <mesh position={[0, 0, 0.9]} rotation={[Math.PI / 2, 0, 0]} material={materials.goldAccent}>
              <cylinderGeometry args={[0.15, 0.15, 0.05, 32]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ================= 4. VALVES & SPRINGS ================= */}
      <group
        ref={valvesRef}
        position={[0, 0.75, 0]}
        onClick={(e) => handlePointer("valves", e)}
      >
        {/* 24 Valve springs & stems (4 valves per cylinder x 6 cylinders) */}
        {[-0.5, 0, 0.5].map((z, cylIdx) => (
          <group key={`cyl-valves-${cylIdx}`} position={[0, 0, z]}>
            {/* Left bank valves */}
            {[-0.08, 0.08].map((offsetZ, vIdx) => (
              <group key={`lv-${vIdx}`} position={[-0.5, 0.1, offsetZ]}>
                <mesh material={getPartMaterial("valves", materials.valves)}>
                  <cylinderGeometry args={[0.012, 0.012, 0.22, 12]} />
                </mesh>
                <mesh position={[0, 0.05, 0]} material={materials.goldAccent}>
                  <cylinderGeometry args={[0.035, 0.035, 0.1, 12]} />
                </mesh>
              </group>
            ))}
            {/* Right bank valves */}
            {[-0.08, 0.08].map((offsetZ, vIdx) => (
              <group key={`rv-${vIdx}`} position={[0.5, 0.1, offsetZ]}>
                <mesh material={getPartMaterial("valves", materials.valves)}>
                  <cylinderGeometry args={[0.012, 0.012, 0.22, 12]} />
                </mesh>
                <mesh position={[0, 0.05, 0]} material={materials.goldAccent}>
                  <cylinderGeometry args={[0.035, 0.035, 0.1, 12]} />
                </mesh>
              </group>
            ))}
          </group>
        ))}
      </group>

      {/* ================= 5. SPARK PLUGS ================= */}
      <group
        ref={sparkPlugsRef}
        position={[0, 1.4, 0]}
        onClick={(e) => handlePointer("spark-plug", e)}
      >
        {[-0.5, 0, 0.5].map((z, idx) => (
          <group key={`sparks-${idx}`}>
            {/* Left bank spark plug */}
            <group position={[-0.55, 0, z]} rotation={[0, 0, -Math.PI / 6]}>
              <mesh material={getPartMaterial("spark-plug", materials.ceramic)}>
                <cylinderGeometry args={[0.03, 0.03, 0.26, 16]} />
              </mesh>
              <mesh position={[0, 0.15, 0]} material={materials.sparkPlug}>
                <cylinderGeometry args={[0.015, 0.015, 0.06, 12]} />
              </mesh>
            </group>
            {/* Right bank spark plug */}
            <group position={[0.55, 0, z]} rotation={[0, 0, Math.PI / 6]}>
              <mesh material={getPartMaterial("spark-plug", materials.ceramic)}>
                <cylinderGeometry args={[0.03, 0.03, 0.26, 16]} />
              </mesh>
              <mesh position={[0, 0.15, 0]} material={materials.sparkPlug}>
                <cylinderGeometry args={[0.015, 0.015, 0.06, 12]} />
              </mesh>
            </group>
          </group>
        ))}
      </group>

      {/* ================= 6. PISTONS & CONNECTING RODS ================= */}
      <group
        ref={pistonsGroupRef}
        position={[0, 0.35, 0]}
        onClick={(e) => handlePointer("pistons", e)}
      >
        {[-0.5, 0, 0.5].map((z, idx) => (
          <group key={`piston-pair-${idx}`} position={[0, 0, z]}>
            {/* Left Bank Piston */}
            <group position={[-0.38, 0, 0]} rotation={[0, 0, -Math.PI / 6]}>
              {/* Crown */}
              <mesh castShadow material={getPartMaterial("pistons", materials.pistons)}>
                <cylinderGeometry args={[0.2, 0.2, 0.22, 28]} />
              </mesh>
              {/* Connecting Rod */}
              <mesh position={[0, -0.28, 0]} material={materials.headMetal}>
                <boxGeometry args={[0.045, 0.38, 0.06]} />
              </mesh>
            </group>
            {/* Right Bank Piston */}
            <group position={[0.38, 0, 0]} rotation={[0, 0, Math.PI / 6]}>
              {/* Crown */}
              <mesh castShadow material={getPartMaterial("pistons", materials.pistons)}>
                <cylinderGeometry args={[0.2, 0.2, 0.22, 28]} />
              </mesh>
              {/* Connecting Rod */}
              <mesh position={[0, -0.28, 0]} material={materials.headMetal}>
                <boxGeometry args={[0.045, 0.38, 0.06]} />
              </mesh>
            </group>
          </group>
        ))}
      </group>

      {/* ================= 7. CRANKSHAFT ================= */}
      <group
        ref={crankshaftRef}
        position={[0, -0.4, 0]}
        onClick={(e) => handlePointer("crankshaft", e)}
      >
        {/* Main crankshaft center spine */}
        <mesh rotation={[Math.PI / 2, 0, 0]} material={getPartMaterial("crankshaft", materials.crankshaft)}>
          <cylinderGeometry args={[0.05, 0.05, 2.0, 24]} />
        </mesh>
        {/* Counterweights along journals */}
        {[-0.6, -0.3, 0, 0.3, 0.6].map((z, idx) => (
          <group key={`counter-${idx}`} position={[0, -0.1, z]} rotation={[idx * 1.05, 0, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.crankshaft}>
              <cylinderGeometry args={[0.22, 0.22, 0.07, 24, 1, false, 0, Math.PI]} />
            </mesh>
          </group>
        ))}
        {/* Front harmonic damper pulley */}
        <mesh position={[0, 0, 1.05]} rotation={[Math.PI / 2, 0, 0]} material={materials.crankshaft}>
          <cylinderGeometry args={[0.18, 0.18, 0.08, 32]} />
        </mesh>
      </group>

      {/* ================= 8. OIL PAN ================= */}
      <group
        ref={oilPanRef}
        position={[0, -0.9, 0]}
        onClick={(e) => handlePointer("oil-pan", e)}
      >
        <mesh castShadow material={getPartMaterial("oil-pan", materials.oilPan)}>
          <boxGeometry args={[1.3, 0.45, 1.7]} />
        </mesh>
        {/* Deep scavenge sump well */}
        <mesh position={[0, -0.25, -0.2]} material={materials.oilPan}>
          <boxGeometry args={[0.8, 0.2, 0.9]} />
        </mesh>
        {/* Magnetic drain plug */}
        <mesh position={[0.42, -0.3, -0.2]} rotation={[0, 0, Math.PI / 2]} material={materials.goldAccent}>
          <cylinderGeometry args={[0.035, 0.035, 0.04, 16]} />
        </mesh>
      </group>

      {/* ================= 9. TIMING BELT & PULLEYS ================= */}
      <group
        ref={timingBeltRef}
        position={[0, 0.1, 1.1]}
        onClick={(e) => handlePointer("timing-belt", e)}
      >
        {/* Lower crank pulley */}
        <mesh position={[0, -0.4, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.headMetal}>
          <cylinderGeometry args={[0.14, 0.14, 0.05, 32]} />
        </mesh>
        {/* Upper Left cam pulleys */}
        <mesh position={[-0.55, 0.65, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.goldAccent}>
          <cylinderGeometry args={[0.16, 0.16, 0.05, 32]} />
        </mesh>
        {/* Upper Right cam pulleys */}
        <mesh position={[0.55, 0.65, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.goldAccent}>
          <cylinderGeometry args={[0.16, 0.16, 0.05, 32]} />
        </mesh>
        {/* Center idler tensioner */}
        <mesh position={[0, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.headMetal}>
          <cylinderGeometry args={[0.09, 0.09, 0.05, 24]} />
        </mesh>
        {/* Outer continuous rubber timing belt loop */}
        <mesh material={getPartMaterial("timing-belt", materials.timingBelt)}>
          <torusGeometry args={[0.7, 0.035, 12, 48]} />
        </mesh>
      </group>
    </group>
  );
}
