import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { adaptedSources } from "./third-party-sources.mjs";

export function validateLicenses(manifest, packedRoot, packageRoot) {
  if (manifest.license !== "MIT") throw new Error("The package must declare its MIT license.");

  const assertUnchanged = (packedFile, sourceFile, label) => {
    if (!existsSync(packedFile) || readFileSync(packedFile, "utf8") !== readFileSync(sourceFile, "utf8")) {
      throw new Error(`The package tarball must include ${label} unchanged.`);
    }
  };

  assertUnchanged(
    resolve(packedRoot, "LICENSE"),
    resolve(packageRoot, "../../LICENSE"),
    "the repository MIT license",
  );
  const noticesPath = resolve(packedRoot, "THIRD_PARTY_NOTICES.md");
  if (!existsSync(noticesPath)) throw new Error("The package tarball must include third-party notices.");
  const notices = readFileSync(noticesPath, "utf8");

  for (const { name, licenseFile } of adaptedSources) {
    const sourceFile = resolve(packageRoot, licenseFile);
    assertUnchanged(resolve(packedRoot, licenseFile), sourceFile, `${name}'s original license`);
    if (!notices.includes(readFileSync(sourceFile, "utf8").trim())) {
      throw new Error(`Third-party notices must retain ${name}'s full license.`);
    }
  }

  const arkLicense = readFileSync(resolve(packageRoot, "node_modules/@ark-ui/vue/LICENSE"), "utf8").trim();
  if (!notices.includes(arkLicense)) throw new Error("Third-party notices must retain Ark UI's full license.");
  assertUnchanged(
    resolve(packedRoot, "dist/_vendor/ark-ui-vue/LICENSE"),
    resolve(packageRoot, "node_modules/@ark-ui/vue/LICENSE"),
    "Ark UI's declaration license",
  );
}
