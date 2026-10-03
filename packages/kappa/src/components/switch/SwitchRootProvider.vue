<script setup lang="ts">
import { Switch as ArkSwitch } from "@ark-ui/vue/switch";
import { useFieldContext } from "@ark-ui/vue/field";
import { computed } from "vue";
import {
  SWITCH_DEFAULT_SIZE,
  resolveSwitchSize,
  type SwitchRootProviderProps,
  type SwitchRootProviderSlots,
} from "./switch";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<SwitchRootProviderProps>(), {
  asChild: undefined,
  size: SWITCH_DEFAULT_SIZE,
});

defineSlots<SwitchRootProviderSlots>();

const resolvedSize = computed(() => resolveSwitchSize(props.size));
const field = useFieldContext();
const fieldErrorMessageId = computed(
  () => field?.value.getInputProps()["aria-errormessage"],
);
</script>

<template>
  <ArkSwitch.RootProvider
    v-bind="$attrs"
    class="kappa-switch"
    data-slot="switch"
    :as-child="props.asChild"
    :data-size="resolvedSize"
    :value="props.value"
  >
    <slot />
    <ArkSwitch.HiddenInput
      :aria-errormessage="fieldErrorMessageId"
      data-slot="switch-hidden-input"
    />
  </ArkSwitch.RootProvider>
</template>

<style src="./switch.css"></style>
