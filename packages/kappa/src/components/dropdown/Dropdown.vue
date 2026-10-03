<script setup lang="ts">
import { Menu as ArkMenu } from "@ark-ui/vue/menu";
import { DEFAULT_LOCALE, LocaleProvider, useLocaleContext } from "@ark-ui/vue/locale";
import { computed, provide, useAttrs } from "vue";
import { dropdownAriaLabelKey } from "./dropdown-aria-label";
import {
  DROPDOWN_DEFAULT_POSITIONING,
  type DropdownEmits,
  type DropdownProps,
  type DropdownSlots,
} from "./dropdown";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DropdownProps>(), {
  anchorPoint: undefined,
  ariaLabel: undefined,
  closeOnSelect: undefined,
  composite: undefined,
  defaultHighlightedValue: undefined,
  defaultOpen: undefined,
  defaultTriggerValue: undefined,
  dir: undefined,
  highlightedValue: undefined,
  id: undefined,
  ids: undefined,
  lazyMount: undefined,
  loopFocus: undefined,
  navigate: undefined,
  open: undefined,
  positioning: () => ({ ...DROPDOWN_DEFAULT_POSITIONING }),
  triggerValue: undefined,
  typeahead: undefined,
  unmountOnExit: undefined,
});

const emit = defineEmits<DropdownEmits>();
defineSlots<DropdownSlots>();

const attrs = useAttrs();
const inheritedLocale = useLocaleContext(DEFAULT_LOCALE);
const locale = computed(() => {
  if (props.dir === undefined) return inheritedLocale.value.locale;
  return props.dir === "rtl" ? "ar" : "en-US";
});
const resolvedAriaLabel = computed(() => {
  if (props.ariaLabel !== undefined) return props.ariaLabel;
  const label = attrs["aria-label"];
  return typeof label === "string" ? label : undefined;
});
const arkAriaProps = computed(() =>
  resolvedAriaLabel.value === undefined ? {} : { "aria-label": resolvedAriaLabel.value },
);

provide(dropdownAriaLabelKey, resolvedAriaLabel);
</script>

<template>
  <LocaleProvider :locale="locale">
    <ArkMenu.Root
      v-bind="{ ...$attrs, ...arkAriaProps }"
      :anchor-point="props.anchorPoint"
      :close-on-select="props.closeOnSelect"
      :composite="props.composite"
      :default-highlighted-value="props.defaultHighlightedValue"
      :default-open="props.defaultOpen"
      :default-trigger-value="props.defaultTriggerValue"
      :highlighted-value="props.highlightedValue"
      :id="props.id"
      :ids="props.ids"
      :lazy-mount="props.lazyMount"
      :loop-focus="props.loopFocus"
      :navigate="props.navigate"
      :open="props.open"
      :positioning="props.positioning"
      :trigger-value="props.triggerValue"
      :typeahead="props.typeahead"
      :unmount-on-exit="props.unmountOnExit"
      @escape-key-down="emit('escapeKeyDown', $event)"
      @exit-complete="emit('exitComplete')"
      @focus-outside="emit('focusOutside', $event)"
      @highlight-change="emit('highlightChange', $event)"
      @interact-outside="emit('interactOutside', $event)"
      @open-change="emit('openChange', $event)"
      @pointer-down-outside="emit('pointerDownOutside', $event)"
      @request-dismiss="emit('requestDismiss', $event)"
      @select="emit('select', $event)"
      @trigger-value-change="emit('triggerValueChange', $event)"
      @update:highlighted-value="emit('update:highlightedValue', $event)"
      @update:open="emit('update:open', $event)"
      @update:trigger-value="emit('update:triggerValue', $event)"
    >
      <slot />
    </ArkMenu.Root>
  </LocaleProvider>
</template>
