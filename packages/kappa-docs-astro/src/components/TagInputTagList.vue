<script setup lang="ts">
import { TagInput } from "@dicehub/kappa/components/tag-input";
</script>

<template>
  <TagInput.Context v-slot="{ value }">
    <TagInput.Item
      v-for="(tag, index) in value"
      :key="`${tag}-${index}`"
      :index="index"
      :value="tag"
    >
      <TagInput.ItemPreview>
        <TagInput.ItemText>{{ tag }}</TagInput.ItemText>
        <TagInput.ItemDeleteTrigger />
      </TagInput.ItemPreview>
      <TagInput.ItemInput />
    </TagInput.Item>
  </TagInput.Context>
</template>
