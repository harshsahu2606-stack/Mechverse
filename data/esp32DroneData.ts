import { MachineData } from "@/types/machine";

export interface Esp32ShoppingItem {
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

export const ESP32_DRONE_SHOPPING_LIST: Esp32ShoppingItem[] = [
  {
    component: "Flight Controller & Radio",
    model: "ESP32-WROOM-32D 30-Pin NodeMCU",
    quantity: 1,
    specs: "Dual-Core 240MHz, 2.4GHz Wi-Fi (SoftAP), 520KB SRAM, 3.3V Logic",
    priceINR: 329,
    seller: "Robu.in",
    url: "https://robu.in/product/esp32-development-board/",
    alternative: "Robocraze ESP32 Dev Module (₹340)",
    purpose: "Executes 400Hz Mahony/PID flight loop and handles phone Wi-Fi UDP commands.",
  },
  {
    component: "6-DOF IMU Sensor",
    model: "GY-521 MPU-6050 Breakout Board",
    quantity: 1,
    specs: "3-Axis Gyro (±2000°/s) + 3-Axis Accel (±8g/±16g), I2C 400kHz Fast-Mode",
    priceINR: 155,
    seller: "ElectronicsComp",
    url: "https://www.electronicscomp.com/mpu-6050-gyro-sensor-module",
    alternative: "Robu.in GY-521 Module (₹165)",
    purpose: "Measures real-time pitch, roll, and angular rate for flight attitude stabilization.",
  },
  {
    component: "Brushed Motors",
    model: "8520 Coreless Brushed Motor Set (4 pcs)",
    quantity: 1,
    specs: "Diameter: 8.5mm, Length: 20mm, Shaft: 1.0mm, 50,000 RPM @ 3.7V (2 CW, 2 CCW)",
    priceINR: 449,
    seller: "Robocraze",
    url: "https://robocraze.com/products/8520-coreless-motor",
    alternative: "Robu.in 8520 Magnetic Coreless Motor Pack (₹460)",
    purpose: "Direct-drive propulsion generating 34g of static thrust per motor with 55mm props.",
  },
  {
    component: "Propellers",
    model: "55mm Micro CW/CCW Propellers",
    quantity: 2,
    specs: "55mm Length, 1.0mm Hub Press-Fit, High-Efficiency Polycarbonate Airfoil",
    priceINR: 85,
    seller: "Robu.in",
    url: "https://robu.in/product/55mm-propeller-for-micro-drone/",
    alternative: "Hubsan X4 55mm Propeller Pack",
    purpose: "Converts rotational motor torque into lift. Two clockwise and two counter-clockwise.",
  },
  {
    component: "Motor Drivers (MOSFETs)",
    model: "SI2302 SOT-23 N-Channel MOSFET",
    quantity: 5,
    specs: "Vds: 20V, Id: 2.8A continuous, Vgs(th): 0.65-1.2V logic level, Rds(on): 0.085 Ohm",
    priceINR: 35,
    seller: "Probots.co.in",
    url: "https://www.probots.co.in/si2302-sot23-n-channel-mosfet.html",
    alternative: "IRLML2502 / AO3400A / A2SHB",
    purpose: "High-speed 20kHz PWM switching of coreless motors directly from ESP32 3.3V GPIOs.",
  },
  {
    component: "Flyback Diodes",
    model: "1N5819 Schottky Barrier Diodes",
    quantity: 5,
    specs: "40V 1A Schottky, Vf: 0.45V, Ultra-Fast Recovery (<10ns)",
    priceINR: 20,
    seller: "Robu.in",
    url: "https://robu.in/product/1n5819-1a-40v-schottky-diode/",
    alternative: "SS14 SMD Schottky Diode",
    purpose: "Absorbs dangerous -35V inductive back-EMF spikes when PWM switches off.",
  },
  {
    component: "Resistor Kit",
    model: "10k Ohm (Pull-Down) & 100 Ohm (Gate Protection)",
    quantity: 1,
    specs: "1/4W Metal/Carbon Film Resistors (10 pcs each)",
    priceINR: 30,
    seller: "ElectronicsComp",
    url: "https://www.electronicscomp.com/10k-ohm-quarter-watt-resistor",
    alternative: "Any standard 1/4W resistor pack",
    purpose: "Prevents MOSFET floating gate glitches during ESP32 bootup and limits inrush current.",
  },
  {
    component: "Flight Battery",
    model: "1S 3.7V 500mAh 25C LiPo Battery",
    quantity: 1,
    specs: "3.7V Nominal (4.2V Peak), 500mAh, 25C Discharge (12.5A), Mass: ~13.5g, Losi Plug",
    priceINR: 325,
    seller: "Robu.in",
    url: "https://robu.in/product/3-7v-500mah-25c-lipo-battery/",
    alternative: "1S 3.7V 450mAh - 600mAh Drone LiPo",
    purpose: "Lightweight electrochemical energy reservoir powering motors and 3.3V logic.",
  },
  {
    component: "USB Charger",
    model: "TP4056 1A 1S Lithium Battery Charger Board",
    quantity: 1,
    specs: "Micro-USB / Type-C 5V Input, 4.2V CC/CV Cutoff, Over-charge / Over-discharge Protection",
    priceINR: 38,
    seller: "Robu.in",
    url: "https://robu.in/product/tp4056-1a-lipo-battery-charging-board/",
    alternative: "Standard 5V TP4056 module",
    purpose: "Safe, constant-current constant-voltage charging of the 1S LiPo from phone adapter/laptop.",
  },
  {
    component: "Airframe & Prop Guards",
    model: "95mm Micro Quad Frame with Propeller Guards",
    quantity: 1,
    specs: "Molded Polycarbonate / Carbon Fiber, 8.5mm Motor Sockets, 95mm Diagonal Wheelbase",
    priceINR: 199,
    seller: "Robu.in",
    url: "https://robu.in/product/90mm-micro-quadcopter-frame/",
    alternative: "DIY Coroplast / Balsa / 3D Printed Frame (₹60)",
    purpose: "Rigid structure holding motors at 90-degree stance with protective circular prop rings.",
  },
  {
    component: "Wires & Connectors",
    model: "Micro Losi 2-Pin Cable + 28AWG Silicone Wires",
    quantity: 2,
    specs: "Ultra-flexible silicone insulated copper wires with Walkera/Losi micro plug",
    priceINR: 45,
    seller: "Robocraze",
    url: "https://robocraze.com/",
    alternative: "JST-PH 2.0mm pigtail or direct solder",
    purpose: "Reliable, low-resistance power harness between LiPo battery and board.",
  },
  {
    component: "Consolidated Shipping",
    model: "Standard Domestic Express Courier",
    quantity: 1,
    specs: "Door delivery via BlueDart / India Post across Indian states",
    priceINR: 160,
    seller: "Robu / Robocraze",
    url: "https://robu.in",
    alternative: "Local college electronics market",
    purpose: "Domestic delivery fee to college hostel / home address.",
  },
];

export const ESP32_DRONE_MACHINE_DATA: MachineData = {
  id: "esp32-drone",
  name: "AERO-ESP Phone-Controlled Micro Drone",
  category: "Low-Cost DIY Nano Drone (<250g)",
  badge: "BUDGET DIY / ₹1,955",
  tagline: "Build a real, physically flying smartphone Wi-Fi controlled quadcopter in India for under ₹2,000 INR.",
  description:
    "An ultra-low-cost, high-performance DIY nano quadcopter engineered for college students and beginners. Powered by an onboard ESP32 microcontroller broadcasting its own Wi-Fi SoftAP, an MPU6050 6-DOF IMU executing a 400Hz PID loop, four 8520 coreless brushed motors with SI2302 MOSFET drivers, and a 1S 500mAh LiPo battery. Fly directly using any Android phone touchscreen joysticks with zero expensive RC transmitter required.",
  modelPath: "/models/esp32-drone",
  defaultCameraPosition: [0.35, 0.25, 0.38],
  defaultFov: 42,
  components: [
    {
      id: "esp32-board",
      name: "ESP32-WROOM-32 Microcontroller",
      category: "Avionics",
      meshNamePattern: /esp32|microcontroller|board|mcu/i,
      description:
        "Dual-core 240MHz Tensilica Xtensa processor running real-time 802.11b/g/n Wi-Fi SoftAP telemetry on Core 0 and the 400Hz sensor-fusion PID attitude stabilization loop on Core 1.",
      purpose:
        "Directly interfaces with the smartphone over Wi-Fi UDP (Port 8888), samples the MPU6050 via fast 400kHz I2C, and generates 20kHz MCPWM motor commands.",
      specs: [
        { label: "Processor", value: "Tensilica Xtensa Dual-Core 32-bit @ 240MHz" },
        { label: "Wireless", value: "2.4GHz Wi-Fi 802.11b/g/n (Direct SoftAP)" },
        { label: "Control Latency", value: "6 - 12 ms via UDP" },
        { label: "Mass", value: "7.5 g" },
      ],
      explosionVector: [0, 0.12, 0],
      explosionDistance: 0.16,
    },
    {
      id: "mpu6050-imu",
      name: "GY-521 MPU-6050 6-DOF IMU Sensor",
      category: "Avionics",
      meshNamePattern: /mpu|gyro|imu|sensor/i,
      description:
        "Combines a 3-axis MEMS gyroscope (±2000°/s) and a 3-axis accelerometer (±8g) on a single silicon die. Communicates via I2C at 400kHz on GPIO 21 (SDA) and GPIO 22 (SCL).",
      purpose:
        "Provides 400Hz angular rate and gravity orientation vectors fed into the complementary filter for self-leveling pitch and roll stabilization.",
      specs: [
        { label: "Gyro Range", value: "±2000 °/s (16.4 LSB/°/s sensitivity)" },
        { label: "Accel Range", value: "±8g (4096 LSB/g sensitivity)" },
        { label: "Bus Speed", value: "400 kHz Fast-Mode I2C" },
        { label: "Mass", value: "2.1 g" },
      ],
      explosionVector: [0, 0.18, 0],
      explosionDistance: 0.22,
    },
    {
      id: "coreless-motors",
      name: "4x 8520 Coreless Brushed Motors",
      category: "Propulsion",
      meshNamePattern: /motor|coreless/i,
      description:
        "Four high-speed permanent magnet coreless motors (8.5mm diameter x 20mm length). Features two CW motors (Black/White wires) and two CCW motors (Red/Blue wires) with a 1.0mm output drive shaft.",
      purpose:
        "Generates 34 grams of static thrust per motor (136g total thrust across 4 motors) at 3.7V with 55mm propellers.",
      specs: [
        { label: "Dimensions", value: "Φ8.5 mm x 20.0 mm Body" },
        { label: "Operating Speed", value: "50,000 RPM @ 3.7V" },
        { label: "Current Draw", value: "1.15A Hover, 2.8A Max Stall" },
        { label: "Mass", value: "20.0 g (5.0 g each)" },
      ],
      explosionVector: [0.15, -0.06, 0.15],
      explosionDistance: 0.2,
    },
    {
      id: "propellers",
      name: "4x 55mm Micro High-Lift Propellers",
      category: "Propulsion",
      meshNamePattern: /prop|blade/i,
      description:
        "High-efficiency 55mm polycarbonate 2-blade micro propellers press-fitted onto the 1.0mm motor shafts. Includes two standard CCW blades and two reverse CW blades.",
      purpose:
        "Generates aerodynamic vertical lift and cancels yaw gyroscopic reaction torque through counter-rotation.",
      specs: [
        { label: "Diameter", value: "55.0 mm (2.16 inches)" },
        { label: "Shaft Bore", value: "1.0 mm Press-Fit" },
        { label: "Material", value: "Impact-Resistant Polycarbonate" },
        { label: "Mass", value: "2.0 g (0.5 g each)" },
      ],
      explosionVector: [0, 0.24, 0],
      explosionDistance: 0.3,
    },
    {
      id: "mosfet-drivers",
      name: "4x SI2302 N-Channel MOSFET Motor Drivers",
      category: "Electronics",
      meshNamePattern: /mosfet|driver|fet|diode/i,
      description:
        "Four logic-level SOT-23 N-channel MOSFETs (SI2302) paired with 1N5819 Schottky flyback diodes and 10k gate pull-down resistors. Driven by ESP32 MCPWM channels at 20kHz.",
      purpose:
        "Modulates motor RPM silently without audible coil whine while clamping -35V inductive spikes to protect the microcontroller.",
      specs: [
        { label: "Max Continuous Current", value: "2.8 A (Pulse 10 A)" },
        { label: "On-Resistance (Rds_on)", value: "0.085 Ohm @ Vgs = 2.5V" },
        { label: "PWM Frequency", value: "20 kHz (Audible-free)" },
        { label: "Flyback Diode", value: "1N5819 (40V 1A Schottky)" },
      ],
      explosionVector: [0, -0.05, 0],
      explosionDistance: 0.08,
    },
    {
      id: "lipo-battery",
      name: "1S 3.7V 500mAh 25C LiPo Battery",
      category: "Power",
      meshNamePattern: /battery|lipo|power/i,
      description:
        "High-discharge single-cell Lithium-Polymer battery with a Micro Losi 2-pin connector. Delivers 12.5A continuous burst capability with an ultra-lightweight 13.5g envelope.",
      purpose:
        "Supplies raw power to the four motors and feeds the onboard 3.3V low-dropout voltage regulator for the ESP32 and IMU.",
      specs: [
        { label: "Voltage", value: "3.7V Nominal (4.2V Peak, 3.3V Cutoff)" },
        { label: "Capacity", value: "500 mAh (1.85 Watt-Hours)" },
        { label: "Discharge Rating", value: "25C Continuous (12.5 Amps)" },
        { label: "Flight Time", value: "5 - 7 Minutes Hover" },
        { label: "Mass", value: "13.5 g" },
      ],
      explosionVector: [0, -0.16, 0],
      explosionDistance: 0.22,
    },
    {
      id: "micro-frame",
      name: "95mm X-Quad Micro-Frame with Propeller Guards",
      category: "Structure",
      meshNamePattern: /frame|chassis|guard/i,
      description:
        "Symmetric 95mm diagonal X-quad airframe with four vertical 8.5mm motor collars, an underslung battery compartment, and full 360-degree circular propeller guard rings.",
      purpose:
        "Provides high torsional rigidity under aerodynamic load and prevents propeller impacts with walls or fingers during indoor flight.",
      specs: [
        { label: "Diagonal Wheelbase", value: "95.0 mm" },
        { label: "Motor Collars", value: "8.5 mm Press-Fit" },
        { label: "Safety Guards", value: "Integrated 360° Circular Ring Ducts" },
        { label: "Mass", value: "8.0 g" },
      ],
      explosionVector: [0, 0, 0],
      explosionDistance: 0,
    },
  ],
};
