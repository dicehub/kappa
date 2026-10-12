import { join } from "node:path";
import { run } from "./process.mjs";
import { lifecycleSuite } from "./logic.mjs";

export async function legacyNodeSuite(root, scratch) {
  const failures = [];
  // Keep deployment artifacts free of the extra consumer fixture routes.
  await run("pnpm", ["--filter", "@dicehub/kappa-docs-astro", "build"], {
    cwd: root, env: { KAPPA_SOURCE: "" }, log: join(scratch, "legacy-docs-build.log"),
  });
  for (const [label, command, args] of [
    ["library", "pnpm", ["--filter", "@dicehub/kappa", "test"]],
    ["docs", "pnpm", ["--filter", "@dicehub/kappa-docs-astro", "test:markdown"]],
    ["deployment", "pnpm", ["test:deployment"]],
  ]) {
    try { await run(command, args, { cwd: root, log: join(scratch, `legacy-${label}.log`) }); }
    catch (error) { failures.push(error); }
  }
  try { await lifecycleSuite(root, scratch); }
  catch (error) { failures.push(error); }
  if (failures.length) throw new AggregateError(failures, "Retained Node tests failed.");
}
