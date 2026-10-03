import type { VNodeChild } from "vue";

export const RESOURCE_LIST_LAYOUT_DENSITIES = ["default", "compact"] as const;
export const RESOURCE_LIST_LAYOUT_SIDEBAR_SIDES = ["start", "end"] as const;

export type ResourceListLayoutDensity =
  (typeof RESOURCE_LIST_LAYOUT_DENSITIES)[number];
export type ResourceListLayoutSidebarSide =
  (typeof RESOURCE_LIST_LAYOUT_SIDEBAR_SIDES)[number];

export const RESOURCE_LIST_LAYOUT_DEFAULTS = {
  density: "default",
  sidebarSide: "end",
  stickySidebar: true,
} as const satisfies Required<
  Pick<ResourceListLayoutProps, "density" | "sidebarSide" | "stickySidebar">
>;

export interface ResourceListLayoutProps {
  /** Page title. Omit when the title slot supplies it. */
  title?: string;
  /** Supporting text shown below the title. */
  description?: string;
  /** Controls the spacing of the page structure. */
  density?: ResourceListLayoutDensity;
  /** Logical side of the optional sidebar on wide viewports. */
  sidebarSide?: ResourceListLayoutSidebarSide;
  /** Keeps the sidebar visible while the resource region scrolls. */
  stickySidebar?: boolean;
}

export interface ResourceListLayoutSlots {
  /** Optional icon beside the page identity. */
  icon?: () => VNodeChild;
  /** Replaces the title prop content. */
  title?: () => VNodeChild;
  /** Replaces the description prop content. */
  description?: () => VNodeChild;
  /** Primary page actions aligned with the heading. */
  actions?: () => VNodeChild;
  /** Search, filter, sort, or view controls above the resource region. */
  toolbar?: () => VNodeChild;
  /** Resource list, grid, empty state, loading state, and pagination. */
  default?: () => VNodeChild;
  /** Optional usage, help, or contextual content. */
  aside?: () => VNodeChild;
}

const includes = <Value extends string>(
  values: readonly Value[],
  value: unknown,
): value is Value => typeof value === "string" && values.includes(value as Value);

export const isResourceListLayoutDensity = (
  value: unknown,
): value is ResourceListLayoutDensity =>
  includes(RESOURCE_LIST_LAYOUT_DENSITIES, value);

export const resolveResourceListLayoutDensity = (
  value: unknown,
): ResourceListLayoutDensity =>
  isResourceListLayoutDensity(value)
    ? value
    : RESOURCE_LIST_LAYOUT_DEFAULTS.density;

export const isResourceListLayoutSidebarSide = (
  value: unknown,
): value is ResourceListLayoutSidebarSide =>
  includes(RESOURCE_LIST_LAYOUT_SIDEBAR_SIDES, value);

export const resolveResourceListLayoutSidebarSide = (
  value: unknown,
): ResourceListLayoutSidebarSide =>
  isResourceListLayoutSidebarSide(value)
    ? value
    : RESOURCE_LIST_LAYOUT_DEFAULTS.sidebarSide;
