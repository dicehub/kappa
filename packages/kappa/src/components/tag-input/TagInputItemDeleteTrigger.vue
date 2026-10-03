<script setup lang="ts">
import { TagsInput as ArkTagsInput } from "@ark-ui/vue/tags-input";
import type {
  TagInputItemDeleteTriggerProps,
  TagInputItemDeleteTriggerSlots,
} from "./tag-input";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TagInputItemDeleteTriggerProps>(), {
  asChild: undefined,
});

defineSlots<TagInputItemDeleteTriggerSlots>();
</script>

<template>
  <ArkTagsInput.ItemDeleteTrigger
    v-bind="$attrs"
    class="kappa-tag-input__item-delete-trigger"
    data-slot="tag-input-item-delete-trigger"
    :as-child="props.asChild"
  >
    <slot>
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
        <path d="m4.5 4.5 7 7m0-7-7 7" />
      </svg>
    </slot>
  </ArkTagsInput.ItemDeleteTrigger>
</template>
