<script setup lang="ts">
import type { AttachmentActionsSlots } from "./attachment";

defineOptions({ inheritAttrs: false });
defineSlots<AttachmentActionsSlots>();
</script>

<template>
  <div v-bind="$attrs" class="kappa-attachment__actions" data-slot="attachment-actions">
    <slot />
  </div>
</template>
