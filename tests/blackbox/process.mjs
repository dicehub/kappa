import { spawn } from "node:child_process";
import { createWriteStream } from "node:fs";

function ownedProcess(command, args, { cwd, env = {}, log } = {}) {
  const child = spawn(command, args, {
    cwd, env: { ...process.env, ...env }, stdio: ["ignore", "pipe", "pipe"],
    detached: process.platform !== "win32",
  });
  const chunks = [], stream = log ? createWriteStream(log) : null;
  const closed = new Promise(resolve => {
    child.once("error", error => resolve({ code: null, error }));
    child.once("close", (code, signal) => {
      if (stream) stream.end(() => resolve({ code, signal }));
      else resolve({ code, signal });
    });
  });
  for (const pipe of [child.stdout, child.stderr]) pipe.on("data", chunk => {
    chunks.push(chunk);
    if (stream) stream.write(chunk);
    else process.stdout.write(chunk);
  });
  return { child, closed, output: () => Buffer.concat(chunks).toString() };
}

function signalOwned(child, signal) {
  if (!child.pid) return;
  try {
    if (process.platform === "win32") child.kill(signal);
    else process.kill(-child.pid, signal);
  } catch (error) { if (error.code !== "ESRCH") throw error; }
}

async function closeOwned(process) {
  signalOwned(process.child, "SIGTERM");
  const wait = async () => {
    let timer;
    try {
      return await Promise.race([process.closed.then(() => true), new Promise(resolve => {
        timer = setTimeout(() => resolve(false), 1_000);
      })]);
    } finally { clearTimeout(timer); }
  };
  if (await wait()) return;
  // A leader can exit while its descendants keep the inherited pipes open.
  signalOwned(process.child, "SIGKILL");
  if (await wait()) return;
  process.child.stdout.destroy();
  process.child.stderr.destroy();
  process.child.unref();
}

export async function run(command, args, { timeout = 300_000, ...options } = {}) {
  const process = ownedProcess(command, args, options);
  let timedOut = false;
  const timer = setTimeout(() => { timedOut = true; void closeOwned(process); }, timeout);
  const result = { ...await process.closed, output: process.output() };
  clearTimeout(timer);
  if (timedOut || result.code !== 0) {
    throw Object.assign(new Error(`${command} ${timedOut ? "timed out" : `exited ${result.code ?? result.signal}`}; ${options.log ?? "see output"}`), { result });
  }
  return result;
}

export async function start(command, args, { ready, ...options } = {}) {
  const process = ownedProcess(command, args, options);
  let exited = false;
  void process.closed.then(() => { exited = true; });
  let closing;
  let probeError;
  const close = () => closing ??= closeOwned(process);
  const deadline = Date.now() + 30_000;
  try {
    while (Date.now() < deadline) {
      if (exited) throw new Error(`Server exited; ${options.log}`);
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), Math.min(1_000, deadline - Date.now()));
      try {
        const readyResult = await Promise.race([
          ready(controller.signal),
          new Promise(resolve => controller.signal.addEventListener("abort", () => resolve(false), { once: true })),
          process.closed.then(() => false),
        ]);
        if (readyResult && !exited) return { close, child: process.child };
      } catch (error) { probeError = error; }
      finally { clearTimeout(timer); controller.abort(); }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    throw new Error(`Server did not become ready; ${options.log}`, { cause: probeError });
  } catch (error) { await close(); throw error; }
}
