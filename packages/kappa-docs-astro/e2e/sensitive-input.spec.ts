import { expect, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) =>
  page.locator(`[data-sensitive-input-demo="${variant}"]`);

test.describe("Sensitive Input documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/sensitive-input");
  });

  test("renders public examples, API, navigation, and Markdown", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Sensitive Input" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(demo(page, "preview").locator(".kappa-sensitive-input")).toHaveCount(1);
    await expect(page.locator("#examples .docs-component-example")).toHaveCount(4);

    const snippets = page.locator("pre[data-language]");
    await expect(snippets.first()).toContainText(
      'from "@dicehub/kappa/components/sensitive-input"',
    );
    await expect(snippets.filter({ hasText: "../../../kappa/src" })).toHaveCount(0);
    await expect(page.locator('pre[data-language="javascript"]')).toHaveCount(2);

    const toc = page.getByRole("complementary", { name: "On this page" });
    await expect(toc.getByRole("link")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Composition",
      "Examples",
      "Sizes",
      "Controlled Value",
      "Form States",
      "Reveal and Copy",
      "Accessibility",
      "API Reference",
      "SensitiveInput",
      "Parts",
      "Events",
      "Data Attributes",
      "Exports",
    ]);

    const sidebar = page.locator("#desktop-navigation").getByRole("link", {
      name: "Sensitive Input",
      exact: true,
    });
    await expect(sidebar).toHaveAttribute("aria-current", "page");

    const response = await request.get("/docs/components/sensitive-input.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Sensitive Input");
    expect(markdown).toContain("## [Accessibility](#accessibility)");
    expect(markdown).toContain("visibilityChange");
    expect(markdown).not.toContain("View Code");
    expect(markdown).not.toContain("On this page");
  });

  test("reveals and masks values with pointer and keyboard interaction", async ({ page }) => {
    const usage = demo(page, "usage");
    const input = usage.getByRole("textbox", { name: "Webhook signing secret" });
    await expect(input).toHaveValue("whsec_7f29b1d0");
    await expect(input).toHaveAttribute("type", "password");
    await expect(input).toHaveAttribute("data-slot", "sensitive-input-input");
    const control = usage.locator('[data-slot="sensitive-input-control"]');
    const bullets = usage.locator(".kappa-sensitive-input__mask-bullets");
    const revealHint = usage.getByText("Click to reveal", { exact: true });
    const copyButton = usage.getByRole("button", { name: "Copy to clipboard" });
    await expect(usage.getByRole("button", { name: "Reveal value" })).toBeVisible();
    await expect(bullets).toHaveCSS("opacity", "1");
    await expect(revealHint).toHaveCSS("opacity", "0");
    await expect(copyButton).toHaveCSS("opacity", "0");

    await control.hover();
    await expect(bullets).toHaveCSS("opacity", "0");
    await expect(revealHint).toHaveCSS("opacity", "1");
    await expect(copyButton).toHaveCSS("opacity", "1");

    await input.click();
    await expect(input).toHaveAttribute("type", "text");
    await expect(usage.getByRole("button", { name: "Hide value" })).toBeVisible();

    await input.press("Escape");
    await expect(input).toHaveAttribute("type", "password");
    await expect(usage.locator('[data-slot="sensitive-input-control"]')).toHaveAttribute(
      "data-state",
      "masked",
    );

    await input.focus();
    await input.press("Enter");
    await expect(input).toHaveAttribute("type", "text");
  });

  test("supports controlled values, copy feedback, and complete states", async ({ page, context }) => {
    const controlled = demo(page, "controlled");
    const input = controlled.getByRole("textbox", { name: "Controlled secret" });
    await expect(input).toHaveValue("dh_secret_4b8f2c");
    await controlled.getByRole("button", { name: "Replace value" }).click();
    await expect(input).toHaveValue("dh_secret_rotor_42");
    await expect(controlled.locator("output")).toContainText("dh_secret_rotor_42");
    await controlled.getByRole("button", { name: "Clear" }).click();
    await expect(input).toHaveValue("");

    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    const interaction = demo(page, "interaction");
    const copyButton = interaction.getByRole("button", { name: "Copy to clipboard" });
    await interaction.locator('[data-slot="sensitive-input-control"]').hover();
    await expect(copyButton).toHaveCSS("opacity", "1");
    const copyBox = await copyButton.boundingBox();
    expect(copyBox).toBeTruthy();
    await copyButton.click();
    const copiedButton = interaction.getByRole("button", { name: "Copied!" });
    await expect(copiedButton).toBeVisible();
    const copiedBox = await copiedButton.boundingBox();
    expect(copiedBox).toBeTruthy();
    expect(copiedBox!.width).toBe(copyBox!.width);
    expect(
      await copiedButton.evaluate((element) => element.scrollWidth <= element.clientWidth),
    ).toBe(true);
    await expect(interaction.getByRole("status")).toContainText("copied");
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("signing_secret_89ac");

    const states = demo(page, "states");
    await expect(states.locator('[data-slot="sensitive-input-control"]').nth(0)).toHaveAttribute(
      "data-invalid",
      "",
    );
    await expect(states.getByRole("textbox", { name: "Disabled token" })).toBeDisabled();
    await expect(states.getByRole("textbox", { name: "Read-only token" })).toHaveAttribute(
      "readonly",
      "",
    );
  });
});
