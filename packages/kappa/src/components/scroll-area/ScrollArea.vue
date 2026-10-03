<script setup lang="ts">
import { ScrollArea as ArkScrollArea } from "@ark-ui/vue/scroll-area";
import { DEFAULT_LOCALE, LocaleProvider, useLocaleContext } from "@ark-ui/vue/locale";
import { computed } from "vue";
import type { ScrollAreaProps, ScrollAreaSlots } from "./scroll-area";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ScrollAreaProps>(), {
  asChild: undefined,
  dir: undefined,
  id: undefined,
  ids: undefined,
});

defineSlots<ScrollAreaSlots>();

const inheritedLocale = useLocaleContext(DEFAULT_LOCALE);
const locale = computed(() => {
  if (props.dir === undefined) return inheritedLocale.value.locale;
  return props.dir === "rtl" ? "ar" : "en-US";
});
</script>

<template>
  <LocaleProvider :locale="locale">
    <ArkScrollArea.Root
      v-bind="$attrs"
      class="kappa-scroll-area"
      data-slot="scroll-area"
      :as-child="props.asChild"
      :id="props.id"
      :ids="props.ids"
    >
      <slot />
    </ArkScrollArea.Root>
  </LocaleProvider>
</template>

<style src="./scroll-area.css"></style>
