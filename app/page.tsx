"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Zap } from "lucide-react";

import {
  MachineId,
  ViewMode,
  CustomizationSettings,
  FanSimulationState,
  RobotSimulationState,
  SavedDesign,
} from "@/types/machine";
import { MACHINES_DATA } from "@/data/machinesData";

import LandingPage from "@/components/landing/LandingPage";
import Navbar from "@/components/ui/Navbar";
import HeroSection from "@/components/ui/HeroSection";
import ControlsHeader from "@/components/ui/ControlsHeader";
import ExplodedControls from "@/components/ui/ExplodedControls";
import ComponentDetailsModal from "@/components/ui/ComponentDetailsModal";
import SubAssemblyPanel from "@/components/ui/SubAssemblyPanel";
import CustomizerPanel from "@/components/ui/CustomizerPanel";
import FanSimulationControls from "@/components/ui/FanSimulationControls";
import BottomToolbar from "@/components/ui/BottomToolbar";
import SavedDesignsModal from "@/components/ui/SavedDesignsModal";
import ComponentHierarchyTree from "@/components/ui/ComponentHierarchyTree";
import WebARModal from "@/components/ar/WebARModal";
import { CameraPreset } from "@/components/3d/SceneViewer";

// Walking Robot Dedicated Workshop Components
import RobotWorkshopNav, { RobotProjectTab } from "@/components/robot/RobotWorkshopNav";
import RobotWalkingControls from "@/components/robot/RobotWalkingControls";
import RobotHowItWorks from "@/components/robot/RobotHowItWorks";
import RobotBuildGuide from "@/components/robot/RobotBuildGuide";
import RobotFreeSourcing from "@/components/robot/RobotFreeSourcing";
import RobotBOM from "@/components/robot/RobotBOM";
import RobotTroubleshooting from "@/components/robot/RobotTroubleshooting";
import RobotConfigPanel from "@/components/robot/RobotConfigPanel";
import RobotEngineeringDocs from "@/components/robot/RobotEngineeringDocs";

// Robo Rumble Battle Car Dedicated Components
import RoboRumbleWorkshopNav, { RoboRumbleProjectTab } from "@/components/roborumble/RoboRumbleWorkshopNav";
import RoboRumbleExplorerControls from "@/components/roborumble/RoboRumbleExplorerControls";
import RoboRumbleCustomizer from "@/components/roborumble/RoboRumbleCustomizer";
import RoboRumbleArenaOverlay from "@/components/roborumble/RoboRumbleArenaOverlay";
import RoboRumbleComparison from "@/components/roborumble/RoboRumbleComparison";
import RoboRumbleHowItWorks from "@/components/roborumble/RoboRumbleHowItWorks";
import RoboRumbleBuildGuide from "@/components/roborumble/RoboRumbleBuildGuide";
import RoboRumbleFreeSourcing from "@/components/roborumble/RoboRumbleFreeSourcing";
import RoboRumbleBOM from "@/components/roborumble/RoboRumbleBOM";
import RoboRumbleTroubleshooting from "@/components/roborumble/RoboRumbleTroubleshooting";
import RoboRumbleEngineeringDocs from "@/components/roborumble/RoboRumbleEngineeringDocs";
import RoboRumbleTrackOverlay from "@/components/roborumble/RoboRumbleTrackOverlay";
import { BattleCarId, BattleMatchState, TrackTelemetryData, TrackRunState } from "@/types/machine";
import { CameraViewMode } from "@/components/3d/BattleArenaScene";
import { TrackCameraView } from "@/components/3d/RoboRumbleObstacleTrackScene";

// AERO-450 Quadcopter Dedicated Workshop Components
import AeroDroneWorkshopNav from "@/components/aerodrone/AeroDroneWorkshopNav";
import AeroOverview from "@/components/aerodrone/AeroOverview";
import AeroHowItWorks from "@/components/aerodrone/AeroHowItWorks";
import AeroEngineeringLab from "@/components/aerodrone/AeroEngineeringLab";
import AeroCustomizer from "@/components/aerodrone/AeroCustomizer";
import AeroShoppingList from "@/components/aerodrone/AeroShoppingList";
import AeroAssemblyGuide from "@/components/aerodrone/AeroAssemblyGuide";
import AeroWiringDiagram from "@/components/aerodrone/AeroWiringDiagram";
import AeroElectronicView from "@/components/aerodrone/AeroElectronicView";
import UniversalElectronicWorkbench from "@/components/electronics/UniversalElectronicWorkbench";
import AeroCalibrationGuide from "@/components/aerodrone/AeroCalibrationGuide";
import AeroTroubleshooting from "@/components/aerodrone/AeroTroubleshooting";
import AeroBOM from "@/components/aerodrone/AeroBOM";
import AeroEngineeringDocs from "@/components/aerodrone/AeroEngineeringDocs";
import Esp32PhoneControllerOverlay from "@/components/esp32drone/Esp32PhoneControllerOverlay";
// Ropeway Climbing Robot Dedicated Workshop Components
import RopewayWorkshopNav from "@/components/ropeway/RopewayWorkshopNav";
import RopewaySimulationControls from "@/components/ropeway/RopewaySimulationControls";
import RopewayHowItWorks from "@/components/ropeway/RopewayHowItWorks";
import RopewayBuildGuide from "@/components/ropeway/RopewayBuildGuide";
import RopewayFreeSourcing from "@/components/ropeway/RopewayFreeSourcing";
import RopewayBOM from "@/components/ropeway/RopewayBOM";
import RopewayTroubleshooting from "@/components/ropeway/RopewayTroubleshooting";
import RopewayEngineeringDocs from "@/components/ropeway/RopewayEngineeringDocs";
import RopewayCustomizer from "@/components/ropeway/RopewayCustomizer";
import Esp32FlightDock from "@/components/esp32drone/Esp32FlightDock";
import RoboRacerWorkshopOverlay from "@/components/roboracer/RoboRacerWorkshopOverlay";
import RoboRacerDriveDock from "@/components/roboracer/RoboRacerDriveDock";
import UniversalWorkshopNav, { UniversalPillar } from "@/components/ui/UniversalWorkshopNav";
import DroneBWorkshopNav, { DroneBNavPillar } from "@/components/droneb/DroneBWorkshopNav";
import DroneBWorkshopView from "@/components/droneb/DroneBWorkshopView";
import { AeroNavTab, AppTheme, Esp32DroneNavTab, RoboRacerNavTab, RopewayNavTab, RopewaySimulationState } from "@/types/machine";
import { explosionAudio } from "@/lib/audio/explosionSoundEngine";

// Dynamic import with SSR disabled to prevent WebGL server rendering errors
const SceneViewer = dynamic(() => import("@/components/3d/SceneViewer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#0a0c10] text-gray-400 gap-3">
      <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-mono tracking-widest text-gray-400">
        LOADING 3D SIMULATOR...
      </span>
    </div>
  ),
});

const BattleArenaScene = dynamic(() => import("@/components/3d/BattleArenaScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#090b10] text-gray-400 gap-3">
      <div className="w-10 h-10 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-mono tracking-widest text-gray-400">
        LOADING ROBO RUMBLE ARENA...
      </span>
    </div>
  ),
});

const RoboRumbleObstacleTrackScene = dynamic(
  () => import("@/components/3d/RoboRumbleObstacleTrackScene"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#080a0e] text-gray-400 gap-3">
        <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-mono tracking-widest text-gray-400">
          LOADING OBSTACLE TRACK &amp; HURDLES...
        </span>
      </div>
    ),
  }
);

const DEFAULT_CUSTOMIZATION: CustomizationSettings = {
  paintColor: "#d71920",
  finish: "metallic",
  wheelStyle: "sport",
  rimColor: "#e2e8f0",
  bodyParts: {
    spoiler: true,
    sideSkirts: true,
    frontSplitter: true,
    rearDiffuser: true,
  },
  fanBladeColor: "#0ea5e9",
  fanBaseColor: "#1e2126",
  // Robot Customization
  robotMotorType: "bo-single",
  robotBatteryType: "2x-aa",
  robotChassisMaterial: "acrylic",
  robotLegMaterial: "popsicle",
  robotFootGrip: "rubber",
  // Robo Rumble Customization
  battleCarId: "striker",
  battleChassisType: "lightweight",
  battleChassisMaterial: "acrylic",
  battleMotorType: "quad-tt-200",
  battleMotorCount: 4,
  battleWheelDiameter: 55,
  battleWheelWidth: 22,
  battleTireGrip: "rubber-tread",
  battleDriveTrain: "4wd",
  battleBatteryType: "2s-liion",
  battleAttachment: "wedge",
  // AERO-450 Quadcopter Drone Configuration
  droneFrameSize: 450,
  droneArmColorFront: "#dc2626", // Red front arms for orientation
  droneArmColorRear: "#f8fafc",  // White rear arms
  droneMotorModel: "2212-920kv",
  dronePropeller: "1045-nylon",
  droneEsc: "simonk-30a",
  droneBattery: "3s-4200mah-35c",
  droneFlightController: "pixhawk-2.4.8",
  droneGps: "neo-m8n",
  droneCamera: "runcam-split-hd",
  droneLandingGear: "tall-arched",
  dronePropGuards: false,
  // Drone B (Industrial Octagonal UAV)
  droneBChassisColor: "#475569",
  droneBArmColor: "#334155",
  droneBMotorColor: "#1e293b",
  droneBPropellerColor: "#0f172a",
  // ESP32 Micro Drone
  esp32DroneFrameColor: "#1e293b",
  esp32DronePropsColor: "#ef4444",
  esp32DroneRearPropsColor: "#0f172a",
  // ROBO-RACER Rover
  roboRacerChassisColor: "#17171c",
  roboRacerAccentColor: "#ca8a04",
  // Ropeway Climbing Robot Configuration
  ropewayChassisColor: "#0284c7",
  ropewayPulleyColor: "#0f172a",
  ropewayHookColor: "#eab308",
  ropewayMotorType: "n20-100rpm",
  ropewayBatteryType: "2s-liion",
  ropewayChassisMaterial: "petg-3dprint",
  ropewayCableType: "steel-wire-2mm",
  ropewayPayload: "camera-fpv",
};

const DEFAULT_ROPEWAY_SIMULATION: RopewaySimulationState = {
  running: true,
  direction: "forward",
  speedPct: 65,
  inclineAngleDeg: 15,
  cableTensionN: 200,
  positionM: 0,
  isStalled: false,
  limitReached: false,
  clampingForceN: 35,
};

const DEFAULT_FAN_SIMULATION: FanSimulationState = {
  power: true,
  speed: 2,
  oscillating: true,
  tiltAngle: 6,
};

const DEFAULT_ROBOT_SIMULATION: RobotSimulationState = {
  walking: true,
  speed: "normal",
  forwardMovement: false,
  showKinematicGhost: false,
};

export default function Home() {
  // Navigation & High-level State (Landing page is displayed by default)
  const [currentTab, setCurrentTab] = useState<"landing" | "home" | "explore" | "builder">("landing");
  const [selectedMachineId, setSelectedMachineId] = useState<MachineId>("esp32-drone");
  const [viewMode, setViewMode] = useState<ViewMode>("view");
  const [theme, setTheme] = useState<AppTheme>("dark");
  const [showElectronicOverlay, setShowElectronicOverlay] = useState<boolean>(false);

  // Web AR Interactive Studio State
  const [isWebAROpen, setIsWebAROpen] = useState<boolean>(false);
  const [arTargetMachineId, setArTargetMachineId] = useState<MachineId>("drone-b");

  // Deep-link direct AR launcher via URL: ?ar=machineId
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const arParam = params.get("ar") as MachineId;
      if (arParam && MACHINES_DATA[arParam]) {
        setArTargetMachineId(arParam);
        setSelectedMachineId(arParam);
        setIsWebAROpen(true);
      }
    }
  }, []);

  const handleOpenAR = (machineId?: MachineId) => {
    const target = machineId || selectedMachineId || "drone-b";
    setArTargetMachineId(target);
    setIsWebAROpen(true);
  };

  // Walking Robot Workshop Project Tab
  const [robotProjectTab, setRobotProjectTab] = useState<RobotProjectTab>("simulator");

  // Ropeway Climbing Robot Dedicated Workshop State
  const [ropewayProjectTab, setRopewayProjectTab] = useState<RopewayNavTab>("simulator");
  const [ropewaySimulation, setRopewaySimulation] = useState<RopewaySimulationState>(DEFAULT_ROPEWAY_SIMULATION);

  // AERO-450 Quadcopter Dedicated Workshop State
  const [aeroProjectTab, setAeroProjectTab] = useState<AeroNavTab>("explorer");

  // Drone B Industrial Octocopter Dedicated Workshop State
  const [droneBProjectPillar, setDroneBProjectPillar] = useState<DroneBNavPillar>("simulator");

  // AERO-ESP Phone-Controlled Nano Drone State
  const [esp32ProjectTab, setEsp32ProjectTab] = useState<Esp32DroneNavTab>("simulator");
  const [esp32Armed, setEsp32Armed] = useState<boolean>(false);
  const [esp32Controls, setEsp32Controls] = useState({
    throttle: 1000,
    pitch: 0,
    roll: 0,
    yaw: 0,
  });

  // ROBO-RACER AI Vision & Obstacle Bot State
  const [roboRacerTab, setRoboRacerTab] = useState<RoboRacerNavTab>("simulator");
  const [roboRacerDriving, setRoboRacerDriving] = useState<boolean>(false);
  const [roboRacerHoodOpen, setRoboRacerHoodOpen] = useState<boolean>(true);
  const [roboRacerControls, setRoboRacerControls] = useState({
    speed: 0,
    steering: 0,
    cameraPan: 0,
  });

  // Robo Rumble Dedicated Workshop, Arena & Track State
  const [roboRumbleProjectTab, setRoboRumbleProjectTab] = useState<RoboRumbleProjectTab>("simulator");
  const [roboSimulatorMode, setRoboSimulatorMode] = useState<"explorer" | "arena" | "track" | "customizer" | "compare">("explorer");
  const [playerBattleCar, setPlayerBattleCar] = useState<BattleCarId>("striker");
  const [aiBattleCar, setAiBattleCar] = useState<BattleCarId>("titan");
  const [arenaCameraView, setArenaCameraView] = useState<CameraViewMode>("follow");
  const [trackCameraView, setTrackCameraView] = useState<TrackCameraView>("follow");
  const [trackRunState, setTrackRunState] = useState<TrackRunState>({
    status: "idle",
    lapTimeSec: 0,
    bestLapSec: null,
    penaltiesSec: 0,
    conesHit: 0,
  });
  const [trackTelemetry, setTrackTelemetry] = useState<TrackTelemetryData>({
    speedKmH: 0,
    throttlePct: 0,
    motorTempC: 32,
    batteryPct: 100,
    currentSector: "Sector 1: Launch Grid",
    sectorIndex: 1,
    wheelSlipPct: 0,
    elapsedSec: 0,
    penaltiesSec: 0,
    checkpointsPassed: 0,
    totalCheckpoints: 6,
    isStalled: false,
    clearanceBounce: 0,
  });
  const [matchState, setMatchState] = useState<BattleMatchState>({
    mode: "pv_ai",
    difficulty: "normal",
    aiCarId: "titan",
    arenaId: "octagon",
    status: "idle",
    durationSec: 0,
    collisionsCount: 0,
    playerDistanceTraveled: 0,
    winner: null,
  });
  const [arenaTelemetry, setArenaTelemetry] = useState({
    playerSpeed: 0,
    playerHealth: 100,
    playerBattery: 100,
    playerMotorTemp: 32,
    aiHealth: 100,
    collisions: 0,
    distance: 0,
    duration: 0,
    pinProgress: 0,
    pinningSide: null as "player" | "ai" | null,
  });
  const [driveInput, setDriveInput] = useState({
    throttle: 0,
    steer: 0,
    brake: false,
    boost: false,
  });

  // Sub-Assembly state (e.g. Engine teardown)
  const [activeSubAssemblyId, setActiveSubAssemblyId] = useState<string | null>(null);
  const [selectedSubPartId, setSelectedSubPartId] = useState<string | null>(null);

  // 3D Scene Interactive State
  const [explosionLevel, setExplosionLevel] = useState<number>(0);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [isolatedComponentId, setIsolatedComponentId] = useState<string | null>(null);
  const [hiddenComponents, setHiddenComponents] = useState<string[]>([]);
  const [customization, setCustomization] = useState<CustomizationSettings>(DEFAULT_CUSTOMIZATION);
  const [simulation, setSimulation] = useState<FanSimulationState>(DEFAULT_FAN_SIMULATION);
  const [robotSimulation, setRobotSimulation] = useState<RobotSimulationState>(DEFAULT_ROBOT_SIMULATION);

  // Camera & Viewport
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>("default");
  const [cameraResetCount, setCameraResetCount] = useState<number>(0);
  const viewportContainerRef = useRef<HTMLDivElement>(null);

  // LocalStorage Saved Designs
  const [savedDesigns, setSavedDesigns] = useState<SavedDesign[]>([]);
  const [isSavedDesignsOpen, setIsSavedDesignsOpen] = useState(false);

  // Load saved designs on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("mechverse_designs");
      if (stored) {
        setSavedDesigns(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Could not read saved designs from localStorage", e);
    }
  }, []);

  // Continuous driving keyboard event listener for Robo Rumble Arena & Obstacle Track
  useEffect(() => {
    if (
      selectedMachineId !== "robo-rumble" ||
      roboRumbleProjectTab !== "simulator" ||
      (roboSimulatorMode !== "arena" && roboSimulatorMode !== "track")
    )
      return;

    const keysDown = new Set<string>();

    const updateInput = () => {
      let throttle = 0;
      let steer = 0;
      if (keysDown.has("KeyW") || keysDown.has("ArrowUp")) throttle += 1;
      if (keysDown.has("KeyS") || keysDown.has("ArrowDown")) throttle -= 1;
      if (keysDown.has("KeyA") || keysDown.has("ArrowLeft")) steer -= 1;
      if (keysDown.has("KeyD") || keysDown.has("ArrowRight")) steer += 1;
      const brake = keysDown.has("Space");
      const boost = keysDown.has("ShiftLeft") || keysDown.has("ShiftRight");

      setDriveInput({ throttle, steer, brake, boost });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        [
          "KeyW",
          "KeyS",
          "KeyA",
          "KeyD",
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
          "Space",
          "ShiftLeft",
          "ShiftRight",
        ].includes(e.code)
      ) {
        e.preventDefault();
        keysDown.add(e.code);
        updateInput();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (keysDown.has(e.code)) {
        keysDown.delete(e.code);
        updateInput();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [selectedMachineId, roboRumbleProjectTab, roboSimulatorMode]);

  const handleSaveDesign = (name: string) => {
    const newDesign: SavedDesign = {
      id: Date.now().toString(),
      name,
      machineId: selectedMachineId,
      savedAt: new Date().toISOString(),
      settings: customization,
    };
    const updated = [newDesign, ...savedDesigns];
    setSavedDesigns(updated);
    try {
      localStorage.setItem("mechverse_designs", JSON.stringify(updated));
    } catch (e) {
      console.warn("Could not write to localStorage", e);
    }
  };

  const handleDeleteDesign = (id: string) => {
    const updated = savedDesigns.filter((d) => d.id !== id);
    setSavedDesigns(updated);
    try {
      localStorage.setItem("mechverse_designs", JSON.stringify(updated));
    } catch (e) {
      console.warn("Could not write to localStorage", e);
    }
  };

  const handleApplySavedDesign = (design: SavedDesign) => {
    setSelectedMachineId(design.machineId);
    setCustomization(design.settings);
    setCurrentTab("explore");
    setViewMode("customize");
  };

  const handleReset = () => {
    setExplosionLevel(0);
    setSelectedComponentId(null);
    setIsolatedComponentId(null);
    setHiddenComponents([]);
    setActiveSubAssemblyId(null);
    setSelectedSubPartId(null);
    setCameraPreset("default");
    setCameraResetCount((c) => c + 1);
    setCustomization(DEFAULT_CUSTOMIZATION);
    setSimulation(DEFAULT_FAN_SIMULATION);
    setRobotSimulation(DEFAULT_ROBOT_SIMULATION);
    setMatchState((prev) => ({ ...prev, status: "idle", winner: null }));
  };

  const handleToggleVisibility = (id: string) => {
    setHiddenComponents((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleIsolate = (id: string) => {
    setIsolatedComponentId((prev) => (prev === id ? null : id));
  };

  const handleSelectMachine = (id: MachineId) => {
    setSelectedMachineId(id);
    setSelectedComponentId(null);
    setIsolatedComponentId(null);
    setHiddenComponents([]);
    setActiveSubAssemblyId(null);
    setSelectedSubPartId(null);
    setExplosionLevel(0);
    setCameraPreset("default");
    setCameraResetCount((c) => c + 1);
    if ((id === "sports-car" || id === "electric-fan") && viewMode === "electronic") {
      setViewMode("view");
    }
    setRobotProjectTab("simulator");
    if (id === "robo-rumble") {
      setRoboRumbleProjectTab("simulator");
      setRoboSimulatorMode("explorer");
      setMatchState((prev) => ({ ...prev, status: "idle", winner: null }));
    }
    if (id === "esp32-drone") {
      setEsp32ProjectTab("simulator");
      setEsp32Armed(false);
      setEsp32Controls({ throttle: 1000, pitch: 0, roll: 0, yaw: 0 });
    }
    if (id === "ropeway-robot") {
      setRopewayProjectTab("simulator");
      setRopewaySimulation(DEFAULT_ROPEWAY_SIMULATION);
    }
    if (id === "robo-racer") {
      setRoboRacerTab("simulator");
      setRoboRacerDriving(false);
      setRoboRacerHoodOpen(true);
      setRoboRacerControls({ speed: 0, steering: 0, cameraPan: 0 });
    }
    if (id === "drone-b") {
      setDroneBProjectPillar("simulator");
    }
  };

  const handleEnterSubAssembly = (subAssemblyId: string) => {
    setActiveSubAssemblyId(subAssemblyId);
    setViewMode("subassembly");
    setExplosionLevel(0.45);
    const machine = MACHINES_DATA[selectedMachineId];
    const sub = machine?.subAssemblies?.[subAssemblyId];
    if (sub && sub.parts.length > 0) {
      setSelectedSubPartId(sub.parts[0].id);
    }
  };

  const handleExitSubAssembly = () => {
    setActiveSubAssemblyId(null);
    setSelectedSubPartId(null);
    setViewMode("view");
    setExplosionLevel(0);
  };

  // Launch from Hero section into Full Mode
  const handleHeroLaunch = (machineId: MachineId, mode: "explore" | "builder" = "explore") => {
    handleSelectMachine(machineId);
    setCurrentTab(mode);
    setViewMode(mode === "builder" ? "customize" : "view");
  };

  const activeMachine = MACHINES_DATA[selectedMachineId] || MACHINES_DATA["walking-robot"];
  const selectedComponent = activeMachine.components.find((c) => c.id === selectedComponentId) || null;
  const activeSubAssembly = activeSubAssemblyId ? activeMachine.subAssemblies?.[activeSubAssemblyId] : null;

  // Render Full-Page Mechverse Landing Page if active
  if (currentTab === "landing") {
    return (
      <>
        <LandingPage
          theme={theme}
          onToggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
          onLaunchStudio={(machineId) => {
            if (machineId) {
              handleSelectMachine(machineId);
            }
            setCurrentTab("explore");
          }}
          onOpenAR={handleOpenAR}
        />

        {/* Global Interactive Web AR Modal */}
        <WebARModal
          isOpen={isWebAROpen}
          machineId={arTargetMachineId}
          customization={customization}
          onClose={() => setIsWebAROpen(false)}
          onSelectMachine={(id) => {
            setArTargetMachineId(id);
            setSelectedMachineId(id);
          }}
        />
      </>
    );
  }

  return (
    <div
      className={`h-screen w-screen overflow-hidden flex flex-col font-sans select-none transition-colors duration-300 ${
        theme === "light" ? "bg-[#f8fafc] text-slate-900" : "bg-[#090b0f] text-white"
      }`}
    >
      {/* Top Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          if (tab === "builder") setViewMode("customize");
          if (tab === "explore" && viewMode === "customize") setViewMode("view");
        }}
        selectedMachineId={selectedMachineId}
        onSelectMachine={(id) => {
          handleSelectMachine(id);
          if (currentTab === "home") setCurrentTab("explore");
        }}
        onReset={handleReset}
        onOpenSavedDesigns={() => setIsSavedDesignsOpen(true)}
        savedCount={savedDesigns.length}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
        onOpenAR={() => handleOpenAR(selectedMachineId)}
      />

      {/* Main Full-Height Viewport Container */}
      <main className="flex-1 relative w-full h-[calc(100vh-3.5rem)] overflow-hidden">
        {currentTab === "home" ? (
          /* ================= VIEW 1: HERO & MODEL SELECTION ================= */
          <div
            className={`w-full h-full relative overflow-y-auto transition-colors duration-300 ${
              theme === "light" ? "bg-[#f8fafc]" : "bg-[#090b0f]"
            }`}
          >
            <HeroSection onSelectAndLaunch={handleHeroLaunch} />
          </div>
        ) : (
          /* ================= VIEW 2: FULL MODE 3D SIMULATOR & WORKSHOP ================= */
          <div
            ref={viewportContainerRef}
            className={`w-full h-full relative overflow-hidden flex flex-col transition-colors duration-300 ${
              theme === "light" ? "bg-[#f8fafc]" : "bg-[#0a0c10]"
            }`}
          >
            {/* If Walking Robot, Render Secondary Workshop Tab Bar */}
            {selectedMachineId === "walking-robot" && (
              <div className="px-4 py-2 bg-[#090b0f]/90 border-b border-white/10 z-30 shrink-0">
                <RobotWorkshopNav
                  activeTab={robotProjectTab}
                  onChangeTab={(tab) => {
                    setRobotProjectTab(tab);
                    if (tab !== "simulator") {
                      setViewMode("view");
                    }
                  }}
                />
              </div>
            )}

            {/* If Robo Rumble, Render Secondary Workshop Tab Bar (Exact 7 Tabs as in Screenshot) */}
            {selectedMachineId === "robo-rumble" && (
              <div className="px-4 py-2 bg-[#090b0f]/90 border-b border-white/10 z-30 shrink-0">
                <RoboRumbleWorkshopNav
                  activeTab={roboRumbleProjectTab}
                  onChangeTab={(tab) => {
                    setRoboRumbleProjectTab(tab);
                    if (tab !== "simulator") {
                      setViewMode("view");
                    } else {
                      setRoboSimulatorMode("explorer");
                    }
                  }}
                />
              </div>
            )}

            {/* If AERO-450 Drone, Render 12-Section Workshop Tab Bar */}
            {selectedMachineId === "aero-450" && (
              <div className="z-30 shrink-0">
                <AeroDroneWorkshopNav
                  activeTab={aeroProjectTab}
                  onChangeTab={(tab) => {
                    setAeroProjectTab(tab);
                    if (tab !== "explorer") {
                      setViewMode("view");
                    }
                  }}
                  theme={theme}
                />
              </div>
            )}

            {/* If Ropeway Robot, Render Dedicated 8-Tab Workshop Bar */}
            {selectedMachineId === "ropeway-robot" && (
              <div className="px-4 py-2 bg-[#090b0f]/90 border-b border-white/10 z-30 shrink-0">
                <RopewayWorkshopNav
                  activeTab={ropewayProjectTab}
                  onChangeTab={(tab) => {
                    setRopewayProjectTab(tab);
                    if (tab !== "simulator" && tab !== "customizer") {
                      setViewMode("view");
                    }
                  }}
                  theme={theme}
                />
              </div>
            )}

            {/* If Drone B Octocopter, Render Dedicated Workshop Nav Bar */}
            {selectedMachineId === "drone-b" && (
              <div className="z-30 shrink-0">
                <DroneBWorkshopNav
                  activePillar={droneBProjectPillar}
                  onChangePillar={(pillar) => {
                    setDroneBProjectPillar(pillar);
                    if (pillar !== "simulator") {
                      setViewMode("view");
                    }
                  }}
                  theme={theme}
                />
              </div>
            )}

            {/* If AERO-ESP Drone, Render Dedicated Universal Workshop Nav Bar (Consistent 5 Pillars) */}
            {selectedMachineId === "esp32-drone" && (
              <div className="z-30 shrink-0">
                <UniversalWorkshopNav
                  machineId="esp32-drone"
                  activePillar={
                    esp32ProjectTab === "simulator"
                      ? "simulator"
                      : esp32ProjectTab === "how-it-works" || esp32ProjectTab === "dgca-rules"
                      ? "engineering"
                      : esp32ProjectTab === "schematic"
                      ? "electronics"
                      : esp32ProjectTab === "bom"
                      ? "bom"
                      : "guide"
                  }
                  onChangePillar={(pillar) => {
                    const tabMap: Record<UniversalPillar, Esp32DroneNavTab> = {
                      simulator: "simulator",
                      engineering: "how-it-works",
                      electronics: "schematic",
                      bom: "bom",
                      guide: "build-guide",
                    };
                    setEsp32ProjectTab(tabMap[pillar]);
                    if (pillar !== "simulator") {
                      setViewMode("view");
                    }
                  }}
                  subTab={
                    esp32ProjectTab === "how-it-works" || esp32ProjectTab === "dgca-rules"
                      ? esp32ProjectTab
                      : esp32ProjectTab === "build-guide" || esp32ProjectTab === "firmware"
                      ? esp32ProjectTab
                      : undefined
                  }
                  onChangeSubTab={(st) => setEsp32ProjectTab(st as Esp32DroneNavTab)}
                  subTabs={
                    esp32ProjectTab === "how-it-works" || esp32ProjectTab === "dgca-rules"
                      ? [
                          { id: "how-it-works", label: "Signal Flow & PID Loop" },
                          { id: "dgca-rules", label: "DGCA Nano Drone Rules (<250g)" },
                        ]
                      : esp32ProjectTab === "build-guide" || esp32ProjectTab === "firmware"
                      ? [
                          { id: "build-guide", label: "Step-by-Step Build Guide" },
                          { id: "firmware", label: "Arduino Production Firmware" },
                        ]
                      : undefined
                  }
                  theme={theme}
                />
              </div>
            )}

            {/* If Robo-Racer Rover, Render Dedicated Universal Workshop Nav Bar (Consistent 5 Pillars) */}
            {selectedMachineId === "robo-racer" && (
              <div className="z-30 shrink-0">
                <UniversalWorkshopNav
                  machineId="robo-racer"
                  activePillar={
                    roboRacerTab === "simulator"
                      ? "simulator"
                      : roboRacerTab === "how-it-works" || roboRacerTab === "ai-vision"
                      ? "engineering"
                      : roboRacerTab === "schematic"
                      ? "electronics"
                      : roboRacerTab === "bom"
                      ? "bom"
                      : "guide"
                  }
                  onChangePillar={(pillar) => {
                    const tabMap: Record<UniversalPillar, RoboRacerNavTab> = {
                      simulator: "simulator",
                      engineering: "how-it-works",
                      electronics: "schematic",
                      bom: "bom",
                      guide: "build-guide",
                    };
                    setRoboRacerTab(tabMap[pillar]);
                    if (pillar !== "simulator") {
                      setViewMode("view");
                    }
                  }}
                  theme={theme}
                />
              </div>
            )}

            {/* Content Area Based on Robot Workshop Tab */}
            {selectedMachineId === "walking-robot" && robotProjectTab !== "simulator" ? (
              <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#090b0f]">
                {robotProjectTab === "how-it-works" && <RobotHowItWorks />}
                {robotProjectTab === "build-guide" && <RobotBuildGuide />}
                {robotProjectTab === "free-sourcing" && <RobotFreeSourcing />}
                {robotProjectTab === "bom" && <RobotBOM />}
                {robotProjectTab === "troubleshooting" && <RobotTroubleshooting />}
                {robotProjectTab === "docs" && <RobotEngineeringDocs />}
              </div>
            ) : selectedMachineId === "ropeway-robot" && ropewayProjectTab !== "simulator" ? (
              /* Content Area Based on Ropeway Robot Workshop Tab */
              <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#090b0f]">
                {ropewayProjectTab === "how-it-works" && <RopewayHowItWorks />}
                {ropewayProjectTab === "build-guide" && <RopewayBuildGuide />}
                {ropewayProjectTab === "free-sourcing" && <RopewayFreeSourcing />}
                {ropewayProjectTab === "bom" && <RopewayBOM />}
                {ropewayProjectTab === "troubleshooting" && <RopewayTroubleshooting />}
                {ropewayProjectTab === "engineering-docs" && <RopewayEngineeringDocs />}
                {ropewayProjectTab === "customizer" && (
                  <RopewayCustomizer
                    customization={customization}
                    onChange={setCustomization}
                  />
                )}
              </div>
            ) : selectedMachineId === "robo-rumble" && roboRumbleProjectTab !== "simulator" ? (
              /* Content Area Based on Robo Rumble Workshop Tab */
              <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#090b0f]">
                {roboRumbleProjectTab === "how-it-works" && <RoboRumbleHowItWorks />}
                {roboRumbleProjectTab === "build-guide" && <RoboRumbleBuildGuide />}
                {roboRumbleProjectTab === "free-sourcing" && <RoboRumbleFreeSourcing />}
                {roboRumbleProjectTab === "bom" && <RoboRumbleBOM />}
                {roboRumbleProjectTab === "troubleshooting" && <RoboRumbleTroubleshooting />}
                {roboRumbleProjectTab === "docs" && <RoboRumbleEngineeringDocs />}
              </div>
            ) : selectedMachineId === "aero-450" && aeroProjectTab !== "explorer" ? (
              /* Content Area Based on AERO-450 Workshop Tab */
              <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#090b0f]">
                {aeroProjectTab === "overview" && (
                  <AeroOverview customization={customization} onNavigateTab={setAeroProjectTab} />
                )}
                {aeroProjectTab === "how-it-works" && <AeroHowItWorks />}
                {aeroProjectTab === "engineering-lab" && (
                  <AeroEngineeringLab
                    customization={customization}
                    onChangeCustomization={setCustomization}
                  />
                )}
                {aeroProjectTab === "customizer" && (
                  <AeroCustomizer
                    customization={customization}
                    onChangeCustomization={setCustomization}
                    onSaveDesign={() => handleSaveDesign("AERO-450 Custom Drone")}
                  />
                )}
                {aeroProjectTab === "shopping" && <AeroShoppingList />}
                {aeroProjectTab === "assembly-guide" && <AeroAssemblyGuide />}
                {aeroProjectTab === "wiring" && <AeroElectronicView theme={theme} />}
                {aeroProjectTab === "calibration" && <AeroCalibrationGuide />}
                {aeroProjectTab === "troubleshooting" && <AeroTroubleshooting />}
                {aeroProjectTab === "bom" && <AeroBOM />}
                {aeroProjectTab === "docs" && <AeroEngineeringDocs />}
              </div>
            ) : selectedMachineId === "drone-b" && droneBProjectPillar !== "simulator" ? (
              /* Content Area Based on Drone B Industrial Workshop Tab */
              <div
                className={`flex-1 overflow-y-auto custom-scrollbar flex flex-col ${
                  theme === "light" ? "bg-slate-50" : "bg-[#090b0f]"
                }`}
              >
                <DroneBWorkshopView activePillar={droneBProjectPillar} theme={theme} />
              </div>
            ) : selectedMachineId === "esp32-drone" && esp32ProjectTab !== "simulator" ? (
              /* Content Area Based on ESP32 Drone Workshop Tab */
              <div
                className={`flex-1 overflow-y-auto custom-scrollbar flex flex-col ${
                  theme === "light" ? "bg-slate-50" : "bg-[#090b0f]"
                }`}
              >
                <Esp32PhoneControllerOverlay
                  theme={theme}
                  isArmed={esp32Armed}
                  onToggleArm={() => setEsp32Armed((prev) => !prev)}
                  throttle={esp32Controls.throttle}
                  pitch={esp32Controls.pitch}
                  roll={esp32Controls.roll}
                  yaw={esp32Controls.yaw}
                  onControlChange={setEsp32Controls}
                  activeTab={esp32ProjectTab}
                  onChangeTab={setEsp32ProjectTab}
                  explosionLevel={explosionLevel}
                  onChangeExplosionLevel={setExplosionLevel}
                  onResetCamera={() => setCameraResetCount((c) => c + 1)}
                  hideNavHeader={true}
                />
              </div>
            ) : selectedMachineId === "robo-racer" && roboRacerTab !== "simulator" ? (
              /* Content Area Based on ROBO-RACER Workshop Tab */
              <div
                className={`flex-1 overflow-y-auto custom-scrollbar flex flex-col ${
                  theme === "light" ? "bg-slate-50" : "bg-[#090b0f]"
                }`}
              >
                <RoboRacerWorkshopOverlay
                  theme={theme}
                  isDriving={roboRacerDriving}
                  onToggleDrive={() => setRoboRacerDriving((prev) => !prev)}
                  speed={roboRacerControls.speed}
                  steering={roboRacerControls.steering}
                  cameraPan={roboRacerControls.cameraPan}
                  hoodOpen={roboRacerHoodOpen}
                  onToggleHood={() => setRoboRacerHoodOpen((prev) => !prev)}
                  onControlChange={setRoboRacerControls}
                  activeTab={roboRacerTab}
                  onChangeTab={setRoboRacerTab}
                  explosionLevel={explosionLevel}
                  onChangeExplosionLevel={setExplosionLevel}
                  onResetCamera={() => setCameraResetCount((c) => c + 1)}
                  hideNavHeader={true}
                />
              </div>
            ) : (
              /* ================= 3D SIMULATOR VIEWPORT ================= */
              <div className="flex-1 relative w-full h-full overflow-hidden">
                {/* Robo Rumble Mode Sub-Bar (Explorer / Arena / Track / Customizer / Compare) */}
                {selectedMachineId === "robo-rumble" && (
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
                    <div className="flex items-center gap-1 bg-black/80 border border-white/15 p-1 rounded-2xl backdrop-blur-xl shadow-2xl">
                      {[
                        { id: "explorer", label: "3D CAD Explorer", icon: "🔍" },
                        { id: "arena", label: "Battle Arena", icon: "⚔️" },
                        { id: "track", label: "Obstacle Track", icon: "🏁" },
                        { id: "customizer", label: "Customizer", icon: "🛠️" },
                        { id: "compare", label: "Compare", icon: "⚖️" },
                      ].map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setRoboSimulatorMode(m.id as any)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                            roboSimulatorMode === m.id
                              ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30"
                              : "text-gray-400 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <span>{m.icon}</span>
                          <span>{m.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* If in Robo Rumble Arena Mode */}
                {selectedMachineId === "robo-rumble" && roboSimulatorMode === "arena" ? (
                  <div className="w-full h-full relative">
                    <BattleArenaScene
                      playerCarId={customization.battleCarId || "striker"}
                      aiCarId={aiBattleCar}
                      customization={customization}
                      matchState={matchState}
                      cameraView={arenaCameraView}
                      driveInput={driveInput}
                      onUpdateTelemetry={setArenaTelemetry}
                      onMatchFinish={(winner, reason) => {
                        setMatchState((prev) => ({
                          ...prev,
                          status: "finished",
                          winner,
                          winReason: reason,
                        }));
                      }}
                    />
                    <RoboRumbleArenaOverlay
                      playerCarId={customization.battleCarId || "striker"}
                      aiCarId={aiBattleCar}
                      matchState={matchState}
                      telemetry={arenaTelemetry}
                      cameraView={arenaCameraView}
                      onChangeCameraView={setArenaCameraView}
                      onStartMatch={() =>
                        setMatchState((prev) => ({ ...prev, status: "running" }))
                      }
                      onPauseMatch={() =>
                        setMatchState((prev) => ({ ...prev, status: "paused" }))
                      }
                      onRestartMatch={() => {
                        setMatchState((prev) => ({
                          ...prev,
                          status: "running",
                          winner: null,
                          winReason: null,
                        }));
                      }}
                      onExitArena={() => setRoboSimulatorMode("explorer")}
                      onVirtualInput={setDriveInput}
                    />
                  </div>
                ) : selectedMachineId === "robo-rumble" && roboSimulatorMode === "track" ? (
                  /* Obstacle Proving Ground / Single Car Race Track */
                  <div className="w-full h-full relative">
                    <RoboRumbleObstacleTrackScene
                      playerCarId={customization.battleCarId || "striker"}
                      customization={customization}
                      cameraView={trackCameraView}
                      runState={trackRunState}
                      driveInput={driveInput}
                      onUpdateTelemetry={setTrackTelemetry}
                      onFinishRun={(finalTime, penalties, cones) => {
                        setTrackRunState((prev) => ({
                          ...prev,
                          status: "completed",
                          lapTimeSec: finalTime,
                          penaltiesSec: penalties,
                          conesHit: cones,
                        }));
                      }}
                    />
                    <RoboRumbleTrackOverlay
                      playerCarId={customization.battleCarId || "striker"}
                      customization={customization}
                      runState={trackRunState}
                      telemetry={trackTelemetry}
                      cameraView={trackCameraView}
                      onChangeCameraView={setTrackCameraView}
                      onStartRun={() =>
                        setTrackRunState((prev) => ({ ...prev, status: "running" }))
                      }
                      onPauseRun={() =>
                        setTrackRunState((prev) => ({ ...prev, status: "paused" }))
                      }
                      onRestartRun={() => {
                        setTrackRunState({
                          status: "running",
                          lapTimeSec: 0,
                          bestLapSec: null,
                          penaltiesSec: 0,
                          conesHit: 0,
                        });
                      }}
                      onExitTrack={() => setRoboSimulatorMode("explorer")}
                      onApplyRecommendedSetup={() => {
                        setCustomization((prev) => ({
                          ...prev,
                          battleCarId: "titan",
                          battleChassisType: "reinforced",
                          battleChassisMaterial: "aluminum",
                          battleMotorType: "high-torque-500",
                          battleMotorCount: 4,
                          battleWheelDiameter: 68,
                          battleWheelWidth: 30,
                          battleTireGrip: "silicone-spike",
                          battleDriveTrain: "4wd",
                          battleBatteryType: "3s-lipo",
                          battleAttachment: "ram-bumper",
                        }));
                      }}
                      onVirtualInput={setDriveInput}
                    />
                  </div>
                ) : selectedMachineId === "robo-rumble" && roboSimulatorMode === "customizer" ? (
                  /* Embedded Customizer Studio */
                  <div className="w-full h-full overflow-y-auto custom-scrollbar bg-[#090b0f] pt-14">
                    <RoboRumbleCustomizer
                      customization={customization}
                      onChangeCustomization={setCustomization}
                      onSaveDesign={handleSaveDesign}
                    />
                  </div>
                ) : selectedMachineId === "robo-rumble" && roboSimulatorMode === "compare" ? (
                  /* Embedded Comparison Studio */
                  <div className="w-full h-full overflow-y-auto custom-scrollbar bg-[#090b0f] pt-14">
                    <RoboRumbleComparison />
                  </div>
                ) : (
                  /* Standard 3D CAD / Vehicle Explorer Viewport */
                  <>
                    {/* Top View Mode Switcher [ View | Exploded | Electronic | Components | Customize ] */}
                    <ControlsHeader
                      viewMode={viewMode}
                      setViewMode={(mode) => {
                        setViewMode(mode);
                        if (mode === "exploded") {
                          explosionAudio.playCinematicExplode(0.8);
                          if (explosionLevel === 0) {
                            setExplosionLevel(0.6);
                          }
                        } else if (mode === "view") {
                          if (explosionLevel > 0) {
                            explosionAudio.playMechanicalLatch();
                          }
                          setExplosionLevel(0);
                        }
                      }}
                      isSubAssembly={!!activeSubAssemblyId}
                      onExitSubAssembly={handleExitSubAssembly}
                      machineTitle={
                        activeSubAssemblyId
                          ? activeSubAssembly?.name || "SUB-ASSEMBLY"
                          : activeMachine.name
                      }
                      machineId={selectedMachineId}
                      theme={theme}
                      onOpenAR={() => handleOpenAR(selectedMachineId)}
                    />

                    {/* 3D Scene Viewer occupying 100% of the screen */}
                    <SceneViewer
                      machineId={selectedMachineId}
                      viewMode={viewMode}
                      explosionLevel={explosionLevel}
                      customization={customization}
                      simulation={simulation}
                      robotSimulation={robotSimulation}
                      ropewaySimulation={ropewaySimulation}
                      selectedComponent={
                        activeSubAssemblyId ? selectedSubPartId : selectedComponentId
                      }
                      isolatedComponent={isolatedComponentId}
                      hiddenComponents={hiddenComponents}
                      cameraPreset={cameraPreset}
                      cameraResetCount={cameraResetCount}
                      theme={theme}
                      esp32Armed={esp32Armed}
                      esp32Throttle={esp32Controls.throttle}
                      roboRacerDriving={roboRacerDriving}
                      roboRacerSpeed={roboRacerControls.speed}
                      roboRacerSteering={roboRacerControls.steering}
                      roboRacerCameraPan={roboRacerControls.cameraPan}
                      roboRacerHoodOpen={roboRacerHoodOpen}
                      onSelectComponent={(id) => {
                        if (activeSubAssemblyId) {
                          setSelectedSubPartId(id);
                        } else {
                          setSelectedComponentId(id);
                        }
                      }}
                    />

                    {/* AERO-ESP Sleek Floating Bottom Flight Controller & Telemetry Dock (Zero Canvas Overlap) */}
                    {selectedMachineId === "esp32-drone" && viewMode !== "exploded" && (
                      <Esp32FlightDock
                        theme={theme}
                        isArmed={esp32Armed}
                        onToggleArm={() => setEsp32Armed((prev) => !prev)}
                        throttle={esp32Controls.throttle}
                        pitch={esp32Controls.pitch}
                        roll={esp32Controls.roll}
                        yaw={esp32Controls.yaw}
                        onControlChange={setEsp32Controls}
                      />
                    )}

                    {/* ROBO-RACER Sleek Floating Bottom Drive Controller & Telemetry Dock (Zero Overlap on Car) */}
                    {selectedMachineId === "robo-racer" && viewMode !== "exploded" && (
                      <RoboRacerDriveDock
                        theme={theme}
                        isDriving={roboRacerDriving}
                        onToggleDrive={() => {
                          setRoboRacerDriving((prev) => {
                            const next = !prev;
                            if (next && roboRacerControls.speed === 0) {
                              setRoboRacerControls({ ...roboRacerControls, speed: 45 });
                            }
                            return next;
                          });
                        }}
                        speed={roboRacerControls.speed}
                        steering={roboRacerControls.steering}
                        cameraPan={roboRacerControls.cameraPan}
                        hoodOpen={roboRacerHoodOpen}
                        onToggleHood={() => setRoboRacerHoodOpen((prev) => !prev)}
                        onControlChange={setRoboRacerControls}
                      />
                    )}

                    {/* Interactive Full Electronic Workbench (In-Place Engineering Schematic for each model) */}
                    {viewMode === "electronic" && (
                      <UniversalElectronicWorkbench
                        machineId={selectedMachineId}
                        theme={theme}
                        onClose={() => setViewMode("view")}
                      />
                    )}

                    {/* Component Hierarchy Drawer (when in Components view) */}
                    {viewMode === "components" && !activeSubAssemblyId && (
                      <div className="absolute top-16 left-4 z-20 pointer-events-auto">
                        <ComponentHierarchyTree
                          machineName={activeMachine.name}
                          components={activeMachine.components}
                          selectedComponentId={selectedComponentId}
                          hiddenComponents={hiddenComponents}
                          onSelectComponent={(id) => {
                            setSelectedComponentId(id);
                            setIsolatedComponentId(null);
                          }}
                          onToggleVisibility={handleToggleVisibility}
                          theme={theme}
                        />
                      </div>
                    )}

                    {/* Exploded View Slider */}
                    {(viewMode === "exploded" || activeSubAssemblyId) && (
                      <ExplodedControls
                        explosionLevel={explosionLevel}
                        onChange={setExplosionLevel}
                        onReset={() => setExplosionLevel(0)}
                        theme={theme}
                      />
                    )}

                    {/* Electric Table Fan Controls & Telemetry */}
                    {selectedMachineId === "electric-fan" && !activeSubAssemblyId && (
                      <FanSimulationControls
                        simulation={simulation}
                        onChangeSimulation={setSimulation}
                      />
                    )}

                    {/* Walking Robot Kinematic Controls */}
                    {selectedMachineId === "walking-robot" && !activeSubAssemblyId && (
                      <RobotWalkingControls
                        simulation={robotSimulation}
                        onChangeSimulation={setRobotSimulation}
                        onSelectCameraPreset={setCameraPreset}
                        onReset={() => setCameraResetCount((c) => c + 1)}
                      />
                    )}

                    {/* Ropeway Climbing Robot Telemetry & Cable Controls */}
                    {selectedMachineId === "ropeway-robot" && !activeSubAssemblyId && (
                      <RopewaySimulationControls
                        simulation={ropewaySimulation}
                        onUpdateSimulation={setRopewaySimulation}
                      />
                    )}

                    {/* Robo Rumble Explorer Controls (Only in standard 3D view mode; zero overlap with Exploded controls) */}
                    {selectedMachineId === "robo-rumble" &&
                      roboSimulatorMode === "explorer" &&
                      viewMode === "view" &&
                      !activeSubAssemblyId && (
                        <RoboRumbleExplorerControls
                          selectedCarId={customization.battleCarId || "striker"}
                          onSelectCar={(carId) => {
                            setCustomization({ ...customization, battleCarId: carId });
                            setPlayerBattleCar(carId);
                          }}
                          onEnterArena={() => setRoboSimulatorMode("arena")}
                          onEnterTrack={() => setRoboSimulatorMode("track")}
                          onReset={() => setCameraResetCount((c) => c + 1)}
                        />
                      )}

                    {/* Component Details Card */}
                    {selectedComponent && !activeSubAssemblyId && viewMode !== "customize" && (
                      <ComponentDetailsModal
                        component={selectedComponent}
                        onClose={() => setSelectedComponentId(null)}
                        onEnterSubAssembly={handleEnterSubAssembly}
                        onToggleVisibility={handleToggleVisibility}
                        onToggleIsolate={handleToggleIsolate}
                        isHidden={hiddenComponents.includes(selectedComponent.id)}
                        isIsolated={isolatedComponentId === selectedComponent.id}
                        theme={theme}
                      />
                    )}

                    {/* Sub-Assembly Parts Teardown List */}
                    {activeSubAssembly && (
                      <SubAssemblyPanel
                        title={activeSubAssembly.name}
                        description={activeSubAssembly.description}
                        parts={activeSubAssembly.parts}
                        selectedPartId={selectedSubPartId}
                        onSelectPart={setSelectedSubPartId}
                      />
                    )}

                    {/* Customizer / Builder Studio Panel */}
                    {viewMode === "customize" && !activeSubAssemblyId && (
                      <>
                        {selectedMachineId === "walking-robot" ? (
                          <RobotConfigPanel
                            customization={customization}
                            onChangeCustomization={setCustomization}
                            onSaveDesign={handleSaveDesign}
                          />
                        ) : (
                          <CustomizerPanel
                            machineId={selectedMachineId}
                            customization={customization}
                            onChangeCustomization={setCustomization}
                            onSaveDesign={handleSaveDesign}
                          />
                        )}
                      </>
                    )}

                    {/* Bottom Camera Toolbar */}
                    <BottomToolbar
                      currentPreset={cameraPreset}
                      onSelectPreset={setCameraPreset}
                      onResetCamera={() => setCameraResetCount((c) => c + 1)}
                      viewportRef={viewportContainerRef}
                    />
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Saved Designs Garage Modal */}
      <SavedDesignsModal
        isOpen={isSavedDesignsOpen}
        onClose={() => setIsSavedDesignsOpen(false)}
        savedDesigns={savedDesigns}
        onLoadDesign={handleApplySavedDesign}
        onDeleteDesign={handleDeleteDesign}
      />

      {/* Global Interactive Web AR Modal */}
      <WebARModal
        isOpen={isWebAROpen}
        machineId={arTargetMachineId}
        customization={customization}
        onClose={() => setIsWebAROpen(false)}
        onSelectMachine={(id) => {
          setArTargetMachineId(id);
          setSelectedMachineId(id);
        }}
      />
    </div>
  );
}
