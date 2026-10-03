<script setup lang="ts">
import { reactive, type VNodeChild } from "vue";
import { useSidebarContext, type SidebarContextValue } from "./sidebar-context";
defineSlots<{ default?: (context: SidebarContextValue) => VNodeChild }>();
const context = reactive(useSidebarContext());
</script>
<template><slot v-bind="context" /></template>
