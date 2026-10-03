<script setup lang="ts">
import { DEFAULT_LOCALE, LocaleProvider, useLocaleContext } from "@ark-ui/vue/locale";
import { Select as ArkSelect, createListCollection } from "@ark-ui/vue/select";
import { computed, useAttrs, useId } from "vue";
import SelectContent from "./SelectContent.vue";
import SelectControl from "./SelectControl.vue";
import SelectHiddenSelect from "./SelectHiddenSelect.vue";
import SelectIndicator from "./SelectIndicator.vue";
import SelectItem from "./SelectItem.vue";
import SelectLabel from "./SelectLabel.vue";
import SelectList from "./SelectList.vue";
import SelectPositioner from "./SelectPositioner.vue";
import SelectTrigger from "./SelectTrigger.vue";
import SelectValueText from "./SelectValueText.vue";
import {
  getSelectItemDisabled,
  getSelectItemString,
  getSelectItemValue,
  SELECT_DEFAULT_SIZE,
  type SelectEmits,
  type SelectPositioningOptions,
  type SelectProps,
  type SelectSlots,
} from "./select";
import { provideKappaSelectContext } from "./select-context";
import { withSelectItemAlignment } from "./select-positioning";

defineOptions({ inheritAttrs: false });

const defaultPositioning = {
  fitViewport: true,
  gutter: 4,
  overflowPadding: 8,
  placement: "bottom-start",
  sameWidth: true,
} satisfies SelectPositioningOptions;

const props = withDefaults(defineProps<SelectProps>(), {
  alignItemWithTrigger: false,
  autoComplete: undefined,
  closeOnSelect: undefined,
  composite: undefined,
  defaultHighlightedValue: undefined,
  defaultOpen: undefined,
  defaultValue: undefined,
  deselectable: undefined,
  dir: undefined,
  disabled: undefined,
  invalid: undefined,
  items: () => [],
  lazyMount: undefined,
  loopFocus: undefined,
  modelValue: undefined,
  multiple: undefined,
  open: undefined,
  positioning: () => ({
    fitViewport: true,
    gutter: 4,
    overflowPadding: 8,
    placement: "bottom-start",
    sameWidth: true,
  }),
  readOnly: undefined,
  required: undefined,
  size: SELECT_DEFAULT_SIZE,
  unmountOnExit: undefined,
});

const emit = defineEmits<SelectEmits>();
const slots = defineSlots<SelectSlots>();
const attrs = useAttrs();
const inheritedLocale = useLocaleContext(DEFAULT_LOCALE);
const generatedId = `kappa-select-${useId()}`;

const rootId = computed(() => props.id ?? generatedId);
const descriptionId = computed(() =>
  props.description || slots.description ? `${rootId.value}-description` : undefined,
);
const errorId = computed(() => (props.error || slots.error ? `${rootId.value}-error` : undefined));
const resolvedAriaDescribedby = computed(() => {
  if (props.ariaDescribedby !== undefined) return props.ariaDescribedby;
  const ariaDescribedby = attrs["aria-describedby"];
  return typeof ariaDescribedby === "string" ? ariaDescribedby : undefined;
});
const describedBy = computed(() =>
  [resolvedAriaDescribedby.value, descriptionId.value, errorId.value].filter(Boolean).join(" ") ||
  undefined,
);
const isInvalid = computed(() => Boolean(props.invalid || props.error || slots.error));
const resolvedAriaLabel = computed(() => {
  if (props.ariaLabel !== undefined) return props.ariaLabel;
  const ariaLabel = attrs["aria-label"];
  return typeof ariaLabel === "string" ? ariaLabel : undefined;
});
const locale = computed(() => {
  if (props.dir === undefined) return inheritedLocale.value.locale;
  return props.dir === "rtl" ? "ar" : "en-US";
});

const itemToString = (item: unknown) => getSelectItemString(item, props.itemToString);
const itemToValue = (item: unknown) =>
  getSelectItemValue(item, props.itemToValue, props.itemToString);
const isItemDisabled = (item: unknown) => getSelectItemDisabled(item, props.isItemDisabled);

const collection = computed(
  () =>
    props.collection ??
    createListCollection({
      isItemDisabled,
      itemToString,
      itemToValue,
      items: props.items,
    }),
);
const resolvedPositioning = computed(() => {
  const positioning = {
    ...defaultPositioning,
    ...(props.positioning as SelectPositioningOptions | undefined),
  };
  if (!props.alignItemWithTrigger) return positioning;

  return withSelectItemAlignment(positioning, (floatingElement) => {
    const triggerId = props.ids?.trigger ?? `select:${rootId.value}:trigger`;
    return floatingElement.ownerDocument.getElementById(triggerId);
  });
});
const hasCustomContent = computed(() => Boolean(slots.default));

provideKappaSelectContext({
  ariaLabel: resolvedAriaLabel,
  collection,
  describedBy,
  disabled: computed(() => Boolean(props.disabled)),
  invalid: isInvalid,
  readOnly: computed(() => Boolean(props.readOnly)),
  size: computed(() => props.size ?? SELECT_DEFAULT_SIZE),
});

const emitExitComplete = () => emit("exitComplete");
const emitFocusOutside = (event: SelectEmits["focusOutside"][0]) => emit("focusOutside", event);
const emitHighlightChange = (details: SelectEmits["highlightChange"][0]) =>
  emit("highlightChange", details);
const emitInteractOutside = (event: SelectEmits["interactOutside"][0]) =>
  emit("interactOutside", event);
const emitOpenChange = (details: SelectEmits["openChange"][0]) => emit("openChange", details);
const emitPointerDownOutside = (event: SelectEmits["pointerDownOutside"][0]) =>
  emit("pointerDownOutside", event);
const emitSelect = (details: SelectEmits["select"][0]) => emit("select", details);
const emitValueChange = (details: SelectEmits["valueChange"][0]) => emit("valueChange", details);
</script>

<template>
  <LocaleProvider :locale="locale">
    <ArkSelect.Root
      v-bind="$attrs"
      class="kappa-select"
      data-slot="select"
      :class="`kappa-select--${size}`"
      :as-child="asChild"
      :auto-complete="autoComplete"
      :close-on-select="closeOnSelect"
      :collection="collection"
      :composite="composite"
      :default-highlighted-value="defaultHighlightedValue"
      :default-open="defaultOpen"
      :default-value="defaultValue"
      :deselectable="deselectable"
      :disabled="disabled"
      :form="form"
      :highlighted-value="highlightedValue"
      :id="rootId"
      :ids="ids"
      :invalid="isInvalid"
      :lazy-mount="lazyMount"
      :loop-focus="loopFocus"
      :model-value="modelValue"
      :multiple="multiple"
      :name="name"
      :open="open"
      :positioning="resolvedPositioning"
      :read-only="readOnly"
      :required="required"
      :scroll-to-index-fn="scrollToIndexFn"
      :translations="translations"
      :unmount-on-exit="unmountOnExit"
      :data-invalid="isInvalid ? '' : undefined"
      :data-align-item-with-trigger="alignItemWithTrigger ? '' : undefined"
      :data-readonly="readOnly ? '' : undefined"
      @exit-complete="emitExitComplete"
      @focus-outside="emitFocusOutside"
      @highlight-change="emitHighlightChange"
      @interact-outside="emitInteractOutside"
      @open-change="emitOpenChange"
      @pointer-down-outside="emitPointerDownOutside"
      @select="emitSelect"
      @update:highlighted-value="emit('update:highlightedValue', $event)"
      @update:model-value="emit('update:modelValue', $event)"
      @update:open="emit('update:open', $event)"
      @value-change="emitValueChange"
    >
      <div v-if="!hasCustomContent" class="kappa-select__field" data-slot="select-field">
        <SelectLabel v-if="label || slots.label">
          <slot name="label">{{ label }}</slot>
          <span v-if="required" class="kappa-select__required" aria-hidden="true">*</span>
        </SelectLabel>

        <SelectControl>
          <SelectTrigger>
            <SelectValueText :placeholder="placeholder" />
            <SelectIndicator aria-hidden="true" />
          </SelectTrigger>
        </SelectControl>

        <p
          v-if="description || slots.description"
          :id="descriptionId"
          class="kappa-select__description"
        >
          <slot name="description">{{ description }}</slot>
        </p>
        <p v-if="error || slots.error" :id="errorId" class="kappa-select__error">
          <slot name="error">{{ error }}</slot>
        </p>
      </div>

      <slot v-else :collection="collection" :items="collection.items" />

      <template v-if="!hasCustomContent">
        <SelectPositioner>
          <SelectContent>
            <SelectList :items="collection.items">
              <template #default="{ item }">
                <SelectItem :item="item">
                  <slot name="item" :item="item">{{ itemToString(item) }}</slot>
                </SelectItem>
              </template>
            </SelectList>
          </SelectContent>
        </SelectPositioner>
      </template>

      <SelectHiddenSelect />
    </ArkSelect.Root>
  </LocaleProvider>
</template>

<style src="./select.css"></style>
