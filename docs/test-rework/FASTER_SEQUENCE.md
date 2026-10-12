# Batch sequence

Read when approving or applying an earlier test deletion batch.

Status: approved by Ros on 12 October 2026. This amends the proof order in
`TEST_REWORK_PLAN.md`. Other requirements remain in effect. No subagents.

Latest amendment: Ros asked to stop additional test work and complete removals
as quickly as possible. Reuse saved passing results, remove the remaining
implementation and mock tests together, and use one final check on dh-pc.
Keep approved logic, public tests, and the pending pointer-lock regression.
Record unfinished coverage/mutation work without claiming it has passed.

The earlier proof order below describes the first three removal batches.

For each batch:

1. Map every removed requirement to a public test or an approved logic case.
2. Check relevant old-only coverage and fault/mutation evidence. Reuse reviewed
   results only when production and test inputs match.
3. Run the proposed removals in an isolated dh-pc copy. Do not remove failing
   tests or weaken public assertions.
4. Require the complete available gate before its commit. Use affected checks
   during preparation; repeat broader checks only when a change or failure
   requires them.
5. Apply with `trash` and one Conventional Commit. Record removed counts and
   any production seam removal. Do not merge or publish.

The first batch removes 94 export/type test definitions from 83 mixed files,
about 1,608 test lines. All other groups and production code stay in place.
Reviewable patch: `/tmp/kappa-type-batch-proposal/deletion.patch`.
Selection: `replacement-batch-1.jsonl`. Public replacements use frozen released
export/constant/compound contracts and strict installed-package consumers,
plus the linked runtime defaults. Exact executed-case counts are checked on
dh-pc; declared definitions and runtime cases can differ.

The original plan says: “Do not delete existing tests until the coverage and
mutation proof passes.” The approved amendment applies that proof to each
batch. Keep unresolved groups until their own evidence passes.
