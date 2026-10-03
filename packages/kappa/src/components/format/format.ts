import type {
  FormatByteProps as ArkFormatByteProps,
  FormatNumberProps as ArkFormatNumberProps,
  FormatRelativeTimeProps as ArkFormatRelativeTimeProps,
  FormatTimeProps as ArkFormatTimeProps,
} from "@ark-ui/vue/format";
import type { VNodeChild } from "vue";

export const FORMAT_DEFAULT_LOCALE = "en-US";

export interface FormatProps {
  /** BCP 47 locale used by all format parts in the subtree. */
  locale?: string;
}

export type FormatRootProps = FormatProps;

export interface FormatSlots {
  /** Format parts and other content that receive the locale context. */
  default?: () => VNodeChild;
}

export type FormatRootSlots = FormatSlots;

export interface FormatByteProps {
  /** BCP 47 locale override for this value. */
  locale?: string;
  /** Unit granularity to display. */
  unit?: ArkFormatByteProps["unit"];
  /** Length of the displayed unit label. */
  unitDisplay?: ArkFormatByteProps["unitDisplay"];
  /** Decimal or binary unit system. */
  unitSystem?: ArkFormatByteProps["unitSystem"];
  /** Byte size to format. */
  value: ArkFormatByteProps["value"];
}

export interface FormatNumberProps {
  /** BCP 47 locale override for this value. */
  locale?: string;
  compactDisplay?: ArkFormatNumberProps["compactDisplay"];
  currencyDisplay?: ArkFormatNumberProps["currencyDisplay"];
  currencySign?: ArkFormatNumberProps["currencySign"];
  notation?: ArkFormatNumberProps["notation"];
  signDisplay?: ArkFormatNumberProps["signDisplay"];
  unit?: ArkFormatNumberProps["unit"];
  unitDisplay?: ArkFormatNumberProps["unitDisplay"];
  /** Number to format. */
  value: ArkFormatNumberProps["value"];
}

export interface FormatRelativeTimeProps {
  /** BCP 47 locale override for this value. */
  locale?: string;
  localeMatcher?: ArkFormatRelativeTimeProps["localeMatcher"];
  numeric?: ArkFormatRelativeTimeProps["numeric"];
  style?: ArkFormatRelativeTimeProps["style"];
  /** Date to format relative to the current time. */
  value: ArkFormatRelativeTimeProps["value"];
}

export type FormatRelativeTimeStyle = NonNullable<FormatRelativeTimeProps["style"]>;

export interface FormatTimeProps {
  /** BCP 47 locale override for this value. */
  locale?: string;
  amLabel?: ArkFormatTimeProps["amLabel"];
  format?: ArkFormatTimeProps["format"];
  pmLabel?: ArkFormatTimeProps["pmLabel"];
  withSeconds?: ArkFormatTimeProps["withSeconds"];
  /** Time string or Date to format. */
  value: ArkFormatTimeProps["value"];
}

/** Returns a usable locale without passing empty runtime values to Intl. */
export const resolveFormatLocale = (value: unknown): string => {
  if (typeof value !== "string" || value.trim().length === 0) return FORMAT_DEFAULT_LOCALE;

  const locale = value.trim();
  try {
    return Intl.getCanonicalLocales(locale)[0] ?? FORMAT_DEFAULT_LOCALE;
  } catch {
    return FORMAT_DEFAULT_LOCALE;
  }
};

/** Keeps Vue's special style binding from reaching Intl as an object. */
export const resolveFormatRelativeTimeStyle = (
  value: unknown,
): FormatRelativeTimeStyle | undefined => {
  if (value === "long" || value === "short" || value === "narrow") return value;
  return undefined;
};
