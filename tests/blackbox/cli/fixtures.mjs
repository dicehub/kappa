import { mkdtemp, cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawn } from "node:child_process";

export const repository = resolve(import.meta.dirname, "../../..");
export async function fixture() {
  const directory = await mkdtemp(join(tmpdir(), "kappa-cli-blackbox-"));
  await mkdir(join(directory, "scripts"));
  for (const name of ["cloudflare-pages.mjs", "cloudflare-access.mjs", "publish-npm.mjs", "release-notes.mjs", "check-release-state.mjs", "create-gitlab-release.mjs"]) {
    await cp(join(repository, "scripts", name), join(directory, "scripts", name));
  }
  await mkdir(join(directory, "packages/kappa"), { recursive: true });
  return directory;
}

export async function cli(directory, script, args = [], env = {}) {
  // Provider processes receive synthetic credentials only; no inherited tokens or config.
  const clean = { PATH: process.env.PATH, LANG: "C.UTF-8", TZ: "UTC", ...env };
  if (process.env.NODE_V8_COVERAGE) clean.NODE_V8_COVERAGE = process.env.NODE_V8_COVERAGE;
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [join(directory, "scripts", script), ...args], { cwd: directory, env: clean, stdio: ["ignore", "pipe", "pipe"], detached: true });
    const chunks = [];
    let timedOut = false;
    const timeout = setTimeout(() => {
      timedOut = true;
      try { process.kill(-child.pid, "SIGKILL"); } catch (error) { if (error.code !== "ESRCH") reject(error); }
    }, 30_000);
    child.stdout.on("data", data => chunks.push(data));
    child.stderr.on("data", data => chunks.push(data));
    child.once("error", error => { clearTimeout(timeout); reject(error); });
    child.once("close", code => {
      clearTimeout(timeout);
      if (timedOut) reject(new Error(`CLI timed out: ${script}`));
      else resolve({ code, output: Buffer.concat(chunks).toString() });
    });
  });
}

export async function publicManifest(directory, version = "0.6.0", overrides = {}) {
  const manifest = {
    name: "@dicehub/kappa", version, private: false, license: "MIT", type: "module",
    publishConfig: { access: "public", registry: "https://registry.npmjs.org/" }, ...overrides,
  };
  await writeFile(join(directory, "packages/kappa/package.json"), JSON.stringify(manifest));
  await writeFile(join(directory, "packages/kappa/index.js"), "export const value = 1;\n");
  return manifest;
}
