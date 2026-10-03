<script setup lang="ts">
import { Format as ArkFormat } from "@ark-ui/vue/format";
import { LocaleProvider } from "@ark-ui/vue/locale";
import { computed } from "vue";
import {
  resolveFormatLocale,
  resolveFormatRelativeTimeStyle,
  type FormatRelativeTimeProps,
} from "./format";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<FormatRelativeTimeProps>(), {
  locale: undefined,
  localeMatcher: undefined,
  numeric: undefined,
  style: undefined,
});

const locale = computed(() => resolveFormatLocale(props.locale));
const resolvedStyle = computed(() => resolveFormatRelativeTimeStyle(props.style));
</script>

<template>
  <span
    v-bind="$attrs"
    class="kappa-format kappa-format--relative-time"
    data-format="relative-time"
    data-slot="format-relative-time"
  >
    <LocaleProvider v-if="props.locale !== undefined" :locale="locale">
      <ArkFormat.RelativeTime
        :locale-matcher="props.localeMatcher"
        :numeric="props.numeric"
        :style="resolvedStyle"
        :value="props.value"
      />
    </LocaleProvider>
    <ArkFormat.RelativeTime
      v-else
      :locale-matcher="props.localeMatcher"
      :numeric="props.numeric"
      :style="resolvedStyle"
      :value="props.value"
    />
  </span>
</template>

<style src="./format.css"></style>
