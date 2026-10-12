import assert from "node:assert/strict";
import { test } from "node:test";
import { normalizeCodeHighlightedLanguage } from "@dicehub/kappa/components/code-highlighted";

test("language normalization resolves public aliases and rejects inherited object keys", () => {
  for (const [input, expected] of [["typescript", "typescript"], ["ts", "typescript"],
    ["sh", "bash"], ["py", "python"], ["md", "markdown"], ["vue", "vue"]]) {
    assert.equal(normalizeCodeHighlightedLanguage(input), expected, input);
  }
  for (const input of ["cobol", "__proto__", "constructor", "toString", "hasOwnProperty"]) {
    assert.equal(normalizeCodeHighlightedLanguage(input), null, input);
  }
});
