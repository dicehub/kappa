<script setup lang="ts">
import { Combobox, createListCollection } from "@ark-ui/vue/combobox";
import type {
  ComboboxFocusOutsideEvent,
  ComboboxHighlightChangeDetails,
  ComboboxInputValueChangeDetails,
  ComboboxInteractOutsideEvent,
  ComboboxOpenChangeDetails,
  ComboboxPointerDownOutsideEvent,
  ComboboxSelectionDetails,
  ComboboxValueChangeDetails,
} from "@ark-ui/vue/combobox";
import { useFilter } from "@ark-ui/vue/locale";
import { computed, ref, shallowRef, watch } from "vue";
import ComboboxContent from "./ComboboxContent.vue";
import ComboboxEmpty from "./ComboboxEmpty.vue";
import ComboboxItem from "./ComboboxItem.vue";
import ComboboxLabel from "./ComboboxLabel.vue";
import ComboboxList from "./ComboboxList.vue";
import ComboboxTriggerInput from "./ComboboxTriggerInput.vue";
import {
  getComboboxItemDisabled,
  getComboboxItemString,
  getComboboxItemValue,
  matchesComboboxItem,
  mergeComboboxPositioning,
  type ComboboxEmits,
  type ComboboxPositioningOptions,
  type ComboboxProps,
  type ComboboxSlots,
} from "./combobox";
import { provideKappaComboboxContext } from "./combobox-context";

defineOptions({ inheritAttrs: false });

type KappaComboboxGlobal = typeof globalThis & {
  __kappaComboboxId?: number;
};

const nextComboboxId = () => {
  const kappaGlobal = globalThis as KappaComboboxGlobal;
  kappaGlobal.__kappaComboboxId = (kappaGlobal.__kappaComboboxId ?? 0) + 1;
  return `kappa-combobox-${kappaGlobal.__kappaComboboxId}`;
};

const props = withDefaults(defineProps<ComboboxProps>(), {
  allowCustomValue: false,
  alwaysSubmitOnEnter: undefined,
  autoFocus: undefined,
  clearable: true,
  closeOnSelect: undefined,
  composite: undefined,
  defaultOpen: undefined,
  disableLayer: undefined,
  disabled: undefined,
  emptyText: "No results found.",
  filter: undefined,
  invalid: undefined,
  items: () => [],
  lazyMount: undefined,
  loopFocus: undefined,
  multiple: false,
  open: undefined,
  openOnChange: undefined,
  openOnClick: true,
  openOnKeyPress: undefined,
  positioning: () => ({
    fitViewport: true,
    gutter: 4,
    overflowPadding: 8,
    placement: "bottom-start",
    sameWidth: true,
  }),
  readOnly: undefined,
  required: undefined,
  showOnEmpty: true,
  size: "base",
  unmountOnExit: undefined,
});

const emit = defineEmits<ComboboxEmits>();
const slots = defineSlots<ComboboxSlots>();
const localeFilter = useFilter({ sensitivity: "base", usage: "search" });
const generatedId = nextComboboxId();
const contentPositioning = shallowRef<ComboboxPositioningOptions>();

const rootId = computed(() => props.id ?? generatedId);
const descriptionId = computed(() =>
  props.description ? `${rootId.value}-description` : undefined,
);
const errorId = computed(() => (props.error ? `${rootId.value}-error` : undefined));
const describedBy = computed(() =>
  [props.ariaDescribedby, descriptionId.value, errorId.value].filter(Boolean).join(" ") ||
  undefined,
);
const isInvalid = computed(() => Boolean(props.invalid || props.error));

const itemToString = (item: unknown) => getComboboxItemString(item, props.itemToString);
const itemToValue = (item: unknown) =>
  getComboboxItemValue(item, props.itemToValue, props.itemToString);
const isItemDisabled = (item: unknown) =>
  getComboboxItemDisabled(item, props.isItemDisabled);

const baseCollection = computed(
  () =>
    props.collection ??
    createListCollection({
      isItemDisabled,
      itemToString,
      itemToValue,
      items: props.items,
    }),
);

const valueToInputValue = (value?: string[]) => {
  const firstValue = value?.[0];
  if (!firstValue) return "";
  return baseCollection.value.stringify(firstValue) ?? firstValue;
};

const internalInputValue = ref(
  props.inputValue ??
    props.defaultInputValue ??
    (props.multiple ? "" : valueToInputValue(props.modelValue ?? props.defaultValue)),
);
const internalFilterValue = ref(props.inputValue ?? props.defaultInputValue ?? "");

const activeCollection = computed(() =>
  baseCollection.value.filter((_, __, item) =>
    matchesComboboxItem({
      contains: localeFilter.value.contains,
      filter: props.filter,
      item,
      itemToString: props.itemToString,
      query: internalFilterValue.value,
      showOnEmpty: props.showOnEmpty,
    }),
  ),
);

const resolvedCloseOnSelect = computed(() => props.closeOnSelect ?? !props.multiple);
const resolvedDefaultInputValue = computed(
  () =>
    props.defaultInputValue ??
    (props.multiple ? "" : valueToInputValue(props.modelValue ?? props.defaultValue)),
);
const resolvedInputValue = computed(() => props.inputValue ?? internalInputValue.value);
const resolvedPositioning = computed(() =>
  mergeComboboxPositioning(props.positioning, contentPositioning.value),
);
const resolvedSelectionBehavior = computed(
  () => props.selectionBehavior ?? (props.multiple ? "clear" : "replace"),
);
const hasCustomContent = computed(() => Boolean(slots.default));

provideKappaComboboxContext({
  clearContentPositioning: () => {
    contentPositioning.value = undefined;
  },
  collection: activeCollection,
  describedBy,
  disabled: computed(() => Boolean(props.disabled)),
  filterValue: internalFilterValue,
  invalid: isInvalid,
  readOnly: computed(() => Boolean(props.readOnly)),
  setContentPositioning: (positioning) => {
    contentPositioning.value = positioning;
  },
  size: computed(() => props.size),
});

const handleInputValueChange = (details: ComboboxInputValueChangeDetails) => {
  internalInputValue.value = details.inputValue;
  internalFilterValue.value =
    details.reason === "input-change" ||
    details.reason === "script" ||
    details.reason === undefined
      ? details.inputValue
      : "";
  emit("inputValueChange", details);
};

const handleValueChange = (details: ComboboxValueChangeDetails<unknown>) => {
  if (props.inputValue === undefined && !props.multiple) {
    internalInputValue.value = valueToInputValue(details.value);
  }
  internalFilterValue.value = "";
  emit("valueChange", details);
};

watch(
  () => props.inputValue,
  (value) => {
    if (value !== undefined) {
      internalInputValue.value = value;
      internalFilterValue.value = value;
    }
  },
);

watch([() => props.modelValue, baseCollection], ([value]) => {
  if (props.inputValue === undefined && !props.multiple && value !== undefined) {
    internalInputValue.value = valueToInputValue(value);
    internalFilterValue.value = "";
  }
});

const emitExitComplete = () => emit("exitComplete");
const emitFocusOutside = (event: ComboboxFocusOutsideEvent) => emit("focusOutside", event);
const emitHighlightChange = (details: ComboboxHighlightChangeDetails<unknown>) =>
  emit("highlightChange", details);
const emitInteractOutside = (event: ComboboxInteractOutsideEvent) => emit("interactOutside", event);
const emitOpenChange = (details: ComboboxOpenChangeDetails) => emit("openChange", details);
const emitPointerDownOutside = (event: ComboboxPointerDownOutsideEvent) =>
  emit("pointerDownOutside", event);
const emitSelect = (details: ComboboxSelectionDetails) => emit("select", details);
</script>

<template>
  <Combobox.Root
    v-bind="$attrs"
    class="kappa-combobox"
    :class="`kappa-combobox--${size}`"
    :allow-custom-value="allowCustomValue"
    :always-submit-on-enter="alwaysSubmitOnEnter"
    :as-child="asChild"
    :auto-focus="autoFocus"
    :close-on-select="resolvedCloseOnSelect"
    :collection="activeCollection"
    :composite="composite"
    :default-highlighted-value="defaultHighlightedValue"
    :default-input-value="resolvedDefaultInputValue"
    :default-open="defaultOpen"
    :default-value="defaultValue"
    :disable-layer="disableLayer"
    :disabled="disabled"
    :form="form"
    :highlighted-value="highlightedValue"
    :id="rootId"
    :ids="ids"
    :input-behavior="inputBehavior"
    :input-value="resolvedInputValue"
    :invalid="isInvalid"
    :lazy-mount="lazyMount"
    :loop-focus="loopFocus"
    :model-value="modelValue"
    :multiple="multiple"
    :name="name"
    :navigate="navigate"
    :open="open"
    :open-on-change="openOnChange"
    :open-on-click="openOnClick"
    :open-on-key-press="openOnKeyPress"
    :placeholder="placeholder"
    :positioning="resolvedPositioning"
    :read-only="readOnly"
    :required="required"
    :scroll-to-index-fn="scrollToIndexFn"
    :selection-behavior="resolvedSelectionBehavior"
    :translations="translations"
    :unmount-on-exit="unmountOnExit"
    :data-invalid="isInvalid ? '' : undefined"
    @exit-complete="emitExitComplete"
    @focus-outside="emitFocusOutside"
    @highlight-change="emitHighlightChange"
    @input-value-change="handleInputValueChange"
    @interact-outside="emitInteractOutside"
    @open-change="emitOpenChange"
    @pointer-down-outside="emitPointerDownOutside"
    @select="emitSelect"
    @update:highlighted-value="emit('update:highlightedValue', $event)"
    @update:input-value="emit('update:inputValue', $event)"
    @update:model-value="emit('update:modelValue', $event)"
    @update:open="emit('update:open', $event)"
    @value-change="handleValueChange"
  >
    <ComboboxLabel v-if="label">
      {{ label }}<span v-if="required" class="kappa-combobox__required" aria-hidden="true">*</span>
    </ComboboxLabel>

    <slot v-if="hasCustomContent" :collection="activeCollection" :items="activeCollection.items" />
    <template v-else>
      <ComboboxTriggerInput
        :aria-label="ariaLabel"
        :clearable="clearable"
        :input-attrs="inputAttrs"
        :placeholder="placeholder"
        :size="size"
      />
      <ComboboxContent>
        <ComboboxEmpty>{{ emptyText }}</ComboboxEmpty>
        <ComboboxList>
          <template #default="{ item }">
            <ComboboxItem :item="item">
              <slot name="item" :item="item">{{ itemToString(item) }}</slot>
            </ComboboxItem>
          </template>
        </ComboboxList>
      </ComboboxContent>
    </template>

    <p v-if="description" :id="descriptionId" class="kappa-combobox__description">
      {{ description }}
    </p>
    <p v-if="error" :id="errorId" class="kappa-combobox__error">{{ error }}</p>
  </Combobox.Root>
</template>

<style src="./combobox.css"></style>
