# Testing

Read when changing public behavior, package exports, test commands, or CI checks.

Use Node and pnpm versions from the repository manifests. Install Chromium with:

```sh
pnpm --filter @dicehub/kappa-docs-astro exec playwright install --with-deps chromium
```

Git and OpenSSL must be available. No service credentials are needed.

```sh
pnpm test            # Public checks and the approved logic cases
pnpm test:blackbox   # Public checks and the approved private logic cases
```

Each command builds and packs Kappa, installs the tarball in separate core and
full consumers, checks declarations, runs real CLI processes, builds the docs,
and tests the browser UI. The consumers use the exact workspace dependency graph
and frozen installs. Core installation excludes the six optional runtime peers.
The production docs build also runs the 34 retained public artifact checks.
Their expected sidecar paths use the released route manifest, without calling
the application's private path mapper. Selected artifact and logic checks must
all pass; skipped, cancelled, or todo cases fail the gate.

The docs check also fetches displayed workspace sources over HTTP and compiles
the copied Vue components against the installed package. Imports must use
public dependencies. Compiler and browser failures are both reported; a failed
source check does not hide browser results.

The browser tests use owned preview servers and per-test HTTP data. They stop
their own processes. Existing local development servers remain available.
The development check uses its own source, dependency files, caches, and build
output. It warms the two measured routes before checking the live session
across `sync` and `build`. Script failures during those commands fail the test;
cold startup and intentional native-navigation cancellations are separate
diagnostics. Production checks still require client-side page transitions.
Cloudflare, npm, GitLab, geocoding, and map-provider responses are controlled at
the network boundary. CLI credentials and package publications are synthetic.
Unlisted external browser requests fail the test.

Reports, logs, failed-test traces, and consumer lock proofs are saved under
`test-results/blackbox/<run>/`. The console also gives the temporary consumer
path for inspection. CI collects these reports. Deployment uses the normal docs
build, which does not contain the test-consumer routes.

For a focused browser run:

```sh
pnpm test:blackbox -- --project=consumer --grep 'controlled'
```

The package, CLI, and logic checks still run. Browser retries are disabled so
the result records the first attempt.

The contribution and adversarial review rules are in
[CONTRIBUTING.md](../CONTRIBUTING.md) and [REVIEW.md](../REVIEW.md).

## Test exceptions

Private tests are limited to non-trivial logic that public tests cannot reliably
check. Two cases in `tests/blackbox/logic/shiki-owner.test.mjs` protect ownership
of real Shiki resources:

- Cleanup disposes an already usable highlighter.
- Cancellation disposes a highlighter delivered later and prevents ready,
  settled, or error state from changing after cancellation.

Rendering checks cannot prove disposal: provider cleanup clears public state
even if the owned resource is not disposed. These cases use real Shiki, its
JavaScript engine, TypeScript grammar, and GitHub Light theme. A nonempty
`codeToHtml` call succeeds before cleanup and reports disposal afterward. Late
delivery uses a promise gate, without a fake highlighter, patched method, or
mock-call assertion. Both cases run through `pnpm test` and `pnpm test:blackbox`.
They protect the private owner's disposal contract; they do not prove that Vue
calls the owner during provider cleanup.

The case "supports whole-field editing, scrubbing, modifiers, rollback, and
cleanup" in `packages/kappa-docs-astro/e2e/number-input-scrubbable.spec.ts`
overrides the pointer-lock API to check that pending requests are not duplicated.
Keep this exception until a native browser test covers the same pending sequence.
