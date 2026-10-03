<script setup lang="ts">
import { Format as ArkFormat } from "@ark-ui/vue/format";
import { LocaleProvider } from "@ark-ui/vue/locale";
import { computed } from "vue";
import { resolveFormatLocale, type FormatTimeProps } from "./format";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<FormatTimeProps>(), {
  amLabel: undefined,
  format: undefined,
  locale: undefined,
  pmLabel: undefined,
  withSeconds: false,
});

const locale = computed(() => resolveFormatLocale(props.locale));
</script>

<template>
  <span
    class="kappa-format kappa-format--time"
    data-format="time"
    data-slot="format-time"
    v-bind="$attrs"
  >
    <LocaleProvider v-if="props.locale !== undefined" :locale="locale">
      <ArkFormat.Time
        :am-label="props.amLabel"
        :format="props.format"
        :pm-label="props.pmLabel"
        :value="props.value"
        :with-seconds="props.withSeconds"
      />
    </LocaleProvider>
    <ArkFormat.Time
      v-else
      :am-label="props.amLabel"
      :format="props.format"
      :pm-label="props.pmLabel"
      :value="props.value"
      :with-seconds="props.withSeconds"
    />
  </span>
</template>

<style src="./format.css"></style>
