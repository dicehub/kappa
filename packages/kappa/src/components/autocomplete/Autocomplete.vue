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
import { computed, ref, watch } from "vue";
import AutocompleteContent from "./AutocompleteContent.vue";
import AutocompleteEmpty from "./AutocompleteEmpty.vue";
import AutocompleteInputGroup from "./AutocompleteInputGroup.vue";
import AutocompleteItem from "./AutocompleteItem.vue";
import AutocompleteLabel from "./AutocompleteLabel.vue";
import AutocompleteList from "./AutocompleteList.vue";
import {
  getAutocompleteItemString,
  getAutocompleteItemValue,
  matchesAutocompleteItem,
  type AutocompleteEmits,
  type AutocompleteProps,
  type AutocompleteSlots,
} from "./autocomplete";
import { provideAutocompleteContext } from "./autocomplete-context";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<AutocompleteProps>(), {
  allowCustomValue: true,
  alwaysSubmitOnEnter: undefined,
  autoFocus: undefined,
  clearable: false,
  closeOnSelect: true,
  composite: undefined,
  defaultOpen: undefined,
  disableLayer: undefined,
  disabled: undefined,
  emptyText: "No suggestions.",
  filter: undefined,
  invalid: undefined,
  loopFocus: undefined,
  open: undefined,
  openOnChange: undefined,
  openOnClick: undefined,
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
  showOnEmpty: false,
  showTrigger: false,
  size: "base",
});

const emit = defineEmits<AutocompleteEmits>();
const slots = defineSlots<AutocompleteSlots>();
const localeFilter = useFilter({ sensitivity: "base", usage: "search" });

const itemToString = (item: unknown) => getAutocompleteItemString(item, props.itemToString);
const itemToValue = (item: unknown) =>
  getAutocompleteItemValue(item, props.itemToValue, props.itemToString);

const baseCollection = computed(
  () =>
    props.collection ??
    createListCollection({
      isItemDisabled: props.isItemDisabled,
      itemToString,
      itemToValue,
      items: props.items ?? [],
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
    valueToInputValue(props.modelValue ?? props.defaultValue),
);
const internalFilterValue = ref(props.inputValue ?? props.defaultInputValue ?? "");
const resolvedDefaultInputValue = computed(
  () =>
    props.defaultInputValue ?? valueToInputValue(props.modelValue ?? props.defaultValue),
);
const resolvedInputValue = computed(() => props.inputValue ?? internalInputValue.value);

const defaultCollection = computed(() =>
  createListCollection({
    isItemDisabled: props.isItemDisabled,
    itemToString,
    itemToValue,
    items: (props.items ?? []).filter((item) =>
      matchesAutocompleteItem({
        contains: localeFilter.value.contains,
        filter: props.filter,
        inputValue: internalFilterValue.value,
        item,
        itemToString: props.itemToString,
        showOnEmpty: props.showOnEmpty,
      }),
    ),
  }),
);

const activeCollection = computed(() => props.collection ?? defaultCollection.value);
const hasCustomContent = computed(() => Boolean(slots.default));

provideAutocompleteContext({ collection: activeCollection });

const handleInputValueChange = (details: ComboboxInputValueChangeDetails) => {
  internalInputValue.value = details.inputValue;
  internalFilterValue.value = details.inputValue;
  emit("inputValueChange", details);
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
  if (props.inputValue === undefined && value !== undefined) {
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
const emitValueChange = (details: ComboboxValueChangeDetails<unknown>) => emit("valueChange", details);
</script>

<template>
  <Combobox.Root
    v-bind="$attrs"
    class="kappa-autocomplete"
    :allow-custom-value="allowCustomValue"
    :always-submit-on-enter="alwaysSubmitOnEnter"
    :as-child="asChild"
    :auto-focus="autoFocus"
    :close-on-select="closeOnSelect"
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
    :id="id"
    :ids="ids"
    :input-behavior="inputBehavior"
    :input-value="resolvedInputValue"
    :invalid="invalid"
    :lazy-mount="lazyMount"
    :loop-focus="loopFocus"
    :model-value="modelValue"
    :name="name"
    :navigate="navigate"
    :open="open"
    :open-on-change="openOnChange"
    :open-on-click="openOnClick"
    :open-on-key-press="openOnKeyPress"
    :placeholder="placeholder"
    :positioning="positioning"
    :read-only="readOnly"
    :required="required"
    :scroll-to-index-fn="scrollToIndexFn"
    :selection-behavior="selectionBehavior"
    :translations="translations"
    :unmount-on-exit="unmountOnExit"
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
    @value-change="emitValueChange"
  >
    <slot v-if="hasCustomContent" :collection="activeCollection" :items="activeCollection.items" />
    <template v-else>
      <AutocompleteLabel v-if="label">{{ label }}</AutocompleteLabel>
      <AutocompleteInputGroup
        :aria-describedby="ariaDescribedby"
        :aria-label="ariaLabel"
        :clearable="clearable"
        :input-attrs="inputAttrs"
        :placeholder="placeholder"
        :show-trigger="showTrigger"
        :size="size"
      />
      <AutocompleteContent>
        <AutocompleteEmpty>{{ emptyText }}</AutocompleteEmpty>
        <AutocompleteList>
          <template #default="{ item }">
            <AutocompleteItem :item="item">
              <slot name="item" :item="item">
                {{ itemToString(item) }}
              </slot>
            </AutocompleteItem>
          </template>
        </AutocompleteList>
      </AutocompleteContent>
    </template>
  </Combobox.Root>
</template>

<style src="./autocomplete.css"></style>
