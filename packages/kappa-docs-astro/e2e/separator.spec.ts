import { expect, test } from "@playwright/test";

test("Separator documentation renders correct geometry and semantics", async ({ page, request }) => {
  await page.goto("/docs/components/separator");

  await expect(page.getByRole("heading", { level: 1, name: "Separator" })).toBeVisible();
  await expect(page.getByText("Planned documentation")).toHaveCount(0);

  const basic = page.locator('[data-separator-demo="basic"] .kappa-separator');
  const horizontalBox = await basic.boundingBox();
  expect(horizontalBox?.height).toBe(1);
  expect(horizontalBox?.width).toBeGreaterThan(200);
  await expect(basic).toHaveAttribute("role", "none");
  await expect(basic).toHaveAttribute("aria-hidden", "true");
  await expect(basic).toHaveAttribute("data-orientation", "horizontal");

  const vertical = page
    .locator('[data-separator-demo="vertical"] .kappa-separator')
    .first();
  const verticalBox = await vertical.boundingBox();
  expect(verticalBox?.width).toBe(1);
  expect(verticalBox?.height).toBeGreaterThanOrEqual(16);
  await expect(vertical).toHaveAttribute("data-orientation", "vertical");

  const semantic = page.getByRole("separator", { name: "Deployment details" });
  await expect(semantic).toHaveAttribute("aria-orientation", "horizontal");
  await expect(semantic).not.toHaveAttribute("aria-hidden", "true");

  await expect(
    page.locator(".docs-page-header__title-row").locator('a[href*="ark-ui.com"]'),
  ).toHaveCount(0);
  await expect(page.locator("#composition").getByText("Separator <hr>")).toBeVisible();
  await expect(page.locator("pre[data-language]").first()).toContainText(
    'from "@dicehub/kappa/components/separator"',
  );

  const markdownResponse = await request.get("/docs/components/separator.md");
  expect(markdownResponse.ok()).toBe(true);
  const markdown = await markdownResponse.text();
  expect(markdown).toContain("# Separator");
  expect(markdown).toContain("## [Accessibility](#accessibility)");
  expect(markdown).toContain("SeparatorProps");
});
