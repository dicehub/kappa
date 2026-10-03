<script setup lang="ts">
import type { AttachmentGroupSlots } from "./attachment";

defineOptions({ inheritAttrs: false });
defineSlots<AttachmentGroupSlots>();
</script>

<template>
  <div v-bind="$attrs" class="kappa-attachment-group" data-slot="attachment-group">
    <slot />
  </div>
</template>
