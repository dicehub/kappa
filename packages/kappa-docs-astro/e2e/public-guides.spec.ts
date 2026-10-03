import { expect, test } from "@playwright/test";

test("installation documents package use without private access instructions", async ({ page, request }) => {
  await page.goto("/docs/installation");
  const article = page.locator(".docs-article");
  await expect(article.getByRole("heading", { name: "Install Package" })).toBeVisible();
  await expect(article.getByRole("heading", { name: "Styles and Theme" })).toBeVisible();
  await expect(article.getByRole("heading", { name: "TypeScript" })).toBeVisible();
  const response = await request.get("/docs/installation.md");
  expect(response.ok()).toBe(true);
  const markdown = await response.text();
  for (const text of [
    "Public npm publication is pending",
    "pnpm add /path/to/kappa-ui/dist/kappa.tgz vue",
    '@dicehub/kappa/styles/kappa.css',
    '@dicehub/kappa/styles/theme-kappa.css',
    'skipLibCheck',
  ]) expect(markdown).toContain(text);
  for (const text of ["gitlab.dicehub.org", "CI_JOB_TOKEN", "NPM_TOKEN", "playwright install", "codegen:themes"])
    expect(markdown).not.toContain(text);
});

test("changelog keeps initial snapshot entries without commit hashes", async ({ page, request }) => {
  await page.goto("/docs/changelog/all");
  const snapshot = page.locator(".changelog-release").filter({ hasText: "Initial Kappa code snapshot" });
  await expect(snapshot).toHaveCount(1);
  await expect(snapshot.locator(".changelog-entry")).toHaveCount(3);
  await expect(snapshot.locator(".changelog-entry").last()).toContainText("skipLibCheck: true");
  await expect(snapshot.locator(".changelog-entry__hash")).toHaveCount(0);
  await expect(page.locator('a[href*="gitlab.dicehub.org"]')).toHaveCount(0);
  const content = snapshot.locator(".changelog-entry__content").first();
  await expect(content).toBeVisible();
  const widths = await content.evaluate(element => [
    element.getBoundingClientRect().width,
    element.parentElement!.getBoundingClientRect().width,
  ]);
  expect(Math.abs(widths[0]! - widths[1]!)).toBeLessThan(1);
  const response = await request.get("/docs/changelog.md");
  expect(response.ok()).toBe(true);
  const markdown = await response.text();
  expect(markdown).toContain("Initial Kappa code snapshot");
  expect(markdown).toContain("skipLibCheck: true");
  for (const text of ["gitlab.dicehub.org", "skipLibCheck disabled", "GitLab package registry"])
    expect(markdown).not.toContain(text);
});
