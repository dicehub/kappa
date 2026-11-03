<script setup lang="ts">
import { useSplitter } from "@ark-ui/vue/splitter";
import { computed } from "vue";

const props = defineProps<{
  frameId: string;
  primaryId: string;
  asideId: string;
  direction: "ltr" | "rtl";
  width: number;
  groupWidth: number;
  minWidth: number;
  maxWidth: number;
  label: string;
}>();
const emit = defineEmits<{ resize: [width: number]; reset: [] }>();
const asideIndex = computed(() => props.direction === "rtl" ? 0 : 1);
const handleId = computed(() => asideIndex.value ? "primary:aside" : "aside:primary");
// Use physical panel order in an LTR scope, as Sidebar does, so Ark's pointer and key directions agree.
const api = useSplitter(computed(() => {
  const percentage = props.groupWidth > 0 ? props.width / props.groupWidth * 100 : 50;
  const aside = { id: "aside", minSize: `${props.minWidth}px`, maxSize: `${props.maxWidth}px` };
  const primary = { id: "primary", minSize: 0 };
  return {
    id: `${props.frameId}-resize`,
    ids: { root: props.frameId, panel: (id: string | number) => id === "aside" ? props.asideId : props.primaryId },
    panels: asideIndex.value ? [primary, aside] : [aside, primary],
    size: asideIndex.value ? [100 - percentage, percentage] : [percentage, 100 - percentage],
    keyboardResizeBy: props.groupWidth > 0 ? 24 / props.groupWidth * 100 : 1,
    onResize: ({ size }: { size: number[] }) => {
      if (props.groupWidth > 0) emit("resize", size[asideIndex.value] / 100 * props.groupWidth);
    },
  };
}));
const handleProps = computed(() => api.value.getResizeTriggerProps({ id: handleId.value }));
</script>

<template>
  <div v-bind="handleProps" :dir="direction" class="kappa-app-shell__aside-resize" data-slot="app-shell-aside-resize"
    :aria-label="label" aria-orientation="vertical" :aria-controls="asideId"
    :aria-valuemin="minWidth" :aria-valuemax="maxWidth" :aria-valuenow="Math.round(width)"
    :aria-valuetext="`${Math.round(width)} pixels`" @dblclick.prevent="emit('reset')" />
</template>
