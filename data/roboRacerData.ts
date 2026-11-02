import { MachineData } from "@/types/machine";

export interface RoboRacerShoppingItem {
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

export const ROBO_RACER_SHOPPING_LIST: RoboRacerShoppingItem[] = [
  {
    component: "AI Vision Camera Module",
    model: "Hikvision DS-U02 1080p Full HD USB Camera",
    quantity: 1,
    specs: "2MP CMOS, 1920x1080 @ 30fps, 88° FOV, Low-Light AGC, USB 2.0 UVC Driverless",
    priceINR: 949,
    seller: "Amazon India / Robu.in",
    url: "https://www.amazon.in/Hikvision-DS-U02-Web-Camera/dp/B08XMNX34R",
    alternative: "ESP32-CAM OV2640 Module (₹480) or Logitech C270 (₹1,299)",
    purpose: "Real-time machine vision feed for autonomous track lane following, obstacle detection, and AprilTag fiducial tracking.",
  },
  {
    component: "Camera Pan Swivel Servo",
    model: "TowerPro SG90 9g Micro Servo",
    quantity: 1,
    specs: "Operating Voltage: 4.8V-6.0V, Torque: 1.8 kg-cm @ 4.8V, Speed: 0.1s/60°, 180° Rotation",
    priceINR: 125,
    seller: "Robu.in",
    url: "https://robu.in/product/towerpro-sg90-9g-mini-servo-9-gram/",
    alternative: "MG90S Metal Gear Micro Servo (₹190)",
    purpose: "Actuates dynamic camera pan swivel to look into upcoming race corners and scan left/right track obstacles.",
  },
  {
    component: "Ultrasonic Rangefinder",
    model: "HC-SR04 Dual Ultrasonic Distance Sensor",
    quantity: 1,
    specs: "Operating Voltage: 5V, Working Frequency: 40kHz, Range: 2cm - 400cm, Accuracy: 3mm, Angle: 15°",
    priceINR: 85,
    seller: "ElectronicsComp",
    url: "https://www.electronicscomp.com/ultrasonic-sensor-module-hc-sr04",
    alternative: "US-015 High Accuracy Ultrasonic or VL53L0X ToF Lidar (₹210)",
    purpose: "Sub-centimeter obstacle proximity telemetry for front collision avoidance and emergency braking.",
  },
  {
    component: "Core Processing Unit",
    model: "ESP32-WROOM-32D 30-Pin NodeMCU Development Board",
    quantity: 1,
    specs: "Tensilica Xtensa Dual-Core 32-bit @ 240MHz, 520KB SRAM, Wi-Fi 802.11 b/g/n, BLE 4.2, 16x PWM Channels",
    priceINR: 329,
    seller: "Robu.in",
    url: "https://robu.in/product/esp32-development-board/",
    alternative: "Arduino Uno R3 + Bluetooth (₹350) or Raspberry Pi Zero 2W (₹1,850)",
    purpose: "Executes PID motion profiling, handles ultrasonic ping echo interrupts, and processes telemetry/steering commands.",
  },
  {
    component: "Dual H-Bridge Motor Driver",
    model: "L298N Dual Full-Bridge Stepper / DC Motor Driver",
    quantity: 1,
    specs: "Operating Voltage: 5V - 35V, Peak Current: 2A per bridge, Integrated 5V Regulator, Heavy-duty Aluminum Heatsink",
    priceINR: 165,
    seller: "ElectronicsComp",
    url: "https://www.electronicscomp.com/l298n-motor-driver-module",
    alternative: "TB6612FNG Dual MOSFET Motor Driver (₹145, higher efficiency)",
    purpose: "Translates 3.3V/5V logic PWM speed and direction signals into high-current drive power for 4 DC gearmotors.",
  },
  {
    component: "4WD Geared DC Motors",
    model: "High-Torque 300 RPM Dual-Shaft Bo-Motors (Set of 4)",
    quantity: 1,
    specs: "Voltage: 6V - 9V DC, No-load Speed: 300 RPM, Stall Torque: 1.5 kg-cm per motor, Angled Metal Brackets",
    priceINR: 340,
    seller: "Robocraze",
    url: "https://robocraze.com/products/dual-shaft-bo-motor-straight-pack-of-4",
    alternative: "N20 Micro Metal Gearmotors 600 RPM (₹480 for 4)",
    purpose: "Independent 4-wheel drive skid-steering propulsion with rapid torque delivery and acceleration.",
  },
  {
    component: "High-Traction Racing Wheels",
    model: "65mm Wide Rubber Off-Road Tires with Chevron Tread",
    quantity: 4,
    specs: "Diameter: 65mm, Width: 26mm, High-Grip Synthetic Rubber Tread, Molded 5-Spoke Rigid Nylon Hub",
    priceINR: 220,
    seller: "Robu.in",
    url: "https://robu.in/product/track-wheel-65mm-rubber-tire-for-bo-motor/",
    alternative: "Slick Foam Racing Tires (₹180)",
    purpose: "Delivers maximum lateral traction on asphalt, tile, and race track surfaces during high-G turns.",
  },
  {
    component: "Rechargeable Power Source",
    model: "2S 7.4V 2500mAh 18650 Li-ion Battery Pack with BMS",
    quantity: 1,
    specs: "Nominal: 7.4V (8.4V Full), 2500mAh capacity, 15A continuous discharge, 2S 10A Over-Charge/Discharge BMS",
    priceINR: 380,
    seller: "Robu.in",
    url: "https://robu.in/product/2s-7-4v-18650-battery-pack-with-bms/",
    alternative: "2x 18650 Cell Holder with Li-ion cells (₹280)",
    purpose: "Provides sustained 7.4V DC current to the high-load motor drivers and buck converter for 45+ minutes of track runs.",
  },
  {
    component: "Step-Down Voltage Regulator",
    model: "LM2596S DC-DC Step-Down Buck Converter Module",
    quantity: 1,
    specs: "Input: 7V - 35V, Output: 5V DC Constant (Adjustable), 3A Max Output, 150kHz Switching Frequency",
    priceINR: 85,
    seller: "Robu.in",
    url: "https://robu.in/product/lm2596-dc-dc-step-down-adjustable-power-supply-module/",
    alternative: "MP1584EN Ultra-Compact Buck Module (₹65)",
    purpose: "Steps down 7.4V battery voltage into a rock-solid, ripple-free 5.0V bus for ESP32, Camera, and SG90 servo.",
  },
  {
    component: "SolidWorks CAD Chassis & Body",
    model: "Laser-cut 3mm Acrylic / PETG Body Plate + Gullwing Box",
    quantity: 1,
    specs: "Custom CAD chassis plate, hinged Dhakna inspection hood, front grille slats, camera swivel bracket",
    priceINR: 320,
    seller: "Mechverse 3D / Local Fablab",
    url: "https://mechverse.dev/models/robo-racer",
    alternative: "3D Printed PLA/PETG Chassis on Bambu Lab / Ender 3 (₹240)",
    purpose: "Precision-engineered mechanical foundation matching SolidWorks 'Final Car.SLDASM' files with gullwing service access.",
  },
  {
    component: "Wiring, Switch & Hardware Pack",
    model: "Dupont Jumpers, M3 Standoffs, Rocker Switch & Connectors",
    quantity: 1,
    specs: "40-pin Dupont jumpers, brass M3 hex standoffs, SPST toggle switch, DC barrel jack, heat-shrink tubing",
    priceINR: 95,
    seller: "ElectronicsComp",
    url: "https://www.electronicscomp.com/dupont-cable-40-pin-female-to-female",
    alternative: "Standard electronics hardware kit",
    purpose: "Secure mechanical assembly and vibration-proof electrical interconnects.",
  },
  {
    component: "Consolidated Domestic Shipping",
    model: "Express Courier Delivery (BlueDart / Delhivery / DTDC)",
    quantity: 1,
    specs: "Doorstep delivery across Indian cities (Tier 1 & Tier 2) within 2-4 business days",
    priceINR: 120,
    seller: "Indian Logistics Hub",
    url: "https://robu.in",
    alternative: "Local college electronics market",
    purpose: "Consolidated parcel dispatch for components.",
  },
];

export const ROBO_RACER_MACHINE_DATA: MachineData = {
  id: "robo-racer",
  name: "ROBO-RACER AI Vision & Obstacle Racing Bot",
  category: "Autonomous AI Rover & 4WD Obstacle Racer",
  badge: "AI VISION / 4WD RACER / ₹2,888",
  tagline: "Build a high-speed AI computer-vision and ultrasonic obstacle-racing rover in India for under ₹3,000 INR.",
  description:
    "An advanced autonomous racing rover engineered for competitive robotics, college race tracks, and AI navigation. Modeled directly from production SolidWorks CAD assemblies ('Final Car.SLDASM'), ROBO-RACER features a Hikvision DS-U02 1080p AI vision camera on a pan servo neck for OpenCV lane and marker tracking, a front-mounted HC-SR04 ultrasonic rangefinder for sub-centimeter collision avoidance, 4WD independent high-torque DC gearmotors with high-traction racing chevron tires, a gullwing inspection hood ('Dhakna'), and an ESP32 dual-core brain running PID steering and WebSockets telemetry.",
  modelPath: "/assets/Robo Racer Bot/Robo Race Design",
  defaultCameraPosition: [0.38, 0.28, 0.42],
  defaultFov: 45,
  components: [
    {
      id: "hikvision-camera",
      name: "Hikvision DS-U02 1080p AI Vision Camera",
      category: "Vision & AI",
      meshNamePattern: /camera|hikvision|lens|webcam/i,
      description:
        "High-definition 1080p optical sensor with an 88-degree wide horizontal field of view mounted atop the chassis nose. Delivers uncompressed 30fps video stream used for autonomous lane detection, color blob extraction, and AprilTag optical fiducials.",
      purpose:
        "Feeds real-time video frames into the vision pipeline to calculate race line deviation and apex steering angles.",
      specs: [
        { label: "Resolution", value: "1920 x 1080 @ 30 FPS Full HD" },
        { label: "Lens FOV", value: "88° Horizontal (Low Distortion)" },
        { label: "Interface", value: "USB 2.0 UVC Driverless Protocol" },
        { label: "Mounting", value: "Pan Swivel Neck via SG90 Servo" },
      ],
      explosionVector: [0, 0.16, 0.08],
      explosionDistance: 0.2,
    },
    {
      id: "pan-servo",
      name: "TowerPro SG90 9g Camera Pan Servo",
      category: "Actuation",
      meshNamePattern: /servo|sg90|holder|down_holder/i,
      description:
        "Precision 9-gram micro servo motor embedded inside the camera holder neck. Operates on 50Hz PWM signals from the microcontroller, providing 180 degrees of dynamic pan rotation.",
      purpose:
        "Pans the Hikvision camera left and right ahead of sharp corners and active obstacles, expanding the robot's dynamic field of view.",
      specs: [
        { label: "Operating Voltage", value: "4.8V – 6.0V DC" },
        { label: "Stall Torque", value: "1.8 kg·cm @ 4.8V" },
        { label: "Operating Speed", value: "0.10 sec / 60 degrees" },
        { label: "Travel Angle", value: "180° Full Sweep" },
      ],
      explosionVector: [0, 0.1, 0.05],
      explosionDistance: 0.14,
    },
    {
      id: "ultrasonic-sensor",
      name: "HC-SR04 Dual Ultrasonic Rangefinder",
      category: "Sensors",
      meshNamePattern: /ultrasonic|sr04|sonar|transducer/i,
      description:
        "Front bumper-mounted dual ultrasonic sensor consisting of an acoustic transmitter and receiver. Emits an 8-cycle 40kHz sonic burst and measures the echo return time to detect obstacles from 2cm to 400cm away with 3mm precision.",
      purpose:
        "Guarantees crash-free high-speed racing by triggering emergency braking or evasive steering when distance drops below safety margins (25cm).",
      specs: [
        { label: "Operating Frequency", value: "40 kHz" },
        { label: "Detection Range", value: "2 cm – 400 cm (0.8\" – 13.1 ft)" },
        { label: "Resolution", value: "3.0 mm" },
        { label: "Measuring Angle", value: "15 degrees cone" },
      ],
      explosionVector: [0, -0.04, 0.16],
      explosionDistance: 0.22,
    },
    {
      id: "dhakna-hood",
      name: "Gullwing Inspection Service Hood ('Dhakna')",
      category: "Chassis & Aero",
      meshNamePattern: /dhakna|hood|lid|cover/i,
      description:
        "Aerodynamically sloped top inspection hood hinged at the rear of the electronics compartment. Opens upwards at a 38-degree gullwing angle for fast battery replacement, MCU debugging, and motor driver inspection without chassis disassembly.",
      purpose:
        "Protects internal sensitive electronics from track debris, collisions, and dust while enabling instant pit-stop maintenance access.",
      specs: [
        { label: "Material", value: "Laser-cut 3mm Acrylic / Carbon-Fiber Finish" },
        { label: "Hinge Angle", value: "38° Upward Gullwing Stance" },
        { label: "Latch Type", value: "Neodymium Magnetic Snap Retainer" },
        { label: "Aerodynamics", value: "Sloped High-Downforce Profile" },
      ],
      explosionVector: [0, 0.18, -0.05],
      explosionDistance: 0.24,
    },
    {
      id: "electronics-box",
      name: "Mid-Cabin Electronics Compartment ('Box Part')",
      category: "Chassis & Aero",
      meshNamePattern: /box|compartment|cabin/i,
      description:
        "High-density reinforced cabin enclosing the core ESP32 development board, L298N dual H-bridge motor driver, LM2596 buck converter, and 2S Li-ion battery pack.",
      purpose:
        "Maintains a low center of gravity (CoG) and shields logic electronics against physical shock and thermal heat from the drive motors.",
      specs: [
        { label: "Material", value: "Rigid Matte-Black Polycarbonate" },
        { label: "Cooling", value: "Dual Side Passive Airflow Vents" },
        { label: "Internal Volume", value: "120 x 85 x 45 mm" },
        { label: "Vibration Damping", value: "Silicone Anti-Vibration Grommets" },
      ],
      explosionVector: [0, 0.08, 0],
      explosionDistance: 0.12,
    },
    {
      id: "chassis-base",
      name: "Reinforced 4WD Baseplate & Diffuser ('Body Part')",
      category: "Structure",
      meshNamePattern: /body|chassis|base|plate/i,
      description:
        "Heavy-duty lower structural chassis plate with integrated motor bracket mounting slots, front bumper intake slats, and rear aerodynamic triple diffuser ports.",
      purpose:
        "Anchors the four DC gearmotors in rigid alignment and absorbs mechanical stress during high-speed cornering and collisions.",
      specs: [
        { label: "Material", value: "3.5mm High-Impact Composite Plate" },
        { label: "Length / Width", value: "210 mm x 150 mm" },
        { label: "Ground Clearance", value: "22 mm" },
        { label: "Rigidity Rating", value: "High Torsional Stiffness" },
      ],
      explosionVector: [0, -0.08, 0],
      explosionDistance: 0.14,
    },
    {
      id: "dc-gearmotors",
      name: "4x High-Torque Angled DC Geared Motors",
      category: "Drivetrain",
      meshNamePattern: /motor|gearbox|assembly/i,
      description:
        "Four high-RPM DC gearmotors mounted on golden aluminum angled suspension brackets. Connected in 4WD dual-channel skid-steer configuration driven by the L298N H-bridge.",
      purpose:
        "Delivers rapid acceleration and zero-radius turn (tank-steer) capability on the race track.",
      specs: [
        { label: "Rated Speed", value: "300 RPM @ 7.4V DC" },
        { label: "Stall Torque", value: "1.5 kg·cm per motor (6.0 kg·cm total)" },
        { label: "Gear Ratio", value: "1:48 Dual Shaft Reduction" },
        { label: "Bracket Finish", value: "Anodized Golden Brass Bracket" },
      ],
      explosionVector: [0.18, -0.04, 0],
      explosionDistance: 0.22,
    },
    {
      id: "racing-wheels",
      name: "4x High-Traction Deep Chevron Racing Tires",
      category: "Drivetrain",
      meshNamePattern: /wheel|tire|rim/i,
      description:
        "Wide 65mm rubber racing tires featuring directional V-chevron tread blocks molded onto 5-spoke impact-resistant nylon wheels with center locking nuts.",
      purpose:
        "Channels maximum tractive effort to the racing surface while providing high lateral cornering grip during rapid drift turns.",
      specs: [
        { label: "Wheel Diameter", value: "65 mm (2.56 in)" },
        { label: "Tread Width", value: "26 mm Wide Contact Patch" },
        { label: "Tire Material", value: "High-Grip Thermoplastic Elastomer (TPE)" },
        { label: "Drive Hex", value: "Double Flat D-Shaft Hub Lock" },
      ],
      explosionVector: [0.24, 0, 0],
      explosionDistance: 0.28,
    },
    {
      id: "esp32-mcu",
      name: "ESP32-WROOM-32 Dual-Core Autonomous Brain",
      category: "Electronics",
      meshNamePattern: /esp32|mcu|controller/i,
      description:
        "Dual-core 240MHz microcontroller executing the autonomous race state machine, ultrasonic echo timing, PID steering filter, and high-frequency PWM motor control.",
      purpose:
        "Processes real-time sensor inputs, adjusts motor PWM duty cycle at 20kHz, and streams telemetry to the Mechverse simulator.",
      specs: [
        { label: "Cores & Clock", value: "Dual Xtensa 32-bit @ 240 MHz" },
        { label: "Telemetry Protocol", value: "WebSockets & UDP over Wi-Fi" },
        { label: "Control Latency", value: "< 10 ms" },
        { label: "SRAM", value: "520 KB High-Speed Memory" },
      ],
      explosionVector: [0, 0.12, 0.02],
      explosionDistance: 0.16,
    },
    {
      id: "motor-driver",
      name: "L298N Dual H-Bridge Motor Driver Module",
      category: "Electronics",
      meshNamePattern: /driver|l298n|hbridge|heatsink/i,
      description:
        "High-power dual full-bridge driver equipped with a heavy finned aluminum heatsink. Controls speed and direction of left and right motor banks independently.",
      purpose:
        "Converts low-power 3.3V logic signals into high-current 7.4V drive power up to 2A continuous per channel.",
      specs: [
        { label: "Continuous Current", value: "2.0 A per channel (Peak 3.0A)" },
        { label: "Voltage Rating", value: "5V – 35V DC" },
        { label: "Speed Modulation", value: "Dual Hardware PWM Channels" },
        { label: "Flyback Diodes", value: "Internal Fast-Recovery Clamping" },
      ],
      explosionVector: [0, 0.09, -0.06],
      explosionDistance: 0.15,
    },
    {
      id: "power-unit",
      name: "2S 7.4V 2500mAh Li-ion Pack & LM2596 Buck Unit",
      category: "Power",
      meshNamePattern: /battery|power|buck|liion/i,
      description:
        "High-discharge 2-series 18650 Li-ion battery pack with an integrated protection circuit, paired with an LM2596 switching regulator delivering clean 5.0V power to the sensors and camera.",
      purpose:
        "Provides sustained electrical energy for high-speed racing runs without voltage sag or controller resets.",
      specs: [
        { label: "Pack Voltage", value: "7.4V Nominal (8.4V Peak)" },
        { label: "Capacity", value: "2500 mAh (18.5 Wh)" },
        { label: "Regulated Rail", value: "5.0V @ 3.0A Max (LM2596)" },
        { label: "Runtime", value: "45 – 60 Minutes Active Racing" },
      ],
      explosionVector: [0, 0.04, -0.12],
      explosionDistance: 0.18,
    },
  ],
};
