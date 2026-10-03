import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { createToaster } from "./toast.ts";

const source = (name) => readFileSync(new URL(name, import.meta.url), "utf8");

test("creates independent Ark stores with compact Kappa defaults", () => {
  const first = createToaster();
  const second = createToaster();
  assert.equal(first.attrs.placement, "bottom-end");
  assert.equal(first.attrs.max, Infinity);
  assert.equal(first.attrs.gap, 8);
  assert.equal(first.attrs.duration, 5000);
  assert.equal(first.attrs.removeDelay, 200);
  assert.equal(first.attrs.overlap, true);
  assert.equal(first.attrs.pauseOnPageIdle, true);
  assert.deepEqual(first.attrs.hotkey, ["altKey", "KeyT"]);
  first.create({ id: "first", title: "Saved" });
  assert.equal(first.getCount(), 1);
  assert.equal(second.getCount(), 0);
  first.remove();
});

test("preserves explicit configuration and defaults for undefined values", () => {
  const toaster = createToaster({ placement: "top-start", duration: Infinity, gap: 0, max: 1, overlap: false, pauseOnPageIdle: false, removeDelay: 0 });
  assert.equal(toaster.attrs.placement, "top-start");
  assert.equal(toaster.attrs.duration, Infinity);
  assert.equal(toaster.attrs.gap, 0);
  assert.equal(toaster.attrs.max, 1);
  assert.equal(toaster.attrs.overlap, false);
  assert.equal(toaster.attrs.pauseOnPageIdle, false);
  assert.equal(toaster.attrs.removeDelay, 0);
  assert.equal(createToaster({ placement: undefined, duration: undefined }).attrs.duration, 5000);
});

test("does not queue new notifications behind the oldest three by default", () => {
  const toaster = createToaster();
  for (let number = 1; number <= 6; number++) toaster.create({ id: String(number), title: String(number) });
  assert.deepEqual(toaster.getVisibleToasts().map(toast => toast.id), ["6", "5", "4", "3", "2", "1"]);
  toaster.update("2", { title: "Updated" });
  assert.equal(toaster.getCount(), 6);
  toaster.remove();
  assert.equal(toaster.getCount(), 0);
});

test("keeps Ark create, update, identity, queue, and removal behavior", () => {
  const toaster = createToaster({ max: 1 });
  const id = toaster.create({ id: "job", title: "Preparing", type: "loading" });
  assert.equal(toaster.update(id, { title: "Ready", type: "success" }), id);
  assert.equal(toaster.getCount(), 1);
  assert.equal(toaster.getVisibleToasts()[0].title, "Ready");
  toaster.create({ id: "next", title: "Next" });
  assert.equal(toaster.getCount(), 1);
  toaster.remove(id);
  assert.equal(toaster.getVisibleToasts()[0].id, "next");
  toaster.remove();
  assert.equal(toaster.getCount(), 0);
});

test("retains promise results and errors on the same notification", async () => {
  const toaster = createToaster();
  const success = toaster.promise(Promise.resolve("mesh.zip"), {
    loading: { title: "Uploading" },
    success: (file) => ({ title: `${file} uploaded` }),
    error: { title: "Upload failed" },
  });
  assert.equal(await success.unwrap(), "mesh.zip");
  assert.equal(toaster.getVisibleToasts()[0].id, success.id);
  assert.equal(toaster.getVisibleToasts()[0].type, "success");
  toaster.remove();
  const error = new Error("Unavailable");
  const failure = toaster.promise(Promise.reject(error), {
    loading: { title: "Uploading" }, error: { title: "Upload failed" },
  });
  await assert.rejects(failure.unwrap(), error);
  assert.equal(toaster.getVisibleToasts()[0].type, "error");
  toaster.remove();
});

test("default rendering preserves Ark contexts, options, and safe Vue content", () => {
  const host = source("Toaster.vue");
  assert.match(host, /Toaster as ArkToaster/);
  assert.match(host, /v-bind="\$attrs"/);
  assert.match(host, /<slot v-bind="toast">/);
  assert.match(host, /toast\.closable !== false/);
  assert.match(host, /toast\.action\.label/);
  assert.match(host, /!props\.teleport \|\| !mounted/);
  assert.match(host, /limit: TOAST_DEFAULT_LIMIT/);
  assert.match(source("Toast.vue"), /limited \? \{ \.\.\.\$attrs, inert: true, 'aria-hidden': true \} : \$attrs/);
  assert.match(source("ToastContent.ts"), /\(\) => props\.value/);
  assert.doesNotMatch(host + source("ToastContent.ts"), /v-html|innerHTML/);
});

test("parts forward native attributes and retain primitive actions", () => {
  for (const name of ["Toast", "ToastTitle", "ToastDescription", "ToastActionTrigger", "ToastCloseTrigger"]) {
    const part = source(`${name}.vue`);
    assert.match(part, /v-bind="[^"\n]*\$attrs/);
    assert.match(part, /:as-child="props\.asChild"/);
    assert.match(part, /@ark-ui\/vue\/toast/);
  }
  assert.match(source("ToastIndicator.vue"), /<Loader[^>]+decorative/);
  assert.match(source("index.ts"), /export const Toast = Object.assign/);
});

test("styles preserve stack geometry, focus, semantic themes, and reduced motion", () => {
  const css = source("toast.css");
  for (const token of ["control", "line", "default", "subtle", "success-text", "danger-text", "warning-text", "info-text", "focus", "popover-shadow"]) {
    assert.ok(css.includes(`var(--kappa-${token}`), token);
  }
  assert.match(css, /translate: var\(--x, 0\) var\(--y, 0\)/);
  assert.match(css, /height: var\(--height, var\(--initial-height, auto\)\)/);
  assert.match(css, /--kappa-toast-scale: max\(0\.5, calc\(1 - var\(--index, 0\) \* 0\.05\)\)/);
  assert.match(css, /\(1 - var\(--kappa-toast-scale\)\) \* var\(--kappa-toast-front-height/);
  assert.match(css, /--kappa-toast-height-before/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(css, /data-mode|data-kappa-theme/);
});
