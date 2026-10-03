<script setup lang="ts">
import { LocaleProvider } from "@ark-ui/vue/locale";
import {
  DIRECTION_PROVIDER_DEFAULT_LOCALE,
  type DirectionProviderProps,
  type DirectionProviderSlots,
} from "./direction-provider";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DirectionProviderProps>(), {
  locale: DIRECTION_PROVIDER_DEFAULT_LOCALE,
});

defineSlots<DirectionProviderSlots>();
</script>

<template>
  <LocaleProvider :locale="props.locale">
    <slot />
  </LocaleProvider>
</template>
