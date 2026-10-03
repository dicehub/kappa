<script setup lang="ts">
import { TagsInput as ArkTagsInput } from "@ark-ui/vue/tags-input";
import type { TagInputClearTriggerProps, TagInputClearTriggerSlots } from "./tag-input";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TagInputClearTriggerProps>(), {
  asChild: undefined,
});

defineSlots<TagInputClearTriggerSlots>();
</script>

<template>
  <ArkTagsInput.ClearTrigger
    v-bind="$attrs"
    class="kappa-tag-input__clear-trigger"
    data-slot="tag-input-clear-trigger"
    :as-child="props.asChild"
  >
    <slot>
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
        <path d="m4.5 4.5 7 7m0-7-7 7" />
      </svg>
    </slot>
  </ArkTagsInput.ClearTrigger>
</template>
