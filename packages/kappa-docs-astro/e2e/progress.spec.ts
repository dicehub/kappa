import { expect, type Page, test } from "@playwright/test";

const linearDemo = (page: Page, variant: string) =>
  page.locator(`[data-progress-demo="${variant}"]`);
const circleDemo = (page: Page, variant: string) =>
  page.locator(`[data-progress-circle-demo="${variant}"]`);

test.describe("Progress documentation", () => {
  test("renders Ark-backed linear states and controlled values", async ({ page }) => {
    await page.goto("/docs/components/progress");

    await expect(page.getByRole("heading", { level: 1, name: "Progress" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(
      page.locator('.docs-page-header__title-row a[href$="/progress-linear"]'),
    ).toHaveCount(1);

    const preview = linearDemo(page, "preview").getByRole("progressbar", {
      name: "Uploading simulation results",
    });
    await expect(preview).toHaveAttribute("aria-valuemin", "0");
    await expect(preview).toHaveAttribute("aria-valuemax", "100");
    await expect(preview).toHaveAttribute("aria-valuenow", "68");
    await expect(linearDemo(page, "preview").locator('[data-slot="progress-value-text"]')).toHaveText(
      "68%",
    );
    await expect
      .poll(() =>
        linearDemo(page, "preview")
          .locator('[data-slot="progress-range"]')
          .evaluate((element) => Math.round(element.getBoundingClientRect().width)),
      )
      .toBeGreaterThan(0);

    const indeterminate = linearDemo(page, "indeterminate").getByRole("progressbar", {
      name: "Preparing mesh",
    });
    await expect(indeterminate).toHaveAttribute("data-state", "indeterminate");
    await expect(indeterminate).not.toHaveAttribute("aria-valuenow");

    const controlled = linearDemo(page, "controlled");
    await controlled.getByRole("slider", { name: "Set progress" }).fill("81");
    await expect(controlled.getByRole("progressbar", { name: "Solver progress" })).toHaveAttribute(
      "aria-valuenow",
      "81",
    );
    await expect(controlled.locator('[data-slot="progress-value-text"]')).toHaveText("81%");
  });

  test("renders circular states, sizes, and controlled values", async ({ page }) => {
    await page.goto("/docs/components/progress-circle");

    await expect(page.getByRole("heading", { level: 1, name: "Progress Circle" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(
      page.locator('.docs-page-header__title-row a[href$="/progress-circular"]'),
    ).toHaveCount(1);

    const preview = circleDemo(page, "preview").getByRole("progressbar", {
      name: "Simulation progress",
    });
    await expect(preview).toHaveAttribute("aria-valuenow", "72");
    await expect(preview).toHaveCSS("width", "72px");
    await expect(circleDemo(page, "preview").locator('[data-slot="progress-circle-value-text"]')).toHaveText(
      "72%",
    );

    const sizedCircles = circleDemo(page, "sizes").getByRole("progressbar");
    await expect(sizedCircles).toHaveCount(3);
    expect(
      await sizedCircles.evaluateAll((elements) =>
        elements.map((element) => Math.round(element.getBoundingClientRect().width)),
      ),
    ).toEqual([48, 72, 96]);

    const indeterminate = circleDemo(page, "indeterminate").getByRole("progressbar", {
      name: "Preparing results",
    });
    await expect(indeterminate).toHaveAttribute("data-state", "indeterminate");
    await expect(indeterminate).not.toHaveAttribute("aria-valuenow");

    const controlled = circleDemo(page, "controlled");
    await controlled.getByRole("slider", { name: "Set progress" }).fill("77");
    await expect(controlled.getByRole("progressbar", { name: "Export progress" })).toHaveAttribute(
      "aria-valuenow",
      "77",
    );
    await expect(controlled.locator('[data-slot="progress-circle-value-text"]')).toHaveText("77%");
  });

  test("respects reduced motion on both forms", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });

    await page.goto("/docs/components/progress");
    await expect(linearDemo(page, "indeterminate").locator('[data-slot="progress-range"]')).toHaveCSS(
      "animation-name",
      "none",
    );

    await page.goto("/docs/components/progress-circle");
    await expect(
      circleDemo(page, "indeterminate").locator('[data-slot="progress-circle-circle"]'),
    ).toHaveCSS("animation-name", "none");
  });
});
