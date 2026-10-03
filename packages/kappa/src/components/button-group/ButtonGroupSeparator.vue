<script setup lang="ts">
import { computed } from "vue";
import {
  BUTTON_GROUP_SEPARATOR_DEFAULT_ORIENTATION,
  resolveButtonGroupSeparatorOrientation,
  type ButtonGroupSeparatorProps,
} from "./button-group";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ButtonGroupSeparatorProps>(), {
  orientation: BUTTON_GROUP_SEPARATOR_DEFAULT_ORIENTATION,
});

const resolvedOrientation = computed(() =>
  resolveButtonGroupSeparatorOrientation(props.orientation),
);
</script>

<template>
  <div
    v-bind="$attrs"
    class="kappa-button-group__separator"
    data-slot="button-group-separator"
    :data-orientation="resolvedOrientation"
    :aria-orientation="resolvedOrientation"
    role="separator"
  />
</template>
