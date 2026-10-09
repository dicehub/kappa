import assert from "node:assert/strict";
import { test } from "node:test";
import { machine } from "@zag-js/number-input";
import { nextTick } from "vue";
import { createNumberInputMachine } from "./number-input-machine.ts";

test("disposing a Kappa input does not stop a separate Ark input from updating", async (t) => {
  const original = machine.implementations.actions.syncInputElement;
  const request = globalThis.requestAnimationFrame;
  const cancel = globalThis.cancelAnimationFrame;
  const frames = [];
  globalThis.requestAnimationFrame = (callback) => { frames.push(callback); return frames.length; };
  globalThis.cancelAnimationFrame = () => {};
  t.after(() => {
    globalThis.requestAnimationFrame = request;
    globalThis.cancelAnimationFrame = cancel;
    machine.implementations.actions.syncInputElement = original;
  });
  const repair = createNumberInputMachine();
  repair.dispose();
  const input = { value: "12", isConnected: true, setAttribute(name, value) { this[name] = value; } };
  machine.implementations.actions.syncInputElement({
    context: { get: () => "24" },
    event: { type: "VALUE.CHANGE" },
    computed: () => "24",
    scope: { id: "ark", getById: () => input, isActiveElement: () => false },
  });
  await nextTick();
  await nextTick();
  for (const callback of frames) callback();
  assert.equal(input.value, "24");
});
