import { test, expect, visitConsumer } from "./fixtures";

test("keyboard column resizing follows direction, respects limits, and resets to the supplied width", async ({ page }) => {
  await visitConsumer(page, "/test-consumer/data-grid");
  const grid = page.getByRole("grid", { name: "Resize records", exact: true });
  const handle = grid.getByRole("separator", { name: "Resize Name column", exact: true });
  for (const direction of ["LTR", "RTL"]) {
    await page.getByRole("button", { name: `Use ${direction}`, exact: true }).click();
    await expect(grid).toHaveCSS("direction", direction.toLowerCase());
    await expect(handle).toHaveAttribute("aria-valuenow", "120");
    await handle.press("ArrowRight");
    await expect(handle).toHaveAttribute("aria-valuenow", direction === "LTR" ? "128" : "112");
    await handle.press("Shift+ArrowRight");
    await expect(handle).toHaveAttribute("aria-valuenow", direction === "LTR" ? "160" : "80");
    await handle.press("Home");
    await expect(handle).toHaveAttribute("aria-valuenow", "80");
    await handle.press(direction === "LTR" ? "ArrowLeft" : "ArrowRight");
    await expect(handle).toHaveAttribute("aria-valuenow", "80");
    await handle.press("End");
    await expect(handle).toHaveAttribute("aria-valuenow", "160");
    await handle.press(direction === "LTR" ? "ArrowRight" : "ArrowLeft");
    await expect(handle).toHaveAttribute("aria-valuenow", "160");
    await handle.press("Enter");
    await expect(handle).toHaveAttribute("aria-valuenow", "120");
  }
});

test("pinned columns stay at the logical edges and grid feedback remains usable in accessibility modes", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await visitConsumer(page, "/test-consumer/data-grid");
  const grid = page.getByRole("grid", { name: "Pinned records", exact: true });
  const viewport = page.locator('[data-slot="data-grid-viewport"]').filter({ has: grid });
  const name = grid.getByRole("columnheader", { name: /Name/ });
  const id = grid.getByRole("columnheader", { name: "ID", exact: true });
  const details = grid.getByRole("columnheader", { name: /^Details/ });
  const pinned = [
    { header: name, cell: grid.getByRole("gridcell", { name: "Atlas", exact: true }), start: true },
    { header: id, cell: grid.getByRole("gridcell", { name: "atlas", exact: true }), start: false },
  ];
  for (const direction of ["LTR", "RTL"]) {
    await page.getByRole("button", { name: `Use ${direction}`, exact: true }).click();
    await expect(grid).toHaveCSS("direction", direction.toLowerCase());
    await viewport.evaluate(element => { element.scrollLeft = 0; });
    const before = (await details.boundingBox())!.x;
    const edges = await viewport.evaluate(element => {
      const box = element.getBoundingClientRect();
      return { left: box.left, right: box.right, clientLeft: box.left + element.clientLeft,
        clientRight: box.left + element.clientLeft + element.clientWidth, gutter: box.width - element.clientWidth };
    });
    for (const fraction of [0, 0.5, 1]) {
      await viewport.evaluate((element, position) => {
        element.scrollLeft = position * element.scrollWidth;
      }, direction === "RTL" ? -fraction : fraction);
      for (const { header, cell, start } of pinned) {
        const left = (direction === "LTR") === start;
        const lower = left ? edges.left : edges.clientRight;
        const upper = left ? edges.clientLeft : edges.right;
        for (const element of [header, cell]) {
          // Native scrollbar gutters can move a sticky edge within this interval.
          await expect.poll(async () => {
            const box = (await element.boundingBox())!;
            const edge = left ? box.x : box.x + box.width;
            return edge >= lower - 1 && edge <= upper + 1;
          }).toBe(true);
          await element.click({ trial: true });
        }
      }
    }
    await expect.poll(() => viewport.evaluate(element => Math.abs(element.scrollLeft))).toBeGreaterThan(edges.gutter * 2);
    expect(Math.abs((await details.boundingBox())!.x - before)).toBeGreaterThan(edges.gutter * 2);
  }
  await page.emulateMedia({ forcedColors: "active" });
  await viewport.evaluate(element => { element.scrollLeft = 0; });
  await page.keyboard.press("Tab");
  const cell = grid.locator('[data-grid-row-index="0"][data-column-id="name"]');
  await cell.focus();
  await expect(cell).toBeFocused();
  await expect(cell).toHaveCSS("outline-style", "solid");
  await expect(cell).toHaveCSS("outline-width", "2px");

  await page.getByRole("button", { name: "Show loading state", exact: true }).click();
  const status = page.getByRole("status");
  await expect(status).toContainText("Loading data");
  const durations = () => status.evaluate(element => element.getAnimations({ subtree: true })
    .map(animation => animation.effect?.getTiming().duration).filter((value): value is number => typeof value === "number"));
  await expect.poll(durations).not.toEqual([]);
  const normal = await durations();
  await page.emulateMedia({ reducedMotion: "reduce", forcedColors: "active" });
  await expect(status).toBeVisible();
  await expect.poll(async () => {
    const reduced = await durations();
    return reduced.length === 0 || Math.min(...reduced) > Math.max(...normal);
  }).toBe(true);
});
