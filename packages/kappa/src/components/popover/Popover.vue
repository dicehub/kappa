<script setup lang="ts">
import { Popover as ArkPopover } from "@ark-ui/vue/popover";
import { DEFAULT_LOCALE, LocaleProvider, useLocaleContext } from "@ark-ui/vue/locale";
import { computed } from "vue";
import {
  POPOVER_DEFAULT_POSITIONING,
  type PopoverEmits,
  type PopoverPositioningOptions,
  type PopoverProps,
  type PopoverSlots,
} from "./popover";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<PopoverProps>(), {
  autoFocus: true,
  closeOnEscape: true,
  closeOnInteractOutside: true,
  defaultOpen: undefined,
  defaultTriggerValue: undefined,
  dir: undefined,
  finalFocusEl: undefined,
  id: undefined,
  ids: undefined,
  initialFocusEl: undefined,
  lazyMount: true,
  modal: false,
  open: undefined,
  persistentElements: undefined,
  portalled: true,
  positioning: () => ({ ...POPOVER_DEFAULT_POSITIONING }),
  restoreFocus: true,
  translations: undefined,
  triggerValue: undefined,
  unmountOnExit: true,
});

const emit = defineEmits<PopoverEmits>();
defineSlots<PopoverSlots>();

const inheritedLocale = useLocaleContext(DEFAULT_LOCALE);
const locale = computed(() => {
  if (props.dir === undefined) return inheritedLocale.value.locale;
  return props.dir === "rtl" ? "ar" : "en-US";
});
const resolvedPositioning = computed<PopoverPositioningOptions>(() => ({
  ...POPOVER_DEFAULT_POSITIONING,
  ...props.positioning,
}));
</script>

<template>
  <LocaleProvider :locale="locale">
    <ArkPopover.Root
      v-bind="$attrs"
      :auto-focus="props.autoFocus"
      :close-on-escape="props.closeOnEscape"
      :close-on-interact-outside="props.closeOnInteractOutside"
      :default-open="props.defaultOpen"
      :default-trigger-value="props.defaultTriggerValue"
      :final-focus-el="props.finalFocusEl"
      :id="props.id"
      :ids="props.ids"
      :initial-focus-el="props.initialFocusEl"
      :lazy-mount="props.lazyMount"
      :modal="props.modal"
      :open="props.open"
      :persistent-elements="props.persistentElements"
      :portalled="props.portalled"
      :positioning="resolvedPositioning"
      :restore-focus="props.restoreFocus"
      :translations="props.translations"
      :trigger-value="props.triggerValue"
      :unmount-on-exit="props.unmountOnExit"
      @escape-key-down="emit('escapeKeyDown', $event)"
      @exit-complete="emit('exitComplete')"
      @focus-outside="emit('focusOutside', $event)"
      @interact-outside="emit('interactOutside', $event)"
      @open-change="emit('openChange', $event)"
      @pointer-down-outside="emit('pointerDownOutside', $event)"
      @request-dismiss="emit('requestDismiss', $event)"
      @trigger-value-change="emit('triggerValueChange', $event)"
      @update:open="emit('update:open', $event)"
      @update:trigger-value="emit('update:triggerValue', $event)"
    >
      <slot />
    </ArkPopover.Root>
  </LocaleProvider>
</template>

<style src="./popover.css"></style>
