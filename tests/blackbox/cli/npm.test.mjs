import assert from "node:assert/strict";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { test } from "node:test";
import { fixture, cli, publicManifest } from "./fixtures.mjs";
import { providerProxy } from "./proxy.mjs";

const allowed = { GITLAB_CI: "true", CI_COMMIT_REF_PROTECTED: "true", CI_COMMIT_TAG: "@dicehub/kappa@0.6.0", NPM_TOKEN: "synthetic-blackbox-token" };

test("actual npm publishes stable and prerelease tarballs to the intended public channel", async () => {
  for (const [version, channel] of [["0.6.0", "latest"], ["1.2.3", "latest"], ["12.34.56", "latest"], ["123.34.56", "latest"], ["0.7.0-alpha.1", "alpha"], ["0.7.0-beta.0", "beta"], ["0.7.0-beta.2", "beta"], ["0.7.0-beta.12", "beta"], ["0.7.0-rc.3", "rc"]]) {
    const directory = await fixture();
    await publicManifest(directory, version, { scripts: { prepublishOnly: "node publication-hook.mjs" } });
    await writeFile(join(directory, "packages/kappa/publication-hook.mjs"),
      'import { writeFileSync } from "node:fs"; writeFileSync("../../publication-hook-ran", "ran\\n");\n');
    const releases = new Map();
    const proxy = await providerProxy(join(directory, "provider"), async request => {
      assert.equal(request.host, "registry.npmjs.org");
      assert.equal(request.headers.authorization, `Bearer ${allowed.NPM_TOKEN}`);
      if (request.method !== "PUT") return { status: 404, body: { error: "Package not found" } };
      const body = JSON.parse(request.body);
      releases.set(body.name, body);
      return { status: 201, body: { ok: true } };
    });
    try {
      const result = await cli(directory, "publish-npm.mjs", [], {
        ...allowed, ...proxy.env, CI_COMMIT_TAG: `@dicehub/kappa@${version}`, npm_config_cache: join(directory, "npm-cache"), npm_config_globalconfig: join(directory, "empty-global.npmrc"),
      });
      assert.equal(result.code, 0, result.output);
      await assert.rejects(stat(join(directory, "publication-hook-ran")), { code: "ENOENT" });
      assert.ok(!result.output.includes(allowed.NPM_TOKEN), result.output);
      assert.ok(result.output.split("\n").some(line =>
        line.includes("@dicehub/kappa") && line.includes(version) &&
        new RegExp(`\\b${channel}\\b`).test(line.replaceAll(version, ""))),
      "The publication message must identify the version and target channel.");
      const published = releases.get("@dicehub/kappa");
      assert.equal(published["dist-tags"][channel], version);
      assert.equal(published.versions[version].version, version);
      assert.equal(published.versions[version]._id, `@dicehub/kappa@${version}`);
      assert.ok(Object.values(published._attachments).every(attachment => Buffer.from(attachment.data, "base64").length === attachment.length));
      assert.equal((await stat(join(directory, ".npmrc.ci"))).mode & 0o777, 0o600);
      assert.ok((await readFile(join(directory, ".npmrc.ci"), "utf8")).includes("${NPM_TOKEN}"));
      assert.ok(!(await readFile(join(directory, ".npmrc.ci"), "utf8")).includes(allowed.NPM_TOKEN));
    } finally { await proxy.close(); }
  }
});

test("publishing guards reject unsafe CI, manifest, version, registry and token inputs before creating auth files", async () => {
  for (const [manifest, env] of [
    [{}, { GITLAB_CI: "false" }], [{}, { GITLAB_CI: undefined }],
    [{}, { CI_COMMIT_REF_PROTECTED: "false" }], [{}, { CI_COMMIT_TAG: undefined }],
    [{}, { CI_COMMIT_TAG: "@dicehub/other@0.6.0" }],
    [{ private: true }, {}], [{ name: "@other/package" }, {}],
    [{ publishConfig: { access: "restricted", registry: "https://registry.npmjs.org/" } }, {}],
    [{ publishConfig: { access: "public", registry: "https://example.invalid/" } }, {}],
    [{ version: "01.6.0" }, {}], [{ version: "v0.6.0" }, {}],
    [{ version: "0.6.0+build.1" }, {}], [{ version: "0.6.0-preview.1" }, {}],
    ...["0.6", "0.6.0-beta.01", "0.6.0-beta.0+build", "0.6.0-latest.0", "0.6.0\n"].map(version => [{ version }, {}]),
    [{}, { CI_COMMIT_TAG: "@dicehub/kappa@0.5.0" }], [{}, { NPM_TOKEN: " " }],
  ]) {
    const directory = await fixture();
    const actualManifest = await publicManifest(directory, "0.6.0", manifest);
    const requests = [];
    const proxy = await providerProxy(join(directory, "provider"), async request => {
      requests.push(request.url.href);
      return { status: 403, body: { error: "Guard must refuse before publication" } };
    });
    try {
      const result = await cli(directory, "publish-npm.mjs", [], {
        ...allowed, CI_COMMIT_TAG: `${actualManifest.name}@${actualManifest.version}`, ...proxy.env, ...env, npm_config_cache: join(directory, "npm-cache"),
        npm_config_globalconfig: join(directory, "empty-global.npmrc"),
      });
      assert.notEqual(result.code, 0, result.output);
      assert.ok(result.output.trim().length > 0, "A refused publication must report its cause.");
      if (manifest.publishConfig) assert.match(result.output, /public npm registry/i);
      await assert.rejects(stat(join(directory, ".npmrc.ci")), { code: "ENOENT" });
      assert.ok(!result.output.includes(allowed.NPM_TOKEN), result.output);
      assert.deepEqual(requests, []);
    } finally { await proxy.close(); }
  }
});

test("registry rejection and an unavailable npm executable both fail publication", async () => {
  const directory = await fixture();
  await publicManifest(directory);
  const proxy = await providerProxy(join(directory, "provider"), async () => ({ status: 403, body: { error: "Publication refused" } }));
  try {
    const result = await cli(directory, "publish-npm.mjs", [], { ...allowed, ...proxy.env, npm_config_cache: join(directory, "npm-cache") });
    assert.notEqual(result.code, 0);
    assert.match(result.output, /npm publishing failed/);
    assert.match(result.output, /Publication refused/);
    assert.ok(!result.output.includes(allowed.NPM_TOKEN));
  } finally { await proxy.close(); }

  const unavailable = await fixture();
  await publicManifest(unavailable);
  const emptyPath = join(unavailable, "empty-bin");
  await mkdir(emptyPath);
  const missing = await cli(unavailable, "publish-npm.mjs", [], { ...allowed, PATH: emptyPath });
  assert.notEqual(missing.code, 0);
  assert.match(missing.output, /npm publishing failed/);
  assert.ok(!missing.output.includes(allowed.NPM_TOKEN));
});
