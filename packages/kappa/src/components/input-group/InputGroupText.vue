<script setup lang="ts">
import type { InputGroupTextProps, InputGroupTextSlots } from "./input-group";

defineOptions({ inheritAttrs: false });

defineProps<InputGroupTextProps>();
defineSlots<InputGroupTextSlots>();
</script>

<template>
  <span v-bind="$attrs" class="kappa-input-group__text" data-slot="input-group-text">
    <slot />
  </span>
</template>
