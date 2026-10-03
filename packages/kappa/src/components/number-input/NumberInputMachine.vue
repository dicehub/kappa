<script setup lang="ts">
import { useNumberInput, type UseNumberInputProps } from "@ark-ui/vue/number-input";
import { computed } from "vue";
import NumberInputRootProvider from "./NumberInputRootProvider.vue";
import type { NumberInputSize } from "./number-input";

defineOptions({ inheritAttrs: false });

const props = defineProps<{
  allowMouseWheel?: boolean;
  asChild?: boolean;
  machineProps: UseNumberInputProps;
  size?: NumberInputSize;
}>();

const numberInput = useNumberInput(computed(() => props.machineProps));
</script>

<template>
  <NumberInputRootProvider
    v-bind="$attrs"
    :allow-mouse-wheel="props.allowMouseWheel"
    :as-child="props.asChild"
    :size="props.size"
    :value="numberInput"
  >
    <slot />
  </NumberInputRootProvider>
</template>
