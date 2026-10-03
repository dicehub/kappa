<script setup lang="ts">
import { computed, useId } from "vue";
import { Button } from "../../components/button";
import { DialogLayout } from "../../components/dialog-layout";
import { Empty } from "../../components/empty";
import { Input } from "../../components/input";
import { Loader } from "../../components/loader";
import { SelectionList, createSelectionListCollection } from "../../components/selection-list";
import {
  RESOURCE_PICKER_DEFAULT_LABELS,
  type ResourcePickerEmits,
  type ResourcePickerProps,
  type ResourcePickerSlots,
} from "./resource-picker";
import { useResourcePickerState } from "./use-resource-picker-state";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<ResourcePickerProps>(), {
  title: "Choose a resource",
  open: undefined,
  defaultOpen: false,
  modelValue: undefined,
  defaultValue: () => [],
  selectionMode: "single",
  filterMode: "local",
  loading: false,
  allowEmpty: false,
  disabled: false,
});
const emit = defineEmits<ResourcePickerEmits>();
const slots = defineSlots<ResourcePickerSlots>();
const searchId = `kappa-resource-picker-search-${useId()}`;
const labels = computed(() => ({ ...RESOURCE_PICKER_DEFAULT_LABELS, ...props.labels }));
const { isOpen, query, visibleItems, selected, displayedValue, canConfirm, updateQuery, updateOpen, updateDraft, confirm } = useResourcePickerState(props, emit);
const collection = computed(() => createSelectionListCollection({
  items: visibleItems.value,
  itemToValue: item => item.value,
  itemToString: item => item.label,
  isItemDisabled: item => Boolean(item.disabled),
}));

const initialFocus = () => document.getElementById(searchId);
const retry = () => emit("retry");
</script>

<template>
  <DialogLayout.Root :open="isOpen" :initial-focus-el="initialFocus" @update:open="updateOpen">
    <DialogLayout.Trigger as-child :disabled="props.disabled">
      <slot name="trigger"><Button :disabled="props.disabled" variant="secondary">{{ labels.trigger }}</Button></slot>
    </DialogLayout.Trigger>
    <DialogLayout.Content
      v-bind="$attrs"
      class="kappa-resource-picker"
      data-slot="resource-picker"
      size="lg"
      :close-label="labels.close"
    >
      <DialogLayout.Header>
        <DialogLayout.Title>{{ props.title }}</DialogLayout.Title>
        <DialogLayout.Description v-if="props.description">{{ props.description }}</DialogLayout.Description>
      </DialogLayout.Header>
      <DialogLayout.Body class="kappa-resource-picker__body">
        <SelectionList.Root
          class="kappa-resource-picker__list"
          :collection="collection"
          :model-value="displayedValue"
          :selection-mode="props.selectionMode"
          :disabled="props.disabled"
          :select-on-highlight="false"
          @update:model-value="updateDraft"
        >
          <div class="kappa-resource-picker__search">
            <SelectionList.Input as-child auto-highlight keyboard-priority="navigate">
              <Input
                :id="searchId"
                :model-value="query"
                type="search"
                :aria-label="labels.search"
                :placeholder="labels.searchPlaceholder"
                autocomplete="off"
                @update:model-value="updateQuery"
              />
            </SelectionList.Input>
          </div>
          <div class="kappa-resource-picker__results" :aria-busy="props.loading">
            <div v-if="props.loading" class="kappa-resource-picker__state" role="status">
              <slot name="loading"><Loader decorative size="sm" /><span>{{ labels.loading }}</span></slot>
            </div>
            <div v-else-if="props.error" class="kappa-resource-picker__state" role="alert">
              <slot name="error" :message="props.error" :retry="retry">
                <Empty size="sm">
                  <Empty.Header><Empty.Title>{{ labels.errorTitle }}</Empty.Title><Empty.Description>{{ props.error }}</Empty.Description></Empty.Header>
                  <Empty.Content><Button size="sm" variant="secondary" @click="retry">{{ labels.retry }}</Button></Empty.Content>
                </Empty>
              </slot>
            </div>
            <div v-else-if="!collection.items.length" class="kappa-resource-picker__state" role="status">
              <slot name="empty" :query="query">
                <Empty size="sm"><Empty.Header><Empty.Title>{{ labels.emptyTitle }}</Empty.Title><Empty.Description>{{ labels.emptyDescription }}</Empty.Description></Empty.Header></Empty>
              </slot>
            </div>
            <SelectionList.Content v-else :aria-label="props.title">
              <SelectionList.Item v-for="item in collection.items" :key="item.value" :item="item">
                <SelectionList.ItemMedia v-if="slots.media"><slot name="media" :item="item" /></SelectionList.ItemMedia>
                <SelectionList.ItemContent>
                  <SelectionList.ItemText>{{ item.label }}</SelectionList.ItemText>
                  <SelectionList.ItemDescription v-if="item.description || slots.description"><slot name="description" :item="item">{{ item.description }}</slot></SelectionList.ItemDescription>
                </SelectionList.ItemContent>
                <SelectionList.ItemMeta v-if="item.meta || slots.meta"><slot name="meta" :item="item">{{ item.meta }}</slot></SelectionList.ItemMeta>
                <SelectionList.ItemIndicator />
              </SelectionList.Item>
            </SelectionList.Content>
          </div>
        </SelectionList.Root>
      </DialogLayout.Body>
      <DialogLayout.Actions :dismiss-label="labels.cancel">
        <span class="kappa-resource-picker__selection" role="status"><slot name="selection" :value="selected">{{ labels.selectionCount(selected.length) }}</slot></span>
        <Button :disabled="!canConfirm" size="sm" @click="confirm">{{ labels.confirm }}</Button>
      </DialogLayout.Actions>
    </DialogLayout.Content>
  </DialogLayout.Root>
</template>

<style src="./resource-picker.css"></style>
