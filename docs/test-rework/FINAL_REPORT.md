# Test removal report

Read when reviewing this branch or checking the final suite size.

Ros requested the remaining removals without more mutation or coverage work.
Existing results were reused for removal. The complete gate then passed on
dh-pc for commit `c195f5c`, including every remaining browser case.

| Metric | Before | After |
| --- | ---: | ---: |
| All executed/discovered cases | 1,697 | 1,357 |
| Private Node cases | 744 | 28 approved logic cases |
| Test files | 295 | 213 |
| Test code lines | 43,947 | 30,751 |
| Full-suite runtime | 885 seconds | 1,311.73 seconds |

725 original cases and 117 original files were removed. Public replacements
leave 340 fewer cases overall. Net test code reduction: 13,196 lines, including
new public tests. Final counts include both package installation profiles.

The complete run passed all 1,357 cases: 306 installed-package cases, 28 logic
cases, 16 real CLI cases, 34 public artifacts, two HTTP/compiler cases, and
971 browser cases. There were no failures, errors, skips, cancellations or todo
cases; browser retries were disabled. The earlier Inline Copy Text theme case
passed in this full run. The test command took 21 minutes 52 seconds, including
its build, packing and isolated consumer installs. Browser time was 18 minutes
33 seconds. These commands do more work than the original source-level suite.

Release-state checks, workspace type checks, the production build, package
validation and changeset status also passed. The overall gate took 25 minutes
49 seconds, including a setup correction: the temporary clone omitted `dev`.
Restoring the existing base reference fixed changeset status; source files did
not change. Its initial failure log is preserved. Evidence on dh-pc:
`/tmp/kappa-full-gate-yx2h93e_` and `/tmp/kappa-blackbox-nZlSwq`.
The earlier scoped gate remains under `/tmp/kappa-fast-final-IKjNpp`.

Astra Max's independent removal review found two chart checks without public
replacements. Two new browser cases cover series removal and time-axis labels,
including seconds, year markers, and daily labels across a real axis break.
They use the installed package and real ECharts. Strict fixture types, the
production docs build, and both browser cases passed on dh-pc with no retries
or skips. Playwright now discovers 971 browser cases. Evidence:
`/tmp/kappa-timeseries-regressions-gr1UOL`. Astra Max approved the repairs with
no remaining findings in that scope. No production code changed for the repairs.

Removed production seams, with normal runtime behavior preserved:

- Image Cropper: injected Image/ObjectURL environment.
- npm publisher: injected command runner and file writer.
- Cloudflare Pages: external fetch, logger and wait callbacks.
- Cloudflare Access: external fetch and logger callbacks.

The 28 private cases cover non-trivial logic and real Shiki resource ownership.
One existing browser case still overrides the pointer-lock API: it guards
pending-request deduplication that the native replacement cannot yet prove.
Its other assertions remain intact. No confirmed regression test was dropped
only because it failed.

Five published-package bugs were found and fixed with approval: Dialog compound
collision (#9), missing root Progress exports (#10), rejected controlled checkbox
state (#11), inherited registry names (#13), and inherited language names (#14).
The docs type annotation has its separate issue #12. Issues remain open until
merge. Each package fix has a patch changeset.

Final aggregate coverage and all-core mutation proof are unfinished. Prior
results remain under their original source and selection scope; no current
aggregate score or equivalence claim is made. The reviewer definition and
contribution policy are present. Passing the complete suite does not replace
the unfinished aggregate proof. Opus 5.5's quick static review supports the
public test approach and flags audit-based selection and custom lockfile
handling as maintenance costs; those optional simplifications are separate work.

See `final-summary.json`, `removal-final.jsonl`, and the frozen baseline/inventory
for counts, removed requirements and evidence limits. No push, merge or release.
