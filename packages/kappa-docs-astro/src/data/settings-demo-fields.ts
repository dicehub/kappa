export interface SettingsDemoField {
  id: string;
  title: string;
  value: string;
  description: string;
  type?: "email" | "password";
  options?: readonly string[];
  defaultOpen?: boolean;
  saveLabel?: string;
}

export const settingsTabs = [
  { value: "account", label: "Account" },
  { value: "notifications", label: "Notifications" },
  { value: "privacy", label: "Privacy" },
  { value: "emails", label: "Emails" },
  { value: "linked", label: "Linked accounts" },
] as const;

export const accountSettings: readonly SettingsDemoField[] = [
  { id: "username", title: "Username", value: "avery", description: "Your current username is", defaultOpen: true, saveLabel: "Save username" },
  { id: "email", title: "Email address", value: "avery@example.com", description: "Your current email address is", type: "email", saveLabel: "Update email address" },
  { id: "password", title: "Password", value: "", description: "Last changed 14 days ago.", type: "password", saveLabel: "Save password" },
  { id: "timezone", title: "Time zone", value: "Europe/Berlin", description: "Your current time zone is", saveLabel: "Save time zone" },
  { id: "date", title: "Date format", value: "05 Oct 2026", description: "Dates are shown as", options: ["05 Oct 2026", "2026-10-05", "05/10/2026", "10/05/2026"], saveLabel: "Save date format" },
  { id: "time", title: "Time format", value: "24-hour format", description: "Times use", options: ["24-hour format", "12-hour format"], saveLabel: "Save time format" },
];
