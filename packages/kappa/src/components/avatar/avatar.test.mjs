import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  AVATAR_DEFAULT_SIZE,
  AVATAR_SIZES,
  isAvatarSize,
  resolveAvatarSize,
} from "./avatar.ts";

const source = (name) => readFileSync(new URL(`./${name}`, import.meta.url), "utf8");
const rootSource = source("Avatar.vue");
const imageSource = source("AvatarImage.vue");
const fallbackSource = source("AvatarFallback.vue");
const badgeSource = source("AvatarBadge.vue");
const groupSource = source("AvatarGroup.vue");
const countSource = source("AvatarGroupCount.vue");
const typesSource = source("avatar.ts");
const styles = source("avatar.css");
const moduleBarrel = source("index.ts");

test("defines guarded compact avatar sizes", () => {
  assert.deepEqual(AVATAR_SIZES, ["sm", "default", "lg"]);
  assert.equal(AVATAR_DEFAULT_SIZE, "default");
  for (const size of AVATAR_SIZES) assert.equal(isAvatarSize(size), true);
  for (const value of ["xs", "toString", "constructor", "__proto__", null, 1]) {
    assert.equal(isAvatarSize(value), false);
  }
  assert.equal(resolveAvatarSize("lg"), "lg");
  assert.equal(resolveAvatarSize("missing"), "default");
});

test("preserves Ark root behavior, events, and locale direction", () => {
  assert.match(rootSource, /from "@ark-ui\/vue\/avatar"/);
  assert.match(rootSource, /v-bind="\$attrs"/);
  assert.match(rootSource, /data-slot="avatar"/);
  assert.match(rootSource, /:data-size="resolvedSize"/);
  assert.match(rootSource, /:as-child="props\.asChild"/);
  assert.match(rootSource, /:id="props\.id"/);
  assert.match(rootSource, /:ids="props\.ids"/);
  assert.match(rootSource, /@status-change="emit\('statusChange', \$event\)"/);
  assert.match(rootSource, /LocaleProvider :locale="locale"/);
  assert.match(rootSource, /props\.dir === "rtl" \? "ar" : "en-US"/);
  assert.match(typesSource, /statusChange: \[details: AvatarStatusChangeDetails\]/);
  assert.match(typesSource, /AvatarDirection = "ltr" \| "rtl"/);
});

test("keeps image and fallback mounted under Ark state ownership", () => {
  assert.match(imageSource, /<ArkAvatar\.Image/);
  assert.match(imageSource, /v-bind="\{ \.\.\.\$attrs, \.\.\.props \}"/);
  assert.match(imageSource, /data-slot="avatar-image"/);
  assert.match(typesSource, /Omit<ArkAvatarImageProps, "alt">/);
  assert.match(typesSource, /alt: string/);
  assert.match(fallbackSource, /<ArkAvatar\.Fallback/);
  assert.match(fallbackSource, /data-slot="avatar-fallback"/);
  assert.doesNotMatch(imageSource + fallbackSource, /v-if|v-show/);
});

test("keeps presentational extensions native and attribute-transparent", () => {
  assert.match(badgeSource, /<span v-bind="\$attrs"/);
  assert.match(badgeSource, /data-slot="avatar-badge"/);
  assert.match(groupSource, /<div v-bind="\$attrs"/);
  assert.match(groupSource, /data-slot="avatar-group"/);
  assert.match(countSource, /<div v-bind="\$attrs"/);
  assert.match(countSource, /data-slot="avatar-group-count"/);
  assert.doesNotMatch(badgeSource + groupSource + countSource, /role="(?:status|group|img)"/);
});

test("exports the named and compound API", () => {
  assert.match(moduleBarrel, /export const Avatar = Object\.assign/);
  for (const part of ["Root", "Image", "Fallback", "Badge", "Group", "GroupCount"]) {
    assert.match(moduleBarrel, new RegExp(`${part}: Avatar${part}`));
    assert.match(moduleBarrel, new RegExp(`Avatar${part}`));
  }
  assert.match(moduleBarrel, /AvatarStatusChangeDetails/);
  assert.match(moduleBarrel, /AvatarImageProps/);
});

test("uses logical, themeable, state-safe avatar styling", () => {
  assert.match(styles, /--kappa-avatar-size: 2rem/);
  assert.match(styles, /data-size="sm"/);
  assert.match(styles, /data-size="lg"/);
  assert.match(styles, /object-fit: cover/);
  assert.match(styles, /\[hidden\]/);
  assert.match(styles, /inset-inline-end: 0/);
  assert.match(styles, /margin-inline-start: -0\.5rem/);
  assert.match(styles, /:has\(> \[data-slot="avatar"\]\[data-size="lg"\]\)/);
  assert.match(styles, /:focus-visible/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-)[a-z][\w-]*/);
  assert.doesNotMatch(styles, /(?:margin|padding|border)-(?:left|right)|\b(?:left|right):/);
  assert.doesNotMatch(styles, /#[\da-f]{3,8}(?![^\n]*\))/i);
});
