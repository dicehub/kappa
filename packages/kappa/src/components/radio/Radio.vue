<script setup lang="ts">
import { RadioGroup as ArkRadioGroup } from "@ark-ui/vue/radio-group";
import { DEFAULT_LOCALE, LocaleProvider, useLocaleContext } from "@ark-ui/vue/locale";
import { computed } from "vue";
import type { RadioEmits, RadioProps, RadioSlots } from "./radio";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<RadioProps>(), {
  asChild: undefined,
  defaultValue: undefined,
  disabled: undefined,
  dir: undefined,
  form: undefined,
  id: undefined,
  ids: undefined,
  invalid: undefined,
  modelValue: undefined,
  name: undefined,
  orientation: undefined,
  readOnly: undefined,
  required: undefined,
});

const emit = defineEmits<RadioEmits>();
defineSlots<RadioSlots>();

const inheritedLocale = useLocaleContext(DEFAULT_LOCALE);
const locale = computed(() => {
  if (props.dir === undefined) return inheritedLocale.value.locale;
  return props.dir === "rtl" ? "ar" : "en-US";
});
</script>

<template>
  <LocaleProvider :locale="locale">
    <ArkRadioGroup.Root
      v-bind="$attrs"
      class="kappa-radio"
      data-slot="radio"
      :as-child="props.asChild"
      :default-value="props.defaultValue"
      :disabled="props.disabled"
      :form="props.form"
      :id="props.id"
      :ids="props.ids"
      :invalid="props.invalid"
      :model-value="props.modelValue"
      :name="props.name"
      :orientation="props.orientation"
      :read-only="props.readOnly"
      :required="props.required"
      @update:model-value="emit('update:modelValue', $event)"
      @value-change="emit('valueChange', $event)"
    >
      <slot />
    </ArkRadioGroup.Root>
  </LocaleProvider>
</template>

<style src="./radio.css"></style>
