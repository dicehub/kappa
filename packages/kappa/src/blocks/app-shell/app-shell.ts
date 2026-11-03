import type { Component, VNodeChild } from "vue";
import type { SidebarLayoutProps, SidebarLayoutSlots } from "../sidebar-layout";

export const APP_SHELL_APPEARANCES = ["default", "compact", "paneled"] as const;
export type AppShellAppearance = (typeof APP_SHELL_APPEARANCES)[number];
export interface AppShellProps extends SidebarLayoutProps {
  /** Paneled adds a compact header and navigation; compose Panels in its default slot. */
  appearance?: AppShellAppearance;
  /** Fill the viewport. Otherwise fill the height supplied by the parent. */
  fill?: boolean;
  /** Hide the desktop header toggle when a custom footer toggle is provided. */
  hideDesktopTrigger?: boolean;
  /** Original blue/teal background artwork; used by the paneled appearance. */
  bloom?: boolean;
  /** Accessible name of the optional shell-level tools navigation. */
  railLabel?: string;
}
export type AppShellSlots = SidebarLayoutSlots;
export interface AppShellPanelsProps {
  detailOpen?: boolean;
  asideOpen?: boolean;
  asideMaximized?: boolean;
  /** Docked side-panel width in pixels. Undefined uses the responsive default. */
  asideWidth?: number;
  size?: number[];
  splitAt?: number;
  minSize?: number;
  detailLabel?: string;
  asideLabel?: string;
  resizeLabel?: string;
  asideResizeLabel?: string;
  initialDetailFocus?: () => HTMLElement | null;
  finalDetailFocus?: () => HTMLElement | null;
  initialAsideFocus?: () => HTMLElement | null;
  finalAsideFocus?: () => HTMLElement | null;
}
export type AppShellPanelsEmits = {
  "update:detailOpen": [open: boolean];
  "update:asideOpen": [open: boolean];
  "update:asideMaximized": [maximized: boolean];
  "update:asideWidth": [width: number | undefined];
  "update:size": [size: number[]];
};
export interface AppShellPanelsSlots {
  default?: () => VNodeChild;
  header?: () => VNodeChild;
  detail?: (context: { close: () => void; mode: "split" | "overlay" }) => VNodeChild;
  aside?: (context: { close: () => void; toggleMaximized: () => void; maximized: boolean; canMaximize: boolean }) => VNodeChild;
}
export interface AppShellPageProps {
  as?: "main" | "section" | "div";
  title?: string;
  description?: string;
}
export interface AppShellSearchTriggerProps {
  label?: string;
  /** Display hint only. Separate keycaps with " + ", e.g. "Ctrl + K". The application binds the shortcut. */
  shortcut?: string;
  icon?: Component;
}
