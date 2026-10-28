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
CodeBlock's language loading and highlighter initialization, and Flow
examples, also include Kumo adaptations. These are source origins, not a runtime
dependency on Kumo. Ark UI provides Kappa's component primitives.

## Phosphor Icons

The documentation uses Phosphor Check and House SVG paths. The
preserved MIT notice comes from `phosphor-icons/react` tag `v2.1.10`, as recorded
in `packages/kappa/licenses/phosphor.LICENSE`. This identifies the reviewed
license version; the original SVG import revision was not recorded.

## Ark UI Vue

Ark UI Vue is a declared external runtime dependency. Its installed package
provides the license notice used by the notice generator. Preserve that exact
notice when updating Ark; current upstream repository wording can differ from
the installed version.

The package also includes generated private declarations from Ark UI 5.39.2 for
color-picker, file-upload, listbox, progress, select, slider, and highlight, plus
their declaration dependencies. Kappa restores missing default-slot types and
removes a duplicate type import. `scripts/ark-declarations.mjs` checks the exact
upstream inputs and copies Ark's license beside these declarations. The runtime
continues to use the external Ark package.

The Number Input hook is adapted from Ark UI Vue 5.39.2, commit
`8067ebecca4c222b7ee346a947b1e30f54cc36e7`. It retains Ark's providers, props,
and callbacks. Kappa changes the input synchronization action to run after Vue's
render instead of in a later animation frame, so value changes preserve text
selections. The preserved Ark notice also covers this hook.

## Zag Number Input

The Number Input cursor helpers are adapted from `@zag-js/number-input` 1.43.3,
commit `46f88c089c1dbb0fc681b31172dc5eb8a07eef0d`. The MIT notice is preserved in
`packages/kappa/licenses/zag-number-input.LICENSE` and the generated package notices.
The state machine and all other actions remain part of the external Zag runtime.

## Maintain notices

Add adapted source to `packages/kappa/scripts/third-party-sources.mjs`. Preserve
the full upstream license in `packages/kappa/licenses/`. Retain per-file notices
when they exist. Record the source revision for new adaptations.

Run `pnpm --filter @dicehub/kappa codegen:licenses` after the library build.
Do not edit `THIRD_PARTY_NOTICES.md` directly. Package validation checks that the
MIT license, adapted-source and font license files, and full upstream notices reach
the tarball.

The documentation build enables Vite's bundled dependency license output and
publishes it with the project, adapted-source, font, and ECharts `NOTICE`
attribution at `/licenses.txt`. The file also states the project's license scope
and artwork exclusions. Vite does not include separate dependency `NOTICE` files;
preserve those explicitly when adding or updating bundled dependencies.
Both desktop and mobile navigation link to that file. Builds fail if bundled
dependency notices are missing.

Bundled fonts retain their included licenses.

## Geist

The docs site uses unmodified Geist Variable 1.7.2 from Vercel's
`geist-font` release commit `a73329da8fc62afc917f796555202e4997f79b7c`.
The source record and SHA-256 are in
[`packages/kappa-docs-astro/public/fonts/geist/SOURCE.md`](../packages/kappa-docs-astro/public/fonts/geist/SOURCE.md).
Its SIL Open Font License 1.1 is preserved in
[`packages/kappa-docs-astro/public/fonts/geist/OFL.txt`](../packages/kappa-docs-astro/public/fonts/geist/OFL.txt).
Paneled Workspace uses this existing docs font through `--kappa-font-sans`;
it does not bundle a font.

## GitLab application-shell reference

Paneled Workspace uses an observed signed-in GitLab workspace as a behavior and
layout reference. Kappa's implementation is an original composition of its
public controls. No GitLab code, markup, or assets were copied, so no adapted
source license is required.

## Nunito ExtraBold

`PoweredByDicehub` bundles the unmodified Nunito ExtraBold Latin WOFF2 font from
`@fontsource/nunito` 5.1.1 (`files/nunito-latin-800-normal.woff2`).
The font metadata identifies version 3.602 and weight 800. Its SHA-256 is
`5b6eb685c75677d9dab957b198d7f19ec9a1d34b378fbd440885c080a5ca6b53`.
The upstream project is [Nunito](https://github.com/googlefonts/nunito).
The complete SIL Open Font License 1.1 is preserved in
`packages/kappa/licenses/nunito.LICENSE` and the generated package notices.
The font applies only to the dicehub name in the text badge.

## Artwork and brand assets

Documentation artwork includes the five images in
`packages/kappa-docs-astro/public/avatars/`,
`public/illustrations/aspect-ratio-astronaut.webp`,
`public/images/demos/cropper-field.svg`, and `public/kappa-mark{,-white}.svg`.
The paths beginning with `public/` are relative to the docs package. Brand artwork
also includes the exported `packages/kappa/src/components/dicehub-logo/` artwork.

The horizontal logo uses dicehub's supplied `logo-35-text.svg` (SHA-256
`648935cefa858d0ba26ce3f390c9a64cf9457237c0070664c6627d686b561afa`).
The vertical logo uses the supplied `logo_vertical.svg` (SHA-256
`18954f506c95ee2fb44095708bf72839be6a09633283a2ada1d05291cdaf01d3`).
Their Nunito Bold wordmarks remain outlined SVG artwork, with no font runtime
dependency. The vertical paths use the component's color instead of a fixed
fill. Reference copies in the docs end-to-end fixtures are also brand assets.

Artwork and brand assets are excluded from Kappa's MIT grant. Component code
remains MIT. The MIT license does not grant trademark rights. Fonts and
third-party icons keep their own licenses and notices.
