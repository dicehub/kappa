import { createServer } from "node:net";
import { once } from "node:events";
import { fileURLToPath } from "node:url";
import { test, expect, networkContext, type Locator, type Page } from "./network";
import { run, start } from "../process.mjs";
import { developmentFixture } from "../development-fixture.mjs";

async function port() {
  const socket = createServer();
  socket.listen(0, "127.0.0.1");
  await once(socket, "listening");
  const value = (socket.address() as { port: number }).port;
  await new Promise<void>(resolve => socket.close(() => resolve()));
  return value;
}

async function hoverNext(page: Page) {
  const requests: string[] = [];
  const observe = (request: { url(): string }) => requests.push(new URL(request.url()).pathname);
  page.on("request", observe);
  await page.clock.install();
  try {
    await page.getByRole("navigation", { name: "Adjacent documentation pages" })
      .getByRole("link", { name: "Next page: Button Group" }).hover();
    await page.clock.runFor(1_000);
    return requests;
  } finally { await page.clock.resume(); page.off("request", observe); }
}

async function hydrated(scope: Locator) {
  const island = scope.locator("xpath=ancestor::astro-island[1]");
  await expect(island).toHaveCount(1);
  await expect.poll(() => island.getAttribute("ssr")).toBeNull();
}

test("development avoids speculative navigation and stays usable during sync and a production build", async ({ browser, page, request }, info) => {
  test.setTimeout(180_000);
  await page.goto("/docs/components/button");
  await hydrated(page.locator('[data-button-demo="form"]'));
  await page.locator('[data-button-demo="form"]').getByRole("button", { name: "Submit", exact: true }).click();
  await expect(page.locator('[data-button-demo="form"]').getByRole("status")).toHaveText("Submitted");
  const productionRequests = await hoverNext(page);
  expect(productionRequests).toContain("/docs/components/button-group");
  await page.evaluate(() => {
    (window as Window & { __kappaTestDocument?: string }).__kappaTestDocument = "same document";
  });
  await page.getByRole("navigation", { name: "Adjacent documentation pages" })
    .getByRole("link", { name: "Next page: Button Group" }).click();
  await expect(page.getByRole("heading", { name: "Button Group", exact: true, level: 1 })).toBeVisible();
  expect(await page.evaluate(() => (window as Window & { __kappaTestDocument?: string }).__kappaTestDocument)).toBe("same document");
  await page.goBack();
  await hydrated(page.locator('[data-button-demo="form"]'));
  expect(await page.evaluate(() => (window as Window & { __kappaTestDocument?: string }).__kappaTestDocument)).toBe("same document");
  await page.locator('[data-button-demo="form"]').getByRole("button", { name: "Reset", exact: true }).click();
  await expect(page.locator('[data-button-demo="form"]').getByRole("status")).toHaveText("Reset");
  await page.locator('[data-button-demo="form"]').getByRole("button", { name: "Submit", exact: true }).click();
  await expect(page.locator('[data-button-demo="form"]').getByRole("status")).toHaveText("Submitted");

  const root = await developmentFixture(fileURLToPath(new URL("../../", import.meta.url)));
  const url = `http://127.0.0.1:${await port()}`;
  const server = await start("pnpm", ["exec", "astro", "dev", "--host", "127.0.0.1", "--port", new URL(url).port], {
    cwd: root, env: { KAPPA_SOURCE: "" }, log: info.outputPath("development.log"),
    ready: async (signal: AbortSignal) => (await fetch(`${url}/docs/components/button`, { signal })).ok,
  });
  let context;
  const diagnostics: { phase: string; error: string }[] = [];
  try {
    for (const [path, heading] of [
      ["/docs.md", /^# /m],
      ["/docs/changelog.md", /^# Changelog\b/m],
      ["/docs/components/button.md", /^# Button\b/m],
    ] as const) {
      const response = await request.get(`${url}${path}`);
      expect(response.status(), path).toBe(200);
      expect(response.headers()["content-type"], path).toContain("text/markdown");
      expect(await response.text(), path).toMatch(heading);
      await response.dispose();
    }
    const missingMarkdown = await request.get(`${url}/docs/components/does-not-exist.md`);
    expect(missingMarkdown.status()).toBe(404);
    expect(await missingMarkdown.text()).toBe("Page not found");
    await missingMarkdown.dispose();
    const unrelatedMarkdown = await request.get(`${url}/README.md`);
    expect(unrelatedMarkdown.status()).toBe(404);
    expect(unrelatedMarkdown.headers()["content-type"]).not.toContain("text/markdown");
    await unrelatedMarkdown.dispose();
    context = await networkContext(browser, { baseURL: url }, [url]);
    const warmup = await context.newPage();
    // Vite can reload during first-time optimization. Measure after that setup.
    for (const route of ["button", "button-group"]) {
      await warmup.goto(`/docs/components/${route}`);
      await warmup.waitForLoadState("networkidle");
    }
    await warmup.close();
    const development = await context.newPage();
    const errors: string[] = [], dependencies = new Set<string>();
    const scriptErrors: string[] = [];
    let phase = "setup";
    const recordScriptError = (error: string) => {
      diagnostics.push({ phase, error });
      if (phase === "commands") scriptErrors.push(error);
    };
    development.on("pageerror", error => errors.push(error.message));
    development.on("response", response => {
      if (response.request().resourceType() === "script" && response.status() >= 400) {
        recordScriptError(`${response.status()} ${response.url()}`);
      }
    });
    development.on("requestfailed", request => {
      if (request.resourceType() === "script") recordScriptError(`${request.failure()?.errorText} ${request.url()}`);
    });
    development.on("request", request => {
      if (request.resourceType() === "script" && request.url().includes("/node_modules/")) dependencies.add(request.url());
    });
    await development.goto("/docs/components/button");
    const form = development.locator('[data-button-demo="form"]');
    await hydrated(form);
    await form.getByRole("button", { name: "Submit", exact: true }).click();
    await expect(form.getByRole("status")).toHaveText("Submitted");
    expect(await hoverNext(development)).not.toContain("/docs/components/button-group");
    expect(dependencies.size, "The live page must use real dependency modules.").toBeGreaterThan(0);
    phase = "commands";
    const original = new Map<string, string>();
    for (const dependency of dependencies) {
      const response = await request.get(dependency);
      expect(response.status()).toBe(200);
      original.set(dependency, await response.text());
      await response.dispose();
    }
    await development.evaluate(() => {
      (window as Window & { __kappaTestDocument?: string }).__kappaTestDocument = "same document";
    });
    for (const command of ["sync", "build"]) {
      await run("pnpm", ["exec", "astro", command], {
        cwd: root, env: { KAPPA_SOURCE: "" }, timeout: 120_000, log: info.outputPath(`${command}.log`),
      });
      for (const [dependency, body] of original) {
        const response = await request.get(dependency);
        expect(response.status(), `${command}: ${dependency}`).toBe(200);
        expect(await response.text(), `${command}: cached dependency URL`).toBe(body);
        await response.dispose();
      }
      expect(await development.evaluate(() => (window as Window & { __kappaTestDocument?: string }).__kappaTestDocument)).toBe("same document");
      await expect(form.getByRole("status")).toHaveText("Submitted");
      await form.getByRole("button", { name: "Reset", exact: true }).click();
      await expect(form.getByRole("status")).toHaveText("Reset");
      await form.getByRole("button", { name: "Submit", exact: true }).click();
      await expect(form.getByRole("status")).toHaveText("Submitted");
    }
    expect(scriptErrors, "Live dependency requests across sync and build").toEqual([]);
    phase = "navigation";
    await development.getByRole("navigation", { name: "Adjacent documentation pages" })
      .getByRole("link", { name: "Next page: Button Group" }).click();
    await expect(development.getByRole("heading", { name: "Button Group", exact: true, level: 1 })).toBeVisible();
    expect(await development.evaluate(() => (window as Window & { __kappaTestDocument?: string }).__kappaTestDocument)).toBeUndefined();
    await development.goBack();
    await expect(development.getByRole("heading", { name: "Button", exact: true, level: 1 })).toBeVisible();
    await hydrated(development.locator('[data-button-demo="form"]'));
    await development.locator('[data-button-demo="form"]').getByRole("button", { name: "Reset", exact: true }).click();
    await expect(development.locator('[data-button-demo="form"]').getByRole("status")).toHaveText("Reset");
    await development.locator('[data-button-demo="form"]').getByRole("button", { name: "Submit", exact: true }).click();
    await expect(development.locator('[data-button-demo="form"]').getByRole("status")).toHaveText("Submitted");
    expect(errors).toEqual([]);
  } finally {
    try {
      await info.attach("development-script-diagnostics", {
        body: JSON.stringify(diagnostics, null, 2), contentType: "application/json",
      });
    } finally {
      try { await context?.close(); }
      finally { await server.close(); }
    }
  }
});
