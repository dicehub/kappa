import { expect, test, type Locator, type Page } from "@playwright/test";

const variants = ["complete", "split", "panel", "media-card", "email-only"] as const;
const demo = (page: Page, variant: (typeof variants)[number]) =>
  page.locator(`[data-signup-block="${variant}"]`);

async function ready(block: Locator) {
  await expect.poll(() => block.evaluate(element => element.closest("astro-island")?.hasAttribute("ssr"))).toBe(false);
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
});

test("Signup blocks page exposes five layouts, source, navigation, and Markdown", async ({ page, request }) => {
  await page.goto("/docs/blocks/signup");
  await expect(page.getByRole("heading", { level: 1, name: "Signup", exact: true })).toBeVisible();
  await expect(page.locator('#desktop-navigation a[aria-current="page"]')).toHaveText("Signup");

  for (const variant of variants) {
    const example = page.locator(`[data-block-example="${variant}"]`);
    await expect(example).toHaveCount(1);
    await expect(example.getByRole("link", { name: /Open full example/ })).toHaveAttribute(
      "href",
      `/examples/signup/${variant}`,
    );
    await expect(example.locator("[data-code-full] code")).toContainText("LoginLayout");
  }

  await expect(page.locator('pre[data-language="vue"]')).toHaveCount(5);
  const markdown = await request.get("/docs/blocks/signup.md");
  expect(markdown.ok()).toBe(true);
  expect(await markdown.text()).toContain("# Signup");
});

test("complete signup keeps the dicehub account fields and demo actions local", async ({ page }) => {
  await page.goto("/docs/blocks/signup");
  const complete = demo(page, "complete");
  await ready(complete);

  await expect(complete).toHaveCSS("background-color", "rgb(244, 244, 244)");
  const [completeFrame, completeBrand, completeForm] = await Promise.all([
    complete.locator('[data-slot="login-layout-frame"]').boundingBox(),
    complete.locator('[data-slot="login-layout-brand"]').boundingBox(),
    complete.locator("[data-signup-form]").boundingBox(),
  ]);
  expect(completeFrame).not.toBeNull();
  expect(completeBrand).not.toBeNull();
  expect(completeForm).not.toBeNull();
  expect(completeFrame!.width).toBeGreaterThanOrEqual(400);
  expect(completeFrame!.width).toBeLessThanOrEqual(570);
  expect(completeBrand!.width).toBe(completeFrame!.width);
  expect(completeForm!.width).toBe(400);

  await expect(complete.getByText("Great! You decided to sign up.", { exact: true })).toHaveCSS(
    "color",
    "rgb(51, 51, 51)",
  );
  const fullName = complete.getByLabel("Full name");
  await expect(fullName).toHaveAttribute("autocomplete", "name");
  await expect(fullName).toHaveCSS("border-color", "rgb(220, 220, 220)");
  await expect(fullName).toHaveCSS("border-radius", "2px");
  await expect(fullName).toHaveCSS("border-width", "1px");
  await fullName.hover();
  await expect(fullName).toHaveCSS("border-color", "rgb(36, 122, 183)");
  await expect(fullName).toHaveCSS("box-shadow", "none");
  await fullName.click();
  await expect(fullName).toHaveCSS("border-color", "rgb(36, 122, 183)");
  await expect(fullName).toHaveCSS("box-shadow", "rgb(36, 122, 183) 0px 0px 5px 0px");
  await expect(complete.getByLabel("First name")).toHaveCount(0);
  await expect(complete.getByLabel("Last name")).toHaveCount(0);
  await expect(complete.getByLabel("Email address")).toHaveAttribute("autocomplete", "email");
  await expect(complete.getByLabel("Username")).toHaveAttribute("autocomplete", "username");
  await expect(complete.getByText("dicehub.com/your-username/my-project", { exact: true })).toBeVisible();

  await complete.getByLabel("Username").fill("Ros Space");
  await expect(complete.getByText("dicehub.com/ros-space/my-project", { exact: true })).toBeVisible();

  const password = complete.getByLabel("Password", { exact: true });
  await password.fill("short");
  await expect(complete.getByText("Very weak", { exact: true })).toHaveCSS(
    "color",
    "rgb(180, 35, 24)",
  );
  const strengthBars = complete.locator(".signup-form-demo__password-strength i[data-active]");
  await expect(strengthBars).toHaveCount(1);
  await expect(strengthBars.first()).toHaveCSS("background-color", "rgb(180, 35, 24)");
  await password.fill("longpassword");
  await expect(complete.getByText("Fair", { exact: true })).toHaveCSS(
    "color",
    "rgb(181, 71, 8)",
  );
  await password.fill("Goodpassword4");
  await expect(complete.getByText("Good", { exact: true })).toHaveCSS(
    "color",
    "rgb(36, 122, 183)",
  );
  await password.fill("GoodPassword4!");
  await expect(complete.getByText("Strong", { exact: true })).toHaveCSS(
    "color",
    "rgb(2, 122, 72)",
  );
  await expect(strengthBars).toHaveCount(4);
  await expect(strengthBars.last()).toHaveCSS("background-color", "rgb(2, 122, 72)");
  const showPassword = complete.getByRole("button", { name: "Show password" });
  const passwordToggleSvg = showPassword.locator("svg");
  const passwordToggleSvgElement = await passwordToggleSvg.elementHandle();
  const hiddenToggleBox = await showPassword.boundingBox();
  const hiddenIconBox = await passwordToggleSvg.boundingBox();
  expect(passwordToggleSvgElement).not.toBeNull();
  expect(hiddenToggleBox).not.toBeNull();
  expect(hiddenIconBox).not.toBeNull();
  await showPassword.click();
  await expect(password).toHaveAttribute("type", "text");
  const hidePassword = complete.getByRole("button", { name: "Hide password" });
  await expect(hidePassword.locator('path[d="m2 2 20 20"]')).toHaveCount(1);
  expect(await passwordToggleSvgElement!.evaluate(element => element.isConnected)).toBe(true);
  const visibleToggleBox = await hidePassword.boundingBox();
  const visibleIconBox = await hidePassword.locator("svg").boundingBox();
  expect(visibleToggleBox).not.toBeNull();
  expect(visibleIconBox).not.toBeNull();
  expect({
    inlineOffset: visibleIconBox!.x - visibleToggleBox!.x,
    blockOffset: visibleIconBox!.y - visibleToggleBox!.y,
    width: visibleIconBox!.width,
    height: visibleIconBox!.height,
  }).toEqual({
    inlineOffset: hiddenIconBox!.x - hiddenToggleBox!.x,
    blockOffset: hiddenIconBox!.y - hiddenToggleBox!.y,
    width: hiddenIconBox!.width,
    height: hiddenIconBox!.height,
  });

  const providers = (await complete.locator("button").allTextContents()).map(label => label.trim());
  expect(providers.indexOf("Sign in with Google")).toBeLessThan(
    providers.indexOf("Sign in with GitHub"),
  );
  const providerGroup = complete.locator(".signup-form-demo__providers");
  const providerGroupBox = await providerGroup.boundingBox();
  expect(providerGroupBox).not.toBeNull();
  expect(providerGroupBox!.width).toBe(280);
  await expect(providerGroup.locator(".signup-form-demo__divider")).toHaveText(
    "Or continue with",
  );
  await expect(complete.getByText(/I agree to dicehub's/)).toBeVisible();

  await expect(fullName).toHaveAttribute("placeholder", "Joe Smith");

  const panel = demo(page, "panel");
  await ready(panel);
  await expect(panel.getByLabel("Full name")).toHaveCSS("border-color", "rgb(220, 220, 220)");
});

test("complete standalone signup uses the dicehub layout widths", async ({ page }) => {
  await page.goto("/examples/signup/complete");
  const complete = demo(page, "complete");
  await ready(complete);

  const [frame, brand, form] = await Promise.all([
    complete.locator('[data-slot="login-layout-frame"]').boundingBox(),
    complete.locator('[data-slot="login-layout-brand"]').boundingBox(),
    complete.locator("[data-signup-form]").boundingBox(),
  ]);
  expect(frame).not.toBeNull();
  expect(brand).not.toBeNull();
  expect(form).not.toBeNull();
  expect(frame!.width).toBe(570);
  expect(brand!.width).toBe(570);
  expect(form!.width).toBe(400);
});

test("standalone signup variants fit narrow screens without horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  for (const variant of ["complete", "split", "media-card"] as const) {
    await page.goto(`/examples/signup/${variant}`);
    const block = demo(page, variant);
    await ready(block);
    await expect(block.getByRole("button", { name: "Sign up", exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }

  await expect(page).toHaveTitle("Media Card Signup — Kappa Blocks");
  await page.goto("/examples/signup/complete");
  const complete = demo(page, "complete");
  await ready(complete);
  const fullName = await complete.getByLabel("Full name").boundingBox();
  expect(fullName).not.toBeNull();
  expect(fullName!.width).toBeLessThanOrEqual(358);
});
