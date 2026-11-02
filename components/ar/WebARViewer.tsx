"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { X, FlipHorizontal } from "lucide-react";
import { CustomizationSettings, MachineId } from "@/types/machine";
import WebARModelRenderer from "./WebARModelRenderer";

interface WebARViewerProps {
  machineId: MachineId;
  customization: CustomizationSettings;
  onClose: () => void;
  onSelectMachine: (id: MachineId) => void;
}

const AR_MACHINES: { id: MachineId; name: string }[] = [
  { id: "drone-b", name: "Drone-B" },
  { id: "aero-450", name: "Aero-450" },
  { id: "robo-rumble", name: "Combat Robot" },
  { id: "walking-robot", name: "Walking Robot" },
  { id: "sports-car", name: "Sports Car" },
  { id: "esp32-drone", name: "ESP32 Drone" },
  { id: "robo-racer", name: "Robo-Racer Bot" },
  { id: "electric-fan", name: "Electric Fan" },
];

/**
 * Floor Plane Raycast Receiver: Allows tapping anywhere on the detected floor to move the anchor point
 */
function FloorHitDetector({
  onHit,
}: {
  onHit: (point: [number, number, number]) => void;
}) {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onHit([e.point.x, 0, e.point.z]);
      }}
      visible={false}
    >
      <planeGeometry args={[50, 50]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}

export default function WebARViewer({
  machineId,
  customization,
  onClose,
  onSelectMachine,
}: WebARViewerProps) {
  // Video & Camera stream state
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  // Floor Anchor Position [X, 0, Z]
  const [anchorPosition, setAnchorPosition] = useState<[number, number, number]>([0, 0, 0]);

  // Initialize Camera stream with environmental (back camera) priority
  useEffect(() => {
    let stream: MediaStream | null = null;

    async function startCamera() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoDevs = devices.filter((d) => d.kind === "videoinput");
          setAvailableCameras(videoDevs);
        }

        const constraints: MediaStreamConstraints = {
          audio: false,
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        };

        stream = await navigator.mediaDevices.getUserMedia(constraints);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().catch(() => {});
          };
          setCameraActive(true);
        }
      } catch {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(() => {});
            setCameraActive(true);
          }
        } catch {
          setCameraActive(false);
        }
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  const toggleCameraFacing = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  return (
    <div className="relative w-full h-full bg-[#07080A] overflow-hidden select-none">
      {/* 1. Camera Video Background Feed */}
      <video
        ref={videoRef}
        playsInline
        autoPlay
        muted
        className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-500 ${
          cameraActive ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Subtle fallback background grid if camera is off */}
      {!cameraActive && (
        <div
          className="absolute inset-0 z-0 bg-[#07080A] opacity-25 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
      )}

      {/* 2. Interactive Transparent 3D Canvas with Standing Eye Height looking down at Floor Plane */}
      <div className="absolute inset-0 w-full h-full z-10 pointer-events-auto">
        <Canvas
          gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
          camera={{ position: [0, 1.4, 2.1], fov: 48 }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          dpr={[1, 1.5]}
        >
          <Suspense fallback={null}>
            {/* Floor Plane Raycast Detector for Tap-To-Anchor */}
            <FloorHitDetector onHit={setAnchorPosition} />

            <WebARModelRenderer
              machineId={machineId}
              customization={customization}
              explosionLevel={0}
              scale={1.0}
              rotationY={0}
              anchorPosition={anchorPosition}
              torchEnabled={false}
              showReticle={true}
              selectedComponent={null}
              onSelectComponent={() => {}}
              isHovering={false}
            />

            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              target={[anchorPosition[0], 0, anchorPosition[2]]}
              minDistance={0.35}
              maxDistance={5.5}
              maxPolarAngle={Math.PI / 2.02}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* 3. Top Action Controls (Close & Camera Flip Icons only) */}
      <div className="absolute top-4 right-4 z-30 pointer-events-auto flex items-center gap-2">
        {availableCameras.length > 1 && (
          <button
            onClick={toggleCameraFacing}
            aria-label="Flip camera"
            className="p-2.5 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-white/80 hover:text-white backdrop-blur-md transition-all shadow-lg cursor-pointer"
          >
            <FlipHorizontal size={16} />
          </button>
        )}

        <button
          onClick={onClose}
          aria-label="Exit AR"
          className="p-2.5 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-white backdrop-blur-md transition-all shadow-lg cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      {/* 4. ONLY the Model Changing Option at the Bottom */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto max-w-[94vw] overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-black/75 border border-white/20 backdrop-blur-xl shadow-2xl">
          {AR_MACHINES.map((m) => {
            const isSelected = machineId === m.id;
            return (
              <button
                key={m.id}
                onClick={() => onSelectMachine(m.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#FF6A1A] text-white font-bold shadow-md shadow-[#FF6A1A]/30 scale-105"
                    : "text-white/70 hover:text-white hover:bg-white/10 font-normal"
                }`}
              >
                {m.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
