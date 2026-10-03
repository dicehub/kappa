import { expect, test } from "@playwright/test";

const demo = (variant: string) => `[data-aspect-ratio-demo="${variant}"]`;

test.describe("Aspect Ratio documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/aspect-ratio");
  });

  test("renders ratio examples and public usage", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Aspect Ratio" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);

    const preview = page.locator(`${demo("preview")} .kappa-aspect-ratio`);
    await expect(preview).toHaveCount(1);
    await expect(preview).toHaveAttribute("data-slot", "aspect-ratio");
    await expect(preview).toHaveAttribute("data-ratio", String(16 / 9));

    const previewBox = await preview.boundingBox();
    expect(previewBox).not.toBeNull();
    expect(Math.abs((previewBox?.width ?? 0) / (previewBox?.height ?? 1) - 16 / 9)).toBeLessThan(0.03);

    const snippets = page.locator("pre[data-language]");
    await expect(snippets.first()).toContainText('from "@dicehub/kappa/components/aspect-ratio"');
    await expect(snippets.filter({ hasText: "../../../kappa/src" })).toHaveCount(0);

    const examples = [
      ["preview", page.locator('#aspect-ratio-preview-code pre[data-language="vue"]')],
      ["usage", page.locator('#aspect-ratio-usage-code pre[data-language="vue"]')],
      ["square", page.locator('#aspect-ratio-square-code pre[data-language="vue"]')],
      ["portrait", page.locator('#aspect-ratio-portrait-code pre[data-language="vue"]')],
      ["custom", page.locator('#aspect-ratio-custom-code pre[data-language="vue"]')],
    ] as const;
    for (const [variant, code] of examples) {
      const imagePath = "/illustrations/aspect-ratio-astronaut.webp";
      await expect(page.locator(`${demo(variant)} img`)).toHaveAttribute("src", imagePath);
      await expect(code).toContainText(imagePath);
    }

    const response = await request.get("/docs/components/aspect-ratio.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Aspect Ratio");
    expect(markdown).toContain("## [Accessibility](#accessibility)");
    expect(markdown).toContain("AspectRatioProps");
    expect(markdown).not.toContain("View Code");
    expect(markdown).not.toContain("On this page");
  });

  test("keeps square, portrait, and custom geometry", async ({ page }) => {
    const ratioFor = async (variant: string) => {
      const box = await page.locator(`${demo(variant)} .kappa-aspect-ratio`).boundingBox();
      expect(box).not.toBeNull();
      return (box?.width ?? 0) / (box?.height ?? 1);
    };

    expect(Math.abs((await ratioFor("square")) - 1)).toBeLessThan(0.03);
    expect(Math.abs((await ratioFor("portrait")) - 9 / 16)).toBeLessThan(0.03);
    expect(Math.abs((await ratioFor("custom")) - 3 / 2)).toBeLessThan(0.03);
  });
});
