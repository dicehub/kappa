import { test, expect, caseUrl, visitConsumer } from "./fixtures";

const files = {
  root: [
    { id: "docs", name: "Documents", kind: "folder" },
    { id: "alpha", name: "alpha.txt", kind: "file", size: 1500 },
    { id: "beta", name: "beta.txt", kind: "file", size: -1, disabled: true },
  ],
  docs: [{ id: "child", name: "child.txt", kind: "file" }],
  replacement: [{ id: "new-root", name: "replacement.txt", kind: "file" }],
};

test("a rejected controlled selection stays unchanged; filtering and disabled entries remain safe", async ({ page, service }) => {
  await service.control({ files });
  await visitConsumer(page, caseUrl("/test-consumer/file-browser", service, "controlled&single"));
  await expect(page.getByRole("checkbox", { name: "Select alpha.txt", exact: true })).toBeChecked();
  await expect(page.getByRole("checkbox", { name: "Select Documents", exact: true })).not.toBeChecked();
  await page.getByRole("checkbox", { name: "Select Documents", exact: true }).focus();
  await page.keyboard.press("Space");
  await expect(page.getByLabel("Public events")).toContainText('selection:["docs"]');
  await expect(page.getByRole("checkbox", { name: "Select alpha.txt", exact: true })).toBeChecked();
  await expect(page.getByRole("checkbox", { name: "Select Documents", exact: true })).not.toBeChecked();
  await expect(page.getByRole("checkbox", { name: "Select beta.txt", exact: true })).toBeDisabled();
  await page.getByRole("searchbox", { name: "Search files" }).fill("  ALPHA  ");
  await expect(page.getByRole("button", { name: "alpha.txt (File)", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Documents (Folder)", exact: true })).toHaveCount(0);
  await expect(page.getByRole("table")).toContainText("1.5 kB");
});

test("a late folder response cannot replace a newer root, even if the consumer ignores cancellation", async ({ page, service }) => {
  await service.control({ files });
  await visitConsumer(page, caseUrl("/test-consumer/file-browser", service, "ignore-abort"));
  await expect(page.getByRole("button", { name: "Documents (Folder)", exact: true })).toBeVisible();
  await service.control({ files, holds: ["load:docs"] });
  await page.getByRole("button", { name: "Documents (Folder)", exact: true }).click();
  await expect.poll(async () => (await service.state()).pending).toContain("load:docs");
  await page.getByRole("button", { name: "Change root", exact: true }).click();
  await expect(page.getByRole("button", { name: "replacement.txt (File)", exact: true })).toBeVisible();
  await expect(page.getByLabel("Public events")).toContainText('abort:{"operation":"folder","folderId":"docs"}');
  await service.control({ release: ["load:docs"] });
  await expect(page.getByLabel("Public events")).toContainText('response:{"operation":"folder","folderId":"docs"}');
  await expect.poll(async () => (await service.state()).pending).toEqual([]);
  await expect(page.getByRole("button", { name: "child.txt (File)", exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "replacement.txt (File)", exact: true })).toBeVisible();
});

test("network failure can be retried; invalid folder responses show an error", async ({ page, service }) => {
  await service.control({ files, errors: { "load:root": "Storage unavailable" } });
  await visitConsumer(page, caseUrl("/test-consumer/file-browser", service));
  await expect(page.getByRole("alert")).toContainText("Storage unavailable");
  await service.control({ errors: {} });
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(page.getByRole("button", { name: "alpha.txt (File)", exact: true })).toBeVisible();
  await service.control({ files: { root: [{ id: "same", name: "One", kind: "file" }, { id: "same", name: "Two", kind: "file" }] } });
  await page.getByRole("button", { name: "Refresh through public API" }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(page.getByRole("button", { name: "One (File)", exact: true })).toHaveCount(0);
  await service.control({ files });
  await page.getByRole("button", { name: "Refresh through public API" }).click();
  await expect(page.getByRole("button", { name: "alpha.txt (File)", exact: true })).toBeVisible();
  await expect(page.getByRole("alert")).toHaveCount(0);
  await service.control({ files: { root: [{ id: "invalid", name: "Device", kind: "device" }] } });
  await page.getByRole("button", { name: "Refresh through public API" }).click();
  await expect(page.getByRole("alert")).toContainText("kind");
  await expect(page.getByRole("button", { name: "Device (File)", exact: true })).toHaveCount(0);
  await expect(page.getByRole("table")).toHaveCount(0);
  await service.control({ files, holds: ["load:root"] });
  await page.getByRole("button", { name: "Refresh through public API" }).click();
  await expect.poll(async () => (await service.state()).pending).toContain("load:root");
  await page.getByRole("button", { name: "Unmount browser", exact: true }).click();
  await expect.poll(async () => (await service.state()).aborted).toContain("load:root");
  await expect(page.locator('[data-slot="file-browser"]')).toHaveCount(0);
});

test("rename failure preserves the draft; a successful retry changes the real data", async ({ page, service }) => {
  await service.control({ files, errors: { "rename:root": "Rename unavailable" } });
  await visitConsumer(page, caseUrl("/test-consumer/file-browser", service));
  await page.getByRole("button", { name: "Actions for alpha.txt", exact: true }).click();
  await page.getByRole("menuitem", { name: "Rename", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("textbox").fill("renamed.txt");
  await dialog.getByRole("button", { name: "Save", exact: true }).click();
  await expect(dialog.getByRole("alert")).toContainText("Rename unavailable");
  await expect(dialog.getByRole("textbox")).toHaveValue("renamed.txt");
  await service.control({ errors: {} });
  await dialog.getByRole("button", { name: "Save", exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole("button", { name: "renamed.txt (File)", exact: true })).toBeVisible();
  await expect(page.getByLabel("Public events")).toContainText('complete:{"operation":"rename","folderId":null');
  expect((await service.state()).mutations).toEqual([{ key: "rename:root", input: { id: "alpha", name: "renamed.txt" } }]);
  await page.getByRole("button", { name: "Actions for renamed.txt", exact: true }).click();
  await page.getByRole("menuitem", { name: "Rename", exact: true }).click();
  await expect(dialog.getByRole("textbox")).toHaveValue("renamed.txt");
  await dialog.getByRole("button", { name: "Save", exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole("alert")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "renamed.txt (File)", exact: true })).toBeVisible();
});

test("pending creation blocks dismissal and double submission and is cancelled on unmount", async ({ page, service }) => {
  await service.control({ files, holds: ["create:root"] });
  await visitConsumer(page, caseUrl("/test-consumer/file-browser", service));
  await page.getByRole("button", { name: "New folder", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("textbox").fill("New project");
  await dialog.getByRole("button", { name: "Create", exact: true }).click();
  await expect.poll(async () => (await service.state()).pending).toContain("create:root");
  await expect(dialog.getByRole("button", { name: "Create", exact: true })).toBeDisabled();
  await dialog.getByRole("textbox").focus();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Enter");
  expect((await service.state()).requests.filter(request => request.key === "create:root")).toHaveLength(1);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeVisible();
  // The consumer decides to remove the block while its modal is open.
  await page.getByRole("button", { name: "Unmount browser", exact: true, includeHidden: true }).evaluate((button: HTMLButtonElement) => button.click());
  await expect(dialog).toHaveCount(0);
  await expect.poll(async () => (await service.state()).aborted).toContain("create:root");
  expect((await service.state()).mutations).toEqual([]);
  await expect(page.getByLabel("Public events")).not.toContainText("complete:");
});

test("a late mutation success cannot report completion after a disabled root changes, even when the host ignores abort", async ({ page, service }) => {
  await service.control({ files, holds: ["create:root"] });
  await visitConsumer(page, caseUrl("/test-consumer/file-browser", service, "ignore-abort"));
  await page.getByRole("button", { name: "New folder", exact: true }).click();
  await page.getByRole("dialog").getByRole("textbox").fill("Old root folder");
  await page.getByRole("dialog").getByRole("button", { name: "Create", exact: true }).click();
  await expect.poll(async () => (await service.state()).pending).toContain("create:root");
  await page.getByRole("button", { name: "Toggle disabled", exact: true, includeHidden: true }).evaluate((button: HTMLButtonElement) => button.click());
  await page.getByRole("button", { name: "Change root", exact: true, includeHidden: true }).evaluate((button: HTMLButtonElement) => button.click());
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "replacement.txt (File)", exact: true })).toBeDisabled();
  await expect(page.getByLabel("Public events")).toContainText('abort:{"operation":"create","folderId":null}');
  expect((await service.state()).aborted).not.toContain("create:root");
  await service.control({ release: ["create:root"] });
  await expect(page.getByLabel("Public events")).toContainText('response:{"operation":"create","folderId":null}');
  await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => resolve())));
  expect((await service.state()).mutations).toEqual([{ key: "create:root", input: { name: "Old root folder" } }]);
  await expect(page.getByLabel("Public events")).not.toContainText("complete:");
  await expect(page.getByRole("status").filter({ hasText: "Changes saved" })).toHaveCount(0);
});

test("a root change cancels a pending mutation even when the host also disables the block", async ({ page, service }) => {
  await service.control({ files, holds: ["create:root"] });
  await visitConsumer(page, caseUrl("/test-consumer/file-browser", service));
  await page.getByRole("button", { name: "New folder", exact: true }).click();
  await page.getByRole("dialog").getByRole("textbox").fill("Old root folder");
  await page.getByRole("dialog").getByRole("button", { name: "Create", exact: true }).click();
  await expect.poll(async () => (await service.state()).pending).toContain("create:root");
  await page.getByRole("button", { name: "Toggle disabled", exact: true, includeHidden: true }).evaluate((button: HTMLButtonElement) => button.click());
  await page.getByRole("button", { name: "Change root", exact: true, includeHidden: true }).evaluate((button: HTMLButtonElement) => button.click());
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect.poll(async () => (await service.state()).aborted).toContain("create:root");
  await expect(page.getByRole("button", { name: "replacement.txt (File)", exact: true })).toBeDisabled();
  expect((await service.state()).mutations).toEqual([]);
  await expect(page.getByLabel("Public events")).not.toContainText("complete:");
});

test("custom actions report real network failures; disabled actions send no request", async ({ page, service }) => {
  await service.control({ files, errors: { "action:root": "Download unavailable" } });
  await visitConsumer(page, caseUrl("/test-consumer/file-browser", service));
  await page.getByRole("button", { name: "Actions for alpha.txt", exact: true }).click();
  const restricted = page.getByRole("menuitem", { name: "Restricted", exact: true });
  await expect(restricted).toHaveAttribute("aria-disabled", "true");
  await restricted.click({ force: true });
  expect((await service.state()).requests.filter(request => request.key.startsWith("action:"))).toEqual([]);
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Actions for alpha.txt", exact: true }).click();
  await page.getByRole("menuitem", { name: "Download", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Download unavailable");
  expect((await service.state()).mutations).toEqual([]);
  await expect(page.getByLabel("Public events")).not.toContainText("complete:");
  await page.getByRole("button", { name: "Dismiss error", exact: true }).click();
  await expect(page.getByRole("alert")).toHaveCount(0);
  await service.control({ errors: {} });
  await page.getByRole("button", { name: "Actions for alpha.txt", exact: true }).click();
  await page.getByRole("menuitem", { name: "Download", exact: true }).click();
  const events = page.getByLabel("Public events");
  await expect(events).toContainText('complete:');
  const completion = JSON.parse((await events.textContent())!.split("\n").find(line => line.startsWith("complete:"))!.slice("complete:".length));
  expect(completion).toMatchObject({ operation: "action", folderId: null, item: { id: "alpha" }, action: "download" });
  expect((await service.state()).mutations).toEqual([{ key: "action:root", input: { action: "download", id: "alpha" } }]);
});

test("removed or disabled static selections stay cleared when the source returns; dates and sizes stay readable", async ({ page, service }) => {
  await visitConsumer(page, caseUrl("/test-consumer/file-browser", service, "static"));
  const alpha = page.getByRole("checkbox", { name: "Select alpha.txt", exact: true });
  const beta = page.getByRole("checkbox", { name: "Select beta.txt", exact: true });
  await expect(page.getByLabel("Consumer source order")).toHaveText("beta,alpha,disabled,docs,child");
  await expect(page.locator(".kappa-file-browser__name")).toHaveText(["Documents", "alpha.txt", "beta.txt", "disabled.txt"]);
  await page.getByRole("button", { name: "Sort by: Name", exact: true }).click();
  await page.getByRole("menuitemradio", { name: "Size", exact: true }).click();
  await page.getByRole("button", { name: "Sort descending", exact: true }).click();
  await expect(page.locator(".kappa-file-browser__name")).toHaveText(["Documents", "alpha.txt", "beta.txt", "disabled.txt"]);
  await expect(page.getByLabel("Consumer source order")).toHaveText("beta,alpha,disabled,docs,child");
  await expect(page.getByRole("row").filter({ has: alpha }).locator("time")).toHaveText("Sep 22, 2026");
  await expect(page.getByRole("row").filter({ has: alpha }).locator(".kappa-file-browser__size")).toHaveText("1.5 kB");
  await expect(page.getByRole("row").filter({ has: beta }).locator(".kappa-file-browser__size")).toHaveText("0 B");
  await expect(page.getByRole("row").filter({ has: beta }).locator("time")).toHaveText("—");
  await expect(page.getByRole("row").filter({ has: page.getByRole("checkbox", { name: "Select disabled.txt", exact: true }) }).locator(".kappa-file-browser__size")).toHaveText("—");
  await alpha.focus(); await page.keyboard.press("Space");
  await expect(alpha).toBeChecked();
  await page.getByRole("button", { name: "Disable alpha", exact: true }).click();
  await expect(alpha).toBeDisabled();
  await expect(alpha).not.toBeChecked();
  await page.getByRole("button", { name: "Restore items", exact: true }).click();
  await expect(alpha).toBeEnabled();
  await expect(alpha).not.toBeChecked();
  await alpha.focus(); await page.keyboard.press("Space");
  await expect(alpha).toBeChecked();
  await page.getByRole("button", { name: "Remove alpha", exact: true }).click();
  await expect(alpha).toHaveCount(0);
  await page.getByRole("button", { name: "Restore items", exact: true }).click();
  await expect(alpha).not.toBeChecked();
  await expect(page.getByLabel("Public events")).toContainText("selection:[]");
});

test("select-all changes visible enabled rows while keeping hidden selections", async ({ page, service }) => {
  await visitConsumer(page, caseUrl("/test-consumer/file-browser", service, "static"));
  const beta = page.getByRole("checkbox", { name: "Select beta.txt", exact: true });
  const alpha = page.getByRole("checkbox", { name: "Select alpha.txt", exact: true });
  await beta.focus(); await page.keyboard.press("Space");
  await page.getByRole("searchbox", { name: "Search files", exact: true }).fill("alpha");
  await page.locator('label[aria-label="Select all visible items"]').click();
  await expect(alpha).toBeChecked();
  await expect(page.locator(".kappa-file-browser__footer")).toContainText("2 selected");
  await page.locator('label[aria-label="Select all visible items"]').click();
  await expect(alpha).not.toBeChecked();
  await page.getByRole("searchbox", { name: "Search files", exact: true }).fill("");
  await expect(beta).toBeChecked();
  await page.locator('label[aria-label="Select all visible items"]').click();
  await expect(page.getByRole("checkbox", { name: "Select disabled.txt", exact: true })).not.toBeChecked();
  await expect(page.locator(".kappa-file-browser__footer")).toContainText("3 selected");
});

test("folder navigation clears the search and selection and emits file activation", async ({ page, service }) => {
  await visitConsumer(page, caseUrl("/test-consumer/file-browser", service, "static"));
  await page.getByRole("checkbox", { name: "Select alpha.txt", exact: true }).focus();
  await page.keyboard.press("Space");
  await expect(page.getByRole("checkbox", { name: "Select alpha.txt", exact: true })).toBeChecked();
  await page.getByRole("searchbox", { name: "Search files", exact: true }).fill("Documents");
  await page.getByRole("button", { name: "Documents (Folder)", exact: true }).click();
  await expect(page.getByRole("searchbox", { name: "Search files", exact: true })).toHaveValue("");
  await expect(page.getByRole("row")).toHaveCount(2);
  await expect(page.getByRole("checkbox", { name: "Select notes.txt", exact: true })).not.toBeChecked();
  await expect(page.getByRole("button", { name: "Clear selection", exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "notes.txt (File)", exact: true }).click();
  const events = page.getByLabel("Public events");
  await expect(events).toContainText('open:');
  const activation = JSON.parse((await events.textContent())!.split("\n").find(line => line.startsWith("open:"))!.slice(5));
  expect(activation).toMatchObject({ id: "child", name: "notes.txt", parentId: "docs" });
  await page.getByRole("button", { name: "Project", exact: true }).click();
  await expect(page.getByRole("button", { name: "alpha.txt (File)", exact: true })).toBeVisible();
  await expect(page.getByRole("checkbox", { name: "Select alpha.txt", exact: true })).not.toBeChecked();
});

test("invalid and duplicate names are blocked before HTTP; case-distinct names remain valid", async ({ page, service }) => {
  await service.control({ files });
  await visitConsumer(page, caseUrl("/test-consumer/file-browser", service));
  await page.getByRole("button", { name: "New folder", exact: true }).click();
  const dialog = page.getByRole("dialog"), input = dialog.getByRole("textbox");
  const submit = dialog.getByRole("button", { name: "Create", exact: true });
  for (const name of ["", " ", ".", "..", "a/b", "a\\b", "a\u0001b", "alpha.txt"]) {
    await input.fill(name);
    if (!name.trim()) await expect(submit).toBeDisabled();
    else { await submit.click(); await expect(dialog.getByRole("alert")).toBeVisible(); }
  }
  expect((await service.state()).requests.filter(request => request.key === "create:root")).toEqual([]);
  await input.fill("Alpha.txt");
  await expect(submit).toBeEnabled();
  await submit.click();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Alpha.txt (Folder)", exact: true })).toBeVisible();
});
