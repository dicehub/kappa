import type {
  ScrollAreaContentProps as ArkScrollAreaContentProps,
  ScrollAreaCornerProps as ArkScrollAreaCornerProps,
  ScrollAreaRootProps as ArkScrollAreaRootProps,
  ScrollAreaScrollbarProps as ArkScrollAreaScrollbarProps,
  ScrollAreaThumbProps as ArkScrollAreaThumbProps,
  ScrollAreaViewportProps as ArkScrollAreaViewportProps,
  UseScrollAreaContext,
  UseScrollAreaReturn,
} from "@ark-ui/vue/scroll-area";
import type { UnwrapRef, VNodeChild } from "vue";

export const SCROLL_AREA_DEFAULT_ORIENTATION = "vertical" as const;

export type ScrollAreaOrientation = NonNullable<ArkScrollAreaScrollbarProps["orientation"]>;
export type ScrollAreaDirection = "ltr" | "rtl";
export type ScrollAreaApi = UnwrapRef<UseScrollAreaReturn>;
export type ScrollAreaContextValue = UnwrapRef<UseScrollAreaContext>;

export interface ScrollAreaProps {
  asChild?: ArkScrollAreaRootProps["asChild"];
  /** Overrides the inherited Ark UI locale direction. */
  dir?: ScrollAreaDirection;
  id?: ArkScrollAreaRootProps["id"];
  ids?: ArkScrollAreaRootProps["ids"];
}

export type ScrollAreaRootProps = ScrollAreaProps;

export interface ScrollAreaSlots {
  default?: () => VNodeChild;
}

export type ScrollAreaRootSlots = ScrollAreaSlots;

export interface ScrollAreaRootProviderProps {
  value: ScrollAreaApi;
  asChild?: boolean;
}

export interface ScrollAreaRootProviderSlots {
  default?: () => VNodeChild;
}

export type ScrollAreaViewportProps = ArkScrollAreaViewportProps;
export type ScrollAreaContentProps = ArkScrollAreaContentProps;
export type ScrollAreaScrollbarProps = ArkScrollAreaScrollbarProps;
export type ScrollAreaThumbProps = ArkScrollAreaThumbProps;
export type ScrollAreaCornerProps = ArkScrollAreaCornerProps;

export interface ScrollAreaPartSlots {
  default?: () => VNodeChild;
}

export type ScrollAreaViewportSlots = ScrollAreaPartSlots;
export type ScrollAreaContentSlots = ScrollAreaPartSlots;
export type ScrollAreaScrollbarSlots = ScrollAreaPartSlots;
export type ScrollAreaThumbSlots = ScrollAreaPartSlots;
export type ScrollAreaCornerSlots = ScrollAreaPartSlots;

export interface ScrollAreaContextSlots {
  default?: (context: ScrollAreaContextValue) => VNodeChild;
}

export type { UseScrollAreaContext, UseScrollAreaReturn } from "@ark-ui/vue/scroll-area";
