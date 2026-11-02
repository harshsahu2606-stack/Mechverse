export type MachineId =
  | "sports-car"
  | "electric-fan"
  | "walking-robot"
  | "robo-rumble"
  | "aero-450"
  | "drone-b"
  | "esp32-drone"
  | "robo-racer"
  | "ropeway-robot";

export type ViewMode = "view" | "exploded" | "components" | "customize" | "subassembly" | "arena" | "electronic";
export type AppTheme = "dark" | "light";

export type RopewayNavTab =
  | "simulator"
  | "how-it-works"
  | "build-guide"
  | "free-sourcing"
  | "bom"
  | "troubleshooting"
  | "engineering-docs"
  | "customizer";

export type RoboRacerNavTab =
  | "simulator"
  | "how-it-works"
  | "schematic"
  | "firmware"
  | "bom"
  | "build-guide"
  | "ai-vision";

export type Esp32DroneNavTab =
  | "simulator"
  | "how-it-works"
  | "schematic"
  | "firmware"
  | "bom"
  | "build-guide"
  | "dgca-rules";

export type AeroNavTab =
  | "overview"
  | "explorer"
  | "how-it-works"
  | "engineering-lab"
  | "customizer"
  | "shopping"
  | "assembly-guide"
  | "wiring"
  | "calibration"
  | "troubleshooting"
  | "bom"
  | "docs";

export type BattleCarId = "striker" | "titan" | "viper";

export interface BattleCarConfig {
  carId: BattleCarId;
  chassisType: "lightweight" | "reinforced" | "wide-stance";
  chassisMaterial: "acrylic" | "aluminum" | "plywood" | "3dprint-petg";
  paintColor: string;
  motorType: "dual-bo-100" | "quad-n20-300" | "quad-tt-200" | "high-torque-500";
  motorCount: 2 | 4;
  wheelDiameter: 42 | 55 | 68;
  wheelWidth: 15 | 22 | 30;
  tireGrip: "rubber-tread" | "foam-slick" | "silicone-spike" | "mecanum";
  driveTrain: "2wd" | "4wd";
  batteryType: "2x-aa" | "4x-aa" | "2s-liion" | "3s-lipo";
  attachment: "wedge" | "ram-bumper" | "lifter" | "side-deflectors" | "none";
}

export interface ArenaPhysicsVehicle {
  id: "player" | "ai";
  carId: BattleCarId;
  x: number;
  z: number;
  angle: number;
  vx: number;
  vz: number;
  angularVelocity: number;
  wheelRotation: number;
  health: number;
  batteryRemaining: number;
  motorTemp: number;
  isBraking: boolean;
  isBoosting: boolean;
  isPushedOut: boolean;
  mass: number;
  maxSpeed: number;
  acceleration: number;
  pushForce: number;
  gripCoeff: number;
}

export interface BattleMatchState {
  mode: "pv_ai" | "testing";
  difficulty: "easy" | "normal" | "hard";
  aiCarId: BattleCarId;
  arenaId: "octagon" | "grid-test";
  status: "idle" | "running" | "paused" | "finished";
  durationSec: number;
  collisionsCount: number;
  playerDistanceTraveled: number;
  winner: "player" | "ai" | "draw" | null;
  winReason?: "knockout" | "pin_out" | "time_out" | null;
}

export interface TrackTelemetryData {
  speedKmH: number;
  throttlePct: number;
  motorTempC: number;
  batteryPct: number;
  currentSector: string;
  sectorIndex: number;
  wheelSlipPct: number;
  elapsedSec: number;
  penaltiesSec: number;
  checkpointsPassed: number;
  totalCheckpoints: number;
  isStalled: boolean;
  clearanceBounce: number;
}

export interface TrackRunState {
  status: "idle" | "running" | "paused" | "completed";
  lapTimeSec: number;
  bestLapSec: number | null;
  penaltiesSec: number;
  conesHit: number;
}

export interface ComponentSpec {
  label: string;
  value: string;
}

export interface MachineComponentInfo {
  id: string;
  name: string;
  category?: string;
  meshNamePattern?: RegExp | string;
  description: string;
  purpose: string;
  workingPrinciple?: string;
  material?: string;
  recommendedQty?: number;
  dimensions?: string;
  interconnections?: string;
  priceINR?: number;
  alternatives?: string;
  sourcingTip?: string;
  specs?: ComponentSpec[];
  hasSubAssembly?: boolean;
  subAssemblyName?: string;
  subAssemblyId?: string;
  explosionVector: [number, number, number];
  explosionDistance?: number;
}

export interface SubAssemblyPart {
  id: string;
  name: string;
  description: string;
  specs?: ComponentSpec[];
  explosionVector: [number, number, number];
}

export interface MachineData {
  id: MachineId;
  name: string;
  category: string;
  badge: string;
  tagline: string;
  description: string;
  modelPath: string;
  defaultCameraPosition: [number, number, number];
  defaultFov: number;
  components: MachineComponentInfo[];
  subAssemblies?: Record<string, {
    id: string;
    name: string;
    description: string;
    parts: SubAssemblyPart[];
  }>;
}

export interface CustomizationSettings {
  paintColor: string;
  finish: "glossy" | "matte" | "metallic";
  wheelStyle: "sport" | "star" | "aero";
  rimColor: string;
  bodyParts: {
    spoiler: boolean;
    sideSkirts: boolean;
    frontSplitter: boolean;
    rearDiffuser: boolean;
  };
  // Fan customization
  fanBladeColor: string;
  fanBaseColor: string;
  // Robot configuration
  robotMotorType: "bo-single" | "bo-dual" | "metal-gear";
  robotBatteryType: "2x-aa" | "4x-aa" | "9v" | "18650";
  robotChassisMaterial: "acrylic" | "cardboard" | "plywood" | "3dprint";
  robotLegMaterial: "popsicle" | "acrylic" | "aluminum";
  robotFootGrip: "rubber" | "glue" | "bare";
  // Robo Rumble Battle Car configuration
  battleCarId: BattleCarId;
  battleChassisType: "lightweight" | "reinforced" | "wide-stance";
  battleChassisMaterial: "acrylic" | "aluminum" | "plywood" | "3dprint-petg";
  battleMotorType: "dual-bo-100" | "quad-n20-300" | "quad-tt-200" | "high-torque-500";
  battleMotorCount: 2 | 4;
  battleWheelDiameter: 42 | 55 | 68;
  battleWheelWidth: 15 | 22 | 30;
  battleTireGrip: "rubber-tread" | "foam-slick" | "silicone-spike" | "mecanum";
  battleDriveTrain: "2wd" | "4wd";
  battleBatteryType: "2x-aa" | "4x-aa" | "2s-liion" | "3s-lipo";
  battleAttachment: "wedge" | "ram-bumper" | "lifter" | "side-deflectors" | "none";
  // AERO-450 Quadcopter Drone Configuration
  droneFrameSize: 450 | 380 | 500;
  droneArmColorFront: string;
  droneArmColorRear: string;
  droneMotorModel: "2212-920kv" | "2212-1000kv" | "2216-880kv" | "2212-1400kv";
  dronePropeller: "1045-nylon" | "1045-carbon" | "9045-nylon" | "8045-nylon";
  droneEsc: "simonk-30a" | "blheli-30a-opto" | "40a-dshot600";
  droneBattery: "3s-2200mah-25c" | "3s-4200mah-35c" | "4s-3300mah-45c" | "3s-5200mah-25c";
  droneFlightController: "pixhawk-2.4.8" | "apm-2.8" | "f4-v3s-plus";
  droneGps: "neo-m8n" | "neo-6m" | "none";
  droneCamera: "runcam-split-hd" | "gopro-lite" | "fpv-analog-1200tvl" | "none";
  droneLandingGear: "tall-arched" | "stubby-skids" | "carbon-tube";
  dronePropGuards: boolean;
  // Drone B (Industrial Octagonal CAD Model) Configuration
  droneBChassisColor?: string;
  droneBArmColor?: string;
  droneBMotorColor?: string;
  droneBPropellerColor?: string;
  // ESP32 Phone-Controlled Micro Drone Configuration
  esp32DroneFrameColor?: string;
  esp32DronePropsColor?: string;
  esp32DroneRearPropsColor?: string;
  // ROBO-RACER AI Vision Bot Configuration
  roboRacerChassisColor?: string;
  roboRacerAccentColor?: string;
  // Ropeway Climbing Robot Configuration
  ropewayChassisColor?: string;
  ropewayArmColor?: string;
  ropewayCrankColor?: string;
  ropewayPulleyColor?: string;
  ropewayHookColor?: string;
  ropewayMotorType?: "n20-100rpm" | "bo-dual-60rpm" | "planetary-300rpm";
  ropewayBatteryType?: "2s-liion" | "9v-alkaline" | "3s-lipo";
  ropewayChassisMaterial?: "petg-3dprint" | "pla-plus" | "acrylic-laser" | "aluminum";
  ropewayCableType?: "steel-wire-2mm" | "nylon-paracord-4mm" | "poly-rope-6mm";
  ropewayPayload?: "camera-fpv" | "cargo-hook" | "cable-oiler" | "none";
}

export interface RopewaySimulationState {
  running: boolean;
  direction: "forward" | "reverse" | "stop";
  speedPct: number; // 0 to 100
  inclineAngleDeg: number; // 0 to 45 degrees
  cableTensionN: number;
  positionM: number; // position along cable in meters
  isStalled: boolean;
  limitReached: boolean;
  clampingForceN: number;
}

export interface DroneSimulationState {
  armed: boolean;
  throttlePct: number;
  flightMode: "STABILIZE" | "ALT_HOLD" | "LOITER" | "RTL";
  roll: number;
  pitch: number;
  yaw: number;
  altitudeM: number;
  motorRpm: [number, number, number, number]; // M1(CW), M2(CCW), M3(CW), M4(CCW)
}

export interface FanSimulationState {
  power: boolean;
  speed: 0 | 1 | 2 | 3;
  oscillating: boolean;
  tiltAngle: number;
}

export interface RobotSimulationState {
  walking: boolean;
  speed: "slow" | "normal" | "fast";
  forwardMovement: boolean;
  showKinematicGhost: boolean;
}

export interface BOMItem {
  id: string;
  name: string;
  category: string;
  defaultQty: number;
  qty: number;
  estimatedPriceINR: number;
  actualPriceINR: number;
  sourceType: "Scrap / Free" | "DIY / Household" | "Electronics Shop" | "Hardware Store";
  collected: boolean;
  notes: string;
}

export interface ScrapSourceItem {
  id: string;
  title: string;
  icon: string;
  usableParts: string[];
  safetyWarnings: string[];
  incompatibleParts: string[];
  collectionTips: string;
}

export interface CollectionChecklistItem {
  id: string;
  componentName: string;
  targetQuantity: number;
  status: "not_found" | "found" | "tested" | "ready";
  sourcedFrom?: string;
}

export interface SavedDesign {
  id: string;
  name: string;
  machineId: MachineId;
  savedAt: string;
  settings: CustomizationSettings;
}
