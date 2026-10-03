<script setup lang="ts">
import { ark } from "@ark-ui/vue/factory";
import type { ButtonGroupTextProps, ButtonGroupTextSlots } from "./button-group";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ButtonGroupTextProps>(), {
  asChild: false,
});

defineSlots<ButtonGroupTextSlots>();
</script>

<template>
  <ark.div
    v-bind="$attrs"
    :as-child="props.asChild"
    class="kappa-button-group__text"
    data-slot="button-group-text"
  >
    <slot />
  </ark.div>
</template>
