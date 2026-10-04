import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { publishPackage, releaseOptions } from "./publish-npm.mjs";

const manifest = {
  name: "@dicehub/kappa",
  private: false,
  version: "0.5.0-beta.0",
  publishConfig: { access: "public", registry: "https://registry.npmjs.org/" },
};
const env = {
  GITLAB_CI: "true",
  CI_COMMIT_REF_PROTECTED: "true",
  CI_COMMIT_TAG: "@dicehub/kappa@0.5.0-beta.0",
  NPM_TOKEN: "synthetic-test-value",
};

for (const [version, channel] of [
  ["0.5.0", "latest"], ["0.5.0-alpha.1", "alpha"],
  ["0.5.0-beta.0", "beta"], ["1.0.0-rc.2", "rc"],
]) {
  test(`${version} publishes directly to ${channel}`, () => {
    const result = releaseOptions({ ...manifest, version }, { ...env, CI_COMMIT_TAG: `@dicehub/kappa@${version}` });
    assert.equal(result.channel, channel);
    assert.equal(result.args[0], "publish");
    assert.ok(!result.args.includes("stage"));
    assert.equal(result.args[result.args.indexOf("--tag") + 1], channel);
  });
}

for (const [name, overrides] of [
  ["local use", { GITLAB_CI: undefined }],
  ["unprotected tags", { CI_COMMIT_REF_PROTECTED: "false" }],
  ["branch pipelines", { CI_COMMIT_TAG: undefined }],
  ["a different package", { CI_COMMIT_TAG: "@dicehub/other@0.5.0-beta.0" }],
  ["a different version", { CI_COMMIT_TAG: "@dicehub/kappa@0.5.0" }],
  ["a missing token", { NPM_TOKEN: " " }],
]) {
  test(`rejects ${name}`, () => {
    assert.throws(() => releaseOptions(manifest, { ...env, ...overrides }));
  });
}

for (const version of ["0.5", "01.5.0", "0.5.0-beta.01", "0.5.0-latest.0", "0.5.0-beta.0+build", "0.5.0\n"]) {
  test(`rejects invalid or unsupported version ${JSON.stringify(version)}`, () => {
    assert.throws(() => releaseOptions({ ...manifest, version }, { ...env, CI_COMMIT_TAG: `@dicehub/kappa@${version}` }));
  });
}

test("rejects private packages and other registries", () => {
  for (const overrides of [
    { private: true }, { name: "@dicehub/other" },
    { publishConfig: { ...manifest.publishConfig, access: "restricted" } },
    { publishConfig: { ...manifest.publishConfig, registry: "https://registry.example.com/" } },
  ]) {
    assert.throws(() => releaseOptions({ ...manifest, ...overrides }, env));
  }
});

const currentManifest = JSON.parse(readFileSync(new URL("../packages/kappa/package.json", import.meta.url), "utf8"));
const currentEnv = { ...env, CI_COMMIT_TAG: `@dicehub/kappa@${currentManifest.version}` };

test("uses npm-scoped authentication without writing the token value", () => {
  let config;
  let command;
  publishPackage({
    env: currentEnv,
    write: (...args) => { config = args; },
    run: (...args) => { command = args; return { status: 0 }; },
  });
  assert.match(config[1], /\/\/registry\.npmjs\.org\/:_authToken=\$\{NPM_TOKEN\}/);
  assert.ok(!config[1].includes(env.NPM_TOKEN));
  assert.equal(config[2].mode, 0o600);
  assert.equal(command[0], "npm");
  assert.equal(command[1][0], "publish");
  assert.ok(!command[1].includes("stage"));
  assert.ok(!command[1].includes("approve"));
  assert.ok(!command[1].includes("--no-git-checks"));
  assert.ok(command[1].includes("--ignore-scripts"));
  assert.match(command[2].cwd, /\/packages\/kappa\/$/);
  assert.equal(command[2].env.NPM_CONFIG_USERCONFIG, config[0]);
});

test("does not write authentication or publish when validation fails", () => {
  assert.throws(() => publishPackage({ env: {}, write: () => assert.fail("write"), run: () => assert.fail("publish") }));
});

test("fails if the publishing command fails", () => {
  for (const result of [{ status: 1 }, { status: null, error: new Error("process failed") }]) {
    assert.throws(() => publishPackage({ env: currentEnv, write() {}, run: () => result }), /npm publishing failed/);
  }
});
