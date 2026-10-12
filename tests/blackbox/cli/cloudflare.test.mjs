import assert from "node:assert/strict";
import { join } from "node:path";
import { test } from "node:test";
import { fixture, cli } from "./fixtures.mjs";
import { providerProxy } from "./proxy.mjs";
import { cloudflareService } from "./cloudflare-service.mjs";

const env = {
  CLOUDFLARE_ACCOUNT_ID: "synthetic-account", CLOUDFLARE_API_TOKEN: "synthetic-cf-token",
  CLOUDFLARE_PAGES_PROJECT: "kappa-test", CLOUDFLARE_PAGES_BRANCH: "dev", CLOUDFLARE_PAGES_DOMAIN: "docs.example.test",
  ACCESS_APP_DOMAIN: "docs.example.test", ACCESS_ALLOWED_EMAIL_DOMAIN: "example.test", ACCESS_ALLOWED_EMAILS: "maintainer@example.test",
};

async function provider() {
  const directory = await fixture();
  const service = cloudflareService();
  const proxy = await providerProxy(join(directory, "provider"), request => {
    assert.equal(request.headers.authorization, `Bearer ${env.CLOUDFLARE_API_TOKEN}`);
    return service.handle(request);
  });
  return {
    ...service, close: proxy.close,
    pages: (command, overrides = {}) => cli(directory, "cloudflare-pages.mjs", [command], { ...env, ...proxy.env, ...overrides }),
    access: (overrides = {}) => cli(directory, "cloudflare-access.mjs", ["ensure"], { ...env, ...proxy.env, ...overrides }),
  };
}

test("Pages creation, domain attachment and DNS routing are idempotent through the CLI", async () => {
  const service = await provider();
  try {
    for (const command of ["ensure", "domain", "dns"]) {
      const result = await service.pages(command);
      assert.equal(result.code, 0, result.output);
    }
    assert.equal(service.state.projects[0].name, "kappa-test");
    assert.equal(service.state.projects[0].production_branch, "dev");
    assert.equal(service.state.domains[0].name, "docs.example.test");
    assert.equal(service.state.records[0].type, "CNAME");
    assert.equal(service.state.records[0].content, "kappa-test.pages.dev");
    assert.equal(service.state.records[0].proxied, true);
    assert.equal(service.state.records[0].ttl, 1);
    assert.equal(service.state.records[0].comment, "Managed by dicehub-com/projects/kappa-ui GitLab deployment");
    const writes = service.state.writes;
    for (const command of ["ensure", "domain", "dns"]) assert.equal((await service.pages(command)).code, 0);
    assert.equal(service.state.writes, writes);
  } finally { await service.close(); }
});

test("DNS refuses ambiguous routes and changes one existing route safely", async () => {
  const service = await provider();
  try {
    service.state.records = [{ id: "a", name: "docs.example.test", type: "A", content: "192.0.2.1" }, { id: "aaaa", name: "docs.example.test", type: "AAAA", content: "2001:db8::1" }];
    const original = structuredClone(service.state.records);
    const failed = await service.pages("dns");
    assert.notEqual(failed.code, 0);
    assert.match(failed.output, /ambiguous/);
    assert.deepEqual(service.state.records, original);
    service.state.records = [original[0]];
    const repaired = await service.pages("dns");
    assert.equal(repaired.code, 0, repaired.output);
    assert.equal(service.state.records.length, 1);
    assert.equal(service.state.records[0].id, "a");
    assert.equal(service.state.records[0].content, "kappa-test.pages.dev");
  } finally { await service.close(); }
});

test("deployment verification rejects the wrong branch or failed stage; domain polling uses real time", async () => {
  const service = await provider();
  try {
    assert.equal((await service.pages("ensure")).code, 0);
    service.state.deployments = null;
    const malformed = await service.pages("verify");
    assert.notEqual(malformed.code, 0);
    assert.match(malformed.output, /invalid result/);
    service.state.deployments = [{ deployment_trigger: { metadata: { branch: "other" } }, latest_stage: { status: "success" }, url: "https://preview.example.test" }];
    assert.notEqual((await service.pages("verify")).code, 0);
    service.state.deployments[0].deployment_trigger.metadata.branch = "dev";
    service.state.deployments[0].latest_stage = {};
    const incomplete = await service.pages("verify");
    assert.notEqual(incomplete.code, 0);
    assert.match(incomplete.output, /status unknown/);
    service.state.deployments[0].latest_stage.status = "failure";
    assert.notEqual((await service.pages("verify")).code, 0);
    service.state.deployments[0].latest_stage.status = "success";
    assert.equal((await service.pages("verify")).code, 0);
    service.state.domains = [{ name: "docs.example.test", status: "pending" }];
    service.state.activateAfter = 2;
    const active = await service.pages("wait-domain");
    assert.equal(active.code, 0, active.output);
    assert.equal(service.state.domains[0].status, "active");
    service.state.activateAfter = 0;
    service.state.domains[0].status = "error";
    assert.notEqual((await service.pages("wait-domain")).code, 0);
  } finally { await service.close(); }
});

test("Access creates allow rules and migrates internal and preview domains without changing a public app", async () => {
  const service = await provider();
  try {
    const publicApp = { id: "public", domain: "kappa-ui.com", self_hosted_domains: ["kappa-ui.com"] };
    service.state.apps = [publicApp, { id: "internal", domain: "old.example.test", self_hosted_domains: ["old.example.test", "kappa-test.pages.dev", "*.kappa-test.pages.dev"] }];
    const result = await service.access();
    assert.equal(result.code, 0, result.output);
    assert.equal(service.state.apps.length, 2);
    assert.deepEqual(service.state.apps[0], publicApp);
    assert.equal(service.state.apps[1].domain, "docs.example.test");
    assert.equal(service.state.apps[1].name, "dicehub kappa ui");
    assert.equal(service.state.apps[1].type, "self_hosted");
    assert.equal(service.state.apps[1].session_duration, "730h");
    assert.deepEqual(service.state.apps[1].self_hosted_domains, ["docs.example.test", "kappa-test.pages.dev", "*.kappa-test.pages.dev"]);
    assert.equal(service.state.providers[0].type, "onetimepin");
    const policy = service.state.policies.internal[0];
    assert.equal(policy.decision, "allow");
    assert.deepEqual(policy.include, [{ email_domain: { domain: "example.test" } }, { email: { email: "maintainer@example.test" } }]);
    const writes = service.state.writes;
    assert.equal((await service.access()).code, 0);
    assert.equal(service.state.writes, writes);
    service.state.apps = [publicApp, { id: "internal", domain: "old.example.test",
      self_hosted_domains: ["old.example.test", "kappa-test.pages.dev", "*.kappa-test.pages.dev"] }];
    assert.equal((await service.access({ ACCESS_PROTECT_PAGES_PRODUCTION: "false" })).code, 0);
    assert.equal(service.state.apps.length, 2);
    assert.equal(service.state.apps[1].domain, "docs.example.test");
    assert.equal(service.state.apps[1].name, "dicehub kappa ui");
    assert.equal(service.state.apps[1].type, "self_hosted");
    assert.equal(service.state.apps[1].session_duration, "730h");
    assert.deepEqual(service.state.apps[1].self_hosted_domains, ["docs.example.test", "*.kappa-test.pages.dev"]);
    assert.deepEqual(service.state.apps[0], publicApp);
  } finally { await service.close(); }
});

test("CLI rejects invalid setup and redacts provider errors", async () => {
  const service = await provider();
  try {
    for (const override of [{ CLOUDFLARE_API_TOKEN: "" }, { CLOUDFLARE_PAGES_PROJECT: "bad/name" }, { CLOUDFLARE_PAGES_DOMAIN: "https://example.test" }]) {
      assert.notEqual((await service.pages("domain", override)).code, 0);
      assert.equal(service.state.writes, 0);
    }
    assert.notEqual((await service.access({ ACCESS_ALLOWED_EMAILS: "", ACCESS_ALLOWED_EMAIL_DOMAIN: "" })).code, 0);
    service.state.error = { status: 403, message: `Denied ${env.CLOUDFLARE_ACCOUNT_ID} ${env.CLOUDFLARE_API_TOKEN}` };
    const denied = await service.pages("ensure");
    assert.notEqual(denied.code, 0);
    assert.match(denied.output, /\[redacted\]/);
    assert.ok(!denied.output.includes(env.CLOUDFLARE_API_TOKEN));
    assert.ok(!denied.output.includes(env.CLOUDFLARE_ACCOUNT_ID));
  } finally { await service.close(); }
});

test("Access protects a fresh project and updates only its managed allow policy", async () => {
  const service = await provider();
  try {
    const created = await service.access();
    assert.equal(created.code, 0, created.output);
    assert.equal(service.state.apps.length, 1);
    const app = service.state.apps[0];
    assert.equal(app.domain, "docs.example.test");
    assert.equal(app.name, "dicehub kappa ui");
    assert.equal(app.type, "self_hosted");
    assert.equal(app.session_duration, "730h");
    assert.deepEqual(app.self_hosted_domains, ["docs.example.test", "kappa-test.pages.dev", "*.kappa-test.pages.dev"]);
    assert.equal(service.state.policies[app.id][0].decision, "allow");
    assert.equal(service.state.policies[app.id][0].name, "kappa ui allow");
    assert.equal(service.state.policies[app.id][0].precedence, 1);
    const other = { id: "unmanaged", name: "Unrelated policy", decision: "deny", include: [{ everyone: {} }] };
    service.state.policies[app.id].push(other);
    const changed = await service.access({ ACCESS_ALLOWED_EMAILS: "second@example.test", ACCESS_ALLOWED_EMAIL_DOMAIN: "" });
    assert.equal(changed.code, 0, changed.output);
    assert.equal(service.state.policies[app.id].length, 2);
    assert.deepEqual(service.state.policies[app.id][0].include, [{ email: { email: "second@example.test" } }]);
    assert.deepEqual(service.state.policies[app.id][1], other);
    const writes = service.state.writes;
    assert.equal((await service.access({ ACCESS_ALLOWED_EMAILS: "second@example.test", ACCESS_ALLOWED_EMAIL_DOMAIN: "" })).code, 0);
    assert.equal(service.state.writes, writes);
  } finally { await service.close(); }
});
