import { MachineData } from "@/types/machine";

export const DRONE_B_MACHINE_DATA: MachineData = {
  id: "drone-b",
  name: "Drone B — Industrial Octagonal UAV",
  category: "Industrial Heavy-Lift Avionics",
  badge: "SOLIDWORKS CAD / 006",
  tagline: "Heavy-duty octagonal fuselage quadcopter with custom lattice truss arms, internal avionics bay, and modular landing skids.",
  description:
    "An industrial-grade heavy-lift quadcopter engineered in SolidWorks with a rigid 300x300mm octagonal fuselage cage, 4 custom triangular truss lattice arms (325mm), 50mm brushless outrunners, and 460mm (18-inch) industrial propellers.",
  modelPath: "/assets/Drone B",
  defaultCameraPosition: [2.6, 1.8, 2.9],
  defaultFov: 40,
  components: [
    {
      id: "main-frame",
      name: "Octagonal Main Frame Fuselage",
      category: "Structure",
      meshNamePattern: /frame|body|chassis|cage/i,
      description:
        "Rigid 300 mm x 300 mm x 70 mm octagonal core hull structure. Features 4 angled corner sockets with precision through-holes for arm mounting, 4 orthogonal side access bays, and internal mounting floor with raised standoff bosses for avionics.",
      purpose:
        "Serves as the structural backbone of the drone, distributing extreme aerodynamic loads and isolating internal flight computing hardware.",
      specs: [
        { label: "Dimensions", value: "300 x 300 x 70 mm" },
        { label: "Material", value: "6061-T6 Billet Aluminum / Carbon Composite" },
        { label: "Mounting Geometry", value: "45° Symmetrical Octagonal Corners" },
        { label: "Internal Clearance", value: "240 x 240 x 60 mm Bay" },
        { label: "Mass", value: "420 g" },
      ],
      explosionVector: [0, 0, 0],
      explosionDistance: 0,
    },
    {
      id: "cover-plate",
      name: "Top Octagonal Cover Plate",
      category: "Structure",
      meshNamePattern: /cover|plate|lid|roof/i,
      description:
        "Precision machined 300 mm x 300 mm x 10 mm octagonal top lid with 60 mm x 45° corner chamfers and 8 perimeter M8 bolt holes clamping firmly onto the fuselage upper rim.",
      purpose:
        "Seals the avionics chamber against debris and moisture, creating a fully enclosed aerodynamic fuselage box structure.",
      specs: [
        { label: "Dimensions", value: "300 x 300 x 10 mm" },
        { label: "Chamfer Angle", value: "60 mm x 45°" },
        { label: "Fastening", value: "8x M8 Socket Head Bolts (DIN 912)" },
        { label: "Bolt Spacing", value: "218 mm / 280 mm Centers" },
        { label: "Mass", value: "180 g" },
      ],
      explosionVector: [0, 1.8, 0],
      explosionDistance: 2.2,
    },
    {
      id: "controller-unit",
      name: "Central Flight Controller & Avionics Unit",
      category: "Avionics",
      meshNamePattern: /controller|flight|brain|electronics/i,
      description:
        "Internal avionics casing measuring 200 mm x 60 mm x 53 mm with stepped mounting ears. Houses redundant triple-axis gyroscopes, accelerometers, barometric altimeters, and autonomous navigation processing modules.",
      purpose:
        "Processes sensor feedback at 1 kHz, executes PID loop control, and regulates motor RPM commands for precision attitude hold.",
      specs: [
        { label: "Dimensions", value: "200 x 60 x 53 mm" },
        { label: "Mounting Flange", value: "176 mm x 30 mm Center Centers" },
        { label: "Fastening", value: "4x M8 Bolts with Anti-Vibration Grommets" },
        { label: "Sensors", value: "Triple Redundant IMU + Barometer" },
        { label: "Mass", value: "150 g" },
      ],
      explosionVector: [0, 1.2, 0],
      explosionDistance: 1.5,
    },
    {
      id: "arms",
      name: "4x Custom Lattice Truss Arms (Arm.SLDPRT)",
      category: "Airframe",
      meshNamePattern: /arm|boom|truss/i,
      description:
        "Custom engineered cantilever booms measuring 325 mm total length (300 mm motor center distance). Features a reinforced root mounting flange, integrated aerodynamic vertical winglet, and 4 repeating 45° triangular cutout pockets (▲▼▲▼▲ pattern) optimizing strength-to-weight ratio.",
      purpose:
        "Mounts the heavy-duty motors at a wide 650 mm diagonal stance for maximum control moment arm and stability.",
      specs: [
        { label: "Total Length", value: "325 mm (300 mm Motor Center)" },
        { label: "Root Flange", value: "60 mm Height x 15 mm Thickness" },
        { label: "Truss Pattern", value: "4x Alternating 45° Triangular Cutouts" },
        { label: "Motor Mount", value: "Φ30 mm Circular Head with Φ10 mm Bore" },
        { label: "Quantity", value: "4 Arms (Symmetric X-Quad)" },
        { label: "Total Mass", value: "340 g (85 g each)" },
      ],
      explosionVector: [1.2, 0, 1.2],
      explosionDistance: 1.6,
    },
    {
      id: "side-covers",
      name: "4x Structural Aluminum Side Covers",
      category: "Structure",
      meshNamePattern: /side|panel|plate/i,
      description:
        "Four rectangular 180 mm x 90 mm x 5 mm protective shear plates covering the orthogonal openings of the main octagonal frame. Fastened with 6 M8 bolts each (total 24 bolts).",
      purpose:
        "Provides torsional shear resistance to the fuselage box while allowing rapid ground access to ESC wiring and battery leads.",
      specs: [
        { label: "Dimensions", value: "180 x 90 x 5 mm (each)" },
        { label: "Hole Pattern", value: "6x Φ8 mm Through-Holes per cover" },
        { label: "Fasteners", value: "24x M8 Socket Head Bolts (15 mm length)" },
        { label: "Quantity", value: "4 Panels (Front, Rear, Left, Right)" },
        { label: "Total Mass", value: "260 g (65 g each)" },
      ],
      explosionVector: [1.5, 0, 0],
      explosionDistance: 1.8,
    },
    {
      id: "motors",
      name: "4x Heavy-Duty 50mm Brushless Outrunner Motors",
      category: "Propulsion",
      meshNamePattern: /motor|stator|rotor/i,
      description:
        "High-torque industrial brushless motors with a 50 mm outer rotor diameter, 40 mm body length, and a 115 mm total hardened steel shaft (10 mm diameter). Mounted vertically through the arm tip with lower retaining nuts.",
      purpose:
        "Produces up to 4.2 kg of static thrust per axis (total 16.8 kg thrust) driving large heavy-lift propellers with minimal heat buildup.",
      specs: [
        { label: "Rotor Dimensions", value: "Φ50 mm x 40 mm Body" },
        { label: "Drive Shaft", value: "Φ10 mm x 115 mm Hardened Alloy Steel" },
        { label: "Configuration", value: "12S14P Brushless Outrunner" },
        { label: "Continuous Current", value: "45 A (6S - 12S LiPo compatible)" },
        { label: "Quantity", value: "4 Motors (CW & CCW Pairings)" },
        { label: "Total Mass", value: "720 g (180 g each)" },
      ],
      explosionVector: [1.2, 0.8, 1.2],
      explosionDistance: 1.9,
    },
    {
      id: "propellers",
      name: "4x 460mm (18-Inch) Industrial Propellers",
      category: "Propulsion",
      meshNamePattern: /prop|blade/i,
      description:
        "Aerodynamically curved 460 mm (18.1 inch) carbon/nylon propellers with a 30 mm central hub, 10 mm bore hole, and M10 threaded retaining dome nuts.",
      purpose:
        "Converts rotational shaft power into vertical thrust with high aerodynamic efficiency at moderate RPM.",
      specs: [
        { label: "Total Diameter", value: "460 mm (230 mm blade radius / 18.1 in)" },
        { label: "Center Hub", value: "Φ30 mm with Φ10 mm Through-Hole" },
        { label: "Blade Pitch", value: "5.5 inch Twisted Camber Airfoil" },
        { label: "Fastening", value: "4x M10 Threaded Propeller Retaining Nuts" },
        { label: "Quantity", value: "4 Propellers (2x CW, 2x CCW)" },
        { label: "Total Mass", value: "128 g (32 g each)" },
      ],
      explosionVector: [0, 2.4, 0],
      explosionDistance: 2.8,
    },
    {
      id: "stands",
      name: "2x Arched Heavy Landing Skid Loops",
      category: "Landing Gear",
      meshNamePattern: /stand|leg|skid|foot/i,
      description:
        "Dual U-shaped landing skid brackets measuring 100 mm width x 80 mm height x 45 mm depth with a 20° rear sweep angle. Bolted directly beneath the main frame with 4x M8 bolts.",
      purpose:
        "Provides 80 mm of ground clearance for underslung payload cameras and absorbs touchdown kinetic shock energy.",
      specs: [
        { label: "Dimensions", value: "100 mm Width x 80 mm Height x 45 mm Depth" },
        { label: "Rake Angle", value: "20° Sweep-Back" },
        { label: "Mounting Spacing", value: "50 mm Bolt Center Distance" },
        { label: "Quantity", value: "2 Skid Loops" },
        { label: "Total Mass", value: "150 g (75 g each)" },
      ],
      explosionVector: [0, -1.6, 0],
      explosionDistance: 1.8,
    },
    {
      id: "hardware-bolts-nuts",
      name: "Precision Metric Fasteners & Bolts (60+ Parts)",
      category: "Hardware",
      meshNamePattern: /bolt|nut|screw|fastener/i,
      description:
        "Complete structural fastening hardware as documented in the official SolidWorks BOM: 12x Bolt-Arm, 12x Nut-Arm, 4x Bolt-controller, 8x Bolt-Cover plate, 24x Bolt-Side cover, 4x Bolt-Stand, 4x Nut-Motor-Arm, 4x Nut-Propeller.",
      purpose:
        "Maintains structural integrity and pre-load clamping force across all frame joints under high-vibration flight conditions.",
      specs: [
        { label: "Bolt Standards", value: "DIN 912 / ISO 4762 Socket Head" },
        { label: "Material Grade", value: "Class 10.9 High-Tensile Alloy Steel" },
        { label: "Total Fasteners", value: "60+ Precision Bolts & Lock Nuts" },
        { label: "Total Mass", value: "220 g" },
      ],
      explosionVector: [0.8, 0.8, 0.8],
      explosionDistance: 1.4,
    },
  ],
};
