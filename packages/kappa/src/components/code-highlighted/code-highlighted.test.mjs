import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const readSource = (name) => readFileSync(new URL(name, import.meta.url), "utf8");

const componentSource = readSource("./CodeHighlighted.vue");
const copySource = readSource("./CodeHighlightedCopy.vue");
const providerSource = readSource("./ShikiProvider.vue");
const hookSource = readSource("./use-shiki-highlighter.ts");
const languagesSource = readSource("./code-highlighted-languages.ts");
const typesSource = readSource("./code-highlighted.ts");
const styles = readSource("./code-highlighted.css");
const moduleBarrel = readSource("./index.ts");
const componentsBarrel = readSource("../index.ts");
const viteConfig = readSource("../../../vite.config.ts");
const packageManifest = JSON.parse(readSource("../../../package.json"));

test("lazy-loads shiki with both engines and the two fixed themes", () => {
  assert.match(providerSource, /await import\("shiki\/core"\)/);
  assert.match(providerSource, /import\("shiki\/engine\/javascript"\)/);
  assert.match(providerSource, /import\("shiki\/engine\/oniguruma"\)/);
  assert.match(providerSource, /import\("shiki\/wasm"\)/);
  assert.match(providerSource, /import\("@shikijs\/themes\/github-light"\)/);
  assert.match(providerSource, /import\("@shikijs\/themes\/vesper"\)/);
  assert.match(providerSource, /startShikiInitialization/);
  assert.match(providerSource, /provide\(SHIKI_CONTEXT_KEY, context\)/);
  assert.match(providerSource, /createHighlighterCore/);
});

test("highlights through the shared provider with kappa themes", () => {
  assert.match(hookSource, /inject<ShikiContextValue>\(SHIKI_CONTEXT_KEY\)/);
  assert.match(hookSource, /light: "github-light"/);
  assert.match(hookSource, /dark: "vesper"/);
  assert.match(hookSource, /defaultColor: "light-dark\(\)"/);
  assert.match(hookSource, /normalizeCodeHighlightedLanguage/);
  assert.match(hookSource, /is not in the ShikiProvider languages list/);
  assert.match(hookSource, /@dicehub\/kappa\/components\/code-highlighted/);
});

test("renders highlighted html with plain-text fallback and line options", () => {
  assert.match(componentSource, /data-slot="code-highlighted"/);
  assert.match(componentSource, /kappa-code-highlighted__title/);
  assert.match(componentSource, /v-html="processedHtml"/);
  assert.match(componentSource, /<pre v-else class="kappa-code-highlighted__plain">/);
  assert.match(componentSource, /<span class="line line-highlighted">/);
  assert.match(componentSource, /kappa-code-highlighted__line-numbers/);
  assert.match(componentSource, /aria-hidden="true"/);
  assert.match(copySource, /Clipboard as ArkClipboard/);
  assert.match(copySource, /<ArkClipboard\.Root/);
  assert.match(copySource, /<ArkClipboard\.Trigger/);
  assert.match(copySource, /aria-live="polite"/);
  assert.doesNotMatch(copySource, /navigator\.clipboard/);
});

test("declares the supported language set with aliases and dynamic imports", () => {
  for (const lang of ["javascript", "typescript", "tsx", "json", "html", "css", "python", "yaml", "markdown", "bash", "shell", "diff", "vue"]) {
    assert.match(languagesSource, new RegExp(`${lang}: \\(\\) => import\\("@shikijs\\/langs\\/`));
  }
  assert.match(languagesSource, /shellscript/);
  assert.match(typesSource, /ts: "typescript"/);
  assert.match(typesSource, /sh: "bash"/);
  assert.match(typesSource, /py: "python"/);
  assert.match(typesSource, /md: "markdown"/);
  assert.match(typesSource, /DEFAULT_CODE_HIGHLIGHTED_LABELS/);
});

test("exports the documented component API and keeps lifecycle helpers private", () => {
  assert.match(moduleBarrel, /Root: CodeHighlightedRoot/);
  assert.match(moduleBarrel, /Provider: ShikiProvider/);
  assert.match(moduleBarrel, /export \{ CodeHighlightedRoot, ShikiProvider \}/);
  assert.match(moduleBarrel, /useShikiHighlighter/);
  assert.match(moduleBarrel, /normalizeCodeHighlightedLanguage/);
  assert.match(moduleBarrel, /CodeHighlightedProps/);
  assert.match(moduleBarrel, /ShikiProviderProps/);
  assert.doesNotMatch(moduleBarrel, /startShikiInitialization/);
  assert.doesNotMatch(moduleBarrel, /getLanguageSetKey/);
  assert.doesNotMatch(moduleBarrel, /normalizeLanguageSet/);
});

test("isolates optional Shiki packages from the root barrel and library bundle", () => {
  assert.doesNotMatch(componentsBarrel, /code-highlighted/);
  for (const packageName of ["@shikijs/langs", "@shikijs/themes", "shiki"]) {
    assert.equal(packageManifest.peerDependenciesMeta[packageName].optional, true);
  }
  assert.match(viteConfig, /Object\.keys\(packageManifest\.peerDependencies/);
});

test("uses token-driven Kappa styling with dual-theme shiki vars", () => {
  assert.match(styles, /\.kappa-code-highlighted \{/);
  assert.match(styles, /var\(--kappa-line/);
  assert.match(styles, /var\(--kappa-control/);
  assert.match(styles, /var\(--kappa-font-mono/);
  assert.match(styles, /var\(--kappa-success-solid/);
  assert.match(styles, /--kappa-code-highlight-bg/);
  assert.match(styles, /@media \(hover: hover\) and \(pointer: fine\)/);
  assert.doesNotMatch(styles, /\[data-(?:kappa-theme|mode)=/);
  assert.match(styles, /\.kappa-code-highlighted__line-numbers/);
  assert.match(styles, /:focus-visible/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /\.(?!kappa-|(?:shiki|line(?:-highlighted)?)(?![\w-]))[a-z][\w-]*/);
  assert.doesNotMatch(styles, /(?:^|[;{}])\s*--(?!kappa-)[a-z][\w-]*\s*:/m);
  assert.doesNotMatch(
    styles,
    /(?:margin|padding|border)-(?:left|right)|text-align:\s*(?:left|right)/,
  );
});
