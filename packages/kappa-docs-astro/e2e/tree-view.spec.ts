import { expect, type Locator, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) =>
  page.locator(`[data-tree-view-demo="${variant}"]`);
const waitForHydration = async (root: Locator) => {
  await expect(root.locator("xpath=parent::astro-island")).not.toHaveAttribute("ssr", "");
};

test.describe("Tree View documentation", () => {
  test("renders the public page and source correspondence", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });

    await page.goto("/docs/components/tree-view");

    await expect(page.getByRole("heading", { level: 1, name: "Tree View" })).toBeVisible();
    await expect(page.locator("#choose tbody tr")).toHaveCount(2);
    await expect(page.locator("#correspondence tbody tr")).toHaveCount(3);
    await expect(page.getByRole("link", { name: "View Ark UI documentation" })).toHaveAttribute(
      "href",
      "https://ark-ui.com/docs/components/tree-view",
    );
    await expect(page.locator('[data-composition-tree="treeView"]')).toContainText(
      "TreeView.BranchTrigger",
    );
    expect(errors).toEqual([]);
  });

  test("expands, collapses, and selects through Ark UI behavior", async ({ page }) => {
    await page.goto("/docs/components/tree-view");
    const preview = demo(page, "preview");
    await waitForHydration(preview);
    const rootBranch = preview.getByRole("treeitem").first();
    const rootTrigger = preview.locator('[data-slot="tree-view-branch-trigger"]').first();

    await expect(rootBranch).toHaveAttribute("aria-expanded", "true");
    await rootTrigger.click();
    await expect(rootBranch).toHaveAttribute("aria-expanded", "false");
    await expect(preview.getByText("physicalProperties", { exact: true })).toBeHidden();

    await rootBranch.focus();
    await rootBranch.press("ArrowRight");
    await expect(rootBranch).toHaveAttribute("aria-expanded", "true");

    const multiple = demo(page, "multiple");
    await waitForHydration(multiple);
    const control = multiple.getByRole("treeitem", { name: /controlDict/ });
    const schemes = multiple.getByRole("treeitem", { name: /fvSchemes/ });
    await control.click();
    await schemes.click({ modifiers: ["Control"] });
    await expect(multiple.locator("output")).toHaveText("2 selected");
  });

  test("keeps 100,100 source nodes in a bounded accessible window", async ({ page }) => {
    await page.goto("/docs/components/tree-view");
    const virtual = demo(page, "virtual");
    await virtual.scrollIntoViewIfNeeded();
    await waitForHydration(virtual);
    const tree = virtual.getByRole("tree", { name: "Mesh regions" });
    const rows = tree.getByRole("treeitem");

    await expect(rows.first()).toContainText("Region 001");
    expect(await rows.count()).toBeLessThan(50);
    await expect(rows.first()).toHaveAttribute("aria-level", "1");
    await expect(rows.first()).toHaveAttribute("aria-posinset", "1");
    await expect(rows.first()).toHaveAttribute("aria-setsize", "100");
    await expect(rows.nth(1)).toHaveAttribute("aria-level", "2");
    await expect(rows.nth(1)).toHaveAttribute("aria-setsize", "1000");

    await tree.focus();
    await tree.press("End");
    const focused = tree.locator('[data-focus="true"]');
    await expect(focused).toContainText("Region 100");
    expect(await rows.count()).toBeLessThan(50);

    await tree.press("Home");
    await tree.press("r");
    await expect(focused).toContainText("Region 002");

    await tree.press("Home");
    await tree.press("ArrowRight");
    await expect(focused).toContainText("Cell 000001");

    const activeId = await tree.getAttribute("aria-activedescendant");
    expect(activeId).toBeTruthy();
    await tree.evaluate((element) => {
      element.scrollTop = element.scrollHeight;
      element.dispatchEvent(new Event("scroll"));
    });
    await expect(page.locator(`[id="${activeId}"]`)).toHaveCount(1);
    expect(await rows.count()).toBeLessThan(50);
  });

  test("loads a branch without locking other trees", async ({ page }) => {
    await page.goto("/docs/components/tree-view");
    const lazy = demo(page, "lazy");
    await waitForHydration(lazy);
    const tree = lazy.getByRole("tree", { name: "Result snapshots" });
    const branch = tree.getByRole("treeitem", { name: /Result snapshots/ });

    const load = branch.click();
    await expect(tree).toHaveAttribute("aria-busy", "true");
    await expect(branch).toHaveAttribute("aria-busy", "true");
    await expect(branch.locator('[data-slot="loader"]')).toBeVisible();
    await expect(branch.locator(':scope > [data-slot="virtual-tree-indicator"] > svg')).toHaveCount(0);
    await load;
    await expect(tree.getByText("time = 0.10", { exact: true })).toBeVisible();
    await expect(tree).not.toHaveAttribute("aria-busy", "true");
  });

  test("does not select a row when its custom action runs", async ({ page }) => {
    await page.goto("/docs/components/tree-view");
    const custom = demo(page, "custom-data");
    await waitForHydration(custom);
    const inlet = custom.getByRole("treeitem", { name: /inlet/ });

    await expect(inlet).toHaveAttribute("aria-selected", "false");
    await custom.getByRole("button", { name: "Inspect inlet" }).click();
    await expect(inlet).toHaveAttribute("aria-selected", "false");
  });
});
