<script setup lang="ts">
import { Accordion as ArkAccordion } from "@ark-ui/vue/accordion";
import { DEFAULT_LOCALE, LocaleProvider, useLocaleContext } from "@ark-ui/vue/locale";
import { computed } from "vue";
import type { AccordionEmits, AccordionProps, AccordionSlots } from "./accordion";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<AccordionProps>(), {
  asChild: undefined,
  collapsible: undefined,
  defaultValue: undefined,
  disabled: undefined,
  dir: undefined,
  id: undefined,
  ids: undefined,
  lazyMount: undefined,
  modelValue: undefined,
  multiple: undefined,
  orientation: undefined,
  unmountOnExit: undefined,
});

const emit = defineEmits<AccordionEmits>();
defineSlots<AccordionSlots>();

const inheritedLocale = useLocaleContext(DEFAULT_LOCALE);
const locale = computed(() => {
  if (props.dir === undefined) return inheritedLocale.value.locale;
  return props.dir === "rtl" ? "ar" : "en-US";
});
</script>

<template>
  <LocaleProvider :locale="locale">
    <ArkAccordion.Root
      v-bind="$attrs"
      class="kappa-accordion"
      data-slot="accordion"
      :as-child="props.asChild"
      :collapsible="props.collapsible"
      :default-value="props.defaultValue"
      :disabled="props.disabled"
      :id="props.id"
      :ids="props.ids"
      :lazy-mount="props.lazyMount"
      :model-value="props.modelValue"
      :multiple="props.multiple"
      :orientation="props.orientation"
      :unmount-on-exit="props.unmountOnExit"
      @focus-change="emit('focusChange', $event)"
      @update:model-value="emit('update:modelValue', $event)"
      @value-change="emit('valueChange', $event)"
    >
      <slot />
    </ArkAccordion.Root>
  </LocaleProvider>
</template>

<style src="./accordion.css"></style>
