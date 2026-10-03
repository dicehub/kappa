import assert from "node:assert/strict";
import test from "node:test";
import { validateVersionedRelease } from "./check-release-state.mjs";

const changelog = "# @dicehub/kappa\n\n## 0.3.0\n\n- Publish the package.\n";

test("accepts a synchronized newer release", () => {
  assert.doesNotThrow(() =>
    validateVersionedRelease({
      baseVersion: "0.2.0",
      changelog,
      currentVersion: "0.3.0",
      registryVersion: "0.3.0",
    }),
  );
});

test("rejects stale, invalid, and unsynchronized releases", () => {
  assert.throws(
    () =>
      validateVersionedRelease({
        baseVersion: "0.3.0",
        changelog,
        currentVersion: "0.3.0",
        registryVersion: "0.3.0",
      }),
    /must be newer/,
  );
  assert.throws(
    () =>
      validateVersionedRelease({
        baseVersion: "0.2.0",
        changelog,
        currentVersion: "0.3.0-beta.1",
        registryVersion: "0.3.0-beta.1",
      }),
    /stable semantic version/,
  );
  assert.throws(
    () =>
      validateVersionedRelease({
        baseVersion: "0.2.0",
        changelog,
        currentVersion: "0.3.0",
        registryVersion: "0.2.0",
      }),
    /does not match/,
  );
});
