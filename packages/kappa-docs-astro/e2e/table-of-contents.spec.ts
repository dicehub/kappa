import { expect, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) =>
  page.locator(`[data-table-of-contents-demo="${variant}"]`);

test.describe("Table of Contents documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/table-of-contents");
  });

  test("renders Ark-backed parts, imports, composition, and API data", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Table of Contents" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(demo(page, "preview").locator(".kappa-table-of-contents")).toHaveCount(1);
    await expect(demo(page, "preview").locator('[data-slot="table-of-contents-nav"]')).toHaveCount(1);
    await expect(demo(page, "preview").locator('[data-slot="table-of-contents-title"]')).toHaveText("On this page");
    await expect(demo(page, "preview").locator('[data-slot="table-of-contents-content"]')).toHaveCount(0);
    await expect(demo(page, "scroll-tracking").locator('[data-slot="table-of-contents-content"]')).toHaveCount(1);
    await expect(page.locator("pre[data-language]").first()).toContainText(
      'from "@dicehub/kappa/components/table-of-contents"',
    );
    await expect(page.locator('pre:has-text("../../../kappa/src")')).toHaveCount(0);
    await expect(page.locator('[data-composition-tree="tableOfContents"]')).toContainText(
      "TableOfContents.Root",
    );
    await expect(
      page
        .locator(".docs-api-table code")
        .filter({ hasText: /^TocItemData \/ TocActiveChangeDetails$/ }),
    ).toBeVisible();

    await expect(page.getByRole("complementary", { name: "On this page" }).getByRole("link")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Composition",
      "Examples",
      "Basic",
      "Nested depth",
      "Active indicator",
      "Controlled active change",
      "Scroll tracking",
      "Accessibility",
      "Keyboard support",
      "API Reference",
      "TableOfContents.Root",
      "Parts",
      "Events",
      "Data attributes",
      "Exports",
    ]);
  });

  test("renders active, nested, and indicator states", async ({ page }) => {
    await expect(page.locator('[data-slot="table-of-contents"]')).toHaveCount(7);
    const ids = await page.locator('[data-scope="toc"][id]').evaluateAll(
      (elements) => elements.map((element) => element.id),
    );
    expect(new Set(ids).size).toBe(ids.length);
    const preview = demo(page, "preview");
    const activeLinks = preview.locator('[data-part="link"][data-active]');
    await expect(activeLinks).toHaveCount(1);
    await expect(activeLinks).toHaveText("Usage");
    await expect(activeLinks).toHaveAttribute("aria-current", "location");

    const nested = demo(page, "nested");
    await expect(nested.locator('[data-part="item"][data-depth="3"]')).toHaveCount(2);
    const [topLevelPadding, nestedPadding] = await Promise.all([
      nested.locator('[data-part="item"][data-depth="2"] [data-part="link"]').first().evaluate(
        (element) => Number.parseFloat(getComputedStyle(element).paddingInlineStart),
      ),
      nested.locator('[data-part="item"][data-depth="3"] [data-part="link"]').first().evaluate(
        (element) => Number.parseFloat(getComputedStyle(element).paddingInlineStart),
      ),
    ]);
    expect(nestedPadding).toBeGreaterThan(topLevelPadding);

    const indicator = demo(page, "indicator");
    await expect(indicator.locator('[data-slot="table-of-contents-indicator"]')).toHaveCount(1);
    await expect(indicator.locator('[data-part="indicator"]')).toHaveCount(1);
    await expect(indicator.locator('[data-part="list"] > [data-part="indicator"]')).toHaveCount(1);
    expect(await indicator.locator('[data-part="indicator"]').evaluate((element) => {
      const indicatorElement = element as HTMLElement;
      const listElement = indicatorElement.closest('[data-part="list"]')!;
      return {
        position: getComputedStyle(indicatorElement).position,
        offsetParent: indicatorElement.offsetParent?.getAttribute("data-part"),
        railOffset:
          indicatorElement.getBoundingClientRect().left -
          listElement.getBoundingClientRect().left,
      };
    })).toEqual({ position: "absolute", offsetParent: "list", railOffset: 0 });
  });

  test("uses compact Kappa navigation styling", async ({ page }) => {
    const preview = demo(page, "preview");
    const styles = await preview.evaluate((root) => {
      const title = root.querySelector<HTMLElement>('[data-part="title"]')!;
      const list = root.querySelector<HTMLElement>('[data-part="list"]')!;
      const link = root.querySelector<HTMLElement>('[data-part="link"]')!;
      const active = root.querySelector<HTMLElement>('[data-part="link"][data-active]')!;
      return {
        titleSize: getComputedStyle(title).fontSize,
        titleWeight: getComputedStyle(title).fontWeight,
        listGap: getComputedStyle(list).gap,
        railWidth: getComputedStyle(list).borderInlineStartWidth,
        linkHeight: link.getBoundingClientRect().height,
        linkPadding: getComputedStyle(link).paddingInlineStart,
        activeRadius: getComputedStyle(active).borderRadius,
        activeWeight: getComputedStyle(active).fontWeight,
      };
    });

    expect(styles).toEqual({
      titleSize: "12px",
      titleWeight: "600",
      listGap: "8px",
      railWidth: "2px",
      linkHeight: 24,
      linkPadding: "16px",
      activeRadius: "0px",
      activeWeight: "500",
    });
  });

  test("uses button controls in examples without changing the page location", async ({ page }) => {
    for (const variant of ["preview", "basic", "nested", "indicator", "controlled", "scroll-tracking"]) {
      const example = demo(page, variant);
      await expect(example.getByRole("link")).toHaveCount(0);
      await expect(example.locator('[data-part="link"]')).not.toHaveCount(0);
      await expect(example.locator('[data-part="link"]:not(button[type="button"])')).toHaveCount(0);
    }

    const location = page.url();
    await demo(page, "preview").getByRole("button", { name: "Installation" }).click();
    expect(page.url()).toBe(location);
  });

  test("supports controlled active changes and deterministic scroll tracking", async ({ page }) => {
    const controlled = demo(page, "controlled");
    await expect(controlled.getByRole("status")).toContainText("installation");
    await controlled.getByRole("button", { name: "Activate usage" }).click();
    await expect(controlled.getByRole("status")).toContainText("usage");
    await expect(controlled.locator('[data-part="link"][data-active]')).toHaveText("Usage");

    const tracking = demo(page, "scroll-tracking");
    await expect(tracking.locator('[data-part="link"][data-active]')).toHaveText("Overview");
    const scrollRoot = tracking.locator("[data-scrollspy-root]");
    await scrollRoot.evaluate((element) => {
      element.scrollTop = element.scrollHeight;
      element.dispatchEvent(new Event("scroll", { bubbles: true }));
    });
    await expect(tracking.locator('[data-part="link"][data-active]')).toHaveText("API reference");
  });

  test("keeps TOC demo controls keyboard accessible", async ({ page }) => {
    const preview = demo(page, "preview");
    const buttons = preview.getByRole("button");
    await buttons.first().focus();
    await expect(buttons.first()).toBeFocused();
    await buttons.first().press("Enter");
    await expect(preview.locator('[data-part="link"][data-active]')).toHaveText("Installation");
    await expect(buttons.first()).not.toHaveAttribute("href");
  });

  test("scrolls only the local tracking panel when its TOC is clicked", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/docs/components/table-of-contents#scroll-tracking");
    const tracking = demo(page, "scroll-tracking");
    const scrollRoot = tracking.locator("[data-scrollspy-root]");
    await expect(tracking.getByRole("button", { name: "API reference", exact: true })).toBeVisible();
    const pageY = await page.evaluate(() => scrollY);
    const pageURL = page.url();

    for (const label of ["API reference", "Installation", "Overview"]) {
      await tracking.getByRole("button", { name: label, exact: true }).click();
      await expect(tracking.locator('[data-part="link"][data-active]')).toHaveText(label);
      if (label !== "Overview") {
        await expect.poll(() => scrollRoot.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
      }
      await expect.poll(() => page.evaluate((initialY) => Math.abs(scrollY - initialY), pageY)).toBeLessThan(2);
      expect(page.url()).toBe(pageURL);
    }
    await expect.poll(() => scrollRoot.evaluate((element) => element.scrollTop)).toBe(0);
  });
});
