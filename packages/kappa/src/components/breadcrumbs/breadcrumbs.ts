import type {
  AnchorHTMLAttributes,
  HTMLAttributes,
  LiHTMLAttributes,
  OlHTMLAttributes,
  VNodeChild,
} from "vue";

export const BREADCRUMBS_SIZES = ["sm", "base"] as const;
export const BREADCRUMBS_DEFAULT_SIZE = "base" as const;

export type BreadcrumbsSize = (typeof BREADCRUMBS_SIZES)[number];

export const isBreadcrumbsSize = (value: unknown): value is BreadcrumbsSize =>
  typeof value === "string" && BREADCRUMBS_SIZES.includes(value as BreadcrumbsSize);

export const resolveBreadcrumbsSize = (value: unknown): BreadcrumbsSize =>
  isBreadcrumbsSize(value) ? value : BREADCRUMBS_DEFAULT_SIZE;

export interface BreadcrumbsProps {
  /** Density of the breadcrumb trail. */
  size?: BreadcrumbsSize;
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
