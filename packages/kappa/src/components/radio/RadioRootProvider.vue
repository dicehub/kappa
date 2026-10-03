<script setup lang="ts">
import { RadioGroup as ArkRadioGroup } from "@ark-ui/vue/radio-group";
import type { RadioRootProviderProps, RadioRootProviderSlots } from "./radio";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<RadioRootProviderProps>(), {
  asChild: undefined,
});

defineSlots<RadioRootProviderSlots>();
</script>

<template>
  <ArkRadioGroup.RootProvider
    v-bind="$attrs"
    class="kappa-radio"
    data-slot="radio"
    :as-child="props.asChild"
    :value="props.value"
  >
    <slot />
  </ArkRadioGroup.RootProvider>
</template>

<style src="./radio.css"></style>
