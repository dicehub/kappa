import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  HTMLAttributes,
  LiHTMLAttributes,
  OlHTMLAttributes,
  VNodeChild,
} from "vue";

export const BREADCRUMBS_SIZES = ["sm", "base"] as const;
export const BREADCRUMBS_DEFAULT_SIZE = "base" as const;
export const BREADCRUMBS_VARIANTS = ["default", "context"] as const;
export const BREADCRUMBS_DEFAULT_VARIANT = "default" as const;

export type BreadcrumbsSize = (typeof BREADCRUMBS_SIZES)[number];
export type BreadcrumbsVariant = (typeof BREADCRUMBS_VARIANTS)[number];

export const isBreadcrumbsVariant = (value: unknown): value is BreadcrumbsVariant =>
  typeof value === "string" && BREADCRUMBS_VARIANTS.includes(value as BreadcrumbsVariant);

export const resolveBreadcrumbsVariant = (value: unknown): BreadcrumbsVariant =>
  isBreadcrumbsVariant(value) ? value : BREADCRUMBS_DEFAULT_VARIANT;

export const isBreadcrumbsSize = (value: unknown): value is BreadcrumbsSize =>
  typeof value === "string" && BREADCRUMBS_SIZES.includes(value as BreadcrumbsSize);

export const resolveBreadcrumbsSize = (value: unknown): BreadcrumbsSize =>
  isBreadcrumbsSize(value) ? value : BREADCRUMBS_DEFAULT_SIZE;

export interface BreadcrumbsProps {
  /** Density of the breadcrumb trail. */
  size?: BreadcrumbsSize;
  /** Context trails use padded links with quiet hover surfaces. */
  variant?: BreadcrumbsVariant;
}

export type BreadcrumbsRootProps = BreadcrumbsProps & HTMLAttributes;

export interface BreadcrumbsSlots {
  default?: () => VNodeChild;
}

export type BreadcrumbsRootSlots = BreadcrumbsSlots;
export type BreadcrumbsListProps = OlHTMLAttributes;
export type BreadcrumbsItemProps = LiHTMLAttributes;
export type BreadcrumbsPageProps = HTMLAttributes;
export type BreadcrumbsCurrentProps = BreadcrumbsPageProps;
export type BreadcrumbsSeparatorProps = LiHTMLAttributes;
export type BreadcrumbsEllipsisProps = HTMLAttributes;

export interface BreadcrumbsListSlots {
  default?: () => VNodeChild;
}

export interface BreadcrumbsItemSlots {
  default?: () => VNodeChild;
}

export interface BreadcrumbsPageSlots {
  default?: () => VNodeChild;
}

export type BreadcrumbsCurrentSlots = BreadcrumbsPageSlots;

export interface BreadcrumbsSeparatorSlots {
  default?: () => VNodeChild;
}

export interface BreadcrumbsEllipsisSlots {
  default?: () => VNodeChild;
}

export interface BreadcrumbsLinkProps extends /* @vue-ignore */ AnchorHTMLAttributes {
  /** Merge breadcrumb styling and attributes onto the single child anchor. */
  asChild?: boolean;
}

export interface BreadcrumbsLinkSlots {
  default?: () => VNodeChild;
}

export interface BreadcrumbsTriggerProps extends /* @vue-ignore */ ButtonHTMLAttributes {
  /** Merge styling and attributes onto a single child button. */
  asChild?: boolean;
  /** Native button type. Defaults to button to avoid form submission. */
  type?: ButtonHTMLAttributes["type"];
}

export interface BreadcrumbsTriggerSlots {
  /** Optional replacement for the decorative down caret. */
  default?: () => VNodeChild;
}
