import { computed, nextTick, ref, watch } from "vue";
import type { ResourcePickerEmits, ResourcePickerProps } from "./resource-picker";

type Emit = <Event extends keyof ResourcePickerEmits>(event: Event, ...args: ResourcePickerEmits[Event]) => void;

/** Private draft state. Resource selection behavior stays in SelectionList. */
export function useResourcePickerState(props: Readonly<ResourcePickerProps>, emit: Emit) {
  const internalOpen = ref(props.defaultOpen ?? false);
  const internalValue = ref([...(props.defaultValue ?? [])]);
  const isOpen = computed(() => props.open ?? internalOpen.value);
  const committedValue = computed(() => props.modelValue ?? internalValue.value);
  const draft = ref<string[]>([]);
  const query = ref("");
  let confirmed = false;

  const available = computed(() => new Map(props.items.map(item => [item.value, item])));
  const normalize = (values: string[]) => {
    const valid = [...new Set(values)].filter(value => {
      const item = available.value.get(value);
      return item ? !item.disabled : props.filterMode === "external";
    });
    return props.selectionMode === "multiple" ? valid : valid.slice(0, 1);
  };

  watch(isOpen, (open, previous) => {
    if (open) {
      confirmed = false;
      // Preserve unknown committed IDs while the consumer loads the results.
      const value = [...new Set(committedValue.value)].filter(id => !available.value.get(id)?.disabled);
      draft.value = props.selectionMode === "multiple" ? value : value.slice(0, 1);
      if (query.value) updateQuery("");
    } else if (previous && !confirmed) {
      emit("cancel");
    }
  }, { immediate: true, flush: "sync" });

  watch(() => props.items.filter(item => item.disabled).map(item => item.value), disabled => {
    const disabledIds = new Set(disabled);
    // Remember loss of eligibility even when a subsequent external result omits the item.
    draft.value = draft.value.filter(value => !disabledIds.has(value));
  }, { immediate: true, flush: "sync" });

  const visibleItems = computed(() => {
    const term = query.value.trim().toLocaleLowerCase();
    return props.filterMode === "external" || !term
      ? props.items
      : props.items.filter(item =>
        [item.label, item.description, item.meta, ...(item.keywords ?? [])]
          .filter(Boolean).join(" ").toLocaleLowerCase().includes(term),
      );
  });
  const selected = computed(() => normalize(draft.value));
  const displayedValue = computed(() => {
    const visible = new Set(visibleItems.value.filter(item => !item.disabled).map(item => item.value));
    return selected.value.filter(value => visible.has(value));
  });
  const canConfirm = computed(() =>
    !props.disabled && !props.loading && !props.error && (Boolean(props.allowEmpty) || selected.value.length > 0),
  );

  function updateQuery(value: string | number) {
    query.value = String(value);
    emit("searchChange", query.value);
  }

  function updateOpen(open: boolean) {
    if (open && props.disabled) return;
    internalOpen.value = open;
    emit("update:open", open);
  }

  function updateDraft(value: string[]) {
    if (props.selectionMode !== "multiple") {
      draft.value = normalize(value);
      return;
    }
    const visibleIds = new Set(visibleItems.value.map(item => item.value));
    draft.value = normalize([...draft.value.filter(id => !visibleIds.has(id)), ...value]);
  }

  function confirm() {
    if (!canConfirm.value) return;
    const value = [...selected.value];
    confirmed = true;
    internalValue.value = value;
    emit("update:modelValue", [...value]);
    emit("confirm", [...value]);
    updateOpen(false);
    // A controlled parent may decline the close request. Later dismissal is cancellation.
    void nextTick(() => { confirmed = false; });
  }

  return { isOpen, query, visibleItems, selected, displayedValue, canConfirm, updateQuery, updateOpen, updateDraft, confirm };
}
