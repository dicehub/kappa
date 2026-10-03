import type { HTMLAttributes, InjectionKey, Ref, VNodeChild } from "vue";

export const GRID_VARIANTS = {
  "2up": {
    description: "One column by default and two columns at the medium breakpoint.",
  },
  "side-by-side": {
    description: "Two columns at every viewport size.",
  },
  "2-1": {
    description: "A two-thirds and one-third split at the medium breakpoint.",
  },
  "1-2": {
    description: "A one-third and two-thirds split at the medium breakpoint.",
  },
  "1-3up": {
    description: "One column by default and three columns at the large breakpoint.",
  },
  "3up": {
    description: "One, two, then three columns across responsive breakpoints.",
  },
  "4up": {
    description: "One, two, three, then four columns across responsive breakpoints.",
  },
  "6up": {
    description: "Two, three, four, then six columns across responsive breakpoints.",
  },
  "1-2-4up": {
    description: "One, two, then four columns across responsive breakpoints.",
  },
} as const;

export const GRID_GAPS = {
  none: { description: "No space between grid items." },
  sm: { description: "A fixed compact gap." },
  base: { description: "The default responsive gap." },
  lg: { description: "A fixed spacious gap." },
} as const;

export const GRID_ROOT_ELEMENTS = ["div", "section", "ul", "ol"] as const;
export const GRID_ITEM_ELEMENTS = ["div", "article", "section", "li"] as const;

export type GridVariant = keyof typeof GRID_VARIANTS;
export type GridGap = keyof typeof GRID_GAPS;
export type GridRootElement = (typeof GRID_ROOT_ELEMENTS)[number];
export type GridItemElement = (typeof GRID_ITEM_ELEMENTS)[number];

export const GRID_DEFAULT_GAP = "base" satisfies GridGap;
export const GRID_ROOT_DEFAULT_ELEMENT = "div" satisfies GridRootElement;
export const GRID_ITEM_DEFAULT_ELEMENT = "div" satisfies GridItemElement;

export interface GridRootProps extends /* @vue-ignore */ HTMLAttributes {
  /** Native element rendered by the grid container. */
  as?: GridRootElement;
  /** Responsive column layout preset. */
  variant?: GridVariant;
  /** Space between grid items. The base gap grows at larger breakpoints. */
  gap?: GridGap;
  /** Shows dividers between stacked items on small screens for the 4up preset. */
  mobileDivider?: boolean;
}

export type GridProps = GridRootProps;

export interface GridItemProps extends /* @vue-ignore */ HTMLAttributes {
  /** Native element rendered by the grid item. */
  as?: GridItemElement;
}

export interface GridRootSlots {
  default?: () => VNodeChild;
}

export type GridSlots = GridRootSlots;

export interface GridItemSlots {
  default?: () => VNodeChild;
}

export interface GridContextValue {
  mobileDivider: Readonly<Ref<boolean>>;
  variant: Readonly<Ref<GridVariant | undefined>>;
}

export const GRID_CONTEXT: InjectionKey<GridContextValue> = Symbol("kappa-grid");

const hasOwn = <ObjectType extends object>(object: ObjectType, value: unknown): value is keyof ObjectType =>
  typeof value === "string" && Object.prototype.hasOwnProperty.call(object, value);

const includes = <Value extends string>(
  values: readonly Value[],
  value: unknown,
): value is Value => typeof value === "string" && values.includes(value as Value);

export const isGridVariant = (value: unknown): value is GridVariant =>
  hasOwn(GRID_VARIANTS, value);

export const isGridGap = (value: unknown): value is GridGap => hasOwn(GRID_GAPS, value);

export const isGridRootElement = (value: unknown): value is GridRootElement =>
  includes(GRID_ROOT_ELEMENTS, value);

export const isGridItemElement = (value: unknown): value is GridItemElement =>
  includes(GRID_ITEM_ELEMENTS, value);

export const resolveGridVariant = (value: unknown): GridVariant | undefined =>
  isGridVariant(value) ? value : undefined;

export const resolveGridGap = (value: unknown): GridGap =>
  isGridGap(value) ? value : GRID_DEFAULT_GAP;

export const resolveGridRootElement = (value: unknown): GridRootElement =>
  isGridRootElement(value) ? value : GRID_ROOT_DEFAULT_ELEMENT;

export const resolveGridItemElement = (value: unknown): GridItemElement =>
  isGridItemElement(value) ? value : GRID_ITEM_DEFAULT_ELEMENT;
