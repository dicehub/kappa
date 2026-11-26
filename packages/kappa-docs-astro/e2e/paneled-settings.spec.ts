import { expect, test, type Page } from "@playwright/test";

const base = "/examples/appshell/paneled-workspace";
const pages = ["Account details", "Profile settings", "Limits", "Billing", "Security", "API keys"];
const navigation = (page: Page) => page.getByRole("navigation", { name: "Paneled workspace navigation", exact: true });
async function open(page: Page, view = "Dashboard") {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${base}?${new URLSearchParams({ view })}`);
  await expect(page.locator("astro-island[ssr]")).toHaveCount(0);
}

test("Settings replaces workspace navigation and all six pages remain available", async ({ page }) => {
  await open(page);
  const nav = navigation(page);
  const links = await nav.getByRole("link").allTextContents();
  expect(links.indexOf("Settings")).toBe(links.indexOf("Explore") + 1);
  await nav.getByRole("link", { name: "Settings", exact: true }).click();
  await expect(nav.getByRole("link")).toHaveText(["Back to Dashboard", ...pages]);
  await expect(page.getByRole("heading", { name: "Account details", exact: true })).toBeVisible();
  await page.getByRole("textbox", { name: "Username", exact: true }).fill("alex.cfd");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("Account details saved for this preview.");
  for (const name of pages) {
    await nav.getByRole("link", { name, exact: true }).click();
    await expect(page.getByRole("heading", { name, exact: true })).toBeVisible();
    await expect(nav.getByRole("link", { name, exact: true })).toHaveAttribute("aria-current", "page");
    await expect(page.getByRole("navigation", { name: "Workspace breadcrumb" }).getByRole("link")).toHaveText(["Ros.Space", "Settings", name]);
  }
  await nav.getByRole("link", { name: "Account details", exact: true }).click();
  await expect(page.getByRole("textbox", { name: "Username", exact: true })).toHaveValue("alex.cfd");
  await expect(nav.getByRole("link", { name: "Back to Dashboard", exact: true })).toHaveAttribute("href", "?view=Dashboard");
  await nav.getByRole("link", { name: "Back to Dashboard", exact: true }).click();
  await expect(page).toHaveURL(/view=Dashboard$/);
  await expect(nav.getByRole("link", { name: "Dashboard", exact: true })).toBeFocused();
  await expect(nav.getByRole("link", { name: "Settings", exact: true })).toBeVisible();
});

for (const [view, title] of [...pages.map(page => [page, page]), ["Profile", "Profile settings"], ["Settings", "Account details"]]) {
  test(`settings bookmark ${view} restores the correct context`, async ({ page }) => {
    await open(page, view);
    await expect(page).toHaveURL(`${base}?${new URLSearchParams({ view: title })}`);
    await expect(page.getByRole("heading", { name: title, exact: true })).toBeVisible();
    await expect(navigation(page).getByRole("link")).toHaveText(["Back to Dashboard", ...pages]);
    await page.reload();
    await expect(navigation(page).getByRole("link", { name: title, exact: true })).toHaveAttribute("aria-current", "page");
  });
}

for (const [alias, title] of [["Settings", "Account details"], ["Profile", "Profile settings"]]) {
  test(`${alias} alias does not add a duplicate history entry`, async ({ page }) => {
    await open(page);
    await page.goto(`${base}?${new URLSearchParams({ view: alias })}`);
    await expect(page.locator("astro-island[ssr]")).toHaveCount(0);
    await navigation(page).getByRole("link", { name: title, exact: true }).click();
    await page.goBack();
    await expect(page).toHaveURL(/view=Dashboard$/);
  });
}

test("profile initials preserve complete Unicode characters", async ({ page }) => {
  await open(page, "Profile settings");
  await page.getByRole("textbox", { name: "Full name", exact: true }).fill("👩🏽‍🚀 Morgan");
  await page.getByRole("button", { name: "Use initials", exact: true }).click();
  await expect(page.locator('.paneled-settings [data-slot="avatar-fallback"]')).toHaveText("👩🏽‍🚀M");
});

test("settings search and browser history preserve the separate project context", async ({ page }) => {
  await open(page, "Drone");
  const nav = navigation(page);
  await nav.getByRole("link", { name: "Settings", exact: true }).click();
  await expect(page).toHaveURL(/view=Settings&project=DR-03$/);
  await expect(page.getByRole("textbox", { name: "Project name" })).toHaveValue("Drone");
  await page.keyboard.press("Control+k");
  await page.getByRole("combobox", { name: "Search pages and simulation runs" }).fill("API keys");
  await page.getByRole("option", { name: "API keys", exact: true }).click();
  await expect(page).toHaveURL(/view=API\+keys$/);
  await expect(nav.getByRole("link")).toHaveText(["Back to Dashboard", ...pages]);
  await page.goBack();
  await expect(page).toHaveURL(/view=Settings&project=DR-03$/);
  await expect(page.getByRole("textbox", { name: "Project name" })).toHaveValue("Drone");
  await page.goForward();
  await expect(page.getByRole("heading", { name: "API keys", exact: true })).toBeVisible();
  await page.getByRole("link", { name: "dicehub home", exact: true }).click();
  await expect(page).toHaveURL(/view=Dashboard$/);
  await expect(nav.getByRole("link", { name: "Explore", exact: true })).toBeVisible();
});

test("API key and session actions affect only the local preview", async ({ page }) => {
  await open(page, "API keys");
  const create = page.getByRole("button", { name: "Create API key", exact: true });
  await create.click();
  const dialog = page.getByRole("dialog", { name: "Create API key", exact: true });
  await dialog.getByRole("textbox", { name: "Key name", exact: true }).fill("Results sync");
  await dialog.getByRole("button", { name: "Create key", exact: true }).click();
  await expect(dialog).toBeHidden();
  await expect(create).toBeFocused();
  await expect(page.getByRole("table", { name: "API keys" })).toContainText("Results sync");
  await page.getByRole("button", { name: "Revoke Results sync", exact: true }).click();
  await expect(page.getByRole("table", { name: "API keys" })).not.toContainText("Results sync");
  await expect(create).toBeFocused();
  await navigation(page).getByRole("link", { name: "Security", exact: true }).click();
  await page.getByRole("button", { name: "Sign out other sessions", exact: true }).click();
  await expect(page.getByRole("table", { name: "Active sessions" }).getByRole("row")).toHaveCount(2);
  await expect(page.getByRole("button", { name: "Sign out other sessions", exact: true })).toBeDisabled();
});

test("mobile Settings entry keeps the drawer open and page selection closes it", async ({ page }) => {
  await open(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open sidebar", exact: true }).click();
  const drawer = page.getByRole("dialog", { name: "Paneled workspace navigation", exact: true });
  await drawer.getByRole("link", { name: "Settings", exact: true }).click();
  await expect(drawer).toBeVisible();
  await expect(drawer.getByRole("link")).toHaveText(["Back to Dashboard", ...pages]);
  await drawer.getByRole("link", { name: "Limits", exact: true }).click();
  await expect(drawer).toBeHidden();
  await expect(page.getByRole("heading", { name: "Limits", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Open sidebar", exact: true }).click();
  await drawer.getByRole("link", { name: "Back to Dashboard", exact: true }).click();
  await expect(drawer).toBeVisible();
  await expect(drawer.getByRole("link", { name: "Dashboard", exact: true })).toBeFocused();
  await drawer.getByRole("link", { name: "Settings", exact: true }).click();
  await drawer.getByRole("link", { name: "Back to Dashboard", exact: true }).focus();
  await page.goBack();
  await expect(drawer.getByRole("link", { name: "Dashboard", exact: true })).toBeFocused();
});
