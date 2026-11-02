export interface WorkspaceTemplate {
  name: string;
  discipline: "Aerodynamics" | "Thermodynamics" | "Fluid mechanics" | "Multiphysics";
  description: string;
  analysis: string;
  version: string;
  includes: string[];
}

interface TemplateCatalog {
  description: string;
  publisher: string;
  templates: WorkspaceTemplate[];
}

export const workspaceTemplateCatalogs: Record<string, TemplateCatalog> = {
  "CFD Templates": {
    description: "Starting points for aerodynamic, thermal, and fluid-flow studies.",
    publisher: "dicehub",
    templates: [
      {
        name: "Airfoil aerodynamics", discipline: "Aerodynamics", version: "1.2.0",
        description: "Compare lift, drag, and surface pressure across angles of attack.",
        analysis: "Steady incompressible flow",
        includes: ["Airfoil mesh regions", "Angle-of-attack sweep", "Lift and drag reports"],
      },
      {
        name: "Rotor hover", discipline: "Aerodynamics", version: "1.1.0",
        description: "Evaluate rotor thrust, power, and the wake in hover.",
        analysis: "Rotating reference frame",
        includes: ["Rotor and stationary regions", "Rotational speed inputs", "Thrust and torque reports"],
      },
      {
        name: "Heat exchanger", discipline: "Thermodynamics", version: "1.3.0",
        description: "Compare heat transfer and pressure loss through cooling channels.",
        analysis: "Conjugate heat transfer",
        includes: ["Fluid and solid regions", "Thermal boundary conditions", "Outlet temperature reports"],
      },
      {
        name: "Battery cooling", discipline: "Thermodynamics", version: "1.0.0",
        description: "Study cell temperatures and coolant flow through a battery pack.",
        analysis: "Transient heat transfer",
        includes: ["Cell heat loads", "Cooling plate interfaces", "Peak temperature monitors"],
      },
      {
        name: "Pipe pressure loss", discipline: "Fluid mechanics", version: "1.2.0",
        description: "Measure pressure drop and flow distribution through pipes and bends.",
        analysis: "Steady turbulent flow",
        includes: ["Inlet flow conditions", "Wall refinement regions", "Pressure drop reports"],
      },
      {
        name: "Free-surface flow", discipline: "Fluid mechanics", version: "1.0.0",
        description: "Track a liquid surface as a tank fills or drains.",
        analysis: "Transient two-phase flow",
        includes: ["Initial liquid level", "Gravity and phase properties", "Liquid volume monitors"],
      },
    ],
  },
  Experimental: {
    description: "Explore template previews for advanced flow models and coupled physics.",
    publisher: "dicehub",
    templates: [
      {
        name: "Hypersonic heating", discipline: "Aerodynamics", version: "0.3.0",
        description: "Explore shock formation and surface heating at high flight speeds.",
        analysis: "Compressible flow with heat transfer",
        includes: ["Freestream conditions", "Near-wall refinement", "Wall heat-flux reports"],
      },
      {
        name: "Propeller aeroacoustics", discipline: "Aerodynamics", version: "0.2.0",
        description: "Compare unsteady blade loads and noise at observer locations.",
        analysis: "Transient rotating flow",
        includes: ["Sliding mesh interfaces", "Acoustic observer locations", "Pressure signal sampling"],
      },
      {
        name: "Phase-change cooling", discipline: "Thermodynamics", version: "0.4.0",
        description: "Study heat storage and melting in a thermal buffer.",
        analysis: "Transient phase-change heat transfer",
        includes: ["Latent heat properties", "Heating and cooling cycles", "Melt fraction monitors"],
      },
      {
        name: "Hydrogen mixing", discipline: "Fluid mechanics", version: "0.2.0",
        description: "Explore gas mixing and species transport through an injector.",
        analysis: "Non-reacting species transport",
        includes: ["Species properties", "Injector boundary conditions", "Concentration probes"],
      },
      {
        name: "Flexible wing response", discipline: "Multiphysics", version: "0.1.0",
        description: "Explore the interaction between airflow and wing deformation.",
        analysis: "Fluid–structure interaction",
        includes: ["Fluid and structural interfaces", "Material properties", "Displacement and load monitors"],
      },
      {
        name: "Turbulent combustion", discipline: "Thermodynamics", version: "0.3.0",
        description: "Explore mixing, heat release, and temperature in a combustor.",
        analysis: "Reacting flow",
        includes: ["Fuel and oxidizer inlets", "Reaction model settings", "Temperature and species reports"],
      },
    ],
  },
  "My Published Templates": {
    description: "Your published setups for repeatable CFD and thermal studies.",
    publisher: "Ros.Space",
    templates: [
      {
        name: "Wing cruise baseline", discipline: "Aerodynamics", version: "1.2.0",
        description: "A reusable wing setup for cruise lift and drag comparisons.",
        analysis: "Steady external flow",
        includes: ["Cruise boundary conditions", "Wing surface groups", "Aerodynamic coefficient reports"],
      },
      {
        name: "Drone rotor comparison", discipline: "Aerodynamics", version: "1.0.0",
        description: "Compare candidate propellers at a common thrust target.",
        analysis: "Rotating reference frame",
        includes: ["Propeller geometry regions", "Speed sweep inputs", "Thrust and power reports"],
      },
      {
        name: "Electronics cooling", discipline: "Thermodynamics", version: "1.1.0",
        description: "Review component temperatures and airflow through an enclosure.",
        analysis: "Conjugate heat transfer",
        includes: ["Component heat sources", "Fan boundary conditions", "Component temperature reports"],
      },
      {
        name: "Compact heat exchanger", discipline: "Thermodynamics", version: "2.0.0",
        description: "Compare channel layouts using the same inlet temperatures and flow rates.",
        analysis: "Conjugate heat transfer",
        includes: ["Hot and cold flow circuits", "Solid contact interfaces", "Heat duty and pressure reports"],
      },
      {
        name: "Cooling duct baseline", discipline: "Fluid mechanics", version: "1.0.0",
        description: "Compare duct layouts for equipment-bay airflow and pressure loss.",
        analysis: "Steady internal flow",
        includes: ["Duct inlet and outlet groups", "Target flow rates", "Flow balance reports"],
      },
      {
        name: "Rotor thermal expansion", discipline: "Multiphysics", version: "1.0.0",
        description: "Review how temperature changes affect rotor clearance.",
        analysis: "Thermal and structural analysis",
        includes: ["Temperature load cases", "Material expansion properties", "Clearance and displacement reports"],
      },
    ],
  },
};

export const workspaceTemplatePages = ["All templates", ...Object.keys(workspaceTemplateCatalogs)];
