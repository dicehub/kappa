<script setup lang="ts">
import { Menu as ArkMenu } from "@ark-ui/vue/menu";
import type { DropdownTriggerProps, DropdownTriggerSlots } from "./dropdown";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DropdownTriggerProps>(), {
  asChild: undefined,
  value: undefined,
});

defineSlots<DropdownTriggerSlots>();
</script>

<template>
  <ArkMenu.Trigger
    v-bind="$attrs"
    class="kappa-dropdown__trigger"
    data-slot="dropdown-trigger"
    :as-child="props.asChild"
    :value="props.value"
  >
    <slot />
  </ArkMenu.Trigger>
</template>

<style src="./dropdown.css"></style>
