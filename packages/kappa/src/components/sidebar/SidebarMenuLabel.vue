<script setup lang="ts">
import { ark } from "@ark-ui/vue/factory";
import type { SidebarPartProps, SidebarSlots } from "./sidebar";
defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<SidebarPartProps>(), { asChild: false });
defineSlots<SidebarSlots>();
</script>

<template>
  <ark.span v-bind="$attrs" :as-child="props.asChild" class="kappa-sidebar__menu-label" data-slot="sidebar-menu-label"><slot /></ark.span>
</template>

<style src="./sidebar.css"></style>
