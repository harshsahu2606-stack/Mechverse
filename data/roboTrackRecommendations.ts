import { BattleCarId, CustomizationSettings } from "@/types/machine";

export interface TrackSectorInfo {
  id: string;
  name: string;
  zStart: number;
  zEnd: number;
  obstacleType: "straight" | "ramp" | "bridge" | "rumble" | "mud" | "slalom" | "ridge" | "banking";
  description: string;
  recommendedCar: BattleCarId;
  recommendedSetup: {
    tires: "rubber-tread" | "silicone-spike" | "foam-slick";
    wheels: 42 | 55 | 68;
    motors: "dual-bo-100" | "quad-n20-300" | "quad-tt-200" | "high-torque-500";
    drivetrain: "2wd" | "4wd";
    battery: "2s-liion" | "3s-lipo";
  };
  engineeringFormula: string;
  physicsReasoning: string;
  tips: string;
}

export const TRACK_SECTORS: TrackSectorInfo[] = [
  {
    id: "s1_start",
    name: "Sector 1: Launch Grid & High-Speed Straight",
    zStart: -24,
    zEnd: -14,
    obstacleType: "straight",
    description: "Smooth asphalt surface for explosive launch acceleration and straight-line top speed.",
    recommendedCar: "viper",
    recommendedSetup: {
      tires: "rubber-tread",
      wheels: 55,
      motors: "quad-n20-300",
      drivetrain: "4wd",
      battery: "3s-lipo",
    },
    engineeringFormula: "a = (F_traction - F_drag) / m",
    physicsReasoning: "Lowest total vehicle mass (m = 820g) yields maximum linear acceleration under equivalent motor power.",
    tips: "Hold Shift for Turbo Boost right off the start line to build maximum initial momentum.",
  },
  {
    id: "s2_ramp",
    name: "Sector 2: 18° Incline & Elevated Bridge",
    zStart: -14,
    zEnd: -2,
    obstacleType: "ramp",
    description: "Steep climbing ramp rising 1.2m above ground, followed by an elevated transition platform.",
    recommendedCar: "titan",
    recommendedSetup: {
      tires: "silicone-spike",
      wheels: 68,
      motors: "high-torque-500",
      drivetrain: "4wd",
      battery: "3s-lipo",
    },
    engineeringFormula: "T_motor >= (m * g * sin(18°) * r_wheel) / gear_ratio",
    physicsReasoning: "Gravitational component pulls backwards with F_g = m·g·sin(18°). Under-powered motors will stall and roll back down the ramp.",
    tips: "Keep forward throttle engaged. If stalled, hit Turbo Boost to break through the ramp crest.",
  },
  {
    id: "s3_rumble",
    name: "Sector 3: Log Crawl & Corrugated Bumps",
    zStart: -2,
    zEnd: 8,
    obstacleType: "rumble",
    description: "Series of raised wooden logs and corrugated rumble strips testing suspension travel and ground clearance.",
    recommendedCar: "titan",
    recommendedSetup: {
      tires: "rubber-tread",
      wheels: 68,
      motors: "quad-tt-200",
      drivetrain: "4wd",
      battery: "2s-liion",
    },
    engineeringFormula: "h_obstacle < r_wheel * (1 - cos(theta_attack))",
    physicsReasoning: "Small 42mm wheels suffer approach barrier jamming and bottom-out chassis scraping. 68mm wheels roll over seamlessly.",
    tips: "Maintain steady throttle. Avoid sharp turns on top of logs to prevent high-centering.",
  },
  {
    id: "s4_mud",
    name: "Sector 4: Sludge & Loose Gravel Pit",
    zStart: 8,
    zEnd: 18,
    obstacleType: "mud",
    description: "Viscous mud pit where Coulomb surface friction plummets. Wheels without deep tread will spin out.",
    recommendedCar: "titan",
    recommendedSetup: {
      tires: "silicone-spike",
      wheels: 68,
      motors: "quad-tt-200",
      drivetrain: "4wd",
      battery: "3s-lipo",
    },
    engineeringFormula: "F_friction = mu_surface * N; where mu_slick = 0.20, mu_spike = 0.78",
    physicsReasoning: "Foam slicks lose traction and cause 80% wheel slip. Silicone spikes physically key into the soft substrate.",
    tips: "Do not slam full reverse in mud or the vehicle will dig in and overheat motors.",
  },
  {
    id: "s5_slalom",
    name: "Sector 5: Precision Slalom Chicane",
    zStart: 18,
    zEnd: 28,
    obstacleType: "slalom",
    description: "Alternating orange slalom cones. Hitting a cone incurs a +2.0 second time penalty!",
    recommendedCar: "viper",
    recommendedSetup: {
      tires: "rubber-tread",
      wheels: 55,
      motors: "quad-tt-200",
      drivetrain: "4wd",
      battery: "2s-liion",
    },
    engineeringFormula: "I_yaw = (1/12) * m * (width^2 + length^2)",
    physicsReasoning: "Low rotational inertia allows rapid yaw direction reversal without centrifugal understeer into the pylons.",
    tips: "Feather the steering (A/D) with light forward throttle. Avoid over-steering at maximum speed.",
  },
  {
    id: "s6_ridge",
    name: "Sector 6: Narrow Ridge & Banked Finish",
    zStart: 28,
    zEnd: 38,
    obstacleType: "ridge",
    description: "Narrow 1.4m elevated causeway leading to the final high-speed finish gate.",
    recommendedCar: "striker",
    recommendedSetup: {
      tires: "rubber-tread",
      wheels: 55,
      motors: "quad-tt-200",
      drivetrain: "4wd",
      battery: "2s-liion",
    },
    engineeringFormula: "Track_Stability = (T_width / 2) / h_cog",
    physicsReasoning: "Low center of gravity (h_cog = 22mm) prevents tip-over off the edge. Balanced wheelbase keeps trajectory true.",
    tips: "Center your vehicle before entering the ridge, then hold full throttle across the checkered finish line!",
  },
];

export interface OverallCarEvaluation {
  carId: BattleCarId;
  name: string;
  suitabilityScore: number; // 0 to 100
  bestTracks: string;
  strengths: string[];
  weaknesses: string[];
  recommendationNote: string;
}

export const CAR_TRACK_EVALUATIONS: Record<BattleCarId, OverallCarEvaluation> = {
  titan: {
    carId: "titan",
    name: "TITAN (Heavy-Duty Offroad Monster)",
    suitabilityScore: 92,
    bestTracks: "Ramp Climb, Log Crawl, Mud & Gravel Pits",
    strengths: [
      "Massive 68mm wheels roll over logs and bumps without bottoming out",
      "High stall torque (12 kg-cm) climbs 18° incline ramps effortlessly",
      "Heavy chassis (1.45kg) provides superior ground normal force and grip",
      "4WD high-traction silicone spikes eliminate wheel slip in mud",
    ],
    weaknesses: [
      "Higher rotational inertia causes slight understeer in tight slalom chicanes",
      "Higher battery current draw on 3S LiPo packs",
    ],
    recommendationNote:
      "Best overall choice for surviving rough terrain, rock crawls, and steep incline obstacles without getting stuck.",
  },
  striker: {
    carId: "striker",
    name: "STRIKER (Balanced All-Rounder)",
    suitabilityScore: 88,
    bestTracks: "Narrow Ridge, All-Terrain Endurance, Mixed Chicanes",
    strengths: [
      "Low center of gravity (22mm) provides rock-solid stability on narrow beams",
      "Optimal balance of 22 km/h top speed and 55mm wheel clearance",
      "Low frontal wedge pushes away dislodged obstacles and track debris",
      "Predictable skid-steer yaw response at all speeds",
    ],
    weaknesses: [
      "May require turbo boost to climb the 18° ramp with basic 2WD motors",
      "Moderate wheel slip in deep mud unless equipped with spike tires",
    ],
    recommendationNote:
      "The perfect benchmark vehicle. Versatile enough to conquer all 6 sectors with smooth driver inputs.",
  },
  viper: {
    carId: "viper",
    name: "VIPER (Agile Speed Demon)",
    suitabilityScore: 78,
    bestTracks: "Launch Straightaway, Precision Slalom Chicanes",
    strengths: [
      "Ultra-light 820g chassis achieves unmatched 26 km/h sprint velocity",
      "Lightning-fast yaw response weaves through cones with zero cone penalties",
      "High power-to-weight ratio allows rapid recovery from speed drops",
    ],
    weaknesses: [
      "Small 42mm wheels suffer severe bottoming out on log crawl bumps",
      "Lower torque output risks stalling on steep 18° bridge ramps unless upgraded to high-torque motors",
      "Prone to wheel burnout in low-friction mud zones",
    ],
    recommendationNote:
      "A high-skill technical racer. Demands careful obstacle approach or customizer upgrades (e.g. 55mm wheels + 4WD).",
  },
};

/**
 * Computes vehicle performance factor on current sector based on customization
 */
export function evaluateSetupForSector(
  sector: TrackSectorInfo,
  config: CustomizationSettings
): {
  score: number; // 0 to 100
  feedback: string;
  isStallRisk: boolean;
  frictionMultiplier: number;
} {
  let score = 70;
  let feedback = "Standard configuration.";
  let isStallRisk = false;
  let frictionMultiplier = 1.0;

  if (sector.obstacleType === "ramp") {
    const isHighTorque =
      config.battleMotorType === "high-torque-500" || config.battleMotorType === "quad-tt-200";
    const is3S = config.battleBatteryType === "3s-lipo";
    const is4WD = config.battleDriveTrain === "4wd";

    if (isHighTorque && is4WD) {
      score = 95;
      feedback = "Exceptional climbing torque! 4WD and geared motors maintain speed uphill.";
    } else if (!is4WD && !isHighTorque) {
      score = 35;
      isStallRisk = true;
      feedback = "Warning: 2WD with low torque may stall on the 18° incline! Use Turbo Boost.";
    } else {
      score = 75;
      feedback = "Adequate climb power, but slight speed drop on ramp gradient.";
    }
  } else if (sector.obstacleType === "rumble") {
    if (config.battleWheelDiameter === 68) {
      score = 98;
      feedback = "68mm wheels roll over logs smoothly with 28mm chassis clearance.";
    } else if (config.battleWheelDiameter === 55) {
      score = 80;
      feedback = "55mm wheels clear the bumps with moderate vibration.";
    } else {
      score = 40;
      feedback = "Chassis scraping! 42mm wheels struggle with log height and cause heavy bounce.";
    }
  } else if (sector.obstacleType === "mud") {
    if (config.battleTireGrip === "silicone-spike") {
      score = 98;
      frictionMultiplier = 0.82;
      feedback = "Silicone spikes claw into the mud substrate with near-asphalt grip!";
    } else if (config.battleTireGrip === "rubber-tread") {
      score = 75;
      frictionMultiplier = 0.52;
      feedback = "Rubber treads provide moderate grip with some wheel spin.";
    } else {
      score = 30;
      frictionMultiplier = 0.22;
      feedback = "Severe wheel slip! Slicks/Mecanum tires lose 75% traction in mud.";
    }
  } else if (sector.obstacleType === "slalom") {
    if (config.battleChassisType === "lightweight" || config.battleCarId === "viper") {
      score = 96;
      feedback = "Nimble steering! Low polar inertia weaves between pylons cleanly.";
    } else if (config.battleChassisType === "wide-stance") {
      score = 72;
      feedback = "Wide stance requires wide lines to avoid clipping cones.";
    } else {
      score = 65;
      feedback = "Heavy chassis has higher inertia; brake before rapid turns.";
    }
  }

  return { score, feedback, isStallRisk, frictionMultiplier };
}
