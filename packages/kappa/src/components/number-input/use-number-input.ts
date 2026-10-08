// Adapted from Ark UI Vue 5.39.2 (MIT), copyright 2024 Chakra UI.
// The full upstream notice is included in THIRD_PARTY_NOTICES.md.
import { DEFAULT_ENVIRONMENT, useEnvironmentContext } from "@ark-ui/vue/environment";
import { useFieldContext } from "@ark-ui/vue/field";
import { DEFAULT_LOCALE, useLocaleContext } from "@ark-ui/vue/locale";
import type { useNumberInput as useArkNumberInput, UseNumberInputProps, UseNumberInputReturn } from "@ark-ui/vue/number-input";
import * as numberInput from "@zag-js/number-input";
import { normalizeProps, useMachine } from "@zag-js/vue";
import { computed, onScopeDispose, toValue, useId } from "vue";
import { createNumberInputMachine } from "./number-input-machine";

export function useNumberInput(...[props = {}, emit]: Parameters<typeof useArkNumberInput>): UseNumberInputReturn {
  const id = useId();
  const environment = useEnvironmentContext(DEFAULT_ENVIRONMENT);
  const locale = useLocaleContext(DEFAULT_LOCALE);
  const field = useFieldContext();
  const context = computed<numberInput.Props>(() => {
    const local: UseNumberInputProps = toValue(props) ?? {};
    const defined = Object.fromEntries(Object.entries(local).filter(([, value]) => value !== undefined));
    return {
      id,
      ids: { label: field?.value.ids.label, input: field?.value.ids.control },
      disabled: field?.value.disabled,
      readOnly: field?.value.readOnly,
      required: field?.value.required,
      invalid: field?.value.invalid,
      dir: locale.value.dir,
      locale: locale.value.locale,
      value: local.modelValue,
      getRootNode: environment?.value.getRootNode,
      ...defined,
      onValueChange: (details) => {
        emit?.("valueChange", details);
        emit?.("update:modelValue", details.value);
        local.onValueChange?.(details);
      },
      onFocusChange: (details) => {
        emit?.("focusChange", details);
        local.onFocusChange?.(details);
      },
      onValueInvalid: (details) => {
        emit?.("valueInvalid", details);
        local.onValueInvalid?.(details);
      },
    };
  });
  const repair = createNumberInputMachine();
  onScopeDispose(repair.dispose);
  const service = useMachine(repair.machine, context);
  return computed(() => numberInput.connect(service, normalizeProps));
}
