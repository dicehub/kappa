import assert from "node:assert/strict";
import { test } from "node:test";
import { extractReleaseNotes } from "./release-notes.mjs";

test("extracts one exact changelog version", () => {
  const changelog = "# Package\n\n## 0.3.0\n\n- New package.\n\n## 0.2.0\n\n- Old package.\n";
  assert.equal(extractReleaseNotes(changelog, "0.3.0"), "## 0.3.0\n\n- New package.\n");
});

test("fails when the requested version is absent", () => {
  assert.throws(() => extractReleaseNotes("# Package\n", "0.3.0"), /no section for 0\.3\.0/);
});
