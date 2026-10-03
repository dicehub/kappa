<script setup lang="ts">
import { Drawer as ArkDrawer } from "@ark-ui/vue/drawer";
import type { DrawerStackSlots } from "./drawer";

defineSlots<DrawerStackSlots>();
</script>

<template>
  <ArkDrawer.Stack><slot /></ArkDrawer.Stack>
</template>
