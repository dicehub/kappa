<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from "vue";
import { NumberInput } from "@dicehub/kappa/components/number-input";
import { Tooltip } from "@dicehub/kappa/components/tooltip";

// Docs-only field composition; not part of the published component API.
const props = defineProps<{ label: string; value: number; readOnly?: boolean }>();
const emit = defineEmits<{ change: [value: number] }>();
const host = ref<HTMLElement | null>(null);
const draft = ref(String(props.value));
const focused = ref(false);
const recentlyEdited = ref(false);
let lastEmitted: number | undefined;
let highlightTimer: ReturnType<typeof setTimeout> | undefined;
let stopRepeat = () => {};
const sensitivity = { control: 100, shift: 0.02, alt: 10 };
const displayValue = (value: number) => {
  const text = String(value);
  if (text.includes("e")) return text;
  const [integer, fraction = ""] = text.split(".");
  return fraction.length > 4 ? `${integer}.${fraction.slice(0, 4)}...` : text;
};

const startStep = (event: PointerEvent, step: () => void) => {
  if (event.button !== 0 || !event.isPrimary || props.readOnly) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  stopRepeat();
  const doc = (event.currentTarget as HTMLElement).ownerDocument;
  const win = doc.defaultView!;
  const started = win.performance.now();
  let frame = 0;
  let active = true;
  const repeat = (now: number) => {
    if (!active) return;
    if (props.readOnly) { stopRepeat(); return; }
    if (now - started > 400) step();
    frame = win.requestAnimationFrame(repeat);
  };
  const release = (up: PointerEvent) => {
    if (up.pointerId !== event.pointerId) return;
    if (!props.readOnly) step();
    stopRepeat();
  };
  const cancel = () => stopRepeat();
  stopRepeat = () => {
    active = false;
    win.cancelAnimationFrame(frame);
    doc.removeEventListener("pointerup", release, true);
    doc.removeEventListener("pointercancel", cancel);
    win.removeEventListener("blur", cancel);
    stopRepeat = () => {};
  };
  doc.addEventListener("pointerup", release, true);
  doc.addEventListener("pointercancel", cancel);
  win.addEventListener("blur", cancel);
  frame = win.requestAnimationFrame(repeat);
};

const publish = (value: number) => {
  if (!Number.isFinite(value) || props.readOnly) return;
  lastEmitted = Math.max(0, value);
  emit("change", lastEmitted);
};

watch(() => props.value, (value) => {
  draft.value = String(value);
  if (value !== lastEmitted) {
    recentlyEdited.value = true;
    clearTimeout(highlightTimer);
    highlightTimer = setTimeout(() => { recentlyEdited.value = false; }, 1000);
  }
  lastEmitted = undefined;
});
onBeforeUnmount(() => { clearTimeout(highlightTimer); stopRepeat(); });

const change = ({ value, valueAsNumber }: { value: string; valueAsNumber: number }) => {
  draft.value = value;
  // Typed text is a draft. Steps and drags update the linked values immediately.
  if (!focused.value || host.value?.querySelector("[data-dragging]")) publish(valueAsNumber);
};
const commit = () => {
  const value = draft.value.trim() === "" ? props.value : Number(draft.value.replace(",", "."));
  publish(Number.isFinite(value) ? value : props.value);
  draft.value = String(Number.isFinite(value) ? Math.max(0, value) : props.value);
  focused.value = false;
};
const finishEditing = (event: KeyboardEvent) => {
  if (event.key !== "Enter" && event.key !== "Escape") return;
  // Both keys save typed text; Escape during a drag still rolls back.
  event.preventDefault();
  event.stopImmediatePropagation();
  (event.target as HTMLInputElement).blur();
};
const normalizeDecimal = (event: Event) => {
  const input = event.target as HTMLInputElement;
  input.value = input.value.replace(",", ".");
  draft.value = input.value;
};
const allowDecimalComma = (event: InputEvent) => {
  const input = event.target as HTMLInputElement;
  const next = input.value.slice(0, input.selectionStart ?? 0) + (event.data ?? "")
    + input.value.slice(input.selectionEnd ?? input.value.length);
  if (next.includes(",") && /^-?\d*(?:\.\d*)?$/.test(next.replace(",", "."))) {
    // Let the native edit happen; normalize before Ark parses the subsequent input event.
    event.stopImmediatePropagation();
  }
};
</script>

<template>
  <div ref="host" class="kappa-compact-number-row" :data-recently-edited="recentlyEdited ? '' : undefined">
    <NumberInput.Root
      class="kappa-compact-number-field"
      size="xs"
      :model-value="draft"
      :min="0"
      :step="1"
      :read-only="readOnly"
      :focus-input-on-change="false"
      :format-options="{ useGrouping: false, maximumFractionDigits: 20 }"
      @value-change="change"
    >
      <NumberInput.Label>{{ label }}</NumberInput.Label>
      <NumberInput.Context v-slot="api">
        <Tooltip.Root :open-delay="500" :close-delay="0" :disabled="focused" :positioning="{ placement: 'right' }">
          <Tooltip.Trigger as-child value="field">
            <div class="kappa-compact-number-anchor">
              <NumberInput.Control>
                <NumberInput.DecrementTrigger
                  :aria-label="`Decrease ${label}`"
                  tabindex="-1"
                  @pointerdown.capture="startStep($event, api.decrement)"
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24"><path transform="rotate(270 12 12)" d="M18.786 13.507l-1.131 1.508L12 11.246l-5.655 3.769-1.131-1.508 5.655-3.768 1.13-.754 1.132.754 5.655 3.768z" fill="currentColor" /></svg>
                </NumberInput.DecrementTrigger>
                <NumberInput.ScrubbableInput
                  v-slot="{ valueAsNumber }"
                  :scrub-sensitivity="sensitivity"
                  edit-alignment="start"
                  @blur="commit"
                  @focus="focused = true"
                  @input.capture="normalizeDecimal"
                  @beforeinput.capture="allowDecimalComma"
                  @keydown.capture="finishEditing"
                >{{ displayValue(valueAsNumber) }}</NumberInput.ScrubbableInput>
                <NumberInput.IncrementTrigger
                  :aria-label="`Increase ${label}`"
                  tabindex="-1"
                  @pointerdown.capture="startStep($event, api.increment)"
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24"><path transform="rotate(90 12 12)" d="M18.786 13.507l-1.131 1.508L12 11.246l-5.655 3.769-1.131-1.508 5.655-3.768 1.13-.754 1.132.754 5.655 3.768z" fill="currentColor" /></svg>
                </NumberInput.IncrementTrigger>
              </NumberInput.Control>
            </div>
          </Tooltip.Trigger>
          <Tooltip.Content :show-arrow="false">{{ value }}</Tooltip.Content>
        </Tooltip.Root>
      </NumberInput.Context>
    </NumberInput.Root>
  </div>
</template>
