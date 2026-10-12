import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { run } from "./process.mjs";

export async function logicSuite(root, scratch) {
  const rows = [];
  for (const name of ["library-a", "library-b", "docs-and-tools"]) {
    rows.push(...(await readFile(join(root, `docs/test-rework/${name}.jsonl`), "utf8")).trim().split("\n").map(line => JSON.parse(line)));
  }
  const groups = rows.filter(row => row.category === "KEEP-LOGIC");
  const files = [...new Set(groups.map(row => row.id.replace(/:\d+$/, "")))];
  const escape = text => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const suiteName = value => {
    try { return JSON.parse(value); } catch { return value.replace(/^'|'$/g, ""); }
  };
  const names = groups.map(row => `${row.suite.length ? row.suite.map(suiteName).join(" ") + " " : ""}${row.behavior}`);
  // These are the approved small private-logic exception, not new wiring tests.
  const result = await run("node", ["--test", "--test-reporter=tap", `--test-name-pattern=^(?:${names.map(escape).join("|")})$`, ...files], {
    cwd: root, log: join(scratch, "logic.log"),
  });
  const count = label => Number(result.output.match(new RegExp(`^# ${label} (\\d+)$`, "m"))?.[1]);
  if (!groups.length || count("tests") !== groups.length || count("pass") !== groups.length ||
    ["fail", "cancelled", "skipped", "todo"].some(label => count(label) !== 0)) {
    throw new Error(`Expected ${groups.length} passing approved logic cases with no omissions. ${scratch}/logic.log`);
  }
  await lifecycleSuite(root, scratch);
}

export async function lifecycleSuite(root, scratch) {
  const result = await run("node", ["--test", "--test-reporter=tap", "tests/blackbox/logic/shiki-owner.test.mjs"], {
    cwd: root, log: join(scratch, "lifecycle-logic.log"),
  });
  const count = label => Number(result.output.match(new RegExp(`^# ${label} (\\d+)$`, "m"))?.[1]);
  if (count("tests") !== 2 || count("pass") !== 2 ||
    ["fail", "cancelled", "skipped", "todo"].some(label => count(label) !== 0)) {
    throw new Error(`Expected two passing approved ownership cases with no omissions. ${scratch}/lifecycle-logic.log`);
  }
}
