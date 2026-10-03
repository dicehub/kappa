import FormatRoot from "./Format.vue";
import FormatByte from "./FormatByte.vue";
import FormatNumber from "./FormatNumber.vue";
import FormatRelativeTime from "./FormatRelativeTime.vue";
import FormatTime from "./FormatTime.vue";

export const Format = Object.assign(FormatRoot, {
  Root: FormatRoot,
  Byte: FormatByte,
  Number: FormatNumber,
  RelativeTime: FormatRelativeTime,
  Time: FormatTime,
});

export { FormatRoot, FormatByte, FormatNumber, FormatRelativeTime, FormatTime };

export {
  FORMAT_DEFAULT_LOCALE,
  resolveFormatLocale,
  resolveFormatRelativeTimeStyle,
  type FormatByteProps,
  type FormatNumberProps,
  type FormatProps,
  type FormatRelativeTimeProps,
  type FormatRelativeTimeStyle,
  type FormatRootProps,
  type FormatRootSlots,
  type FormatSlots,
  type FormatTimeProps,
} from "./format";
