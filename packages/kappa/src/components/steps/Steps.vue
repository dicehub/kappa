<script setup lang="ts">
import { DEFAULT_LOCALE, LocaleProvider, useLocaleContext } from "@ark-ui/vue/locale";
import { Steps as ArkSteps } from "@ark-ui/vue/steps";
import { computed } from "vue";
import type { StepsEmits, StepsProps, StepsSlots } from "./steps";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<StepsProps>(), {
  asChild: undefined,
  count: undefined,
  defaultStep: undefined,
  dir: undefined,
  id: undefined,
  ids: undefined,
  isStepSkippable: undefined,
  isStepValid: undefined,
  linear: undefined,
  orientation: undefined,
  step: undefined,
});

const emit = defineEmits<StepsEmits>();
defineSlots<StepsSlots>();

const inheritedLocale = useLocaleContext(DEFAULT_LOCALE);
const locale = computed(() => {
  if (props.dir === undefined) return inheritedLocale.value.locale;
  return props.dir === "rtl" ? "ar" : "en-US";
});
</script>

<template>
  <LocaleProvider :locale="locale">
    <ArkSteps.Root
      v-bind="$attrs"
      class="kappa-steps"
      data-slot="steps"
      :as-child="props.asChild"
      :count="props.count"
      :default-step="props.defaultStep"
      :id="props.id"
      :ids="props.ids"
      :is-step-skippable="props.isStepSkippable"
      :is-step-valid="props.isStepValid"
      :linear="props.linear"
      :orientation="props.orientation"
      :step="props.step"
      @step-change="emit('stepChange', $event)"
      @step-complete="emit('stepComplete')"
      @step-invalid="emit('stepInvalid', $event)"
      @update:step="emit('update:step', $event)"
    >
      <slot />
    </ArkSteps.Root>
  </LocaleProvider>
</template>

<style src="./steps.css"></style>
