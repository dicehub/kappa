<script setup lang="ts">
import { TagsInput as ArkTagsInput } from "@ark-ui/vue/tags-input";
import type { TagInputControlProps, TagInputControlSlots } from "./tag-input";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TagInputControlProps>(), {
  asChild: undefined,
});

defineSlots<TagInputControlSlots>();
</script>

<template>
  <ArkTagsInput.Control
    v-bind="$attrs"
    class="kappa-tag-input__control"
    data-slot="tag-input-control"
    :as-child="props.asChild"
  >
    <slot />
  </ArkTagsInput.Control>
</template>
