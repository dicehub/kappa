<script setup lang="ts">
import { Listbox } from "@ark-ui/vue/listbox";
import { createGridCollection } from "@ark-ui/vue/collection";
import { computed, ref, watch } from "vue";
import { filterDisabledSelection, resolveDragSelectionColumns, type DragSelectionProps, type DragSelectionEmits, type DragSelectionSlots } from "./drag-selection";
import { useDragSelection } from "./use-drag-selection";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<DragSelectionProps>(), {
  columns: 3, defaultValue: () => [], autoScroll: true, threshold: 6, emptyLabel: "No items",
});
const emit = defineEmits<DragSelectionEmits>();
defineSlots<DragSelectionSlots>();
const internalValue = ref([...props.defaultValue]);
const selected = computed(() => props.modelValue ?? internalValue.value);
watch(() => props.modelValue, value => {
  if (value !== undefined) internalValue.value = [...value];
}, { immediate: true });
const selectedSet = computed(() => new Set(selected.value));
const viewport = ref<HTMLElement>();
const columns = computed(() => resolveDragSelectionColumns(props.columns));
const collection = computed(() => createGridCollection({ items: props.items, columnCount: columns.value }));

function change(value: string[]) {
  const unchanged = value.length === selected.value.length && value.every((id, i) => selected.value[i] === id);
  internalValue.value = [...value];
  if (unchanged) return;
  emit("update:modelValue", [...value]);
  emit("valueChange", { value: [...value] });
}

const { rectangle, dragging, pointerdown, click, interactive } = useDragSelection(props, viewport, selected, change,
  (event, canceled) => event === "start" ? emit("dragStart") : emit("dragEnd", { value: [...internalValue.value], canceled: !!canceled }));
const rectangleStyle = computed(() => rectangle.value && ({
  left: `${rectangle.value.x}px`, top: `${rectangle.value.y}px`,
  width: `${rectangle.value.width}px`, height: `${rectangle.value.height}px`,
}));
</script>

<template>
  <Listbox.Root v-bind="$attrs" :collection="collection" :model-value="selected" :disabled="props.disabled"
    selection-mode="extended" class="kappa-drag-selection" data-slot="drag-selection"
    :data-dragging="dragging ? '' : undefined" :style="{ '--kappa-drag-selection-columns': columns }"
    @update:model-value="value => change(filterDisabledSelection(value, props.items, selected))">
    <Listbox.Content as-child :aria-label="props.label">
      <div ref="viewport" class="kappa-drag-selection__viewport" data-slot="drag-selection-viewport"
        @pointerdown.capture="pointerdown" @click.capture="click" @dragstart.prevent
        @mousedown.capture="event => { if (interactive(event.target)) event.stopPropagation(); }">
        <Listbox.Item v-for="item in props.items" :key="item.value" :item="item" :highlight-on-hover="false"
          class="kappa-drag-selection__item" data-slot="drag-selection-item" data-kappa-drag-item>
          <slot name="item" :item="item" :selected="selectedSet.has(item.value)">
            <Listbox.ItemText>{{ item.label }}</Listbox.ItemText>
          </slot>
        </Listbox.Item>
        <div v-if="!props.items.length" class="kappa-drag-selection__empty" data-slot="drag-selection-empty"><slot name="empty">{{ props.emptyLabel }}</slot></div>
        <div v-if="rectangle" class="kappa-drag-selection__rectangle" data-slot="drag-selection-rectangle" :style="rectangleStyle" aria-hidden="true" />
      </div>
    </Listbox.Content>
  </Listbox.Root>
</template>

<style src="./drag-selection.css"></style>
