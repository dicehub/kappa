<script setup lang="ts">
import type { KbdGroupProps, KbdGroupSlots } from "./kbd";

defineOptions({ inheritAttrs: false });

defineProps<KbdGroupProps>();
defineSlots<KbdGroupSlots>();
</script>

<template>
  <span v-bind="$attrs" class="kappa-kbd-group" data-slot="kbd-group">
    <slot />
  </span>
</template>

<style src="./kbd.css"></style>
