import { execFileSync, spawnSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { extractReleaseNotes } from "./release-notes.mjs";

const parseVersion = (version) => {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);
  if (!match) throw new Error(`Expected a stable semantic version, received ${version}.`);
  return match.slice(1).map(Number);
};

export const validateVersionedRelease = ({ baseVersion, changelog, currentVersion, registryVersion }) => {
  const base = parseVersion(baseVersion);
  const current = parseVersion(currentVersion);
  const comparison = current.findIndex((part, index) => part !== base[index]);
  if (comparison === -1 || current[comparison] < base[comparison]) {
    throw new Error(`Release version ${currentVersion} must be newer than ${baseVersion}.`);
  }
  if (registryVersion !== currentVersion) {
    throw new Error(`Registry version ${registryVersion} does not match package version ${currentVersion}.`);
  }
  extractReleaseNotes(changelog, currentVersion);
};

const run = () => {
  const baseRef = process.argv[2];
  if (!baseRef) throw new Error("Usage: node scripts/check-release-state.mjs <base-ref>");

  const manifestPath = "packages/kappa/package.json";
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const baseManifest = JSON.parse(
    execFileSync("git", ["show", `${baseRef}:${manifestPath}`], { encoding: "utf8" }),
  );

  if (manifest.version === baseManifest.version) {
    const result = spawnSync("pnpm", ["changeset:status", `--since=${baseRef}`], {
      stdio: "inherit",
    });
    if (result.error) throw result.error;
    process.exitCode = result.status ?? 1;
    return;
  }

  const pendingChangesets = readdirSync(".changeset").filter(
    (name) => name.endsWith(".md") && name !== "README.md",
  );
  if (pendingChangesets.length > 0) {
    throw new Error(`Versioned releases must consume all changesets: ${pendingChangesets.join(", ")}`);
  }

  const registry = JSON.parse(readFileSync("packages/kappa/src/registry/component-registry.json", "utf8"));
  validateVersionedRelease({
    baseVersion: baseManifest.version,
    changelog: readFileSync("packages/kappa/CHANGELOG.md", "utf8"),
    currentVersion: manifest.version,
    registryVersion: registry.package.version,
  });
  console.log(`Validated versioned release ${manifest.name}@${manifest.version}.`);
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) run();
