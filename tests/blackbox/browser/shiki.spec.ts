import { test, expect, visitConsumer } from "./fixtures";

const typescriptAsset = /\/_astro\/typescript\.[^/]+\.js$/;

test("a failed language download ends loading, reports an error and permits another language", async ({ page }) => {
  await page.route(typescriptAsset, route => route.fulfill({ status: 503, body: "Unavailable" }));
  await visitConsumer(page, "/test-consumer/shiki");
  const failed = page.waitForResponse(response => typescriptAsset.test(response.url()) && response.status() === 503);
  await page.getByRole("button", { name: "Show TypeScript", exact: true }).click();
  await failed;
  await expect(page.getByRole("alert")).toContainText("Highlighting unavailable:");
  await expect(page.getByLabel("Highlighter loading")).toHaveText("false");
  await expect(page.getByLabel("Highlighter ready")).toHaveText("false");
  await expect(page.getByLabel("Plain source")).toHaveText("const answer = 42;");

  await page.getByRole("button", { name: "Show Python", exact: true }).click();
  await expect(page.getByLabel("Highlighter ready")).toHaveText("true");
  await expect(page.getByLabel("Highlighter loading")).toHaveText("false");
  await expect(page.getByRole("alert")).toHaveCount(0);
  await expect(page.getByLabel("Highlighted source")).toHaveText("answer = 42");
});

test("a superseded download failure cannot replace a ready language with an error", async ({ page }) => {
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  await page.route(typescriptAsset, async route => {
    await gate;
    await route.fulfill({ status: 503, body: "Unavailable" });
  });
  try {
    await visitConsumer(page, "/test-consumer/shiki");
    const active = page.getByRole("region", { name: "Active highlighter", exact: true });
    const pending = page.waitForRequest(typescriptAsset);
    await page.getByRole("button", { name: "Show TypeScript", exact: true }).click();
    await pending;
    await expect(active.getByLabel("Highlighter loading")).toHaveText("true");
    await expect(active.getByLabel("Highlighter ready")).toHaveText("false");
    await page.getByRole("button", { name: "Show second TypeScript highlighter", exact: true }).click();
    const witness = page.getByRole("region", { name: "Waiting highlighter", exact: true });
    await expect(witness.getByLabel("Highlighter loading")).toHaveText("true");
    await page.getByRole("button", { name: "Show Python", exact: true }).click();
    await expect(active.getByLabel("Highlighter ready")).toHaveText("true");
    release();
    // A second real provider proves that the shared import failure was handled.
    await expect(witness.getByRole("alert")).toContainText("Highlighting unavailable:");
    await expect(witness.getByLabel("Highlighter loading")).toHaveText("false");
    await expect(active.getByLabel("Highlighted source")).toHaveText("answer = 42");
    await expect(active.getByLabel("Highlighter loading")).toHaveText("false");
    await expect(active.getByLabel("Highlighter ready")).toHaveText("true");
    await expect(active.getByRole("alert")).toHaveCount(0);
  } finally { release(); }
});
