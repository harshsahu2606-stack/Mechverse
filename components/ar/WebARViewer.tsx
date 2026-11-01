"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import {
  Camera,
  RefreshCw,
  Maximize2,
  Minimize2,
  Sun,
  Eye,
  Sliders,
  RotateCcw,
  Layers,
  Sparkles,
  Info,
  CheckCircle,
  AlertTriangle,
  Move,
  FlipHorizontal,
  Compass,
} from "lucide-react";
import { CustomizationSettings, MachineId } from "@/types/machine";
import { MACHINES_DATA } from "@/data/machinesData";
import WebARModelRenderer from "./WebARModelRenderer";

interface WebARViewerProps {
  machineId: MachineId;
  customization: CustomizationSettings;
  onClose: () => void;
  onSelectMachine: (id: MachineId) => void;
}

// True Physical Real-World Dimensions & Telemetry
const REAL_WORLD_SPECS: Record<
  MachineId,
  {
    name: string;
    dimensions: string;
    weight: string;
    frequency: string;
    power: string;
    scalePreset1x: number;
  }
> = {
  "drone-b": {
    name: "DRONE-B Industrial Octocopter",
    dimensions: "480 × 480 × 160 mm",
    weight: "1.42 kg (All-Up)",
    frequency: "400 Hz IMU Telemetry",
    power: "4S 5200mAh LiPo",
    scalePreset1x: 1.0,
  },
  "aero-450": {
    name: "AERO-450 Modular Drone",
    dimensions: "450 × 450 × 185 mm",
    weight: "1.25 kg",
    frequency: "400 Hz ArduPilot Loop",
    power: "3S 4200mAh 35C",
    scalePreset1x: 1.0,
  },
  "robo-rumble": {
    name: "RR-01 Combat Robot",
    dimensions: "280 × 240 × 110 mm",
    weight: "1.85 kg (Impact Ready)",
    frequency: "2.4 GHz SoftAP Control",
    power: "3S 2200mAh LiPo",
    scalePreset1x: 1.0,
  },
  "walking-robot": {
    name: "TJ-01 Walking Mechanism",
    dimensions: "320 × 210 × 165 mm",
    weight: "680 g",
    frequency: "50 RPM Drive Cycle",
    power: "4× AA Battery Pack",
    scalePreset1x: 1.0,
  },
  "sports-car": {
    name: "Apex GT-V6 Supercar",
    dimensions: "462 × 198 × 118 mm (1:10 Model)",
    weight: "2.8 kg (Scale Model)",
    frequency: "CAN Bus 1 Mbps",
    power: "Twin-Turbo V6 Architecture",
    scalePreset1x: 1.0,
  },
  "electric-fan": {
    name: "AeroVane Induction Fan",
    dimensions: "340 × 280 × 480 mm",
    weight: "2.1 kg",
    frequency: "50 Hz AC Phase Shift",
    power: "220V 55W Induction Motor",
    scalePreset1x: 1.0,
  },
  "esp32-drone": {
    name: "AERO-ESP Nano Drone",
    dimensions: "85 × 85 × 32 mm",
    weight: "38.5 g (Ultra-light)",
    frequency: "500 Hz FreeRTOS Task",
    power: "1S 3.7V 380mAh LiPo",
    scalePreset1x: 1.0,
  },
};

export default function WebARViewer({
  machineId,
  customization,
  onClose,
  onSelectMachine,
}: WebARViewerProps) {
  // Video & Camera state
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);

  // AR Transformations & Controls
  const [scale, setScale] = useState<number>(1.0); // 1.0 = standard tabletop
  const [rotationY, setRotationY] = useState<number>(0);
  const [elevation, setElevation] = useState<number>(0.05); // slightly above ground
  const [explosionLevel, setExplosionLevel] = useState<number>(0);
  const [isHovering, setIsHovering] = useState<boolean>(true);
  const [torchEnabled, setTorchEnabled] = useState<boolean>(false);
  const [showReticle, setShowReticle] = useState<boolean>(true);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  // UI state
  const [activeTab, setActiveTab] = useState<"transform" | "explode" | "telemetry">("transform");
  const [isTakingPhoto, setIsTakingPhoto] = useState<boolean>(false);
  const [photoSavedNotice, setPhotoSavedNotice] = useState<boolean>(false);

  const activeSpecs = REAL_WORLD_SPECS[machineId] || REAL_WORLD_SPECS["drone-b"];

  // Initialize Camera stream with back-camera priority
  useEffect(() => {
    let stream: MediaStream | null = null;

    async function startCamera() {
      try {
        setCameraError(null);

        // Enumerate video devices
        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoDevs = devices.filter((d) => d.kind === "videoinput");
          setAvailableCameras(videoDevs);
        }

        // Constraints: try environmental camera first (back camera on phones/tablets)
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
            videoRef.current?.play().catch((err) => console.warn("Video play interrupted:", err));
          };
          setCameraActive(true);
        }
      } catch (err: unknown) {
        console.warn("Environmental camera error, attempting fallback:", err);
        try {
          // Fallback to any available video stream (e.g. laptop webcam)
          stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: true,
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(() => {});
            setCameraActive(true);
          }
        } catch (fallbackErr: unknown) {
          const errorMessage =
            fallbackErr instanceof Error ? fallbackErr.message : "Camera access denied or unavailable";
          setCameraError(errorMessage);
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

  // Toggle Camera Front / Back
  const toggleCameraFacing = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  // High-Resolution AR Photo Snapshot Capture
  const handleCaptureSnapshot = () => {
    setIsTakingPhoto(true);

    setTimeout(() => {
      try {
        const r3fCanvas = canvasContainerRef.current?.querySelector("canvas");
        const video = videoRef.current;

        if (!r3fCanvas) {
          setIsTakingPhoto(false);
          return;
        }

        // Composite Canvas
        const compositeCanvas = document.createElement("canvas");
        const width = r3fCanvas.width || 1920;
        const height = r3fCanvas.height || 1080;
        compositeCanvas.width = width;
        compositeCanvas.height = height;
        const ctx = compositeCanvas.getContext("2d");

        if (ctx) {
          // 1. Draw camera video frame if active
          if (video && video.readyState >= 2) {
            // Draw video keeping aspect ratio
            ctx.drawImage(video, 0, 0, width, height);
          } else {
            // Dark futuristic studio backdrop
            ctx.fillStyle = "#07080A";
            ctx.fillRect(0, 0, width, height);
          }

          // 2. Overlay the Three.js 3D Model Render
          ctx.drawImage(r3fCanvas, 0, 0, width, height);

          // 3. Draw Mechverse CAD AR Watermark & Telemetry
          ctx.fillStyle = "rgba(7, 8, 10, 0.75)";
          ctx.fillRect(24, height - 90, 460, 66);
          ctx.strokeStyle = "rgba(255, 106, 26, 0.8)";
          ctx.lineWidth = 2;
          ctx.strokeRect(24, height - 90, 460, 66);

          ctx.fillStyle = "#FF6A1A";
          ctx.font = "bold 14px monospace";
          ctx.fillText(`MECHVERSE WEB AR // ${activeSpecs.name.toUpperCase()}`, 38, height - 64);

          ctx.fillStyle = "#E2E8F0";
          ctx.font = "12px monospace";
          ctx.fillText(`DIMENSIONS: ${activeSpecs.dimensions} | SCALE: ${scale}x`, 38, height - 44);

          ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
          ctx.font = "10px monospace";
          ctx.fillText(`TIMESTAMP: ${new Date().toISOString()}`, 38, height - 30);

          // Trigger download
          const link = document.createElement("a");
          link.download = `mechverse-ar-${machineId}-${Date.now()}.png`;
          link.href = compositeCanvas.toDataURL("image/png");
          link.click();

          setPhotoSavedNotice(true);
          setTimeout(() => setPhotoSavedNotice(false), 3000);
        }
      } catch (err) {
        console.error("AR Snapshot error:", err);
      } finally {
        setIsTakingPhoto(false);
      }
    }, 180);
  };

  return (
    <div className="relative w-full h-full bg-[#07080A] overflow-hidden select-none flex flex-col justify-between">
      {/* 1. Camera Video Background Feed */}
      <video
        ref={videoRef}
        playsInline
        autoPlay
        muted
        className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-700 ${
          cameraActive ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Simulated AR Studio Lab Backdrop if Camera is unavailable */}
      {!cameraActive && (
        <div className="absolute inset-0 z-0 bg-[#07080A] flex flex-col items-center justify-center p-6">
          {/* Futuristic Engineering Grid */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative z-10 max-w-md text-center p-6 rounded-2xl bg-[#0F1114]/90 border border-white/10 backdrop-blur-xl shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-[#FF6A1A]/10 border border-[#FF6A1A]/30 flex items-center justify-center mx-auto mb-3 text-[#FF6A1A]">
              <Camera size={22} />
            </div>
            <h3 className="text-sm font-mono tracking-widest text-white uppercase font-bold">
              AR Workbench Mode Active
            </h3>
            <p className="text-xs text-[#9AA0A9] mt-2 leading-relaxed">
              {cameraError
                ? "Camera access is restricted or denied. You can interact with this model in simulated tabletop AR space or click retry below."
                : "Initializing optical camera feed for environment tracking..."}
            </p>

            <button
              onClick={() => setFacingMode((prev) => (prev === "environment" ? "user" : "environment"))}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-medium text-white bg-[#FF6A1A] hover:bg-[#ff7d36] transition-all"
            >
              <RefreshCw size={12} />
              <span>Retry Camera Permission</span>
            </button>
          </div>
        </div>
      )}

      {/* Shutter Flash Animation */}
      {isTakingPhoto && (
        <div className="absolute inset-0 z-50 bg-white pointer-events-none animate-out fade-out duration-300" />
      )}

      {/* 2. Transparent 3D Canvas Overlay */}
      <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full z-10 pointer-events-auto">
        <Canvas
          gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
          camera={{ position: [0, 0.45, 1.8], fov: 46 }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          dpr={[1, 1.5]}
        >
          <Suspense fallback={null}>
            <WebARModelRenderer
              machineId={machineId}
              customization={customization}
              explosionLevel={explosionLevel}
              scale={scale}
              rotationY={rotationY}
              elevation={elevation}
              isHovering={isHovering}
              torchEnabled={torchEnabled}
              showReticle={showReticle}
              selectedComponent={selectedComponent}
              onSelectComponent={setSelectedComponent}
            />

            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              target={[0, elevation, 0]}
              minDistance={0.5}
              maxDistance={6.0}
              maxPolarAngle={Math.PI / 2.05}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* 3. Top Navigation & Telemetry Header */}
      <div className="relative z-20 w-full p-4 flex items-center justify-between pointer-events-none">
        {/* Left: AR Tracking Status */}
        <div className="flex items-center gap-2.5 pointer-events-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0F1114]/85 border border-white/15 backdrop-blur-md shadow-lg">
            <span
              className={`w-2 h-2 rounded-full ${
                cameraActive ? "bg-emerald-500 animate-pulse" : "bg-[#FF6A1A]"
              }`}
            />
            <span className="text-[10px] font-mono tracking-widest text-white font-semibold uppercase">
              {cameraActive ? "WEB AR: LIVE FEED" : "AR SIMULATED STAGE"}
            </span>
          </div>

          {/* Real World Dimensions Chip */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md text-[10px] font-mono text-[#9AA0A9]">
            <Compass size={12} className="text-[#FF6A1A]" />
            <span>{activeSpecs.dimensions}</span>
          </div>
        </div>

        {/* Right: Quick Actions (Camera flip, torch, close) */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Torch / Flashlight Toggle */}
          <button
            onClick={() => setTorchEnabled((prev) => !prev)}
            title="Toggle AR Studio Spotlight"
            className={`p-2 rounded-xl border backdrop-blur-md transition-all ${
              torchEnabled
                ? "bg-[#FF6A1A] border-[#FF6A1A] text-white shadow-[0_0_15px_rgba(255,106,26,0.5)]"
                : "bg-[#0F1114]/80 border-white/15 text-white/70 hover:text-white"
            }`}
          >
            <Sun size={15} />
          </button>

          {/* Flip Camera (if mobile has multiple cameras) */}
          {availableCameras.length > 1 && (
            <button
              onClick={toggleCameraFacing}
              title="Flip Camera (Front/Rear)"
              className="p-2 rounded-xl bg-[#0F1114]/80 border border-white/15 text-white/70 hover:text-white backdrop-blur-md transition-all"
            >
              <FlipHorizontal size={15} />
            </button>
          )}

          {/* Toggle Surface Reticle */}
          <button
            onClick={() => setShowReticle((prev) => !prev)}
            title="Toggle Ground Placement Ring"
            className={`p-2 rounded-xl border backdrop-blur-md transition-all ${
              showReticle
                ? "bg-white/15 border-white/30 text-white"
                : "bg-[#0F1114]/80 border-white/15 text-white/40"
            }`}
          >
            <Eye size={15} />
          </button>

          {/* Close AR Button */}
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl bg-red-600/80 hover:bg-red-600 border border-red-500/50 text-white text-xs font-mono font-medium backdrop-blur-md transition-all shadow-lg"
          >
            Exit AR
          </button>
        </div>
      </div>

      {/* Snapshot Confirmation Pill */}
      {photoSavedNotice && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-600/90 border border-emerald-400/50 text-white text-xs font-mono backdrop-blur-md shadow-2xl">
            <CheckCircle size={14} />
            <span>AR Snapshot Saved to Downloads!</span>
          </div>
        </div>
      )}

      {/* 4. Bottom Controls: Machine Switcher, Scale Presets, Shutter & Slider Panel */}
      <div className="relative z-20 w-full p-4 max-w-4xl mx-auto flex flex-col gap-3 pointer-events-none">
        {/* Interaction Hint */}
        <div className="flex items-center justify-center gap-2 text-[10px] font-mono tracking-widest text-white/75 bg-black/60 border border-white/10 px-3.5 py-1 rounded-full backdrop-blur-md mx-auto">
          <Move size={11} className="text-[#FF6A1A]" />
          <span>DRAG TO REPOSITION · PINCH TO ZOOM · 2-FINGER DRAG TO ROTATE</span>
        </div>

        {/* Tabbed AR Drawer (Transform | Explode | Specs) */}
        <div className="bg-[#0F1114]/90 border border-white/15 rounded-2xl backdrop-blur-xl p-3 shadow-2xl pointer-events-auto space-y-3">
          {/* Top Bar inside Drawer: Tabs & Shutter button */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-1">
              {[
                { id: "transform", label: "Scale & Rotate", icon: Sliders },
                { id: "explode", label: "Disassembly", icon: Layers },
                { id: "telemetry", label: "Specifications", icon: Info },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono transition-all ${
                      activeTab === tab.id
                        ? "bg-[#FF6A1A] text-white font-semibold shadow-md shadow-[#FF6A1A]/30"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon size={12} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* AR Photo Shutter Capture Button */}
            <button
              onClick={handleCaptureSnapshot}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-[#07080A] text-xs font-mono font-bold transition-all transform active:scale-95 shadow-lg"
              title="Capture High-Res AR Photo with Telemetry"
            >
              <Camera size={13} className="text-[#FF6A1A]" />
              <span>Capture AR Photo</span>
            </button>
          </div>

          {/* Tab 1: Transform (Scale Presets, Elevation, Rotation) */}
          {activeTab === "transform" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {/* Scale Presets */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#9AA0A9] uppercase">
                  <span>Scale Factor</span>
                  <span className="text-white font-bold">{Math.round(scale * 100)}%</span>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {[
                    { label: "1:1 Real", value: 1.0 },
                    { label: "1:2 Desk", value: 0.5 },
                    { label: "1:4 Table", value: 0.25 },
                    { label: "1:10 Mini", value: 0.1 },
                  ].map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() => setScale(preset.value)}
                      className={`py-1 rounded-lg text-[9px] font-mono transition ${
                        scale === preset.value
                          ? "bg-white/25 text-white font-bold border border-white/30"
                          : "bg-white/5 text-white/60 hover:text-white border border-transparent"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 360 Rotation Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#9AA0A9] uppercase">
                  <span>Orientation</span>
                  <span className="text-white font-bold">
                    {Math.round(((rotationY % (Math.PI * 2)) * 180) / Math.PI)}°
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={-Math.PI}
                    max={Math.PI}
                    step={0.05}
                    value={rotationY}
                    onChange={(e) => setRotationY(parseFloat(e.target.value))}
                    className="flex-1 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#FF6A1A]"
                  />
                  <button
                    onClick={() => setRotationY(0)}
                    title="Reset Angle"
                    className="p-1 rounded bg-white/10 text-white/70 hover:text-white"
                  >
                    <RotateCcw size={11} />
                  </button>
                </div>
              </div>

              {/* Surface Elevation & Hover Dynamics */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#9AA0A9] uppercase">
                  <span>Surface Elevation</span>
                  <span className="text-white font-bold">{Math.round(elevation * 100)} cm</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={0}
                    max={0.8}
                    step={0.02}
                    value={elevation}
                    onChange={(e) => setElevation(parseFloat(e.target.value))}
                    className="flex-1 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#FF6A1A]"
                  />
                  <button
                    onClick={() => setIsHovering((h) => !h)}
                    title="Toggle Floating Hover Animation"
                    className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold transition ${
                      isHovering
                        ? "bg-[#FF6A1A]/30 text-[#FF6A1A] border border-[#FF6A1A]/50"
                        : "bg-white/10 text-white/40"
                    }`}
                  >
                    {isHovering ? "Float ON" : "Static"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Interactive Exploded View in AR */}
          {activeTab === "explode" && (
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#9AA0A9]">
                <span className="uppercase">CAD Layer Disassembly Slider</span>
                <span className="text-[#FF6A1A] font-bold">
                  {Math.round(explosionLevel * 100)}% DISSECTED
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.02}
                  value={explosionLevel}
                  onChange={(e) => setExplosionLevel(parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#FF6A1A]"
                />
                <button
                  onClick={() => setExplosionLevel(0)}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-mono"
                >
                  Assemble
                </button>
                <button
                  onClick={() => setExplosionLevel(0.75)}
                  className="px-2.5 py-1 rounded-lg bg-[#FF6A1A]/20 border border-[#FF6A1A]/40 text-[#FF6A1A] text-[10px] font-mono font-bold"
                >
                  Explode 75%
                </button>
              </div>
            </div>
          )}

          {/* Tab 3: Real Engineering Telemetry */}
          {activeTab === "telemetry" && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[10px] font-mono">
              <div className="p-2 rounded-xl bg-black/50 border border-white/5">
                <div className="text-[#5C626B] uppercase">Real Envelope</div>
                <div className="text-white font-semibold mt-0.5">{activeSpecs.dimensions}</div>
              </div>
              <div className="p-2 rounded-xl bg-black/50 border border-white/5">
                <div className="text-[#5C626B] uppercase">Hardware Weight</div>
                <div className="text-white font-semibold mt-0.5">{activeSpecs.weight}</div>
              </div>
              <div className="p-2 rounded-xl bg-black/50 border border-white/5">
                <div className="text-[#5C626B] uppercase">Control Frequency</div>
                <div className="text-white font-semibold mt-0.5">{activeSpecs.frequency}</div>
              </div>
              <div className="p-2 rounded-xl bg-black/50 border border-white/5">
                <div className="text-[#5C626B] uppercase">Power Source</div>
                <div className="text-white font-semibold mt-0.5">{activeSpecs.power}</div>
              </div>
            </div>
          )}

          {/* Bottom Machine Quick-Switcher Carousel */}
          <div className="pt-2 border-t border-white/10 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-[9px] font-mono text-[#5C626B] uppercase shrink-0 mr-1">
              Select Machine:
            </span>
            {[
              { id: "drone-b", label: "Drone-B Octocopter" },
              { id: "aero-450", label: "Aero-450 Quad" },
              { id: "robo-rumble", label: "Combat Robot" },
              { id: "walking-robot", label: "Theo Jansen Walker" },
              { id: "sports-car", label: "Apex Supercar" },
              { id: "esp32-drone", label: "ESP32 Nano Drone" },
              { id: "electric-fan", label: "Induction Fan" },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  onSelectMachine(m.id as MachineId);
                  setExplosionLevel(0);
                }}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono whitespace-nowrap transition-all ${
                  machineId === m.id
                    ? "bg-[#FF6A1A] text-white font-bold shadow-md shadow-[#FF6A1A]/30"
                    : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
