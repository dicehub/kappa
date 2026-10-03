<script setup lang="ts">
import { RatingGroup as ArkRatingGroup } from "@ark-ui/vue/rating-group";
import type { RatingLabelProps, RatingLabelSlots } from "./rating";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<RatingLabelProps>(), {
  asChild: undefined,
});

defineSlots<RatingLabelSlots>();
</script>

<template>
  <ArkRatingGroup.Label
    v-bind="$attrs"
    class="kappa-rating__label"
    data-slot="rating-label"
    :as-child="props.asChild"
  >
    <slot />
  </ArkRatingGroup.Label>
</template>

<style src="./rating.css"></style>
