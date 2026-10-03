<script setup lang="ts">
import type { DropdownSlots } from "./dropdown";

defineOptions({ inheritAttrs: false });
defineSlots<DropdownSlots>();
</script>

<template>
  <span v-bind="$attrs" class="kappa-dropdown__shortcut" data-slot="dropdown-shortcut">
    <slot />
  </span>
</template>

<style src="./dropdown.css"></style>
