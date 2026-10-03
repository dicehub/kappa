<script setup lang="ts">
import { computed, useAttrs } from "vue";
import {
  LABEL_DEFAULT_ELEMENT,
  LABEL_DEFAULT_OPTIONAL_TEXT,
  resolveLabelElement,
  resolveLabelOptionalText,
  type LabelProps,
  type LabelSlots,
} from "./label";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<LabelProps>(), {
  as: LABEL_DEFAULT_ELEMENT,
  asContent: false,
  htmlFor: undefined,
  optionalText: LABEL_DEFAULT_OPTIONAL_TEXT,
  showOptional: false,
});

defineSlots<LabelSlots>();

const attrs = useAttrs();
const resolvedElement = computed(() => resolveLabelElement(props.as, props.asContent));
const resolvedOptionalText = computed(() => resolveLabelOptionalText(props.optionalText));
const resolvedFor = computed(() => {
  if (resolvedElement.value !== "label") return undefined;
  if (props.htmlFor !== undefined) return props.htmlFor;
  return typeof attrs.for === "string" ? attrs.for : undefined;
});
const forwardedAttrs = computed(() => {
  const { for: _for, ...rest } = attrs;
  return rest;
});
</script>

<template>
  <component
    :is="resolvedElement"
    v-bind="forwardedAttrs"
    class="kappa-label"
    data-slot="label"
    :data-content="props.asContent ? '' : undefined"
    :for="resolvedFor"
  >
    <slot />
    <span v-if="props.showOptional" class="kappa-label__optional" data-slot="label-optional">
      ({{ resolvedOptionalText }})
    </span>
  </component>
</template>

<style src="./label.css"></style>
