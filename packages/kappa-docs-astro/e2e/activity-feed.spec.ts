import { expect, type Locator, test } from "@playwright/test";

const demo = (variant: string) => `[data-activity-feed-demo="${variant}"]`;

async function expectBottomCenteredDisclosure(card: Locator) {
  const position = await card.evaluate((element) => {
    const cardBox = element.getBoundingClientRect();
    const buttonBox = element.querySelector("button")!.getBoundingClientRect();
    const timeBox = element.querySelector("time")!.getBoundingClientRect();
    const contentBox = element.querySelector('[data-slot="collapsible-content"]')!.getBoundingClientRect();
    return {
      centerOffset: Math.abs(buttonBox.x + buttonBox.width / 2 - cardBox.x - cardBox.width / 2),
      belowTime: buttonBox.top > timeBox.bottom,
      belowContent: !contentBox.height || buttonBox.top >= contentBox.bottom,
      bottomInset: cardBox.bottom - parseFloat(getComputedStyle(element).borderBottomWidth) - buttonBox.bottom,
      timeTop: timeBox.top - cardBox.top,
      timeEnd: cardBox.right - timeBox.right,
    };
  });
  expect(position.centerOffset).toBeLessThan(1);
  expect(position.belowTime).toBe(true);
  expect(position.belowContent).toBe(true);
  expect(position.bottomInset).toBeCloseTo(4, 1);
  expect(position.timeTop).toBeLessThan(32);
  expect(position.timeEnd).toBeLessThan(24);
}

test("Activity Feed documentation renders semantic groups, events, markers, and tones", async ({
  page,
  request,
}) => {
  await page.goto("/docs/components/activity-feed");

  await expect(page.getByRole("heading", { level: 1, name: "Activity Feed" })).toBeVisible();
  await expect(page.getByText("Planned documentation")).toHaveCount(0);

  const preview = page.locator(demo("preview"));
  await expect(preview.getByRole("region", { name: "Today" })).toBeVisible();
  await expect(preview.getByRole("list", { name: "Project activity" })).toHaveCount(1);
  await expect(preview.getByRole("listitem")).toHaveCount(3);
  await expect(preview.locator("time").first()).toHaveAttribute("datetime", "2026-09-19T14:32:00Z");

  const compact = page.locator(`${demo("compact")} [data-slot="activity-feed"]`);
  await expect(compact).toHaveAttribute("data-size", "compact");

  expect(
    await page
      .locator(`${demo("markers")} [data-slot="activity-feed-marker"]`)
      .evaluateAll((elements) => elements.map((element) => element.getAttribute("data-variant"))),
  ).toEqual(["dot", "icon", "avatar"]);

  expect(
    await page
      .locator(`${demo("tones")} [data-slot="activity-feed-item"]`)
      .evaluateAll((elements) => elements.map((element) => element.getAttribute("data-tone"))),
  ).toEqual(["neutral", "accent", "success", "warning", "danger"]);

  const actions = page.locator(demo("actions"));
  await expect(actions.getByRole("button", { name: "Open comment" })).toBeVisible();
  await expect(actions.getByRole("button", { name: "Resolve" })).toBeVisible();

  await expect(page.locator('#composition [data-composition-tree="activity-feed"]')).toContainText(
    "ActivityFeed.Marker",
  );
  await expect(page.locator("pre[data-language]").first()).toContainText(
    'from "@dicehub/kappa/components/activity-feed"',
  );

  const response = await request.get("/docs/components/activity-feed.md");
  expect(response.ok()).toBe(true);
  expect(await response.text()).toContain("ActivityFeedMarkerVariant");
});

test("Activity Feed keeps avatar fallbacks visible when portraits fail", async ({ page }) => {
  await page.route("**/avatars/*.webp", (route) => route.fulfill({ status: 404, body: "" }));
  await page.goto("/docs/components/activity-feed");
  const preview = page.locator(demo("preview"));
  await expect(preview.getByRole("list")).toHaveCSS("display", "flex");
  for (const marker of await preview.locator('[data-variant="avatar"]').all()) {
    const image = marker.locator('[data-slot="avatar-image"]');
    const fallback = marker.locator('[data-slot="avatar-fallback"]');
    await expect(image).toHaveAttribute("hidden", "");
    await expect(image).toHaveCSS("display", "none");
    await expect(fallback).toBeVisible();
    expect(await marker.evaluate((element) => {
      const markerBox = element.getBoundingClientRect();
      const fallbackBox = element.querySelector('[data-slot="avatar-fallback"]')!.getBoundingClientRect();
      return fallbackBox.top >= markerBox.top && fallbackBox.bottom <= markerBox.bottom;
    })).toBe(true);
  }
});

for (const theme of ["light", "dark"] as const) {
  test(`Activity Feed loads styles and aligns markers in ${theme} mode`, async ({ page }) => {
    await page.addInitScript((mode) => localStorage.setItem("theme", mode), theme);
    await page.goto("/docs/components/activity-feed");

    const preview = page.locator(demo("preview"));
    await expect(preview.getByRole("list")).toHaveCSS("display", "flex");
    await expect(preview.getByRole("list")).toHaveCSS("list-style-type", "none");
    await expect(preview.getByRole("listitem").first()).toHaveCSS("display", "grid");
    await expect(preview.locator('[data-slot="activity-feed-title"]').first()).toHaveCSS("margin", "0px");

    const portraits = preview.locator('[data-slot="avatar-image"]');
    await expect(portraits).toHaveCount(2);
    for (const portrait of await portraits.all()) {
      await expect(portrait).toBeVisible();
      expect(await portrait.evaluate((image) => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    }

    for (const variant of ["markers", "tones"]) {
      const example = page.locator(demo(variant));
      const expectedSize = variant === "markers" ? 38 : 28;
      const metrics = await example.getByRole("listitem").evaluateAll((items) =>
        items.map((item) => {
          const marker = item.querySelector('[data-slot="activity-feed-marker"]')!.getBoundingClientRect();
          const title = item.querySelector('[data-slot="activity-feed-title"]')!.getBoundingClientRect();
          return {
            markerWidth: marker.width,
            markerHeight: marker.height,
            centerOffset: Math.abs(marker.y + marker.height / 2 - title.y - title.height / 2),
            itemHeight: item.getBoundingClientRect().height,
            contentFollowsMarker: title.left > marker.right,
          };
        }),
      );
      for (const metric of metrics) {
        expect(metric.markerWidth).toBe(expectedSize);
        expect(metric.markerHeight).toBe(expectedSize);
        expect(metric.centerOffset).toBeLessThan(1);
        expect(metric.itemHeight).toBeLessThan(expectedSize + 32);
        expect(metric.contentFollowsMarker).toBe(true);
      }
    }

    const link = preview.locator('[data-slot="activity-feed-description"] a').first();
    await link.focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Shift+Tab");
    await expect(link).toBeFocused();
    await expect(link).toHaveCSS("outline-style", "solid");
    await expect(link).toHaveCSS("outline-width", "2px");

    for (const width of [390, 320]) {
      await page.setViewportSize({ width, height: 844 });
      const overflowing = await page.locator('[data-slot="activity-feed-item"]').evaluateAll((items) =>
        items.filter((item) => item.scrollWidth > item.clientWidth + 1).length,
      );
      expect(overflowing).toBe(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  });
}

test("long activity starts collapsed and reveals the full review with keyboard controls", async ({ page }) => {
  await page.goto("/docs/components/activity-feed#expandable");
  const example = page.locator(demo("expandable"));
  await expect(example.locator("xpath=ancestor::astro-island[1]")).not.toHaveAttribute("ssr");
  const card = example.getByRole("listitem");
  const content = example.locator('[data-slot="collapsible-content"]');
  const trigger = example.getByRole("button", { name: "Expand review details" });
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(content).toBeHidden();
  await expect(trigger).toHaveAttribute("aria-controls", (await content.getAttribute("id"))!);
  const collapsedHeight = (await card.boundingBox())!.height;
  await expectBottomCenteredDisclosure(card);

  await trigger.focus();
  await page.keyboard.press("Enter");
  const collapse = example.getByRole("button", { name: "Collapse review details" });
  await expect(collapse).toHaveAttribute("aria-expanded", "true");
  await expect(content).toBeVisible();
  await expect(content).toHaveCSS("animation-name", /kappa-collapsible-expand/);
  await content.evaluate(async (element) => {
    await Promise.all(element.getAnimations().map((animation) => animation.finished));
  });
  expect((await card.boundingBox())!.height).toBeGreaterThan(collapsedHeight + 250);
  await expectBottomCenteredDisclosure(card);
  await expect(content).toContainText("The original run remains available for comparison.");
  await expect(collapse).toBeFocused();
  await expect(example.locator(".activity-feed-expandable__arrow")).toHaveCSS(
    "transform", "matrix(-1, 0, 0, -1, 0, 0)",
  );

  await page.keyboard.press("Space");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(content).toBeHidden();
  expect((await card.boundingBox())!.height).toBeCloseTo(collapsedHeight, 0);
  await expectBottomCenteredDisclosure(card);
});

test("long activity respects reduced motion and fits a narrow panel", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto("/docs/components/activity-feed#expandable");
  const example = page.locator(demo("expandable"));
  await expect(example.locator("xpath=ancestor::astro-island[1]")).not.toHaveAttribute("ssr");
  await example.getByRole("button", { name: "Expand review details" }).click();
  const content = example.locator('[data-slot="collapsible-content"]');
  await expect(content).toBeVisible();
  await expect(content).toHaveCSS("animation-name", "none");
  await expect(example.locator(".activity-feed-expandable__arrow")).toHaveCSS(
    "transition-duration", /^(?:0s|0\.00001s|1e-05s)$/,
  );
  await expectBottomCenteredDisclosure(example.getByRole("listitem"));
  expect(await example.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
