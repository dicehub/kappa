<script setup lang="ts">
import { TagsInput as ArkTagsInput } from "@ark-ui/vue/tags-input";
import type { TagInputItemInputProps, TagInputItemInputSlots } from "./tag-input";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<Pick<TagInputItemInputProps, "asChild">>(), {
  asChild: undefined,
});

defineSlots<TagInputItemInputSlots>();
</script>

<template>
  <ArkTagsInput.ItemInput
    v-bind="$attrs"
    class="kappa-tag-input__item-input"
    data-slot="tag-input-item-input"
    :as-child="props.asChild"
  >
    <slot />
  </ArkTagsInput.ItemInput>
</template>
