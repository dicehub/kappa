<script setup lang="ts">
import type { AttachmentTitleSlots } from "./attachment";

defineOptions({ inheritAttrs: false });
defineSlots<AttachmentTitleSlots>();
</script>

<template>
  <span v-bind="$attrs" class="kappa-attachment__title" data-slot="attachment-title">
    <slot />
  </span>
</template>
