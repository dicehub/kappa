import { expect, test, type Page } from "@playwright/test";

const demo = (page: Page, variant = "preview") =>
  page.locator(`[data-inline-copy-text-demo="${variant}"]`);
const button = (page: Page, variant = "preview") =>
  demo(page, variant).locator('[data-slot="inline-copy-text"]');
const icon = (page: Page, variant = "preview") =>
  button(page, variant).locator(".kappa-inline-copy-text__icon");

test.beforeEach(async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/docs/components/inline-copy-text");
  await expect(page.locator("astro-island[ssr]:has([data-inline-copy-text-demo])")).toHaveCount(0);
});

test("documents public imports, navigation, and Markdown", async ({ page, request }) => {
  await expect(page.getByRole("heading", { level: 1, name: "Inline Copy Text" })).toBeVisible();
  await expect(page.locator("#desktop-navigation").getByRole("link", { name: "Inline Copy Text", exact: true }))
    .toHaveAttribute("aria-current", "page");
  await expect(page.getByRole("link", { name: "View Ark UI documentation" }))
    .toHaveAttribute("href", "https://ark-ui.com/docs/components/clipboard");
  await expect(page.getByRole("link", { name: "Previous page: Image Cropper" }))
    .toHaveAttribute("href", "/docs/components/image-cropper");
  await expect(page.getByRole("link", { name: "Next page: Input", exact: true }))
    .toHaveAttribute("href", "/docs/components/input");
  await expect(page.locator(".docs-code-full pre").first())
    .toContainText('@dicehub/kappa/components/inline-copy-text');
  await expect(page.getByRole("complementary", { name: "On this page" }).getByRole("link", { name: "Row hover" }))
    .toHaveAttribute("href", "#row-hover");

  const response = await request.get("/docs/components/inline-copy-text.md");
  expect(response.ok()).toBe(true);
  const markdown = await response.text();
  expect(markdown).toContain("# Inline Copy Text");
  expect(markdown).toContain("data-kappa-copy-group");
  expect(markdown).toContain("InlineCopyTextProps");
  expect(markdown).not.toContain("On this page");
  expect(markdown).not.toContain("View Code");
});

test("copies from the text and keeps layout stable during feedback", async ({ page }) => {
  const control = button(page);
  await expect(control).toHaveAccessibleName("Copy workspace ID: ws_8f2c4a91");
  const before = await control.boundingBox();
  await expect(icon(page)).toHaveCSS("opacity", "0");
  await control.hover();
  await expect(icon(page)).toHaveCSS("opacity", "1");
  await expect(page.getByRole("tooltip")).toHaveText("Copy workspace ID");
  await control.locator('[data-slot="inline-copy-text-value"]').click();
  await expect(control).toHaveAttribute("data-copied", "");
  await expect(control).toHaveAccessibleName("Copied: ws_8f2c4a91");
  await expect(page.getByRole("tooltip")).toHaveText("Copied");
  await expect(demo(page).getByRole("status")).toHaveText("Copied");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("ws_8f2c4a91");
  const after = await control.boundingBox();
  expect(after?.width).toBeCloseTo(before!.width, 1);
  expect(after?.height).toBeCloseTo(before!.height, 1);
});

test("copies the explicit value when display text contains inline markup", async ({ page }) => {
  const control = button(page, "custom");
  await expect(control.locator("strong")).toHaveText("0842");
  await expect(control.locator('[data-slot="inline-copy-text-value"]')).toHaveText("run_0842…");
  await expect(control).toHaveAccessibleName("Copy full run ID: run_0842…");
  await control.click();
  await expect(control).toHaveAccessibleName("Copied: run_0842…");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("run_20261004_0842_eu_central");
});

test("supports keyboard activation, forwarded events, reactive values, and native attributes", async ({ page }) => {
  const container = demo(page, "states");
  const control = container.locator('[data-example="editable-value"]');
  await container.getByRole("textbox", { name: "Job ID" }).fill("job_1024");
  await page.keyboard.press("Tab");
  await expect(control).toBeFocused();
  await expect(control.locator(".kappa-inline-copy-text__icon")).toHaveCSS("opacity", "1");
  await expect(control).toHaveCSS("outline-width", "2px");
  await expect(control).toHaveAttribute("type", "button");
  await page.keyboard.press("Enter");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("job_1024");
  await expect(container.locator("[data-copy-count]")).toHaveText("Copies: 1 · Clicks: 1");
  await page.keyboard.press("Space");
  await expect(container.locator("[data-copy-count]")).toHaveText("Copies: 2 · Clicks: 2");
  await page.keyboard.press("Tab");
  await expect(container.getByRole("button", { name: "Auftrags-ID kopieren" })).toBeFocused();
});

test("resets copied feedback after its timeout and localizes status", async ({ page }) => {
  const now = new Date();
  await page.clock.install({ time: now });
  await page.clock.pauseAt(new Date(now.getTime() + 60_000));
  const container = demo(page, "states");
  const control = container.locator('[data-example="editable-value"]');
  await control.click();
  await expect(control).toHaveAttribute("data-copied", "");
  await expect(container.getByRole("status").first()).toHaveText("Job ID copied");
  await page.clock.runFor(799);
  await expect(control).toHaveAttribute("data-copied", "");
  await page.clock.runFor(1);
  await expect(control).not.toHaveAttribute("data-copied");
  await expect(container.getByRole("status").first()).toBeEmpty();
  await expect(container.locator("[data-copy-count]")).toHaveText("Copies: 1 · Clicks: 1");

  const localized = container.locator('button[lang="de"]');
  await expect(localized).toHaveAttribute("lang", "de");
  await localized.click();
  await expect(localized).toHaveAccessibleName("Kopiert: auftrag_0842");
  await expect(container.getByRole("status").last()).toHaveText("Kopiert");
  await expect(container.getByRole("status").last()).toHaveAttribute("lang", "de");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("auftrag_0842");
  await page.clock.resume();
  await localized.hover();
  await expect(page.getByRole("tooltip")).toHaveText("Kopiert");
  await expect(page.getByRole("tooltip")).toHaveAttribute("lang", "de");
});

test("preserves an inline paragraph before and after hydration", async ({ page, browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const serverPage = await context.newPage();
    await serverPage.goto(page.url());
    const paragraph = demo(serverPage).locator("p");
    await expect(paragraph.locator('[data-slot="inline-copy-text"]')).toHaveCount(1);
    await expect(paragraph).toContainText("in your request.");
    await expect(paragraph.locator("div")).toHaveCount(0);
    await expect(demo(serverPage).locator("p")).toHaveCount(1);
  } finally {
    await context.close();
  }
  await expect(demo(page).locator("p")).toContainText("in your request.");
  await expect(demo(page).locator("p").locator('[data-slot="inline-copy-text"]')).toHaveCount(1);
});

test("reveals row icons on parent hover and focus without triggering a copy", async ({ page }) => {
  const row = demo(page, "row");
  const link = row.getByRole("link", { name: "Simulation workspace" });
  await row.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  await expect(icon(page, "row")).toHaveCSS("opacity", "0");
  await link.hover();
  await expect(icon(page, "row")).toHaveCSS("opacity", "1");
  await page.mouse.move(0, 0);
  await expect(icon(page, "row")).toHaveCSS("opacity", "0");
  await link.focus();
  await expect(icon(page, "row")).toHaveCSS("opacity", "1");
  await expect(button(page, "row")).not.toHaveAttribute("data-copied");
});

test("disabled controls cannot copy and truncated controls copy the full value", async ({ page }) => {
  await page.evaluate(() => navigator.clipboard.writeText("unchanged"));
  const disabled = demo(page, "states").getByRole("button", { name: "Copy pending job ID" });
  await expect(disabled).toBeDisabled();
  await disabled.evaluate((element) => (element as HTMLButtonElement).click());
  await expect(disabled).not.toHaveAttribute("data-copied");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("unchanged");

  const control = demo(page, "styles").getByRole("button", { name: "Copy long run ID" });
  await expect(control).toHaveCSS("max-inline-size", "192px");
  const text = control.locator('[data-slot="inline-copy-text-value"]');
  await expect(text).toHaveCSS("text-overflow", "ellipsis");
  expect(await text.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
  await control.click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("run_20261004_0842_eu_central_simulation");
});

test("uses both themes and supports reduced motion and right-to-left layouts", async ({ page }, testInfo) => {
  const light = await button(page).evaluate((element) => getComputedStyle(element).color);
  await demo(page).screenshot({ path: testInfo.outputPath("inline-copy-light.png") });
  await page.getByRole("button", { name: "Toggle theme" }).filter({ visible: true }).click();
  await expect.poll(() => button(page).evaluate((element) => getComputedStyle(element).color)).not.toBe(light);
  await demo(page).screenshot({ path: testInfo.outputPath("inline-copy-dark.png") });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(() => icon(page).evaluate((element) => Number.parseFloat(getComputedStyle(element).transitionDuration)))
    .toBeLessThanOrEqual(0.00001);
  await button(page).evaluate((element) => element.setAttribute("dir", "rtl"));
  const textBox = await button(page).locator('[data-slot="inline-copy-text-value"]').boundingBox();
  const iconBox = await icon(page).boundingBox();
  expect(iconBox!.x).toBeLessThan(textBox!.x);
});

test("shows copy affordances on touch screens and fits a narrow viewport", async ({ page, browser }, testInfo) => {
  const context = await browser.newContext({
    hasTouch: true,
    isMobile: true,
    viewport: { width: 390, height: 844 },
    permissions: ["clipboard-read", "clipboard-write"],
  });
  try {
    const mobile = await context.newPage();
    await mobile.goto(page.url());
    await expect(mobile.locator("astro-island[ssr]:has([data-inline-copy-text-demo])")).toHaveCount(0);
    await expect(icon(mobile)).toHaveCSS("opacity", "1");
    expect(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await button(mobile).tap();
    await expect(button(mobile)).toHaveAttribute("data-copied", "");
    expect(await mobile.evaluate(() => navigator.clipboard.readText())).toBe("ws_8f2c4a91");
    await mobile.screenshot({ path: testInfo.outputPath("inline-copy-mobile.png") });
  } finally {
    await context.close();
  }
});
