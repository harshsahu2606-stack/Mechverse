"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { BattleCarId, CustomizationSettings, BattleMatchState } from "@/types/machine";
import RoboRumbleVehicleModel from "./RoboRumbleVehicleModel";
import { BATTLE_CARS_SPEC } from "@/data/roboRumbleData";

export type CameraViewMode = "follow" | "orbit" | "top";

export interface ArenaTelemetryData {
  playerSpeed: number;
  playerHealth: number;
  playerBattery: number;
  playerMotorTemp: number;
  aiHealth: number;
  collisions: number;
  distance: number;
  duration: number;
  pinProgress: number;
  pinningSide: "player" | "ai" | null;
}

interface BattleArenaSceneProps {
  playerCarId: BattleCarId;
  aiCarId: BattleCarId;
  customization: CustomizationSettings;
  matchState: BattleMatchState;
  onUpdateTelemetry: (data: ArenaTelemetryData) => void;
  onMatchFinish: (winner: "player" | "ai" | "draw", reason: "knockout" | "pin_out" | "time_out") => void;
  cameraView: CameraViewMode;
  // External inputs from keyboard or mobile joystick
  driveInput: {
    throttle: number; // -1 (reverse) to +1 (forward)
    steer: number;    // -1 (left) to +1 (right)
    brake: boolean;
    boost: boolean;
  };
}

// ============================================================================
// CONTINUOUS DETERMINISTIC VEHICLE KINEMATICS & COLLISION SIMULATOR
// ============================================================================
function ArenaPhysicsSimulation({
  playerCarId,
  aiCarId,
  customization,
  matchState,
  onUpdateTelemetry,
  onMatchFinish,
  cameraView,
  driveInput,
}: BattleArenaSceneProps) {
  // Vehicle 3D groups
  const playerGroupRef = useRef<THREE.Group>(null);
  const aiGroupRef = useRef<THREE.Group>(null);
  const collisionSparksRef = useRef<THREE.Group>(null);

  // Specifications
  const pSpec = BATTLE_CARS_SPEC[playerCarId] || BATTLE_CARS_SPEC.striker;
  const aiSpec = BATTLE_CARS_SPEC[aiCarId] || BATTLE_CARS_SPEC.titan;

  // Internal Physics State for Player
  const pState = useRef({
    x: 0,
    z: -3.5,
    angle: 0, // Facing +Z (towards center)
    speed: 0,
    wheelRot: 0,
    health: 100,
    battery: 100,
    motorTemp: 32,
    mass: pSpec.chassis.totalWeightGrams / 1000,
    maxSpeed: pSpec.performanceMetrics.topSpeedKmH * 0.42, // m/s scale
    accel: 5.5,
    grip: pSpec.drivetrain.frictionCoeff,
    radius: 0.55,
  });

  // Internal Physics State for AI
  const aiState = useRef({
    x: 0,
    z: 3.5,
    angle: Math.PI, // Facing -Z (towards center)
    speed: 0,
    wheelRot: 0,
    health: 100,
    mass: aiSpec.chassis.totalWeightGrams / 1000,
    maxSpeed: aiSpec.performanceMetrics.topSpeedKmH * 0.42,
    accel: 4.8,
    grip: aiSpec.drivetrain.frictionCoeff,
    radius: 0.55,
  });

  // Match telemetry & pin tracking
  const collisionsCountRef = useRef(0);
  const distanceTraveledRef = useRef(0);
  const matchDurationRef = useRef(0);
  const aiPinTimerRef = useRef(0);
  const playerPinTimerRef = useRef(0);
  const hasEndedRef = useRef(false);

  // Spark burst animation state
  const [sparkPos, setSparkPos] = useState<[number, number, number] | null>(null);

  // Arena physical boundary limits (meters)
  const ARENA_RADIUS = 6.2;
  const HAZARD_RADIUS = 5.3; // Perimeter hazard line

  // Reset physics state when match starts or restarts
  useEffect(() => {
    pState.current.x = 0;
    pState.current.z = -3.5;
    pState.current.angle = 0;
    pState.current.speed = 0;
    pState.current.health = 100;
    pState.current.battery = 100;
    pState.current.motorTemp = 32;

    aiState.current.x = 0;
    aiState.current.z = 3.5;
    aiState.current.angle = Math.PI;
    aiState.current.speed = 0;
    aiState.current.health = 100;

    collisionsCountRef.current = 0;
    distanceTraveledRef.current = 0;
    matchDurationRef.current = 0;
    aiPinTimerRef.current = 0;
    playerPinTimerRef.current = 0;
    hasEndedRef.current = false;
  }, [matchState.status, playerCarId, aiCarId]);

  useFrame((state, delta) => {
    // Clamp delta to prevent physics explosion after tab switch
    const dt = Math.min(delta, 0.05);

    if (matchState.status !== "running" || hasEndedRef.current) {
      return;
    }

    matchDurationRef.current += dt;

    // ------------------------------------------------------------------------
    // 1. PLAYER VEHICLE DYNAMICS
    // ------------------------------------------------------------------------
    const p = pState.current;
    let targetThrottle = driveInput.throttle;
    const targetSteer = driveInput.steer;

    // Turbo Boost
    let effectiveMaxSpeed = p.maxSpeed;
    let effectiveAccel = p.accel;
    if (driveInput.boost && p.battery > 5) {
      effectiveMaxSpeed *= 1.45;
      effectiveAccel *= 1.6;
      p.battery -= dt * 2.5; // High boost drain
      p.motorTemp = Math.min(85, p.motorTemp + dt * 1.8);
    } else {
      p.battery = Math.max(0, p.battery - dt * 0.25);
    }

    // Braking vs Acceleration
    if (driveInput.brake) {
      p.speed = THREE.MathUtils.lerp(p.speed, 0, dt * 8);
    } else if (targetThrottle !== 0) {
      const targetSpeed = targetThrottle * effectiveMaxSpeed;
      p.speed = THREE.MathUtils.lerp(p.speed, targetSpeed, dt * effectiveAccel);
      p.motorTemp = Math.min(75, p.motorTemp + dt * 0.3);
    } else {
      // Natural rolling resistance & friction
      p.speed = THREE.MathUtils.lerp(p.speed, 0, dt * 2.5);
      p.motorTemp = Math.max(32, p.motorTemp - dt * 0.4);
    }

    // Steering: skid steer response proportional to speed and directional intent
    if (targetSteer !== 0) {
      const steerMultiplier = Math.sign(p.speed || targetThrottle || 1);
      p.angle -= targetSteer * steerMultiplier * dt * 2.8;
    }

    // Update Player position
    const pVx = Math.sin(p.angle) * p.speed;
    const pVz = Math.cos(p.angle) * p.speed;
    p.x += pVx * dt;
    p.z += pVz * dt;
    p.wheelRot += (p.speed / 0.26) * dt;

    distanceTraveledRef.current += Math.abs(p.speed) * dt;

    // ------------------------------------------------------------------------
    // 2. AI VEHICLE KINEMATICS & DECISION LOGIC
    // ------------------------------------------------------------------------
    const ai = aiState.current;
    if (matchState.mode === "pv_ai") {
      const dx = p.x - ai.x;
      const dz = p.z - ai.z;
      const distToPlayer = Math.sqrt(dx * dx + dz * dz);

      // Angle from AI to Player
      const targetAiAngle = Math.atan2(dx, dz);
      let angleDiff = targetAiAngle - ai.angle;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

      let aiThrottle = 0.8;
      let aiTurnRate = 2.4;

      if (matchState.difficulty === "easy") {
        aiThrottle = 0.55;
        aiTurnRate = 1.6;
      } else if (matchState.difficulty === "hard") {
        aiThrottle = 1.0;
        aiTurnRate = 3.2;
        // Hard AI: Flanks around if player has low wedge
        if (playerCarId === "striker" && distToPlayer < 2.5 && Math.abs(angleDiff) < 0.3) {
          angleDiff += 0.6; // Outflank the front blade!
        }
      }

      // Steer toward target angle
      if (Math.abs(angleDiff) > 0.08) {
        ai.angle += Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), aiTurnRate * dt);
      }

      // Throttle decision: reverse if jammed against outer perimeter
      const distFromCenter = Math.sqrt(ai.x * ai.x + ai.z * ai.z);
      if (distFromCenter > ARENA_RADIUS - 0.5 && Math.abs(angleDiff) > 1.8) {
        aiThrottle = -0.5; // Back out of corner
      }

      const targetAiSpeed = aiThrottle * ai.maxSpeed;
      ai.speed = THREE.MathUtils.lerp(ai.speed, targetAiSpeed, dt * ai.accel);

      const aiVx = Math.sin(ai.angle) * ai.speed;
      const aiVz = Math.cos(ai.angle) * ai.speed;
      ai.x += aiVx * dt;
      ai.z += aiVz * dt;
      ai.wheelRot += (ai.speed / 0.26) * dt;
    }

    // ------------------------------------------------------------------------
    // 3. VEHICLE-TO-VEHICLE COLLISION & WEDGE DYNAMICS
    // ------------------------------------------------------------------------
    const colDx = p.x - ai.x;
    const colDz = p.z - ai.z;
    const colDist = Math.sqrt(colDx * colDx + colDz * colDz);
    const minDist = p.radius + ai.radius;
    let isVehicleInContact = false;

    if (colDist < minDist && colDist > 0.001) {
      isVehicleInContact = true;
      collisionsCountRef.current += 1;

      // Normal vector from AI to Player
      const nx = colDx / colDist;
      const nz = colDz / colDist;

      // Relative velocity
      const pVx = Math.sin(p.angle) * p.speed;
      const pVz = Math.cos(p.angle) * p.speed;
      const aiVx = Math.sin(ai.angle) * ai.speed;
      const aiVz = Math.cos(ai.angle) * ai.speed;

      const rVx = pVx - aiVx;
      const rVz = pVz - aiVz;
      const velAlongNormal = rVx * nx + rVz * nz;

      // Only resolve impulse & damage when closing in
      if (velAlongNormal < 0) {
        const restitution = 0.35; // Inelastic collision shock
        const impulseMag =
          (-(1 + restitution) * velAlongNormal) / (1 / p.mass + 1 / ai.mass);

        // Controlled speed recoil based on vehicle mass
        p.speed += (impulseMag / p.mass) * 0.28;
        ai.speed -= (impulseMag / ai.mass) * 0.28;

        // Realistic multi-hit combat damage (requires 7-12 solid clashes to destroy)
        const impactSpeed = Math.abs(velAlongNormal);
        const baseDamage = Math.min(16, Math.max(5, impactSpeed * 2.2));

        // Front wedge attachment defense & lift mechanics
        const pHasWedge =
          customization.battleAttachment === "wedge" || playerCarId === "striker";
        const isPlayerFrontal = velAlongNormal < -1.2;

        const pDamage = baseDamage * (pHasWedge && isPlayerFrontal ? 0.45 : 0.75);
        const aiDamage = baseDamage * (pHasWedge && isPlayerFrontal ? 1.25 : 0.85);

        p.health = Math.max(0, p.health - pDamage);
        ai.health = Math.max(0, ai.health - aiDamage);

        // Trigger visual impact sparks
        setSparkPos([(p.x + ai.x) / 2, 0.35, (p.z + ai.z) / 2]);
        setTimeout(() => setSparkPos(null), 180);
      }

      // Smooth positional separation to prevent clipping
      const overlap = minDist - colDist;
      p.x += nx * overlap * 0.5;
      p.z += nz * overlap * 0.5;
      ai.x -= nx * overlap * 0.5;
      ai.z -= nz * overlap * 0.5;
    }

    // ------------------------------------------------------------------------
    // 4. ARENA CONTAINMENT BARRIER & DEFLECTION
    // ------------------------------------------------------------------------
    const pDistFromCenter = Math.sqrt(p.x * p.x + p.z * p.z);
    const aiDistFromCenter = Math.sqrt(ai.x * ai.x + ai.z * ai.z);

    // Wall bounce: Containment barriers cushion and deflect cars back into combat
    if (pDistFromCenter > ARENA_RADIUS) {
      const normX = p.x / pDistFromCenter;
      const normZ = p.z / pDistFromCenter;
      p.x = normX * ARENA_RADIUS;
      p.z = normZ * ARENA_RADIUS;
      p.speed = -p.speed * 0.35; // Gentle barrier rebound
    }

    if (aiDistFromCenter > ARENA_RADIUS) {
      const normX = ai.x / aiDistFromCenter;
      const normZ = ai.z / aiDistFromCenter;
      ai.x = normX * ARENA_RADIUS;
      ai.z = normZ * ARENA_RADIUS;
      ai.speed = -ai.speed * 0.35;
    }

    // ------------------------------------------------------------------------
    // 5. SUSTAINED 3-SECOND HAZARD PIN DYNAMICS
    // ------------------------------------------------------------------------
    // If an opponent is pushed against the hazard perimeter (r >= 5.3m)
    // and actively held pinned there by the attacker, a 3-second pin countdown runs.
    if (aiDistFromCenter >= HAZARD_RADIUS && isVehicleInContact) {
      aiPinTimerRef.current += dt;
      playerPinTimerRef.current = 0;
    } else if (pDistFromCenter >= HAZARD_RADIUS && isVehicleInContact) {
      playerPinTimerRef.current += dt;
      aiPinTimerRef.current = 0;
    } else {
      // Pin breaks if defender escapes or moves away from barrier
      aiPinTimerRef.current = Math.max(0, aiPinTimerRef.current - dt * 2.2);
      playerPinTimerRef.current = Math.max(0, playerPinTimerRef.current - dt * 2.2);
    }

    // ------------------------------------------------------------------------
    // 6. WIN CONDITIONS: TKO / 3s PIN-OUT / 90s TIME EXPIRY
    // ------------------------------------------------------------------------
    if (matchState.mode === "pv_ai" && !hasEndedRef.current) {
      // 1. TKO Victory (Health reaches 0)
      if (ai.health <= 0) {
        hasEndedRef.current = true;
        onMatchFinish("player", "knockout");
      } else if (p.health <= 0) {
        hasEndedRef.current = true;
        onMatchFinish("ai", "knockout");
      }
      // 2. Pin-Out Victory (Sustained 3-second hazard trap)
      else if (aiPinTimerRef.current >= 3.0) {
        hasEndedRef.current = true;
        onMatchFinish("player", "pin_out");
      } else if (playerPinTimerRef.current >= 3.0) {
        hasEndedRef.current = true;
        onMatchFinish("ai", "pin_out");
      }
      // 3. Match Clock Expiry (90 seconds battle limit)
      else if (matchDurationRef.current >= 90) {
        hasEndedRef.current = true;
        const winner =
          p.health > ai.health ? "player" : ai.health > p.health ? "ai" : "draw";
        onMatchFinish(winner, "time_out");
      }
    }

    // ------------------------------------------------------------------------
    // 5. UPDATE 3D MESH TRANSFORMS
    // ------------------------------------------------------------------------
    if (playerGroupRef.current) {
      playerGroupRef.current.position.set(p.x, 0, p.z);
      playerGroupRef.current.rotation.y = p.angle;
    }

    if (aiGroupRef.current) {
      aiGroupRef.current.position.set(ai.x, 0, ai.z);
      aiGroupRef.current.rotation.y = ai.angle;
    }

    // ------------------------------------------------------------------------
    // 6. CAMERA VIEWS: FOLLOW / ORBIT / TOP-DOWN
    // ------------------------------------------------------------------------
    if (cameraView === "follow" && playerGroupRef.current) {
      // 3rd-person camera smoothly tracking behind player's car
      const camOffset = new THREE.Vector3(
        -Math.sin(p.angle) * 3.4,
        1.8,
        -Math.cos(p.angle) * 3.4
      );
      state.camera.position.lerp(
        new THREE.Vector3(p.x, 0, p.z).add(camOffset),
        dt * 5
      );
      state.camera.lookAt(p.x, 0.4, p.z);
    } else if (cameraView === "top") {
      state.camera.position.lerp(new THREE.Vector3(0, 14, 0.1), dt * 4);
      state.camera.lookAt(0, 0, 0);
    }

    // ------------------------------------------------------------------------
    // 7. EMIT TELEMETRY TO UI
    // ------------------------------------------------------------------------
    const pinVal = Math.max(aiPinTimerRef.current, playerPinTimerRef.current);
    const pinProgress = Math.min(1, Math.max(0, pinVal / 3.0));
    const pinningSide =
      aiPinTimerRef.current > 0.05
        ? "player"
        : playerPinTimerRef.current > 0.05
        ? "ai"
        : null;

    onUpdateTelemetry({
      playerSpeed: Math.abs(p.speed) * 2.4, // km/h
      playerHealth: Math.round(p.health),
      playerBattery: Math.round(p.battery),
      playerMotorTemp: Math.round(p.motorTemp),
      aiHealth: Math.round(ai.health),
      collisions: collisionsCountRef.current,
      distance: Math.round(distanceTraveledRef.current),
      duration: Math.round(matchDurationRef.current),
      pinProgress,
      pinningSide,
    });
  });

  return (
    <>
      {/* Player Vehicle */}
      <group ref={playerGroupRef} position={[0, 0, -3.5]}>
        <RoboRumbleVehicleModel
          customization={{ ...customization, battleCarId: playerCarId }}
          explosionLevel={0}
          selectedComponent={null}
          isolatedComponent={null}
          hiddenComponents={[]}
          onSelect={() => {}}
          wheelRotationSpeed={pState.current.speed * 8}
        />
        {/* Player Indicator Ring */}
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.95, 1.05, 32]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.65} />
        </mesh>
      </group>

      {/* AI Vehicle (Rendered in Battle mode or Testing dummy) */}
      <group ref={aiGroupRef} position={[0, 0, 3.5]}>
        <RoboRumbleVehicleModel
          customization={{ ...customization, battleCarId: aiCarId }}
          explosionLevel={0}
          selectedComponent={null}
          isolatedComponent={null}
          hiddenComponents={[]}
          onSelect={() => {}}
          wheelRotationSpeed={aiState.current.speed * 8}
        />
        {/* AI Opponent Target Indicator */}
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.95, 1.05, 32]} />
          <meshBasicMaterial color="#ef4444" transparent opacity={0.65} />
        </mesh>
      </group>

      {/* Collision Impact Sparks Burst */}
      {sparkPos && (
        <group position={sparkPos}>
          <pointLight color="#f97316" intensity={4} distance={4} />
          <mesh>
            <sphereGeometry args={[0.22, 12, 12]} />
            <meshBasicMaterial color="#fbbf24" />
          </mesh>
        </group>
      )}

      {/* Arena Barrier Walls & Architecture */}
      <ArenaGeometry radius={ARENA_RADIUS} />
    </>
  );
}

// ============================================================================
// ARENA GEOMETRY: OCTAGONAL COMPETITION RING & BLAST BARRIERS
// ============================================================================
function ArenaGeometry({ radius }: { radius: number }) {
  const wallSegments = 16;
  const wallHeight = 0.75;

  const segmentAngle = (Math.PI * 2) / wallSegments;

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Main Competition Floor Grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <circleGeometry args={[radius + 1.2, 32]} />
        <meshStandardMaterial color="#0b0d13" roughness={0.7} metalness={0.2} />
      </mesh>

      {/* Yellow / Black Hazard Perimeter Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <ringGeometry args={[radius - 0.4, radius, 32]} />
        <meshBasicMaterial color="#eab308" />
      </mesh>

      {/* Inner Floor Gridlines */}
      <gridHelper args={[radius * 2, 16, "#1e293b", "#0f172a"]} position={[0, 0.01, 0]} />

      {/* 2. Perimeter Containment Barrier Panels */}
      {Array.from({ length: wallSegments }).map((_, i) => {
        const theta = i * segmentAngle;
        const x = Math.sin(theta) * radius;
        const z = Math.cos(theta) * radius;

        return (
          <group key={i} position={[x, wallHeight / 2, z]} rotation={[0, theta, 0]}>
            {/* Transparent Polycarbonate Blast Panel */}
            <mesh>
              <boxGeometry args={[radius * 0.42, wallHeight, 0.04]} />
              <meshStandardMaterial
                color="#38bdf8"
                transparent
                opacity={0.25}
                roughness={0.1}
                metalness={0.9}
              />
            </mesh>
            {/* Steel Top Rail */}
            <mesh position={[0, wallHeight / 2, 0]}>
              <boxGeometry args={[radius * 0.44, 0.06, 0.08]} />
              <meshStandardMaterial color="#475569" metalness={0.8} />
            </mesh>
            {/* Base Impact Kickplate */}
            <mesh position={[0, -wallHeight / 2 + 0.06, 0]}>
              <boxGeometry args={[radius * 0.44, 0.12, 0.08]} />
              <meshStandardMaterial color="#1e293b" metalness={0.6} />
            </mesh>
          </group>
        );
      })}

      {/* 3. Corner Hazard Beacons (4x) */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((ang, idx) => {
        const px = Math.sin(ang) * (radius - 0.2);
        const pz = Math.cos(ang) * (radius - 0.2);
        return (
          <group key={idx} position={[px, 0.4, pz]}>
            <mesh>
              <cylinderGeometry args={[0.08, 0.1, 0.8, 12]} />
              <meshStandardMaterial color="#eab308" />
            </mesh>
            <pointLight position={[0, 0.45, 0]} color="#ef4444" intensity={1.5} distance={3} />
          </group>
        );
      })}
    </group>
  );
}

// ============================================================================
// MAIN EXPORT: BATTLE ARENA THREE.JS CANVAS WRAPPER
// ============================================================================
export default function BattleArenaScene(props: BattleArenaSceneProps) {
  return (
    <div className="absolute inset-0 w-full h-full select-none bg-[#090b10]">
      <Canvas
        shadows
        camera={{ position: [0, 4.5, -7.5], fov: 46 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
        className="w-full h-full"
      >
        <color attach="background" args={["#090b10"]} />
        <fog attach="fog" args={["#090b10", 12, 28]} />

        {/* Dynamic Studio Lighting */}
        <ambientLight intensity={0.6} color="#ffffff" />
        <directionalLight
          position={[5, 12, 5]}
          intensity={2.2}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight position={[-5, 8, -5]} intensity={1.2} color="#38bdf8" />
        <directionalLight position={[0, 6, 8]} intensity={1.4} color="#f97316" />

        {/* Active Battle Simulation Loop */}
        <ArenaPhysicsSimulation {...props} />

        {/* Orbit Controls enabled if in orbit camera mode */}
        {props.cameraView === "orbit" && (
          <OrbitControls
            makeDefault
            minDistance={3}
            maxDistance={18}
            maxPolarAngle={Math.PI / 2 - 0.05}
          />
        )}
      </Canvas>
    </div>
  );
}
