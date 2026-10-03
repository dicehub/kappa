<script setup lang="ts">
import { TagsInput as ArkTagsInput } from "@ark-ui/vue/tags-input";
import type { TagInputInputProps, TagInputInputSlots } from "./tag-input";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<Pick<TagInputInputProps, "asChild">>(), {
  asChild: undefined,
});

defineSlots<TagInputInputSlots>();
</script>

<template>
  <ArkTagsInput.Input
    v-bind="$attrs"
    class="kappa-tag-input__input"
    data-slot="tag-input-input"
    :as-child="props.asChild"
  >
    <slot />
  </ArkTagsInput.Input>
</template>
