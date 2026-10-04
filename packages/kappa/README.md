# @dicehub/kappa

Vue components and application blocks for dicehub products. Kappa is ESM-only.

## Install

Use Vue `^3.5.0` and Node.js `>=24.19.0 <25`. The commands below use pnpm
`10.26.0`.

Install Kappa and Vue from npm:

```bash
pnpm add @dicehub/kappa vue@^3.5.0
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

Kappa imports support strict TypeScript checks with `skipLibCheck: false` and
`moduleResolution: "Bundler"`.

## License

Kappa is available under the [MIT license](LICENSE), copyright 2026 dicehub GmbH.
Adapted Kumo source and third-party dependencies keep their original copyrights
and licenses; see
[third-party notices](THIRD_PARTY_NOTICES.md).

The exported `DicehubLogo` brand artwork is excluded from the MIT grant;
its component code remains MIT. The MIT license does not grant trademark rights.
