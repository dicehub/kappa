<script setup lang="ts">
import { Toast as ArkToast, useToastContext } from "@ark-ui/vue/toast";
import { computed, inject, onBeforeUnmount, watch, type CSSProperties } from "vue";
import type { ToastRootProps, ToastRootSlots } from "./toast";
import { toastLayoutKey } from "./toast-context";

defineOptions({ inheritAttrs: false });
const props = defineProps<ToastRootProps>();
defineSlots<ToastRootSlots>();
const toast = useToastContext();
const layout = inject(toastLayoutKey, undefined);
const metrics = computed(() => {
  const root = toast.value.getRootProps();
  const style = root.style as CSSProperties | undefined;
  return { id: String(root.id), index: Number(style?.["--index"] ?? 0), height: parseFloat(String(style?.["--initial-height"] ?? 0)) };
});
// Ark 5.39 records measurements in mount order, which reverses a synchronous
// burst. Use its measured heights in the actual primitive display order.
watch(metrics, value => { layout?.measurements.set(value.id, value); }, { immediate: true, flush: "sync" });
onBeforeUnmount(() => { layout?.measurements.delete(metrics.value.id); });
const limited = computed(() => metrics.value.index >= (layout?.limit.value ?? Infinity));
const geometry = computed<CSSProperties>(() => {
  if (!layout) return {};
  const measurements = [...layout.measurements.values()];
  const before = measurements.filter(value => value.index < metrics.value.index).reduce((sum, value) => sum + value.height, 0);
  return {
    "--kappa-toast-height-before": `${before}px`,
    "--kappa-toast-front-height": `${measurements.find(value => value.index === 0)?.height ?? metrics.value.height}px`,
  };
});
</script>

<template>
  <ArkToast.Root v-bind="limited ? { ...$attrs, inert: true, 'aria-hidden': true } : $attrs"
    class="kappa-toast" data-slot="toast" :as-child="props.asChild" :style="geometry" :data-limited="limited ? '' : undefined">
    <slot />
  </ArkToast.Root>
</template>

<style src="./toast.css"></style>
