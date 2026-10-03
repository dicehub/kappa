<script setup lang="ts">
import { computed } from "vue";
import {
  ATTACHMENT_ACTION_DEFAULT_TYPE,
  resolveAttachmentButtonType,
  type AttachmentActionProps,
  type AttachmentActionSlots,
} from "./attachment";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<AttachmentActionProps>(), {
  disabled: false,
  type: ATTACHMENT_ACTION_DEFAULT_TYPE,
});

defineSlots<AttachmentActionSlots>();

const resolvedType = computed(() => resolveAttachmentButtonType(props.type));
</script>

<template>
  <button
    v-bind="$attrs"
    class="kappa-attachment__action"
    data-slot="attachment-action"
    :disabled="disabled"
    :type="resolvedType"
  >
    <slot />
  </button>
</template>
