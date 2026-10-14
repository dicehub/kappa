import assert from "node:assert/strict";
import { cp, mkdir, mkdtemp, readFile, rename, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { repository, cli } from "./fixtures.mjs";
import { run } from "../process.mjs";

async function packageFixture() {
  const directory = await mkdtemp(join(tmpdir(), "kappa-package-cli-"));
  const source = join(repository, "packages/kappa");
  const library = join(directory, "packages/kappa");
  await mkdir(library, { recursive: true });
  for (const name of ["dist", "scripts", "src", "licenses", "package.json", "README.md", "LICENSE", "THIRD_PARTY_NOTICES.md", "CHANGELOG.md"]) {
    await cp(join(source, name), join(library, name), { recursive: true });
  }
  await cp(join(repository, "LICENSE"), join(directory, "LICENSE"));
  const root = JSON.parse(await readFile(join(repository, "package.json"), "utf8"));
  await writeFile(join(directory, "package.json"), JSON.stringify({ private: true, packageManager: root.packageManager, type: "module" }));
  // Actual installed build/validation tools; no replacements or collaborator stubs.
  await symlink(join(source, "node_modules"), join(library, "node_modules"), "dir");
  return { directory, library };
}

const omitted = (library, file) => rename(join(library, file), join(library, "../omitted-license"));

async function mismatchedArchive(library) {
  const file = "licenses/kumo.LICENSE";
  await cp(join(library, file), join(library, "../original-license"));
  await writeFile(join(library, "scripts/license-pack-fixture.mjs"), [
    'import {copyFileSync,writeFileSync} from "node:fs";',
    `if(process.argv[2]==="pack")writeFileSync(${JSON.stringify(file)},"Altered upstream license\\n");`,
    `else copyFileSync("../original-license",${JSON.stringify(file)});`,
  ].join("\n"));
  const path = join(library, "package.json"), manifest = JSON.parse(await readFile(path, "utf8"));
  await writeFile(path, JSON.stringify({ ...manifest, scripts: {
    ...manifest.scripts, prepack: "node scripts/license-pack-fixture.mjs pack", postpack: "node scripts/license-pack-fixture.mjs restore",
  } }));
}

test("the package validation CLI refuses incomplete or altered packed licenses", async () => {
  const cases = [
    { label: "wrong declared license", error: /declare its MIT license/, change: async library => {
      const path = join(library, "package.json"), manifest = JSON.parse(await readFile(path, "utf8"));
      await writeFile(path, JSON.stringify({ ...manifest, license: "UNLICENSED" }));
    } },
    { label: "missing project license", error: /repository MIT license.*unchanged/, change: library => omitted(library, "LICENSE") },
    { label: "changed project license", error: /repository MIT license.*unchanged/, change: library => writeFile(join(library, "LICENSE"), "MIT without copyright\n") },
    { label: "missing declaration license", error: /Ark UI's declaration license.*unchanged/, change: library => omitted(library, "dist/_vendor/ark-ui-vue/LICENSE") },
    { label: "missing notices", error: /include third-party notices/, change: library => omitted(library, "THIRD_PARTY_NOTICES.md") },
    { label: "altered packed upstream bytes", error: /original license.*unchanged/, change: mismatchedArchive },
    ...["licenses/kumo.LICENSE", "licenses/phosphor.LICENSE", "licenses/zag-number-input.LICENSE"].map(file => ({
      label: `missing ${file}`, error: /original license.*unchanged/, change: library => omitted(library, file),
    })),
    ...["licenses/kumo.LICENSE", "licenses/phosphor.LICENSE", "licenses/zag-number-input.LICENSE", "dist/_vendor/ark-ui-vue/LICENSE"].map(file => ({
      label: `notice omits ${file}`, error: /full license/, change: async library => {
        const path = join(library, "THIRD_PARTY_NOTICES.md");
        const content = await readFile(path, "utf8"), license = (await readFile(join(library, file), "utf8")).trim();
        assert.ok(content.includes(license), `${file} must be present before the deliberate fault.`);
        await writeFile(path, content.replaceAll(license, ""));
      },
    })),
  ];
  for (const { label, error, change } of cases) {
    const { directory, library } = await packageFixture();
    await change(library);
    const result = await cli(directory, "../packages/kappa/scripts/validate-package.mjs", [], { KEEP_PACKAGE_VALIDATION: "1" });
    assert.notEqual(result.code, 0, label);
    assert.match(result.output, error, `${label}: ${result.output}`);
  }
});

test("package validation accepts valid declarations and rejects unresolved packed types", async () => {
  const { directory, library } = await packageFixture();
  const accepted = await run(process.execPath, [join(library, "scripts/validate-package.mjs")], {
    cwd: directory, env: { KEEP_PACKAGE_VALIDATION: "1" }, timeout: 120_000,
    log: join(directory, "valid-package.log"),
  });
  assert.match(accepted.output, /Validated core exports without optional peers/);
  assert.match(accepted.output, /Validated all module exports/);
  const manifest = JSON.parse(await readFile(join(library, "package.json"), "utf8"));
  const declaration = join(library, manifest.exports["."].types);
  await writeFile(declaration, (await readFile(declaration, "utf8")) +
    "\nexport type BlackboxBrokenDeclaration = KappaMissingPublicDeclaration;\n");
  const result = await cli(directory, "../packages/kappa/scripts/validate-package.mjs", [], { KEEP_PACKAGE_VALIDATION: "1" });
  assert.notEqual(result.code, 0);
  assert.match(result.output, /Cannot find name 'KappaMissingPublicDeclaration'/);
});
