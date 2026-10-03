<script setup lang="ts">
import { computed } from "vue";
import { resolveSidebarLoadingRows, type SidebarLoadingProps } from "./sidebar";
defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<SidebarLoadingProps>(), { rows: 5, label: "Loading navigation" });
const rows = computed(() => resolveSidebarLoadingRows(props.rows));
</script>
<template>
  <div v-bind="$attrs" class="kappa-sidebar__loading" data-slot="sidebar-loading" role="status" :aria-label="props.label">
    <div v-for="row in rows" :key="row" class="kappa-sidebar__loading-row" aria-hidden="true">
      <span class="kappa-sidebar__loading-icon" /><span class="kappa-sidebar__loading-label" />
    </div>
  </div>
</template>

<style src="./sidebar.css"></style>
