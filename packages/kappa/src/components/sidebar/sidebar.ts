import type { Component, VNodeChild } from "vue";
import type { CollapsibleRootProps } from "@ark-ui/vue/collapsible";

export const SIDEBAR_DEFAULTS = {
  defaultOpen: true,
  defaultMobileOpen: false,
  collapsible: "icon",
  side: "start",
  compact: false,
  mobileBreakpoint: 768,
  width: "16.25rem",
  collapsedWidth: "3.25rem",
  mobileWidth: "18rem",
  resizable: false,
  defaultWidth: 260,
  minWidth: 180,
  maxWidth: 400,
  peekable: false,
} as const;

export type SidebarSide = "start" | "end";
export type SidebarCollapsibleMode = "icon" | "offcanvas" | "none";
export type SidebarState = "expanded" | "collapsed" | "peeking";

export interface SidebarProviderProps {
  id?: string;
  open?: boolean;
  defaultOpen?: boolean;
  mobileOpen?: boolean;
  defaultMobileOpen?: boolean;
  /** Desktop collapse mode. Mobile always uses a modal drawer. */
  collapsible?: SidebarCollapsibleMode;
  side?: SidebarSide;
  compact?: boolean;
  /** Viewport widths below this value use the mobile drawer. Zero disables it. */
  mobileBreakpoint?: number;
  width?: string;
  collapsedWidth?: string;
  mobileWidth?: string;
  /** Enable the desktop edge separator. Add Sidebar.ResizeHandle inside Root. */
  resizable?: boolean;
  /** Controlled expanded resize width, in pixels. Used only with resizable. */
  resizeWidth?: number;
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  /** Temporarily expand a collapsed icon rail on hover or keyboard focus. */
  peekable?: boolean;
}

export interface SidebarOpenChangeDetails { open: boolean }
export interface SidebarResizeDetails { width: number }
export type SidebarProviderEmits = {
  "update:open": [open: boolean];
  openChange: [details: SidebarOpenChangeDetails];
  "update:mobileOpen": [open: boolean];
  mobileOpenChange: [details: SidebarOpenChangeDetails];
  "update:resizeWidth": [width: number];
  resize: [details: SidebarResizeDetails];
  resizeEnd: [details: SidebarResizeDetails];
};
export interface SidebarSlots { default?: () => VNodeChild }
export type SidebarProviderSlots = SidebarSlots;
export interface SidebarProps {
  /** Accessible name for both the navigation landmark and mobile dialog. */
  label?: string;
  fullScreenOnMobile?: boolean;
}
export type SidebarRootProps = SidebarProps;
export type SidebarRootSlots = SidebarSlots;
export interface SidebarPartProps { asChild?: boolean }
export interface SidebarTriggerProps extends SidebarPartProps {
  expandLabel?: string;
  collapseLabel?: string;
  openLabel?: string;
  closeLabel?: string;
  disabled?: boolean;
}
export interface SidebarCloseProps extends SidebarPartProps { label?: string }
export interface SidebarMenuButtonProps extends SidebarPartProps {
  /** A native anchor is rendered when href is present. */
  href?: string;
  active?: boolean;
  disabled?: boolean;
  icon?: Component;
  /** Optional collapsed-rail tooltip. Slot text remains accessible without it. */
  tooltip?: string;
}
export interface SidebarMenuButtonSlots extends SidebarSlots {
  icon?: () => VNodeChild;
}
export interface SidebarCollapsibleProps {
  open?: boolean;
  defaultOpen?: boolean;
  disabled?: boolean;
  id?: string;
}
export type SidebarCollapsibleEmits = {
  "update:open": [open: boolean];
  openChange: [details: SidebarOpenChangeDetails];
};
export interface SidebarCollapsibleContentProps extends SidebarPartProps {}
export type SidebarCollapsibleTriggerProps = Pick<CollapsibleRootProps, "asChild">;
export interface SidebarLoadingProps { rows?: number; label?: string }
export interface SidebarResizeHandleProps { label?: string; disabled?: boolean }
export interface SidebarSlidingViewsProps {
  activeKey: string;
  /** Physical direction of the incoming view. Reverse it for back navigation. */
  direction?: "left" | "right";
}
export interface SidebarSlidingViewProps { value: string; label?: string }

export function resolveSidebarWidthBounds(min: number, max: number) {
  const minWidth = Number.isFinite(min) ? Math.max(1, min) : SIDEBAR_DEFAULTS.minWidth;
  const maxWidth = Number.isFinite(max) ? Math.max(minWidth, max) : Math.max(minWidth, SIDEBAR_DEFAULTS.maxWidth);
  return { minWidth, maxWidth };
}

export function clampSidebarWidth(value: number, min: number, max: number) {
  const { minWidth, maxWidth } = resolveSidebarWidthBounds(min, max);
  return Math.min(maxWidth, Math.max(minWidth, Number.isFinite(value) ? value : SIDEBAR_DEFAULTS.defaultWidth));
}

export function resolveSidebarBreakpoint(value: number): number {
  return Number.isFinite(value) ? Math.max(0, value) : SIDEBAR_DEFAULTS.mobileBreakpoint;
}

export function resolveSidebarLoadingRows(value: number): number {
  return Number.isFinite(value) ? Math.min(20, Math.max(1, Math.floor(value))) : 5;
}
