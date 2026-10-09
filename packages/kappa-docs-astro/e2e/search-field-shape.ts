import { expect, type Locator } from "@playwright/test";

export async function expectRoundedSearchField(dialog: Locator, fontSize = 14) {
  const field = dialog.locator(".kappa-command-palette__input-header");
  await expect(field).toHaveCSS("border-radius", "12px");
  await expect(field).toHaveCSS("box-shadow", /2px inset/);
  await expect(dialog.getByRole("combobox")).toHaveCSS("font-size", `${fontSize}px`);
  const panel = (await dialog.boundingBox())!;
  const input = (await field.boundingBox())!;
  expect(input.height).toBeCloseTo(40, 1);
  expect(input.x - panel.x).toBeCloseTo(4, 1);
  expect(input.y - panel.y).toBeCloseTo(4, 1);
  expect(panel.width - input.width).toBeCloseTo(8, 1);
  expect(await field.evaluate(node => getComputedStyle(node).backgroundColor)).toBe(
    await dialog.evaluate(node => getComputedStyle(node).backgroundColor),
  );
}
