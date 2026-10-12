import { randomUUID } from "node:crypto";

export const envelope = (result, status = 200, error = "Not found") => ({ status, body: { success: status < 400, result, errors: status >= 400 ? [{ message: error }] : [] } });

export function cloudflareService() {
  const state = {
    projects: [], domains: [], records: [], providers: [], apps: [], policies: {}, deployments: [],
    writes: 0, domainChecks: 0, activateAfter: 0, error: null,
  };
  const collection = (items, request, tail) => {
    if (request.method === "GET") return envelope(tail ? items.find(item => item.id === tail) : items);
    const body = JSON.parse(request.body);
    state.writes++;
    if (request.method === "POST") {
      const item = { id: randomUUID(), ...body };
      items.push(item); return envelope(item);
    }
    const index = items.findIndex(item => item.id === tail);
    if (index < 0) return envelope(null, 404);
    items[index] = { ...items[index], ...body };
    return envelope(items[index]);
  };
  const handle = async request => {
    if (state.error) return envelope(null, state.error.status, state.error.message);
    const path = request.url.pathname.split("/").filter(Boolean);
    if (path[2] === "zones") {
      if (path.length === 3) return envelope(request.url.searchParams.get("name") === "example.test" ? [{ id: "test-zone" }] : []);
      if (path[4] === "dns_records") return collection(state.records, request, path[5]);
    }
    if (path[4] === "pages" && path[5] === "projects") {
      if (path.length === 6) return collection(state.projects, request);
      const project = state.projects.find(item => item.name === path[6]);
      if (!project) return envelope(null, 404);
      if (path.length === 7) return envelope(project);
      if (path[7] === "deployments") return envelope(state.deployments);
      if (path[7] === "domains") {
        if (request.method === "POST") return collection(state.domains, request);
        const domain = state.domains.find(item => item.name === path[8]);
        if (!domain) return envelope(null, 404);
        state.domainChecks++;
        if (state.activateAfter && state.domainChecks >= state.activateAfter) domain.status = "active";
        return envelope(domain);
      }
    }
    if (path[4] === "access") {
      if (path[5] === "identity_providers") return collection(state.providers, request);
      if (path[5] === "apps") {
        if (path[7] === "policies") return collection(state.policies[path[6]] ??= [], request, path[8]);
        return collection(state.apps, request, path[6]);
      }
    }
    return envelope(null, 404, "Provider endpoint not implemented");
  };
  return { state, handle };
}
