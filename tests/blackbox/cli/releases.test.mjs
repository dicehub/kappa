import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { test } from "node:test";
import { createServer } from "node:http";
import { once } from "node:events";
import { fixture, cli, publicManifest, repository } from "./fixtures.mjs";
import { run } from "../process.mjs";

test("release notes extract an exact version section and refuse missing versions without output", async () => {
  const directory = await fixture(), changelog = join(directory, "CHANGELOG.md"), output = join(directory, "notes.md");
  const text = "# Package\n\n## 0.6.0-beta.1\n\n### Minor Changes\n\n- Beta only.\n\n## 0.6.0\n\n### Patch Changes\n\n- Exact release.\n\n## 0.5.0\n\n- Older release.\n";
  await writeFile(changelog, text);
  const result = await cli(directory, "release-notes.mjs", ["0.6.0", output, changelog]);
  assert.equal(result.code, 0, result.output);
  assert.equal(await readFile(output, "utf8"), "## 0.6.0\n\n### Patch Changes\n\n- Exact release.\n");
  const rejected = await cli(directory, "release-notes.mjs", ["9.9.9", join(directory, "absent.md"), changelog]);
  assert.notEqual(rejected.code, 0);
  assert.match(rejected.output, /section.*9\.9\.9/i);
  await assert.rejects(readFile(join(directory, "absent.md")), { code: "ENOENT" });
});

async function releaseProject(baseVersion) {
  const directory = await fixture();
  await publicManifest(directory, baseVersion);
  await mkdir(join(directory, ".changeset"));
  await mkdir(join(directory, "packages/kappa/src/registry"), { recursive: true });
  await writeFile(join(directory, "package.json"), JSON.stringify({
    name: "release-consumer", private: true, packageManager: "pnpm@10.26.0", workspaces: ["packages/*"],
    scripts: { "changeset:status": `node ${join(repository, "node_modules/@changesets/cli/bin.js")} status` },
  }));
  await writeFile(join(directory, "pnpm-workspace.yaml"), "packages:\n  - packages/*\n");
  await writeFile(join(directory, ".changeset/config.json"), JSON.stringify({ access: "public", baseBranch: "dev", ignore: [] }));
  const options = { cwd: directory, env: { GIT_CONFIG_GLOBAL: "/dev/null", GIT_CONFIG_NOSYSTEM: "1" }, log: join(directory, "git.log") };
  for (const args of [["init", "-b", "dev"], ["config", "user.name", "Kappa test"], ["config", "user.email", "test@example.invalid"], ["add", "."], ["-c", "commit.gpgsign=false", "commit", "-m", "Initial fixture"], ["tag", "baseline"]]) await run("git", args, options);
  return directory;
}

test("release-state CLI checks real Git versions, registry agreement, notes and pending changesets", async () => {
  for (const [version, registryVersion, changelog, pending, valid] of [
    ["0.6.0", "0.6.0", "## 0.6.0\n\n- Published.\n", false, true],
    ["0.4.9", "0.4.9", "## 0.4.9\n\n- Old.\n", false, false],
    ["0.05.0", "0.05.0", "## 0.05.0\n\n- Same numeric version.\n", false, false],
    ["0.6.0-beta.1", "0.6.0-beta.1", "## 0.6.0-beta.1\n\n- Beta.\n", false, false],
    ["0.6.0", "0.5.0", "## 0.6.0\n\n- Published.\n", false, false],
    ["0.6.0", "0.6.0", "## 0.5.0\n\n- Old.\n", false, false],
    ["0.6.0", "0.6.0", "## 0.6.0\n\n- Published.\n", true, false],
  ]) {
    const directory = await releaseProject("0.5.0");
    await publicManifest(directory, version);
    await writeFile(join(directory, "packages/kappa/src/registry/component-registry.json"), JSON.stringify({ package: { version: registryVersion } }));
    await writeFile(join(directory, "packages/kappa/CHANGELOG.md"), changelog);
    if (pending) await writeFile(join(directory, ".changeset/pending.md"), '---\n"@dicehub/kappa": patch\n---\n\nPending change.\n');
    const result = await cli(directory, "check-release-state.mjs", ["baseline"], { GIT_CONFIG_GLOBAL: "/dev/null" });
    assert.equal(result.code === 0, valid, result.output);
    if (!valid) {
      assert.ok(result.output.includes(pending ? "pending.md" : version), "The error must identify the rejected input.");
      assert.doesNotMatch(result.output, /TypeError:/);
      if (registryVersion !== version) assert.ok(result.output.includes(registryVersion), "The mismatch must identify the registry version.");
      if (version === "0.4.9") assert.ok(result.output.includes("0.5.0"), "The error must identify the base version.");
    }
  }
});

test("unchanged package versions use the actual Changesets command", async () => {
  const directory = await releaseProject("0.6.0");
  const result = await cli(directory, "check-release-state.mjs", ["baseline"], { GIT_CONFIG_GLOBAL: "/dev/null" });
  assert.equal(result.code, 0, result.output);
  await writeFile(join(directory, ".changeset/invalid.md"), '---\n"@missing/package": patch\n---\n\nInvalid package.\n');
  await run("git", ["add", ".changeset/invalid.md"], { cwd: directory, log: join(directory, "git-invalid.log") });
  await run("git", ["-c", "commit.gpgsign=false", "commit", "-m", "Invalid changeset fixture"], { cwd: directory, log: join(directory, "git-invalid.log") });
  const invalid = await cli(directory, "check-release-state.mjs", ["baseline"], { GIT_CONFIG_GLOBAL: "/dev/null" });
  assert.notEqual(invalid.code, 0, invalid.output);
});

test("GitLab release CLI creates and updates a real HTTP resource and refuses the wrong tag", async () => {
  const directory = await fixture(), releases = new Map();
  const server = createServer(async (request, response) => {
    if (request.headers["job-token"] !== "synthetic-job-token") { response.writeHead(403).end(); return; }
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    const body = JSON.parse(Buffer.concat(chunks).toString());
    if (request.method === "POST" && releases.has(body.tag_name)) { response.writeHead(409).end(); return; }
    const tag = request.method === "PUT" ? decodeURIComponent(request.url.split("/").at(-1)) : body.tag_name;
    releases.set(tag, body); response.writeHead(201).end("{}");
  });
  server.listen(0, "127.0.0.1"); await once(server, "listening");
  const notes = join(directory, "notes.md");
  const env = { CI_API_V4_URL: `http://127.0.0.1:${server.address().port}/api/v4`, CI_PROJECT_ID: "42", CI_JOB_TOKEN: "synthetic-job-token", CI_COMMIT_TAG: "@dicehub/kappa@0.6.0", PACKAGE_VERSION: "0.6.0" };
  try {
    await writeFile(notes, "First notes\n");
    assert.equal((await cli(directory, "create-gitlab-release.mjs", [notes], env)).code, 0);
    assert.equal(releases.get(env.CI_COMMIT_TAG).description, "First notes\n");
    await writeFile(notes, "Updated notes\n");
    assert.equal((await cli(directory, "create-gitlab-release.mjs", [notes], env)).code, 0);
    assert.equal(releases.get(env.CI_COMMIT_TAG).description, "Updated notes\n");
    const before = structuredClone([...releases]);
    assert.notEqual((await cli(directory, "create-gitlab-release.mjs", [notes], { ...env, CI_COMMIT_TAG: "wrong" })).code, 0);
    assert.deepEqual([...releases], before);
  } finally { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
});
