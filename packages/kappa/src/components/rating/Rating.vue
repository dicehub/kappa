<script setup lang="ts">
import { LocaleProvider, DEFAULT_LOCALE, useLocaleContext } from "@ark-ui/vue/locale";
import { RatingGroup as ArkRatingGroup } from "@ark-ui/vue/rating-group";
import { computed } from "vue";
import {
  RATING_DEFAULT_SIZE,
  resolveRatingSize,
  type RatingEmits,
  type RatingProps,
  type RatingSlots,
} from "./rating";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<RatingProps>(), {
  allowHalf: undefined,
  asChild: undefined,
  autoFocus: undefined,
  count: undefined,
  defaultValue: undefined,
  disabled: undefined,
  dir: undefined,
  form: undefined,
  id: undefined,
  ids: undefined,
  invalid: undefined,
  modelValue: undefined,
  name: undefined,
  readOnly: undefined,
  required: undefined,
  size: RATING_DEFAULT_SIZE,
  translations: undefined,
});

const emit = defineEmits<RatingEmits>();
defineSlots<RatingSlots>();

const inheritedLocale = useLocaleContext(DEFAULT_LOCALE);
const locale = computed(() => {
  if (props.dir === undefined) return inheritedLocale.value.locale;
  return props.dir === "rtl" ? "ar" : "en-US";
});
const resolvedSize = computed(() => resolveRatingSize(props.size));
</script>

<template>
  <LocaleProvider :locale="locale">
    <ArkRatingGroup.Root
      v-bind="$attrs"
      class="kappa-rating"
      data-slot="rating"
      :aria-invalid="props.invalid || undefined"
      :data-disabled="props.disabled ? '' : undefined"
      :data-invalid="props.invalid ? '' : undefined"
      :data-readonly="props.readOnly ? '' : undefined"
      :data-size="resolvedSize"
      :allow-half="props.allowHalf"
      :as-child="props.asChild"
      :auto-focus="props.autoFocus"
      :count="props.count"
      :default-value="props.defaultValue"
      :disabled="props.disabled"
      :form="props.form"
      :id="props.id"
      :ids="props.ids"
      :model-value="props.modelValue"
      :name="props.name"
      :read-only="props.readOnly"
      :required="props.required"
      :translations="props.translations"
      @hover-change="emit('hoverChange', $event)"
      @update:model-value="emit('update:modelValue', $event)"
      @value-change="emit('valueChange', $event)"
    >
      <slot />
      <ArkRatingGroup.HiddenInput :aria-invalid="props.invalid || undefined" />
    </ArkRatingGroup.Root>
  </LocaleProvider>
</template>

<style src="./rating.css"></style>
