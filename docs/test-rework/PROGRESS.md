# Test rework progress

Read when resuming this branch or checking deletion readiness.

Phase 3 continues, with Phase 4 now allowed for verified batches. Batch 1 removes
Batch 1 removes 94 export/type definitions in commit `5169573`. Batch 2 removes
42 Diff Viewer/resource cases: 1,561 original cases remain.
All 651 remaining library/docs cases pass in the isolated removal copy. The
foundation is committed as `1c3595b`. Ros approved the two local commits on
12 October. No push, merge, or release has occurred. Other groups remain.

Five published-package fixes have explicit approval, patch changesets, public
regressions, and open GitLab issues: Dialog compound isolation (#9), missing
Progress root exports (#10), rejected controlled checkbox state (#11), and
unknown registry names returning built-in objects (#13), and inherited code
language names being accepted (#14). The docs-only strict
namespace annotation is tracked separately by #12.
Issues stay open until their fixes merge.

Recent checks ran only on dh-pc:

| Area | Evidence |
| --- | --- |
| Retained Node suite | All 778 cases passed in the paired snapshot. |
| Retained Menu Bar and Select | Each passed three focused repeats after preserving assertions and fixing test pointer timing. |
| Diff, Cropper, File Browser | The 15-case focused area passed. Real image pixels, URL lifetime, HTTP failures and cancellation are used. |
| File Browser, Resource Picker, theme, retained pointer cases | All 102 expanded cases passed across three repeats. |
| JavaScript input guards | 910 static cases through 44 installed module groups passed. Cases come from 52 original groups; mixed groups are not fully replaced. |
| Real generator/build CLI | Passed: real build/pack, strict positive and negative prop/slot consumers, read-only missing/stale checks, changed upstream-input refusal. |
| Development server | The corrected isolated check passed (one case, about one minute). It verifies document continuity, preserved state, fresh form handlers, and unchanged live dependency responses across real sync/build commands. Production transitions retain the document; development links intentionally use native navigation. |
| Retained QR checks | Nine unchanged focused cases passed. The interrupted full run recorded a renderer crash before the color assertion. |
| Coverage | LCOV identifiers match; exact branch-map limits remain. Gaps and reporting corrections are in `COVERAGE_AUDIT.md`. |

Failed prototypes and full-run traces remain in the run artifacts. A new cropper
unmount assertion expected an aborted HTTP request, but the browser completed
it. That new assertion was removed; the old cleanup obligations remain. A
synthetic generator fixture initially used shorthand compound parts; it now
uses Kappa's existing explicit-part convention and keeps the strict assertions.
The development prototype also required a real hydration wait before clicking.

Stryker 10.0.0 is installed in a separate dh-pc tools directory. Its Diff parser
pilot uses the same 339 mutant identities in both suites. The instrumented
inactive baseline passes for retained tests and an actual build/pack consumer.
The first comparison found one lost context-row assertion. That assertion is
now added; its installed-package test passes. The paired rerun detects the same
260 of 339 mutants in each suite: 76.70% raw score. Old: 240 killed, 20 timeouts,
79 survivors. New: 245 killed, 15 timeouts, 79 survivors. No previously detected
mutant is lost. A manually activated context-row mutant fails the installed
consumer assertion. Astra approved this pilot method; survivor, equivalence,
and timeout analysis remain open. This is not a score for all core modules.

Ros stopped the last full run (`/tmp/kappa-proof-Ab2wiM`) on 10 October. Its
reports and stop marker remain. It was not a clean full run: the development
form and QR theme check failed before interruption. The initial aggregate CLI
budget also expired under coverage. A separate run with enough time passed all
15 CLI cases, all 26 approved logic cases, and the updated public context-row
assertion. The original failures remain in the evidence.

Work resumed on 11 October. The corrected real-Shiki prototype passes both
cleanup cases; removing ready or late disposal makes the corresponding case
fail. Astra approved its first-cleanup oracle and independent readiness flags.
Ros approved the two-case KEEP-LOGIC exception. Both test commands now include
the real-resource cases. The old fake-resource cases remain until deletion proof.

The fresh paired run is `kappa-proof-csTpas`. Strict packed consumers, retained
Node cases, replacement Node cases, and CLI checks passed. Browser execution
finished with 962 passes and four failures in 28.7 minutes. The failures are the
embedded mobile drawer, two rail-search cases, and adding a toast while its group
is hovered or focused. One rail case did not hydrate within its assertion
timeout; the other failures need trace review. These are retained tests; their
failures remain unresolved and must not be deleted to obtain a pass.

New temporary fixtures use dh-pc's disk because its `/tmp`
tmpfs filled during a failed dependency copy. That failure and all earlier
development attempts remain in the artifacts. Development script diagnostics
outside the sync/build proof are attached separately; the observed toolbar 504
has not been explained. Script failures during the proof and page errors fail
the test. Astra approved this scope and the revised assertions.

The targeted mutation comparison for crop geometry, decimal stepping, and tree
indexing used 265 identical mutants. Both selected Node suites produced the same
outcomes: 165 killed, 11 timed out, and 89 survived. These are targeted Node
results, not complete browser or core-module mutation scores. Survivor review
and the remaining modules still need work.

Astra's latest review found gaps in the new plot assertion and in four default
behavior mappings. Distinct plot images do not prove that bars render correctly.
ActivityFeed defaults, ExpandableText's default clamp, Flow defaults, and Tooltip
spacing need explicit rendered evidence. Late pointer-lock cleanup also remains
unproved through a public interface. All affected original tests remain.

The plot checks now sample gaps between real bars and require a points series
with a public fill color to leave the area below its samples clear. Ready events
are compared without assuming component initialization order. The public default
fixture checks the three-line text clamp, Flow alignment and padding, and Tooltip
gutter and viewport inset. Real server rendering checks ActivityFeed's default
size, tone, marker, and semantic tags. Astra reviewed the revised assertions and
found no remaining static blocker.

The five new browser cases now pass on dh-pc: two real-Shiki download/error
cases, default Tooltip timing, omitted-prop layout/spacing, and real plot shapes.
Strict fixture declarations and the five server-rendering cases also pass.
Initial fixture failures remain recorded: XYPlot needed its declared camelCase
accessibility props and stable options/series objects; the standalone text check
uses native expanded state and measured height. The separate renderer and
stale-error mutation checks used fresh builds and packed consumers.

All three faults fail the intended public assertions. The retained tests detect
the removed bar and points builders but miss the cancelled Shiki error. Astra
independently read the activation, build/package results, and assertion logs and
approved these scoped proofs. The passing baseline is cumulative across two
focused runs. [The reviewed record](mutation-public-gaps.json) labels original
and mutant source hashes and excludes the first setup attempt's missing-lockfile
errors. This is not the overall core-module mutation score.

The complete repository type check passed on dh-pc, with zero Astro errors,
warnings, or hints. Packed-package validation passed both core-only and full
strict-declaration consumers.

Native late pointer-lock cleanup now has a public proof. Three baseline repeats
passed. Removing only the stale-request unlock causes both the retained assertion
and the native case to fail. The recorded mutant state holds the same mounted,
disabled, non-dragging target locked before test cleanup, without a lock error,
window/tab focus loss, or detachment. Astra independently checked the attachment
and approved the scoped proof. The case is promoted as
`number-input-late-lock.spec.ts`. It proves release and value preservation; the
old mixed group remains for pending-request deduplication and other obligations.

All 34 existing KEEP-BB documentation artifact groups now run against the packed
consumer's actual production output. The sole private path-mapper import in a
copied mixed test file uses an independent released-route oracle instead. All
34 passed. Empty selection, skips, todo cases, cancellations, missing counters,
or pass/count mismatches fail the runner. Selected IDs/names and inventory/route
hashes are saved beside TAP. Astra reviewed these changes and the recorded passes.
The same no-omission count guard passed all 28 approved logic cases.

Saved failure traces include `ERR_NETWORK_CHANGED` and failed dynamic script
imports. The unchanged failing cases are queued for three focused repeats. This
does not establish that every failure is caused by the environment. Remote access
then failed with `Connection timed out during banner exchange`. The host remained
online; SSH later recovered. Focused repeats resumed against the preserved disk
consumer. The older `/tmp` consumer was missing its package manifest, so the
failed preparation remains recorded separately. No local checks replace the
remote gate.

All four original browser failures passed unchanged in three focused repeats:
12 passes in 1.1 minutes. No assertion, retry setting, or production code changed
for this recheck. The original full-run failures remain in the saved evidence;
a clean complete run is still required.

A fresh complete paired run, `kappa-proof-yhw64m`, includes the six new public
browser cases, the retained artifact checks, and transient config capture. Both
packed consumer profiles, all Node stages, all 34 artifact checks, and all 972
browser cases passed. Browser runtime was 23.6 minutes. This run predates the new
served-source compiler check described below.
No original test or test-only seam has been removed.

The earlier `csTpas` report matched LCOV line and branch identifiers, with
141 old-only covered lines and 131 branches. Its four browser failures later
passed unchanged repeats and the complete `yhw64m` run. Use the newer coverage
record and its branch-map limits below for current deletion decisions.

The served minimal-workspace example has a confirmed strict TypeScript defect:
the mixed namespace array leaves `icon` unavailable on one union member. A
public HTTP-to-copied-SFC check exposes it. A two-line annotation with the public
`WorkspaceSwitcherItem` type makes all three copied workspace examples compile
in the disposable consumer. Ros approved the docs-only fix and GitLab issue.
The two-line patch is applied; issue #12 remains open until merge. Fresh remote
verification uses `/home/dh/.cache/kappa-test-next-zrbdon` so earlier source and
test evidence stays unchanged.

Captured coverage now attributes real CLI config code to the declaration
helpers. Shared zero-hit inputs correct the two helper reporting schemas without
granting execution credit. Astra checked generated/map/cache/original bytes.
Line coverage is 71.05% retained and 80.67% replacement. Exact branch-map limits
remain in 49 records after verified whitespace normalization; none adds an
old-covered/new-uncovered arm. Keep the raw results and limits in
`COVERAGE_AUDIT.md`; they do not approve deletion.

Nine real npm/Cloudflare CLI cases passed after adding missing-executable,
malformed deployment-response, and missing-stage checks to existing groups.
A publisher fault suppressing a native npm spawn error fails the new public
exit-code assertion and the old expected-exception assertion. Astra independently
checked the source diff, hashes, unchanged tests, and assertion logs and approved
this scoped proof. The first fault fixture lacked the old package manifest; that
setup failure is excluded. These checks add no groups or publisher-code changes.

The served-source compiler harness checks static, side-effect, dynamic, and
type imports against public dependencies. Its initial recursive traversal hit
compiler AST backreferences; the iterative traversal uses a visited set. The
failing-before check reaches the original TS2339 defect. After the approved fix,
the fresh `fhrc6S` served-source check passed 1/1 with all three copied variants.
Astra independently confirmed the strict compiler result and approved this
area. The failed harness prototype remains saved as a setup failure.

The fresh snapshot also passed full type checking, all 778 retained Node cases,
all replacement Node stages, and all 34 artifact cases. Its browser run finished
with 970 passes and two failures in 26.9 minutes. Browser Back left the Button
Group DOM under the Button URL after a view-transition timeout. The retained
Progress check timed out during navigation; its saved DOM has the correct tree.
The causes are unresolved. Both cases now run unchanged for three focused
repeats with the same coverage instrumentation. Their original traces remain.
The repeat finished with six passes in 4.7 minutes. No assertion, retry setting,
or production code changed. This does not establish a cause or replace a clean
complete run of the latest source.
It predates the new registry, declaration, and changelog checks below. Its copied
development test also predates the added Markdown HTTP assertions; those still
need focused execution after the full browser run.

Focused real package validation now rejects an unresolved type in the packed
public declaration: 1/1 passed. A separate real docs build with 13 releases
passed its HTTP page partition, pagination-link, complete-page, Markdown, and
out-of-range checks: 1/1 passed. The copied fixture owns its library data; it
does not modify the active consumer's changelog.

Independent registry metadata is frozen from the original released 0.6.0
artifact, with its source commit and SHA recorded. Both core and full installed
profiles passed the metadata, search membership, and compound-part check.
Exact source-file and description text, alphabetical ordering, and private
component identity are not frozen. A separate installed-package regression
confirmed another bug: inherited object keys return built-in objects instead
of `undefined`. Ros approved continuation with the proposed one-line fix and
issue. The own-entry guard and patch changeset are applied; issue #13 is open.
Astra approved the minimal fix and both registry exports' index checks.
Fresh packed-package verification is next.

Fresh fixed-package checks passed on dh-pc: core 169/169, full 134/134, strict
declarations, full type checking, and package validation. The exact current
development check passed 1/1 with its five Markdown/404 assertions. The real
changelog HTTP and served-source compiler cases passed 2/2. Astra verified the
executed hashes and approved each completed area.

Two more scoped faults have reviewed evidence. Disabling declaration diagnostic
rejection makes both the retained private check and the actual validation CLI
assertion fail. Removing `DeleteResource` only from the generated JavaScript
registry index leaves its JSON unchanged: all 60 retained discovery cases still
pass, while the installed public index check fails. Baselines pass and test
hashes stay unchanged. See `mutation-declaration-refusal.json` and
`mutation-registry-index.json`. These are selected-case proofs, not aggregate
mutation scores. Sixty registry groups now have explicit replacement records in
`replacement-registry.jsonl`; deletion gates remain open.

The paired run `kappa-proof-2dMG8t` under
`/home/dh/.cache/kappa-registry-fixed-gTd1Yj` passed all Node stages and both
public HTTP/compiler cases. Browser execution finished with 970 passes and two
failures in 25.2 minutes. The retained Colors copy test checked a transient live
message after waiting for another control's copied state to expire. Saved traces
confirm that the message had already expired. The test now checks each message
before that wait; every assertion remains. Colors and the unchanged Resource
Picker case pass all six focused repeats. Astra verified source hashes,
unchanged timeouts/retries, and the restored consumer source.

The Resource Picker failure occurs before its test body: saved requests report
`ERR_NETWORK_CHANGED` and failed dynamic imports during hydration. Its unchanged
three repeats pass. The underlying network-change cause remains unknown. Keep
the original full-run failures; focused passes do not make that run clean.

The updated coverage reporter requires exact observed browser bytes or an exact
same-artifact source witness for source-omitted records. V8 ranges must fit those
bytes. Reprocessing the failed full run gives 71.03% versus 81.34% line coverage
and 67.63% versus 74.44% shared-representation branch coverage. LCOV identifiers
match; 60 lines and 63 branches have old-only hits. Branch representation limits
and the failed browser cases prevent deletion approval.

The three-module CLI mutation pilot has 246 fixed identities. The first valid
pair found 139 old kills and 177 new kills; correction of missing diagnostics,
semver-guard masking, and the public channel message raised the new count to
197. Two remaining public gaps now have direct activation proofs: equal numeric
versions with different spelling (`0.05.0` versus `0.5.0`) and a three-digit major
version (`123.34.56`). Passing inactive tests fail the intended assertions with
the selected faults active. Six other raw lost IDs concern unsupported private
imports of directly executed scripts; keep them in raw counts. The next pair
records 139 retained kills versus 196 replacement kills, 47 survivors and three
timeouts. Astra verified all 196 intended kills, shared source bytes and mutant
identities. Focused activation separately confirms that the three timed-out
faults fail public assertions within about one second; their raw timeout entries
remain unchanged. Conservative kills-only scores are 56.50% and 79.67%.
See `mutation-cli-guards.json`.

Astra also found a shared diagnostic gap: suppressing inherited npm output loses
the provider error while current tests still pass. The public registry-rejection
case now requires the provider's message. Two valid-version rows protect
single-digit nonzero patches and multi-digit prerelease numbers. All three
reviewed faults fail those assertions with passing inactive baselines. The
updated comparison, `cli-mutation-pair-Ydxzl6`, records 197 replacement kills,
42 survivors and seven raw timeouts against 139 retained kills. The conservative
replacement score is 80.08%; raw timeouts do not grant kill credit. Separate
activations detect five of those seven faults. ID187 is equivalent for this
manifest path; ID139 revealed a missing refused-publication diagnostic. The
current guard assertion closes ID139: the inactive case passes and activation
fails its intended assertion. Astra verified hashes, no-omission counters and
the staged-input sidecar. This latest assertion has supplemental proof, not a
new complete 246-mutant comparison. Failed setup attempts remain saved and
receive no kill credit.

A fresh complete run, `kappa-proof-UzYqjN`, uses the corrected tests in a new
snapshot under `/home/dh/.cache/kappa-test-final-1i0oa3sg`. All Node stages,
strict types, 34 artifacts and both HTTP/compiler checks pass. Browser results
are 971 passes and one retained failure in 26.8 minutes. The minimal shell did
not hydrate within five seconds; it failed before the theme/mobile assertions.
The trace has no console or failed-request error, but a required script request
takes 3.89 seconds. Of 99 requests, 69 have HTTP 200 responses and 30 have no
recorded response. Cause remains unproved. Three unchanged repeats pass against
the preserved consumer. Astra verified unchanged test/config hashes and zero
retries. The full failure remains saved; the repeat is not a clean full gate.
This snapshot predates the latest resource and publisher assertions below.

Five scoped Cloudflare faults now have paired proof. All nine retained cases and
six public CLI cases pass without faults. The retained suite detects three:
ambiguous DNS routing, production protection opt-out, and missing email rules.
The public suite detects all five, including wrong-branch deployment acceptance
and provider secret redaction. Astra checked all logs and intended assertion
locations; the restored source and test/helper hashes match. The email fault
also causes two collateral mock-request failures, which receive no separate
behavioral credit. See `mutation-cloudflare-guards.json`. This selected fault
set does not establish the complete deployment or core-module mutation score.

Resource workflow mapping now covers all 18 original File Browser and Resource
Picker groups. Astra found three assertion gaps: a missing date could satisfy
the negative-size row check; the old folder's specific abort was not observed;
and the mutation test did not release success after a host ignored cancellation.
The revised checks address all three and retain transport cancellation too.
Strict declarations and all 51 cases across three repeats pass. Exact single
selection limits, repeated Enter during a pending creation, hidden selection,
and single confirmation events are also checked. Astra approved the revised
mapping, hashes and 51-case baseline. Four separate v1 state faults fail the
intended retained and public assertions: single-selection cardinality, stale
folder results, disabled selection history and confirmation/cancellation.
Actual tarball and installed maps contain the recorded mutant source bytes;
build, install, compiler and docs stages pass before assertions fail. The v2
additions have separate passing evidence; those four faults did not execute v2.
See `mutation-resource-workflows.json`. No overall mutation or deletion approval.

Two v2 resource faults now have reviewed proof. Both selected suites detect a
removed negative-size guard; the public check fails the exact Size cell. Removing
the stale mutation-completion guard passes the selected old root-change case,
but fails the new public completion-event assertion after a successful ignored-
abort response. Astra verified one-case/no-omission counters, successful build,
install, compiler, artifact and HTTP setup, unchanged tests/helpers and exact
mutant bytes in tarball/installed maps. The first offline-cache setup failed and
is excluded. These are selected-case comparisons, not a full mutation score.

The behavior ledger now retains 815 existing public groups (945 expanded cases)
and all 26 approved original logic groups. Astra matched every public browser
case to the saved full-run XML and all 34 artifact groups to their saved selection.
The ledger preserves the known full-run failure; no deletion is proposed by
these mechanical mappings. The two real-Shiki exceptions remain separate.

The public language normalizer regression fails before the approved two-line
own-entry fix and passes afterward. Astra verified the fixed source in packed
maps, installed core/full artifacts, strict consumers/snippets, 169 core and 135
full cases, and both retained normalization cases. The issue and patch changeset
are separate. A combined alias driver then hit a nested-fixture `EEXIST` setup
error; a flat real build/pack/strict alias check passes and excludes that failure.

Astra approved all 33 CLI/declaration ledger rows after closing missing native
publication-hook, version, migration and alias-type assertions. All nine final
CLI groups pass with zero omissions. The current `fyRrLC` comparison has the
same 246 identities: 139 retained kills (56.50%) and 207 replacement kills
(84.15%), with no timeouts. Astra verified every intended failure, completed
case count and executed-input hash. Six private-import guard losses remain in
the raw counts. This score covers three CLI modules; deletion gates remain open.
The separate native publication-hook fault is also reviewed: actual publication
succeeds, but the new assertion detects the unexpected lifecycle marker. That
proof adds no aggregate score credit. Older reports remain unchanged.

The grid/tree v2 area passes strict packed consumers, 170 core and 136 full
package cases, 11 retained Node cases, 34 artifacts and both HTTP/compiler cases.
Its browser run passes 42 of 45 checks. Three new pinned-column checks initially
used the wrong scroll-container locator. After correcting it, all other checks
still pass, but right-to-left scrolling moves the pinned end header within the
native scrollbar gutter. A rendered diagnostic confirms the measured limits.
Astra's completed review recommends logical border/client-edge intervals rather
than exact pixel constancy. The revised check covers headers, body cells, usable
hit targets, three scroll positions and movement of the unpinned column; it
passes 1/1 without a production change. Original tests and failed runs remain;
pinning mutation sensitivity and the complete gate still need proof.

Ros requested a faster workflow and no subagents. Continue alone. Reuse owned
package output for test-only corrections, run only affected cases during those
corrections, and use one fresh complete paired gate for settled inputs. Do not
repeat broad passing checks without a new change or unresolved failure. The
approved deletion, coverage and mutation requirements remain in effect.

The first removal batch is applied: 94 definitions in 83 mixed files, about
1,608 test lines. Its isolated dh-pc copy passes all 588 remaining library and
63 docs cases, with zero failures or omissions. This removes 92 library cases
and two docs cases; the initial expected library counter incorrectly included
the docs cases. Ros approved proof per batch on 12 October; the amended order
is recorded in `FASTER_SEQUENCE.md`. No other groups were removed.

The consolidated snapshot is `/tmp/kappa-test-consolidated-SEQD3O` on dh-pc.
Builds and strict types pass. The Inspector observer initially fails in Node's
test-runner parent before execution. Its corrected observer records that known
unsupported parent and keeps native coverage; all 778 retained Node cases,
170 core and 136 full public cases, CLI stages and approved logic cases pass.
The unchanged successful docs build is reused: all 34 artifacts pass, and the
complete browser run finishes with 975 passes and one retained failure. The
Inline Copy Text theme case spends 29.4 seconds on an unasserted screenshot;
its theme click succeeds, but its assertion has no remaining time. Remove only
the two unasserted captures and retain every behavioral assertion. Three focused
repeats pass in 7.5 seconds. Initial collector/full-run failures remain saved.
No clean single full-run result is claimed from these focused corrections.

The foundation commit is `1c3595b`, separate from the deletion batch. It includes
the public harness, CI wiring, frozen inventory/contracts and approved fixes.
Automatic approval review first rejected the separate foundation commit because
its authorization was unclear. Ros then explicitly approved both local commits
on 12 October. The foundation commit succeeded after that approval.

Batch 2 removes 24 Diff Viewer and 18 resource workflow cases in three files.
The final owned dh-pc copy passes all 42 old cases before removal, all 546
remaining library cases, 16 installed-package function cases and 38 browser
cases. The first two browser setup failures remain excluded in saved artifacts;
no assertions were weakened. The passing proof is `kappa-diff-resource-removal-
S5hgPP`. Source and executed-input hashes match the snapshot. Paired coverage has
no old-only LCOV hits in these areas. Resource statement/branch maps match;
three Diff maps retain their attribution limit. The parser's 339-identity pilot
loses no raw detection and increases kills-only score by 1.47 points. Resource
fault proof stays scoped to four v1 and two v2 faults. No production seam changes.
See `deletion-batch-2.json`; remaining core coverage/mutation work stays open.

A read-only audit also selects 47 complete runtime function/constant groups in
40 mixed files. Their 894 frozen input requirements use released public exports.
Five mixed groups stay out of the proposal: Field, Fieldset, Hover Card, Number
Input alignment and XY Plot append/format behavior. No guard group is removed
until its proposed-removal and scoped proof checks pass on dh-pc.

Still required: complete behavior mapping, remaining coverage
gaps, the core-module mutation comparison, and proof for lifecycle obligations
that currently need private scheduling controls. Pending pointer-lock request
deduplication and ready/late Shiki disposal still have retained original groups. After
proof, remove tests in the approved batches. `REVIEW.md` and `CONTRIBUTING.md`
now define the blind review policy; the independent review has not occurred.
