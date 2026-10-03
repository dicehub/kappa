<script setup lang="ts">
import { ToggleGroup as ArkToggleGroup } from "@ark-ui/vue/toggle-group";
import type {
  ToggleGroupItemProps,
  ToggleGroupItemSlots,
} from "./toggle-group";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ToggleGroupItemProps>(), {
  asChild: undefined,
  disabled: undefined,
});

defineSlots<ToggleGroupItemSlots>();
</script>

<template>
  <ArkToggleGroup.Item
    v-bind="$attrs"
    class="kappa-toggle-group__item"
    data-slot="toggle-group-item"
    :as-child="props.asChild"
    :disabled="props.disabled"
    :value="props.value"
  >
    <slot />
  </ArkToggleGroup.Item>
</template>

<style src="./toggle-group.css"></style>
