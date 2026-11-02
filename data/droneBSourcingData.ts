export interface DroneBShoppingItem {
  component: string;
  model: string;
  quantity: number;
  specs: string;
  priceINR: number;
  seller: string;
  url: string;
  alternative: string;
  purpose: string;
}

export const DRONE_B_SHOPPING_LIST: DroneBShoppingItem[] = [
  {
    component: "Industrial Carbon Frame",
    model: "Drone-B 650mm Octagonal Carbon Fiber Fuselage Kit",
    quantity: 1,
    specs: "300x300mm octagonal avionics bay, 4x 325mm triangular lattice truss arms, 6061-T6 aluminum clamps",
    priceINR: 5200,
    seller: "Mechverse CAD / Robu.in",
    url: "https://robu.in/product-category/drone-parts/drone-frames/",
    alternative: "Tarot 650 Carbon Quad Frame (₹4,800)",
    purpose: "Rigid heavy-duty chassis absorbing high torsional stresses during heavy-payload operations.",
  },
  {
    component: "Heavy-Lift BLDC Motors",
    model: "Sunnysky V4014 400KV High-Efficiency Brushless Outrunners",
    quantity: 4,
    specs: "400KV, 6S LiPo input, Max Thrust: 3.2 kg per motor (12.8 kg total), 14-pole 12-slot stator",
    priceINR: 7600,
    seller: "Robu.in",
    url: "https://robu.in/product/sunnysky-v4014-400kv-brushless-motor/",
    alternative: "T-Motor U8 / EMAX MT4114 (₹8,200)",
    purpose: "Produces high torque at low RPM to spin large 18-inch propellers with minimum thermal losses.",
  },
  {
    component: "Industrial ESCs",
    model: "Hobbywing XRotor 40A 6S Opto Brushless ESCs (Set of 4)",
    quantity: 1,
    specs: "Continuous: 40A, Burst: 60A, 6S LiPo rated, 621Hz refresh rate, Opto-isolated signal line",
    priceINR: 3450,
    seller: "ElectronicsComp",
    url: "https://www.electronicscomp.com/hobbywing-xrotor-40a-opto-esc",
    alternative: "Flycolor 40A 6S ESC",
    purpose: "Smooth, rapid PWM motor commutation with high-voltage protection and zero ground loop noise.",
  },
  {
    component: "Carbon Propellers",
    model: "18x5.5 Inch High-Efficiency Carbon Fiber CW/CCW Pairs",
    quantity: 2,
    specs: "18-inch diameter, 5.5-inch pitch, 100% 3K carbon fiber, balanced factory hubs",
    priceINR: 2200,
    seller: "Robocraze",
    url: "https://robocraze.com/",
    alternative: "1755 Carbon Folding Propellers (₹1,950)",
    purpose: "Converts motor shaft torque into extreme aerodynamic lift with ultra-low flex under load.",
  },
  {
    component: "Flight Controller & Autopilot",
    model: "Pixhawk 6C Dual-Core Autopilot + M9N Dual GPS Mast",
    quantity: 1,
    specs: "STM32H753 480MHz, Triple IMU redundancy, Barometer, CAN bus, M9N multi-constellation GNSS",
    priceINR: 8400,
    seller: "Robu.in",
    url: "https://robu.in/product/pixhawk-6c-flight-controller/",
    alternative: "Holybro Pixhawk 4 / Cube Orange (₹12,000)",
    purpose: "Autonomous waypoint navigation, failsafe geo-fencing, altitude hold, and vibration-damped telemetry.",
  },
  {
    component: "High-Capacity Flight Battery",
    model: "6S 22.2V 10,000mAh 25C High-Discharge LiPo Battery",
    quantity: 1,
    specs: "22.2V Nominal (25.2V Full), 10,000mAh, 25C discharge (250A peak), XT90 Anti-Spark plug, 1280g",
    priceINR: 6200,
    seller: "Robu.in",
    url: "https://robu.in/product/6s-10000mah-lipo-battery/",
    alternative: "2x 6S 5000mAh parallel pack (₹5,600)",
    purpose: "Delivers sustained high-current DC power for 22–28 minutes of industrial inspection flight.",
  },
  {
    component: "Power Distribution & Dual BEC",
    model: "Matek Systems PDB-HEX 12S Power Distribution Board",
    quantity: 1,
    specs: "Input: 6S-12S LiPo, 140A continuous, 5V/5A & 12V/4A dual BEC rails, Current sensor shunt",
    priceINR: 1150,
    seller: "ElectronicsComp",
    url: "https://www.electronicscomp.com/",
    alternative: "Standard 8-arm Octo PDB (₹850)",
    purpose: "Distributes clean 22.2V power to 4 ESCs while filtering ripple-free 5V logic for Pixhawk.",
  },
  {
    component: "Long-Range Telemetry Link",
    model: "Holybro Sik 915MHz 500mW Air & Ground Radio Transceiver",
    quantity: 1,
    specs: "915MHz ISM band, 500mW output (+27dBm), MAVLink protocol, ~3-5 km ground range",
    priceINR: 1850,
    seller: "Robu.in",
    url: "https://robu.in/",
    alternative: "433MHz Telemetry Radio Kit (₹1,600)",
    purpose: "Live ground station bidirectional telemetry for Mission Planner and QGroundControl.",
  },
  {
    component: "Heavy-Duty Landing Gear",
    model: "High-Clearance Aluminum Skid Gear with Silicone Shock Dampers",
    quantity: 1,
    specs: "280mm height clearance, 16mm carbon tubes, aluminum tee joints, payload rail mounting",
    priceINR: 950,
    seller: "Robocraze",
    url: "https://robocraze.com/",
    alternative: "Retractable Carbon Landing Gear (₹2,200)",
    purpose: "Protects underslung gimbal cameras and LiDAR sensors during rough terrain landings.",
  },
  {
    component: "Consolidated Domestic Logistics",
    model: "Express Heavy-Parcel Courier Delivery (BlueDart / DTDC)",
    quantity: 1,
    specs: "Insured door delivery with tracking across Indian states (2-4 business days)",
    priceINR: 280,
    seller: "Indian Logistics Hub",
    url: "https://robu.in",
    alternative: "Local hobby depot pickup",
    purpose: "Reliable insured transport for high-value carbon airframe and battery cells.",
  },
];

export const DRONE_B_ENGINEERING_SPECS = {
  diagonalWheelbaseMm: 650,
  fuselageDimensionsMm: "300 x 300 x 70",
  emptyWeightGrams: 1650,
  allUpWeightGrams: 3450,
  maxTakeoffWeightGrams: 6200,
  maxPayloadCapacityGrams: 2750,
  thrustToWeightRatio: "3.7 : 1 (Extreme Industrial Margin)",
  flightTimeMinutes: "24 – 28 Minutes with 1.2kg Payload",
  topSpeedKmh: 72,
  windResistanceKmh: 45, // Beaufort Force 6
  operatingCeilingMeters: 3000,
};
