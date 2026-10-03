<script setup lang="ts">
import { computed, nextTick, provide, ref, watch } from "vue";
import type { SidebarSlidingViewsProps, SidebarSlots } from "./sidebar";
import { sidebarSlidingKey } from "./sidebar-sliding-context";

const props = withDefaults(defineProps<SidebarSlidingViewsProps>(), { direction: "left" });
defineSlots<SidebarSlots>();
const root = ref<HTMLElement>();
const lastFocus = new Map<string, HTMLElement>();
provide(sidebarSlidingKey, { activeKey: computed(() => props.activeKey), direction: computed(() => props.direction) });

watch(() => props.activeKey, async (key, previous) => {
  for (const [value, node] of lastFocus) if (!root.value?.contains(node)) lastFocus.delete(value);
  const active = root.value?.ownerDocument.activeElement;
  const previousView = active?.closest('[data-slot="sidebar-sliding-view"]');
  if (!(active instanceof HTMLElement) || previousView?.getAttribute("data-value") !== previous || previousView.closest('[data-slot="sidebar-sliding-views"]') !== root.value) return;
  lastFocus.set(previous, active);
  await nextTick();
  const view = Array.from(root.value?.querySelectorAll<HTMLElement>('[data-slot="sidebar-sliding-view"]') ?? [])
    .find(node => node.dataset.value === key && node.closest('[data-slot="sidebar-sliding-views"]') === root.value);
  if (!view) return;
  const saved = lastFocus.get(key);
  const target = saved?.isConnected && view.contains(saved) && saved.getClientRects().length && !saved.closest('[inert], [hidden], [disabled], [aria-disabled="true"]') ? saved : view;
  target.focus({ preventScroll: true });
});
</script>

<template>
  <div ref="root" class="kappa-sidebar__sliding-views" data-slot="sidebar-sliding-views" :data-direction="props.direction">
    <slot />
  </div>
</template>

<style src="./sidebar-sliding.css"></style>
