# @dicehub/kappa

Vue components and application blocks for dicehub products. Kappa is ESM-only.

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

## License

Kappa is available under the [MIT license](LICENSE), copyright 2026 dicehub GmbH.
Adapted Kumo source and third-party dependencies keep their original copyrights
and licenses; see
[third-party notices](THIRD_PARTY_NOTICES.md).

The exported `DicehubLogo` brand artwork is excluded from the MIT grant;
its component code remains MIT. The MIT license does not grant trademark rights.
