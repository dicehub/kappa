import assert from "node:assert/strict";
import { existsSync, globSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, it } from "node:test";
import { compileScript, parse } from "vue/compiler-sfc";
import {
  htmlPathToMarkdownPath,
  markdownPathToHtmlPath,
} from "./markdown-route-paths.ts";

const distDir = join(import.meta.dirname, "../../dist");

describe("Markdown route mapping", () => {
  it("maps docs Markdown paths to their rendered pages", () => {
    assert.equal(markdownPathToHtmlPath("/docs.md"), "/docs/");
    assert.equal(markdownPathToHtmlPath("/docs/components.md"), "/docs/components/");
    assert.equal(
      markdownPathToHtmlPath("/docs/components/button.md"),
      "/docs/components/button/",
    );
    assert.equal(markdownPathToHtmlPath("/docs/changelog.md"), "/docs/changelog/all/");
    assert.equal(htmlPathToMarkdownPath("/docs/"), "/docs.md");
    assert.equal(
      htmlPathToMarkdownPath("/docs/components/button/"),
      "/docs/components/button.md",
    );
    assert.equal(htmlPathToMarkdownPath("/docs/changelog/all/"), "/docs/changelog.md");
  });

  it("leaves unrelated paths alone", () => {
    assert.equal(markdownPathToHtmlPath("/README.md"), undefined);
    assert.equal(markdownPathToHtmlPath("/docs/components/button"), undefined);
    assert.equal(htmlPathToMarkdownPath("/README/"), undefined);
  });
});

describe("Markdown build output", () => {
  it("backs every rendered Copy Page control with Markdown", () => {
    const htmlFiles = globSync(join(distDir, "docs", "**", "index.html"));
    const copyPageFiles = htmlFiles.filter((htmlFile) =>
      readFileSync(htmlFile, "utf8").includes("docs-page-header__mobile-actions"),
    );

    assert.ok(copyPageFiles.length > 0);

    for (const htmlFile of copyPageFiles) {
      const htmlPath = `/${relative(distDir, htmlFile).replace(/index\.html$/, "")}`;
      const markdownPath = htmlPathToMarkdownPath(htmlPath);

      assert.ok(markdownPath, `${htmlPath} should map to Markdown`);

      const relativeMarkdownFile = markdownPath.slice(1);
      assert.equal(
        existsSync(join(distDir, relativeMarkdownFile)),
        true,
        `${relativeMarkdownFile} should exist`,
      );
    }
  });

  it("emits useful component-directory and installation pages", () => {
    const componentsPath = join(distDir, "docs/components.md");
    const installationPath = join(distDir, "docs/installation.md");

    assert.equal(existsSync(componentsPath), true);
    assert.equal(existsSync(installationPath), true);

    const components = readFileSync(componentsPath, "utf8");
    const installation = readFileSync(installationPath, "utf8");

    assert.match(components, /^# Components\b/);
    assert.match(components, /All components/);
    assert.match(components, /\[Button\]\(\/docs\/components\/button\)/);
    assert.doesNotMatch(components, /Copy page|On this page/);
    assert.match(installation, /^# Installation\b/);
    assert.match(installation, /```bash\npnpm add @dicehub\/kappa vue@\^3\.5\.0\n```/);
    assert.doesNotMatch(installation, /astro-code|--shiki-/);
  });

  it("emits complete Guides pages and matching HTML routes", () => {
    const guides = [
      ["contributing", "Make a Change"],
      ["accessibility", "Layers and Focus"],
      ["registry", "Data Shape"],
    ];

    for (const [slug, section] of guides) {
      const markdownPath = join(distDir, `docs/${slug}.md`);
      const htmlPath = join(distDir, `docs/${slug}/index.html`);
      assert.equal(existsSync(markdownPath), true);
      assert.equal(existsSync(htmlPath), true);

      const markdown = readFileSync(markdownPath, "utf8");
      const html = readFileSync(htmlPath, "utf8");
      assert.match(markdown, new RegExp(`^# ${slug[0].toUpperCase()}${slug.slice(1)}\\b`));
      assert.ok(markdown.includes(section));
      assert.doesNotMatch(markdown, /Planned documentation|Copy page|On this page/);
      assert.doesNotMatch(html, /Planned documentation/);
      if (slug === "registry") {
        assert.match(markdown, /component-registry\.json" with \{ type: "json" \}/);
      }
    }
  });

  it("emits one complete changelog page", () => {
    const changelogPath = join(distDir, "docs/changelog.md");

    assert.equal(existsSync(changelogPath), true);
    assert.equal(existsSync(join(distDir, "docs/changelog/all.md")), false);

    const changelog = readFileSync(changelogPath, "utf8");
    assert.match(changelog, /^# Changelog\b/);
    assert.match(changelog, /0\.4\.0/);
    assert.match(changelog, /Initial Kappa code snapshot/);
    assert.match(changelog, /skipLibCheck: true/);
    assert.doesNotMatch(changelog, /0\.[123]\.0|skipLibCheck disabled|GitLab package registry/);
    assert.doesNotMatch(changelog, /Changelog pages|Copy page|On this page/);
  });

  it("emits the real dicehub logo documentation", () => {
    const logoPath = join(distDir, "docs/components/dicehub-logo.md");

    assert.equal(existsSync(logoPath), true);

    const logo = readFileSync(logoPath, "utf8");

    assert.match(logo, /^# DicehubLogo\b/);
    assert.match(logo, /@dicehub\/kappa\/components\/dicehub-logo/);
    assert.match(logo, /```vue\n<script setup>/);
    assert.match(logo, /```javascript\nimport \{/);
    assert.equal((logo.match(/```vue/g) ?? []).length, 10);
    assert.doesNotMatch(logo, /lang="ts"|```typescript/);
    assert.match(logo, /^## \[Examples\]\(#examples\)$/m);
    assert.match(logo, /^### \[Brand Assets Menu\]\(#brand-assets-menu\)$/m);
    assert.match(logo, /^## \[PoweredByDicehub\]\(#powered-by-dicehub\)$/m);
    assert.match(logo, /^### \[PoweredByDicehub\]\(#powered-by-dicehub-api\)$/m);
    assert.doesNotMatch(logo, /^## \[Accessibility\]\(#accessibility\)$/m);
    assert.doesNotMatch(
      logo,
      /Planned documentation|Copy page|View Code|On this page|astro-code|--shiki-/,
    );
  });

  it("emits the real Dropdown documentation", () => {
    const dropdownPath = join(distDir, "docs/components/dropdown.md");

    assert.equal(existsSync(dropdownPath), true);

    const dropdown = readFileSync(dropdownPath, "utf8");

    assert.match(dropdown, /^# Dropdown\b/);
    assert.match(dropdown, /@dicehub\/kappa\/components\/dropdown/);
    assert.match(dropdown, /```vue\n<script setup>/);
    assert.match(dropdown, /```javascript\nimport \{/);
    assert.equal((dropdown.match(/```vue/g) ?? []).length, 16);
    assert.match(dropdown, /^## \[Keyboard Navigation\]\(#keyboard-navigation\)$/m);
    assert.match(dropdown, /^## \[Behavior and Selection\]\(#behavior-and-selection\)$/m);
    assert.match(dropdown, /^### \[Nested Submenu\]\(#nested-submenu\)$/m);
    assert.match(dropdown, /^### \[Context Menu\]\(#context-menu\)$/m);
    assert.match(dropdown, /^## \[Accessibility\]\(#accessibility\)$/m);
    assert.match(dropdown, /Dropdown\.CheckboxItem/);
    assert.match(dropdown, /useDropdown/);
    assert.doesNotMatch(
      dropdown,
      /Planned documentation|Copy page|View Code|On this page|astro-code|--shiki-/,
    );
  });

  it("emits the real Drawer documentation", () => {
    const drawerPath = join(distDir, "docs/components/drawer.md");

    assert.equal(existsSync(drawerPath), true);

    const drawer = readFileSync(drawerPath, "utf8");

    assert.match(drawer, /^# Drawer\b/);
    assert.match(drawer, /@dicehub\/kappa\/components\/drawer/);
    assert.match(drawer, /```vue\n<script setup>/);
    assert.match(drawer, /```javascript\nimport \{/);
    assert.equal((drawer.match(/```vue/g) ?? []).length, 16);
    assert.match(drawer, /^## \[Sizing and Gestures\]\(#sizing-and-gestures\)$/m);
    assert.match(drawer, /^### \[Snap Points\]\(#snap-points\)$/m);
    assert.match(drawer, /^### \[Nested Drawers\]\(#nested\)$/m);
    assert.match(drawer, /^## \[Accessibility\]\(#accessibility\)$/m);
    assert.match(drawer, /Drawer\.Grabber/);
    assert.match(drawer, /useDrawerStackContext/);
    assert.doesNotMatch(
      drawer,
      /Planned documentation|Copy page|View Code|On this page|astro-code|--shiki-/,
    );
  });

  it("emits the real Autocomplete documentation", () => {
    const autocompletePath = join(distDir, "docs/components/autocomplete.md");

    assert.equal(existsSync(autocompletePath), true);

    const autocomplete = readFileSync(autocompletePath, "utf8");

    assert.match(autocomplete, /^# Autocomplete\b/);
    assert.match(autocomplete, /@dicehub\/kappa\/components\/autocomplete/);
    assert.match(autocomplete, /```vue\n<script setup>/);
    assert.match(autocomplete, /```javascript\nimport \{/);
    assert.doesNotMatch(autocomplete, /lang="ts"|```typescript/);
    assert.match(autocomplete, /^## \[Installation\]\(#installation\)$/m);
    assert.match(autocomplete, /^## \[Examples\]\(#examples\)$/m);
    assert.match(autocomplete, /^### \[Grouped Suggestions\]\(#grouped-suggestions\)$/m);
    assert.match(autocomplete, /^## \[Accessibility\]\(#accessibility\)$/m);
    assert.match(autocomplete, /^## \[API Reference\]\(#api-reference\)$/m);
    assert.match(autocomplete, /allowCustomValue/);
    assert.match(autocomplete, /createAutocompleteCollection/);
    assert.doesNotMatch(
      autocomplete,
      /Planned documentation|Copy page|View Code|On this page|astro-code|--shiki-/,
    );
  });

  it("emits the real Accordion documentation", () => {
    const accordionPath = join(distDir, "docs/components/accordion.md");

    assert.equal(existsSync(accordionPath), true);

    const accordion = readFileSync(accordionPath, "utf8");

    assert.match(accordion, /^# Accordion\b/);
    assert.match(accordion, /@dicehub\/kappa\/components\/accordion/);
    assert.match(accordion, /```vue\n<script setup>/);
    assert.match(accordion, /```javascript\nimport \{/);
    assert.doesNotMatch(accordion, /lang="ts"|```typescript/);
    assert.match(accordion, /^## \[Composition\]\(#composition\)$/m);
    assert.match(accordion, /^### \[Multiple\]\(#multiple\)$/m);
    assert.match(accordion, /^### \[Lazy Mount\]\(#lazy-mount\)$/m);
    assert.match(accordion, /^## \[Accessibility\]\(#accessibility\)$/m);
    assert.match(accordion, /Arrow keys/);
    assert.match(accordion, /^## \[API Reference\]\(#api-reference\)$/m);
    assert.doesNotMatch(
      accordion,
      /Planned documentation|Copy page|View Code|On this page|astro-code|--shiki-/,
    );
  });

  it("emits the real Collapsible documentation", () => {
    const collapsiblePath = join(distDir, "docs/components/collapsible.md");

    assert.equal(existsSync(collapsiblePath), true);

    const collapsible = readFileSync(collapsiblePath, "utf8");

    assert.match(collapsible, /^# Collapsible\b/);
    assert.match(collapsible, /@dicehub\/kappa\/components\/collapsible/);
    assert.match(collapsible, /```vue\n<script setup>/);
    assert.match(collapsible, /```javascript\nimport \{/);
    assert.doesNotMatch(collapsible, /lang="ts"|```typescript/);
    assert.match(collapsible, /^## \[Composition\]\(#composition\)$/m);
    assert.match(collapsible, /^### \[Partial Collapse\]\(#partial-collapse\)$/m);
    assert.match(collapsible, /^### \[Lazy Mount\]\(#lazy-mount\)$/m);
    assert.match(collapsible, /^## \[Accessibility\]\(#accessibility\)$/m);
    assert.match(collapsible, /^## \[API Reference\]\(#api-reference\)$/m);
    assert.doesNotMatch(
      collapsible,
      /Planned documentation|Copy page|View Code|On this page|astro-code|--shiki-/,
    );
  });

  it("emits the real Tabs documentation", () => {
    const tabsPath = join(distDir, "docs/components/tabs.md");

    assert.equal(existsSync(tabsPath), true);

    const tabs = readFileSync(tabsPath, "utf8");

    assert.match(tabs, /^# Tabs\b/);
    assert.match(tabs, /@dicehub\/kappa\/components\/tabs/);
    assert.match(tabs, /```vue\n<script setup>/);
    assert.match(tabs, /```javascript\nimport \{/);
    assert.equal((tabs.match(/```vue/g) ?? []).length, 17);
    assert.doesNotMatch(tabs, /lang="ts"|```typescript/);
    assert.match(tabs, /^## \[Composition\]\(#composition\)$/m);
    assert.match(tabs, /^### \[Manual Activation\]\(#manual-activation\)$/m);
    assert.match(tabs, /^### \[Horizontal Overflow\]\(#horizontal-overflow\)$/m);
    assert.match(tabs, /^### \[Many Tabs\]\(#many-tabs\)$/m);
    assert.match(tabs, /^### \[Dynamic Tab Count\]\(#dynamic-tab-count\)$/m);
    assert.match(tabs, /^### \[Dynamic and Lazy\]\(#dynamic-lazy\)$/m);
    assert.match(tabs, /^## \[Accessibility\]\(#accessibility\)$/m);
    assert.match(tabs, /^## \[API Reference\]\(#api-reference\)$/m);
    assert.match(tabs, /Tabs\.Indicator/);
    assert.match(tabs, /Tabs\.List/);
    assert.match(tabs, /segmented \\\| line/);
    assert.match(tabs, /useTabs/);
    assert.doesNotMatch(
      tabs,
      /Planned documentation|Copy page|View Code|On this page|astro-code|--shiki-/,
    );
  });

  it("emits the real Command Palette documentation", () => {
    const commandPalettePath = join(distDir, "docs/components/command-palette.md");

    assert.equal(existsSync(commandPalettePath), true);

    const commandPalette = readFileSync(commandPalettePath, "utf8");

    assert.match(commandPalette, /^# Command Palette\b/);
    assert.match(commandPalette, /@dicehub\/kappa\/components\/command-palette/);
    assert.match(commandPalette, /```vue\n<script setup>/);
    assert.match(commandPalette, /```javascript\nimport \{/);
    let originalExamples = commandPalette;
    for (const [title, id, animation] of [
      ["Top-aligned search", "top-aligned-search", "command-palette-top-search-in"],
      ["Morphing search", "morphing-search", "command-palette-morph-in"],
    ]) {
      const section = commandPalette.split(`### [${title}](#${id})`)[1];
      const source = section?.match(/```vue\n([\s\S]*?)\n```/)?.[1];
      assert.ok(source, `missing copyable ${id} example`);
      originalExamples = originalExamples.replace(source, "");
      assert.match(source, /<script setup lang="ts">/);
      assert.match(source, /<CommandPalette\.Dialog/);
      assert.match(source, /<CommandPalette\.Panel/);
      assert.match(source, /@keydown="shortcut"/);
      assert.ok(source.includes(`@keyframes ${animation}`));
      assert.doesNotMatch(source, /from ["']\.\.?\//);
      const { descriptor, errors } = parse(source);
      assert.deepEqual(errors, []);
      assert.equal(descriptor.styles.length, 1);
      assert.doesNotThrow(() => compileScript(descriptor, { id }));
    }
    assert.doesNotMatch(originalExamples, /lang="ts"|```typescript/);
    assert.match(commandPalette, /^## \[Examples\]\(#examples\)$/m);
    assert.match(commandPalette, /^## \[Composition\]\(#composition\)$/m);
    assert.match(commandPalette, /^## \[Keyboard Navigation\]\(#keyboard-navigation\)$/m);
    assert.match(commandPalette, /^### \[With Grouped Items\]\(#with-grouped-items\)$/m);
    assert.match(commandPalette, /^### \[Disabling Browser Autocomplete\]\(#disabling-browser-autocomplete\)$/m);
    assert.match(commandPalette, /^### \[ResultItem with Breadcrumbs\]\(#result-item-with-breadcrumbs\)$/m);
    assert.match(commandPalette, /^## \[Component Parts\]\(#component-parts\)$/m);
    assert.match(commandPalette, /^## \[Accessibility\]\(#accessibility\)$/m);
    assert.match(commandPalette, /^## \[API Reference\]\(#api-reference\)$/m);
    assert.doesNotMatch(
      commandPalette,
      /Planned documentation|Copy page|View Code|On this page|astro-code|--shiki-/,
    );
  });

  it("emits the real Attachment documentation", () => {
    const attachmentPath = join(distDir, "docs/components/attachment.md");

    assert.equal(existsSync(attachmentPath), true);

    const attachment = readFileSync(attachmentPath, "utf8");

    assert.match(attachment, /^# Attachment\b/);
    assert.match(attachment, /@dicehub\/kappa\/components\/attachment/);
    assert.match(attachment, /```vue\n<script setup>/);
    assert.match(attachment, /```javascript\nimport \{/);
    assert.equal((attachment.match(/```vue/g) ?? []).length, 10);
    assert.doesNotMatch(attachment, /lang="ts"|```typescript/);
    assert.match(attachment, /^## \[Composition\]\(#composition\)$/m);
    assert.match(attachment, /^### \[States\]\(#states\)$/m);
    assert.match(attachment, /^### \[Attachment Group\]\(#group\)$/m);
    assert.match(attachment, /^### \[Full-card Trigger\]\(#full-card-trigger\)$/m);
    assert.match(attachment, /^## \[Accessibility\]\(#accessibility\)$/m);
    assert.match(attachment, /role="status"/);
    assert.match(attachment, /prefers-reduced-motion/);
    assert.match(attachment, /^## \[API Reference\]\(#api-reference\)$/m);
    assert.match(attachment, /AttachmentTrigger/);
    assert.doesNotMatch(
      attachment,
      /Planned documentation|Copy page|View Code|On this page|astro-code|--shiki-/,
    );
  });

  it("emits the real Avatar documentation", () => {
    const avatarPath = join(distDir, "docs/components/avatar.md");

    assert.equal(existsSync(avatarPath), true);

    const avatar = readFileSync(avatarPath, "utf8");

    assert.match(avatar, /^# Avatar\b/);
    assert.match(avatar, /@dicehub\/kappa\/components\/avatar/);
    assert.match(avatar, /```vue\n<script setup>/);
    assert.match(avatar, /```javascript\nimport \{/);
    assert.equal((avatar.match(/```vue/g) ?? []).length, 9);
    assert.doesNotMatch(avatar, /lang="ts"|```typescript/);
    assert.match(avatar, /^## \[Composition\]\(#composition\)$/m);
    assert.match(avatar, /^### \[Image and Fallback\]\(#image-fallback\)$/m);
    assert.match(avatar, /^### \[Avatar Group\]\(#avatar-group\)$/m);
    assert.match(avatar, /^### \[Account Menu Trigger\]\(#account-menu\)$/m);
    assert.match(avatar, /^## \[Accessibility\]\(#accessibility\)$/m);
    assert.match(avatar, /statusChange/);
    assert.match(avatar, /AvatarGroupCount/);
    assert.match(avatar, /^## \[API Reference\]\(#api-reference\)$/m);
    assert.doesNotMatch(
      avatar,
      /Planned documentation|Copy page|View Code|On this page|astro-code|--shiki-/,
    );
  });

  it("emits the real Badge documentation", () => {
    const badgePath = join(distDir, "docs/components/badge.md");

    assert.equal(existsSync(badgePath), true);

    const badge = readFileSync(badgePath, "utf8");

    assert.match(badge, /^# Badge\b/);
    assert.match(badge, /@dicehub\/kappa\/components\/badge/);
    assert.match(badge, /```vue\n<script setup>/);
    assert.match(badge, /```javascript\nimport \{ Badge \}/);
    assert.doesNotMatch(badge, /lang="ts"|```typescript/);
    assert.match(badge, /^## \[Installation\]\(#installation\)$/m);
    assert.match(badge, /^## \[Examples\]\(#examples\)$/m);
    assert.match(badge, /^### \[Numeric Values\]\(#numeric-values\)$/m);
    assert.match(badge, /^## \[Accessibility\]\(#accessibility\)$/m);
    assert.match(badge, /^## \[API Reference\]\(#api-reference\)$/m);
    assert.match(badge, /BADGE_DEFAULT_ELEMENT/);
    assert.match(badge, /value.*maxVal.*maxLen/s);
    assert.doesNotMatch(
      badge,
      /Planned documentation|Copy page|View Code|On this page|astro-code|--shiki-/,
    );
  });

  it("emits the real Banner documentation", () => {
    const bannerPath = join(distDir, "docs/components/banner.md");

    assert.equal(existsSync(bannerPath), true);

    const banner = readFileSync(bannerPath, "utf8");

    assert.match(banner, /^# Banner\b/);
    assert.match(banner, /@dicehub\/kappa\/components\/banner/);
    assert.match(banner, /```vue\n<script setup>/);
    assert.match(banner, /```javascript\nimport \{ Banner, BannerAction \}/);
    assert.equal((banner.match(/```vue/g) ?? []).length, 10);
    assert.doesNotMatch(banner, /lang="ts"|```typescript/);
    assert.match(banner, /^## \[Installation\]\(#installation\)$/m);
    assert.match(banner, /^## \[Examples\]\(#examples\)$/m);
    assert.match(banner, /^### \[Right-to-left\]\(#right-to-left\)$/m);
    assert.match(banner, /^## \[Accessibility\]\(#accessibility\)$/m);
    assert.match(banner, /role="status"/);
    assert.match(banner, /role="alert"/);
    assert.match(banner, /^## \[API Reference\]\(#api-reference\)$/m);
    assert.doesNotMatch(
      banner,
      /Planned documentation|Copy page|View Code|On this page|astro-code|--shiki-/,
    );
  });

  it("emits the real Breadcrumbs documentation", () => {
    const breadcrumbsPath = join(distDir, "docs/components/breadcrumbs.md");

    assert.equal(existsSync(breadcrumbsPath), true);

    const breadcrumbs = readFileSync(breadcrumbsPath, "utf8");

    assert.match(breadcrumbs, /^# Breadcrumbs\b/);
    assert.match(breadcrumbs, /@dicehub\/kappa\/components\/breadcrumbs/);
    assert.match(breadcrumbs, /```vue\n<script setup>/);
    assert.match(breadcrumbs, /```javascript\nimport \{/);
    assert.equal((breadcrumbs.match(/```vue/g) ?? []).length, 10);
    assert.doesNotMatch(breadcrumbs, /lang="ts"|```typescript/);
    assert.match(breadcrumbs, /^## \[Examples\]\(#examples\)$/m);
    assert.match(breadcrumbs, /^### \[Basic\]\(#basic\)$/m);
    assert.match(breadcrumbs, /^### \[Collapsed Ancestor Menu\]\(#collapsed-menu\)$/m);
    assert.match(breadcrumbs, /^### \[Right-to-left\]\(#right-to-left\)$/m);
    assert.match(breadcrumbs, /^## \[Accessibility\]\(#accessibility\)$/m);
    assert.match(breadcrumbs, /aria-current="page"/);
    assert.match(breadcrumbs, /does not measure, hide, or automatically/);
    assert.match(breadcrumbs, /^## \[API Reference\]\(#api-reference\)$/m);
    assert.match(breadcrumbs, /BreadcrumbsCurrent/);
    assert.doesNotMatch(
      breadcrumbs,
      /Planned documentation|Copy page|View Code|On this page|astro-code|--shiki-/,
    );
  });

  it("emits the real Button documentation", () => {
    const buttonPath = join(distDir, "docs/components/button.md");

    assert.equal(existsSync(buttonPath), true);

    const button = readFileSync(buttonPath, "utf8");

    assert.match(button, /^# Button\b/);
    assert.match(button, /@dicehub\/kappa\/components\/button/);
    assert.match(button, /@lucide\/vue/);
    assert.match(button, /pnpm add @lucide\/vue/);
    assert.doesNotMatch(button, /const icon = \(path\)/);
    assert.match(button, /```vue\n<script setup>/);
    assert.match(button, /```javascript\nimport \{ Button, LinkButton \}/);
    assert.equal((button.match(/```vue/g) ?? []).length, 22);
    assert.doesNotMatch(button, /lang="ts"|```typescript/);
    assert.match(button, /^## \[Installation\]\(#installation\)$/m);
    assert.match(button, /^## \[Examples\]\(#examples\)$/m);
    assert.match(button, /^### \[Basic\]\(#basic\)$/m);
    assert.match(button, /^### \[Variants\]\(#variants\)$/m);
    assert.match(button, /^#### \[Primary\]\(#primary\)$/m);
    assert.match(button, /^#### \[Secondary Destructive\]\(#secondary-destructive\)$/m);
    assert.match(button, /^#### \[Link\]\(#link\)$/m);
    assert.match(button, /^### \[Links and asChild\]\(#links\)$/m);
    assert.match(button, /^### \[Right-to-left\]\(#right-to-left\)$/m);
    assert.match(button, /^## \[Accessibility\]\(#accessibility\)$/m);
    assert.match(button, /aria-busy="true"/);
    assert.match(button, /^## \[API Reference\]\(#api-reference\)$/m);
    assert.match(button, /destructive-outline/);
    assert.doesNotMatch(
      button,
      /Planned documentation|Copy page|View Code|On this page|astro-code|--shiki-/,
    );
  });

  it("emits the real Button Group documentation", () => {
    const buttonGroupPath = join(distDir, "docs/components/button-group.md");

    assert.equal(existsSync(buttonGroupPath), true);

    const buttonGroup = readFileSync(buttonGroupPath, "utf8");

    assert.match(buttonGroup, /^# Button Group\b/);
    assert.match(buttonGroup, /@dicehub\/kappa\/components\/button-group/);
    assert.match(buttonGroup, /@lucide\/vue/);
    assert.match(buttonGroup, /```vue\n<script setup>/);
    assert.match(buttonGroup, /```javascript\nimport \{/);
    assert.equal((buttonGroup.match(/```vue/g) ?? []).length, 17);
    assert.doesNotMatch(buttonGroup, /lang="ts"|```typescript/);
    assert.match(buttonGroup, /^## \[Composition\]\(#composition\)$/m);
    assert.match(buttonGroup, /^## \[Examples\]\(#examples\)$/m);
    assert.match(buttonGroup, /^### \[Basic\]\(#basic\)$/m);
    assert.match(buttonGroup, /^### \[Orientation\]\(#orientation\)$/m);
    assert.match(buttonGroup, /^### \[Separator\]\(#separator\)$/m);
    assert.match(buttonGroup, /^### \[Input\]\(#input\)$/m);
    assert.match(buttonGroup, /^### \[Input Group\]\(#input-group\)$/m);
    assert.match(buttonGroup, /^### \[Dropdown Menu\]\(#dropdown-menu\)$/m);
    assert.match(buttonGroup, /^### \[Select\]\(#select\)$/m);
    assert.match(buttonGroup, /^### \[Popover\]\(#popover\)$/m);
    assert.match(buttonGroup, /^### \[Text and asChild\]\(#text-as-child\)$/m);
    assert.match(buttonGroup, /^### \[Link Buttons\]\(#link-buttons\)$/m);
    assert.match(buttonGroup, /^### \[RTL\]\(#rtl\)$/m);
    assert.match(buttonGroup, /^## \[Accessibility\]\(#accessibility\)$/m);
    assert.match(buttonGroup, /role="group"/);
    assert.match(buttonGroup, /role="separator"/);
    assert.match(buttonGroup, /resolveButtonGroupSeparatorOrientation/);
    assert.match(buttonGroup, /@ark-ui\/vue\/menu/);
    assert.match(buttonGroup, /@ark-ui\/vue\/select/);
    assert.match(buttonGroup, /@ark-ui\/vue\/popover/);
    assert.match(buttonGroup, /<input\b/);
    assert.doesNotMatch(buttonGroup, /@dicehub\/kappa\/components\/input|<Input\b/);
    assert.doesNotMatch(
      buttonGroup,
      /Planned documentation|Copy page|View Code|On this page|astro-code|--shiki-/,
    );
  });

  it("emits the real Number Input documentation", () => {
    const numberInputPath = join(distDir, "docs/components/number-input.md");

    assert.equal(existsSync(numberInputPath), true);

    const numberInput = readFileSync(numberInputPath, "utf8");

    assert.match(numberInput, /^# Number Input\b/);
    assert.match(numberInput, /@dicehub\/kappa\/components\/number-input/);
    assert.match(numberInput, /```vue\n<script setup>/);
    assert.match(numberInput, /```javascript\nimport \{/);
    assert.equal((numberInput.match(/```vue/g) ?? []).length, 15);
    assert.equal((numberInput.match(/<script setup lang="ts">/g) ?? []).length, 1);
    assert.equal((numberInput.match(/```css/g) ?? []).length, 0);
    assert.doesNotMatch(numberInput, /```typescript/);
    assert.match(numberInput, /^## \[Composition\]\(#composition\)$/m);
    assert.match(numberInput, /^## \[Examples\]\(#examples\)$/m);
    assert.match(numberInput, /^### \[Basic\]\(#basic\)$/m);
    assert.match(numberInput, /^### \[Scrubbable Input\]\(#scrubbable-input\)$/m);
    assert.match(numberInput, /^### \[Compact Use\]\(#compact-use\)$/m);
    assert.match(numberInput, /^### \[Separate Scrubber Handle\]\(#scrubbing\)$/m);
    assert.match(numberInput, /^### \[Controlled and Commit\]\(#controlled\)$/m);
    assert.match(numberInput, /^### \[Locale and Formatting\]\(#locale\)$/m);
    assert.match(numberInput, /^## \[Accessibility\]\(#accessibility\)$/m);
    assert.match(numberInput, /WAI-ARIA spinbutton pattern/);
    assert.match(numberInput, /^## \[API Reference\]\(#api-reference\)$/m);
    assert.match(numberInput, /NumberInputUnit/);
    assert.match(numberInput, /editAlignment/);
    assert.match(numberInput, /valueCommit/);
    assert.doesNotMatch(
      numberInput,
      /Planned documentation|Copy page|View Code|On this page|astro-code|--shiki-/,
    );
  });

  it("emits the real Popover documentation", () => {
    const popoverPath = join(distDir, "docs/components/popover.md");

    assert.equal(existsSync(popoverPath), true);

    const popover = readFileSync(popoverPath, "utf8");

    assert.match(popover, /^# Popover\b/);
    assert.match(popover, /@dicehub\/kappa\/components\/popover/);
    assert.match(popover, /```vue\n<script setup>/);
    assert.match(popover, /```javascript\nimport \{/);
    assert.equal((popover.match(/```vue/g) ?? []).length, 11);
    assert.doesNotMatch(popover, /lang="ts"|```typescript/);
    assert.match(popover, /^## \[Composition\]\(#composition\)$/m);
    assert.match(popover, /^### \[Interactive Form\]\(#form\)$/m);
    assert.match(popover, /^### \[Custom Anchor\]\(#custom-anchor\)$/m);
    assert.match(popover, /^### \[Open on Hover\]\(#open-on-hover\)$/m);
    assert.match(popover, /<Popover\.Root dir="rtl">/);
    assert.match(popover, /PopoverDirection/);
    assert.match(popover, /\| `Popover\.Title` \| `div` \|/);
    assert.match(popover, /\| `Popover\.Description` \| `div` \|/);
    assert.match(popover, /label="Apply filters"/);
    assert.match(popover, /label="Save changes"/);
    assert.match(popover, /Explicit accessible-label override/);
    assert.match(popover, /^## \[Accessibility\]\(#accessibility\)$/m);
    assert.match(popover, /Popover\.Close/);
    assert.match(popover, /https:\/\/ark-ui\.com\/docs\/components\/popover/);
    assert.doesNotMatch(
      popover,
      /Planned documentation|Copy page|View Code|On this page|astro-code|--shiki-/,
    );
  });
});
