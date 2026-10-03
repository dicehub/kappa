<script setup lang="ts">
import type { AttachmentContentSlots } from "./attachment";

defineOptions({ inheritAttrs: false });
defineSlots<AttachmentContentSlots>();
</script>

<template>
  <div v-bind="$attrs" class="kappa-attachment__content" data-slot="attachment-content">
    <slot />
  </div>
</template>
