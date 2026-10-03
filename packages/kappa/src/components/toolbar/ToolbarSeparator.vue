<script setup lang="ts">
import { computed } from "vue";
import { Separator } from "../separator";
import { useToolbarContext } from "./context";
import type { ToolbarSeparatorProps, ToolbarSeparatorSlots } from "./toolbar";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ToolbarSeparatorProps>(), {
  decorative: true,
  orientation: undefined,
});

defineSlots<ToolbarSeparatorSlots>();

const toolbar = useToolbarContext();
const resolvedOrientation = computed(
  () =>
    props.orientation ??
    (toolbar?.orientation.value === "vertical" ? "horizontal" : "vertical"),
);
</script>

<template>
  <Separator
    v-bind="$attrs"
    class="kappa-toolbar__separator"
    data-kappa-component="Toolbar.Separator"
    :decorative="props.decorative"
    :orientation="resolvedOrientation"
  />
</template>
