<script setup lang="ts">
import { TagsInput as ArkTagsInput } from "@ark-ui/vue/tags-input";
import type { TagInputContextSlots } from "./tag-input";

defineSlots<TagInputContextSlots>();
</script>

<template>
  <ArkTagsInput.Context v-slot="context">
    <slot v-bind="context" />
  </ArkTagsInput.Context>
</template>
