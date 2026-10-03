import assert from "node:assert/strict";
import test from "node:test";
import { effectScope, nextTick, reactive } from "vue";
import { useFileBrowserState } from "./use-file-browser-state.ts";
import { fileBrowserNameError, filterFileBrowserItems, formatFileBrowserDate, formatFileBrowserSize, validateFileBrowserItems } from "./file-browser-logic.ts";

const folder = { id: "docs", name: "Documents", kind: "folder" };
const alpha = { id: "a", name: "alpha.txt", kind: "file", size: 20 };
const beta = { id: "b", name: "beta.txt", kind: "file", size: 2 };
const child = { id: "c", name: "notes.txt", kind: "file", parentId: "docs" };
const tick = async () => { await nextTick(); await new Promise(setImmediate); };
function setup(overrides = {}) {
  const props = reactive({ items: [folder, alpha, beta, child], selectionMode: "multiple", ...overrides });
  const events = [];
  const scope = effectScope();
  const state = scope.run(() => useFileBrowserState(props, (...event) => events.push(event)));
  state.activate();
  return { props, state, events, stop: () => scope.stop() };
}
function deferred() {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

test("sorts folders first, filters names, and keeps the source unchanged", () => {
  const source = [beta, alpha, folder];
  assert.deepEqual(filterFileBrowserItems(source, "", "size", "desc").map(item => item.id), ["docs", "a", "b"]);
  assert.deepEqual(filterFileBrowserItems(source, " ALP ", "name", "asc"), [alpha]);
  assert.deepEqual(source, [beta, alpha, folder]);
});
test("validates names and source IDs without imposing host-specific case rules", () => {
  for (const name of ["", " ", ".", "..", "a/b", "a\\b", "line\nbreak"]) assert.equal(fileBrowserNameError(name, []), "invalidName");
  assert.equal(fileBrowserNameError("alpha.txt", [alpha]), "duplicateName");
  assert.equal(fileBrowserNameError("alpha.txt", [alpha], "a"), null);
  assert.equal(fileBrowserNameError("Alpha.txt", [alpha]), null);
  assert.throws(() => validateFileBrowserItems([alpha, alpha]));
  assert.throws(() => validateFileBrowserItems([{ id: "a", name: "x", kind: "device" }]));
});
test("formats deterministic dates and missing sizes", () => {
  assert.equal(formatFileBrowserSize(1500), "1.5 kB");
  assert.equal(formatFileBrowserSize(0), "0 B");
  assert.equal(formatFileBrowserSize(-1), "—");
  assert.equal(formatFileBrowserDate("not a date"), "—");
  assert.equal(formatFileBrowserDate("2026-09-22T23:00:00Z", "en-US"), "Sep 22, 2026");
});
test("navigates folders, clears selection/search, and emits file activation", async () => {
  const { state, events, stop } = setup();
  state.select("a", true);
  state.query.value = "alpha";
  state.open(folder);
  assert.equal(state.folderId.value, "docs");
  assert.deepEqual(state.items.value, [child]);
  assert.equal(state.query.value, "");
  assert.deepEqual(state.selected.value, []);
  state.open(child);
  assert.equal(events.find(([name]) => name === "open")[1].id, "c");
  state.goTo(0);
  assert.equal(state.folderId.value, null);
  stop();
});
test("select-all affects visible enabled rows and preserves filtered selections", () => {
  const { state, stop } = setup({ items: [alpha, beta, { ...folder, disabled: true }] });
  state.select("b", true);
  state.query.value = "alpha";
  state.selectAll(true);
  assert.deepEqual(state.selected.value.map(item => item.id), ["b", "a"]);
  state.selectAll(false);
  assert.deepEqual(state.selected.value.map(item => item.id), ["b"]);
  state.query.value = "";
  state.selectAll(true);
  assert.deepEqual(state.selected.value.map(item => item.id), ["a", "b"]);
  stop();
});
test("removed or disabled static selections do not return when the item returns", async () => {
  const { props, state, events, stop } = setup({ defaultValue: ["a"] });
  props.items = [{ ...alpha, disabled: true }, beta];
  await tick();
  props.items = [alpha, beta];
  await tick();
  assert.deepEqual(state.selected.value, []);
  assert.ok(events.some(([event, ids]) => event === "update:modelValue" && ids.length === 0));
  stop();
});
test("controlled selection emits a request and respects the supplied value", () => {
  const { state, events, stop } = setup({ modelValue: ["b", "a"], selectionMode: "single" });
  assert.deepEqual(state.selected.value.map(item => item.id), ["b"]);
  state.select("a", true);
  assert.deepEqual(state.selected.value.map(item => item.id), ["b"]);
  assert.deepEqual(events.at(-1), ["update:modelValue", ["a"]]);
  stop();
});
test("newer folder results win even when an old loader ignores cancellation", async () => {
  const calls = [];
  const { state, stop } = setup({ loadFolder: (id, { signal }) => { const pending = deferred(); calls.push({ id, signal, ...pending }); return pending.promise; } });
  await tick();
  calls[0].resolve([folder]); await tick();
  state.open(folder); await tick();
  assert.equal(calls[1].id, "docs");
  state.goTo(0); await tick();
  assert.equal(calls[1].signal.aborted, true);
  calls[2].resolve([alpha]); await tick();
  calls[1].resolve([child]); await tick();
  assert.deepEqual(state.items.value, [alpha]);
  assert.equal(state.loading.value, false);
  stop();
});
test("load errors are recoverable and disposal cancels work", async () => {
  let fail = true;
  let signal;
  const pending = deferred();
  const { state, stop } = setup({ loadFolder: async (_id, context) => { signal = context.signal; if (fail) throw new Error("Connection lost"); return pending.promise; } });
  await tick();
  assert.equal(state.error.value, "Connection lost");
  fail = false;
  const retry = state.refresh();
  assert.equal(state.error.value, "");
  stop();
  assert.equal(signal.aborted, true);
  pending.resolve([alpha]); await retry;
  assert.deepEqual(state.items.value, []);
});
test("rename errors remain in the dialog, and a retry commits through the host", async () => {
  let fail = true;
  const calls = [];
  const { props, state, events, stop } = setup({ renameItem: async (item, name, context) => {
    calls.push({ item, name, context });
    if (fail) throw new Error("Name reserved");
    props.items = props.items.map(value => value.id === item.id ? { ...value, name } : value);
  } });
  state.openNameDialog("rename", alpha);
  state.name.value = "renamed.txt";
  await tick();
  await state.submitName();
  assert.equal(state.formError.value, "Name reserved");
  assert.equal(state.dialog.value.mode, "rename");
  assert.equal(state.busy.value, false);
  fail = false;
  await state.submitName();
  assert.equal(state.dialog.value, null);
  assert.equal(calls[1].context.folderId, null);
  assert.equal(state.items.value.find(item => item.id === "a").name, "renamed.txt");
  assert.ok(events.some(([event, data]) => event === "complete" && data.operation === "rename"));
  stop();
});
test("pending mutations cannot be submitted twice or dismissed", async () => {
  const pending = deferred();
  let count = 0;
  const { state, stop } = setup({ createFolder: () => { count++; return pending.promise; } });
  state.openNameDialog("create"); state.name.value = "Reports";
  const task = state.submitName();
  await state.submitName();
  state.closeDialog();
  state.open(folder);
  assert.equal(state.dialog.value.mode, "create");
  assert.equal(state.folderId.value, null);
  assert.equal(count, 1);
  pending.resolve(); await task;
  assert.equal(state.dialog.value, null);
  stop();
});
test("custom action errors are exposed and disabled actions cannot run", async () => {
  let count = 0;
  const { state, stop } = setup({ actions: () => [{ id: "details", label: "Details" }, { id: "delete", label: "Delete", disabled: true }], runAction: async () => { count++; throw new Error("Action failed"); } });
  await state.runAction("delete", alpha);
  await state.runAction("unknown", alpha);
  assert.equal(count, 0);
  await state.runAction("details", alpha);
  assert.equal(count, 1);
  assert.equal(state.actionError.value, "Action failed");
  assert.equal(state.busy.value, false);
  stop();
});
test("root changes abort mutations even while the browser is disabled", async () => {
  const pending = deferred();
  let signal;
  const { props, state, stop } = setup({ createFolder: (_name, context) => { signal = context.signal; return pending.promise; } });
  state.openNameDialog("create"); state.name.value = "Reports";
  const task = state.submitName();
  props.disabled = true; props.rootId = "other-root";
  await tick();
  assert.equal(signal.aborted, true);
  assert.equal(state.folderId.value, "other-root");
  assert.equal(state.dialog.value, null);
  pending.resolve(); await task;
  assert.equal(state.message.value, "");
  stop();
});
