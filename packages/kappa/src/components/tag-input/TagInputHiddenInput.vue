<script setup lang="ts">
import { TagsInput as ArkTagsInput } from "@ark-ui/vue/tags-input";
import type { TagInputHiddenInputProps, TagInputHiddenInputSlots } from "./tag-input";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<Pick<TagInputHiddenInputProps, "asChild">>(), {
  asChild: undefined,
});

defineSlots<TagInputHiddenInputSlots>();
</script>

<template>
  <ArkTagsInput.HiddenInput
    v-bind="$attrs"
    class="kappa-tag-input__hidden-input"
    data-slot="tag-input-hidden-input"
    :as-child="props.asChild"
  >
    <slot />
  </ArkTagsInput.HiddenInput>
</template>
