<script setup lang="ts">
import { ClientOnly as ArkClientOnly } from "@ark-ui/vue/client-only";
import type { ClientOnlyProps, ClientOnlySlots } from "./client-only";

defineOptions({ inheritAttrs: false });

defineProps<ClientOnlyProps>();
defineSlots<ClientOnlySlots>();
</script>

<template>
  <ArkClientOnly>
    <template #fallback>
      <slot name="fallback" />
    </template>
    <slot />
  </ArkClientOnly>
</template>
