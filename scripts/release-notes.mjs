import { readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

export const extractReleaseNotes = (changelog, version) => {
  const escapedVersion = version.replaceAll(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const heading = new RegExp(`^## ${escapedVersion}(?:\\s|$)`, "m");
  const match = changelog.match(heading);
  if (!match || match.index === undefined) {
    throw new Error(`CHANGELOG.md has no section for ${version}.`);
  }

  const start = match.index;
  const remainder = changelog.slice(start + match[0].length);
  const nextHeading = remainder.search(/^##\s/m);
  const end = nextHeading === -1 ? changelog.length : start + match[0].length + nextHeading;
  return changelog.slice(start, end).trimEnd() + "\n";
};

const run = () => {
  const [version, outputPath, changelogPath = "packages/kappa/CHANGELOG.md"] = process.argv.slice(2);
  if (!version || !outputPath) {
    throw new Error("Usage: node scripts/release-notes.mjs <version> <output> [changelog]");
  }

  const notes = extractReleaseNotes(readFileSync(changelogPath, "utf8"), version);
  writeFileSync(outputPath, notes);
  console.log(`Prepared release notes for ${version}.`);
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) run();
