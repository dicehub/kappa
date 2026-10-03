<script setup lang="ts">
import { RatingGroup as ArkRatingGroup } from "@ark-ui/vue/rating-group";
import { computed } from "vue";
import {
  RATING_DEFAULT_SIZE,
  resolveRatingSize,
  type RatingRootProviderProps,
  type RatingRootProviderSlots,
} from "./rating";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<RatingRootProviderProps>(), {
  asChild: undefined,
  invalid: undefined,
  size: RATING_DEFAULT_SIZE,
});

defineSlots<RatingRootProviderSlots>();

const resolvedSize = computed(() => resolveRatingSize(props.size));
</script>

<template>
  <ArkRatingGroup.RootProvider
    v-bind="$attrs"
    class="kappa-rating"
    data-slot="rating"
    :aria-invalid="props.invalid || undefined"
    :data-invalid="props.invalid ? '' : undefined"
    :data-size="resolvedSize"
    :as-child="props.asChild"
    :value="props.value"
  >
    <slot />
    <ArkRatingGroup.HiddenInput :aria-invalid="props.invalid || undefined" />
  </ArkRatingGroup.RootProvider>
</template>

<style src="./rating.css"></style>
