---
read_when:
  - Preparing or publishing an @dicehub/kappa release
  - Changing package exports or release CI
---

# Releasing Kappa

Kappa uses Changesets for versions and changelog entries. CI publishes only from a protected package tag.

Check the branches and tags to be published. Scan the final source and build output for secrets.

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
git tag -a '@dicehub/kappa@0.4.0' -m '@dicehub/kappa 0.4.0'
git push origin '@dicehub/kappa@0.4.0'
```

The protected tag pipeline rebuilds and validates the tarball, publishes the package, and creates the release from the matching changelog section.

Package versions are immutable. Never move or reuse a release tag. Publish a follow-up patch for a correction.
