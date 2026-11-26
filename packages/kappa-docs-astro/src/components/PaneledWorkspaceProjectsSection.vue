<script setup lang="ts">
import { Sidebar } from "@dicehub/kappa/components/sidebar";
import { ChevronRight } from "@lucide/vue";

defineProps<{ enabled: boolean }>();
const open = defineModel<boolean>("open", { required: true });
</script>

<template>
  <Sidebar.Collapsible v-if="enabled" v-model:open="open" class="paneled-projects-section">
    <Sidebar.CollapsibleTrigger class="paneled-projects-section__trigger" aria-label="Projects section">
      <span>Projects</span><ChevronRight aria-hidden="true" />
    </Sidebar.CollapsibleTrigger>
    <Sidebar.CollapsibleContent class="paneled-projects-section__content">
      <slot />
    </Sidebar.CollapsibleContent>
  </Sidebar.Collapsible>
  <slot v-else />
</template>

<style src="./paneled-workspace-projects-section.css"></style>
