import { DEFAULT_LOCALE, useLocaleContext } from "@ark-ui/vue/locale";
import { computed, type ComputedRef, type VNodeChild } from "vue";

export const DIRECTION_PROVIDER_DEFAULT_LOCALE = "en-US";

export type Direction = "ltr" | "rtl";

export interface DirectionProviderProps {
  /** BCP 47 locale from which Ark UI derives text direction and locale behavior. */
  locale?: string;
}

export interface DirectionProviderSlots {
  /** Application or region content that receives the Ark UI locale context. */
  default?: () => VNodeChild;
}

/** Reads the direction supplied by the nearest DirectionProvider. */
export const useDirection = (): ComputedRef<Direction> => {
  const localeContext = useLocaleContext(DEFAULT_LOCALE);

  return computed(() => localeContext.value.dir);
};
