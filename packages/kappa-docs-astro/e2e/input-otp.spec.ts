import { expect, type Locator, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) => page.locator(`[data-input-otp-demo="${variant}"]`);
const cells = (container: Locator) => container.locator('[data-slot="input-otp-input"]');

test.describe("Input OTP documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/input-otp");
  });

  test("renders compound examples, API, Ark link, navigation, and Markdown", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Input OTP" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(demo(page, "preview").locator(".kappa-input-otp")).toHaveCount(1);
    await expect(cells(demo(page, "preview"))).toHaveCount(6);
    await expect(page.locator("#examples .docs-component-example")).toHaveCount(5);
    const primitive = page.getByRole("link", { name: "View Ark UI documentation" });
    await expect(primitive).toHaveAttribute("href", "https://ark-ui.com/docs/components/pin-input");
    await expect(primitive).toHaveAttribute("target", "_blank");

    const snippets = page.locator("pre[data-language]");
    await expect(snippets.first()).toContainText('from "@dicehub/kappa/components/input-otp"');
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
      "Pattern and Placeholder",
      "Mask",
      "Disabled and Invalid",
      "Blur on Complete",
      "Controlled Value",
      "Accessibility",
      "API Reference",
      "InputOtp.Root",
      "Parts",
      "Events",
      "Data Attributes",
      "Exports",
    ]);

    const response = await request.get("/docs/components/input-otp.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Input OTP");
    expect(markdown).toContain("## [Accessibility](#accessibility)");
    expect(markdown).toContain("InputOtp.Root");
    expect(markdown).not.toContain("View Code");
    expect(markdown).not.toContain("On this page");
  });

  test("centers every visible cell group in its example", async ({ page }) => {
    const centerOffsets = await page.locator("[data-input-otp-demo]").evaluateAll((demos) =>
      demos.flatMap((demoElement) => {
        const demoBox = demoElement.getBoundingClientRect();

        return Array.from(demoElement.querySelectorAll('[data-slot="input-otp"]')).map(
          (rootElement) => {
            const inputs = rootElement.querySelectorAll('[data-slot="input-otp-input"]');
            const firstBox = inputs[0]?.getBoundingClientRect();
            const lastBox = inputs[inputs.length - 1]?.getBoundingClientRect();

            if (!firstBox || !lastBox) return Number.POSITIVE_INFINITY;

            const demoCenter = demoBox.left + demoBox.width / 2;
            const cellsCenter = (firstBox.left + lastBox.right) / 2;
            return Math.abs(demoCenter - cellsCenter);
          },
        );
      }),
    );

    expect(centerOffsets).toHaveLength(8);
    expect(centerOffsets.every((offset) => offset <= 1)).toBe(true);
  });

  test("supports keyboard entry, focus movement, and form values", async ({ page }) => {
    const usage = demo(page, "usage");
    const usageCells = cells(usage);
    await expect(usageCells).toHaveCount(6);
    await expect(usageCells.nth(0)).toHaveAttribute("autocomplete", "one-time-code");
    await usageCells.nth(0).focus();
    await usageCells.nth(0).press("4");
    await expect(usageCells.nth(1)).toBeFocused();
    await usageCells.nth(1).press("0");
    await usageCells.nth(1).press("Backspace");
    await expect(usageCells.nth(0)).toBeFocused();
    await expect(usage.locator('[data-slot="input-otp-hidden-input"]')).toHaveAttribute(
      "name",
      "deploy-code",
    );

    const pattern = demo(page, "pattern");
    const patternCells = cells(pattern);
    await patternCells.nth(0).fill("a");
    await expect(patternCells.nth(0)).toHaveValue("");
    await patternCells.nth(0).fill("7");
    await expect(patternCells.nth(0)).toHaveValue("7");
    await expect(patternCells.nth(0)).toHaveAttribute("inputmode", "numeric");
  });

  test("covers masked, disabled, invalid, blur, and controlled states", async ({ page }) => {
    const mask = demo(page, "mask");
    await expect(cells(mask).first()).toHaveAttribute("type", "password");

    const states = demo(page, "states");
    await expect(states.locator('[data-slot="input-otp"]').first()).toHaveAttribute(
      "data-invalid",
      "",
    );
    await expect(states.locator('[data-slot="input-otp-input"]').nth(6)).toBeDisabled();

    const controlled = demo(page, "controlled");
    expect(await cells(controlled).evaluateAll((inputs) => inputs.map((input) => (input as HTMLInputElement).value))).toEqual([
      "4",
      "0",
      "2",
      "8",
      "1",
      "6",
    ]);
    await cells(controlled).nth(0).fill("9");
    await expect(controlled.getByRole("status")).toHaveText("Value: 902816");

    const blur = demo(page, "blur");
    const blurCells = cells(blur);
    await blurCells.first().pressSequentially("402816");
    await expect(blur.getByRole("status")).toContainText("Completed 402816");
    await expect(blurCells.last()).not.toBeFocused();
  });
});
