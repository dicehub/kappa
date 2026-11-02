export interface WorkspaceRun {
  id: string;
  name: string;
  status: "Running" | "Queued" | "Completed" | "Failed" | "Cancelled";
  cpus: number;
  elapsed: string;
  hourlyCents: number;
  costCents: number;
}

export interface WorkspaceCompute {
  balanceCents: number;
  runs: WorkspaceRun[];
}

// Synthetic workspace data. No scheduler, billing service, or payment API is connected.
export const workspaceCompute: Record<string, WorkspaceCompute> = {
  "Ros.Space": {
    balanceCents: 184,
    runs: [
      { id: "SIM-208", name: "Rotor hover · baseline", status: "Running", cpus: 32, elapsed: "42 min", hourlyCents: 240, costCents: 168 },
      { id: "SIM-207", name: "Wing cruise · angle of attack 6°", status: "Running", cpus: 16, elapsed: "18 min", hourlyCents: 120, costCents: 36 },
      { id: "SIM-206", name: "Cooling duct · inlet B", status: "Running", cpus: 16, elapsed: "12 min", hourlyCents: 120, costCents: 24 },
      { id: "SIM-205", name: "Rotor hover · refined mesh", status: "Queued", cpus: 64, elapsed: "—", hourlyCents: 480, costCents: 0 },
      { id: "SIM-204", name: "Hover efficiency · configuration B", status: "Completed", cpus: 32, elapsed: "6 h 30 min", hourlyCents: 240, costCents: 1560 },
      { id: "SIM-203", name: "Cooling duct · inlet A", status: "Failed", cpus: 16, elapsed: "14 min", hourlyCents: 120, costCents: 28 },
    ],
  },
  Engineering: {
    balanceCents: 12840,
    runs: [
      { id: "SIM-312", name: "Vega wing · cruise condition", status: "Running", cpus: 64, elapsed: "1 h 15 min", hourlyCents: 480, costCents: 600 },
      { id: "SIM-311", name: "Vega nacelle · cooling flow", status: "Running", cpus: 32, elapsed: "30 min", hourlyCents: 240, costCents: 120 },
      { id: "SIM-310", name: "Vega tail · wake survey", status: "Completed", cpus: 32, elapsed: "2 h", hourlyCents: 240, costCents: 480 },
    ],
  },
  Research: {
    balanceCents: 2500,
    runs: [
      { id: "SIM-105", name: "Orion nozzle · mesh study", status: "Queued", cpus: 32, elapsed: "—", hourlyCents: 240, costCents: 0 },
      { id: "SIM-104", name: "Orion nozzle · baseline", status: "Completed", cpus: 16, elapsed: "2 h", hourlyCents: 120, costCents: 240 },
    ],
  },
};

export const creditAmount = (cents: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
export const runStatusVariant = (status: WorkspaceRun["status"]) => ({ Running: "info", Queued: "warning", Completed: "success", Failed: "destructive", Cancelled: "outline" } as const)[status];
export const runningJobs = (runs: readonly WorkspaceRun[]) => runs.filter(run => run.status === "Running");
export const currentUsage = (runs: readonly WorkspaceRun[]) => runningJobs(runs).reduce((total, run) => total + run.hourlyCents, 0);
export const monthUsage = (runs: readonly WorkspaceRun[]) => runs.reduce((total, run) => total + run.costCents, 0);
