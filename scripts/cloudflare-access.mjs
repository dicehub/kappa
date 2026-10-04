// Ensures a Cloudflare Access one-time-PIN application protects Kappa docs,
// including the internal custom domain and preview domains. The Pages production
// domain stays protected unless ACCESS_PROTECT_PAGES_PRODUCTION is "false".
// Idempotent and safe to run after every deployment.
//
// Usage: node scripts/cloudflare-access.mjs ensure

import process from "node:process";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const CLOUDFLARE_API = "https://api.cloudflare.com/client/v4";
const APP_NAME = "dicehub kappa ui";
const POLICY_NAME = "kappa ui allow";
const REQUIRED_ENVIRONMENT = [
  "CLOUDFLARE_ACCOUNT_ID",
  "CLOUDFLARE_API_TOKEN",
  "CLOUDFLARE_PAGES_PROJECT",
  "ACCESS_APP_DOMAIN",
];

function redact(value, secrets) {
  let safe = String(value ?? "");
  for (const secret of secrets) {
    if (secret) safe = safe.replaceAll(secret, "[redacted]");
  }
  return safe;
}

function requiredEnvironment(env) {
  const missing = REQUIRED_ENVIRONMENT.filter((name) => !env[name]?.trim());
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  const domain = env.ACCESS_APP_DOMAIN.trim().toLowerCase();
  const project = env.CLOUDFLARE_PAGES_PROJECT.trim().toLowerCase();
  const emailDomain = env.ACCESS_ALLOWED_EMAIL_DOMAIN?.trim().toLowerCase() || undefined;
  const emails = (env.ACCESS_ALLOWED_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  if (!emailDomain && emails.length === 0) {
    throw new Error("Set ACCESS_ALLOWED_EMAIL_DOMAIN and/or ACCESS_ALLOWED_EMAILS.");
  }

  return {
    accountId: env.CLOUDFLARE_ACCOUNT_ID.trim(),
    apiToken: env.CLOUDFLARE_API_TOKEN.trim(),
    domain,
    emailDomain,
    emails,
    project,
    protectPagesProduction: env.ACCESS_PROTECT_PAGES_PRODUCTION !== "false",
    secrets: [env.CLOUDFLARE_ACCOUNT_ID, env.CLOUDFLARE_API_TOKEN],
  };
}

function apiErrorDetail(payload, fallback) {
  return (
    payload?.errors
      ?.map((error) =>
        error?.code ? `${error.message} (code ${error.code})` : error?.message,
      )
      .filter(Boolean)
      .join("; ") || fallback
  );
}

async function cloudflareRequest({ fetchFn, init, secrets, stage, url }) {
  let response;
  try {
    response = await fetchFn(url, init);
  } catch (error) {
    const detail = redact(error instanceof Error ? error.message : error, secrets);
    throw new Error(`${stage} failed to start: ${detail}`);
  }

  const text = await response.text();
  let payload;
  try {
    payload = text ? JSON.parse(text) : undefined;
  } catch {
    payload = undefined;
  }
  if (!response.ok || payload?.success === false) {
    const detail = redact(
      apiErrorDetail(payload, `Cloudflare API returned HTTP ${response.status}.`),
      secrets,
    );
    const error = new Error(`${stage} failed: ${detail}`);
    error.status = response.status;
    throw error;
  }
  if (payload?.success !== true) {
    throw new Error(`${stage} failed: Cloudflare API returned invalid JSON.`);
  }
  return payload.result;
}

function headers(apiToken) {
  return {
    Authorization: `Bearer ${apiToken}`,
    "Content-Type": "application/json",
  };
}

async function ensureOneTimePin({ accountId, apiToken, fetchFn, logger, secrets }) {
  const base = `${CLOUDFLARE_API}/accounts/${encodeURIComponent(accountId)}`
    + "/access/identity_providers";
  try {
    const providers = await cloudflareRequest({
      fetchFn,
      init: { headers: headers(apiToken) },
      secrets,
      stage: "Access identity provider list",
      url: `${base}?per_page=100`,
    });
    if (Array.isArray(providers) && providers.some((provider) => provider?.type === "onetimepin")) {
      logger.log("Access one-time-PIN login method already enabled.");
      return;
    }
    await cloudflareRequest({
      fetchFn,
      init: {
        method: "POST",
        headers: headers(apiToken),
        body: JSON.stringify({ type: "onetimepin", name: "One-time PIN", config: {} }),
      },
      secrets,
      stage: "Access one-time-PIN creation",
      url: base,
    });
    logger.log("Access one-time-PIN login method created.");
  } catch (error) {
    if (error.status === 403) {
      logger.log(
        "WARNING: token cannot manage identity providers; skipping OTP check. "
          + "Ensure a login method exists in the Zero Trust dashboard.",
      );
      return;
    }
    throw error;
  }
}

function desiredDomains({ domain, project, protectPagesProduction }) {
  return [
    domain,
    ...(protectPagesProduction ? [`${project}.pages.dev`] : []),
    `*.${project}.pages.dev`,
  ];
}

function desiredInclude({ emailDomain, emails }) {
  return [
    ...(emailDomain ? [{ email_domain: { domain: emailDomain } }] : []),
    ...emails.map((email) => ({ email: { email } })),
  ];
}

function sameJson(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function applicationDomains(app) {
  return [app?.domain, ...(app?.self_hosted_domains ?? [])]
    .filter(Boolean)
    .map((value) => String(value).toLowerCase());
}

async function ensureApp({ config, fetchFn, logger }) {
  const { accountId, apiToken, domain, secrets } = config;
  const base = `${CLOUDFLARE_API}/accounts/${encodeURIComponent(accountId)}/access/apps`;
  const apps = await cloudflareRequest({
    fetchFn,
    init: { headers: headers(apiToken) },
    secrets,
    stage: "Access application list",
    url: `${base}?per_page=100`,
  });
  const domains = desiredDomains(config);
  const desiredDomainSet = new Set(domains);
  const existing = (Array.isArray(apps) ? apps : []).find((app) =>
    applicationDomains(app).some((appDomain) => desiredDomainSet.has(appDomain)),
  );
  const body = JSON.stringify({
    name: APP_NAME,
    type: "self_hosted",
    domain,
    self_hosted_domains: domains,
    session_duration: "730h",
  });

  if (!existing) {
    const created = await cloudflareRequest({
      fetchFn,
      init: { method: "POST", headers: headers(apiToken), body },
      secrets,
      stage: "Access application creation",
      url: base,
    });
    logger.log(`Access application created for ${domain} (aud ${created?.aud?.slice(0, 8)}...).`);
    return created;
  }

  const drift = !sameJson(
    [...(existing.self_hosted_domains ?? [])].sort(),
    [...domains].sort(),
  );
  if (drift) {
    const updated = await cloudflareRequest({
      fetchFn,
      init: { method: "PUT", headers: headers(apiToken), body },
      secrets,
      stage: "Access application update",
      url: `${base}/${encodeURIComponent(existing.uid ?? existing.id)}`,
    });
    logger.log(`Access application updated for ${domain}.`);
    return updated;
  }
  logger.log(`Access application for ${domain} already exists.`);
  return existing;
}

async function ensurePolicy({ app, config, fetchFn, logger }) {
  const { accountId, apiToken, secrets } = config;
  const appId = app.uid ?? app.id;
  const base = `${CLOUDFLARE_API}/accounts/${encodeURIComponent(accountId)}`
    + `/access/apps/${encodeURIComponent(appId)}/policies`;
  const policies = await cloudflareRequest({
    fetchFn,
    init: { headers: headers(apiToken) },
    secrets,
    stage: "Access policy list",
    url: `${base}?per_page=100`,
  });
  const include = desiredInclude(config);
  const body = JSON.stringify({
    name: POLICY_NAME,
    decision: "allow",
    include,
    precedence: 1,
  });
  const existing = (Array.isArray(policies) ? policies : []).find(
    (policy) => policy?.name === POLICY_NAME && policy?.decision === "allow",
  );

  if (!existing) {
    await cloudflareRequest({
      fetchFn,
      init: { method: "POST", headers: headers(apiToken), body },
      secrets,
      stage: "Access policy creation",
      url: base,
    });
    logger.log(`Access allow policy created (${include.length} include rule(s)).`);
    return;
  }
  if (!sameJson(existing.include, include)) {
    await cloudflareRequest({
      fetchFn,
      init: { method: "PUT", headers: headers(apiToken), body },
      secrets,
      stage: "Access policy update",
      url: `${base}/${encodeURIComponent(existing.uid ?? existing.id)}`,
    });
    logger.log(`Access allow policy updated (${include.length} include rule(s)).`);
    return;
  }
  logger.log("Access allow policy already up to date.");
}

export async function ensureAccess({
  env = process.env,
  fetchFn = globalThis.fetch,
  logger = console,
} = {}) {
  const config = requiredEnvironment(env);
  const { accountId, apiToken, secrets } = config;
  await ensureOneTimePin({ accountId, apiToken, fetchFn, logger, secrets });
  const app = await ensureApp({ config, fetchFn, logger });
  await ensurePolicy({ app, config, fetchFn, logger });
  logger.log(`Access protection ensured for: ${desiredDomains(config).join(", ")}`);
}

const IS_MAIN = Boolean(
  process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1]),
);

if (IS_MAIN) {
  if (process.argv[2] !== "ensure") {
    console.error("Usage: node scripts/cloudflare-access.mjs ensure");
    process.exitCode = 1;
  } else {
    try {
      await ensureAccess();
    } catch (error) {
      console.error(error instanceof Error ? error.message : "Cloudflare Access setup failed.");
      process.exitCode = 1;
    }
  }
}
