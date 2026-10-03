<script setup lang="ts">
import { Format as ArkFormat } from "@ark-ui/vue/format";
import { LocaleProvider } from "@ark-ui/vue/locale";
import { computed } from "vue";
import { resolveFormatLocale, type FormatNumberProps } from "./format";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<FormatNumberProps>(), {
  compactDisplay: undefined,
  currencyDisplay: undefined,
  currencySign: undefined,
  locale: undefined,
  notation: undefined,
  signDisplay: undefined,
  unit: undefined,
  unitDisplay: undefined,
});

const locale = computed(() => resolveFormatLocale(props.locale));
</script>

<template>
  <span
    v-bind="$attrs"
    class="kappa-format kappa-format--number"
    data-format="number"
    data-slot="format-number"
  >
    <LocaleProvider v-if="props.locale !== undefined" :locale="locale">
      <ArkFormat.Number
        :compact-display="props.compactDisplay"
        :currency-display="props.currencyDisplay"
        :currency-sign="props.currencySign"
        :notation="props.notation"
        :sign-display="props.signDisplay"
        :unit="props.unit"
        :unit-display="props.unitDisplay"
        :value="props.value"
      />
    </LocaleProvider>
    <ArkFormat.Number
      v-else
      :compact-display="props.compactDisplay"
      :currency-display="props.currencyDisplay"
      :currency-sign="props.currencySign"
      :notation="props.notation"
      :sign-display="props.signDisplay"
      :unit="props.unit"
      :unit-display="props.unitDisplay"
      :value="props.value"
    />
  </span>
</template>

<style src="./format.css"></style>
