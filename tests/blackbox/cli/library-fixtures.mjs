import { cp, mkdir, mkdtemp, readdir, realpath, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { repository } from "./fixtures.mjs";

export async function libraryFixture() {
  const directory = await mkdtemp(join(tmpdir(), "kappa-build-blackbox-"));
  const library = join(directory, "packages/kappa");
  await mkdir(library, { recursive: true });
  for (const entry of ["package.json", "pnpm-workspace.yaml", "tsconfig.base.json", "LICENSE"]) {
    await cp(join(repository, entry), join(directory, entry));
  }
  for (const entry of ["src", "scripts", "licenses", "package.json", "vite.config.ts", "tsconfig.json", "tsconfig.build.json"]) {
    await cp(join(repository, "packages/kappa", entry), join(library, entry), { recursive: true });
  }
  // Use actual installed tools and dependencies. Never mutate their shared inodes.
  async function linkDependencies(source, target) {
    await mkdir(target, { recursive: true });
    for (const entry of await readdir(source, { withFileTypes: true })) {
      if (entry.name.startsWith(".") && ![".bin", ".pnpm"].includes(entry.name)) continue;
      if (entry.isFile()) await cp(join(source, entry.name), join(target, entry.name));
      else await symlink(join(source, entry.name), join(target, entry.name));
    }
  }
  await linkDependencies(join(repository, "node_modules"), join(directory, "node_modules"));
  const modules = join(library, "node_modules");
  await mkdir(modules);
  for (const entry of await readdir(join(repository, "packages/kappa/node_modules"), { withFileTypes: true })) {
    if (entry.name.startsWith(".") && ![".bin", ".pnpm"].includes(entry.name)) continue;
    const source = join(repository, "packages/kappa/node_modules", entry.name);
    if (entry.name === "@ark-ui") {
      await mkdir(join(modules, entry.name));
      const installed = await realpath(join(source, "vue"));
      const copy = join(modules, "@ark-ui/vue");
      await cp(installed, copy, { recursive: true });
      await linkDependencies(dirname(dirname(installed)), join(copy, "node_modules"));
    } else await symlink(source, join(modules, entry.name));
  }
  return { directory, library, ark: join(modules, "@ark-ui/vue") };
}
