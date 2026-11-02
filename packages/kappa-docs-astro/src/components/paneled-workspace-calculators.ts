export const workspaceCalculatorPages = ["Y+ calculator", "Boundary layer height calculator"];

export type FlowModel = "laminar" | "turbulent";

export interface BoundaryLayerInputs {
  speed: number;
  distance: number;
  viscosity: number;
  targetYPlus: number;
  model: FlowModel;
}

// Local, smooth flat-plate correlations with zero pressure gradient.
// x is measured from the leading edge; viscosity is kinematic (m²/s).
export function calculateBoundaryLayer(inputs: BoundaryLayerInputs) {
  const { speed, distance, viscosity, targetYPlus, model } = inputs;
  if (![speed, distance, viscosity, targetYPlus].every(value => Number.isFinite(value) && value > 0)) return null;
  const reynolds = speed * distance / viscosity;
  const skinFriction = model === "laminar" ? 0.664 / Math.sqrt(reynolds) : 0.0592 / reynolds ** 0.2;
  const frictionVelocity = speed * Math.sqrt(skinFriction / 2);
  const wallDistance = targetYPlus * viscosity / frictionVelocity;
  const firstCellHeight = 2 * wallDistance;
  const thickness = model === "laminar" ? 5 * distance / Math.sqrt(reynolds) : 0.37 * distance / reynolds ** 0.2;
  const values = { reynolds, skinFriction, frictionVelocity, wallDistance, firstCellHeight, thickness };
  return Object.values(values).every(value => Number.isFinite(value) && value > 0)
    && [wallDistance, firstCellHeight, thickness].every(value => Number.isFinite(value * 1000)) ? values : null;
}

export function formatCalculatorValue(value: number) {
  return new Intl.NumberFormat("en-US", { maximumSignificantDigits: 4, notation: value < 0.001 || value >= 1e6 ? "scientific" : "standard" }).format(value);
}
