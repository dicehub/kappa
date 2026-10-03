<script setup lang="ts">
import { computed } from "vue";
import {
  BUTTON_GROUP_DEFAULT_ORIENTATION,
  resolveButtonGroupOrientation,
  type ButtonGroupRootProps,
  type ButtonGroupRootSlots,
} from "./button-group";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ButtonGroupRootProps>(), {
  orientation: BUTTON_GROUP_DEFAULT_ORIENTATION,
});

defineSlots<ButtonGroupRootSlots>();

const resolvedOrientation = computed(() =>
  resolveButtonGroupOrientation(props.orientation),
);
</script>

<template>
  <div
    v-bind="$attrs"
    class="kappa-button-group"
    data-slot="button-group"
    :data-orientation="resolvedOrientation"
    role="group"
  >
    <slot />
  </div>
</template>

<style src="./button-group.css"></style>
