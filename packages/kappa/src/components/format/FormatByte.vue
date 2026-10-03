<script setup lang="ts">
import { Format as ArkFormat } from "@ark-ui/vue/format";
import { LocaleProvider } from "@ark-ui/vue/locale";
import { computed } from "vue";
import { resolveFormatLocale, type FormatByteProps } from "./format";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<FormatByteProps>(), {
  locale: undefined,
  unit: undefined,
  unitDisplay: undefined,
  unitSystem: undefined,
});

const locale = computed(() => resolveFormatLocale(props.locale));
</script>

<template>
  <span
    v-bind="$attrs"
    class="kappa-format kappa-format--byte"
    data-format="byte"
    data-slot="format-byte"
  >
    <LocaleProvider v-if="props.locale !== undefined" :locale="locale">
      <ArkFormat.Byte
        :unit="props.unit"
        :unit-display="props.unitDisplay"
        :unit-system="props.unitSystem"
        :value="props.value"
      />
    </LocaleProvider>
    <ArkFormat.Byte
      v-else
      :unit="props.unit"
      :unit-display="props.unitDisplay"
      :unit-system="props.unitSystem"
      :value="props.value"
    />
  </span>
</template>

<style src="./format.css"></style>
