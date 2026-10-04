import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

const registry = "https://registry.npmjs.org/";
const root = fileURLToPath(new URL("../", import.meta.url));
const packageDir = fileURLToPath(new URL("../packages/kappa/", import.meta.url));

export function releaseOptions(manifest, env) {
  if (env.GITLAB_CI !== "true" || env.CI_COMMIT_REF_PROTECTED !== "true") {
    throw new Error("Publish only from a protected GitLab tag pipeline.");
  }
  if (manifest.name !== "@dicehub/kappa" || manifest.private !== false) {
    throw new Error("Expected the public @dicehub/kappa package.");
  }
  if (manifest.publishConfig?.registry !== registry || manifest.publishConfig?.access !== "public") {
    throw new Error("The package must use the public npm registry.");
  }
  const version = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-(alpha|beta|rc)\.(0|[1-9]\d*))?$/.exec(manifest.version);
  if (!version || env.CI_COMMIT_TAG !== `${manifest.name}@${manifest.version}`) {
    throw new Error("The release tag must match the package version (stable, alpha, beta, or rc).");
  }
  if (!env.NPM_TOKEN?.trim()) {
    throw new Error("Set the protected NPM_TOKEN CI variable for npm-production.");
  }
  return {
    channel: version[4] ?? "latest",
    args: [
      "publish", "--access", "public", "--registry", registry,
      "--tag", version[4] ?? "latest", "--ignore-scripts",
    ],
  };
}

export function publishPackage({ env = process.env, run = spawnSync, write = writeFileSync } = {}) {
  const manifest = JSON.parse(readFileSync(`${packageDir}package.json`, "utf8"));
  const { channel, args } = releaseOptions(manifest, env);
  const userconfig = `${root}.npmrc.ci`;
  write(userconfig, `registry=${registry}\n//registry.npmjs.org/:_authToken=\${NPM_TOKEN}\n`, { mode: 0o600 });
  console.log(`Publishing ${manifest.name}@${manifest.version} to npm channel ${channel}.`);
  const result = run("npm", args, {
    cwd: packageDir,
    env: { ...env, NPM_CONFIG_USERCONFIG: userconfig },
    stdio: "inherit",
  });
  if (result.error || result.status !== 0) {
    throw new Error("npm publishing failed. Check the publish log and registry before retrying.");
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    publishPackage();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
