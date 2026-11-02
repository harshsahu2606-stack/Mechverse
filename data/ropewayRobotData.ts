import { BOMItem, CollectionChecklistItem, MachineData, ScrapSourceItem } from "@/types/machine";

// ============================================================================
// SINGLE SOURCE OF TRUTH: AEROCLIMB RC-1 ROPE CLIMBING ROBOT SPECIFICATIONS
// ============================================================================
export const ROPEWAY_SPEC = {
  name: "AeroClimb Horizon-X1 Autonomous Cable Traverser",
  version: "Rev 4.0 - Horizontal Cableway Edition",
  driveType: "Dual V-Grooved Overhead Drive Sheaves with Spring Pinch Rollers",
  motor: {
    type: "N20 All-Metal Geared DC Motor with Brass Worm Drive",
    nominalVoltage: "6.0V – 12.0V DC (Optimized for 2S 7.4V Li-ion)",
    nominalArmatureSpeed: "15,000 RPM",
    gearReductionRatio: "1:298 Compound Planetary & Worm Reduction",
    outputShaftRPM: "100 RPM @ 12V / 60 RPM @ 7.4V",
    stallTorque: "3.2 kg·cm (0.314 N·m)",
    stallCurrent: "1.2 A @ 12V",
    noLoadCurrent: "60 mA",
    antiRollbackFeature: "Self-locking worm angle prevents gravity descent when powered off",
  },
  cableMechanics: {
    cableDiameterRange: "2.0 mm to 6.0 mm (Steel wire rope, Nylon paracord, Synthetic cable)",
    driveSheaveDiameter: "44 mm pitch diameter with 60° V-groove",
    sheaveMaterial: "Aircraft 6061 Aluminum with High-Friction Nitrile / Silicone Traction Ring",
    pinchRollerPreload: "35 N adjustable spring clamp force",
    frictionCoefficient: "µ = 0.65 (Rubber-on-steel) / µ = 0.70 (Rubber-on-nylon)",
    maxClimbingAngle: "45° continuous slope / 60° burst ascent",
    maximumAscentSpeed: "0.29 m/s (17.4 m/min) at 0° horizontal / 0.18 m/s on 30° incline",
    ratedPayloadCapacity: "850 grams (FPV camera, telemetry sensors, cable greaser)",
    totalMachineMass: "385 grams (including 2S 18650 power pack)",
  },
  powerSystem: {
    batteryType: "2S1P 18650 Li-ion 7.4V Nominal (8.4V Peak)",
    capacity: "2,200 mAh (16.28 Wh)",
    continuousRunTime: "4.5 hours continuous traversing",
    maxTravelDistance: "3,800 meters per full charge",
    chargingMethod: "USB-C 2S Li-ion Balance Board (TP5100)",
  },
  safetyAndControl: {
    limitSwitches: "Dual micro snap-action roller limit switches (auto-reversing bumpers)",
    reversingCircuit: "Integrated DPDT toggle / H-bridge driver (DRV8833)",
    derailmentPrevention: "Enclosed interlocking guide arms with safety captive retainers",
    centerOfGravity: "Pendulum design — battery and motor sit 65mm below cable line",
  },
};

// ============================================================================
// COMPONENT HIERARCHY (8 MODULAR ENGINEERING SUB-ASSEMBLIES)
// ============================================================================
export const ROPEWAY_ROBOT_MACHINE_DATA: MachineData = {
  id: "ropeway-robot",
  name: "AeroClimb Horizon-X1 — Autonomous Cable Traverser",
  category: "Cableways & Inspection Robotics",
  badge: "ROBOTIC LAB / 008",
  tagline: "Horizontal cableway traversing robot with dual V-grooved sheaves, spring-loaded pinch clamping, and 4K inspection payload.",
  description:
    "An autonomous, horizontal cable-riding robotic platform designed for powerline inspection, zipline traversing, and overhead structural monitoring. Engineered with dual overhead V-grooved traction sheaves, spring-tensioned pinch rollers, self-locking worm reduction transmission, and underslung gravity pendulum chassis.",
  modelPath: "/models/procedural-ropeway",
  defaultCameraPosition: [3.0, 2.2, 3.6],
  defaultFov: 42,
  components: [
    {
      id: "left-arm",
      name: "Left Climbing Arm & Gripper Hook",
      category: "Kinematic Grippers",
      meshNamePattern: /left_arm|left-arm/i,
      description:
        "Kinematic articulating climbing arm with integrated overhead rope hook that grips the horizontal cable. Driven by the left kinematic crank, it alternates reaching forward and clamping down on the cable.",
      purpose:
        "Provides primary pulling thrust along the cable during phase 1 of the climbing cycle while the right arm swings forward.",
      workingPrinciple:
        "Hand-over-hand climbing locomotion: arm pivots at shoulder pin while crank linkage lifts hook to clear the rope, translates forward along the cable line, and drops down to clamp.",
      material: "High-Tensile 3D Printed PETG / CNC 6061-T6 Aluminum",
      recommendedQty: 1,
      dimensions: "158 mm Height x 42 mm Width x 6 mm Thickness",
      interconnections: "Connected to Left Crank via 4mm steel pivot pin with brass bushing; mounts to main chassis.",
      priceINR: 140,
      alternatives: "Laser-cut 4mm Delrin sheet or carbon fiber plate.",
      sourcingTip: "Print vertically with 6 perimeters and 60% infill for maximum tensile hook stiffness.",
      specs: [
        { label: "Arm Stroke", value: "33 mm Forward Reach" },
        { label: "Cable Grip", value: "3mm–8mm Universal Cable" },
        { label: "Pivot Pin", value: "Φ4mm Hardened Ground Steel" },
        { label: "Tensile Yield", value: "48 MPa (PETG)" },
      ],
      explosionVector: [0.2, 0.5, -0.75],
      explosionDistance: 1.5,
    },
    {
      id: "right-arm",
      name: "Right Climbing Arm & Gripper Hook",
      category: "Kinematic Grippers",
      meshNamePattern: /right_arm|right-arm/i,
      description:
        "Opposing kinematic articulating climbing arm with integrated overhead cable gripper hook. Operates 180° out of phase with the left arm to sustain continuous non-slip forward locomotion.",
      purpose:
        "Provides secondary pulling thrust during phase 2 of the climbing cycle while the left arm resets.",
      workingPrinciple:
        "Alternating reciprocal motion: sustains uninterrupted horizontal traversal along the rope without needing external track rails.",
      material: "High-Tensile 3D Printed PETG / CNC 6061-T6 Aluminum",
      recommendedQty: 1,
      dimensions: "162 mm Height x 38 mm Width x 6 mm Thickness",
      interconnections: "Connected to Right Crank via 4mm steel pivot pin with brass bushing; mounts to main chassis.",
      priceINR: 140,
      alternatives: "Laser-cut 4mm Delrin sheet or carbon fiber plate.",
      sourcingTip: "Add a thin strip of high-friction silicone tubing inside the hook groove for maximum grip.",
      specs: [
        { label: "Arm Stroke", value: "33 mm Forward Reach" },
        { label: "Cable Grip", value: "3mm–8mm Universal Cable" },
        { label: "Pivot Pin", value: "Φ4mm Hardened Ground Steel" },
        { label: "Phase Shift", value: "180° Opposing Offset" },
      ],
      explosionVector: [-0.2, 0.5, 0.75],
      explosionDistance: 1.5,
    },
    {
      id: "left-crank",
      name: "Left Kinematic Drive Crank",
      category: "Linkages & Cranks",
      meshNamePattern: /left_crank|left-crank/i,
      description:
        "Precision eccentric crank link keyed directly to the left spur gear output shaft. Converts rotational gear torque into reciprocating planar motion.",
      purpose:
        "Drives the lower pivot of the left climbing arm through its orbital trajectory.",
      workingPrinciple:
        "Slider-crank/four-bar linkage kinematics: rotational input at constant angular velocity ($\omega$) produces smooth harmonic arm stroke.",
      material: "Reinforced PETG / CNC Billet Aluminum",
      recommendedQty: 1,
      dimensions: "28 mm Pitch Radius x 10 mm Thickness",
      interconnections: "Bolted onto left spur gear; carries crank pin for left arm.",
      priceINR: 75,
      alternatives: "Standard servo horn or metal disc crank.",
      sourcingTip: "Ream the pivot hole with a 4.0mm drill bit for smooth friction-free linkage rotation.",
      specs: [
        { label: "Crank Radius", value: "16.5 mm Eccentric Throw" },
        { label: "Bearing Type", value: "Oil-Impregnated Bronze Bushing" },
        { label: "Max Radial Load", value: "45 N Dynamic Force" },
      ],
      explosionVector: [0.1, 0.2, -0.9],
      explosionDistance: 1.4,
    },
    {
      id: "right-crank",
      name: "Right Kinematic Drive Crank",
      category: "Linkages & Cranks",
      meshNamePattern: /right_crank|right-crank/i,
      description:
        "Opposing eccentric crank link keyed to the right spur gear output shaft, clocked at exactly 180° opposite the left crank.",
      purpose:
        "Drives the lower pivot of the right climbing arm through its complementary orbital cycle.",
      workingPrinciple:
        "Dual opposing crank phasing guarantees that at all times at least one hook is firmly engaged and gripping the cable.",
      material: "Reinforced PETG / CNC Billet Aluminum",
      recommendedQty: 1,
      dimensions: "28 mm Pitch Radius x 10 mm Thickness",
      interconnections: "Bolted onto right spur gear; carries crank pin for right arm.",
      priceINR: 75,
      alternatives: "Standard servo horn or metal disc crank.",
      sourcingTip: "Ensure the two cranks are indexed precisely 180° apart on their splines.",
      specs: [
        { label: "Crank Radius", value: "16.5 mm Eccentric Throw" },
        { label: "Phase Index", value: "180° Fixed Clocking" },
        { label: "Max Radial Load", value: "45 N Dynamic Force" },
      ],
      explosionVector: [-0.1, 0.2, 0.9],
      explosionDistance: 1.4,
    },
    {
      id: "left-gear",
      name: "Left Reduction Spur Gear",
      category: "Transmission",
      meshNamePattern: /left_gear|left-gear/i,
      description:
        "Precision involute spur gear meshing directly with the central motor pinion to drive the left crank assembly.",
      purpose:
        "Reduces motor RPM while amplifying output climbing torque.",
      workingPrinciple:
        "Involute gear meshing: ensures constant angular velocity ratio and minimal tooth wear under load.",
      material: "Acetal (POM) / Phosphor Bronze / 3D Printed Nylon",
      recommendedQty: 1,
      dimensions: "Φ38 mm Pitch Diameter (0.8 Module, 45 Teeth)",
      interconnections: "Rotates on 4mm chassis axle shaft; meshes with central motor pinion.",
      priceINR: 85,
      alternatives: "Salvaged toy car reduction gears or 3D printed PETG gears.",
      sourcingTip: "Apply a small dab of white lithium grease or silicone PTFE spray between teeth.",
      specs: [
        { label: "Module", value: "0.8 Mod" },
        { label: "Tooth Profile", value: "20° Pressure Angle Involute" },
        { label: "Pitch Diameter", value: "Φ38.0 mm" },
      ],
      explosionVector: [0.15, 0, -0.65],
      explosionDistance: 1.3,
    },
    {
      id: "right-gear",
      name: "Right Reduction Spur Gear",
      category: "Transmission",
      meshNamePattern: /right_gear|right-gear/i,
      description:
        "Matching precision involute spur gear mounted on the right side of the chassis, driven in synchrony by the central motor pinion.",
      purpose:
        "Drives the right crank with synchronized torque from the single central motor.",
      workingPrinciple:
        "Dual-output transmission: single central motor drives both left and right spur gears simultaneously, ensuring zero torque divergence.",
      material: "Acetal (POM) / Phosphor Bronze / 3D Printed Nylon",
      recommendedQty: 1,
      dimensions: "Φ38 mm Pitch Diameter (0.8 Module, 45 Teeth)",
      interconnections: "Rotates on 4mm chassis axle shaft; meshes with central motor pinion.",
      priceINR: 85,
      alternatives: "Salvaged toy car reduction gears or 3D printed PETG gears.",
      sourcingTip: "Check for smooth backlash-free meshing before tightening axle retention clips.",
      specs: [
        { label: "Module", value: "0.8 Mod" },
        { label: "Tooth Profile", value: "20° Pressure Angle Involute" },
        { label: "Pitch Diameter", value: "Φ38.0 mm" },
      ],
      explosionVector: [-0.15, 0, 0.65],
      explosionDistance: 1.3,
    },
    {
      id: "motor",
      name: "High-Torque DC Gear Motor & Pinion",
      category: "Actuation",
      meshNamePattern: /motor|pinion/i,
      description:
        "High-torque N20 all-metal DC gear motor featuring brass input pinion and integrated internal compound reduction gearbox.",
      purpose:
        "Generates primary rotational mechanical power and drives both left and right spur gears simultaneously via its central pinion.",
      workingPrinciple:
        "DC electromagnetic motor converted through planetary gear train to produce massive 3.2 kg·cm torque at 100 RPM output.",
      material: "Steel Gearbox Housing + Brass Pinion + Copper Armature",
      recommendedQty: 1,
      dimensions: "52 mm Length x 20 mm Width x 22 mm Height",
      interconnections: "Clamped to front chassis cradle; pinion meshes centered between left and right gears.",
      priceINR: 190,
      alternatives: "Yellow TT dual-shaft BO gear motor.",
      sourcingTip: "Widely available on Robu.in or electronics hobby shops under 'N20 Metal Gear Motor 6V-12V 100RPM'.",
      specs: [
        { label: "Operating Voltage", value: "6.0V – 12.0V DC" },
        { label: "Output RPM", value: "100 RPM @ 12V / 60 RPM @ 7.4V" },
        { label: "Stall Torque", value: "3.2 kg·cm (0.314 N·m)" },
        { label: "Current Draw", value: "80 mA no-load / 1.2 A stall" },
      ],
      explosionVector: [0.75, 0, 0],
      explosionDistance: 1.5,
    },
    {
      id: "battery",
      name: "Lithium-Ion Power Pack & Mount",
      category: "Power & Counterweight",
      meshNamePattern: /battery|cell|power/i,
      description:
        "Rear-mounted battery enclosure housing twin 18650 2S Li-ion cells or 9V battery with integrated power switch and balance lead.",
      purpose:
        "Supplies reliable DC power to the motor and serves as a low-center-of-gravity counterweight for vertical self-righting stability.",
      workingPrinciple:
        "Underslung pendulum design: battery mass placed below the rope line generates natural gravitational restoring torque against wind gusts.",
      material: "Impact-Resistant ABS / PETG Enclosure",
      recommendedQty: 1,
      dimensions: "62 mm x 38 mm x 24 mm",
      interconnections: "Clips into rear chassis bay; wired directly to motor switch and terminal blocks.",
      priceINR: 220,
      alternatives: "Standard 9V alkaline snap battery or small 2S 800mAh LiPo.",
      sourcingTip: "Salvage good 18650 cells from discarded power banks or laptop battery packs.",
      specs: [
        { label: "Voltage", value: "7.4V Nominal (8.4V Peak)" },
        { label: "Capacity", value: "2,200 mAh (16.3 Wh)" },
        { label: "Run Time", value: "3.5+ Hours Continuous Traversal" },
      ],
      explosionVector: [-0.75, 0, 0],
      explosionDistance: 1.5,
    },
    {
      id: "chassis",
      name: "Main Monocoque Chassis Frame",
      category: "Structure",
      meshNamePattern: /chassis|frame/i,
      description:
        "Central load-bearing structural backbone supporting the motor mount, gear axles, arm shoulder pivot brackets, and battery cradle.",
      purpose:
        "Maintains rigid alignment between gears, motor pinion, and pivoting climbing arms under continuous dynamic load.",
      workingPrinciple:
        "Monocoque truss structure: distributes mechanical stresses across reinforced perimeter ribs.",
      material: "3D Printed PETG / CNC Aluminum 6061-T6",
      recommendedQty: 1,
      dimensions: "94 mm Height x 65 mm Width x 55 mm Depth",
      interconnections: "Houses motor clamp, bearing axle journals, and lower foot brackets.",
      priceINR: 160,
      alternatives: "Laser-cut acrylic frame or folded aluminum sheet.",
      sourcingTip: "Print with 40% gyroid infill and 4 walls for maximum torsional rigidity.",
      specs: [
        { label: "Mass", value: "85 grams (PETG)" },
        { label: "Axle Spacing", value: "48.0 mm Gear Center Distance" },
        { label: "Fasteners", value: "M3 Socket Head Screws" },
      ],
      explosionVector: [0, 0, 0],
      explosionDistance: 0,
    },
    {
      id: "gearbox-cover",
      name: "Precision Transmission Gear Cover",
      category: "Transmission Enclosure",
      meshNamePattern: /gearbox_cover|gearbox-cover|cover/i,
      description:
        "Front protective faceplate and gear enclosure that encapsulates the motor pinion and dual spur gears, retaining grease and keeping out debris.",
      purpose:
        "Protects moving gear teeth from dust, provides outer journal support for the axle pins, and increases chassis stiffness.",
      workingPrinciple:
        "Dual-shear axle support: by supporting both ends of each gear shaft, axle deflection is reduced by 80%.",
      material: "3D Printed PETG / Polycarbonate",
      recommendedQty: 1,
      dimensions: "78 mm x 42 mm x 15 mm",
      interconnections: "Fastens to main chassis via four M3 perimeter bolts.",
      priceINR: 70,
      alternatives: "Clear acrylic window plate.",
      sourcingTip: "Use transparent PETG or clear acrylic if you want visual inspection of gear teeth in motion.",
      specs: [
        { label: "Thickness", value: "3.5 mm Reinforced Plate" },
        { label: "Axle Retention", value: "Dual-Shear Bushing Journals" },
      ],
      explosionVector: [0.4, -0.6, 0],
      explosionDistance: 1.4,
    },
    {
      id: "left-foot",
      name: "Left Lower Stabilizer Foot",
      category: "Stabilizers & Ballast",
      meshNamePattern: /left_foot|left-foot/i,
      description:
        "Bottom left stabilizer bracket acting as low-slung pendulum ballast and ground contact landing pad.",
      purpose:
        "Provides low-center-of-gravity balance and prevents robot rollover during sudden cable vibrations or when resting on surfaces.",
      workingPrinciple:
        "Gravity pendulum stability: maximizes the vertical distance between the rope suspension point and the center of mass.",
      material: "High-Density PETG with Brass / Lead Ballast Inserts",
      recommendedQty: 1,
      dimensions: "55 mm Length x 22 mm Width x 22 mm Height",
      interconnections: "Bolts to base of main chassis; carries optional ballast weights.",
      priceINR: 60,
      alternatives: "Steel angle brackets or 3D printed skid feet.",
      sourcingTip: "Insert a few steel M8 nuts or washers inside the hollow cavity for extra counterweight effect.",
      specs: [
        { label: "Ballast Mass", value: "45 grams" },
        { label: "CG Offset", value: "125 mm below rope line" },
      ],
      explosionVector: [0.25, -0.7, -0.5],
      explosionDistance: 1.5,
    },
    {
      id: "right-foot",
      name: "Right Lower Stabilizer Foot",
      category: "Stabilizers & Ballast",
      meshNamePattern: /right_foot|right-foot/i,
      description:
        "Bottom right stabilizer bracket acting as complementary pendulum ballast and ground contact landing pad.",
      purpose:
        "Balances the robot laterally across the vertical plane of symmetry.",
      workingPrinciple:
        "Symmetric counterweighting ensures the robot hangs perfectly plumb under the cable.",
      material: "High-Density PETG with Brass / Lead Ballast Inserts",
      recommendedQty: 1,
      dimensions: "55 mm Length x 22 mm Width x 22 mm Height",
      interconnections: "Bolts to base of main chassis; carries optional ballast weights.",
      priceINR: 60,
      alternatives: "Steel angle brackets or 3D printed skid feet.",
      sourcingTip: "Match the ballast mass exactly to the left foot for balanced level climbing.",
      specs: [
        { label: "Ballast Mass", value: "45 grams" },
        { label: "CG Offset", value: "125 mm below rope line" },
      ],
      explosionVector: [0.25, -0.7, 0.5],
      explosionDistance: 1.5,
    },
  ],
  subAssemblies: {
    "worm-gearbox-core": {
      id: "worm-gearbox-core",
      name: "Self-Locking Worm Reduction Core",
      description: "Internal mechanical breakdown of the high-torque worm gear reduction transmission.",
      parts: [
        {
          id: "brass-worm-pinion",
          name: "Brass Worm Input Pinion",
          description: "Single-start precision brass worm gear mounted directly onto motor armature shaft.",
          specs: [
            { label: "Module", value: "0.5M" },
            { label: "Lead Angle", value: "4.2° (Self-Locking)" },
            { label: "Material", value: "H62 High-Wear Brass" },
          ],
          explosionVector: [0, 0, -1.2],
        },
        {
          id: "bronze-worm-wheel",
          name: "Phosphor Bronze Worm Wheel",
          description: "30-tooth helical worm wheel meshing seamlessly with input worm pinion.",
          specs: [
            { label: "Teeth Count", value: "30T" },
            { label: "Pitch Diameter", value: "15.0 mm" },
            { label: "Reduction", value: "30:1 in first stage" },
          ],
          explosionVector: [1.2, 0, 0],
        },
        {
          id: "compound-spur-train",
          name: "Planetary Secondary Compound Gear Train",
          description: "Secondary steel reduction cluster providing final 10:1 multiplication to 100 RPM output.",
          specs: [
            { label: "Total Ratio", value: "1:298 Overall Reduction" },
            { label: "Material", value: "Hardened Carbon Steel" },
          ],
          explosionVector: [0, 1.2, 0],
        },
      ],
    },
  },
};

// ============================================================================
// ITEM CHECKLIST & BILL OF MATERIALS (BOM) WITH REAL ₹ INR PRICING
// ============================================================================
export const ROPEWAY_BOM_ITEMS: BOMItem[] = [
  {
    id: "n20-motor",
    name: "N20 12V 100RPM All-Metal Worm Geared DC Motor",
    category: "Actuation",
    defaultQty: 1,
    qty: 1,
    estimatedPriceINR: 190,
    actualPriceINR: 180,
    sourceType: "Electronics Shop",
    collected: true,
    notes: "Must have metal gears and self-locking worm gearbox. 3.2 kg·cm torque.",
  },
  {
    id: "petg-printed-parts",
    name: "3D Printed Chassis, Pulleys & Hook Arms (PETG / PLA+)",
    category: "Structure",
    defaultQty: 1,
    qty: 1,
    estimatedPriceINR: 150,
    actualPriceINR: 140,
    sourceType: "DIY / Household",
    collected: true,
    notes: "Printed from assets/Ropeway robo/Rope Climbing Robot.stl. 60% infill.",
  },
  {
    id: "rubber-o-rings",
    name: "High-Friction Nitrile / Silicone O-Rings (45mm x 3.5mm)",
    category: "Powertrain",
    defaultQty: 4,
    qty: 4,
    estimatedPriceINR: 35,
    actualPriceINR: 30,
    sourceType: "Hardware Store",
    collected: true,
    notes: "Fits into pulley V-grooves to provide µ=0.65 traction on steel/nylon rope.",
  },
  {
    id: "ball-bearings",
    name: "Miniature Shielded Ball Bearings (MR105-2RS / 608ZZ)",
    category: "Hardware",
    defaultQty: 6,
    qty: 6,
    estimatedPriceINR: 90,
    actualPriceINR: 90,
    sourceType: "Electronics Shop",
    collected: false,
    notes: "Reduces friction on drive axles and tensioner guide rollers.",
  },
  {
    id: "hardware-m3",
    name: "M3 Stainless Steel Screws, Nuts & Threaded Brass Inserts",
    category: "Fasteners",
    defaultQty: 1,
    qty: 1,
    estimatedPriceINR: 50,
    actualPriceINR: 45,
    sourceType: "Hardware Store",
    collected: true,
    notes: "Assorted M3 x 10mm, 20mm, 35mm bolts with nylon locking nuts.",
  },
  {
    id: "battery-pack",
    name: "2S Li-ion 7.4V 2200mAh Battery Pack with BMS Protection",
    category: "Power",
    defaultQty: 1,
    qty: 1,
    estimatedPriceINR: 230,
    actualPriceINR: 220,
    sourceType: "Electronics Shop",
    collected: false,
    notes: "Can be salvaged from old laptop battery or built with 2x 18650 cells.",
  },
  {
    id: "limit-switches",
    name: "Micro Snap-Action Roller Limit Switches (Auto-Reverse)",
    category: "Electronics",
    defaultQty: 2,
    qty: 2,
    estimatedPriceINR: 40,
    actualPriceINR: 35,
    sourceType: "Electronics Shop",
    collected: false,
    notes: "Triggers automatic reversal when robot reaches end of rope span.",
  },
  {
    id: "cable-rope",
    name: "4mm Braided Nylon Paracord / 2mm Steel Wire Rope (15m)",
    category: "Rigging",
    defaultQty: 1,
    qty: 1,
    estimatedPriceINR: 90,
    actualPriceINR: 85,
    sourceType: "Hardware Store",
    collected: true,
    notes: "High-tensile suspension cable for outdoor zipline test rig.",
  },
];

// ============================================================================
// ZERO-COST DIY SCRAP SOURCING GUIDE
// ============================================================================
export const ROPEWAY_SCRAP_SOURCES: ScrapSourceItem[] = [
  {
    id: "scrap-cassette-printers",
    title: "Broken Printers & Tape Decks (Pulleys & Gears)",
    icon: "Layers",
    usableParts: [
      "Grooved rubber capstan pinch rollers (perfect cable grip wheels)",
      "Module 0.5 brass and plastic spur reduction gears",
      "Φ3mm and Φ5mm precision polished ground steel guide shafts",
      "Tension springs for pinch roller clamping assembly",
    ],
    safetyWarnings: [
      "Unplug all 220V power supplies before opening printer casings.",
      "Wear eye protection when extracting small spring-loaded clips.",
    ],
    incompatibleParts: [
      "Stepping motors without driver boards (DC gear motor is much simpler for beginner wiring).",
    ],
    collectionTips:
      "Old desktop paper printers, cassette players, and DVD drives are treasure troves for smooth rollers and precision metal axles.",
  },
  {
    id: "scrap-laptop-batteries",
    title: "Discarded Laptop Battery Packs (18650 Li-ion Cells)",
    icon: "Cpu",
    usableParts: [
      "Standard 18650 cylindrical Li-ion cells (typically 2,000 to 2,600 mAh each)",
      "Pure nickel connection strips for spot welding / soldering",
      "Miniature 10K NTC thermistors for battery temperature monitoring",
    ],
    safetyWarnings: [
      "Never puncture, short-circuit, or heat lithium cells above 60°C.",
      "Use a digital multimeter to test voltage: discard any cell measuring below 2.5V.",
    ],
    incompatibleParts: [
      "Swollen, rusted, or zero-volt dead lithium cells.",
    ],
    collectionTips:
      "Local laptop repair shops often give away discarded battery packs for free. Usually 4 out of 6 cells are in excellent health!",
  },
  {
    id: "scrap-hardware-rigging",
    title: "Household Clotheslines, Bicycle Cables & Curtain Rods",
    icon: "Wrench",
    usableParts: [
      "Bicycle stainless steel brake/gear cables (smooth, virtually zero stretch)",
      "Nylon braided clotheslines (durable, weatherproof for outdoor ropeways)",
      "Small aluminum carabiners and turnbuckles for tensioning the line",
    ],
    safetyWarnings: [
      "Ensure anchor points (trees, pillars, railings) can support at least 50 kg horizontal pull.",
    ],
    incompatibleParts: [
      "Frayed jute ropes with loose hairs that could tangle in the gear teeth.",
    ],
    collectionTips:
      "Old bicycle inner brake cables make the fastest and slickest indoor cableways with zero rolling friction.",
  },
];

// ============================================================================
// COLLECTION CHECKLIST
// ============================================================================
export const ROPEWAY_COLLECTION_CHECKLIST: CollectionChecklistItem[] = [
  {
    id: "chk-motor",
    componentName: "N20 12V 100RPM Worm Gear Motor",
    targetQuantity: 1,
    status: "ready",
    sourcedFrom: "Hobby Robotics Shop",
  },
  {
    id: "chk-pulleys",
    componentName: "3D Printed Drive Pulleys with O-Rings",
    targetQuantity: 4,
    status: "ready",
    sourcedFrom: "Workshop 3D Printer",
  },
  {
    id: "chk-chassis",
    componentName: "PETG Structural Chassis Frame",
    targetQuantity: 1,
    status: "ready",
    sourcedFrom: "Workshop 3D Printer",
  },
  {
    id: "chk-hooks",
    componentName: "Suspension Arms & Retention Hooks",
    targetQuantity: 2,
    status: "ready",
    sourcedFrom: "Workshop 3D Printer",
  },
  {
    id: "chk-bearings",
    componentName: "MR105-2RS Ball Bearings",
    targetQuantity: 6,
    status: "tested",
    sourcedFrom: "Local Hardware Supply",
  },
  {
    id: "chk-battery",
    componentName: "2S Li-ion 7.4V Battery Pack",
    targetQuantity: 1,
    status: "found",
    sourcedFrom: "Salvaged Laptop Battery",
  },
  {
    id: "chk-cable",
    componentName: "15m Braided Nylon Cableway Rig",
    targetQuantity: 1,
    status: "ready",
    sourcedFrom: "Hardware Store",
  },
];

// ============================================================================
// STEP-BY-STEP DIY BUILD GUIDE
// ============================================================================
export const ROPEWAY_BUILD_STEPS = [
  {
    stepNumber: 1,
    title: "3D Printing & Component Pre-Fitting",
    duration: "45 mins",
    difficulty: "Beginner",
    summary:
      "Print all 7 structural parts from the CAD STL model using PETG or PLA+ filament with 4 perimeters and 60% infill.",
    instructions: [
      "Slice 'Rope Climbing Robot.stl' with 0.2mm layer height and gyroid infill for isotropic tensile strength.",
      "Clean out shaft bores using a 5.0mm hand reamer or drill bit for smooth bearing fit.",
      "Install brass M3 threaded heat-set inserts into the chassis mounting pockets using a soldering iron set to 220°C.",
      "Press the 45mm x 3.5mm rubber O-rings snugly into the central V-grooves of the 4 drive pulleys.",
    ],
    proTip:
      "Avoid using brittle standard PLA for the top suspension hooks — PETG or ABS provides the flexibility needed to absorb dynamic cable vibrations.",
  },
  {
    stepNumber: 2,
    title: "Worm Gearbox & Primary Drive Axle Assembly",
    duration: "30 mins",
    difficulty: "Intermediate",
    summary:
      "Mount the N20 metal gear motor into the chassis pocket and couple the output D-shaft to the primary traction sheave.",
    instructions: [
      "Slide the N20 gear motor into the central chassis recess and secure with two M2 x 6mm face screws.",
      "Press the MR105 ball bearings into the chassis side pockets until fully seated flush.",
      "Insert the hardened 5mm steel drive shaft through the chassis, primary spur gear, and drive sheave.",
      "Tighten the set-screw on the shaft collar onto the motor flat D-shaft to prevent rotational slippage.",
    ],
    proTip:
      "Apply a drop of blue threadlocker (Loctite 242) to the motor mounting screws to prevent loosening from motor vibration.",
  },
  {
    stepNumber: 3,
    title: "Pinch Roller Clamping Mechanism Installation",
    duration: "25 mins",
    difficulty: "Intermediate",
    summary:
      "Assemble the spring-preloaded pinch rollers that firmly clamp the rope against the lower drive pulleys.",
    instructions: [
      "Fit the upper guide rollers onto their pivot arms with miniature ball bearings.",
      "Attach the dual extension springs between the chassis anchor pins and the pinch roller arms.",
      "Check that the pinch rollers apply a firm 30–35 N downward clamping force onto the cable track.",
      "Verify that the rollers rotate smoothly with zero binding or axial play.",
    ],
    proTip:
      "Test the clamping force by sliding a scrap piece of rope between the sheaves — you should not be able to pull it through by hand without rotating the motor.",
  },
  {
    stepNumber: 4,
    title: "Suspension Arms & Anti-Derailment Hook Fitting",
    duration: "20 mins",
    difficulty: "Beginner",
    summary:
      "Fasten the tall suspension hook arms to the chassis backbone, creating the overhead cable carriage.",
    instructions: [
      "Align the dual suspension arms with the vertical mounting bosses on the chassis.",
      "Bolt firmly using four M3 x 20mm stainless steel socket cap screws with nylon locking nuts.",
      "Inspect the throat clearance: the opening must easily accommodate your rope diameter plus 4mm clearance.",
      "Ensure the rope line is positioned precisely over the centerline of both traction sheaves.",
    ],
    proTip:
      "Smooth any print layer roughness on the inside throat of the hooks with fine 400-grit sandpaper so the cable glides silently.",
  },
  {
    stepNumber: 5,
    title: "Electrical Wiring & Auto-Reversing Circuit",
    duration: "35 mins",
    difficulty: "Intermediate",
    summary:
      "Wire the 2S battery pack, power switch, and dual end-stop micro switches for autonomous forward-reverse shuttle operation.",
    instructions: [
      "Connect the 2S Li-ion battery leads to the central power toggle switch.",
      "Wire the two micro roller limit switches in a cross-wired DPDT reversing configuration to the motor terminals.",
      "Mount the forward limit switch at the front bumper and the reverse limit switch at the rear bumper.",
      "Tuck the wiring neatly into the chassis wire channels and secure with miniature zip ties.",
    ],
    proTip:
      "When the robot hits an end-stop bumper on the cable, the switch reverses DC polarity instantly, sending the robot back in the opposite direction automatically!",
  },
  {
    stepNumber: 6,
    title: "Cable Rigging, Tensioning & Maiden Flight",
    duration: "25 mins",
    difficulty: "Beginner",
    summary:
      "Rig a suspended cableway between two anchor points and conduct the first live climbing simulation.",
    instructions: [
      "Tension a 10m to 15m cable between two secure posts or trees at eye level using a turnbuckle.",
      "Set the cable to a flat 0° slope for initial testing, then increase to 15°, 30°, and 45° inclines.",
      "Open the suspension hooks, seat the rope between the grooved pulleys and pinch rollers, and release the tension arm.",
      "Flip the power switch: observe the smooth climb, steady speed, and automatic reversal at the bumper stop!",
    ],
    proTip:
      "Keep the cable as tight as possible (minimum 150 N tension) to reduce catenary sag and ensure maximum climbing velocity.",
  },
];

// ============================================================================
// ENGINEERING DOCUMENTATION & KINEMATIC FORMULAS
// ============================================================================
export const ROPEWAY_ENGINEERING_DOCS = {
  tractionTheory: {
    title: "Wedge-Groove Friction Mechanics",
    equation: "F_traction = 2 · µ · F_clamp / sin(α / 2)",
    explanation:
      "In a V-grooved sheave with included angle α = 60°, the rope is wedged between both angled sidewalls. This multiplies the effective normal reaction force by a factor of 1 / sin(30°) = 2.0x, doubling the friction thrust compared to a flat pulley without requiring excessive spring preload.",
    parameters: [
      { name: "µ (Friction Coefficient)", value: "0.65 (Nitrile rubber on steel wire)" },
      { name: "α (Groove Included Angle)", value: "60°" },
      { name: "F_clamp (Preload Force)", value: "35 N (Twin springs)" },
      { name: "Maximum Friction Thrust", value: "45.5 N (Sufficient to hoist 4.6 kg vertically)" },
    ],
  },
  inclineClimbing: {
    title: "Maximum Incline Slope & Anti-Slip Equilibrium",
    equation: "F_traction ≥ m_total · g · (sin θ + µ_roll · cos θ)",
    explanation:
      "To prevent back-slip on an incline of angle θ, the total available friction force must exceed the gravity component pulling the robot down the cable plus rolling resistance.",
    parameters: [
      { name: "Total Robot Mass (m)", value: "0.385 kg (3.77 N weight)" },
      { name: "At θ = 30° Incline", value: "Gravity load = 1.89 N (Friction margin = 24x safety factor)" },
      { name: "At θ = 45° Incline", value: "Gravity load = 2.67 N (Friction margin = 17x safety factor)" },
      { name: "Theoretical Max Incline", value: "82° before wheel slippage occurs" },
    ],
  },
  wormSelfLocking: {
    title: "Non-Reversible Worm Gear Self-Locking Condition",
    equation: "tan(γ) < µ_worm · cos(α_n)",
    explanation:
      "The brass worm pinion has a lead angle γ = 4.2°. Because tan(4.2°) = 0.073 is significantly smaller than the steel-on-bronze static friction coefficient (0.15), the gearbox cannot be back-driven by external gravity loads. If the battery dies on a 45° cliff ascent, the robot freezes rigidly on the rope and never plunges down.",
    parameters: [
      { name: "Worm Lead Angle (γ)", value: "4.2°" },
      { name: "Static Friction (µ_worm)", value: "0.15" },
      { name: "Status", value: "100% Self-Locking Failsafe" },
    ],
  },
  catenarySag: {
    title: "Cable Catenary Sag & Dynamic Deflection",
    equation: "y(x) = (T_0 / w) · [cosh(w · x / T_0) - 1]",
    explanation:
      "Over an unsupported span of length L with cable linear density w and horizontal tension T_0, the cable sags into a hyperbolic cosine curve. As the robot traverses toward mid-span, localized point-load deflection creates a local uphill slope that the robot must climb out of.",
    parameters: [
      { name: "Cable Tension (T_0)", value: "200 N" },
      { name: "Span Length (L)", value: "15 meters" },
      { name: "Mid-Span Sag", value: "0.18 meters (1.2% deflection)" },
      { name: "Max Local Departure Slope", value: "4.8° at cable anchors" },
    ],
  },
};

// ============================================================================
// FIELD TROUBLESHOOTING GUIDE
// ============================================================================
export const ROPEWAY_TROUBLESHOOTING = [
  {
    problem: "Robot slips on cable and wheels spin without moving forward",
    causes: [
      "Pinch roller spring preload is too loose (<20 N).",
      "Dust, oil, or rain moisture on the rubber traction O-rings.",
      "Cable diameter is smaller than groove minimum (<2.0mm).",
    ],
    checks: [
      "Measure clamping force by pulling rope with a luggage scale.",
      "Inspect rubber O-rings for glaze, oil, or surface wear.",
    ],
    solutions: [
      "Tighten the pinch roller adjustment screws to increase spring tension to 35 N.",
      "Clean rubber rings and cable with isopropyl alcohol (IPA).",
      "Switch to thicker 45mm x 4.0mm high-grip silicone O-rings.",
    ],
  },
  {
    problem: "Motor stalls or crawls very slowly on steep inclines (>30°)",
    causes: [
      "Battery voltage is low (<6.8V for 2S pack).",
      "Excessive mechanical friction in drive shaft bearings.",
      "Motor reduction ratio is too fast (e.g. 500 RPM motor used instead of 100 RPM).",
    ],
    checks: [
      "Check battery terminal voltage under load with a multimeter.",
      "Spin drive gears by hand with motor disconnected to verify free rotation.",
    ],
    solutions: [
      "Recharge 2S Li-ion battery pack to full 8.4V.",
      "Ensure MR105 ball bearings are seated straight with zero axial bind.",
      "Use recommended 1:298 high-torque N20 motor (100 RPM output).",
    ],
  },
  {
    problem: "Robot derails or jumps off cable during sudden stops",
    causes: [
      "Cable tension is too slack (<100 N), causing excessive vertical whipping.",
      "Suspension hook retaining lips are too shallow or not centered over pulleys.",
      "Robot center of mass is too high.",
    ],
    checks: [
      "Verify that battery pack is mounted in lowermost underslung position.",
      "Check alignment between top hook throat and drive pulley groove.",
    ],
    solutions: [
      "Tighten cable turnbuckles to at least 150 N tension.",
      "Ensure captive safety retaining clips are fastened across hook openings.",
      "Keep heavy battery payload at lowest point to maximize pendulum stability.",
    ],
  },
  {
    problem: "Automatic reversing limit switch does not trigger at bumper",
    causes: [
      "Bumper stop on cable is too small to strike the micro switch lever.",
      "Limit switch wiring is loose or dry solder joint.",
    ],
    checks: [
      "Press limit switch lever manually with finger to test polarity reversal.",
      "Verify continuity of DPDT switch wiring with multimeter buzzer.",
    ],
    solutions: [
      "Install a wider 30mm plastic ball or foam flag stop on the cable.",
      "Resolder switch leads and insulate with marine heat-shrink tubing.",
    ],
  },
];
