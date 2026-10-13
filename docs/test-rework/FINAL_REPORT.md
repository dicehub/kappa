# Test removal report

Read when reviewing this branch or checking the final suite size.

Ros requested the remaining removals without more mutation or coverage work.
Existing results were reused. One final scoped gate ran on dh-pc and passed.

| Metric | Before | After |
| --- | ---: | ---: |
| All executed/discovered cases | 1,697 | 1,357 |
| Private Node cases | 744 | 28 approved logic cases |
| Test files | 295 | 213 |
| Test code lines | 43,947 | 30,751 |
| Full-suite runtime | 885 seconds | Not repeated |

725 original cases and 117 original files were removed. Public replacements
leave 340 fewer cases overall. Net test code reduction: 13,196 lines, including
new public tests. Final counts include both package installation profiles.

The final check took about 250 seconds: a real build and packed package, strict
core/full/snippet declarations, library types, all 28 logic cases, all 16 CLI
cases, 34 public artifacts, both HTTP/compiler cases and 32 affected browser
cases. That run discovered 969 browser cases. Unchanged browser
tests reuse prior passing results. The earlier full-run timing failure remains
recorded with its assertion-preserving focused correction; this final result
is not a new full-browser pass. Evidence: `/tmp/kappa-fast-final-IKjNpp` on dh-pc.

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
contribution policy are present. The independent review and chart repairs do
not replace the unfinished aggregate proof or a full final browser run.

See `final-summary.json`, `removal-final.jsonl`, and the frozen baseline/inventory
for counts, removed requirements and evidence limits. No push, merge or release.
