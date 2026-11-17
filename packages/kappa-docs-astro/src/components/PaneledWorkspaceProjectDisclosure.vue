<script setup lang="ts">
import type { Component } from "vue";
import { Sidebar } from "@dicehub/kappa/components/sidebar";
import { ChevronRight } from "@lucide/vue";

defineProps<{ icon: Component; expanded: boolean }>();
</script>

<template>
  <Sidebar.CollapsibleTrigger class="paneled-project-disclosure" :aria-label="expanded ? 'Collapse projects' : 'Expand projects'">
    <component :is="icon" class="paneled-project-disclosure__icon" aria-hidden="true" />
    <ChevronRight class="paneled-project-disclosure__chevron" aria-hidden="true" />
  </Sidebar.CollapsibleTrigger>
</template>

<style src="./paneled-workspace-project-disclosure.css"></style>
