<script setup lang="ts">
import { RadioGroup as ArkRadioGroup } from "@ark-ui/vue/radio-group";
import type { RadioItemTextProps, RadioItemTextSlots } from "./radio";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<RadioItemTextProps>(), {
  asChild: undefined,
});

defineSlots<RadioItemTextSlots>();
</script>

<template>
  <ArkRadioGroup.ItemText
    v-bind="$attrs"
    class="kappa-radio__item-text"
    data-slot="radio-item-text"
    :as-child="props.asChild"
  >
    <slot />
  </ArkRadioGroup.ItemText>
</template>

<style src="./radio.css"></style>
