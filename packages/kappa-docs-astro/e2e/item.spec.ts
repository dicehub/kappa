import { expect, test } from "@playwright/test";

const demo = (variant: string) => `[data-item-demo="${variant}"]`;

test("Item documentation renders its semantic compound examples", async ({ page, request }) => {
  await page.goto("/docs/components/item");

  await expect(page.getByRole("heading", { level: 1, name: "Item" })).toBeVisible();
  await expect(page.getByText("Planned documentation")).toHaveCount(0);

  const preview = page.locator(`${demo("preview")} > .kappa-item`);
  await expect(preview).toHaveAttribute("data-as", "article");
  await expect(preview).toHaveAttribute("data-variant", "outline");
  await expect(preview.locator('[data-slot="item-title"]')).toHaveText("Mesh validation passed");

  const usage = page.locator(demo("usage"));
  await expect(usage.getByRole("list")).toHaveCount(1);
  await expect(usage.getByRole("listitem")).toHaveCount(3);

  const media = page.locator(demo("media"));
  await expect(media.locator('[data-slot="item"]')).toHaveCount(3);
  expect(
    await media.locator('[data-slot="item-media"]').evaluateAll((elements) =>
      elements.map((element) => element.getAttribute("data-variant")),
    ),
  ).toEqual(["icon", "image", "default"]);

  await expect(page.locator(`${demo("link")} a.kappa-item`)).toHaveAttribute("href", "#composition");
  await expect(page.locator('#composition [data-composition-tree="item"]')).toContainText(
    "Item.Content",
  );
  await expect(page.locator("pre[data-language]").first()).toContainText(
    'from "@dicehub/kappa/components/item"',
  );

  const response = await request.get("/docs/components/item.md");
  expect(response.ok()).toBe(true);
  expect(await response.text()).toContain("ItemMediaVariant");
});
