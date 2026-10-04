# @dicehub/kappa

## 0.4.2

### Patch Changes

- Fix TypeScript declaration errors when checking Kappa imports with `skipLibCheck: false`. Keep the existing Ark UI runtime and public component API. Optional chart, map, plot, and syntax highlighting packages remain separate imports.

## 0.4.1

### Patch Changes

- 52a7f97: Clarify installation, Vue and Node.js requirements, and the Ark UI TypeScript workaround.
- 52a7f97: License Kappa source code and documentation text under MIT. Include the license and Kumo, Ark UI, and Phosphor notices in the package archive.

## 0.4.0

### Minor Changes

- Initial Kappa code snapshot with Vue 3 components and application blocks, Ark UI primitives, light and dark themes, and TypeScript declarations.
- Code and documentation text use MIT. Adapted source and fonts keep their licenses; artwork is excluded from the MIT grant.
- TypeScript projects require `skipLibCheck: true` with Ark UI 5.39.2 because of upstream declaration errors.
