---
read_when:
  - Preparing or publishing an @dicehub/kappa release
  - Changing package exports or release CI
---

# Releasing Kappa

Kappa uses Changesets for versions and changelog entries. GitLab CI publishes to
public npm only from a protected package tag. The GitLab repository stays private;
GitHub is the public source mirror.

Check the branches and tags to be published. Scan the final source and build output for secrets.

## CI setup

- Protect tags that match `@dicehub/kappa@*`. Allow Maintainers to create them.
- Store a granular npm token as `NPM_TOKEN`: masked, protected, variable expansion
  off, and available to the `npm-production` environment. An inherited group
  variable with scope `*` also works.
- The token needs Read and write permission for Kappa and **Bypass 2FA** enabled.
  Before the first release, it needs permission to create the package in
  `@dicehub`. Keep account 2FA enabled. The package publishing policy must allow
  granular tokens with bypass 2FA.
- Releases publish directly after verification; no separate npm approval is
  required. The upload job uses npm CLI 12.2.0. pnpm handles dependencies, builds,
  and package validation.

This token workflow is temporary. npm targets **January 2027** for removing direct
publishing through bypass-2FA tokens. Replace it before that change takes effect;
see the [npm announcement](https://github.blog/changelog/2026-09-18-stage-only-npm-tokens-for-safer-automation/).

## Prepare the version

1. Start from an up-to-date `dev` branch.
2. Confirm that each user-visible package change has a changeset. Check that the root and package `LICENSE` files match and the package declares `MIT`; package validation checks the license and full upstream notices in the tarball. See [third-party sources](THIRD_PARTY_SOURCES.md) when source origins change.
3. Create a release branch and run `pnpm version-packages`.
4. Run `pnpm --filter @dicehub/kappa codegen:registry` after the version changes.
5. Run the full gate:

   ```bash
   pnpm typecheck
   pnpm build
   pnpm --filter @dicehub/kappa validate:package
   pnpm test
   ```

6. Review the package version and `packages/kappa/CHANGELOG.md`. Merge the release MR into `dev` only when CI is green.

Package validation extracts the tarball outside the workspace and checks every
public module with `skipLibCheck: false`. It also builds a consumer application.
The check must pass with only declared dependencies and peers available. Ark UI
5.39.2 has known `__VLS_Slots` and `HighlightChunk` declaration defects. Validation
reports these exact upstream errors and rejects every other diagnostic. Consumers
must currently keep `skipLibCheck: true` until Ark UI fixes its declarations.

## Publish

Create one annotated tag on the merged release commit. The tag and package version must match exactly.

```bash
git switch dev
git pull --ff-only origin dev
git tag -a '@dicehub/kappa@0.4.1' -m '@dicehub/kappa 0.4.1'
git push origin 'refs/tags/@dicehub/kappa@0.4.1'
```

The protected tag pipeline rebuilds and validates the tarball, publishes the
package to npm's `latest` channel, and creates the GitLab release from the matching
changelog section. The tag must contain a stable version (`major.minor.patch`).

After the job succeeds, verify the public package and install it in a consumer
project:

```bash
pnpm view @dicehub/kappa@latest version --registry=https://registry.npmjs.org/
pnpm add @dicehub/kappa vue@^3.5.0
```

If publishing fails, inspect the job log and registry before retrying. Check the
token's package permission, bypass-2FA setting, and the npm package publishing
policy when authentication fails.

Package versions are immutable. Never move or reuse a release tag. Publish a follow-up patch for a correction.
