<script setup lang="ts">
import { computed } from "vue";
import type { SidebarSlidingViewProps, SidebarSlots } from "./sidebar";
import { useSidebarSlidingContext } from "./sidebar-sliding-context";

const props = defineProps<SidebarSlidingViewProps>();
defineSlots<SidebarSlots>();
const views = useSidebarSlidingContext();
const active = computed(() => views.activeKey.value === props.value);
</script>

<template>
  <Transition :name="`kappa-sidebar-slide-${views.direction.value}`">
    <div
      v-show="active"
      class="kappa-sidebar__sliding-view"
      data-slot="sidebar-sliding-view"
      :data-value="props.value"
      :data-state="active ? 'active' : 'inactive'"
      role="group"
      :aria-label="props.label ?? props.value"
      tabindex="-1"
      :aria-hidden="!active || undefined"
      :inert="!active || undefined"
    ><slot /></div>
  </Transition>
</template>

<style src="./sidebar-sliding.css"></style>
