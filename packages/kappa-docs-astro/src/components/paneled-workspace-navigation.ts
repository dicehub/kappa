import { ChartNoAxesCombined, Compass, Fan, FolderKanban, LayoutTemplate, Plane, Radar, RadioTower, Wind } from "@lucide/vue";
import { workspaceProjects } from "./paneled-workspace-projects";
import { workspaceTemplatePages } from "./paneled-workspace-templates";
import { workspaceCalculatorPages } from "./paneled-workspace-calculators";

const projectPages = workspaceProjects.map(project => project.name);

export const workspaceCategories = [
  { label: "Projects", icon: FolderKanban, pages: ["All projects", ...projectPages.slice(0, 6)] },
  { label: "Templates", icon: LayoutTemplate, pages: workspaceTemplatePages },
  { label: "Engineering tools", icon: Compass, pages: workspaceCalculatorPages },
  { label: "Aircraft", icon: Plane, pages: ["Airframe", "Configurations", "Design reviews"] },
  { label: "Simulation", icon: Wind, pages: ["Simulation runs", "Result files"] },
  { label: "Flight testing", icon: Radar, pages: ["Flight test plan", "Test campaigns"] },
  { label: "Propulsion", icon: Fan, pages: ["Engine models", "Thermal analysis"] },
  { label: "Flight operations", icon: RadioTower, pages: ["Telemetry", "Anomalies"] },
  { label: "Reports", icon: ChartNoAxesCombined, pages: ["Engineering reports", "Compute usage"] },
];

export const workspaceUtilityDescriptions: Record<string, string> = {
  "New project": "Project creation preview. Organize geometry, applications, and simulation results in a project.",
  "New application": "Application creation preview. Configure a CFD application for your project.",
  "New group": "Group creation preview. Bring people and projects together in a shared group.",
  Help: "Guidance for your workspace and project workflows.",
  Support: "Support preview. No support request is sent.",
  Documentation: "Documentation preview for your workspace.",
  "Download the CLI": "CLI download preview. No file is downloaded.",
  "Terms of service": "Terms of service preview.",
  "Privacy policy": "Privacy policy preview.",
  "What's new": "Release notes preview for Version 0.1.2.",
  "Log out": "This is a local preview of Log out. Your session stays signed in.",
};
export const workspacePages = [...new Set(["Dashboard", ...workspaceCategories.flatMap(group => group.pages), ...projectPages, "Overview", "Applications", "Project Settings", "Project activity", "Team", "Profile", "Settings", "Billing", "Keyboard shortcuts", ...Object.keys(workspaceUtilityDescriptions)])];
export const limitedWorkspacePages = ["Dashboard", "All projects", "Overview", "Applications", "Project Settings", ...projectPages, ...workspaceTemplatePages, ...workspaceCalculatorPages, "Project activity", "Flight test plan"];

// Keep existing example bookmarks and integrations working after the navigation rename.
const pageAliases: Record<string, string> = {
  "Application templates": "CFD Templates", "Simulation templates": "CFD Templates", "Test templates": "Experimental",
  "Mission brief": "Overview", "Project settings": "Project Settings", "Activity log": "Project activity", Members: "Team",
  "Work items": "Simulation runs", "Issue boards": "Simulation runs", "Task boards": "Simulation runs",
  Milestones: "Flight test plan", Iterations: "Test campaigns", Requirements: "Design reviews", Labels: "Configurations",
  Assistant: "Y+ calculator", Agents: "Boundary layer height calculator",
  "Design assistant": "Y+ calculator", "Trade studies": "Boundary layer height calculator",
  Repositories: "Airframe", Branches: "Configurations", "Merge requests": "Design reviews",
  Pipelines: "Simulation runs", Artifacts: "Result files", Releases: "Flight test plan",
  Environments: "Test campaigns", Infrastructure: "Engine models", Logs: "Thermal analysis",
  Metrics: "Telemetry", Incidents: "Anomalies", Reports: "Engineering reports", Usage: "Compute usage",
};

export const resolveWorkspacePage = (page: string) => pageAliases[page] ?? page;
