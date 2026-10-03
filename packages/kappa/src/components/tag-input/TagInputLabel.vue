<script setup lang="ts">
import { TagsInput as ArkTagsInput } from "@ark-ui/vue/tags-input";
import type { TagInputLabelProps, TagInputLabelSlots } from "./tag-input";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TagInputLabelProps>(), {
  asChild: undefined,
});

defineSlots<TagInputLabelSlots>();
</script>

<template>
  <ArkTagsInput.Label
    v-bind="$attrs"
    class="kappa-tag-input__label"
    data-slot="tag-input-label"
    :as-child="props.asChild"
  >
    <slot />
  </ArkTagsInput.Label>
</template>
