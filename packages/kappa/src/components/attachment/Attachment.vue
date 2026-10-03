<script setup lang="ts">
import { computed } from "vue";
import {
  ATTACHMENT_DEFAULT_ORIENTATION,
  ATTACHMENT_DEFAULT_SIZE,
  ATTACHMENT_DEFAULT_STATE,
  resolveAttachmentOrientation,
  resolveAttachmentSize,
  resolveAttachmentState,
  type AttachmentRootProps,
  type AttachmentRootSlots,
} from "./attachment";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<AttachmentRootProps>(), {
  orientation: ATTACHMENT_DEFAULT_ORIENTATION,
  size: ATTACHMENT_DEFAULT_SIZE,
  state: ATTACHMENT_DEFAULT_STATE,
});

defineSlots<AttachmentRootSlots>();

const resolvedOrientation = computed(() => resolveAttachmentOrientation(props.orientation));
const resolvedSize = computed(() => resolveAttachmentSize(props.size));
const resolvedState = computed(() => resolveAttachmentState(props.state));
</script>

<template>
  <div
    v-bind="$attrs"
    class="kappa-attachment"
    :class="[
      `kappa-attachment--${resolvedSize}`,
      `kappa-attachment--${resolvedOrientation}`,
    ]"
    data-slot="attachment"
    :data-orientation="resolvedOrientation"
    :data-size="resolvedSize"
    :data-state="resolvedState"
  >
    <slot />
  </div>
</template>

<style src="./attachment.css"></style>
