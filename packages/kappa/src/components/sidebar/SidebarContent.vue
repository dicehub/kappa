<script setup lang="ts">
import { ark } from "@ark-ui/vue/factory";
import type { SidebarPartProps, SidebarSlots } from "./sidebar";
defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<SidebarPartProps>(), { asChild: false });
defineSlots<SidebarSlots>();
</script>

<template>
  <ark.div tabindex="0" role="region" aria-label="Navigation items" v-bind="$attrs" :as-child="props.asChild" class="kappa-sidebar__content" data-slot="sidebar-content"><slot /></ark.div>
</template>

<style src="./sidebar.css"></style>
