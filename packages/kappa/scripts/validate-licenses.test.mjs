import assert from "node:assert/strict";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { adaptedSources } from "./third-party-sources.mjs";
import { validateLicenses } from "./validate-licenses.mjs";

const packageRoot = fileURLToPath(new URL("..", import.meta.url));
const manifest = { license: "MIT" };

const fixture = (t) => {
  const packedRoot = mkdtempSync(resolve(tmpdir(), "kappa-license-test-"));
  t.after(() => rmSync(packedRoot, { recursive: true, force: true }));
  cpSync(resolve(packageRoot, "../../LICENSE"), resolve(packedRoot, "LICENSE"));
  mkdirSync(resolve(packedRoot, "licenses"));
  const licenses = adaptedSources.map(({ licenseFile }) => {
    cpSync(resolve(packageRoot, licenseFile), resolve(packedRoot, licenseFile));
    return readFileSync(resolve(packageRoot, licenseFile), "utf8").trim();
  });
  licenses.push(readFileSync(resolve(packageRoot, "node_modules/@ark-ui/vue/LICENSE"), "utf8").trim());
  mkdirSync(resolve(packedRoot, "dist/_vendor/ark-ui-vue"), { recursive: true });
  cpSync(resolve(packageRoot, "node_modules/@ark-ui/vue/LICENSE"), resolve(packedRoot, "dist/_vendor/ark-ui-vue/LICENSE"));
  writeFileSync(resolve(packedRoot, "THIRD_PARTY_NOTICES.md"), licenses.join("\n\n"));
  return packedRoot;
};

test("accepts an archive with complete project and upstream licenses", (t) => {
  validateLicenses(manifest, fixture(t), packageRoot);
});

test("rejects a package that still declares UNLICENSED", (t) => {
  assert.throws(() => validateLicenses({ license: "UNLICENSED" }, fixture(t), packageRoot), /declare its MIT license/);
});

test("rejects a missing or changed project license", (t) => {
  const packedRoot = fixture(t);
  rmSync(resolve(packedRoot, "LICENSE"));
  assert.throws(() => validateLicenses(manifest, packedRoot, packageRoot), /repository MIT license unchanged/);
  writeFileSync(resolve(packedRoot, "LICENSE"), "MIT without the copyright notice\n");
  assert.throws(() => validateLicenses(manifest, packedRoot, packageRoot), /repository MIT license unchanged/);
});

test("rejects altered adapted-source license files", (t) => {
  const packedRoot = fixture(t);
  writeFileSync(resolve(packedRoot, adaptedSources[0].licenseFile), "Altered license\n");
  assert.throws(() => validateLicenses(manifest, packedRoot, packageRoot), /Kumo's original license unchanged/);
});

test("rejects a missing license beside the private Ark declarations", (t) => {
  const packedRoot = fixture(t);
  rmSync(resolve(packedRoot, "dist/_vendor/ark-ui-vue/LICENSE"));
  assert.throws(() => validateLicenses(manifest, packedRoot, packageRoot), /Ark UI's declaration license unchanged/);
});

test("rejects notices that omit an upstream copyright or license", (t) => {
  for (const [name, licenseFile] of [
    ...adaptedSources.map(({ name, licenseFile }) => [name, licenseFile]),
    ["Ark UI", "node_modules/@ark-ui/vue/LICENSE"],
  ]) {
    const packedRoot = fixture(t);
    const noticesPath = resolve(packedRoot, "THIRD_PARTY_NOTICES.md");
    const upstreamLicense = readFileSync(resolve(packageRoot, licenseFile), "utf8").trim();
    writeFileSync(noticesPath, readFileSync(noticesPath, "utf8").replace(upstreamLicense, ""));
    assert.throws(() => validateLicenses(manifest, packedRoot, packageRoot), new RegExp(`${name}'s full license`));
  }
});
