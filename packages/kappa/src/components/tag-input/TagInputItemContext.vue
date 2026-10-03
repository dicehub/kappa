<script setup lang="ts">
import { TagsInput as ArkTagsInput } from "@ark-ui/vue/tags-input";
import type { TagInputItemContextSlots } from "./tag-input";

defineSlots<TagInputItemContextSlots>();
</script>

<template>
  <ArkTagsInput.ItemContext v-slot="context">
    <slot v-bind="context" />
  </ArkTagsInput.ItemContext>
</template>
