<script setup lang="ts">
import { computed } from "vue";
import {
  ATTACHMENT_MEDIA_DEFAULT_VARIANT,
  resolveAttachmentMediaVariant,
  type AttachmentMediaProps,
  type AttachmentMediaSlots,
} from "./attachment";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<AttachmentMediaProps>(), {
  variant: ATTACHMENT_MEDIA_DEFAULT_VARIANT,
});

defineSlots<AttachmentMediaSlots>();

const resolvedVariant = computed(() => resolveAttachmentMediaVariant(props.variant));
</script>

<template>
  <div
    v-bind="$attrs"
    class="kappa-attachment__media"
    :class="`kappa-attachment__media--${resolvedVariant}`"
    data-slot="attachment-media"
    :data-variant="resolvedVariant"
  >
    <slot />
  </div>
</template>
