import type { AnchorHTMLAttributes, VNodeChild } from "vue";

export const LINK_VARIANTS = ["inline", "current", "plain"] as const;

export type LinkVariant = (typeof LINK_VARIANTS)[number];

export const LINK_DEFAULT_VARIANT = "inline" satisfies LinkVariant;

export interface LinkProps
  extends /* @vue-ignore */ Omit<AnchorHTMLAttributes, "href"> {
  /** Native anchor destination. The composed child owns navigation when asChild is true. */
  href?: string;
  /** Opens in a new context and adds safe rel tokens unless native attributes override it. */
  external?: boolean;
  /** Merges Link attributes and styling onto one child, such as RouterLink. */
  asChild?: boolean;
  /** Underlined accent, inherited underlined, or context-dependent plain treatment. */
  variant?: LinkVariant;
}

export interface LinkSlots {
  default?: () => VNodeChild;
}

const includesOwn = <Value extends string>(
  values: readonly Value[],
  value: unknown,
): value is Value => typeof value === "string" && values.includes(value as Value);

export const isLinkVariant = (value: unknown): value is LinkVariant =>
  includesOwn(LINK_VARIANTS, value);

export const resolveLinkVariant = (value: unknown): LinkVariant =>
  isLinkVariant(value) ? value : LINK_DEFAULT_VARIANT;

export const resolveLinkTarget = (
  value: unknown,
  external = false,
): string | undefined => {
  const target = typeof value === "string" ? value : undefined;
  return external ? (target ?? "_blank") : target;
};

export const resolveLinkRel = (
  value: unknown,
  target: unknown,
  external = false,
): string | undefined => {
  const rel = typeof value === "string" ? value : "";
  if (!external && target !== "_blank") return rel || undefined;

  const tokens = new Set(rel.split(/\s+/).filter(Boolean));
  tokens.add("noopener");
  tokens.add("noreferrer");
  return [...tokens].join(" ");
};
