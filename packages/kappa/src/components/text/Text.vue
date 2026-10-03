<script setup lang="ts">
import { computed } from "vue";
import {
  TEXT_DEFAULT_VARIANTS,
  isCopyTextVariant,
  isDeprecatedHeadingTextVariant,
  resolveTextElement,
  resolveTextSize,
  resolveTextVariant,
  textVariants,
  type TextProps,
  type TextSlots,
} from "./text";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TextProps>(), {
  as: undefined,
  bold: false,
  size: TEXT_DEFAULT_VARIANTS.size,
  truncate: false,
  variant: TEXT_DEFAULT_VARIANTS.variant,
});

defineSlots<TextSlots>();

const resolvedVariant = computed(() => resolveTextVariant(props.variant));
const resolvedSize = computed(() => resolveTextSize(props.size));
const renderedElement = computed(() => resolveTextElement(props.as, resolvedVariant.value));
const textClasses = computed(() => [
  textVariants({ variant: resolvedVariant.value, size: resolvedSize.value }),
  isCopyTextVariant(resolvedVariant.value) && props.bold && "kappa-text--bold",
  props.truncate && "kappa-text--truncate",
]);

if (
  (import.meta as ImportMeta & { env?: { DEV?: boolean } }).env?.DEV &&
  isDeprecatedHeadingTextVariant(resolvedVariant.value)
) {
  console.warn(
    `[Kappa Text]: variant="${resolvedVariant.value}" is deprecated. Use variant="heading" and set size and as explicitly.`,
  );
}
</script>

<template>
  <component
    :is="renderedElement"
    v-bind="$attrs"
    :class="textClasses"
    data-slot="text"
    :data-variant="resolvedVariant"
    :data-size="resolvedSize"
    :data-bold="isCopyTextVariant(resolvedVariant) && props.bold ? '' : undefined"
    :data-truncate="props.truncate ? '' : undefined"
  >
    <slot />
  </component>
</template>

<style src="./text.css"></style>
