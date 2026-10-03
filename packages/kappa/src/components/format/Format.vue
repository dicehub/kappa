<script setup lang="ts">
import { LocaleProvider } from "@ark-ui/vue/locale";
import { computed } from "vue";
import {
  FORMAT_DEFAULT_LOCALE,
  resolveFormatLocale,
  type FormatProps,
  type FormatSlots,
} from "./format";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<FormatProps>(), {
  locale: FORMAT_DEFAULT_LOCALE,
});

const locale = computed(() => resolveFormatLocale(props.locale));

defineSlots<FormatSlots>();
</script>

<template>
  <LocaleProvider :locale="locale">
    <slot />
  </LocaleProvider>
</template>
