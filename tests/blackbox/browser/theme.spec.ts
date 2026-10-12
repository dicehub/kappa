import { test, expect, visitConsumer } from "./fixtures";

test("published CSS resolves every metadata token in both modes with valid browser values", async ({ page }) => {
  await visitConsumer(page, "/test-consumer/theme");
  const metadata = JSON.parse((await page.getByLabel("Published theme metadata").textContent())!);
  expect(metadata.tokens.length).toBeGreaterThan(0);
  for (const mode of ["light", "dark"]) {
    const values = await page.getByRole("region", { name: `${mode} theme`, exact: true }).evaluate((element, { tokens, mode }) => {
      const style = getComputedStyle(element);
      const probe = document.createElement("span"); element.append(probe);
      const canvas = document.createElement("canvas"); canvas.width = canvas.height = 1;
      const context = canvas.getContext("2d")!;
      const normalized = (value: string) => value.replace(/rgba?\([^)]*\)/g, color => {
        context.clearRect(0, 0, 1, 1); context.fillStyle = color; context.fillRect(0, 0, 1, 1);
        return `sRGB(${[...context.getImageData(0, 0, 1, 1).data].join(",")})`;
      });
      try {
        return tokens.map((token: { name: string; preview: string; resolved: Record<string, string> }) => {
          const value = style.getPropertyValue(token.name).trim();
          const property = token.preview === "shadow" ? "box-shadow" : "color";
          probe.style.setProperty(property, token.resolved[mode]);
          const expected = normalized(getComputedStyle(probe).getPropertyValue(property));
          probe.style.setProperty(property, `var(${token.name})`);
          const actual = normalized(getComputedStyle(probe).getPropertyValue(property));
          return { name: token.name, value, actual, expected,
            valid: CSS.supports(property, value) && CSS.supports(property, token.resolved[mode]) };
        });
      } finally { probe.remove(); }
    }, { tokens: metadata.tokens, mode });
    for (const value of values) {
      expect(value.valid, `${mode} ${value.name}: ${value.value}`).toBe(true);
      expect(value.actual, `${mode} ${value.name}`).toBe(value.expected);
    }
  }
});

test("every recommended text and control pair meets its contrast requirement in the rendered theme", async ({ page }) => {
  await visitConsumer(page, "/test-consumer/theme");
  const metadata = JSON.parse((await page.getByLabel("Published theme metadata").textContent())!);
  const luminance = (rgb: number[]) => rgb.map(channel => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  }).reduce((total, value, index) => total + value * [0.2126, 0.7152, 0.0722][index], 0);
  expect(metadata.contrastPairs.length).toBeGreaterThanOrEqual(20);
  const names = new Set(metadata.tokens.map((token: { name: string }) => token.name));
  const ids = metadata.contrastPairs.map((pair: { id: string }) => pair.id);
  expect(new Set(ids).size).toBe(ids.length);
  for (const pair of metadata.contrastPairs) {
    expect(names.has(pair.foreground), pair.id).toBe(true);
    expect(names.has(pair.background), pair.id).toBe(true);
    expect(["text", "nontext"], pair.id).toContain(pair.kind);
    expect(Number.isFinite(pair.minimum), pair.id).toBe(true);
    expect(pair.minimum, pair.id).toBeGreaterThanOrEqual(pair.kind === "text" ? 4.5 : 3);
  }
  for (const mode of ["light", "dark"]) {
    const pairs = await page.getByRole("region", { name: `${mode} theme`, exact: true }).locator("[data-pair]").evaluateAll(elements => elements.map(element => {
      const style = getComputedStyle(element);
      // Let the browser parse colors. Canvas supplies unambiguous sRGB channels.
      const canvas = document.createElement("canvas"); canvas.width = canvas.height = 1;
      const context = canvas.getContext("2d")!;
      context.fillStyle = getComputedStyle(element.closest("section")!).backgroundColor;
      context.fillRect(0, 0, 1, 1);
      context.fillStyle = style.backgroundColor; context.fillRect(0, 0, 1, 1);
      const background = [...context.getImageData(0, 0, 1, 1).data];
      context.fillStyle = style.color; context.fillRect(0, 0, 1, 1);
      return { id: element.getAttribute("data-pair"), foreground: [...context.getImageData(0, 0, 1, 1).data], background };
    }));
    expect(pairs.map(pair => pair.id), `${mode}: complete recommended pairs`).toEqual(ids);
    for (const pair of pairs) {
      const specification = metadata.contrastPairs.find((item: { id: string }) => item.id === pair.id);
      expect(pair.foreground[3], `${mode} ${pair.id}: opaque foreground`).toBe(255);
      expect(pair.background[3], `${mode} ${pair.id}: opaque background`).toBe(255);
      const a = luminance(pair.foreground.slice(0, 3)), b = luminance(pair.background.slice(0, 3));
      const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      expect(ratio, `${mode} ${pair.id}`).toBeGreaterThanOrEqual(Math.max(specification.minimum, specification.kind === "text" ? 4.5 : 3));
    }
  }
});
