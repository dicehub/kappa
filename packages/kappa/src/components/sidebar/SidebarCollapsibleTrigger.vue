<script setup lang="ts">
import { Collapsible as ArkCollapsible } from "@ark-ui/vue/collapsible";
import type { SidebarCollapsibleTriggerProps, SidebarSlots } from "./sidebar";
defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<SidebarCollapsibleTriggerProps>(), { asChild: false });
defineSlots<SidebarSlots>();
</script>
<template>
  <ArkCollapsible.Trigger v-bind="$attrs" :as-child="props.asChild" class="kappa-sidebar__menu-button" data-slot="sidebar-collapsible-trigger"><slot /></ArkCollapsible.Trigger>
</template>

<style src="./sidebar.css"></style>
