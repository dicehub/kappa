<script setup lang="ts">
import { Checkbox as ArkCheckbox } from "@ark-ui/vue/checkbox";
import { useTemplateRef } from "vue";
import { syncCheckboxIndeterminate } from "./checkbox-indeterminate";
import type { CheckboxRootProviderProps, CheckboxRootProviderSlots } from "./checkbox";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<CheckboxRootProviderProps>(), {
  asChild: undefined,
});

defineSlots<CheckboxRootProviderSlots>();

const rootElement = useTemplateRef("root");
syncCheckboxIndeterminate(rootElement, () => props.value.indeterminate);
</script>

<template>
  <ArkCheckbox.RootProvider
    ref="root"
    v-bind="$attrs"
    class="kappa-checkbox"
    data-slot="checkbox"
    :as-child="asChild"
    :value="value"
  >
    <slot />
    <ArkCheckbox.HiddenInput />
  </ArkCheckbox.RootProvider>
</template>

<style src="./checkbox.css"></style>
