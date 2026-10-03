<script setup lang="ts">
import { Tabs as ArkTabs } from "@ark-ui/vue/tabs";
import { DEFAULT_LOCALE, LocaleProvider, useLocaleContext } from "@ark-ui/vue/locale";
import { computed } from "vue";
import type { TabsEmits, TabsProps, TabsSlots } from "./tabs";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TabsProps>(), {
  activationMode: undefined,
  asChild: undefined,
  composite: undefined,
  defaultValue: undefined,
  dir: undefined,
  deselectable: undefined,
  id: undefined,
  ids: undefined,
  lazyMount: undefined,
  loopFocus: undefined,
  modelValue: undefined,
  navigate: undefined,
  orientation: undefined,
  translations: undefined,
  unmountOnExit: undefined,
});

const emit = defineEmits<TabsEmits>();
defineSlots<TabsSlots>();

const inheritedLocale = useLocaleContext(DEFAULT_LOCALE);
const locale = computed(() => {
  if (props.dir === undefined) return inheritedLocale.value.locale;
  return props.dir === "rtl" ? "ar" : "en-US";
});
</script>

<template>
  <LocaleProvider :locale="locale">
    <ArkTabs.Root
      v-bind="$attrs"
      class="kappa-tabs"
      data-slot="tabs"
      :activation-mode="props.activationMode"
      :as-child="props.asChild"
      :composite="props.composite"
      :default-value="props.defaultValue"
      :deselectable="props.deselectable"
      :id="props.id"
      :ids="props.ids"
      :lazy-mount="props.lazyMount"
      :loop-focus="props.loopFocus"
      :model-value="props.modelValue"
      :navigate="props.navigate"
      :orientation="props.orientation"
      :translations="props.translations"
      :unmount-on-exit="props.unmountOnExit"
      @focus-change="emit('focusChange', $event)"
      @update:model-value="emit('update:modelValue', $event)"
      @value-change="emit('valueChange', $event)"
    >
      <slot />
    </ArkTabs.Root>
  </LocaleProvider>
</template>

<style src="./tabs.css"></style>
