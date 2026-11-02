import { MachineData } from "@/types/machine";
import { WALKING_ROBOT_MACHINE_DATA } from "./walkingRobotData";
import { ROBO_RUMBLE_MACHINE_DATA } from "./roboRumbleData";
import { AERO_DRONE_MACHINE_DATA } from "./aeroDroneData";
import { DRONE_B_MACHINE_DATA } from "./droneBData";
import { ESP32_DRONE_MACHINE_DATA } from "./esp32DroneData";
import { ROPEWAY_ROBOT_MACHINE_DATA } from "./ropewayRobotData";
import { ROBO_RACER_MACHINE_DATA } from "./roboRacerData";

export const MACHINES_DATA: Record<string, MachineData> = {
  "sports-car": {
    id: "sports-car",
    name: "Apex GT-V6 Supercar",
    category: "High-Performance Automotive",
    badge: "AUTOMOTIVE / 001",
    tagline: "Visualize, dissect and customize a precision-engineered track machine.",
    description: "An advanced mid-engine sports car architecture featuring high-downforce aerodynamics, a 3.0L twin-turbocharged V6 powerplant, and modular carbon-composite chassis.",
    modelPath: "/models/car.glb",
    defaultCameraPosition: [4.2, 2.2, 4.8],
    defaultFov: 42,
    components: [
      {
        id: "engine",
        name: "Twin-Turbo V6 Engine",
        category: "Powertrain",
        meshNamePattern: /engine|motor|metal/i,
        description: "The engine converts fuel and compressed air into mechanical rotational energy through thermodynamic combustion cycles.",
        purpose: "Generates high output torque and horsepower delivered through a dual-clutch transmission to the rear axle.",
        hasSubAssembly: true,
        subAssemblyId: "engine-v6",
        subAssemblyName: "V6 Engine Assembly",
        specs: [
          { label: "Type", value: "V6 60° Twin-Turbo" },
          { label: "Power", value: "300 HP @ 6,800 RPM" },
          { label: "Displacement", value: "3.0 L" },
          { label: "Valvetrain", value: "DOHC 24-Valve" },
          { label: "Aspiration", value: "Forced Induction" },
        ],
        explosionVector: [0, 1.2, 0.4],
        explosionDistance: 1.6,
      },
      {
        id: "body",
        name: "Aerodynamic Monocoque Body",
        category: "Chassis & Aero",
        meshNamePattern: /body|main/i,
        description: "Lightweight carbon-fiber reinforced composite exterior shell sculpted in wind tunnels for low drag and extreme downforce.",
        purpose: "Encloses internal mechanical systems, protects occupants, and channels high-speed airflow into cooling ducts.",
        specs: [
          { label: "Material", value: "Pre-preg Carbon Composite" },
          { label: "Drag Coeff (Cd)", value: "0.31" },
          { label: "Weight", value: "185 kg (Shell)" },
        ],
        explosionVector: [0, 2.2, 0],
        explosionDistance: 2.5,
      },
      {
        id: "wheels",
        name: "Forged Alloy Wheels & Performance Tires",
        category: "Running Gear",
        meshNamePattern: /wheel|tire|rim|centre|nuts/i,
        description: "Forged monolithic aluminum alloy wheels wrapped in semi-slick high-traction compound rubber.",
        purpose: "Transfers traction, steering forces and braking torque directly to the racing asphalt.",
        specs: [
          { label: "Front Size", value: "245/35 R20" },
          { label: "Rear Size", value: "305/30 R21" },
          { label: "Construction", value: "Forged 6061-T6 Aluminum" },
        ],
        explosionVector: [2.0, 0, 0],
        explosionDistance: 1.8,
      },
      {
        id: "brakes",
        name: "Carbon-Ceramic Braking System",
        category: "Braking",
        meshNamePattern: /brake/i,
        description: "Carbon-silicon carbide vented rotors paired with 6-piston monoblock aluminum calipers.",
        purpose: "Provides fade-free deceleration under intense track temperatures exceeding 800°C.",
        specs: [
          { label: "Rotor Diameter", value: "398 mm Front / 360 mm Rear" },
          { label: "Calipers", value: "Brembo 6-Piston Monobloc" },
          { label: "Max Temp", value: "1,000°C Peak" },
        ],
        explosionVector: [1.6, 0, 0],
        explosionDistance: 1.4,
      },
      {
        id: "interior",
        name: "Cockpit & Steering Column",
        category: "Cabin",
        meshNamePattern: /steering|leather|interior|carpet/i,
        description: "Driver-centric digital cockpit with Alcantara upholstery, carbon bucket seats, and F1-style multi-function steering.",
        purpose: "Allows precision telemetry monitoring, throttle mapping adjustments and ergonomic driver control.",
        specs: [
          { label: "Seating", value: "Twin Carbon-Tub Buckets" },
          { label: "Trim", value: "Dry Carbon + Nappa Leather" },
          { label: "Harness", value: "FIA 5-Point Compatible" },
        ],
        explosionVector: [0, 1.4, -0.6],
        explosionDistance: 1.8,
      },
      {
        id: "glass",
        name: "Acoustic Lightweight Glass & Canopy",
        category: "Enclosure",
        meshNamePattern: /glass/i,
        description: "Chemically toughened laminated acoustic safety glass with UV and thermal rejection coatings.",
        purpose: "Maintains optimal driver panoramic visibility while maintaining aerodynamic pressure boundary.",
        specs: [
          { label: "Windshield", value: "Gorilla Glass Automotive" },
          { label: "Thickness", value: "3.2 mm" },
          { label: "UV Cut", value: "99.4%" },
        ],
        explosionVector: [0, 2.6, 0],
        explosionDistance: 2.8,
      },
      {
        id: "chassis",
        name: "Aluminum Spaceframe Chassis",
        category: "Structure",
        meshNamePattern: /plastic_gray|metal_gray|trim/i,
        description: "Extruded and hydroformed aluminum skeleton with bonded carbon structural shear panels.",
        purpose: "Acts as the rigid structural backbone anchoring suspension wishbones and engine mounts.",
        specs: [
          { label: "Torsional Rigidity", value: "46,000 Nm/degree" },
          { label: "Weight Ratio", value: "44% Front / 56% Rear" },
        ],
        explosionVector: [0, -1.2, 0],
        explosionDistance: 1.2,
      },
    ],
    subAssemblies: {
      "engine-v6": {
        id: "engine-v6",
        name: "V6 Internal Combustion Engine",
        description: "Complete internal mechanical architecture of the twin-turbocharged V6 powerplant.",
        parts: [
          {
            id: "cylinder-head",
            name: "Cylinder Head",
            description: "Houses the intake and exhaust ports, valve guides, camshaft bearings, and spark plug tubes.",
            specs: [
              { label: "Material", value: "A356-T6 Cast Aluminum" },
              { label: "Configuration", value: "Dual Overhead Cam (DOHC)" }
            ],
            explosionVector: [0, 2.2, 0],
          },
          {
            id: "engine-block",
            name: "Engine Block",
            description: "Main cast structural foundation with 6 precision-honed cylinder liners oriented in a 60-degree V angle.",
            specs: [
              { label: "Bore x Stroke", value: "88.0 mm x 82.0 mm" },
              { label: "Deck Type", value: "Closed-Deck Reinforced" }
            ],
            explosionVector: [0, 0, 0],
          },
          {
            id: "pistons",
            name: "Forged Pistons & Wrist Pins",
            description: "Forged slipper-skirt pistons that transfer combustive expansion pressure into reciprocal linear motion.",
            specs: [
              { label: "Material", value: "2618 Forged Aluminum Alloy" },
              { label: "Compression Ratio", value: "9.8:1" }
            ],
            explosionVector: [1.2, 1.4, 0],
          },
          {
            id: "crankshaft",
            name: "Cross-Plane Forged Crankshaft",
            description: "Counterweighted rotating shaft converting piston reciprocating motion into continuous rotational torque.",
            specs: [
              { label: "Material", value: "4340 Billet Nitrided Steel" },
              { label: "Main Journals", value: "4 Induction Hardened" }
            ],
            explosionVector: [0, -1.4, 0],
          },
          {
            id: "camshaft",
            name: "Dual Camshafts & Variable Timing Gears",
            description: "Precision-ground lobes that orchestrate intake and exhaust valve timing synchronized with engine speed.",
            specs: [
              { label: "Lift", value: "11.2 mm Intake / 10.8 mm Exhaust" },
              { label: "Timing Control", value: "Continuously Variable VVT" }
            ],
            explosionVector: [-1.4, 1.6, 0.4],
          },
          {
            id: "valves",
            name: "Titanium Intake & Sodium-Filled Exhaust Valves",
            description: "Spring-loaded poppet valves opening and sealing combustion chambers thousands of times per minute.",
            specs: [
              { label: "Intake", value: "Titanium Alloy 35mm" },
              { label: "Exhaust", value: "Sodium-Cooled Inconel 30mm" }
            ],
            explosionVector: [0.8, 2.0, -0.6],
          },
          {
            id: "oil-pan",
            name: "Dry-Sump Baffled Oil Pan",
            description: "Low-profile oil reservoir ensuring scavenge pumps maintain continuous oil pressure even under 2.5G cornering loads.",
            specs: [
              { label: "Capacity", value: "8.5 Liters Synthetic 0W-40" },
              { label: "Baffling", value: "Multi-Chamber One-Way Flaps" }
            ],
            explosionVector: [0, -2.2, 0],
          },
          {
            id: "timing-belt",
            name: "Kevlar-Reinforced Timing Belt & Tensioners",
            description: "High-tensile toothed drive belt harmonizing camshaft rotation at exactly half the crankshaft rotational frequency.",
            specs: [
              { label: "Core", value: "Carbon Cord Reinforced" },
              { label: "Service Life", value: "100,000 km Track Rated" }
            ],
            explosionVector: [0, 0, 1.8],
          },
          {
            id: "spark-plug",
            name: "Iridium High-Ignition Spark Plugs",
            description: "Generates high-voltage electrical arcs (35,000 Volts) across electrode gaps to ignite compressed fuel vapor.",
            specs: [
              { label: "Electrode", value: "0.6 mm Fine-Wire Iridium" },
              { label: "Heat Range", value: "Track Cold-Step 8" }
            ],
            explosionVector: [1.4, 2.4, 0.8],
          },
        ]
      }
    }
  },

  "electric-fan": {
    id: "electric-fan",
    name: "AeroFlow Electric Table Fan",
    category: "Household & Aerodynamics",
    badge: "ELECTROMECHANICAL / 002",
    tagline: "Explore electromechanical induction, blade aerodynamics, and oscillation gearing.",
    description: "A precision table fan designed to study airflow dynamics, shaded-pole/BLDC motor principles, and eccentric gear oscillation linkage.",
    modelPath: "/models/fan.glb",
    defaultCameraPosition: [0, 1.4, 3.2],
    defaultFov: 45,
    components: [
      {
        id: "front-grill",
        name: "Front Safety Grill",
        category: "Enclosure",
        description: "Radial concentric steel wire cage with anti-finger penetration spacing designed to safeguard users.",
        purpose: "Prevents accidental contact with high-velocity spinning blades while permitting laminar airflow intake and discharge.",
        specs: [
          { label: "Material", value: "Chrome-Plated Cold Drawn Steel Wire" },
          { label: "Outer Diameter", value: "360 mm" },
          { label: "Rib Count", value: "120 Radial Wires" }
        ],
        explosionVector: [0, 0, 2.2],
        explosionDistance: 2.2,
      },
      {
        id: "blade-cap",
        name: "Central Spinner Blade Cap",
        category: "Rotor",
        description: "Reverse-threaded aerodynamic nosecone retaining nut.",
        purpose: "Clamps the fan impeller firmly onto the motor drive shaft taper; reverses rotation direction to prevent self-loosening during operation.",
        specs: [
          { label: "Thread", value: "M8 Left-Hand Reverse Thread" },
          { label: "Material", value: "Molded ABS Thermoplastic" }
        ],
        explosionVector: [0, 0, 3.0],
        explosionDistance: 3.0,
      },
      {
        id: "fan-blades",
        name: "Aerodynamic 3-Blade Impeller",
        category: "Rotor",
        description: "Precisely balanced triple-blade propeller with engineered progressive pitch camber.",
        purpose: "Converts rotational shaft torque into axial thrust, displacing up to 45 cubic meters of air per minute.",
        specs: [
          { label: "Blade Count", value: "3 Twisted Airfoil Blades" },
          { label: "Material", value: "Virgin Polycarbonate (PC)" },
          { label: "Pitch Angle", value: "22° Variable Angle" },
          { label: "Max Air Velocity", value: "4.8 m/s" }
        ],
        explosionVector: [0, 0, 1.6],
        explosionDistance: 1.6,
      },
      {
        id: "rear-grill",
        name: "Rear Safety Grill",
        category: "Enclosure",
        description: "Reinforced steel wire guard bolted directly to the motor casing front face.",
        purpose: "Protects rear access to rotating blades and provides integrated carrying handle loop.",
        specs: [
          { label: "Mounting", value: "4-Point Flange Fasteners" },
          { label: "Material", value: "Powder-Coated Steel Wire" }
        ],
        explosionVector: [0, 0, 0.7],
        explosionDistance: 0.7,
      },
      {
        id: "motor-housing",
        name: "Motor Housing & Stator Casing",
        category: "Electromechanics",
        description: "Vented cylindrical shell containing the electromagnetic stator, copper windings, rotor, and bearings.",
        purpose: "Houses the induction motor core, dissipates thermal heat through vent louvers, and supports drive shaft bearings.",
        specs: [
          { label: "Motor Type", value: "Single-Phase Induction / BLDC" },
          { label: "Rated Power", value: "55 Watts" },
          { label: "Voltage", value: "220-240V AC 50/60Hz" },
          { label: "Bearings", value: "Dual Sintered Bronze Bushings" }
        ],
        hasSubAssembly: true,
        subAssemblyId: "fan-motor",
        subAssemblyName: "Motor Core Assembly",
        explosionVector: [0, 0, -1.2],
        explosionDistance: 1.2,
      },
      {
        id: "oscillation-pin",
        name: "Oscillation Clutch & Knob",
        category: "Mechanism",
        description: "Push-pull mechanical clutch knob mounted atop the rear motor casing.",
        purpose: "Engages or disengages internal reduction worm gears to toggle side-to-side sweeping motion.",
        specs: [
          { label: "Mechanism", value: "Worm Gear + Eccentric Arm" },
          { label: "Oscillation Range", value: "85° Total Arc Sweep" },
          { label: "Cycle Speed", value: "4.2 Swings / Minute" }
        ],
        explosionVector: [0, 1.4, -1.2],
        explosionDistance: 1.4,
      },
      {
        id: "neck-joint",
        name: "Neck & Tilt Articulation Joint",
        category: "Structure",
        description: "Friction-lock hinge assembly linking the motor head to the telescoping vertical post.",
        purpose: "Allows vertical tilt adjustment up to 25° upward and 10° downward, secured with a thumb-wheel screw.",
        specs: [
          { label: "Tilt Range", value: "-10° Down / +25° Up" },
          { label: "Clamping", value: "Spring-Assisted Thumb Screw" }
        ],
        explosionVector: [0, 0.4, 0],
        explosionDistance: 0.4,
      },
      {
        id: "stand",
        name: "Stand & Telescoping Column",
        category: "Structure",
        description: "Chromed steel tubular column elevating the fan head to desktop height.",
        purpose: "Provides structural stability, guides internal insulated wiring, and isolates motor vibration.",
        specs: [
          { label: "Diameter", value: "32 mm Tube" },
          { label: "Finish", value: "Polished Chrome / Satin Black" }
        ],
        explosionVector: [0, -0.6, 0],
        explosionDistance: 0.6,
      },
      {
        id: "base",
        name: "Weighted Anti-Tip Base",
        category: "Base",
        description: "Broad circular weighted platform with anti-vibration elastomeric rubber foot pads.",
        purpose: "Lowers center of gravity to prevent toppling during maximum oscillation and high blade speeds.",
        specs: [
          { label: "Ballast", value: "1.2 kg High-Density Cast Iron Core" },
          { label: "Base Diameter", value: "280 mm" },
          { label: "Feet", value: "4 Non-Slip Silicone Pads" }
        ],
        explosionVector: [0, -1.6, 0],
        explosionDistance: 1.6,
      },
      {
        id: "control-buttons",
        name: "Speed Selector Keypad",
        category: "Controls",
        description: "Interlocking mechanical 4-button switch bank (0: Off, 1: Low, 2: Med, 3: High).",
        purpose: "Switches motor electrical winding taps to regulate current draw and blade rotational RPM.",
        specs: [
          { label: "Switch Type", value: "Mechanical Push Button Bank" },
          { label: "Speed 1 (Low)", value: "850 RPM (~18W)" },
          { label: "Speed 2 (Med)", value: "1,150 RPM (~32W)" },
          { label: "Speed 3 (High)", value: "1,450 RPM (~55W)" }
        ],
        explosionVector: [0, -1.4, 0.8],
        explosionDistance: 1.4,
      },
    ],
    subAssemblies: {
      "fan-motor": {
        id: "fan-motor",
        name: "Electric Motor Internal Core",
        description: "Disassembled electromechanical core of the table fan motor.",
        parts: [
          {
            id: "stator-coils",
            name: "Copper Stator Windings",
            description: "High-grade enameled copper magnetic coils wound around laminated silicon-steel pole cores.",
            specs: [
              { label: "Wire Gauge", value: "32 AWG Copper" },
              { label: "Poles", value: "4-Pole Shaded Induction" }
            ],
            explosionVector: [0, 0, 0],
          },
          {
            id: "rotor",
            name: "Squirrel-Cage Rotor",
            description: "Solid conductive aluminum bars cast into cylindrical laminated steel core on steel drive shaft.",
            specs: [
              { label: "Shaft Diameter", value: "8.0 mm Ground Steel" },
              { label: "Balance", value: "Dynamic Laser Balanced" }
            ],
            explosionVector: [0, 0, 1.8],
          },
          {
            id: "gearbox",
            name: "Oscillation Worm Reduction Box",
            description: "High-ratio brass worm pinion driving an eccentric gear to oscillate the fan head back and forth.",
            specs: [
              { label: "Gear Ratio", value: "350:1 Reduction" },
              { label: "Lubrication", value: "High-Viscosity White Lithium" }
            ],
            explosionVector: [0, 0, -1.8],
          },
          {
            id: "capacitor",
            name: "Phase-Shift Run Capacitor",
            description: "Metalized polypropylene film capacitor generating rotational magnetic phase shift to initiate startup torque.",
            specs: [
              { label: "Capacitance", value: "1.5 µF ± 5%" },
              { label: "Rated Voltage", value: "450V AC" }
            ],
            explosionVector: [1.4, 0.8, -0.4],
          },
          {
            id: "thermal-fuse",
            name: "Safety Thermal Cutoff Fuse",
            description: "Failsafe protective device opening circuit if motor temperature exceeds 130°C.",
            specs: [
              { label: "Cutoff Temp", value: "130°C / 266°F" },
              { label: "Rating", value: "2A 250V" }
            ],
            explosionVector: [-1.4, 0.8, -0.4],
          }
        ]
      }
    }
  },
  "walking-robot": WALKING_ROBOT_MACHINE_DATA,
  "robo-rumble": ROBO_RUMBLE_MACHINE_DATA,
  "aero-450": AERO_DRONE_MACHINE_DATA,
  "drone-b": DRONE_B_MACHINE_DATA,
  "esp32-drone": ESP32_DRONE_MACHINE_DATA,
  "robo-racer": ROBO_RACER_MACHINE_DATA,
  "ropeway-robot": ROPEWAY_ROBOT_MACHINE_DATA,
};
