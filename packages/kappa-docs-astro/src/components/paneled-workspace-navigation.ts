import { Activity, ChartNoAxesCombined, CirclePlay, Compass, LayoutGrid, LayoutTemplate, Plus, Presentation, Settings2, UsersRound } from "@lucide/vue";
import type { Component } from "vue";
import { workspaceProjects } from "./paneled-workspace-projects";
import { workspaceTemplateItemPages, workspaceTemplatePages } from "./paneled-workspace-templates";
import { workspaceCalculatorPages } from "./paneled-workspace-calculators";

const projectPages = workspaceProjects.map(project => project.name);

export interface NavigationCategory {
  label: string;
  icon: Component;
  pages: string[];
  page?: string;
  collapsible?: boolean;
  headingOnly?: boolean;
  headingLink?: boolean;
  iconCollapsible?: boolean;
  remainingCount?: number;
  action?: { label: string; icon: Component };
}

export const workspaceLinks = [
  { label: "Explore", page: "Explore", icon: Compass },
];

export const workspaceCommunityPages = ["Community", "Public projects", "Public groups"];
export const workspaceExplorePages = ["Explore", ...workspaceCommunityPages, ...workspaceTemplatePages, ...workspaceTemplateItemPages];

export const workspaceCategories: NavigationCategory[] = [
  { label: "Projects", page: "All projects", icon: Presentation, headingOnly: true, pages: ["All projects", ...projectPages.slice(0, 6)], collapsible: false, action: { label: "Create project", icon: Plus } },
];

export const workspaceSearchCategories = [
  { label: "Explore", icon: Compass, pages: ["Explore", ...workspaceCommunityPages] },
  { label: "Templates", icon: LayoutTemplate, pages: workspaceTemplatePages },
  { label: "Engineering tools", icon: Compass, pages: workspaceCalculatorPages },
];

export const projectNavigation = [
  { page: "Applications", icon: LayoutGrid },
  { page: "Activities", icon: Activity },
  { page: "Members", icon: UsersRound },
  { page: "Simulation runs", icon: CirclePlay },
  { page: "Analytics", icon: ChartNoAxesCombined },
  { page: "Settings", icon: Settings2 },
];

export const projectCategories = [
  { label: "Simulation runs", page: "Simulation runs", icon: CirclePlay, pages: ["Results", "Storage"], collapsible: false, action: { label: "Create simulation", icon: Plus } },
  { label: "Analytics", icon: ChartNoAxesCombined, pages: ["Reports"] },
];

// Keep previous page URLs available without listing them in project navigation.
const legacyProjectPages = ["Simulation", "Results", "Storage", "Reports", "Airframe", "Configurations", "Design reviews", "Flight test plan", "Test campaigns", "Engine models", "Thermal analysis", "Telemetry", "Anomalies", "Compute usage"];

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
export const projectContextPages = [...projectNavigation.map(item => item.page), ...legacyProjectPages, "Overview", "New application"];
export const workspacePages = [...new Set(["Dashboard", "Recents", "Activities", "All projects", ...workspaceLinks.map(item => item.page), ...[...workspaceCategories, ...workspaceSearchCategories].flatMap(group => group.pages), ...workspaceTemplateItemPages, ...projectContextPages, ...projectPages, "Groups", "Team", "Profile", "Settings", "Billing", "Keyboard shortcuts", ...Object.keys(workspaceUtilityDescriptions)])];
export const limitedWorkspacePages = ["Dashboard", "Recents", "Activities", "All projects", "Groups", "Overview", "Applications", "Members", ...projectPages, ...workspaceCalculatorPages, "Flight test plan"];

// Keep existing example bookmarks and integrations working after the navigation rename.
const pageAliases: Record<string, string> = {
  "Application templates": "CFD Templates", "Simulation templates": "CFD Templates", "Test templates": "Experimental",
  "Mission brief": "Overview", "Project settings": "Settings", "Project Settings": "Settings", "Activity log": "Activities", "Project activity": "Activities", Activity: "Activities",
  "Work items": "Simulation runs", "Issue boards": "Simulation runs", "Task boards": "Simulation runs",
  Milestones: "Flight test plan", Iterations: "Test campaigns", Requirements: "Design reviews", Labels: "Configurations",
  Assistant: "Y+ calculator", Agents: "Boundary layer height calculator",
  "Design assistant": "Y+ calculator", "Trade studies": "Boundary layer height calculator",
  Repositories: "Airframe", Branches: "Configurations", "Merge requests": "Design reviews",
  Pipelines: "Simulation runs", Artifacts: "Results", "Result files": "Results", Releases: "Flight test plan",
  Environments: "Test campaigns", Infrastructure: "Engine models", Logs: "Thermal analysis",
  Metrics: "Telemetry", Incidents: "Anomalies", "Engineering reports": "Reports", Usage: "Compute usage",
};

export const resolveWorkspacePage = (page: string) => pageAliases[page] ?? page;
