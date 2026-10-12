import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join } from "node:path";

function importer(content) {
  const result = {};
  let section, name;
  for (const line of content.split("\n")) {
    const group = line.match(/^    (\w+):$/);
    const dependency = line.match(/^      (.*):$/);
    const field = line.match(/^        (specifier|version): (.*)$/);
    if (group) { section = group[1]; result[section] = {}; }
    else if (dependency) { name = dependency[1].replace(/^['"]|['"]$/g, ""); result[section][name] = {}; }
    else if (field) result[section][name][field[1]] = field[2].replace(/^['"]|['"]$/g, "");
    else if (line.trim()) throw new Error(`Unsupported pnpm importer line: ${line}`);
  }
  return result;
}

export async function writeConsumerLock(root, consumer, tarball, fileSpecifier, manifest, libraryManifest) {
  const source = await readFile(join(root, "pnpm-lock.yaml"), "utf8");
  const original = entries(source, "importers");
  const library = importer(original.get("packages/kappa"));
  const sources = [...original.values()].map(importer);
  const locked = (name, specifier) => {
    const candidates = sources.flatMap(value => [value.dependencies?.[name], value.devDependencies?.[name]])
      .filter(value => value?.specifier === specifier);
    const versions = new Set(candidates.map(value => value.version));
    if (versions.size !== 1) throw new Error(`Consumer dependency needs one workspace resolution: ${name} ${specifier}`);
    return candidates[0];
  };
  const direct = {};
  for (const section of ["dependencies", "devDependencies"]) {
    direct[section] = Object.fromEntries(Object.entries(manifest[section]).filter(([name]) => name !== "@dicehub/kappa")
      .map(([name, specifier]) => [name, locked(name, specifier)]));
  }
  const peers = Object.keys(libraryManifest.peerDependencies).sort().filter(name => direct.dependencies[name]);
  const peerSuffix = peers.map(name => `(${name}@${direct.dependencies[name].version})`).join("");
  const packageKey = `${libraryManifest.name}@${fileSpecifier}`;
  const snapshotKey = `${packageKey}${peerSuffix}`;
  direct.dependencies["@dicehub/kappa"] = { specifier: fileSpecifier, version: `${fileSpecifier}${peerSuffix}` };
  const dependencies = Object.fromEntries(Object.keys(libraryManifest.dependencies).map(name => {
    const entry = library.dependencies[name];
    if (entry?.specifier !== libraryManifest.dependencies[name]) throw new Error(`Library lock mismatch: ${name}`);
    return [name, entry.version];
  }));
  const optionalDependencies = {};
  for (const name of peers) {
    (libraryManifest.peerDependenciesMeta?.[name]?.optional ? optionalDependencies : dependencies)[name] = direct.dependencies[name].version;
  }
  const integrity = `sha512-${createHash("sha512").update(await readFile(tarball)).digest("base64")}`;
  const block = (name, value) => `  ${JSON.stringify(name)}:\n${Object.entries(value).map(([key, item]) => `    ${key}: ${JSON.stringify(item)}`).join("\n")}\n\n`;
  const packageEntry = block(packageKey, {
    resolution: { integrity, tarball: fileSpecifier }, version: libraryManifest.version,
    engines: libraryManifest.engines, peerDependencies: libraryManifest.peerDependencies,
    peerDependenciesMeta: libraryManifest.peerDependenciesMeta,
  });
  const snapshot = block(snapshotKey, {
    dependencies, ...(Object.keys(optionalDependencies).length ? { optionalDependencies } : {}),
  });
  const output = source.replace("autoInstallPeers: true", "autoInstallPeers: false")
    .replace(/^importers:\n[\s\S]*?(?=^\S)/m, `importers:\n\n${block(".", direct)}`)
    .replace(/^packages:\n/m, `packages:\n\n${packageEntry}`)
    .replace(/^snapshots:\n/m, `snapshots:\n\n${snapshot}`);
  await writeFile(join(consumer, "pnpm-lock.yaml"), output);
}

// Compare pnpm's serialized entries, including integrity and dependency edges.
// Tarball entries vary with the code under test; all external entries stay fixed.
function entries(text, section) {
  const body = text.match(new RegExp(`^${section}:\\n([\\s\\S]*?)(?=^\\S|(?![\\s\\S]))`, "m"))?.[1];
  if (body === undefined) throw new Error(`Missing pnpm lock section: ${section}`);
  const result = new Map();
  let name, content = [];
  const flush = () => { if (name !== undefined) result.set(name, content.join("\n").trimEnd()); };
  for (const line of body.split("\n")) {
    if (/^  \S/.test(line)) {
      const match = line.match(/^  (\S.*):(?: (\{\}))?$/);
      if (!match) throw new Error(`Unsupported pnpm ${section} entry: ${line}`);
      flush(); name = match[1].replace(/^['"]|['"]$/g, ""); content = match[2] ? [match[2]] : [];
    } else content.push(line);
  }
  flush();
  return result;
}

export async function checkConsumerLock(root, consumer, scratch, profile) {
  const baseline = await readFile(join(root, "pnpm-lock.yaml"), "utf8");
  const derived = await readFile(join(consumer, "pnpm-lock.yaml"), "utf8");
  for (const section of ["packages", "snapshots"]) {
    const required = entries(baseline, section);
    const actual = new Map([...entries(derived, section)].filter(([name]) => !/^@dicehub\/kappa@file:/.test(name)));
    if (actual.size !== required.size) throw new Error(`${profile} consumer ${section} changed its external entry count.`);
    for (const [name, content] of required) {
      if (actual.get(name) !== content) {
        throw new Error(`${profile} consumer dependency drift: ${section} ${name}`);
      }
    }
  }
  await writeFile(join(scratch, `consumer-${profile}-lock-proof.json`), JSON.stringify({
    sourceLockSha256: createHash("sha256").update(baseline).digest("hex"),
    consumerLockSha256: createHash("sha256").update(derived).digest("hex"),
    externalGraphSha256: createHash("sha256").update(JSON.stringify(
      ["packages", "snapshots"].map(section => [...entries(derived, section)]
        .filter(([name]) => !/^@dicehub\/kappa@file:/.test(name))),
    )).digest("hex"),
    externalPackages: entries(derived, "packages").size - 1,
    externalSnapshots: entries(derived, "snapshots").size - 1,
  }, null, 2));
}
