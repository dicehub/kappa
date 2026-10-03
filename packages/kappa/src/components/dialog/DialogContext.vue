<script setup lang="ts">
import { Dialog as ArkDialog } from "@ark-ui/vue/dialog";
import type { DialogContextSlots } from "./dialog";

defineSlots<DialogContextSlots>();
</script>

<template>
  <ArkDialog.Context v-slot="context">
    <slot v-bind="context" />
  </ArkDialog.Context>
</template>
