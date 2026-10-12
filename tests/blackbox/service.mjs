import { createServer } from "node:http";
import { randomUUID } from "node:crypto";
import { once } from "node:events";

export async function createService() {
  const cases = new Map();
  const sockets = new Set();
  const server = createServer(async (request, response) => {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    response.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    if (request.method === "OPTIONS") { response.writeHead(204).end(); return; }
    const send = (value, status = 200) => {
      if (!response.destroyed) response.writeHead(status, { "Content-Type": "application/json" }).end(JSON.stringify(value));
    };
    try {
      const url = new URL(request.url, "http://localhost");
      const segments = url.pathname.split("/").filter(Boolean);
      const body = async () => {
        const chunks = [];
        for await (const chunk of request) chunks.push(chunk);
        return JSON.parse(Buffer.concat(chunks).toString() || "{}");
      };
      if (url.pathname === "/cases" && request.method === "POST") {
        const id = randomUUID();
        cases.set(id, { files: {}, holds: [], errors: {}, requests: [], mutations: [], aborted: [], pending: new Map(), ...await body() });
        send({ id }); return;
      }
      const state = cases.get(segments[1]);
      if (segments[0] !== "cases" || !state) { send({ error: "Unknown test case" }, 404); return; }
      if (segments[2] === "control") {
        const control = await body();
        for (const key of ["files", "errors", "holds", "resources"]) if (key in control) state[key] = control[key];
        for (const key of control.release ?? []) {
          state.holds = state.holds.filter(value => value !== key);
          for (const [id, pending] of state.pending) if (pending.key === key) { pending.release(); state.pending.delete(id); }
        }
        send({ ready: true }); return;
      }
      if (segments[2] === "state") {
        send({ requests: state.requests, mutations: state.mutations, aborted: state.aborted, pending: [...state.pending.values()].map(({ key }) => key), files: state.files }); return;
      }
      const folder = url.searchParams.get("folder") ?? "root";
      const operation = segments[2] === "folder" ? "load" : segments[2];
      const key = `${operation}:${folder}`;
      const input = request.method === "POST" ? await body() : null;
      const result = structuredClone(operation === "load" ? state.files[folder] ?? [] : state.resources ?? []);
      const failure = state.errors[key];
      state.requests.push({ key, input });
      if (state.holds.includes(key)) {
        const id = randomUUID();
        await new Promise(resolve => {
          state.pending.set(id, { key, release: resolve });
          response.once("close", () => {
            if (!response.writableEnded) state.aborted.push(key);
            state.pending.delete(id); resolve();
          });
        });
      }
      if (response.destroyed) return;
      if (failure) { send({ error: failure }, 503); return; }
      if (operation === "rename") {
        const item = state.files[folder]?.find(item => item.id === input.id);
        if (!item) { send({ error: "File missing" }, 404); return; }
        item.name = input.name;
      } else if (operation === "create") {
        (state.files[folder] ??= []).push({ id: randomUUID(), kind: "folder", name: input.name });
      }
      if (!["load", "resources"].includes(operation)) state.mutations.push({ key, input });
      send(operation === "load" || operation === "resources" ? result : { saved: true });
    } catch (error) { send({ error: error.message }, 500); }
  });
  server.on("connection", socket => { sockets.add(socket); socket.once("close", () => sockets.delete(socket)); });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  return {
    url: `http://127.0.0.1:${server.address().port}`,
    close: async () => {
      for (const state of cases.values()) for (const pending of state.pending.values()) pending.release();
      const closed = once(server, "close");
      server.close();
      for (const socket of sockets) socket.destroy();
      await closed;
    },
  };
}
