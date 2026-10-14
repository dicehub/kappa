import { readFile } from "node:fs/promises";
import { test, expect } from "./fixtures";

const routes: string[] = JSON.parse(await readFile(new URL("../docs-routes-baseline.json", import.meta.url), "utf8"));

test("all released documentation, example and Markdown routes remain available over HTTP", async ({ request }) => {
  for (const route of routes) {
    const response = await request.get(route);
    expect(response.status(), route).toBe(200);
    const content = await response.text();
    expect(content.trim().length, route).toBeGreaterThan(0);
    if (route.startsWith("/docs") && route.endsWith(".md")) {
      expect(content, route).toMatch(/^# /);
      expect(content, route).not.toMatch(/<astro-island|astro-code|--shiki-/);
      expect(content, route).not.toContain("docs-page-header__mobile-actions");
    }
    await response.dispose();
  }
  const missing = await request.get("/docs/components/does-not-exist/");
  expect(missing.status()).toBe(404);
});

test("Markdown installation instructions and the public license download contain usable content", async ({ request }) => {
  const install = await request.get("/docs/installation.md");
  expect(await install.text()).toContain("pnpm add @dicehub/kappa vue@^3.5.0");
  const components = await request.get("/docs/components.md");
  expect(await components.text()).toContain("[Button](/docs/components/button)");
  const license = await request.get("/licenses.txt");
  expect(license.ok()).toBeTruthy();
  expect(license.headers()["content-type"]).toContain("text/plain");
  const text = await license.text();
  for (const name of ["MIT License", "Ark UI", "Geist", "Nunito", "Apache ECharts", "Bundled documentation dependencies"]) expect(text).toContain(name);
});
