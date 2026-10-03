import { expect, type Page, test } from "@playwright/test";

const demo = (page: Page, variant = "preview") => page.locator(`[data-file-browser-demo="${variant}"]`);
test.beforeEach(async ({ page }) => {
  await page.goto("/docs/blocks/file-browser");
  await expect(page.locator("astro-island[ssr]").filter({ has: demo(page) })).toHaveCount(0);
});

test("shows public examples and navigates with keyboard and breadcrumbs", async ({ page, request }) => {
  await expect(page.getByRole("heading", { level: 1, name: "File Browser" })).toBeVisible();
  const example = demo(page);
  await expect(example.locator("tbody tr")).toHaveCount(6);
  const documents = example.getByRole("button", { name: "Documents (Folder)", exact: true });
  await documents.focus();
  await page.keyboard.press("Enter");
  await expect(example.locator("tbody tr")).toHaveCount(3);
  await expect(example.locator(".kappa-file-browser__body")).toBeFocused();
  await example.getByRole("button", { name: "meeting-notes.md (File)", exact: true }).click();
  await expect(example.locator(".file-browser-demo__notice")).toHaveText("Opened: meeting-notes.md");
  await example.getByRole("button", { name: "Project", exact: true }).click();
  await expect(example.locator("tbody tr")).toHaveCount(6);
  await expect(example.locator(".kappa-file-browser__body")).toBeFocused();
  await expect(page.locator('pre[data-language="vue"]').first()).toContainText("@dicehub/kappa/blocks/file-browser");
  const markdown = await request.get("/docs/blocks/file-browser.md");
  expect(markdown.ok()).toBe(true);
  expect(await markdown.text()).toContain("loadFolder");
});

test("filters, sorts, and selects visible results without losing hidden selection", async ({ page }) => {
  const example = demo(page);
  await example.getByRole("checkbox", { name: "Select README.md", exact: true }).focus();
  await page.keyboard.press("Space");
  await example.getByRole("searchbox", { name: "Search files", exact: true }).fill("budget");
  await expect(example.locator("tbody tr")).toHaveCount(1);
  await example.locator('label[aria-label="Select all visible items"]').click();
  await expect(example.locator(".kappa-file-browser__footer")).toContainText("2 selected");
  await example.getByRole("searchbox", { name: "Search files", exact: true }).fill("");
  await expect(example.getByRole("checkbox", { name: "Select README.md", exact: true })).toBeChecked();
  await example.getByRole("button", { name: "Sort by: Name", exact: true }).click();
  await page.getByRole("menuitemradio", { name: "Size", exact: true }).click();
  const names = example.locator(".kappa-file-browser__name");
  await expect(names).toHaveText(["Archive", "Documents", "Images", "README.md", "budget-2026.csv", "workspace-policy.pdf"]);
  await example.getByRole("button", { name: "Sort descending", exact: true }).click();
  await expect(names).toHaveText(["Images", "Documents", "Archive", "workspace-policy.pdf", "budget-2026.csv", "README.md"]);
});

test("shows empty folders and empty search results", async ({ page }) => {
  const example = demo(page);
  await example.getByRole("searchbox").fill("no-such-file");
  await expect(example.locator(".kappa-file-browser__state")).toContainText("No matching files.");
  await example.getByRole("button", { name: "Clear search", exact: true }).click();
  await example.getByRole("button", { name: "Archive (Folder)", exact: true }).click();
  await expect(example.locator(".kappa-file-browser__state")).toContainText("This folder is empty.");
});

test("rename keeps callback errors visible and returns keyboard focus", async ({ page }) => {
  const example = demo(page, "editing");
  const actions = example.getByRole("button", { name: "Actions for README.md", exact: true });
  await actions.focus();
  await page.keyboard.press("Enter");
  await page.getByRole("menuitem", { name: "Rename", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Rename", exact: true });
  const input = dialog.getByRole("textbox", { name: "Name", exact: true });
  await expect(input).toBeFocused();
  await input.fill(".private");
  await dialog.getByRole("button", { name: "Save", exact: true }).click();
  await expect(dialog.getByRole("alert")).toContainText("Names that start with a dot");
  await expect(input).toHaveValue(".private");
  await input.fill("welcome.md");
  await input.press("Enter");
  await expect(dialog).toHaveCount(0);
  await expect(example.getByRole("button", { name: "welcome.md (File)", exact: true })).toBeVisible();
  await expect(example.getByRole("button", { name: "Actions for welcome.md", exact: true })).toBeFocused();
});

test("creates a folder in the current location and blocks readonly rename", async ({ page }) => {
  const example = demo(page, "editing");
  await example.getByRole("button", { name: "Actions for workspace-policy.pdf", exact: true }).click();
  await expect(page.getByRole("menuitem", { name: "Rename", exact: true })).toHaveAttribute("aria-disabled", "true");
  await page.keyboard.press("Escape");
  await example.getByRole("button", { name: "Documents (Folder)", exact: true }).click();
  await example.getByRole("button", { name: "New folder", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "New folder", exact: true });
  await dialog.getByRole("textbox", { name: "Name", exact: true }).fill("Reports");
  await dialog.getByRole("button", { name: "Create", exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await expect(example.getByRole("button", { name: "Reports (Folder)", exact: true })).toBeVisible();
  await expect(example.getByRole("button", { name: "New folder", exact: true })).toBeFocused();
  await example.getByRole("button", { name: "Actions for Reports", exact: true }).click();
  await page.getByRole("menuitem", { name: "Show details", exact: true }).click();
  await expect(example.locator(".file-browser-demo__notice")).toHaveText("Reports · Folder");
});

test("loads asynchronously, retries errors, and cancels a folder load through breadcrumbs", async ({ page }) => {
  const example = demo(page, "async");
  await example.getByRole("button", { name: "Show loading", exact: true }).click();
  await expect(example.locator('[data-slot="file-browser"]')).toHaveAttribute("data-state", "loading");
  await example.getByRole("button", { name: "Complete load", exact: true }).click();
  await expect(example.locator("tbody tr")).toHaveCount(6);
  await example.getByRole("button", { name: "Show error", exact: true }).click();
  await expect(example.getByRole("alert")).toContainText("The folder could not be loaded");
  await example.getByRole("button", { name: "Try again", exact: true }).click();
  await expect(example.locator("tbody tr")).toHaveCount(6);
  await example.getByRole("button", { name: "Documents (Folder)", exact: true }).click();
  await expect(example.locator("tbody tr")).toHaveCount(3);
  await example.getByRole("button", { name: "Show loading", exact: true }).click();
  await example.getByRole("button", { name: "Project", exact: true }).click();
  await expect(example.locator("tbody tr")).toHaveCount(6);
  await expect(example.getByRole("button", { name: "Complete load", exact: true })).toHaveCount(0);
});

test("switches file views and opens item actions with right-click", async ({ page }) => {
  const example = demo(page, "grid");
  await expect(example.locator(".kappa-file-browser__card")).toHaveCount(6);
  await example.locator('[data-file-id="budget"]').click({ button: "right" });
  await page.getByRole("menuitem", { name: "Show details", exact: true }).click();
  await expect(example.locator(".file-browser-demo__notice")).toHaveText("budget-2026.csv · File");
  await example.getByRole("radio", { name: "List view", exact: true }).click();
  await expect(example.locator(".kappa-file-browser__card")).toHaveCount(0);
  await expect(example.locator("tbody tr")).toHaveCount(6);
});

test("returns focus after async rename and new-folder reloads", async ({ page }) => {
  const example = demo(page, "async");
  await example.getByRole("button", { name: "Actions for README.md", exact: true }).click();
  await page.getByRole("menuitem", { name: "Rename", exact: true }).click();
  const rename = page.getByRole("dialog", { name: "Rename", exact: true });
  await rename.getByRole("textbox", { name: "Name", exact: true }).fill("welcome.md");
  await rename.getByRole("button", { name: "Save", exact: true }).click();
  await expect(rename).toHaveCount(0);
  await expect(example.getByRole("searchbox", { name: "Search files", exact: true })).toBeFocused();
  await example.getByRole("button", { name: "New folder", exact: true }).click();
  const create = page.getByRole("dialog", { name: "New folder", exact: true });
  await create.getByRole("textbox", { name: "Name", exact: true }).fill("Reports");
  await create.getByRole("button", { name: "Create", exact: true }).click();
  await expect(create).toHaveCount(0);
  await expect(example.getByRole("button", { name: "New folder", exact: true })).toBeFocused();
});

test("contains narrow layouts and renders the standalone page in both themes", async ({ page }) => {
  for (const variant of ["preview", "grid", "async", "editing"]) {
    await page.goto(`/examples/file-browser/${variant}`);
    await expect(demo(page, variant).locator('[data-slot="file-browser"]')).toBeVisible();
  }
  await page.goto("/examples/file-browser/editing");
  await page.setViewportSize({ width: 390, height: 844 });
  const example = demo(page, "editing");
  await expect(page.locator("astro-island[ssr]")).toHaveCount(0);
  await expect(example.locator('[data-slot="file-browser"]')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  const scroll = example.locator(".kappa-file-browser__scroll");
  expect(await scroll.evaluate(element => element.scrollWidth > element.clientWidth)).toBe(true);
  await scroll.focus();
  await expect(scroll).toBeFocused();
  const colors = [];
  for (const theme of ["light", "dark"]) {
    await page.locator("html").evaluate((element, value) => element.setAttribute("data-kappa-theme", value), theme);
    colors.push(await example.locator('[data-slot="file-browser"]').evaluate(element => getComputedStyle(element).backgroundColor));
  }
  expect(colors[0]).not.toBe(colors[1]);
});
