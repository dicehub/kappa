import type { HTMLAttributes, VNodeChild } from "vue";

export const ACTIVITY_FEED_SIZES = ["default", "compact"] as const;
export const ACTIVITY_FEED_TONES = [
  "neutral",
  "accent",
  "success",
  "warning",
  "danger",
] as const;
export const ACTIVITY_FEED_MARKER_VARIANTS = ["dot", "icon", "avatar"] as const;
export const ACTIVITY_FEED_HEADING_ELEMENTS = [
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "div",
] as const;

export type ActivityFeedSize = (typeof ACTIVITY_FEED_SIZES)[number];
export type ActivityFeedTone = (typeof ACTIVITY_FEED_TONES)[number];
export type ActivityFeedMarkerVariant = (typeof ACTIVITY_FEED_MARKER_VARIANTS)[number];
export type ActivityFeedHeadingElement = (typeof ACTIVITY_FEED_HEADING_ELEMENTS)[number];

export const ACTIVITY_FEED_DEFAULT_SIZE = "default" satisfies ActivityFeedSize;
export const ACTIVITY_FEED_DEFAULT_TONE = "neutral" satisfies ActivityFeedTone;
export const ACTIVITY_FEED_DEFAULT_MARKER_VARIANT =
  "dot" satisfies ActivityFeedMarkerVariant;
export const ACTIVITY_FEED_GROUP_LABEL_DEFAULT_ELEMENT =
  "h3" satisfies ActivityFeedHeadingElement;
export const ACTIVITY_FEED_TITLE_DEFAULT_ELEMENT =
  "p" satisfies ActivityFeedHeadingElement;

export interface ActivityFeedRootProps
  extends /* @vue-ignore */ Omit<HTMLAttributes, "size"> {
  /** Controls spacing, marker size, and typography. */
  size?: ActivityFeedSize;
}

export type ActivityFeedProps = ActivityFeedRootProps;

export interface ActivityFeedGroupProps extends /* @vue-ignore */ HTMLAttributes {}
export interface ActivityFeedListProps extends /* @vue-ignore */ HTMLAttributes {}

export interface ActivityFeedItemProps extends /* @vue-ignore */ HTMLAttributes {
  /** Applies semantic color to the item marker. */
  tone?: ActivityFeedTone;
}

export interface ActivityFeedMarkerProps extends /* @vue-ignore */ HTMLAttributes {
  /** Selects dot, icon, or avatar marker geometry. */
  variant?: ActivityFeedMarkerVariant;
}

export interface ActivityFeedGroupLabelProps extends /* @vue-ignore */ HTMLAttributes {
  /** Native heading or text element used for the group label. */
  as?: ActivityFeedHeadingElement;
}

export interface ActivityFeedTitleProps extends /* @vue-ignore */ HTMLAttributes {
  /** Native heading or text element used for the event title. */
  as?: ActivityFeedHeadingElement;
}

export interface ActivityFeedTimeProps extends /* @vue-ignore */ HTMLAttributes {
  /** Machine-readable date or time value for the native time element. */
  datetime?: string;
}

export interface ActivityFeedPartProps extends /* @vue-ignore */ HTMLAttributes {}

export interface ActivityFeedPartSlots {
  default?: () => VNodeChild;
}

export type ActivityFeedRootSlots = ActivityFeedPartSlots;
export type ActivityFeedSlots = ActivityFeedRootSlots;
export type ActivityFeedGroupSlots = ActivityFeedPartSlots;
export type ActivityFeedGroupLabelSlots = ActivityFeedPartSlots;
export type ActivityFeedListSlots = ActivityFeedPartSlots;
export type ActivityFeedItemSlots = ActivityFeedPartSlots;
export type ActivityFeedMarkerSlots = ActivityFeedPartSlots;
export type ActivityFeedContentSlots = ActivityFeedPartSlots;
export type ActivityFeedHeaderSlots = ActivityFeedPartSlots;
export type ActivityFeedTitleSlots = ActivityFeedPartSlots;
export type ActivityFeedDescriptionSlots = ActivityFeedPartSlots;
export type ActivityFeedTimeSlots = ActivityFeedPartSlots;
export type ActivityFeedActionsSlots = ActivityFeedPartSlots;

const includes = <Value extends string>(
  values: readonly Value[],
  value: unknown,
): value is Value => typeof value === "string" && values.includes(value as Value);

export const isActivityFeedSize = (value: unknown): value is ActivityFeedSize =>
  includes(ACTIVITY_FEED_SIZES, value);
export const isActivityFeedTone = (value: unknown): value is ActivityFeedTone =>
  includes(ACTIVITY_FEED_TONES, value);
export const isActivityFeedMarkerVariant = (
  value: unknown,
): value is ActivityFeedMarkerVariant => includes(ACTIVITY_FEED_MARKER_VARIANTS, value);
export const isActivityFeedHeadingElement = (
  value: unknown,
): value is ActivityFeedHeadingElement => includes(ACTIVITY_FEED_HEADING_ELEMENTS, value);

export const resolveActivityFeedSize = (value: unknown): ActivityFeedSize =>
  isActivityFeedSize(value) ? value : ACTIVITY_FEED_DEFAULT_SIZE;
export const resolveActivityFeedTone = (value: unknown): ActivityFeedTone =>
  isActivityFeedTone(value) ? value : ACTIVITY_FEED_DEFAULT_TONE;
export const resolveActivityFeedMarkerVariant = (
  value: unknown,
): ActivityFeedMarkerVariant =>
  isActivityFeedMarkerVariant(value) ? value : ACTIVITY_FEED_DEFAULT_MARKER_VARIANT;
export const resolveActivityFeedGroupLabelElement = (
  value: unknown,
): ActivityFeedHeadingElement =>
  isActivityFeedHeadingElement(value)
    ? value
    : ACTIVITY_FEED_GROUP_LABEL_DEFAULT_ELEMENT;
export const resolveActivityFeedTitleElement = (
  value: unknown,
): ActivityFeedHeadingElement =>
  isActivityFeedHeadingElement(value) ? value : ACTIVITY_FEED_TITLE_DEFAULT_ELEMENT;
