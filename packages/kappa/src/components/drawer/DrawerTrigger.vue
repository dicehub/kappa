<script setup lang="ts">
import { Drawer as ArkDrawer } from "@ark-ui/vue/drawer";
import type { DrawerTriggerProps, DrawerTriggerSlots } from "./drawer";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DrawerTriggerProps>(), {
  asChild: undefined,
  value: undefined,
});

defineSlots<DrawerTriggerSlots>();
</script>

<template>
  <ArkDrawer.Trigger
    v-bind="$attrs"
    class="kappa-drawer__trigger"
    data-slot="drawer-trigger"
    :as-child="props.asChild"
    :value="props.value"
  >
    <slot />
  </ArkDrawer.Trigger>
</template>

<style src="./drawer.css"></style>
