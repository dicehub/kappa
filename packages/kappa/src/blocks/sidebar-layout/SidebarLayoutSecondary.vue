<script setup lang="ts">
import { nextTick, ref, watch } from "vue";
import { Sidebar, useSidebarContext } from "../../components/sidebar";

defineProps<{ label: string }>();
const sidebar = useSidebarContext();
const content = ref<{ $el: HTMLElement }>();
watch(sidebar.iconCollapsed, async (hidden) => {
  const element = content.value?.$el;
  if (!hidden || !element?.contains(document.activeElement)) return;
  const toggle = element.closest(".kappa-sidebar-layout")?.querySelector<HTMLElement>('.kappa-sidebar-layout__toolbar [data-slot="sidebar-trigger"]');
  await nextTick();
  toggle?.focus({ preventScroll: true });
});
</script>

<template>
  <Sidebar.Content ref="content" :aria-label="label" class="kappa-sidebar-layout__secondary" :hidden="sidebar.iconCollapsed.value" :inert="sidebar.iconCollapsed.value || undefined"><slot /></Sidebar.Content>
</template>
