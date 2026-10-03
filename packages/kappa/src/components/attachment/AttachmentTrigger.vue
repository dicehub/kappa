<script setup lang="ts">
import { computed } from "vue";
import {
  ATTACHMENT_TRIGGER_DEFAULT_ELEMENT,
  ATTACHMENT_TRIGGER_DEFAULT_TYPE,
  resolveAttachmentButtonType,
  resolveAttachmentTriggerElement,
  type AttachmentTriggerProps,
  type AttachmentTriggerSlots,
} from "./attachment";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<AttachmentTriggerProps>(), {
  as: ATTACHMENT_TRIGGER_DEFAULT_ELEMENT,
  type: ATTACHMENT_TRIGGER_DEFAULT_TYPE,
});

defineSlots<AttachmentTriggerSlots>();

const resolvedElement = computed(() => resolveAttachmentTriggerElement(props.as));
const resolvedType = computed(() => resolveAttachmentButtonType(props.type));
</script>

<template>
  <component
    :is="resolvedElement"
    v-bind="$attrs"
    class="kappa-attachment__trigger"
    data-slot="attachment-trigger"
    :data-as="resolvedElement"
    :type="resolvedElement === 'button' ? resolvedType : undefined"
  >
    <span class="kappa-attachment__trigger-label"><slot /></span>
  </component>
</template>
