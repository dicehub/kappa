# Test rework progress

Read when resuming this branch.

The requested removal is complete. The latest instruction replaces the earlier
per-area proof order: use saved results, stop new proof work, remove obsolete
tests quickly, then run one final dh-pc check.

- 725 original cases removed; 1,357 total cases remain, including replacements.
- Private Node cases: 744 to 28 approved logic cases.
- 117 original files removed; 13,196 net test lines removed after replacements.
- All retained public regression cases remain. One browser API override remains for
  pending pointer-lock request deduplication; its native replacement is incomplete.
- Unused test helpers and the duplicate-suite runner are removed.
- Four production files remove test-only injection options. Public APIs are unchanged.

The final scoped check passes on dh-pc under `/tmp/kappa-fast-final-IKjNpp`:
actual build/pack, strict consumers/snippets, library types, 28 logic cases,
16 CLI cases, 34 artifacts, both HTTP/compiler cases, and 32 affected browser
cases. Playwright discovers 969 browser cases. It takes about 250 seconds.
Unchanged browser tests reuse prior evidence. Do not claim a new full-browser run.

Astra Max reviewed the removal and found two missing chart protections.
Public SVG tests now cover series removal and second/year labels, including
daily labels across a real ECharts axis break. Strict fixture types, the
production build, and both cases pass on dh-pc under
`/tmp/kappa-timeseries-regressions-gr1UOL`; no failures, skips, or retries.
The browser inventory is now 971 cases. Astra Max approved these repairs with
no remaining findings. The repairs do not change production code.

The first three deletion batches are `5169573`, `a3c42dd` (records in `9155442`),
and `aad6444`; foundation `1c3595b`. The final removal uses one local commit.
Five approved package fixes and changesets remain, with issues #9, #10, #11,
#13 and #14 open until merge. Docs issue #12 is separate.

Final aggregate coverage/mutation and a full final browser run are unfinished.
The policy and reviewer
instructions are in `CONTRIBUTING.md` and `REVIEW.md`. Earlier raw results,
setup failures, full-run failure and timing correction remain preserved on dh-pc
and in the existing audit records. No push, merge or release has occurred.

See `FINAL_REPORT.md` and `final-summary.json` for final counts and limitations.
