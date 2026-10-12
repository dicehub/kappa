import { test, expect, visitConsumer } from "./fixtures";

for (const state of [false, true, "indeterminate"]) {
  test(`a rejected ${state} checkbox preserves its native state and form value`, async ({ page }) => {
    await visitConsumer(page, "/test-consumer/checkbox");
    const input = page.getByRole("checkbox", { name: `Rejected ${state}`, exact: true });
    await expect(input).toHaveJSProperty("checked", state === true);
    await expect(input).toHaveJSProperty("indeterminate", state === "indeterminate");
    await input.focus();
    await page.keyboard.press("Space");
    await expect(page.getByLabel("Public events")).toContainText(`${state}:${state !== true}`);
    await expect(input).toHaveJSProperty("checked", state === true);
    await expect(input).toHaveJSProperty("indeterminate", state === "indeterminate");
    await page.getByRole("button", { name: "Read form" }).click();
    const form = JSON.parse((await page.getByLabel("Form entries").textContent())!);
    expect(form.some(([key]: string[]) => key === `state-${state}`)).toBe(state === true);
  });
}

test("provider and group controlled rejection retain native form state", async ({ page }) => {
  await visitConsumer(page, "/test-consumer/checkbox");
  for (const name of ["Rejected provider", "Rejected group"]) {
    const input = page.getByRole("checkbox", { name, exact: true });
    await input.focus(); await page.keyboard.press("Space");
    await expect(input).not.toBeChecked();
  }
  await expect(page.getByLabel("Public events")).toContainText("provider:true");
  await expect(page.getByLabel("Public events")).toContainText('group:["group-value"]');
  await page.getByRole("button", { name: "Read form" }).click();
  expect(JSON.parse((await page.getByLabel("Form entries").textContent())!).map(([name]: string[]) => name)).not.toContain("provider");
  expect(await page.getByLabel("Form entries").textContent()).not.toContain("group-value");
});

test("an accepted controlled update retains its new native and submitted value", async ({ page }) => {
  await visitConsumer(page, "/test-consumer/checkbox");
  const input = page.getByRole("checkbox", { name: "Accepted change", exact: true });
  await input.focus(); await page.keyboard.press("Space");
  await expect(page.getByLabel("Accepted value")).toHaveText("true");
  await expect(input).toBeChecked();
  await page.getByRole("button", { name: "Read form" }).click();
  expect(JSON.parse((await page.getByLabel("Form entries").textContent())!)).toContainEqual(["accepted", "accepted"]);
});

test("accepted provider and group updates keep their native form values", async ({ page }) => {
  await visitConsumer(page, "/test-consumer/checkbox");
  for (const name of ["Accepted provider", "Accepted group"]) {
    const input = page.getByRole("checkbox", { name, exact: true });
    await input.focus(); await page.keyboard.press("Space");
    await expect(input).toBeChecked();
  }
  await page.getByRole("button", { name: "Read form" }).click();
  const entries = JSON.parse((await page.getByLabel("Form entries").textContent())!);
  expect(entries).toContainEqual(["accepted-provider", "accepted-provider"]);
  expect(entries).toContainEqual(["accepted-group", "accepted-group-value"]);
});
