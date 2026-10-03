<script setup lang="ts">
import { TagsInput as ArkTagsInput } from "@ark-ui/vue/tags-input";
import type { TagInputItemTextProps, TagInputItemTextSlots } from "./tag-input";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TagInputItemTextProps>(), {
  asChild: undefined,
});

defineSlots<TagInputItemTextSlots>();
</script>

<template>
  <ArkTagsInput.ItemText
    v-bind="$attrs"
    class="kappa-tag-input__item-text"
    data-slot="tag-input-item-text"
    :as-child="props.asChild"
  >
    <slot />
  </ArkTagsInput.ItemText>
</template>
