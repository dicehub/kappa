import type {
  AvatarFallbackProps as ArkAvatarFallbackProps,
  AvatarImageProps as ArkAvatarImageProps,
  AvatarRootProps as ArkAvatarRootProps,
  AvatarStatusChangeDetails,
} from "@ark-ui/vue/avatar";
import type { HTMLAttributes, VNodeChild } from "vue";

export const AVATAR_SIZES = ["sm", "default", "lg"] as const;
export const AVATAR_DEFAULT_SIZE = "default" as const;

export type AvatarSize = (typeof AVATAR_SIZES)[number];
export type AvatarDirection = "ltr" | "rtl";

export const isAvatarSize = (value: unknown): value is AvatarSize =>
  typeof value === "string" && AVATAR_SIZES.includes(value as AvatarSize);

export const resolveAvatarSize = (value: unknown): AvatarSize =>
  isAvatarSize(value) ? value : AVATAR_DEFAULT_SIZE;

export interface AvatarProps {
  asChild?: ArkAvatarRootProps["asChild"];
  dir?: AvatarDirection;
  id?: ArkAvatarRootProps["id"];
  ids?: ArkAvatarRootProps["ids"];
  size?: AvatarSize;
}

export type AvatarRootProps = AvatarProps;

export type AvatarEmits = {
  statusChange: [details: AvatarStatusChangeDetails];
};

export interface AvatarSlots {
  default?: () => VNodeChild;
}

export type AvatarRootSlots = AvatarSlots;

export type AvatarImageProps = Omit<ArkAvatarImageProps, "alt"> & {
  alt: string;
};

export interface AvatarImageSlots {}

export type AvatarFallbackProps = ArkAvatarFallbackProps;

export interface AvatarFallbackSlots {
  default?: () => VNodeChild;
}

export type AvatarBadgeProps = HTMLAttributes;

export interface AvatarBadgeSlots {
  default?: () => VNodeChild;
}

export type AvatarGroupProps = HTMLAttributes;

export interface AvatarGroupSlots {
  default?: () => VNodeChild;
}

export type AvatarGroupCountProps = HTMLAttributes;

export interface AvatarGroupCountSlots {
  default?: () => VNodeChild;
}

export type { AvatarStatusChangeDetails } from "@ark-ui/vue/avatar";
