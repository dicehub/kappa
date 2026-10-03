import type {
  RatingGroupControlProps as ArkRatingControlProps,
  RatingGroupHoverChangeDetails,
  RatingGroupItemProps as ArkRatingItemProps,
  RatingGroupLabelProps as ArkRatingLabelProps,
  RatingGroupRootProps as ArkRatingRootProps,
  RatingGroupValueChangeDetails,
  UseRatingGroupContext,
  UseRatingGroupItemContext,
  UseRatingGroupReturn,
} from "@ark-ui/vue/rating-group";
import type { UnwrapRef, VNodeChild } from "vue";

export const RATING_SIZES = ["sm", "base", "lg"] as const;
export type RatingSize = (typeof RATING_SIZES)[number];
export const RATING_DEFAULT_SIZE = "base" satisfies RatingSize;

export const isRatingSize = (value: unknown): value is RatingSize =>
  typeof value === "string" && RATING_SIZES.includes(value as RatingSize);

export const resolveRatingSize = (value: unknown): RatingSize =>
  isRatingSize(value) ? value : RATING_DEFAULT_SIZE;

export type RatingDirection = "ltr" | "rtl";
export type RatingApi = UnwrapRef<UseRatingGroupReturn>;
export type RatingContextValue = UnwrapRef<UseRatingGroupContext>;
export type RatingItemContextValue = UnwrapRef<UseRatingGroupItemContext>;

export interface RatingProps {
  allowHalf?: ArkRatingRootProps["allowHalf"];
  asChild?: ArkRatingRootProps["asChild"];
  autoFocus?: ArkRatingRootProps["autoFocus"];
  count?: ArkRatingRootProps["count"];
  defaultValue?: ArkRatingRootProps["defaultValue"];
  disabled?: ArkRatingRootProps["disabled"];
  /** Overrides the inherited Ark UI locale direction. */
  dir?: RatingDirection;
  form?: ArkRatingRootProps["form"];
  id?: ArkRatingRootProps["id"];
  ids?: ArkRatingRootProps["ids"];
  /** Marks the rating as invalid and exposes aria-invalid on the form control. */
  invalid?: boolean;
  modelValue?: ArkRatingRootProps["modelValue"];
  name?: ArkRatingRootProps["name"];
  readOnly?: ArkRatingRootProps["readOnly"];
  required?: ArkRatingRootProps["required"];
  /** Controls icon and target geometry without changing rating behavior. */
  size?: RatingSize;
  translations?: ArkRatingRootProps["translations"];
}

export type RatingRootProps = RatingProps;

export type RatingEmits = {
  hoverChange: [details: RatingGroupHoverChangeDetails];
  valueChange: [details: RatingGroupValueChangeDetails];
  "update:modelValue": [value: number];
};

export interface RatingSlots {
  default?: () => VNodeChild;
}

export type RatingRootSlots = RatingSlots;

export interface RatingRootProviderProps {
  value: RatingApi;
  asChild?: boolean;
  invalid?: boolean;
  size?: RatingSize;
}

export type RatingRootProviderSlots = RatingSlots;
export type RatingControlProps = ArkRatingControlProps;
export type RatingLabelProps = ArkRatingLabelProps;

export interface RatingControlSlots {
  default?: (context: RatingContextValue) => VNodeChild;
}

export interface RatingItemProps {
  index: ArkRatingItemProps["index"];
  asChild?: ArkRatingItemProps["asChild"];
}

export interface RatingItemSlots {
  default?: (context: RatingItemContextValue) => VNodeChild;
}

export type RatingLabelSlots = RatingSlots;

export interface RatingContextSlots {
  default?: (context: RatingContextValue) => VNodeChild;
}

export interface RatingItemContextSlots {
  default?: (context: RatingItemContextValue) => VNodeChild;
}

export type {
  RatingGroupHoverChangeDetails as RatingHoverChangeDetails,
  RatingGroupValueChangeDetails as RatingValueChangeDetails,
  UseRatingGroupContext as UseRatingContext,
  UseRatingGroupItemContext as UseRatingItemContext,
  UseRatingGroupReturn as UseRatingReturn,
};
