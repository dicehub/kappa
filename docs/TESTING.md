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

Run this work's checks on dh-pc. Do not run them on Ros's local machine.

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

The duplicate suite has been removed. The contribution and adversarial review
rules are in [CONTRIBUTING.md](../CONTRIBUTING.md) and [REVIEW.md](../REVIEW.md).
The native late-pointer-lock check uses a mounted control's public disabled
state and trusted browser events. Its targeted cleanup fault proof passed. The
retained browser regression still protects pending-request deduplication, which
this case does not replace. Its browser API override remains a documented
exception until a native test covers the same pending sequence. Two real-Shiki ownership cases are approved
private logic exceptions; see [their scope and limits](test-rework/LIFECYCLE_EXCEPTIONS.md).
The final removals reuse existing evidence at Ros's request. The remaining
aggregate coverage and core mutation comparison has not been completed; no new
score is claimed. See [the plan](../TEST_REWORK_PLAN.md) and
[the final removal report](test-rework/FINAL_REPORT.md).
