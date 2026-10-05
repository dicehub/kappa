import type {
  NavigationMenuRootProps as ArkRootProps,
  NavigationMenuRootEmits,
  NavigationMenuRootProviderProps as ArkRootProviderProps,
  NavigationMenuItemProps as ArkItemProps,
  NavigationMenuTriggerProps as ArkTriggerProps,
  NavigationMenuContentProps as ArkContentProps,
  NavigationMenuLinkProps as ArkLinkProps,
  NavigationMenuViewportPositionerProps as ArkPositionerProps,
  UseNavigationMenuContext,
} from "@ark-ui/vue/navigation-menu";
import type { UnwrapRef, VNodeChild } from "vue";

export const NAVIGATION_MENU_SIZES = ["sm", "md"] as const;
export type NavigationMenuSize = (typeof NAVIGATION_MENU_SIZES)[number];
export interface NavigationMenuProps extends Omit<ArkRootProps, "lazyMount" | "unmountOnExit"> {
  /** Density of the top-level links and triggers. */
  size?: NavigationMenuSize;
}
export type NavigationMenuRootProps = NavigationMenuProps;
export type NavigationMenuEmits = NavigationMenuRootEmits;
export interface NavigationMenuRootProviderProps {
  value: ArkRootProviderProps["value"];
  size?: NavigationMenuSize;
}
export type NavigationMenuItemProps = ArkItemProps;
export interface NavigationMenuTriggerProps extends ArkTriggerProps {
  /** Show the built-in chevron. For asChild, supply your own indicator. */
  showIndicator?: boolean;
}
export type NavigationMenuContentProps = ArkContentProps;
export type NavigationMenuLinkProps = ArkLinkProps;
export type NavigationMenuViewportPositionerProps = ArkPositionerProps;
export interface NavigationMenuPartProps { asChild?: boolean }
export type NavigationMenuListProps = NavigationMenuPartProps;
export type NavigationMenuViewportProps = NavigationMenuPartProps;
export type NavigationMenuIndicatorProps = NavigationMenuPartProps;
export type NavigationMenuItemIndicatorProps = NavigationMenuPartProps;
export type NavigationMenuArrowProps = NavigationMenuPartProps;
export interface NavigationMenuSlots { default?: () => VNodeChild }
export interface NavigationMenuContextSlots {
  default?: (context: UnwrapRef<UseNavigationMenuContext>) => VNodeChild;
}
