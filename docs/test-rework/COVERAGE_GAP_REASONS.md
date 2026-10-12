# Coverage gap decisions

Read when deciding whether an old-only hit needs another public test.

These are supported-path decisions, not deletion approval. Source remains
unchanged unless a separate production fix has approval. Astra checked the
caller and export paths below. Keep ambiguous source-map records separate from
confirmed missing behavior; see [the coverage audit](COVERAGE_AUDIT.md).

| Source or scenario | Decision and evidence |
| --- | --- |
| `markdown-route-paths.ts`: `htmlPathToMarkdownPath` | Unused by supported production interfaces. Only retained tests call it. The live integration imports the forward mapper; its build hook computes output paths directly. The private docs package has no exports, Astro discovers pages, and the only source globs target sidebar snippets. Flag this helper as dead under the current supported surface; do not delete production code here. |
| `markdownPathToHtmlPath` | Live development HTTP behavior. Production sidecars alone do not replace it. The actual dev-server check passes for docs root, component and changelog Markdown responses, a missing docs page, and an unrelated path. Astra confirmed the executed file and all five assertions. |
| `docs-page-navigation.ts`: query/hash, unknown path, nullish split fallback | The sole caller is `DocsPageNavigation.astro`; inputs are fixed docs paths or static placeholder navigation data. No current caller supplies raw query/fragment data or unknown pages. The fallback after splitting a string with limit 1 is unreachable. Do not manufacture callers for these private input branches. Preserve real adjacent-page links, section boundaries, compact/footer layout, and soft navigation through the existing public pager checks. |
| `changelog.js`: `getChangelogPageHref` | Unused by supported production interfaces. Only retained tests call it. The published page's Vue pagination uses its own URL function. Flag the helper as dead under the current supported surface; retain source here and verify real page links. |
| `getChangelogStaticPaths`: non-default or invalid `perPage` | The production page calls this private helper with default options only. Preserve actual pagination through a real build with 13 releases and HTTP requests for page 1, page 2, all releases, the Markdown sidecar, and an absent page. The focused public check passed. Do not add a public API for private arguments. |
| CLI entrypoint guards: import-only false branches | Documented and CI usage executes the release-state, Cloudflare Access/Pages, and npm publisher scripts as CLI processes. Old private imports cover their false entrypoint branches. These hits are not missing CLI error behavior. Keep entrypoint guards; do not invent imports to increase coverage. |
| Pages subdomain and alias logging | Existing quiet-logger tests reach output lines without asserting the text. These incidental hits are not a new behavior obligation. Preserve real project creation, deployment verification, DNS routing, and failure diagnostics through CLI tests. |
| `check-consumer-declarations.mjs` | Compiler refusal is a real public validation requirement. The new packed-declaration fault check invokes the actual package-validation CLI and requires the unresolved-type diagnostic and a nonzero exit. It passed; source-only private configuration variations are not the same public requirement. |
| Registry discovery and search | Names alone were insufficient. Frozen released metadata and actual installed compound parts protect both registry exports' type/group/import-path/part contracts; their indexes require unique names and exact membership. Both installation profiles pass. A source-only generator fault leaves JSON correct but removes a JS index entry: selected retained discovery cases survive, the public check fails. See `mutation-registry-index.json`. Exact private source paths, generated prose and array ordering need no fixed-output obligation. |

Remaining gaps include mapped representation differences, lifecycle obligations,
and modules not yet covered by the paired mutation comparison. A zero hit is not
proof of dead code. The two helpers above have an explicit supported-path audit;
no other source is declared dead from coverage alone.
