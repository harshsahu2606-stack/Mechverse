import { MachineId } from "@/types/machine";

export interface SchematicWire {
  id: string;
  fromName: string;
  toName: string;
  netName: string;
  type: "power" | "ground" | "pwm" | "data" | "signal";
  color: string;
  path: string; // SVG path definition
}

export interface SchematicBlock {
  id: string;
  title: string;
  category: "mcu" | "power" | "driver" | "sensor" | "actuator" | "radio";
  subtitle: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  pins: { id: string; label: string; side: "left" | "right" | "top" | "bottom" }[];
}

export interface PinoutRow {
  mcuPin: string;
  component: string;
  componentPin: string;
  signalType: string;
  voltage: string;
  functionDesc: string;
}

export interface MachineElectronicsData {
  machineId: MachineId;
  name: string;
  headline: string;
  powerSystem: {
    battery: string;
    nominalVoltage: string;
    maxDischarge: string;
    regulation: string;
  };
  voltageRails: { rail: string; voltage: string; color: string; role: string }[];
  blocks: SchematicBlock[];
  wires: SchematicWire[];
  pinouts: PinoutRow[];
  safetyDirectives: string[];
}

export const ELECTRONICS_DATA_MAP: Record<string, MachineElectronicsData> = {
  "esp32-drone": {
    machineId: "esp32-drone",
    name: "AERO-ESP Phone Drone",
    headline: "ESP32 SoftAP Wi-Fi + SI2302 N-MOSFET Quad Driver & MPU-6050 Architecture",
    powerSystem: {
      battery: "1S 500mAh 25C LiPo",
      nominalVoltage: "3.7V DC (4.2V Max Charge, 3.3V Cutoff)",
      maxDischarge: "12.5A Burst Discharge (25C × 0.5Ah)",
      regulation: "ME6211 Ultra-Low-Dropout 3.3V 500mA LDO Regulator",
    },
    voltageRails: [
      { rail: "VBAT (3.7V)", voltage: "3.2V – 4.2V DC", color: "#ef4444", role: "High-current brushed motor rail" },
      { rail: "VCC (3.3V)", voltage: "3.30V ± 1.5%", color: "#f59e0b", role: "ESP32 logic, MPU-6050 sensor core" },
      { rail: "GND", voltage: "0.0V Return", color: "#64748b", role: "Common reference return bus" },
      { rail: "PWM (20kHz)", voltage: "0 – 3.3V Peak", color: "#06b6d4", role: "MOSFET gate gate-drive control" },
    ],
    blocks: [
      {
        id: "battery",
        title: "1S LiPo Battery",
        subtitle: "3.7V 500mAh 25C",
        category: "power",
        x: 40,
        y: 70,
        width: 140,
        height: 70,
        color: "#ef4444",
        pins: [
          { id: "bat-plus", label: "VBAT (+)", side: "right" },
          { id: "bat-gnd", label: "GND (-)", side: "right" },
        ],
      },
      {
        id: "regulator",
        title: "ME6211 3.3V LDO",
        subtitle: "Low-Noise 500mA",
        category: "power",
        x: 230,
        y: 70,
        width: 130,
        height: 70,
        color: "#f59e0b",
        pins: [
          { id: "ldo-in", label: "VIN", side: "left" },
          { id: "ldo-out", label: "3V3 OUT", side: "right" },
          { id: "ldo-gnd", label: "GND", side: "bottom" },
        ],
      },
      {
        id: "esp32",
        title: "ESP32-WROOM-32",
        subtitle: "Dual-Core 240MHz / SoftAP",
        category: "mcu",
        x: 420,
        y: 50,
        width: 200,
        height: 200,
        color: "#38bdf8",
        pins: [
          { id: "esp-3v3", label: "3V3", side: "left" },
          { id: "esp-gnd", label: "GND", side: "left" },
          { id: "esp-sda", label: "GPIO 21 (SDA)", side: "top" },
          { id: "esp-scl", label: "GPIO 22 (SCL)", side: "top" },
          { id: "esp-m1", label: "GPIO 13 (M1)", side: "right" },
          { id: "esp-m2", label: "GPIO 12 (M2)", side: "right" },
          { id: "esp-m3", label: "GPIO 14 (M3)", side: "right" },
          { id: "esp-m4", label: "GPIO 27 (M4)", side: "right" },
          { id: "esp-vbat", label: "GPIO 34 (ADC)", side: "bottom" },
        ],
      },
      {
        id: "mpu6050",
        title: "MPU-6050 6-DOF IMU",
        subtitle: "Gyro + Accelerometer",
        category: "sensor",
        x: 420,
        y: 290,
        width: 170,
        height: 80,
        color: "#10b981",
        pins: [
          { id: "imu-vcc", label: "VCC 3.3V", side: "left" },
          { id: "imu-sda", label: "SDA", side: "top" },
          { id: "imu-scl", label: "SCL", side: "top" },
          { id: "imu-gnd", label: "GND", side: "right" },
        ],
      },
      {
        id: "mosfets",
        title: "4× SI2302 N-MOSFETs",
        subtitle: "+ 1N5819 Schottky Clamp",
        category: "driver",
        x: 680,
        y: 60,
        width: 170,
        height: 170,
        color: "#a855f7",
        pins: [
          { id: "mos-in", label: "Gates (PWM)", side: "left" },
          { id: "mos-vbat", label: "VBAT (+)", side: "top" },
          { id: "mos-out", label: "M1..M4 (-)", side: "right" },
          { id: "mos-gnd", label: "Source GND", side: "bottom" },
        ],
      },
      {
        id: "motors",
        title: "4× 8520 Coreless Motors",
        subtitle: "3.7V 37,000 RPM",
        category: "actuator",
        x: 910,
        y: 80,
        width: 150,
        height: 130,
        color: "#f97316",
        pins: [
          { id: "mot-plus", label: "VBAT (+)", side: "left" },
          { id: "mot-minus", label: "Drain (-)", side: "left" },
        ],
      },
    ],
    wires: [
      { id: "w1", fromName: "Battery (+)", toName: "ME6211 VIN", netName: "VBAT+", type: "power", color: "#ef4444", path: "M 180 90 L 230 90" },
      { id: "w2", fromName: "ME6211 3V3", toName: "ESP32 3V3", netName: "+3.3V LDO", type: "power", color: "#f59e0b", path: "M 360 90 L 420 90" },
      { id: "w3", fromName: "ME6211 3V3", toName: "MPU-6050 VCC", netName: "+3.3V Sensor", type: "power", color: "#f59e0b", path: "M 390 90 L 390 320 L 420 320" },
      { id: "w4", fromName: "Battery (+)", toName: "MOSFET VBAT Rail", netName: "VBAT Power", type: "power", color: "#ef4444", path: "M 180 90 L 180 30 L 760 30 L 760 60" },
      { id: "w5", fromName: "ESP32 I2C", toName: "MPU-6050 (SDA/SCL)", netName: "I2C 400kHz", type: "data", color: "#10b981", path: "M 480 250 L 480 290" },
      { id: "w6", fromName: "ESP32 PWM", toName: "MOSFET Gates", netName: "PWM CH1-4", type: "pwm", color: "#06b6d4", path: "M 620 120 L 680 120" },
      { id: "w7", fromName: "MOSFET Drains", toName: "8520 Motor Negatives", netName: "Switched GND", type: "pwm", color: "#a855f7", path: "M 850 140 L 910 140" },
      { id: "w8", fromName: "Common GND", toName: "All Nodes Return", netName: "System GND", type: "ground", color: "#64748b", path: "M 180 125 L 295 125 L 295 140 M 295 125 L 470 125 L 470 250 M 470 125 L 765 125 L 765 230" },
    ],
    pinouts: [
      { mcuPin: "GPIO 13", component: "SI2302 Q1 (Front-Right)", componentPin: "Gate (100Ω + 10kΩ pulldown)", signalType: "Hardware PWM (20kHz)", voltage: "3.3V Logic", functionDesc: "Controls Front-Right M1 Motor thrust" },
      { mcuPin: "GPIO 12", component: "SI2302 Q2 (Rear-Right)", componentPin: "Gate (100Ω + 10kΩ pulldown)", signalType: "Hardware PWM (20kHz)", voltage: "3.3V Logic", functionDesc: "Controls Rear-Right M2 Motor thrust" },
      { mcuPin: "GPIO 14", component: "SI2302 Q3 (Rear-Left)", componentPin: "Gate (100Ω + 10kΩ pulldown)", signalType: "Hardware PWM (20kHz)", voltage: "3.3V Logic", functionDesc: "Controls Rear-Left M3 Motor thrust" },
      { mcuPin: "GPIO 27", component: "SI2302 Q4 (Front-Left)", componentPin: "Gate (100Ω + 10kΩ pulldown)", signalType: "Hardware PWM (20kHz)", voltage: "3.3V Logic", functionDesc: "Controls Front-Left M4 Motor thrust" },
      { mcuPin: "GPIO 21", component: "MPU-6050 IMU", componentPin: "SDA (Serial Data)", signalType: "I2C Bus (4.7kΩ pull-up)", voltage: "3.3V Logic", functionDesc: "400kHz attitude and angular rate stream" },
      { mcuPin: "GPIO 22", component: "MPU-6050 IMU", componentPin: "SCL (Serial Clock)", signalType: "I2C Bus (4.7kΩ pull-up)", voltage: "3.3V Logic", functionDesc: "400kHz I2C master synchronization clock" },
      { mcuPin: "GPIO 34", component: "Voltage Divider", componentPin: "Mid-Point (100kΩ / 100kΩ)", signalType: "Analog Input (ADC1)", voltage: "0 – 2.1V Max", functionDesc: "Calibrated 1S LiPo real-time battery voltage sensing" },
    ],
    safetyDirectives: [
      "Inductive Flyback Protection: Always install a 1N5819 Schottky diode across each motor (Cathode to VBAT+, Anode to MOSFET Drain). Omission burns the MOSFET within 5 seconds due to -35V back-EMF spikes.",
      "Gate Pulldowns: 10kΩ resistors from each MOSFET Gate to GND are mandatory. Without them, floating GPIOs during boot will cause uncommanded full-throttle spinouts.",
      "Vibration Damping: Mount the MPU-6050 breakout on 2mm thick double-sided foam tape directly on the center fuselage to prevent high-frequency (600Hz) motor resonance from blinding the IMU.",
    ],
  },

  "aero-450": {
    machineId: "aero-450",
    name: "AERO-450 Modular Drone",
    headline: "Pixhawk 2.4.8 Autopilot + 30A Opto ESCs + NEO-M8N GPS Interconnect Architecture",
    powerSystem: {
      battery: "3S 4200mAh 35C LiPo Pack",
      nominalVoltage: "11.1V DC (12.6V Full, 10.5V Cutoff)",
      maxDischarge: "147 Amps Burst (35C × 4.2Ah)",
      regulation: "Pixhawk PM02 Power Module (5.3V 3A BEC with Hall Current Shunt)",
    },
    voltageRails: [
      { rail: "VBAT (11.1V)", voltage: "10.5V – 12.6V DC", color: "#ef4444", role: "High-power ESC main bus (XT60)" },
      { rail: "BEC 5.3V", voltage: "5.35V ± 0.1V", color: "#f59e0b", role: "Pixhawk autopilot, GPS & receiver power" },
      { rail: "GND", voltage: "0.0V Return", color: "#64748b", role: "Heavy ground plane return bus" },
      { rail: "PWM (400Hz)", voltage: "0 – 3.3V Signal", color: "#06b6d4", role: "Servo rail electronic speed control pulses" },
    ],
    blocks: [
      {
        id: "battery-3s",
        title: "3S LiPo Battery",
        subtitle: "11.1V 4200mAh 35C",
        category: "power",
        x: 40,
        y: 80,
        width: 150,
        height: 70,
        color: "#ef4444",
        pins: [
          { id: "bat-xt60", label: "XT60 (11.1V)", side: "right" },
        ],
      },
      {
        id: "power-module",
        title: "PM02 Power Module",
        subtitle: "5.3V 3A + Current Shunt",
        category: "power",
        x: 230,
        y: 60,
        width: 160,
        height: 100,
        color: "#f59e0b",
        pins: [
          { id: "pm-in", label: "XT60 IN", side: "left" },
          { id: "pm-out", label: "PDB (11.1V)", side: "right" },
          { id: "pm-bec", label: "POWER (5.3V)", side: "bottom" },
        ],
      },
      {
        id: "pixhawk",
        title: "Pixhawk 2.4.8 Autopilot",
        subtitle: "32-Bit ARM Cortex-M4",
        category: "mcu",
        x: 430,
        y: 50,
        width: 220,
        height: 220,
        color: "#38bdf8",
        pins: [
          { id: "px-pwr", label: "POWER IN (5.3V)", side: "left" },
          { id: "px-gps", label: "GPS / I2C PORT", side: "top" },
          { id: "px-telem", label: "TELEM 1 (UART)", side: "bottom" },
          { id: "px-rc", label: "RC IN (PPM/SBUS)", side: "left" },
          { id: "px-main", label: "MAIN OUT 1..4", side: "right" },
        ],
      },
      {
        id: "gps-module",
        title: "NEO-M8N GPS & Compass",
        subtitle: "Dual GNSS + HMC5883L",
        category: "sensor",
        x: 430,
        y: 300,
        width: 180,
        height: 80,
        color: "#10b981",
        pins: [
          { id: "gps-port", label: "UART + I2C", side: "top" },
        ],
      },
      {
        id: "escs",
        title: "4× 30A SimonK ESCs",
        subtitle: "Opto-Isolated Speed Controllers",
        category: "driver",
        x: 700,
        y: 60,
        width: 170,
        height: 180,
        color: "#a855f7",
        pins: [
          { id: "esc-pwm", label: "PWM CH1-4", side: "left" },
          { id: "esc-vbat", label: "11.1V VMS", side: "top" },
          { id: "esc-3phase", label: "3-Phase AC", side: "right" },
        ],
      },
      {
        id: "motors-bldc",
        title: "4× 2212 920KV Motors",
        subtitle: "Brushless Outrunners",
        category: "actuator",
        x: 920,
        y: 70,
        width: 150,
        height: 150,
        color: "#f97316",
        pins: [
          { id: "mot-u-v-w", label: "Phase U / V / W", side: "left" },
        ],
      },
    ],
    wires: [
      { id: "pw1", fromName: "Battery XT60", toName: "Power Module", netName: "11.1V VBAT", type: "power", color: "#ef4444", path: "M 190 110 L 230 110" },
      { id: "pw2", fromName: "Power Module", toName: "PDB to ESCs", netName: "11.1V High-Amps", type: "power", color: "#ef4444", path: "M 390 100 L 700 100" },
      { id: "pw3", fromName: "Power Module BEC", toName: "Pixhawk POWER", netName: "5.3V Clean BEC", type: "power", color: "#f59e0b", path: "M 310 160 L 310 200 L 430 200" },
      { id: "pw4", fromName: "Pixhawk Main Out", toName: "SimonK Signal Rail", netName: "400Hz PWM (CH1-4)", type: "pwm", color: "#06b6d4", path: "M 650 120 L 700 120" },
      { id: "pw5", fromName: "Pixhawk GPS Port", toName: "NEO-M8N Module", netName: "GPS Serial + Compass I2C", type: "data", color: "#10b981", path: "M 520 270 L 520 300" },
      { id: "pw6", fromName: "ESC 3-Phase", toName: "2212 BLDC Stator", netName: "Trapezoidal 3-Phase", type: "power", color: "#f97316", path: "M 870 130 L 920 130" },
    ],
    pinouts: [
      { mcuPin: "MAIN OUT 1", component: "ESC 1 (Front-Right)", componentPin: "Servo Signal (White Wire)", signalType: "400Hz Hardware PWM", voltage: "3.3V Logic", functionDesc: "Drives Motor 1 (CCW) rotation" },
      { mcuPin: "MAIN OUT 2", component: "ESC 2 (Rear-Left)", componentPin: "Servo Signal (White Wire)", signalType: "400Hz Hardware PWM", voltage: "3.3V Logic", functionDesc: "Drives Motor 2 (CCW) rotation" },
      { mcuPin: "MAIN OUT 3", component: "ESC 3 (Front-Left)", componentPin: "Servo Signal (White Wire)", signalType: "400Hz Hardware PWM", voltage: "3.3V Logic", functionDesc: "Drives Motor 3 (CW) rotation" },
      { mcuPin: "MAIN OUT 4", component: "ESC 4 (Rear-Right)", componentPin: "Servo Signal (White Wire)", signalType: "400Hz Hardware PWM", voltage: "3.3V Logic", functionDesc: "Drives Motor 4 (CW) rotation" },
      { mcuPin: "GPS Port", component: "NEO-M8N Receiver", componentPin: "UART1 TX/RX (38400 baud)", signalType: "Asynchronous Serial", voltage: "5V Tolerant", functionDesc: "Provides 10Hz GPS position and velocity telemetry" },
      { mcuPin: "I2C Port", component: "HMC5883L Compass", componentPin: "SDA / SCL", signalType: "I2C Bus (100kHz)", voltage: "3.3V Logic", functionDesc: "Mast-mounted compass heading free of motor EMI" },
      { mcuPin: "TELEM 1", component: "433MHz / 915MHz Radio", componentPin: "UART2 TX/RX", signalType: "MAVLink 2 Telemetry", voltage: "5V Regulated", functionDesc: "Bidirectional Ground Control Station (QGroundControl) Link" },
    ],
    safetyDirectives: [
      "ESC BEC Red Wire Isolation: When using four ESCs with built-in BECs, disconnect the center red (+5V) wire from ESC 2, 3, and 4 before plugging into the Pixhawk servo rail to avoid circulating ground loops and regulator contention.",
      "Compass Distance: Mount the external GPS/Compass puck at least 15cm above the power distribution board on a carbon mast. Current spikes exceeding 60A through the PDB create magnetic fields that confuse the internal magnetometer.",
      "Safety Switch Interlock: Pixhawk requires physical safety button press (solid red LED) before PWM pulses are output to the ESCs, preventing accidental motor spins on battery connection.",
    ],
  },

  "drone-b": {
    machineId: "drone-b",
    name: "Drone B Industrial Octocopter",
    headline: "Pixhawk 6C STM32H753 + Matek PDB-HEX Heavy Bus & Coaxial 8-Motor Architecture",
    powerSystem: {
      battery: "6S 22.2V 16,000mAh High-Discharge LiPo",
      nominalVoltage: "22.2V DC (25.2V Peak Charge, 21.0V Cutoff)",
      maxDischarge: "160 Amps Continuous (XT90-S Anti-Spark)",
      regulation: "Dual Redundant PM06 BECs (Dual 5.2V 3A Regulators with Battery Monitoring)",
    },
    voltageRails: [
      { rail: "6S Main Bus", voltage: "21.0V – 25.2V DC", color: "#ef4444", role: "High-voltage 8x ESC power plane" },
      { rail: "Avionics BEC 1", voltage: "5.20V ± 0.05V", color: "#f59e0b", role: "Pixhawk 6C primary power rail" },
      { rail: "Payload BEC 2", voltage: "12.0V 5A Buck", color: "#eab308", role: "Gimbal, LiDAR and FPV video transmitter" },
      { rail: "GND Bus", voltage: "0.0V Solid Ground", color: "#64748b", role: "Heavy copper 4-layer ground return" },
    ],
    blocks: [
      {
        id: "battery-6s",
        title: "6S LiPo Pack",
        subtitle: "22.2V 16000mAh",
        category: "power",
        x: 40,
        y: 80,
        width: 150,
        height: 70,
        color: "#ef4444",
        pins: [
          { id: "bat-xt90", label: "XT90-S (22.2V)", side: "right" },
        ],
      },
      {
        id: "pdb-hex",
        title: "Matek PDB-HEX",
        subtitle: "140A Continuous Power Bus",
        category: "power",
        x: 230,
        y: 60,
        width: 160,
        height: 110,
        color: "#f59e0b",
        pins: [
          { id: "pdb-in", label: "22.2V IN", side: "left" },
          { id: "pdb-esc", label: "8× ESC Rails", side: "right" },
          { id: "pdb-bec", label: "Dual 5.2V BEC", side: "bottom" },
        ],
      },
      {
        id: "pixhawk-6c",
        title: "Pixhawk 6C Autopilot",
        subtitle: "STM32H753 480MHz / Dual IMU",
        category: "mcu",
        x: 430,
        y: 50,
        width: 220,
        height: 230,
        color: "#38bdf8",
        pins: [
          { id: "p6-pwr", label: "DUAL POWER IN", side: "left" },
          { id: "p6-rtk", label: "CAN 1 / RTK GPS", side: "top" },
          { id: "p6-aux", label: "MAIN 1..8 (DShot)", side: "right" },
          { id: "p6-herelink", label: "TELEM 1 (HD Link)", side: "bottom" },
        ],
      },
      {
        id: "esc-octo",
        title: "8× 40A Opto ESCs",
        subtitle: "DShot600 High-Speed Digital",
        category: "driver",
        x: 700,
        y: 60,
        width: 170,
        height: 190,
        color: "#a855f7",
        pins: [
          { id: "octo-pwm", label: "DShot 1..8", side: "left" },
          { id: "octo-pwr", label: "22.2V Bus", side: "top" },
          { id: "octo-out", label: "3-Phase Motors", side: "right" },
        ],
      },
      {
        id: "motors-octo",
        title: "8× Sunnysky V4014",
        subtitle: "400KV Coaxial Outrunners",
        category: "actuator",
        x: 920,
        y: 70,
        width: 150,
        height: 160,
        color: "#f97316",
        pins: [
          { id: "mot-coax", label: "Coaxial M1..M8", side: "left" },
        ],
      },
    ],
    wires: [
      { id: "db1", fromName: "Battery XT90-S", toName: "Matek PDB-HEX", netName: "22.2V VBAT", type: "power", color: "#ef4444", path: "M 190 115 L 230 115" },
      { id: "db2", fromName: "Matek PDB", toName: "8x ESC Rails", netName: "6S Octo Bus", type: "power", color: "#ef4444", path: "M 390 100 L 700 100" },
      { id: "db3", fromName: "Dual BEC", toName: "Pixhawk 6C", netName: "5.2V Redundant", type: "power", color: "#f59e0b", path: "M 310 170 L 310 200 L 430 200" },
      { id: "db4", fromName: "Pixhawk DShot", toName: "8x Opto ESCs", netName: "DShot600 (M1..8)", type: "pwm", color: "#06b6d4", path: "M 650 120 L 700 120" },
      { id: "db5", fromName: "8x ESCs", toName: "Coaxial BLDC Pairs", netName: "3-Phase AC Drive", type: "power", color: "#f97316", path: "M 870 130 L 920 130" },
    ],
    pinouts: [
      { mcuPin: "MAIN 1", component: "ESC 1 (Arm 1 Upper)", componentPin: "DShot Signal", signalType: "Digital DShot600", voltage: "3.3V Logic", functionDesc: "Drives Arm 1 Top Motor (CW)" },
      { mcuPin: "MAIN 2", component: "ESC 2 (Arm 1 Lower)", componentPin: "DShot Signal", signalType: "Digital DShot600", voltage: "3.3V Logic", functionDesc: "Drives Arm 1 Bottom Motor (CCW)" },
      { mcuPin: "MAIN 3", component: "ESC 3 (Arm 2 Upper)", componentPin: "DShot Signal", signalType: "Digital DShot600", voltage: "3.3V Logic", functionDesc: "Drives Arm 2 Top Motor (CCW)" },
      { mcuPin: "MAIN 4", component: "ESC 4 (Arm 2 Lower)", componentPin: "DShot Signal", signalType: "Digital DShot600", voltage: "3.3V Logic", functionDesc: "Drives Arm 2 Bottom Motor (CW)" },
      { mcuPin: "CAN 1", component: "Holybro H-RTK F9P", componentPin: "CAN H / CAN L", signalType: "Differential CAN Bus", voltage: "5V Differential", functionDesc: "Centimeter-accurate RTK positioning link" },
      { mcuPin: "TELEM 1", component: "HereLink Ground Unit", componentPin: "UART + Ethernet", signalType: "Digital HD Video & RC", voltage: "5V Logic", functionDesc: "1080p live downlink and 12-channel RC control" },
    ],
    safetyDirectives: [
      "Anti-Spark XT90-S Connector: High-voltage 6S packs cause intense contact arcing without pre-charge resistors. Always plug into the green XT90-S anti-spark female socket to prevent weld damage.",
      "Dual Redundant Power Architecture: Pixhawk 6C is fed by two independent PM06 power modules. If BEC 1 drops below 4.9V, automatic hardware switchover transfers load to BEC 2 in less than 50 microseconds.",
      "Octocopter Motor Loss Failsafe: ArduPilot firmware is configured for octagonal motor redundancy. If any single motor suffers electrical loss in flight, the coaxial twin immediately increases torque by 35% to maintain level attitude.",
    ],
  },

  "robo-racer": {
    machineId: "robo-racer",
    name: "ROBO-RACER AI Vision & Sonar Bot",
    headline: "ESP32 DevKit + L298N 4WD Dual H-Bridge + HC-SR04 Ultrasonic & Pan Servo Architecture",
    powerSystem: {
      battery: "2S 7.4V 2200mAh 18650 Li-ion Pack",
      nominalVoltage: "7.4V DC (8.4V Peak, 6.0V Cutoff)",
      maxDischarge: "10 Amps Continuous (Protected BMS)",
      regulation: "LM2596 High-Efficiency Step-Down Buck Converter (7.4V -> 5.0V @ 3A)",
    },
    voltageRails: [
      { rail: "7.4V Raw Li-ion", voltage: "6.0V – 8.4V DC", color: "#ef4444", role: "L298N VMS motor driver power input" },
      { rail: "5.0V Buck Rail", voltage: "5.00V ± 0.05V", color: "#f59e0b", role: "ESP32 VIN, SG90 servo, HC-SR04 sonar VCC" },
      { rail: "3.3V ESP32 Core", voltage: "3.30V Onboard", color: "#38bdf8", role: "ESP32 GPIO logic, ADC, Wi-Fi radio" },
      { rail: "Common Ground", voltage: "0.0V Reference", color: "#64748b", role: "Unified ground for battery, driver, and MCU" },
    ],
    blocks: [
      {
        id: "battery-2s",
        title: "2S Li-ion Battery",
        subtitle: "7.4V 2200mAh 18650",
        category: "power",
        x: 40,
        y: 80,
        width: 150,
        height: 70,
        color: "#ef4444",
        pins: [
          { id: "rr-bat", label: "7.4V (+)", side: "right" },
          { id: "rr-gnd", label: "GND (-)", side: "right" },
        ],
      },
      {
        id: "lm2596",
        title: "LM2596 Buck Converter",
        subtitle: "7.4V -> 5.0V 3A Step-Down",
        category: "power",
        x: 230,
        y: 60,
        width: 160,
        height: 90,
        color: "#f59e0b",
        pins: [
          { id: "buck-in", label: "VIN (7.4V)", side: "left" },
          { id: "buck-out", label: "5.0V OUT", side: "right" },
        ],
      },
      {
        id: "esp32-rr",
        title: "ESP32 DevKit V1",
        subtitle: "Dual-Core 240MHz",
        category: "mcu",
        x: 430,
        y: 50,
        width: 210,
        height: 220,
        color: "#38bdf8",
        pins: [
          { id: "esp-vin", label: "VIN (5.0V)", side: "left" },
          { id: "esp-sonar", label: "GPIO 5/18 (Sonar)", side: "top" },
          { id: "esp-servo", label: "GPIO 19 (Servo)", side: "top" },
          { id: "esp-pwm-l", label: "GPIO 27/25/26 (Left)", side: "right" },
          { id: "esp-pwm-r", label: "GPIO 33/14/12 (Right)", side: "right" },
        ],
      },
      {
        id: "sonar-pan",
        title: "HC-SR04 + SG90 Servo",
        subtitle: "Ultrasonic + Pan Neck",
        category: "sensor",
        x: 430,
        y: 300,
        width: 200,
        height: 90,
        color: "#10b981",
        pins: [
          { id: "snr-pwr", label: "5V / GND", side: "left" },
          { id: "snr-sig", label: "Trig / Echo / PWM", side: "top" },
        ],
      },
      {
        id: "l298n",
        title: "L298N Dual H-Bridge",
        subtitle: "4WD Geared Motor Driver",
        category: "driver",
        x: 690,
        y: 60,
        width: 180,
        height: 180,
        color: "#a855f7",
        pins: [
          { id: "l298-logic", label: "ENA / IN1..4 / ENB", side: "left" },
          { id: "l298-vms", label: "7.4V VMS", side: "top" },
          { id: "l298-out-l", label: "OUT1/2 (Left 2WD)", side: "right" },
          { id: "l298-out-r", label: "OUT3/4 (Right 2WD)", side: "right" },
        ],
      },
      {
        id: "bo-motors",
        title: "4× BO Geared Motors",
        subtitle: "300 RPM 4WD TT Motors",
        category: "actuator",
        x: 920,
        y: 80,
        width: 150,
        height: 140,
        color: "#f97316",
        pins: [
          { id: "mot-l", label: "Left 2 Motors", side: "left" },
          { id: "mot-r", label: "Right 2 Motors", side: "left" },
        ],
      },
    ],
    wires: [
      { id: "rw1", fromName: "Battery 7.4V", toName: "LM2596 Input", netName: "7.4V Raw", type: "power", color: "#ef4444", path: "M 190 100 L 230 100" },
      { id: "rw2", fromName: "Battery 7.4V", toName: "L298N VMS", netName: "7.4V Motor Bus", type: "power", color: "#ef4444", path: "M 190 100 L 190 30 L 780 30 L 780 60" },
      { id: "rw3", fromName: "LM2596 5.0V", toName: "ESP32 VIN", netName: "5.0V Regulated", type: "power", color: "#f59e0b", path: "M 390 100 L 430 100" },
      { id: "rw4", fromName: "ESP32 Control", toName: "L298N Logic Pins", netName: "PWM + Direction", type: "pwm", color: "#06b6d4", path: "M 640 120 L 690 120" },
      { id: "rw5", fromName: "L298N OUT1-4", toName: "4WD Motors", netName: "Skid-Steer Drive", type: "power", color: "#f97316", path: "M 870 140 L 920 140" },
      { id: "rw6", fromName: "ESP32 Sonar / Servo", toName: "HC-SR04 & SG90", netName: "Trig / Echo / Servo", type: "data", color: "#10b981", path: "M 535 270 L 535 300" },
    ],
    pinouts: [
      { mcuPin: "GPIO 27", component: "L298N ENA", componentPin: "Enable A (Left PWM)", signalType: "Hardware PWM (20kHz)", voltage: "3.3V Logic", functionDesc: "Controls speed of the left 2 drive wheels" },
      { mcuPin: "GPIO 25", component: "L298N IN1", componentPin: "Input 1 (Left Direction)", signalType: "Digital Output", voltage: "3.3V Logic", functionDesc: "Left wheels forward polarity" },
      { mcuPin: "GPIO 26", component: "L298N IN2", componentPin: "Input 2 (Left Direction)", signalType: "Digital Output", voltage: "3.3V Logic", functionDesc: "Left wheels reverse polarity" },
      { mcuPin: "GPIO 33", component: "L298N ENB", componentPin: "Enable B (Right PWM)", signalType: "Hardware PWM (20kHz)", voltage: "3.3V Logic", functionDesc: "Controls speed of the right 2 drive wheels" },
      { mcuPin: "GPIO 14", component: "L298N IN3", componentPin: "Input 3 (Right Direction)", signalType: "Digital Output", voltage: "3.3V Logic", functionDesc: "Right wheels forward polarity" },
      { mcuPin: "GPIO 12", component: "L298N IN4", componentPin: "Input 4 (Right Direction)", signalType: "Digital Output", voltage: "3.3V Logic", functionDesc: "Right wheels reverse polarity" },
      { mcuPin: "GPIO 5", component: "HC-SR04 Sonar", componentPin: "Trig Pin", signalType: "10µs Digital Pulse", voltage: "3.3V Logic", functionDesc: "Fires 40kHz ultrasonic burst wave" },
      { mcuPin: "GPIO 18", component: "HC-SR04 Sonar", componentPin: "Echo (via 1k/2k Divider)", signalType: "Pulse Width Measure", voltage: "3.3V Protected", functionDesc: "Measures sub-centimeter obstacle proximity" },
      { mcuPin: "GPIO 19", component: "SG90 Micro Servo", componentPin: "PWM Signal (Orange Wire)", signalType: "50Hz Standard Servo PWM", voltage: "3.3V Logic", functionDesc: "±90° horizontal optical camera neck pan" },
    ],
    safetyDirectives: [
      "Common Ground Rule: The 7.4V battery GND, LM2596 buck GND, L298N driver GND, and ESP32 GND must be connected together into a unified Common Ground. Floating grounds cause erratic motor stutter and lock up the ESP32.",
      "HC-SR04 Echo Voltage Divider: The HC-SR04 operates at 5V and outputs a 5V Echo pulse. ESP32 GPIOs are NOT 5V tolerant! Use a 1kΩ / 2kΩ resistor divider to step down the 5V Echo pulse safely to 3.3V.",
      "Buck Converter Calibration: Before plugging the LM2596 output into the ESP32 VIN pin, measure the output with a multimeter and adjust the brass trimpot until it reads exactly 5.00V.",
    ],
  },

  "robo-rumble": {
    machineId: "robo-rumble",
    name: "Robo Rumble Battle Car",
    headline: "Dual H-Bridge MOSFET Driver + NRF24L01+ Radio & Kinetic Weapon Architecture",
    powerSystem: {
      battery: "2S 7.4V 1500mAh 30C High-Discharge Li-ion",
      nominalVoltage: "7.4V DC (8.4V Peak, 6.2V Cutoff)",
      maxDischarge: "45 Amps Burst Current (30C × 1.5Ah)",
      regulation: "Heavy Duty 5V 3A Pololu Buck Regulator with Emergency SPST Kill-Switch",
    },
    voltageRails: [
      { rail: "7.4V Combat Bus", voltage: "6.2V – 8.4V DC", color: "#ef4444", role: "Direct high-torque TT motor drive and weapon ESC" },
      { rail: "5.0V Logic Rail", voltage: "5.0V Regulated", color: "#f59e0b", role: "ESP32 / Arduino logic and weapon safety relay" },
      { rail: "3.3V Radio Rail", voltage: "3.3V Low-Noise", color: "#38bdf8", role: "NRF24L01+ 2.4GHz PA/LNA wireless transceiver" },
      { rail: "Chassis Ground", voltage: "0.0V Return", color: "#64748b", role: "Low-resistance ground plane return" },
    ],
    blocks: [
      {
        id: "bat-rumble",
        title: "2S 30C Li-ion Battery",
        subtitle: "7.4V 1500mAh Combat Pack",
        category: "power",
        x: 40,
        y: 80,
        width: 160,
        height: 70,
        color: "#ef4444",
        pins: [
          { id: "rumb-bat", label: "7.4V (+)", side: "right" },
        ],
      },
      {
        id: "kill-switch",
        title: "Master Kill-Switch",
        subtitle: "Competition SPST 20A",
        category: "power",
        x: 235,
        y: 75,
        width: 140,
        height: 75,
        color: "#f59e0b",
        pins: [
          { id: "sw-in", label: "BATT IN", side: "left" },
          { id: "sw-out", label: "BUS OUT", side: "right" },
        ],
      },
      {
        id: "mcu-rumble",
        title: "Combat Flight MCU",
        subtitle: "ESP32 / NRF24 Receiver",
        category: "mcu",
        x: 420,
        y: 50,
        width: 210,
        height: 220,
        color: "#38bdf8",
        pins: [
          { id: "rumb-5v", label: "5V IN", side: "left" },
          { id: "rumb-radio", label: "SPI NRF24", side: "bottom" },
          { id: "rumb-l", label: "PWM Left (D12/D13)", side: "right" },
          { id: "rumb-r", label: "PWM Right (D14/D27)", side: "right" },
          { id: "rumb-wep", label: "Weapon ESC (D23)", side: "top" },
        ],
      },
      {
        id: "driver-rumble",
        title: "Dual H-Bridge MOSFET",
        subtitle: "2x 15A Continuous Driver",
        category: "driver",
        x: 680,
        y: 60,
        width: 180,
        height: 180,
        color: "#a855f7",
        pins: [
          { id: "dr-in", label: "PWM IN1-4", side: "left" },
          { id: "dr-pwr", label: "7.4V Main", side: "top" },
          { id: "dr-out-l", label: "Left TT Motors", side: "right" },
          { id: "dr-out-r", label: "Right TT Motors", side: "right" },
        ],
      },
      {
        id: "motors-rumble",
        title: "4× TT Geared Motors",
        subtitle: "All-Metal 1:48 Ratio 4WD",
        category: "actuator",
        x: 910,
        y: 80,
        width: 160,
        height: 140,
        color: "#f97316",
        pins: [
          { id: "tt-l", label: "Left Pair", side: "left" },
          { id: "tt-r", label: "Right Pair", side: "left" },
        ],
      },
    ],
    wires: [
      { id: "rum1", fromName: "Battery", toName: "Kill-Switch", netName: "7.4V Raw", type: "power", color: "#ef4444", path: "M 200 115 L 235 115" },
      { id: "rum2", fromName: "Kill-Switch", toName: "H-Bridge & Buck", netName: "7.4V Switched", type: "power", color: "#ef4444", path: "M 375 110 L 420 110 M 375 110 L 375 35 L 770 35 L 770 60" },
      { id: "rum3", fromName: "MCU PWM", toName: "H-Bridge Logic", netName: "Differential PWM", type: "pwm", color: "#06b6d4", path: "M 630 120 L 680 120" },
      { id: "rum4", fromName: "H-Bridge Out", toName: "4WD TT Motors", netName: "High-Torque Drive", type: "power", color: "#f97316", path: "M 860 140 L 910 140" },
    ],
    pinouts: [
      { mcuPin: "GPIO 12", component: "H-Bridge IN1", componentPin: "Left Forward PWM", signalType: "Hardware PWM (20kHz)", voltage: "3.3V Logic", functionDesc: "Forward drive for left wheel pair" },
      { mcuPin: "GPIO 13", component: "H-Bridge IN2", componentPin: "Left Reverse PWM", signalType: "Hardware PWM (20kHz)", voltage: "3.3V Logic", functionDesc: "Reverse drive for left wheel pair" },
      { mcuPin: "GPIO 14", component: "H-Bridge IN3", componentPin: "Right Forward PWM", signalType: "Hardware PWM (20kHz)", voltage: "3.3V Logic", functionDesc: "Forward drive for right wheel pair" },
      { mcuPin: "GPIO 27", component: "H-Bridge IN4", componentPin: "Right Reverse PWM", signalType: "Hardware PWM (20kHz)", voltage: "3.3V Logic", functionDesc: "Reverse drive for right wheel pair" },
      { mcuPin: "GPIO 23", component: "Weapon ESC", componentPin: "Servo Signal", signalType: "50Hz Standard PWM", voltage: "3.3V Logic", functionDesc: "High-speed spinning kinetic drum / flipper control" },
      { mcuPin: "SPI Pins", component: "NRF24L01+ Radio", componentPin: "MOSI/MISO/SCK/CSN/CE", signalType: "SPI Bus @ 8MHz", voltage: "3.3V Power", functionDesc: "Zero-latency 2.4GHz remote weapon & steering link" },
    ],
    safetyDirectives: [
      "Physical Master Power Switch: Competition robotics regulations require a high-visibility mechanical disconnect switch on the external armor. Turning off the switch must immediately de-energize the motors and weapon.",
      "NRF24 3.3V Power Decoupling: NRF24L01+ modules suffer severe packet loss from voltage drops during motor stalls. Solder a 10µF tantalum capacitor directly across the radio VCC and GND pins.",
      "Motor Snubber Diodes: Brushed TT motors generate inductive voltage spikes when reversed suddenly. Ensure the driver board includes schottky clamping diodes across all 4 motor outputs.",
    ],
  },

  "walking-robot": {
    machineId: "walking-robot",
    name: "Strandbeest Kinetic Walker",
    headline: "Dual-Direction BO Gearmotor + SP3T Polarity Reversing & PTC Protection Architecture",
    powerSystem: {
      battery: "2× 1.5V AA Cells or 1S 3.7V 14500 Li-ion",
      nominalVoltage: "3.0V – 3.7V DC Low-Voltage",
      maxDischarge: "1.2 Amps Stall Current",
      regulation: "Direct Battery Drive with 0.5A Polyfuse (PTC Resettable Protection)",
    },
    voltageRails: [
      { rail: "3.0V Drive Bus", voltage: "2.4V – 3.7V DC", color: "#ef4444", role: "Dual-shaft geared motor drive rail" },
      { rail: "Common Ground", voltage: "0.0V Return", color: "#64748b", role: "Battery negative return wire" },
    ],
    blocks: [
      {
        id: "bat-walker",
        title: "2× AA Battery Pack",
        subtitle: "3.0V DC (2× 1.5V)",
        category: "power",
        x: 60,
        y: 90,
        width: 170,
        height: 80,
        color: "#ef4444",
        pins: [
          { id: "aa-plus", label: "3.0V (+)", side: "right" },
          { id: "aa-minus", label: "GND (-)", side: "right" },
        ],
      },
      {
        id: "ptc-fuse",
        title: "0.5A Resettable Fuse",
        subtitle: "PTC Overcurrent Protection",
        category: "power",
        x: 290,
        y: 80,
        width: 160,
        height: 70,
        color: "#f59e0b",
        pins: [
          { id: "ptc-in", label: "IN", side: "left" },
          { id: "ptc-out", label: "OUT", side: "right" },
        ],
      },
      {
        id: "sp3t-switch",
        title: "SP3T Center-Off Switch",
        subtitle: "Forward / Off / Reverse",
        category: "driver",
        x: 520,
        y: 60,
        width: 180,
        height: 120,
        color: "#38bdf8",
        pins: [
          { id: "sw-in", label: "VCC / GND", side: "left" },
          { id: "sw-out", label: "Polarity Cross", side: "right" },
        ],
      },
      {
        id: "bo-motor-walker",
        title: "Dual-Shaft BO Motor",
        subtitle: "3.0V 60 RPM Geared + 100nF Cap",
        category: "actuator",
        x: 770,
        y: 70,
        width: 190,
        height: 100,
        color: "#f97316",
        pins: [
          { id: "mot-term", label: "Terminal A / B", side: "left" },
        ],
      },
    ],
    wires: [
      { id: "wlk1", fromName: "Battery (+)", toName: "PTC Fuse", netName: "3V Raw", type: "power", color: "#ef4444", path: "M 230 115 L 290 115" },
      { id: "wlk2", fromName: "PTC Fuse", toName: "SP3T Switch", netName: "Protected VCC", type: "power", color: "#f59e0b", path: "M 450 115 L 520 115" },
      { id: "wlk3", fromName: "SP3T Switch", toName: "BO Motor Terminals", netName: "Reversible Polarity", type: "power", color: "#f97316", path: "M 700 120 L 770 120" },
    ],
    pinouts: [
      { mcuPin: "Switch Pin 1", component: "BO Motor (+)", componentPin: "Terminal A", signalType: "DC Current (Forward)", voltage: "3.0V DC", functionDesc: "Drives crankshaft forward, moving 8-bar linkage ahead" },
      { mcuPin: "Switch Pin 2", component: "Center Position", componentPin: "Open Circuit", signalType: "Zero Voltage", voltage: "0.0V", functionDesc: "Safely cuts off battery power" },
      { mcuPin: "Switch Pin 3", component: "BO Motor (-)", componentPin: "Terminal B", signalType: "DC Current (Reverse)", voltage: "3.0V Inverted", functionDesc: "Reverses crankshaft rotation for backward walking gait" },
      { mcuPin: "Capacitor", component: "100nF Ceramic", componentPin: "Across Motor Terminals", signalType: "EMI Suppression", voltage: "50V Rated", functionDesc: "Snubs brush arcing spark noise and extends motor contact life" },
    ],
    safetyDirectives: [
      "Low-Voltage Safety: This circuit operates entirely at 3.0V to 3.7V DC and does NOT present any electrical shock hazard.",
      "Mechanical Jam Protection: The 0.5A PTC resettable polyfuse trips if an 8-bar linkage leg gets caught on an obstacle, preventing the BO motor coils from overheating.",
      "Never Connect to AC Mains: Strictly use AA batteries or a certified isolated 3.3V DC power adapter.",
    ],
  },
};
