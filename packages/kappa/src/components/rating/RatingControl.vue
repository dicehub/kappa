<script setup lang="ts">
import { RatingGroup as ArkRatingGroup } from "@ark-ui/vue/rating-group";
import RatingItem from "./RatingItem.vue";
import type { RatingControlProps, RatingControlSlots } from "./rating";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<RatingControlProps>(), {
  asChild: undefined,
});

defineSlots<RatingControlSlots>();
</script>

<template>
  <ArkRatingGroup.Context v-slot="context">
    <ArkRatingGroup.Control
      v-bind="$attrs"
      class="kappa-rating__control"
      data-slot="rating-control"
      :as-child="props.asChild"
    >
      <slot v-bind="context">
        <RatingItem v-for="item in context.items" :key="item" :index="item" />
      </slot>
    </ArkRatingGroup.Control>
  </ArkRatingGroup.Context>
</template>

<style src="./rating.css"></style>
