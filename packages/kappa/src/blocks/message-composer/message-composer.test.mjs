import assert from "node:assert/strict";
import { test } from "node:test";
import { isMessageComposerDraftValid, messageComposerKeyAction, resolveMessageComposerLimit } from "./message-composer-helpers.ts";

test("plain Enter sends once while repeat is suppressed", () => {
  assert.equal(messageComposerKeyAction({ key: "Enter" }, true, false), "send");
  assert.equal(messageComposerKeyAction({ key: "Enter", repeat: true }, true, false), "suppress");
  assert.equal(messageComposerKeyAction({ key: "Enter" }, false, false), "native");
  assert.equal(messageComposerKeyAction({ key: "Tab" }, true, false), "native");
});

test("IME composition and modified Enter preserve native input", () => {
  for (const key of ["isComposing", "shiftKey", "altKey", "ctrlKey", "metaKey", "defaultPrevented"]) {
    assert.equal(messageComposerKeyAction({ key: "Enter", [key]: true }, true, false), "native");
  }
  assert.equal(messageComposerKeyAction({ key: "Enter", keyCode: 229 }, true, false), "native");
  assert.equal(messageComposerKeyAction({ key: "Enter" }, true, true), "native");
});

const options = { text: "", files: [], maxLength: 20, maxFiles: 2, maxFileSize: 1024, allowAttachmentsOnly: true, allowAttachments: true };
test("empty and whitespace-only drafts are blocked, attachment-only policy is explicit", () => {
  for (const text of ["", " ", "\n\t"]) assert.equal(isMessageComposerDraftValid({ ...options, text }), false);
  assert.equal(isMessageComposerDraftValid({ ...options, text: "Ready for review." }), true);
  assert.equal(isMessageComposerDraftValid({ ...options, files: [{ size: 5 }] }), true);
  assert.equal(isMessageComposerDraftValid({ ...options, files: [{ size: 5 }], allowAttachmentsOnly: false }), false);
  assert.equal(isMessageComposerDraftValid({ ...options, text: "Comment", files: [{ size: 5 }], allowAttachments: false }), false);
});

test("send rechecks changed text, file count, and file size limits", () => {
  assert.equal(isMessageComposerDraftValid({ ...options, text: "a".repeat(20) }), true);
  assert.equal(isMessageComposerDraftValid({ ...options, text: "a".repeat(21) }), false);
  assert.equal(isMessageComposerDraftValid({ ...options, files: [{ size: 1024 }] }), true);
  assert.equal(isMessageComposerDraftValid({ ...options, files: [{ size: 1025 }] }), false);
  assert.equal(isMessageComposerDraftValid({ ...options, files: [{ size: 1 }, { size: 1 }, { size: 1 }] }), false);
  for (const size of [NaN, Infinity, -1]) assert.equal(isMessageComposerDraftValid({ ...options, files: [{ size }] }), false);
});

test("invalid limits fall back and valid fractional limits round down", () => {
  for (const value of [undefined, NaN, Infinity, -1, 0, "10"]) assert.equal(resolveMessageComposerLimit(value, 5), 5);
  assert.equal(resolveMessageComposerLimit(3.9, 5), 3);
  assert.equal(resolveMessageComposerLimit(0, 1024, 0), 0);
});
