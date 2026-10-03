# KAPPA-UI KNOWLEDGE BASE

## OVERVIEW

dicehub's Vue-first component library (`@dicehub/kappa`). pnpm monorepo: an
Ark UI-based component library and an Astro documentation, demo, and development
site (`@dicehub/kappa-docs-astro`). Kappa owns the visual language, UX, tokens,
components, and blocks used across dicehub projects.

## DESIGN AUTHORITY

Priority when requirements or patterns differ:

1. Ark UI defines primitive behavior, accessibility, state, events, and
   composition.
2. Kappa's registry, source, and documentation define its public API and
   repository conventions.
3. Kappa requirements define visual design, UX, tokens, components, and blocks.

External libraries may inform implementation but never impose branding or
visual treatments. Document intentional deviations from Ark UI behavior or APIs.

## DESIGN PRINCIPLES

- Design for technical dicehub applications: precise, information dense,
  legible. Hierarchy through typography, spacing, contrast, and surfaces — not
  decorative clutter or card-grids everywhere.
- Published Kappa UI uses a distinctive licensed typeface via semantic font
  tokens; no Inter, Roboto, Arial, or generic system defaults. The initial docs
  shell follows established dicehub documentation styling until its redesign.
  Use a coherent palette with purposeful accents; avoid timid contrast.
- Light and dark modes are equal design targets.
- Define complete states: default, hover, active, focus-visible, disabled,
  loading, invalid, empty, and selected where applicable.
- One or two meaningful motion patterns used consistently; always support
  reduced motion.
- Keep controls visually quiet for dense workflows; reserve stronger emphasis
  for layout, navigation, and key actions.
- New visual patterns introduce reusable tokens or documented conventions, not
  one-off values.

## WORKING RULES

- Always spell `dicehub` lowercase.
- Smallest coherent, reviewable change; one requested unit of work at a time.
- Discuss broad scaffolding, architecture, or cross-cutting patterns before
  implementation.
- Update documentation when public behavior, APIs, tokens, or usage changes.
- Check Git status and diffs; preserve unrelated work. Do not branch, commit, or
  push unless requested.
- Use Conventional Commits. No destructive Git operations without approval;
  use `trash`, never `rm`, for repository deletions.
- Keep files below roughly 500 lines; avoid broad rewrites and never edit
  generated outputs directly.

## LOCKED DECISIONS

Change only with explicit architectural approval:

- Package manager: `pnpm`; workspace layout: `packages/*`.
- Library package: `@dicehub/kappa`; private docs package:
  `@dicehub/kappa-docs-astro`.
- Runtime: Vue + TypeScript, ESM-only.
- Primitive and behavior layer: Ark UI Vue; no PrimeVue.
- Documentation stack: Astro + MDX + Vue; no Starlight. Docs host demos and the
  development playground; no separate playground package.
- Styling uses Kappa-owned semantic tokens and colocated component CSS.
- Blocks are published library exports.
- Reusable controls do not depend on an application store, router, or runtime;
  application integrations belong in blocks or adapters.
- Changesets manage published package versions and changelog entries.

## STRUCTURE

Layout:

```text
kappa-ui/
└── packages/
    ├── kappa/             # Component library, tokens, and styling
    └── kappa-docs-astro/  # Documentation, demos, and development playground
```

Keep this section synchronized with the actual repository structure.

## WHERE TO LOOK

Current repository locations:

| Task                 | Location                                                       | Notes                                                                            |
| -------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Component API        | `packages/kappa/src/registry/component-registry.json`          | AUTO-GENERATED public API index; query with `jq`; never edit directly            |
| Package exports      | `packages/kappa/package.json` + `packages/kappa/src/index.ts`  | Export map and root barrel; keep the public surface synchronized                 |
| Component source     | `packages/kappa/src/components/{name}/`                        | Standard folder: Vue, CSS, types, barrel, and colocated tests                    |
| Ark UI primitives    | `packages/kappa/src/primitives/`                               | Thin Vue re-export layer; Ark UI owns primitive behavior and accessibility       |
| Blocks (exported)    | `packages/kappa/src/blocks/{name}/`                            | Higher-level dicehub compositions exported by the library                        |
| Semantic tokens      | `packages/kappa/src/styles/theme-kappa.css`                    | AUTO-GENERATED with `tokens.json`; edit the `theme-generator` entry point and its token, pair, and deprecation modules |
| Registry generator   | `packages/kappa/scripts/component-registry/`                   | Discovers component and block barrels; regenerates the JSON and TypeScript index |
| License notices      | `packages/kappa/licenses/` + `packages/kappa/scripts/third-party-sources.mjs` | Preserved adapted-source licenses; generated package notices and `/licenses.txt` docs output |
| Demo examples        | `packages/kappa-docs-astro/src/components/*DocsDemo.vue`       | Rendered by docs pages and exercised by end-to-end tests                         |
| Documentation pages  | `packages/kappa-docs-astro/src/pages/docs/`                    | Guides, component pages, block pages, and routes                                 |
| Documentation data   | `packages/kappa-docs-astro/src/data/`                          | API and navigation metadata; keep synchronized with components                   |
| Standalone examples | `packages/kappa-docs-astro/src/pages/examples/`             | Full-screen block previews and isolated component viewports.                  |
| End-to-end tests     | `packages/kappa-docs-astro/e2e/`                               | Playwright specs for documentation and public component behavior                 |
| CI pipeline          | `.gitlab-ci.yml`                                                | Verification, `dev` docs deployment, and protected-tag package publishing        |
| Deployment helpers   | `scripts/cloudflare-{pages,access}.mjs`                         | Idempotent Cloudflare Pages, DNS, TLS, and Access setup                           |

Update this table whenever the repository structure changes.

## CONVENTIONS

### Styling (CRITICAL)

- Namespace public CSS with `kappa`: `.kappa-*`, `--kappa-*`, and
  `data-kappa-theme`.
- Use semantic tokens for colors, surfaces, status, focus, and shadows. Literal
  color fallbacks only inside `var(--kappa-token, fallback)`, matching the
  generated theme.
- Define light and dark values in the theme generator; component CSS consumes
  the same semantic tokens in both modes.
- The published theme in `packages/kappa/src/styles/theme-kappa.css` is imported
  explicitly by consumers; component imports never inject a global theme or
  reset. Documentation aliases (`--docs-*`) read Kappa tokens, while
  documentation-only values such as fonts, the header overlay, and alpha
  hairlines stay in `packages/kappa-docs-astro/src/styles/docs.css`.
- Theme modes use `data-kappa-theme="light|dark"` (default light) with the legacy
  `data-mode` attribute kept as compatibility; the canonical attribute wins on
  the same element and explicit scopes nest. Documented on `/docs/colors`.
- Keep component CSS beside its Vue component and load it with `<style src>`.
- Use `.kappa-component`, `.kappa-component__part`, and
  `.kappa-component--variant` naming.
- Prefer Ark UI state and part attributes for styling interactive states; do
  not duplicate primitive state in CSS classes or Vue state.
- Preserve visible keyboard focus. Respect `prefers-reduced-motion`.
- Use Vue class arrays and objects by default; `cn()` only when deterministic
  class conflict resolution is required.

### Components

- Check the current Ark UI Vue API, the component registry, and the nearest
  existing Kappa component before creating or changing an interactive
  component. Use an Ark UI primitive whenever one exists.
- Kebab-case component folders with this standard shape where applicable:
  `ComponentName.vue`, `{name}.css`, `{name}.ts`, `{name}.test.mjs`, `index.ts`.
- Prefer `<script setup lang="ts">`; render functions only when VNode or
  advanced slot behavior requires them.
- Public component names are generic and PascalCase: `Button`, `Dialog`,
  `Select`.
- Keep variants, defaults, and public types in `{name}.ts`; export them through
  the component barrel.
- Preserve Ark UI prop, event, and controlled/uncontrolled semantics unless a
  deliberate Kappa API improves them; document deviations.
- Forward attributes, ARIA properties, data attributes, and event listeners to
  the correct semantic element or Ark UI part.
- Compound components expose a root API plus named parts (`Select.Root`,
  `Select.Option`) while retaining named exports.
- Reusable controls in `components/`; opinionated workflows and compositions in
  `blocks/`.
- Split into parts or composables before approaching 500 lines.
- Public API changes require synchronized exports, registry generation,
  documentation, demos, and appropriate tests.

### Imports

- ESM-only throughout; no CommonJS or dual-package output.
- Across workspace packages, use declared package exports (`@dicehub/kappa`);
  within a package, use relative imports. No self-imports via the package name.
- Import Ark UI through public `@ark-ui/vue/<primitive>` entrypoints; prefer
  Ark UI exports over direct `@zag-js/*` imports (declare Zag directly when
  unavoidable).
- Use `import type` / `export type` for type-only symbols.
- Every supported public subpath belongs in the package `exports` map; keep
  component barrels, the root barrel, and `package.json` exports synchronized.

### Changesets

- Add a changeset for every user-visible change to the published
  `@dicehub/kappa` package; not required for docs-only changes, tests, CI, or
  internal refactors. The private docs package never needs one.
- `patch` for compatible fixes, `minor` for compatible features, `major` for
  breaking changes. One changeset may cover multiple commits of one coherent
  change.
- Never run versioning, tagging, publishing, or release commands unless
  explicitly assigned a release task.

### Merge Requests

- Use `glab`; open an MR only when requested and as a draft by default.
- GitLab is authoritative; follow the repository merge-request template when
  one exists.
- One coherent change per MR. Describe motivation, implementation,
  verification, and changeset status.
- Include before/after screenshots or recordings for visible UI changes; call
  out accessibility, API, migration, and compatibility effects.
- Do not mark an MR ready until the full available gate passes.

## ANTI-PATTERNS

| Pattern                                       | Why                                                | Instead                                             |
| --------------------------------------------- | -------------------------------------------------- | --------------------------------------------------- |
| Reimplementing Ark UI behavior                | Risks accessibility and interaction regressions    | Compose the current Ark UI Vue primitive            |
| Raw palette values in component CSS           | Breaks themes and visual consistency               | Use semantic `--kappa-*` tokens                     |
| Component-level dark-mode selectors           | Duplicates and fragments theme logic               | Define both modes in the theme generator            |
| Editing generated theme or registry files     | Changes are overwritten by code generation         | Edit source config or barrels, then run codegen     |
| Copying reference-library visual treatments   | Undermines Kappa's distinct design language        | Design intentionally from Kappa requirements        |
| Cross-package relative source imports         | Bypasses package boundaries and published exports  | Import through `@dicehub/kappa` exports             |
| Application runtime dependencies in controls  | Couples reusable components to one application     | Move the integration into a block or adapter        |
| Swallowing attributes, ARIA, or events        | Breaks accessibility and consumer integrations     | Forward them to the correct semantic or Ark UI part |
| Undeclared deep imports                       | Creates fragile, unsupported consumer APIs         | Add an intentional package export                   |
| Public changes without synchronized artifacts | Causes code, registry, docs and releases to drift  | Update exports, registry, docs, tests, changeset    |
| Monolithic components near 500 lines          | Makes behavior and review difficult                | Split into parts, composables, focused utilities    |

## VERIFICATION

| Layer              | Location                                  | Purpose                                       |
| ------------------ | ----------------------------------------- | --------------------------------------------- |
| Unit tests         | `packages/kappa/src/**/*.test.mjs`        | Logic, variants, state, and component APIs    |
| End-to-end tests   | `packages/kappa-docs-astro/e2e/*.spec.ts` | Real browser interaction and documentation    |
| Package validation | `packages/kappa/scripts/`                 | Exports, packed artifacts, and consumer usage |

- Use the smallest relevant test layer; no blanket coverage targets. Add or
  update tests when public behavior or contracts materially change.
- End-to-end tests cover keyboard, focus, portals, responsive behavior, and
  anything needing a real browser. Keep tests deterministic; no arbitrary
  sleeps or live-service dependencies.
- Run affected tests during development and the full available gate before
  handoff. Run `validate:package` when exports or package output change.

## DOCUMENTATION

- Documentation is part of the public feature: new components, blocks, and
  public APIs require documentation and a working demo.
- Component pages: `packages/kappa-docs-astro/src/pages/docs/components/`;
  block pages: `.../docs/blocks/`. Vue demos named `{Component}DocsDemo.vue`.
- Demos import supported `@dicehub/kappa` exports, never library source, and
  show realistic public usage with synthetic data.
- Document purpose, installation, API, variants, states, accessibility, and
  composition constraints; link relevant Ark UI documentation.
- Do not manually maintain generated API tables, registries, or changelogs.
- Interactive documentation changes update the relevant end-to-end test.
- Markdown export drops `astro-island` content. An island that must appear in
  Markdown opts in with a `data-markdown-keep` marker inside its server-rendered
  content; the Colors token reference is the only current opt-in. Use
  `data-copy-ignore` for controls and shell states that should never reach a
  copied page.

## DEPENDENCIES

- Prefer platform APIs, Vue, Ark UI, and existing utilities before adding a
  package; no dependencies for trivial helpers.
- Check maintenance, adoption, security, license, ESM/TypeScript support, and
  bundle impact before adding one.
- Add dependencies to the package that uses them; root only for root-level
  tooling. Declare every directly imported package.
- Consumer-provided runtimes such as Vue are peer dependencies; heavy optional
  integrations become optional peers with isolated entrypoints.
- Avoid duplicate versions across workspace packages; update `pnpm-lock.yaml`
  only through pnpm.
- After dependency changes: rebuild, validate the packed package, and
  regenerate third-party notices.

## CI AND RELEASES

- GitLab CI is authoritative for verification, documentation deployment, and
  package publishing; inspect pipelines with `glab`.
- On failure, inspect exact logs, reproduce and fix the cause, then rerun until
  green.
- Do not weaken checks, hide failures, or add skip labels to make a pipeline
  pass.
- Publish only from protected tag-based CI; release work requires an explicit
  request.
- Follow `docs/RELEASING.md`; if absent, establish and review the process before
  publishing.

## COMMANDS

Keep this synchronized with `package.json` scripts.

```bash
# Cross-cutting
pnpm dev                                           # Documentation dev server
pnpm build                                         # Build all packages
pnpm typecheck                                     # Type-check all packages
pnpm test                                          # Run the full test suite
pnpm test:deployment                               # Test Cloudflare deployment helpers
pnpm changeset                                     # Create a changeset
pnpm changeset:status                              # Validate changeset state

# Component library
pnpm --filter @dicehub/kappa build                 # Generate and build package
pnpm --filter @dicehub/kappa typecheck             # Generated-file checks + Vue types
pnpm --filter @dicehub/kappa test                  # Colocated unit tests
pnpm --filter @dicehub/kappa codegen:registry      # Regenerate component registry
pnpm --filter @dicehub/kappa codegen:themes        # Regenerate semantic themes and token metadata
pnpm --filter @dicehub/kappa check:themes          # Detect generated theme drift (read-only)
pnpm --filter @dicehub/kappa check:theme-build     # Verify packed theme assets after the build
pnpm --filter @dicehub/kappa validate:package      # Validate packed consumer surface
pnpm --filter @dicehub/kappa codegen:licenses      # Regenerate third-party notices

# Documentation
pnpm --filter @dicehub/kappa-docs-astro dev        # Astro development server
pnpm --filter @dicehub/kappa-docs-astro build      # Production documentation build
pnpm --filter @dicehub/kappa-docs-astro typecheck  # Astro type-check
pnpm --filter @dicehub/kappa-docs-astro test:markdown
pnpm --filter @dicehub/kappa-docs-astro test:e2e
```

## BUILD PIPELINE

```text
theme-generator/config.ts
        │
        └── codegen:themes ──────> src/styles/theme-kappa.css
                                   src/styles/tokens.json

components/*/index.ts + blocks/*/index.ts
        │
        └── codegen:registry ────> src/registry/generated.ts
                                   src/registry/component-registry.json

generated assets + Vue/TypeScript/CSS source
        │
        └── Vite library build ──> packages/kappa/dist/
                                           │
                                           ├── check:theme-build (packed theme assets)
                                           │
                                           ├── codegen:licenses
                                           ├── package validation
                                           └── docs workspace dependency
                                                        │
                                                        └── Astro build
```

- Generated themes and registry files must be current before the library build.
- Registry codegen discovers component and block barrels; docs demos do not
  feed registry generation.
- License generation runs after the build because it inspects bundled source
  maps.
- `check:theme-build` runs after Vite and fails when the packed theme assets
  differ from the generated sources, so unit tests stay independent of `dist/`.
- Package validation dry-packs the library, validates every declared export,
  and builds a consumer fixture against the packed artifact.
- The docs package consumes `@dicehub/kappa` through the workspace dependency,
  never through source aliases. Never edit `dist/` or generated outputs.

## TOOLCHAIN

Package manifests, the lockfile, and runtime version files are authoritative.
Keep this table synchronized after dependency changes.

| Tool              | Version source                      | Notes                                      |
| ----------------- | ----------------------------------- | ------------------------------------------ |
| Node              | `.node-version` and `engines.node`  | Keep local development and CI aligned      |
| pnpm              | Root `packageManager` field         | Only supported workspace package manager   |
| Vue               | Package manifests and lockfile      | Component runtime and peer dependency      |
| Ark UI Vue        | `packages/kappa/package.json`       | Accessible primitive and behavior layer    |
| TypeScript        | Root/package manifests and lockfile | Strict library and declaration checking    |
| Vite              | `packages/kappa/package.json`       | ESM library build and declaration pipeline |
| Astro + MDX + Vue | Documentation package manifest      | Documentation, demos, and playground       |
| Playwright        | Documentation package manifest      | Browser and accessibility flows            |
| Node test runner  | Pinned Node runtime                 | Colocated library unit tests               |
| Changesets        | Root `package.json`                 | Package versioning and changelog workflow  |

Pin toolchain versions and use deliberate compatibility ranges for public peers.

## SECURITY

- Never commit API keys, tokens, credentials, or other secrets. Keep `.env`
  ignored; commit only sanitized `.env.example` files.
- Store deployment and publishing credentials in masked, protected GitLab CI
  variables.
- Kappa code and documentation text use MIT. Preserve upstream notices for adapted
  source; see `docs/THIRD_PARTY_SOURCES.md`. Fonts keep their own licenses, and
  documentation artwork and brand assets follow the license scope in
  `docs/THIRD_PARTY_SOURCES.md`; new assets require a source and rights record.
- Never print secrets in logs, tests, screenshots, issues, MRs, or docs; use
  synthetic data everywhere public.
- Treat `v-html` as a security boundary: trusted generated content or
  explicitly sanitized input only.
- No dynamic remote scripts, `eval`, or `new Function` without explicit
  security review.
- If secret exposure is suspected, stop and report immediately; rotate or
  revoke before repository cleanup.
