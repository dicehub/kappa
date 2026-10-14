import { test, expect, visitConsumer } from "./fixtures";

test("omitted props preserve the text clamp, workflow layout, and tooltip spacing", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await visitConsumer(page, "/test-consumer/defaults");
  const note = page.getByRole("region", { name: "Expandable note" });
  const visibleLines = () => note.evaluate(element => {
    const content = element.querySelector('[data-slot="expandable-text-content"]')!;
    const body = element.querySelector('[data-slot="expandable-text-body"]')!;
    return content.getBoundingClientRect().height / parseFloat(getComputedStyle(body).lineHeight);
  });
  await expect(note.getByRole("button", { name: "Show more", exact: true })).toBeVisible();
  await expect.poll(visibleLines).toBeCloseTo(3, 1);
  await note.getByRole("button", { name: "Show more", exact: true }).click();
  await expect(note.getByRole("button", { name: "Show less", exact: true })).toBeVisible();
  await expect(note.getByRole("button", { name: "Show less", exact: true })).toHaveAttribute("aria-expanded", "true");
  await expect.poll(visibleLines).toBeCloseTo(5, 1);

  const flow = page.getByLabel("Default workflow");
  await expect(flow.locator(".kappa-flow__connector-path")).toHaveCount(4);
  for (const property of ["padding-left", "padding-right"]) await expect(flow).toHaveCSS(property, "16px");
  for (const property of ["padding-top", "padding-bottom"]) await expect(flow).toHaveCSS(property, "64px");
  const start = (await flow.locator("#collect").boundingBox())!;
  const next = (await flow.locator("#validate").boundingBox())!;
  const end = (await flow.locator("#publish").boundingBox())!;
  expect(start.y).toBeCloseTo(next.y, 1);
  expect(start.y).toBeCloseTo(end.y, 1);
  expect(start.x).toBeLessThan(next.x);
  expect(next.x).toBeLessThan(end.x);
  const paths = await flow.locator(".kappa-flow__connector-path").evaluateAll(elements => elements.map(element => element.getAttribute("d")));
  expect(paths.every(path => path && !path.includes("C")), "Default connectors use the orthogonal layout.").toBe(true);

  const trigger = page.getByRole("button", { name: "Edge help", exact: true });
  await trigger.hover();
  const tooltip = page.getByRole("tooltip", { name: "Help content stays inside the viewport." });
  await expect(tooltip).toBeVisible();
  await expect(tooltip).toHaveAttribute("data-side", "top");
  await expect.poll(async () => {
    const help = (await tooltip.boundingBox())!;
    const button = (await trigger.boundingBox())!;
    return { gutter: button.y - help.y - help.height, inset: help.x };
  }).toEqual({ gutter: 8, inset: 12 });
});
