---
read_when:
  - Copying or adapting third-party component, documentation, or build code
  - Updating third-party source references or license notices
  - Preparing a public Kappa release
---

# Third-party source and licenses

Kappa's original code and documentation text use MIT, copyright 2026 dicehub
GmbH. Copied or adapted material keeps its upstream copyright and license.
The project license does not replace third-party notices.

## Kumo

Kappa uses [Cloudflare Kumo](https://github.com/cloudflare/kumo) as a reference
and includes adaptations of its component logic, documentation helpers,
and examples. The MIT license is preserved unchanged in
[`packages/kappa/licenses/kumo.LICENSE`](../packages/kappa/licenses/kumo.LICENSE).

The reviewed local reference is commit
`8a8535b0d5fc9d90c37b12aad2b92fe3d092f008`. This records the inspected reference;
it does not claim that every adaptation came from that exact commit.

Confirmed examples include connector geometry in
`packages/kappa/src/components/flow/flow.ts` and the documentation helpers
`packages/kappa-docs-astro/src/lib/html-to-markdown.ts` and
`packages/kappa-docs-astro/src/lib/astro-markdown-pages.ts`.
CodeHighlighted's language loading and highlighter initialization, and Flow
examples, also include Kumo adaptations. These are source origins, not a runtime
dependency on Kumo. Ark UI provides Kappa's component primitives.

## Phosphor Icons

The documentation uses Phosphor CopySimple, Check, and House SVG paths. The
preserved MIT notice comes from `phosphor-icons/react` tag `v2.1.10`, as recorded
in `packages/kappa/licenses/phosphor.LICENSE`. This identifies the reviewed
license version; the original SVG import revision was not recorded.

## Ark UI Vue

Ark UI Vue is a declared external runtime dependency. Its installed package
provides the license notice used by the notice generator. Preserve that exact
notice when updating Ark; current upstream repository wording can differ from
the installed version.

## Maintain notices

Add adapted source to `packages/kappa/scripts/third-party-sources.mjs`. Preserve
the full upstream license in `packages/kappa/licenses/`. Retain per-file notices
when they exist. Record the source revision for new adaptations.

Run `pnpm --filter @dicehub/kappa codegen:licenses` after the library build.
Do not edit `THIRD_PARTY_NOTICES.md` directly. Package validation checks that the
MIT license, adapted-source license files, and full Kumo, Phosphor, and Ark notices reach
the tarball.

The documentation build enables Vite's bundled dependency license output and
publishes it with the project, adapted-source, font, and ECharts `NOTICE`
attribution at `/licenses.txt`. The file also states the project's license scope
and artwork exclusions. Vite does not include separate dependency `NOTICE` files;
preserve those explicitly when adding or updating bundled dependencies.
Both desktop and mobile navigation link to that file. Builds fail if bundled
dependency notices are missing.

Bundled fonts retain their included licenses.

## Artwork and brand assets

Documentation artwork includes the five images in
`packages/kappa-docs-astro/public/avatars/`,
`public/illustrations/aspect-ratio-astronaut.webp`,
`public/images/demos/cropper-field.svg`, and `public/kappa-mark{,-white}.svg`.
The paths beginning with `public/` are relative to the docs package. Brand artwork
also includes the exported `packages/kappa/src/components/dicehub-logo/` artwork.

Artwork and brand assets are excluded from Kappa's MIT grant. Component code
remains MIT. The MIT license does not grant trademark rights. Fonts and
third-party icons keep their own licenses and notices.
