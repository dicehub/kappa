<script setup lang="ts">
import { Select as ArkSelect } from "@ark-ui/vue/select";
import type { SelectContentProps, SelectContentSlots } from "./select";

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<SelectContentProps>(), {
  asChild: undefined,
});

defineSlots<SelectContentSlots>();
</script>

<template>
  <ArkSelect.Content
    v-bind="$attrs"
    class="kappa-select__content"
    data-slot="select-content"
    :as-child="asChild"
  >
    <slot />
  </ArkSelect.Content>
</template>

<style src="./select.css"></style>
