<script setup lang="ts">
import { TagsInput as ArkTagsInput } from "@ark-ui/vue/tags-input";
import type { TagInputItemProps, TagInputItemSlots } from "./tag-input";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TagInputItemProps>(), {
  asChild: undefined,
  disabled: undefined,
});

defineSlots<TagInputItemSlots>();
</script>

<template>
  <ArkTagsInput.Item
    v-bind="$attrs"
    class="kappa-tag-input__item"
    data-slot="tag-input-item"
    :as-child="props.asChild"
    :disabled="props.disabled"
    :index="props.index"
    :value="props.value"
  >
    <slot />
  </ArkTagsInput.Item>
</template>
