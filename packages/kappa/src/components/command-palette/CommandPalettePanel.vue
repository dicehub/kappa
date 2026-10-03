<script setup lang="ts">
import {
  Combobox,
  createListCollection,
  type ComboboxHighlightChangeDetails,
  type ComboboxInputValueChangeDetails,
  type ComboboxSelectionDetails,
} from "@ark-ui/vue/combobox";
import { computed, getCurrentInstance, ref, watch } from "vue";
import {
  getCommandPaletteItemValue,
  isCommandPaletteRecord,
  matchesCommandPaletteItem,
  stringifyCommandPaletteItem,
  type CommandPaletteHighlightReason,
  type CommandPalettePanelEmits,
  type CommandPalettePanelProps,
  type CommandPaletteSelectOptions,
  type CommandPaletteSlots,
} from "./command-palette";
import { provideCommandPaletteContext } from "./command-palette-context";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<CommandPalettePanelProps>(), {
  filter: undefined,
  items: () => [],
  open: true,
});
const emit = defineEmits<CommandPalettePanelEmits>();
defineSlots<CommandPaletteSlots>();

const vnodeProps = getCurrentInstance()?.vnode.props ?? {};
const hasValueProp = Object.prototype.hasOwnProperty.call(vnodeProps, "value");
const internalValue = ref(props.value ?? props.defaultValue ?? "");
const highlightedValue = ref<string | null>(null);
const highlightedItem = ref<unknown>();
const highlightReason = ref<CommandPaletteHighlightReason>("reset");

const stringifyItem = (item: unknown) =>
  stringifyCommandPaletteItem(item, props.itemToStringValue);
const itemToValue = (item: unknown) =>
  getCommandPaletteItemValue(item, props.itemToValue, props.itemToStringValue);
const isItemDisabled = (item: unknown) =>
  props.isItemDisabled?.(item) ??
  (isCommandPaletteRecord(item) && item.disabled === true);
const inputValue = computed(() => (hasValueProp ? props.value ?? "" : internalValue.value));
const open = computed(() => props.open ?? true);

const items = computed(() => {
  const source = props.items ?? [];
  if (props.getSelectableItems || props.filter === false) return source;
  return source.filter((item) =>
    matchesCommandPaletteItem({
      filter: props.filter,
      item,
      itemToStringValue: props.itemToStringValue,
      query: inputValue.value,
    }),
  );
});
const selectableItems = computed(() => props.getSelectableItems?.(items.value) ?? items.value);
const collection = computed(() =>
  createListCollection({
    isItemDisabled,
    itemToString: stringifyItem,
    itemToValue,
    items: selectableItems.value,
  }),
);
const resolvedHighlightedValue = computed(() => highlightedValue.value ?? undefined);

const findItemByValue = (value: string) =>
  selectableItems.value.find((item) => itemToValue(item) === value);
const setInputValue = (value: string) => {
  if (!hasValueProp) internalValue.value = value;
  emit("update:value", value);
  emit("valueChange", value);
};
const selectItem = (item: unknown, options: CommandPaletteSelectOptions) => {
  if (isItemDisabled(item)) return;
  emit("select", item, options);
};
const selectHighlightedItem = (options: CommandPaletteSelectOptions) => {
  if (highlightedItem.value !== undefined) selectItem(highlightedItem.value, options);
};
const noteHighlightReason = (reason: CommandPaletteHighlightReason) => {
  highlightReason.value = reason;
};

const handleInputValueChange = (details: ComboboxInputValueChangeDetails) => {
  if (details.reason !== "item-select") setInputValue(details.inputValue);
};
const handleHighlightChange = (details: ComboboxHighlightChangeDetails<unknown>) => {
  const item = details.highlightedItem ?? undefined;
  highlightedItem.value = item;
  highlightedValue.value = details.highlightedValue;
  emit("itemHighlighted", item, {
    index: item === undefined ? -1 : selectableItems.value.indexOf(item),
    reason: item === undefined ? "reset" : highlightReason.value,
  });
};
const handleSelect = (details: ComboboxSelectionDetails) => {
  const item = findItemByValue(details.itemValue);
  if (item !== undefined) selectItem(item, { newTab: false });
};

provideCommandPaletteContext({
  close: () => emit("close"),
  collection,
  inputValue,
  items,
  noteHighlightReason,
  open,
  selectHighlightedItem,
  selectItem,
  selectableItems,
  stringifyItem,
});

watch(
  [selectableItems, open],
  () => {
    if (!open.value) {
      highlightedItem.value = undefined;
      highlightedValue.value = null;
      highlightReason.value = "reset";
      return;
    }
    if (
      highlightedValue.value &&
      selectableItems.value.some((item) => itemToValue(item) === highlightedValue.value)
    ) {
      highlightedItem.value = findItemByValue(highlightedValue.value);
      return;
    }
    const firstItem = selectableItems.value.find((item) => !isItemDisabled(item));
    highlightedItem.value = firstItem;
    highlightedValue.value = firstItem === undefined ? null : itemToValue(firstItem);
    highlightReason.value = "reset";
  },
  { immediate: true },
);

watch(
  () => props.value,
  (value) => {
    if (hasValueProp) internalValue.value = value ?? "";
  },
);
</script>

<template>
  <Combobox.Root
    v-bind="$attrs"
    class="kappa-command-palette"
    :allow-custom-value="true"
    :auto-focus="false"
    :close-on-select="false"
    :collection="collection"
    :disable-layer="true"
    :highlighted-value="resolvedHighlightedValue"
    input-behavior="autohighlight"
    :input-value="inputValue"
    :loop-focus="true"
    :model-value="[]"
    :open="open"
    :open-on-click="false"
    :open-on-key-press="true"
    selection-behavior="preserve"
    @highlight-change="handleHighlightChange"
    @input-value-change="handleInputValueChange"
    @select="handleSelect"
    @update:highlighted-value="highlightedValue = $event"
  >
    <slot
      :collection="collection"
      :items="items"
      :selectable-items="selectableItems"
      :value="inputValue"
    />
  </Combobox.Root>
</template>

<style src="./command-palette.css"></style>
