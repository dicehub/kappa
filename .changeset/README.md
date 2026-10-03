# Changesets

Changesets record release intent for the published `@dicehub/kappa` package. The private docs package is not
versioned or tagged.

The docs package is ignored. Changesets update the library version and changelog.

## Add A Changeset

For public package changes, run:

```sh
pnpm changeset
```

Select `@dicehub/kappa`, choose the SemVer bump, and write a concise user-facing summary:

- `patch`: backward-compatible fixes and refinements
- `minor`: new backward-compatible components, props, exports, or behavior
- `major`: breaking API, token, styling, or behavior changes

Commit the generated Markdown file with the implementation. Docs-only, test-only, and internal tooling changes
do not need a changeset unless they alter the published package.

## Inspect Pending Releases

Run:

```sh
pnpm changeset:status
```

The verification pipeline runs the same command. It rejects malformed changesets and invalid release plans before
the package build starts.

## Apply Versions

For an explicitly assigned release, maintainers run:

```sh
pnpm version-packages
```

This consumes pending changesets and updates package versions and changelogs.
Publish through the protected tag pipeline described in `docs/RELEASING.md`.
