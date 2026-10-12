import assert from "node:assert/strict";
import { test } from "node:test";
import { createSSRApp, h } from "vue";
import { renderToString } from "vue/server-renderer";
import { Button, Badge, Input, Link, Text, Dialog, DialogHeader, DialogLayout, ActivityFeed } from "@dicehub/kappa";

const render = async (component, props = {}, text = "Consumer content") => (await renderToString(createSSRApp({ render: () => h(component, props, () => text) }))).replace(/<!--.*?-->/gs, "");

test("Dialog and DialogLayout retain their own public header behavior when used together", async () => {
  const named = await render(DialogHeader);
  assert.equal(await render(Dialog.Header), named);
  assert.notEqual(await render(DialogLayout.Header), named);
});

test("server output exposes safe native button defaults and forwards accessible attributes", async () => {
  const html = await render(Button, { id: "save", "aria-label": "Save username", "data-consumer": "owned" });
  assert.match(html, /<button\b/);
  assert.match(html, /type="button"/);
  assert.match(html, /aria-label="Save username"/);
  assert.match(html, /id="save"/);
  assert.match(html, /data-consumer="owned"/);
  assert.match(html, /data-variant="secondary"/);
  assert.match(html, /data-size="base"/);
  assert.match(html, /data-shape="base"/);
  assert.match(html, />Consumer content</);
  const invalid = await render(Button, { type: "invalid", size: "invalid", variant: "invalid", shape: "invalid" });
  assert.match(invalid, /type="button"/);
  for (const attribute of ["data-size", "data-variant", "data-shape"]) {
    const match = html.match(new RegExp(`${attribute}="([^"]+)"`));
    assert.ok(match, attribute);
    assert.ok(invalid.includes(match[0]), `Untyped invalid ${attribute} must retain the default.`);
  }
  const loading = await render(Button, { loading: true, type: "submit" });
  assert.match(loading, /\bdisabled(?:[ >]|="")/);
  assert.match(loading, /aria-busy="true"/);
});

test("form controls keep native names, values, validation and password-manager attributes", async () => {
  const html = await render(Input, { name: "username", modelValue: "Ros <script>", required: true, invalid: true, passwordManagerIgnore: true, "aria-describedby": "hint", autocomplete: "off" });
  for (const expected of ['name="username"', 'value="Ros &lt;script&gt;"', 'aria-invalid="true"', 'aria-describedby="hint"', 'data-1p-ignore="true"', 'autocomplete="off"']) assert.ok(html.includes(expected), expected);
  assert.match(html, /\brequired(?:[ >]|="")/);
});

test("external links preserve consumer rel tokens and add safe opener protection", async () => {
  const html = await render(Link, { href: "https://example.invalid/docs", external: true, rel: "license" });
  assert.match(html, /target="_blank"/);
  const tokens = html.match(/rel="([^"]+)"/)[1].split(/\s+/);
  for (const token of ["license", "noopener", "noreferrer"]) assert.ok(tokens.includes(token), token);
  assert.match(await render(Link, { href: "/docs" }), /href="\/docs"/);
});

test("presentational components preserve semantic tags and escape consumer text", async () => {
  const payload = '<img src=x onerror="alert(1)">';
  const badge = await render(Badge, { as: "invalid", variant: "invalid", title: "State" }, payload);
  assert.match(badge, /^<span\b/);
  assert.ok(badge.includes("&lt;img"));
  assert.ok(!badge.includes("<img"));
  const heading = await render(Text, { as: "h2", variant: "heading" }, "Settings");
  assert.match(heading, /^<h2\b/);
  assert.match(heading, />Settings<\/h2>/);
  const feed = (await renderToString(createSSRApp({ render: () => h(ActivityFeed.Root, {}, () =>
    h(ActivityFeed.Group, {}, () => [
      h(ActivityFeed.GroupLabel, {}, () => "Today"),
      h(ActivityFeed.List, {}, () => h(ActivityFeed.Item, {}, () => [
        h(ActivityFeed.Marker),
        h(ActivityFeed.Content, {}, () => h(ActivityFeed.Title, {}, () => "Report ready")),
      ])),
    ])),
  }))).replace(/<!--.*?-->/gs, "");
  assert.match(feed, /data-size="default"/);
  assert.match(feed, /data-tone="neutral"/);
  assert.match(feed, /data-variant="dot"/);
  assert.match(feed, /<h3\b[^>]*>Today<\/h3>/);
  assert.match(feed, /<p\b[^>]*>Report ready<\/p>/);
  assert.match(feed, /<ol\b/);
  assert.match(feed, /<li\b/);
});
