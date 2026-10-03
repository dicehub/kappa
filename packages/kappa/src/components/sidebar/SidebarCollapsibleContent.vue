<script setup lang="ts">
import { Collapsible as ArkCollapsible } from "@ark-ui/vue/collapsible";
import type { SidebarCollapsibleContentProps, SidebarSlots } from "./sidebar";
defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<SidebarCollapsibleContentProps>(), { asChild: false });
defineSlots<SidebarSlots>();
</script>
<template>
  <ArkCollapsible.Content v-bind="$attrs" :as-child="props.asChild" class="kappa-sidebar__collapsible-content" data-slot="sidebar-collapsible-content"><slot /></ArkCollapsible.Content>
</template>

<style src="./sidebar.css"></style>
