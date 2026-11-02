"use client";

import React, { useState } from "react";
import { Plus, CheckCircle2, X } from "lucide-react";
import { MachineId } from "@/types/machine";
import { TOKENS } from "@/constants/designTokens";
import MachineCard, { CatalogMachineItem } from "./MachineCard";
import Quick3DModal from "./Quick3DModal";

interface CatalogGridProps {
  onLaunchStudio: (machineId: MachineId) => void;
  onOpenAR?: (machineId: MachineId) => void;
}

const CATALOG_ITEMS: CatalogMachineItem[] = [
  {
    id: "esp32-drone",
    name: "AERO-ESP Phone Drone",
    category: "drones",
    badgeType: "NANO QUADCOPTER",
    price: "₹1,955",
    priceStatus: "verified",
    supplierInfo: "Robu.in & ElectronicsComp (Checked Oct 2026)",
    description: "DIY nano quadcopter (<250g) controlled via smartphone Wi-Fi hotspot with zero RC transmitter required.",
    imageSrc: "/images/models/esp32-drone.jpg",
    internalParts: ["ESP32-WROOM MCU", "MPU-6050 6-DOF", "4x 8520 Coreless", "1S LiPo"],
    specs: [
      { label: "MCU", value: "ESP32-WROOM" },
      { label: "Motors", value: "4× 8520 Coreless" },
      { label: "IMU", value: "MPU-6050 6-DOF" },
      { label: "Weight", value: "38g AUW" },
    ],
    tags: ["Wi-Fi SoftAP", "400Hz PID", "1S LiPo", "Student Budget"],
  },
  {
    id: "robo-racer",
    name: "ROBO-RACER AI Vision Bot",
    category: "robotics",
    badgeType: "AI RACING ROVER",
    price: "₹2,888",
    priceStatus: "verified",
    supplierInfo: "Robu.in & ElectronicsComp (SolidWorks CAD BOM)",
    description: "Autonomous 4WD obstacle-racing rover with Hikvision 1080p camera on SG90 pan neck, HC-SR04 ultrasonic sonar, and gullwing hood ('Dhakna').",
    imageSrc: "/images/models/robo-racer.jpg",
    internalParts: ["Hikvision 1080p", "HC-SR04 Sonar", "SG90 Pan Servo", "L298N Driver", "2S Li-ion"],
    specs: [
      { label: "Vision", value: "Hikvision DS-U02" },
      { label: "Sonar", value: "HC-SR04 2cm-400cm" },
      { label: "Motors", value: "4× 300 RPM 4WD" },
      { label: "Brain", value: "ESP32 Dual-Core" },
    ],
    tags: ["Hikvision AI", "Ultrasonic Reflex", "Gullwing Dhakna", "4WD Chevron"],
  },
  {
    id: "ropeway-robot",
    name: "AeroClimb Horizon-X1 Climber",
    category: "robotics",
    badgeType: "CABLE TRAVERSER",
    price: "₹840",
    priceStatus: "verified",
    supplierInfo: "Robu.in & Local Hardware (Low-Cost DIY)",
    description: "Autonomous cableway robot with human-like hand-over-hand reciprocating gripper motion, dual V-sheaves, and 45° incline climbing.",
    imageSrc: "/images/models/robo-racer.jpg",
    internalParts: ["Dual Gripper Arms", "Worm Drive Motor", "Overhead V-Sheaves", "2S Li-ion Battery"],
    specs: [
      { label: "Motion", value: "Hand-over-Hand" },
      { label: "Drive", value: "Self-Locking Worm" },
      { label: "Slope", value: "Up to 45°" },
      { label: "Cable", value: "2mm–6mm Wire" },
    ],
    tags: ["Reciprocating Arms", "Cable Traverser", "Worm Gear", "Hand-over-Hand"],
  },
  {
    id: "robo-rumble",
    name: "Robo Rumble Battle Car",
    category: "robotics",
    badgeType: "COMBAT BOT",
    price: "₹2,500 – ₹13,500",
    priceStatus: "estimated",
    supplierInfo: "Recycled scrap sourcing to full competition kit",
    description: "High-torque 4WD combat robot with interchangeable kinetic armor and obstacle course telemetry.",
    imageSrc: "/images/models/robo-rumble.jpg",
    internalParts: ["Hardened Wedge Blade", "4WD TT Motors", "L298N H-Bridge", "Spike Tires"],
    specs: [
      { label: "Drive", value: "4WD TT Geared" },
      { label: "Driver", value: "L298N Dual H-Bridge" },
      { label: "Chassis", value: "3mm Acrylic / PETG" },
      { label: "Power", value: "2S 7.4V Li-ion" },
    ],
    tags: ["Combat Robotics", "Obstacle Track", "Kinetic Wedge", "Arena"],
  },
  {
    id: "aero-450",
    name: "AERO-450 Modular Drone",
    category: "drones",
    badgeType: "MODULAR DRONE",
    price: "₹12,000 – ₹13,000",
    priceStatus: "verified",
    supplierInfo: "Robu.in F450 Quad Kit BOM (Checked Oct 2026)",
    description: "Full-scale 450mm carbon quadcopter with Pixhawk autopilot, 2212 920KV BLDC motors, and GPS position hold.",
    imageSrc: "/images/models/aero-450.jpg",
    internalParts: ["Pixhawk APM 2.8", "4x 2212 920KV", "30A SimonK ESC", "U-Blox GPS Mast"],
    specs: [
      { label: "Airframe", value: "FlameWheel 450mm" },
      { label: "Motors", value: "4× 2212 920KV BLDC" },
      { label: "ESCs", value: "4× 30A SimonK" },
      { label: "Autopilot", value: "Pixhawk / APM 2.8" },
    ],
    tags: ["APM Flight", "GPS Telemetry", "1045 Props", "Aerial Imaging"],
  },
  {
    id: "drone-b",
    name: "Drone B Industrial Octocopter",
    category: "aerial",
    badgeType: "OCTOCOPTER",
    price: "₹11,955 – ₹35,000",
    priceStatus: "estimated",
    supplierInfo: "Commercial frame & coaxial power bus estimate",
    description: "8-motor heavy payload industrial multi-rotor with dual battery redundancy and fail-safe recovery.",
    imageSrc: "/images/models/drone-b.jpg",
    internalParts: ["8x Coaxial BLDC", "Carbon Mainframe", "915MHz Telemetry", "Dual Battery Bus"],
    specs: [
      { label: "Motors", value: "8× Coaxial BLDC" },
      { label: "Payload", value: "Up to 3.5 kg" },
      { label: "Structure", value: "Carbon Lattice Tube" },
      { label: "Link", value: "915MHz Telemetry" },
    ],
    tags: ["Heavy Payload", "Coaxial Redundancy", "Dual Battery", "Carbon Tube"],
  },
  {
    id: "sports-car",
    name: "Apex GT-V6 Supercar",
    category: "vehicles",
    badgeType: "AUTOMOTIVE CAD",
    price: "₹8,500 – ₹14,000",
    priceStatus: "estimated",
    supplierInfo: "RC track telemetry & complete CAD disassembly model",
    description: "Mid-engine track supercar featuring 3.0L twin-turbocharged V6 internal combustion engine sub-assembly.",
    imageSrc: "/images/models/sports-car.jpg",
    internalParts: ["3.0L Twin-Turbo V6", "Pistons & Crankshaft", "Brembo Carbon Brakes", "Aero Diffuser"],
    specs: [
      { label: "Powertrain", value: "3.0L Twin-Turbo V6" },
      { label: "Sub-Assembly", value: "Pistons & Crankshaft" },
      { label: "Brakes", value: "Carbon-Ceramic Brembo" },
      { label: "Aero Cd", value: "0.31 Drag Coeff" },
    ],
    tags: ["V6 Teardown", "Aerodynamics", "Mechanical CAD", "Suspension"],
  },
  {
    id: "walking-robot",
    name: "Theo Jansen Walking Robot",
    category: "robotics",
    badgeType: "KINETIC LINKAGE",
    price: "₹250 – ₹1,200",
    priceStatus: "verified",
    supplierInfo: "Direct BO motor & craft materials (Verified Oct 2026)",
    description: "Chebyshev and Theo Jansen eight-bar mechanical linkage converting continuous motor rotation into smooth walking gait.",
    imageSrc: "/images/models/walking-robot.jpg",
    internalParts: ["8-Bar Jansen Legs", "Dual-Shaft Motor", "Crankshaft Axle", "Laser Acrylic"],
    specs: [
      { label: "Linkage", value: "Strandbeest 8-Bar" },
      { label: "Actuator", value: "Dual-Shaft BO Motor" },
      { label: "Speed", value: "60 RPM @ 3.0V" },
      { label: "Clearance", value: "12mm Step Height" },
    ],
    tags: ["Strandbeest", "Kinematics", "Laser-Cut Acrylic", "Scrap Sourcing"],
  },
  {
    id: "electric-fan",
    name: "Industrial Electric Table Fan",
    category: "industrial",
    badgeType: "ELECTROMECHANICAL",
    price: "₹1,200 – ₹2,400",
    priceStatus: "estimated",
    supplierInfo: "Appliance motor components & CFD model",
    description: "BLDC table fan with dynamic oscillation gearbox, copper stator winding sub-assembly, and CFD airflow physics.",
    imageSrc: "/images/models/electric-fan.jpg",
    internalParts: ["Copper Stator Coil", "3-Blade Airfoil", "350:1 Worm Gearbox", "Thermal Fuse"],
    specs: [
      { label: "Motor", value: "4-Pole Shaded Induction" },
      { label: "Speeds", value: "850 / 1150 / 1450 RPM" },
      { label: "Airfoil", value: "3-Blade Aerodynamic" },
      { label: "Oscillation", value: "350:1 Worm Gearbox" },
    ],
    tags: ["CFD Airflow", "Motor Teardown", "Thermal Fuse", "Oscillation"],
  },
];

type CategoryFilter = "all" | "drones" | "robotics" | "vehicles" | "aerial" | "industrial";

export default function CatalogGrid({ onLaunchStudio, onOpenAR }: CatalogGridProps) {
  const [filter, setFilter] = useState<CategoryFilter>("all");
  const [quickPreviewId, setQuickPreviewId] = useState<MachineId | null>(null);
  const [showRequestModal, setShowRequestModal] = useState<boolean>(false);
  const [requestText, setRequestText] = useState<string>("");
  const [requestSubmitted, setRequestSubmitted] = useState<boolean>(false);

  const filteredItems =
    filter === "all" ? CATALOG_ITEMS : CATALOG_ITEMS.filter((item) => item.category === filter);

  const categories = [
    { id: "all" as CategoryFilter, label: "All Machines" },
    { id: "drones" as CategoryFilter, label: "Drones" },
    { id: "robotics" as CategoryFilter, label: "Robotics" },
    { id: "vehicles" as CategoryFilter, label: "Vehicles" },
    { id: "aerial" as CategoryFilter, label: "Aerial" },
    { id: "industrial" as CategoryFilter, label: "Industrial" },
  ];

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestText.trim()) return;
    setRequestSubmitted(true);
    setTimeout(() => {
      setShowRequestModal(false);
      setRequestSubmitted(false);
      setRequestText("");
    }, 1800);
  };

  const activeQuickItem = CATALOG_ITEMS.find((item) => item.id === quickPreviewId);

  return (
    <section
      id="catalog"
      className="relative w-full py-14 sm:py-20 px-4 sm:px-6 md:px-12 border-t border-white/5 overflow-hidden"
      style={{ backgroundColor: TOKENS.colors.background }}
    >
      <div className="max-w-7xl mx-auto flex flex-col space-y-8 sm:space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 sm:space-y-3">
            <div className="text-[10px] sm:text-[11px] font-mono tracking-widest text-[#9AA0A9] uppercase">
              Machine Catalog
            </div>
            <h2 className="text-2xl sm:text-4xl font-light text-[#F4F5F7] tracking-tight">
              Explore Engineering{" "}
              <span className="font-semibold" style={{ color: TOKENS.colors.accent }}>
                Machines
              </span>
              .
            </h2>
            <p className="text-xs sm:text-sm text-[#9AA0A9] max-w-xl leading-relaxed">
              Every project includes verified 3D CAD files, visual previews of internal parts, assembly explosion steps, real wiring diagrams,
              and BOM sourcing with verified Indian component prices.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1 max-w-full">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                  filter === cat.id
                    ? "bg-[#161A1F] text-white border border-white/30"
                    : "bg-[#0F1114] text-[#9AA0A9] border border-white/5 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <MachineCard
              key={item.id}
              item={item}
              onLaunch={onLaunchStudio}
              onOpenAR={onOpenAR}
              onOpenQuick3D={(id) => setQuickPreviewId(id)}
            />
          ))}

          {/* Request a Machine Card */}
          <div
            onClick={() => setShowRequestModal(true)}
            className="group relative rounded-2xl border border-dashed border-white/10 bg-[#0F1114]/50 hover:border-white/30 hover:bg-[#0F1114] transition-all duration-300 p-8 flex flex-col items-center justify-center text-center space-y-4 cursor-pointer"
            style={{ borderRadius: TOKENS.radii.card }}
          >
            <div className="w-12 h-12 rounded-full border border-white/10 bg-[#161A1F] flex items-center justify-center text-[#9AA0A9] group-hover:text-white group-hover:border-[#FF6A1A] transition-all">
              <Plus size={20} />
            </div>
            <div>
              <h3 className="text-lg font-light text-[#F4F5F7]">Request a Machine</h3>
              <p className="text-xs text-[#9AA0A9] mt-1 max-w-xs">
                Suggest an open-source robot, drone, or industrial mechanism for our next CAD release.
              </p>
            </div>
            <span className="text-xs font-mono text-[#FF6A1A] group-hover:underline">
              Submit Proposal →
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Quick 3D Preview Modal */}
      {quickPreviewId && activeQuickItem && (
        <Quick3DModal
          machineId={quickPreviewId}
          machineName={activeQuickItem.name}
          onClose={() => setQuickPreviewId(null)}
          onLaunchFullStudio={(id) => {
            setQuickPreviewId(null);
            onLaunchStudio(id);
          }}
          onOpenAR={onOpenAR}
        />
      )}

      {/* Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-md p-6 rounded-2xl border border-white/10 bg-[#0F1114] text-white shadow-2xl">
            <button
              onClick={() => setShowRequestModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
            >
              <X size={18} />
            </button>

            {requestSubmitted ? (
              <div className="py-8 flex flex-col items-center text-center space-y-3">
                <CheckCircle2 size={40} style={{ color: TOKENS.colors.status.verified }} />
                <h4 className="text-lg font-light">Proposal Received</h4>
                <p className="text-xs text-[#9AA0A9]">
                  Thank you! Our engineering team will review your suggested hardware design.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRequestSubmit} className="space-y-4">
                <div className="space-y-1">
                  <h4 className="text-lg font-light">Suggest a New Machine</h4>
                  <p className="text-xs text-[#9AA0A9]">
                    What hardware project or robot mechanism would you like to simulate and build?
                  </p>
                </div>

                <textarea
                  value={requestText}
                  onChange={(e) => setRequestText(e.target.value)}
                  placeholder="e.g. 6-DOF Robotic Arm using MG996R Servos, Bi-Copter, or Stirling Engine..."
                  rows={4}
                  className="w-full p-3 rounded-xl border border-white/10 bg-[#07080A] text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6A1A]"
                  required
                />

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl text-xs font-mono font-semibold text-white tracking-wider uppercase transition-all"
                  style={{ backgroundColor: TOKENS.colors.accent }}
                >
                  Submit Hardware Proposal
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
