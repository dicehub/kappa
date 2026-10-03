import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";

test("documentation distributes full project and upstream notices", async ({ request }) => {
  const response = await request.get("/licenses.txt");
  expect(response.status()).toBe(200);
  const notices = await response.text();
  for (const copyright of [
    "Copyright (c) 2026 dicehub GmbH",
    "Copyright (c) 2026 Cloudflare, Inc.",
    "Copyright (c) 2024 Chakra UI",
    "Copyright (c) 2020 Phosphor Icons",
    "The Geist Project Authors",
    "The Nunito Project Authors",
  ]) expect(notices).toContain(copyright);
  expect(notices).toContain("# Bundled documentation dependencies");
  expect(notices).toContain("@vue/runtime-core");
  expect(notices).toContain(readFileSync(new URL("../node_modules/echarts/NOTICE", import.meta.url), "utf8").trim());
  expect(notices).toContain("Documentation artwork and brand assets are excluded");
});

test("documentation navigation exposes its license notices", async ({ page }) => {
  await page.goto("/docs");
  const link = page.locator("#desktop-navigation").getByRole("link", { name: "Licenses", exact: true });
  await expect(link).toHaveAttribute("href", "/licenses.txt");
  await expect(link).toBeVisible();
});
