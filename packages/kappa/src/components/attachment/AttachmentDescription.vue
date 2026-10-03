<script setup lang="ts">
import type { AttachmentDescriptionSlots } from "./attachment";

defineOptions({ inheritAttrs: false });
defineSlots<AttachmentDescriptionSlots>();
</script>

<template>
  <span
    v-bind="$attrs"
    class="kappa-attachment__description"
    data-slot="attachment-description"
  >
    <slot />
  </span>
</template>
