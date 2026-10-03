<script setup lang="ts">
import { computed } from "vue";
import {
  SEPARATOR_DEFAULT_ORIENTATION,
  resolveSeparatorOrientation,
  type SeparatorProps,
} from "./separator";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<SeparatorProps>(), {
  decorative: true,
  orientation: SEPARATOR_DEFAULT_ORIENTATION,
});

const resolvedOrientation = computed(() =>
  resolveSeparatorOrientation(props.orientation),
);
</script>

<template>
  <hr
    v-bind="$attrs"
    class="kappa-separator"
    data-slot="separator"
    :data-orientation="resolvedOrientation"
    :role="props.decorative ? 'none' : 'separator'"
    :aria-hidden="props.decorative ? 'true' : undefined"
    :aria-orientation="props.decorative ? undefined : resolvedOrientation"
  />
</template>

<style src="./separator.css"></style>
