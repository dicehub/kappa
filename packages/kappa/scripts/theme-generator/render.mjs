/**
 * Deterministic, dependency-free rendering for the Kappa color theme.
 *
 * `createThemeArtifacts` validates the configuration, resolves token
 * references, and returns the exact file contents written by
 * `scripts/theme-generator/index.mjs`.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { themeConfig } from "./config.ts";

export const THEME_SCHEMA_VERSION = 1;

/** Repository-relative outputs owned by this generator. */
export const themeOutputFiles = {
  css: "src/styles/theme-kappa.css",
  json: "src/styles/tokens.json",
};

const PREVIEW_VALUES = new Set(["background", "shadow", "text"]);
const TOKEN_NAME_PATTERN = /^--kappa-[a-z0-9]+(?:-[a-z0-9]+)*$/;
const HEX_PATTERN = /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const RGB_PATTERN = /^rgba?\([0-9.,%\s/]+\)$/i;
const REFERENCE_PATTERN = /^var\(\s*(--kappa-[a-z0-9-]+)\s*\)$/;

const packageRoot = resolve(fileURLToPath(new URL("../..", import.meta.url)));

const readPackageName = () => {
  const manifest = JSON.parse(readFileSync(resolve(packageRoot, "package.json"), "utf8"));
  return manifest.name;
};

/**
 * Classify a configured value so validation can reject broken entries without
 * duplicating the CSS value grammar.
 */
export function classifyThemeValue(value) {
  const trimmed = String(value).trim();
  const reference = REFERENCE_PATTERN.exec(trimmed);
  if (reference) return { kind: "reference", reference: reference[1] };
  if (HEX_PATTERN.test(trimmed)) return { kind: "color" };
  if (RGB_PATTERN.test(trimmed)) return { kind: "color" };
  if (trimmed === "none") return { kind: "keyword" };
  return { kind: "literal" };
}

/**
 * Resolve a token in one mode, following `var(--kappa-...)` references.
 * Throws on unknown names and on reference cycles.
 */
export function resolveTokenValue(config, name, mode, stack = []) {
  if (stack.includes(name)) {
    throw new Error(`Reference cycle: ${[...stack, name].join(" -> ")}`);
  }

  const token = config.tokens.find((entry) => entry.name === name);
  if (!token) throw new Error(`Unknown token reference: ${name}`);

  const value = token[mode];
  const classified = classifyThemeValue(value);
  if (classified.kind !== "reference") return value;

  return resolveTokenValue(config, classified.reference, mode, [...stack, name]);
}

const collectValueIssues = (token, mode, value) => {
  const issues = [];
  const classified = classifyThemeValue(value);
  const where = `${token.name} (${mode})`;

  if (!String(value).trim()) {
    issues.push(`Missing ${mode} value for ${token.name}.`);
    return issues;
  }

  if (/^#/.test(String(value).trim()) && classified.kind !== "color") {
    issues.push(`Malformed hex value for ${where}: ${value}`);
  }

  if (/^rgb/i.test(String(value).trim()) && classified.kind !== "color") {
    issues.push(`Malformed rgb value for ${where}: ${value}`);
  }

  if (classified.kind === "literal" && token.preview !== "shadow") {
    issues.push(
      `Unsupported value for ${where}: ${value}. Use a hex color, rgb()/rgba(), var(--kappa-...) reference, "none", or declare preview: "shadow".`,
    );
  }

  return issues;
};

const collectReferenceIssues = (config, token, mode) => {
  try {
    resolveTokenValue(config, token.name, mode);
    return [];
  } catch (error) {
    return [`${token.name} (${mode}) is unresolved: ${error.message}`];
  }
};

/** Validate a theme configuration and return every issue found. */
export function findThemeIssues(config = themeConfig) {
  const issues = [];

  const modes = Array.isArray(config.modes) ? config.modes : [];
  if (modes.length === 0) issues.push("The theme must declare at least one mode.");
  if (new Set(modes).size !== modes.length) issues.push("Theme modes must be unique.");
  for (const required of ["light", "dark"]) {
    if (!modes.includes(required)) issues.push(`Missing ${required} mode.`);
  }
  if (!modes.includes(config.defaultMode)) {
    issues.push(`Default mode "${config.defaultMode}" is not declared in modes.`);
  }

  const groupIds = new Set();
  for (const group of config.groups) {
    if (!group.id) issues.push("Every group needs an id.");
    if (groupIds.has(group.id)) issues.push(`Duplicate group id: ${group.id}`);
    groupIds.add(group.id);
    if (!group.label?.trim()) issues.push(`Group ${group.id} needs a label.`);
    if (!group.description?.trim()) issues.push(`Group ${group.id} needs a description.`);
  }

  const tokenNames = new Set();
  for (const token of config.tokens) {
    if (!TOKEN_NAME_PATTERN.test(token.name ?? "")) {
      issues.push(`Invalid token name: ${String(token.name)}`);
    }
    if (tokenNames.has(token.name)) issues.push(`Duplicate token: ${token.name}`);
    tokenNames.add(token.name);
    if (!groupIds.has(token.group)) {
      issues.push(`Unknown group "${token.group}" for token ${token.name}.`);
    }
    if (!token.description?.trim()) issues.push(`Token ${token.name} needs a description.`);
    if (!PREVIEW_VALUES.has(token.preview)) {
      issues.push(`Token ${token.name} has an unsupported preview: ${String(token.preview)}`);
    }
    for (const mode of modes) {
      issues.push(...collectValueIssues(token, mode, token[mode] ?? ""));
    }
  }

  for (const groupId of groupIds) {
    if (!config.tokens.some((token) => token.group === groupId)) {
      issues.push(`Group ${groupId} has no tokens.`);
    }
  }

  for (const token of config.tokens) {
    for (const mode of modes) {
      issues.push(...collectReferenceIssues(config, token, mode));
    }
  }

  const pairIds = new Set();
  for (const pair of config.contrastPairs) {
    if (!pair.id) issues.push("Every contrast pair needs an id.");
    if (pairIds.has(pair.id)) issues.push(`Duplicate contrast pair: ${pair.id}`);
    pairIds.add(pair.id);
    if (!pair.label?.trim()) issues.push(`Contrast pair ${pair.id} needs a label.`);
    if (!pair.note?.trim()) issues.push(`Contrast pair ${pair.id} needs a note.`);
    if (pair.kind !== "text" && pair.kind !== "nontext") {
      issues.push(`Contrast pair ${pair.id} has an unsupported kind: ${String(pair.kind)}`);
    }
    if (!Number.isFinite(pair.minimum) || pair.minimum <= 0) {
      issues.push(`Contrast pair ${pair.id} needs a positive minimum.`);
    } else if (pair.kind === "text" && pair.minimum < 4.5) {
      issues.push(`Contrast pair ${pair.id} must require at least 4.5:1 for text.`);
    } else if (pair.kind === "nontext" && pair.minimum < 3) {
      issues.push(`Contrast pair ${pair.id} must require at least 3:1 for non-text indicators.`);
    }
    for (const role of ["foreground", "background"]) {
      const name = pair[role];
      if (!tokenNames.has(name)) {
        issues.push(`Contrast pair ${pair.id} references unknown ${role}: ${name}`);
        continue;
      }
      for (const mode of modes) {
        let resolved;
        try {
          resolved = resolveTokenValue(config, name, mode);
        } catch (error) {
          issues.push(
            `Contrast pair ${pair.id} cannot resolve ${role} ${name} in ${mode} mode: ${error.message}`,
          );
          continue;
        }
        if (classifyThemeValue(resolved).kind !== "color") {
          issues.push(
            `Contrast pair ${pair.id} cannot measure ${name} in ${mode} mode: ${resolved}`,
          );
        }
      }
    }
  }

  for (const deprecation of config.deprecations) {
    if (!/^--kappa-/.test(deprecation.name ?? "")) {
      issues.push(`Deprecation needs a Kappa token name: ${String(deprecation.name)}`);
    }
    if (tokenNames.has(deprecation.name)) {
      issues.push(`Deprecated token ${deprecation.name} must not be emitted by the theme.`);
    }
    if (!deprecation.note?.trim()) issues.push(`Deprecation ${deprecation.name} needs a note.`);
    if (!deprecation.replacements?.length) {
      issues.push(`Deprecation ${deprecation.name} needs at least one replacement.`);
      continue;
    }
    for (const replacement of deprecation.replacements) {
      if (!tokenNames.has(replacement)) {
        issues.push(`Deprecation ${deprecation.name} references unknown replacement: ${replacement}`);
      }
    }
  }

  return issues;
}

/** Throw with every configuration issue listed, so codegen fails loudly. */
export function assertValidTheme(config = themeConfig) {
  const issues = findThemeIssues(config);
  if (issues.length) {
    throw new Error(`Invalid Kappa theme configuration:\n- ${issues.join("\n- ")}`);
  }
}

const renderModeBlock = (selector, mode, tokens) =>
  [
    `${selector} {`,
    `  color-scheme: ${mode};`,
    ...tokens.map((token) => `  ${token.name}: ${token[mode]};`),
    "}",
  ].join("\n");

const renderThemeCss = (config) => {
  const { tokens } = config;
  const header = [
    "/* Generated by scripts/theme-generator/index.mjs from scripts/theme-generator/config.ts. Do not edit. */",
    `/* Kappa color theme: ${tokens.length} semantic tokens in light and dark modes. The default is ${config.defaultMode}. */`,
    "/* Selectors stay at attribute specificity so application CSS loaded afterwards can override any token. */",
  ].join("\n");

  const sections = [
    header,
    ["/* Default light theme for the document root. */", renderModeBlock(":root", "light", tokens)].join(
      "\n",
    ),
    [
      "/*",
      " * Compatibility: the legacy data-mode attribute.",
      " * Declared before data-kappa-theme so the canonical attribute wins on the same element.",
      " */",
      renderModeBlock('[data-mode="light"]', "light", tokens),
      renderModeBlock('[data-mode="dark"]', "dark", tokens),
    ].join("\n"),
    [
      "/*",
      " * Canonical mode attribute.",
      " * Explicit scopes override inherited modes, so nested sections can flip light or dark on their own.",
      " */",
      renderModeBlock('[data-kappa-theme="light"]', "light", tokens),
      renderModeBlock('[data-kappa-theme="dark"]', "dark", tokens),
    ].join("\n"),
  ];

  return `${sections.join("\n\n")}\n`;
};

const renderTokensJson = (config) => {
  const payload = {
    schemaVersion: THEME_SCHEMA_VERSION,
    package: readPackageName(),
    defaultMode: config.defaultMode,
    modes: [...config.modes],
    attributes: {
      canonical: "data-kappa-theme",
      compatibility: ["data-mode"],
      precedence:
        "data-kappa-theme takes precedence over data-mode on the same element, and nested scopes override their ancestors.",
      values: [...config.modes],
    },
    groups: config.groups.map((group) => ({ ...group })),
    tokens: config.tokens.map((token) => ({
      name: token.name,
      group: token.group,
      description: token.description,
      preview: token.preview,
      light: token.light,
      dark: token.dark,
      resolved: {
        light: resolveTokenValue(config, token.name, "light"),
        dark: resolveTokenValue(config, token.name, "dark"),
      },
      compatibility: token.compatibility ?? null,
    })),
    contrastPairs: config.contrastPairs.map((pair) => ({
      id: pair.id,
      label: pair.label,
      foreground: pair.foreground,
      background: pair.background,
      kind: pair.kind,
      minimum: pair.minimum,
      note: pair.note,
    })),
    deprecations: config.deprecations.map((deprecation) => ({
      name: deprecation.name,
      replacements: [...deprecation.replacements],
      note: deprecation.note,
    })),
  };

  return `${JSON.stringify(payload, null, 2)}\n`;
};

/** Render both theme artifacts after validating the configuration. */
export function createThemeArtifacts(config = themeConfig) {
  assertValidTheme(config);

  return {
    css: renderThemeCss(config),
    json: renderTokensJson(config),
  };
}

/** Render the exact files this generator owns, in write order. */
export function collectThemeOutputs(config = themeConfig) {
  const artifacts = createThemeArtifacts(config);

  return [
    { file: themeOutputFiles.css, contents: artifacts.css },
    { file: themeOutputFiles.json, contents: artifacts.json },
  ];
}

/**
 * Compare rendered outputs with the checked-in files. `readText` returns the
 * current contents and `null` when the file does not exist yet.
 */
export function findStaleThemeOutputs(outputs, readText) {
  const stale = [];

  for (const output of outputs) {
    const current = readText(output.file);
    if (current === null) stale.push(`${output.file} is missing`);
    else if (current !== output.contents) stale.push(`${output.file} is stale`);
  }

  return stale;
}
