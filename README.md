# 🚀 Mechverse — Interactive 3D Engineering & Hardware Simulation Platform

> **Design, Simulate & Physically Build Real Machines.**  
> From ESP32 micro-drones to combat robots — design in real-time 3D, simulate with 400Hz physics, and build with verified hardware guides, schematics, and Bill of Materials (BOM).

---

## 🌟 Overview

**Mechverse** is an interactive web-based 3D computer-aided engineering (CAE) and hardware prototyping studio. It bridges the gap between digital 3D models and real-world hardware construction for students, makers, and robotics engineers.

- 🕹️ **Interactive 3D Viewers**: Real-time rendering with WebGL / Three.js / React Three Fiber.
- 💥 **Exploded CAD & Assembly**: Inspect every internal component, layer-by-layer exploded animation, and sub-assembly inspection.
- ⚡ **400Hz Physics Simulation**: Flight dynamics, PID loop responses, wheel slip, ground friction, and obstacle collision.
- 📱 **Virtual Phone Hotspot Controller**: Fly micro-drones directly via on-screen dual-stick touch controls or laptop keyboard.
- 📐 **Complete Engineering Guides**: Full schematics, ESP32 pin mappings, soldering tutorials, and verified component shopping lists with Indian suppliers.

---

## 🤖 Featured Machines

| Machine | Class | Tech Stack & Features | Status |
|---|---|---|---|
| **AERO-ESP Phone Drone** | Nano Quadcopter (≤250g) | ESP32-WROOM, MPU6050 IMU, 8520 coreless motors, SI2302 MOSFETs, 1S LiPo, Wi-Fi UDP | ✅ Fully Operable |
| **AeroClimb Horizon-X1 Cable Traverser** | Cableways & Inspection | Dual overhead V-sheaves, spring pinch rollers, non-reversing worm gear, 4K inspection gimbal | ✅ Fully Operable |
| **Robo Rumble Battle Arena** | Combat Robot | Dual N20 high-torque gearmotors, L298N/DRV8833, kinetic weapon blade, dynamic arena | ✅ Fully Operable |
| **AERO-450 Modular Drone** | Aerial Photography | 450mm carbon frame, 2212 920KV BLDCs, 30A ESCs, APM/Pixhawk telemetry, GPS mount | ✅ Fully Operable |
| **Drone B Industrial Octocopter** | Heavy Payload | 8-rotor coaxial/radial lattice frame, dual battery redundancy, high-thrust BLDCs | ✅ Fully Operable |
| **Apex GT-V6 Supercar (FPV)** | High-Speed RC / FPV | Dual-mode chassis, active suspension kinematics, live speed and motor temp telemetry | ✅ Fully Operable |
| **Theo Jansen Walking Robot** | Kinetic Linkage | Strandbeest 8-bar linkage mechanism, planetary gear reduction, multi-leg walking gait | ✅ Fully Operable |
| **Industrial Electric Table Fan** | Aerodynamics & Thermal | BLDC motor stator/rotor, aerodynamic airfoil blades, CFD particle stream, oscillation | ✅ Fully Operable |

---

## 🛠️ Architecture & Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: TypeScript
- **3D Engine**: Three.js, `@react-three/fiber`, `@react-three/drei`
- **Styling**: Tailwind CSS, Lucide Icons, Glassmorphism UI
- **Physics**: Real-time numerical kinematics & PID attitude stabilization loop

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/yashharfode/Mechverse.git
cd Mechverse
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 📱 Hardware Build Guide: ESP32 Phone Drone

Mechverse includes a complete Indian student budget build guide (under ₹2,000 INR):
1. **Microcontroller**: ESP32 NodeMCU / ESP32-WROOM-32 (~₹280)
2. **IMU**: MPU-6050 6-DOF Accelerometer + Gyro (~₹130)
3. **Motors**: 4× 8520 Coreless Brushed Motors (2× CW, 2× CCW) (~₹380)
4. **Propellers**: 55mm Micro Quad props (~₹70)
5. **Drivers**: 4× SI2302 N-Channel MOSFETs + 1N5819 Schottky Flyback Diodes (~₹60)
6. **Battery**: 1S 3.7V 380–500mAh 25C LiPo + TP4056 USB-C Charger (~₹320)
7. **Control**: Direct Wi-Fi SoftAP Hotspot — no RC transmitter required!

---

## 📄 License

Copyright (c) 2026 Yash. All Rights Reserved. See [LICENSE](LICENSE) for full terms.
