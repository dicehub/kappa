import assert from "node:assert/strict";
import test from "node:test";
import { effectScope, nextTick, reactive } from "vue";
import { useResourcePickerState } from "./use-resource-picker-state.ts";

const first = { value: "first", label: "First resource" };
const second = { value: "second", label: "Second resource" };

function setup(overrides = {}, handleEvent) {
  const props = reactive({ items: [first, second], defaultOpen: true, defaultValue: ["first"], ...overrides });
  const events = [];
  const scope = effectScope();
  const state = scope.run(() => useResourcePickerState(props, (...event) => {
    events.push(event);
    handleEvent?.(props, ...event);
  }));
  return { props, events, state, stop: () => scope.stop() };
}

test("a selected resource that becomes disabled stays removed across external results", () => {
  const { props, state, stop } = setup({ filterMode: "external", selectionMode: "multiple" });
  assert.deepEqual(state.displayedValue.value, ["first"]);
  props.items = [{ ...first, disabled: true }, second];
  assert.deepEqual(state.selected.value, []);
  assert.deepEqual(state.displayedValue.value, []);
  props.items = [second];
  assert.deepEqual(state.selected.value, []);
  assert.equal(state.canConfirm.value, false);
  props.items = [{ ...first }, { ...second }];
  assert.deepEqual(state.displayedValue.value, []);
  stop();
});

test("initial selection survives loading while disabled initial IDs are excluded", () => {
  const { props, state, stop } = setup({ items: [], loading: true });
  assert.deepEqual(state.displayedValue.value, []);
  props.items = [{ ...first }, { ...second }];
  props.loading = false;
  assert.deepEqual(state.selected.value, ["first"]);
  assert.deepEqual(state.displayedValue.value, ["first"]);
  props.items[0].disabled = true;
  assert.deepEqual(state.displayedValue.value, []);
  stop();
});

test("external searches preserve unknown selections without supplying them to the displayed list", () => {
  const { props, state, events, stop } = setup({ filterMode: "external", selectionMode: "multiple" });
  props.items = [second];
  assert.deepEqual(state.selected.value, ["first"]);
  assert.deepEqual(state.displayedValue.value, []);
  state.updateDraft(["second"]);
  assert.deepEqual(state.selected.value, ["first", "second"]);
  state.confirm();
  assert.deepEqual(events.find(([name]) => name === "confirm"), ["confirm", ["first", "second"]]);
  assert.equal(events.some(([name]) => name === "cancel"), false);
  stop();
});

test("later cancellation emits when a controlled parent declines the confirmation close", async () => {
  let refuseClose = true;
  const { state, events, stop } = setup({ open: true }, (props, event, value) => {
    if (event === "update:open" && !refuseClose) props.open = value;
  });
  state.confirm();
  assert.equal(state.isOpen.value, true);
  await nextTick();
  refuseClose = false;
  state.updateOpen(false);
  assert.equal(state.isOpen.value, false);
  assert.equal(events.filter(([name]) => name === "cancel").length, 1);
  stop();
});

test("accepted confirmation close does not also emit cancellation", async () => {
  const { state, events, stop } = setup({ open: true }, (props, event, value) => {
    if (event === "update:open") props.open = value;
  });
  state.confirm();
  await nextTick();
  assert.equal(state.isOpen.value, false);
  assert.equal(events.filter(([name]) => name === "confirm").length, 1);
  assert.equal(events.some(([name]) => name === "cancel"), false);
  stop();
});
