<script setup lang="ts">
import { Drawer as ArkDrawer } from "@ark-ui/vue/drawer";
import type { DrawerContextSlots } from "./drawer";

defineSlots<DrawerContextSlots>();
</script>

<template>
  <ArkDrawer.Context v-slot="context"><slot v-bind="context" /></ArkDrawer.Context>
</template>
