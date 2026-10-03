<script setup lang="ts">
import { Switch as ArkSwitch } from "@ark-ui/vue/switch";
import { useFieldContext } from "@ark-ui/vue/field";
import { DEFAULT_LOCALE, LocaleProvider, useLocaleContext } from "@ark-ui/vue/locale";
import { computed } from "vue";
import {
  SWITCH_DEFAULT_SIZE,
  resolveSwitchSize,
  type SwitchEmits,
  type SwitchProps,
  type SwitchSlots,
} from "./switch";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<SwitchProps>(), {
  asChild: undefined,
  checked: undefined,
  defaultChecked: undefined,
  disabled: undefined,
  dir: undefined,
  form: undefined,
  id: undefined,
  ids: undefined,
  invalid: undefined,
  label: undefined,
  name: undefined,
  readOnly: undefined,
  required: undefined,
  size: SWITCH_DEFAULT_SIZE,
  value: undefined,
});

const emit = defineEmits<SwitchEmits>();
defineSlots<SwitchSlots>();

const resolvedSize = computed(() => resolveSwitchSize(props.size));
const field = useFieldContext();
const inheritedLocale = useLocaleContext(DEFAULT_LOCALE);
const locale = computed(() => {
  if (props.dir === undefined) return inheritedLocale.value.locale;
  return props.dir === "rtl" ? "ar" : "en-US";
});
const fieldErrorMessageId = computed(
  () => field?.value.getInputProps()["aria-errormessage"],
);
</script>

<template>
  <LocaleProvider :locale="locale">
    <ArkSwitch.Root
      v-bind="$attrs"
      class="kappa-switch"
      data-slot="switch"
      :as-child="props.asChild"
      :checked="props.checked"
      :data-size="resolvedSize"
      :default-checked="props.defaultChecked"
      :disabled="props.disabled"
      :form="props.form"
      :id="props.id"
      :ids="props.ids"
      :invalid="props.invalid"
      :label="props.label"
      :name="props.name"
      :read-only="props.readOnly"
      :required="props.required"
      :value="props.value"
      @checked-change="emit('checkedChange', $event)"
      @update:checked="emit('update:checked', $event)"
    >
      <slot />
      <ArkSwitch.HiddenInput
        :aria-errormessage="fieldErrorMessageId"
        data-slot="switch-hidden-input"
      />
    </ArkSwitch.Root>
  </LocaleProvider>
</template>

<style src="./switch.css"></style>
