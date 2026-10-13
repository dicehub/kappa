# Test rework progress

Read when resuming this branch.

The removal and public chart repairs are committed. The complete gate passed
on dh-pc for `c195f5c`. No push or merge has occurred.

- 725 original cases removed; 1,357 total cases remain, including replacements.
- Private Node cases: 744 to 28 approved logic cases.
- 117 original files removed; 13,196 net test lines removed after replacements.
- All retained public regression cases remain. One browser API override remains for
  pending pointer-lock request deduplication; its native replacement is incomplete.
- Unused test helpers and the duplicate-suite runner are removed.
- Four production files remove test-only injection options. Public APIs are unchanged.

The full gate is recorded under `/tmp/kappa-full-gate-yx2h93e_` and
`/tmp/kappa-blackbox-nZlSwq`. Release-state checks, workspace types, the
production build, package validation, changeset status and all 1,357 test cases
passed. Browser cases: 971; failures/errors/skips/cancellations/todo: zero;
browser retries: zero. The previous Inline Copy Text theme case also passed.
Test command: 1,311.73 seconds. Overall gate: 1,549.06 seconds, including the
temporary clone's missing `dev` reference and its recorded setup correction.

Astra Max reviewed the removal and found two missing chart protections.
Public SVG tests now cover series removal and second/year labels, including
daily labels across a real ECharts axis break. Strict fixture types, the
production build, and both cases pass on dh-pc under
`/tmp/kappa-timeseries-regressions-gr1UOL`; no failures, skips, or retries.
The browser inventory is now 971 cases. Astra Max approved these repairs with
no remaining findings. The repairs do not change production code.

The first three deletion batches are `5169573`, `a3c42dd` (records in `9155442`),
and `aad6444`; foundation `1c3595b`. Final removal: `9b42ebd`; chart repairs:
`c195f5c`.
Five approved package fixes and changesets remain, with issues #9, #10, #11,
#13 and #14 open until merge. Docs issue #12 is separate.

Final aggregate coverage/mutation remains unfinished under Ros's revised scope.
Opus 5.5 supports the public checks and real bug fixes. Audit-based selection
and the custom lockfile writer remain optional maintenance work.
The policy and reviewer instructions are in `CONTRIBUTING.md` and `REVIEW.md`. Earlier raw results,
setup failures, full-run failure and timing correction remain preserved on dh-pc
and in the existing audit records. No push, merge or release has occurred.

See `FINAL_REPORT.md` and `final-summary.json` for final counts and limitations.
