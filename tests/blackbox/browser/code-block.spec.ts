import { test, expect, visitConsumer } from "./fixtures";

test("plain output needs no provider, escapes HTML, and copies updated hidden lines without loading Shiki", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  const assets: string[] = [];
  const warnings: string[] = [];
  page.on("request", request => {
    if (/\/(?:typescript|github-light|vesper|oniguruma)\.[^/]+\.js(?:\?|$)/.test(request.url())) assets.push(request.url());
  });
  page.on("console", message => {
    if (["warning", "error"].includes(message.type())) warnings.push(message.text());
  });
  await visitConsumer(page, "/test-consumer/code-block-plain");
  const region = page.getByRole("region", { name: "Plain build output", exact: true });
  const source = '$ pnpm build\n\n<script>window.unsafe = true</script>\nBuild complete.';
  await expect(region.locator(".shiki")).toHaveCount(0);
  await expect(region).toContainText("<script>window.unsafe = true</script>");
  expect(await page.evaluate(() => Reflect.get(window, "unsafe"))).toBeUndefined();
  await page.getByRole("button", { name: "Copy output", exact: true }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(source);
  await page.getByRole("button", { name: "Set a language hint" }).click();
  await page.getByRole("button", { name: "Append output" }).click();
  await page.getByRole("button", { name: /Copy output|Output copied/ }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(source + "\nAll checks passed.");
  await page.getByRole("button", { name: "Expand code", exact: true }).click();
  await expect(region.locator('[data-slot="code-block-line-number"]')).toHaveText(["1", "2", "3", "4", "5"]);
  await expect(region.locator(".shiki")).toHaveCount(0);
  expect(assets).toEqual([]);
  expect(warnings).toEqual([]);
});

test("plain language choices stay unhighlighted inside a ready provider without warnings", async ({ page }) => {
  const warnings: string[] = [];
  page.on("console", message => {
    if (message.type() === "warning") warnings.push(message.text());
  });
  await visitConsumer(page, "/test-consumer/code-block");
  const highlighted = page.getByRole("region", { name: "Controlled source", exact: true });
  await expect(highlighted.locator(".shiki")).toBeVisible();
  const plain = page.getByRole("region", { name: "Plain source", exact: true });
  for (let choice = 0; choice < 3; choice += 1) {
    await expect(plain).toHaveText("const unhighlighted = true;");
    await expect(plain.locator(".shiki")).toHaveCount(0);
    if (choice < 2) await page.getByRole("button", { name: "Change plain language" }).click();
  }
  expect(warnings).toEqual([]);
});

test("controlled previews follow requests, source changes and preview size; legacy imports keep working", async ({ page }) => {
  await visitConsumer(page, "/test-consumer/code-block");
  const block = page.getByRole("region", { name: "Controlled block", exact: true });
  const region = block.getByRole("region", { name: "Controlled source", exact: true });
  const expand = block.getByRole("button", { name: "Expand code", exact: true });
  await expect(expand).toHaveAttribute("aria-expanded", "false");
  await expect(region).not.toHaveAttribute("tabindex", "0");
  await expect.poll(async () => (await region.boundingBox())!.height).toBeGreaterThan(200);
  const controls = await expand.getAttribute("aria-controls");
  const content = page.locator(`[id="${controls}"]`);
  await expect.poll(async () => Math.round((await content.boundingBox())!.height)).toBe(84);
  const defaultExpand = page.getByRole("region", { name: "Default preview", exact: true })
    .getByRole("button", { name: "Expand code", exact: true });
  const defaultContent = page.locator(`[id="${await defaultExpand.getAttribute("aria-controls")}"]`);
  await expect.poll(async () => Math.round((await defaultContent.boundingBox())!.height)).toBe(224);

  await page.getByRole("button", { name: "Toggle collapse feature" }).click();
  await expect(expand).toHaveCount(0);
  await expect(region).toHaveAttribute("tabindex", "0");
  await page.getByRole("button", { name: "Toggle collapse feature" }).click();
  await expect(expand).toHaveAttribute("aria-expanded", "false");

  await page.getByRole("button", { name: "Toggle externally" }).click();
  await expect(block.getByRole("button", { name: "Collapse code" })).toHaveAttribute("aria-expanded", "true");
  await expect(region).toHaveAttribute("tabindex", "0");
  await block.getByRole("button", { name: "Collapse code" }).click();
  await expect(page.getByLabel("Requested state")).toHaveText("false");
  await expand.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByLabel("Requested state")).toHaveText("true");
  await expect(block.getByRole("button", { name: "Collapse code" })).toBeFocused();
  await page.keyboard.press("Space");
  await expect(page.getByLabel("Requested state")).toHaveText("false");

  await page.getByRole("button", { name: "Change preview size" }).click();
  await expect(block.getByRole("button", { name: /Expand code|Collapse code/ })).toHaveCount(0);
  await expect(region).toHaveAttribute("tabindex", "0");
  await page.getByRole("button", { name: "Change preview size" }).click();
  await expect(expand).toBeVisible();
  await page.getByRole("button", { name: "Change source length" }).click();
  await expect(block.getByRole("button", { name: /Expand code|Collapse code/ })).toHaveCount(0);
  await expect(region).toHaveText("const short = true;");
  await page.getByRole("button", { name: "Change source length" }).click();
  await expect(expand).toHaveAttribute("aria-expanded", "false");
  const legacy = page.getByRole("region", { name: "Legacy block", exact: true });
  await expect(legacy.getByRole("button", { name: "Hide source" })).toHaveAttribute("aria-expanded", "true");
  await legacy.getByRole("button", { name: "Hide source" }).click();
  await expect(legacy.getByRole("button", { name: "Show source" })).toHaveAttribute("aria-expanded", "false");
});

test("plain output keeps collapse and full-source copying when highlighting cannot load", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  const language = /\/_astro\/typescript\.[^/]+\.js$/;
  await page.route(language, route => route.fulfill({ status: 503, body: "Unavailable" }));
  const failed = page.waitForResponse(response => language.test(response.url()) && response.status() === 503);
  await visitConsumer(page, "/test-consumer/code-block");
  await failed;
  const block = page.getByRole("region", { name: "Controlled block", exact: true });
  const expand = block.getByRole("button", { name: "Expand code", exact: true });
  await expect(expand).toHaveAttribute("aria-expanded", "false");
  await expect(block.locator("pre")).toContainText("const row14 = 14;");
  await expect(block.locator(".shiki")).toHaveCount(0);
  await block.getByRole("button", { name: "Copy", exact: true }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    Array.from({ length: 14 }, (_, index) => `const row${index + 1} = ${index + 1};`).join("\n"),
  );
  await expand.click();
  await expect(block.getByRole("button", { name: "Collapse code" })).toHaveAttribute("aria-expanded", "true");
});

test("a wrapped single line gains a footer on narrow screens and stays readable when resized", async ({ page }) => {
  await visitConsumer(page, "/test-consumer/code-block");
  const block = page.getByRole("region", { name: "Wrapped single line", exact: true });
  const expand = block.getByRole("button", { name: "Expand code", exact: true });
  await expect(expand).toHaveCount(0);
  await page.setViewportSize({ width: 320, height: 844 });
  await expect(expand).toHaveAttribute("aria-expanded", "false");
  const content = page.locator(`[id="${await expand.getAttribute("aria-controls")}"]`);
  await expect.poll(async () => Math.round((await content.boundingBox())!.height)).toBe(44);
  const preview = await content.boundingBox();
  const footer = await expand.boundingBox();
  expect(footer!.y).toBeGreaterThanOrEqual(preview!.y + preview!.height - 1);
  expect(footer!.width).toBeCloseTo(preview!.width, 0);
  await expand.click();
  await expect(block.getByRole("button", { name: "Collapse code" })).toHaveAttribute("aria-expanded", "true");
  const region = block.getByRole("region", { name: "Code block", exact: true });
  await expect.poll(() => region.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(block.getByRole("button", { name: /Expand code|Collapse code/ })).toHaveCount(0);
  await expect(region).toHaveAttribute("tabindex", "0");
});

test("an ordinary code block preserves an outer collapsible context in its header actions", async ({ page }) => {
  await visitConsumer(page, "/test-consumer/code-block");
  const block = page.getByRole("region", { name: "Outer collapse control", exact: true });
  const outer = block.getByRole("button", { name: "Toggle outer content", exact: true });
  const action = block.getByRole("button", { name: "Toggle from code header", exact: true });
  await expect(outer).toHaveAttribute("aria-expanded", "true");
  await action.click();
  await expect(outer).toHaveAttribute("aria-expanded", "false");
  await expect(block.getByText("Outer details", { exact: true })).toBeHidden();
  await action.press("Enter");
  await expect(outer).toHaveAttribute("aria-expanded", "true");
  await expect(block.getByText("Outer details", { exact: true })).toBeVisible();
});
