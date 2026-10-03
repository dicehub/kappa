<script setup lang="ts">
import type { KbdProps, KbdSlots } from "./kbd";

defineOptions({ inheritAttrs: false });

defineProps<KbdProps>();
defineSlots<KbdSlots>();
</script>

<template>
  <kbd v-bind="$attrs" class="kappa-kbd" data-slot="kbd">
    <slot />
  </kbd>
</template>

<style src="./kbd.css"></style>
