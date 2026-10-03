import { expect, type Page, test } from "@playwright/test";
import {
  collapsibleCode,
  controlledCode,
  handleCode,
  nestedCode,
  previewCode,
  usageCode,
  verticalCode,
} from "../src/data/resizable-docs";

const demo = (page: Page, variant: string) =>
  page.locator(`[data-resizable-demo="${variant}"]`);

const examples = [
  { variant: "preview", code: previewCode, labels: ["Navigation", "Inspector"] },
  { variant: "usage", code: usageCode, labels: ["Files", "Preview"] },
  { variant: "vertical", code: verticalCode, labels: ["Chart", "Events"] },
  { variant: "handle", code: handleCode, labels: ["Editor", "Output"] },
  { variant: "collapsible", code: collapsibleCode, labels: ["Details", "Summary"] },
  { variant: "nested", code: nestedCode, labels: ["Outline", "Code", "Terminal"] },
  { variant: "controlled", code: controlledCode, labels: ["Canvas", "Metrics"] },
] as const;

test.describe("Resizable documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/resizable");
    await expect(page.locator("astro-island[ssr]:has([data-resizable-demo])")).toHaveCount(0);
  });

  test("renders the Ark-backed composition, docs sections, and API data", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Resizable" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);

    const preview = demo(page, "preview");
    await expect(preview.locator('[data-slot="resizable"]')).toHaveCount(1);
    await expect(preview.locator('[data-slot="resizable-panel"]')).toHaveCount(2);
    await expect(preview.locator('[data-slot="resizable-handle"]')).toHaveCount(1);
    await expect(preview.getByRole("separator")).toHaveAttribute("aria-orientation", "horizontal");
    await expect(preview.locator('[data-slot="resizable-resize-trigger-indicator"]')).toBeVisible();

    await expect(page.locator("pre[data-language]").first()).toContainText(
      'from "@dicehub/kappa/components/resizable"',
    );
    await expect(page.locator("pre").filter({ hasText: "../../../kappa/src" })).toHaveCount(0);
    await expect(page.locator('a[aria-label="View Ark UI documentation"]')).toHaveAttribute(
      "href",
      "https://ark-ui.com/docs/components/splitter",
    );

    const toc = page.getByRole("complementary", { name: "On this page" });
    await expect(toc.getByRole("link")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Composition",
      "Examples",
      "Vertical",
      "Handle and indicator",
      "Collapsible panels",
      "Nested splitters",
      "Controlled layout",
      "Accessibility",
      "Keyboard Support",
      "API Reference",
      "Resizable.Root",
      "Parts",
      "Events",
      "Slots",
      "Data Attributes",
      "Exports",
    ]);

    const markdownResponse = await request.get("/docs/components/resizable.md");
    expect(markdownResponse.ok()).toBe(true);
    const markdown = await markdownResponse.text();
    expect(markdown).toContain("# Resizable");
    expect(markdown).toContain("ResizableProps");
    expect(markdown).toContain("Keyboard Support");
  });

  test("supports keyboard resizing, vertical orientation, and controlled sizes", async ({ page }) => {
    const preview = demo(page, "preview");
    const handle = preview.getByRole("separator");
    const initial = await handle.getAttribute("aria-valuenow");
    await handle.focus();
    await handle.press("ArrowRight");
    await expect(handle).not.toHaveAttribute("aria-valuenow", initial ?? "");

    const vertical = demo(page, "vertical");
    const verticalRoot = vertical.locator('[data-slot="resizable"]');
    await expect(verticalRoot).toHaveAttribute("data-orientation", "vertical");
    const verticalHandle = vertical.getByRole("separator");
    await expect(verticalHandle).toHaveAttribute("aria-orientation", "vertical");
    const verticalInitial = await verticalHandle.getAttribute("aria-valuenow");
    await verticalHandle.focus();
    await verticalHandle.press("ArrowDown");
    await expect(verticalHandle).not.toHaveAttribute("aria-valuenow", verticalInitial ?? "");

    const controlled = demo(page, "controlled");
    await controlled.getByRole("button", { name: "60 / 40" }).click();
    await expect(controlled.getByText("Metrics · 40%")).toBeVisible();
  });

  test("keeps rendered examples aligned with their displayed code", async ({ page }) => {
    for (const example of examples) {
      const rendered = demo(page, example.variant);
      const codePanelCount = [...example.code.matchAll(/<Resizable\.Panel\b/g)].length;
      const codeHandleCount = [
        ...example.code.matchAll(/<Resizable\.(?:Handle|ResizeTrigger)\b/g),
      ].length;

      await expect(rendered.locator('[data-slot="resizable-panel"]')).toHaveCount(codePanelCount);
      await expect(rendered.getByRole("separator")).toHaveCount(codeHandleCount);
      for (const label of example.labels) {
        await expect(rendered.getByText(new RegExp(label)).first()).toBeVisible();
        expect(example.code).toContain(label);
      }
    }
  });

  test("keeps nested and collapsible examples usable at narrow widths", async ({ page }) => {
    const collapsible = demo(page, "collapsible");
    await expect(collapsible.getByRole("button", { name: "Collapse details" })).toBeVisible();
    await expect(collapsible.getByRole("button", { name: "Expand details" })).toBeVisible();
    const collapseHandle = collapsible.getByRole("separator");
    const expandedSize = await collapseHandle.getAttribute("aria-valuenow");
    await collapseHandle.focus();
    await collapseHandle.press("Enter");
    await expect(collapseHandle).not.toHaveAttribute("aria-valuenow", expandedSize ?? "");

    const nested = demo(page, "nested");
    await expect(nested.locator('[data-slot="resizable"]')).toHaveCount(2);
    const nestedVerticalRoot = nested.locator(
      '[data-slot="resizable"][data-orientation="vertical"]',
    );
    await expect(nestedVerticalRoot).toHaveCount(1);
    await expect(nestedVerticalRoot.getByText("Terminal", { exact: true })).toBeVisible();
    const nestedVerticalHandle = nestedVerticalRoot.locator(":scope > [role=separator]");
    const [nestedRootBox, nestedHandleBox] = await Promise.all([
      nestedVerticalRoot.boundingBox(),
      nestedVerticalHandle.boundingBox(),
    ]);
    expect(nestedHandleBox?.height).toBeLessThan(20);
    expect(
      Math.abs((nestedHandleBox?.width ?? 0) - (nestedRootBox?.width ?? 0)),
    ).toBeLessThanOrEqual(2);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(demo(page, "preview").getByRole("separator")).toBeVisible();
  });
});
