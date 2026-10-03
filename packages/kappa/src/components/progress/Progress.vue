<script setup lang="ts">
import { Progress as ArkProgress } from "@ark-ui/vue/progress";
import type { ProgressEmits, ProgressProps, ProgressSlots } from "./progress";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ProgressProps>(), {
  asChild: undefined,
  defaultValue: undefined,
  formatOptions: undefined,
  id: undefined,
  ids: undefined,
  locale: undefined,
  max: undefined,
  min: undefined,
  modelValue: undefined,
  orientation: undefined,
  translations: undefined,
});

const emit = defineEmits<ProgressEmits>();
defineSlots<ProgressSlots>();
</script>

<template>
  <ArkProgress.Root
    v-bind="$attrs"
    class="kappa-progress"
    data-slot="progress"
    :as-child="props.asChild"
    :default-value="props.defaultValue"
    :format-options="props.formatOptions"
    :id="props.id"
    :ids="props.ids"
    :locale="props.locale"
    :max="props.max"
    :min="props.min"
    :model-value="props.modelValue"
    :orientation="props.orientation"
    :translations="props.translations"
    @update:model-value="emit('update:modelValue', $event)"
    @value-change="emit('valueChange', $event)"
  >
    <slot />
  </ArkProgress.Root>
</template>

<style src="./progress.css"></style>
