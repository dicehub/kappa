import { Building2, CircleArrowUp, FlaskConical, LogOut, Plus, Settings, UserRound, UserRoundPlus, UsersRound } from "@lucide/vue";

export const namespaceSwitcherItems = [
  { value: "Engineering", name: "Engineering", description: "Pro plan · 12 members", icon: Building2 },
  { value: "Research", name: "Research", description: "Pro plan · 8 members", icon: FlaskConical },
  { value: "Personal", name: "Personal", description: "Free plan · 1 member", icon: UserRound },
];

export const namespaceSwitcherActions = [
  { value: "upgrade", label: "Upgrade", icon: CircleArrowUp, accent: true },
  { value: "settings", label: "Settings", icon: Settings },
  { value: "invite", label: "Invite members", icon: UsersRound },
  { value: "add-account", label: "Add account", icon: UserRoundPlus },
];

export const namespaceSwitcherWorkspaceActions = [
  { value: "add-namespace", label: "Add namespace", icon: Plus },
];

export const namespaceSwitcherFooterActions = [
  { value: "log-out", label: "Log out", icon: LogOut },
];

export const namespaceActionDescriptions: Record<string, string> = {
  Upgrade: "Plan preview. No subscription is changed.",
  Settings: "Namespace settings preview. No settings are changed.",
  "Invite members": "Invitation preview. No invitation is sent.",
  "Add account": "Account preview. No account is connected.",
  "Add namespace": "Namespace preview. No namespace is created.",
  "Log out": "Local preview. Your real session stays signed in.",
};
