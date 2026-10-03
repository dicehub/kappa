import { expect, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) =>
  page.locator(`[data-dialog-layout-demo="${variant}"]`);
const surface = (page: Page, variant: string) =>
  page.locator(`[data-dialog-layout-surface="${variant}"]`);

const openDemo = async (page: Page, variant: string, triggerName: string) => {
  await expect
    .poll(() =>
      demo(page, variant).evaluate(
        (element) => !element.closest("astro-island")?.hasAttribute("ssr"),
      ),
    )
    .toBe(true);
  const trigger = demo(page, variant).getByRole("button", {
    name: triggerName,
    exact: true,
  });
  await trigger.click();
  await expect(surface(page, variant)).toBeVisible();
  return trigger;
};

test.describe("Dialog Layout documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/dialog-layout");
  });

  test("renders its examples, public imports, and documentation navigation", async ({
    page,
    request,
  }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Dialog Layout" })).toBeVisible();

    for (const variant of [
      "preview",
      "informational",
      "confirmation",
      "long-content",
      "loading",
      "top-aligned",
    ]) {
      await expect(demo(page, variant)).toHaveCount(1);
    }

    await expect(page.locator('[data-composition-tree="dialogLayout"]')).toContainText(
      "DialogLayout.Actions.Primary",
    );
    await expect(page.locator("pre[data-language]").first()).toContainText("DialogLayout.Root");
    await expect(
      page.locator('pre[data-language]').filter({ hasText: "packages/kappa/src" }),
    ).toHaveCount(0);

    const unhighlightedCompoundTags = await page
      .locator('pre[data-language="vue"] .line')
      .evaluateAll((lines) =>
        lines
          .filter((line) => line.textContent?.includes("<DialogLayout."))
          .filter((line) => {
            const tokenColors = new Set(
              [...line.querySelectorAll<HTMLElement>("span[style]")].map(
                (token) => token.style.getPropertyValue("--shiki-light"),
              ),
            );
            return tokenColors.size < 2;
          })
          .map((line) => line.textContent?.trim()),
      );
    expect(unhighlightedCompoundTags).toEqual([]);

    const compact = page.getByRole("navigation", { name: "Adjacent documentation pages" });
    await expect(compact.getByRole("link", { name: "Previous page: Dialog" })).toHaveAttribute(
      "href",
      "/docs/components/dialog",
    );
    await expect(
      compact.getByRole("link", { name: "Next page: dicehub logo" }),
    ).toHaveAttribute("href", "/docs/components/dicehub-logo");

    const response = await request.get("/docs/components/dialog-layout.md");
    expect(response.ok()).toBe(true);
    expect(await response.text()).toContain("# Dialog Layout");
  });

  test("keeps stable regions and restores focus after dismissal", async ({ page }) => {
    const trigger = await openDemo(page, "preview", "Configure deployment");
    const dialog = surface(page, "preview");
    const header = dialog.locator('[data-slot="dialog-layout-header"]');
    const body = dialog.locator('[data-slot="dialog-layout-body"]');
    const actions = dialog.locator('[data-slot="dialog-layout-actions"]');

    await expect(page.getByRole("dialog", { name: "Configure deployment" })).toBeVisible();
    await expect(header).toHaveCSS("flex-shrink", "0");
    await expect(body).toHaveCSS("overflow-y", "auto");
    await expect(actions).toHaveCSS("flex-shrink", "0");

    await dialog.getByRole("button", { name: "Cancel" }).click();
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  test("uses alert semantics and blocks outside pointer dismissal", async ({ page }) => {
    await openDemo(page, "confirmation", "Delete result");
    const alert = page.getByRole("alertdialog", { name: "Delete result?" });
    await expect(alert).toBeVisible();

    const backdrop = page.locator('[data-slot="dialog-backdrop"][data-state="open"]').last();
    await backdrop.click({ position: { x: 4, y: 4 } });
    await expect(alert).toBeVisible();

    await alert.getByRole("button", { name: "Cancel" }).click();
    await expect(alert).toHaveCount(0);
  });

  test("shows pending state and blocks every configured dismiss path", async ({ page }) => {
    await openDemo(page, "loading", "Start deployment");
    const dialog = surface(page, "loading");
    const primary = dialog.getByRole("button", { name: "Deploy" });

    await primary.click();
    await expect(dialog.getByRole("button", { name: "Deploying" })).toBeDisabled();
    await expect(dialog.getByRole("button", { name: "Cancel" })).toBeDisabled();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveCount(0, { timeout: 2_000 });
  });

  test("keeps long content inside the body and adapts placement", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await openDemo(page, "long-content", "Open audit log");
    const body = surface(page, "long-content").locator('[data-slot="dialog-layout-body"]');
    expect(await body.evaluate((element) => element.scrollHeight > element.clientHeight)).toBe(true);
    await expect(surface(page, "long-content").getByText("16 events")).toBeVisible();
    await page.keyboard.press("Escape");

    await openDemo(page, "top-aligned", "Review warnings");
    const desktopBox = await surface(page, "top-aligned").boundingBox();
    expect(desktopBox).not.toBeNull();
    expect(desktopBox!.y).toBeLessThan(140);
    await page.keyboard.press("Escape");

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    await openDemo(page, "top-aligned", "Review warnings");
    const mobileBox = await surface(page, "top-aligned").boundingBox();
    expect(mobileBox).not.toBeNull();
    expect(mobileBox!.y + mobileBox!.height).toBeGreaterThan(820);
  });
});
