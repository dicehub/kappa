import { expect, test, type Page } from "@playwright/test";

async function example(page: Page, variant = "account", query = "") {
  await page.goto(`/examples/settings/${variant}${query}`);
  const block = page.locator(`[data-settings-demo="${variant}"]`);
  await expect.poll(() => block.evaluate(el => el.closest("astro-island")?.hasAttribute("ssr"))).toBe(false);
  return block;
}

test("Settings documentation includes working examples, navigation, API, and Markdown", async ({ page, request }) => {
  await page.goto("/docs/blocks/settings");
  await expect(page.getByRole("heading", { level: 1, name: "Settings", exact: true })).toBeVisible();
  await expect(page.locator("[data-settings-demo]")).toHaveCount(3);
  await expect(page.getByRole("link", { name: /Open full example/ })).toHaveCount(3);
  await expect(page.locator('pre[data-language="vue"]').first()).toContainText("SettingsSection");
  await expect(page.getByRole("navigation", { name: "Documentation pagination" })).toContainText("Signup");
  const markdown = await request.get("/docs/blocks/settings.md");
  expect(markdown.ok()).toBe(true);
  const text = await markdown.text();
  expect(text).toContain("SettingsLayout");
  expect(text).toContain("v-model:open");
  expect(text).not.toContain("astro-island");
});

test("account layout starts with one open section and keeps forms mounted", async ({ page }) => {
  const block = await example(page);
  await expect(block.getByRole("tab")).toHaveCount(5);
  await expect(block.getByRole("tab", { name: "Account", exact: true })).toHaveAttribute("aria-selected", "true");
  await expect(block.getByRole("textbox", { name: "Username", exact: true })).toBeVisible();
  const email = block.locator('[data-setting="email"]');
  await expect(email.getByRole("textbox", { includeHidden: true })).toHaveCount(1);
  await expect(email.getByRole("textbox", { includeHidden: true })).toBeHidden();
  await expect(block.locator('[data-setting="username"]')).toHaveAttribute("aria-labelledby", /kappa-settings-heading/);
  await expect(block.getByRole("button", { name: "Close Username", exact: true })).toHaveAttribute("aria-expanded", "true");
});

test("sections toggle independently and preserve drafts after closing", async ({ page }) => {
  const block = await example(page);
  const username = block.getByRole("textbox", { name: "Username", exact: true });
  await username.fill("draft-name");
  await block.getByRole("button", { name: "Close Username", exact: true }).click();
  await expect(username).toBeHidden();
  await block.getByRole("button", { name: "Expand Email address", exact: true }).click();
  await expect(block.getByRole("textbox", { name: "Email address", exact: true })).toBeVisible();
  await block.getByRole("button", { name: "Expand Username", exact: true }).click();
  await expect(username).toHaveValue("draft-name");
  await expect(block.getByRole("textbox", { name: "Email address", exact: true })).toBeVisible();
});

test("forms validate and use one contextual save action", async ({ page }) => {
  const block = await example(page);
  const section = block.locator('[data-setting="username"]');
  const input = section.getByRole("textbox", { name: "Username", exact: true });
  await input.fill("ab");
  await expect(section.locator(".settings-demo__form-actions").getByRole("button")).toHaveCount(1);
  await expect(block.getByRole("button", { name: "Cancel", exact: true })).toHaveCount(0);
  await section.getByRole("button", { name: "Save username", exact: true }).click();
  await expect(input).toHaveAttribute("aria-invalid", "true");
  await expect(section).toContainText("Use at least 3 letters");
  await input.fill("avery-cfd");
  await section.getByRole("button", { name: "Save username", exact: true }).click();
  await expect(section.getByRole("button", { name: "Close Username", exact: true })).toBeDisabled();
  await expect(section.getByRole("status")).toHaveText("Username saved in this example.");
  await expect(section).toContainText("@avery-cfd.");
  for (const [title, label] of [["Email address", "Update email address"], ["Password", "Save password"], ["Time zone", "Save time zone"], ["Date format", "Save date format"], ["Time format", "Save time format"]]) {
    await block.getByRole("button", { name: "Expand " + title, exact: true }).click();
    const form = block.getByRole("region", { name: title, exact: true }).locator("form");
    await expect(form.locator(".settings-demo__form-actions").getByRole("button")).toHaveCount(1);
    await expect(form.getByRole("button", { name: label, exact: true })).toBeVisible();
  }
});

test("tabs support keyboard navigation and retain form drafts", async ({ page }) => {
  const block = await example(page);
  await block.getByRole("textbox", { name: "Username", exact: true }).fill("retained-draft");
  await block.getByRole("tab", { name: "Account", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(block.getByRole("tab", { name: "Notifications", exact: true })).toHaveAttribute("aria-selected", "true");
  await block.getByRole("button", { name: "Save notifications", exact: true }).click();
  await expect(block.getByRole("status")).toHaveText("Saved");
  await block.getByRole("tab", { name: "Account", exact: true }).click();
  await expect(block.getByRole("textbox", { name: "Username", exact: true })).toHaveValue("retained-draft");
});

test("section toggles keep their background and keyboard focus in both themes", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const block = await example(page);
  await page.mouse.move(0, 0);
  const section = block.locator('[data-setting="username"]');
  const toggle = section.locator("[data-kappa-settings-trigger]");
  for (const theme of ["light", "dark"]) {
    await page.evaluate(mode => { document.documentElement.dataset.kappaTheme = mode; }, theme);
    await toggle.focus();
    const openBackground = await toggle.evaluate(button => getComputedStyle(button).backgroundColor);
    await toggle.press("Enter");
    await expect(section.getByRole("textbox")).toBeHidden();
    await expect(toggle).toHaveCSS("background-color", openBackground);
    await expect(toggle).toBeFocused();
    await expect(toggle).toHaveCSS("outline-width", "2px");
    await toggle.press("Enter");
    await expect(section.getByRole("textbox")).toBeVisible();
  }
});

test("account deletion requires confirmation and restores focus", async ({ page }) => {
  const block = await example(page);
  await block.getByRole("button", { name: "Expand Delete account", exact: true }).click();
  const trigger = block.getByRole("button", { name: "Delete account", exact: true });
  await trigger.click();
  const dialog = page.getByRole("alertdialog", { name: "Delete account?", exact: true });
  const confirm = dialog.getByRole("button", { name: "Delete account", exact: true });
  await expect(confirm).toBeDisabled();
  await dialog.getByRole("textbox").fill("avery");
  await confirm.click();
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(block.getByRole("status")).toHaveText("Deletion confirmed in this example.");
});

test("sections animate their measured height and release clipping after opening", async ({ page }) => {
  await example(page);
  const heights = await page.evaluate(async () => {
    const section = document.querySelector<HTMLElement>('[data-setting="email"]')!;
    const content = section.querySelector<HTMLElement>('[data-slot="settings-section-content"]')!;
    const measure = (name: string) => new Promise<number[]>(resolve => {
      content.addEventListener("animationstart", event => {
        if (event.animationName !== name) return;
        const animation = content.getAnimations().find(item => (item as CSSAnimation).animationName === name)!;
        animation.pause();
        const duration = Number(animation.effect!.getTiming().duration);
        // The animation releases its height at the exact end of its active interval.
        const sizes = [0, duration / 2, duration - 1].map(time => {
          animation.currentTime = time;
          return content.getBoundingClientRect().height;
        });
        animation.finish();
        resolve(sizes);
      }, { once: true });
      section.querySelector<HTMLButtonElement>("[data-kappa-settings-trigger]")!.click();
    });
    const opening = await measure("kappa-settings-expand");
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    const overflow = getComputedStyle(content).overflow;
    const closing = await measure("kappa-settings-collapse");
    return { opening, closing, overflow };
  });
  expect(heights.opening[0]).toBeLessThan(heights.opening[1]);
  expect(heights.opening[1]).toBeLessThan(heights.opening[2]);
  expect(heights.closing[0]).toBeGreaterThan(heights.closing[1]);
  expect(heights.closing[1]).toBeGreaterThan(heights.closing[2]);
  expect(heights.overflow).toBe("visible");
  await expect(page.getByRole("textbox", { name: "Email address", exact: true })).toBeHidden();
});

test("time zones use the real searchable browser list and include UTC", async ({ page }) => {
  const block = await example(page);
  await block.getByRole("button", { name: "Expand Time zone", exact: true }).click();
  const section = block.locator('[data-setting="timezone"]');
  await expect.poll(async () => Number(await section.locator("[data-timezone-count]").getAttribute("data-timezone-count"))).toBeGreaterThan(400);
  const input = section.getByRole("combobox", { name: "Time zone", exact: true });
  await input.fill("Sao");
  await page.getByRole("option", { name: "(UTC-03:00) Sao Paulo (America)", exact: true }).click();
  await section.getByRole("button", { name: "Save time zone", exact: true }).click();
  await expect(section.getByRole("status")).toContainText("saved");
  await expect(section).toContainText("America/Sao_Paulo.");
  await input.fill("UTC");
  await page.getByRole("option", { name: "(UTC) Coordinated Universal Time", exact: true }).click();
  await expect(input).toHaveValue("(UTC) Coordinated Universal Time");
});

test("password form checks all fields and clears them after saving", async ({ page }) => {
  const block = await example(page);
  await block.getByRole("button", { name: "Expand Password", exact: true }).click();
  const section = block.locator('[data-setting="password"]');
  const current = section.getByLabel("Current password", { exact: true });
  const next = section.getByLabel("New password", { exact: true });
  const confirmation = section.getByLabel("Confirm new password", { exact: true });
  await next.fill("synthetic-new-password");
  await confirmation.fill("mismatch");
  await section.getByRole("button", { name: "Save password", exact: true }).click();
  await expect(current).toHaveAttribute("aria-invalid", "true");
  await expect(confirmation).toHaveAttribute("aria-invalid", "true");
  await current.fill("synthetic-current-password");
  await confirmation.fill("synthetic-new-password");
  await section.getByRole("button", { name: "Save password", exact: true }).click();
  await expect(section.getByRole("status")).toContainText("Password saved");
  await expect(current).toHaveValue("");
  await expect(next).toHaveValue("");
  await expect(confirmation).toHaveValue("");
  await expect(section).toContainText("Last changed just now.");
});

test("notification entries occupy separate rows without overlapping controls", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  const block = await example(page);
  await block.getByRole("tab", { name: "Notifications", exact: true }).click();
  const rows = block.locator("[data-settings-notifications] > label");
  await expect(rows).toHaveCount(3);
  const bounds = await rows.evaluateAll(elements => elements.map(element => {
    const row = element.getBoundingClientRect();
    const label = element.querySelector('[data-part="label"]')!.getBoundingClientRect();
    const control = element.querySelector('[data-part="control"]')!.getBoundingClientRect();
    return { top: row.top, bottom: row.bottom, labelEnd: label.right, controlStart: control.left };
  }));
  for (const row of bounds) expect(row.labelEnd).toBeLessThan(row.controlStart);
  expect(bounds[0].bottom).toBeLessThanOrEqual(bounds[1].top);
  expect(bounds[1].bottom).toBeLessThanOrEqual(bounds[2].top);
  const summary = block.getByRole("checkbox", { name: /Weekly activity summary/ });
  await summary.locator("xpath=ancestor::label[1]").click();
  await expect(summary).toBeChecked();
  await block.getByRole("button", { name: "Save notifications", exact: true }).click();
  await expect(block.getByRole("status")).toHaveText("Saved");
});

test("privacy checkbox groups save on change, show status, and retain values", async ({ page }) => {
  const block = await example(page);
  await block.getByRole("tab", { name: "Privacy", exact: true }).click();
  await expect(block.getByRole("button", { name: /Save/ })).toHaveCount(0);
  const profile = block.locator('[data-privacy-group="profile"]');
  const activity = block.locator('[data-privacy-group="activity"]');
  await expect(profile.locator('[data-slot="checkbox-control"][data-state="checked"] [data-slot="checkbox-indicator"]:not([hidden]) svg')).toBeVisible();
  const email = profile.getByRole("checkbox", { name: /Show my email address/ });
  await email.focus();
  await page.keyboard.press("Space");
  await expect(email).toBeChecked();
  await expect(email.locator("xpath=ancestor::label[1]").locator('[data-slot="checkbox-indicator"]:not([hidden]) svg')).toBeVisible();
  await expect(profile.getByRole("status")).toHaveText("Saving…");
  await expect(profile.getByRole("status")).toHaveText("Saved");
  await expect(activity.getByRole("status")).toBeEmpty();
  const emailLabel = email.locator("xpath=ancestor::label[1]");
  await emailLabel.click();
  await expect(email).not.toBeChecked();
  await emailLabel.click();
  await expect(profile.getByRole("status")).toHaveText("Saved");
  await expect(email).toBeChecked();
  const usage = activity.getByRole("checkbox", { name: /Share anonymous usage data/ });
  await usage.locator("xpath=ancestor::label[1]").click();
  await expect(usage).toBeChecked();
  await expect(activity.getByRole("status")).toHaveText("Saved");
  await block.getByRole("tab", { name: "Account", exact: true }).click();
  await block.getByRole("tab", { name: "Privacy", exact: true }).click();
  await expect(email).toBeChecked();
});

test("email table supports validation, adding, verification, and non-primary removal", async ({ page }) => {
  const block = await example(page);
  await block.getByRole("tab", { name: "Emails", exact: true }).click();
  const table = block.getByRole("table", { name: "Email addresses", exact: true });
  await expect(table.getByRole("columnheader")).toHaveText(["Email", "Status", "Actions"]);
  await expect(table.getByRole("row").filter({ hasText: "avery@example.com" })).toContainText("Primary");
  await expect(table.getByRole("button", { name: "Remove avery@example.com", exact: true })).toHaveCount(0);
  const input = block.getByRole("textbox", { name: "New email address", exact: true });
  await input.fill("AVERY@example.com");
  await block.getByRole("button", { name: "Add email address", exact: true }).click();
  await expect(input).toHaveAttribute("aria-invalid", "true");
  await expect(block).toContainText("already listed");
  await input.fill("avery.extra@example.com");
  await block.getByRole("button", { name: "Add email address", exact: true }).click();
  const row = table.getByRole("row").filter({ hasText: "avery.extra@example.com" });
  await expect(row).toContainText("Unverified");
  await expect(input).toHaveValue("");
  await row.getByRole("button", { name: /Resend verification/ }).click();
  await expect(block.getByRole("status")).toContainText("Verification email sent");
  await row.getByRole("button", { name: "Remove avery.extra@example.com", exact: true }).click();
  await expect(row).toHaveCount(0);
  await expect(input).toBeFocused();
});

test("linked accounts table connects and disconnects each provider", async ({ page }) => {
  const block = await example(page);
  await block.getByRole("tab", { name: "Linked accounts", exact: true }).click();
  const table = block.getByRole("table", { name: "Linked accounts", exact: true });
  await expect(table.getByRole("columnheader")).toHaveText(["Account type", "Name", "Email", "Actions"]);
  const github = table.getByRole("row").filter({ hasText: "GitHub" });
  await github.getByRole("button", { name: "Connect GitHub", exact: true }).click();
  await expect(github).toContainText("Avery North");
  await expect(github).toContainText("avery@example.com");
  await github.getByRole("button", { name: "Disconnect GitHub", exact: true }).click();
  await expect(github).toContainText("Not connected");
  await expect(github).not.toContainText("avery@example.com");
});

test("controlled, disabled, and non-collapsible sections keep distinct behavior", async ({ page }) => {
  const block = await example(page, "controlled");
  const controlled = block.getByRole("region", { name: "Email notifications", exact: true });
  await expect(controlled.getByRole("checkbox")).toBeHidden();
  await block.getByRole("button", { name: "Open section", exact: true }).click();
  await expect(controlled.getByRole("checkbox")).toBeVisible();
  await controlled.getByRole("checkbox").focus();
  await block.getByRole("button", { name: "Close section", exact: true }).evaluate(button => (button as HTMLButtonElement).click());
  await expect(controlled.getByRole("button", { name: "Expand Email notifications", exact: true })).toBeFocused();
  await block.getByRole("button", { name: "Open section", exact: true }).click();
  await block.getByRole("button", { name: "Close section", exact: true }).click();
  await expect(controlled.getByRole("checkbox")).toBeHidden();
  await expect(block.getByRole("button", { name: "Close section", exact: true })).toBeFocused();
  const trigger = controlled.getByRole("button", { name: "Expand Email notifications", exact: true });
  await trigger.focus();
  await page.keyboard.press("Space");
  await expect(controlled.getByRole("checkbox")).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(controlled.getByRole("checkbox")).toBeHidden();
  await expect(block.getByRole("button", { name: "Expand Read-only setting", exact: true })).toBeDisabled();
  const alwaysOpen = block.getByRole("region", { name: "Always open", exact: true });
  await expect(alwaysOpen.getByText("Keep short settings visible.")).toBeVisible();
  await expect(alwaysOpen.getByRole("button")).toHaveCount(0);
  const initial = block.getByRole("region", { name: "Initially open", exact: true });
  await expect(initial.getByRole("button", { name: "Close Initially open", exact: true })).toBeVisible();
  await initial.getByRole("button").click();
  await expect(initial.getByText("Uncontrolled sections can open by default.")).toBeHidden();
  const fixed = block.getByRole("region", { name: "Fixed section", exact: true });
  await fixed.getByRole("button", { name: "Keep editing", exact: true }).focus();
  await fixed.getByRole("button", { name: "Done Fixed section", exact: true }).evaluate(button => (button as HTMLButtonElement).click());
  await expect(fixed.getByRole("status")).toHaveText("Ignored close requests: 1");
  await expect(fixed.getByRole("button", { name: "Keep editing", exact: true })).toBeFocused();
});

for (const width of [1440, 768, 390, 320]) {
  test(`settings remain usable at ${width}px in both themes`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const block = await example(page);
    await block.getByRole("button", { name: "Expand Time zone", exact: true }).click();
    for (const theme of ["light", "dark"]) {
      await page.evaluate(mode => { document.documentElement.dataset.kappaTheme = mode; }, theme);
      await expect(block.getByRole("combobox", { name: "Time zone", exact: true })).toBeVisible();
      const measurements = await block.evaluate(element => {
        const panel = element.querySelector('[data-slot="settings-panel"]')!;
        const bounds = panel.getBoundingClientRect();
        return { pageWidth: document.documentElement.scrollWidth, viewport: innerWidth, left: bounds.left, right: bounds.right, panelBackground: getComputedStyle(panel).backgroundColor, outerBackground: getComputedStyle(element).backgroundColor };
      });
      expect(measurements.pageWidth).toBeLessThanOrEqual(width + 1);
      expect(measurements.left).toBeGreaterThanOrEqual(0);
      expect(measurements.right).toBeLessThanOrEqual(width + 1);
      if (theme === "light") {
        expect(measurements.panelBackground).toBe("rgb(255, 255, 255)");
        expect(measurements.outerBackground).toBe("rgb(251, 251, 251)");
      }
      expect(measurements.panelBackground).not.toBe(measurements.outerBackground);
      for (const tab of ["Notifications", "Privacy", "Emails", "Linked accounts"]) {
        await block.getByRole("tab", { name: tab, exact: true }).click();
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
      }
      await block.getByRole("tab", { name: "Account", exact: true }).click();
    }
  });
}

test.describe("Settings on touch screens", () => {
  test.use({ isMobile: true, hasTouch: true });

  for (const width of [320, 390]) {
    test(`forms, preferences, and table actions work at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      for (const theme of ["light", "dark"]) {
        const block = await example(page);
        await page.evaluate(mode => { document.documentElement.dataset.kappaTheme = mode; }, theme);
        const username = block.getByRole("textbox", { name: "Username", exact: true });
        await expect(username).toHaveCSS("font-size", "16px");
        await username.fill("mobile-avery");
        await block.getByRole("button", { name: "Save username", exact: true }).tap();
        await expect(block.getByRole("status")).toContainText("Username saved");

        await block.getByRole("button", { name: "Expand Time zone", exact: true }).tap();
        const timezone = block.getByRole("combobox", { name: "Time zone", exact: true });
        await expect(timezone).toHaveCSS("font-size", "16px");
        await timezone.fill("UTC");
        const popup = page.getByRole("listbox", { name: "Time zone", exact: true });
        const bounds = await popup.boundingBox();
        expect(bounds!.x).toBeGreaterThanOrEqual(0);
        expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width + 1);
        await page.getByRole("option", { name: "(UTC) Coordinated Universal Time", exact: true }).tap();
        await block.getByRole("button", { name: "Save time zone", exact: true }).tap();
        await expect(block.locator('[data-setting="timezone"]').getByRole("status")).toContainText("saved");

        await block.getByRole("tab", { name: "Notifications", exact: true }).tap();
        await block.getByText("Weekly activity summary", { exact: true }).tap();
        await block.getByRole("button", { name: "Save notifications", exact: true }).tap();
        await expect(block.getByRole("status")).toHaveText("Saved");

        await block.getByRole("tab", { name: "Privacy", exact: true }).tap();
        const email = block.getByRole("checkbox", { name: /Show my email address/ });
        await email.locator("xpath=ancestor::label[1]").tap();
        await expect(email).toBeChecked();
        await expect(block.locator('[data-privacy-group="profile"]').getByRole("status")).toHaveText("Saved");

        await block.getByRole("tab", { name: "Emails", exact: true }).tap();
        await block.getByRole("button", { name: "Resend verification for avery.work@example.com", exact: true }).tap();
        await expect(block.getByRole("status")).toContainText("Verification email sent");
        await block.getByRole("tab", { name: "Linked accounts", exact: true }).tap();
        await block.getByRole("button", { name: "Connect GitHub", exact: true }).tap();
        await expect(block.getByRole("button", { name: "Disconnect GitHub", exact: true })).toBeVisible();
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
      }
    });
  }
});

test("settings support RTL tab navigation and reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const block = await example(page, "account", "?dir=rtl");
  await expect(block).toHaveAttribute("dir", "rtl");
  const section = block.locator('[data-setting="username"]');
  const heading = await section.getByRole("heading").boundingBox();
  const toggle = await section.getByRole("button", { name: "Close Username", exact: true }).boundingBox();
  expect(heading!.x).toBeGreaterThan(toggle!.x);
  await block.getByRole("tab", { name: "Account", exact: true }).focus();
  await page.keyboard.press("ArrowLeft");
  await expect(block.getByRole("tab", { name: "Notifications", exact: true })).toHaveAttribute("aria-selected", "true");
});
