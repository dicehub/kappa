import assert from "node:assert/strict";
import { test } from "node:test";
import { appendXYPlotData, formatXYPlotValue, validateXYPlotData } from "@dicehub/kappa/components/xy-plot";

test("stream append retains aligned newest points and does not mutate caller data", () => {
  const original = [[1, 2, 3], [10, null, 30], [100, 200, 300]];
  const incoming = [[4, 5], [40, 50], [400, null]];
  const before = structuredClone({ original, incoming });
  assert.deepEqual(appendXYPlotData(original, incoming, 3), [[3, 4, 5], [30, 40, 50], [300, 400, null]]);
  assert.deepEqual({ original, incoming }, before);
  assert.equal(validateXYPlotData(original, 2), undefined);
  assert.ok(validateXYPlotData([[1], []], 1));
  assert.ok(validateXYPlotData(original, 1));
  assert.throws(() => appendXYPlotData(original, [[4], [40]]), RangeError);
  for (const limit of [0, -1, NaN, Infinity]) {
    assert.deepEqual(appendXYPlotData(original, incoming, limit)[0], [1, 2, 3, 4, 5]);
  }
});

test("stream bounds hold for independently generated input sizes", () => {
  let seed = 92341;
  const next = () => (seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0);
  for (let attempt = 0; attempt < 80; attempt++) {
    const length = next() % 45, added = next() % 20, limit = 1 + next() % 32;
    const x = Array.from({ length: length + added }, (_, i) => i);
    const result = appendXYPlotData([x.slice(0, length), x.slice(0, length).map(i => i * 2)], [x.slice(length), x.slice(length).map(i => i * 2)], limit);
    const expected = x.slice(Math.max(0, x.length - limit));
    assert.deepEqual(result, [expected, expected.map(i => i * 2)]);
  }
});

test("plot labels retain useful precision for finite small and large values", () => {
  for (const value of [NaN, Infinity, -Infinity]) assert.equal(formatXYPlotValue(value), "—");
  assert.equal(formatXYPlotValue(0.00001), "1.00e-5");
  assert.equal(formatXYPlotValue(-100_000), "-1.00e+5");
  for (const value of [0, -0, 0.001, -0.001, 12345, 12345.6789]) {
    assert.equal(formatXYPlotValue(value), new Intl.NumberFormat(undefined, { maximumSignificantDigits: 5 }).format(value));
  }
});
