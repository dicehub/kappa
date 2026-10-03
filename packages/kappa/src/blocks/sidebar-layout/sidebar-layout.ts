import type { VNodeChild } from "vue";
import type { SidebarContextValue, SidebarProviderEmits, SidebarProviderProps, SidebarTriggerProps } from "../../components/sidebar";

export const SIDEBAR_LAYOUT_VARIANTS = ["workspace", "rail", "inset", "floating", "split", "header"] as const;
export type SidebarLayoutVariant = (typeof SIDEBAR_LAYOUT_VARIANTS)[number];

export const SIDEBAR_LAYOUT_DEFAULTS = {
  variant: "workspace",
  label: "Application navigation",
  navigationLabel: "Navigation links",
  secondaryLabel: "Secondary navigation",
  closeLabel: "Close navigation",
  resizeLabel: "Resize sidebar",
  fullScreenOnMobile: false,
} as const;

export interface SidebarLayoutProps extends SidebarProviderProps {
  variant?: SidebarLayoutVariant;
  /** Name of the navigation landmark and mobile dialog. */
  label?: string;
  navigationLabel?: string;
  secondaryLabel?: string;
  closeLabel?: string;
  resizeLabel?: string;
  fullScreenOnMobile?: boolean;
  /** Translated labels and disabled state for the built-in toggle. */
  triggerProps?: SidebarTriggerProps;
}

export type SidebarLayoutEmits = SidebarProviderEmits;
export interface SidebarLayoutSlots {
  header?: (context: SidebarContextValue) => VNodeChild;
  navigation?: (context: SidebarContextValue) => VNodeChild;
  footer?: (context: SidebarContextValue) => VNodeChild;
  /** Used by split; hidden with the collapsed rail and stacked on mobile. */
  secondary?: (context: SidebarContextValue) => VNodeChild;
  /** Content after the built-in toggle; in the site header for header. */
  toolbar?: (context: SidebarContextValue) => VNodeChild;
  default?: (context: SidebarContextValue) => VNodeChild;
}

export function sidebarLayoutDefaultOpen(variant: SidebarLayoutVariant): boolean {
  return variant !== "rail";
}

export function sidebarLayoutDefaultWidth(variant: SidebarLayoutVariant): number {
  return variant === "split" ? 352 : 260;
}
