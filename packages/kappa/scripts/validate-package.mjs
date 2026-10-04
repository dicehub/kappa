import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import { checkConsumerDeclarations } from "./check-consumer-declarations.mjs";
import { validateLicenses } from "./validate-licenses.mjs";

const packageRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const temporaryRoot = mkdtempSync(join(tmpdir(), "kappa-package-validation-"));

const run = (command, args, options = {}) => {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? packageRoot,
    encoding: "utf8",
    env: { ...process.env, ...options.env },
    maxBuffer: 20 * 1024 * 1024,
  });
  if (result.status !== 0) {
    throw new Error(
      [
        `${command} ${args.join(" ")} failed (status ${result.status ?? "unknown"}).`,
        result.error?.message,
        result.stdout,
        result.stderr,
      ]
        .filter(Boolean)
        .join("\n"),
    );
  }
  return result.stdout.trim();
};

const walk = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });

const publicGroups = (area) =>
  readdirSync(resolve(packageRoot, "src", area), { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(resolve(packageRoot, "src", area, entry.name, "index.ts")))
    .map((entry) => entry.name)
    .sort();

const exportTarget = (exports, subpath, condition) => {
  const exact = exports[subpath];
  if (exact) return typeof exact === "string" ? exact : exact[condition] ?? exact.default;

  for (const [pattern, value] of Object.entries(exports)) {
    if (!pattern.includes("*")) continue;
    const [prefix, suffix] = pattern.split("*");
    if (!subpath.startsWith(prefix) || !subpath.endsWith(suffix)) continue;
    const wildcard = subpath.slice(prefix.length, subpath.length - suffix.length || undefined);
    const target = typeof value === "string" ? value : value[condition] ?? value.default;
    return target?.replaceAll("*", wildcard);
  }
  return null;
};

const assertPackedPath = (packedRoot, target, label) => {
  if (!target?.startsWith("./")) throw new Error(`${label} has no package-relative target.`);
  const path = resolve(packedRoot, target.slice(2));
  if (!existsSync(path)) throw new Error(`${label} is missing from the tarball: ${target}`);
};

const linkDependency = (consumerRoot, name) => {
  const source = resolve(packageRoot, "node_modules", name);
  if (!existsSync(source)) throw new Error(`Installed dependency is missing: ${name}`);
  const destination = resolve(consumerRoot, "node_modules", name);
  mkdirSync(dirname(destination), { recursive: true });
  symlinkSync(source, destination, "dir");
};

try {
  if (!existsSync(resolve(packageRoot, "dist/index.js"))) {
    throw new Error("dist is missing. Run `pnpm --filter @dicehub/kappa build` first.");
  }

  run("pnpm", ["pack", "--pack-destination", temporaryRoot]);
  const tarballName = readdirSync(temporaryRoot).find((entry) => entry.endsWith(".tgz"));
  if (!tarballName) throw new Error("pnpm pack did not create a tarball.");

  const tarballPath = resolve(packageRoot, tarballName);
  const actualTarballPath = existsSync(tarballPath)
    ? tarballPath
    : resolve(temporaryRoot, basename(tarballName));
  const extractedRoot = resolve(temporaryRoot, "extracted");
  mkdirSync(extractedRoot);
  run("tar", ["-xzf", actualTarballPath, "-C", extractedRoot]);

  const packedRoot = resolve(extractedRoot, "package");
  const packedFiles = walk(packedRoot).map((path) => relative(packedRoot, path));
  if (packedFiles.some((path) => path === "src" || path.startsWith("src/"))) {
    throw new Error("The package tarball contains source files.");
  }

  const manifest = JSON.parse(readFileSync(resolve(packedRoot, "package.json"), "utf8"));
  if (manifest.private) throw new Error("The packed package is still private.");
  validateLicenses(manifest, packedRoot, packageRoot);

  const moduleSubpaths = [
    ".",
    "./registry",
    ...publicGroups("blocks").map((name) => `./blocks/${name}`),
    ...publicGroups("components").map((name) => `./components/${name}`),
    "./components/toast/store",
  ];
  for (const subpath of moduleSubpaths) {
    assertPackedPath(packedRoot, exportTarget(manifest.exports, subpath, "import"), `${subpath} import`);
    assertPackedPath(packedRoot, exportTarget(manifest.exports, subpath, "types"), `${subpath} types`);
  }
  for (const subpath of [
    "./registry/component-registry.json",
    "./styles/kappa.css",
    "./styles/theme-kappa.css",
    "./styles/tokens.json",
  ]) {
    assertPackedPath(packedRoot, exportTarget(manifest.exports, subpath, "default"), subpath);
  }

  const optionalModules = new Set([
    "./components/chart", "./components/timeseries-chart", "./components/map-view",
    "./components/xy-plot", "./components/code-highlighted",
  ]);
  for (const full of [false, true]) {
    const consumerRoot = resolve(temporaryRoot, full ? "full-consumer" : "core-consumer");
    const installedPackage = resolve(consumerRoot, "node_modules/@dicehub/kappa");
    mkdirSync(dirname(installedPackage), { recursive: true });
    cpSync(packedRoot, installedPackage, { recursive: true });

    const dependencies = new Set([
      ...Object.keys(manifest.dependencies ?? {}),
      ...Object.keys(manifest.peerDependencies ?? {}).filter((name) => full || !manifest.peerDependenciesMeta?.[name]?.optional),
    ]);
    for (const dependency of dependencies) linkDependency(consumerRoot, dependency);

    mkdirSync(resolve(consumerRoot, "src"), { recursive: true });
    writeFileSync(
      resolve(consumerRoot, "package.json"),
      JSON.stringify({ name: "kappa-packed-consumer", private: true, type: "module" }, null, 2),
    );
    writeFileSync(
      resolve(consumerRoot, "tsconfig.json"),
      JSON.stringify(
        {
          compilerOptions: {
            module: "ESNext",
            moduleResolution: "Bundler",
            noEmit: true,
            resolveJsonModule: true,
            skipLibCheck: false,
            lib: ["ES2022", "DOM", "DOM.Iterable"],
            types: [],
            strict: true,
            target: "ES2022",
          },
          include: ["src"],
        },
        null,
        2,
      ),
    );
    writeFileSync(
      resolve(consumerRoot, "src/exports.ts"),
      moduleSubpaths.filter((subpath) => full || !optionalModules.has(subpath)).map((subpath, index) => `import * as export${index} from "${manifest.name}${subpath === "." ? "" : subpath.slice(1)}";\nvoid export${index};`).join("\n"),
    );
    writeFileSync(
      resolve(consumerRoot, "index.html"),
      '<!doctype html><html><body><div id="app"></div><script type="module" src="/src/main.ts"></script></body></html>\n',
    );
    writeFileSync(
      resolve(consumerRoot, "src/main.ts"),
      [
        'import { Button as RootButton } from "@dicehub/kappa";',
        'import { Button, type ButtonProps } from "@dicehub/kappa/components/button";',
        'import registry from "@dicehub/kappa/registry/component-registry.json";',
        'import "@dicehub/kappa/styles/kappa.css";',
        'import "@dicehub/kappa/styles/theme-kappa.css";',
        'import { createApp, h } from "vue";',
        "",
        'const props: ButtonProps = { variant: "primary" };',
        'if (RootButton !== Button || registry.package.name !== "@dicehub/kappa") throw new Error("invalid package");',
        'createApp({ render: () => h(Button, props, () => "Kappa") }).mount("#app");',
        "",
      ].join("\n"),
    );

    cpSync(resolve(packageRoot, "scripts/fixtures/consumer-types.ts"), resolve(consumerRoot, "src/consumer-types.ts"));
    checkConsumerDeclarations(consumerRoot);
    run("node", [resolve(packageRoot, "node_modules/vite/bin/vite.js"), "build"], { cwd: consumerRoot });

    console.log(`Validated ${full ? "all module exports" : "core exports without optional peers"} with strict declarations and a consumer build.`);
  }
} finally {
  if (process.env.KEEP_PACKAGE_VALIDATION) {
    console.error(`Kept validation files at ${temporaryRoot}`);
  } else {
    rmSync(temporaryRoot, { recursive: true, force: true });
  }
}
