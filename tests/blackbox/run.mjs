import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";
import { prepare } from "./prepare.mjs";
import { browserSuite } from "./web.mjs";
import { run } from "./process.mjs";
import { logicSuite } from "./logic.mjs";
import { saveArtifacts } from "./artifacts.mjs";

const root = resolve(import.meta.dirname, "../..");
const scratch = await mkdtemp(join(tmpdir(), "kappa-blackbox-"));
const started = Date.now();
let consumers;
console.log(`Black-box artifacts: ${scratch}`);
try {
  consumers = await prepare(root, scratch);
  console.log(`Packed consumers ready: ${consumers.full}`);
  try {
    await run("node", ["--test", "tests/blackbox/cli/*.test.mjs"], { cwd: root, timeout: 600_000, log: join(scratch, "cli.log") });
    console.log("Real CLI checks: passed.");
  } catch (error) { consumers.failures.push(error); console.error(`Real CLI checks: FAILED; ${scratch}/cli.log`); }
  try {
    await logicSuite(root, scratch); console.log("Approved logic exceptions: passed.");
  }
  catch (error) { consumers.failures.push(error); }
  if (!process.argv.includes("--package-only")) {
    try { await browserSuite(root, scratch, consumers.full, process.argv.slice(2).filter(value => value !== "--")); }
    catch (error) { consumers.failures.push(error); }
  }
  if (consumers.failures.length) throw new AggregateError(consumers.failures, `${consumers.failures.length} check groups failed; ${scratch}`);
} catch (error) {
  const failures = error => error.errors ? error.errors.flatMap(failures) : [error];
  for (const failure of failures(error)) {
    console.error(failure.message);
    if (failure.result?.output) console.error(failure.result.output.split("\n").slice(-40).map(line => line.length > 500 ? `${line.slice(0, 500)}…` : line).join("\n"));
  }
  process.exitCode = 1;
} finally {
  await saveArtifacts(root, scratch, consumers?.full, {
    started: new Date(started).toISOString(),
    secondsIncludingBuildAndInstall: (Date.now() - started) / 1000,
    exitCode: process.exitCode ?? 0,
  });
}
