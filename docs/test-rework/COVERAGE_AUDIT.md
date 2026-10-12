# Coverage audit

Read when comparing the retained and replacement suites.

## Inspector comparison, 12 October

The consolidated `SEQD3O/kappa-proof-n6qSP3` records preserve the initial
collector failure and the failed full browser run. Corrected Node stages pass;
the screenshot-only timing correction passes three focused repeats. This is
not a clean single full-run record.

The read-only Inspector observer recovers actual SSR/prerender/config code and
maps. Native process/thread/script identity, generated/map hashes and original
source bytes are checked. Unmapped framework chunks get no source credit.
Both profiles receive the same 339 zero-hit representation records; these
add no execution credit. The new report includes template representations that
the earlier browser-only mapping omitted. Its denominator and percentages must
not be compared directly with the earlier 6,882-line report.

| Suite | Lines | Raw shared-representation branches |
| --- | ---: | ---: |
| Retained | 4,627/13,021 (35.53%) | 7,863/17,621 (44.62%) |
| Replacement | 8,485/13,021 (65.16%) | 9,922/17,621 (56.31%) |

Both reports contain 1,256 sources. Per-source identifier and semantic branch
comparison remains open; totals alone do not approve additional deletion.
The first export/type batch uses its already reviewed frozen public contracts,
strict consumers, default checks and isolated removal pass. Other groups remain.

The original Phase 1 report accidentally included 14 excluded entries: test
helpers, Playwright configuration, static documentation data, and unmapped
framework bundles. The original report, `baseline.json`, and raw coverage remain
unchanged. Reprocessing the same historical data with the corrected ownership
filter gives 1,239 files, 4,869/6,859 covered lines (70.99%), and 8,009/11,828
covered branches (67.71%). This is a reporting correction, not a test change.

The paired snapshot with the three approved production fixes has 1,240 owned
files. Both suites have the same LCOV line and branch identifiers in every
source file: 6,881 lines and 11,854 branches. The extra source is the checkbox
adapter. Native copied scripts enter the report only after their bytes match
the original. Packed and copied source maps also require verified original
source bytes.

The preliminary `kappa-proof-ccRKhM` run measured:

| Suite | Lines | Branches |
| --- | ---: | ---: |
| Retained | 4,889/6,881 (71.05%) | 8,033/11,854 (67.77%) |
| Replacement | 5,163/6,881 (75.03%) | 8,387/11,854 (70.75%) |

This run had two browser failures. Their assertions remain; focused repeats
passed after correcting stale pointer coordinates and animation timing. These
percentages are not deletion approval. The snapshot also predates the new
runtime vectors, generator CLI checks, and development-server check.

There are 299 lines and 269 branches covered only by the retained suite in that
snapshot. Each needs a replacement assertion or a reviewed reason to keep or
exclude it. Zero coverage does not establish dead code.

The replacement measurement includes contributor build processes. The original
historical run excluded build setup. Report that difference when presenting
the historical comparison; use the paired run for deletion decisions.

For the next comparison, preserve production JavaScript and maps before
contributor tests rebuild the site. Require accepted browser records with
executed ranges. Compare per-source line and branch identities, not just totals.
Raw records, provenance hashes, accepted-record counts, and gap manifests remain
with the dh-pc run artifacts. The full verification and mutation comparison are
still in progress.

## Earlier paired report

The `kappa-proof-csTpas` run uses the same 1,240 files, 6,881 executable
lines, and 11,854 branches. Original-source bytes and copied-script provenance
checks passed. Per-file LCOV line and branch identifiers match. These identifiers
do not prove exact branch-map equivalence; see the captured-run limits below.

| Suite | Lines | Branches |
| --- | ---: | ---: |
| Retained | 4,889/6,881 (71.05%) | 8,033/11,854 (67.77%) |
| Replacement | 5,434/6,881 (78.97%) | 8,658/11,854 (73.04%) |

There are 141 lines and 131 branches covered only by retained tests. These
include declaration/build helpers, documentation parsers/navigation, three
scrubber branches, and release/deployment error guards. Their obligations still
need a public test or an explicit reviewed reason. No code is classified as dead
from these measurements.

This full run passed all Node checks but had four retained browser failures.
Their traces include failed dynamic imports and `ERR_NETWORK_CHANGED`. All four
later passed unchanged focused repeats and the complete `yhw64m` run. The new
plot, Shiki, timing, and default-behavior checks
were added after this measurement and are not included in these percentages.
These results do not approve a deletion batch.

The raw `coverage-pair.json`, both LCOV reports, summary and provenance records,
and the original failure traces remain under the dh-pc proof directory.

## Temporary config attribution

Vite bundles declaration helpers and documentation configuration into temporary
config modules, then removes those files. The saved V8 records contain their
URLs but cannot supply the deleted generated code. This explains missing source
attribution; it does not prove that every helper branch ran or that code is dead.

A proof-only Node load observer retained the normal config loader and saved its
unchanged returned source and inline map. A normal library build passed. Node's
source-map support with `nodeModules: true` also retained the temporary config map
in raw coverage. The captured source-map content for both declaration helpers
and the Vite config exactly matches the snapshot's original files.

The capture probe is under `capture-probe/` in the dh-pc audit directory. A new
paired report must use this capture on both suites, verify generated and original
source hashes, and resolve any remaining guards with behavior evidence. The
pre-capture 141-line / 131-branch record and percentages above remain saved.

## Captured complete run

The `kappa-proof-yhw64m` run passed all Node stages, all 34 retained artifact
checks, and all 972 browser cases. The served-source compiler check was added
later and is not part of this result.

Four real CLI configs were captured. Generated bytes match their hashes; saved
maps match the inline maps and native Node cache after explicit file-URL and
empty-source-root normalization. Original helper and config bytes also match.
The old suite has no config capture because its build setup was outside its
coverage stage. The comparison adds the same captured function/range records,
with every hit counter set to zero, to both reporting inputs. These records add
no execution credit. The initial reports and invalid stale-path summaries remain
saved; corrected `coverage-common-r2-*` reports use their own output paths.

| Suite | Lines | Raw shared-representation branches |
| --- | ---: | ---: |
| Retained | 4,890/6,882 (71.05%) | 8,037/11,873 (67.69%) |
| Replacement | 5,552/6,882 (80.67%) | 8,810/11,873 (74.20%) |

The 1,240 source sets, line identifiers, statement maps, and LCOV branch
identifiers match. This does **not** prove unique semantic branch identity.
Native and bundled helper representations remain separate in both reports.
Exact Istanbul branch maps differ in 302 records across 66 other sources.
Trimming only verified original-source whitespace resolves 253; 49 records in
22 files remain different. None adds an old-covered/new-uncovered arm. Meter
has the sole changed hit-status vector among those records. Keep that mapping
limit open; do not merge near ranges or transfer hit counts between suites.

The shared LCOV identifier comparison records 68 old-only covered lines and
65 branches. These include representation limits and unresolved behavior
obligations; they are not a count of confirmed missing behaviors.

Astra independently checked these records. The remaining behavior gaps and
mutation gates still prevent deletion. The public copied-source check also
found a strict TypeScript defect in the minimal-workspace example. Ros approved
the docs fix; it is applied and the served strict-compiler check passes. Issue
#12 remains open until merge.
