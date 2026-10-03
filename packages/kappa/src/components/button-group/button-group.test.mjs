import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  BUTTON_GROUP_DEFAULT_ORIENTATION,
  BUTTON_GROUP_ORIENTATIONS,
  BUTTON_GROUP_SEPARATOR_DEFAULT_ORIENTATION,
  isButtonGroupOrientation,
  resolveButtonGroupOrientation,
  resolveButtonGroupSeparatorOrientation,
} from "./button-group.ts";

const rootSource = readFileSync(new URL("./ButtonGroup.vue", import.meta.url), "utf8");
const separatorSource = readFileSync(
  new URL("./ButtonGroupSeparator.vue", import.meta.url),
  "utf8",
);
const textSource = readFileSync(new URL("./ButtonGroupText.vue", import.meta.url), "utf8");
const styles = readFileSync(new URL("./button-group.css", import.meta.url), "utf8");
const barrel = readFileSync(new URL("./index.ts", import.meta.url), "utf8");

test("defines guarded layout orientations", () => {
  assert.deepEqual(BUTTON_GROUP_ORIENTATIONS, ["horizontal", "vertical"]);
  assert.equal(BUTTON_GROUP_DEFAULT_ORIENTATION, "horizontal");
  assert.equal(BUTTON_GROUP_SEPARATOR_DEFAULT_ORIENTATION, "vertical");

  for (const orientation of BUTTON_GROUP_ORIENTATIONS) {
    assert.equal(isButtonGroupOrientation(orientation), true);
  }
  for (const value of ["missing", "constructor", "toString", "__proto__", null, 1]) {
    assert.equal(isButtonGroupOrientation(value), false);
  }

  assert.equal(resolveButtonGroupOrientation("missing"), "horizontal");
  assert.equal(resolveButtonGroupSeparatorOrientation("missing"), "vertical");
  assert.equal(resolveButtonGroupSeparatorOrientation("horizontal"), "horizontal");
});

test("renders a fixed semantic group and forwards consumer attributes", () => {
  assert.match(rootSource, /defineOptions\(\{ inheritAttrs: false \}\)/);
  assert.match(rootSource, /v-bind="\$attrs"/);
  assert.match(rootSource, /v-bind="\$attrs"[\s\S]*role="group"/);
  assert.match(rootSource, /data-slot="button-group"/);
  assert.match(rootSource, /:data-orientation="resolvedOrientation"/);
  assert.match(rootSource, /role="group"/);
  assert.doesNotMatch(rootSource, /keydown|tabindex|aria-orientation/);
});

test("keeps text composable and separators semantic", () => {
  assert.match(textSource, /import \{ ark \} from "@ark-ui\/vue\/factory"/);
  assert.match(textSource, /:as-child="props\.asChild"/);
  assert.match(textSource, /data-slot="button-group-text"/);

  assert.match(separatorSource, /role="separator"/);
  assert.match(separatorSource, /:aria-orientation="resolvedOrientation"/);
  assert.match(separatorSource, /data-slot="button-group-separator"/);
  assert.doesNotMatch(separatorSource, /tabindex/);
});

test("uses flat logical seams and preserves focus", () => {
  assert.match(styles, /inline-size: fit-content/);
  assert.match(styles, /max-inline-size: 100%/);
  assert.match(styles, /> input\[data-slot\][\s\S]*flex: 1 1 auto/);
  assert.match(styles, /border-inline-start-width/);
  assert.match(styles, /border-inline-end-width/);
  assert.match(styles, /border-block-start-width/);
  assert.match(styles, /border-block-end-width/);
  assert.match(styles, /border-start-start-radius/);
  assert.match(styles, /border-end-end-radius/);
  assert.match(styles, /--kappa-button-radius/);
  assert.match(styles, /:focus-visible[\s\S]*z-index: 2/);
  assert.match(styles, /\[aria-invalid="true"\][\s\S]*z-index: 2/);
  assert.match(styles, /:has\(> \[data-slot="button-group"\]\)[\s\S]*gap: 0\.5rem/);
  assert.match(styles, /> \.kappa-button:active[\s\S]*transform: none/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /linear-gradient|radial-gradient|box-shadow|drop-shadow/);
  assert.doesNotMatch(
    styles,
    /margin-left|margin-right|padding-left|padding-right|border-left|border-right/,
  );
});

test("exports the complete named and compound surface", () => {
  assert.match(barrel, /Object\.assign\(ButtonGroupRoot/);
  assert.match(barrel, /Root: ButtonGroupRoot/);
  assert.match(barrel, /Separator: ButtonGroupSeparator/);
  assert.match(barrel, /Text: ButtonGroupText/);
  for (const name of [
    "ButtonGroupRoot",
    "ButtonGroupSeparator",
    "ButtonGroupText",
    "BUTTON_GROUP_ORIENTATIONS",
    "resolveButtonGroupSeparatorOrientation",
    "ButtonGroupProps",
    "ButtonGroupSeparatorProps",
    "ButtonGroupTextProps",
  ]) {
    assert.match(barrel, new RegExp(name));
  }
});
