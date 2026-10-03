import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  ATTACHMENT_ACTION_DEFAULT_TYPE,
  ATTACHMENT_BUTTON_TYPES,
  ATTACHMENT_DEFAULT_ORIENTATION,
  ATTACHMENT_DEFAULT_SIZE,
  ATTACHMENT_DEFAULT_STATE,
  ATTACHMENT_MEDIA_DEFAULT_VARIANT,
  ATTACHMENT_MEDIA_VARIANTS,
  ATTACHMENT_ORIENTATIONS,
  ATTACHMENT_SIZES,
  ATTACHMENT_STATES,
  ATTACHMENT_TRIGGER_DEFAULT_ELEMENT,
  ATTACHMENT_TRIGGER_DEFAULT_TYPE,
  ATTACHMENT_TRIGGER_ELEMENTS,
  isAttachmentButtonType,
  isAttachmentMediaVariant,
  isAttachmentOrientation,
  isAttachmentSize,
  isAttachmentState,
  isAttachmentTriggerElement,
  resolveAttachmentButtonType,
  resolveAttachmentMediaVariant,
  resolveAttachmentOrientation,
  resolveAttachmentSize,
  resolveAttachmentState,
  resolveAttachmentTriggerElement,
} from "./attachment.ts";

const source = (name) =>
  readFileSync(new URL(`./${name}`, import.meta.url), "utf8");

const rootSource = source("Attachment.vue");
const mediaSource = source("AttachmentMedia.vue");
const contentSource = source("AttachmentContent.vue");
const titleSource = source("AttachmentTitle.vue");
const descriptionSource = source("AttachmentDescription.vue");
const actionsSource = source("AttachmentActions.vue");
const actionSource = source("AttachmentAction.vue");
const triggerSource = source("AttachmentTrigger.vue");
const groupSource = source("AttachmentGroup.vue");
const styles = source("attachment.css");
const moduleBarrel = source("index.ts");

test("defines the attachment state, density, orientation, media, and native element contracts", () => {
  assert.deepEqual(ATTACHMENT_STATES, [
    "idle",
    "uploading",
    "processing",
    "error",
    "done",
  ]);
  assert.deepEqual(ATTACHMENT_SIZES, ["default", "sm", "xs"]);
  assert.deepEqual(ATTACHMENT_ORIENTATIONS, ["horizontal", "vertical"]);
  assert.deepEqual(ATTACHMENT_MEDIA_VARIANTS, ["icon", "image"]);
  assert.deepEqual(ATTACHMENT_BUTTON_TYPES, ["button", "submit", "reset"]);
  assert.deepEqual(ATTACHMENT_TRIGGER_ELEMENTS, ["button", "a"]);
  assert.equal(ATTACHMENT_DEFAULT_STATE, "done");
  assert.equal(ATTACHMENT_DEFAULT_SIZE, "default");
  assert.equal(ATTACHMENT_DEFAULT_ORIENTATION, "horizontal");
  assert.equal(ATTACHMENT_MEDIA_DEFAULT_VARIANT, "icon");
  assert.equal(ATTACHMENT_ACTION_DEFAULT_TYPE, "button");
  assert.equal(ATTACHMENT_TRIGGER_DEFAULT_ELEMENT, "button");
  assert.equal(ATTACHMENT_TRIGGER_DEFAULT_TYPE, "button");
});

test("rejects unsupported runtime values and resolves safe defaults", () => {
  for (const state of ATTACHMENT_STATES) assert.equal(isAttachmentState(state), true);
  for (const size of ATTACHMENT_SIZES) assert.equal(isAttachmentSize(size), true);
  for (const orientation of ATTACHMENT_ORIENTATIONS) {
    assert.equal(isAttachmentOrientation(orientation), true);
  }
  for (const variant of ATTACHMENT_MEDIA_VARIANTS) {
    assert.equal(isAttachmentMediaVariant(variant), true);
  }
  for (const type of ATTACHMENT_BUTTON_TYPES) assert.equal(isAttachmentButtonType(type), true);
  for (const element of ATTACHMENT_TRIGGER_ELEMENTS) {
    assert.equal(isAttachmentTriggerElement(element), true);
  }

  for (const value of ["missing", "toString", "constructor", "__proto__", null, 1]) {
    assert.equal(isAttachmentState(value), false);
    assert.equal(isAttachmentSize(value), false);
    assert.equal(isAttachmentOrientation(value), false);
    assert.equal(isAttachmentMediaVariant(value), false);
    assert.equal(isAttachmentButtonType(value), false);
    assert.equal(isAttachmentTriggerElement(value), false);
  }

  assert.equal(resolveAttachmentState("uploading"), "uploading");
  assert.equal(resolveAttachmentState("complete"), "done");
  assert.equal(resolveAttachmentSize("xs"), "xs");
  assert.equal(resolveAttachmentSize("lg"), "default");
  assert.equal(resolveAttachmentOrientation("vertical"), "vertical");
  assert.equal(resolveAttachmentOrientation("diagonal"), "horizontal");
  assert.equal(resolveAttachmentMediaVariant("image"), "image");
  assert.equal(resolveAttachmentMediaVariant("video"), "icon");
  assert.equal(resolveAttachmentButtonType("reset"), "reset");
  assert.equal(resolveAttachmentButtonType("menu"), "button");
  assert.equal(resolveAttachmentTriggerElement("a"), "a");
  assert.equal(resolveAttachmentTriggerElement("router-link"), "button");
});

test("renders a guarded native root and forwards consumer attributes", () => {
  assert.match(rootSource, /defineOptions\(\{ inheritAttrs: false \}\)/);
  assert.match(rootSource, /<div\s+v-bind="\$attrs"\s+class="kappa-attachment"/);
  assert.match(rootSource, /resolveAttachmentState\(props\.state\)/);
  assert.match(rootSource, /resolveAttachmentSize\(props\.size\)/);
  assert.match(rootSource, /resolveAttachmentOrientation\(props\.orientation\)/);
  assert.match(rootSource, /:data-state="resolvedState"/);
  assert.match(rootSource, /:data-size="resolvedSize"/);
  assert.match(rootSource, /:data-orientation="resolvedOrientation"/);
  assert.doesNotMatch(rootSource, /@ark-ui|@zag-js/);
});

test("keeps all presentational parts native and attribute-transparent", () => {
  for (const partSource of [
    mediaSource,
    contentSource,
    actionsSource,
    groupSource,
  ]) {
    assert.match(partSource, /defineOptions\(\{ inheritAttrs: false \}\)/);
    assert.match(partSource, /v-bind="\$attrs"/);
    assert.match(partSource, /<div/);
    assert.doesNotMatch(partSource, /@ark-ui|@zag-js/);
  }
  for (const inlinePartSource of [titleSource, descriptionSource]) {
    assert.match(inlinePartSource, /defineOptions\(\{ inheritAttrs: false \}\)/);
    assert.match(inlinePartSource, /v-bind="\$attrs"/);
    assert.match(inlinePartSource, /<span/);
    assert.doesNotMatch(inlinePartSource, /@ark-ui|@zag-js/);
  }
  assert.match(mediaSource, /resolveAttachmentMediaVariant\(props\.variant\)/);
  assert.match(mediaSource, /data-slot="attachment-media"/);
  assert.match(groupSource, /data-slot="attachment-group"/);
});

test("implements Action as a guarded, disabled native button", () => {
  assert.match(actionSource, /defineOptions\(\{ inheritAttrs: false \}\)/);
  assert.match(actionSource, /<button\s+v-bind="\$attrs"/);
  assert.match(actionSource, /:disabled="disabled"/);
  assert.match(actionSource, /:type="resolvedType"/);
  assert.match(actionSource, /resolveAttachmentButtonType\(props\.type\)/);
  assert.match(actionSource, /data-slot="attachment-action"/);
  assert.doesNotMatch(actionSource, /@ark-ui|\.\.\/button/);
});

test("implements Trigger as a guarded button or anchor behind card actions", () => {
  assert.match(triggerSource, /defineOptions\(\{ inheritAttrs: false \}\)/);
  assert.match(triggerSource, /:is="resolvedElement"/);
  assert.match(triggerSource, /v-bind="\$attrs"/);
  assert.match(triggerSource, /resolveAttachmentTriggerElement\(props\.as\)/);
  assert.match(triggerSource, /resolveAttachmentButtonType\(props\.type\)/);
  assert.match(triggerSource, /resolvedElement === 'button' \? resolvedType : undefined/);
  assert.match(triggerSource, /kappa-attachment__trigger-label/);
  assert.match(styles, /\.kappa-attachment__trigger \{[\s\S]*position: absolute/);
  assert.match(styles, /\.kappa-attachment__trigger \{[\s\S]*z-index: 1/);
  assert.match(styles, /\.kappa-attachment__actions \{[\s\S]*z-index: 2/);
  assert.match(styles, /\.kappa-attachment__actions \{[\s\S]*pointer-events: none/);
  assert.match(styles, /\.kappa-attachment__actions > \* \{[\s\S]*pointer-events: auto/);
});

test("exports the complete named and compound component surface", () => {
  assert.match(moduleBarrel, /export const Attachment = Object\.assign/);
  for (const part of [
    "Root",
    "Media",
    "Content",
    "Title",
    "Description",
    "Actions",
    "Action",
    "Trigger",
    "Group",
  ]) {
    assert.match(moduleBarrel, new RegExp(`${part}: Attachment${part === "Root" ? "Root" : part}`));
  }
  for (const name of [
    "AttachmentRootProps",
    "AttachmentMediaProps",
    "AttachmentActionProps",
    "AttachmentTriggerProps",
    "AttachmentState",
    "AttachmentSize",
    "AttachmentOrientation",
    "AttachmentMediaVariant",
  ]) {
    assert.match(moduleBarrel, new RegExp(name));
  }
});

test("styles the complete state, size, layout, accessibility, and motion contract", () => {
  assert.match(styles, /var\(--kappa-control/);
  assert.match(styles, /var\(--kappa-line/);
  assert.match(styles, /var\(\s*--kappa-info-text/);
  assert.match(styles, /var\(--kappa-danger-text/);
  assert.match(styles, /\[data-state="idle"\][\s\S]*border-style: dashed/);
  assert.match(styles, /\[data-state="error"\]/);
  assert.match(styles, /\[data-state="uploading"\] \.kappa-attachment__title/);
  assert.match(styles, /\[data-state="processing"\] \.kappa-attachment__title/);
  assert.match(styles, /@keyframes kappa-attachment-title-shimmer/);
  assert.match(styles, /\.kappa-attachment--sm/);
  assert.match(styles, /\.kappa-attachment--xs/);
  assert.match(styles, /\[data-orientation="vertical"\]/);
  assert.match(styles, /\.kappa-attachment__media--image/);
  assert.match(styles, /text-overflow: ellipsis/);
  assert.match(styles, /\.kappa-attachment__action:focus-visible/);
  assert.match(styles, /\.kappa-attachment__action:disabled/);
  assert.match(styles, /scroll-snap-type: inline mandatory/);
  assert.match(styles, /scroll-snap-align: start/);
  assert.match(styles, /overscroll-behavior-inline: contain/);
  assert.match(styles, /\.kappa-attachment-group:focus-visible/);
  assert.match(styles, /\.kappa-attachment__media > picture > img/);
  assert.match(styles, /inline-size: fit-content/);
  assert.match(styles, /min-inline-size: 10rem/);
  assert.match(styles, /flex-wrap: wrap/);
  assert.match(styles, /scrollbar-width: none/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-)[a-z][\w-]*/);
});
