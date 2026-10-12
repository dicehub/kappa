# Test rework plan

Status: Phase 2 approved by Ros. Build the public-interface suite while retaining every existing test. Coverage and mutation proof come before deletion.

Astra Max reviewed the inventory and plan. Its corrections to browser conversion targets, independent API checks, lifecycle proof, mutation comparison, and helper evidence are applied. Final review: approved; no remaining review blockers. Ros then approved Phase 2 with “Go on”.

Branch: `8-issue-improve-test-coverage-and-reliability`. Baseline: `78a62955b04fbec367f254ece10d1a88df2740ca` (`@dicehub/kappa` 0.6.0). Issue #8; draft MR !9 targets `dev`.

## Current system and public interfaces

The repository is a TypeScript/JavaScript ESM monorepo. It contains Vue single-file components, CSS, Astro pages, and Markdown/MDX. Node 24.19.0 and pnpm 10.26.0 are pinned. Node's built-in test runner runs `.test.mjs` files; Playwright 1.60.0 runs Chromium UI tests. There is no Jest or Vitest setup.

| Surface | Current interface | Test entry point |
| --- | --- | --- |
| Published Vue library | Root export; 102 component groups; nine blocks; props, slots, public events, exposed APIs, providers, and composables | Installed `@dicehub/kappa` in a real Vue consumer; browser input and DOM results |
| Public functions | Exported helpers, including `parseUnifiedDiff`, Flow path helpers, `appendXYPlotData`, and `createToaster`; toast store subpath | Import declared package exports and call them with real dependencies |
| Public registry | `@dicehub/kappa/registry`, its lookup function, and JSON metadata with 823 entries | Import the installed registry; resolve its advertised imports against actual exports |
| Public styles | `styles/kappa.css`, `styles/theme-kappa.css`, `styles/tokens.json`; theme attributes and overrides | Consumer stylesheet imports; rendered geometry, state, contrast, and theme results |
| Documentation HTTP and UI | Production Astro output: 177 HTML pages and 119 Markdown pages; component demos, blocks, snippets, navigation, search, copy/download controls, `/licenses.txt` | Real built site over HTTP, real browser, and copied snippet consumer |
| Contributor CLI | `pnpm` build/codegen/check commands; package validation; release-state and release-notes scripts; publishing and Cloudflare helper commands | Actual subprocesses, temporary Git projects, real filesystem, and controlled HTTP services |
| CI operations | GitLab verification, docs deployment, protected-tag publishing, GitLab release creation | CLI contracts and network-boundary provider responses; existing CI remains authoritative |

The npm package has no installed CLI binary. There is no application HTTP/gRPC backend, database, message-bus consumer, or application scheduler. Login, signup, settings, and message-composer demos are UI compositions, not authentication or message-delivery services. Their consumer callbacks and disabled/pending states are still public behavior.

## Measured baseline

All execution took place on **dh-pc** in an isolated source snapshot. The user-owned local development server was not changed.

Preparation used frozen dependencies and `pnpm build`. A second docs build enabled source maps through an external configuration file. The unchanged suite ran with `CI=1 KAPPA_E2E_SKIP_BUILD=1 pnpm test`, one Chromium worker, and the existing two-retry policy. Node V8 and Playwright coverage collection used external audit scripts. Repository scripts and tests were not edited.

| Layer | Files | Tests | Result | Runtime |
| --- | ---: | ---: | --- | --- |
| Library and package-script Node tests | 112 | 680 | All passed | 6.884 s |
| Documentation Node tests | 21 | 65 | All passed | 5.216 s |
| Chromium | 157 | 919 | All passed; zero retries | 14.4 min |
| Deployment/release Node tests | 5 | 33 | All passed | 0.378 s |
| Total | 295 | 1,697 | Zero failures, skips, or observed flaky results | 885 s (14 min 45 s) |

There are 43,947 lines in these test files, excluding shared helpers and fixtures. A single successful run does not prove that tests are never flaky. Earlier release MR CI had a Select alignment retry while its opening animation was active; the stable tag CI and this run passed that case on the first attempt.

| Coverage | Covered / total | Baseline |
| --- | ---: | ---: |
| Executable lines | 4,996 / 7,023 | 71.14% |
| Branches | 8,079 / 11,967 | 67.51% |

These are Istanbul LCOV metrics merged by original source path across Node and Chromium, with 1,253 unique source files. Scope: Kappa runtime Vue/TS/JS, package/root tooling, and interactive docs components/snippets/utilities. Docs and library source maps are chained. Unexecuted compiled modules and owned TS/JS files receive zero coverage. TypeScript stripping preserves offsets. Generated registry metadata, declaration files, thin primitive re-exports, dependencies, CSS, static docs data/content, and build-only Astro templates/configuration are excluded. Their public artifact, compiler, and HTTP requirements remain in the behavior inventory. Coverage collection was unavailable in two intentional JavaScript-disabled browser contexts; no JavaScript could execute there.

There were no unresolved source-parser warnings. Native V8 reports contained duplicate source representations for stripped and mapped TypeScript; their aggregate percentages are not used. LCOV merges those representations into unique source files. Keep this scope and mapping method fixed for the old/new comparison. [Baseline facts](docs/test-rework/baseline.json) record the measured values. There was no existing coverage command or configured threshold. Mutation score is **not measured yet**: running mutations belongs to Phase 3, after approval.

Raw evidence remains on dh-pc under `/home/dh/.cache/kappa-test-rework-JzKrbp`: `suite.log`, `suite-result.json`, JUnit, Node/browser coverage, source maps, and the external reporting tools. Coverage overhead is included in the recorded suite runtime; setup/build time is excluded.

The later [coverage audit](docs/test-rework/COVERAGE_AUDIT.md) found 14 excluded
entries in this original report. The frozen baseline and raw records remain
unchanged; the audit records corrected historical values and paired per-source
denominators. Use the corrected scope for the final comparison.

## Classification

Each of the 1,539 declared groups has one category. Parameter expansion produces 1,697 executed cases. `REGRESSION` is a primary category with a separate keep/conversion target; it is not counted twice.

| Category | Groups | Expanded cases | Planned treatment |
| --- | ---: | ---: | --- |
| KEEP-BB | 789 | 881 | Preserve browser and real generated-output requirements. Improve brittle selectors or duplicated smoke checks without losing behavior. |
| DELETE-TYPES | 94 | 94 | Remove repeated constants, export/type metadata, private identity, and wiring checks after real consumer/artifact checks protect the public contract. |
| DELETE-MOCKS | 19 | 19 | Replace fake highlighters/images and injected process/fetch interaction tests before deletion. |
| CONVERT | 576 | 602 | Preserve worthwhile state, error, accessibility, style, parser, CLI, and packaging behavior through public interfaces. |
| KEEP-LOGIC | 26 | 26 | Retain a small minority of private calculations/parsers; add generated-input invariants where useful. |
| REGRESSION | 35 | 75 | Preserve known bug obligations; convert eight private groups plus one queued-frame browser group, and retain 26 browser groups. |

The original 26 KEEP-LOGIC groups are 1.7% of all groups. They cover crop geometry, exact decimal stepping, private Flow layout calculations, deep/lazy tree indexing, theme-reference graphs, WCAG/color calculations, Markdown/changelog parsing, and seasonal/fractional time-zone calculations. Public parsers and path helpers move to package-export tests; they do not need private imports.

On 11 October, Ros approved [two real-Shiki ownership exceptions](docs/test-rework/LIFECYCLE_EXCEPTIONS.md). The current allowance is 28 groups (about 1.8%). The original classification above remains frozen; the two fake-resource cases remain until the deletion gates pass.

Full per-file counts: [test files](docs/test-rework/files.md). Every group, category, target, history reference, parameterized browser name, and assertion evidence is recorded in these machine-readable behavior inventories:

- [Library A](docs/test-rework/library-a.jsonl) and [Library B](docs/test-rework/library-b.jsonl).
- [Browser A](docs/test-rework/browser-a.jsonl) and [Browser B](docs/test-rework/browser-b.jsonl).
- [Documentation and tools](docs/test-rework/docs-and-tools.jsonl).

The [frozen public API baseline](docs/test-rework/public-api-baseline.jsonl) records required value/type export names, constant values, and compound-to-named-part references from the released 0.6.0 build across 114 module entry points. It is independent of the registry regenerated during future tests. The new consumers must use explicit required named imports and types, not namespace imports alone. Confirm each compound part's compatible behavior/type; do not require private object identity unless the public API promises it. New exports are allowed; removing existing names/defaults requires an approved API change.

Constant encoding is ordinary JSON with non-finite numbers tagged as `{"$number":"Infinity"}`, `{"$number":"-Infinity"}`, or `{"$number":"NaN"}`. Decode these tags to the matching JavaScript number before comparison; check NaN with `Number.isNaN`. In particular, `TOAST_DEFAULT_MAX` remains Infinity, not null. Never compare lossy JSON serialization of public defaults.

These records distinguish actual observable checks from source-text claims. A source regex that mentions focus restoration does not prove that focus restoration works. Its meaningful intent becomes a public behavior obligation. Implementation spelling, private object identity, and redundant type shape do not become new behavioral requirements.

## Behavior inventory by public surface

The group records above are the detailed inventory. The following groups define the replacement suite's coverage obligations, including requirements currently expressed only as source checks.

| Public surface | Behavior to preserve |
| --- | --- |
| All component and block exports | Root/subpath imports, compound/named aliases, optional-peer isolation, SSR/hydration, native attribute forwarding, documented defaults, untyped JavaScript invalid-input fallback, controlled rejection, and public events/slots. |
| Buttons, links, presentational parts | Native click/form/navigation semantics; disabled/loading restrictions; safe external `rel`; semantic lists/headings/times; icons, sizes, densities, truncation, status and decorative modes, layout and responsive bounds. |
| Form controls and Field/Fieldset | Labels, descriptions, required/invalid relationships, real FormData, controlled/uncontrolled values, read-only/disabled behavior, reset/commit/cancel, IME, paste/drop, validation, and logical keyboard behavior. Includes Input, Input Area, Input Group, OTP, Checkbox, Radio, Switch, Toggle, Editable, and Tag Input. |
| Number Input | Keyboard/pointer/wheel steps, min/max/clamping, decimals/scientific notation, locale formatting, partial drafts, caret/selection preservation, controlled rejection, field inheritance, provider events, modifier precedence, scrub rollback, hold/repeat, and unmount cleanup without affecting a separate Ark input. |
| Select/Combobox/Autocomplete/Selection List | Primitive/object/custom mappings, whitespace and custom filtering, empty results, disabled options, single/multiple values, clearing, form values, keyboard/typeahead, popup placement/scrolling, and retained selection. |
| Menus, navigation, toolbar | Pointer/keyboard opening, submenu chains, action/link/radio/checkbox semantics, active right checkmarks, disabled entries, controlled state, RTL, selected links, focus return, roving focus, and native editing keys. |
| Dialog/Drawer/Popover/Hover Card/Tooltip | Public labels/IDs, portals and anchors, traps, dismissal rules, restored focus, nested-layer ownership, alert/pending protection, all sides/sizes, interactive contents, timing, snap/drag state, and reduced motion. |
| Sidebar/Application Shell/Workspace Switcher | Collapse, offcanvas, peeking/hover reveal, pinning, mobile drawers, controlled rejection, placement/RTL, 5px resize target, drag/keyboard bounds, saved width/state, independent groups/contexts, inert hidden links, nested popup focus, namespace/profile selection, menu orientation, centered reading content, scrolling, search/slash behavior, and copied snippets. |
| Command Palette | Filtering/grouping, disabled items, exact/modified activation, asynchronous/empty states, shortcut scope, theme/mobile bounds, focus restoration, retained hidden content, top-aligned and morphing motion, interrupted transitions, and reduced motion. |
| Settings and account demos | Mounted drafts, independent sections, controlled/disabled/non-collapsible state, contextual save actions and validation, tab keyboard navigation, time zones, password clearing, notification rows, privacy auto-save feedback, email/account tables, deletion confirmation, mobile layouts, and focus preservation after closing. |
| File Browser/Resource Picker/Message Composer | Sort/filter/select without losing hidden selections; confirmation/cancellation; disabled selections; folder load ordering and cancellation; recoverable errors; duplicate submission restrictions; create/rename/read-only actions; latest result wins; root changes/unmount abort; IME/repeat/newline rules; attachment/text limits; cancel and external completion. |
| Data Grid/Virtual Tree/Drag Selection | Filtering/sorting/paging, custom accessors, controlled/manual data, selection, visibility/pinning/resize, logical keyboard focus, accessible coordinates, bounded DOM for 100,000+ rows/nodes, lazy branches, duplicate node rejection, additive rectangles, pointer cancellation, and edge scrolling. |
| Date/time, pagination, progress, steps, timer | Ranges, unavailable dates, limits, presets, localized parts, fractional offsets/DST, invalid/cancelled page drafts, boundary controls, progress states, completion/reset, timer start/pause/resume/reset, and motion preferences. |
| Code, diff, clipboard, downloads, QR | Real Shiki loading, aliases, language switching, lines/highlighting, fallback and cleanup; valid/invalid unified patches, counts and split rows, CRLF/Unicode and literal malicious text; real clipboard results and denied-permission behavior; real download contents; QR round-trip decoding and scan-safe output. |
| Charts/maps/Flow/cropper | Real ECharts/uPlot/MapLibre, public updates/exposed APIs, stream bounds, removed-series cleanup, time-axis labels, map controls/search/error states, safe popup text, connector/branch geometry, panning, real image decode, source replacement/error recovery, crop bounds and exported pixels, and resource cleanup. |
| Theme, registry, and packed package | Explicit theme imports, CSS scoping, canonical/legacy/nested theme modes, token/reference validity, contrast, metadata consistency, registry imports that resolve, full licenses/notices, no accidental optional imports, and strict consumer declarations with and without optional peers. |
| Docs HTTP and copied examples | Every current guide/component/block route and Markdown export, no leaked shell controls or islands, GFM/code fences, safe changelog HTML, navigation/history/TOC/pagination, copy source, compiled and mounted snippets, no-JS source/SSR output, license download, development cache isolation, and dev-only prefetch behavior. |
| Release/deployment CLI | Stable/prerelease channel selection, CI/protected-tag/version/token guards, scoped authentication/file permissions/no secret output, subprocess failure, exact release notes, generated-version agreement, Pages idempotency/deployment/domain polling, safe DNS routing, and Access migration/allow policies that keep intended hosts protected. |

Source history confirms important regressions in `0d31498` (strict published declarations), `c912a54` (caret, focus, closed popup/sidebar behavior), `ecb467f` (shell centering), and `013aad2` (nested modal accessibility). Initial imported tests often have no issue reference; they are not automatically labeled regressions.

## Proposed harness

One entry point, `pnpm test`, will build and pack Kappa, prepare isolated consumers, start the built docs and consumer application on owned loopback ports, run public library/CLI/HTTP/browser checks and the small logic suite, then stop only its own processes. Existing CI checks remain in place. Reuse CI artifacts only when they match the tested source revision.

- Install the generated tarball outside the workspace. Do not use source aliases, relative imports into `src`, a workspace link, private VMs, or test-only runtime injection. Test core-only and optional-peer consumers; compile copied public examples with `skipLibCheck: false` on dh-pc/CI.
- Run real Vue, Ark/Zag, TanStack, Shiki, ECharts, uPlot, MapLibre, Intl, image/canvas, browser clipboard/downloads, Node subprocesses, Git, and filesystem behavior. The existing stack needs no database/container service for this library.
- Use application fixtures built with documented props/slots/events. Their loaders/actions call an owned local HTTP service with per-test data. Hold/release actual HTTP responses to test errors, cancellation, ordering, and concurrent completion. Real public event recordings are valid contract checks; mocked private collaborator call assertions are not.
- Fake services outside our control only at the network boundary: Cloudflare, npm, geocoding/map tiles, optional analytics, and GitLab API responses. Prefer a stateful loopback emulator and a scoped proxy with a test-only CA for hard-coded HTTPS hosts. Use actual CLI processes and their real HTTP client; do not pass `fetchFn`, fake `run`, fake writers, or fake image/highlighter factories. Prove this proxy approach before retiring the old provider tests.
- Use synthetic credentials only. No publication/deployment occurs during tests. Isolate provider state per test. Check provider outcomes, refusal/errors and redacted output, not private helper call sequences. An emulator cannot prove Cloudflare/npm's current remote policy; retain real release/deploy verification in CI.
- Give each test its own browser context, data, Git project, files, and service namespace. Deny unlisted external requests. Keep one browser worker initially because focus and clipboard share resources. Use real browser permissions/popup/download events; use Playwright's clock for time-based behavior when feasible. Remove hand-written pointer-lock/frame/window-open patches only after equivalent public checks are proven.
- Prefer roles, labels, visible values, real event results, and fixture-owned test IDs. Do not inspect Vue instances, private stores/machines, source text, or private collaborator counts. Exact dimensions/timings need a public design requirement; otherwise assert user-visible bounds, order, stability, and accessibility.
- Generate property inputs with a fixed seed. Check independent invariants/reference results for decimal arithmetic, geometry, parsers, graph cycles, contrast, and time zones. Do not copy the implementation into expected results.
- Prototype a real resource-release oracle before removing Shiki lifecycle tests. A missing `dispose()` can leave the same public rendering/hook result; load/unmount alone is insufficient. Both ready and late initialization cleanup mutants must fail through an observable resource requirement. For cropper URLs, capture actual rendered owned URLs and verify they cease to be usable after replacement/unmount, while caller-created URLs remain usable. If no public oracle is feasible, retain affected old groups as unresolved and bring the decision back; do not claim replacement proof.

## Proof before deletion

1. Keep both suites. Link every meaningful inventory requirement to a replacement test or an existing KEEP-BB test that actually exercises it. Compile/package checks replace export/type wiring; types alone do not protect JavaScript callers or emitted declarations. Use the frozen required-name/type/constant/compound manifest and actual named-import consumers, so removing an export and its registry entry together still fails. Preserve public constants and their corresponding real default behavior, including Button defaults and Tooltip timing/placement.
2. Collect old/new coverage with the same scope and mapping pipeline. For each old-only executable line/branch, add a public test or record a specific reason it needs none. Zero coverage alone is not proof of dead code. Flag code as dead only after proving it has no public/import/template/CLI path; do not remove production code in this work.
3. Use StrykerJS's command runner for the existing Node/Playwright commands. It supports Vue script mutation, but browser mutant activation and rebuild/pack isolation need a prototype. Verify a known fault goes red in the executed bundle before accepting any score. If switching changes source-pattern tests during the baseline dry run, use a reviewed AST mutation driver that applies one semantic fault per isolated snapshot; this is an equivalent tool, not an exemption from mutation testing.
4. Use the same fixed mutant set, seeds, source revision, scope, timeout rules, and equivalent-mutant decisions for old and new suites. Core scope: number-input decimal/caret handling; sidebar reveal/resize/focus; file-browser/resource-picker state; grid/tree state; crop geometry/lifecycle; diff/Markdown/changelog parsers; theme graphs; and release/deployment guards. Test through fresh packed output where the consumer loads compiled code.
5. Record paired old/new outcomes for every shared mutant ID, using the same denominator of valid non-equivalent mutants; both suites use the same timeout/no-coverage rules and exclusions. Separate compiler rejection from behavioral kills and identify old kills caused only by source-pattern assertions. New overall and per-module scores must be within five percentage points of the old score, with no unexplained regression. Review survivors and add public tests. Cleanup, cancellation, security, and known regression obligations must retain protection regardless of aggregate score tolerance. Never count a runner/build/activation failure as a killed mutant.
6. Never delete an old failing test to get green. Report and investigate the bug or harness failure first. Confirm any fix against both suites; production fixes need their own approved scope.

Stryker references: [command runner configuration](https://stryker-mutator.io/docs/stryker-js/configuration/), [Vue support](https://stryker-mutator.io/docs/stryker-js/guides/vuejs/). Coverage collection follows [Playwright Coverage](https://playwright.dev/docs/api/class-coverage), [Node 24 coverage](https://nodejs.org/download/release/v24.19.0/docs/api/test.html#collecting-code-coverage), and [Monocart source-map reporting](https://github.com/cenfun/monocart-coverage-reports).

## Deletion batches after proof

Each batch has one Conventional Commit, its behavior mapping, removed test-line count, and explicit list of production seam removals (or `none`). Run the complete new suite after each batch; full existing CI gates must also pass. Use `trash` for repository deletions. Keep mixed files until all their groups are handled.

| Order | Batch | Exit condition |
| ---: | --- | --- |
| 1 | Repeated export/type/constant wiring groups | Strict packed consumers, public registry resolution, and relevant default/invalid-input behavior cover the obligation. |
| 2 | Component source/CSS pattern groups | Public browser/package checks cover attributes, state, layout, accessibility, motion, optional peers, and error paths. |
| 3 | Private state/filter/async groups | Public consumer and real HTTP tests cover controlled rejection, failures, ordering, cancellation, duplicate actions, and teardown. |
| 4 | Fake Image/Shiki/browser API groups | Real dependencies and browser/network error scenarios kill the matching mutants. |
| 5 | Release/provider mock groups | Actual CLI/process/filesystem plus stateful network-boundary tests preserve publishing, DNS, and Access guards. |
| 6 | Unused mocks, fixtures, helpers and test-only DI seams | Search confirms no consumer remains; public API unchanged; list each production seam removal. KEEP-LOGIC and public package/HTTP/browser tests remain. |

## Adversarial review policy (Phase 5)

There is no tracked `.claude/agents` setup. Add `REVIEW.md` and `CONTRIBUTING.md` after approval; use the existing `AGENTS.md` for a short policy link rather than creating `CLAUDE.md`.

The adversarial reviewer receives the public specification, diff, and black-box test results in a fresh context. Do not provide this plan's implementation rationale, implementer notes, or conversation history. Ask it to find failing inputs/states/sequences, missing errors, unsafe input handling, auth/permission mistakes in CLI guards, races, resource leaks, and changed public behavior. Require a public-interface reproduction for each confirmed finding and add it as a new black-box test. Astra Max reviews each completed area; another independent reviewer can be added if available.

Contribution policy: new behavior needs a black-box test; private unit tests require a written KEEP-LOGIC reason; mock-interaction assertions are not allowed. Review does not replace deterministic tests for a confirmed bug.

## Risks and approval boundary

- Existing browser coverage is substantial; replacing it wholesale would add risk. Keep it and close the unit-only gaps first.
- Source-only checks can pass while a component is broken, and can inflate mutation scores. Map their user-facing intent, not their implementation spelling.
- Browser coverage needs chained docs/library maps. TypeScript type stripping, unused exports, generated metadata, templates, and CSS need explicit denominator rules; do not report a convenient executed-files-only percentage.
- Clipboard/focus, animations, pointer lock, and shared clocks can create false failures. Retain the current one-worker policy until isolation is demonstrated.
- CLI proxy/emulator fidelity and Stryker browser activation remain unproven. Prototype both while the old suite remains intact.
- Mutating compiled UI paths requires rebuilds and can be expensive. Run targeted public scenarios per module, then the complete suites at each deletion checkpoint; retain fixed mutant manifests for comparison.
- KEEP-LOGIC cases remain exceptions, not a new broad unit-test layer. Public helpers can have Node black-box tests without a browser.
- No changeset is needed for test/harness/documentation-only work. Do not change runtime behavior, release, merge, or publish as part of this plan.

Final Phase 5 report will compare test count, runtime, coverage, mutation score, removed test lines, confirmed bugs, and unresolved uncertainty. At Phase 1, removed tests/production lines and confirmed new bugs are all zero.

Phase 2 is authorized. Do not delete existing tests until the coverage and mutation proof passes.

Amendment approved by Ros on 12 October 2026: prove and remove one batch at a
time, while keeping unresolved tests. See `docs/test-rework/FASTER_SEQUENCE.md`.
The final coverage/mutation comparison still covers the remaining core scope.
Ros also requests no subagents; use completed reviews and continue alone.

Phase 2 scope exception approved by Ros: isolate the DialogLayout compound object after an installed-consumer regression confirmed that importing both APIs replaces Dialog parts and drops its custom close slot. Keep a failing-before/passing-after public regression and a patch changeset. Its registry and declaration build helpers must recognize the clone.

Second exception approved by Ros: explicitly re-export `progressAnatomy`, `useProgress`, and `useProgressContext` from the component barrel. The 0.6.0 declarations advertise them but the published root JavaScript omits all three. Preserve the failing named-import regression and a separate patch changeset. GitLab issues #9 and #10 track the production defects independently of this branch.

Third exception approved by Ros: reconcile native checkbox state after an app rejects a controlled change. Public browser tests showed a checked native input despite an unchanged false selection. GitLab issue #11 tracks the defect. Use the real primitive context after the parent update, preserve events, cover roots/providers/groups and FormData, and add a patch changeset. This does not change form-reset behavior.

Fourth exception approved by Ros: annotate the minimal-workspace demo's namespace
array with the public `WorkspaceSwitcherItem` type. The copied source otherwise
fails strict Vue template compilation on `item.icon`. GitLab issue #12 tracks
the docs defect. Preserve the public HTTP-to-copied-SFC regression. This is a
docs-only type fix; no runtime change or package changeset is needed.

Fifth exception approved by Ros: require an own registry entry before returning
component metadata. The installed package otherwise returns built-in objects
for unknown names such as `__proto__` and `constructor`. GitLab issue #13 tracks
the public API defect. Preserve the failing-before public regression, keep
known-name lookup behavior, and add a patch changeset.

Sixth exception approved by Ros: use own entries for Code Highlighted language
and alias lookup. The installed public normalizer accepts inherited names such
as `__proto__` and `constructor` as supported languages. Keep the failing-before
public regression and a separate patch changeset; GitLab issue #14 tracks it.

One retained legacy wiring group failed because the real Ark hidden input moved into a private adapter. Its assertions now follow that adapter; the group remains. No tests were deleted. Real browser/FormData checks prove the native-input requirement and fail on the pre-fix package. The original inventory remains frozen for comparison.
