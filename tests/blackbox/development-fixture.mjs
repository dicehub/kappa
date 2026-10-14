import { cp, mkdir, mkdtemp, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

export async function developmentFixture(full, { copyLibrary = false } = {}) {
  const directory = await mkdtemp(join(tmpdir(), "kappa-dev-blackbox-"));
  const root = join(directory, "packages/kappa-docs-astro");
  await mkdir(root, { recursive: true });
  for (const name of ["LICENSE", "tsconfig.base.json"]) {
    await cp(resolve(full, "../..", name), join(directory, name));
  }
  const library = resolve(full, "../kappa"), sibling = join(directory, "packages/kappa");
  if (copyLibrary) await cp(library, sibling, { recursive: true });
  else await symlink(library, sibling);
  for (const name of ["src", "public", "package.json", "pnpm-workspace.yaml", "astro.config.mjs", "tsconfig.json"]) {
    await cp(join(full, name), join(root, name), { recursive: true });
  }
  const modules = join(root, "node_modules");
  const sourceModules = join(full, "node_modules");
  await cp(sourceModules, modules, {
    recursive: true, verbatimSymlinks: true,
    filter: source => ![".vite", ".cache", ".astro"].some(name =>
      source === join(sourceModules, name) || source.startsWith(join(sourceModules, name) + "/")),
  });
  // Keep real dependency files inside Vite's serving root; caches and output are owned.
  return root;
}
