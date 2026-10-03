import { expect, type Locator, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) => page.locator(`[data-popover-demo="${variant}"]`);
const surface = (page: Page, variant: string) =>
  page.locator(`[data-popover-demo-surface="${variant}"]`);

async function openPopover(trigger: Locator, content: Locator) {
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();
  await expect(content).toBeVisible();
  return content;
}

test.describe("Popover documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/popover");
  });

  test("renders examples, references, navigation, and Markdown", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Popover" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);

    for (const variant of [
      "preview",
      "usage",
      "basic",
      "placement",
      "form",
      "controlled",
      "anchor",
      "hover",
      "states",
      "right-to-left",
    ]) {
      await expect(demo(page, variant)).toHaveCount(1);
    }

    await expect(page.getByRole("link", { name: "View Ark UI documentation" })).toHaveAttribute(
      "href",
      "https://ark-ui.com/docs/components/popover",
    );
    await expect(page.locator('pre[data-language="javascript"]')).toHaveCount(2);
    await expect(page.locator("pre[data-language]").first()).toContainText(
      'from "@dicehub/kappa/components/popover"',
    );

    const toc = page.getByRole("complementary", { name: "On this page" });
    for (const label of [
      "Installation",
      "Composition",
      "Basic Content",
      "Placement",
      "Interactive Form",
      "Controlled State",
      "Custom Anchor",
      "Open on Hover",
      "States and Modality",
      "Markdown sibling",
      "Popover.Content",
      "Events",
      "Exports",
    ]) {
      await expect(toc.getByRole("link", { name: label, exact: true })).toBeVisible();
    }

    const response = await request.get("/docs/components/popover.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Popover");
    expect(markdown).toContain("## [Accessibility](#accessibility)");
    expect(markdown).toContain("### [Interactive Form](#form)");
    expect(markdown).toContain("Popover.Close");
    expect(markdown).not.toContain("View Code");
    expect(markdown).not.toContain("On this page");
  });

  test("opens interactive content, follows placement, and restores focus", async ({ page }) => {
    const preview = demo(page, "preview");
    const previewTrigger = preview.getByRole("button", { name: "Run filters" });
    const previewContent = await openPopover(previewTrigger, surface(page, "preview"));
    await expect(previewContent).toHaveAttribute("role", "dialog");
    await expect(previewContent).toContainText("Choose which result sets stay in the report.");
    const previewPositioner = previewContent.locator("xpath=..");
    await expect(previewPositioner.locator('[data-slot="popover-arrow"]')).toBeVisible();
    await previewContent.getByRole("button", { name: "Apply filters" }).click();
    await expect(previewContent).toBeHidden();
    await expect(previewTrigger).toBeFocused();

    const placements = demo(page, "placement");
    for (const side of ["top", "bottom", "left", "right"] as const) {
      const label = side[0].toUpperCase() + side.slice(1);
      const trigger = placements.getByRole("button", { name: label, exact: true });
      const content = await openPopover(trigger, surface(page, `placement-${side}`));
      await expect(content).toHaveAttribute("data-side", side);
      await page.keyboard.press("Escape");
      await expect(content).toBeHidden();
    }
  });

  test("supports forms, controlled state, custom anchors, states, and themes", async ({ page }) => {
    const form = demo(page, "form");
    const formTrigger = form.getByRole("button", { name: "Edit run details" });
    const formContent = await openPopover(formTrigger, surface(page, "form"));
    const input = formContent.getByRole("textbox", { name: "Run label" });
    await expect(input).toBeFocused();
    await input.fill("PIMPLE baseline 08");
    await formContent.getByRole("button", { name: "Save changes" }).click();
    await expect(formContent).toBeHidden();
    await expect(formTrigger).toBeFocused();

    const controlled = demo(page, "controlled");
    await expect(controlled.locator("output")).toHaveText("State: closed");
    await controlled.getByRole("button", { name: "Open controlled popover" }).click();
    await expect(controlled.locator("output")).toHaveText("State: open");
    await surface(page, "controlled").getByRole("button", { name: "Done" }).click();
    await expect(controlled.locator("output")).toHaveText("State: closed");

    const anchor = demo(page, "anchor");
    await openPopover(anchor.getByRole("button", { name: "Open anchored details" }), surface(page, "anchor"));
    await expect(surface(page, "anchor")).toContainText("custom anchor");
    await page.keyboard.press("Escape");

    const hover = demo(page, "hover");
    const hoverTrigger = hover.getByRole("button", { name: "Hover or focus" });
    await hoverTrigger.hover();
    await expect(surface(page, "hover")).toBeVisible();
    await surface(page, "hover").hover();
    await expect(surface(page, "hover")).toBeVisible();
    await page.mouse.move(0, 0);
    await expect(surface(page, "hover")).toBeHidden();
    await hoverTrigger.focus();
    await page.keyboard.press("Enter");
    await expect(surface(page, "hover")).toBeVisible();
    await page.keyboard.press("Escape");

    const rtl = demo(page, "right-to-left");
    const rtlContent = await openPopover(
      rtl.getByRole("button", { name: "فتح التفاصيل" }),
      surface(page, "right-to-left"),
    );
    await expect(rtlContent).toHaveAttribute("dir", "rtl");
    await expect(rtlContent.locator('[data-slot="popover-title"]')).toHaveAttribute(
      "dir",
      "rtl",
    );
    await page.keyboard.press("Escape");

    const states = demo(page, "states");
    const disabledTrigger = states.getByRole("button", { name: "Unavailable action" });
    await expect(disabledTrigger).toBeDisabled();
    await expect(surface(page, "disabled")).toBeHidden();
    await states.getByRole("button", { name: "Modal popover" }).click();
    await expect(surface(page, "modal")).toHaveAttribute("aria-modal", "true");
    const light = await surface(page, "modal").evaluate((element) => {
      const style = getComputedStyle(element);
      return { background: style.backgroundColor, font: style.fontFamily };
    });
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "Toggle theme" }).filter({ visible: true }).click();
    await states.getByRole("button", { name: "Modal popover" }).click();
    const dark = await surface(page, "modal").evaluate((element) => {
      const style = getComputedStyle(element);
      return { background: style.backgroundColor, font: style.fontFamily };
    });
    expect(dark.background).not.toBe(light.background);
    expect(dark.font).toMatch(/Geist/i);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(surface(page, "modal")).toHaveCSS("animation-name", "none");
  });
});
