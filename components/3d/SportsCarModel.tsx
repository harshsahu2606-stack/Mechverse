"use client";

import React, { Component, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { CustomizationSettings } from "@/types/machine";
import ProceduralCar from "./ProceduralCar";

interface SportsCarModelProps {
  customization: CustomizationSettings;
  explosionLevel: number;
  selectedComponent: string | null;
  isolatedComponent: string | null;
  hiddenComponents: string[];
  onSelect: (componentId: string) => void;
}

// Error Boundary for 3D GLTF models
class ModelErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { fallback: ReactNode; children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.warn("GLTF Car failed to render, falling back to Procedural Car:", error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Actual GLTF Car model component
function GLTFCar({
  customization,
  explosionLevel,
  selectedComponent,
  isolatedComponent,
  hiddenComponents,
  onSelect,
}: SportsCarModelProps) {
  const { scene } = useGLTF("/models/car.glb");

  // Clone scene so caching isn't mutated
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        if (Array.isArray(obj.material)) {
          obj.material = obj.material.map((m) => m.clone());
        } else if (obj.material) {
          obj.material = obj.material.clone();
        }
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);

// Mesh and node categorizer mapping with exact direct local-to-world coordinate transformation
  // The 'main' group in car.glb has quaternion [-0.5, -0.5, -0.5, 0.5]
  // This transforms local axes to world axes:
  // Local (1, 0, 0) -> World ( 0, 0, 1)  [+Z: Rearward]
  // Local (0, 1, 0) -> World ( 1, 0, 0)  [+X: Rightward]
  // Local (0, 0, 1) -> World ( 0, 1, 0)  [+Y: Upward]
  //
  // Therefore, for any target World displacement (wX, wY, wZ):
  // Local displacement in 'main' is:
  // localX = wZ  (World Rearward -> Local X)
  // localY = wX  (World Rightward -> Local Y)
  // localZ = wY  (World Upward    -> Local Z)
  const componentMap = useMemo(() => {
    const map = new Map<
      THREE.Object3D,
      { id: string; origPos: THREE.Vector3; explodeVec: THREE.Vector3 }
    >();

    const worldToLocalInMain = (wX: number, wY: number, wZ: number): THREE.Vector3 => {
      return new THREE.Vector3(wZ, wX, wY);
    };

    // Locate main and RootNode
    let mainNode: THREE.Object3D | null = null;
    let rootNode: THREE.Object3D | null = null;

    clonedScene.traverse((obj) => {
      const name = (obj.name || "").toLowerCase();
      if (name === "rootnode") rootNode = obj;
      if (name === "main") mainNode = obj;
    });

    // 1. Explode functional sub-assemblies inside 'main'
    // Organized in strict non-overlapping vertical and longitudinal layers:
    // Layer 1 (Y = -0.40): Chassis tub & undertray foundation
    // Layer 2 (Y = -0.20, Z = +1.20): Powertrain & exhausts sliding rearward
    // Layer 3 (Y = +0.75): Cockpit seats, dashboard & carbon interior floating above tub
    // Layer 4 (Y = +1.85): Exterior body shell & aero panels
    // Layer 5 (Y = +1.85, Z = +0.75): Rear taillights exploded rearward from rear bumper
    // Layer 6 (Y = +1.10, Z = -1.80): Front headlights & grilles exploded forward from nose
    // Layer 7 (Y = +2.95): Glass canopy & wipers hovering high above body roof
    if (mainNode) {
      (mainNode as THREE.Object3D).children.forEach((child) => {
        const name = (child.name || "").toLowerCase();
        let compId = "chassis";
        let localVec = new THREE.Vector3(0, 0, 0);

        if (name === "body" || name === "trim" || name === "blue" || name === "yellow_trim") {
          compId = "body";
          // Body shell floats straight UP to reveal entire chassis & cabin
          localVec = worldToLocalInMain(0, 1.85, 0);
        } else if (name === "brakes") {
          // In car.glb, 'brakes' inside main is the 3rd rear deck brake light strip
          compId = "body";
          localVec = worldToLocalInMain(0, 1.85, 0.05);
        } else if (name === "lights_red") {
          // Rear circular taillights: stay at rear bumper height and explode rearward
          compId = "body";
          localVec = worldToLocalInMain(0, 1.85, 0.75);
        } else if (name === "glass" || name === "wipers") {
          compId = "glass";
          // Glass & canopy floats high UP above body shell
          localVec = worldToLocalInMain(0, 2.95, 0);
        } else if (name === "lights" || name === "leds") {
          compId = "body";
          // Front headlights move FORWARD (-Z) and up in front of nose
          localVec = worldToLocalInMain(0, 1.1, -1.8);
        } else if (name === "grills") {
          compId = "body";
          // Front grills/intakes move forward and slightly up
          localVec = worldToLocalInMain(0, 0.6, -1.5);
        } else if (
          name === "leather" ||
          name === "interior_light" ||
          name === "interior_dark" ||
          name === "carbon_fibre_trim" ||
          name === "carbon fibre"
        ) {
          compId = "interior";
          // Entire passenger cabin (seats, console, dashboard) moves UP together
          localVec = worldToLocalInMain(0, 0.75, 0);
        } else if (name === "metal" || name === "chrome") {
          compId = "engine";
          // Twin-Turbo V6 engine block, exhausts & rear subframe shift backward & down
          localVec = worldToLocalInMain(0, -0.2, 1.2);
        } else {
          // plastic_gray, carpet -> Chassis spaceframe & carbon floor tub
          compId = "chassis";
          // Lowers downward to anchor the foundation
          localVec = worldToLocalInMain(0, -0.4, 0);
        }

        map.set(child, {
          id: compId,
          origPos: child.position.clone(),
          explodeVec: localVec,
        });
      });
    }

    // 2. Explode direct children of RootNode (Wheels & Steering Column)
    // RootNode has identity orientation, so local vectors equal world vectors
    const rootChildren = rootNode
      ? (rootNode as THREE.Object3D).children
      : clonedScene.children;

    rootChildren.forEach((child) => {
      const name = (child.name || "").toLowerCase();
      if (name === "main" || name === "rootnode") return;

      let compId = "wheels";
      let worldVec = new THREE.Vector3(0, 0, 0);

      if (name === "wheel_fl") {
        compId = "wheels";
        // Front-left wheel moves generously LEFT (-X) and slightly forward
        worldVec.set(-2.2, 0, -0.25);
      } else if (name === "wheel_fr") {
        compId = "wheels";
        // Front-right wheel moves generously RIGHT (+X) and slightly forward
        worldVec.set(2.2, 0, -0.25);
      } else if (name === "wheel_rl") {
        compId = "wheels";
        // Rear-left wheel moves generously LEFT (-X) and slightly backward
        worldVec.set(-2.2, 0, 0.25);
      } else if (name === "wheel_rr") {
        compId = "wheels";
        // Rear-right wheel moves generously RIGHT (+X) and slightly backward
        worldVec.set(2.2, 0, 0.25);
      } else if (name === "steering_wheel") {
        compId = "interior";
        // Steering wheel moves UP in exact synchrony with the dashboard
        worldVec.set(0, 0.75, 0);
      } else {
        return;
      }

      map.set(child, {
        id: compId,
        origPos: child.position.clone(),
        explodeVec: worldVec,
      });
    });

    return map;
  }, [clonedScene]);

  // Carbon body kit materials
  const carbonKitMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: "#18191c",
      roughness: 0.28,
      metalness: 0.8,
    });
  }, []);

  // Update materials when paint customization changes
  useEffect(() => {
    const paintCol = new THREE.Color(customization.paintColor);
    const rimCol = new THREE.Color(customization.rimColor);

    clonedScene.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      const mat = obj.material as THREE.MeshStandardMaterial;
      if (!mat) return;

      const matName = (mat.name || "").toLowerCase();
      const nodeName = (obj.name || "").toLowerCase();

      // Body Paint
      if (
        matName.includes("body_color") ||
        nodeName.includes("body") ||
        nodeName.includes("main")
      ) {
        mat.color.copy(paintCol);
        if (customization.finish === "matte") {
          mat.roughness = 0.85;
          mat.metalness = 0.1;
        } else if (customization.finish === "metallic") {
          mat.roughness = 0.18;
          mat.metalness = 0.95;
        } else {
          mat.roughness = 0.25;
          mat.metalness = 0.5;
        }
        mat.needsUpdate = true;
      }

      // Wheels / Rims
      if (nodeName.includes("rim") || nodeName.includes("centre") || matName.includes("metal_chrome")) {
        mat.color.copy(rimCol);
        mat.metalness = 0.92;
        mat.roughness = 0.2;
        mat.needsUpdate = true;
      }
    });
  }, [clonedScene, customization]);

  const highlightColor = useMemo(() => new THREE.Color("#0284c7"), []);

  // Frame loop: smooth exploded view lerping and selection highlights
  useFrame((_, delta) => {
    const t = explosionLevel;
    const lerpSpeed = 1 - Math.exp(-delta * 6);

    componentMap.forEach((meta, obj) => {
      const isSelected = selectedComponent === meta.id;
      const isHidden = hiddenComponents.includes(meta.id);
      const isIsolated = isolatedComponent ? isolatedComponent === meta.id : true;

      // Visibility
      obj.visible = !isHidden && isIsolated;

      // Position lerp
      const targetPos = meta.origPos.clone().add(meta.explodeVec.clone().multiplyScalar(t));
      obj.position.lerp(targetPos, lerpSpeed);

      // Emissive highlight on meshes under this subassembly
      obj.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          const mats = Array.isArray(child.material) ? child.material : [child.material];
          mats.forEach((mat) => {
            if ("emissive" in mat && mat.emissive instanceof THREE.Color) {
              if (isSelected) {
                mat.emissive.copy(highlightColor);
                mat.emissiveIntensity = 0.55;
              } else {
                mat.emissive.setHex(0x000000);
                mat.emissiveIntensity = 0;
              }
            }
          });
        }
      });
    });
  });

  const handleClick = (e: any) => {
    e.stopPropagation?.();
    let current: THREE.Object3D | null = e.object;
    let foundId: string | null = null;

    while (current && current !== clonedScene) {
      const meta = componentMap.get(current);
      if (meta) {
        foundId = meta.id;
        break;
      }
      current = current.parent;
    }

    if (foundId) {
      onSelect(foundId);
    } else {
      onSelect("body");
    }
  };

  const isBodyVisible =
    !hiddenComponents.includes("body") &&
    (!isolatedComponent || isolatedComponent === "body");

  return (
    <group position={[0, -0.36, 0]}>
      <primitive
        object={clonedScene}
        onClick={handleClick}
        onPointerOver={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
      />

      {/* Aerodynamic Carbon Body Add-ons */}
      {/* Rear GT Wing Spoiler: Floats directly above the body shell's rear deck */}
      {customization.bodyParts.spoiler && isBodyVisible && (
        <group
          position={[
            0,
            1.05 + explosionLevel * 1.85 + explosionLevel * 0.45, // Floats UP with body (+1.85) + 0.45 clearance
            1.45 + explosionLevel * 0.08,                         // Stays aligned over rear deck
          ]}
        >
          <mesh castShadow material={carbonKitMaterial}>
            <boxGeometry args={[1.75, 0.04, 0.32]} />
          </mesh>
          {[-0.88, 0.88].map((x) => (
            <mesh key={x} position={[x, 0.06, 0]} material={carbonKitMaterial}>
              <boxGeometry args={[0.02, 0.18, 0.38]} />
            </mesh>
          ))}
          {[-0.45, 0.45].map((x) => (
            <mesh key={x} position={[x, -0.22, 0.05]} material={carbonKitMaterial}>
              <boxGeometry args={[0.035, 0.42, 0.12]} />
            </mesh>
          ))}
        </group>
      )}

      {/* Carbon Side Skirts: Follow chassis floor tub laterally and downward */}
      {customization.bodyParts.sideSkirts && isBodyVisible && (
        <group>
          {/* Left Skirt */}
          <mesh
            position={[-1.02 - explosionLevel * 0.8, 0.16 - explosionLevel * 0.4, 0.15]}
            material={carbonKitMaterial}
          >
            <boxGeometry args={[0.1, 0.05, 2.3]} />
          </mesh>
          {/* Right Skirt */}
          <mesh
            position={[1.02 + explosionLevel * 0.8, 0.16 - explosionLevel * 0.4, 0.15]}
            material={carbonKitMaterial}
          >
            <boxGeometry args={[0.1, 0.05, 2.3]} />
          </mesh>
        </group>
      )}

      {/* Front Carbon Splitter: Projects forward beneath front fascia */}
      {customization.bodyParts.frontSplitter && isBodyVisible && (
        <group
          position={[
            0,
            0.14 - explosionLevel * 0.2, // Lowers slightly
            -1.95 - explosionLevel * 1.6, // Moves FORWARD (-Z) in front of bumper
          ]}
        >
          <mesh castShadow material={carbonKitMaterial}>
            <boxGeometry args={[1.72, 0.03, 0.45]} />
          </mesh>
        </group>
      )}

      {/* Rear Aerodynamic Diffuser: Projects backward beneath quad exhaust tips */}
      {customization.bodyParts.rearDiffuser && isBodyVisible && (
        <group
          position={[
            0,
            0.18 - explosionLevel * 0.4, // Lowers with chassis
            1.85 + explosionLevel * 1.5,  // Moves BACKWARD (+Z) behind rear exhaust
          ]}
        >
          <mesh castShadow material={carbonKitMaterial}>
            <boxGeometry args={[1.45, 0.14, 0.35]} />
          </mesh>
        </group>
      )}
    </group>
  );
}

// Master component with error boundary that falls back to ProceduralCar
export default function SportsCarModel(props: SportsCarModelProps) {
  return (
    <ModelErrorBoundary fallback={<ProceduralCar {...props} />}>
      <GLTFCar {...props} />
    </ModelErrorBoundary>
  );
}
