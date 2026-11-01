import { BOMItem, CollectionChecklistItem, MachineData, ScrapSourceItem } from "@/types/machine";

// ============================================================================
// SINGLE SOURCE OF TRUTH: STRIDER-X1 WALKING ROBOT SPECIFICATIONS
// ============================================================================
export const ROBOT_SPEC = {
  name: "Strider-X1 Mechanical Walking Robot",
  version: "Rev 2.4 - Kinematic Correction",
  linkageType: "Four-Bar Crank-Rocker Mechanism (Chebyshev-Derived Stride)",
  driveType: "Direct-Drive Dual-Shaft BO Geared DC Motor",
  motor: {
    type: "Single BO Geared DC Motor (Dual Output Shaft)",
    nominalVoltage: "3.0V - 6.0V DC",
    nominalArmatureSpeed: "2,880 RPM @ 3V / 5,760 RPM @ 6V",
    gearReductionRatio: "1:48 Compound Spur Gearbox",
    noLoadOutputRPM: "60 RPM @ 3V / 120 RPM @ 6V",
    stallTorque: "0.8 kg-cm @ 3V / 1.5 kg-cm @ 6V",
    shaftDimensions: "5.5 mm diameter dual flat-face D-shaft (length 10 mm per side)"
  },
  kinematics: {
    crankRadius: "15.0 mm (throw = 30.0 mm total travel)",
    connectingRodLength: "45.0 mm (hole-to-hole center pitch)",
    hipPivotHeight: "42.0 mm above motor shaft centerline",
    hipToKneeLength: "32.0 mm",
    totalLegLength: "85.0 mm from hip pivot to footpad",
    phaseOffset: "180.0° anti-phase between Left and Right crank pins",
    strideLength: "28.0 mm per single crank revolution",
    footLiftClearance: "12.0 mm vertical obstacle clearance",
    stanceRatio: "54% ground contact (support) / 46% swing recovery"
  },
  chassis: {
    length: "110.0 mm",
    width: "60.0 mm",
    thickness: "3.0 mm",
    material: "3mm Cast Acrylic / Birch Plywood / Hard Cardboard",
    stanchionHeight: "55.0 mm upright pivot brackets (pair)",
    totalMass: "165 grams (including dual AA battery payload)"
  },
  speeds: {
    slow: { label: "Slow", crankRPM: 30, armatureRPM: 1440, linearVelocityCmS: 1.4, note: "PWM duty cycle ~45% / 2.2V equivalent" },
    normal: { label: "Normal", crankRPM: 60, armatureRPM: 2880, linearVelocityCmS: 2.8, note: "Nominal 3.0V (2x AA fresh alkaline cells)" },
    fast: { label: "Fast", crankRPM: 120, armatureRPM: 5760, linearVelocityCmS: 5.6, note: "Overdrive 6.0V (4x AA pack or Li-ion 7.4V regulated)" }
  }
};

// ============================================================================
// COMPONENT HIERARCHY (7 STANDARD ENGINEERING CATEGORIES)
// ============================================================================
export const WALKING_ROBOT_MACHINE_DATA: MachineData = {
  id: "walking-robot",
  name: "Strider-X1 Mechanical Walking Robot",
  category: "Kinematics & Bionics",
  badge: "MECHANICAL LAB / 003",
  tagline: "Explore crank-rocker leg linkages, alternating support phases, and low-cost construction.",
  description: "A compact wheel-less walking automaton driven by a dual-shaft geared BO motor. It converts uniform rotational power into an alternating bio-inspired walking gait using four-bar leg linkages.",
  modelPath: "/models/walking-robot.glb",
  defaultCameraPosition: [2.2, 1.4, 2.6],
  defaultFov: 42,
  components: [
    // 1. Structure
    {
      id: "chassis-plate",
      name: "Chassis Baseplate & Uprights",
      category: "Structure",
      description: "Rigid horizontal structural spine with two vertical stanchion brackets providing aligned pivot holes for the hip axle.",
      purpose: "Maintains mechanical alignment between the motor drive shaft and leg pivot axes; absorbs reaction forces without bulky enclosing walls.",
      workingPrinciple: "A structural shear plate resisting bending moments when alternating legs support the robot's weight.",
      material: "3mm Acrylic Sheet / 3mm Birch Plywood / Hard Cardboard",
      recommendedQty: 1,
      dimensions: "110 mm x 60 mm x 3 mm",
      interconnections: "Fastens to BO motor with 2x M3 x 30mm bolts; carries battery holder and upper hip pivot bar.",
      priceINR: 35,
      alternatives: "Old plastic food container lids, stiff composite cardboard, plywood offcuts.",
      sourcingTip: "Can be cut using a handheld hobby saw or laser cutter from scrap acrylic signboards.",
      specs: [
        { label: "Material", value: "3mm Cast Acrylic / Plywood" },
        { label: "Dimensions", value: "110 x 60 x 3 mm" },
        { label: "Weight", value: "32 grams" },
        { label: "Hole Diameter", value: "3.2 mm (M3 Clearance)" }
      ],
      explosionVector: [0, 0, 0],
      explosionDistance: 0,
    },
    {
      id: "chassis-stanchions",
      name: "Hip Pivot Stanchion Brackets",
      category: "Structure",
      description: "Twin low-profile vertical upright brackets holding the upper hip crossbar axle at exactly 42mm above the motor shaft.",
      purpose: "Locates the primary hip rotation axis rigidly above the motor shaft, leaving the mechanism completely open and visible.",
      workingPrinciple: "Transfers the robot's gravitational load from the chassis directly into the walking leg rocker arms.",
      material: "3mm Acrylic / Plywood / Aluminum angle bracket",
      recommendedQty: 2,
      dimensions: "55 mm Height x 16 mm Width x 3 mm Thickness",
      interconnections: "Slotted into or screwed to the chassis baseplate; cross-drilled with 3.2mm pivot hole at 42mm height.",
      priceINR: 15,
      alternatives: "Meccano strips, L-brackets from hardware stores, popsicle sticks.",
      sourcingTip: "Salvage small metal angle brackets from old audio speakers or small furniture fittings.",
      specs: [
        { label: "Pivot Height", value: "42.0 mm above motor axis" },
        { label: "Axle Bore", value: "3.2 mm smooth clearance" }
      ],
      explosionVector: [0, 0.4, 0],
      explosionDistance: 0.8,
    },

    // 2. Actuation
    {
      id: "bo-motor",
      name: "Dual-Shaft BO Geared DC Motor",
      category: "Actuation",
      description: "Low-voltage high-torque permanent magnet DC motor coupled to an integrated 1:48 spur reduction gearbox.",
      purpose: "Provides continuous rotational torque through dual bilateral output shafts to turn left and right drive cranks simultaneously.",
      workingPrinciple: "High-speed low-torque armature rotation (~2,880 RPM @ 3V) is stepped down through 4 compound spur gears, delivering 60 RPM of usable torque.",
      material: "Yellow ABS plastic casing, brass & POM reduction gears, steel motor can",
      recommendedQty: 1,
      dimensions: "64 mm x 22 mm x 19 mm",
      interconnections: "Clamped to chassis via 2x M3 x 30mm through-bolts; dual output shafts press-fit to cranks.",
      priceINR: 65,
      alternatives: "Toy car gear motor, N20 micro metal gear motor, optical drive tray eject motor with reduction pulley.",
      sourcingTip: "Found inside broken remote-controlled toy cars, battery-operated toy trucks, or hobby electronics shops.",
      specs: [
        { label: "Nominal Voltage", value: "3.0V - 6.0V DC" },
        { label: "Gear Reduction", value: "1:48 Compound Spur" },
        { label: "No-Load Output", value: "60 RPM @ 3V / 120 RPM @ 6V" },
        { label: "Stall Torque", value: "0.8 kg-cm @ 3V / 1.5 kg-cm @ 6V" },
        { label: "Shaft Standard", value: "Dual Flat-Side D-Shaft (5.5mm)" }
      ],
      hasSubAssembly: true,
      subAssemblyId: "motor-internals",
      subAssemblyName: "Motor & Gearbox Core",
      explosionVector: [0, 0.5, 0.2],
      explosionDistance: 1.0,
    },

    // 3. Transmission
    {
      id: "crank-mechanism",
      name: "Dual Drive Cranks (180° Anti-Phase)",
      category: "Transmission",
      description: "Balanced rotating crank arms keyed directly to the motor output shafts with an exact 180-degree angular offset.",
      purpose: "Converts uniform motor rotary shaft speed into orbital crank pin displacement for connecting rods.",
      workingPrinciple: "Direct-drive transmission (1:1 ratio from motor shaft to crank). The 180° offset guarantees that when left leg is in stance, right leg is in swing.",
      material: "Reinforced Acrylic / High-Density Polyethylene / Hardwood / 3D Printed PLA",
      recommendedQty: 2,
      dimensions: "Radius 15.0 mm center-to-pin (Overall length 28 mm x 12 mm x 3 mm)",
      interconnections: "Keyed onto motor D-shafts; crank pins connect to lower connecting rod eyelets.",
      priceINR: 15,
      alternatives: "Plastic bottle caps with off-center drilled holes, servo horn arms, small toy wheels.",
      sourcingTip: "Plastic bottle caps with a 3mm hole drilled exactly 15mm from center make ideal low-friction cranks.",
      specs: [
        { label: "Crank Radius (R)", value: "15.0 mm" },
        { label: "Phase Shift", value: "180.0° Left-to-Right" },
        { label: "Transmission Ratio", value: "1:1 Direct Drive" },
        { label: "Crank Pin", value: "M3 x 15mm Bolt + Locknut" }
      ],
      explosionVector: [1.6, 0, 0],
      explosionDistance: 1.4,
    },

    // 4. Leg Linkage
    {
      id: "connecting-rods",
      name: "Connecting Rods (Coupler Links)",
      category: "Leg Linkage",
      description: "Rigid coupler links connecting the orbital crank pins directly to the knee joints on the leg assemblies.",
      purpose: "Transfers pushing and pulling forces from the rotating crank pin to articulate the leg rocker arms through the walking stroke.",
      workingPrinciple: "Acts as Link 3 in the closed 4-bar kinematic chain. Both eyelets remain physically joined to their pins throughout all 360° of rotation.",
      material: "Hardwood Popsicle Sticks / 3mm Acrylic / Aluminum Bar",
      recommendedQty: 2,
      dimensions: "Length 55 mm (Hole-to-hole pitch: exactly 45.0 mm) x Width 9 mm x Thickness 2.5 mm",
      interconnections: "Lower eyelet pivots on crank pin; upper eyelet pivots on leg knee joint pin.",
      priceINR: 20,
      alternatives: "Wooden tongue depressors, Meccano perforated strips, stiff wire links, plastic ruler strips.",
      sourcingTip: "Standard wooden ice cream sticks with precision-drilled 3.2mm holes work reliably and are easy to replace.",
      specs: [
        { label: "Hole-to-Hole Pitch", value: "45.0 mm exact" },
        { label: "Bore Diameter", value: "3.2 mm (M3 pivot pin)" },
        { label: "Washers", value: "Smooth Nylon M3 on both faces" }
      ],
      explosionVector: [1.2, 0.4, 0],
      explosionDistance: 1.2,
    },

    // 5. Walking Assembly
    {
      id: "left-legs",
      name: "Left Walking Leg Assembly",
      category: "Walking Assembly",
      description: "Articulated dual-contact rocker leg structure suspended from the upper hip crossbar on the left side of the robot.",
      purpose: "Lifts, sweeps forward, plants onto the floor, and pushes rearward to propel the robot forward.",
      workingPrinciple: "A Chebyshev-derived four-bar rocker tracing a closed D-shaped foot trajectory: flat on the floor during push, arched upward during return.",
      material: "Hardwood Sticks / 3mm Cast Acrylic / Plywood",
      recommendedQty: 1,
      dimensions: "Hip-to-Foot: 85.0 mm | Fore-Aft Footbase: 65.0 mm",
      interconnections: "Upper eyelet pivots around hip crossbar; knee joint pin connects to left connecting rod.",
      priceINR: 30,
      alternatives: "Plywood laser-cut legs, acrylic cutouts, craft sticks.",
      sourcingTip: "Drill both left and right leg blanks simultaneously while clamped together to guarantee identical geometry.",
      specs: [
        { label: "Stride Length", value: "28.0 mm per cycle" },
        { label: "Step Clearance", value: "12.0 mm lift" },
        { label: "Stance Phase", value: "54% ground contact" }
      ],
      explosionVector: [1.8, 0, 0.3],
      explosionDistance: 1.8,
    },
    {
      id: "right-legs",
      name: "Right Walking Leg Assembly",
      category: "Walking Assembly",
      description: "Identical mirror-image articulated dual-contact rocker leg structure mounted on the right side of the robot.",
      purpose: "Alternates with the left leg in 180° anti-phase to maintain dynamic stability and uninterrupted forward progression.",
      workingPrinciple: "When the right crank is at top-dead-center (swing), the left crank is at bottom-dead-center (stance).",
      material: "Hardwood Sticks / 3mm Cast Acrylic / Plywood",
      recommendedQty: 1,
      dimensions: "Hip-to-Foot: 85.0 mm | Fore-Aft Footbase: 65.0 mm",
      interconnections: "Upper eyelet pivots around hip crossbar; knee joint pin connects to right connecting rod.",
      priceINR: 30,
      alternatives: "Plywood laser-cut legs, acrylic cutouts, craft sticks.",
      sourcingTip: "Ensure the hip pivot axle has smooth nylon spacers so the right leg cannot migrate laterally.",
      specs: [
        { label: "Stride Length", value: "28.0 mm per cycle" },
        { label: "Phase Angle", value: "180.0° relative to Left" },
        { label: "Footpad Area", value: "20 mm x 12 mm" }
      ],
      explosionVector: [-1.8, 0, 0.3],
      explosionDistance: 1.8,
    },
    {
      id: "rubber-feet",
      name: "High-Traction Rubber Footpads",
      category: "Walking Assembly",
      description: "Elastomeric textured grip pads adhered to the bottom contact tips of all walking feet.",
      purpose: "Provides static friction against smooth surfaces (tiles, wood, desk) to prevent slipping during the stance phase.",
      workingPrinciple: "Increases coefficient of friction from μ ≈ 0.25 (bare wood/plastic) to μ ≈ 0.75, converting leg rearward thrust into robot forward velocity.",
      material: "Neoprene Foam / Silicone Rubber / Solidified Hot Glue Bead",
      recommendedQty: 4,
      dimensions: "18 mm x 12 mm x 3 mm",
      interconnections: "Bonded with cyanoacrylate (super glue) or hot glue to the bottom of each foot strut.",
      priceINR: 10,
      alternatives: "Drop of hot glue allowed to cool, slice of bicycle inner tube, pencil eraser slice.",
      sourcingTip: "Use slices of a discarded pencil eraser or droplets of hot glue on the foot tips.",
      specs: [
        { label: "Friction Coeff", value: "μ ≈ 0.75 on smooth tiles" },
        { label: "Shock Damping", value: "Absorbs foot impact shock" }
      ],
      explosionVector: [0, -1.0, 0],
      explosionDistance: 1.2,
    },

    // 6. Power and Electronics
    {
      id: "battery-holder",
      name: "Battery Holder (2x AA / 3.0V Pack)",
      category: "Power and Electronics",
      description: "Molded polypropylene battery cradle with nickel-plated spring contacts and red/black wire leads.",
      purpose: "Holds two standard 1.5V AA cells in series to provide 3.0V DC regulated power safely.",
      workingPrinciple: "Chemical energy in alkaline or NiMH cells is released through galvanic reactions into steady direct current.",
      material: "Molded polypropylene case, tempered spring steel contacts",
      recommendedQty: 1,
      dimensions: "58 mm x 32 mm x 15 mm",
      interconnections: "Mounted along chassis centerline for balanced CoG; positive lead wired through switch.",
      priceINR: 20,
      alternatives: "3x AAA holder, 18650 Li-ion battery with holder, 9V battery with buck converter.",
      sourcingTip: "Salvaged from broken battery toys, remotes, or cheap LED torches.",
      specs: [
        { label: "Nominal Output", value: "3.0 Volts (2x 1.5V Cells in Series)" },
        { label: "Battery Chemistry", value: "Alkaline / Rechargeable NiMH" },
        { label: "Operating Current", value: "350 - 450 mA typical load" }
      ],
      explosionVector: [0, 0.6, -1.0],
      explosionDistance: 1.4,
    },
    {
      id: "rocker-switch",
      name: "SPST Mini Rocker Power Switch",
      category: "Power and Electronics",
      description: "Subminiature single-pole single-throw latching mechanical switch.",
      purpose: "Enables users to conveniently turn the walking robot ON and OFF without disconnecting battery terminals.",
      workingPrinciple: "A spring-loaded internal copper wiper makes or breaks the positive battery circuit loop.",
      material: "Nylon 66 housing, copper alloy terminals, silver-plated contacts",
      recommendedQty: 1,
      dimensions: "15 mm x 10 mm x 12 mm",
      interconnections: "Interposed along the positive red wire between battery holder and motor terminal.",
      priceINR: 10,
      alternatives: "Slide switch, push-on-push-off button, paperclip knife switch.",
      sourcingTip: "Found on almost any broken electronic toy, desk fan, or power adapter.",
      specs: [
        { label: "Type", value: "SPST (Single Pole, Single Throw)" },
        { label: "Current Rating", value: "3A @ 250V AC / 6A @ 12V DC" },
        { label: "Contact Resistance", value: "< 20 mΩ" }
      ],
      explosionVector: [0, 0.8, -0.6],
      explosionDistance: 1.2,
    },

    // 7. Fasteners
    {
      id: "hardware-fasteners",
      name: "M3 Hardware, Spacers & Washers",
      category: "Fasteners",
      description: "Set of M3 machine screws, nylon locknuts, plastic standoffs, and smooth low-friction washers.",
      purpose: "Secures motor, forms low-friction rotating pivot pins for the leg joints, and maintains lateral spacing.",
      workingPrinciple: "Nyloc nuts prevent joint loosening from continuous walking vibration; washers isolate rubbing links to reduce friction by 60%.",
      material: "Zinc-plated mild steel bolts, nylon insert locknuts, POM/Nylon washers",
      recommendedQty: 12,
      dimensions: "M3 x 15mm, M3 x 25mm, M3 x 35mm bolts + M3 locknuts",
      priceINR: 25,
      alternatives: "Safety pins, paper clips with beads, toothpicks with hot glue stoppers, wire cotter pins.",
      sourcingTip: "Available in any local hardware or screw shop; old computer cabinets have plenty of M3 screws.",
      specs: [
        { label: "Thread Standard", value: "Metric M3 x 0.5 mm" },
        { label: "Washers", value: "Smooth Nylon M3 (reduces friction by 60%)" },
        { label: "Locknuts", value: "DIN 985 Nylon Insert Self-Locking" }
      ],
      explosionVector: [0, -0.6, 0],
      explosionDistance: 1.0,
    }
  ]
};

// ============================================================================
// VERIFIED 10-STAGE ENGINEERING BUILD GUIDE
// ============================================================================
export const ROBOT_BUILD_STAGES = [
  {
    stage: 1,
    title: "Stage 1: Understand the Design & Walking Kinematics",
    subtitle: "How rotational power transforms into step-by-step mechanical walking",
    estimatedTime: "20 Minutes",
    difficulty: "Beginner Theory",
    summary: "Before cutting any material, understand how the Chebyshev-derived crank-rocker linkage works and why wheels are not required.",
    principles: [
      {
        heading: "1. Direct-Drive Rotary Transmission",
        detail: "The 1:48 reduction BO motor outputs continuous 360° circular rotation at 60 RPM (3V). The cranks are keyed directly to the output shafts (1:1 direct drive). An offset crank pin placed at radius R = 15.0 mm orbits in a circle, pushing and pulling the 45.0 mm connecting rod."
      },
      {
        heading: "2. The Four-Bar Kinematic Closed Chain",
        detail: "The mechanism consists of 4 closed links: Link 1 (Chassis frame ground between motor axis and hip pivot: 42 mm), Link 2 (Crank arm driver: 15 mm), Link 3 (Connecting rod coupler: 45 mm), and Link 4 (Leg hip-to-knee rocker: 32 mm). As Link 2 rotates, the foot traces an asymmetrical D-shaped stepping path."
      },
      {
        heading: "3. 180° Anti-Phase Synchronization",
        detail: "Crucially, the left crank and right crank are mounted exactly 180 degrees opposite to each other. When the left leg is pressed down into the floor (Support/Stance Phase, 54% of cycle), the right leg is lifted up and forward (Swing Phase, 46% of cycle). This prevents the robot from falling over."
      }
    ],
    checks: [
      "Verify left and right crank pins point in exactly opposite directions (180° offset).",
      "Confirm leg stroke length (28 mm) is greater than height lift (12 mm)."
    ],
    mistakes: [
      "Mounting both cranks in the same direction (robot will jump in place instead of walking).",
      "Using an un-geared drone motor that spins at 10,000 RPM with zero torque."
    ]
  },
  {
    stage: 2,
    title: "Stage 2: Collect Components & Sourcing",
    subtitle: "Gathering hardware from scrap, household items, or local shops",
    estimatedTime: "1 Hour",
    difficulty: "Sourcing & Prep",
    summary: "Everything needed to build the robot can be purchased for under ₹200 ($2.50), or collected for nearly free from broken toys.",
    principles: [
      {
        heading: "Essential Bill of Materials",
        detail: "1x Dual-shaft BO Motor, 1x 2xAA Battery Holder, 2x AA batteries, 1x SPST switch, 12x Popsicle sticks or acrylic scrap, 6x M3 bolts & nuts, 4x rubber pads."
      },
      {
        heading: "Testing Salvaged Motors",
        detail: "If using a motor salvaged from an old toy car, touch its two lead wires to a fresh AA battery. If the shaft spins smoothly with good resistance against your thumb, the internal gear reduction is healthy."
      }
    ],
    checks: [
      "Dual output shafts turn simultaneously when power is applied.",
      "Battery contacts are free of corrosion or white acid residue."
    ],
    mistakes: [
      "Using a high-speed drone motor without a gearbox (lacks torque and spins too fast to walk)."
    ]
  },
  {
    stage: 3,
    title: "Stage 3: Tools & Safety Preparation",
    subtitle: "Practical workshop tools and safe operating procedures",
    estimatedTime: "15 Minutes",
    difficulty: "Safety First",
    summary: "Basic hobby tools you already have at home or in a school lab.",
    principles: [
      {
        heading: "Recommended Tools",
        detail: "Measuring ruler (mm scale), fine-tip marker pen, small hand drill or 3mm drill bit, craft cutter/scissors, hot glue gun, cross-head screwdriver, small pliers."
      },
      {
        heading: "Safety Precautions",
        detail: "Always cut away from your body on a cutting board. Hot glue reaches 180°C — do not touch the molten tip. Never connect batteries in direct short-circuit."
      }
    ],
    checks: [
      "Cutting mat or thick cardboard placed under your workspace.",
      "Hot glue gun rested on a heat-resistant stand."
    ],
    mistakes: [
      "Drilling holes without clamping the stick (stick can split along the grain)."
    ]
  },
  {
    stage: 4,
    title: "Stage 4: Chassis Construction",
    subtitle: "Measuring, cutting, and drilling the main structural backbone",
    estimatedTime: "30 Minutes",
    difficulty: "Fabrication",
    summary: "The chassis holds the motor, battery pack, and provides the fixed pivot points for both legs.",
    principles: [
      {
        heading: "Step-by-Step Chassis Fabrication",
        detail: "1. Cut a rectangular baseplate measuring 110 mm x 60 mm from 3mm acrylic, MDF, or double-wall corrugated cardboard.\n2. Mark the centerline for the BO motor mount.\n3. Drill two 3.2mm clearance holes to match the BO motor's mounting screw slots.\n4. Fabricate two vertical upright stanchion brackets (55mm x 16mm) and drill the hip pivot holes at exactly 42mm above the motor shaft centerline."
      },
      {
        heading: "Why Pivot Symmetry Matters",
        detail: "If the left pivot hole is even 2mm higher than the right pivot hole, the robot will limp or veer off to one side. Always measure from a common bottom edge."
      }
    ],
    checks: [
      "Both hip pivot holes are exactly parallel and equidistant (42 mm) from the motor shaft.",
      "Motor sits flat against the chassis without wobbling."
    ],
    mistakes: [
      "Building giant solid side-walls that box in the mechanism and prevent free leg movement."
    ]
  },
  {
    stage: 5,
    title: "Stage 5: Mechanical Leg & Linkage Construction",
    subtitle: "Crafting the cranks, connecting rods, and articulating leg struts",
    estimatedTime: "45 Minutes",
    difficulty: "Precision Crafting",
    summary: "The legs are built using popsicle sticks, acrylic strips, or 3D printed arms.",
    principles: [
      {
        heading: "Making the Cranks (Radius = 15.0 mm)",
        detail: "Cut two 28mm x 12mm pieces. Drill a hole on one end that tightly press-fits onto the motor D-shaft. Drill an M3 hole at exactly 15.0mm from center for the crank pin."
      },
      {
        heading: "Making Connecting Rods (Length = 45.0 mm)",
        detail: "Cut two 55mm sticks. Drill an M3 hole 5mm from each end (center-to-center distance = exactly 45.0 mm)."
      },
      {
        heading: "Assembling the Legs (Fore & Rear Struts)",
        detail: "Each leg is an inverted triangle/rocker with a hip pivot at the top, a knee drive pin at 32mm below the hip, and footpad at 85mm. Assemble left and right pairs identically."
      }
    ],
    checks: [
      "Pivots move freely with zero sticking, but without excessive lateral wobble.",
      "Nylon washers placed between every moving surface to eliminate friction."
    ],
    mistakes: [
      "Overtightening the pivot bolts so the joints bind and stall the motor."
    ]
  },
  {
    stage: 6,
    title: "Stage 6: Motor & Electrical Circuit Assembly",
    subtitle: "Simple, safe low-voltage DC circuit wiring",
    estimatedTime: "20 Minutes",
    difficulty: "Basic Electrical",
    summary: "Wire the 3V battery holder, SPST toggle switch, and DC motor.",
    principles: [
      {
        heading: "Circuit Loop Wiring",
        detail: "1. Connect the Red (+) wire from the battery pack to Pin 1 of the SPST switch.\n2. Connect Pin 2 of the switch to Motor Terminal A.\n3. Connect the Black (-) wire from the battery pack directly to Motor Terminal B."
      },
      {
        heading: "Motor Direction Test",
        detail: "Insert batteries and turn the switch ON. Check the direction of crank rotation. For forward walking, the top of the crank must rotate FORWARD (clockwise when viewed from the right side). If it rotates backwards, simply swap the two wires at the motor terminals!"
      }
    ],
    checks: [
      "Switch cleanly cuts off power when turned OFF.",
      "Wires are secured with electrical tape or cable ties away from rotating cranks."
    ],
    mistakes: [
      "Connecting a 9V battery directly to a 3V BO motor without a step-down resistor (burns motor)."
    ]
  },
  {
    stage: 7,
    title: "Stage 7: Final Mechanical Assembly",
    subtitle: "Mounting the components together in proper sequence",
    estimatedTime: "30 Minutes",
    difficulty: "Assembly",
    summary: "Bring the chassis, motor, linkages, and electronics together into one complete robot.",
    principles: [
      {
        heading: "Assembly Sequence",
        detail: "Step 1: Bolt the BO motor securely to the chassis using two M3 x 30mm bolts and nuts.\nStep 2: Press the Left Crank onto the left shaft pointing vertically UP (0°).\nStep 3: Press the Right Crank onto the right shaft pointing vertically DOWN (180°).\nStep 4: Attach the connecting rods to the crank pins with nylon locknuts (leave 0.5mm play).\nStep 5: Bolt the upper leg hip pivots to the chassis stanchions.\nStep 6: Mount the battery holder on the chassis centerline for balanced weight."
      }
    ],
    checks: [
      "Turn the cranks by hand with power off; the legs should cycle smoothly through full rotations without binding.",
      "Robot stands upright on all four footpads."
    ],
    mistakes: [
      "Forgetting locknuts, causing standard nuts to unscrew during walking vibration."
    ]
  },
  {
    stage: 8,
    title: "Stage 8: Testing & Kinematic Calibration",
    subtitle: "First power-on test, stride tuning, and balance adjustment",
    estimatedTime: "20 Minutes",
    difficulty: "Calibration",
    summary: "Calibrate the robot's gait, center of gravity, and traction.",
    principles: [
      {
        heading: "1. Air Test (No Load)",
        detail: "Hold the robot up in the air and turn it on. Observe the leg motion. Both sides should beat in a steady, rhythmic cadence without straining or shaking."
      },
      {
        heading: "2. Surface Testing & Traction",
        detail: "Place the robot on a clean flat surface (desk or tile floor). If the legs kick but the robot slips in place, add high-traction rubber footpads or droplets of hot glue to the bottom of the feet."
      },
      {
        heading: "3. Center of Gravity (CoG) Tuning",
        detail: "If the robot tips backward, slide the battery holder slightly forward. The center of mass should sit directly over the active stance footprint."
      }
    ],
    checks: [
      "Robot moves forward at least 15-20 cm in 5 seconds.",
      "No audible motor stalling or grinding sounds."
    ],
    mistakes: [
      "Testing on high-pile carpet (carpet strands can tangle in the cranks)."
    ]
  },
  {
    stage: 9,
    title: "Stage 9: Systematic Troubleshooting",
    subtitle: "Diagnosing and fixing real-world mechanical issues",
    estimatedTime: "As Needed",
    difficulty: "Diagnostic",
    summary: "When something doesn't work, follow this structured diagnostic checklist.",
    principles: [
      {
        heading: "Fast Diagnostic Matrix",
        detail: "• Motor hums but won't turn: Joint is overtightened or battery voltage is below 2.4V.\n• Robot turns in circles: One leg has more friction or slip than the other; check pivot alignment.\n• Robot walks backward: Swap the motor wire polarity.\n• Robot trips over its own feet: Cranks slipped out of 180° alignment; re-tighten crank setscrews."
      }
    ],
    checks: [
      "Battery voltage measured with a multimeter is above 2.8V.",
      "All pivot pins have smooth washer separation."
    ],
    mistakes: [
      "Applying WD-40 or heavy grease on wooden joints (causes wood to swell and bind)."
    ]
  },
  {
    stage: 10,
    title: "Stage 10: Engineering Improvements & Future Upgrades",
    subtitle: "Next-level modifications for advanced learning",
    estimatedTime: "Future Projects",
    difficulty: "Advanced",
    summary: "Once the basic mechanical walking robot is successful, explore these upgrades.",
    principles: [
      {
        heading: "1. Speed & Direction Control",
        detail: "Add an inexpensive PWM DC motor speed controller (₹45) or a double-pole double-throw (DPDT) reverse switch to walk both forward and backward."
      },
      {
        heading: "2. Klann or Strandbeest Leg Upgrade",
        detail: "Replace the 4-bar linkage with a Theo Jansen 8-bar mechanism for a flatter, more lifelike biological stepping stride."
      },
      {
        heading: "3. Microcontroller Autonomy",
        detail: "Mount an Arduino Nano or ESP32 with an HC-SR04 ultrasonic sensor to automatically detect walls and reverse or turn!"
      }
    ],
    checks: [
      "Ensure chassis can support the weight of added sensors.",
      "Verify power supply can handle added electronics."
    ],
    mistakes: [
      "Adding heavy components without reinforcing the leg linkage joints."
    ]
  }
];

// ============================================================================
// FREE SCRAP SOURCING CATALOG
// ============================================================================
export const SCRAP_SOURCES_CATALOG: ScrapSourceItem[] = [
  {
    id: "broken-toys",
    title: "Old Battery-Operated Toys & RC Cars",
    icon: "CarFront",
    usableParts: [
      "BO-style DC gear motors with internal pinions",
      "2x AA and 4x AA battery boxes with springs",
      "Slide switches and push buttons",
      "Small gears, axles, and metal shafts",
      "Rubber tires (can be sliced to make footpads)"
    ],
    safetyWarnings: [
      "Check battery compartment for green/white acid crust; wear gloves if corroded.",
      "Discard any swollen lithium batteries immediately in hazardous recycling."
    ],
    incompatibleParts: [
      "High-speed brushed drone motors without gearboxes (too fast, zero torque).",
      "Broken plastic gearboxes with missing teeth."
    ],
    collectionTips: "Ask younger cousins, check school toy donation drives, or search your home attic."
  },
  {
    id: "old-printers",
    title: "Discarded Desktop Printers & Scanners",
    icon: "Printer",
    usableParts: [
      "Precision ground steel guide rods (excellent pivot axles)",
      "High-grade reduction gears and timing pulleys",
      "Low-friction POM/Teflon bushings",
      "M3 and M4 machine screws with washers",
      "Micro switches and hookup wiring"
    ],
    safetyWarnings: [
      "Beware of printer power supplies containing high-voltage capacitors (do not touch internal PSU boards).",
      "Wear gloves to avoid black toner or ink stains."
    ],
    incompatibleParts: [
      "High-voltage mains transformers and laser scanner mirrors.",
      "Complex proprietary driver boards without accessible pinouts."
    ],
    collectionTips: "Local computer repair shops discard 2-3 broken inkjet printers every week and often give them away for free."
  },
  {
    id: "dvd-drives",
    title: "Obsolete CD/DVD Optical Drives",
    icon: "Disc",
    usableParts: [
      "Tray eject DC motors with belt pulleys",
      "Stainless steel linear guide rails",
      "Neodymium magnets",
      "Fine M2/M3 fasteners"
    ],
    safetyWarnings: [
      "Never look directly into the laser diode assembly if powered."
    ],
    incompatibleParts: [
      "Spindle brushless motors (require complex 3-phase ESC drivers to run)."
    ],
    collectionTips: "Old desktop computer towers at scrap dealers are packed with IDE/SATA DVD drives."
  },
  {
    id: "household-plastic",
    title: "Discarded Plastic Containers & Bottles",
    icon: "Box",
    usableParts: [
      "Stiff plastic lids (High-Density Polyethylene - HDPE) for durable chassis plates",
      "Plastic bottle caps (perfect for round crank discs)",
      "Nylon zip-ties and blister packaging for spacer washers"
    ],
    safetyWarnings: [
      "Wash containers thoroughly; do not use containers that held toxic chemicals or bleach.",
      "Use sharp craft knife carefully; always cut against a wooden board."
    ],
    incompatibleParts: [
      "Brittle polystyrene (cracks instantly when drilled)."
    ],
    collectionTips: "Shampoo bottles and ice cream tubs provide flexible, virtually unbreakable plastic sheets."
  },
  {
    id: "electronics-repair",
    title: "Local Electronics Repair Shops & Scrap Yards",
    icon: "Wrench",
    usableParts: [
      "Assorted bolts, nuts, and washers (often given for free from scrap bins)",
      "Discarded copper wire lengths",
      "Small rocker switches",
      "Perforated metal or plastic brackets"
    ],
    safetyWarnings: [
      "Wash hands thoroughly after handling uncleaned scrap metals."
    ],
    incompatibleParts: [
      "Rusty, bent screws with stripped drive heads."
    ],
    collectionTips: "Politely ask repair technicians for scrapped toy PCBs, battery clips, or discarded small appliances."
  }
];

// ============================================================================
// SINGLE SOURCE OF TRUTH BOM (MATCHING PROTOTYPE SPEC)
// ============================================================================
export const DEFAULT_BOM_ITEMS: BOMItem[] = [
  {
    id: "bom-chassis",
    name: "Chassis Baseplate & Stanchions (110x60mm)",
    category: "Structure",
    defaultQty: 1,
    qty: 1,
    estimatedPriceINR: 35,
    actualPriceINR: 0,
    sourceType: "DIY / Household",
    collected: false,
    notes: "3mm Acrylic / Plywood / Cardboard"
  },
  {
    id: "bom-motor",
    name: "Dual-Shaft BO Geared DC Motor (1:48, 3-6V)",
    category: "Actuation",
    defaultQty: 1,
    qty: 1,
    estimatedPriceINR: 65,
    actualPriceINR: 0,
    sourceType: "Electronics Shop",
    collected: false,
    notes: "Nominal 60 RPM @ 3V / 120 RPM @ 6V"
  },
  {
    id: "bom-cranks",
    name: "Dual Drive Cranks (Radius R = 15mm)",
    category: "Transmission",
    defaultQty: 2,
    qty: 2,
    estimatedPriceINR: 15,
    actualPriceINR: 0,
    sourceType: "DIY / Household",
    collected: false,
    notes: "Direct drive, 180° anti-phase offset"
  },
  {
    id: "bom-con-rods",
    name: "Connecting Rods (L = 45mm hole-to-hole)",
    category: "Leg Linkage",
    defaultQty: 2,
    qty: 2,
    estimatedPriceINR: 20,
    actualPriceINR: 0,
    sourceType: "DIY / Household",
    collected: false,
    notes: "Coupler links for 4-bar kinematic chain"
  },
  {
    id: "bom-legs",
    name: "Leg Linkage Struts (Popsicle / Acrylic)",
    category: "Walking Assembly",
    defaultQty: 8,
    qty: 8,
    estimatedPriceINR: 25,
    actualPriceINR: 0,
    sourceType: "DIY / Household",
    collected: false,
    notes: "Fore and rear dual rocker struts"
  },
  {
    id: "bom-footpads",
    name: "Textured Rubber Footpads / Silicone",
    category: "Walking Assembly",
    defaultQty: 4,
    qty: 4,
    estimatedPriceINR: 10,
    actualPriceINR: 0,
    sourceType: "DIY / Household",
    collected: false,
    notes: "Slices of pencil eraser or hot glue beads"
  },
  {
    id: "bom-batt-holder",
    name: "2x AA Battery Holder with Leads",
    category: "Power and Electronics",
    defaultQty: 1,
    qty: 1,
    estimatedPriceINR: 20,
    actualPriceINR: 0,
    sourceType: "Scrap / Free",
    collected: false,
    notes: "Mounted on chassis centerline for balanced CoG"
  },
  {
    id: "bom-batteries",
    name: "1.5V AA Alkaline Cells (Pair)",
    category: "Power and Electronics",
    defaultQty: 2,
    qty: 2,
    estimatedPriceINR: 30,
    actualPriceINR: 0,
    sourceType: "Electronics Shop",
    collected: false,
    notes: "Provides safe 3.0V direct power"
  },
  {
    id: "bom-switch",
    name: "SPST Mini Rocker / Slide Switch",
    category: "Power and Electronics",
    defaultQty: 1,
    qty: 1,
    estimatedPriceINR: 10,
    actualPriceINR: 0,
    sourceType: "Scrap / Free",
    collected: false,
    notes: "Mounted on rear stanchion"
  },
  {
    id: "bom-fasteners",
    name: "M3 Screws, Locknuts & Nylon Washers",
    category: "Fasteners",
    defaultQty: 12,
    qty: 12,
    estimatedPriceINR: 25,
    actualPriceINR: 0,
    sourceType: "Hardware Store",
    collected: false,
    notes: "M3 x 15mm, 25mm, 35mm with Nyloc nuts"
  }
];

// ============================================================================
// VERIFIED FIELD TROUBLESHOOTING MATRIX
// ============================================================================
export const ROBOT_TROUBLESHOOTING = [
  {
    symptom: "Motor hums or buzzes, but the legs do not move at all.",
    cause: "Mechanical pivot binding or low battery voltage below 2.4V.",
    solution: "1. Turn off power immediately to avoid motor winding burnout.\n2. Spin the motor shaft by hand. If it is stiff, loosen the M3 pivot locknuts by a quarter turn. The joints must swing under their own gravity.\n3. Verify battery voltage is above 2.8V."
  },
  {
    symptom: "Robot powers on, but legs slip on the floor and it doesn't move forward.",
    cause: "Insufficient coefficient of friction on the foot tips (μ < 0.3 on smooth tiles).",
    solution: "Bare wood or plastic feet slide on tiles. Apply a bead of hot glue onto each foot tip and let it cool, or glue a 2mm slice of rubber pencil eraser or bicycle inner tube to the bottom."
  },
  {
    symptom: "The robot walks backwards instead of forwards.",
    cause: "Motor polarity reversed, causing counter-clockwise crank rotation.",
    solution: "Desolder or disconnect the two motor terminal wires and reverse them (swap positive and negative). The cranks must rotate with forward-rolling motion."
  },
  {
    symptom: "One leg moves higher than the other, causing the robot to turn in circles.",
    cause: "Asymmetrical pivot hole drilling or mismatched linkage lengths.",
    solution: "Measure the distance from the motor shaft to the left hip pivot vs the right hip pivot. If they differ by more than 1.5mm, re-drill the chassis pivot holes or adjust the connecting rod length."
  },
  {
    symptom: "Robot takes a few steps and then topples backward or forward.",
    cause: "Center of Gravity (CoG) is outside the dynamic support polygon.",
    solution: "Loosen the battery pack mount and slide it towards the center of the chassis. The robot should balance stably on either two-leg support stance without tipping."
  },
  {
    symptom: "Pivot nuts keep unscrewing and falling off after 30 seconds of walking.",
    cause: "Continuous cyclic vibration loosening standard plain nuts.",
    solution: "Replace plain nuts with Nylon-insert locknuts (Nyloc). Alternatively, use two plain nuts locked against each other (jam nut technique), or add a tiny drop of Fevikwik/Loctite on the outer bolt thread."
  },
  {
    symptom: "Batteries drain extremely fast (less than 5 minutes run time).",
    cause: "Excessive mechanical friction forcing the motor to operate near stall current (>800mA).",
    solution: "Insert smooth plastic or nylon washers between every rubbing stick surface. Ensure connecting rods do not rub against the chassis plate."
  }
];
