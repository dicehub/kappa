import assert from "node:assert/strict";
import test from "node:test";
import { ensureAccess } from "./cloudflare-access.mjs";

const ENV = {
  CLOUDFLARE_ACCOUNT_ID: "account-1",
  CLOUDFLARE_API_TOKEN: "secret-token",
  CLOUDFLARE_PAGES_PROJECT: "dicehub-kappa-ui",
  ACCESS_APP_DOMAIN: "kappa-ui.dh.fo",
  ACCESS_ALLOWED_EMAIL_DOMAIN: "dicehub.com",
  ACCESS_ALLOWED_EMAILS: "maintainer@example.com",
};

function cloudflareResponse(result) {
  return new Response(JSON.stringify({ success: true, errors: [], result }));
}

test("creates an Access app and allow policy for every Kappa Pages domain", async () => {
  const requests = [];
  const fetchFn = async (url, init = {}) => {
    const parsed = new URL(url);
    requests.push({ init, url: parsed });
    if (parsed.pathname.endsWith("/identity_providers")) {
      return cloudflareResponse([{ id: "otp-1", type: "onetimepin" }]);
    }
    if (parsed.pathname.endsWith("/access/apps") && !init.method) {
      return cloudflareResponse([]);
    }
    if (parsed.pathname.endsWith("/access/apps") && init.method === "POST") {
      return cloudflareResponse({ id: "app-1" });
    }
    if (parsed.pathname.endsWith("/policies") && !init.method) {
      return cloudflareResponse([]);
    }
    if (parsed.pathname.endsWith("/policies") && init.method === "POST") {
      return cloudflareResponse({ id: "policy-1" });
    }
    throw new Error(`Unexpected request: ${init.method ?? "GET"} ${parsed}`);
  };

  await ensureAccess({ env: ENV, fetchFn, logger: { log() {} } });

  const appRequest = requests.find(
    ({ init, url }) => url.pathname.endsWith("/access/apps") && init.method === "POST",
  );
  assert.deepEqual(JSON.parse(appRequest.init.body), {
    name: "dicehub kappa ui",
    type: "self_hosted",
    domain: "kappa-ui.dh.fo",
    self_hosted_domains: [
      "kappa-ui.dh.fo",
      "dicehub-kappa-ui.pages.dev",
      "*.dicehub-kappa-ui.pages.dev",
    ],
    session_duration: "730h",
  });

  const policyRequest = requests.find(
    ({ init, url }) => url.pathname.endsWith("/policies") && init.method === "POST",
  );
  assert.deepEqual(JSON.parse(policyRequest.init.body), {
    name: "kappa ui allow",
    decision: "allow",
    include: [
      { email_domain: { domain: "dicehub.com" } },
      { email: { email: "maintainer@example.com" } },
    ],
    precedence: 1,
  });
});

test("migrates the existing Pages Access app to the canonical custom domain", async () => {
  const requests = [];
  const fetchFn = async (url, init = {}) => {
    const parsed = new URL(url);
    requests.push({ init, url: parsed });
    if (parsed.pathname.endsWith("/identity_providers")) {
      return cloudflareResponse([{ id: "otp-1", type: "onetimepin" }]);
    }
    if (parsed.pathname.endsWith("/access/apps") && !init.method) {
      return cloudflareResponse([
        {
          id: "app-1",
          domain: "kapp-ui.dh.fo",
          self_hosted_domains: [
            "kapp-ui.dh.fo",
            "dicehub-kappa-ui.pages.dev",
            "*.dicehub-kappa-ui.pages.dev",
          ],
        },
      ]);
    }
    if (parsed.pathname.endsWith("/access/apps/app-1") && init.method === "PUT") {
      return cloudflareResponse({ id: "app-1" });
    }
    if (parsed.pathname.endsWith("/policies") && !init.method) {
      return cloudflareResponse([
        {
          id: "policy-1",
          name: "kappa ui allow",
          decision: "allow",
          include: [
            { email_domain: { domain: "dicehub.com" } },
            { email: { email: "maintainer@example.com" } },
          ],
        },
      ]);
    }
    throw new Error(`Unexpected request: ${init.method ?? "GET"} ${parsed}`);
  };

  await ensureAccess({ env: ENV, fetchFn, logger: { log() {} } });

  const createRequest = requests.find(
    ({ init, url }) => url.pathname.endsWith("/access/apps") && init.method === "POST",
  );
  const updateRequest = requests.find(
    ({ init, url }) => url.pathname.endsWith("/access/apps/app-1") && init.method === "PUT",
  );

  assert.equal(createRequest, undefined);
  assert.deepEqual(JSON.parse(updateRequest.init.body), {
    name: "dicehub kappa ui",
    type: "self_hosted",
    domain: "kappa-ui.dh.fo",
    self_hosted_domains: [
      "kappa-ui.dh.fo",
      "dicehub-kappa-ui.pages.dev",
      "*.dicehub-kappa-ui.pages.dev",
    ],
    session_duration: "730h",
  });
});
