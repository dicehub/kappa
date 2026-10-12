# Approved lifecycle exceptions

Read when deciding whether to retain private tests after the black-box conversion.

Status: Ros approved both cases on 11 October 2026. Original tests remain unchanged.

Retain two small state-machine cases as KEEP-LOGIC:

| Original group | Contract |
| --- | --- |
| `shiki-lifecycle.test.mjs:28` | Cleanup disposes an already usable owned highlighter. |
| `shiki-lifecycle.test.mjs:54` | Cancellation disposes a resource delivered later and prevents ready/settled state changes. |

Kappa's public highlighter API exposes generated HTML, readiness, errors, and
labels. Provider cleanup clears that public state even if the owned resource's
disposal is missing. A rendering assertion therefore does not prove disposal.
No reliable public resource-release oracle has been established.

The cases use a fresh real Shiki highlighter, its JavaScript engine,
TypeScript grammar, and GitHub Light theme. The same nonempty `codeToHtml` call
must succeed before cleanup and report disposal afterward. The late case holds
delivery of the real resource with a promise gate. It uses no fake highlighter,
patched method, collaborator call count, or object-identity assertion. Test-owned
cleanup runs after the oracle.

The corrected dh-pc prototype passes both cases. Disposal is checked after the
first cleanup, and readiness and settlement have separate assertions. Removing either disposal operation in an
isolated source copy makes its corresponding case fail with a missing expected
disposal error. The original helper and tests are unchanged.

These cases protect the private owner's contract. They do not prove Vue still
invokes that owner on provider cleanup. Keep that integration limit explicit.
The third creation-error group has public language-download failure and recovery
checks. Both pass with real Shiki. The stale-error fault fails the new public
assertion while the old test survives; Astra approved that scoped proof in
`mutation-public-gaps.json`. The remaining deletion gates stay open; this group
is not a private logic exception.

The private logic allowance increases from 26 to 28 groups, about
1.8% of the original declared groups. The real-resource cases live in
`tests/blackbox/logic/shiki-owner.test.mjs` and run in both test commands.
Replace the two fake-resource cases only
in the planned deletion batch after the remaining proof gates pass.
