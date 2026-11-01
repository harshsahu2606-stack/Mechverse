import { CustomizationSettings, BOMItem } from "@/types/machine";

export interface AeroComponentSpec {
  id: string;
  name: string;
  category: "Structure" | "Propulsion" | "Avionics" | "Power" | "Payload";
  model: string;
  manufacturer: string;
  massGrams: number;
  quantity: number;
  dimensions: string;
  voltageRange?: string;
  currentRating?: string;
  description: string;
  purpose: string;
  workingPrinciple: string;
  mountingLocation: string;
  sourcing: {
    supplier: string;
    productTitle: string;
    url: string;
    priceINR: number;
    verified: boolean;
    lastChecked: string;
    alternatives: {
      supplier: string;
      model: string;
      url: string;
      priceINR: number;
    }[];
  };
  installationTips: string[];
  safetyWarnings: string[];
}

export interface AeroCalculationResults {
  totalMassGrams: number;
  totalMassKg: number;
  maxThrustGrams: number;
  thrustToWeightRatio: number;
  hoverThrottlePct: number;
  hoverPowerWatts: number;
  hoverCurrentAmps: number;
  batteryNominalVoltage: number;
  batteryCapacityAh: number;
  batteryEnergyWh: number;
  batteryMaxDischargeAmps: number;
  estimatedFlightTimeMin: number;
  flightTimeRangeMin: [number, number];
  centerOfGravityOffsetMm: { x: number; y: number; z: number };
  maxTakeoffWeightGrams: number;
  availablePayloadGrams: number;
  diagnostics: {
    id: string;
    title: string;
    status: "PASS" | "WARNING" | "FAIL" | "NEEDS_VERIFICATION";
    formula: string;
    details: string;
  }[];
}

export const AERO_COMPONENTS_DATA: AeroComponentSpec[] = [
  {
    id: "frame-plates",
    name: "Central Core Plates & Integrated PDB",
    category: "Structure",
    model: "F450 Center PCB Set (Top + Bottom)",
    manufacturer: "HJ / DJI Design Reference",
    massGrams: 165,
    quantity: 1,
    dimensions: "150 x 150 x 1.6 mm (FR-4 Glass-Fiber)",
    description: "Dual structural chassis plates. The bottom plate features thick 2oz copper traces functioning as an integrated Power Distribution Board (PDB).",
    purpose: "Anchors the four structural arms and consolidates battery high-current connections directly to ESC solder pads.",
    workingPrinciple: "Distributes 11.1V-14.8V direct battery bus to four ESCs without requiring a messy external wiring harness.",
    mountingLocation: "Central geometric core of the quadcopter.",
    sourcing: {
      supplier: "Robu.in",
      productTitle: "F450 Quadcopter Frame with Integrated PDB",
      url: "https://robu.in/product/f450-quadcopter-frame-kit-integrated-pcb-circuit-wiring/",
      priceINR: 999,
      verified: true,
      lastChecked: "2026-10-15",
      alternatives: [
        {
          supplier: "Robocraze",
          model: "F450 Nylon Frame with PCB Board",
          url: "https://robocraze.com/products/f450-quadcopter-frame",
          priceINR: 1049,
        },
      ],
    },
    installationTips: [
      "Tin the integrated PDB pads thoroughly before soldering ESC power leads.",
      "Check with a digital multimeter in continuity mode to ensure zero short-circuits between positive and ground pads prior to connecting battery.",
    ],
    safetyWarnings: [
      "A solder bridge across positive and negative battery pads will cause a violent battery short circuit upon plugging in.",
    ],
  },
  {
    id: "arms-fl-fr",
    name: "Front Structural Arms (High-Visibility Red)",
    category: "Structure",
    model: "F450 Molded PA66 Reinforced Nylon Arm (Red Pair)",
    manufacturer: "HJ / Generic F450",
    massGrams: 104, // 52g each
    quantity: 2,
    dimensions: "215 mm length, 450 mm motor-to-motor wheelbase diagonal",
    description: "Ultra-durable injection-molded polyamide nylon arms with brass M3 threaded inserts for motor and frame bolting.",
    purpose: "Provides rigid motor separation and visual heading orientation for the pilot during line-of-sight flight.",
    workingPrinciple: "Acts as a cantilever beam supporting thrust loads exceeding 1.2 kg per arm.",
    mountingLocation: "Front Left (M1) and Front Right (M2) 45-degree frame mount points.",
    sourcing: {
      supplier: "ElectronicsComp",
      productTitle: "F450 Replacement Arm - Red (2 Pcs)",
      url: "https://www.electronicscomp.com/f450-drone-frame-arm-red",
      priceINR: 320,
      verified: true,
      lastChecked: "2026-10-15",
      alternatives: [
        {
          supplier: "Robu.in",
          model: "F450 Red Arm Pair",
          url: "https://robu.in/product/f450-arm-red/",
          priceINR: 350,
        },
      ],
    },
    installationTips: [
      "Use blue threadlocker (Loctite 242) on all frame mounting screws.",
      "Do not overtighten screws into brass inserts or you risk stripping the nylon core.",
    ],
    safetyWarnings: [
      "Inspect arms for hairline stress fractures after any hard landing before subsequent flights.",
    ],
  },
  {
    id: "arms-rl-rr",
    name: "Rear Structural Arms (Neutral White)",
    category: "Structure",
    model: "F450 Molded PA66 Reinforced Nylon Arm (White Pair)",
    manufacturer: "HJ / Generic F450",
    massGrams: 104,
    quantity: 2,
    dimensions: "215 mm length",
    description: "White nylon arms contrasting against the red front arms for immediate orientation recognition.",
    purpose: "Supports rear motor mounts M3 and M4 while balancing pitch inertia.",
    workingPrinciple: "Symmetric load-bearing cantilever beam.",
    mountingLocation: "Rear Left (M3) and Rear Right (M4) 45-degree frame mount points.",
    sourcing: {
      supplier: "ElectronicsComp",
      productTitle: "F450 Drone Frame Arm - White (2 Pcs)",
      url: "https://www.electronicscomp.com/f450-drone-frame-arm-white",
      priceINR: 320,
      verified: true,
      lastChecked: "2026-10-15",
      alternatives: [
        {
          supplier: "Robu.in",
          model: "F450 White Arm Pair",
          url: "https://robu.in/product/f450-arm-white/",
          priceINR: 350,
        },
      ],
    },
    installationTips: [
      "Route ESC motor signal wires along the underside of the arms using heat-resistant zip ties.",
    ],
    safetyWarnings: ["Ensure arms are aligned with zero twist to prevent unwanted yaw bias."],
  },
  {
    id: "brushless-motors",
    name: "A2212 920KV Brushless DC Outrunner Motors",
    category: "Propulsion",
    model: "A2212/13T 920KV CW/CCW Threaded Hub (Set of 4)",
    manufacturer: "ReadyToSky / EMAX Reference",
    massGrams: 208, // 52g x 4
    quantity: 4,
    dimensions: "27.7 mm diameter, 26 mm can height, 3.17 mm hardened shaft",
    voltageRange: "11.1V - 14.8V (3S - 4S LiPo)",
    currentRating: "Max Continuous: 15A / 60s (Peak 18A)",
    description: "Precision-balanced 14-pole outrunner brushless motors with high-temperature neodymium magnets and self-tightening CW/CCW prop adapters.",
    purpose: "Converts 3-phase AC voltage from ESCs into high-torque aerodynamic rotation to produce quadcopter lift.",
    workingPrinciple: "Electromagnetic Lorentz force drives the external rotor bell containing permanent magnets around fixed stator copper coils.",
    mountingLocation: "Mounted on the outer tip of each structural arm with M3x6mm screws.",
    sourcing: {
      supplier: "Robu.in",
      productTitle: "A2212 920KV Brushless Motor Set (2CW + 2CCW)",
      url: "https://robu.in/product/a2212-920kv-brushless-motor-set-for-quadcopter/",
      priceINR: 2399,
      verified: true,
      lastChecked: "2026-10-20",
      alternatives: [
        {
          supplier: "Robocraze",
          model: "EMAX XA2212 980KV Motor Set",
          url: "https://robocraze.com/products/emax-xa2212-980kv",
          priceINR: 3199,
        },
        {
          supplier: "ElectronicsComp",
          model: "A2212 1000KV Motor Set",
          url: "https://www.electronicscomp.com/a2212-1000kv-brushless-motor-for-drone",
          priceINR: 2199,
        },
      ],
    },
    installationTips: [
      "CRITICAL: Check M3 screw length! Screws longer than 6mm will penetrate into the motor base and crush the copper stator windings, causing an instant phase short.",
      "Match CW threaded nuts with clockwise motors and CCW threaded nuts with counter-clockwise motors so rotation naturally tightens the nuts.",
    ],
    safetyWarnings: [
      "NEVER touch spinning motor bells. Outrunner cans rotate at 8,000+ RPM and can cause severe skin friction burns.",
    ],
  },
  {
    id: "esc-controllers",
    name: "30A Electronic Speed Controllers (ESCs)",
    category: "Propulsion",
    model: "SimonK 30A ESC with 5V/2A Linear BEC",
    manufacturer: "Generic / SimonK Firmware",
    massGrams: 128, // 32g x 4
    quantity: 4,
    dimensions: "45 x 24 x 11 mm",
    voltageRange: "7.4V - 14.8V (2S - 4S LiPo)",
    currentRating: "Continuous: 30A, Burst: 40A (10s)",
    description: "Microcontroller-driven electronic switches utilizing low-resistance N-channel MOSFETs to rapidly commutate 3-phase power to each motor.",
    purpose: "Translates PWM / DShot throttle commands from the flight controller into high-frequency motor phase commutation.",
    workingPrinciple: "Six MOSFET H-bridge commutates DC battery input into 3-phase AC waveforms synchronized to rotor position.",
    mountingLocation: "Mounted on the underside of each arm in the propeller downwash for convective cooling.",
    sourcing: {
      supplier: "Robu.in",
      productTitle: "SimonK 30A Brushless ESC with 5V 2A BEC (Pack of 4)",
      url: "https://robu.in/product/simonk-30a-esc-for-quadcopter/",
      priceINR: 1799,
      verified: true,
      lastChecked: "2026-10-20",
      alternatives: [
        {
          supplier: "ElectronicsComp",
          model: "Yellow 30A ESC SimonK Firmware (4 Pcs)",
          url: "https://www.electronicscomp.com/simonk-30a-brushless-esc-for-quadcopter",
          priceINR: 1699,
        },
        {
          supplier: "Robocraze",
          model: "BLHeli 30A Opto ESC (Set of 4)",
          url: "https://robocraze.com/products/blheli-30a-esc",
          priceINR: 2399,
        },
      ],
    },
    installationTips: [
      "Calibrate ESC throttle endpoints simultaneously before attaching propellers using the flight controller calibration routine.",
      "Swap any two of the three motor wires to reverse that motor's direction of rotation.",
    ],
    safetyWarnings: [
      "Ensure ESC signal wires are isolated from the high-current battery wires to prevent electrical noise coupling into the flight controller.",
    ],
  },
  {
    id: "propellers-1045",
    name: "1045 Aerodynamic Propellers (10x4.5 Inch)",
    category: "Propulsion",
    model: "1045 CW/CCW High-Efficiency Nylon-Glass Compound",
    manufacturer: "Gemfan / Master Airscrew Reference",
    massGrams: 36, // 9g x 4
    quantity: 4,
    dimensions: "Diameter: 10 inches (254 mm), Pitch: 4.5 inches (114 mm)",
    description: "Matched aerodynamic composite propeller pairs (2 CW rotation, 2 CCW rotation) engineered for high thrust-to-power efficiency.",
    purpose: "Accelerates air downward to generate static lift and aerodynamic control moments.",
    workingPrinciple: "Bernoulli aerofoil camber creates high pressure beneath the blade and low pressure above.",
    mountingLocation: "Mounted onto motor shafts via self-tightening conical aluminum bullet nuts.",
    sourcing: {
      supplier: "Robu.in",
      productTitle: "1045 (10x4.5) Propeller Pair (CW & CCW) - 2 Pairs",
      url: "https://robu.in/product/1045-propeller-pair-black/",
      priceINR: 249,
      verified: true,
      lastChecked: "2026-10-18",
      alternatives: [
        {
          supplier: "ElectronicsComp",
          model: "1045 Nylon Propeller Set (4 Pcs)",
          url: "https://www.electronicscomp.com/1045-propeller-pair-for-quadcopter-drone",
          priceINR: 220,
        },
        {
          supplier: "Robocraze",
          model: "Gemfan 1045 Carbon-Nylon Propeller Set",
          url: "https://robocraze.com/products/gemfan-1045-propellers",
          priceINR: 450,
        },
      ],
    },
    installationTips: [
      "ALWAYS balance propellers on a magnetic balancer before mounting to eliminate video jello and IMU accelerometer clipping.",
      "NEVER install propellers until all software configuration, motor order tests, and failsafe calibrations are completed.",
    ],
    safetyWarnings: [
      "HIGH HAZARD: Rotating 10-inch propellers spinning at 7,500 RPM carry sufficient kinetic energy to cause deep lacerations and severe ocular injury. Keep 5 meters clear when armed.",
    ],
  },
  {
    id: "flight-controller",
    name: "Pixhawk 2.4.8 32-Bit Autopilot System",
    category: "Avionics",
    model: "Pixhawk 2.4.8 with 32-bit STM32F427 Cortex-M4 Core",
    manufacturer: "Holybro / Generic Pixhawk Ecosystem",
    massGrams: 38,
    quantity: 1,
    dimensions: "81 x 50 x 15 mm",
    voltageRange: "4.8V - 5.4V DC Input via Power Module",
    currentRating: "Power Consumption: ~250mA @ 5V",
    description: "Industry-standard open-hardware flight controller supporting ArduPilot Copter and PX4 firmware stacks. Features dual IMUs, barometric altimeter, and failsafe co-processor.",
    purpose: "Executes 400Hz PID attitude stabilization, navigates autonomous GPS waypoints, and manages multi-layer hardware failsafes.",
    workingPrinciple: "Fuses gyroscope and accelerometer readings through an Extended Kalman Filter (EKF) to compute attitude error and output corrective motor signals.",
    mountingLocation: "Top center plate, centered on aircraft Center of Gravity, with white orientation arrow pointing forward.",
    sourcing: {
      supplier: "Robu.in",
      productTitle: "Pixhawk 2.4.8 32-Bit Flight Controller with Shock Absorber",
      url: "https://robu.in/product/pixhawk-2-4-8-32-bit-flight-controller/",
      priceINR: 5499,
      verified: true,
      lastChecked: "2026-10-22",
      alternatives: [
        {
          supplier: "Robocraze",
          model: "Pixhawk PX4 2.4.8 Autopilot Set",
          url: "https://robocraze.com/products/pixhawk-px4-2-4-8-autopilot-flight-controller",
          priceINR: 5899,
        },
        {
          supplier: "ElectronicsComp",
          model: "APM 2.8 Flight Controller (Budget Alternative)",
          url: "https://www.electronicscomp.com/apm-2.8-flight-controller-board",
          priceINR: 2499,
        },
      ],
    },
    installationTips: [
      "Mount the Pixhawk on the included foam anti-vibration damping platform to isolate high-frequency motor vibrations.",
      "Verify the white arrow printed on top points directly forward toward the red arms.",
    ],
    safetyWarnings: [
      "Never bypass pre-arm checks. If the status LED is flashing yellow or red, resolve the sensor calibration or GPS lock issue rather than forcing an arm.",
    ],
  },
  {
    id: "gps-compass-module",
    name: "NEO-M8N High-Precision GPS & Digital Compass",
    category: "Avionics",
    model: "UBLOX NEO-M8N with QMC5883L I2C Magnetometer",
    manufacturer: "UBLOX Reference / Generic UAV",
    massGrams: 32, // includes folding mast
    quantity: 1,
    dimensions: "53 mm diameter disc antenna, 140 mm folding mast",
    voltageRange: "3.3V - 5V DC via I2C & UART Port",
    description: "High-sensitivity multi-constellation GNSS module tracking GPS, GLONASS, and BeiDou satellites with an integrated external digital compass.",
    purpose: "Provides centimeter-level autonomous position hold, Return-to-Launch (RTL), and heading reference unaffected by onboard battery magnetic fields.",
    workingPrinciple: "Calculates 3D position vectors via satellite time-of-flight trilateration and measures Earth's geomagnetic flux lines.",
    mountingLocation: "Mounted on an elevated 140mm carbon mast at the rear of the top plate to avoid high-current PDB magnetic fields.",
    sourcing: {
      supplier: "Robu.in",
      productTitle: "Ublox NEO-M8N GPS Module with Compass and Stand",
      url: "https://robu.in/product/ublox-neo-m8n-gps-module-with-compass-for-pixhawk/",
      priceINR: 2199,
      verified: true,
      lastChecked: "2026-10-22",
      alternatives: [
        {
          supplier: "Robocraze",
          model: "NEO-M8N High Precision GPS with Folding Antenna Mount",
          url: "https://robocraze.com/products/neo-m8n-gps-module",
          priceINR: 2399,
        },
      ],
    },
    installationTips: [
      "Keep the GPS module elevated at least 10 cm above the battery and PDB traces to prevent compass magnetic interference (mag field > 30% causes toilet-bowling).",
      "Confirm the arrow on the GPS puck matches the flight controller forward axis.",
    ],
    safetyWarnings: [
      "Do not attempt GPS-assisted flight modes (Loiter, Auto, RTL) without obtaining a 3D satellite lock with HDOP < 1.5.",
    ],
  },
  {
    id: "lipo-battery",
    name: "3S 11.1V 2200mAh 25C LiPo Battery Pack",
    category: "Power",
    model: "Orange 3S 2200mAh 25C Lithium Polymer Battery with XT60",
    manufacturer: "Orange / Bonka UAV Reference",
    massGrams: 185,
    quantity: 1,
    dimensions: "105 x 34 x 24 mm",
    voltageRange: "Nominal: 11.1V (Full: 12.6V, Cutoff: 10.5V)",
    currentRating: "Continuous: 55A (2.2Ah x 25C), Burst: 110A (50C)",
    description: "High-discharge lithium cobalt oxide secondary cells configured in series (3S1P) with heavy 12AWG silicone leads and JST-XH balance lead.",
    purpose: "Primary electrochemical energy storage providing high-burst current to propulsion motors and avionics.",
    workingPrinciple: "Intercalated lithium ions move between cathode (LiCoO2) and anode (graphite) through polymer electrolyte during discharge.",
    mountingLocation: "Mounted longitudinally under the center bottom plate secured by high-grip rubberized Velcro strap.",
    sourcing: {
      supplier: "Robu.in",
      productTitle: "Orange 3S 2200mAh 25C Lithium Polymer LiPo Battery with XT60",
      url: "https://robu.in/product/orange-2200mah-3s-25c-lipo-battery-pack/",
      priceINR: 1449,
      verified: true,
      lastChecked: "2026-10-22",
      alternatives: [
        {
          supplier: "ElectronicsComp",
          model: "Bonka 3S 2200mAh 35C LiPo Battery",
          url: "https://www.electronicscomp.com/bonka-3s-2200mah-35c-lipo-battery",
          priceINR: 1699,
        },
        {
          supplier: "Robocraze",
          model: "Orange 3S 4200mAh 35C LiPo (Extended Flight Time)",
          url: "https://robocraze.com/products/orange-3s-4200mah-lipo-battery",
          priceINR: 2899,
        },
      ],
    },
    installationTips: [
      "Slide battery forward or backward until the drone achieves a neutral Center of Gravity directly under the geometric center.",
      "Set telemetry low-voltage warning threshold to 10.8V (3.6V per cell) to ensure safe landing reserve.",
    ],
    safetyWarnings: [
      "CRITICAL FIRE RISK: LiPo batteries can combust if punctured, overcharged (>4.2V/cell), or deeply discharged (<3.0V/cell). Always charge inside a fireproof LiPo guard bag under constant supervision.",
    ],
  },
  {
    id: "power-module",
    name: "Pixhawk 30V/90A Hall-Effect Power Module",
    category: "Power",
    model: "Pixhawk XT60 PM02 Power Module with 5.3V 3A BEC",
    manufacturer: "Holybro / Generic Pixhawk",
    massGrams: 28,
    quantity: 1,
    dimensions: "30 x 20 x 10 mm",
    voltageRange: "Input: 2S - 6S LiPo (Max 30V)",
    currentRating: "Max Continuous: 90A, BEC Output: 5.3V @ 3A",
    description: "In-line voltage and current sensor with integrated switching step-down regulator delivering clean, filtered 5.3V power to the flight controller.",
    purpose: "Monitors real-time battery voltage and current consumption, triggering automated Return-to-Launch when battery reaches critical capacity.",
    workingPrinciple: "Resistive voltage divider and precision shunt resistor / Hall-effect sensor outputs analog signals to flight controller ADC pins.",
    mountingLocation: "Between battery XT60 connector and bottom PDB power input pads.",
    sourcing: {
      supplier: "Robu.in",
      productTitle: "Pixhawk Power Module with XT60 Connectors",
      url: "https://robu.in/product/pixhawk-power-module-xt60-connectors/",
      priceINR: 649,
      verified: true,
      lastChecked: "2026-10-20",
      alternatives: [
        {
          supplier: "ElectronicsComp",
          model: "APM/Pixhawk XT60 Power Module",
          url: "https://www.electronicscomp.com/apm-power-module-v1.0-output-bec-3a-xt60",
          priceINR: 599,
        },
      ],
    },
    installationTips: [
      "Calibrate battery voltage in Mission Planner / QGroundControl against a trusted digital multimeter.",
    ],
    safetyWarnings: [
      "Never draw auxiliary servo or high-current LED power from the flight controller 5V rail. Power servos from a separate independent BEC.",
    ],
  },
  {
    id: "rc-receiver",
    name: "FlySky FS-iA6B 2.4GHz 6-Channel Telemetry Receiver",
    category: "Avionics",
    model: "FS-iA6B AFHDS 2A with PPM/i-Bus Output & Diversity Antennas",
    manufacturer: "FlySky",
    massGrams: 16,
    quantity: 1,
    dimensions: "47 x 26 x 15 mm",
    voltageRange: "4.0V - 8.4V DC",
    description: "Automatic Frequency Hopping Digital System (AFHDS 2A) receiver with dual 150mm diversity antennas and single-wire PPM/i-Bus serial output.",
    purpose: "Receives real-time pilot stick inputs from transmitter and transmits back telemetry signal strength (RSSI).",
    workingPrinciple: "2.4GHz spread spectrum frequency hopping eliminates multi-path RF interference.",
    mountingLocation: "Mounted on the rear lower plate with antennas oriented at 90 degrees to each other.",
    sourcing: {
      supplier: "Robu.in",
      productTitle: "Flysky FS-iA6B 6ch Receiver with PPM Output i-Bus Port",
      url: "https://robu.in/product/flysky-fs-ia6b-6ch-receiver-ppm-output-i-bus-port/",
      priceINR: 1199,
      verified: true,
      lastChecked: "2026-10-20",
      alternatives: [
        {
          supplier: "Robocraze",
          model: "FlySky FS-i6 Transmitter with FS-iA6B Receiver Combo",
          url: "https://robocraze.com/products/flysky-fs-i6-transmitter-and-receiver",
          priceINR: 4299,
        },
      ],
    },
    installationTips: [
      "Connect via single PPM / i-Bus cable to RC IN port on Pixhawk rather than using multiple PWM cables.",
      "Orient the two antenna whisker tubes at 90 degrees to each other to maintain optimal RF signal polarization at all bank angles.",
    ],
    safetyWarnings: [
      "CRITICAL: Always test Radio Failsafe before flight. Turn off transmitter on the bench (propellers REMOVED) to confirm flight controller engages Failsafe Return-to-Launch.",
    ],
  },
  {
    id: "landing-gear",
    name: "High-Clearance Arched Landing Gear Set",
    category: "Structure",
    model: "F450 High-Clearance Tall Landing Skids (Set of 4)",
    manufacturer: "Generic UAV",
    massGrams: 64, // 16g x 4
    quantity: 4,
    dimensions: "Height: 145 mm ground clearance",
    description: "Curved flexible composite polymer landing legs that absorb touchdown kinetic impact and protect underslung payloads.",
    purpose: "Elevates the drone chassis 145 mm off the ground, preventing the underslung camera and battery from striking ground debris.",
    workingPrinciple: "Flexural damping absorbs vertical impact energy during touchdown.",
    mountingLocation: "Bolted directly to the underside of each arm mount point.",
    sourcing: {
      supplier: "Robu.in",
      productTitle: "F450 Tall Landing Gear Legs (Pack of 4)",
      url: "https://robu.in/product/f450-landing-gear-legs-black/",
      priceINR: 349,
      verified: true,
      lastChecked: "2026-10-18",
      alternatives: [
        {
          supplier: "ElectronicsComp",
          model: "Universal Drone Landing Gear (4 Pcs)",
          url: "https://www.electronicscomp.com/universal-tall-landing-gear-for-f450",
          priceINR: 320,
        },
      ],
    },
    installationTips: [
      "Install soft silicone feet or foam dampeners on skid tips to prevent ground slide on smooth concrete surfaces.",
    ],
    safetyWarnings: ["Check that legs do not enter the camera field of view in wide-angle mode."],
  },
  {
    id: "camera-payload",
    name: "RunCam Split HD Lightweight Aerial Inspection Camera",
    category: "Payload",
    model: "RunCam Split 4 Micro 1080p 60fps WDR Camera",
    manufacturer: "RunCam Reference",
    massGrams: 42, // includes mount & wiring
    quantity: 1,
    dimensions: "Camera: 19 x 19 mm, PCB: 36 x 36 mm",
    voltageRange: "5V - 20V DC",
    description: "Compact dual-function camera recording 1080p 60fps HD video to micro-SD while simultaneously streaming low-latency analog FPV video.",
    purpose: "Captures field observation footage, roof/structural inspection imagery, and environmental data.",
    workingPrinciple: "CMOS image sensor with Wide Dynamic Range (WDR) coupled to a low-distortion glass lens.",
    mountingLocation: "Front lower chassis mount with vibration-isolated rubber dampers.",
    sourcing: {
      supplier: "Robu.in",
      productTitle: "RunCam Split 4 Micro HD Camera Module",
      url: "https://robu.in/product/runcam-split-4-hd-fpv-camera/",
      priceINR: 4299,
      verified: true,
      lastChecked: "2026-10-22",
      alternatives: [
        {
          supplier: "Robocraze",
          model: "FPV 1200TVL Analog Mini Camera (Budget Alternative)",
          url: "https://robocraze.com/products/1200tvl-micro-fpv-camera",
          priceINR: 899,
        },
      ],
    },
    installationTips: [
      "Use 4 silicone vibration damping balls (bobbins) between the camera bracket and the chassis to eliminate rolling shutter jello.",
    ],
    safetyWarnings: [
      "Ensure camera wiring does not interfere with battery insertion or snag on landing gear during rough touchdowns.",
    ],
  },
];

/**
 * Deterministic Engineering Calculation Engine for AERO-450
 * Evaluates AUW, Thrust, Power, Battery Discharge, Flight Time, CG, and Diagnostics
 */
export function calculateAeroEngineering(
  config: CustomizationSettings
): AeroCalculationResults {
  // 1. Calculate All-Up Weight (AUW) from active components
  let totalMassGrams = 0;

  // Base structural mass
  totalMassGrams += 165; // Center plates + PDB
  totalMassGrams += 104; // Front arms
  totalMassGrams += 104; // Rear arms
  totalMassGrams += 64; // Landing gear
  totalMassGrams += 38; // Flight controller
  totalMassGrams += 28; // Power module + wiring
  totalMassGrams += 16; // Receiver

  // Motor selection mass
  let motorMassEach = 52;
  let maxThrustPerMotorGrams = 850; // for 2212-920kv with 1045 prop on 3S
  let motorContinuousAmps = 15;
  if (config.droneMotorModel === "2212-1000kv") {
    motorMassEach = 54;
    maxThrustPerMotorGrams = 920;
    motorContinuousAmps = 17;
  } else if (config.droneMotorModel === "2216-880kv") {
    motorMassEach = 68;
    maxThrustPerMotorGrams = 1050;
    motorContinuousAmps = 20;
  } else if (config.droneMotorModel === "2212-1400kv") {
    motorMassEach = 50;
    maxThrustPerMotorGrams = 880; // on smaller props
    motorContinuousAmps = 22;
  }
  totalMassGrams += motorMassEach * 4;

  // ESC selection mass & rating
  let escMassEach = 32;
  let escContinuousAmps = 30;
  if (config.droneEsc === "blheli-30a-opto") {
    escMassEach = 26;
    escContinuousAmps = 30;
  } else if (config.droneEsc === "40a-dshot600") {
    escMassEach = 36;
    escContinuousAmps = 40;
  }
  totalMassGrams += escMassEach * 4;

  // Propeller selection mass & thrust factor
  let propMassEach = 9;
  let propThrustMultiplier = 1.0;
  if (config.dronePropeller === "1045-carbon") {
    propMassEach = 8.5;
    propThrustMultiplier = 1.05; // stiffer carbon blade
  } else if (config.dronePropeller === "9045-nylon") {
    propMassEach = 7.5;
    propThrustMultiplier = 0.88;
  } else if (config.dronePropeller === "8045-nylon") {
    propMassEach = 6.5;
    propThrustMultiplier = 0.74;
  }
  totalMassGrams += propMassEach * 4;

  // Battery selection mass & capacity
  let batteryMass = 185;
  let batteryNominalVoltage = 11.1; // 3S
  let batteryCapacityAh = 2.2;
  let batteryCRating = 25;
  if (config.droneBattery === "3s-4200mah-35c") {
    batteryMass = 320;
    batteryNominalVoltage = 11.1;
    batteryCapacityAh = 4.2;
    batteryCRating = 35;
  } else if (config.droneBattery === "4s-3300mah-45c") {
    batteryMass = 340;
    batteryNominalVoltage = 14.8;
    batteryCapacityAh = 3.3;
    batteryCRating = 45;
  } else if (config.droneBattery === "3s-5200mah-25c") {
    batteryMass = 390;
    batteryNominalVoltage = 11.1;
    batteryCapacityAh = 5.2;
    batteryCRating = 25;
  }
  totalMassGrams += batteryMass;

  // GPS module
  if (config.droneGps !== "none") {
    totalMassGrams += 32;
  }

  // Camera payload
  let cameraMass = 0;
  if (config.droneCamera === "runcam-split-hd") {
    cameraMass = 42;
  } else if (config.droneCamera === "gopro-lite") {
    cameraMass = 75;
  } else if (config.droneCamera === "fpv-analog-1200tvl") {
    cameraMass = 18;
  }
  totalMassGrams += cameraMass;

  // Prop guards (optional)
  if (config.dronePropGuards) {
    totalMassGrams += 85;
  }

  const totalMassKg = totalMassGrams / 1000;

  // 2. Thrust calculations
  // Voltage boost factor if 4S (14.8V) is selected
  const voltageThrustFactor = batteryNominalVoltage === 14.8 ? 1.25 : 1.0;
  const singleMotorMaxThrust = Math.round(
    maxThrustPerMotorGrams * propThrustMultiplier * voltageThrustFactor
  );
  const maxThrustGrams = singleMotorMaxThrust * 4;
  const thrustToWeightRatio = Math.round((maxThrustGrams / totalMassGrams) * 100) / 100;

  // Hover throttle percentage (for symmetric quad, hover requires total thrust = AUW)
  const hoverThrottlePct = Math.round((totalMassGrams / maxThrustGrams) * 100);

  // 3. Power and current draw calculations
  // Average benchmark for 450-class quadcopter is ~130 W per kg of aircraft weight at steady hover
  const hoverPowerWatts = Math.round(totalMassKg * 135);
  const hoverCurrentAmps = Math.round((hoverPowerWatts / batteryNominalVoltage) * 10) / 10;

  // 4. Battery capacity & discharge capability
  const batteryEnergyWh = Math.round(batteryNominalVoltage * batteryCapacityAh * 10) / 10;
  const batteryMaxDischargeAmps = Math.round(batteryCapacityAh * batteryCRating);

  // 5. Estimated flight time calculation
  // Assume 80% usable capacity to protect LiPo cells from deep discharge (< 20% residual)
  const usableEnergyWh = batteryEnergyWh * 0.8;
  const estimatedFlightTimeHours = usableEnergyWh / hoverPowerWatts;
  const estimatedFlightTimeMin = Math.round(estimatedFlightTimeHours * 60 * 10) / 10;
  const flightTimeRangeMin: [number, number] = [
    Math.round(estimatedFlightTimeMin * 0.85 * 10) / 10,
    Math.round(estimatedFlightTimeMin * 1.15 * 10) / 10,
  ];

  // 6. Maximum Takeoff Weight (MTOW) & Payload Analysis
  const maxTakeoffWeightGrams = 1600; // F450 frame structural limit with 2212 motors
  const availablePayloadGrams = Math.max(0, maxTakeoffWeightGrams - totalMassGrams);

  // 7. Center of Gravity (CG)
  // Camera is in front (+X or -Z), battery is slightly rearward to balance
  const cameraForeOffset = cameraMass > 0 ? -45 : 0; // mm forward
  const batteryAftOffset = 25; // mm aft
  const cgZ = Math.round(((cameraMass * cameraForeOffset + batteryMass * batteryAftOffset) / totalMassGrams) * 10) / 10;
  const centerOfGravityOffsetMm = { x: 0, y: -12, z: cgZ };

  // 8. Deterministic Engineering Diagnostics
  const diagnostics: AeroCalculationResults["diagnostics"] = [];

  // Check 1: Thrust-to-Weight Ratio
  if (thrustToWeightRatio >= 2.0) {
    diagnostics.push({
      id: "diag-twr",
      title: "Thrust-to-Weight Margin",
      status: "PASS",
      formula: "TWR = Total_Thrust / All_Up_Weight >= 2.0",
      details: `Calculated TWR is ${thrustToWeightRatio}:1. Excellent dynamic reserve for wind rejection and rapid altitude recovery.`,
    });
  } else if (thrustToWeightRatio >= 1.6) {
    diagnostics.push({
      id: "diag-twr",
      title: "Thrust-to-Weight Margin",
      status: "WARNING",
      formula: "1.6 <= TWR < 2.0",
      details: `Calculated TWR is ${thrustToWeightRatio}:1. Aircraft will hover stably but possesses sluggish climb rate under windy conditions.`,
    });
  } else {
    diagnostics.push({
      id: "diag-twr",
      title: "Thrust-to-Weight Margin",
      status: "FAIL",
      formula: "TWR < 1.6",
      details: `Calculated TWR is ${thrustToWeightRatio}:1. Unsafe! Hover requires >62% throttle. Motor thermal runaway risk.`,
    });
  }

  // Check 2: ESC Current Margin vs Motor Peak Draw
  if (escContinuousAmps >= motorContinuousAmps * 1.35) {
    diagnostics.push({
      id: "diag-esc",
      title: "ESC Current Headroom",
      status: "PASS",
      formula: "I_esc_cont >= 1.35 * I_motor_peak",
      details: `30A-40A ESC continuous rating provides >40% current safety headroom above motor 15A-17A continuous demand.`,
    });
  } else {
    diagnostics.push({
      id: "diag-esc",
      title: "ESC Current Headroom",
      status: "WARNING",
      formula: "I_esc_cont < 1.35 * I_motor_peak",
      details: `ESC current rating is tight relative to motor load. Monitor ESC temperatures during summer operations.`,
    });
  }

  // Check 3: Battery Continuous Discharge vs 4-Motor Burst Demand
  const totalMaxMotorAmps = motorContinuousAmps * 4;
  if (batteryMaxDischargeAmps >= totalMaxMotorAmps * 1.1) {
    diagnostics.push({
      id: "diag-battery-discharge",
      title: "Battery Discharge Capability",
      status: "PASS",
      formula: "I_battery_max = Capacity(Ah) * C_rating >= 4 * I_motor_max",
      details: `Battery can supply ${batteryMaxDischargeAmps}A continuous. Peak quadcopter demand is ${totalMaxMotorAmps}A. No severe voltage sag expected.`,
    });
  } else {
    diagnostics.push({
      id: "diag-battery-discharge",
      title: "Battery Discharge Capability",
      status: "WARNING",
      formula: "I_battery_max < 4 * I_motor_max",
      details: `Battery C-rating is marginal (${batteryMaxDischargeAmps}A max vs ${totalMaxMotorAmps}A peak). Full-throttle punchouts may trigger low-voltage alarms.`,
    });
  }

  // Check 4: Motor KV vs Propeller Diameter Clearance
  if (config.dronePropeller.startsWith("1045") && config.droneMotorModel === "2212-1400kv") {
    diagnostics.push({
      id: "diag-prop-kv",
      title: "Motor KV vs Propeller Load",
      status: "FAIL",
      formula: "KV * Prop_Diameter product exceeded",
      details: "1400KV is too fast for 10-inch propellers on 3S/4S. Motor will overheat and trigger ESC overcurrent shutdown! Use 8045 props or 920KV motors.",
    });
  } else {
    diagnostics.push({
      id: "diag-prop-kv",
      title: "Motor KV & Propeller Match",
      status: "PASS",
      formula: "Propeller aerodynamic torque matched to motor torque constant (Kt)",
      details: `${config.droneMotorModel} paired with ${config.dronePropeller} operates within standard manufacturer test envelope.`,
    });
  }

  // Check 5: Center of Gravity Balance
  if (Math.abs(cgZ) <= 12) {
    diagnostics.push({
      id: "diag-cg",
      title: "Center of Gravity (CG) Symmetry",
      status: "PASS",
      formula: "|CG_offset_z| <= 12 mm",
      details: `CG longitudinal offset is only ${cgZ} mm. Front and rear motor pairs will experience equal hover workloads.`,
    });
  } else {
    diagnostics.push({
      id: "diag-cg",
      title: "Center of Gravity (CG) Symmetry",
      status: "WARNING",
      formula: "|CG_offset_z| > 12 mm",
      details: `CG longitudinal offset is ${cgZ} mm. Shift battery pack to restore balance and prevent asymmetric motor heating.`,
    });
  }

  return {
    totalMassGrams,
    totalMassKg,
    maxThrustGrams,
    thrustToWeightRatio,
    hoverThrottlePct,
    hoverPowerWatts,
    hoverCurrentAmps,
    batteryNominalVoltage,
    batteryCapacityAh,
    batteryEnergyWh,
    batteryMaxDischargeAmps,
    estimatedFlightTimeMin,
    flightTimeRangeMin,
    centerOfGravityOffsetMm,
    maxTakeoffWeightGrams,
    availablePayloadGrams,
    diagnostics,
  };
}

export const AERO_BOM_PRESETS: Record<"budget" | "balanced" | "performance", BOMItem[]> = {
  budget: [
    {
      id: "f450-frame-kit",
      name: "F450 Quadcopter Frame with Integrated PDB",
      category: "Structure",
      defaultQty: 1,
      qty: 1,
      estimatedPriceINR: 999,
      actualPriceINR: 999,
      sourceType: "Electronics Shop",
      collected: false,
      notes: "Includes top/bottom plates and 4 nylon arms with hardware.",
    },
    {
      id: "a2212-1000kv-motors",
      name: "A2212 1000KV Brushless Motors (Pack of 4)",
      category: "Propulsion",
      defaultQty: 4,
      qty: 4,
      estimatedPriceINR: 2199,
      actualPriceINR: 2199,
      sourceType: "Electronics Shop",
      collected: false,
      notes: "Economical outrunner motors with prop adapters.",
    },
    {
      id: "simonk-30a-escs",
      name: "SimonK 30A ESC with 5V BEC (Pack of 4)",
      category: "Propulsion",
      defaultQty: 4,
      qty: 4,
      estimatedPriceINR: 1699,
      actualPriceINR: 1699,
      sourceType: "Electronics Shop",
      collected: false,
      notes: "Pre-flashed SimonK firmware with standard PWM inputs.",
    },
    {
      id: "1045-nylon-props",
      name: "1045 Nylon Propeller Set (2CW + 2CCW)",
      category: "Propulsion",
      defaultQty: 2,
      qty: 2,
      estimatedPriceINR: 249,
      actualPriceINR: 249,
      sourceType: "Electronics Shop",
      collected: false,
      notes: "Two matched pairs of nylon props.",
    },
    {
      id: "apm-2-8-fc",
      name: "APM 2.8 Flight Controller with Damping Board",
      category: "Avionics",
      defaultQty: 1,
      qty: 1,
      estimatedPriceINR: 2499,
      actualPriceINR: 2499,
      sourceType: "Electronics Shop",
      collected: false,
      notes: "Reliable 8-bit flight controller for basic stabilization.",
    },
    {
      id: "orange-3s-2200mah-lipo",
      name: "Orange 3S 11.1V 2200mAh 25C LiPo Battery",
      category: "Power",
      defaultQty: 1,
      qty: 1,
      estimatedPriceINR: 1449,
      actualPriceINR: 1449,
      sourceType: "Electronics Shop",
      collected: false,
      notes: "Standard lightweight 3S flight battery.",
    },
    {
      id: "flysky-ia6-receiver",
      name: "FlySky FS-iA6 6CH Receiver",
      category: "Avionics",
      defaultQty: 1,
      qty: 1,
      estimatedPriceINR: 899,
      actualPriceINR: 899,
      sourceType: "Electronics Shop",
      collected: false,
      notes: "Standard 2.4GHz receiver.",
    },
    {
      id: "f450-landing-gear",
      name: "F450 Tall Landing Skids (Set of 4)",
      category: "Structure",
      defaultQty: 1,
      qty: 1,
      estimatedPriceINR: 349,
      actualPriceINR: 349,
      sourceType: "Hardware Store",
      collected: false,
      notes: "Ground clearance skids.",
    },
  ],
  balanced: [
    {
      id: "f450-frame-kit",
      name: "F450 Quadcopter Frame with Integrated PDB",
      category: "Structure",
      defaultQty: 1,
      qty: 1,
      estimatedPriceINR: 999,
      actualPriceINR: 999,
      sourceType: "Electronics Shop",
      collected: false,
      notes: "Glass-fiber plates with 2oz copper integrated PDB.",
    },
    {
      id: "a2212-920kv-motors",
      name: "ReadyToSky A2212 920KV CW/CCW Motor Set (4 Pcs)",
      category: "Propulsion",
      defaultQty: 4,
      qty: 4,
      estimatedPriceINR: 2399,
      actualPriceINR: 2399,
      sourceType: "Electronics Shop",
      collected: false,
      notes: "Self-tightening CW/CCW hubs eliminate thrown prop nuts.",
    },
    {
      id: "simonk-30a-escs",
      name: "SimonK 30A ESC with 5V BEC (Pack of 4)",
      category: "Propulsion",
      defaultQty: 4,
      qty: 4,
      estimatedPriceINR: 1799,
      actualPriceINR: 1799,
      sourceType: "Electronics Shop",
      collected: false,
      notes: "Heavy-duty 30A continuous rating with linear BEC.",
    },
    {
      id: "1045-props-pair",
      name: "1045 Propeller Set (2CW + 2CCW)",
      category: "Propulsion",
      defaultQty: 2,
      qty: 2,
      estimatedPriceINR: 249,
      actualPriceINR: 249,
      sourceType: "Electronics Shop",
      collected: false,
      notes: "High-efficiency 10-inch props.",
    },
    {
      id: "pixhawk-fc",
      name: "Pixhawk 2.4.8 32-Bit Autopilot + Damping Mount",
      category: "Avionics",
      defaultQty: 1,
      qty: 1,
      estimatedPriceINR: 5499,
      actualPriceINR: 5499,
      sourceType: "Electronics Shop",
      collected: false,
      notes: "Cortex-M4 32-bit processor supporting ArduPilot Copter.",
    },
    {
      id: "neo-m8n-gps",
      name: "UBLOX NEO-M8N GPS + Compass with Folding Mast",
      category: "Avionics",
      defaultQty: 1,
      qty: 1,
      estimatedPriceINR: 2199,
      actualPriceINR: 2199,
      sourceType: "Electronics Shop",
      collected: false,
      notes: "Enables autonomous Return-to-Launch and Loiter position hold.",
    },
    {
      id: "pixhawk-power-module",
      name: "Pixhawk XT60 Power Module with 5.3V BEC",
      category: "Power",
      defaultQty: 1,
      qty: 1,
      estimatedPriceINR: 649,
      actualPriceINR: 649,
      sourceType: "Electronics Shop",
      collected: false,
      notes: "Real-time battery voltage and current telemetry monitoring.",
    },
    {
      id: "orange-3s-2200mah-lipo",
      name: "Orange 3S 11.1V 2200mAh 25C LiPo Battery",
      category: "Power",
      defaultQty: 1,
      qty: 1,
      estimatedPriceINR: 1449,
      actualPriceINR: 1449,
      sourceType: "Electronics Shop",
      collected: false,
      notes: "High-discharge 3S LiPo pack.",
    },
    {
      id: "flysky-ia6b-receiver",
      name: "FlySky FS-iA6B 6CH Receiver with PPM/i-Bus",
      category: "Avionics",
      defaultQty: 1,
      qty: 1,
      estimatedPriceINR: 1199,
      actualPriceINR: 1199,
      sourceType: "Electronics Shop",
      collected: false,
      notes: "Dual diversity antennas with serial digital input.",
    },
    {
      id: "f450-landing-gear",
      name: "F450 Tall Landing Skids (Set of 4)",
      category: "Structure",
      defaultQty: 1,
      qty: 1,
      estimatedPriceINR: 349,
      actualPriceINR: 349,
      sourceType: "Hardware Store",
      collected: false,
      notes: "145 mm camera ground clearance.",
    },
    {
      id: "runcam-split-hd",
      name: "RunCam Split 4 Micro 1080p 60fps HD Camera",
      category: "Payload",
      defaultQty: 1,
      qty: 1,
      estimatedPriceINR: 4299,
      actualPriceINR: 4299,
      sourceType: "Electronics Shop",
      collected: false,
      notes: "Dual-mode HD aerial recording and real-time FPV stream.",
    },
  ],
  performance: [
    {
      id: "f450-frame-kit",
      name: "F450 Quadcopter Frame with Integrated PDB",
      category: "Structure",
      defaultQty: 1,
      qty: 1,
      estimatedPriceINR: 999,
      actualPriceINR: 999,
      sourceType: "Electronics Shop",
      collected: false,
      notes: "High-rigidity glass-fiber chassis plates.",
    },
    {
      id: "emax-2216-880kv-motors",
      name: "EMAX 2216 880KV High-Efficiency Motors (4 Pcs)",
      category: "Propulsion",
      defaultQty: 4,
      qty: 4,
      estimatedPriceINR: 4199,
      actualPriceINR: 4199,
      sourceType: "Electronics Shop",
      collected: false,
      notes: "High-efficiency motors delivering over 1050g thrust each on 4S.",
    },
    {
      id: "blheli-40a-escs",
      name: "BLHeli_32 40A DShot600 ESCs (Pack of 4)",
      category: "Propulsion",
      defaultQty: 4,
      qty: 4,
      estimatedPriceINR: 3499,
      actualPriceINR: 3499,
      sourceType: "Electronics Shop",
      collected: false,
      notes: "Ultra-fast digital protocol with active regenerative braking.",
    },
    {
      id: "1045-carbon-props",
      name: "Gemfan 1045 Carbon-Fiber Reinforced Propeller Set",
      category: "Propulsion",
      defaultQty: 2,
      qty: 2,
      estimatedPriceINR: 699,
      actualPriceINR: 699,
      sourceType: "Electronics Shop",
      collected: false,
      notes: "Zero-flex carbon composite for maximum aerodynamic response.",
    },
    {
      id: "pixhawk-fc",
      name: "Pixhawk 2.4.8 32-Bit Autopilot + Damping Mount",
      category: "Avionics",
      defaultQty: 1,
      qty: 1,
      estimatedPriceINR: 5499,
      actualPriceINR: 5499,
      sourceType: "Electronics Shop",
      collected: false,
      notes: "Advanced ArduPilot autonomous navigation platform.",
    },
    {
      id: "neo-m8n-gps",
      name: "UBLOX NEO-M8N Multi-Constellation GPS + Compass",
      category: "Avionics",
      defaultQty: 1,
      qty: 1,
      estimatedPriceINR: 2199,
      actualPriceINR: 2199,
      sourceType: "Electronics Shop",
      collected: false,
      notes: "Tracks GPS + GLONASS + BeiDou concurrently.",
    },
    {
      id: "bonka-4s-3300mah-lipo",
      name: "Bonka 4S 14.8V 3300mAh 45C LiPo Battery",
      category: "Power",
      defaultQty: 1,
      qty: 1,
      estimatedPriceINR: 3299,
      actualPriceINR: 3299,
      sourceType: "Electronics Shop",
      collected: false,
      notes: "4S high-voltage system delivering 25% higher climb rate and 18-minute endurance.",
    },
    {
      id: "pixhawk-power-module",
      name: "Pixhawk XT60 Power Module with 5.3V BEC",
      category: "Power",
      defaultQty: 1,
      qty: 1,
      estimatedPriceINR: 649,
      actualPriceINR: 649,
      sourceType: "Electronics Shop",
      collected: false,
      notes: "Voltage/current Hall sensor.",
    },
    {
      id: "flysky-ia6b-receiver",
      name: "FlySky FS-iA6B 6CH Receiver with PPM/i-Bus",
      category: "Avionics",
      defaultQty: 1,
      qty: 1,
      estimatedPriceINR: 1199,
      actualPriceINR: 1199,
      sourceType: "Electronics Shop",
      collected: false,
      notes: "Dual diversity antennas.",
    },
    {
      id: "f450-landing-gear",
      name: "F450 Tall Landing Skids (Set of 4)",
      category: "Structure",
      defaultQty: 1,
      qty: 1,
      estimatedPriceINR: 349,
      actualPriceINR: 349,
      sourceType: "Hardware Store",
      collected: false,
      notes: "Flexible composite skids.",
    },
    {
      id: "runcam-split-hd",
      name: "RunCam Split 4 Micro 1080p 60fps HD Camera",
      category: "Payload",
      defaultQty: 1,
      qty: 1,
      estimatedPriceINR: 4299,
      actualPriceINR: 4299,
      sourceType: "Electronics Shop",
      collected: false,
      notes: "Full HD aerial video acquisition.",
    },
  ],
};

export const AERO_BUILD_STEPS = [
  {
    step: 1,
    title: "Unboxing, Inspection & Fastener Sizing",
    category: "Preparation",
    estimatedMinutes: 20,
    toolsRequired: ["Digital Caliper or Ruler", "Parts Tray", "Safety Glasses"],
    description: "Verify all components against the bill of materials. Inspect the F450 frame plates for manufacturing burrs and check all screw lengths.",
    warning: "CRITICAL: Measure motor mounting M3 screws. They must NOT exceed 6mm length, or they will pierce the motor stator copper windings when tightened.",
    instructions: [
      "Count 4 arms (2 Red for front, 2 White for rear), 2 center plates, and landing skids.",
      "Inspect copper solder pads on the bottom PDB plate for any manufacturing scratches or oxidation.",
      "Organize M2.5 frame screws and M3 motor screws in separate labeled compartments.",
    ],
  },
  {
    step: 2,
    title: "Soldering the Integrated Power Distribution Board (PDB)",
    category: "Electrical",
    estimatedMinutes: 35,
    toolsRequired: ["60W+ Soldering Iron", "Lead-Free Solder (63/37)", "Rosin Flux", "Digital Multimeter"],
    description: "Solder the 4 ESC positive/negative power leads and the main battery XT60 pigtail directly to the bottom frame plate.",
    warning: "Cold solder joints can vibrate loose mid-flight. Solder must flow cleanly over the entire copper pad creating a shiny concave fillet.",
    instructions: [
      "Strip 5mm of silicone insulation from the ESC power wires and pre-tin both the wire tips and the PDB pads with solder.",
      "Solder Red wires to (+) positive pads and Black wires to (-) ground pads around all 4 arm locations.",
      "Solder the main battery 14AWG pigtail with female XT60 connector to the central battery pads.",
      "Use your digital multimeter on continuity setting to verify 100% absence of any short-circuit between (+) and (-) terminals.",
    ],
  },
  {
    step: 3,
    title: "Arm Attachment to Bottom Center Plate",
    category: "Assembly",
    estimatedMinutes: 25,
    toolsRequired: ["2.0mm Hex Screwdriver", "Blue Threadlocker (Loctite 242)"],
    description: "Secure the 4 nylon arms to the bottom plate using M2.5 socket head cap screws.",
    warning: "Do not overtighten or strip the brass threaded inserts embedded within the nylon arms.",
    instructions: [
      "Place the two RED arms in the FRONT positions (Arms 1 and 2 in standard X-quad layout).",
      "Place the two WHITE arms in the REAR positions (Arms 3 and 4).",
      "Apply a tiny drop of blue threadlocker to each M2.5 screw before threading into the arm brass inserts.",
      "Tighten screws in an alternating diagonal pattern to ensure flat, stress-free seating against the carbon/PCB plate.",
    ],
  },
  {
    step: 4,
    title: "Brushless Motor Installation & Screw Length Verification",
    category: "Mechanical",
    estimatedMinutes: 30,
    toolsRequired: ["2.0mm Hex Key", "M3x6mm Screws", "Blue Threadlocker"],
    description: "Mount the four 2212 brushless DC outrunner motors to the arm outer mounting plates.",
    warning: "SCREW LENGTH CHECK: Look through the motor cooling vents with a flashlight. Verify the screw tip stops at least 1.5mm short of the copper coil windings.",
    instructions: [
      "Identify CW and CCW motors. In ArduPilot X-quad layout: Motor 1 (Front Right: CCW), Motor 2 (Front Left: CW), Motor 3 (Rear Left: CCW), Motor 4 (Rear Right: CW).",
      "Route the 3 motor bullet connector wires inward along the top spine of each arm.",
      "Secure each motor using four M3x6mm screws with blue threadlocker.",
      "Spin each motor bell by hand to verify smooth, silent bearing rotation with zero rubbing.",
    ],
  },
  {
    step: 5,
    title: "ESC Arm Mounting & Motor Wire Connection",
    category: "Electrical",
    estimatedMinutes: 25,
    toolsRequired: ["Heat-resistant Zip Ties", "Heat Shrink Tubing", "Lighter or Heat Gun"],
    description: "Connect the 3-phase bullet connectors between each ESC and its corresponding motor, then secure the ESCs to the underside of each arm.",
    warning: "Do not secure ESCs with excessive zip tie pressure that could crush the electrolytic capacitors.",
    instructions: [
      "Connect the 3 bullet connectors from the ESC to the 3 motor leads. The exact wire sequence does not matter initially—swapping any two wires reverses rotation.",
      "Mount each ESC on the underside of its arm, positioned directly beneath the propeller downwash for continuous forced-air cooling.",
      "Secure firmly with two nylon zip ties per arm.",
      "Route the thin 3-pin servo signal lead toward the central flight controller bay.",
    ],
  },
  {
    step: 6,
    title: "Top Center Plate Installation & Cable Management",
    category: "Assembly",
    estimatedMinutes: 20,
    toolsRequired: ["2.0mm Hex Key", "Zip Ties"],
    description: "Route all ESC signal wires through the central routing cutouts, then bolt on the top center plate.",
    warning: "Ensure no power or signal wires are pinched between the arms and the top plate.",
    instructions: [
      "Bundle the four ESC signal leads into the central compartment.",
      "Place the top fiberglass plate over the arms.",
      "Fasten the top M2.5 screws into the arm upper brass inserts using blue threadlocker.",
      "Check that the frame structure is completely rigid with zero flex or torsional play.",
    ],
  },
  {
    step: 7,
    title: "Flight Controller Mounting & Vibration Isolation",
    category: "Avionics",
    estimatedMinutes: 30,
    toolsRequired: ["Anti-Vibration Foam Mount", "Precision Tweezers", "Alcohol Wipes"],
    description: "Mount the Pixhawk / APM flight controller on the geometric center of gravity using an anti-vibration damping platform.",
    warning: "Vibration isolation is vital! Excessive high-frequency motor vibrations transmitted to the IMU will cause altitude loss or uncontrolled runaway in autonomous modes.",
    instructions: [
      "Clean both mounting surfaces with an alcohol wipe to remove mold release oils.",
      "Adhere the anti-vibration damping platform to the top plate directly over the quadcopter Center of Gravity.",
      "Mount the Pixhawk onto the upper platform plate with the WHITE FORWARD ARROW pointing directly between the two RED front arms.",
      "Verify the flight controller is perfectly level with respect to the frame arms.",
    ],
  },
  {
    step: 8,
    title: "GPS Mast & External Compass Installation",
    category: "Avionics",
    estimatedMinutes: 20,
    toolsRequired: ["M2.5 Hex Screwdriver", "Threadlocker"],
    description: "Install the folding carbon GPS mast on the rear section of the top plate to elevate the magnetic compass away from PDB interference.",
    warning: "Never mount the GPS/Compass directly against the frame plate. High-current battery flows produce strong magnetic fields that will blind the internal compass.",
    instructions: [
      "Bolt the folding mast bracket to the rear section of the top plate.",
      "Mount the GPS puck on top of the mast at least 12-14 cm above the frame.",
      "Verify the arrow on the GPS module points exactly parallel to the flight controller forward axis.",
      "Connect the 6-pin GPS cable to the 'GPS' port and the 4-pin I2C cable to the 'I2C' port on the Pixhawk.",
    ],
  },
  {
    step: 9,
    title: "Signal Wiring & RC Receiver Connection",
    category: "Avionics",
    estimatedMinutes: 30,
    toolsRequired: ["Servo Lead Tweezers", "Antenna Mount Tubes"],
    description: "Connect ESC signal leads in exact motor order to the Pixhawk servo output rail, and wire the RC receiver.",
    warning: "MOTOR ORDER CRITICAL: ArduPilot X-quad order is Motor 1: Front-Right, Motor 2: Front-Left, Motor 3: Rear-Left, Motor 4: Rear-Right. Miswiring motor outputs will cause the drone to violently flip upon attempted takeoff.",
    instructions: [
      "Plug ESC 1 signal into MAIN OUT 1, ESC 2 into MAIN OUT 2, ESC 3 into MAIN OUT 3, and ESC 4 into MAIN OUT 4.",
      "Ensure signal wire (white/orange) is on the bottom pin, ground wire (brown/black) is on the top pin of the Pixhawk servo rail.",
      "Connect the FlySky FS-iA6B receiver to the 'RC IN' port on the Pixhawk using a single 3-pin PPM / i-Bus cable.",
      "Mount receiver diversity antennas at a 90-degree angle to each other using rigid plastic guide tubes.",
    ],
  },
  {
    step: 10,
    title: "Battery Mounting & Landing Gear Installation",
    category: "Mechanical",
    estimatedMinutes: 20,
    toolsRequired: ["Velcro Strap", "2.0mm Hex Key", "Rubberized Friction Pad"],
    description: "Attach the tall arched landing skids and secure the 3S LiPo battery under the bottom plate.",
    warning: "Never rely on Velcro strap alone. Always use a rubberized non-slip silicone pad between the battery pack and carbon plate to prevent battery ejection during aggressive flight.",
    instructions: [
      "Bolt the 4 landing skids beneath the arm-to-frame mounting junctions.",
      "Stick a self-adhesive non-slip silicone pad to the battery mounting tray.",
      "Wrap the high-strength Kevlar/nylon Velcro strap around the battery and frame plate.",
      "Slide the battery forward/backward until the quadcopter balances neutrally when lifted by its geometric center.",
    ],
  },
  {
    step: 11,
    title: "Software Configuration, Sensor Calibration & Failsafes",
    category: "Software",
    estimatedMinutes: 45,
    toolsRequired: ["Micro-USB Cable", "Laptop with Mission Planner or QGroundControl", "Transmitter"],
    description: "Connect the flight controller to your computer to flash ArduPilot Copter firmware and perform mandatory sensor calibrations.",
    warning: "PROPELLERS MUST REMAIN OFF during all bench software calibrations. Motors can spin unexpectedly during calibration routines.",
    instructions: [
      "Flash the latest stable ArduPilot Copter firmware selecting 'X' Quadcopter frame type.",
      "Perform the 6-point Accelerometer calibration by placing the drone level, on its left side, right side, nose down, nose up, and upside down as prompted.",
      "Perform the Compass Live Calibration by rotating the drone through all axes outdoors away from metal buildings.",
      "Calibrate the RC transmitter stick endpoints and set flight modes to a 3-position switch: STABILIZE, ALT_HOLD, and LOITER / RTL.",
      "CRITICAL: Set the Radio Failsafe to Return-To-Launch (RTL) upon signal loss.",
    ],
  },
  {
    step: 12,
    title: "Propellers-Off Motor Direction Test & Pre-Flight Checklist",
    category: "Testing",
    estimatedMinutes: 25,
    toolsRequired: ["Tachometer or Paper Strips", "Balance Charger", "LiPo Battery Checker"],
    description: "Verify motor spin directions and throttle response with propellers REMOVED, then perform the final pre-flight verification.",
    warning: "DO NOT INSTALL PROPELLERS UNTIL THIS TEST PASSES 100%.",
    instructions: [
      "With propellers REMOVED, plug in the flight battery. Wait for the Pixhawk to acquire GPS lock (solid green LED).",
      "Arm the aircraft in Stabilize mode at minimum throttle.",
      "Touch a piece of paper lightly against each motor can to verify rotation: Motor 1 (Front-Right: CCW), Motor 2 (Front-Left: CW), Motor 3 (Rear-Left: CCW), Motor 4 (Rear-Right: CW).",
      "If any motor spins the wrong way, power down and swap any TWO of the three bullet connector wires between the ESC and that motor.",
      "Once all motor directions are confirmed, disconnect battery, install the 1045 propellers with matching CW/CCW nuts, hand-tighten firmly, and complete the Pre-Flight Checklist.",
    ],
  },
];

export const AERO_TROUBLESHOOTING = [
  {
    symptom: "Drone violently flips over immediately upon throttle up",
    subsystem: "Propulsion & Firmware",
    probability: "Very High (Common Beginner Mistake)",
    rootCause: "Motor order mismatch, motor spinning in wrong direction, or propeller CW/CCW swapped.",
    diagnosticSteps: [
      "1. Remove all propellers immediately.",
      "2. Check ArduPilot motor order: Motor 1 is Front-Right (CCW), Motor 2 is Front-Left (CW), Motor 3 is Rear-Left (CCW), Motor 4 is Rear-Right (CW).",
      "3. Use Mission Planner 'Motor Test' tab to spin each motor individually at 5% throttle. Confirm Motor A spins Front-Right.",
      "4. Check that CW props are on CW motors and CCW props are on CCW motors.",
    ],
    remedy: "Swap the two signal wires on the flight controller or swap any two bullet connector wires to reverse the reversed motor.",
  },
  {
    symptom: "Pixhawk status LED flashes yellow/red and refuses to Arm",
    subsystem: "Avionics & Sensors",
    probability: "High",
    rootCause: "Pre-arm check failure: compass not calibrated, GPS HDOP too high, or RC not calibrated.",
    diagnosticSteps: [
      "1. Connect flight controller to Mission Planner via USB or telemetry radio.",
      "2. Read the exact pre-arm failure message displayed in red on the HUD screen (e.g., 'PreArm: Compass not calibrated' or 'PreArm: Bad Accel Health').",
      "3. If outdoors: check GPS satellite count (>9) and HDOP (<1.5).",
    ],
    remedy: "Execute the specific calibration indicated in the error message. Never disable pre-arm safety checks to force an arm.",
  },
  {
    symptom: "One motor emits rhythmic beeping and does not spin",
    subsystem: "ESC & Signal",
    probability: "Moderate",
    rootCause: "ESC is not receiving valid throttle PWM signal from the flight controller.",
    diagnosticSteps: [
      "1. Inspect the 3-pin servo lead from that ESC to the Pixhawk MAIN OUT rail.",
      "2. Confirm the signal wire (white/orange) is plugged into the signal pin row, not ground row.",
      "3. Check for a bent or backed-out header pin.",
    ],
    remedy: "Re-seat the servo plug with correct polarity. If beeping persists, perform an ESC manual throttle range calibration.",
  },
  {
    symptom: "Severe horizontal oscillation / 'toilet-bowling' in Loiter GPS mode",
    subsystem: "Compass / Navigation",
    probability: "Moderate",
    rootCause: "Compass magnetic interference from high-current PDB traces or wrong compass orientation setting.",
    diagnosticSteps: [
      "1. Inspect GPS mast height. It must be at least 10 cm above frame.",
      "2. Open Mission Planner, connect via telemetry, and view compass interference graph during a ground throttle ramp.",
      "3. Check that compass orientation is set to ROTATION_ROLL_180 (standard for NEO-M8N pucks).",
    ],
    remedy: "Elevate GPS mast higher. Re-run CompassMot (Compass Motor Calibration) to compensate for battery magnetic fields.",
  },
  {
    symptom: "Excessive video jello / vibration causing altitude drop in Alt-Hold",
    subsystem: "Mechanical Dynamics",
    probability: "Moderate",
    rootCause: "Unbalanced propellers or damaged motor shaft transmitting vibration directly into Pixhawk IMU.",
    diagnosticSteps: [
      "1. Download flight dataflash log (.bin) and graph VIBE.VibeX, VibeY, and VibeZ.",
      "2. Vibration levels must be below 30 m/s^2. Spikes above 60 indicate IMU clipping.",
      "3. Inspect propeller blades for nicks, bending, or tracking errors.",
    ],
    remedy: "Dynamically balance all four propellers on a magnetic balancer. Verify flight controller is mounted on compliant anti-vibration foam.",
  },
  {
    symptom: "Short flight time (< 5 minutes) and battery feels excessively hot",
    subsystem: "Power & Efficiency",
    probability: "Low-Moderate",
    rootCause: "Aircraft AUW exceeds efficient thrust envelope, battery C-rating is inadequate, or cells are degraded.",
    diagnosticSteps: [
      "1. Weigh the complete flight-ready drone on a digital scale. AUW should be ~1,150g - 1,350g.",
      "2. Check battery internal resistance on your balance charger (healthy cells have IR < 8 mOhm each).",
      "3. Check motor temperature immediately upon landing (hot > 60°C indicates motor overload).",
    ],
    remedy: "Reduce payload weight. Switch to higher-capacity 3S 4200mAh or 4S 3300mAh battery pack with verified 35C rating.",
  },
];

export const DGCA_INDIA_DRONE_REGULATIONS = {
  regulatoryFramework: "Drone Rules 2021 (Amended 2023) - Ministry of Civil Aviation, Govt. of India",
  digitalSkyPortalUrl: "https://digitalsky.dgca.gov.in/",
  categoryClassification: {
    weightCategory: "Micro Drone (250 grams to 2 kilograms)",
    aero450WeightNote: "AERO-450 typical all-up weight is ~1.15 kg - 1.35 kg, placing it squarely in the DGCA 'Micro' category.",
  },
  mandatoryLegalRequirements: [
    {
      title: "UIN Registration on DigitalSky",
      requirement: "Mandatory for Micro Drones (> 250g)",
      description: "You must generate a Unique Identification Number (UIN) for your self-built drone on the DGCA DigitalSky portal before operating in Indian airspace.",
      fee: "₹100 (as per Drone Rules 2021)",
      sourceUrl: "https://digitalsky.dgca.gov.in/",
    },
    {
      title: "Remote Pilot Certificate (RPC)",
      requirement: "Exempt for Non-Commercial Recreational Flights",
      description: "For non-commercial recreational use of Micro category drones up to 2 kg, a commercial Remote Pilot Certificate is NOT mandatory under Drone Rules 2021. However, pilot must strictly adhere to standard operating limitations.",
    },
    {
      title: "Airspace Zone Verification (Green / Yellow / Red)",
      requirement: "Mandatory Prior to Every Flight",
      description: "Always check the interactive airspace map on DigitalSky. In Green Zones, flights up to 400 feet (120 meters) above ground level (AGL) require no prior flight permission.",
      yellowZoneRule: "Yellow Zones (controlled airspace near airports / sensitive zones) require prior ATC permission.",
      redZoneRule: "Red Zones (strictly prohibited: international borders, military bases, Rashtrapati Bhavan, central secretariats) are no-fly zones.",
    },
    {
      title: "Third-Party Liability Insurance",
      requirement: "Recommended / Commercial Requirement",
      description: "Third-party insurance is recommended for all outdoor flights to protect against accidental property damage.",
    },
  ],
  standardSafetyRules: [
    "Always maintain Visual Line of Sight (VLOS) with the aircraft at all times during flight.",
    "Never operate within 5 km of international or domestic airport perimeters.",
    "Never fly over open assemblies of people, crowded stadiums, or public events without explicit local permissions.",
    "Do not violate citizen privacy or film private premises without authorization.",
    "Fly only during daylight hours in clear meteorological conditions with wind speeds below 15 knots (28 km/h).",
    "Never operate under the influence of alcohol, medication, or psychoactive substances.",
  ],
};

import { MachineData } from "@/types/machine";

export const AERO_DRONE_MACHINE_DATA: MachineData = {
  id: "aero-450",
  name: "AERO-450 Quadcopter",
  category: "Modular UAV Engineering Platform",
  badge: "AVIONICS / 005",
  tagline: "DESIGN. UNDERSTAND. BUILD. FLY RESPONSIBLY.",
  description:
    "An accessible, modular 450mm-class educational quadcopter engineering platform for learning UAV kinematics, brushless propulsion, flight-control avionics, and aerial inspection.",
  modelPath: "/models/aero-450.glb",
  defaultCameraPosition: [0, 1.8, 3.2],
  defaultFov: 44,
  components: AERO_COMPONENTS_DATA.map((c) => ({
    id: c.id,
    name: c.name,
    category: c.category,
    description: c.description,
    purpose: c.purpose,
    workingPrinciple: c.workingPrinciple,
    material: c.model,
    recommendedQty: c.quantity,
    dimensions: c.dimensions,
    priceINR: c.sourcing.priceINR,
    alternatives: c.sourcing.alternatives.map((a) => `${a.supplier} (${a.model})`).join(", "),
    sourcingTip: `Available from ${c.sourcing.supplier}: ${c.sourcing.productTitle}`,
    explosionVector: [0, 1, 0] as [number, number, number],
    explosionDistance: 1.5,
    specs: [
      { label: "Model", value: c.model },
      { label: "Manufacturer", value: c.manufacturer },
      { label: "Mass", value: `${c.massGrams} g` },
      ...(c.voltageRange ? [{ label: "Voltage", value: c.voltageRange }] : []),
      ...(c.currentRating ? [{ label: "Current", value: c.currentRating }] : []),
      { label: "Mounting", value: c.mountingLocation },
    ],
  })),
};
