# Contributing

Read when adding behavior, fixing a bug, or changing tests.

Use the Node and pnpm versions declared by the repository. Follow the public API
and styling conventions in [AGENTS.md](AGENTS.md). Use declared package exports
across packages. Update usage documentation and add a changeset for a user-visible
change to `@dicehub/kappa`; test and docs-only work does not need a changeset.

New behavior needs a black-box test. Test the installed package, public props,
slots and events, browser UI, HTTP output, or actual CLI commands. State the result
a user needs. Tests must remain valid when the internals are rewritten.

Use real dependencies. Simulate services outside our control only at the network
boundary. Do not inject fake collaborators into production code or assert that a
mocked internal function was called. Observing a documented public event is valid.

Keep private unit tests to non-trivial logic that types cannot protect and that
is hard to reach through a public interface. Record the KEEP-LOGIC reason and use
independent invariants or property inputs where useful. Do not test trivial
accessors, private wiring, source spelling, or the same rule the compiler enforces.

For a regression, show a public failure before the fix and a pass after it. When
replacing tests, preserve the behavior inventory, compare coverage and mutation
results, and remove tests in reviewed batches. Never remove a failing test to
obtain a green result. Remove unused helpers only after checking their callers.

Run the suite with `pnpm test`; see [the test guide](docs/TESTING.md) for dependencies,
isolated consumers, reports, and focused commands. Run `pnpm typecheck`, and run
package validation when exports or packed output change. GitLab CI remains the
verification authority.

Use [adversarial review](REVIEW.md) for each behavior change and test deletion
batch. Give the reviewer a fresh context and the public contract, diff, and test
results. Add a public test for every confirmed finding.
