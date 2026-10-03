import { expect, test, type Locator, type Page } from "@playwright/test";

const variants = [
  "simple",
  "split",
  "panel",
  "media-card",
  "email-only",
  "neutral-background",
] as const;
const demo = (page: Page, variant: (typeof variants)[number]) =>
  page.locator(`[data-login-block="${variant}"]`);

async function ready(block: Locator) {
  await expect.poll(() => block.evaluate(element => element.closest("astro-island")?.hasAttribute("ssr"))).toBe(false);
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
});

test("Login blocks page exposes six layouts, source, navigation, and Markdown", async ({ page, request }) => {
  await page.goto("/docs/blocks/login");
  await expect(page.getByRole("heading", { level: 1, name: "Login", exact: true })).toBeVisible();
  await expect(page.locator('#desktop-navigation a[aria-current="page"]')).toHaveText("Login");

  for (const variant of variants) {
    const example = page.locator(`[data-block-example="${variant}"]`);
    await expect(example).toHaveCount(1);
    await expect(example.getByRole("link", { name: /Open full example/ })).toHaveAttribute(
      "href",
      `/examples/login/${variant}`,
    );
    await expect(example.locator("[data-code-full] code")).toContainText("LoginLayout");
  }

  const splitExample = page.locator('[data-block-example="split"]');
  const embeddedSplit = demo(page, "split");
  await ready(embeddedSplit);
  await expect(splitExample.getByText("Sign in to dicehub", { exact: true })).toHaveCount(0);
  await expect(splitExample.locator(".login-engine-graphic")).toBeVisible();
  await expect(splitExample.locator(".login-engine-graphic text")).toHaveCount(0);
  for (const cyclePart of [
    "fuel-pump",
    "fuel-turbine",
    "fuel-rich-preburner",
    "oxidizer-pump",
    "oxidizer-turbine",
    "oxidizer-rich-preburner",
    "main-injector",
    "main-chamber",
  ]) {
    await expect(splitExample.locator(`[data-cycle-part="${cyclePart}"]`)).toHaveCount(1);
  }
  await expect(splitExample.getByText("Engineering work, connected.", { exact: true })).toHaveCount(0);
  const embeddedPrimaryWidth = await embeddedSplit
    .locator('[data-slot="login-layout-primary"]')
    .evaluate(element => element.getBoundingClientRect().width);
  const embeddedMediaWidth = await embeddedSplit
    .locator('[data-slot="login-layout-media"]')
    .evaluate(element => element.getBoundingClientRect().width);
  expect(embeddedPrimaryWidth).toBeGreaterThan(embeddedMediaWidth);

  const mediaCard = demo(page, "media-card");
  await ready(mediaCard);
  await expect(mediaCard.locator(".login-mesh-graphic")).toBeVisible();

  const neutral = demo(page, "neutral-background");
  await ready(neutral);
  await expect(neutral).toHaveCSS("background-color", "rgb(244, 244, 244)");
  const neutralFrame = await neutral.locator('[data-slot="login-layout-frame"]').boundingBox();
  const neutralBrand = await neutral.locator('[data-slot="login-layout-brand"]').boundingBox();
  expect(neutralFrame).not.toBeNull();
  expect(neutralBrand).not.toBeNull();
  expect(neutralFrame!.width).toBe(280);
  expect(neutralBrand!.width).toBe(570);
  expect(neutralBrand!.height).toBe(64);

  await expect(page.locator('pre[data-language="vue"]')).toHaveCount(6);
  const markdown = await request.get("/docs/blocks/login.md");
  expect(markdown.ok()).toBe(true);
  expect(await markdown.text()).toContain("# Login");
});

test("credential and email-only forms keep demo actions local", async ({ page }) => {
  await page.goto("/docs/blocks/login");
  const simple = demo(page, "simple");
  await ready(simple);
  await expect(simple.getByText("Sign in to dicehub", { exact: true })).toHaveCount(0);
  const email = simple.getByRole("textbox", { name: "Email or username" });
  await expect(email).toHaveAttribute("type", "text");
  await expect(email).toHaveAttribute("autocomplete", "username");
  await expect(email).toHaveCSS("border-radius", "2px");
  await email.focus();
  await expect(email).toHaveCSS("border-color", "rgb(36, 122, 183)");
  const emailFocus = await email.evaluate(element => {
    const style = getComputedStyle(element);
    return { boxShadow: style.boxShadow, outlineColor: style.outlineColor };
  });
  expect(emailFocus.outlineColor).toBe("rgba(0, 0, 0, 0)");
  expect(emailFocus.boxShadow).toContain("rgb(36, 122, 183)");
  expect(emailFocus.boxShadow).toContain("0px 0px 5px 0px");
  await expect(email).not.toHaveAttribute("placeholder", /.+/);
  await email.fill("hey@example.com");
  const password = simple.getByLabel("Password", { exact: true });
  await expect(password).toHaveAttribute("type", "password");
  await password.fill("demo-password");
  const passwordToggle = simple.getByRole("button", { name: "Show password" });
  const [passwordBox, passwordToggleBox] = await Promise.all([
    password.boundingBox(),
    passwordToggle.boundingBox(),
  ]);
  expect(passwordBox).not.toBeNull();
  expect(passwordToggleBox).not.toBeNull();
  expect(passwordToggleBox!.height).toBeLessThan(passwordBox!.height);
  const passwordToggleSvg = passwordToggle.locator("svg");
  const passwordToggleSvgElement = await passwordToggleSvg.elementHandle();
  const hiddenIconBox = await passwordToggleSvg.boundingBox();
  expect(passwordToggleSvgElement).not.toBeNull();
  expect(hiddenIconBox).not.toBeNull();
  await passwordToggle.click();
  await expect(password).toHaveAttribute("type", "text");
  const hidePassword = simple.getByRole("button", { name: "Hide password" });
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
    inlineOffset: hiddenIconBox!.x - passwordToggleBox!.x,
    blockOffset: hiddenIconBox!.y - passwordToggleBox!.y,
    width: hiddenIconBox!.width,
    height: hiddenIconBox!.height,
  });
  await hidePassword.click();
  await expect(password).toHaveAttribute("type", "password");
  expect(await passwordToggleSvgElement!.evaluate(element => element.isConnected)).toBe(true);

  const providerLabels = (await simple.locator("button").allTextContents()).map(label => label.trim());
  expect(providerLabels.indexOf("Continue with Google")).toBeLessThan(
    providerLabels.indexOf("Continue with GitHub"),
  );
  const google = simple.getByRole("button", { name: "Continue with Google" });
  const providerBackground = await google.evaluate(element => getComputedStyle(element).backgroundColor);
  await google.hover();
  await expect(google).not.toHaveCSS("background-color", "rgb(233, 237, 242)");
  await page.mouse.move(0, 0);
  await expect(google).toHaveCSS("background-color", providerBackground);
  const divider = simple.locator(".login-form-demo__divider");
  await expect(divider).toHaveText("Or continue with");
  const dividerLine = await divider.locator("span").evaluate(element => {
    const line = getComputedStyle(element, "::before");
    return { content: line.content, height: line.height, width: line.width };
  });
  expect(dividerLine).toEqual({ content: '\"\"', height: "1px", width: "200px" });
  await expect(simple.locator(".login-form-demo__divider .kappa-separator")).toHaveCount(0);
  await expect(simple.getByRole("link", { name: "password", exact: true })).toBeVisible();
  await simple.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(simple.getByText("Demo sign-in submitted for hey@example.com.")).toBeVisible();

  const emailOnly = demo(page, "email-only");
  await ready(emailOnly);
  await expect(emailOnly.locator(".login-form-demo__heading")).toHaveCount(0);
  await expect(emailOnly.getByText("Continue with email", { exact: true })).toHaveCount(0);
  const emailOnlyBrand = await emailOnly.locator(".login-block-demo__brand").boundingBox();
  expect(emailOnlyBrand).not.toBeNull();
  expect(emailOnlyBrand!.width).toBe(145);
  expect(emailOnlyBrand!.height).toBe(38);
  const panelBrand = await demo(page, "panel").locator(".login-block-demo__brand").boundingBox();
  expect(panelBrand).not.toBeNull();
  expect(panelBrand!.width).toBe(emailOnlyBrand!.width);
  expect(panelBrand!.height).toBe(emailOnlyBrand!.height);
  const neutral = demo(page, "neutral-background");
  await ready(neutral);
  const neutralEmail = neutral.getByRole("textbox", { name: "Email" });
  await expect(neutralEmail).toHaveCSS("border-color", "rgb(220, 220, 220)");
  await neutralEmail.focus();
  await expect(neutralEmail).toHaveCSS("border-color", "rgb(36, 122, 183)");
  await expect(emailOnly.getByLabel("Password")).toHaveCount(0);
  await emailOnly.getByRole("textbox", { name: "Email" }).fill("hey@example.com");
  await emailOnly.getByRole("button", { name: "Send sign-in link" }).click();
  await expect(emailOnly.getByText("A demo sign-in link was prepared for hey@example.com.")).toBeVisible();
});

test("split media responds to the viewport and preserves form access", async ({ page }) => {
  await page.goto("/examples/login/split");
  await expect(page).toHaveTitle("Split Media Login — Kappa Blocks");
  const split = demo(page, "split");
  await ready(split);
  await expect(split.getByRole("complementary")).toBeVisible();
  await expect(split.getByText("Sign in to dicehub", { exact: true })).toHaveCount(0);
  await expect(split.getByText("Sign in to continue to your dicehub workspace.")).toHaveCount(0);
  const signUp = split.getByRole("link", { name: "Sign up", exact: true });
  await expect(signUp).toBeVisible();
  await expect(split.locator(".login-engine-graphic")).toBeVisible();
  await expect(split.locator("video")).toHaveCount(0);

  const signUpBox = await signUp.boundingBox();
  const mediaBox = await split.locator('[data-slot="login-layout-media"]').boundingBox();
  expect(signUpBox).not.toBeNull();
  expect(mediaBox).not.toBeNull();
  expect(signUpBox!.x).toBeGreaterThan(mediaBox!.x);
  expect(Math.abs(signUpBox!.x + signUpBox!.width - 1424)).toBeLessThanOrEqual(1);

  for (const [width, expectedMediaWidth] of [
    [1024, 512],
    [1440, 720],
    [1920, 800],
  ] as const) {
    await page.setViewportSize({ width, height: 1000 });
    const primaryWidth = await split.locator('[data-slot="login-layout-primary"]').evaluate(
      element => element.getBoundingClientRect().width,
    );
    const mediaWidth = await split.locator('[data-slot="login-layout-media"]').evaluate(
      element => element.getBoundingClientRect().width,
    );
    expect(Math.abs(mediaWidth - expectedMediaWidth)).toBeLessThanOrEqual(1);
    expect(Math.abs(primaryWidth + mediaWidth - width)).toBeLessThanOrEqual(1);
  }

  await page.setViewportSize({ width: 768, height: 844 });
  await page.reload();
  await ready(split);
  await expect(split.getByRole("complementary")).toBeHidden();
  await expect(split.getByRole("textbox", { name: "Email" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(
    await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight),
  ).toBeLessThanOrEqual(1);
});
