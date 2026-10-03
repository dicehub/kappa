<script setup lang="ts">
import { RatingGroup as ArkRatingGroup } from "@ark-ui/vue/rating-group";
import type { RatingItemProps, RatingItemSlots } from "./rating";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<RatingItemProps>(), {
  asChild: undefined,
});

defineSlots<RatingItemSlots>();
</script>

<template>
  <ArkRatingGroup.Item
    v-bind="$attrs"
    class="kappa-rating__item"
    data-slot="rating-item"
    :as-child="props.asChild"
    :index="props.index"
  >
    <ArkRatingGroup.ItemContext v-slot="context">
      <slot v-bind="context">
        <svg
          class="kappa-rating__icon"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          focusable="false"
        >
          <path
            class="kappa-rating__icon-outline"
            d="m12 2.75 2.78 5.63 6.22.9-4.5 4.39 1.06 6.2L12 16.94l-5.56 2.93 1.06-6.2L3 9.28l6.22-.9L12 2.75Z"
          />
          <path
            class="kappa-rating__icon-fill"
            d="m12 2.75 2.78 5.63 6.22.9-4.5 4.39 1.06 6.2L12 16.94l-5.56 2.93 1.06-6.2L3 9.28l6.22-.9L12 2.75Z"
          />
        </svg>
      </slot>
    </ArkRatingGroup.ItemContext>
  </ArkRatingGroup.Item>
</template>

<style src="./rating.css"></style>
