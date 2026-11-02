export interface WorkspaceProject {
  name: string;
  code: string;
  discipline: string;
  description: string;
  status: "In progress" | "In review" | "Planning";
  owner: string;
  phase: string;
  goals: string[];
}

export const workspaceProjects: WorkspaceProject[] = [
  {
    name: "Wind Aero Study", code: "WA-01", discipline: "External aerodynamics",
    description: "Compare airflow around a wing across wind speeds and angles of attack. Use the results to select a baseline geometry for the next design review.",
    status: "In progress", owner: "Maya Chen", phase: "Baseline analysis",
    goals: ["Compare lift and drag across the operating range.", "Locate flow separation and review surface pressure."],
  },
  {
    name: "Helicopter", code: "HC-02", discipline: "Rotor aerodynamics",
    description: "Study rotor performance in hover and forward flight. Compare blade configurations and the interaction between the rotor wake and fuselage.",
    status: "In progress", owner: "Alex Morgan", phase: "Rotor comparison",
    goals: ["Compare thrust and power for each rotor configuration.", "Review wake structure and loads on the fuselage."],
  },
  {
    name: "Drone", code: "DR-03", discipline: "Multirotor aircraft",
    description: "Evaluate a compact drone for an inspection mission. Review propeller efficiency and airflow around the frame and payload.",
    status: "Planning", owner: "Sam Rivera", phase: "Geometry preparation",
    goals: ["Prepare the frame and propeller geometry for meshing.", "Define hover and cruise cases for the mission."],
  },
  {
    name: "Heat Exchanger Analysis", code: "HX-04", discipline: "Thermal and fluid analysis",
    description: "Compare heat transfer and pressure loss across a compact heat exchanger. Review how channel geometry and flow rate affect cooling performance.",
    status: "In review", owner: "Maya Chen", phase: "Results review",
    goals: ["Compare outlet temperatures for the candidate designs.", "Review pressure loss and flow distribution in each channel."],
  },
  {
    name: "Wind Turbine", code: "WT-05", discipline: "Renewable energy",
    description: "Study a wind turbine rotor at several operating points. Compare blade loads, power output, and the wake behind the rotor.",
    status: "In progress", owner: "Alex Morgan", phase: "Operating-point study",
    goals: ["Compare blade loads across wind speeds.", "Review the wake before selecting a rotor configuration."],
  },
  {
    name: "Cooling Duct", code: "CD-06", discipline: "Internal flow",
    description: "Evaluate cooling airflow through an aircraft equipment bay. Compare duct layouts for pressure loss and flow delivery to each component.",
    status: "Planning", owner: "Sam Rivera", phase: "Case setup",
    goals: ["Define inlet conditions and cooling requirements.", "Compare flow distribution across the duct outlets."],
  },
  {
    name: "Aster VTOL", code: "AV-07", discipline: "Aircraft aerodynamics",
    description: "Study the transition from hover to forward flight for a vertical takeoff aircraft. Compare rotor and wing interactions through the transition.",
    status: "In progress", owner: "Maya Chen", phase: "Transition study",
    goals: ["Compare wing loads at each rotor tilt angle.", "Identify operating points with reduced control authority."],
  },
  {
    name: "Winglet Optimization", code: "WO-08", discipline: "External aerodynamics",
    description: "Compare winglet shapes for a regional aircraft. Evaluate the effect on induced drag and wing bending loads.",
    status: "In review", owner: "Alex Morgan", phase: "Design comparison",
    goals: ["Compare drag at the cruise design point.", "Review the change in wing root bending moment."],
  },
  {
    name: "Propeller Noise", code: "PN-09", discipline: "Aeroacoustics",
    description: "Evaluate noise from an electric aircraft propeller. Compare blade loading and sound levels across rotational speeds.",
    status: "Planning", owner: "Sam Rivera", phase: "Acoustic setup",
    goals: ["Define observer positions and operating conditions.", "Compare tonal noise for candidate blade shapes."],
  },
  {
    name: "Battery Cooling", code: "BC-10", discipline: "Thermal management",
    description: "Study liquid cooling for an aircraft battery pack. Evaluate cell temperatures and coolant pressure loss under peak load.",
    status: "In progress", owner: "Maya Chen", phase: "Cooling comparison",
    goals: ["Reduce temperature differences between cells.", "Compare pressure loss for each cooling plate layout."],
  },
  {
    name: "Engine Intake", code: "EI-11", discipline: "Internal aerodynamics",
    description: "Compare engine intake geometries at different flight conditions. Review pressure recovery and flow distortion at the engine face.",
    status: "In review", owner: "Alex Morgan", phase: "Intake review",
    goals: ["Compare pressure recovery across flight speeds.", "Locate separation at high angles of attack."],
  },
  {
    name: "Rocket Nozzle", code: "RN-12", discipline: "Compressible flow",
    description: "Study gas expansion through a rocket nozzle. Compare thrust and nozzle wall pressure over a range of ambient pressures.",
    status: "In progress", owner: "Sam Rivera", phase: "Expansion analysis",
    goals: ["Compare nozzle performance at sea level and altitude.", "Locate shock waves and possible flow separation."],
  },
  {
    name: "Cabin Ventilation", code: "CV-13", discipline: "Environmental control",
    description: "Evaluate airflow and temperature in a passenger cabin. Compare diffuser layouts for air distribution and occupant comfort.",
    status: "Planning", owner: "Maya Chen", phase: "Boundary conditions",
    goals: ["Set passenger heat loads and ventilation rates.", "Identify regions with low air exchange."],
  },
  {
    name: "Landing Gear Drag", code: "LG-14", discipline: "External aerodynamics",
    description: "Evaluate the aerodynamic loads on deployed landing gear. Compare fairings and their effect on the downstream wake.",
    status: "In progress", owner: "Alex Morgan", phase: "Fairing comparison",
    goals: ["Compare drag for each fairing design.", "Review unsteady loads on exposed components."],
  },
  {
    name: "Supersonic Inlet", code: "SI-15", discipline: "Compressible flow",
    description: "Study shock positioning in a supersonic inlet. Review pressure recovery and operating limits as the inlet geometry changes.",
    status: "Planning", owner: "Sam Rivera", phase: "Mesh preparation",
    goals: ["Refine the mesh near expected shock locations.", "Compare pressure recovery across Mach numbers."],
  },
  {
    name: "Turbine Blade Cooling", code: "TB-16", discipline: "Conjugate heat transfer",
    description: "Evaluate internal cooling passages in a turbine blade. Compare metal temperature and coolant demand for each passage layout.",
    status: "In review", owner: "Maya Chen", phase: "Thermal review",
    goals: ["Locate regions above the target metal temperature.", "Compare cooling performance at a fixed coolant flow rate."],
  },
  {
    name: "Hydrogen Tank Venting", code: "HT-17", discipline: "Gas dispersion",
    description: "Study gas flow from an aircraft hydrogen tank vent. Compare vent locations and the resulting plume around the airframe.",
    status: "Planning", owner: "Alex Morgan", phase: "Scenario definition",
    goals: ["Define vent rates and ambient wind conditions.", "Compare gas concentrations around nearby equipment."],
  },
  {
    name: "Radiator Flow", code: "RF-18", discipline: "Thermal and fluid analysis",
    description: "Compare airflow through an aircraft radiator installation. Review heat rejection and aerodynamic drag at low flight speeds.",
    status: "In progress", owner: "Sam Rivera", phase: "Installation study",
    goals: ["Compare heat rejection across airspeeds.", "Review the pressure loss through the radiator and outlet."],
  },
  {
    name: "Parachute Descent", code: "PD-19", discipline: "Bluff body aerodynamics",
    description: "Study the airflow around a recovery parachute. Compare canopy shapes for drag and steady descent performance.",
    status: "In review", owner: "Maya Chen", phase: "Canopy review",
    goals: ["Compare drag across descent speeds.", "Review pressure distribution on the canopy."],
  },
  {
    name: "Air Taxi Wake", code: "AT-20", discipline: "Rotor aerodynamics",
    description: "Evaluate rotor downwash near a landing pad. Compare operating heights and the effect of nearby structures on the flow.",
    status: "In progress", owner: "Alex Morgan", phase: "Ground effect study",
    goals: ["Map peak air velocities around the landing area.", "Compare rotor loads at different heights."],
  },
  {
    name: "Pitot Probe Calibration", code: "PP-21", discipline: "Flow measurement",
    description: "Study pressure measurements around a pitot probe. Compare mounting positions and probe alignment over the flight envelope.",
    status: "Planning", owner: "Sam Rivera", phase: "Calibration plan",
    goals: ["Define reference speeds and probe angles.", "Estimate pressure measurement errors for each mounting position."],
  },
  {
    name: "Exhaust Plume", code: "EP-22", discipline: "Jet flow",
    description: "Evaluate an engine exhaust plume near the aircraft tail. Compare mixing and thermal exposure of nearby surfaces.",
    status: "In progress", owner: "Maya Chen", phase: "Plume analysis",
    goals: ["Map temperatures on surfaces near the exhaust.", "Compare plume spread at different engine settings."],
  },
  {
    name: "Fuel Manifold", code: "FM-23", discipline: "Internal flow",
    description: "Compare flow distribution through a fuel manifold. Review branch geometry and pressure loss at nominal and peak demand.",
    status: "In review", owner: "Alex Morgan", phase: "Distribution review",
    goals: ["Compare flow rates through each branch.", "Identify pressure losses at junctions and bends."],
  },
  {
    name: "Avionics Bay Cooling", code: "AB-24", discipline: "Thermal management",
    description: "Evaluate airflow and component temperatures in an avionics bay. Compare fan settings and equipment layouts under peak thermal load.",
    status: "Planning", owner: "Sam Rivera", phase: "Thermal setup",
    goals: ["Define heat loads for the equipment racks.", "Locate recirculation and components with limited cooling."],
  },
];
