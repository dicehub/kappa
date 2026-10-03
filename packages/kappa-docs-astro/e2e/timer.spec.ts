import { expect, type Locator, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) => page.locator(`[data-timer-demo="${variant}"]`);
const waitForHydration = async (root: Locator) => {
  await expect(root.locator("xpath=parent::astro-island")).not.toHaveAttribute("ssr", "");
};

test.describe("Timer documentation", () => {
  test("renders the public page and composition", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });

    await page.goto("/docs/components/timer");

    await expect(page.getByRole("heading", { level: 1, name: "Timer" })).toBeVisible();
    await expect(page.getByRole("link", { name: "View Ark UI documentation" })).toHaveAttribute(
      "href",
      "https://ark-ui.com/docs/components/timer",
    );
    await expect(page.locator('[data-composition-tree="timer"]')).toContainText(
      "Timer.ActionTrigger",
    );
    expect(errors).toEqual([]);
  });

  test("starts, pauses, resumes, and resets elapsed time", async ({ page }) => {
    await page.clock.install();
    await page.goto("/docs/components/timer");
    const elapsed = demo(page, "elapsed");
    await waitForHydration(elapsed);
    const seconds = elapsed.locator('[data-slot="timer-item"][data-type="seconds"]');

    await expect(seconds).toHaveText("00");
    await elapsed.getByRole("button", { name: "Start" }).click();
    await page.clock.runFor(1_100);
    await expect(seconds).toHaveText("01");

    await elapsed.getByRole("button", { name: "Pause" }).click();
    const pausedValue = await seconds.textContent();
    await page.clock.runFor(2_000);
    await expect(seconds).toHaveText(pausedValue ?? "");

    await elapsed.getByRole("button", { name: "Resume" }).click();
    await page.clock.runFor(1_100);
    await expect(seconds).not.toHaveText(pausedValue ?? "");
    await elapsed.getByRole("button", { name: "Pause" }).click();
    await elapsed.getByRole("button", { name: "Reset" }).click();
    await expect(seconds).toHaveText("00");
  });

  test("uses number-pop motion and allows fast units to opt out", async ({ page }) => {
    await page.clock.install();
    await page.goto("/docs/components/timer");
    const preview = demo(page, "preview");
    await waitForHydration(preview);
    const seconds = preview.locator('[data-slot="timer-item"][data-type="seconds"]');
    await expect(seconds).toHaveAttribute("data-animate", "");
    await expect(seconds).toHaveCSS("font-variant-numeric", "tabular-nums");

    const precision = demo(page, "precision");
    await waitForHydration(precision);
    const milliseconds = precision.locator(
      '[data-slot="timer-item"][data-type="milliseconds"]',
    );
    await expect(milliseconds).not.toHaveAttribute("data-animate", "");
    const valueBeforeAdvance = await milliseconds.textContent();
    await page.clock.runFor(250);
    await expect(milliseconds).not.toHaveText(valueBeforeAdvance ?? "");
  });
});
