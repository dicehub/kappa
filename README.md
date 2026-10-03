# Kappa UI

Kappa provides Vue 3 components and application blocks for dicehub applications.
The package is ESM-only.

## Install

Use Vue `^3.5.0` and Node.js `>=24.19.0 <25`. The commands below use pnpm
`10.26.0`.

Public npm publication is pending. Build and pack Kappa from the repository root:

```bash
pnpm install
pnpm --filter @dicehub/kappa build
pnpm --filter @dicehub/kappa pack --out dist/kappa.tgz
```

From your Vue project, install the tarball and Vue. Replace the example path with
the absolute path to the generated `dist/kappa.tgz` file:

```bash
pnpm add /path/to/kappa-ui/dist/kappa.tgz vue@^3.5.0
```

## Use

Import the component styles and theme once in your application entry point:

```ts
import "@dicehub/kappa/styles/kappa.css";
import "@dicehub/kappa/styles/theme-kappa.css";
```

Import components from their public modules:

```vue
<script setup lang="ts">
import { Button } from "@dicehub/kappa/components/button";
</script>

<template>
  <Button>Run simulation</Button>
</template>
```

Set `data-kappa-theme="light"` or `data-kappa-theme="dark"` on an ancestor of your
components. Light is the default.

For TypeScript projects, set `skipLibCheck` to `true` in your application's
`tsconfig.json`. Ark UI 5.39.2 has declaration errors that require this setting.

## Documentation

See the [component guides](packages/kappa-docs-astro/src/pages/docs/components/)
and [block guides](packages/kappa-docs-astro/src/pages/docs/blocks/) for APIs and
examples. The [package guide](packages/kappa/README.md) covers package usage.

## License

Kappa source code, examples, and documentation text are available under the
[MIT license](LICENSE), copyright 2026 dicehub GmbH.

Adapted third-party source, dependencies, and bundled fonts keep their own
licenses. See the [third-party notices](packages/kappa/THIRD_PARTY_NOTICES.md),
[font licenses](packages/kappa-docs-astro/public/fonts/), and
[source records](docs/THIRD_PARTY_SOURCES.md).

Documentation artwork under `packages/kappa-docs-astro/public/` and brand artwork,
including the exported `DicehubLogo` artwork, are excluded from Kappa's MIT
license. Component code remains MIT. See the
[artwork license scope](docs/THIRD_PARTY_SOURCES.md#artwork-and-brand-assets).
The MIT license does not grant trademark rights.
