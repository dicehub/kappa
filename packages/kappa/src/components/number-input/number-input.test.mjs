import assert from "node:assert/strict";

import { test } from "node:test";
import { addNumberInputDecimalSteps } from "./number-input-decimal.ts";

test("preserves decimal and scientific-notation scrub steps", () => {
  assert.equal(addNumberInputDecimalSteps(0.2, 0.1, 1), 0.3);
  assert.equal(addNumberInputDecimalSteps(0.35, 0.001, 29), 0.379);
  assert.equal(addNumberInputDecimalSteps(0, 1e-13, 1), 1e-13);
  assert.equal(addNumberInputDecimalSteps(1e-13, 1e-13, -1), 0);
});
