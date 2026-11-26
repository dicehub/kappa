import { CreditCard, Gauge, KeyRound, LockKeyhole, UserRoundPen, Wrench } from "@lucide/vue";

export const settingsNavigation = [
  { page: "Account details", icon: Wrench, description: "Manage your email address, username, and password." },
  { page: "Profile settings", icon: UserRoundPen, description: "Update your public profile and profile picture." },
  { page: "Limits", icon: Gauge, description: "View your resource limits and current usage." },
  { page: "Billing", icon: CreditCard, description: "Manage credits and review compute costs." },
  { page: "Security", icon: LockKeyhole, description: "Review account security and active sessions." },
  { page: "API keys", icon: KeyRound, description: "Manage access for agents, scripts, and CI." },
];
export const settingsPages = settingsNavigation.map(item => item.page);
export const isWorkspaceSettingsPage = (page: string) => settingsPages.includes(page) || page === "Settings" || page === "Profile";
export const settingsPageTitle = (page: string) => page === "Settings" ? "Account details" : page === "Profile" ? "Profile settings" : page;
export type WorkspaceNavigationContext = "workspace" | "project" | "settings";
