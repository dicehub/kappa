<script setup lang="ts">
import { TagsInput as ArkTagsInput } from "@ark-ui/vue/tags-input";
import type { TagInputItemPreviewProps, TagInputItemPreviewSlots } from "./tag-input";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TagInputItemPreviewProps>(), {
  asChild: undefined,
});

defineSlots<TagInputItemPreviewSlots>();
</script>

<template>
  <ArkTagsInput.ItemPreview
    v-bind="$attrs"
    class="kappa-tag-input__item-preview"
    data-slot="tag-input-item-preview"
    :as-child="props.asChild"
  >
    <slot />
  </ArkTagsInput.ItemPreview>
</template>
