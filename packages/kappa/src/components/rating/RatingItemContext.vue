<script setup lang="ts">
import { RatingGroup as ArkRatingGroup } from "@ark-ui/vue/rating-group";
import type { RatingItemContextSlots } from "./rating";

defineSlots<RatingItemContextSlots>();
</script>

<template>
  <ArkRatingGroup.ItemContext v-slot="context">
    <slot v-bind="context" />
  </ArkRatingGroup.ItemContext>
</template>
