import { createServer } from "node:http";
import { createServer as createTlsServer } from "node:https";
import { connect } from "node:net";
import { once } from "node:events";
import { readFile, mkdir, chmod } from "node:fs/promises";
import { join } from "node:path";
import { run } from "../process.mjs";

export async function providerProxy(directory, handle) {
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const key = join(directory, "key.pem"), cert = join(directory, "cert.pem");
  await run("openssl", ["req", "-x509", "-newkey", "rsa:2048", "-nodes", "-keyout", key, "-out", cert,
    "-days", "1", "-subj", "/CN=kappa-blackbox.local", "-addext", "subjectAltName=DNS:api.cloudflare.com,DNS:registry.npmjs.org"], { log: join(directory, "certificate.log") });
  await chmod(key, 0o600);
  const hosts = new Set(["api.cloudflare.com:443", "registry.npmjs.org:443"]);
  const sockets = new Set();
  const track = server => server.on("connection", socket => { sockets.add(socket); socket.once("close", () => sockets.delete(socket)); });
  const tls = createTlsServer({ key: await readFile(key), cert: await readFile(cert) }, async (request, response) => {
    try {
      if (!hosts.has(`${request.headers.host?.replace(/:443$/, "")}:443`)) throw new Error("Unlisted provider host");
      const chunks = [];
      for await (const chunk of request) chunks.push(chunk);
      const body = Buffer.concat(chunks).toString();
      const result = await handle({ host: request.headers.host, method: request.method, url: new URL(request.url, `https://${request.headers.host}`), headers: request.headers, body });
      response.writeHead(result.status ?? 200, { "Content-Type": "application/json", ...result.headers });
      response.end(typeof result.body === "string" ? result.body : JSON.stringify(result.body));
    } catch (error) { response.writeHead(500).end(JSON.stringify({ error: error.message })); }
  });
  track(tls); tls.listen(0, "127.0.0.1"); await once(tls, "listening");
  const proxy = createServer((_request, response) => response.writeHead(403).end("CONNECT only"));
  track(proxy);
  proxy.on("connect", (request, client, head) => {
    if (!hosts.has(request.url)) { client.end("HTTP/1.1 403 Forbidden\r\n\r\n"); return; }
    const upstream = connect(tls.address().port, "127.0.0.1", () => {
      client.write("HTTP/1.1 200 Connection Established\r\n\r\n");
      if (head.length) upstream.write(head);
      client.pipe(upstream); upstream.pipe(client);
    });
    sockets.add(upstream);
    upstream.once("close", () => sockets.delete(upstream));
    upstream.on("error", () => client.destroy());
    client.on("error", () => upstream.destroy());
    client.once("close", () => upstream.destroy());
  });
  proxy.listen(0, "127.0.0.1"); await once(proxy, "listening");
  const url = `http://127.0.0.1:${proxy.address().port}`;
  return {
    env: {
      NODE_USE_ENV_PROXY: "1", NODE_EXTRA_CA_CERTS: cert,
      HTTPS_PROXY: url, HTTP_PROXY: url, https_proxy: url, http_proxy: url, NO_PROXY: "127.0.0.1,localhost", no_proxy: "127.0.0.1,localhost",
      npm_config_proxy: url, npm_config_https_proxy: url, npm_config_cafile: cert, npm_config_fetch_retries: "0",
    },
    close: async () => {
      const closed = [once(proxy, "close"), once(tls, "close")];
      proxy.close(); tls.close();
      for (const socket of sockets) socket.destroy();
      await Promise.all(closed);
    },
  };
}
