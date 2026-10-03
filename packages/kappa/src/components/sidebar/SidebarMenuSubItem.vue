<script setup lang="ts">
import { ark } from "@ark-ui/vue/factory";
import type { SidebarPartProps, SidebarSlots } from "./sidebar";
defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<SidebarPartProps>(), { asChild: false });
defineSlots<SidebarSlots>();
</script>

<template>
  <ark.li v-bind="$attrs" :as-child="props.asChild" class="kappa-sidebar__menu-sub-item" data-slot="sidebar-menu-sub-item"><slot /></ark.li>
</template>

<style src="./sidebar.css"></style>
