"use client";

import React, { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import {
  CarFront,
  Smartphone,
  Swords,
  Plane,
  Hexagon,
  Bot,
  Fan,
  Cable,
  Sparkles,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Layers,
  Zap,
  ShieldAlert,
  Wrench,
  BookOpen,
  Cpu,
  ShoppingBag,
  Eye,
  Sliders,
  Sun,
  Moon,
  Activity,
  Flame,
  Shield,
  Star,
  ExternalLink,
  Search,
  Music,
  Plus,
  Play,
  RotateCcw,
  Check,
  Code2,
  Compass,
  GraduationCap,
  Users,
  Rocket,
  MessageSquare,
  HelpCircle,
  X,
  Globe,
  Share2,
} from "lucide-react";
import { MachineId, AppTheme } from "@/types/machine";
import Esp32DroneModel from "@/components/3d/Esp32DroneModel";

interface LandingPageProps {
  theme?: AppTheme;
  onToggleTheme?: () => void;
  onLaunchStudio: (machineId?: MachineId) => void;
}

type MachineCategory = "all" | "drones" | "robotics" | "vehicles" | "aerial" | "industrial" | "diy";

export default function LandingPage({
  theme = "dark",
  onToggleTheme,
  onLaunchStudio,
}: LandingPageProps) {
  const isLight = theme === "light";
  const [activeCategory, setActiveCategory] = useState<MachineCategory>("all");
  const [showRequestModal, setShowRequestModal] = useState<boolean>(false);
  const [requestText, setRequestText] = useState<string>("");
  const [requestSubmitted, setRequestSubmitted] = useState<boolean>(false);

  // Machine Catalog matching the uploaded design
  const allMachines = [
    {
      id: "esp32-drone" as MachineId,
      name: "AERO-ESP Phone Drone",
      category: "drones",
      badgeType: "BUDGET DIY",
      badgeColor: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
      price: "₹1,955",
      description: "DIY nano quadcopter (<250g) controlled via mobile with live video.",
      tags: ["ESP32", "3D Model", "BOM"],
      imageBg: "from-amber-500/15 to-transparent",
      modelPreview: "drone",
    },
    {
      id: "ropeway-robot" as MachineId,
      name: "AeroClimb Horizon-X1 Traverser",
      category: "robotics",
      badgeType: "CABLE TRAVERSER",
      badgeColor: "bg-sky-500/10 border-sky-500/30 text-sky-400",
      price: "₹840",
      description: "Autonomous horizontal cableway inspection robot with self-locking worm drive & 45° incline climbing.",
      tags: ["Dual Sheaves", "Worm Drive", "BOM"],
      imageBg: "from-sky-500/15 to-transparent",
      modelPreview: "rover",
    },
    {
      id: "robo-rumble" as MachineId,
      name: "Robo Rumble Battle Arena",
      category: "robotics",
      badgeType: "COMBAT ROBOT",
      badgeColor: "bg-purple-500/10 border-purple-500/30 text-purple-400",
      price: "₹2,500 – 13,500",
      description: "High-torque combat robot with weapon system.",
      tags: ["CAD", "Simulation", "Build Guide"],
      imageBg: "from-rose-500/15 to-transparent",
      modelPreview: "rover",
    },
    {
      id: "aero-450" as MachineId,
      name: "AERO-450 Modular Drone",
      category: "drones",
      badgeType: "MODULAR DRONE",
      badgeColor: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400",
      price: "₹12,000 – 13,000",
      description: "Customizable 450mm FPV drone for aerial imaging and AI projects.",
      tags: ["PX4", "Wiring", "BOM"],
      imageBg: "from-cyan-500/15 to-transparent",
      modelPreview: "quad",
    },
    {
      id: "drone-b" as MachineId,
      name: "Drone B Industrial Octocopter",
      category: "aerial",
      badgeType: "OCTOCOPTER",
      badgeColor: "bg-purple-500/10 border-purple-500/30 text-purple-400",
      price: "₹11,955",
      description: "Payload drone for industrial and research use.",
      tags: ["Lattice Frame", "3D CAD", "BOM"],
      imageBg: "from-indigo-500/15 to-transparent",
      modelPreview: "octo",
    },
    {
      id: "sports-car" as MachineId,
      name: "Apex GT-V6 Supercar (FPV)",
      category: "vehicles",
      badgeType: "RACING DRONE",
      badgeColor: "bg-pink-500/10 border-pink-500/30 text-pink-400",
      price: "₹8,500 – 14,000",
      description: "High-speed FPV machine with carbon frame and real-time video.",
      tags: ["6S LiPo", "FPV", "Simulation"],
      imageBg: "from-red-500/15 to-transparent",
      modelPreview: "car",
    },
    {
      id: "walking-robot" as MachineId,
      name: "Theo Jansen Walking Robot",
      category: "robotics",
      badgeType: "WALKING ROBOT",
      badgeColor: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
      price: "₹12,000 – 19,000",
      description: "Mechanical walking bot using Theo Jansen linkage.",
      tags: ["Linkage", "CAD", "3D Print"],
      imageBg: "from-teal-500/15 to-transparent",
      modelPreview: "walker",
    },
    {
      id: "electric-fan" as MachineId,
      name: "Industrial Electric Table Fan",
      category: "industrial",
      badgeType: "INDUSTRIAL",
      badgeColor: "bg-blue-500/10 border-blue-500/30 text-blue-400",
      price: "—",
      description: "BLDC fan with airflow and vibration simulation.",
      tags: ["CFD", "Motor", "Dynamics"],
      imageBg: "from-amber-500/15 to-transparent",
      modelPreview: "fan",
    },
  ];

  const filteredMachines =
    activeCategory === "all"
      ? allMachines
      : activeCategory === "diy"
      ? allMachines.filter((m) => m.id === "esp32-drone" || m.id === "robo-rumble")
      : allMachines.filter((m) => m.category === activeCategory);

  const categories = [
    { id: "all", label: "All Machines", icon: Layers },
    { id: "drones", label: "Drones", icon: Plane },
    { id: "robotics", label: "Robotics", icon: Bot },
    { id: "vehicles", label: "Vehicles", icon: CarFront },
    { id: "aerial", label: "Aerial", icon: Hexagon },
    { id: "industrial", label: "Industrial", icon: Fan },
    { id: "diy", label: "DIY & Kits", icon: Wrench },
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

  return (
    <div
      className={`min-h-screen w-full flex flex-col font-sans selection:bg-orange-500 selection:text-white transition-colors duration-300 ${
        isLight ? "bg-[#f8fafc] text-slate-900" : "bg-[#090a0f] text-slate-100"
      }`}
    >
      {/* ================= 1. HEADER / NAVBAR ================= */}
      <header
        className={`sticky top-0 z-50 w-full px-4 sm:px-8 py-3.5 border-b backdrop-blur-xl flex items-center justify-between transition-colors duration-300 ${
          isLight ? "bg-white/90 border-slate-200" : "bg-[#090a0f]/90 border-white/10"
        }`}
      >
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white shadow-md shadow-orange-500/30">
            <span className="font-black text-xl italic tracking-tighter">M</span>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold tracking-widest text-sm sm:text-base leading-none">
              MECHVERSE
            </span>
            <span className="text-[8px] font-mono tracking-widest text-orange-400 uppercase mt-0.5">
              Engineering Platform
            </span>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-gray-300">
          <a href="#catalog" className="hover:text-orange-400 transition">
            Machines
          </a>
          <button onClick={() => onLaunchStudio()} className="hover:text-orange-400 transition">
            Simulator
          </button>
          <a href="#workflow" className="hover:text-orange-400 transition">
            Workflow
          </a>
          <a href="#why" className="hover:text-orange-400 transition">
            Learn
          </a>
          <a href="#community" className="hover:text-orange-400 transition">
            Community
          </a>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onLaunchStudio()}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition"
            title="Search Projects"
          >
            <Search size={16} />
          </button>

          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition"
              title="Toggle Theme"
            >
              {isLight ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          )}

          <button
            onClick={() => onLaunchStudio()}
            className="hidden sm:inline-flex px-3.5 py-1.5 rounded-xl border border-white/15 hover:border-white/30 text-xs font-semibold text-gray-300 hover:text-white transition"
          >
            Sign In
          </button>

          <button
            onClick={() => onLaunchStudio()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition transform hover:scale-[1.02] active:scale-95"
          >
            <span>Launch Studio</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </header>

      {/* ================= 2. HERO SECTION ================= */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-8 pt-8 sm:pt-14 pb-12 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        {/* Left Column: Hero Text */}
        <div className="flex-1 space-y-6 text-center lg:text-left z-10">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/25 text-xs font-mono font-semibold text-orange-400">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            <span>Interactive 3D Engineering &amp; Hardware Simulation</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl xl:text-6xl font-black tracking-tight leading-[1.08] text-white">
            Design, Simulate &amp; <br />
            <span className="text-orange-500">Physically Build</span> <br />
            Real Machines.
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
            From ESP32 drones to combat robots — design in 3D, test with real physics, and build with complete hardware guides, schematics, and BOM — all in one platform.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-1">
            <button
              onClick={() => onLaunchStudio("esp32-drone")}
              className="px-6 py-3.5 rounded-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-orange-500/30 transition transform hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <Play size={14} fill="currentColor" />
              <span>Launch 3D Simulator</span>
              <ArrowRight size={14} />
            </button>

            <a
              href="#catalog"
              className="px-6 py-3.5 rounded-full border border-white/20 hover:border-white/40 text-xs sm:text-sm font-bold text-gray-200 hover:text-white bg-white/5 hover:bg-white/10 transition"
            >
              Explore Machines
            </a>
          </div>

          {/* Feature Icon Strip Under CTA */}
          <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-gray-400 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <Layers size={14} className="text-orange-400" />
              <span>3D Design &amp; Assembly</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Activity size={14} className="text-cyan-400" />
              <span>Physics Simulation</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Cpu size={14} className="text-amber-400" />
              <span>Circuit &amp; Wiring Guides</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShoppingBag size={14} className="text-emerald-400" />
              <span>BOM &amp; Sourcing</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Wrench size={14} className="text-rose-400" />
              <span>Build &amp; Test</span>
            </div>
          </div>
        </div>

        {/* Right Column: Hero 3D Stage with HUD Overlays */}
        <div className="w-full lg:w-[500px] xl:w-[580px] shrink-0 relative">
          <div className="relative w-full h-[360px] sm:h-[420px] rounded-3xl overflow-hidden flex items-center justify-center">
            {/* Background Holographic Blueprint Grid */}
            <div className="absolute inset-0 bg-radial from-orange-500/10 via-transparent to-transparent pointer-events-none" />

            {/* Glowing Circular Base Pedestal */}
            <div className="absolute bottom-6 w-72 sm:w-96 h-12 rounded-[50%] bg-gradient-to-r from-orange-500/30 via-red-500/40 to-orange-500/30 blur-md border-2 border-orange-500/50 shadow-[0_0_50px_rgba(249,115,22,0.4)] pointer-events-none" />

            {/* Floating Top-Right HUD: Live Simulation */}
            <div className="absolute top-4 right-4 z-20 p-2.5 rounded-xl bg-black/70 border border-cyan-500/30 backdrop-blur-md text-[10px] font-mono text-cyan-300 shadow-xl space-y-1">
              <div className="flex items-center justify-between gap-3 text-gray-400">
                <span className="uppercase tracking-wider font-bold text-white">Live Simulation</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              </div>
              {/* Mini Attitude Waveform */}
              <div className="w-36 h-4 flex items-end gap-1 opacity-80">
                <div className="w-2 bg-cyan-400 h-2 rounded-t" />
                <div className="w-2 bg-cyan-400 h-3 rounded-t" />
                <div className="w-2 bg-cyan-400 h-1.5 rounded-t" />
                <div className="w-2 bg-cyan-400 h-3.5 rounded-t" />
                <div className="w-2 bg-cyan-400 h-2 rounded-t" />
                <div className="w-2 bg-cyan-400 h-4 rounded-t" />
              </div>
              <div className="flex items-center justify-between text-[9px] text-gray-400 pt-0.5">
                <span>Roll 2.4°</span>
                <span>Pitch -1.2°</span>
                <span>Yaw 38.6°</span>
              </div>
            </div>

            {/* Floating Bottom-Right HUD: Bill of Materials */}
            <div className="absolute bottom-6 right-4 z-20 p-3 rounded-xl bg-black/75 border border-white/15 backdrop-blur-md text-[10px] font-mono shadow-xl space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-300 block">
                Bill of Materials
              </span>
              <div className="space-y-1 text-gray-300 text-[9px]">
                <div className="flex items-center justify-between gap-3">
                  <span>ESP32</span>
                  <Check size={11} className="text-emerald-400" />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>BLDC Motor (x4)</span>
                  <Check size={11} className="text-emerald-400" />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>ESC (30A)</span>
                  <Check size={11} className="text-emerald-400" />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>LiPo Battery</span>
                  <Check size={11} className="text-emerald-400" />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Frame (250mm)</span>
                  <Check size={11} className="text-emerald-400" />
                </div>
              </div>
            </div>

            {/* Real Interactive 3D Model Floating on Pedestal */}
            <Canvas
              camera={{ position: [0.18, 0.12, 0.18], fov: 40 }}
              gl={{ antialias: true }}
              className="w-full h-full cursor-grab active:cursor-grabbing"
            >
              <ambientLight intensity={1.1} />
              <directionalLight position={[3, 5, 2]} intensity={2.2} />
              <pointLight position={[-2, 1, -2]} color="#ff6b2b" intensity={2.0} />
              <Suspense fallback={null}>
                <Float speed={2.5} rotationIntensity={0.6} floatIntensity={0.8}>
                  <Esp32DroneModel
                    customization={{} as any}
                    explosionLevel={0.08}
                    selectedComponent={null}
                    isolatedComponent={null}
                    hiddenComponents={[]}
                    onSelect={() => onLaunchStudio("esp32-drone")}
                    isArmed={true}
                    throttlePct={35}
                  />
                </Float>
              </Suspense>
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate
                autoRotateSpeed={1.5}
                maxPolarAngle={Math.PI / 2 + 0.1}
              />
            </Canvas>
          </div>
        </div>
      </section>

      {/* ================= 3. METRICS STAT STRIP BAR ================= */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-2">
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0f1118]/80 border border-white/10 backdrop-blur-md grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-white/10 text-center">
          <div className="flex items-center justify-center gap-3 pt-2 md:pt-0">
            <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400">
              <Layers size={18} />
            </div>
            <div className="text-left">
              <div className="text-xl sm:text-2xl font-black font-mono text-white">7</div>
              <div className="text-[10px] font-mono text-gray-400 uppercase">Machines</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2 md:pt-0 md:pl-4">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <Zap size={18} />
            </div>
            <div className="text-left">
              <div className="text-xl sm:text-2xl font-black font-mono text-white">400Hz</div>
              <div className="text-[10px] font-mono text-gray-400 uppercase">Physics Loop</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2 md:pt-0 md:pl-4">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Shield size={18} />
            </div>
            <div className="text-left">
              <div className="text-xl sm:text-2xl font-black font-mono text-white">0%</div>
              <div className="text-[10px] font-mono text-gray-400 uppercase">Overlap CAD</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2 md:pt-0 md:pl-4">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <ShoppingBag size={18} />
            </div>
            <div className="text-left">
              <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400">₹1,955</div>
              <div className="text-[10px] font-mono text-gray-400 uppercase">Start Building</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4. MACHINE CATALOG SECTION ================= */}
      <section id="catalog" className="w-full max-w-7xl mx-auto px-4 sm:px-8 pt-20 pb-16">
        <div className="text-center space-y-3 mb-8">
          <span className="text-[10px] font-mono font-bold tracking-widest text-orange-400 uppercase bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/25">
            MACHINE CATALOG
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Explore Engineering Machines
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto font-normal">
            Ready-to-build projects with 3D models, simulation, BOM, and step-by-step guides.
          </p>
        </div>

        {/* Filter Category Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 custom-scrollbar">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as MachineCategory)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition whitespace-nowrap ${
                  isActive
                    ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-md shadow-orange-500/30"
                    : "bg-[#11131a] hover:bg-[#1a1d28] text-gray-400 hover:text-white border border-white/5"
                }`}
              >
                <Icon size={13} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Machine Cards Grid (4 Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {filteredMachines.map((m) => (
            <div
              key={m.id}
              className="group relative rounded-2xl border border-white/10 hover:border-orange-500/60 bg-[#0e1017] p-4 flex flex-col justify-between transition-all duration-300 shadow-xl overflow-hidden hover:scale-[1.01]"
            >
              <div className="space-y-3">
                {/* Header: Badges & Price */}
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className={`px-2 py-0.5 rounded font-bold uppercase border ${m.badgeColor}`}>
                    {m.badgeType}
                  </span>
                  <span className="font-bold text-gray-200">{m.price}</span>
                </div>

                {/* Machine Preview Graphics */}
                <div
                  className={`relative w-full h-32 rounded-xl bg-gradient-to-b ${m.imageBg} flex items-center justify-center overflow-hidden border border-white/5 group-hover:border-orange-500/20 transition`}
                >
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-orange-400 group-hover:scale-110 transition">
                    {m.modelPreview === "drone" && <Smartphone size={28} />}
                    {m.modelPreview === "rover" && <Swords size={28} />}
                    {m.modelPreview === "quad" && <Plane size={28} />}
                    {m.modelPreview === "octo" && <Hexagon size={28} />}
                    {m.modelPreview === "car" && <CarFront size={28} />}
                    {m.modelPreview === "walker" && <Bot size={28} />}
                    {m.modelPreview === "fan" && <Fan size={28} />}
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-orange-400 transition leading-snug">
                    {m.name}
                  </h3>
                  <p className="text-[11px] text-gray-400 mt-1 leading-relaxed line-clamp-2">
                    {m.description}
                  </p>
                </div>

                {/* Specs / Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {m.tags.map((t, i) => (
                    <span
                      key={i}
                      className="text-[9px] font-mono text-gray-400 bg-white/5 px-2 py-0.5 rounded border border-white/5"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Launch Button */}
              <button
                onClick={() => onLaunchStudio(m.id)}
                className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition flex items-center justify-center gap-1.5"
              >
                <span>Launch in 3D</span>
                <ArrowRight size={13} />
              </button>
            </div>
          ))}

          {/* 8th Card: Request a Machine */}
          <div className="rounded-2xl border border-dashed border-white/15 bg-[#0e1017]/60 p-5 flex flex-col items-center justify-center text-center space-y-3 hover:border-orange-500/40 transition">
            <div className="w-12 h-12 rounded-full border border-orange-500/30 bg-orange-500/10 flex items-center justify-center text-orange-400">
              <Plus size={22} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Request a Machine</h3>
              <p className="text-[11px] text-gray-400 mt-1 max-w-[180px]">
                Suggest a machine or vote for the next build.
              </p>
            </div>
            <button
              onClick={() => setShowRequestModal(true)}
              className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 text-xs font-bold transition flex items-center gap-1"
            >
              <span>Suggest Now</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </section>

      {/* ================= 5. BUILD WORKFLOW SECTION ================= */}
      <section id="workflow" className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-16 border-t border-white/10">
        <div className="text-center space-y-3 mb-10">
          <span className="text-[10px] font-mono font-bold tracking-widest text-orange-400 uppercase bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/25">
            BUILD WORKFLOW
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            From Idea to Working Machine
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto font-normal">
            A complete, beginner-friendly workflow to turn your idea into a real, functional build.
          </p>
        </div>

        {/* 4 Connected Cards in Horizontal Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
          {[
            {
              num: "01",
              title: "Design in 3D",
              desc: "Model parts and assemble virtually.",
              icon: Layers,
              color: "text-orange-400 bg-orange-500/10 border-orange-500/20",
            },
            {
              num: "02",
              title: "Simulate & Test",
              desc: "Check physics, motion and performance.",
              icon: Play,
              color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
            },
            {
              num: "03",
              title: "Build & Wire",
              desc: "Get schematics, BOM and wiring guides.",
              icon: Cpu,
              color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
            },
            {
              num: "04",
              title: "Test in Real World",
              desc: "Assemble, tune and validate your machine.",
              icon: Rocket,
              color: "text-orange-400 bg-orange-500/10 border-orange-500/20",
            },
          ].map((st, i) => {
            const Icon = st.icon;
            return (
              <div
                key={i}
                className="p-5 rounded-2xl border border-white/10 bg-[#0e1017] space-y-3 relative group hover:border-white/20 transition"
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl border ${st.color}`}>
                    <Icon size={16} />
                  </div>
                  <span className="text-xs font-mono font-bold text-gray-500">{st.num}</span>
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-orange-400 transition">
                  {st.title}
                </h3>
                <p className="text-[11px] text-gray-400 leading-relaxed font-normal">
                  {st.desc}
                </p>
                {i < 3 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-gray-600">
                    <ChevronRight size={18} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= 6. WHY MECHVERSE? SECTION ================= */}
      <section id="why" className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-14 border-t border-white/10">
        <div className="space-y-2 mb-8 text-center sm:text-left">
          <span className="text-[10px] font-mono font-bold tracking-widest text-orange-400 uppercase bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/25">
            WHY MECHVERSE?
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Built for Real Hardware Builders
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-white/10 bg-[#0e1017] space-y-2">
            <div className="p-2.5 w-fit rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Compass size={18} />
            </div>
            <h3 className="text-sm font-bold text-white">Real-World Projects</h3>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Build practical, working machines.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-white/10 bg-[#0e1017] space-y-2">
            <div className="p-2.5 w-fit rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <GraduationCap size={18} />
            </div>
            <h3 className="text-sm font-bold text-white">Learn by Doing</h3>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Understand design, electronics and mechanics hands-on.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-white/10 bg-[#0e1017] space-y-2">
            <div className="p-2.5 w-fit rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Users size={18} />
            </div>
            <h3 className="text-sm font-bold text-white">Student Friendly</h3>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Low-cost, open and beginner-friendly projects.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-white/10 bg-[#0e1017] space-y-2">
            <div className="p-2.5 w-fit rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Code2 size={18} />
            </div>
            <h3 className="text-sm font-bold text-white">Open &amp; Extensible</h3>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Use, modify and build your own ideas freely.
            </p>
          </div>
        </div>
      </section>

      {/* ================= 7. BIG CTA BANNER CARD ================= */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <div className="relative rounded-3xl border border-orange-500/30 bg-[#0e1017] p-8 sm:p-12 overflow-hidden shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Subtle Orange Glow Backdrop */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-orange-500/10 blur-[100px] pointer-events-none" />

          {/* Left Exploded Frame Wireframe Vector */}
          <div className="hidden lg:flex flex-col items-center justify-center w-64 shrink-0 text-orange-400/80 font-mono text-[9px] space-y-1">
            <div className="p-4 rounded-2xl border border-orange-500/20 bg-black/40 backdrop-blur-md space-y-2">
              <div className="flex items-center justify-between">
                <span>EXPLODED CAD</span>
                <span className="text-orange-400">0.00mm</span>
              </div>
              <div className="w-48 h-24 border border-dashed border-orange-500/30 rounded-lg flex items-center justify-center text-gray-500">
                [ Layer Separation Engine ]
              </div>
            </div>
          </div>

          {/* Center Call to Action Text */}
          <div className="space-y-4 text-center lg:text-left max-w-xl z-10">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Start Your First Engineering <br />
              Project Today.
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Choose a machine, design it in 3D, simulate its physics, and build it with real components — from just ₹1,955.
            </p>
            <div>
              <button
                onClick={() => onLaunchStudio()}
                className="px-7 py-3 rounded-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-orange-500/30 transition transform hover:scale-105 active:scale-95 inline-flex items-center gap-2"
              >
                <span>Launch Mechverse Studio</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          {/* Right Blueprint Checklist Badge */}
          <div className="hidden lg:flex flex-col items-end w-56 shrink-0 z-10">
            <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md text-[10px] font-mono space-y-1.5 w-44">
              <span className="text-[9px] text-gray-400 uppercase tracking-widest block font-bold">
                250 mm Frame
              </span>
              <div className="space-y-1 text-gray-300">
                <div className="flex items-center justify-between">
                  <span>3D CAD</span>
                  <Check size={11} className="text-emerald-400" />
                </div>
                <div className="flex items-center justify-between">
                  <span>Simulation</span>
                  <Check size={11} className="text-emerald-400" />
                </div>
                <div className="flex items-center justify-between">
                  <span>BOM</span>
                  <Check size={11} className="text-emerald-400" />
                </div>
                <div className="flex items-center justify-between">
                  <span>Assembly Guide</span>
                  <Check size={11} className="text-emerald-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 8. FOOTER ================= */}
      <footer id="community" className="w-full border-t border-white/10 px-4 sm:px-8 py-8 transition-colors duration-300 bg-[#07080b]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-gray-400">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center text-white font-black italic">
              M
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-white tracking-widest">MECHVERSE</span>
              <span className="text-[8px] font-mono text-orange-400 uppercase">Engineering Platform</span>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 font-medium text-[11px]">
            <a href="#catalog" className="hover:text-white transition">Machines</a>
            <button onClick={() => onLaunchStudio()} className="hover:text-white transition">Simulator</button>
            <a href="#workflow" className="hover:text-white transition">Learn</a>
            <a href="#community" className="hover:text-white transition">Community</a>
            <button onClick={() => onLaunchStudio()} className="hover:text-white transition">Docs</button>
          </div>

          {/* Socials & Copyright */}
          <div className="flex items-center gap-4 text-gray-400">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition" title="GitHub">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-white transition" title="YouTube">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white transition" title="LinkedIn">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            <a href="https://discord.com" target="_blank" rel="noreferrer" className="hover:text-white transition" title="Community">
              <MessageSquare size={15} />
            </a>
            <span className="text-[10px] font-mono text-gray-500 ml-2">
              © 2026 Mechverse. All rights reserved.
            </span>
          </div>
        </div>
      </footer>

      {/* ================= REQUEST A MACHINE MODAL ================= */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-[#0f1118] border border-white/15 p-6 shadow-2xl space-y-4">
            <button
              onClick={() => setShowRequestModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
                <Plus size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Request a Machine</h3>
                <p className="text-[11px] text-gray-400">Suggest what we should build next.</p>
              </div>
            </div>

            {requestSubmitted ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-center font-mono text-xs space-y-1">
                <CheckCircle2 size={24} className="mx-auto" />
                <p className="font-bold">Thank you for your suggestion!</p>
                <p className="text-[10px] text-gray-300">Our engineering team has received your vote.</p>
              </div>
            ) : (
              <form onSubmit={handleRequestSubmit} className="space-y-3">
                <textarea
                  value={requestText}
                  onChange={(e) => setRequestText(e.target.value)}
                  placeholder="e.g., VTOL Tilt-Rotor UAV, 6-Axis Robotic Arm, Mars Rover Rocker-Bogie Suspension..."
                  className="w-full h-28 p-3 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white font-bold text-xs shadow-lg shadow-orange-500/20 transition"
                >
                  Submit Machine Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
