import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  ACTIVITY_FEED_DEFAULT_MARKER_VARIANT,
  ACTIVITY_FEED_DEFAULT_SIZE,
  ACTIVITY_FEED_DEFAULT_TONE,
  ACTIVITY_FEED_GROUP_LABEL_DEFAULT_ELEMENT,
  ACTIVITY_FEED_HEADING_ELEMENTS,
  ACTIVITY_FEED_MARKER_VARIANTS,
  ACTIVITY_FEED_SIZES,
  ACTIVITY_FEED_TITLE_DEFAULT_ELEMENT,
  ACTIVITY_FEED_TONES,
  isActivityFeedHeadingElement,
  resolveActivityFeedGroupLabelElement,
  resolveActivityFeedMarkerVariant,
  resolveActivityFeedSize,
  resolveActivityFeedTitleElement,
  resolveActivityFeedTone,
} from "./activity-feed.ts";

const source = (name) => readFileSync(new URL(`./${name}`, import.meta.url), "utf8");
const rootSource = source("ActivityFeed.vue");
const groupSource = source("ActivityFeedGroup.vue");
const groupLabelSource = source("ActivityFeedGroupLabel.vue");
const listSource = source("ActivityFeedList.vue");
const itemSource = source("ActivityFeedItem.vue");
const markerSource = source("ActivityFeedMarker.vue");
const titleSource = source("ActivityFeedTitle.vue");
const timeSource = source("ActivityFeedTime.vue");
const partSources = [
  rootSource,
  groupSource,
  groupLabelSource,
  listSource,
  itemSource,
  markerSource,
  source("ActivityFeedContent.vue"),
  source("ActivityFeedHeader.vue"),
  titleSource,
  source("ActivityFeedDescription.vue"),
  timeSource,
  source("ActivityFeedActions.vue"),
];
const styles = source("activity-feed.css");
const barrel = source("index.ts");

test("defines stable activity feed sizes, tones, markers, and semantic defaults", () => {
  assert.deepEqual(ACTIVITY_FEED_SIZES, ["default", "compact"]);
  assert.deepEqual(ACTIVITY_FEED_TONES, [
    "neutral",
    "accent",
    "success",
    "warning",
    "danger",
  ]);
  assert.deepEqual(ACTIVITY_FEED_MARKER_VARIANTS, ["dot", "icon", "avatar"]);
  assert.deepEqual(ACTIVITY_FEED_HEADING_ELEMENTS, [
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "p",
    "div",
  ]);
  assert.equal(ACTIVITY_FEED_DEFAULT_SIZE, "default");
  assert.equal(ACTIVITY_FEED_DEFAULT_TONE, "neutral");
  assert.equal(ACTIVITY_FEED_DEFAULT_MARKER_VARIANT, "dot");
  assert.equal(ACTIVITY_FEED_GROUP_LABEL_DEFAULT_ELEMENT, "h3");
  assert.equal(ACTIVITY_FEED_TITLE_DEFAULT_ELEMENT, "p");
});

test("rejects unsafe runtime values and resolves public defaults", () => {
  for (const element of ACTIVITY_FEED_HEADING_ELEMENTS) {
    assert.equal(isActivityFeedHeadingElement(element), true);
  }
  for (const value of ["script", "a", "button", "constructor", "__proto__", null, 1]) {
    assert.equal(isActivityFeedHeadingElement(value), false);
  }

  assert.equal(resolveActivityFeedSize("compact"), "compact");
  assert.equal(resolveActivityFeedSize("dense"), "default");
  assert.equal(resolveActivityFeedTone("danger"), "danger");
  assert.equal(resolveActivityFeedTone("brand"), "neutral");
  assert.equal(resolveActivityFeedMarkerVariant("avatar"), "avatar");
  assert.equal(resolveActivityFeedMarkerVariant("image"), "dot");
  assert.equal(resolveActivityFeedGroupLabelElement("h4"), "h4");
  assert.equal(resolveActivityFeedGroupLabelElement("script"), "h3");
  assert.equal(resolveActivityFeedTitleElement("div"), "div");
  assert.equal(resolveActivityFeedTitleElement("span"), "p");
});

test("uses native list, section, and time semantics without a state-machine dependency", () => {
  for (const partSource of partSources) {
    assert.match(partSource, /defineOptions\(\{ inheritAttrs: false \}\)/);
    assert.match(partSource, /v-bind="\$attrs"/);
    assert.match(partSource, /data-slot="activity-feed/);
    assert.doesNotMatch(partSource, /@ark-ui|@zag-js/);
  }

  assert.match(groupSource, /<section/);
  assert.match(listSource, /<ol/);
  assert.match(itemSource, /<li/);
  assert.match(timeSource, /<time/);
  assert.match(timeSource, /:datetime="datetime"/);
  assert.match(groupLabelSource, /resolveActivityFeedGroupLabelElement/);
  assert.match(titleSource, /resolveActivityFeedTitleElement/);
  assert.match(rootSource, /:data-size="resolvedSize"/);
  assert.match(itemSource, /:data-tone="resolvedTone"/);
  assert.match(markerSource, /:data-variant="resolvedVariant"/);
  assert.doesNotMatch(rootSource, /role="feed"/);
});

test("uses semantic Kappa tokens for density, markers, tones, and focus", () => {
  for (const token of [
    "--kappa-accent",
    "--kappa-control",
    "--kappa-danger-text",
    "--kappa-default",
    "--kappa-focus",
    "--kappa-font-sans",
    "--kappa-line",
    "--kappa-subtle",
    "--kappa-success-text",
    "--kappa-warning-text",
  ]) {
    assert.match(styles, new RegExp(token));
  }
  assert.match(styles, /data-size="compact"/);
  assert.match(styles, /border: 1px solid var\(--kappa-activity-feed-border\)/);
  assert.match(styles, /background: var\(--kappa-activity-feed-surface\)/);
  assert.doesNotMatch(styles, /__item:not\(:last-child\)::before/);
  for (const tone of ["accent", "success", "warning", "danger"]) {
    assert.match(styles, new RegExp(`data-tone="${tone}"`));
  }
  for (const variant of ACTIVITY_FEED_MARKER_VARIANTS) {
    assert.match(styles, new RegExp(`data-variant="${variant}"`));
  }
  assert.match(styles, /:focus-visible/);
  assert.match(styles, /forced-colors: active/);
});

test("exports named parts and the compound ActivityFeed API", () => {
  assert.match(barrel, /export const ActivityFeed = Object\.assign/);
  for (const part of [
    "Root",
    "Group",
    "GroupLabel",
    "List",
    "Item",
    "Marker",
    "Content",
    "Header",
    "Title",
    "Description",
    "Time",
    "Actions",
  ]) {
    assert.match(barrel, new RegExp(`${part}: ActivityFeed${part === "Root" ? "Root" : part}`));
  }
  assert.match(barrel, /export \* from "\.\/activity-feed"/);
});
