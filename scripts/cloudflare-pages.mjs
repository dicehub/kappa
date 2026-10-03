// Idempotent Cloudflare Pages project, deployment, custom-domain, and DNS helpers.
// Wrangler performs the file upload from .gitlab-ci.yml.
//
// Usage: node scripts/cloudflare-pages.mjs <ensure|verify|domain|dns|wait-domain>

import process from "node:process";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const CLOUDFLARE_API = "https://api.cloudflare.com/client/v4";
const REQUIRED_ENVIRONMENT = [
  "CLOUDFLARE_ACCOUNT_ID",
  "CLOUDFLARE_API_TOKEN",
  "CLOUDFLARE_PAGES_PROJECT",
];
const ROUTING_TYPES = new Set(["A", "AAAA", "CNAME"]);
const DOMAIN_FAILURE_STATUSES = new Set(["blocked", "deactivated", "error"]);

function validHostname(value) {
  const labels = value?.split(".") ?? [];
  return Boolean(
    value &&
      value.length <= 253 &&
      labels.length >= 2 &&
      labels.every((label) =>
        /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/iu.test(label),
      ),
  );
}

function requiredEnvironment(env, { requireDomain = false } = {}) {
  const missing = REQUIRED_ENVIRONMENT.filter((name) => !env[name]?.trim());
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  const project = env.CLOUDFLARE_PAGES_PROJECT.trim().toLowerCase();
  if (!/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/u.test(project)) {
    throw new Error("CLOUDFLARE_PAGES_PROJECT must be a valid Pages project name.");
  }

  const branch = (env.CLOUDFLARE_PAGES_BRANCH || "dev").trim();
  if (!branch || branch.length > 255 || /[\0\r\n]/u.test(branch)) {
    throw new Error("CLOUDFLARE_PAGES_BRANCH must be a valid, non-empty branch name.");
  }

  const domain = env.CLOUDFLARE_PAGES_DOMAIN?.trim().toLowerCase();
  if (requireDomain && !validHostname(domain)) {
    throw new Error("CLOUDFLARE_PAGES_DOMAIN must be a valid hostname.");
  }

  return {
    accountId: env.CLOUDFLARE_ACCOUNT_ID.trim(),
    apiToken: env.CLOUDFLARE_API_TOKEN.trim(),
    branch,
    domain,
    project,
    secrets: REQUIRED_ENVIRONMENT.slice(0, 2).map((name) => env[name]),
    target: `${project}.pages.dev`,
  };
}

function redact(value, secrets) {
  let safe = String(value ?? "");
  for (const secret of secrets) {
    if (secret) safe = safe.replaceAll(secret, "[redacted]");
  }
  return safe;
}

function apiErrorDetail(payload, fallback) {
  return (
    payload?.errors
      ?.map((error) => {
        if (!error?.message) return undefined;
        return error.code ? `${error.message} (code ${error.code})` : error.message;
      })
      .filter(Boolean)
      .join("; ") || fallback
  );
}

async function cloudflareRequest({
  allowNotFound = false,
  fetchFn,
  init,
  secrets,
  stage,
  url,
}) {
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

  if (allowNotFound && response.status === 404) {
    return { notFound: true, result: undefined };
  }
  if (!response.ok || payload?.success === false) {
    const fallback = `Cloudflare API returned HTTP ${response.status}.`;
    throw new Error(
      `${stage} failed: ${redact(apiErrorDetail(payload, fallback), secrets)}`,
    );
  }
  if (payload?.success !== true) {
    throw new Error(`${stage} failed: Cloudflare API returned invalid JSON.`);
  }
  return { notFound: false, result: payload.result };
}

function headers(apiToken) {
  return {
    Authorization: `Bearer ${apiToken}`,
    "Content-Type": "application/json",
  };
}

export async function ensurePagesProject({
  env = process.env,
  fetchFn = globalThis.fetch,
  logger = console,
} = {}) {
  const config = requiredEnvironment(env);
  const { accountId, apiToken, branch, project, secrets } = config;
  const accountPath = `${CLOUDFLARE_API}/accounts/${encodeURIComponent(accountId)}`;
  const projectUrl = `${accountPath}/pages/projects/${encodeURIComponent(project)}`;

  logger.log(`Checking Cloudflare Pages project ${project}...`);
  const checked = await cloudflareRequest({
    allowNotFound: true,
    fetchFn,
    init: { headers: headers(apiToken) },
    secrets,
    stage: "Cloudflare Pages project check",
    url: projectUrl,
  });
  if (!checked.notFound) {
    logger.log(`Cloudflare Pages project ${project} already exists.`);
    return { created: false, project, subdomain: checked.result?.subdomain };
  }

  logger.log(`Creating Cloudflare Pages project ${project}...`);
  const created = await cloudflareRequest({
    fetchFn,
    init: {
      method: "POST",
      headers: headers(apiToken),
      body: JSON.stringify({ name: project, production_branch: branch }),
    },
    secrets,
    stage: "Cloudflare Pages project creation",
    url: `${accountPath}/pages/projects`,
  });
  if (created.result?.subdomain) {
    logger.log(`Cloudflare Pages subdomain: https://${created.result.subdomain}`);
  }
  return { created: true, project, subdomain: created.result?.subdomain };
}

export async function verifyPagesDeployment({
  env = process.env,
  fetchFn = globalThis.fetch,
  logger = console,
} = {}) {
  const config = requiredEnvironment(env);
  const { accountId, apiToken, branch, project, secrets } = config;
  const query = new URLSearchParams({ env: "production" });
  const url = `${CLOUDFLARE_API}/accounts/${encodeURIComponent(accountId)}`
    + `/pages/projects/${encodeURIComponent(project)}/deployments?${query}`;
  const listed = await cloudflareRequest({
    fetchFn,
    init: { headers: headers(apiToken) },
    secrets,
    stage: "Cloudflare Pages deployment verification",
    url,
  });
  const deployments = listed.result;
  if (!Array.isArray(deployments)) {
    throw new Error("Cloudflare Pages deployment verification failed: invalid result.");
  }

  const deployment = deployments.find(
    (item) => item?.deployment_trigger?.metadata?.branch === branch,
  );
  if (!deployment) {
    throw new Error(`Cloudflare Pages deployment verification failed: no ${branch} deployment.`);
  }
  if (deployment.latest_stage?.status !== "success") {
    const status = deployment.latest_stage?.status || "unknown";
    throw new Error(`Cloudflare Pages deployment verification failed: status ${status}.`);
  }

  logger.log(`Cloudflare deployment URL: ${deployment.url}`);
  for (const alias of deployment.aliases ?? []) {
    if (alias.endsWith(".pages.dev")) logger.log(`Cloudflare deployment alias: ${alias}`);
  }
  return deployment;
}

function logDomainDiagnostics(logger, result, secrets) {
  for (const [label, data] of [
    ["validation", result?.validation_data],
    ["verification", result?.verification_data],
  ]) {
    if (data?.status) logger.log(`Cloudflare domain ${label}: ${data.status}`);
    if (data?.error_message) {
      logger.log(
        `Cloudflare domain ${label} error: ${redact(data.error_message, secrets)}`,
      );
    }
  }
}

export async function ensurePagesDomain({
  env = process.env,
  fetchFn = globalThis.fetch,
  logger = console,
} = {}) {
  const config = requiredEnvironment(env, { requireDomain: true });
  const { accountId, apiToken, domain, project, secrets } = config;
  const projectPath = `${CLOUDFLARE_API}/accounts/${encodeURIComponent(accountId)}`
    + `/pages/projects/${encodeURIComponent(project)}`;
  const domainUrl = `${projectPath}/domains/${encodeURIComponent(domain)}`;

  logger.log(`Checking Cloudflare Pages domain ${domain}...`);
  const checked = await cloudflareRequest({
    allowNotFound: true,
    fetchFn,
    init: { headers: headers(apiToken) },
    secrets,
    stage: "Cloudflare Pages domain check",
    url: domainUrl,
  });
  if (!checked.notFound) {
    const status = checked.result?.status ?? "unknown";
    logger.log(`Cloudflare Pages domain ${domain} already exists (${status}).`);
    logDomainDiagnostics(logger, checked.result, secrets);
    return { created: false, domain, status };
  }

  logger.log(`Adding Cloudflare Pages domain ${domain}...`);
  const created = await cloudflareRequest({
    fetchFn,
    init: {
      method: "POST",
      headers: headers(apiToken),
      body: JSON.stringify({ name: domain }),
    },
    secrets,
    stage: "Cloudflare Pages domain creation",
    url: `${projectPath}/domains`,
  });
  logDomainDiagnostics(logger, created.result, secrets);
  return {
    created: true,
    domain,
    status: created.result?.status ?? "unknown",
  };
}

function wait(milliseconds) {
  return new Promise((resolveWait) => setTimeout(resolveWait, milliseconds));
}

export async function waitForPagesDomain({
  env = process.env,
  fetchFn = globalThis.fetch,
  logger = console,
  pollIntervalMs = 5_000,
  timeoutMs = 600_000,
  waitFn = wait,
} = {}) {
  if (!Number.isFinite(pollIntervalMs) || pollIntervalMs <= 0) {
    throw new Error("Cloudflare domain poll interval must be a positive number.");
  }
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    throw new Error("Cloudflare domain timeout must be a positive number.");
  }

  const config = requiredEnvironment(env, { requireDomain: true });
  const { accountId, apiToken, domain, project, secrets } = config;
  const domainUrl = `${CLOUDFLARE_API}/accounts/${encodeURIComponent(accountId)}`
    + `/pages/projects/${encodeURIComponent(project)}/domains/${encodeURIComponent(domain)}`;
  const maxAttempts = Math.ceil(timeoutMs / pollIntervalMs) + 1;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const checked = await cloudflareRequest({
      fetchFn,
      init: { headers: headers(apiToken) },
      secrets,
      stage: "Cloudflare Pages domain activation check",
      url: domainUrl,
    });
    const result = checked.result;
    const status = result?.status ?? "unknown";
    logger.log(`Cloudflare Pages domain ${domain} activation: ${status}.`);
    if (status === "active") {
      logDomainDiagnostics(logger, result, secrets);
      return { domain, status };
    }

    const failureStatus = [
      status,
      result?.validation_data?.status,
      result?.verification_data?.status,
    ].find((candidate) => DOMAIN_FAILURE_STATUSES.has(candidate));
    if (failureStatus) {
      logDomainDiagnostics(logger, result, secrets);
      throw new Error(
        `Cloudflare Pages domain activation failed for ${domain}: ${failureStatus}.`,
      );
    }
    if (attempt === maxAttempts) {
      logDomainDiagnostics(logger, result, secrets);
      throw new Error(
        `Cloudflare Pages domain activation timed out after ${timeoutMs}ms (status ${status}).`,
      );
    }
    await waitFn(pollIntervalMs);
  }

  throw new Error(`Cloudflare Pages domain activation failed for ${domain}.`);
}

function zoneCandidates(domain) {
  const labels = domain.split(".");
  const candidates = [];
  for (let index = 0; index <= labels.length - 2; index += 1) {
    candidates.push(labels.slice(index).join("."));
  }
  return candidates;
}

async function findZone({ accountId, apiToken, domain, fetchFn, secrets }) {
  for (const candidate of zoneCandidates(domain)) {
    for (const scoped of [true, false]) {
      const query = new URLSearchParams({ name: candidate, status: "active" });
      if (scoped) query.set("account.id", accountId);
      const zones = await cloudflareRequest({
        fetchFn,
        init: { headers: headers(apiToken) },
        secrets,
        stage: `Cloudflare zone lookup (${candidate})`,
        url: `${CLOUDFLARE_API}/zones?${query}`,
      });
      if (Array.isArray(zones.result) && zones.result.length === 1 && zones.result[0]?.id) {
        return { id: zones.result[0].id, name: candidate };
      }
    }
  }
  throw new Error(
    `Cloudflare zone lookup failed: no visible active zone for ${domain}; `
      + "verify Zone Read permission and that the zone exists in the account.",
  );
}

export async function connectPagesDomain({
  env = process.env,
  fetchFn = globalThis.fetch,
  logger = console,
} = {}) {
  const config = requiredEnvironment(env, { requireDomain: true });
  const { accountId, apiToken, domain, secrets, target } = config;
  const zone = await findZone({ accountId, apiToken, domain, fetchFn, secrets });
  logger.log(`Cloudflare zone: ${zone.name}`);

  const recordQuery = new URLSearchParams({ name: domain, per_page: "100" });
  const recordsResult = await cloudflareRequest({
    fetchFn,
    init: { headers: headers(apiToken) },
    secrets,
    stage: "Cloudflare record lookup",
    url: `${CLOUDFLARE_API}/zones/${encodeURIComponent(zone.id)}`
      + `/dns_records?${recordQuery}`,
  });
  const records = recordsResult.result;
  if (!Array.isArray(records)) {
    throw new Error("Cloudflare record lookup failed: invalid result.");
  }

  const routes = records.filter(
    (record) => record?.name?.toLowerCase() === domain && ROUTING_TYPES.has(record?.type),
  );
  const desired = routes.find(
    (record) =>
      record.type === "CNAME" &&
      record.content?.replace(/\.$/u, "").toLowerCase() === target,
  );
  if (desired && routes.length === 1) {
    logger.log(`Cloudflare DNS already points ${domain} to ${target}.`);
    return { action: "unchanged", domain, target };
  }
  if (routes.length > 1) {
    const types = routes.map((record) => record.type).join(", ");
    throw new Error(
      `Cloudflare DNS for ${domain} is ambiguous (${types}); refusing to replace mixed records.`,
    );
  }

  const body = JSON.stringify({
    type: "CNAME",
    name: domain,
    content: target,
    proxied: true,
    ttl: 1,
    comment: "Managed by dicehub-com/projects/kappa-ui GitLab deployment",
  });
  const route = routes[0];
  const action = route ? "updated" : "created";
  const url = route
    ? `${CLOUDFLARE_API}/zones/${encodeURIComponent(zone.id)}`
      + `/dns_records/${encodeURIComponent(route.id)}`
    : `${CLOUDFLARE_API}/zones/${encodeURIComponent(zone.id)}/dns_records`;
  await cloudflareRequest({
    fetchFn,
    init: {
      method: route ? "PUT" : "POST",
      headers: headers(apiToken),
      body,
    },
    secrets,
    stage: `Cloudflare record ${action === "updated" ? "update" : "creation"}`,
    url,
  });
  logger.log(`Cloudflare DNS ${action}: ${domain} -> ${target}.`);
  return { action, domain, target };
}

const IS_MAIN = Boolean(
  process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1]),
);

if (IS_MAIN) {
  try {
    const command = process.argv[2];
    if (command === "ensure") await ensurePagesProject();
    else if (command === "verify") await verifyPagesDeployment();
    else if (command === "domain") await ensurePagesDomain();
    else if (command === "dns") await connectPagesDomain();
    else if (command === "wait-domain") await waitForPagesDomain();
    else {
      throw new Error(
        "Usage: node scripts/cloudflare-pages.mjs <ensure|verify|domain|dns|wait-domain>",
      );
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : "Cloudflare deployment failed.");
    process.exitCode = 1;
  }
}
