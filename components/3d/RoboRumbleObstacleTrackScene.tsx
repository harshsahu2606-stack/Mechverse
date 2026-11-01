"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { BattleCarId, CustomizationSettings, TrackTelemetryData, TrackRunState } from "@/types/machine";
import RoboRumbleVehicleModel from "./RoboRumbleVehicleModel";
import { TRACK_SECTORS, evaluateSetupForSector } from "@/data/roboTrackRecommendations";
import { BATTLE_CARS_SPEC } from "@/data/roboRumbleData";

export type TrackCameraView = "follow" | "bumper" | "side" | "top";

interface ConeState {
  id: number;
  x: number;
  z: number;
  isHit: boolean;
  rotationX: number;
}

interface RoboRumbleObstacleTrackSceneProps {
  playerCarId: BattleCarId;
  customization: CustomizationSettings;
  cameraView: TrackCameraView;
  runState: TrackRunState;
  driveInput: {
    throttle: number;
    steer: number;
    brake: boolean;
    boost: boolean;
  };
  onUpdateTelemetry: (data: TrackTelemetryData) => void;
  onFinishRun: (finalTimeSec: number, penaltiesSec: number, conesHit: number) => void;
  onSectorChange?: (sectorId: string) => void;
}

function ObstacleTrackSimulationContent({
  playerCarId,
  customization,
  cameraView,
  runState,
  driveInput,
  onUpdateTelemetry,
  onFinishRun,
  onSectorChange,
}: RoboRumbleObstacleTrackSceneProps) {
  const playerGroupRef = useRef<THREE.Group>(null);
  const spec = BATTLE_CARS_SPEC[playerCarId] || BATTLE_CARS_SPEC.striker;

  // Slalom Cones (Sector 5)
  const [cones, setCones] = useState<ConeState[]>([
    { id: 1, x: -1.0, z: 19.5, isHit: false, rotationX: 0 },
    { id: 2, x: 1.0, z: 21.5, isHit: false, rotationX: 0 },
    { id: 3, x: -1.0, z: 23.5, isHit: false, rotationX: 0 },
    { id: 4, x: 1.0, z: 25.5, isHit: false, rotationX: 0 },
    { id: 5, x: 0.0, z: 27.5, isHit: false, rotationX: 0 },
  ]);

  // Physical State of Track Vehicle
  const pState = useRef({
    x: 0,
    y: 0,
    z: -22,
    angle: 0, // facing +Z along the track
    pitch: 0,
    roll: 0,
    speed: 0,
    wheelRot: 0,
    battery: 100,
    motorTemp: 32,
    mass: spec.chassis.totalWeightGrams / 1000,
    baseMaxSpeed: spec.performanceMetrics.topSpeedKmH * 0.42,
    baseAccel: 5.5,
  });

  const runTimerRef = useRef(0);
  const penaltiesRef = useRef(0);
  const conesHitCountRef = useRef(0);
  const hasFinishedRef = useRef(false);
  const lastSectorIdRef = useRef("s1_start");
  const checkpointsPassedRef = useRef(0);

  // Reset track & car state when run starts/restarts
  useEffect(() => {
    pState.current.x = 0;
    pState.current.y = 0;
    pState.current.z = -22;
    pState.current.angle = 0;
    pState.current.pitch = 0;
    pState.current.roll = 0;
    pState.current.speed = 0;
    pState.current.battery = 100;
    pState.current.motorTemp = 32;

    runTimerRef.current = 0;
    penaltiesRef.current = 0;
    conesHitCountRef.current = 0;
    hasFinishedRef.current = false;
    checkpointsPassedRef.current = 0;

    // Reset cones upright
    setCones([
      { id: 1, x: -1.0, z: 19.5, isHit: false, rotationX: 0 },
      { id: 2, x: 1.0, z: 21.5, isHit: false, rotationX: 0 },
      { id: 3, x: -1.0, z: 23.5, isHit: false, rotationX: 0 },
      { id: 4, x: 1.0, z: 25.5, isHit: false, rotationX: 0 },
      { id: 5, x: 0.0, z: 27.5, isHit: false, rotationX: 0 },
    ]);
  }, [runState.status, playerCarId]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const p = pState.current;

    if (runState.status === "paused" || hasFinishedRef.current) return;

    // Timer advances only when running and player has initiated forward move or crossed -21m
    if (runState.status === "running") {
      runTimerRef.current += dt;
    }

    // ------------------------------------------------------------------------
    // 1. DETERMINE CURRENT SECTOR & TERRAIN ELEVATION
    // ------------------------------------------------------------------------
    const z = p.z;
    let targetY = 0;
    let targetPitch = 0;
    let currentSector = TRACK_SECTORS[0];
    let isStallRisk = false;
    let clearanceBounce = 0;

    // Find current active track sector
    for (const sec of TRACK_SECTORS) {
      if (z >= sec.zStart && z <= sec.zEnd) {
        currentSector = sec;
        break;
      }
    }

    if (currentSector.id !== lastSectorIdRef.current) {
      lastSectorIdRef.current = currentSector.id;
      onSectorChange?.(currentSector.id);
    }

    // Evaluate setup against this sector
    const sectorEval = evaluateSetupForSector(currentSector, customization);
    let frictionMultiplier = sectorEval.frictionMultiplier;
    let wheelSlipPct = 0;

    // Sector 2: 18° Incline & Bridge Elevation
    if (z >= -14 && z < -8) {
      // Incline Ramp
      const rampProgress = (z - (-14)) / 6; // 0 to 1
      targetY = rampProgress * 1.2;
      targetPitch = -0.22; // Nose tilted up
      isStallRisk = sectorEval.isStallRisk;
    } else if (z >= -8 && z < -5) {
      // Elevated Bridge Platform
      targetY = 1.2;
      targetPitch = 0;
    } else if (z >= -5 && z < -2) {
      // Decline Ramp
      const declineProgress = (z - (-5)) / 3; // 0 to 1
      targetY = 1.2 - declineProgress * 1.2;
      targetPitch = 0.35; // Nose tilted down
    }
    // Sector 3: Log Crawl Rumble Bumps (z: -2 to 8)
    else if (z >= -2 && z <= 8) {
      const bumpCycle = Math.sin((z + 2) * 4.2);
      if (bumpCycle > 0.3) {
        // Log obstacle hit
        const wheelDiam = customization.battleWheelDiameter || 55;
        const amplitude = wheelDiam === 68 ? 0.03 : wheelDiam === 55 ? 0.06 : 0.12;
        clearanceBounce = amplitude;
        targetY = bumpCycle * amplitude;
        targetPitch = Math.cos((z + 2) * 4.2) * 0.1;

        // Small wheels suffer resistance
        if (wheelDiam === 42) {
          frictionMultiplier *= 0.65;
        }
      }
    }
    // Sector 4: Mud & Sludge Pit (z: 8 to 18)
    else if (z > 8 && z <= 18) {
      targetY = -0.04; // Slight sink into soft mud
      if (customization.battleTireGrip !== "silicone-spike") {
        wheelSlipPct = customization.battleTireGrip === "rubber-tread" ? 35 : 75;
      }
    }
    // Sector 6: Narrow Ridge Bridge (z: 28 to 38)
    else if (z > 28 && z <= 38) {
      targetY = 0.15; // Slightly elevated curb ridge
    }

    // ------------------------------------------------------------------------
    // 2. KINEMATICS, MOTOR TORQUE & GRAVITY DRAG
    // ------------------------------------------------------------------------
    let effectiveMaxSpeed = p.baseMaxSpeed * frictionMultiplier;
    let effectiveAccel = p.baseAccel * frictionMultiplier;

    // Turbo Boost
    if (driveInput.boost && p.battery > 5) {
      effectiveMaxSpeed *= 1.45;
      effectiveAccel *= 1.8;
      p.battery = Math.max(0, p.battery - dt * 2.2);
      p.motorTemp = Math.min(85, p.motorTemp + dt * 1.5);
    } else {
      p.battery = Math.max(0, p.battery - dt * 0.2);
    }

    // Gravity force component on incline slope (F_g = m * g * sin(theta))
    let gravitySpeedEffect = 0;
    if (targetPitch < -0.1) {
      // Climbing uphill: gravity pulls back
      gravitySpeedEffect = -2.8 * dt;
      if (isStallRisk && !driveInput.boost) {
        gravitySpeedEffect = -4.5 * dt; // High stall hazard
      }
    } else if (targetPitch > 0.1) {
      // Rolling downhill: gravity accelerates
      gravitySpeedEffect = 3.2 * dt;
    }

    // Apply Throttle & Braking
    if (driveInput.brake) {
      p.speed = THREE.MathUtils.lerp(p.speed, 0, dt * 8);
    } else if (driveInput.throttle !== 0) {
      const targetSpeed = driveInput.throttle * effectiveMaxSpeed;
      p.speed = THREE.MathUtils.lerp(p.speed, targetSpeed, dt * effectiveAccel);
      p.speed += gravitySpeedEffect;
      p.motorTemp = Math.min(75, p.motorTemp + dt * 0.25);
    } else {
      p.speed = THREE.MathUtils.lerp(p.speed, 0, dt * 2.5);
      p.speed += gravitySpeedEffect;
      p.motorTemp = Math.max(30, p.motorTemp - dt * 0.4);
    }

    // Steering
    if (driveInput.steer !== 0) {
      const steerMultiplier = Math.sign(p.speed || driveInput.throttle || 1);
      p.angle -= driveInput.steer * steerMultiplier * dt * 2.6;
    }

    // Update position
    const vx = Math.sin(p.angle) * p.speed;
    const vz = Math.cos(p.angle) * p.speed;
    p.x += vx * dt;
    p.z += vz * dt;
    p.y = THREE.MathUtils.lerp(p.y, targetY, dt * 12);
    p.pitch = THREE.MathUtils.lerp(p.pitch, targetPitch, dt * 8);
    p.wheelRot += (p.speed / 0.26) * dt;

    // Track Lateral Boundaries (Width: -2.3m to +2.3m)
    const trackHalfWidth = z > 28 ? 1.4 : 2.3; // Narrower on sector 6 ridge
    if (Math.abs(p.x) > trackHalfWidth) {
      p.x = Math.sign(p.x) * trackHalfWidth;
      p.speed *= 0.75; // Curb friction slow down
      p.roll = Math.sign(p.x) * 0.08;
    } else {
      p.roll = THREE.MathUtils.lerp(p.roll, 0, dt * 6);
    }

    // ------------------------------------------------------------------------
    // 3. SLALOM CONE COLLISION DETECTION (Sector 5)
    // ------------------------------------------------------------------------
    if (z >= 18 && z <= 28) {
      let updatedCones = false;
      const nextCones = cones.map((cone) => {
        if (!cone.isHit) {
          const dx = p.x - cone.x;
          const dz = p.z - cone.z;
          const distToCone = Math.sqrt(dx * dx + dz * dz);
          if (distToCone < 0.52) {
            // Cone knocked down!
            updatedCones = true;
            penaltiesRef.current += 2.0;
            conesHitCountRef.current += 1;
            return { ...cone, isHit: true, rotationX: Math.PI / 2 };
          }
        }
        return cone;
      });

      if (updatedCones) {
        setCones(nextCones);
      }
    }

    // ------------------------------------------------------------------------
    // 4. CHECKPOINT & FINISH LINE LOGIC
    // ------------------------------------------------------------------------
    // Checkpoint count based on progress
    if (z > -10 && checkpointsPassedRef.current < 1) checkpointsPassedRef.current = 1;
    if (z > 0 && checkpointsPassedRef.current < 2) checkpointsPassedRef.current = 2;
    if (z > 10 && checkpointsPassedRef.current < 3) checkpointsPassedRef.current = 3;
    if (z > 20 && checkpointsPassedRef.current < 4) checkpointsPassedRef.current = 4;
    if (z > 30 && checkpointsPassedRef.current < 5) checkpointsPassedRef.current = 5;

    // Finish Gate at z >= 36
    if (z >= 36 && !hasFinishedRef.current && runState.status === "running") {
      hasFinishedRef.current = true;
      checkpointsPassedRef.current = 6;
      onFinishRun(
        Math.round((runTimerRef.current + penaltiesRef.current) * 10) / 10,
        penaltiesRef.current,
        conesHitCountRef.current
      );
    }

    // ------------------------------------------------------------------------
    // 5. UPDATE 3D VEHICLE MESH POSITION & ORIENTATION
    // ------------------------------------------------------------------------
    if (playerGroupRef.current) {
      playerGroupRef.current.position.set(p.x, p.y, p.z);
      playerGroupRef.current.rotation.set(p.pitch, p.angle, p.roll);
    }

    // ------------------------------------------------------------------------
    // 6. CAMERA DYNAMICS
    // ------------------------------------------------------------------------
    if (cameraView === "follow") {
      const camOffset = new THREE.Vector3(
        -Math.sin(p.angle) * 4.2,
        2.1,
        -Math.cos(p.angle) * 4.2
      );
      state.camera.position.lerp(
        new THREE.Vector3(p.x, p.y, p.z).add(camOffset),
        dt * 6
      );
      state.camera.lookAt(p.x, p.y + 0.55, p.z + 2.0);
    } else if (cameraView === "bumper") {
      // First person hood camera
      const bumperOffset = new THREE.Vector3(
        Math.sin(p.angle) * 0.45,
        0.35,
        Math.cos(p.angle) * 0.45
      );
      state.camera.position.set(p.x + bumperOffset.x, p.y + 0.35, p.z + bumperOffset.z);
      state.camera.lookAt(
        p.x + Math.sin(p.angle) * 6,
        p.y + 0.25,
        p.z + Math.cos(p.angle) * 6
      );
    } else if (cameraView === "side") {
      state.camera.position.lerp(
        new THREE.Vector3(p.x + 4.5, p.y + 2.2, p.z - 2),
        dt * 4
      );
      state.camera.lookAt(p.x, p.y + 0.3, p.z + 2);
    } else if (cameraView === "top") {
      state.camera.position.lerp(new THREE.Vector3(p.x, 18, p.z), dt * 4);
      state.camera.lookAt(p.x, 0, p.z);
    }

    // ------------------------------------------------------------------------
    // 7. EMIT REALTIME TELEMETRY
    // ------------------------------------------------------------------------
    onUpdateTelemetry({
      speedKmH: Math.round(Math.abs(p.speed) * 2.4),
      throttlePct: Math.round(Math.abs(driveInput.throttle) * 100),
      motorTempC: Math.round(p.motorTemp),
      batteryPct: Math.round(p.battery),
      currentSector: currentSector.name,
      sectorIndex: TRACK_SECTORS.findIndex((s) => s.id === currentSector.id) + 1,
      wheelSlipPct: Math.round(wheelSlipPct),
      elapsedSec: Math.round(runTimerRef.current * 10) / 10,
      penaltiesSec: penaltiesRef.current,
      checkpointsPassed: checkpointsPassedRef.current,
      totalCheckpoints: 6,
      isStalled: Boolean(isStallRisk && p.speed < 0.2 && driveInput.throttle > 0.1),
      clearanceBounce: Math.round(clearanceBounce * 100),
    });
  });

  return (
    <>
      {/* Dynamic Player Vehicle */}
      <group ref={playerGroupRef} position={[0, 0, -22]}>
        <RoboRumbleVehicleModel
          customization={{ ...customization, battleCarId: playerCarId }}
          explosionLevel={0}
          selectedComponent={null}
          isolatedComponent={null}
          hiddenComponents={[]}
          onSelect={() => {}}
          wheelRotationSpeed={pState.current.speed * 8}
        />
        {/* Underbody Glow Ring */}
        <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.55, 0.65, 32]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.65} />
        </mesh>

        {/* Dual LED Forward Headlights */}
        <spotLight
          position={[-0.4, 0.35, 1.1]}
          target-position={[-0.4, 0, 14]}
          angle={0.45}
          penumbra={0.65}
          intensity={3.8}
          color="#f8fafc"
          distance={24}
        />
        <spotLight
          position={[0.4, 0.35, 1.1]}
          target-position={[0.4, 0, 14]}
          angle={0.45}
          penumbra={0.65}
          intensity={3.8}
          color="#f8fafc"
          distance={24}
        />
        {/* Headlight Lens Glows */}
        <mesh position={[-0.4, 0.3, 1.05]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.4, 0.3, 1.05]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* Slalom Pylons */}
      {cones.map((cone) => (
        <group
          key={cone.id}
          position={[cone.x, 0, cone.z]}
          rotation={[cone.rotationX, 0, 0]}
        >
          {/* Base */}
          <mesh position={[0, 0.02, 0]}>
            <boxGeometry args={[0.3, 0.04, 0.3]} />
            <meshStandardMaterial color="#ea580c" roughness={0.3} />
          </mesh>
          {/* Cone body */}
          <mesh position={[0, 0.26, 0]}>
            <coneGeometry args={[0.14, 0.52, 16]} />
            <meshStandardMaterial color="#f97316" roughness={0.4} />
          </mesh>
          {/* White Stripe */}
          <mesh position={[0, 0.22, 0]}>
            <cylinderGeometry args={[0.09, 0.11, 0.12, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* 3D Track Environment Architecture & Hurdles */}
      <TrackGeometry />
    </>
  );
}

// ============================================================================
// 3D TRACK GEOMETRY: ROADWAY, RAMPS, LOGS, MUD PIT & CHECKPOINT GANTRIES
// ============================================================================
function TrackGeometry() {
  return (
    <group position={[0, 0, 0]}>
      {/* 1. Base Ground Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 7]} receiveShadow>
        <planeGeometry args={[26, 75]} />
        <meshStandardMaterial color="#080a0e" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* 2. Main Track Bed Ribbon (Width 4.8m, Length 68m) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 7]} receiveShadow>
        <planeGeometry args={[4.8, 68]} />
        <meshStandardMaterial color="#141720" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Red/White Track Curbs */}
      <mesh position={[-2.45, 0.05, 7]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.15, 68]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      <mesh position={[2.45, 0.05, 7]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.15, 68]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>

      {/* Dashed Center Guide Line */}
      {Array.from({ length: 22 }).map((_, i) => (
        <mesh key={i} position={[0, 0.005, -20 + i * 2.6]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.12, 1.4]} />
          <meshBasicMaterial color="#64748b" transparent opacity={0.6} />
        </mesh>
      ))}

      {/* Proving Ground Track Floodlight Poles */}
      {[-16, -2, 12, 26].map((zPos) => (
        <group key={zPos} position={[-2.8, 0, zPos]}>
          <mesh position={[0, 2.2, 0]}>
            <cylinderGeometry args={[0.06, 0.08, 4.4, 12]} />
            <meshStandardMaterial color="#334155" metalness={0.8} />
          </mesh>
          <mesh position={[0.2, 4.3, 0]} rotation={[0, 0, -0.4]}>
            <boxGeometry args={[0.3, 0.15, 0.4]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <pointLight position={[0.3, 4.2, 0]} color="#f8fafc" intensity={2.2} distance={14} />
        </group>
      ))}

      {/* 3. SECTOR 1: START LINE GRID (z = -22) */}
      <mesh position={[0, 0.01, -22]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.4, 0.6]} />
        <meshBasicMaterial color="#eab308" />
      </mesh>
      {/* Start Overhead Gantry */}
      <group position={[0, 0, -22]}>
        <mesh position={[-2.3, 1.6, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 3.2]} />
          <meshStandardMaterial color="#475569" metalness={0.8} />
        </mesh>
        <mesh position={[2.3, 1.6, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 3.2]} />
          <meshStandardMaterial color="#475569" metalness={0.8} />
        </mesh>
        <mesh position={[0, 3.1, 0]}>
          <boxGeometry args={[4.8, 0.35, 0.2]} />
          <meshStandardMaterial color="#0f172a" metalness={0.5} />
        </mesh>
        {/* Green Start Signal Light */}
        <pointLight position={[0, 2.8, 0.3]} color="#22c55e" intensity={4} distance={6} />
      </group>

      {/* 4. SECTOR 2: 18° INCLINE RAMP & BRIDGE (z = -14 to -2) */}
      {/* Incline Wedge (z: -14 to -8, rise 1.2m) */}
      <mesh position={[0, 0.6, -11]} rotation={[-0.197, 0, 0]}>
        <boxGeometry args={[4.4, 0.12, 6.12]} />
        <meshStandardMaterial color="#334155" roughness={0.6} metalness={0.3} />
      </mesh>
      {/* Elevated Bridge Platform (z: -8 to -5, height 1.2m) */}
      <mesh position={[0, 1.14, -6.5]}>
        <boxGeometry args={[4.4, 0.12, 3]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.4} />
      </mesh>
      {/* Bridge Support Pillars */}
      <mesh position={[-2.1, 0.55, -6.5]}>
        <boxGeometry args={[0.2, 1.1, 2.8]} />
        <meshStandardMaterial color="#475569" metalness={0.7} />
      </mesh>
      <mesh position={[2.1, 0.55, -6.5]}>
        <boxGeometry args={[0.2, 1.1, 2.8]} />
        <meshStandardMaterial color="#475569" metalness={0.7} />
      </mesh>
      {/* Decline Wedge (z: -5 to -2, drop 1.2m) */}
      <mesh position={[0, 0.6, -3.5]} rotation={[0.38, 0, 0]}>
        <boxGeometry args={[4.4, 0.12, 3.23]} />
        <meshStandardMaterial color="#334155" roughness={0.6} metalness={0.3} />
      </mesh>

      {/* 5. SECTOR 3: LOG CRAWL OBSTACLES (z = -2 to 8) */}
      {[-1, 0.5, 2.0, 3.5, 5.0, 6.5].map((logZ, idx) => (
        <group key={idx} position={[0, 0.08, logZ]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.1, 0.1, 4.4, 16]} />
            <meshStandardMaterial color="#78350f" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* 6. SECTOR 4: MUD & SLUDGE PIT (z = 8 to 18) */}
      <mesh position={[0, 0.005, 13]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.4, 10]} />
        <meshStandardMaterial color="#3f2719" roughness={0.95} metalness={0.05} />
      </mesh>
      {/* Mud puddles & splatter details */}
      <mesh position={[-0.8, 0.012, 11]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.9, 16]} />
        <meshStandardMaterial color="#2d1c12" roughness={0.2} metalness={0.1} />
      </mesh>
      <mesh position={[0.7, 0.012, 15]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.1, 16]} />
        <meshStandardMaterial color="#2d1c12" roughness={0.2} metalness={0.1} />
      </mesh>

      {/* 7. SECTOR 6: NARROW RIDGE & FINISH GATE (z = 28 to 38) */}
      <mesh position={[0, 0.08, 33]}>
        <boxGeometry args={[2.8, 0.16, 10]} />
        <meshStandardMaterial color="#1e1e28" roughness={0.7} metalness={0.3} />
      </mesh>
      {/* Glowing Edge Rail Guide Lines */}
      <mesh position={[-1.38, 0.18, 33]}>
        <boxGeometry args={[0.04, 0.04, 10]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>
      <mesh position={[1.38, 0.18, 33]}>
        <boxGeometry args={[0.04, 0.04, 10]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>

      {/* 8. FINISH LINE CHECKERED ARCH (z = 36) */}
      <mesh position={[0, 0.17, 36]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.8, 0.6]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <group position={[0, 0, 36]}>
        <mesh position={[-1.6, 1.8, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 3.6]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.9} />
        </mesh>
        <mesh position={[1.6, 1.8, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 3.6]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.9} />
        </mesh>
        <mesh position={[0, 3.5, 0]}>
          <boxGeometry args={[3.4, 0.45, 0.25]} />
          <meshStandardMaterial color="#0f172a" metalness={0.6} />
        </mesh>
        {/* Checkered flag banner plate */}
        <mesh position={[0, 3.1, 0.15]}>
          <planeGeometry args={[3.0, 0.4]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>
        {/* Finish sensor beam light */}
        <pointLight position={[0, 1.2, 0]} color="#38bdf8" intensity={5} distance={5} />
      </group>
    </group>
  );
}

// ============================================================================
// MAIN EXPORT: OBSTACLE TRACK THREE.JS CANVAS WRAPPER
// ============================================================================
export default function RoboRumbleObstacleTrackScene(
  props: RoboRumbleObstacleTrackSceneProps
) {
  return (
    <div className="absolute inset-0 w-full h-full select-none bg-[#0a0e17]">
      <Canvas
        shadows
        camera={{ position: [0, 4.8, -26.5], fov: 46 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
        className="w-full h-full"
      >
        <color attach="background" args={["#0a0e17"]} />
        <fog attach="fog" args={["#0a0e17", 32, 115]} />

        {/* Dynamic Studio / Proving Ground Lighting */}
        <hemisphereLight args={["#93c5fd", "#0b1120", 0.9]} />
        <ambientLight intensity={0.65} color="#ffffff" />
        <directionalLight
          position={[14, 26, 8]}
          intensity={1.5}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0001}
        />
        <directionalLight position={[-12, 18, -18]} intensity={0.7} color="#38bdf8" />
        <directionalLight position={[0, 14, 35]} intensity={0.6} color="#e2e8f0" />

        {/* Active Simulation Loop */}
        <ObstacleTrackSimulationContent {...props} />

        {/* Orbit Controls if in top/tactical camera mode */}
        {props.cameraView === "top" && (
          <OrbitControls
            makeDefault
            minDistance={5}
            maxDistance={35}
            maxPolarAngle={Math.PI / 2 - 0.05}
          />
        )}
      </Canvas>
    </div>
  );
}
