<script setup lang="ts">
import { RatingGroup as ArkRatingGroup } from "@ark-ui/vue/rating-group";
import type { RatingContextSlots } from "./rating";

defineSlots<RatingContextSlots>();
</script>

<template>
  <ArkRatingGroup.Context v-slot="context">
    <slot v-bind="context" />
  </ArkRatingGroup.Context>
</template>
